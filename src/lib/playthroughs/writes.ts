import "server-only";
import { and, asc, count, eq, inArray, isNotNull, max } from "drizzle-orm";
import { db, schema } from "@/db";
import { newBuildId } from "@/lib/builds/ids";
import { checkGuideDoc, imageUrls, lineDoc, type GuideDoc } from "@/lib/guide/doc";
import { isOurImage } from "@/lib/guide/images";
import type { BuildVisibility } from "@/lib/builds/validate";
import { newAccountHold } from "@/lib/moderation/limits";
import { actSchema, chapterTitleSchema, detailsSchema, firstIssue, objectiveSchema, snapshotSchema, type ActInput, type ObjectiveInput, type SnapshotInput } from "./validate";
import { PLAYTHROUGH_LIMITS, type ChapterKind, type ObjectiveStatus } from "./types";

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
  const id = newBuildId();
  await db()
    .insert(schema.playthroughs)
    .values({ id, ownerId: userId, buildId: build?.id ?? null, name: d.data!.name, line: d.data!.line, gameVersion: build?.gameVersion ?? input.gameVersion, visibility: "private", draftedBy });
  return id;
}

export async function setDetails(
  userId: string,
  id: string,
  input: { name?: string; line?: string; buildId?: string | null; visibility?: BuildVisibility; showDrafted?: boolean; coverImageUrl?: string | null },
) {
  const p = await ownedPlaythrough(userId, id);
  const d = detailsSchema.safeParse({ name: input.name ?? p.name, line: input.line ?? p.line });
  if (!d.success) fail(firstIssue(d.error));
  const build = input.buildId === undefined ? undefined : await ownBuild(userId, input.buildId);
  if (input.visibility === "public" && p.visibility !== "public") {
    const hold = await newAccountHold(userId);
    if (hold) fail(hold);
  }
  if (input.coverImageUrl && !isOurImage(input.coverImageUrl)) fail("Images must be uploaded to the site.");
  await db()
    .update(schema.playthroughs)
    .set({
      name: d.data!.name,
      line: d.data!.line,
      ...(build === undefined ? {} : { buildId: build?.id ?? null, ...(build ? { gameVersion: build.gameVersion } : {}) }),
      ...(input.visibility ? { visibility: input.visibility } : {}),
      ...(input.showDrafted === undefined ? {} : { showDrafted: input.showDrafted }),
      ...(input.coverImageUrl === undefined ? {} : { coverImageUrl: input.coverImageUrl }),
    })
    .where(eq(schema.playthroughs.id, p.id));
}

export async function deletePlaythrough(userId: string, id: string) {
  const p = await ownedPlaythrough(userId, id);
  await db().delete(schema.playthroughs).where(eq(schema.playthroughs.id, p.id));
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
  return { name: v.name, levelFrom: v.levels.from, levelTo: v.levels.to, place: v.place, goal: v.goal, standingRule: v.standingRule ? v.standingRule : null };
};

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
  });
  await db().update(schema.playthroughActs).set(values).where(eq(schema.playthroughActs.id, act.id));
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
    .select({ o: schema.playthroughObjectives })
    .from(schema.playthroughObjectives)
    .innerJoin(schema.playthroughActs, eq(schema.playthroughActs.id, schema.playthroughObjectives.actId))
    .where(and(eq(schema.playthroughObjectives.id, Number(objectiveId)), eq(schema.playthroughActs.playthroughId, p.id)))
    .limit(1);
  return { p, o: row?.o ?? fail("The playthrough has no such objective.") };
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
  const { p, o } = await ownedObjective(userId, pid, objectiveId);
  const values = objectiveValues({
    text: input.text ?? o.text,
    kind: input.kind ?? o.kind,
    link: input.link === undefined ? o.link : input.link,
    doneBy: input.doneBy === undefined ? o.doneBy : input.doneBy,
    detect: input.detect === undefined ? o.detect : input.detect,
    reach: input.reach === undefined ? o.reach : input.reach,
    why: input.why === undefined ? o.why : input.why,
  });
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
    await db()
      .update(schema.playthroughObjectives)
      .set({ actId: act.id, position: (rows.at(-1)?.position ?? 0) + 1 })
      .where(eq(schema.playthroughObjectives.id, o.id));
  } else {
    const rows = await objectivesOf(o.actId);
    await reorder(rows, o.id, to, (id, position) => db().update(schema.playthroughObjectives).set({ position }).where(eq(schema.playthroughObjectives.id, id)));
  }
  await touch(p.id);
}

export const SAVE_DECIDES = "The save decides this one: it's done when your save shows it.";

