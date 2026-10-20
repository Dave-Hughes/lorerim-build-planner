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
import { reachLabel, RULE_14 } from "@/lib/playthroughs/status";
import type { Detect, DoneBy, LinkKind, ObjectiveLink, ObjectiveStatus, Reach } from "@/lib/playthroughs/types";
import { levelsInput } from "@/lib/playthroughs/validate";
import * as w from "@/lib/playthroughs/writes";
import { gateOf, mainOrder, questsData } from "@/lib/quests/data";
import { openState } from "@/lib/quests/open";
import { stories } from "@/lib/quests/stories-data";
import { DEFAULT_VERSION, FactsError, versionData } from "./errors";
import * as names from "./names";
import type { Player } from "./builds";

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
  throw new FactsError(`No chapter, entry or beat ${ref}. get_playthrough lists them with their ids.`);
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
 * How the planner knows an objective is done, as flat fields (WO-111b: no unions in tool inputs): a
 * quest (name or id) and stage the save shows, a number to reach, or byHand for one the player ticks.
 */
export interface DoneWhen {
  quest?: string;
  stage?: number;
  reachKey?: string;
  reachTarget?: number;
  byHand?: boolean;
}

const HOW_DONE = 'Say how it\'s done: quest (and stage) for one the save shows, or byHand: true for one the player ticks.';
export const SAY_THE_NUMBER = "Say the number to reach: reachKey and reachTarget.";

const saysDone = (f: DoneWhen) => f.quest !== undefined || f.stage !== undefined || f.reachKey !== undefined || f.reachTarget !== undefined || f.byHand !== undefined;

/** The flat fields to the stored shape. `keep` is the objective's own reach, for a change that doesn't name a new one. */
function doneWhenOf(version: string, kind: "once" | "reach", f: DoneWhen, keep: Reach | null = null): { doneBy: DoneBy | null; detect: Detect | null; reach: Reach | null } {
  if (kind === "reach") {
    if (f.quest !== undefined || f.byHand) throw new FactsError('A number to reach is done when the save shows it: give reachKey and reachTarget, not quest or byHand.');
    if (f.reachKey === undefined && f.reachTarget === undefined && keep) return { doneBy: "save", detect: null, reach: keep };
    if (!f.reachKey?.trim() || f.reachTarget === undefined) throw new FactsError(SAY_THE_NUMBER);
    return { doneBy: "save", detect: null, reach: { key: reachKey(version, f.reachKey), target: f.reachTarget } };
  }
  if (f.reachKey !== undefined || f.reachTarget !== undefined) throw new FactsError('A number goes with kind "reach"; a done-once objective takes quest (and stage) or byHand.');
  if (f.quest && f.byHand) throw new FactsError("Give quest (and stage) or byHand, not both.");
  if (f.byHand) return { doneBy: "hand", detect: null, reach: null };
  if (!f.quest) return { doneBy: null, detect: null, reach: null };
  const q = f.quest;
  const edid = questsData().lines.some((l) => l.quests.some((x) => x.edid === q)) ? q : resolveLinkName(version, { kind: "quest", name: q }).link.id;
  return { doneBy: "save", detect: { quest: edid, ...(f.stage !== undefined ? { stage: f.stage } : {}) }, reach: null };
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
  const dw = doneWhenOf(pt.gameVersion, input.kind, input);
  // Rule 14, in its own words, when the objective can't be known done.
  if (input.kind === "once" && !dw.doneBy) throw new FactsError(`${RULE_14} ${HOW_DONE}`);
  return { text: input.text, kind: input.kind, link: linked?.link ?? null, ...dw, why: input.why ?? null };
}

/* ---------- The tools ---------- */

export async function createPlaythrough(p: Player, input: { name: string; line?: string; build?: string; version?: string }) {
  await writeGuard(p);
  let buildId: string | null = null;
  if (input.build) {
    const rows = await db()
      .select({ id: schema.builds.id, name: schema.builds.name })
      .from(schema.builds)
      .where(eq(schema.builds.ownerId, p.userId));
    const hit = rows.filter((b) => b.id === input.build || norm(b.name) === norm(input.build!));
    if (hit.length !== 1) throw new FactsError(hit.length ? `You have more than one build called ${input.build}. Use its id.` : `No build of yours has the id or name ${input.build}. list_my_builds shows yours.`);
    buildId = hit[0].id;
  }
  versionData(input.version ?? DEFAULT_VERSION);
  const id = await writes(() => w.createPlaythrough(p.userId, { name: input.name, line: input.line, buildId, gameVersion: input.version ?? DEFAULT_VERSION }, p.clientName.slice(0, 80)));
  revalidatePath("/me");
  return { playthrough: id, link: link(p, id), visibility: "private", next: "Add its acts with add_act, then their objectives." };
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
  return { playthrough: pt.id, act: String(pt.view.acts.indexOf(a) + 1), objective: String(id), ...(suggestedBy ? { suggested: true, note: "It shows as suggested with Accept and Skip, and counts for nothing until the player accepts it." } : {}) };
}

