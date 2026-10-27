import "server-only";
import { personHref } from "@/lib/people/data";
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
