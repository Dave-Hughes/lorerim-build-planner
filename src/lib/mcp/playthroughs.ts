import "server-only";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { docText } from "@/lib/guide/doc";
import { gearData } from "@/lib/gear/data";
import { ipCall } from "@/lib/moderation/limits";
import { questLinkables, type Linkable } from "@/lib/playthroughs/links";
import { markdownToDoc, MarkdownError } from "@/lib/playthroughs/markdown";
import { getPlaythrough, listMyPlaythroughs, type PlaythroughRecord } from "@/lib/playthroughs/queries";
import { reviewPlaythrough } from "@/lib/playthroughs/review";
import { reachLabel } from "@/lib/playthroughs/status";
import type { Detect, DoneBy, LinkKind, ObjectiveLink, ObjectiveStatus, Reach } from "@/lib/playthroughs/types";
import { FIRST_ACT, levelsInput, startObjective } from "@/lib/playthroughs/validate";
import * as w from "@/lib/playthroughs/writes";
import { gateOf, mainOrder, questsData } from "@/lib/quests/data";
import { openState } from "@/lib/quests/open";
import { stories } from "@/lib/quests/stories-data";
import { DEFAULT_VERSION, FactsError, versionData } from "./errors";
import { openForYou, playerState, type Told } from "./facts";
import * as names from "./names";
import { prepareBuild, type Player } from "./builds";
import { insertBuild } from "@/lib/builds/writes";
import type { CreateInput } from "./plan";

/**
 * The playthrough tools (WO-111): an assistant drafts a playthrough for the signed-in player with
 * plain inputs (names, act numbers, an objective's own words), and every write goes through the same
 * code the edit page uses (src/lib/playthroughs/writes.ts), saving nothing on a refusal. Done is
 * the save's or the player's: the assistant never ticks a save objective or accepts its own suggestion.
 */

const link = (p: Player, id: string, path = "") => `${p.origin}/p/${id}${path}`;

/** 30 writes a minute per player, as the build tools. */
async function writeGuard(p: Player) {
  const over = await ipCall("mcp-write", p.userId);
  if (over) throw new FactsError(over);
}

/** A write's refusal, in the tool's words. */
async function writes<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (e) {
    if (e instanceof w.PlaythroughError || e instanceof MarkdownError) throw new FactsError(e.message);
    throw e;
  }
}

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

/** One of the player's playthroughs, by id or by its name. */
async function mine(p: Player, ref: string): Promise<PlaythroughRecord> {
  const want = String(ref ?? "").trim();
  let id = want;
  const byId = await getPlaythrough(want, p.userId);
  if (!byId || byId.ownerId !== p.userId) {
    const rows = await db()
      .select({ id: schema.playthroughs.id, name: schema.playthroughs.name })
      .from(schema.playthroughs)
      .where(eq(schema.playthroughs.ownerId, p.userId))
      .orderBy(desc(schema.playthroughs.updatedAt));
    const hit = rows.filter((r) => norm(r.name) === norm(want));
    if (hit.length !== 1) throw new FactsError(hit.length ? `You have more than one playthrough called ${want}. Use its id: ${hit.map((h) => h.id).join(", ")}.` : `No playthrough of yours has the id or name ${want}. list_my_playthroughs shows yours.`);
    id = hit[0].id;
  } else return byId;
  return (await getPlaythrough(id, p.userId))!;
}

/** An act by its number (1 is Act I) or its name. */
function actOf(pt: PlaythroughRecord, ref: string) {
  const acts = pt.view.acts;
  const n = /^\d+$/.test(ref.trim()) ? Number(ref) : romanNumber(ref);
  const hit = n ? acts[n - 1] : acts.find((a) => norm(a.name) === norm(String(ref)));
  if (!hit) throw new FactsError(`The playthrough has no act ${ref}. Its acts are: ${acts.map((a, i) => `${i + 1} ${a.name}`).join(", ") || "none yet"}.`);
  return hit;
}
function romanNumber(s: string): number | null {
  const t = s.trim().replace(/^act\s+/i, "").toUpperCase();
  const v: Record<string, number> = { I: 1, V: 5, X: 10 };
  if (!/^[IVX]+$/.test(t)) return null;
  let n = 0;
  for (let i = 0; i < t.length; i++) n += v[t[i]] < (v[t[i + 1]] ?? 0) ? -v[t[i]] : v[t[i]];
  return n;
}

