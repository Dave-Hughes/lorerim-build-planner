/** The Quests pages' data (WO-100), as scripts/gamedata/quest_pages.py writes quests.json. */

export type Checked = "files" | "mod page" | "players";

export interface QuestSource {
  name: string;
  modid?: string;
  base?: true;
}

/** A log entry (WO-115): its journal line, whether it completes or fails the quest, and when it shows, in plain words. */
export interface LogEntry {
  text: string;
  completes?: true;
  fails?: true;
  when?: string;
}

export interface QuestEnding extends LogEntry {
  stage: number;
}

export interface Quest {
  edid: string;
  name: string;
  type: string | null;
  xp: number;
  journal: string[];
  stages: { index: number; log: LogEntry[] }[];
  /** The log entries that complete or fail it, in stage order; empty when the records flag none. */
  endings: QuestEnding[];
  objectives: string[];
  /** Each objective with the stage that shows it (WO-134), for the quest log. */
  steps?: { stage: number; text: string }[];
  rewards?: { gold?: "small" | "medium" | "large"; items?: string[] };
  /** How this quest starts (WO-115 Part 2): the start check's answer in plain words, or "not yet". */
  start?: QuestStart;
  /** Who its records fill it with, its giver among them, by name (WO-133): Running Wild's Palonimo, Joslin. */
  people?: string[];
  /** What players call it that the records don't hold (WO-133, overrides.json questNames): "Palomino". */
  calledBy?: string[];
}

/**
 * One quest's start, from the start check (WO-121): what it needs, the ways in (each talk with its
 * speaker and place), then the first step and where it is, and who and where only when one person
 * starts it.
 */
export interface QuestStart {
  needs?: string[];
  /** A way a player found in game, not the files (WO-131 Part 0): checked "players", with who found it and when. */
  ways?: {
    how: string;
    needs?: string[];
    who?: string;
    where?: string;
    checked?: "players";
    source?: string;
    /** A read-this way (WO-131 Part 2): where the item is, from the PC's readables file, in plain words. */
    whereIs?: string[];
    /** A read-this way with no place: "Where to find X isn't checked yet." Never a direction. */
    unplaced?: string;
  }[];
  then?: string;
  thenWhere?: string;
  thenWho?: string;
  who?: string;
  where?: string;
  /** "uesp": not settled by the start check, but a row in Bob's answer key confirms it (WO-136 ruling 2); `source` names the wiki. */
  checked: "files" | "uesp" | "not yet";
  /** Where a "uesp" start was confirmed: "UESP", or "Nexus" for a mod's page, with the page. */
  source?: "UESP" | "Nexus";
  url?: string;
  /** A job from a board (WO-136 ruling 3): checked as its class, in the class's one sentence (the line's `board`). */
  board?: true;
  /**
   * The same needs and ways as the start check writes them, record form and all (WO-126): what the
   * open-or-locked judge reads, and what get_quest hands an assistant. Pages show only the words.
   */
  raw?: { needs: string[]; ways?: { how: string; needs?: string[] }[] };
}

export interface QuestLine {
  id: string;
  name: string;
  category: string;
  also: string[];
  prince: string | null;
  where: string | null;
  opening: string;
  begins: string | null;
  beginsFrom: "opening" | "objective" | null;
  after: string[];
  checked: Partial<Record<"start" | "gate" | "level" | "size" | "note", Checked>>;
  start?: string;
  gate?: string;
  minLevel?: number;
  mainQuestAt?: string;
  level?: string;
  size?: string;
  note?: string;
  sources: QuestSource[];
  /** source "uesp": a judged source names them when the records can't (WO-121b: Raven Rock's Captain Veleth). */
  giver?: { name: string; place?: string; source?: "uesp" };
  /** A line with more than one opening quest (the Civil War's two sides): each opening's way in (WO-121b). */
  ways?: QuestStart["ways"];
  firstObjective?: string;
  /** A line of jobs from a board (WO-136 ruling 3): the class's one sentence, the boards the records place (null until read), and how many of its quests it covers. */
  board?: { name: string; says: string; boards: string[] | null; jobs: number };
  /** false for a family of radiant jobs whose quest names and objectives never say where the job goes (WO-129: Missives). */
  destinationInName?: false;
  quests: Quest[];
  xpTotal: number;
}

export interface QuestCategory {
  name: string;
  subtitle: string;
  more: string;
}

export interface QuestsFile {
  categories: Record<string, QuestCategory>;
  shelves: Record<string, QuestCategory>;
  lines: QuestLine[];
}

/** What the open rule needs of a line: small enough to send to the browser for every line. */
export interface LineGate {
  id: string;
  minLevel?: number;
  after: string[];
  mainQuestAt?: string;
}

/** Whether a quest's start is checked (WO-136 ruling 2): traced in the game files, or confirmed by the answer key from the wiki. */
export const startChecked = (start: Pick<QuestStart, "checked"> | undefined) => start?.checked === "files" || start?.checked === "uesp";
