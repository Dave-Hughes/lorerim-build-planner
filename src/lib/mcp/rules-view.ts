import { questsData } from "@/lib/quests/data";
import { getQuest, questStart, rulesFacts } from "./facts";

/**
 * A quest as the older rules say it, whether or not it has a read (WO-154): for the tests of the rules' machinery (the start check,
 * the answer key, the player facts laid over a way, the open-or-locked judge's words). `getQuest` says the read's words for a quest
 * with one and nothing of these; they're asked here by editor id or name, in the shape `getQuest` gave before: the line's start
 * check (`checked`, `note`) and `{ quest }`.
 */
export function rules(key: string) {
  let edid: string;
  try {
    edid = getQuest({ id: key }).quest.edid;
  } catch {
    edid = getQuest({ name: key }).quest.edid;
  }
  const line = questsData().lines.find((l) => l.quests.some((x) => x.edid === edid))!;
  const q = line.quests.find((x) => x.edid === edid)!;
  return { ...questStart(line, undefined, q), quest: rulesFacts(q) };
}
