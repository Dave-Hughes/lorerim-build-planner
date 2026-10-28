import { describe, expect, it } from "vitest";
import sample from "@/lib/rules/__fixtures__/sample-build.json";
import { requireGameData } from "@/lib/rules/data";
import type { BuildPlan } from "@/lib/rules/types";
import { checkStep } from "./steps";
import { emptyPlan } from "./draft";

const d = requireGameData("5.0.4.8");
const full = sample as unknown as BuildPlan;
const blank = emptyPlan("5.0.4.8");

describe("Set up's step checks (WO-58)", () => {
  it("Race: done once chosen", () => {
    expect(checkStep(d, blank, "", "race")).toEqual({ state: "next" });
    expect(checkStep(d, full, "", "race")).toEqual({ state: "done" });
  });

  it("Birthsign: done once chosen, or removed by Master of Destiny", () => {
    expect(checkStep(d, { ...full, birthsign: "" }, "", "birthsign")).toEqual({ state: "next" });
    expect(checkStep(d, full, "", "birthsign")).toEqual({ state: "done" });
    expect(checkStep(d, { ...full, birthsign: "", traits: ["Master of Destiny"] }, "", "birthsign")).toEqual({ state: "done" });
  });

  it("Skills: 3 majors and 6 minors; part way is a problem saying what's left", () => {
    expect(checkStep(d, blank, "", "skills")).toEqual({ state: "next" });
    const majors = ["Heavy Armor", "Block", "One-Handed"];
    const minors = ["Smithing", "Alchemy", "Wayfarer", "Speech", "Evasion", "Sneak"];
    expect(checkStep(d, { ...full, majors, minors }, "", "skills")).toEqual({ state: "done" });
    expect(checkStep(d, { ...full, majors, minors: minors.slice(0, 4) }, "", "skills")).toEqual({ state: "problem", problem: "Choose 2 more minors" });
    expect(checkStep(d, { ...full, majors: full.majors.slice(0, 2), minors: [] }, "", "skills")).toEqual({ state: "problem", problem: "Choose 1 more major" });
  });

  it("Traits: none is valid but no tick (optional); a trait that asks for a choice needs one", () => {
    expect(checkStep(d, { ...full, traits: [] }, "", "traits")).toEqual({ state: "optional" });
    expect(checkStep(d, { ...full, traits: ["Focused Combat"], traitChoices: {} }, "", "traits")).toEqual({ state: "problem", problem: "Focused Combat needs a skill" });
    expect(checkStep(d, { ...full, traits: ["Focused Combat"], traitChoices: { "Focused Combat": "Marksman" } }, "", "traits")).toEqual({ state: "done" });
    expect(checkStep(d, { ...full, traits: ["Master of One"] }, "", "traits")).toEqual({ state: "problem", problem: "Master of One needs a skill" });
  });

  it("Deity: a tick only when one is chosen; empty is optional (WO-179)", () => {
    expect(checkStep(d, { ...full, deity: "" }, "", "deity")).toEqual({ state: "optional" });
    expect(checkStep(d, { ...full, deity: d.deities[0] }, "", "deity")).toEqual({ state: "done" });
  });

  it("Mode and start: a start, and its option when it has one", () => {
    expect(checkStep(d, { ...full, start: "" }, "", "mode")).toEqual({ state: "next" });
    const withOption = d.starts.find((s) => s.options.length)!;
    expect(checkStep(d, { ...full, start: withOption.name, startOption: undefined }, "", "mode")).toEqual({
      state: "problem",
      problem: `Choose a ${(withOption.optionLabel ?? "choice").toLowerCase()}`,
    });
    expect(checkStep(d, { ...full, start: withOption.name, startOption: withOption.options[0] }, "", "mode")).toEqual({ state: "done" });
  });

  it("Details: a name", () => {
    expect(checkStep(d, full, "  ", "name")).toEqual({ state: "next" });
    expect(checkStep(d, full, "Spartan", "name")).toEqual({ state: "done" });
  });
});
