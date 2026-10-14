/**
 * Perks that can't go with what's held (WO-68, WO-69): a held perk's exclusions, and anything whose
 * path needs one of them. The editor draws them as ruled out on every level.
 */
import type { GameData } from "./data";

/** Why a perk can't be picked: the held perk that rules it out, and the one in its path that is ruled out. */
export interface RuledOut {
  by: string;
  via: string;
}

/**
 * Perks that can't go with what's held (WO-68): any a held perk excludes, and any whose path
 * needs one of those (an "either" only when every way is ruled out). Held perks are never ruled out.
 */
export function ruledOut(d: GameData, held: Set<string>): Map<string, RuledOut> {
  const direct = new Map<string, string>();
  for (const id of held) for (const x of d.perkById.get(id)?.excludes ?? []) if (!held.has(x) && !direct.has(x)) direct.set(x, id);
  const out = new Map<string, RuledOut>();
  const seen = new Map<string, RuledOut | null>();
  const walk = (id: string): RuledOut | null => {
    if (seen.has(id)) return seen.get(id)!;
    seen.set(id, null);
    let r: RuledOut | null = null;
    if (held.has(id)) r = null;
    else if (direct.has(id)) r = { by: direct.get(id)!, via: id };
    else {
      const p = d.perkById.get(id);
      const reqs = (p?.requires ?? []).filter((x) => d.perkById.has(x));
      const ways = reqs.map(walk);
      if (reqs.length && (p?.anyOf ? ways.every(Boolean) : ways.some(Boolean))) r = ways.find(Boolean)!;
    }
    seen.set(id, r);
    return r;
  };
  for (const p of d.perks) {
    const r = walk(p.id);
    if (r) out.set(p.id, r);
  }
  return out;
}
