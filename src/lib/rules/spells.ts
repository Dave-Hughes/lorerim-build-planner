/**
 * Spells in a build (WO-42). A level lists the spells learned at it. Taking a tier perk
 * (Novice to Master in a magic school) gives free picks from that perk's pool at that level:
 * the first spells listed there that are in the pool are free, up to the count, and the rest
 * were learned another way (bought, found, taught). There's no skill rule: Requiem lets you
 * try any tome.
 */
import type { GameData, Spell, SpellTier } from "./data";
import type { BuildPlan, SpellRow } from "./types";

export const SCHOOLS = ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration"] as const;
export const MAX_MAIN_SPELLS = 8;

/** The tier perks taken at a level that give picks, with how many and from which pool. */
export function tierPicksAt(d: GameData, plan: BuildPlan, level: number): { perk: string; tier: SpellTier; count: number; pool: string[] }[] {
  const lv = plan.levels[level - 1];
  if (!lv) return [];
  const out: { perk: string; tier: SpellTier; count: number; pool: string[] }[] = [];
  for (const id of new Set(lv.perks)) {
    const pool = d.spellPicks.pools[id];
    if (!pool) continue;
    const tier = id.split(":")[1].split(" ")[0] as SpellTier;
    out.push({ perk: id, tier, count: d.spellPicks.perTier[tier] ?? 0, pool });
  }
  return out;
}

export interface LearnedSpell extends SpellRow {
  level: number;
  /** Its index in the level's list. */
  index: number;
  spell: Spell | undefined;
  /** The tier perk it's a free pick of, at that level; undefined when learned another way. */
  freeFrom?: string;
}

/** A level's spells, each marked free (and from which tier perk) or learned another way. */
export function spellsAt(d: GameData, plan: BuildPlan, level: number): LearnedSpell[] {
  const rows = plan.levels[level - 1]?.spells ?? [];
  const left = new Map(tierPicksAt(d, plan, level).map((t) => [t.perk, { count: t.count, pool: new Set(t.pool) }]));
  return rows.map((r, index) => {
    let freeFrom: string | undefined;
    for (const [perk, t] of left)
      if (t.count > 0 && t.pool.has(r.id)) {
        t.count--;
        freeFrom = perk;
        break;
      }
    return { ...r, level, index, spell: d.spellById.get(r.id), freeFrom };
  });
}

/** Every spell the build learns, in level order (the first time only when one is listed twice). */
export function spellsLearned(d: GameData, plan: BuildPlan, upTo = plan.levels.length): LearnedSpell[] {
  const out: LearnedSpell[] = [];
  const seen = new Set<string>();
  for (let L = 1; L <= Math.min(upTo, plan.levels.length); L++)
    for (const s of spellsAt(d, plan, L)) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      out.push(s);
    }
  return out;
}

/** A tier perk's free picks at its level (WO-76): how many it gives, how many are chosen, how many are left. */
export interface PicksAt {
  perk: string;
  count: number;
  chosen: number;
  /** Picks still to choose: never more than the pool has left to give (spells the build learns anyway don't count). */
  left: number;
}

/** A level's tier perks and their picks (WO-76), those with picks left first. */
export function picksAt(d: GameData, plan: BuildPlan, level: number, learned = new Set(spellsLearned(d, plan).map((s) => s.id))): PicksAt[] {
  const rows = spellsAt(d, plan, level);
  return tierPicksAt(d, plan, level)
    .map((t) => {
      const chosen = rows.filter((r) => r.freeFrom === t.perk).length;
      const open = t.pool.filter((id) => d.spellById.has(id) && !learned.has(id)).length;
      return { perk: t.perk, count: t.count, chosen, left: Math.max(0, Math.min(t.count - chosen, open)) };
    })
    .sort((a, b) => Number(b.left > 0) - Number(a.left > 0));
}

/** The spells a level still has to choose (WO-76). */
export function spellsToChooseAt(d: GameData, plan: BuildPlan, level: number, learned?: Set<string>): number {
  return picksAt(d, plan, level, learned).reduce((n, p) => n + p.left, 0);
}

/** Across the build (WO-76): each level with spells to choose, and the total. */
export function spellsToChoose(d: GameData, plan: BuildPlan): { total: number; levels: { level: number; left: number }[] } {
  const learned = new Set(spellsLearned(d, plan).map((s) => s.id));
  const levels = plan.levels.map((_, i) => ({ level: i + 1, left: spellsToChooseAt(d, plan, i + 1, learned) })).filter((x) => x.left > 0);
  return { total: levels.reduce((n, x) => n + x.left, 0), levels };
}

/** The main spells that the build actually learns, in the author's order, at most 8. */
export function keptMainSpells(plan: BuildPlan): string[] {
  const learned = new Set(plan.levels.flatMap((l) => (l.spells ?? []).map((s) => s.id)));
  return [...new Set(plan.mainSpells ?? [])].filter((id) => learned.has(id)).slice(0, MAX_MAIN_SPELLS);
}

const TIER_ORDER: SpellTier[] = ["Novice", "Apprentice", "Adept", "Expert", "Master"];
export const START_LIST_MAX = 50;

/**
 * What the Add spell search lists before anything is typed (WO-57): the spells of the schools this
 * build has perks in by this level, by tier and then A to Z; with no school perks, every spell A to
 * Z. At most 50; `more` says there are others to search for.
 */
export function startingSpells(d: GameData, plan: BuildPlan, level: number): { list: Spell[]; more: boolean } {
  const schools = new Set(
    plan.levels
      .slice(0, level)
      .flatMap((lv) => lv.perks)
      .map((id) => id.split(":")[0])
      .filter((t) => (SCHOOLS as readonly string[]).includes(t)),
  );
  const all = schools.size
    ? d.spells.filter((s) => schools.has(s.school)).sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.name.localeCompare(b.name))
    : [...d.spells].sort((a, b) => a.name.localeCompare(b.name));
  return { list: all.slice(0, START_LIST_MAX), more: all.length > START_LIST_MAX };
}
