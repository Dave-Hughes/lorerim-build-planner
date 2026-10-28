import type { PlacePointer } from "./data";

/**
 * What people say about a place (WO-162 Part 2): the lines tied to a quest, and the books and notes, each once, at most five, the speaker
 * linked and "in <quest>"; everything else (a greeting like "Welcome to the Bee and Barb") is only in "All N lines".
 */
export function saidAbout(pointers: PlacePointer[] | undefined): { shown: PlacePointer[]; all: PlacePointer[] } {
  const seen = new Set<string>();
  const all: PlacePointer[] = [];
  for (const p of pointers ?? []) {
    const key = `${p.speaker ?? p.book ?? ""}|${p.words}`;
    if (seen.has(key)) continue;
    seen.add(key);
    all.push(p);
  }
  // A book first, then a line a named person says in a quest, then any other quest line.
  const rank = (p: PlacePointer) => (p.kind === "book" ? 0 : p.speaker ? 1 : 2);
  const tied = all.filter((p) => p.kind === "book" || !!p.quest).sort((a, b) => rank(a) - rank(b));
  return { shown: tied.slice(0, 5), all };
}

/** A quest name a player would recognise: not an editor id, and not a mod's vendor, handler or reserved-location bookkeeping. */
export const playerFacing = (name: string) => !!name.trim() && !/_/.test(name) && !/\b(Vendor Quest|Reserved Locations?|Handler|Misc Objective|Convo System)\b/i.test(name);