/** An objective by its id or its own words (in one act when given). */
function objectiveOf(pt: PlaythroughRecord, ref: string, act?: ReturnType<typeof actOf>) {
  const pool = (act ? [act] : pt.view.acts).flatMap((a) => a.objectives);
  const id = /^\d+$/.test(String(ref).trim()) ? Number(ref) : null;
  const hit = id !== null ? pool.filter((o) => o.id === id) : pool.filter((o) => norm(o.text) === norm(String(ref)));
  if (hit.length === 1) return hit[0];
  if (hit.length > 1) throw new FactsError(`More than one objective says ${ref}. Use its id: ${hit.map((o) => o.id).join(", ")}.`);
  throw new FactsError(`No objective ${ref} in ${act ? `Act ${act.n}` : "the playthrough"}. get_playthrough lists them with their ids.`);
}

/** A chapter, entry or beat by its id or title. */
function chapterOf(pt: PlaythroughRecord, ref: string) {
  const id = /^\d+$/.test(String(ref).trim()) ? Number(ref) : null;
  const hit = id !== null ? pt.view.chapters.filter((c) => c.id === id) : pt.view.chapters.filter((c) => norm(c.title) === norm(String(ref)));
  if (hit.length === 1) return hit[0];
  if (hit.length > 1) throw new FactsError(`More than one piece of the tale is called ${ref}. Use its id: ${hit.map((c) => c.id).join(", ")}.`);
  throw new FactsError(`No chapter ${ref}. get_playthrough lists them with their ids.`);
}

/**
 * A link's name to { kind, id }, as names.ts does for builds: a quest by its name, "Name (Line)" when
 * two lines have one of that name; a quest line or a follower by its name; a spell; an item.
 */
export function resolveLinkName(version: string, input: { kind: LinkKind; name: string }): { link: ObjectiveLink; name: string } {
  const d = versionData(version);
  const want = input.name.trim();
  if (input.kind === "spell") {
    const id = names.spell(d, want);
    return { link: { kind: "spell", id }, name: d.spellById.get(id)!.name };
  }
  if (input.kind === "item") {
    const i = names.item(gearData().items, want);
    return { link: { kind: "item", id: i.id }, name: i.name };
  }
  const pool: Linkable[] = questLinkables().filter((x) => x.kind === input.kind);
  const paren = /^(.*)\s+\(([^()]+)\)$/.exec(want);
  let hit = pool.filter((x) => norm(x.name) === norm(want));
  if (!hit.length && paren && input.kind === "quest") hit = pool.filter((x) => norm(x.name) === norm(paren[1]) && norm(x.where.replace(/^Quest, /, "")) === norm(paren[2]));
  // The same quest is listed under each line it sits in: one edid is one quest.
  const ids = [...new Set(hit.map((h) => h.id))];
  if (ids.length === 1) return { link: { kind: input.kind, id: ids[0] }, name: hit[0].name };
  const kindName = input.kind === "line" ? "quest line" : input.kind;
  if (ids.length > 1) throw new FactsError(`More than one quest is called ${want}. Name its line too: ${hit.map((h) => `${h.name} (${h.where.replace(/^Quest, /, "")})`).join(", ")}.`);
  throw new FactsError(`No ${kindName} called ${want}. The closest: ${names.closest(want, pool.map((x) => x.name)).join(", ")}. Never invent a quest: leave the link out and use the player's own words.`);
}

/**
 * How the planner knows an objective is done, as flat fields (WO-111b: no unions in tool inputs): a quest (name or id)
 * and stage the save shows, or a number to reach. Every objective can be ticked by the player too (WO-123); fromSave
 * says whether the save ticks it as well, on by default when there's something to read. byHand is fromSave's
 * opposite, kept for a release.
 */
export interface DoneWhen {
  quest?: string;
  stage?: number;
  reachKey?: string;
  reachTarget?: number;
  fromSave?: boolean;
  byHand?: boolean;
}

export const NOTHING_TO_READ = "Nothing in it the save can read: give quest (and stage), link it to a quest, or make it a number to reach. Without one, the player ticks it.";
export const SAY_THE_NUMBER = "Say the number to reach: reachKey and reachTarget.";

