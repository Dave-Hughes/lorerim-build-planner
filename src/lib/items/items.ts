/**
 * The game's weapons, armor and ammunition (WO-23), for the gear search and @-mentions. The
 * index is large, so it never ships in the page: it is fetched once per version, the first
 * time a gear search or an "@" needs it, from a long-cached static route.
 */
import { useEffect, useSyncExternalStore } from "react";

export interface GameItem {
  /** Plugin and form ID: "Skyrim.esm:012EB7". */
  id: string;
  name: string;
  kind: "weapon" | "armor" | "ammo";
  /** Armor: Head, Body, Hands, Feet, Shield, Ring or Amulet. */
  slot?: string | null;
  armorType?: string | null;
  /** Weapons: Sword, Bow, Spear...; ammunition: Arrow or Bolt. */
  weaponType?: string | null;
  /** "Heavy armor · 25 armor · 30 weight" */
  stats: string;
  text?: string;
}

const loaded = new Map<string, { list: GameItem[]; byId: Map<string, GameItem> }>();
const pending = new Map<string, Promise<GameItem[]>>();
const listeners = new Set<() => void>();

/** Fetches a version's items once; later calls share the same answer. An error gives an empty list, tried again next time. */
export function loadItems(version: string): Promise<GameItem[]> {
  const hit = loaded.get(version);
  if (hit) return Promise.resolve(hit.list);
  let p = pending.get(version);
  if (!p) {
    p = fetch(`/api/items/${encodeURIComponent(version)}`)
      .then((r) => (r.ok ? (r.json() as Promise<GameItem[]>) : Promise.reject(new Error(String(r.status)))))
      .then((list) => {
        loaded.set(version, { list, byId: new Map(list.map((i) => [i.id, i])) });
        listeners.forEach((l) => l());
        return list;
      })
      .catch(() => [] as GameItem[])
      .finally(() => pending.delete(version));
    pending.set(version, p);
  }
  return p;
}

/** The items already fetched for a version, or null. */
export function loadedItems(version: string): GameItem[] | null {
  return loaded.get(version)?.list ?? null;
}

export function itemById(version: string, id: string): GameItem | undefined {
  return loaded.get(version)?.byId.get(id);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** A version's items once fetched (null until then). `wanted` starts the fetch. */
export function useItems(version: string, wanted: boolean): GameItem[] | null {
  const list = useSyncExternalStore(
    subscribe,
    () => loaded.get(version)?.list ?? null,
    () => null,
  );
  useEffect(() => {
    if (wanted && version) void loadItems(version);
  }, [wanted, version]);
  return list;
}

/** Weapons that take both hands, so never in the off hand. */
const TWO_HANDED = new Set(["Greatsword", "Battleaxe", "Warhammer", "Bow", "Crossbow", "Staff"]);

/** Which items a gear slot can hold: Main hand any weapon; Off hand one-handed weapons and shields; armor by its slot. */
export function fitsSlot(item: GameItem, slot: string): boolean {
  switch (slot) {
    case "Main hand":
      return item.kind === "weapon";
    case "Off hand":
      return (item.kind === "weapon" && !TWO_HANDED.has(item.weaponType ?? "")) || (item.kind === "armor" && item.slot === "Shield");
    case "Ammo":
      return item.kind === "ammo";
    case "Other":
      return true;
    default:
      return item.kind === "armor" && item.slot === slot;
  }
}

/**
 * The item search, at most `limit`: names that start with the query first, then names that contain
 * it, then names with every word of it anywhere, then every word in the name or the type line.
 * LoreRim renames many things ("Iron Cuirass", not Iron Armor), so "iron armor" still finds it.
 */
export function searchItems(items: GameItem[], query: string, limit = 8, keep: (i: GameItem) => boolean = () => true): GameItem[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return [];
  const words = q.split(" ");
  const ranked: { i: GameItem; rank: number }[] = [];
  for (const i of items) {
    if (!keep(i)) continue;
    const n = i.name.toLowerCase();
    const rank = n.startsWith(q) ? 0 : n.includes(q) ? 1 : words.every((w) => n.includes(w)) ? 2 : words.every((w) => n.includes(w) || i.stats.toLowerCase().includes(w)) ? 3 : -1;
    if (rank >= 0) ranked.push({ i, rank });
  }
  return ranked
    .sort((a, b) => a.rank - b.rank || a.i.name.length - b.i.name.length || a.i.name.localeCompare(b.i.name))
    .slice(0, limit)
    .map((r) => r.i);
}
