import { modsInOrder, type Mod } from "@/lib/mods";
import "server-only";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { gearData } from "@/lib/gear/data";
import { ipCall } from "@/lib/moderation/limits";
import { lineOfQuest, personLinkables, placeLinkables, questLinkables, type Linkable } from "@/lib/playthroughs/links";
import { placeByName, placeLabel, placesData, placesNamed, placeType } from "@/lib/places/data";
import { holdNamed, whereTerms } from "@/lib/places/holds";
import { citiesOf } from "@/lib/places/inside";
import { actTowns, placesNear, townsIn, unmeasured } from "@/lib/places/suggest";
import { progressTracking } from "@/lib/features";
import { MarkdownError } from "@/lib/playthroughs/markdown";
import { getPlaythrough, listMyPlaythroughs, type PlaythroughRecord } from "@/lib/playthroughs/queries";
import { reviewPlaythrough } from "@/lib/playthroughs/review";
import { reviewGates, type GateWorld } from "@/lib/playthroughs/gate-review";
import { reviewRoutes } from "@/lib/playthroughs/route-review";
import { reachLabel } from "@/lib/playthroughs/status";
import type { Answer, Detect, DoneBy, LinkKind, Never, ObjectiveLink, ObjectiveStatus, PassedBy, Reach, RouteStop } from "@/lib/playthroughs/types";
import { FIRST_ACT, levelsInput, parseLevels, startObjective } from "@/lib/playthroughs/validate";
import * as w from "@/lib/playthroughs/writes";
import { gateOf, mainOrder, questsData } from "@/lib/quests/data";
import { shortPage } from "@/lib/quests/reads";
import { leftOutLine, type Nevers } from "@/lib/quests/never";
import { openState, type PlayerState } from "@/lib/quests/open";
import { questHref } from "@/lib/quests/slugs";
import { stories, storyOfLine } from "@/lib/quests/stories-data";
import type { Story } from "@/lib/quests/story";
import type { Quest, QuestLine } from "@/lib/quests/types";
import { DEFAULT_VERSION, FactsError, versionData } from "./errors";
import { logCounts, questLog } from "./quest-log";
import { changesRun, neversOf, openForYou, playerState, type Told } from "./facts";
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
/** The character's address (WO-179): a run is a tab of its build. */
const characterLink = (p: Player, buildId: string | null, id: string, path = "") => (buildId ? `${p.origin}/b/${buildId}${path}` : link(p, id, path));

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
  if (input.kind === "place") {
    const pl = placeByName(want);
    if (pl) return { link: { kind: "place", id: pl.id }, name: placeLabel(pl) };
    const several = placesNamed(want);
    if (several.length > 1) throw new FactsError(`More than one place is called ${want}. Say which one: ${several.map(placeLabel).join("; ")}.`);
    throw new FactsError(`No place called ${want} in the planner's places index. The closest: ${names.closest(want, placeLinkables().map((x) => x.name)).join(", ")}. suggest_places lists the places near an act's towns; never invent one.`);
  }
  if (input.kind === "person") {
    const found = personLinkables().filter((x) => norm(x.name) === norm(want));
    if (found.length === 1) return { link: { kind: "person", id: found[0].id }, name: found[0].name };
    if (found.length > 1) throw new FactsError(`More than one person is called ${want}. Say which one: ${found.map((x) => `${x.name} (${x.where})`).join("; ")}.`);
    throw new FactsError(`No person called ${want} on the planner's people pages. The closest: ${names.closest(want, personLinkables().map((x) => x.name)).join(", ")}. Never invent one: leave the link out and use the player's own words.`);
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
  stop?: string;
  after?: string;
}

async function objectiveValues(pt: PlaythroughRecord, input: Omit<ObjectiveToolInput, "playthrough" | "act" | "after">) {
  const linked = input.link ? resolveLinkName(pt.gameVersion, input.link) : null;
  // A link to a quest is what the save reads when no quest is given (WO-123).
  const dw = doneWhenOf(pt.gameVersion, input.kind, input, null, linked?.link.kind === "quest" ? linked.link.id : null);
  return { text: input.text, kind: input.kind, link: linked?.link ?? null, ...dw, why: input.why ?? null, stop: input.stop ?? null };
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
  return { playthrough: pt.id, name: now.name, line: now.line, build: now.build ? { id: now.build.id, name: now.build.name } : null, link: characterLink(p, pt.build?.id ?? null, pt.id) };
}

/**
 * set_details' answers and never (WO-139 Parts 2 and 3), kept on the character's run: the playthrough named, or the run on
 * the build named. The whole list each time; an empty list clears it.
 */
