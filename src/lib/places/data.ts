import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { currentVersion } from "@/lib/rules/server";
import { PLACE_GROUPS, groupOf } from "./groups";

/**
 * The places index (WO-128), as scripts/gamedata/places.py and build.py write places.json: every cave, mine, fort, ruin,
 * camp, lair and landmark a player can visit that isn't a city, town or house, across the load order. Read once per
 * server from disk, as quests.json is, so it never lands in a client bundle.
 */

export interface PlacePointer {
  kind: "dialogue" | "book";
  /** The game's words that name the place. */
  words: string;
  /** Who says it (a dialogue line's GetIsID speaker), and where they stand. */
  speaker?: string;
  speakerPlace?: string;
  /** The book that names it. */
  book?: string;
  /** The quest the line belongs to, by its name: only a quest a player has on the Quests pages (WO-180). */
  quest?: string;
  /** The game's own dialogue quest it belongs to when that is no quest a player has ("Riften Dialogue"): the assistant's gossip lookup reads it; no page shows it. */
  dialogue?: string;
  /** The plugin the record comes from. */
  from: string;
}

/**
 * The hostile actors at a place (WO-144 Part 1d): the lowest and highest level any can be (`floor`, `ceiling`, the zone's minimum
 * and any maximum applied), and `atLevel`, what a player meets as she reaches each gate: one row each, the range of everything
 * unlocked by then. The PC may spell a row's fields as `from` and `meets`; both are read (WO-150). `levels` is the shape before.
 */
export interface Actors {
  count: number;
  /** false: the people there aren't hostile at the start (WO-144 Part 1e-2): no levels, no table. */
  hostile?: boolean;
  floor?: number;
  ceiling?: number;
  atLevel?: { gate?: number; level?: [number, number]; from?: number; meets?: [number, number] }[];
  /** The shape before WO-144 Part 1d. */
  levels?: [number, number];
  zoneMin?: number;
  /** What mainly lives there, and what else ("Bandit", ["Skeleton"]). */
  livesHere?: string;
  alsoHere?: string[];
  /** Who the war's garrisons put here later, in this same shape (WO-144 Part 1e-4). A camp with one guard before the war has a dozen after it (WO-172). */
  afterTheWar?: Omit<Actors, "afterTheWar">;
  boss?: { name?: string; level?: string };
}

/**
 * Whether the data has a level for the actors at all. A place with a count of nothing and `afterTheWar` (a fort the war's garrisons
 * take later, WO-144 Part 1e-4) has none to read yet, and the door says "not checked yet" and not a made-up 1.
 */
export const hasLevels = (a: Actors | undefined): a is Actors => !!a && (a.floor !== undefined || !!a.levels || !!a.atLevel?.length);

/** The weakest and strongest hostile actor at a place, from whichever shape the data has. */
export function rangeOf(a: Actors): [number, number] {
  const lo = a.floor ?? a.levels?.[0] ?? a.atLevel?.[0]?.level?.[0] ?? a.atLevel?.[0]?.meets?.[0] ?? 1;
  const hi = a.ceiling ?? a.levels?.[1] ?? a.atLevel?.at(-1)?.level?.[1] ?? a.atLevel?.at(-1)?.meets?.[1] ?? lo;
  return [lo, hi];
}

/** What the war's garrisons put at a place, as its levels: null when the place has no "after the war" set with levels. */
export function afterWar(a: Actors | undefined): { range: [number, number]; count: number; livesHere?: string; alsoHere?: string[]; boss?: Actors["boss"] } | null {
  const w = a?.afterTheWar;
  if (!w || !hasLevels(w as Actors)) return null;
  return { range: rangeOf(w as Actors), count: w.count, livesHere: w.livesHere, alsoHere: w.alsoHere, boss: w.boss };
}

/**
 * Whether the garrison the war brings is what a place is, and the one or two actors there before it are a guard (WO-172): a camp. Its pages
 * and hovers give the garrison's levels and say "after the war".
 */
export const isGarrison = (a: Actors | undefined): boolean => !!afterWar(a) && !(hasLevels(a) && a!.count > 2);

/**
 * The levels a player can meet at a place, from the one guard who is there before the war to the garrison after it: the whole span, for a
 * filter. Null when nothing hostile is known there.
 */
export function levelSpan(a: Actors | undefined): [number, number] | null {
  if (!a || a.hostile === false) return null;
  const now = hasLevels(a) ? rangeOf(a) : null;
  const war = afterWar(a)?.range ?? null;
  if (now && war) return [Math.min(now[0], war[0]), Math.max(now[1], war[1])];
  return now ?? war;
}

/** What a player at level n meets: the row of the highest gate at or below n; null when no row is open to her yet. */
export function meetsAt(a: Actors, n: number): [number, number] | null {
  let best: { gate: number; range: [number, number] } | null = null;
  for (const row of a.atLevel ?? []) {
    const gate = row.gate ?? row.from ?? 0;
    const range = row.level ?? row.meets;
    if (range && gate <= n && (!best || gate >= best.gate)) best = { gate, range };
  }
  return best?.range ?? null;
}

