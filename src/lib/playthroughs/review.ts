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

/** Words that say nothing about which quest an objective is. */
const FILLER = new Set(["a", "an", "the", "of", "to", "at", "in", "on", "and", "or", "from", "your", "with", "for", "by", "it", "her", "his", "is", "be"]);
const content = (s: string) => new Set(norm(s).split(" ").filter((w) => w && !FILLER.has(w)));

let questObjectives: { edid: string; name: string; objectives: Set<string>[] }[] | null = null;

/** Every quest's own objectives as sets of content words, once per server; an objective of fewer than three can't tell quests apart. */
function objectivesOf() {
  if (questObjectives) return questObjectives;
  questObjectives = questsData().lines.flatMap((l) =>
    l.quests.map((q) => ({ edid: q.edid, name: q.name, objectives: (q.objectives ?? []).map(content).filter((w) => w.size >= 3) })),
  );
  return questObjectives;
}

/** How much of an objective's content words the text holds: 1 when it says all of them. */
const coverage = (objective: Set<string>, words: Set<string>) => [...objective].filter((w) => words.has(w)).length / objective.size;

/** What an unlinked objective's words name, and whether that is sure (it says "is") or only likely (it says "might be"). */
export interface Named {
  named: Linkable;
  sure: boolean;
}

/**
 * What an unlinked objective's words name, the way search_facts finds names (WO-142 item 2): a quest, quest line or
 * follower whose name is in its words (the longest) is sure; else a quest one of whose objectives (three content words or
 * more) the text says at least 70% of, only one quest doing so, is sure ("Get a Mark of Dibella from Haelga" is Caught Red
 * Handed's). A place name inside some objective names nothing: "Buy a horse at the Riften Stables" is not Caught Red
 * Handed. Half to 70% of one quest's objective, and no other, is only "might be". Null when it names none.
 */
export function namedIn(text: string): Named | null {
  const words = ` ${norm(text)} `;
  const hit = questLinkables()
    .filter((l) => nameable(l.name) && words.includes(` ${norm(l.name)} `))
    .sort((a, b) => b.name.length - a.name.length || (a.kind === "quest" ? -1 : 1))[0];
  if (hit) return { named: hit, sure: true };
  const said = content(text);
  const scored = objectivesOf()
    .map((q) => ({ q, score: Math.max(0, ...q.objectives.map((o) => coverage(o, said))) }))
    .filter((x) => x.score >= 0.5);
  const sure = scored.filter((x) => x.score >= 0.7);
  const pick = sure.length ? sure : scored;
  if (pick.length !== 1) return null;
  const named = questLinkables().find((l) => l.kind === "quest" && l.id === pick[0].q.edid);
  return named ? { named, sure: sure.length === 1 } : null;
}

/** "'Get a Mark of Dibella from Haelga' is Caught Red Handed (FreeformRiften11); link it so the save can tick it." */
function linkWarning(o: ReviewedObjective, { named, sure }: Named): string {
  if (named.kind === "quest") return sure ? `'${o.text}' is ${named.name} (${named.id}); link it so the save can tick it.` : `'${o.text}' might be ${named.name} (${named.id}); if it is, link it so the save can tick it.`;
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
