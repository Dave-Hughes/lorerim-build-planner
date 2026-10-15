import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { withGearSlots } from "./convert";
import { emptyGearAt, setGearAt, undoGearAt } from "@/components/editor/plan-ops";
import { gearAt, gearChangeText, gearChanges, replacedName } from "./gear";
import type { BuildPlan, GearItem } from "./types";

const base = sample as unknown as BuildPlan;
const withGear = (gear: GearItem[]): BuildPlan => ({ ...base, gear });
const worn = (plan: BuildPlan, level: number) => gearAt(plan, level).map((g) => `${g.slot}: ${g.name}`);
const put = (plan: BuildPlan, level: number, type: string, name: string, replaces?: string) => setGearAt(plan, level, type, { name, note: "" }, replaces);

describe("WO-82: gear by type, any number at once", () => {
  it("holds two pieces of one type, each added", () => {
    let plan = put(withGear([]), 2, "Accessory", "Histus Flask");
    plan = put(plan, 3, "Accessory", "Lucky Coin");
    expect(worn(plan, 3)).toEqual(["Accessory: Histus Flask", "Accessory: Lucky Coin"]);
    expect(plan.gear.every((g) => g.replaces === "")).toBe(true);
    // Two of a type that was one slot before: two rings.
    plan = put(put(plan, 4, "Ring", "Gold Ring"), 4, "Ring", "Silver Ring");
    expect(worn(plan, 4).filter((w) => w.startsWith("Ring"))).toEqual(["Ring: Gold Ring", "Ring: Silver Ring"]);
  });

  it("replaces one piece, leaving the others, and says so on the card", () => {
    let plan = put(put(withGear([]), 1, "Cloak", "Imperial Cloak"), 1, "Accessory", "Torch");
    plan = put(plan, 5, "Cloak", "Fur Cape", "Imperial Cloak");
    expect(worn(plan, 4)).toEqual(["Cloak: Imperial Cloak", "Accessory: Torch"]);
    expect(worn(plan, 5)).toEqual(["Cloak: Fur Cape", "Accessory: Torch"]);
    const row = gearChanges(plan, 5)[0];
    expect(replacedName(row, gearAt(plan, 4))).toBe("Imperial Cloak");
  });

  it("Empty from here takes one piece off, and Undo puts it back", () => {
    let plan = put(put(withGear([]), 1, "Ring", "Gold Ring"), 1, "Ring", "Silver Ring");
    plan = emptyGearAt(plan, 6, "Ring", "Gold Ring");
    expect(worn(plan, 6)).toEqual(["Ring: Silver Ring"]);
    expect(gearChanges(plan, 6).map(gearChangeText)).toEqual(["Gold Ring (Ring) removed"]);
    expect(worn(undoGearAt(plan, 6, "Ring", "Gold Ring"), 6)).toEqual(["Ring: Gold Ring", "Ring: Silver Ring"]);
    // A piece added at that same level just goes.
    const added = put(plan, 7, "Ring", "Iron Ring");
    expect(emptyGearAt(added, 7, "Ring", "Iron Ring").gear).toEqual(plan.gear);
  });

  it("reads an old build's Other row as Accessory, and its single slots as before", () => {
    const old = withGearSlots(
      withGear([
        { slot: "Head", name: "Iron Helmet", fromLevel: 1, note: "" },
        { slot: "Head", name: "Steel Helmet", fromLevel: 4, note: "" },
        { slot: "Other", name: "Torch", fromLevel: 1, note: "" },
        { slot: "Other", name: "Lantern", fromLevel: 3, note: "", replaces: "Torch" },
        { slot: "Shield", name: "Hide Shield", fromLevel: 2, note: "" },
      ]),
    );
    expect(old.gear.map((g) => g.slot)).toEqual(["Head", "Head", "Accessory", "Accessory", "Off hand"]);
    // The old Head row still takes the place of the one before.
    expect(worn(old, 4)).toEqual(["Off hand: Hide Shield", "Head: Steel Helmet", "Accessory: Lantern"]);
    expect(replacedName(gearChanges(old, 4)[0], gearAt(old, 3))).toBe("Iron Helmet");
    // Empty from here on an old single slot empties it, as it did.
    expect(worn(emptyGearAt(old, 6, "Head", "Steel Helmet"), 6)).toEqual(["Off hand: Hide Shield", "Accessory: Lantern"]);
  });
});
