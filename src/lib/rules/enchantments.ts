/**
 * Enchantments on made gear (WO-54). A made item's line is an enchantment's id from
 * enchantments.json when picked from the list, or the author's own words otherwise (any line saved
 * before this order). Which enchantments fit an item: weapon ones on a weapon; on armour or
 * jewellery, the ones whose slots include the item's.
 */
import type { Enchantment, GameData } from "./data";

/** What a made item takes enchantments as: a weapon, or armour in a slot. Null for ammo and the unknown. */
export type EnchantTarget = { on: "weapon" } | { on: "armor"; slot: string } | null;

/**
 * The target, from the base item when it's in the index (its kind and slot), otherwise from the
 * gear row's slot. The off hand takes both when the base isn't known (a weapon or a shield).
 */
export function enchantTarget(rowSlot: string, base?: { kind: string; slot?: string | null }): EnchantTarget | EnchantTarget[] {
  if (base?.kind === "weapon") return { on: "weapon" };
  if (base?.kind === "armor" && base.slot) return { on: "armor", slot: base.slot };
  if (base?.kind === "ammo") return null;
  switch (rowSlot) {
    case "Main hand":
      return { on: "weapon" };
    case "Off hand":
      return [{ on: "weapon" }, { on: "armor", slot: "Shield" }];
    case "Head":
    case "Body":
    case "Hands":
    case "Feet":
    case "Ring":
    case "Amulet":
      return { on: "armor", slot: rowSlot };
    case "Other":
      return [{ on: "weapon" }, ...["Head", "Body", "Hands", "Feet", "Shield", "Ring", "Amulet"].map((slot) => ({ on: "armor" as const, slot }))];
    default:
      return null;
  }
}

/** Whether an enchantment can go on the target. */
export function fitsTarget(e: Enchantment, target: EnchantTarget | EnchantTarget[]): boolean {
  const list = Array.isArray(target) ? target : [target];
  return list.some((t) => !!t && (t.on === "weapon" ? e.on === "weapon" : e.on === "armor" && e.slots.includes(t.slot)));
}

/** The enchantments that fit, A to Z, whose names hold every word of `q`. */
export function searchEnchantments(d: GameData, target: EnchantTarget | EnchantTarget[], q: string, limit = 10): Enchantment[] {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return d.enchantments
    .filter((e) => fitsTarget(e, target) && words.every((w) => e.name.toLowerCase().includes(w)))
    .sort((a, b) => Number(!!words[0] && !a.name.toLowerCase().startsWith(words[0])) - Number(!!words[0] && !b.name.toLowerCase().startsWith(words[0])) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/** A saved line: the game's enchantment when it's an id in the list, otherwise the author's text. */
export function readEnchantLine(d: GameData, line: string): { name: string; enchantment?: Enchantment } {
  const e = d.enchantmentById.get(line);
  return e ? { name: e.name, enchantment: e } : { name: line };
}

export const BASE_VALUES_NOTE = "Numbers are the game's base values. What you make depends on your Enchanting skill, perks and soul gem.";
