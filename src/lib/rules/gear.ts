/**
 * Gear by level. A row means "from this level on, this slot holds this item", until a later row
 * for the same slot; a row with an empty name empties the slot from its level. `Other` holds
 * several items: a row there adds one, or replaces (or, with an empty name, takes away) the item
 * named in `replaces`. Gear is optional and never a problem.
 */
import type { BuildPlan, GearItem } from "./types";

export const GEAR_SLOTS = ["Main hand", "Off hand", "Head", "Body", "Hands", "Feet", "Ring", "Amulet", "Ammo", "Other"] as const;
export type GearSlot = (typeof GEAR_SLOTS)[number];

/** What a slot holds at a level, and the level it was set. */
export interface HeldGear {
  slot: GearSlot;
  name: string;
  note: string;
  since: number;
}

const slotOrder = (slot: string) => GEAR_SLOTS.indexOf(slot as GearSlot);

/** Rows up to a level, oldest level first (rows at the same level keep their order). */
function rowsTo(plan: BuildPlan, level: number): GearItem[] {
  return plan.gear
    .map((g, i) => ({ g, i }))
    .filter(({ g }) => g.fromLevel <= level)
    .sort((a, b) => a.g.fromLevel - b.g.fromLevel || a.i - b.i)
    .map(({ g }) => g);
}

/** The item each slot holds at a level, in slot order (`Other` items in the order they came). */
export function gearAt(plan: BuildPlan, level: number): HeldGear[] {
  const slots = new Map<GearSlot, HeldGear>();
  let other: HeldGear[] = [];
  for (const g of rowsTo(plan, level)) {
    const name = g.name.trim();
    const item: HeldGear = { slot: g.slot as GearSlot, name, note: g.note, since: g.fromLevel };
    if (g.slot !== "Other") {
      if (name) slots.set(item.slot, item);
      else slots.delete(item.slot);
      continue;
    }
    const at = g.replaces ? other.findIndex((o) => o.name === g.replaces) : -1;
    if (at >= 0) other = name ? other.map((o, i) => (i === at ? item : o)) : other.filter((_, i) => i !== at);
    else if (name) other = [...other.filter((o) => o.name !== name), item];
    else if (!g.replaces) other = [];
  }
  return [...[...slots.values()].sort((a, b) => slotOrder(a.slot) - slotOrder(b.slot)), ...other];
}

/** The rows set at exactly this level, in slot order. */
export function gearChanges(plan: BuildPlan, level: number): GearItem[] {
  return plan.gear.filter((g) => g.fromLevel === level).sort((a, b) => slotOrder(a.slot) - slotOrder(b.slot));
}

/** "Steel spear (Main hand)", "Off hand emptied", "Torch (Other) removed". */
export function gearChangeText(g: GearItem): string {
  if (g.name.trim()) return `${g.name.trim()} (${g.slot})`;
  if (g.slot === "Other" && g.replaces) return `${g.replaces} (Other) removed`;
  return `${g.slot} emptied`;
}

/** Old free-text slots, matched without case, spaces or hyphens. */
const OLD_SLOTS: Record<string, GearSlot> = {
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

/** A saved slot as one of the fixed slots: old names are mapped, anything unknown is `Other`. */
export function gearSlot(slot: string): GearSlot {
  if ((GEAR_SLOTS as readonly string[]).includes(slot)) return slot as GearSlot;
  return OLD_SLOTS[slot.toLowerCase().replace(/[^a-z]/g, "")] ?? "Other";
}