export const suggestObjective = (p: Player, input: ObjectiveToolInput) => addObjective(p, input, p.clientName.slice(0, 80));

export async function setObjective(p: Player, input: Partial<Omit<ObjectiveToolInput, "playthrough" | "after">> & { playthrough: string; objective: string; unlink?: boolean }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const o = objectiveOf(pt, input.objective);
  if (input.unlink && input.link) throw new FactsError("Give link or unlink, not both.");
  const linked = input.unlink ? null : input.link ? resolveLinkName(pt.gameVersion, input.link).link : undefined;
  const kind = input.kind ?? o.kind;
  const dw = saysDone(input) || (input.kind !== undefined && input.kind !== o.kind) ? doneWhenOf(pt.gameVersion, kind, input, kind === o.kind ? o.reach : null) : null;
  if (dw && kind === "once" && !dw.doneBy) throw new FactsError(`${RULE_14} ${HOW_DONE}`);
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

/** For `hand` objectives only: the save decides the rest. */
export async function setStatus(p: Player, input: { playthrough: string; objective: string; status: ObjectiveStatus }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const o = objectiveOf(pt, input.objective);
  if (o.doneBy === "save" || o.kind === "reach") throw new FactsError(w.SAVE_DECIDES);
  await writes(() => w.setStatus(p.userId, pt.id, o.id, input.status));
  return { playthrough: pt.id, objective: o.id, status: input.status };
}

export async function writeChapter(p: Player, input: { playthrough: string; kind: "chapter" | "entry" | "beat"; title: string; text: string; act?: string; after?: string; fromSave?: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  if (input.kind === "beat" && input.after === undefined) throw new FactsError("A beat opens when an objective is done: give `after`, the objective.");
  const a = input.act !== undefined ? actOf(pt, input.act) : null;
  const after = input.after !== undefined ? objectiveOf(pt, input.after, a ?? undefined).id : null;
  const doc = await writes(async () => markdownToDoc(input.text));
  const id = await writes(() => w.addChapter(p.userId, pt.id, { kind: input.kind, title: input.title, doc, actId: input.kind === "chapter" ? null : (a?.id ?? null), opensAfter: input.kind === "chapter" ? null : after, fromSave: input.fromSave ?? null }, p.clientName.slice(0, 80)));
  return { playthrough: pt.id, chapter: String(id), kind: input.kind, link: link(p, pt.id, `/tale#c${id}`) };
}

export async function setChapter(p: Player, input: { playthrough: string; chapter: string; title?: string; text?: string; after?: string; fromSave?: string }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const c = chapterOf(pt, input.chapter);
  const doc = input.text !== undefined ? await writes(async () => markdownToDoc(input.text!)) : undefined;
  const after = input.after !== undefined ? objectiveOf(pt, input.after).id : undefined;
  await writes(() => w.setChapter(p.userId, pt.id, c.id, { title: input.title, doc, opensAfter: after, fromSave: input.fromSave }, p.clientName.slice(0, 80)));
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
  if (input.source !== "save") throw new FactsError("Only a save can set where the player stands: the helper reads it. The player enters it by hand on the site.");
  const pt = await mine(p, input.playthrough);
  const d = versionData(pt.gameVersion);
  const skills = Object.fromEntries(Object.entries(input.skills ?? {}).map(([k, v]) => [names.skill(d, k), v]));
  await writes(() => w.setSnapshot(p.userId, pt.id, { source: "save", label: input.label, level: input.level, xp: input.xp ?? null, day: input.day ?? null, place: input.place ?? null, skills, questStages: input.questStages ?? null, counts: input.counts ?? null, readBy: p.clientName.slice(0, 80) }));
  return { playthrough: pt.id, saved: true, link: link(p, pt.id) };
}

/** The playthrough in the plain shape the inputs use, each objective with how it stands. */
export async function getPlaythroughTool(p: Player, input: { playthrough: string }) {
  const pt = await mine(p, input.playthrough);
  const v = pt.view;
  const shown = { save: "done, from the save", hand: "done, ticked by the player", doing: "under way", todo: "to do", later: "later", suggested: "suggested, waiting for the player" } as const;
  return {
    playthrough: pt.id,
    name: pt.name,
    line: pt.line,
    visibility: pt.visibility,
    link: link(p, pt.id),
    build: pt.build ? { id: pt.build.id, name: pt.build.name } : null,
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
      objectives: a.objectives.map((o) => ({
        objective: String(o.id),
        text: o.text,
        kind: o.kind,
        ...(o.linkShown ? { link: { kind: o.link!.kind, name: o.linkShown.name } } : {}),
        // The same flat fields add_objective takes, so an objective can go back unchanged (WO-111b).
        ...(o.kind === "reach" && o.reach ? { reachKey: reachLabel(o.reach.key), reachTarget: o.reach.target } : o.doneBy === "save" && o.detect ? { quest: o.detect.quest, ...(o.detect.stage !== undefined ? { stage: o.detect.stage } : {}) } : { byHand: true }),
        ...(o.why ? { why: o.why } : {}),
        status: shown[o.worked.shown],
      })),
    })),
    tale: v.chapters.map((c) => ({
      chapter: String(c.id),
      kind: c.kind,
      title: c.title,
      ...(c.act ? { act: c.act } : {}),
      ...(c.inGame ? { after: c.inGame.text } : {}),
      ...(c.fromSave ? { fromSave: c.fromSave } : {}),
      ...(c.kind === "beat" ? { open: c.open } : {}),
      text: docText(c.doc),
    })),
  };
}

