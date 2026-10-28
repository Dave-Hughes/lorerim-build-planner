import "server-only";
import { linkNames } from "@/lib/pages/link-names";
import { placeNames } from "@/lib/pages/names";
import { dayHours, mainPlace } from "@/lib/people/day";
import { personBySlug } from "@/lib/people/data";
import { peopleAt } from "@/lib/places/people";
import { afterWar, hasLevels, isGarrison, levelSpan, rangeOf, placeByName, placeBySlug, placeLabel, placeSlug, placeType, placesData, placesNamed, type Place } from "@/lib/places/data";
import { gettingThere, inFrame, mapEntry, toTexture } from "@/lib/places/map";
import { placeKind } from "@/lib/places/kind";
import { playerFacing } from "@/lib/places/said";
import { questsData } from "@/lib/quests/data";
import { pageOf, levelWords } from "@/lib/quests/reads";
import { questBySlug, questHref } from "@/lib/quests/slugs";
import { searchEverything } from "@/lib/search/everything";

/**
 * The Map page's data (WO-169): every place on Skyrim's map with what the filters need, the places a quest goes to in order, where a person is,
 * a place's drawer, and where a player's character stands. Positions are pixels of the 8192 texture the tiles are cut from.
 */
export type MapKind = "city" | "town" | "danger" | "other";

export interface MapPlace {
  slug: string;
  name: string;
  kind: MapKind;
  type: string;
  hold: string | null;
  px: number;
  py: number;
  /** The levels of what is there, for the Danger range; null when nothing hostile or not known. */
  range: [number, number] | null;
  quests: number;
}