export async function setAbout(p: Player, input: { playthrough?: string; build?: string; answers?: Answer[]; never?: Never[]; mods?: Mod[] }) {
  await writeGuard(p);
  let ref = input.playthrough;
  if (!ref) {
    const buildId = pickBuild(await myBuilds(p), input.build ?? "");
    const run = (await listMyPlaythroughs(p.userId)).find((r) => r.buildId === buildId);
    if (!run) throw new FactsError("The answers and never are kept on the character's run, and this build has none yet. Make it with create_playthrough (build), then set them, or name the playthrough.");
    ref = run.id;
  }
  const pt = await mine(p, ref);
  // An id that names nothing is refused before anything is saved.
  const nevers = input.never ? neversOf(input.never, pt.gameVersion) : null;
  await writes(() => w.setDetails(p.userId, pt.id, { answers: input.answers, never: input.never, mods: input.mods }));
  revalidatePath(`/p/${pt.id}`);
  const now = (await getPlaythrough(pt.id, p.userId))!;
  return { playthrough: pt.id, about: aboutOf(now), ...(now.mods?.length ? { mods: now.mods } : {}), ...(nevers?.items.some((n) => n.kind === "state" || n.kind === "own") ? { neverNote: NEVER_NOTE } : {}) };
}

/**
 * Who she is (WO-181): backstory, from, gods, goal, what she will and won't do and the grey areas. What is given replaces what was there; an
 * empty string or list takes it away. Refused with the reason when a line breaks a writing rule; nothing is cut.
 */
export async function setTheme(p: Player, input: { playthrough: string; backstory?: string; from?: string; gods?: string; goal?: string; will?: string[]; never?: string[]; grey?: string[] }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const { playthrough: _playthrough, ...theme } = input;
  void _playthrough;
  await writes(() => w.setTheme(p.userId, pt.id, theme));
  revalidatePath(`/b/${pt.build?.id ?? ""}`);
  revalidatePath(`/p/${pt.id}`);
  const now = (await getPlaythrough(pt.id, p.userId))!;
  return { playthrough: pt.id, who: themeOf(now), link: characterLink(p, pt.build?.id ?? null, pt.id) };
}

/** Who she is as get_playthrough and set_theme give it: only what is filled in; she won't is the never list in the player's words. */
export function themeOf(pt: Pick<PlaythroughRecord, "theme" | "never">) {
  const t = pt.theme ?? {};
  const wont = (pt.never ?? []).map((n) => n.words ?? n.what);
  return {
    ...(t.backstory ? { backstory: t.backstory } : {}),
    ...(t.from ? { from: t.from } : {}),
    ...(t.gods ? { gods: t.gods } : {}),
    ...(t.goal ? { goal: t.goal } : {}),
    ...(t.will?.length ? { will: t.will } : {}),
    ...(wont.length ? { never: wont } : {}),
    ...(t.grey?.length ? { grey: t.grey } : {}),
  };
}

const NEVER_NOTE = "The planner keeps to quest lines, stories, sides and kill (a quest whose objectives need a kill): suggest_quests and suggest_objective leave them out, get_quest says locked for this character, and get_playthrough warns. A state or the player's own line is kept and said back; keep to it yourself.";
const NEVER_KIND = { line: "a quest line", side: "a side in the war", state: "a state", kill: "never killing, read from each quest's objectives", own: "the player's own words" } as const;

/** The mods a character needs as get_playthrough lists them (WO-139 Part 4): required first, then recommended. */
export function modsOf(mods: readonly Mod[] | null | undefined): Mod[] {
  const { required, recommended } = modsInOrder(mods);
  return [...required, ...recommended];
}

/** The Before you design answers and the never list (WO-139), as get_playthrough and set_details give them. */
function aboutOf(pt: Pick<PlaythroughRecord, "answers" | "never" | "gameVersion">) {
  let kept: ReturnType<typeof neversOf>["items"] = [];
  try {
    kept = neversOf(pt.never, pt.gameVersion).items;
  } catch {
    // A line the data no longer knows: shown as the player's own words.
    kept = (pt.never ?? []).map((n) => ({ what: n.what, kind: "own" as const, says: n.words ?? n.what }));
  }
  return {
    answers: (pt.answers ?? []).map((a) => ({ question: a.question, answer: a.answer })),
    never: kept.map((n) => ({ what: n.what, is: n.line ? `${NEVER_KIND.line}: ${n.line.name}` : NEVER_KIND[n.kind], says: n.says, keptBy: n.kind === "line" || n.kind === "side" || n.kind === "kill" ? "the planner" : "you" })),
  };
}

