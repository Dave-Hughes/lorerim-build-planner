/**
 * A playthrough's parts (WO-111), shared by the tables, the pages and the tools. Done is worked out
 * from the snapshot or the player's tick (see status.ts), never stored by an assistant.
 */

export const LINK_KINDS = ["quest", "line", "spell", "item", "follower", "place", "person"] as const;
export type LinkKind = (typeof LINK_KINDS)[number];

/** What an objective links to: a planner quest (by its edid), quest line, spell, item, follower line, a place from the places index (WO-128, by its id), or a person from the people pages (WO-179, by their page's slug). */
export interface ObjectiveLink {
  kind: LinkKind;
  id: string;
}

/** A `save` objective's test: the quest is in the save at this stage or later (or at all, with no stage). */
export interface Detect {
  quest: string;
  stage?: number;
}

/** A `reach` objective's number: "level", "skill:Speech" or "count:books read", and the target. */
export interface Reach {
  key: string;
  target: number;
}

/** A place an act leaves alone on purpose (WO-128 Part 4), and why, Play only. */
export interface PassedBy {
  place: string;
  why: string;
}

/** One stop on an act's route (WO-129): a town or a place, and why she goes there next (Play only). */
export interface RouteStop {
  place: string;
  why: string;
}

/** One of the Before you design questions (WO-139) and the player's answer, in their words. */
export interface Answer {
  question: string;
  answer: string;
}

/**
 * Something the character will never do (WO-139 Part 3): a quest line or story id, a side, a state, or a line in the
 * player's own words; `words` is how the player said it ("she won't be the Dragonborn").
 */
export interface Never {
  what: string;
  words?: string;
}

export type ObjectiveKind = "once" | "reach";
export type DoneBy = "save" | "hand";
export type ObjectiveStatus = "todo" | "doing" | "done" | "later";
/** `act`: an act's own chapter, the story of that stretch (WO-116), one per act. */
export type ChapterKind = "chapter" | "act" | "entry" | "beat";
export type SnapshotSource = "save" | "hand";

export const PLAYTHROUGH_LIMITS = {
  name: 80,
  line: 140,
  actName: 60,
  place: 80,
  goal: 200,
  standingRule: 200,
  /** Places an act passes by (WO-128), and each one's why line. */
  passedBy: 8,
  passedByWhy: 120,
  /** An act's route (WO-129): its stops, and each stop's why line. */
  stops: 12,
  stopWhy: 200,
  objective: 160,
  why: 300,
  /** The Before you design answers (WO-139): how many, and each question's and answer's length. */
  answers: 12,
  answer: 300,
  /** What the character will never do (WO-139). */
  nevers: 20,
  never: 120,
  chapterTitle: 60,
  label: 60,
  acts: 20,
  objectivesPerAct: 40,
  chapters: 100,
  /** Private playthroughs an assistant drafted, per player. */
  drafts: 10,
} as const;