const saysDone = (f: DoneWhen) => f.quest !== undefined || f.stage !== undefined || f.reachKey !== undefined || f.reachTarget !== undefined || f.fromSave !== undefined || f.byHand !== undefined;

/** The switch as sent: fromSave, or byHand's opposite; undefined when neither is. */
function saveSwitch(f: DoneWhen): boolean | undefined {
  if (f.fromSave !== undefined && f.byHand !== undefined && f.fromSave === f.byHand) throw new FactsError("Give fromSave or byHand, not both: byHand is fromSave's opposite.");
  return f.fromSave ?? (f.byHand === undefined ? undefined : !f.byHand);
}

/**
 * The flat fields to the stored shape. `keep` is the objective's own reach, for a change that doesn't name a new one;
 * `linkQuest` the quest it links to, which the save reads when no quest is given; `was` the switch it had.
 */
function doneWhenOf(version: string, kind: "once" | "reach", f: DoneWhen, keep: Reach | null = null, linkQuest: string | null = null, was?: boolean): { doneBy: DoneBy; detect: Detect | null; reach: Reach | null } {
  const on = saveSwitch(f) ?? was;
  if (kind === "reach") {
    if (f.quest !== undefined) throw new FactsError("A number to reach takes reachKey and reachTarget, not quest.");
    let reach = keep;
    if (f.reachKey !== undefined || f.reachTarget !== undefined || !keep) {
      if (!f.reachKey?.trim() || f.reachTarget === undefined) throw new FactsError(SAY_THE_NUMBER);
      reach = { key: reachKey(version, f.reachKey), target: f.reachTarget };
    }
    return { doneBy: on === false ? "hand" : "save", detect: null, reach };
  }
  if (f.reachKey !== undefined || f.reachTarget !== undefined) throw new FactsError('A number goes with kind "reach"; a done-once objective takes quest (and stage), or nothing for one the player ticks.');
  const q = f.quest ? (questsData().lines.some((l) => l.quests.some((x) => x.edid === f.quest)) ? f.quest : resolveLinkName(version, { kind: "quest", name: f.quest }).link.id) : linkQuest;
  if (!q) {
    if (on === true && saveSwitch(f) === true) throw new FactsError(NOTHING_TO_READ);
    return { doneBy: "hand", detect: null, reach: null };
  }
  return { doneBy: on === false ? "hand" : "save", detect: { quest: q, ...(f.stage !== undefined ? { stage: f.stage } : {}) }, reach: null };
}

/** "Level", a skill's name, or a count's label ("books read", or "count:books read"). */
function reachKey(version: string, key: string): string {
  const k = key.trim();
  if (norm(k) === "level") return "level";
  if (/^count:/i.test(k)) return `count:${k.slice(6).trim()}`;
  const d = versionData(version);
  const skill = d.skills.find((s) => norm(s) === norm(k.replace(/^skill:/i, "")));
  return skill ? `skill:${skill}` : `count:${k}`;
}

export interface ObjectiveToolInput extends DoneWhen {
  playthrough: string;
  act: string;
  text: string;
  link?: { kind: LinkKind; name: string };
  kind: "once" | "reach";
  why?: string;
  after?: string;
}

async function objectiveValues(pt: PlaythroughRecord, input: Omit<ObjectiveToolInput, "playthrough" | "act" | "after">) {
  const linked = input.link ? resolveLinkName(pt.gameVersion, input.link) : null;
  // A link to a quest is what the save reads when no quest is given (WO-123).
  const dw = doneWhenOf(pt.gameVersion, input.kind, input, null, linked?.link.kind === "quest" ? linked.link.id : null);
  return { text: input.text, kind: input.kind, link: linked?.link ?? null, ...dw, why: input.why ?? null };
}

/**
 * One of the player's builds by id or name, or "none" for no build (WO-111c). Pure: `rows` are the
 * player's own builds, so a build that isn't theirs is never found.
 */
export function pickBuild(rows: readonly { id: string; name: string }[], ref: string): string | null {
  const want = ref.trim();
  if (norm(want) === "none") return null;
  const hit = rows.filter((b) => b.id === want || norm(b.name) === norm(want));
  if (hit.length === 1) return hit[0].id;
  throw new FactsError(hit.length ? `You have more than one build called ${want}. Use its id: ${hit.map((b) => b.id).join(", ")}.` : `No build of yours has the id or name ${want}. list_my_builds shows yours.`);
}

