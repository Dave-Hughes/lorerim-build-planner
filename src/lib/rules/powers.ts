/**
 * Abilities and shouts in a build (WO-51). A perk that grants an ability (Speech's War Cry gives
 * War Cry) gives it from the level the perk is taken; the author never adds those. Other
 * abilities (racial, stone, god, quest) are rows on a level. A shout row says how many of its
 * words are known from that level; a later row for the same shout raises the count.
 */
import type { Ability, GameData, Shout } from "./data";
import type { BuildPlan } from "./types";

export interface GainedAbility {
  id: string;
  level: number;
  ability: Ability | undefined;
  /** The perk that grants it; undefined for one the author added. */
  fromPerk?: string;
  where?: string;
  /** Its index in the level's own rows (author-added only). */
  index?: number;
}

/** The perk-granted abilities of the perks taken at a level, by perk. */
export function perkAbilitiesAt(d: GameData, plan: BuildPlan, level: number): GainedAbility[] {
  const lv = plan.levels[level - 1];
  if (!lv) return [];
  const out: GainedAbility[] = [];
  for (const perk of new Set([...lv.perks, ...lv.destiny]))
    for (const id of d.abilityFromPerks[perk] ?? []) out.push({ id, level, ability: d.abilityById.get(id), fromPerk: perk });
  return out;
}

/** A level's new abilities: those its perks grant, then the author's rows. */
export function abilitiesAt(d: GameData, plan: BuildPlan, level: number): GainedAbility[] {
  const rows = plan.levels[level - 1]?.abilities ?? [];
  return [...perkAbilitiesAt(d, plan, level), ...rows.map((r, index) => ({ id: r.id, level, ability: d.abilityById.get(r.id), where: r.where, index }))];
}

/** Every ability the build has by `upTo`, in level order (the first time only). */
export function abilitiesKnown(d: GameData, plan: BuildPlan, upTo = plan.levels.length): GainedAbility[] {
  const out: GainedAbility[] = [];
  const seen = new Set<string>();
  for (let L = 1; L <= Math.min(upTo, plan.levels.length); L++)
    for (const a of abilitiesAt(d, plan, L)) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      out.push(a);
    }
  return out;
}

export interface KnownShout {
  id: string;
  shout: Shout | undefined;
  /** Words known at the level asked about. */
  words: number;
  /** The level it was first learned, and the level of the row that set the count. */
  first: number;
  level: number;
  where?: string;
}

/** Every shout the build knows by `upTo`, with its word count then (the most any row so far gave). */
export function shoutsKnown(d: GameData, plan: BuildPlan, upTo = plan.levels.length): KnownShout[] {
  const out = new Map<string, KnownShout>();
  for (let L = 1; L <= Math.min(upTo, plan.levels.length); L++)
    for (const r of plan.levels[L - 1].shouts ?? []) {
      const had = out.get(r.id);
      if (had && had.words >= r.words) continue;
      out.set(r.id, { id: r.id, shout: d.shoutById.get(r.id), words: r.words, first: had?.first ?? L, level: L, where: r.where ?? had?.where });
    }
  return [...out.values()];
}

/** How many words of a shout the build knows at a level (0 when none). */
export function shoutWords(d: GameData, plan: BuildPlan, id: string, level: number): number {
  return shoutsKnown(d, plan, level).find((s) => s.id === id)?.words ?? 0;
}

/** "Tiid Klo Ul: Time, Sand, Eternity", for the words known (all three when not said). */
export function shoutWordsLine(s: Shout, known = 3): string {
  const n = Math.max(1, Math.min(known, s.words.length));
  return `${s.words.slice(0, n).join(" ")}: ${s.translations.slice(0, n).join(", ")}`;
}
