import { modsSchema, storedMods, type Mod } from "@/lib/mods";
import "server-only";
import { and, asc, count, eq, inArray, isNotNull, max, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { db, schema } from "@/db";
import { newBuildId } from "@/lib/builds/ids";
import { emptyPlan } from "@/lib/builds/draft";
import { checkGuideDoc, docText, imageUrls, isEmptyDoc, lineDoc, type GuideDoc } from "@/lib/guide/doc";
import { isOurImage } from "@/lib/guide/images";
import type { BuildVisibility } from "@/lib/builds/validate";
import { newAccountHold } from "@/lib/moderation/limits";
import { actSchema, answersSchema, checkTheme, type ThemeInput, chapterTitleSchema, detailsSchema, neverSchema, firstIssue, stopKey, taleSchema, objectiveSchema, snapshotSchema, type ActInput, type ObjectiveInput, type SnapshotInput } from "./validate";
import { PLAYTHROUGH_LIMITS, type Theme, type Answer, type ChapterKind, type Never, type ObjectiveStatus, type RouteStop } from "./types";
import { storyOrder } from "./view";
import { unplanned } from "./unplanned";

/**
 * A playthrough's writes (WO-111), shared by the edit page's actions and the assistants' tools, so
 * both save the same way and refuse the same things. Each checks the owner and the input; a refusal
 * is a PlaythroughError with the reason in plain words, and nothing is saved.
 */

export class PlaythroughError extends Error {}

const fail = (message: string): never => {
  throw new PlaythroughError(message);
};

/** The playthrough, when it's this player's. */
export async function ownedPlaythrough(userId: string, id: string) {
  const [row] = await db()
    .select()
    .from(schema.playthroughs)
    .where(and(eq(schema.playthroughs.id, String(id ?? "").slice(0, 40)), eq(schema.playthroughs.ownerId, userId)))
    .limit(1);
  return row ?? fail(`No playthrough of yours has the id ${id}.`);
}

const touch = (id: string) => db().update(schema.playthroughs).set({ updatedAt: new Date() }).where(eq(schema.playthroughs.id, id));

async function ownBuild(userId: string, buildId: string | null | undefined) {
  if (!buildId) return null;
  const [b] = await db()
    .select({ id: schema.builds.id, gameVersion: schema.builds.gameVersion })
    .from(schema.builds)
    .where(and(eq(schema.builds.id, buildId), eq(schema.builds.ownerId, userId)))
    .limit(1);
  return b ?? fail(`No build of yours has the id ${buildId}.`);
}

/** Private playthroughs an assistant drafted for this player. */
export async function draftCount(userId: string): Promise<number> {
  const [r] = await db()
    .select({ n: count() })
    .from(schema.playthroughs)
    .where(and(eq(schema.playthroughs.ownerId, userId), eq(schema.playthroughs.visibility, "private"), isNotNull(schema.playthroughs.draftedBy)));
  return r.n;
}

export const DRAFT_CAP_MESSAGE = `You have ${PLAYTHROUGH_LIMITS.drafts} private drafted playthroughs, the most at once. Publish or delete one on the site first.`;

export async function createPlaythrough(userId: string, input: { name: string; line?: string; buildId?: string | null; gameVersion: string }, draftedBy: string | null = null): Promise<string> {
  const d = detailsSchema.safeParse({ name: input.name, line: input.line ?? "" });
  if (!d.success) fail(firstIssue(d.error!));
  const build = await ownBuild(userId, input.buildId);
  if (draftedBy && (await draftCount(userId)) >= PLAYTHROUGH_LIMITS.drafts) fail(DRAFT_CAP_MESSAGE);
  if (build) {
    const [other] = await db().select({ id: schema.playthroughs.id }).from(schema.playthroughs).where(eq(schema.playthroughs.buildId, build.id)).limit(1);
    if (other) fail("That build has a run already.");
  }
  const id = newBuildId();
  // Nothing alone (WO-179): a run with no build makes its character with it, in one transaction: a build with nothing planned yet, named as the run.
  const shellId = build ? null : newBuildId();
  const shell = shellId
    ? db()
        .insert(schema.builds)
        .values({ id: shellId, ownerId: userId, name: d.data!.name, description: d.data!.line, gameVersion: input.gameVersion, plan: emptyPlan(input.gameVersion), visibility: "private", draftedBy })
    : null;
  const insert = db()
    .insert(schema.playthroughs)
    .values({ id, ownerId: userId, buildId: build?.id ?? shellId, name: d.data!.name, line: d.data!.line, gameVersion: build?.gameVersion ?? input.gameVersion, visibility: "private", draftedBy });
  const moved = build ? await storyMoveStatements(build.id, id) : [];
  if (shell) await db().batch([shell, insert]);
  else if (moved.length) await db().batch([insert, ...moved]);
  else await insert;
  return id;
}

export async function setDetails(
  userId: string,
  id: string,
  input: { name?: string; line?: string; buildId?: string | null; visibility?: BuildVisibility; showDrafted?: boolean; taleTitle?: string; taleLine?: string; answers?: Answer[]; never?: Never[]; mods?: Mod[] },
) {
  let p = await ownedPlaythrough(userId, id);
  // A run on a character nothing was planned on (the one made with it) may be given to a character that has a plan: it is the same character (WO-179).
  if (input.buildId && p.buildId && input.buildId !== p.buildId) {
    const [old] = await db().select().from(schema.builds).where(eq(schema.builds.id, p.buildId)).limit(1);
    if (old && old.ownerId === userId && unplanned(old.plan)) {
      await joinCharacter(userId, id, input.buildId);
      p = await ownedPlaythrough(userId, id);
    }
  }
  const d = detailsSchema.safeParse({ name: input.name ?? p.name, line: input.line ?? p.line });
  if (!d.success) fail(firstIssue(d.error));
  const tale = taleSchema.safeParse({ taleTitle: input.taleTitle, taleLine: input.taleLine });
  if (!tale.success) fail(firstIssue(tale.error));
  // The Before you design answers and what she will never do (WO-139): the whole list each time, empty rows dropped.
  const answers = input.answers === undefined ? undefined : answersSchema.safeParse(input.answers.filter((a) => a.question.trim() || a.answer.trim()));
  if (answers && !answers.success) fail(firstIssue(answers.error));
  const never = input.never === undefined ? undefined : neverSchema.safeParse(input.never.filter((n) => n.what.trim()));
  if (never && !never.success) fail(firstIssue(never.error));
  const mods = input.mods === undefined ? undefined : modsSchema.safeParse(input.mods);
  if (mods && !mods.success) fail(firstIssue(mods.error));
  // A playthrough belongs to its character (WO-179): it can't be unlinked or moved to another. A run from before, on no build, may be given one.
  if (input.buildId !== undefined && p.buildId && input.buildId !== p.buildId) fail("A playthrough belongs to its character: it can't be unlinked or moved to another. Use Is this the same character as…? on My characters.");
  const build = input.buildId === undefined ? undefined : await ownBuild(userId, input.buildId);
  // A character has one visibility (WO-179 Part 2): the run's follows it, so a visibility given here is the character's.
  const [character] = p.buildId ? await db().select({ visibility: schema.builds.visibility }).from(schema.builds).where(eq(schema.builds.id, p.buildId)).limit(1) : [];
  if (input.visibility === "public" && (character?.visibility ?? p.visibility) !== "public") {
    const hold = await newAccountHold(userId);
    if (hold) fail(hold);
  }
  // One run per character (WO-114): a build that has another run can't take this one too.
  const attaching = build && build.id !== p.buildId ? build : null;
  if (attaching) {
    const [other] = await db()
      .select({ id: schema.playthroughs.id })
      .from(schema.playthroughs)
      .where(and(eq(schema.playthroughs.buildId, attaching.id), sql`${schema.playthroughs.id} <> ${p.id}`))
      .limit(1);
    if (other) fail("That build has a run already.");
  }
  const update = db()
    .update(schema.playthroughs)
    .set({
      name: d.data!.name,
      line: d.data!.line,
      ...(build === undefined ? {} : { buildId: build?.id ?? null, ...(build ? { gameVersion: build.gameVersion } : {}) }),
      ...(input.visibility ? { visibility: input.visibility } : {}),
      ...(input.showDrafted === undefined ? {} : { showDrafted: input.showDrafted }),
      ...(tale.data!.taleTitle === undefined ? {} : { taleTitle: tale.data!.taleTitle || null }),
      ...(tale.data!.taleLine === undefined ? {} : { taleLine: tale.data!.taleLine || null }),
      ...(answers ? { answers: answers.data!.length ? answers.data! : null } : {}),
      ...(mods ? { mods: storedMods(mods.data) } : {}),
      ...(never ? { never: never.data!.length ? never.data!.map((n) => ({ what: n.what, ...(n.words ? { words: n.words } : {}) })) : null } : {}),
    })
    .where(eq(schema.playthroughs.id, p.id));
  if (input.visibility && p.buildId) {
    await db()
      .update(schema.builds)
      .set({ visibility: input.visibility, ...(input.visibility === "public" ? {} : { featuredAt: null }) })
      .where(and(eq(schema.builds.id, p.buildId), eq(schema.builds.ownerId, userId)));
  }
  // Attaching moves the build's Story into the run, in the same transaction; detaching leaves the chapters.
  const moved = attaching ? await storyMoveStatements(attaching.id, p.id) : [];
  if (moved.length) await db().batch([update, ...moved]);
  else await update;
  // One name and one line (WO-179): the character's. A name or line given here (an assistant's set_playthrough) is the character's.
  if ((input.name !== undefined || input.line !== undefined) && (p.buildId || build)) {
    await db()
      .update(schema.builds)
      .set({ ...(input.name !== undefined ? { name: d.data!.name } : {}), ...(input.line !== undefined ? { description: d.data!.line } : {}) })
      .where(and(eq(schema.builds.id, (build?.id ?? p.buildId)!), eq(schema.builds.ownerId, userId)));
  }
}

/**
 * Who she is (WO-181): what is given replaces what was there (a list is the whole list; an empty line or list takes it away). She won't is
 * `never`, the list the quest tools keep to, so each line is written there as the player's own words. Refused with the reason, never cut.
 */
export async function setTheme(userId: string, id: string, input: ThemeInput) {
  const p = await ownedPlaythrough(userId, id);
  const r = checkTheme(input);
  if ("error" in r) return fail(r.error);
  const now = { ...(p.theme ?? {}) } as Record<string, unknown>;
  for (const [k, v] of Object.entries(r.theme)) {
    if (v === "" || (Array.isArray(v) && !v.length)) delete now[k];
    else now[k] = v;
  }
  await db()
    .update(schema.playthroughs)
    .set({
      theme: Object.keys(now).length ? (now as Theme) : null,
      ...(r.never ? { never: r.never.length ? r.never.map((what) => ({ what })) : null } : {}),
    })
    .where(eq(schema.playthroughs.id, p.id));
  await touch(p.id);
}

/**
 * The character's cover (WO-114) is the build's: the run's edit page sets it on the build it follows,
 * as Set up does, from an image uploaded through /api/covers. A run with no build has none.
 */
export async function setCover(userId: string, id: string, url: string | null) {
  const p = await ownedPlaythrough(userId, id);
  if (!p.buildId) fail("The cover is the build's. Link a build first.");
  if (url && !isOurImage(url)) fail("Images must be uploaded to the site.");
  await db()
    .update(schema.builds)
    .set({ coverImageUrl: url })
    .where(and(eq(schema.builds.id, p.buildId!), eq(schema.builds.ownerId, userId)));
  await touch(p.id);
}

export async function deletePlaythrough(userId: string, id: string) {
  const p = await ownedPlaythrough(userId, id);
  await db().delete(schema.playthroughs).where(eq(schema.playthroughs.id, p.id));
}

/* ---------- A character's run, made with its build (WO-114) ---------- */

/** The run step's input: name, line, Act I, and its first objectives. */
export interface RunInput {
  name: string;
  line?: string;
  act: ActInput;
  objectives?: ObjectiveInput[];
}

/** The run step checked whole, before anything is written: a refusal means nothing is made. */
export function prepareRun(input: RunInput) {
  const d = detailsSchema.safeParse({ name: input.name, line: input.line ?? "" });
  if (!d.success) fail(firstIssue(d.error));
  const act = actValues(input.act);
  const objectives = (input.objectives ?? []).map((o, i) => {
    const r = objectiveSchema.safeParse(o);
    if (!r.success) fail(`Objective ${i + 1}: ${firstIssue(r.error)}`);
    return r.data!;
  });
  if (objectives.length > PLAYTHROUGH_LIMITS.objectivesPerAct) fail(`An act can have ${PLAYTHROUGH_LIMITS.objectivesPerAct} objectives.`);
  return { name: d.data!.name, line: d.data!.line, act, objectives };
}
export type PreparedRun = ReturnType<typeof prepareRun>;

/**
 * The statements that write a prepared run on a build: the playthrough, Act I and its objectives, for
 * one batch (one transaction) with the build's own insert or the attach. The objectives find their act
 * by the new run's id, since a batch can't pass a returned id along.
 */
export function runStatements(userId: string, buildId: string, gameVersion: string, run: PreparedRun, draftedBy: string | null, id = newBuildId()): { id: string; statements: BatchItem<"pg">[] } {
  const actId = sql`(select ${schema.playthroughActs.id} from ${schema.playthroughActs} where ${schema.playthroughActs.playthroughId} = ${id} and ${schema.playthroughActs.position} = 1)`;
  return {
    id,
    statements: [
      db().insert(schema.playthroughs).values({ id, ownerId: userId, buildId, name: run.name, line: run.line, gameVersion, visibility: "private", draftedBy }),
      db().insert(schema.playthroughActs).values({ playthroughId: id, position: 1, ...run.act }),
      ...run.objectives.map((o, i) => db().insert(schema.playthroughObjectives).values({ actId, position: i + 1, ...o, suggestedBy: null, accepted: true })),
    ],
  };
}

const STORY_KEYS = ["story", "story:title", "story:line"];

/**
 * One tale per character (WO-114): when a run is attached to a build with a Story (WO-79), the Story
 * becomes the run's first chapter before the game, its images and captions with it, and the build's
 * Story rows go, in the same transaction as the attach. A build with no Story gives nothing.
 */
export async function storyMoveStatements(buildId: string, playthroughId: string): Promise<BatchItem<"pg">[]> {
  const rows = await db()
    .select({ key: schema.buildGuides.key, doc: schema.buildGuides.doc })
    .from(schema.buildGuides)
    .where(and(eq(schema.buildGuides.buildId, buildId), inArray(schema.buildGuides.key, STORY_KEYS)));
  const by = Object.fromEntries(rows.map((r) => [r.key, r.doc])) as Record<string, GuideDoc | undefined>;
  const story = by.story;
  if (!story || isEmptyDoc(story)) return [];
  const title = (docText(by["story:title"]) || "The Story").slice(0, PLAYTHROUGH_LIMITS.chapterTitle);
  const line = docText(by["story:line"]).slice(0, PLAYTHROUGH_LIMITS.line);
  const { doc, length } = chapterDoc(story);
  return [
    // Position 0: before every chapter the run already has.
    db().insert(schema.playthroughChapters).values({ playthroughId, kind: "chapter", position: 0, title, doc, textLength: length, actId: null }),
    // The Story's title and opening line become the Tale's (section 5), when the run has none yet.
    db()
      .update(schema.playthroughs)
      .set({ taleTitle: sql`coalesce(${schema.playthroughs.taleTitle}, ${title})`, taleLine: sql`coalesce(${schema.playthroughs.taleLine}, ${line || null})` })
      .where(eq(schema.playthroughs.id, playthroughId)),
    db().delete(schema.buildGuides).where(and(eq(schema.buildGuides.buildId, buildId), inArray(schema.buildGuides.key, STORY_KEYS))),
  ];
}

/** Add a run (WO-114): a run on one of the player's builds that has none, from the same step. */
export async function attachRun(userId: string, buildId: string, input: RunInput, draftedBy: string | null = null): Promise<string> {
  const [b] = await db()
    .select({ id: schema.builds.id, gameVersion: schema.builds.gameVersion })
    .from(schema.builds)
    .where(and(eq(schema.builds.id, buildId), eq(schema.builds.ownerId, userId)))
    .limit(1);
  if (!b) fail(`No build of yours has the id ${buildId}.`);
  const [has] = await db().select({ id: schema.playthroughs.id }).from(schema.playthroughs).where(eq(schema.playthroughs.buildId, b!.id)).limit(1);
  if (has) fail("This build has a run already.");
  if (draftedBy && (await draftCount(userId)) >= PLAYTHROUGH_LIMITS.drafts) fail(DRAFT_CAP_MESSAGE);
  const { id, statements } = runStatements(userId, b!.id, b!.gameVersion, prepareRun(input), draftedBy);
  const moved = await storyMoveStatements(b!.id, id);
  await db().batch([...statements, ...moved] as [BatchItem<"pg">, ...BatchItem<"pg">[]]);
  return id;
}

/* ---------- Acts ---------- */

async function actsOf(pid: string) {
  return db().select().from(schema.playthroughActs).where(eq(schema.playthroughActs.playthroughId, pid)).orderBy(asc(schema.playthroughActs.position));
}

async function ownedAct(userId: string, pid: string, actId: number) {
  const p = await ownedPlaythrough(userId, pid);
  const [a] = await db()
    .select()
    .from(schema.playthroughActs)
    .where(and(eq(schema.playthroughActs.id, Number(actId)), eq(schema.playthroughActs.playthroughId, p.id)))
    .limit(1);
  return { p, act: a ?? fail("The playthrough has no such act.") };
}

const actValues = (input: ActInput) => {
  const a = actSchema.safeParse(input);
  if (!a.success) fail(firstIssue(a.error));
  const v = a.data!;
  return { name: v.name, levelFrom: v.levels.from, levelTo: v.levels.to, place: v.place, goal: v.goal, standingRule: v.standingRule ? v.standingRule : null, passedBy: v.passedBy?.length ? v.passedBy : null, route: v.route?.length ? v.route : null };
};

/**
 * The route's stops (WO-129) an objective's stop matches, by its place, case and spacing aside: the stop's own place,
 * or a refusal naming the act's stops. Null for no stop ("On the road").
 */
export function stopOn(route: readonly RouteStop[] | null | undefined, stop: string | null | undefined): string | null {
  if (!stop?.trim()) return null;
  const hit = (route ?? []).find((s) => stopKey(s.place) === stopKey(stop));
  if (hit) return hit.place;
  return fail(route?.length ? `${stop} isn't a stop on the act's route. Its stops are: ${route.map((s) => s.place).join(", ")}. Add it to the route first (set_act), or leave stop out.` : `The act has no route yet, so ${stop} can't be its stop. Set the act's route first (set_act).`);
}

/**
 * Where each objective's stop goes when the route changes: a stop still on the route stays (in the route's spelling);
 * a stop renamed in place (same position, same number of stops) follows it; one taken off the route goes "On the road".
 */
function restop(before: readonly RouteStop[] | null, after: readonly RouteStop[] | null, stop: string | null): string | null {
  if (!stop) return null;
  const now = (after ?? []).find((s) => stopKey(s.place) === stopKey(stop));
  if (now) return now.place;
  const at = (before ?? []).findIndex((s) => stopKey(s.place) === stopKey(stop));
  if (at >= 0 && before!.length === (after ?? []).length) return after![at].place;
  return null;
}

export async function addAct(userId: string, pid: string, input: ActInput): Promise<number> {
  const p = await ownedPlaythrough(userId, pid);
  const values = actValues(input);
  const acts = await actsOf(p.id);
  if (acts.length >= PLAYTHROUGH_LIMITS.acts) fail(`A playthrough can have ${PLAYTHROUGH_LIMITS.acts} acts.`);
  const [row] = await db()
    .insert(schema.playthroughActs)
    .values({ playthroughId: p.id, position: (acts.at(-1)?.position ?? 0) + 1, ...values })
    .returning({ id: schema.playthroughActs.id });
  await touch(p.id);
  return row.id;
}

export async function setAct(userId: string, pid: string, actId: number, input: Partial<ActInput>) {
  const { p, act } = await ownedAct(userId, pid, actId);
  const values = actValues({
    name: input.name ?? act.name,
    levels: input.levels ?? (act.levelTo === null ? `${act.levelFrom} and up` : `${act.levelFrom} to ${act.levelTo}`),
    place: input.place ?? act.place,
    goal: input.goal ?? act.goal,
    standingRule: input.standingRule === undefined ? act.standingRule : input.standingRule,
    passedBy: input.passedBy === undefined ? act.passedBy : input.passedBy,
    route: input.route === undefined ? act.route : input.route,
  });
  await db().update(schema.playthroughActs).set(values).where(eq(schema.playthroughActs.id, act.id));
  // The objectives follow their stops (WO-129).
  if (input.route !== undefined)
    for (const o of await objectivesOf(act.id)) {
      const next = restop(act.route, values.route, o.stop);
      if (next !== o.stop) await db().update(schema.playthroughObjectives).set({ stop: next }).where(eq(schema.playthroughObjectives.id, o.id));
    }
  await touch(p.id);
}

/** The act's picture (WO-116): an image uploaded through the run's guide images path, or none. */
export async function setActImage(userId: string, pid: string, actId: number, url: string | null) {
  const { p, act } = await ownedAct(userId, pid, actId);
  if (url && !isOurImage(url)) fail("Images must be uploaded to the site.");
  // A new image starts centred.
  await db().update(schema.playthroughActs).set({ imageUrl: url, imageFocus: null }).where(eq(schema.playthroughActs.id, act.id));
  await touch(p.id);
}

export async function removeAct(userId: string, pid: string, actId: number) {
  const { p, act } = await ownedAct(userId, pid, actId);
  const acts = await actsOf(p.id);
  if (acts.length < 2) fail("A playthrough keeps at least one act.");
  // Its entries and beats go with it; the chapters before the game stay.
  await db()
    .delete(schema.playthroughChapters)
    .where(and(eq(schema.playthroughChapters.playthroughId, p.id), eq(schema.playthroughChapters.actId, act.id)));
  await db().delete(schema.playthroughActs).where(eq(schema.playthroughActs.id, act.id));
  await touch(p.id);
}

/** Moves an act one place up or down, or to a position (1 is the first). */
export async function moveAct(userId: string, pid: string, actId: number, to: "up" | "down" | number) {
  const { p, act } = await ownedAct(userId, pid, actId);
  const acts = await actsOf(p.id);
  await reorder(acts, act.id, to, (id, position) => db().update(schema.playthroughActs).set({ position }).where(eq(schema.playthroughActs.id, id)));
  await touch(p.id);
}

async function reorder(rows: { id: number }[], id: number, to: "up" | "down" | number, write: (id: number, position: number) => Promise<unknown>) {
  const ids = rows.map((r) => r.id);
  const from = ids.indexOf(id);
  const target = to === "up" ? from - 1 : to === "down" ? from + 1 : Math.round(to) - 1;
  const at = Math.max(0, Math.min(ids.length - 1, target));
  if (at === from) return;
  ids.splice(from, 1);
  ids.splice(at, 0, id);
  await Promise.all(ids.map((rid, i) => write(rid, i + 1)));
}

/* ---------- Objectives ---------- */

async function objectivesOf(actId: number) {
  return db().select().from(schema.playthroughObjectives).where(eq(schema.playthroughObjectives.actId, actId)).orderBy(asc(schema.playthroughObjectives.position));
}

async function ownedObjective(userId: string, pid: string, objectiveId: number) {
  const p = await ownedPlaythrough(userId, pid);
  const [row] = await db()
    .select({ o: schema.playthroughObjectives, route: schema.playthroughActs.route })
    .from(schema.playthroughObjectives)
    .innerJoin(schema.playthroughActs, eq(schema.playthroughActs.id, schema.playthroughObjectives.actId))
    .where(and(eq(schema.playthroughObjectives.id, Number(objectiveId)), eq(schema.playthroughActs.playthroughId, p.id)))
    .limit(1);
  // Its act's route comes with it (WO-129), for checking a stop without another query.
  return { p, o: row?.o ?? fail("The playthrough has no such objective."), route: row.route };
}

const objectiveValues = (input: ObjectiveInput) => {
  const o = objectiveSchema.safeParse(input);
  if (!o.success) fail(firstIssue(o.error));
  return o.data!;
};

/** A new objective at the end of the act, or right after `after`; a suggestion waits for the player. */
export async function addObjective(userId: string, pid: string, actId: number, input: ObjectiveInput, opts: { after?: number | null; suggestedBy?: string | null } = {}): Promise<number> {
  const { p, act } = await ownedAct(userId, pid, actId);
  const values = objectiveValues(input);
  values.stop = stopOn(act.route, values.stop);
  const rows = await objectivesOf(act.id);
  if (rows.length >= PLAYTHROUGH_LIMITS.objectivesPerAct) fail(`An act can have ${PLAYTHROUGH_LIMITS.objectivesPerAct} objectives.`);
  const [row] = await db()
    .insert(schema.playthroughObjectives)
    .values({ actId: act.id, position: (rows.at(-1)?.position ?? 0) + 1, ...values, suggestedBy: opts.suggestedBy ?? null, accepted: !opts.suggestedBy })
    .returning({ id: schema.playthroughObjectives.id });
  if (opts.after) {
    const at = rows.findIndex((r) => r.id === Number(opts.after));
    if (at < 0) fail("The objective to put it after isn't in that act.");
    await reorder([...rows, { id: row.id }], row.id, at + 2, (id, position) => db().update(schema.playthroughObjectives).set({ position }).where(eq(schema.playthroughObjectives.id, id)));
  }
  await touch(p.id);
  return row.id;
}

export async function setObjective(userId: string, pid: string, objectiveId: number, input: Partial<ObjectiveInput>) {
  const { p, o, route } = await ownedObjective(userId, pid, objectiveId);
  const values = objectiveValues({
    text: input.text ?? o.text,
    kind: input.kind ?? o.kind,
    link: input.link === undefined ? o.link : input.link,
    doneBy: input.doneBy === undefined ? o.doneBy : input.doneBy,
    detect: input.detect === undefined ? o.detect : input.detect,
    reach: input.reach === undefined ? o.reach : input.reach,
    why: input.why === undefined ? o.why : input.why,
    stop: input.stop === undefined ? o.stop : input.stop,
  });
  if (input.stop !== undefined) values.stop = stopOn(route, values.stop);
  await db().update(schema.playthroughObjectives).set(values).where(eq(schema.playthroughObjectives.id, o.id));
  await touch(p.id);
}

export async function removeObjective(userId: string, pid: string, objectiveId: number) {
  const { p, o } = await ownedObjective(userId, pid, objectiveId);
  await db().delete(schema.playthroughObjectives).where(eq(schema.playthroughObjectives.id, o.id));
  await touch(p.id);
}

/** Up, down, a position in its act, or into another act (at its end). */
export async function moveObjective(userId: string, pid: string, objectiveId: number, to: "up" | "down" | number, actId?: number) {
  const { p, o } = await ownedObjective(userId, pid, objectiveId);
  if (actId && Number(actId) !== o.actId) {
    const { act } = await ownedAct(userId, p.id, actId);
    const rows = await objectivesOf(act.id);
    // Its stop comes along when the act it goes to has the same stop (WO-129); else it's on the road.
    const stop = o.stop ? ((act.route ?? []).find((s) => stopKey(s.place) === stopKey(o.stop!))?.place ?? null) : null;
    await db()
      .update(schema.playthroughObjectives)
      .set({ actId: act.id, position: (rows.at(-1)?.position ?? 0) + 1, stop })
      .where(eq(schema.playthroughObjectives.id, o.id));
  } else {
    const rows = await objectivesOf(o.actId);
    await reorder(rows, o.id, to, (id, position) => db().update(schema.playthroughObjectives).set({ position }).where(eq(schema.playthroughObjectives.id, id)));
  }
  await touch(p.id);
}

/**
 * The player's tick, and Under way and Later, on any objective (WO-123): one the save also reads keeps the tick when a
 * later save doesn't show it done, and is done from the save once one does.
 */
export async function setStatus(userId: string, pid: string, objectiveId: number, status: ObjectiveStatus) {
  const { p, o } = await ownedObjective(userId, pid, objectiveId);
  if (!["todo", "doing", "done", "later"].includes(status)) fail("A status is todo, doing, done or later.");
  if (!o.accepted) fail("Accept the suggestion first.");
  await db()
    .update(schema.playthroughObjectives)
    .set({ status, doneAt: status === "done" ? new Date() : null })
    .where(eq(schema.playthroughObjectives.id, o.id));
  await touch(p.id);
}

/** The player's answer to a suggestion: Accept makes it count; Skip removes it. */
export async function answerSuggestion(userId: string, pid: string, objectiveId: number, accept: boolean) {
  const { p, o } = await ownedObjective(userId, pid, objectiveId);
  if (o.accepted) return;
  if (accept) await db().update(schema.playthroughObjectives).set({ accepted: true }).where(eq(schema.playthroughObjectives.id, o.id));
  else await db().delete(schema.playthroughObjectives).where(eq(schema.playthroughObjectives.id, o.id));
  await touch(p.id);
}

/* ---------- The tale: chapters, entries, beats ---------- */

async function ownedChapter(userId: string, pid: string, chapterId: number) {
  const p = await ownedPlaythrough(userId, pid);
  const [c] = await db()
    .select()
    .from(schema.playthroughChapters)
    .where(and(eq(schema.playthroughChapters.id, Number(chapterId)), eq(schema.playthroughChapters.playthroughId, p.id)))
    .limit(1);
  return { p, c: c ?? fail("The playthrough has no such chapter.") };
}

/** A chapter's document: the Story's rules (WO-79), and images only from the site's own store. */
export function chapterDoc(input: unknown): { doc: GuideDoc; length: number } {
  const r = checkGuideDoc("story", input);
  if (!r.ok) return fail(r.error);
  if ([...imageUrls(r.doc)].some((u) => !isOurImage(u))) fail("Images must be uploaded to the site.");
  return { doc: r.doc, length: r.length };
}

/** An objective of this playthrough, for a beat to open after; it fixes the beat's act too. */
async function objectiveAct(pid: string, objectiveId: number): Promise<number> {
  const [row] = await db()
    .select({ actId: schema.playthroughObjectives.actId })
    .from(schema.playthroughObjectives)
    .innerJoin(schema.playthroughActs, eq(schema.playthroughActs.id, schema.playthroughObjectives.actId))
    .where(and(eq(schema.playthroughObjectives.id, Number(objectiveId)), eq(schema.playthroughActs.playthroughId, pid)))
    .limit(1);
  return row?.actId ?? fail("The playthrough has no such objective.");
}

/**
 * A chapter (WO-118): one kind of story text to the player. It sits in the Prologue (no act) or in an
 * act, and can unlock when one of the act's objectives is done. `kind` is kept and set from that, so
 * old rows read as before: the Prologue's are `chapter`; an act's first chapter written before play is
 * `act`; one that unlocks is `beat`; one written after play from a save, or a later one, is `entry`.
 */
export interface ChapterInput {
  title: string;
  doc?: unknown;
  actId?: number | null;
  /** The objective it unlocks after; it fixes the chapter's act too. */
  unlocksWhen?: number | null;
  fromSave?: string | null;
}

export async function addChapter(userId: string, pid: string, input: ChapterInput, writtenBy: string | null = null): Promise<number> {
  const p = await ownedPlaythrough(userId, pid);
  const title = chapterTitleSchema.safeParse(input.title);
  if (!title.success) fail(firstIssue(title.error));
  const { doc, length } = chapterDoc(input.doc ?? lineDoc(""));
  let actId: number | null = null;
  let opensAfter: number | null = null;
  if (input.unlocksWhen) {
    opensAfter = Number(input.unlocksWhen);
    actId = await objectiveAct(p.id, opensAfter);
    if (input.actId && Number(input.actId) !== actId) fail("A chapter unlocks from one of its own act's objectives.");
  } else if (input.actId) actId = (await ownedAct(userId, p.id, input.actId)).act.id;
  const fromSave = actId !== null && input.fromSave ? String(input.fromSave).slice(0, PLAYTHROUGH_LIMITS.label) : null;
  const [{ n, top }] = await db()
    .select({ n: count(), top: max(schema.playthroughChapters.position) })
    .from(schema.playthroughChapters)
    .where(eq(schema.playthroughChapters.playthroughId, p.id));
  if (n >= PLAYTHROUGH_LIMITS.chapters) fail(`A playthrough can have ${PLAYTHROUGH_LIMITS.chapters} chapters.`);
  let kind: ChapterKind = "chapter";
  if (actId !== null) {
    if (opensAfter) kind = "beat";
    else if (fromSave) kind = "entry";
    else {
      const [had] = await db().select({ id: schema.playthroughChapters.id }).from(schema.playthroughChapters).where(eq(schema.playthroughChapters.actId, actId)).limit(1);
      kind = had ? "entry" : "act";
    }
  }
  const [row] = await db()
    .insert(schema.playthroughChapters)
    .values({ playthroughId: p.id, kind, title: title.data!, doc, textLength: length, actId, opensAfter, fromSave, writtenBy, position: (top ?? 0) + 1 })
    .returning({ id: schema.playthroughChapters.id });
  await touch(p.id);
  return row.id;
}

export async function setChapter(userId: string, pid: string, chapterId: number, input: { title?: string; doc?: unknown; unlocksWhen?: number | null; fromSave?: string | null }, writtenBy?: string | null) {
  const { p, c } = await ownedChapter(userId, pid, chapterId);
  const set: Partial<typeof schema.playthroughChapters.$inferInsert> = {};
  if (input.title !== undefined) {
    const t = chapterTitleSchema.safeParse(input.title);
    if (!t.success) fail(firstIssue(t.error));
    set.title = t.data;
  }
  if (input.doc !== undefined) {
    const { doc, length } = chapterDoc(input.doc);
    set.doc = doc;
    set.textLength = length;
  }
  // Any chapter in an act can unlock when one of its objectives is done (WO-118); its kind follows.
  if (input.unlocksWhen !== undefined) {
    const after = input.unlocksWhen ? Number(input.unlocksWhen) : null;
    if (after) {
      const actId = await objectiveAct(p.id, after);
      if (c.actId !== null && c.actId !== actId) fail("A chapter unlocks from one of its own act's objectives.");
      set.opensAfter = after;
      set.actId = actId;
      set.kind = "beat";
    } else {
      set.opensAfter = null;
      if (c.kind === "beat") set.kind = "entry";
    }
  }
  if (input.fromSave !== undefined && c.kind === "entry") set.fromSave = input.fromSave ? input.fromSave.slice(0, PLAYTHROUGH_LIMITS.label) : null;
  if (writtenBy !== undefined) set.writtenBy = writtenBy;
  if (Object.keys(set).length) await db().update(schema.playthroughChapters).set(set).where(eq(schema.playthroughChapters.id, c.id));
  await touch(p.id);
}

/** A chapter's plate (WO-117): an image uploaded through the run's guide images path, or none. */
export async function setChapterImage(userId: string, pid: string, chapterId: number, url: string | null) {
  const { p, c } = await ownedChapter(userId, pid, chapterId);
  if (url && !isOurImage(url)) fail("Images must be uploaded to the site.");
  // A new image starts centred.
  await db().update(schema.playthroughChapters).set({ imageUrl: url, imageFocus: null }).where(eq(schema.playthroughChapters.id, c.id));
  await touch(p.id);
}

/** What stays in view of an image (WO-118): percents across and down, kept whole and in range. */
function focusOf(f: { x: number; y: number } | null): { x: number; y: number } | null {
  if (!f) return null;
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(Math.min(100, Math.max(0, v))) : fail("A position is two numbers from 0 to 100."));
  return { x: n(f.x), y: n(f.y) };
}

