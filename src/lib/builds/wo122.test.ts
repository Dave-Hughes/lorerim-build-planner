import { describe, expect, it } from "vitest";
import { emptyPlan } from "./draft";
import { mergeChanged } from "./merge";
import { planChanges, savedByWords } from "./revisions";
import { emptyLevel } from "@/lib/rules/derive";
import type { BuildPlan } from "@/lib/rules/types";

const kyria = (): BuildPlan => ({ ...emptyPlan("5.0.4.8"), race: "Nord", birthsign: "Warrior", start: "Pilgrim (Temple)", startOption: "Temple of Mara", majors: ["Two-Handed", "Heavy Armor", "Speech"] });

describe("only what changed is written (WO-122)", () => {
  it("keeps a start changed elsewhere when a page left open changes the mode", () => {
    const opened: BuildPlan = { ...kyria(), start: "Dragonborn", startOption: undefined };
    delete opened.startOption;
    const stored = kyria(); // the connector set Pilgrim (Temple) after the page opened
    const merged = mergeChanged(stored, opened, { ...opened, mode: "Konahrik" });
    expect([merged.mode, merged.start, merged.startOption]).toEqual(["Konahrik", "Pilgrim (Temple)", "Temple of Mara"]);
  });
  it("writes a field the page took away", () => {
    const merged = mergeChanged(kyria(), kyria(), { ...kyria(), startOption: undefined });
    expect("startOption" in merged).toBe(false);
  });
});

describe("a build's saves, in plain words (WO-122)", () => {
  it("say who saved", () => {
    expect([savedByWords("setup", null), savedByWords("levels", null), savedByWords("connector", "Claude")]).toEqual(["Set up", "Levels editor", "Connector (Claude)"]);
  });
  it("say the change between two saves", () => {
    const before = kyria();
    const after: BuildPlan = { ...kyria(), start: "Dragonborn", mode: "Konahrik", traits: ["Fatal Attraction"], traitChoices: { "Fatal Attraction": "Female" }, levels: [emptyLevel(), emptyLevel()] };
    delete after.startOption;
    expect(planChanges(before, after)).toEqual(["Mode: Naaktiid to Konahrik", "Start: Pilgrim (Temple), Temple of Mara to Dragonborn", "Traits: none to Fatal Attraction: Female", "Levels: 1 to 2"]);
    const level = { ...kyria(), levels: [{ ...emptyLevel(), note: "Pick up a greatsword." }] };
    expect(planChanges(kyria(), level)).toEqual(["Level 1 changed"]);
    expect(planChanges(kyria(), kyria())).toEqual([]);
  });
});