let all: MapPlace[] | null = null;
export function mapPlaces(): MapPlace[] {
  if (all) return all;
  const m = mapEntry();
  const seen = new Set<string>();
  const out: MapPlace[] = [];
  if (m)
    for (const p of placesData().places) {
      if (p.world !== "Tamriel" || !p.pos) continue;
      const slug = placeSlug(p);
      const { px, py } = toTexture(m, p.pos[0], p.pos[1]);
      if (!inFrame(m, px, py)) continue;
      const key = `${slug}|${Math.round(px / 4)}|${Math.round(py / 4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const k = placeKind(p);
      out.push({
        slug,
        name: placeLabel(p),
        kind: p.type === "City" ? "city" : k === "town" ? "town" : k === "dangerous" ? "danger" : "other",
        type: p.type,
        hold: p.hold ?? null,
        px: Math.round(px * 10) / 10,
        py: Math.round(py * 10) / 10,
        range: levelSpan(p.actors),
        quests: (p.quests ?? []).length,
      });
    }
  all = out;
  return out;
}

const bySlug = () => new Map(mapPlaces().map((p) => [p.slug, p]));
/**
 * A place on the map by the name the words use. A name more than one place has (the Imperial Military Camp) is the one the quest goes to,
 * when `quest` says which quest and only one of them is its place; otherwise none.
 */
const mapPlaceNamed = (name: string, quest?: string): MapPlace | null => {
  const named = placeByName(name) ?? (quest ? (placesNamed(name).filter((p) => p.quests?.includes(quest)).length === 1 ? placesNamed(name).find((p) => p.quests?.includes(quest)) : null) : null);
  return named ? (bySlug().get(placeSlug(named)) ?? null) : null;
};

/** The words a result says about a place: its kind and, when something there fights, its levels. */
const levelNote = (r: [number, number] | null) => (r ? (r[1] >= 100 ? `Level ${r[0]} and up` : r[0] === r[1] ? `Level ${r[0]}` : `Level ${r[0]} to ${r[1]}`) : null);

export interface MapSearch {
  places: { slug: string; name: string; note: string; range: string | null }[];
  people: { slug: string; name: string; note: string }[];
  quests: { slug: string; name: string; note: string }[];
}

/** As you type: places that are on the map, people, and quests. */
export function mapSearch(q: string): MapSearch {
  const out: MapSearch = { places: [], people: [], quests: [] };
  if (!q.trim()) return out;
  const found = searchEverything(q, 12);
  const onMap = bySlug();
  for (const h of found.places) {
    const slug = h.href.replace(/^\/places\//, "");
    const p = onMap.get(slug);
    if (p) out.places.push({ slug, name: p.name, note: [placeType(p.type), p.hold].filter(Boolean).join(", "), range: levelNote(p.range) });
  }
  for (const h of found.people) out.people.push({ slug: h.href.replace(/^\/people\//, ""), name: h.name, note: h.note ?? "" });
  for (const h of found.quests) {
    const slug = h.href.replace(/^\/quests\/q\//, "");
    if (h.href.startsWith("/quests/q/")) out.quests.push({ slug, name: h.name, note: h.note ?? "" });
  }
  out.places = out.places.slice(0, 6);
  out.people = out.people.slice(0, 4);
  out.quests = out.quests.slice(0, 4);
  return out;
}

/** The places a quest goes to, in order, that are on the map. */
export function questRoute(slug: string): { name: string; href: string; stops: { slug: string; name: string; why: string | null }[] } | null {
  const hit = questBySlug(slug);
  if (!hit) return null;
  const page = pageOf(hit.quest);
  const seen = new Set<string>();
  const stops: { slug: string; name: string; why: string | null }[] = [];
  for (const t of page.takesYou) {
    const p = mapPlaceNamed(t.place.replace(/^the /i, ""), hit.quest.name) ?? mapPlaceNamed(t.place, hit.quest.name);
    if (!p || seen.has(p.slug)) continue;
    seen.add(p.slug);
    stops.push({ slug: p.slug, name: p.name, why: t.why ? t.why.charAt(0).toUpperCase() + t.why.slice(1) : null });
  }
  return { name: hit.quest.name, href: questHref(hit.quest.edid) ?? `/quests/q/${slug}`, stops };
}

/** Where a person is: the place they are in most of the day (their read), else where they are placed. */
export function personWhere(slug: string): { name: string; href: string; place: { slug: string; name: string } | null; how: string } | null {
  const person = personBySlug(slug);
  if (!person) return null;
  const hours = person.read ? dayHours(person.read.day) : null;
  const main = hours ? mainPlace(hours) : null;
  const candidates = [main?.main, person.inTown, person.cell].filter((x): x is string => !!x);
  for (const text of candidates) {
    const hit = linkNames(text, placeNames()).find((x) => x.href);
    const p = (hit ? mapPlaceNamed(hit.text) : null) ?? mapPlaceNamed(text);
    if (p) return { name: person.name, href: `/people/${person.slug}`, place: { slug: p.slug, name: p.name }, how: main?.main === text ? "Where they are most of the day" : "Where they are placed" };
  }
  return { name: person.name, href: `/people/${person.slug}`, place: null, how: "Not on the map" };
}

export interface Drawer {
  slug: string;
  name: string;
  href: string;
  tags: string[];
  gettingThere: string | null;
  boss: { name: string; level: string } | null;
  /** The levels of what is there, in words ("Level 1 to 27, after the war"); null when nothing hostile or not known. */
  danger: string | null;
  inside: { name: string; href: string; role: string | null }[];
  rewards: string[];
  worth: string[];
  quests: { name: string; href: string }[];
}

export function placeDrawer(slug: string): Drawer | null {
  const p: Place | null = placeBySlug(slug);
  if (!p) return null;
  const byName = new Map(questsData().lines.flatMap((l) => l.quests.map((q) => [q.name, q] as const)));
  const quests = (p.quests ?? []).flatMap((name) => {
    const q = byName.get(name);
    const href = q ? questHref(q.edid) : null;
    return q && href && playerFacing(name) ? [{ name, href }] : [];
  });
  const lived = placeKind(p) !== "dangerous";
  const inside = lived
    ? peopleAt(p)
        .houses.flatMap((h) => h.people)
        .slice(0, 6)
        .map((x) => ({ name: x.name, href: x.href, role: x.role }))
    : [];
  const war = afterWar(p.actors);
  const garrison = isGarrison(p.actors);
  const lv = ([lo, hi]: [number, number]) => (hi > lo ? `Level ${lo} to ${hi}` : `Level ${lo}`);
  const danger = p.actors?.hostile === false ? null : garrison && war ? `${lv(war.range)}, after the war` : hasLevels(p.actors) ? `${lv(rangeOf(p.actors!))}${war ? `; ${lv(war.range).toLowerCase()} after the war` : ""}` : null;
  const bossFrom = (garrison ? afterWar(p.actors)?.boss : p.actors?.boss) ?? undefined;
  const boss = bossFrom?.name ? { name: bossFrom.name, level: bossFrom.level ? levelWords(bossFrom.level) : "" } : null;
  const worth = [
    ...(p.worthGoingFor?.skillBooks ?? []).map((b) => (b.includes(": ") ? `${b.split(": ")[1]} (${b.split(": ")[0]} skill book)` : b)),
    ...(p.worthGoingFor?.bossChest ? ["A boss chest"] : []),
    ...(p.worthGoingFor?.crafting?.length ? [p.worthGoingFor.crafting.join(", ")] : []),
    ...(p.worthGoingFor?.shrines ?? []),
  ];
  const rewards = [p.discoveryXp ? `${p.discoveryXp} XP for finding it` : "", !lived && p.clearXp ? `${p.clearXp} XP for clearing it` : ""].filter(Boolean);
  return {
    slug,
    name: placeLabel(p),
    href: `/places/${slug}`,
    tags: [placeType(p.type), p.hold ? `${p.hold} hold` : ""].filter(Boolean),
    gettingThere: gettingThere(p),
    boss: lived ? null : boss,
    danger: lived ? null : danger,
    inside,
    rewards,
    worth,
    quests: quests.slice(0, 8),
  };
}

export interface MapCharacter {
  id: string;
  name: string;
  /** "Kyria, save 7: Ivarstead". */
  label: string;
  place: { slug: string; name: string } | null;
  /** The places the current act's stops and place name, to light up. */
  lit: { slug: string; name: string }[];
}

const nameToPlace = (text: string | null | undefined): { slug: string; name: string } | null => {
  if (!text) return null;
  const hit = linkNames(text, placeNames()).find((x) => x.href);
  const p = (hit ? mapPlaceNamed(hit.text) : null) ?? mapPlaceNamed(text.split(",")[0].trim());
  return p ? { slug: p.slug, name: p.name } : null;
};

/** Where a player's character stands: the place its latest snapshot names, and the places of the act it is in. */
export async function characterOnMap(id: string, viewerId: string): Promise<MapCharacter | null> {
  const { getPlaythrough } = await import("@/lib/playthroughs/queries");
  const p = await getPlaythrough(id, viewerId);
  if (!p || p.ownerId !== viewerId) return null;
  const snap = p.snapshot;
  const place = nameToPlace(snap?.place);
  const act = p.view.current;
  const lit = [nameToPlace(act?.place), ...(act?.route ?? []).map((s) => nameToPlace(s.place))].filter((x): x is { slug: string; name: string } => !!x);
  const seen = new Set<string>();
  return {
    id: p.id,
    name: p.name,
    label: `${p.name}${snap ? `, ${snap.source === "save" ? snap.label.toLowerCase() : "your entry"}` : ""}${snap?.place ? `: ${snap.place}` : ""}`,
    place,
    lit: lit.filter((x) => (seen.has(x.slug) ? false : (seen.add(x.slug), true))),
  };
}

export async function myCharacters(viewerId: string): Promise<{ id: string; name: string }[]> {
  const { listMyPlaythroughs } = await import("@/lib/playthroughs/queries");
  return (await listMyPlaythroughs(viewerId)).map((c) => ({ id: c.id, name: c.name }));
}
