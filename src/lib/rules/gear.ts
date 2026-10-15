/**
 * Gear by level, by type (WO-82). A type holds any number of pieces, and the planner sets no rules on
 * what can be worn together. A row adds a piece; with `replaces` it takes that piece's place, or with
 * an empty name takes it off. A row written before WO-82 in one of the old single slots (Head, Body
 * and so on, `replaces` unset) takes the place of whatever that slot held, as it always did; an
 * empty one empties it. Gear is optional and never a problem.
 */
import type { BuildPlan, GearItem, MadeGear } from "./types";

/**
 * The gear types, in order: the hands and ammunition, then LoreRim's own type words (Aura's
 * Inventory Tweaks), as scripts/gamedata/items.py lists them.
 */
export const GEAR_TYPES = [
  "Main hand",
  "Off hand",
  "Ammo",
  "Head",
  "Circlet",
  "Face",
  "Body",
  "Hands",
  "Feet",
  "Legs",
  "Shield",
  "Cloak",
  "Mantle",
  "Pauldron",
  "Scarf",
  "Backpack",
  "Bag",
  "Belt Bag",
  "Bandolier",
  "Amulet",
  "Necklace",
  "Ring",
  "Earrings",
  "Bracelet",
  "Armlet",
  "Lantern",
  "Spyglass",
  "Instrument",
  "Accessory",
] as const;
export type GearType = (typeof GEAR_TYPES)[number];

/** The slots that held one piece before WO-82: a row there with `replaces` unset takes the place of what was worn. */
const SINGLE: ReadonlySet<string> = new Set(["Main hand", "Off hand", "Head", "Body", "Hands", "Feet", "Ring", "Amulet", "Ammo"]);

/** A piece worn at a level, its type (in `slot`, as the plan's rows keep it), and the level it was set. */
export interface HeldGear {
  slot: GearType;
  name: string;
  note: string;
  since: number;
  /** Set when the item was picked from the game's item index. */
  itemId?: string;
  /** Made by the player (WO-45). */
  made?: MadeGear;
}

/** A made staff's name, as the game gives it: "Staff of Forbidden Sun". */
export function madeStaffName(spellName: string): string {
  return `Staff of ${spellName}`;
}

const typeOrder = (type: string) => {
  const i = GEAR_TYPES.indexOf(type as GearType);
  return i < 0 ? GEAR_TYPES.length : i;
};

/** Rows up to a level, oldest level first (rows at the same level keep their order). */
function rowsTo(plan: BuildPlan, level: number): GearItem[] {
  return plan.gear
    .map((g, i) => ({ g, i }))
    .filter(({ g }) => g.fromLevel <= level)
    .sort((a, b) => a.g.fromLevel - b.g.fromLevel || a.i - b.i)
    .map(({ g }) => g);
}

/** A row from before WO-82 in an old single slot: it takes the place of whatever the slot held. */
export function takesWholeSlot(g: GearItem): boolean {
  return g.replaces === undefined && SINGLE.has(g.slot);
}

/** The pieces worn at a level, in type order, each type's pieces in the order they came. */
export function gearAt(plan: BuildPlan, level: number): HeldGear[] {
  const byType = new Map<string, HeldGear[]>();
  for (const g of rowsTo(plan, level)) {
    const name = g.name.trim();
    const item: HeldGear = { slot: g.slot as GearType, name, note: g.note, since: g.fromLevel, ...(g.itemId ? { itemId: g.itemId } : {}), ...(g.made ? { made: g.made } : {}) };
    let list = byType.get(g.slot) ?? [];
    if (takesWholeSlot(g)) list = name ? [item] : [];
    else {
      const at = g.replaces ? list.findIndex((o) => o.name === g.replaces) : -1;
      if (at >= 0) list = name ? list.map((o, i) => (i === at ? item : o)) : list.filter((_, i) => i !== at);
      else if (name) list = [...list.filter((o) => o.name !== name), item];
      // An old Other row with no name and nothing named emptied every Other item.
      else if (g.replaces === undefined) list = [];
    }
    byType.set(g.slot, list);
  }
  return [...byType.entries()].sort((a, b) => typeOrder(a[0]) - typeOrder(b[0])).flatMap(([, list]) => list);
}

/** The rows set at exactly this level, in type order. */
export function gearChanges(plan: BuildPlan, level: number): GearItem[] {
  return plan.gear.filter((g) => g.fromLevel === level).sort((a, b) => typeOrder(a.slot) - typeOrder(b.slot));
}

/** What a row took the place of, given what was worn the level before: "Imperial Cloak", or nothing when it adds. */
export function replacedName(g: GearItem, before: HeldGear[]): string | undefined {
  if (g.replaces) return g.replaces;
  if (takesWholeSlot(g)) return before.find((b) => b.slot === g.slot)?.name;
  return undefined;
}

/** "Steel spear (Main hand)", "Off hand emptied", "Imperial Cloak (Cloak) removed". */
export function gearChangeText(g: GearItem): string {
  if (g.name.trim()) return `${g.name.trim()} (${g.slot})`;
  if (g.replaces) return `${g.replaces} (${g.slot}) removed`;
  return `${g.slot} emptied`;
}

/** Old free-text slots, matched without case, spaces or hyphens. */
const OLD_SLOTS: Record<string, GearType> = {
  weapon: "Main hand",
  mainhand: "Main hand",
  shield: "Off hand",
  offhand: "Off hand",
  chest: "Body",
  body: "Body",
  armor: "Body",
  armour: "Body",
  head: "Head",
  helmet: "Head",
  hands: "Hands",
  gloves: "Hands",
  gauntlets: "Hands",
  feet: "Feet",
  boots: "Feet",
  ring: "Ring",
  amulet: "Amulet",
  necklace: "Amulet",
  ammo: "Ammo",
  arrows: "Ammo",
  bolts: "Ammo",
};

/**
 * A saved row's slot as a gear type (WO-82): the types and old names map, `Other` and anything
 * unknown read as Accessory. A row from before WO-82 (`legacy`) reads its old name first, so an old
 * free-text "Shield" stays the off hand and "Necklace" the amulet, as they always read.
 */
export function gearType(slot: string, legacy = false): GearType {
  const old = OLD_SLOTS[slot.toLowerCase().replace(/[^a-z]/g, "")];
  if (legacy && old) return old;
  if ((GEAR_TYPES as readonly string[]).includes(slot)) return slot as GearType;
  return old ?? "Accessory";
}