export async function listMine(p: Player) {
  const rows = await listMyPlaythroughs(p.userId);
  return rows.map((r) => ({ playthrough: r.id, name: r.name, visibility: r.visibility, acts: r.acts, updated: r.updatedAt.toISOString(), draftedByAnAssistant: !!r.draftedBy, link: link(p, r.id) }));
}

/** The full check once more. It changes nothing; publishing is the player's, on the site. */
export async function finishDraft(p: Player, input: { playthrough: string }) {
  const pt = await mine(p, input.playthrough);
  const issues: string[] = [];
  if (!pt.view.acts.length) issues.push("The playthrough has no acts yet.");
  for (const a of pt.view.acts) if (!a.objectives.length) issues.push(`Act ${a.n} ${a.name} has no objective.`);
  for (const c of pt.view.chapters) if (c.kind === "beat" && c.opensAfter === null) issues.push(`The beat ${c.title} has no objective to open after.`);
  if (issues.length) return { ready: false, issues };
  return { ready: true, link: link(p, pt.id), message: `Ready: open ${link(p, pt.id)} to read it, tick what's done and publish.` };
}

/**
 * suggest_quests: stories whose lines' starts are checked in the game files, open at the level and not
 * done, each with its checked start line and the planner's link. Never a line whose start isn't checked.
 */
export async function suggestQuests(origin: string, input: { level: number; where?: string; done?: string[]; playthrough?: string }, userId: string | null) {
  const { byId } = questsData();
  let done = input.done ?? [];
  if (input.playthrough && userId) {
    const pt = await getPlaythrough(input.playthrough, userId);
    if (pt) done = [...done, ...pt.view.acts.flatMap((a) => a.objectives.filter((o) => o.worked.done && o.link && (o.link.kind === "line" || o.link.kind === "follower")).map((o) => o.link!.id))];
  }
  const order = mainOrder().map((q) => q.edid);
  const where = input.where?.trim().toLowerCase();
  const out = stories()
    .map((s) => ({ s, line: byId.get(s.line) }))
    .filter(({ line }) => line && line.checked.start === "files" && !done.includes(line.id))
    .filter(({ line }) => openState(gateOf(line!), { level: input.level, mainAt: null, finished: done }, order) === "open")
    .filter(({ s, line }) => !where || [line!.where, line!.giver?.place, ...s.start.map((x) => x.text)].some((t) => t?.toLowerCase().includes(where)))
    .slice(0, 12)
    .map(({ s, line }) => ({
      story: s.id,
      name: s.name,
      line: line!.name,
      start: s.start.filter((x) => x.checked === "files").map((x) => x.text)[0] ?? line!.start ?? null,
      checked: "files",
      link: `${origin}/quests/s/${s.id}`,
    }));
  return { level: input.level, suggestions: out, note: out.length ? "Each start is checked in the game files. Offer them to the player as suggestions; nothing is added unless they accept." : "No checked story is open at that level and place." };
}
