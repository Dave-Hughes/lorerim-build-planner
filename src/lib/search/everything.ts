import "server-only";
import { peopleData } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { placeHref, placesData } from "@/lib/places/data";
import { homeName, questsData } from "@/lib/quests/data";
import { questHref } from "@/lib/quests/slugs";
import { fuzzyScore, words } from "./fuzzy";

export interface Found {
  name: string;
  href: string;
  /** What it is, in a few words: the line a quest is in, a person's race and town, a place's hold and type. */
  note?: string;
  /** Why it matched, in one line (WO-154 Part 4). */
  why: string;
}

/**
 * The Quests page's search (WO-154): quests by name, by what players call them, by a person who gives or has a part in one, and by a place
 * a quest goes to; the people and the places themselves. Spelling is forgiven. Each group best first.
 */
export function searchEverything(query: string, limit = 20): { quests: Found[]; people: Found[]; places: Found[] } {
  const q = words(query);
  if (!q.length) return { quests: [], people: [], places: [] };
  const quests = new Map<string, Found & { score: number }>();
  const add = (href: string | null, name: string, note: string, why: string, score: number) => {
    if (!href) return;
    const at = quests.get(href);
    if (!at || score < at.score) quests.set(href, { name, href, note, why, score });
  };
  for (const line of questsData().lines)
    for (const quest of line.quests) {
      const href = questHref(quest.edid);
      const where = line.quests.length > 1 ? line.name : homeName(line.category);
      const byName = fuzzyScore(q, quest.name);
      if (byName !== null) add(href, quest.name, where, "Its name", byName);
      for (const alias of quest.calledBy ?? []) {
        const s = fuzzyScore(q, alias);
        if (s !== null) add(href, quest.name, where, `Players call it ${alias}`, s);
      }
    }
  // A person's quests, and a place's: a little behind a quest's own name.
  const people = peopleData()
    .all.map((p) => ({ p, s: fuzzyScore(q, p.name) }))
    .filter((x): x is { p: (typeof x)["p"]; s: number } => x.s !== null)
    .map((x) => ({ ...x, mine: questsOf(x.p.name) }))
    .sort((a, b) => a.s - b.s || b.mine.length - a.mine.length || a.p.name.length - b.p.name.length)
    .slice(0, 60);
  for (const { p, s, mine } of people.slice(0, 8)) for (const m of mine) add(m.href, m.name, `${p.name}'s quest`, m.gives ? `${p.name} gives it` : `${p.name} has a part in it`, s + 3);
  const places = placesData()
    .places.map((p) => ({ p, s: fuzzyScore(q, p.name) }))
    .filter((x): x is { p: (typeof x)["p"]; s: number } => x.s !== null)
    .sort((a, b) => a.s - b.s || a.p.name.length - b.p.name.length)
    .slice(0, limit);
  const byName = new Map(questsData().lines.flatMap((l) => l.quests.map((x) => [x.name, x] as const)));
  for (const { p, s } of places.slice(0, 5)) for (const n of p.quests ?? []) add(byName.has(n) ? questHref(byName.get(n)!.edid) : null, n, `Goes to ${p.name}`, `It takes you to ${p.name}`, s + 3);
  return {
    quests: [...quests.values()].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)).slice(0, limit * 2).map(({ name, href, note, why }) => ({ name, href, note, why })),
    // People who give or are in quests come before the many soldiers and guards nobody asks about.
    people: people
      .sort((a, b) => a.s - b.s || b.mine.length - a.mine.length)
      .slice(0, limit)
      .map(({ p, mine }) => ({ name: p.name, href: `/people/${p.slug}`, note: [p.race, p.inTown].filter(Boolean).join(", "), why: mine.length ? `Its name. ${mine.length} quest${mine.length === 1 ? "" : "s"}` : "Its name" })),
    places: places.map(({ p }) => ({ name: p.name, href: placeHref(p.name) ?? "/places", note: [p.hold, p.type].filter(Boolean).join(", "), why: "Its name" })),
  };
}
