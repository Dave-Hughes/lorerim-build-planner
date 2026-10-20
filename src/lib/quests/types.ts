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
  rewards?: { gold?: "small" | "medium" | "large"; items?: string[] };
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
  giver?: { name: string; place?: string };
  firstObjective?: string;
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
