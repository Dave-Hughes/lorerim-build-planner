import type { ChapterKind, Detect, DoneBy, ObjectiveKind, ObjectiveStatus, Reach } from "./types";

/**
 * Done is worked out, not only stored (WO-111): a `save` objective is done when the snapshot's quest
 * stages show it, a `reach` one when the snapshot's number meets the target, a `hand` one when the
 * player ticked it. A suggestion counts for nothing until the player accepts it.
 *
 * WO-111a: a done-once `save` objective (a quest stage) can be ticked by the player too, until a
 * snapshot shows the stage; then the save's word takes over. A snapshot that doesn't show it yet
 * leaves the tick alone, since the save may be older than the tick.
 *
 * WO-123: every objective, done once or reach a number, can be ticked by hand. `doneBy` is the switch
 * Ticks from your save: `save` reads it from the save too (a quest stage, a level, a skill, a count),
 * `hand` leaves it to the tick. Either counts.
 */

export interface SnapshotValues {
  level: number;
  skills: Record<string, number>;
  questStages?: Record<string, number> | null;
  counts?: Record<string, number> | null;
}

export interface ObjectiveFacts {
  kind: ObjectiveKind;
  doneBy: DoneBy;
  detect?: Detect | null;
  reach?: Reach | null;
  status: ObjectiveStatus;
  accepted: boolean;
}

/** How a reach key reads: "Level", "Speech", "books read". */
export function reachLabel(key: string): string {
  if (key === "level") return "Level";
  if (key.startsWith("skill:")) return key.slice(6);
  if (key.startsWith("count:")) return key.slice(6);
  return key;
}

/** The snapshot's value for a reach key, or null when it doesn't have one. */
export function reachValue(snap: SnapshotValues | null | undefined, key: string): number | null {
  if (!snap) return null;
  if (key === "level") return snap.level;
  if (key.startsWith("skill:")) return snap.skills[key.slice(6)] ?? null;
  if (key.startsWith("count:")) {
    // The save's counts are lower case ("lute"); an objective's label may not be ("Lute").
    const want = key.slice(6).toLowerCase();
    const hit = Object.entries(snap.counts ?? {}).find(([k]) => k.toLowerCase() === want);
    return hit ? hit[1] : null;
  }
  return null;
}

/** The counts a save gives (WO-123 Part 3): Skyrim's Got Talent's lute skill, as "lute". */
export const SAVE_COUNTS = ["lute"] as const;

/** Whether a save can give a reach key's number: the level, a skill, or one of SAVE_COUNTS. */
export function saveGives(key: string): boolean {
  if (key === "level" || key.startsWith("skill:")) return true;
  return key.startsWith("count:") && (SAVE_COUNTS as readonly string[]).includes(key.slice(6).toLowerCase());
}

export type Shown = "save" | "hand" | "doing" | "todo" | "later" | "suggested";

export interface Worked {
  done: boolean;
  /** How the row says it: Done, from your save | Done, ticked by you | Under way | To do | Later | Suggested. */
  shown: Shown;
  /** For `reach`: the value and the target, for the meter. */
  meter?: { value: number | null; target: number; label: string };
}

/** Every objective can be ticked by hand (WO-123): its own, a quest stage, a number. */
export function canTickByHand(): boolean {
  return true;
}

/** Whether an objective is linked to something the save can read (WO-123): a quest, or a number to reach. */
export function readsFromSave(o: Pick<ObjectiveFacts, "kind" | "detect" | "reach">): boolean {
  return o.kind === "reach" ? !!o.reach : !!o.detect;
}

export function workOut(o: ObjectiveFacts, snap: SnapshotValues | null | undefined): Worked {
  const meter = o.kind === "reach" && o.reach ? { value: reachValue(snap, o.reach.key), target: o.reach.target, label: reachLabel(o.reach.key) } : undefined;
  if (!o.accepted) return { done: false, shown: "suggested", meter };
  let done = false;
  if (o.doneBy !== "save") done = false;
  else if (o.kind === "reach" && o.reach && meter && meter.value !== null) done = meter.value >= o.reach.target;
  else if (o.kind === "once" && o.doneBy === "save" && o.detect) {
    const stage = snap?.questStages?.[o.detect.quest];
    done = stage !== undefined && (o.detect.stage === undefined || stage >= o.detect.stage);
  }
  if (done) return { done, shown: "save", meter };
  if (o.status === "done") return { done: true, shown: "hand", meter };
  const shown: Shown = o.status === "later" ? "later" : o.status === "doing" || (meter?.value ?? 0) > 0 ? "doing" : "todo";
  return { done: false, shown, meter };
}

/**
 * Whether a piece of the tale is open: one tied to an objective once that objective is done, chapters and entries as well
 * as beats (WO-124: a chapter could be read before what it tells had happened); one tied to none, always.
 */
export function isOpen(c: { kind: ChapterKind; opensAfter: number | null }, doneIds: ReadonlySet<number>): boolean {
  if (c.opensAfter === null) return true;
  return doneIds.has(c.opensAfter);
}

/** Words that make a line a standing rule, not an objective (rule 14). */
const STANDING = /\b(every|each|always|whenever)\b/i;
const STARTS = /^\s*(keep|always|never)\b/i;

export const RULE_14 = "An objective is one thing you can know is done. Make it a number (\"Read 10 books\") or put it under the act's Throughout the act.";

/** Rule 14's refusal for an objective, or null when it's one the player can know is done. */
export function objectiveRefusal(text: string, kind: ObjectiveKind, reach?: Reach | null): string | null {
  if (STARTS.test(text) || STANDING.test(text)) return RULE_14;
  if (kind === "reach" && !reach) return RULE_14;
  // A done-once objective needs no "done when" (WO-123): the player can always tick it.
  return null;
}
