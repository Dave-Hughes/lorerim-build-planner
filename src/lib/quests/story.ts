/**
 * A story's progress (WO-106). Pure: the page and the tests share it.
 *
 * Progress is the last quest done, in story order. The main quest's story reads and writes Where
 * you are's "Main quest, done up to" instead, so the two never disagree: a quest after Dragonslayer
 * in story order (Paarthurnax) counts as done when Dragonslayer is.
 */
import type { Checked } from "./types";

export type StoryChecked = "files" | "not yet";

export interface StoryQuest {
  edid: string;
  name: string;
  xp: number;
  from?: string;
  atEnd?: boolean;
  task?: string;
  who?: string;
  where?: string;
  note?: string;
  checked: StoryChecked;
}

export type StoryNeed =
  | { kind: "mainQuest"; at: string; text: string; checked: StoryChecked; why?: string }
  | { kind: "level"; level: number; text: string; checked: StoryChecked; why?: string }
  | { kind: "line"; line: string; text: string; checked: StoryChecked; why?: string };

export interface Story {
  id: string;
  line: string;
  lineName: string;
  name: string;
  category: string;
  pitch: string;
  sources: { name: string; modid?: string; base?: true }[];
  start: { text: string; checked: StoryChecked }[];
  chapters: { name: string; quests: StoryQuest[] }[];
  alongside: StoryQuest[];
  reward?: { text: string; checked: StoryChecked };
  opens: { line: string; name: string; needs: StoryNeed[]; or?: { text: string; checked: StoryChecked } }[];
}

/** The story's quests in order, chapter by chapter. */
export const storyOrder = (s: Pick<Story, "chapters">): StoryQuest[] => s.chapters.flatMap((c) => c.quests);

/** How many quests are done, from the last one done (null: none). */
export function doneCount(order: string[], last: string | null): number {
  if (!last) return 0;
  const i = order.indexOf(last);
  return i < 0 ? 0 : i + 1;
}

/**
 * The main quest's story: the last story quest done, from "done up to". The last main quest
 * (Dragonslayer) done means every story quest after it is done too.
 */
export function lastFromMain(order: string[], mainAt: string | null, mainOrder: string[]): string | null {
  if (!mainAt) return null;
  if (mainAt === mainOrder.at(-1)) return order.at(-1) ?? null;
  return order.includes(mainAt) ? mainAt : null;
}

/** "Done up to" for a story quest: itself when it's a main quest, else the last main quest before it. */
export function mainFromStory(order: string[], edid: string | null, mainOrder: string[]): string | null {
  if (!edid) return null;
  for (let i = order.indexOf(edid); i >= 0; i--) if (mainOrder.includes(order[i])) return order[i];
  return null;
}

/** "game files", or "not checked yet": the label a fact carries. */
export const checkedLabel = (c: StoryChecked | Checked | undefined) => (c === "not yet" ? "not checked yet" : "game files");

/** "None: the last quest gives no item." -> the big part and the note under it. */
export function splitReward(text: string): { head: string; note: string | null } {
  const i = text.indexOf(": ");
  return i < 0 ? { head: text, note: null } : { head: text.slice(0, i), note: text.slice(i + 2).replace(/\.$/, "") };
}