export async function addAct(p: Player, input: { playthrough: string; name: string; levels: string; place: string; goal: string; standingRule?: string; passedBy?: PassedBy[]; route?: RouteStop[] }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const id = await writes(() => w.addAct(p.userId, pt.id, { name: input.name, levels: input.levels, place: input.place, goal: input.goal, standingRule: input.standingRule ?? null, passedBy: input.passedBy ?? null, route: input.route ?? null }));
  return { playthrough: pt.id, act: String(pt.view.acts.length + 1), actId: String(id), link: characterLink(p, pt.build?.id ?? null, pt.id) };
}

export async function setAct(p: Player, input: { playthrough: string; act: string; name?: string; levels?: string; place?: string; goal?: string; standingRule?: string | null; passedBy?: PassedBy[]; route?: RouteStop[] }) {
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const a = actOf(pt, input.act);
  await writes(() => w.setAct(p.userId, pt.id, a.id, { name: input.name, levels: input.levels, place: input.place, goal: input.goal, standingRule: input.standingRule, passedBy: input.passedBy, route: input.route }));
  // Objectives whose stop left the route go On the road (WO-129): say which, so they can be put back.
  const now = input.route !== undefined ? actOf((await getPlaythrough(pt.id, p.userId))!, String(pt.view.acts.indexOf(a) + 1)) : null;
  const onRoad = now && now.route?.length ? now.objectives.filter((o) => !o.stop).map((o) => o.text) : [];
  return { playthrough: pt.id, act: pt.view.acts.indexOf(a) + 1, saved: true, ...(onRoad.length ? { onTheRoad: onRoad, note: "These have no stop on the route: give each a stop (set_objective), or tell the player why it stays On the road." } : {}) };
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
  // A suggestion never sends her where the player said never (WO-139 Part 3); the player's own objective saves, with a warning.
  const never = neverTouch(neversOf(pt.never, pt.gameVersion), playerState({ never: pt.never }, pt.gameVersion), values.link, values.detect?.quest);
  if (never && suggestedBy) throw new FactsError(`Not suggested: ${never.what} is behind something this character won't do (${never.says}).`);
  const id = await writes(() => w.addObjective(p.userId, pt.id, a.id, values, { after, suggestedBy }));
  // Advice while drafting (WO-123 Part 2): it saves the same either way.
  const warnings = [
    ...reviewPlaythrough([{ id, text: values.text, kind: values.kind, link: values.link, reach: values.reach }]),
    ...reviewRoutes([{ n: a.n, route: a.route, objectives: [{ id, text: values.text, why: values.why, stop: values.stop, link: values.link, detect: values.detect }] }]),
    ...(never ? [{ code: "never", message: `Act ${a.n} ${a.name} sends this character to ${never.what} ("${values.text}"); ${never.says}.` }] : []),
  ];
  return {
    playthrough: pt.id,
    act: String(pt.view.acts.indexOf(a) + 1),
    objective: String(id),
    ...(suggestedBy ? { suggested: true, note: "It shows as suggested with Accept and Skip, and counts for nothing until the player accepts it." } : {}),
    ...(warnings.length ? { warnings: warnings.map(({ code, message }) => ({ code, message })) } : {}),
    // An ending that hands over a mount, a house, a follower or a lot of gold (WO-129 Part 6): the assistant reads it.
    ...(runChanges(values.detect?.quest ?? (values.link?.kind === "quest" ? values.link.id : null)) ?? {}),
  };
}

/** The run changes of a planner quest by its edid, as get_quest gives them; null for none. */
function runChanges(edid: string | null) {
  if (!edid) return null;
  const q = questsData().lines.flatMap((l) => l.quests).find((x) => x.edid === edid);
  return q ? changesRun(q) : null;
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
      ...(input.stop !== undefined ? { stop: input.stop.trim().toLowerCase() === "none" ? null : input.stop } : {}),
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
  if (!progressTracking()) throw new FactsError("Progress tracking is off for now.");
  await writeGuard(p);
  const pt = await mine(p, input.playthrough);
  const o = objectiveOf(pt, input.objective);
  await writes(() => w.setStatus(p.userId, pt.id, o.id, input.status));
  return { playthrough: pt.id, objective: o.id, status: input.status };
}

