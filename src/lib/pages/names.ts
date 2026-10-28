import "server-only";
import { peopleData, personHref } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { placeHref, placesData } from "@/lib/places/data";
import type { NameLink } from "./link-names";

import { questsData } from "@/lib/quests/data";

let placeLinks: NameLink[] | null = null;
let modLinks: NameLink[] | null = null;

/** Every mod the quest data names with a Nexus id, as an outside link (WO-154 Part 4: a mod named anywhere links to its page, in a new tab). */
export function modNames(): NameLink[] {
  if (modLinks) return modLinks;
  const seen = new Map<string, string>();
  for (const l of questsData().lines) {
    for (const s of l.sources) if (s.modid && !s.base) seen.set(s.name, s.modid);
    for (const q of l.quests) {
      if (q.mod?.modid && !q.mod.base) seen.set(q.mod.name, q.mod.modid);
      for (const m of q.changedBy ?? []) if (m.modid) seen.set(m.name, m.modid);
    }
  }
  modLinks = [...seen].filter(([name]) => name.length > 3).map(([text, id]) => ({ text, href: `https://www.nexusmods.com/skyrimspecialedition/mods/${id}`, external: true }));
  return modLinks;
}

/** Every place the index has, as links: a place's name is proper enough to link wherever it stands in a page's words. */
export function placeNames(): NameLink[] {
  placeLinks ??= placesData()
    .places.filter((p) => p.name.length > 3)
    .flatMap((p) => {
      const href = placeHref(p.name);
      return href ? [{ text: p.name, href }] : [];
    });
  return placeLinks;
}

/** The people a page names, as links: only those the index has, by the exact name the read gives. */
export function personNames(names: (string | undefined)[]): NameLink[] {
  const seen = new Set<string>();
  const out: NameLink[] = [];
  for (const n of names) {
    if (!n || seen.has(n)) continue;
    seen.add(n);
    const href = personHref(n);
    if (href) out.push({ text: n, href });
  }
  return out;
}

let peopleLinks: NameLink[] | null = null;

/**
 * The people a quest line's text may name, as links (WO-160 Part 5): everyone with a page who is a person a player asks about (is in a quest,
 * has been read, or is a follower, spouse, merchant, trainer or innkeeper), and anyone whose name is more than one word (a whole name is not
 * a common word). The many with one word for a name and nothing else (a guard, a bandit, a creature) are left out: a link on one would be wrong.
 */
export function peopleNames(): NameLink[] {
  peopleLinks ??= peopleData()
    .all.filter((p) => p.name.length > 3 && (/^\p{Lu}\S*(?:\s+\S+)+$/u.test(p.name.trim()) || p.read || p.follower || p.marriage || p.sells || p.trainer || p.innkeeper || questsOf(p.name).length > 0))
    .map((p) => ({ text: p.name, href: `/people/${p.slug}` }));
  return peopleLinks;
}

let everyLink: NameLink[] | null = null;

/** Every place and person a sentence on a quest page may name: one list, so the pattern is built once. A place wins over a person of the same name. */
export function linkable(): NameLink[] {
  everyLink ??= [...peopleNames(), ...placeNames()];
  return everyLink;
}
