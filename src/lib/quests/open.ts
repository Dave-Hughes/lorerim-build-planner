/**
 * Where you are, and what's open to you (WO-100). Pure: the pages and the tests share it.
 *
 * A line is open when its minLevel is at most your level, every line in its `after` is finished,
 * and, for the main quest, yours is at or past its `mainQuestAt`. A line that needs part of the main
 * quest with no `mainQuestAt` doesn't block. With no level entered, nothing is open or locked.
 */
import type { LineGate } from "./types";

export const MAIN = "main-quest";

export interface Where {
  level: number | null;
  /** The main quest quest you're done up to (its EDID), or null for not started. */
  mainAt: string | null;
  /** Finished lines, by id. */
  finished: string[];
}

export const NOWHERE: Where = { level: null, mainAt: null, finished: [] };

/** Whether you're done with the main quest through `edid`, given the main quest's quests in order. */
export function mainDone(where: Where, edid: string, mainOrder: string[]): boolean {
  if (!where.mainAt) return false;
  const at = mainOrder.indexOf(where.mainAt);
  const need = mainOrder.indexOf(edid);
  return at >= 0 && need >= 0 && at >= need;
}

export type Need =
  | { kind: "level"; level: number; ok: boolean }
  | { kind: "line"; id: string; ok: boolean }
  | { kind: "main"; edid: string; ok: boolean }
  | { kind: "main-unchecked" };

/** A line's needs, each checked against where you are. */
export function needsOf(line: LineGate, where: Where, mainOrder: string[]): Need[] {
  const out: Need[] = [];
  if (line.minLevel) out.push({ kind: "level", level: line.minLevel, ok: where.level !== null && where.level >= line.minLevel });
  for (const a of line.after) {
    if (a === MAIN) out.push(line.mainQuestAt ? { kind: "main", edid: line.mainQuestAt, ok: mainDone(where, line.mainQuestAt, mainOrder) } : { kind: "main-unchecked" });
    else out.push({ kind: "line", id: a, ok: where.finished.includes(a) });
  }
  return out;
}

/** "open", "locked", or null when no level is entered (nothing is counted then). */
export function openState(line: LineGate, where: Where, mainOrder: string[]): "open" | "locked" | null {
  if (where.level === null) return null;
  return needsOf(line, where, mainOrder).every((n) => n.kind === "main-unchecked" || n.ok) ? "open" : "locked";
}

/** Reads a stored Where leniently: anything odd falls back to nothing entered. */
export function parseWhere(raw: string | null | undefined): Where {
  try {
    const v = JSON.parse(raw ?? "null") as Partial<Where> | null;
    if (!v || typeof v !== "object") return NOWHERE;
    const level = typeof v.level === "number" && Number.isFinite(v.level) && v.level >= 1 && v.level <= 999 ? Math.floor(v.level) : null;
    return {
      level,
      mainAt: typeof v.mainAt === "string" ? v.mainAt : null,
      finished: Array.isArray(v.finished) ? v.finished.filter((f): f is string => typeof f === "string") : [],
    };
  } catch {
    return NOWHERE;
  }
}

/* ---------- One quest, open for you (WO-115 Part 3) ---------- */

/** What the planner knows of the player, for one quest's needs. */
export interface PlayerState {
  level: number | null;
  /** Quests finished, by EDID: told by the player, ticked in a playthrough, or a whole line done. */
  done: ReadonlySet<string>;
  /** The highest stage the save shows for a quest, by EDID (WO-112); empty until a save carries them. */
  stages: Readonly<Record<string, number>>;
}

export type OpenState = "open" | "locked" | "unknown";

/** Each quest's EDIDs by name, lower case (two quests can share a name: Season Unending). */
export type QuestNames = ReadonlyMap<string, string[]>;

type Verdict = { ok: true } | { ok: false; why: string } | { ok: null; why: string };
const MET: Verdict = { ok: true };
const unknown = (why: string): Verdict => ({ ok: null, why });

/** A quest named in a need, as far as the planner knows it: done, its highest stage, or nothing. */
function progress(name: string, names: QuestNames, p: PlayerState): { known: boolean; done: boolean; stage: number | null; found: boolean } {
  const edids = names.get(name.trim().toLowerCase()) ?? [];
  const done = edids.some((e) => p.done.has(e));
  const stages = edids.map((e) => p.stages[e]).filter((n): n is number => typeof n === "number");
  const stage = stages.length ? Math.max(...stages) : null;
  return { found: edids.length > 0, done, stage, known: done || stage !== null };
}