/** Only from the save (WO-112's helper): rule 18 forbids a value the assistant estimated. */
export async function setSnapshot(p: Player, input: { playthrough: string; source: "save"; label: string; level: number; xp?: number; day?: number; place?: string; skills: Record<string, number>; questStages?: Record<string, number>; counts?: Record<string, number> }) {
  if (!progressTracking()) throw new FactsError("Progress tracking is off for now.");
  await writeGuard(p);
  if (input.source !== "save") throw new FactsError("Only a save can set where the player stands, read on their PC. The player enters it by hand on the site.");
  const pt = await mine(p, input.playthrough);
  const d = versionData(pt.gameVersion);
  const skills = Object.fromEntries(Object.entries(input.skills ?? {}).map(([k, v]) => [names.skill(d, k), v]));
  await writes(() => w.setSnapshot(p.userId, pt.id, { source: "save", label: input.label, level: input.level, xp: input.xp ?? null, day: input.day ?? null, place: input.place ?? null, skills, questStages: input.questStages ?? null, counts: input.counts ?? null, readBy: p.clientName.slice(0, 80) }));
  return { playthrough: pt.id, saved: true, link: characterLink(p, pt.build?.id ?? null, pt.id) };
}

/** The playthrough in the plain shape the inputs use, each objective with how it stands. */
/** A playthrough's drafting warnings (WO-123 Part 2), each naming its objective by id. */
function warningsOf(pt: PlaythroughRecord) {
  return [
    ...reviewPlaythrough(pt.view.acts.flatMap((a) => a.objectives).map((o) => ({ id: o.id, text: o.text, kind: o.kind, link: o.link, reach: o.reach }))),
    // The act's road (WO-129 Part 3): a trip back, an objective at no stop, a destination the game doesn't name.
    ...reviewRoutes(pt.view.acts),
    // Something the player said she will never do (WO-139 Part 3).
    ...neverWarnings(pt),
    // A later act's gates the earlier acts don't reach (WO-148 item 6).
    ...reviewGates(pt.view.acts, gateWorld()),
  ];
}

/** The quest lines and what the stories say each needs to open, for the gate chain across acts (WO-148 item 6). */
export function gateWorld(): GateWorld {
  const opens = new Map<string, GateWorld["opens"] extends ReadonlyMap<string, infer V> ? V : never>();
  for (const s of stories()) for (const o of s.opens) opens.set(o.line, [...(opens.get(o.line) ?? []), ...o.needs.map((n) => ({ kind: n.kind, level: "level" in n ? n.level : undefined, line: "line" in n ? n.line : undefined, text: n.text }))]);
  return { lines: questsData().lines, opens };
}

/** What a quest or line an objective names runs into on the never list (WO-139 Part 3): its name and what to say, or null. */
function neverTouch(nv: Nevers, player: PlayerState, link: ObjectiveLink | null | undefined, quest: string | null | undefined): { what: string; says: string } | null {
  if (!nv.items.length) return null;
  const { byId } = questsData();
  if (link?.kind === "line" && nv.lines.has(link.id)) return { what: byId.get(link.id)?.name ?? link.id, says: nv.lines.get(link.id)! };
  const edid = quest ?? (link?.kind === "quest" ? link.id : null);
  const line = edid ? lineOfQuest(edid) : null;
  const q = line?.quests.find((x) => x.edid === edid);
  if (!line || !q) return null;
  if (nv.quests.has(q.edid)) return { what: q.name || line.name, says: nv.quests.get(q.edid)! };
  const open = openForYou(line, q, player);
  return "forCharacter" in open ? { what: q.name || line.name, says: open.because.join("; ") } : null;
}

/** Objectives, chapter unlocks and route stops that send the character where the player said never (WO-139 Part 3). */
export function neverWarnings(pt: Pick<PlaythroughRecord, "never" | "gameVersion" | "view">): { code: "never"; message: string }[] {
  if (!pt.never?.length) return [];
  let nv: Nevers;
  try {
    nv = neversOf(pt.never, pt.gameVersion);
  } catch {
    return [];
  }
  const player = playerState({ never: pt.never }, pt.gameVersion);
  const out: string[] = [];
  const touched = new Map<number, { what: string; says: string }>();
  for (const a of pt.view.acts) {
    for (const o of a.objectives) {
      const t = neverTouch(nv, player, o.link, o.detect?.quest);
      if (!t) continue;
      touched.set(o.id, t);
      out.push(`Act ${a.n} ${a.name} sends this character to ${t.what} ("${o.text}"); ${t.says}.`);
    }
    // A stop the route makes for a line she won't do: the stop's place or why names it.
    for (const r of a.route ?? []) {
      for (const [id, says] of nv.lines) {
        const name = (questsData().byId.get(id)?.name ?? "").replace(/^The /, "").toLowerCase();
        if (name && `${r.place} ${r.why}`.toLowerCase().includes(name)) out.push(`Act ${a.n} ${a.name}'s route stops at ${r.place} for ${questsData().byId.get(id)!.name}; ${says}.`);
      }
    }
  }
  for (const c of pt.view.chapters) {
    const t = c.kind === "beat" && c.inGame ? touched.get(c.inGame.id) : undefined;
    if (t) out.push(`The chapter ${c.title} unlocks when "${c.inGame!.text}" is done, at ${t.what}; ${t.says}.`);
  }
  return [...new Set(out)].map((message) => ({ code: "never" as const, message }));
}

