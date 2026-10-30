import "server-only";
import { cleanUnsure } from "@/lib/pages/unsure";
import { isTemplateName } from "@/lib/pages/player-words";
import { peopleData, personUnsure, roleWords } from "@/lib/people/data";
import { placeHrefOf, placeLabel, placesData, placeType } from "@/lib/places/data";
import { placeUnsure } from "@/lib/places/unsure";
import { holdWords } from "@/lib/places/hold-words";
import { questsData } from "@/lib/quests/data";
import { pageOf } from "@/lib/quests/reads";
import { questHref } from "@/lib/quests/slugs";

/**
 * Everything the planner is not sure of (WO-184 Part 3, board HelpGaps): every quest, person and place whose page has a line under Not sure yet, with the lines. It
 * uses the same functions the pages use for their Not sure yet lists, so a line shown here is a line shown there. Worked out once per server.
 */
export interface Gap {
  kind: "quest" | "person" | "place";
  /** The key the page is counted and confirmed by: a quest's editor id, a person's or a place's slug. */
  key: string;
  name: string;
  /** "Quest, Riverwood". */
  sub: string;
  href: string;
  /** The Not sure yet lines, as the page says them. */
  missing: string[];
}

let built: Gap[] | null = null;

export function gapCatalog(): Gap[] {
  if (built) return built;
  const out: Gap[] = [];
  const seen = new Set<string>();
  for (const line of questsData().lines) {
    for (const q of line.quests) {
      const href = questHref(q.edid);
      if (!href || seen.has(q.edid) || !q.name || isTemplateName(q.name)) continue;
      seen.add(q.edid);
      const { fields } = cleanUnsure(pageOf(q).unsure);
      if (!fields.length) continue;
      const town = q.start?.towns?.length === 1 ? q.start.towns[0] : "";
      out.push({ kind: "quest", key: q.edid, name: q.name, sub: ["Quest", town].filter(Boolean).join(", "), href, missing: fields });
    }
  }
  for (const p of placesData().places) {
    const { fields } = cleanUnsure(placeUnsure(p));
    if (!fields.length) continue;
    const href = placeHrefOf(p);
    out.push({ kind: "place", key: href.replace("/places/", ""), name: placeLabel(p), sub: [placeType(p.type), p.hold ? holdWords(p.hold) : p.inTown ?? ""].filter(Boolean).join(", "), href, missing: fields });
  }
  for (const person of peopleData().all) {
    const { fields } = cleanUnsure(personUnsure(person));
    if (!fields.length) continue;
    const raw = person.read?.role ? person.read.role.split(";")[0].trim() : roleWords(person.role);
    const role = raw ? `${raw.charAt(0).toUpperCase()}${raw.slice(1)}` : "";
    const where = person.inTown && !role.toLowerCase().includes(person.inTown.toLowerCase()) ? person.inTown : "";
    out.push({ kind: "person", key: person.slug, name: person.name, sub: [role, where].filter(Boolean).join(", ") || "Person", href: `/people/${person.slug}`, missing: fields });
  }
  built = out;
  return out;
}