/** The player's tick (and Under way, Later): `hand` objectives only; the save decides the rest. */
export async function setStatus(userId: string, pid: string, objectiveId: number, status: ObjectiveStatus) {
  const { p, o } = await ownedObjective(userId, pid, objectiveId);
  if (!["todo", "doing", "done", "later"].includes(status)) fail("A status is todo, doing, done or later.");
  if (status === "done" && (o.doneBy === "save" || o.kind === "reach")) fail(SAVE_DECIDES);
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

export interface ChapterInput {
  kind: ChapterKind;
  title: string;
  doc?: unknown;
  actId?: number | null;
  opensAfter?: number | null;
  fromSave?: string | null;
}

export async function addChapter(userId: string, pid: string, input: ChapterInput, writtenBy: string | null = null): Promise<number> {
  const p = await ownedPlaythrough(userId, pid);
  const title = chapterTitleSchema.safeParse(input.title);
  if (!title.success) fail(firstIssue(title.error));
  if (!["chapter", "entry", "beat"].includes(input.kind)) fail("A piece of the tale is a chapter, an entry or a beat.");
  const { doc, length } = chapterDoc(input.doc ?? lineDoc(""));
  let actId: number | null = null;
  let opensAfter: number | null = null;
  if (input.kind === "chapter") actId = null;
  else if (input.opensAfter) {
    opensAfter = Number(input.opensAfter);
    actId = await objectiveAct(p.id, opensAfter);
  } else if (input.actId) actId = (await ownedAct(userId, p.id, input.actId)).act.id;
  else fail(input.kind === "beat" ? "A beat opens after an objective: say which." : "Say which act the entry belongs to.");
  const [{ n, top }] = await db()
    .select({ n: count(), top: max(schema.playthroughChapters.position) })
    .from(schema.playthroughChapters)
    .where(eq(schema.playthroughChapters.playthroughId, p.id));
  if (n >= PLAYTHROUGH_LIMITS.chapters) fail(`A playthrough can have ${PLAYTHROUGH_LIMITS.chapters} chapters, entries and beats.`);
  const fromSave = input.kind === "entry" && input.fromSave ? String(input.fromSave).slice(0, PLAYTHROUGH_LIMITS.label) : null;
  const [row] = await db()
    .insert(schema.playthroughChapters)
    .values({ playthroughId: p.id, kind: input.kind, title: title.data!, doc, textLength: length, actId, opensAfter, fromSave, writtenBy, position: (top ?? 0) + 1 })
    .returning({ id: schema.playthroughChapters.id });
  await touch(p.id);
  return row.id;
}

export async function setChapter(userId: string, pid: string, chapterId: number, input: { title?: string; doc?: unknown; opensAfter?: number | null; fromSave?: string | null }, writtenBy?: string | null) {
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
  if (input.opensAfter !== undefined && c.kind === "beat") {
    set.opensAfter = input.opensAfter ? Number(input.opensAfter) : null;
    if (set.opensAfter) set.actId = await objectiveAct(p.id, set.opensAfter);
  }
  if (input.fromSave !== undefined && c.kind === "entry") set.fromSave = input.fromSave ? input.fromSave.slice(0, PLAYTHROUGH_LIMITS.label) : null;
  if (writtenBy !== undefined) set.writtenBy = writtenBy;
  if (Object.keys(set).length) await db().update(schema.playthroughChapters).set(set).where(eq(schema.playthroughChapters.id, c.id));
  await touch(p.id);
}

export async function removeChapter(userId: string, pid: string, chapterId: number) {
  const { p, c } = await ownedChapter(userId, pid, chapterId);
  await db().delete(schema.playthroughChapters).where(eq(schema.playthroughChapters.id, c.id));
  await touch(p.id);
}

export async function moveChapter(userId: string, pid: string, chapterId: number, to: "up" | "down") {
  const { p, c } = await ownedChapter(userId, pid, chapterId);
  // Among its own kind of neighbours: the chapters before the game, or the act's entries and beats.
  const rows = await db()
    .select({ id: schema.playthroughChapters.id, actId: schema.playthroughChapters.actId })
    .from(schema.playthroughChapters)
    .where(eq(schema.playthroughChapters.playthroughId, p.id))
    .orderBy(asc(schema.playthroughChapters.position));
  const all = rows.map((r) => r.id);
  const peers = rows.filter((r) => r.actId === c.actId).map((r) => r.id);
  const i = peers.indexOf(c.id);
  const j = to === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= peers.length) return;
  const a = all.indexOf(c.id);
  const b = all.indexOf(peers[j]);
  [all[a], all[b]] = [all[b], all[a]];
  await Promise.all(all.map((id, k) => db().update(schema.playthroughChapters).set({ position: k + 1 }).where(eq(schema.playthroughChapters.id, id))));
  await touch(p.id);
}

/** A reader opened a beat early ("Read it anyway"); nothing is ticked. Only the owner's reads are kept. */
export async function markRead(userId: string, pid: string, chapterIds: number[]) {
  const p = await ownedPlaythrough(userId, pid);
  if (!chapterIds.length) return;
  await db()
    .update(schema.playthroughChapters)
    .set({ readAt: new Date() })
    .where(and(eq(schema.playthroughChapters.playthroughId, p.id), inArray(schema.playthroughChapters.id, chapterIds.map(Number))));
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
    skills: v.skills,
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
