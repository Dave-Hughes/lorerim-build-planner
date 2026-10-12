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

/** The main spells that the build actually learns, in the author's order, at most 8. */
export function keptMainSpells(plan: BuildPlan): string[] {
  const learned = new Set(plan.levels.flatMap((l) => (l.spells ?? []).map((s) => s.id)));
  return [...new Set(plan.mainSpells ?? [])].filter((id) => learned.has(id)).slice(0, MAX_MAIN_SPELLS);
}