/** A chapter's plate, positioned (WO-118). */
export async function setChapterFocus(userId: string, pid: string, chapterId: number, focus: { x: number; y: number } | null) {
  const { p, c } = await ownedChapter(userId, pid, chapterId);
  await db().update(schema.playthroughChapters).set({ imageFocus: focusOf(focus) }).where(eq(schema.playthroughChapters.id, c.id));
  await touch(p.id);
}

/** An act's image, positioned (WO-118). */
export async function setActFocus(userId: string, pid: string, actId: number, focus: { x: number; y: number } | null) {
  const { p, act } = await ownedAct(userId, pid, actId);
  await db().update(schema.playthroughActs).set({ imageFocus: focusOf(focus) }).where(eq(schema.playthroughActs.id, act.id));
  await touch(p.id);
}

/** The title page's picture (WO-117), on the run itself. */
export async function setTalePicture(userId: string, pid: string, url: string | null) {
  const p = await ownedPlaythrough(userId, pid);
  if (url && !isOurImage(url)) fail("Images must be uploaded to the site.");
  await db().update(schema.playthroughs).set({ coverImageUrl: url }).where(eq(schema.playthroughs.id, p.id));
  await touch(p.id);
}

/**
 * An act's first chapter, written in the Story (WO-117): made on its first word, not when its place is
 * opened, then changed like any chapter. Returns its id.
 */
