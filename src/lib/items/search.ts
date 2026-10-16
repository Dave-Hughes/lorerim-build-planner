/**
 * The item index's type and its pure helpers (WO-23, WO-92): no React, so a server page (the Gear
 * page) can use them as well as the editor.
 */
export interface GameItem {
  /** Plugin and form ID: "Skyrim.esm:012EB7". */
  id: string;
  name: string;
  kind: "weapon" | "armor" | "ammo";
  /** Armor: Head, Body, Hands, Feet, Shield, Ring or Amulet; null for pieces those don't cover. */
  slot?: string | null;
  /** Armor: its gear type (WO-82), LoreRim's own word: Cloak, Backpack, Face... (see GEAR_TYPES). */
  type?: string | null;
  armorType?: string | null;
  /** Weapons: Sword, Bow, Spear...; ammunition: Arrow or Bolt. */
  weaponType?: string | null;
  /** "Heavy armor, 25 armor, 30 weight" */
  stats: string;
  /** The numbers in `stats` (WO-91), for sorting: armor on armor, damage on weapons and ammo, weight on all. */
  armor?: number;
  damage?: number;
  weight?: number;
  text?: string;
  /** Other records with this name (WO-51 follow-up): a build that saved one of their ids still finds this item. */
  also?: string[];
}

/** Ids compare without case: one extract wrote "ccbgssse001-fish.esm", another "ccBGSSSE001-Fish.esm". */
export const idKey = (id: string) => id.toLowerCase();

/** Every item by its id and the ids in its `also`. */
export function indexById(list: GameItem[]): Map<string, GameItem> {
  const m = new Map<string, GameItem>();
  for (const i of list) for (const id of i.also ?? []) m.set(idKey(id), i);
  for (const i of list) m.set(idKey(i.id), i);
  return m;
}

/** Weapons that take both hands, so never in the off hand. */
const TWO_HANDED = new Set(["Greatsword", "Battleaxe", "Warhammer", "Bow", "Crossbow", "Staff", "Polearm"]);

/** Which items a gear slot can hold: Main hand any weapon; Off hand one-handed weapons and shields; armor by its slot. */
export function fitsSlot(item: GameItem, slot: string): boolean {
  switch (slot) {
    case "Main hand":
      return item.kind === "weapon";
    case "Off hand":
      return (item.kind === "weapon" && !TWO_HANDED.has(item.weaponType ?? "")) || (item.kind === "armor" && itemType(item) === "Shield");
    case "Ammo":
      return item.kind === "ammo";
    default:
      // An armor type (WO-82): its own rows.
      return item.kind === "armor" && itemType(item) === slot;
  }
}

/** An armor piece's gear type: the index's `type`, else its old slot. */
export function itemType(item: GameItem): string | null {
  return item.type ?? item.slot ?? null;
}

/**
 * The item search, at most `limit`: names that start with the query first, then names that contain
 * it, then names with every word of it anywhere, then every word in the name or the type line.
 * LoreRim renames many things ("Iron Cuirass", not Iron Armor), so "iron armor" still finds it.
 * `withText` (the Gear page, WO-92) also reads the game's text, last.
 */
export function searchItems(items: GameItem[], query: string, limit = 8, keep: (i: GameItem) => boolean = () => true, withText = false): GameItem[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return [];
  const words = q.split(" ");
  const ranked: { i: GameItem; rank: number }[] = [];
  for (const i of items) {
    if (!keep(i)) continue;
    const n = i.name.toLowerCase();
    const rank = n.startsWith(q) ? 0 : n.includes(q) ? 1 : words.every((w) => n.includes(w)) ? 2 : words.every((w) => n.includes(w) || i.stats.toLowerCase().includes(w)) ? 3 : withText && i.text && words.every((w) => n.includes(w) || i.stats.toLowerCase().includes(w) || i.text!.toLowerCase().includes(w)) ? 4 : -1;
    if (rank >= 0) ranked.push({ i, rank });
  }
  return ranked
    .sort((a, b) => a.rank - b.rank || a.i.name.length - b.i.name.length || a.i.name.localeCompare(b.i.name))
    .slice(0, limit)
    .map((r) => r.i);
}