/** One need in the start check's words, against the player: met, not met (and why), or can't tell. */
function judge(need: string, names: QuestNames, p: PlayerState): Verdict {
  const n = need.trim();
  let m: RegExpExecArray | null;
  if ((m = /^Level (\d+)$/.exec(n))) {
    const at = Number(m[1]);
    if (p.level === null) return unknown(`needs level ${at}, and no level is given`);
    return p.level >= at ? MET : { ok: false, why: `needs level ${at}` };
  }
  if (n.startsWith("One of: ")) return judgeAny(n.slice(8).split(/; or /), names, p);
  // Chained starts: "Through X, which starts from: ..." is open when what it starts from is.
  if ((m = /^Through .+?, which starts from: (.+)$/.exec(n))) return judgeAny(m[1].split(/; or /), names, p);
  if (n === "It runs from the start of the game") return MET;
  // Reading something is a way in (WO-137), with its own needs in brackets (Deathbrand's book needs level 20). Where the
  // thing is, or that no one has placed it, is judged from the ways below.
  if (/^Read /.test(n)) {
    const inner = /\(([^()]+)\)$/.exec(n);
    return inner ? judgeAll(inner[1].split(/[;,] /), names, p) : MET;
  }
  // By itself, or from something placed (a trigger, a board: WO-137 item 6): a way in, not a need. Its own needs, in
  // brackets, still count (Deathbrand's level-up start needs level 20).
  if (n.startsWith("It starts by itself") || n.startsWith("It starts from")) {
    const inner = /\(([^()]+)\)$/.exec(n);
    return inner ? judgeAll(inner[1].split(/[;,] /), names, p) : MET;
  }
  // A way in by talking: open, unless it carries needs of its own in brackets.
  if (/^(Ask|Talk to) /.test(n) && !/the records don't name/.test(n)) {
    const inner = /\(([^()]+)\)$/.exec(n);
    return inner ? judgeAll(inner[1].split(/; /), names, p) : MET;
  }
  // Quest progress: past a stage, at a stage, completed, or not yet past one.
  const past = /^After (.+) \(its stage (\d+)\)$/.exec(n) ?? /^(.+) stage (\d+) done$/.exec(n);
  const ge = /^(.+) stage (>=|>) (\d+)$/.exec(n);
  const completed = /^(.+) completed$/.exec(n);
  if (past || ge || completed) {
    const quest = (past ?? ge ?? completed)![1];
    const at = past ? Number(past[2]) : ge ? Number(ge[3]) + (ge[2] === ">" ? 1 : 0) : null;
    const q = progress(quest, names, p);
    if (!q.found) return unknown(`needs ${n}, a quest the planner can't find`);
    if (q.done) return MET;
    if (at !== null && q.stage !== null) return q.stage >= at ? MET : { ok: false, why: `needs ${quest} past stage ${at}` };
    if (at === null && q.stage !== null) return { ok: false, why: `needs ${quest} finished` };
    return unknown(`needs ${completed ? `${quest} finished` : `${quest} (stage ${at})`}, and the planner hasn't been told how far that is`);
  }
  const before = /^(.+) stage (<|<=|!=) (\d+)/.exec(n) ?? /^(.+) stage (\d+) not done$/.exec(n);
  if (before) {
    const quest = before[1];
    const op = before.length === 4 ? before[2] : "<";
    const at = Number(before.length === 4 ? before[3] : before[2]);
    const q = progress(quest, names, p);
    if (q.stage !== null) {
      const ok = op === "<" ? q.stage < at : op === "<=" ? q.stage <= at : q.stage !== at;
      return ok ? MET : { ok: false, why: `only before ${quest} reaches stage ${at}` };
    }
    if (q.done && op !== "!=") return { ok: false, why: `only before ${quest} is far along, and it's done` };
    return unknown(`only while ${quest} is before stage ${at}, and the planner hasn't been told how far that is`);
  }
  return unknown(n.startsWith("a condition") ? "a condition the start check can't name yet" : `needs ${n}`);
}