export async function writeActChapter(userId: string, pid: string, actId: number, input: { title?: string; doc?: unknown }, writtenBy: string | null = null): Promise<number> {
  const p = await ownedPlaythrough(userId, pid);
  const { act } = await ownedAct(userId, p.id, actId);
  const [had] = await db()
    .select({ id: schema.playthroughChapters.id })
    .from(schema.playthroughChapters)
    .where(eq(schema.playthroughChapters.actId, act.id))
    .orderBy(asc(schema.playthroughChapters.position))
    .limit(1);
  if (had) {
    await setChapter(userId, p.id, had.id, input, writtenBy);
    return had.id;
  }
  return addChapter(userId, p.id, { actId: act.id, title: input.title?.trim() || act.name.slice(0, PLAYTHROUGH_LIMITS.chapterTitle), doc: input.doc }, writtenBy);
}

export async function removeChapter(userId: string, pid: string, chapterId: number) {
  const { p, c } = await ownedChapter(userId, pid, chapterId);
  await db().delete(schema.playthroughChapters).where(eq(schema.playthroughChapters.id, c.id));
  await touch(p.id);
}

export async function moveChapter(userId: string, pid: string, chapterId: number, to: "up" | "down" | number) {
  const { p, c } = await ownedChapter(userId, pid, chapterId);
  // Among its neighbours as they read: the Prologue's chapters, or the act's (WO-118).
  const acts = await db().select({ id: schema.playthroughActs.id, position: schema.playthroughActs.position }).from(schema.playthroughActs).where(eq(schema.playthroughActs.playthroughId, p.id));
  const rows = await db()
    .select({ id: schema.playthroughChapters.id, actId: schema.playthroughChapters.actId, kind: schema.playthroughChapters.kind, position: schema.playthroughChapters.position })
    .from(schema.playthroughChapters)
    .where(eq(schema.playthroughChapters.playthroughId, p.id));
  rows.sort(storyOrder(acts));
  const all = rows.map((r) => r.id);
  const peers = rows.filter((r) => r.actId === c.actId).map((r) => r.id);
  const i = peers.indexOf(c.id);
  // Up, down, or to a place among its neighbours, 1-based (a drag in the Story's Contents, WO-117).
  const j = Math.max(0, Math.min(peers.length - 1, to === "up" ? i - 1 : to === "down" ? i + 1 : Math.round(to) - 1));
  if (j === i) return;
  // The neighbours' places in the whole list stay theirs; only the order among them changes.
  const slots = peers.map((id) => all.indexOf(id));
  const order = [...peers];
  order.splice(i, 1);
  order.splice(j, 0, c.id);
  slots.forEach((slot, k) => (all[slot] = order[k]));
  // An act's kind-act chapter leads it; moved from the top, it reads as any later chapter.
  const demote = rows.filter((r) => r.kind === "act" && r.actId === c.actId && order[0] !== r.id).map((r) => r.id);
  await Promise.all([
    ...all.map((id, k) => db().update(schema.playthroughChapters).set({ position: k + 1 }).where(eq(schema.playthroughChapters.id, id))),
    ...(demote.length ? [db().update(schema.playthroughChapters).set({ kind: "entry" }).where(inArray(schema.playthroughChapters.id, demote))] : []),
  ]);
  await touch(p.id);
}

