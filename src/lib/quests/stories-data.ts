import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { mapStrings, mend, REASON_KEYS, SAID_NAMES } from "@/lib/pages/player-words";
import { currentVersion } from "@/lib/rules/server";
import type { Story } from "./story";

/** stories.json for the current LoreRim version (WO-106), built by build.py from Bob's hand-kept file. */
let cached: Story[] | null = null;

export function stories(): Story[] {
  if (cached) return cached;
  try {
    // The three quests the records name with an editor id are said as what they are here too (WO-177 Part 5).
    cached = mapStrings((JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "stories.json"), "utf8")) as { stories: Story[] }).stories, (t) => SAID_NAMES[t] ?? mend(t), REASON_KEYS);
  } catch {
    cached = [];
  }
  return cached;
}

export const storyById = (id: string) => stories().find((s) => s.id === id);
/** The story told from a quest line, if one is. */
export const storyOfLine = (line: string) => stories().find((s) => s.line === line);
