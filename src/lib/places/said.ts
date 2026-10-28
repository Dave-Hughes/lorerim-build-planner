import type { PlacePointer } from "./data";

const TAG = /<[^>]*(?:Alias|Global|Token)[^>]*>/i;
const PLAYER = /<Alias=Player>/gi;
/** A pointer with `<Alias=Player>` said as "you"; null when any other tag is in it: the game fills the tag in, the planner can't. */
function quotable(p: PlacePointer): PlacePointer | null {
  const fields = [p.words, (p as { book?: string }).book, p.speaker, p.quest].map((f) => (f ?? "").replace(PLAYER, "you"));
  if (fields.some((f) => TAG.test(f))) return null;
  return { ...p, words: fields[0], ...((p as { book?: string }).book !== undefined ? { book: fields[1] } : {}) } as PlacePointer;
}

/**
 * What people say about a place (WO-162 Part 2): the lines tied to a quest, and the books and notes, each once, at most five, the speaker
 * linked and "in <quest>"; everything else (a greeting like "Welcome to the Bee and Barb") is only in "All N lines".
 */
export function saidAbout(pointers: PlacePointer[] | undefined): { shown: PlacePointer[]; all: PlacePointer[] } {
  const seen = new Set<string>();
  const all: PlacePointer[] = [];
  for (const raw of pointers ?? []) {
    const p = quotable(raw);
    // A line with an alias tag other than the player is not fit to quote (WO-177 Part 6).
    if (!p) continue;
    // One line per text: the same words from two books, or said twice, are shown once.
    const key = p.words.replace(/\s+/g, " ").trim().toLowerCase();
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
export const playerFacing = (name: string) => !!name.trim() && !/_/.test(name) && !/<|Alias=/.test(name) && !/\b(Vendor Quest|Reserved Locations?|Handler|Misc Objective|Convo System)\b/i.test(name);
