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

export interface Place {
  id: string;
  name: string;
  /** The map marker's kind, else the location's: Cave, Mine, Fort, NordicRuin... */
  type: string;
  hold?: string;
  nearestTown?: { town: string; km: number };
  nearestCity?: { town: string; km: number };
  clearXp: number;
  actors?: { count: number; levels: [number, number]; zoneMin?: number; boss?: { name?: string; level?: string } };
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
