import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { withGearSlots } from "./convert";
import { requireGameData } from "./data";
import { computeBuild } from "./engine";
import { setGearAt } from "@/components/editor/plan-ops";
import { gearAt, gearChangeText, gearChanges, gearType, madeStaffName } from "./gear";
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
    expect(gearType("Weapon")).toBe("Main hand");
    expect(gearType("Shield", true)).toBe("Off hand");
    expect(gearType("Chest")).toBe("Body");
    expect(gearType("Off-hand")).toBe("Off hand");
    // WO-82: the Other slot became Accessory.
    expect(gearType("Trinket")).toBe("Accessory");
    const plan = withGearSlots(withGear([row("Weapon", "Steel spear", 4, { note: "Bought" }), row("Shield", "Leather shield", 1), row("Trinket", "Lucky coin", 3)]));
    expect(plan.gear).toEqual([row("Main hand", "Steel spear", 4, { note: "Bought" }), row("Off hand", "Leather shield", 1), row("Accessory", "Lucky coin", 3)]);
  });

  it("reads Ushnar's staging gear by level under the new names", () => {
    const plan = withGearSlots(withGear([row("Body", "Iron armor", 1), row("Shield", "Hide shield", 1), row("Weapon", "Orcish war axe", 9), row("Body", "Orcish armor", 14)]));
    expect(names(plan, 9)).toEqual(["Main hand: Orcish war axe (9)", "Off hand: Hide shield (1)", "Body: Iron armor (1)"]);
    expect(names(plan, 14)).toEqual(["Main hand: Orcish war axe (9)", "Off hand: Hide shield (1)", "Body: Orcish armor (14)"]);
  });
});

describe("gear you make yourself (WO-45)", () => {
  it("a made staff with Forbidden Sun reads Staff of Forbidden Sun, and keeps what it's made of", () => {
    const d = requireGameData("5.0.4.8");
    const sun = d.spells.find((s) => s.name === "Forbidden Sun")!;
    expect(madeStaffName(sun.name)).toBe("Staff of Forbidden Sun");
    const made = { base: "Apprentice's Staff", spell: sun.id };
    const plan = setGearAt(withGear([]), 4, "Main hand", { name: madeStaffName(sun.name), note: "", made });
    expect(gearAt(plan, 5)).toEqual([{ slot: "Main hand", name: "Staff of Forbidden Sun", note: "", since: 4, made }]);
  });
});

describe("enchantment lines and the Enchanting perks (WO-53)", () => {
  /** The sample stretched to 40 levels, with perks taken at the levels given and one made ring. */
  function plan(lines: string[], at: number, perks: Record<number, string[]> = {}, made: Partial<GearItem["made"]> = {}): BuildPlan {
    const levels = [...base.levels, ...Array.from({ length: 40 - base.levels.length }, () => ({ skillPoints: {}, perks: [] as string[], destiny: [] as string[], extras: [], note: "" }))].map((lv, i) =>
      perks[i + 1] ? { ...lv, perks: [...lv.perks, ...perks[i + 1]] } : lv,
    );
    return { ...base, levels, gear: [row("Ring", "Silver Ring", at, { made: { base: "Silver Ring", enchantments: lines, ...made } })] };
  }
  const enchantIssues = (p: BuildPlan) =>
    computeBuild(p).flatMap((s) => s.issues.filter((i) => i.code === "enchant-perk").map((i) => `${s.level}: ${i.message}`));
  const MASTERY = "Enchanting:Enchantment Mastery";
  const ARTIFACT = "Enchanting:Artifact Enchanter";

  it("one line needs no perk", () => {
    expect(enchantIssues(plan(["Fortify Magicka"], 20))).toEqual([]);
  });
  it("two lines at 20 with Enchantment Mastery at 30 is a problem at 20", () => {
    expect(enchantIssues(plan(["Fortify Magicka", "Fortify Destruction"], 20, { 30: [MASTERY] }))).toEqual(["20: Two enchantments need Enchantment Mastery, not taken by level 20."]);
  });
  it("two lines at 30 with Mastery at 30 is fine", () => {
    expect(enchantIssues(plan(["Fortify Magicka", "Fortify Destruction"], 30, { 30: [MASTERY] }))).toEqual([]);
  });
  it("three lines with Mastery only is a problem", () => {
    expect(enchantIssues(plan(["A", "B", "C"], 34, { 30: [MASTERY] }))).toEqual(["34: Three enchantments need Artifact Enchanter, not taken by level 34."]);
  });
  it("three lines with Artifact Enchanter is fine", () => {
    expect(enchantIssues(plan(["A", "B", "C"], 34, { 30: [MASTERY], 32: [ARTIFACT] }))).toEqual([]);
  });
  it("a staff with a spell isn't checked", () => {
    // Even with lines left over from before it was a staff.
    expect(enchantIssues(plan(["A", "B"], 20, {}, { spell: requireGameData("5.0.4.8").spells[0].id }))).toEqual([]);
  });
});