const myBuilds = (p: Player) => db().select({ id: schema.builds.id, name: schema.builds.name }).from(schema.builds).where(eq(schema.builds.ownerId, p.userId));

/* ---------- The tools ---------- */

/** Act I as New character sets it (WO-114): "The first days", levels 1 to 5, and the start's place and quest when the data names them. */
export function firstAct(start: { place?: string; quest?: { edid: string; name: string; xp?: number } } | undefined): w.RunInput["act"] & { objectives: w.RunInput["objectives"] } {
  return { ...FIRST_ACT, place: start?.place ?? "", goal: "", objectives: start?.quest ? [startObjective(start.quest)] : [] };
}

/**
 * create_playthrough: with character creation's fields (WO-114), the build and the run together in one
 * transaction, Act I set from the start, both private and drafted by the assistant. With `build`
 * instead, a run on one of the player's builds, as before.
 */
export async function createPlaythrough(p: Player, input: { name: string; line?: string; build?: string; version?: string } & Partial<Omit<CreateInput, "name" | "description">>) {
  if (input.race !== undefined || input.majors !== undefined) {
    if (input.build) throw new FactsError("Give the character creation fields for a new build, or build for one the player has, not both.");
    const { details, plan } = await prepareBuild(p, { ...input, name: input.name, description: input.line, race: input.race ?? "", majors: input.majors ?? [], minors: input.minors ?? [] } as CreateInput & { version?: string });
    if ((await w.draftCount(p.userId)) >= 10) throw new FactsError(w.DRAFT_CAP_MESSAGE);
    const { objectives, ...act } = firstAct(plan.start ? versionData(plan.gameVersion).startByName.get(plan.start) : undefined);
    const run = await writes(async () => w.prepareRun({ name: input.name, line: input.line, act, objectives }));
    const by = p.clientName.slice(0, 80);
    let id = "";
    const buildId = await insertBuild(p.userId, details, plan, by, (b) => {
      const r = w.runStatements(p.userId, b, plan.gameVersion, run, by);
      id = r.id;
      return r.statements;
    });
    revalidatePath("/me");
    return {
      playthrough: id,
      link: link(p, id),
      build: buildId,
      buildLink: `${p.origin}/b/${buildId}`,
      visibility: "private",
      act: { act: "1", name: act.name, levels: act.levels, place: act.place, objectives: objectives?.length ?? 0 },
      next: "Add levels with add_level, then more acts and objectives.",
    };
  }
  await writeGuard(p);
  const buildId = input.build ? pickBuild(await myBuilds(p), input.build) : null;
  versionData(input.version ?? DEFAULT_VERSION);
  const id = await writes(() => w.createPlaythrough(p.userId, { name: input.name, line: input.line, buildId, gameVersion: input.version ?? DEFAULT_VERSION }, p.clientName.slice(0, 80)));
  revalidatePath("/me");
  return { playthrough: id, link: link(p, id), visibility: "private", next: "Add its acts with add_act, then their objectives." };
}