export interface Place {
  id: string;
  name: string;
  /** The map marker's kind, else the location's: Cave, Mine, Fort, NordicRuin... */
  type: string;
  /** Other names the words of a quest call it by (Volkihar Keep for Castle Volkihar), from overrides.json. */
  aliases?: string[];
  /** The name the records give it, when the page uses the in-game one (Dormitory is the Hall of Attainment): people's cells say it, and its old address redirects (WO-183 Part 2). */
  recordName?: string;
  /** The realm outside Tamriel it is in ("The Shivering Isles", "Coldharbour"): no default clearing XP or respawn is claimed for it (WO-183 Part 2). */
  realm?: string;
  hold?: string;
  nearestTown?: { town: string; km: number; walk?: string };
  nearestCity?: { town: string; km: number; walk?: string };
  /** The town it sits inside (a guild hall, an inn, a temple): not a place to go out to. */
  inTown?: string;
  /**
   * Where it is (WO-166): the worldspace's editor id ("Tamriel", "DLC2SolstheimWorld") and [x, y, z] in game units. Absent for a place
   * inside a town (`inTown`) and for the few nothing could place. z is null for a place found by its exterior cells (no height known).
   * The nine hold capitals are places of type "City". `maps.json` turns a position into a pixel; only Tamriel's map is cleared.
   */
  world?: string;
  pos?: [number, number, number | null];
  /**
   * Where a place inside a town is shown on the map (WO-178): its town's position, since it has none of its own. Present exactly when `inTown` is
   * set and `pos` is not (and the town has a position).
   */
  pinAt?: { world: string; pos: [number, number, number | null] };
  /** The way there in words, when the way is known and the map's direction and distance would mislead (High Hrothgar: "Up the 7,000 Steps from Ivarstead"). */
  gettingThere?: string;
  /** A ruin or a home up a mountain path (overrides.json, a ruling): only such a place is said to be "up the mountain", never one that is merely higher than its town. */
  mountain?: boolean;
  clearXp: number;
  actors?: Actors;
  /** What the people who live there say to a stranger at the door (an Orc stronghold), in the game's words. */
  enters?: { words: string; from?: string };
  pointers?: PlacePointer[];
  /** Named quests that go there. */
  quests?: string[];
  /** XP for finding it, and the number of times it comes back (WO-144). */
  discoveryXp?: number;
  respawns?: string;
  /** What a visitor may want it for (WO-144 Part 3): skill books, a boss chest, crafting stations. */
  worthGoingFor?: { skillBooks?: string[]; bossChest?: boolean; crafting?: string[]; shrines?: string[]; wordWall?: string[] };
  danger?: { traps?: boolean };
}

/** What the build counted (WO-178): every place and those with a position on Tamriel's map (their own or their town's, `pinAt`), by type. */
export interface PlacesSummary {
  places: number;
  onMap: number;
  byType: Record<string, { all: number; onMap: number }>;
}

interface Index {
  places: Place[];
  summary: PlacesSummary;
  /** Places whose name no other place has, by name. */
  byName: Map<string, Place>;
  /** Every place by name, so a name two places share lists both (WO-172). */
  named: Map<string, Place[]>;
}
let cached: Index | null = null;

const key = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

export function placesData(): Index {
  if (cached) return cached;
  let places: Place[] = [];
  let summary: PlacesSummary = { places: 0, onMap: 0, byType: {} };
  try {
    const file = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "places.json"), "utf8")) as { places: Place[]; summary?: PlacesSummary };
    places = file.places;
    summary = file.summary ?? summary;
  } catch {
    // Not built yet.
  }
  const named = new Map<string, Place[]>();
  for (const p of places) named.set(key(p.name), [...(named.get(key(p.name)) ?? []), p]);
  const byName = new Map<string, Place>();
  for (const [k, ps] of named) if (ps.length === 1) byName.set(k, ps[0]);
  cached = { places, summary, byName, named };
  return cached;
}

/**
 * One count per kind of place, for every page that shows one (WO-178): the build's own, by the ten groups. `all` is every place of the kind;
 * `onMap` those with a position on Tamriel's map, their own or their town's.
 */
export function placeCounts(): { places: number; onMap: number; groups: Record<string, { all: number; onMap: number }> } {
  const { summary } = placesData();
  const groups: Record<string, { all: number; onMap: number }> = Object.fromEntries(PLACE_GROUPS.map((g) => [g.key, { all: 0, onMap: 0 }]));
  for (const [type, n] of Object.entries(summary.byType)) {
    const g = groups[groupOf(type)];
    g.all += n.all;
    g.onMap += n.onMap;
  }
  return { places: summary.places, onMap: summary.onMap, groups };
}

