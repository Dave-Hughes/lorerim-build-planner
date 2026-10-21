import "server-only";
import { questsData } from "@/lib/quests/data";
import { questLinkables, type Linkable } from "./links";
import { reachLabel, saveGives } from "./status";
import type { ObjectiveKind, ObjectiveLink, Reach } from "./types";

/**
 * Warnings while drafting a playthrough (WO-123 Part 2), as WO-119's reviewBuild does for builds: advice for the
 * assistant, never a refusal. An objective whose words name a planner quest, quest line or follower but which isn't
 * linked, so the save can't tick it; and a number to reach that a save can't give, which the player ticks.
 */

export interface PlaythroughWarning {
  code: "objective-not-linked" | "reach-not-readable";
  objective: string;
  message: string;
}

interface ReviewedObjective {
  id: number;
  text: string;
  kind: ObjectiveKind;
  link: ObjectiveLink | null;
  reach: Reach | null;
}

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();

/** A name an objective's words can be said to name: two words or more, or one of seven letters or more ("Inigo" is too short to tell). */
const nameable = (name: string) => norm(name).split(" ").length > 1 || norm(name).length >= 7;

/** The proper-noun phrases in an objective's words, two capitalised words or more: "Mark of Dibella", "Bee and Barb". */
function phrases(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/\b[A-Z][\w']*(?:\s+(?:of|the|and|to|in)\s+[A-Z][\w']*|\s+[A-Z][\w']*)+/g)) out.push(m[0]);
  return out;
}

let questTexts: { edid: string; name: string; text: string }[] | null = null;

/** Every quest's own objectives and journal, once per server, for a phrase only one quest uses. */
function texts() {
  if (questTexts) return questTexts;
  questTexts = questsData().lines.flatMap((l) => l.quests.map((q) => ({ edid: q.edid, name: q.name, text: norm([...(q.objectives ?? []), ...(q.journal ?? [])].join(" ")) })));
  return questTexts;
}

/**
 * What an unlinked objective's words name, the way search_facts finds names: a quest, quest line or follower whose name
 * is in its words (the longest), else a proper-noun phrase only one quest's own objectives and journal use ("Get a Mark
 * of Dibella from Haelga" is Caught Red Handed's). Null when it names none.
 */
export function namedIn(text: string): Linkable | null {
  const words = ` ${norm(text)} `;
  const hit = questLinkables()
    .filter((l) => nameable(l.name) && words.includes(` ${norm(l.name)} `))
    .sort((a, b) => b.name.length - a.name.length || (a.kind === "quest" ? -1 : 1))[0];
  if (hit) return hit;
  for (const p of phrases(text)) {
    const want = ` ${norm(p)} `;
    const quests = [...new Set(texts().filter((q) => ` ${q.text} `.includes(want)).map((q) => q.edid))];
    if (quests.length === 1) return questLinkables().find((l) => l.kind === "quest" && l.id === quests[0]) ?? null;
  }
  return null;
}

/** "'Get a Mark of Dibella from Haelga' is Caught Red Handed (FreeformRiften11); link it so the save can tick it." */
function linkWarning(o: ReviewedObjective, named: Linkable): string {
  if (named.kind === "quest") return `'${o.text}' is ${named.name} (${named.id}); link it so the save can tick it.`;
  if (named.kind === "line") return `'${o.text}' names the quest line ${named.name}; link it, or the quest it means, so the save can tick it.`;
  return `'${o.text}' names ${named.name}, a follower; link it.`;
}

export function reviewPlaythrough(objectives: readonly ReviewedObjective[]): PlaythroughWarning[] {
  const out: PlaythroughWarning[] = [];
  for (const o of objectives) {
    if (o.kind === "reach" && o.reach && !saveGives(o.reach.key)) {
      out.push({ code: "reach-not-readable", objective: String(o.id), message: `${reachLabel(o.reach.key)} ${o.reach.target} can't be read from a save; the player ticks it.` });
    }
    if (!o.link) {
      const named = namedIn(o.text);
      if (named) out.push({ code: "objective-not-linked", objective: String(o.id), message: linkWarning(o, named) });
    }
  }
  return out;
}