function judgeAll(needs: string[], names: QuestNames, p: PlayerState): Verdict {
  const v = needs.map((x) => judge(x, names, p));
  return v.find((x) => x.ok === false) ?? v.find((x) => x.ok === null) ?? MET;
}

function judgeAny(ways: string[], names: QuestNames, p: PlayerState): Verdict {
  const v = ways.map((x) => judge(x, names, p));
  if (v.some((x) => x.ok === true)) return MET;
  return v.find((x) => x.ok === null) ?? v[0] ?? unknown("no way in the start check could name");
}

/** What a way in says for a condition the planner can't word yet (WO-126's UNSAID, in quest_pages.py). */
const UNNAMED = /can't put in words yet/;

// A reason the judge read from the record form (a condition function, a comparison, a global, an editor id, a helper's
// record name): never said to a player or an assistant (WO-136, Bob 22 Oct). It reads as the condition it can't word.
const RECORD = /\b(Get[A-Z]\w*|Is[A-Z][a-z]\w*|Has[A-Z]\w*|fn\d+)\b|==|!=|\bglobal \w|[A-Za-z]+_[A-Za-z]|\(named "|\bthe speaker\b|\.es[mpl]:/;
const SAID = "a condition the planner can't put in words yet";
const plainWhy = (why: string) => (RECORD.test(why) ? SAID : why);

/**
 * Whether one quest is open for the player (WO-115 Part 3), from its checked needs against what the
 * planner knows of them. Any need not met makes it locked; any need the planner can't judge makes it
 * unknown, never open; a start not checked yet is unknown; and a quest past its line's first is
 * unknown until the planner knows the one before it is done.
 */
export function openFor(
  quest: { start?: { needs?: string[]; ways?: { needs?: string[]; unplaced?: string }[]; checked: string; raw?: { needs: string[] } } },
  p: PlayerState,
  names: QuestNames,
  /** The quest before it in its line, if it isn't the line's first: a talk that opens it can hang on that one, in ways the check can't see. */
  prior: { edid: string; name: string } | null = null,
): { state: OpenState; because: string[] } {
  // Traced in the files, or confirmed by the answer key (WO-136 ruling 2).
  if (!quest.start || (quest.start.checked !== "files" && quest.start.checked !== "uesp")) return { state: "unknown", because: ["the start isn't checked yet"] };
  // The record form (WO-126): the words are for players, the stages and counts for judging.
  const verdicts = (quest.start.raw?.needs ?? quest.start.needs ?? []).map((n) => judge(n, names, p));
  if (prior && !p.done.has(prior.edid)) verdicts.push(unknown(`comes after ${prior.name || prior.edid}, and the planner hasn't been told that's done`));
  const no = [...new Set(verdicts.filter((v): v is { ok: false; why: string } => v.ok === false).map((v) => plainWhy(v.why)))];
  if (no.length) return { state: "locked", because: no };
  const cant = [...new Set(verdicts.filter((v): v is { ok: null; why: string } => v.ok === null).map((v) => plainWhy(v.why)))];
  if (cant.length) return { state: "unknown", because: cant };
  // Every way in, as a player reads it, still waits on a condition the planner can't word (WO-130 follow-up: Caught Red
  // Handed, which also runs from the start of the game, so its needs say nothing): never a bare open. A way whose only
  // unnamed part is where the speaker stands as the line plays has none (A Chance Arrangement's ring line).
  const ways = quest.start.ways ?? [];
  // Every way in is reading something no one has placed (WO-131 Part 2): the player can't act on it, so never open.
  if (ways.length && ways.every((w) => w.unplaced)) return { state: "unknown", because: ways.map((w) => w.unplaced!.replace(/\.$/, "").replace(/^W/, "w")) };
  if (ways.length && ways.every((w) => (w.needs ?? []).some((n) => UNNAMED.test(n)))) return { state: "unknown", because: ["one condition on every way in isn't named yet"] };
  return { state: "open", because: [] };
}


/** Every quest's EDIDs by lower-case name. */
export function questNames(quests: { edid: string; name: string }[]): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const q of quests) {
    if (!q.name) continue;
    const k = q.name.toLowerCase();
    const at = out.get(k) ?? [];
    if (!at.includes(q.edid)) at.push(q.edid);
    out.set(k, at);
  }
  return out;
}
