/**
 * What a signed-in player can tell the planner about a quest (WO-146), what the agent proposes from it, and the fact a
 * person approves. Plain types, shared by the site, the door, /admin and the data overlay.
 */

/** "wrong": something on the page was wrong (as before); "how": I know how this starts; "where": I know where this is. */
export const REPORT_KINDS = ["wrong", "how", "where"] as const;
export type ReportKind = (typeof REPORT_KINDS)[number];

/** The fields a "how" or "where" report carries, each a plain line in the player's words. */
export interface ReportFields {
  /** Who starts it, or gives it. */
  who?: string;
  /** Where that is: the building, the town. */
  where?: string;
  /** What they did to start it. */
  how?: string;
  /** For "where": the town, the building, the nearest landmark. */
  place?: string;
}

export const REPORT_FIELD_MAX = 200;

/** A way in as the pages say it (QuestStart.ways), as a player's report would put it. */
export interface PlayerWay {
  how: string;
  who?: string;
  where?: string;
  /** A read-this way's place, in plain words ("Whiterun, near Joslin's House"). */
  whereIs?: string[];
}

/** What the agent proposes would change on the page. It never writes to the pages. */
export interface Proposal {
  /** The change in the page's words: "Way in: read the note pinned to the board outside Joslin's house...". */
  words: string;
  /** The way it would put on the quest, and the one it replaces by that way's words (null: a new way). */
  way: PlayerWay;
  replaces: string | null;
  /** How it fits the records: agrees, adds a place the records leave unnamed, or contradicts them. */
  fits: "agrees" | "adds a place" | "contradicts";
  /** Why, in a sentence or two, against the records it read. */
  why: string;
  confidence: "high" | "medium" | "low";
  model: string;
  at: string;
}

/** What an admin decided about a report. */
export interface Decision {
  outcome: "approved" | "edited and approved" | "not a problem";
  by: string;
  at: string;
  /** The player fact it wrote, when it wrote one. */
  fact?: number;
}
