import "server-only";
import { personBySlug } from "@/lib/people/data";
import { placeBySlug, placeHrefOf, placeLabel } from "@/lib/places/data";
import { questsData } from "@/lib/quests/data";
import { questHref } from "@/lib/quests/slugs";

/**
 * A page by its kind and key, as the confirmations, screenshots and tips name it (WO-184): a place or a person by its slug, a quest by its editor id,
 * a quest line by `line:<id>`. The name a player reads, and where the page is; null when the planner has no such page.
 */
export type PageKind = "quest" | "person" | "place";

let byEdid: Map<string, { name: string; lineId: string }> | null = null;
function quests() {
  if (!byEdid) byEdid = new Map(questsData().lines.flatMap((l) => l.quests.map((q) => [q.edid, { name: q.name ?? q.edid, lineId: l.id }] as const)));
  return byEdid;
}

export function pageNamed(kind: PageKind, key: string): { name: string; href: string; what: string } | null {
  if (kind === "place") {
    const p = placeBySlug(key);
    return p ? { name: placeLabel(p), href: placeHrefOf(p), what: "Place" } : null;
  }
  if (kind === "person") {
    const p = personBySlug(key);
    return p ? { name: p.name, href: `/people/${p.slug}`, what: "Person" } : null;
  }
  if (key.startsWith("line:")) {
    const line = questsData().byId.get(key.slice(5));
    return line ? { name: line.name, href: `/quests/${line.id}`, what: "Quest" } : null;
  }
  const q = quests().get(key);
  const href = q ? questHref(key) : null;
  return q && href ? { name: q.name, href, what: "Quest" } : null;
}
