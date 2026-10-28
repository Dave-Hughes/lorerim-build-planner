import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { currentVersion } from "@/lib/rules/server";
import { placeByName, placeHrefOf, placeLabel, placesData, type Place } from "./data";
import { placeKind } from "./kind";

/**
 * LoreRim's own paper map on the site (WO-167): where a place is on it, and what is around it. The map is Skyrim Paper Map by Caro Tuts, with
 * its author's leave on the condition that every instance of it carries a credit and link (`MapView` always draws them). Only Skyrim's own map
 * (the world "Tamriel") is cleared; a place on Solstheim or in a mod's land has no map until that map's author says yes.
 */
export interface MapEntry {
  world: string;
  credit: { text: string; url: string };
  texture: { width: number; height: number; origin: [number, number]; unitsPerPixel: number };
  border: [number, number, number, number];
  image: { url: string; width: number; height: number };
  tiles: { url: string; size: number; zooms: { z: number; size: number; columns: [number, number]; rows: [number, number] }[] };
}

/** What kind of pin: blue a town, red a place that is a fight, grey the rest (rule 34). */
export type PinKind = "town" | "danger" | "other";

export interface Pin {
  name: string;
  href: string;
  kind: PinKind;
  /** On the 8192 texture the tiles are cut from, in pixels. */
  px: number;
  py: number;
  type: string;
  hold?: string;
}

let cached: Record<string, MapEntry> | null = null;
export function mapEntry(world = "Tamriel"): MapEntry | null {
  if (!cached) {
    try {
      cached = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "maps.json"), "utf8")) as Record<string, MapEntry>;
    } catch {
      cached = {};
    }
  }
  return cached[world] ?? null;
}

/** A game position as a pixel of the 8192 texture: x grows east and y grows north in the game, and the picture's y grows down. */
export const toTexture = (m: MapEntry, x: number, y: number) => ({ px: m.texture.origin[0] + x / m.texture.unitsPerPixel, py: m.texture.origin[1] - y / m.texture.unitsPerPixel });

/** Whether a pixel of the texture is inside the paper map's frame: a place beyond it (a stray "Campsite") has no spot on the map. */
export const inFrame = (m: MapEntry, px: number, py: number) => px >= m.border[0] && px <= m.border[2] && py >= m.border[1] && py <= m.border[3];

const kindOf = (p: Place): PinKind => {
  const k = placeKind(p);
  return k === "town" ? "town" : k === "dangerous" ? "danger" : "other";
};

/** Every place on Skyrim's map, once each (a name and spot listed twice is one pin). */
let pinned: Pin[] | null = null;
export function mapPins(): Pin[] {
  if (pinned) return pinned;
  const m = mapEntry();
  const seen = new Set<string>();
  const out: Pin[] = [];
  if (m)
    for (const p of placesData().places) {
      if (p.world !== "Tamriel" || !p.pos) continue;
      const href = placeHrefOf(p);
      const { px, py } = toTexture(m, p.pos[0], p.pos[1]);
      if (!inFrame(m, px, py)) continue;
      // A place once: its own address and spot (the same name and spot listed twice is one pin, and two places of one name are two).
      const key = `${href}|${Math.round(px / 4)}|${Math.round(py / 4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ name: placeLabel(p), href, kind: kindOf(p), px, py, type: p.type, ...(p.hold ? { hold: p.hold } : {}) });
    }
  pinned = out;
  return out;
}

const DIRECTIONS = ["East", "Northeast", "North", "Northwest", "West", "Southwest", "South", "Southeast"];

/** "West of Riverwood, a short walk, and well above it": the direction and distance from the nearest town, and the height against it. */
export function gettingThere(p: Place): string | null {
  const t = p.nearestTown;
  const town = t ? placeByName(t.town) : null;
  if (!t || !town?.pos || !p.pos || town.world !== p.world) return null;
  const dx = p.pos[0] - town.pos[0];
  const dy = p.pos[1] - town.pos[1];
  const dir = DIRECTIONS[Math.round(Math.atan2(dy, dx) / (Math.PI / 4) + 8) % 8];
  const dz = (p.pos[2] ?? town.pos[2] ?? 0) - (town.pos[2] ?? 0);
  const high = p.pos[2] == null || town.pos[2] == null ? null : Math.abs(dz) < 600 ? "about level with it" : `${Math.abs(dz) > 2000 ? "well " : "a little "}${dz > 0 ? "above" : "below"} it`;
  const how = t.walk === "next to it" ? "right next to it" : (t.walk ?? `${t.km} km away`);
  return `${dir} of ${t.town}, ${how}${high ? `, and ${high}` : ""}.`;
}

export interface PlaceMap {
  credit: MapEntry["credit"];
  entry: MapEntry;
  /** The pin the page is about; for a place inside a town, the town's. */
  here: Pin;
  inTown: string | null;
  /** The places around it, nearest first. */
  around: Pin[];
  gettingThere: string | null;
}

/** The map for a place's page, or null when there is nothing to show: no position, or a map that isn't cleared. */
export function placeMap(place: Place): PlaceMap | null {
  const entry = mapEntry();
  if (!entry) return null;
  const inTown = place.inTown ? placeByName(place.inTown) : null;
  const at = place.pos && place.world === "Tamriel" ? place : inTown?.pos && inTown.world === "Tamriel" ? inTown : null;
  if (!at?.pos) return null;
  const { px, py } = toTexture(entry, at.pos[0], at.pos[1]);
  const href = placeHrefOf(at);
  const here: Pin = { name: placeLabel(at), href, kind: kindOf(at), px, py, type: at.type };
  const around = mapPins()
    .filter((p) => p.href !== href)
    .map((p) => ({ p, d: Math.hypot(p.px - px, p.py - py) }))
    .filter((x) => x.d < 1100)
    .sort((a, b) => a.d - b.d)
    .slice(0, 40)
    .map((x) => x.p);
  return { credit: entry.credit, entry, here, inTown: place.inTown && at !== place ? place.inTown : null, around, gettingThere: at === place ? gettingThere(place) : null };
}