/** A reader opened a beat early ("Read it anyway"); nothing is ticked. Only the owner's reads are kept. */
export async function markRead(userId: string, pid: string, chapterIds: number[]) {
  const p = await ownedPlaythrough(userId, pid);
  if (!chapterIds.length) return p.buildId;
  await db()
    .update(schema.playthroughChapters)
    .set({ readAt: new Date() })
    .where(and(eq(schema.playthroughChapters.playthroughId, p.id), inArray(schema.playthroughChapters.id, chapterIds.map(Number))));
  return p.buildId;
}

/* ---------- Where you stand ---------- */

/** Replaces the snapshot, keeping the last one's label, level and skills for "since save 5". */
export async function setSnapshot(userId: string, pid: string, input: SnapshotInput) {
  const p = await ownedPlaythrough(userId, pid);
  const s = snapshotSchema.safeParse(input);
  if (!s.success) fail(firstIssue(s.error));
  const v = s.data!;
  const [prev] = await db().select().from(schema.playthroughSnapshots).where(eq(schema.playthroughSnapshots.playthroughId, p.id)).limit(1);
  const row = {
    source: v.source,
    label: v.label,
    level: v.level,
    xp: v.xp ?? null,
    day: v.day ?? null,
    place: v.place ? v.place : null,
    // A save the reader can't take skills from (WO-112) keeps the last ones rather than clearing them.
    skills: v.source === "save" && !Object.keys(v.skills).length ? (prev?.skills ?? {}) : v.skills,
    // By hand, the save's quest stages and counts stay as the save last gave them, unless given.
    questStages: v.questStages ?? (v.source === "hand" ? (prev?.questStages ?? null) : null),
    counts: v.counts ?? (v.source === "hand" ? (prev?.counts ?? null) : null),
    readBy: v.readBy ?? null,
    at: new Date(),
    prevLabel: prev?.label ?? null,
    prevLevel: prev?.level ?? null,
    prevSkills: prev?.skills ?? null,
  };
  await db()
    .insert(schema.playthroughSnapshots)
    .values({ playthroughId: p.id, ...row })
    .onConflictDoUpdate({ target: schema.playthroughSnapshots.playthroughId, set: row });
  await touch(p.id);
}