/**
 * suggest_places (WO-128 Part 2): the places near where an act goes, each with what in the game points at it and when it
 * fits the act's levels, and what the playthrough already uses. Read-only.
 */
export async function suggestPlaces(p: Player, input: { playthrough?: string; act?: string; where?: string; levels?: string }) {
  // Without a stored act (WO-148 item 3): a town, a hold or a place, and the levels, for places near Solitude at 15 to 20.
  if (!input.playthrough && !input.act) return placesAt(input.where, input.levels);
  if (!input.playthrough || !input.act) throw new FactsError("Name the playthrough and the act together, or give where and levels instead.");
  const pt = await mine(p, input.playthrough);
  const a = actOf(pt, input.act);
  const at = pt.view.acts.indexOf(a);
  // Its route's stops too (WO-129): the towns and places she goes through.
  const towns = actTowns(pt.view.acts, at, (a.route ?? []).map((r) => r.place));
  const linked = pt.view.acts.flatMap((x) =>
    x.objectives.flatMap((o) => {
      if (o.link?.kind !== "place") return [];
      const pl = placesData().places.find((y) => y.id === o.link!.id);
      return pl ? [{ place: pl.name, act: `Act ${x.n} ${x.name}`, type: placeType(pl.type), town: pl.nearestTown?.town ?? null }] : [];
    }),
  );
  const passedBy = pt.view.acts.flatMap((x) => (x.passedBy ?? []).map((b) => ({ place: b.place, act: `Act ${x.n} ${x.name}`, why: b.why })));
  const places = towns.length ? placesNear(towns, a.levelFrom, a.levelTo, { linked, passedBy }) : [];
  // A town no place in the index is nearest to yet (WO-128 Part 1's town list, 22 Oct): said, never guessed around.
  const notMeasured = unmeasured(towns);
  return {
    playthrough: pt.id,
    act: `Act ${a.n} ${a.name}`,
    levels: levelsInput(a.levelFrom, a.levelTo),
    towns,
    places,
    alreadyUsed: { linked, passedBy },
    ...(notMeasured.length ? { notMeasuredYet: notMeasured, notMeasuredNote: `The places index doesn't measure distances from ${notMeasured.join(" or ")} yet, so it has no places near ${notMeasured.length === 1 ? "it" : "them"}. Don't guess at places there: say so, and use the game's own quests.` } : {}),
    note: towns.length
      ? "Pick a few that fit what she cares about and her reason to travel, and leave most of them alone (rule 20). Tie each to a person in one of these towns, in the game's own words when a place has a pointer. Plant a place above the act's levels now and pay it off later. Vary the people and the kinds of place against alreadyUsed, and name what she passes by (set_act passedBy)."
      : "The act names no town the places index knows: set its place to the town it's in (set_act), or link its quests.",
  };
}

/** get_quest_log (WO-134): the stored save's quests in the game's words, from where the player stands. */
/**
 * suggest_places for a place and levels, with no stored act (WO-148 item 3): where is a town, a hold (every town in it) or a
 * place (the town nearest it); levels is "15 to 20". The same places, pointers and fit as for an act; nothing is used yet.
 */
export function placesAt(where: string | undefined, levels: string | undefined) {
  if (!where?.trim()) throw new FactsError('Give where (a town, a hold or a place: "Solitude", "Haafingar") and levels ("15 to 20"), or a playthrough and an act.');
  const lv = parseLevels(levels ?? "");
  if (typeof lv === "string") throw new FactsError(levels ? lv : 'Give the levels too: "15 to 20".');
  const hold = holdNamed(where);
  const named = townsIn(where);
  const place = placeByName(where);
  const towns = hold ? hold.towns : named.length ? named : place?.nearestTown ? [place.nearestTown.town] : [];
  if (!towns.length) throw new FactsError(`No town, hold or place called ${where} in the places index. Towns and holds: Solitude, Whiterun, Riften, Windhelm, Markarth, Falkreath, Winterhold, Dawnstar, Morthal; the holds Haafingar, Hjaalmarch, the Pale, the Reach, Eastmarch, the Rift.`);
  const notMeasured = unmeasured(towns);
  return {
    where: hold ? `${hold.name}, a hold` : where,
    levels: levelsInput(lv.from, lv.to),
    towns,
    places: placesNear(towns, lv.from, lv.to, { linked: [], passedBy: [] }),
    ...(notMeasured.length ? { notMeasuredYet: notMeasured, notMeasuredNote: `The places index doesn't measure distances from ${notMeasured.join(" or ")} yet.` } : {}),
    note: "Pick a few that fit what she cares about, and leave most of them alone (rule 20). Nothing here is on a playthrough yet.",
  };
}

