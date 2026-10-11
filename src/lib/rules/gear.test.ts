import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { withGearSlots } from "./convert";
import { gearAt, gearChangeText, gearChanges, gearSlot } from "./gear";
import type { BuildPlan, GearItem } from "./types";

const base = sample as unknown as BuildPlan;
const withGear = (gear: GearItem[]): BuildPlan => ({ ...base, gear });
const row = (slot: string, name: string, fromLevel: number, extra: Partial<GearItem> = {}): GearItem => ({ slot, name, fromLevel, note: "", ...extra });
const names = (plan: BuildPlan, level: number) => gearAt(plan, level).map((g) => `${g.slot}: ${g.name} (${g.since})`);

describe("gearAt", () => {
  it("carries an item forward to later levels", () => {
    const plan = withGear([row("Main hand", "Steel sword", 2)]);
    expect(names(plan, 1)).toEqual([]);
    expect(names(plan, 2)).toEqual(["Main hand: Steel sword (2)"]);
    expect(names(plan, 9)).toEqual(["Main hand: Steel sword (2)"]);
  });

  it("lets a later row replace the item, from its own level on", () => {
    const plan = withGear([row("Main hand", "Steel spear", 5), row("Main hand", "Iron sword", 2)]);
    expect(names(plan, 4)).toEqual(["Main hand: Iron sword (2)"]);
    expect(names(plan, 5)).toEqual(["Main hand: Steel spear (5)"]);
  });

  it("empties a slot with an empty name", () => {
    const plan = withGear([row("Off hand", "Leather shield", 1), row("Off hand", "", 4), row("Off hand", "Steel shield", 7)]);
    expect(names(plan, 3)).toEqual(["Off hand: Leather shield (1)"]);
    expect(names(plan, 4)).toEqual([]);
    expect(names(plan, 7)).toEqual(["Off hand: Steel shield (7)"]);
  });

  it("holds several items in Other, and replaces or removes one by name", () => {
    const plan = withGear([
      row("Other", "Torch", 1),
      row("Other", "Lockpicks", 2),
      row("Other", "Lantern", 4, { replaces: "Torch" }),
      row("Other", "", 6, { replaces: "Lockpicks" }),
    ]);
    expect(names(plan, 3)).toEqual(["Other: Torch (1)", "Other: Lockpicks (2)"]);
    expect(names(plan, 4)).toEqual(["Other: Lantern (4)", "Other: Lockpicks (2)"]);
    expect(names(plan, 6)).toEqual(["Other: Lantern (4)"]);
  });

  it("lists slots in the fixed order, Other last", () => {
    const plan = withGear([row("Other", "Torch", 1), row("Feet", "Boots", 1), row("Main hand", "Mace", 1)]);
    expect(gearAt(plan, 1).map((g) => g.slot)).toEqual(["Main hand", "Feet", "Other"]);
  });
});

describe("gearChanges", () => {
  it("lists only the rows set at that level, worded for the card", () => {
    const plan = withGear([row("Main hand", "Steel spear", 4), row("Off hand", "", 4), row("Ammo", "Javelins", 8), row("Other", "", 4, { replaces: "Torch" })]);
    expect(gearChanges(plan, 4).map(gearChangeText)).toEqual(["Steel spear (Main hand)", "Off hand emptied", "Torch (Other) removed"]);
    expect(gearChanges(plan, 5)).toEqual([]);
  });
});

describe("old gear slots", () => {
  it("maps old free-text slots and keeps every row", () => {
    expect(gearSlot("Weapon")).toBe("Main hand");
    expect(gearSlot("Shield")).toBe("Off hand");
    expect(gearSlot("Chest")).toBe("Body");
    expect(gearSlot("Off-hand")).toBe("Off hand");
    expect(gearSlot("Trinket")).toBe("Other");
    const plan = withGearSlots(withGear([row("Weapon", "Steel spear", 4, { note: "Bought" }), row("Shield", "Leather shield", 1), row("Trinket", "Lucky coin", 3)]));
    expect(plan.gear).toEqual([row("Main hand", "Steel spear", 4, { note: "Bought" }), row("Off hand", "Leather shield", 1), row("Other", "Lucky coin", 3)]);
  });

  it("reads Ushnar's staging gear by level under the new names", () => {
    const plan = withGearSlots(withGear([row("Body", "Iron armor", 1), row("Shield", "Hide shield", 1), row("Weapon", "Orcish war axe", 9), row("Body", "Orcish armor", 14)]));
    expect(names(plan, 9)).toEqual(["Main hand: Orcish war axe (9)", "Off hand: Hide shield (1)", "Body: Iron armor (1)"]);
    expect(names(plan, 14)).toEqual(["Main hand: Orcish war axe (9)", "Off hand: Hide shield (1)", "Body: Orcish armor (14)"]);
  });
});