/** set_playthrough (WO-111c): name, line, and the build it follows, through the edit page's own write. */
export async function setPlaythrough(p: Player, input: { playthrough: string; name?: string; line?: string; build?: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const buildId = input.build === undefined ? undefined : pickBuild(await myBuilds(p), input.build);
  await writes(() => w.setDetails(p.userId, pt.id, { name: input.name, line: input.line, ...(buildId === undefined ? {} : { buildId }) }));
  revalidatePath(`/p/${pt.id}`);
  revalidatePath("/me");
  const now = (await getPlaythrough(pt.id, p.userId))!;
  return { playthrough: pt.id, name: now.name, line: now.line, build: now.build ? { id: now.build.id, name: now.build.name } : null, link: link(p, pt.id) };
}

export async function addAct(p: Player, input: { playthrough: string; name: string; levels: string; place: string; goal: string; standingRule?: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const id = await writes(() => w.addAct(p.userId, pt.id, { name: input.name, levels: input.levels, place: input.place, goal: input.goal, standingRule: input.standingRule ?? null }));
  return { playthrough: pt.id, act: String(pt.view.acts.length + 1), actId: String(id), link: link(p, pt.id) };
}

export async function setAct(p: Player, input: { playthrough: string; act: string; name?: string; levels?: string; place?: string; goal?: string; standingRule?: string | null }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const a = actOf(pt, input.act);
  await writes(() => w.setAct(p.userId, pt.id, a.id, { name: input.name, levels: input.levels, place: input.place, goal: input.goal, standingRule: input.standingRule }));
  return { playthrough: pt.id, act: pt.view.acts.indexOf(a) + 1, saved: true };
}

export async function removeAct(p: Player, input: { playthrough: string; act: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const a = actOf(pt, input.act);
  await writes(() => w.removeAct(p.userId, pt.id, a.id));
  return { playthrough: pt.id, removed: `Act ${a.n} ${a.name}`, acts: pt.view.acts.length - 1 };
}

export async function moveAct(p: Player, input: { playthrough: string; act: string; to: number }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const a = actOf(pt, input.act);
  await writes(() => w.moveAct(p.userId, pt.id, a.id, input.to));
  return { playthrough: pt.id, moved: a.name, to: input.to };
}

export async function addObjective(p: Player, input: ObjectiveToolInput, suggestedBy: string | null = null) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const a = actOf(pt, input.act);
  const after = input.after !== undefined ? objectiveOf(pt, input.after, a).id : null;
  const values = await writes(() => objectiveValues(pt, input));
  const id = await writes(() => w.addObjective(p.userId, pt.id, a.id, values, { after, suggestedBy }));
  // Advice while drafting (WO-123 Part 2): it saves the same either way.
  const warnings = reviewPlaythrough([{ id, text: values.text, kind: values.kind, link: values.link, reach: values.reach }]);
  return {
    playthrough: pt.id,
    act: String(pt.view.acts.indexOf(a) + 1),
    objective: String(id),
    ...(suggestedBy ? { suggested: true, note: "It shows as suggested with Accept and Skip, and counts for nothing until the player accepts it." } : {}),
    ...(warnings.length ? { warnings: warnings.map(({ code, message }) => ({ code, message })) } : {}),
  };
}

export const suggestObjective = (p: Player, input: ObjectiveToolInput) => addObjective(p, input, p.clientName.slice(0, 80));

export async function setObjective(p: Player, input: Partial<Omit<ObjectiveToolInput, "playthrough" | "after">> & { playthrough: string; objective: string; unlink?: boolean }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const o = objectiveOf(pt, input.objective);
  if (input.unlink && input.link) throw new FactsError("Give link or unlink, not both.");
  const linked = input.unlink ? null : input.link ? resolveLinkName(pt.gameVersion, input.link).link : undefined;
  const kind = input.kind ?? o.kind;
  const link = linked === undefined ? o.link : linked;
  // The switch it had: on when the save reads it, off when it could and doesn't, unset when there was nothing to read.
  const was = o.doneBy === "save" ? true : o.kind === "reach" || o.detect || o.link?.kind === "quest" ? false : undefined;
  // The quest and stage the save reads stay unless a new quest or link is given.
  const kept = linked === undefined && input.quest === undefined ? o.detect : null;
  const linkQuest = kept?.quest ?? (link?.kind === "quest" ? link.id : null);
  const fields = kept?.stage !== undefined && input.stage === undefined ? { ...input, stage: kept.stage } : input;
  const changes = saysDone(input) || linked !== undefined || (input.kind !== undefined && input.kind !== o.kind);
  const dw = changes ? doneWhenOf(pt.gameVersion, kind, fields, kind === o.kind ? o.reach : null, linkQuest, was) : null;
  await writes(() =>
    w.setObjective(p.userId, pt.id, o.id, {
      ...(input.text !== undefined ? { text: input.text } : {}),
      kind,
      ...(linked !== undefined ? { link: linked } : {}),
      ...(dw ? dw : {}),
      ...(input.why !== undefined ? { why: input.why } : {}),
    }),
  );
  return { playthrough: pt.id, objective: o.id, saved: true };
}

export async function removeObjective(p: Player, input: { playthrough: string; objective: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const o = objectiveOf(pt, input.objective);
  await writes(() => w.removeObjective(p.userId, pt.id, o.id));
  return { playthrough: pt.id, removed: o.text };
}

export async function moveObjective(p: Player, input: { playthrough: string; objective: string; to?: number; act?: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const o = objectiveOf(pt, input.objective);
  const target = input.act !== undefined ? actOf(pt, input.act) : null;
  await writes(() => w.moveObjective(p.userId, pt.id, o.id, input.to ?? 1, target?.id));
  return { playthrough: pt.id, moved: o.text };
}

/** Any objective, when the player says (WO-123): one the save reads is done from the save as well, either counts. */
export async function setStatus(p: Player, input: { playthrough: string; objective: string; status: ObjectiveStatus }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const o = objectiveOf(pt, input.objective);
  await writes(() => w.setStatus(p.userId, pt.id, o.id, input.status));
  return { playthrough: pt.id, objective: o.id, status: input.status };
}

/** A chapter (WO-118): in the Prologue or an act, unlocking when an objective is done or not. */
export async function writeChapter(p: Player, input: { playthrough: string; title: string; text: string; act?: string; unlocksWhen?: string; fromSave?: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const a = input.act !== undefined ? actOf(pt, input.act) : null;
  const after = input.unlocksWhen !== undefined ? objectiveOf(pt, input.unlocksWhen, a ?? undefined).id : null;
  const doc = await writes(async () => markdownToDoc(input.text));
  const id = await writes(() => w.addChapter(p.userId, pt.id, { title: input.title, doc, actId: a?.id ?? null, unlocksWhen: after, fromSave: input.fromSave ?? null }, p.clientName.slice(0, 80)));
  return { playthrough: pt.id, chapter: String(id), link: link(p, pt.id, `/story/${id}`) };
}

export async function setChapter(p: Player, input: { playthrough: string; chapter: string; title?: string; text?: string; unlocksWhen?: string; fromSave?: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const c = chapterOf(pt, input.chapter);
  const doc = input.text !== undefined ? await writes(async () => markdownToDoc(input.text!)) : undefined;
  const after = input.unlocksWhen === undefined ? undefined : input.unlocksWhen.toLowerCase() === "none" ? null : objectiveOf(pt, input.unlocksWhen).id;
  await writes(() => w.setChapter(p.userId, pt.id, c.id, { title: input.title, doc, unlocksWhen: after, fromSave: input.fromSave }, p.clientName.slice(0, 80)));
  return { playthrough: pt.id, chapter: c.id, saved: true };
}

export async function removeChapter(p: Player, input: { playthrough: string; chapter: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const c = chapterOf(pt, input.chapter);
  await writes(() => w.removeChapter(p.userId, pt.id, c.id));
  return { playthrough: pt.id, removed: c.title };
}

/** Only from the save (WO-112's helper): rule 18 forbids a value the assistant estimated. */
export async function setSnapshot(p: Player, input: { playthrough: string; source: "save"; label: string; level: number; xp?: number; day?: number; place?: string; skills: Record<string, number>; questStages?: Record<string, number>; counts?: Record<string, number> }) {
  await writeGuard(p);
  if (input.source !== "save") throw new FactsError("Only a save can set where the player stands, read on their PC. The player enters it by hand on the site.");
  const pt = await mine(p, input.playthrough);
  const d = versionData(pt.gameVersion);
  const skills = Object.fromEntries(Object.entries(input.skills ?? {}).map(([k, v]) => [names.skill(d, k), v]));
  await writes(() => w.setSnapshot(p.userId, pt.id, { source: "save", label: input.label, level: input.level, xp: input.xp ?? null, day: input.day ?? null, place: input.place ?? null, skills, questStages: input.questStages ?? null, counts: input.counts ?? null, readBy: p.clientName.slice(0, 80) }));
  return { playthrough: pt.id, saved: true, link: link(p, pt.id) };
}

/** The playthrough in the plain shape the inputs use, each objective with how it stands. */
/** A playthrough's drafting warnings (WO-123 Part 2), each naming its objective by id. */
function warningsOf(pt: PlaythroughRecord) {
  return reviewPlaythrough(pt.view.acts.flatMap((a) => a.objectives).map((o) => ({ id: o.id, text: o.text, kind: o.kind, link: o.link, reach: o.reach })));
}

export async function getPlaythroughTool(p: Player, input: { playthrough: string }) {
  const pt = await mine(p, input.playthrough);
  const v = pt.view;
  const warnings = warningsOf(pt);
  const shown = { save: "done, from the save", hand: "done, ticked by the player", doing: "under way", todo: "to do", later: "later", suggested: "suggested, waiting for the player" } as const;
  return {
    playthrough: pt.id,
    name: pt.name,
    line: pt.line,
    visibility: pt.visibility,
    link: link(p, pt.id),
    // The character's build (WO-114): its id, name, cover and levels.
    build: pt.build ? { id: pt.build.id, name: pt.build.name, cover: pt.build.coverImageUrl, levels: pt.build.levels, link: `${p.origin}/b/${pt.build.id}` } : null,
    draftedByAnAssistant: !!pt.draftedBy,
    done: `${v.done} of ${v.total}`,
    whereYouStand: pt.snapshot
      ? { from: pt.snapshot.source === "save" ? pt.snapshot.label : "the player, by hand", level: pt.snapshot.level, day: pt.snapshot.day, place: pt.snapshot.place, skills: pt.snapshot.skills }
      : null,
    acts: v.acts.map((a, i) => ({
      act: String(i + 1),
      name: a.name,
      levels: levelsInput(a.levelFrom, a.levelTo),
      place: a.place,
      goal: a.goal,
      ...(a.standingRule ? { standingRule: a.standingRule } : {}),
      // The act's first chapter (WO-118): it opens the act's card on Play.
      firstChapter: a.chapter !== null ? chapterLine(v.chapters.find((c) => c.id === a.chapter)!) : null,
      objectives: a.objectives.map((o) => ({
        objective: String(o.id),
        text: o.text,
        kind: o.kind,
        ...(o.linkShown ? { link: { kind: o.link!.kind, name: o.linkShown.name } } : {}),
        // The same flat fields add_objective takes, so an objective can go back unchanged (WO-111b).
        ...(o.kind === "reach" && o.reach ? { reachKey: reachLabel(o.reach.key), reachTarget: o.reach.target } : o.detect ? { quest: o.detect.quest, ...(o.detect.stage !== undefined ? { stage: o.detect.stage } : {}) } : {}),
        // Ticks from your save (WO-123): every objective can also be ticked by the player.
        fromSave: o.doneBy === "save",
        ...(o.why ? { why: o.why } : {}),
        status: shown[o.worked.shown],
        // The chapters that hang off it: its Story markers (WO-116).
        chapters: o.tale.map((t) => ({ chapter: String(t.id), title: t.title, open: t.open })),
      })),
    })),
    // The story's chapters in reading order (WO-118): the Prologue's, then each act's.
    chapters: v.chapters.map((c) => ({
      chapter: String(c.id),
      title: c.title,
      act: c.actId === null ? "Prologue" : String(v.acts.findIndex((a) => a.id === c.actId) + 1),
      ...(c.kind === "beat" && c.inGame ? { unlocksWhen: { objective: String(c.inGame.id), text: c.inGame.text }, unlocked: c.open } : {}),
      ...(c.kind !== "beat" && c.inGame ? { tells: c.inGame.text } : {}),
      ...(c.fromSave ? { fromSave: c.fromSave } : {}),
      text: docText(c.doc),
    })),
    ...(warnings.length ? { warnings } : {}),
  };
}

/** A chapter as get_playthrough names it: its id and title. */
const chapterLine = (c: { id: number; title: string }) => ({ chapter: String(c.id), title: c.title });

export async function listMine(p: Player) {
  const rows = await listMyPlaythroughs(p.userId);
  return rows.map((r) => ({ playthrough: r.id, name: r.name, visibility: r.visibility, build: r.buildId ? { id: r.buildId, name: r.buildName } : null, acts: r.acts, updated: r.updatedAt.toISOString(), draftedByAnAssistant: !!r.draftedBy, link: link(p, r.id) }));
}

/** The full check once more. It changes nothing; publishing is the player's, on the site. */
export async function finishDraft(p: Player, input: { playthrough: string }) {
  const pt = await mine(p, input.playthrough);
  const issues: string[] = [];
  if (!pt.view.acts.length) issues.push("The playthrough has no acts yet.");
  for (const a of pt.view.acts) if (!a.objectives.length) issues.push(`Act ${a.n} ${a.name} has no objective.`);
  for (const c of pt.view.chapters) if (c.kind === "beat" && c.opensAfter === null) issues.push(`The chapter ${c.title} unlocks from an objective that's gone: set unlocksWhen again, or "none".`);
  // Assistants can't add images (WO-118): the player adds a cover from this link, at the cover in Details;
  // the story's images are theirs too, in its Story tab.
  const addCover = pt.buildId ? `${p.origin}/b/${pt.buildId}/setup?step=name#cover` : null;
  if (issues.length) return { ready: false, issues, addCover };
  // Warnings still standing (WO-123 Part 2): never a refusal, but the assistant answers for them.
  const warnings = warningsOf(pt);
  return {
    ready: true,
    link: link(p, pt.id),
    addCover,
    ...(warnings.length ? { warnings, warningsNote: "Fix these or tell the player why you left them." } : {}),
    message: `Ready: open ${link(p, pt.id)} to read it, tick what's done and publish.${addCover ? ` The cover is the player's to add: ${addCover}` : ""}`,
  };
}

/**
 * What the player has told the planner (WO-115 Part 3), from a tool's input and, when one is named and
 * signed in, a playthrough: its snapshot's level and quest stages, and the quests and lines its
 * ticked or saved objectives link to. Until the save helper (WO-112) a stage nobody gave is unknown.
 */
export async function toldOf(input: { level?: number; done?: string[]; playthrough?: string }, userId: string | null): Promise<Told> {
  const done = [...(input.done ?? [])];
  let level = input.level ?? null;
  let stages: Record<string, number> = {};
  if (input.playthrough && userId) {
    const pt = await getPlaythrough(input.playthrough, userId);
    if (pt) {
      level ??= pt.snapshot?.level ?? null;
      stages = { ...(pt.snapshot?.questStages ?? {}) };
      for (const o of pt.view.acts.flatMap((a) => a.objectives)) {
        if (!o.worked.done) continue;
        if (o.link && (o.link.kind === "quest" || o.link.kind === "line" || o.link.kind === "follower")) done.push(o.link.id);
      }
    }
  }
  return { level, done, stages };
}

/**
 * suggest_quests: stories whose starts are checked in the game files and whose first quest is open for
 * the player (WO-115 Part 3: never one the planner can't judge), not done, each with its checked start,
 * why it's open, and the planner's link.
 */
export async function suggestQuests(origin: string, input: { level: number; where?: string; done?: string[]; playthrough?: string }, userId: string | null) {
  const { byId } = questsData();
  const told = await toldOf(input, userId);
  const player = playerState(told);
  const order = mainOrder().map((q) => q.edid);
  const where = input.where?.trim().toLowerCase();
  const out = stories()
    .map((s) => ({ s, line: byId.get(s.line) }))
    .filter(({ line }) => line && line.checked.start === "files" && !line.quests.every((q) => player.done.has(q.edid)))
    .filter(({ line }) => openState(gateOf(line!), { level: input.level, mainAt: null, finished: told.done ?? [] }, order) === "open")
    .map(({ s, line }) => {
      const first = line!.quests.find((q) => q.edid === line!.opening) ?? line!.quests[0];
      return { s, line: line!, first, open: openForYou(line!, first, player) };
    })
    .filter(({ open }) => open.state === "open")
    .filter(({ s, line }) => !where || [line.where, line.giver?.place, ...s.start.map((x) => x.text)].some((t) => t?.toLowerCase().includes(where)))
    .slice(0, 12)
    .map(({ s, line, first, open }) => ({
      story: s.id,
      name: s.name,
      line: line.name,
      start: s.start.filter((x) => x.checked === "files").map((x) => x.text)[0] ?? line.start ?? null,
      checked: "files",
      firstQuest: first.name,
      openForYou: open.says,
      link: `${origin}/quests/s/${s.id}`,
    }));
  return {
    level: input.level,
    suggestions: out,
    note: out.length
      ? "Each is open for the player by the planner's checked starts. Offer them as suggestions; nothing is added unless they accept. Don't offer a quest the planner hasn't answered open for."
      : "No checked story is open for the player at that level and place.",
  };
}