export async function getQuestLog(p: Player, input: { playthrough: string }) {
  const pt = await mine(p, input.playthrough);
  return { playthrough: pt.id, ...questLog(pt.snapshot, pt.build?.levels, p.origin) };
}

export async function getPlaythroughTool(p: Player, input: { playthrough: string }) {
  return playthroughOut(p, await mine(p, input.playthrough));
}

/** A playthrough as get_playthrough gives it, in the plain shape the inputs use. Pure of the database, so the player's questions can read it. */
export function playthroughOut(p: Player, pt: PlaythroughRecord) {
  const v = pt.view;
  const warnings = warningsOf(pt);
  const shown = { save: "done, from the save", hand: "done, ticked by the player", doing: "under way", todo: "to do", later: "later", suggested: "suggested, waiting for the player" } as const;
  return {
    playthrough: pt.id,
    name: pt.name,
    line: pt.line,
    visibility: pt.visibility,
    link: characterLink(p, pt.build?.id ?? null, pt.id),
    // The character's build (WO-114): its id, name, cover and levels.
    build: pt.build ? { id: pt.build.id, name: pt.build.name, cover: pt.build.coverImageUrl, levels: pt.build.levels, link: `${p.origin}/b/${pt.build.id}` } : null,
    draftedByAnAssistant: !!pt.draftedBy,
    // Before you design (WO-139): the player's answers and what she will never do.
    ...(pt.answers?.length || pt.never?.length ? { about: aboutOf(pt) } : {}),
    // Who she is (WO-181): backstory, from, gods, goal, what she will and won't do, the grey areas.
    ...(Object.keys(themeOf(pt)).length ? { who: themeOf(pt) } : {}),
    // The mods this character needs (WO-139 Part 4), required first.
    ...(pt.mods?.length ? { mods: modsOf(pt.mods) } : {}),
    ...(progressTracking() ? { done: `${v.done} of ${v.total}` } : {}),
    whereYouStand: pt.snapshot
      ? {
          from: pt.snapshot.source === "save" ? pt.snapshot.label : "the player, by hand",
          level: pt.snapshot.level,
          day: pt.snapshot.day,
          place: pt.snapshot.place,
          skills: pt.snapshot.skills,
          // The quest log in a line (WO-134); get_quest_log gives it in full.
          ...(logCounts(pt.snapshot) ? { quests: `${logCounts(pt.snapshot)} (get_quest_log lists them)` } : {}),
        }
      : null,
    acts: v.acts.map((a, i) => ({
      act: String(i + 1),
      name: a.name,
      levels: levelsInput(a.levelFrom, a.levelTo),
      place: a.place,
      goal: a.goal,
      ...(a.standingRule ? { standingRule: a.standingRule } : {}),
      // The places she leaves alone on purpose (WO-128).
      ...(a.passedBy?.length ? { passedBy: a.passedBy.map((b) => ({ place: b.place, why: b.why })) } : {}),
      // Its road (WO-129): the stops in order, each with why she goes there next.
      ...(a.route?.length ? { route: a.route.map((r, i) => ({ place: r.place, why: r.why, ...(r.by === "carriage" ? { by: r.by } : {}), ...(missivesAt(r.place, a.route![i + 1]?.place) ? { missives: missivesAt(r.place, a.route![i + 1]?.place) } : {}) })) } : {}),
      objectives: a.objectives.map((o) => ({
        objective: String(o.id),
        text: o.text,
        kind: o.kind,
        ...(o.linkShown ? { link: { kind: o.link!.kind, name: o.linkShown.name } } : {}),
        // A quest it links to has a page of its own (WO-147).
        ...(o.link?.kind === "quest" && questHref(o.link.id) ? { page: `${p.origin}${questHref(o.link.id)}` } : {}),
        // The same flat fields add_objective takes, so an objective can go back unchanged (WO-111b).
        ...(o.kind === "reach" && o.reach ? { reachKey: reachLabel(o.reach.key), reachTarget: o.reach.target } : o.detect ? { quest: o.detect.quest, ...(o.detect.stage !== undefined ? { stage: o.detect.stage } : {}) } : {}),
        // Ticks from your save (WO-123): every objective can also be ticked by the player.
        fromSave: o.doneBy === "save",
        ...(o.why ? { why: o.why } : {}),
        ...(o.stop ? { stop: o.stop } : {}),
        ...(progressTracking() ? { status: shown[o.worked.shown] } : {}),
      })),
    })),
    ...(warnings.length ? { warnings } : {}),
  };
}

