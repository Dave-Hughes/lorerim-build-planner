import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { currentVersion } from "@/lib/rules/server";

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
  /** The quest the line belongs to, by its name. */
  quest?: string;
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
  /** Who the war's garrisons put here later, in this same shape (WO-144 Part 1e-4); the door doesn't read it yet. */
  afterTheWar?: unknown;
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
  hold?: string;
  nearestTown?: { town: string; km: number; walk?: string };
  nearestCity?: { town: string; km: number; walk?: string };
  /** The town it sits inside (a guild hall, an inn, a temple): not a place to go out to. */
  inTown?: string;
  clearXp: number;
  actors?: Actors;
  /** What the people who live there say to a stranger at the door (an Orc stronghold), in the game's words. */
  enters?: { words: string; from?: string };
  pointers?: PlacePointer[];
  /** Named quests that go there. */
  quests?: string[];
}

let cached: { places: Place[]; byName: Map<string, Place> } | null = null;

const key = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

export function placesData() {
  if (cached) return cached;
  let places: Place[] = [];
  try {
    places = (JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "places.json"), "utf8")) as { places: Place[] }).places;
  } catch {
    // Not built yet.
  }
  cached = { places, byName: new Map(places.map((p) => [key(p.name), p])) };
  return cached;
}

/** A place by its name, case and spacing aside; null when the index has none. */
export const placeByName = (name: string) => placesData().byName.get(key(name)) ?? null;

/** "Nordic ruin", "Dragon lair", "Cave": a place's type in words. */
export function placeType(type: string): string {
  const words = type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
