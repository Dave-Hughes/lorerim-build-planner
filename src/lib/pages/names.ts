import "server-only";
import { personHref } from "@/lib/people/data";
import { placeHref, placesData } from "@/lib/places/data";
import type { NameLink } from "./link-names";

let placeLinks: NameLink[] | null = null;

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
