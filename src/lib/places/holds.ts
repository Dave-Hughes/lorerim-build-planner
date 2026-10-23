import "server-only";
import { placesData } from "./data";

/**
 * A hold is every town in it (WO-148 item 1): `where: "Haafingar"` means Solitude, Dragon Bridge and the rest. The holds and
 * their towns come from the places index (each place's hold, and the town and city nearest it), never typed here.
 */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/^the\s+/, "")
    .replace(/\s+hold$/, "")
    .replace(/\s+/g, " ")
    .trim();

let holds: Map<string, { name: string; towns: string[] }> | null = null;

function build() {
  if (holds) return holds;
  // A town is in the hold most of the places nearest it are in: a place by a border carries a neighbour's town.
  const names = new Map<string, string>();
  const tally = new Map<string, Map<string, number>>();
  for (const p of placesData().places) {
    if (!p.hold) continue;
    names.set(norm(p.hold), p.hold);
    for (const t of [p.nearestTown?.town, p.nearestCity?.town]) {
      if (!t) continue;
      const row = tally.get(t) ?? new Map<string, number>();
      row.set(norm(p.hold), (row.get(norm(p.hold)) ?? 0) + 1);
      tally.set(t, row);
    }
  }
  const m = new Map<string, { name: string; towns: string[] }>([...names].map(([k, name]) => [k, { name, towns: [] }]));
  for (const [town, row] of tally) {
    const home = [...row].sort((a, b) => b[1] - a[1])[0][0];
    m.get(home)!.towns.push(town);
  }
  holds = m;
  return holds;
}

/** The hold a name is ("Haafingar", "the Pale", "Whiterun hold"), with its towns; null when it names none. */
export function holdNamed(where: string): { name: string; towns: string[] } | null {
  return build().get(norm(where)) ?? null;
}

/**
 * The words a start's place can say to be "where" (lower case): the place asked for, and for a hold every town in it and the
 * hold's own name. A name that is a hold and a town (Falkreath, Winterhold, Whiterun) takes both.
 */
export function whereTerms(where: string): string[] {
  const w = where.trim().toLowerCase();
  const hold = holdNamed(where);
  return [...new Set([w, ...(hold ? [hold.name.toLowerCase(), ...hold.towns.map((t) => t.toLowerCase())] : [])])];
}