/**
 * A route stop with a Missives board that sends her on to another town (WO-148 item 7, rule 37): the stop says to read its board for
 * notes addressed to the next. Null when the stop has no board, or nothing follows it.
 */
export function missivesAt(place: string, next: string | undefined): string | null {
  if (!next) return null;
  const boards = questsData().byId.get("missives")?.board?.boards ?? [];
  const here = townsIn(place).find((t) => boards.includes(t));
  // Not the same town again under a longer name ("Riften", then "Riften Mistveil Keep").
  const there = townsIn(next).find((t) => !here || (!t.toLowerCase().includes(here.toLowerCase()) && !here.toLowerCase().includes(t.toLowerCase())));
  return here && there ? `Read ${here}'s board for notes addressed to ${there}.` : null;
}

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
  // Assistants can't add images (WO-118): the player adds a cover from this link, at the cover in Details;
  // the story's images are theirs too, in its Story tab.
  const addCover = pt.buildId ? `${p.origin}/b/${pt.buildId}/setup?step=name#cover` : null;
  if (issues.length) return { ready: false, issues, addCover };
  // Warnings still standing (WO-123 Part 2): never a refusal, but the assistant answers for them.
  const warnings = warningsOf(pt);
  return {
    ready: true,
    link: characterLink(p, pt.build?.id ?? null, pt.id),
    addCover,
    ...(warnings.length ? { warnings, warningsNote: "Fix these or tell the player why you left them." } : {}),
    message: `Ready: open ${characterLink(p, pt.build?.id ?? null, pt.id)} to read it, tick what's done and publish.${addCover ? ` The cover is the player's to add: ${addCover}` : ""}`,
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
  let never: Never[] | null = null;
  if (input.playthrough && userId) {
    const pt = await getPlaythrough(input.playthrough, userId);
    if (pt) {
      level ??= pt.snapshot?.level ?? null;
      // What she will never do (WO-139 Part 3): the quest tools keep to it.
      never = pt.never ?? null;
      stages = { ...(pt.snapshot?.questStages ?? {}) };
      for (const o of pt.view.acts.flatMap((a) => a.objectives)) {
        if (!o.worked.done) continue;
        if (o.link && (o.link.kind === "quest" || o.link.kind === "line" || o.link.kind === "follower")) done.push(o.link.id);
      }
    }
  }
  return { level, done, stages, never };
}

/**
 * Where a story starts, for suggest_quests' where (WO-130): its giver's place, its opening quest's places and its first start
 * line; not every place a start's text names. A quest you start by reading something starts where the thing is (WO-131
 * Part 2), and nowhere while no one has placed it.
 */
export function startsAt(line: Pick<QuestLine, "where" | "giver">, first: Pick<Quest, "start">, startText?: string): (string | null | undefined)[] {
  const ways = first.start?.ways ?? [];
  if (ways.length && ways.every((w) => w.whereIs || w.unplaced)) return ways.flatMap((w) => w.whereIs ?? []);
  const named = [line.where, line.giver?.place, first.start?.where, ...ways.map((w) => w.where), startText];
  // The towns it starts in, and the city each place named sits in (WO-142 item 5): "Blue Palace" is a thing to do in Solitude.
  return [...named, ...(first.start?.towns ?? []), ...citiesOf(named)];
}

/**
 * A shelf's places (WO-148 Part 2): where each of its own quests starts, never the curated place or the giver of its first quest standing
 * for the lot (Markarth Side's "South-east of Dragon Bridge" put a shelf in the Reach under Haafingar).
 */
export function shelfPlaces(line: Pick<QuestLine, "quests">): string[] {
  const texts = line.quests.flatMap((q) => [q.start?.where, ...(q.start?.ways ?? []).flatMap((w) => [w.where, ...(w.whereIs ?? [])]), ...(q.start?.towns ?? [])]).filter((t): t is string => !!t);
  return [...texts, ...citiesOf(texts)];
}

/**
 * suggest_quests: stories whose starts are checked in the game files and whose first quest is open for
 * the player (WO-115 Part 3: never one the planner can't judge), not done, each with its checked start,
 * why it's open, and the planner's link.
 */
export async function suggestQuests(origin: string, input: { level: number; where?: string; done?: string[]; playthrough?: string }, userId: string | null) {
  return suggestFrom(origin, input, await toldOf(input, userId));
}

