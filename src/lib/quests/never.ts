/**
 * What a character will never do (WO-139 Part 3), as the quest tools keep to it. Pure: the door and the tests share it.
 *
 * Each thing on the list is one of: a quest line or story (by id or name, "main-quest", "the-dark-brotherhood"), a side
 * in the war ("imperial", "stormcloak"), a state ("vampire", "werewolf"), "kill" (a quest whose objectives need a kill), or a line in the player's own words. A line
 * or story puts every quest in its line on the list; a side puts that side's joining quests on it, and the quests that
 * need them follow through their checked needs. States and the player's own lines are kept and said back, but no
 * checked need names a vampire or a werewolf yet, so nothing is locked on them.
 */
import type { Never } from "@/lib/playthroughs/types";

export type NeverKind = "line" | "side" | "state" | "kill" | "own";

export interface NeverKept {
  what: string;
  kind: NeverKind;
  /** The quest line it names, for a line or a story. */
  line?: { id: string; name: string };
  /** What the planner says when it leaves something out for it: the player's words, or plainly what they said never to. */
  says: string;
}

export interface Nevers {
  items: NeverKept[];
  /** Every quest on the list, by EDID, with what to say. */
  quests: ReadonlyMap<string, string>;
  /** Every quest line on the list, by id, with what to say. */
  lines: ReadonlyMap<string, string>;
  /** `kill` is on the list (WO-139 Part 5): what to say, read against each quest's objectives. */
  kill: string | null;
}

export const NO_NEVERS: Nevers = { items: [], quests: new Map(), lines: new Map(), kill: null };

/** The words of an objective that ask for a death (WO-139 Part 5): the planner reads these from a quest's objectives. */
const KILLS = /\b(kill|defeat|destroy|assassinate|slay|eliminate)\b/i;

/**
 * The first objective of a quest that needs a kill, or null: Kill, Defeat, Destroy, Assassinate, Slay or Eliminate in its
 * words. An optional objective doesn't force one. A kill the objectives don't say (a bandit in the way) isn't seen, so
 * "kill-free" is said as far as the objectives go.
 */
export const needsKill = (objectives: readonly string[] | undefined): string | null => (objectives ?? []).find((o) => !/^\(optional\)/i.test(o.trim()) && KILLS.test(o)) ?? null;

/** A side's joining quests, by name: the rest of its war follows through their needs ("After Joining the Legion"). */
const SIDES: Record<string, { name: string; quests: string[] }> = {
  imperial: { name: "the Imperial Legion", quests: ["Imperial Introductions", "Joining the Legion"] },
  stormcloak: { name: "the Stormcloaks", quests: ["Stormcloak Introductions", "Joining the Stormcloaks"] },
};
const SIDE_WORDS: Record<string, string> = { imperial: "imperial", imperials: "imperial", legion: "imperial", "imperial-legion": "imperial", "the-imperial-legion": "imperial", stormcloak: "stormcloak", stormcloaks: "stormcloak", "the-stormcloaks": "stormcloak" };
/** The things said for never killing; "never kills for money" and other lines are the player's own words, not this. */
const KILL_WORDS = new Set(["kill", "kills", "killing", "never-kills"]);
const STATES: Record<string, string> = { vampire: "becoming a vampire", werewolf: "becoming a werewolf" };

/** "The Dark Brotherhood" -> the-dark-brotherhood; an id stays itself. */
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** An id-shaped entry (no spaces) that names nothing is a slip, not the player's own words. */
const ID_SHAPED = /^[a-z0-9]+(-[a-z0-9]+)*$/;

interface LineLike {
  id: string;
  name: string;
  quests: { edid: string; name: string }[];
}

/**
 * The list as the planner keeps to it. Throws a message naming the ids it knows when an id-shaped entry names
 * nothing ("the-thieves-gild"); anything with a space in it that names nothing is the player's own line.
 */
export function resolveNevers(list: readonly Never[] | null | undefined, lines: readonly LineLike[], stories: readonly { id: string; line: string; name: string }[]): Nevers {
  if (!list?.length) return NO_NEVERS;
  const items: NeverKept[] = [];
  const quests = new Map<string, string>();
  const lineSays = new Map<string, string>();
  let kill: string | null = null;
  for (const n of list) {
    const key = slug(n.what);
    const words = n.words?.trim() || null;
    const story = stories.find((s) => s.id === key || slug(s.name) === key);
    const line = lines.find((l) => l.id === (story?.line ?? key) || slug(l.name) === key || slug(l.name) === `the-${key}`);
    if (line) {
      const says = words ?? `the player said never to ${line.name}`;
      items.push({ what: n.what, kind: "line", line: { id: line.id, name: line.name }, says });
      lineSays.set(line.id, says);
      for (const q of line.quests) if (!quests.has(q.edid)) quests.set(q.edid, says);
      continue;
    }
    if (KILL_WORDS.has(key)) {
      kill = words ?? "the player said she never kills";
      items.push({ what: n.what, kind: "kill", says: kill });
      continue;
    }
    const side = SIDE_WORDS[key];
    if (side) {
      const says = words ?? `the player said never to joining ${SIDES[side].name}`;
      items.push({ what: n.what, kind: "side", says });
      for (const l of lines) for (const q of l.quests) if (SIDES[side].quests.includes(q.name) && !quests.has(q.edid)) quests.set(q.edid, says);
      continue;
    }
    const state = STATES[key] ? key : STATES[key.replace(/^(a|an|become-a|becoming-a)-/, "")] ? key.replace(/^(a|an|become-a|becoming-a)-/, "") : null;
    if (state) {
      items.push({ what: n.what, kind: "state", says: words ?? `the player said never to ${STATES[state]}` });
      continue;
    }
    if (ID_SHAPED.test(n.what.trim()))
      throw new Error(`Nothing is called ${n.what}. A quest line or story by its id (${lines.slice(0, 8).map((l) => l.id).join(", ")}...), a side (imperial, stormcloak), a state (vampire, werewolf), or the player's own words.`);
    items.push({ what: n.what, kind: "own", says: words ?? n.what });
  }
  return { items, quests, lines: lineSays, kill };
}

/** What a list left out, in one line: "left out: 2 stories this character won't do (she won't be the Dragonborn; ...)". */
export function leftOutLine(count: number, says: string[], what = "stories"): string | null {
  if (!count) return null;
  const one = what.replace(/ies$/, "y").replace(/s$/, "");
  return `left out: ${count} ${count === 1 ? one : what} this character won't do (${[...new Set(says)].join("; ")})`;
}