/** Every place with this name, case and spacing aside: more than one where eight camps share a name. */
export const placesNamed = (name: string): Place[] => placesData().named.get(key(name)) ?? [];

/**
 * A place by its name, case and spacing aside; null when the index has none, and null when more than one place has that name (the
 * Imperial Military Camp is eight places). A name that says which ("Imperial Military Camp, the Reach") finds that one.
 */
export function placeByName(name: string): Place | null {
  const { byName, named } = placesData();
  const hit = byName.get(key(name));
  if (hit) return hit;
  if (named.has(key(name))) return null;
  const labelled = labels().get(key(name));
  return labelled ?? null;
}

/** What tells places that share a name apart: the town a building stands in, else its hold, else what kind of place it is. */
const SEPARATORS: ((p: Place) => string | undefined)[] = [(p) => p.inTown ?? p.hold, (p) => (p.inTown ? p.hold : undefined), (p) => placeType(p.type).toLowerCase()];

let qualified: { qualifier: Map<string, string>; labels: Map<string, Place> } | null = null;
function shared() {
  if (qualified) return qualified;
  const qualifier = new Map<string, string>();
  const labels = new Map<string, Place>();
  for (const group of placesData().named.values()) {
    if (group.length < 2) continue;
    // The first way of telling them apart that gives each its own word; if none does, they are told apart by a number.
    const way = SEPARATORS.find((f) => new Set(group.map((p) => key(f(p) ?? ""))).size === group.length && group.every((p) => f(p)));
    group.forEach((p, i) => {
      const q = way ? way(p)! : String(i + 1);
      qualifier.set(p.id, q);
      const word = /^the\s/i.test(q) ? `the ${q.slice(4)}` : q;
      labels.set(key(`${p.name}, ${word}`), p);
    });
  }
  qualified = { qualifier, labels };
  return qualified;
}
const labels = () => shared().labels;

/** Whether a name belongs to more than one place. */
export const isSharedName = (name: string) => placesNamed(name).length > 1;

/**
 * The word that says which of several places of one name this is: "the Reach" for an Imperial Military Camp, "Whiterun" for a Hall of the
 * Dead; null when the name is the place's alone.
 */
export function placeQualifier(p: Place): string | null {
  const q = shared().qualifier.get(p.id);
  return q ? (/^the\s/i.test(q) ? `the ${q.slice(4)}` : q) : null;
}

/** The name a player sees: with its qualifier where the name is shared ("Imperial Military Camp, the Reach"), else the name. */
export const placeLabel = (p: Place): string => {
  const q = placeQualifier(p);
  return q ? `${p.name}, ${q}` : p.name;
};

const slugOf = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

let slugs: { bySlug: Map<string, Place>; byId: Map<string, string>; sharedSlugs: Map<string, Place[]> } | null = null;
function slugged() {
  if (slugs) return slugs;
  const bySlug = new Map<string, Place>();
  const byId = new Map<string, string>();
  const sharedSlugs = new Map<string, Place[]>();
  // The name alone; a name two places share takes its qualifier (the hold, the town or the kind), and the name alone lists them (WO-172).
  // Two names that make one slug take a number, in the index's order.
  for (const group of placesData().named.values()) if (group.length > 1) sharedSlugs.set(slugOf(group[0].name) || "place", group);
  for (const p of placesData().places) {
    const base = slugOf(p.name) || "place";
    const q = shared().qualifier.get(p.id);
    const wanted = q ? `${base}-${slugOf(q)}` : base;
    let slug = wanted;
    for (let n = 2; bySlug.has(slug) || (!q && sharedSlugs.has(slug)); n++) slug = `${wanted}-${n}`;
    bySlug.set(slug, p);
    byId.set(p.id, slug);
  }
  slugs = { bySlug, byId, sharedSlugs };
  return slugs;
}

/** A place's own address (WO-172): its slug is unique even where its name is not. */
export const placeSlug = (p: Place): string => slugged().byId.get(p.id) ?? slugOf(p.name);
export const placeHrefOf = (p: Place): string => `/places/${placeSlug(p)}`;

/**
 * A place's page address (WO-154) by its name, or null for a place the index doesn't have (a town's interior). A name that says which
 * ("Hall of the Dead, Whiterun") goes to that place; a shared name goes to the page that lists the places with it.
 */
export const placeHref = (name: string): string | null => {
  const p = placeByName(name);
  if (p) return placeHrefOf(p);
  const group = placesNamed(name);
  return group.length > 1 ? `/places/${slugOf(group[0].name)}` : null;
};
export const placeBySlug = (slug: string): Place | null => slugged().bySlug.get(slug) ?? null;
/** The places a shared address lists ("/places/imperial-military-camp"): null when the slug is not a shared name's. */
export const placesSharingSlug = (slug: string): Place[] | null => slugged().sharedSlugs.get(slug) ?? null;

/** "Nordic ruin", "Dragon lair", "Cave": a place's type in words. */
export function placeType(type: string): string {
  const words = type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