/**
 * A run from before WO-179 on no build becomes a character of its own (WO-179, "nothing alone"): a build with nothing planned yet, named as the
 * run, with its line, cover and visibility, and the run attached. Idempotent: a run that has a build is left as it is. Where the run's name or
 * cover differs from a build it already followed, the build's win and nothing is copied (the caller logs the difference).
 */
export async function makeCharacterOfRun(userId: string, runId: string): Promise<string> {
  const p = await ownedPlaythrough(userId, runId);
  if (p.buildId) return p.buildId;
  const shellId = newBuildId();
  const shell = db()
    .insert(schema.builds)
    .values({ id: shellId, ownerId: userId, name: p.name, description: p.line, gameVersion: p.gameVersion, plan: emptyPlan(p.gameVersion), coverImageUrl: p.coverImageUrl, visibility: p.visibility, draftedBy: p.draftedBy, showDrafted: p.showDrafted });
  const attach = db().update(schema.playthroughs).set({ buildId: shellId }).where(eq(schema.playthroughs.id, p.id));
  await db().batch([shell, attach]);
  return shellId;
}

/**
 * The character a run on a made-up character really belongs to (WO-179: "Is this the same character as …?"): the run moves to the build named,
 * which must be the player's and have no run; the made-up character, if nothing was planned on it, is removed. Both are the player's own.
 */
/** A character nothing was planned on: no race and no perks (the shell a run makes of itself). */

export async function joinCharacter(userId: string, runId: string, targetBuildId: string) {
  const p = await ownedPlaythrough(userId, runId);
  const target = await ownBuild(userId, targetBuildId);
  if (!target) fail("Pick one of your characters.");
  if (p.buildId === target!.id) fail("That is this character already.");
  const [other] = await db().select({ id: schema.playthroughs.id }).from(schema.playthroughs).where(eq(schema.playthroughs.buildId, target!.id)).limit(1);
  if (other) fail("That character has a playthrough already.");
  const [old] = p.buildId ? await db().select().from(schema.builds).where(eq(schema.builds.id, p.buildId)).limit(1) : [];
  const update = db().update(schema.playthroughs).set({ buildId: target!.id, gameVersion: target!.gameVersion }).where(eq(schema.playthroughs.id, p.id));
  const moved = await storyMoveStatements(target!.id, p.id);
  await db().batch([update, ...moved]);
  // The made-up character goes when nothing was planned on it.
  if (old && unplanned(old.plan) && old.ownerId === userId) await db().delete(schema.builds).where(eq(schema.builds.id, old.id));
}
