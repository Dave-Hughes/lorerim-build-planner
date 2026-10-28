import "server-only";
import { peopleData } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { placeHrefOf, placeLabel, placesData } from "@/lib/places/data";
import { homeName, questsData } from "@/lib/quests/data";
import { questHref } from "@/lib/quests/slugs";
import { fuzzyScore, words } from "./fuzzy";

/** What a result is (WO-161), as its tag says it. */
export type FoundKind = "Quest" | "Quest line" | "Person" | "Place" | "Character" | "Guide";

export interface Found {
  /** The kind tag on a result page. */
  kind?: FoundKind;
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
    if (!at || score < at.score) quests.set(href, { kind: "Quest", name, href, note, why, score });
  };
  // What each quest is, in a few words: the note under every quest result, whatever way it was found (WO-177: it once said the same thing as the reason).
  const whereOf = new Map<string, string>();
  for (const line of questsData().lines)
    for (const quest of line.quests) {
      const href = questHref(quest.edid);
      const where = line.quests.length > 1 ? line.name : homeName(line.category);
      if (href) whereOf.set(href, where);
      const byName = fuzzyScore(q, quest.name);
      if (byName !== null) add(href, quest.name, where, "Matches the quest's name", byName);
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
  for (const { p, s, mine } of people.slice(0, 8)) for (const m of mine) add(m.href, m.name, whereOf.get(m.href) ?? "", m.gives ? `${p.name} gives it` : `${p.name} is named in it`, s + 3);
  const places = placesData()
    .places.map((p) => ({ p, s: fuzzyScore(q, p.name) }))
    .filter((x): x is { p: (typeof x)["p"]; s: number } => x.s !== null)
    .sort((a, b) => a.s - b.s || a.p.name.length - b.p.name.length)
    .slice(0, limit);
  const byName = new Map(questsData().lines.flatMap((l) => l.quests.map((x) => [x.name, x] as const)));
  for (const { p, s } of places.slice(0, 5)) for (const n of p.quests ?? []) {
      const href = byName.has(n) ? questHref(byName.get(n)!.edid) : null;
      add(href, n, (href && whereOf.get(href)) || "", `Goes to ${p.name}`, s + 3);
    }
  return {
    quests: [...quests.values()].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)).slice(0, limit * 2).map(({ kind, name, href, note, why }) => ({ kind, name, href, note, why })),
    // People who give or are in quests come before the many soldiers and guards nobody asks about.
    people: people
      .sort((a, b) => a.s - b.s || b.mine.length - a.mine.length)
      .slice(0, limit)
      .map(({ p, mine }) => ({ kind: "Person" as const, name: p.name, href: `/people/${p.slug}`, note: [p.race, p.inTown].filter(Boolean).join(", "), why: mine.length ? `Matches the name. Is in ${mine.length} quest${mine.length === 1 ? "" : "s"}` : "Matches the name" })),
    places: places.map(({ p }) => ({ kind: "Place" as const, name: placeLabel(p), href: placeHrefOf(p), note: [p.type, p.hold ? `${p.hold} hold` : null].filter(Boolean).join(", "), why: "Matches the name" })),
  };
}