/** How a suggested quest starts, in words, never nothing (WO-148 item 2). */
function startFor(s: Story | undefined, line: QuestLine, first: Quest): string {
  const told = s?.start.filter((x) => x.checked === "files").map((x) => x.text)[0];
  if (told) return told;
  // A shelf is separate jobs: no one start is the shelf's.
  if (line.category === "work") return "Separate jobs; open one for how it starts.";
  const read = first.source === "reads" ? first.read?.starts?.find((x) => x.how)?.how : undefined;
  if (read) return read;
  const ways = first.start?.ways ?? [];
  const way = ways[0]?.how ?? first.start?.needs?.[0];
  if (way) return ways.length > 1 ? `${way} (${ways.length - 1} other way${ways.length === 2 ? "" : "s"})` : way;
  return line.start ?? `${first.name}'s start is checked: ask about the quest for how it starts.`;
}

/** suggest_quests on what the player told the planner, playthrough read: the tests ask it with a never list of their own. */
export function suggestFrom(origin: string, input: { level: number; where?: string }, told: Told) {
  const { byId } = questsData();
  const player = playerState(told);
  // Stories behind something the character will never do (WO-139 Part 3): left out, and said once.
  const nevers = neversOf(told.never);
  const leftOut = stories().flatMap((s) => {
    const line = byId.get(s.line);
    if (!line) return [];
    if (nevers.lines.has(line.id)) return [nevers.lines.get(line.id)!];
    const first = line.quests.find((q) => q.edid === line.opening) ?? line.quests[0];
    const open = openForYou(line, first, player);
    return "forCharacter" in open ? open.because : [];
  });
  const order = mainOrder().map((q) => q.edid);
  const where = input.where?.trim().toLowerCase();
  // A hold is every town in it (WO-148 item 1).
  const terms = input.where ? whereTerms(input.where) : [];
  // The stories first; with a place asked for, the quest lines that have no story after them (WO-142 item 5): six stories
  // leave most towns with nothing (none starts in Solitude), and a line's opening quest is judged the same way.
  const candidates: { s: Story | undefined; line: QuestLine | undefined }[] = [
    ...stories().map((s) => ({ s: s as Story | undefined, line: byId.get(s.line) })),
    ...(where ? questsData().lines.filter((l) => !storyOfLine(l.id)).map((line) => ({ s: undefined, line })) : []),
  ];
  const out = candidates
    // A story's line is checked by its story's check; a plain line by its opening quest's start, which openForYou asks for.
    .filter(({ s, line }) => line && (!s || line.checked.start === "files") && !nevers.lines.has(line.id) && !line.quests.every((q) => player.done.has(q.edid)))
    .filter(({ line }) => openState(gateOf(line!), { level: input.level, mainAt: null, finished: told.done ?? [] }, order) === "open")
    .map(({ s, line }) => {
      const first = line!.quests.find((q) => q.edid === line!.opening) ?? line!.quests[0];
      return { s, line: line!, first, open: openForYou(line!, first, player) };
    })
    .filter(({ open }) => open.state === "open")
    // Where it starts (WO-130): the giver's place, its opening quest's places, and its first start; not every place a
    // start's text names (Join the Dark Brotherhood starts with Aventus in Windhelm, though a later line names Riften).
    .filter(({ s, line, first }) => !where || (line.category === "work" ? shelfPlaces(line) : startsAt(line, first, s?.start[0]?.text)).some((t) => terms.some((w) => t?.toLowerCase().includes(w))))
    .slice(0, 12)
    .map(({ s, line, first, open }) => ({
      ...(s ? { story: s.id } : {}),
      kind: s ? "story" : "quest line",
      name: s ? s.name : line.name,
      line: line.name,
      // Never null (WO-148 item 2): the story's own checked start, else the opening quest's first way as get_quest gives it, else
      // the line's, else what a shelf is.
      start: startFor(s, line, first),
      // The opening quest's page in short (WO-154): can I do it, what I need, how to start, what I get.
      ...shortPage(first),
      checked: "files",
      firstQuest: first.name,
      openForYou: open.says,
      link: `${origin}/quests/${line.id}`,
    }));
  const left = leftOutLine(leftOut.length, leftOut);
  return {
    level: input.level,
    suggestions: out,
    ...(left ? { leftOut: left } : {}),
    note: out.length
      ? "Each is open for the player by the planner's checked starts. Offer them as suggestions; nothing is added unless they accept. Don't offer a quest the planner hasn't answered open for."
      : "No checked story is open for the player at that level and place.",
  };
}
