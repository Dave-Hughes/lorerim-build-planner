import { describe, expect, it } from "vitest";
import sevari from "./__fixtures__/sevari.json";
import { requireGameData } from "./data";
import { computeBuild } from "./engine";
import { levelChanges, stretchPerkOrder, stretchPerkRequirement } from "./derive";
import { enchantLines } from "./enchantments";
import { levelsLine, writtenLevels } from "./stretches";
import { READER_TOUR } from "@/lib/tour";
import type { BuildPlan } from "./types";

const d = requireGameData("5.0.4.8");
const plan = sevari.plan as unknown as BuildPlan;

describe("WO-72: things the app gets wrong", () => {
  it("point 2: a stretch card gives the rank's own requirement", () => {
    expect(stretchPerkRequirement(d, "One-Handed:Short Blade Focus", "One-Handed", 1)).toBe("(One-Handed 25)");
    expect(stretchPerkRequirement(d, "One-Handed:Short Blade Focus", "One-Handed", 3)).toBe("(One-Handed 75)");
    // On Sevari's 21 to 30 card, Short Blade Focus is its third rank.
    const states = computeBuild(plan, d);
    const sbf = levelChanges(d, plan, states, 30).perks.find((p) => p.name === "Short Blade Focus")!;
    expect(sbf.rank).toBe(3);
    expect(stretchPerkRequirement(d, sbf.id, sbf.tree, sbf.rank)).toBe("(One-Handed 75)");
  });

  it("point 3: the reader's tour greets a visitor (in WO-80's plain words)", () => {
    expect(READER_TOUR({ guide: true, story: false }).welcome.text).toBe("New here? Tapps can walk you through this build, one part of the page at a time.");
  });

  it("point 4: only runs of single levels merge", () => {
    expect(levelsLine(writtenLevels(plan))).toBe("Levels 1 to 5, 10, 19, 20, 30, 40, 50, 75, 100");
    // A run of single levels after a stretch's end still merges among itself.
    expect(levelsLine([1, 2, 10, 11, 12, 20])).toBe("Levels 1 to 2, 10, 11 to 12, 20");
    expect(levelsLine([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50])).toBe("Levels 1 to 10, 25, 50");
  });

  it("point 11: enchantment lines follow the enchanting perks held", () => {
    const states = computeBuild(plan, d);
    // Sevari takes Enchantment Mastery and Artifact Enchanter in 76 to 100.
    expect(enchantLines(d, states[74])).toEqual({ allowed: 1, missing: "Two enchantments need Enchantment Mastery." });
    expect(enchantLines(d, states[99])).toEqual({ allowed: 3 });
    const mastery = { ...states[74], perksTaken: { ...states[74].perksTaken, "Enchanting:Enchantment Mastery": [80] } };
    expect(enchantLines(d, mastery)).toEqual({ allowed: 2, missing: "Three enchantments need Artifact Enchanter." });
  });

  it("point 12: a stretch card lists perks by tree, then requirement, then name", () => {
    const states = computeBuild(plan, d);
    const names = stretchPerkOrder(d, levelChanges(d, plan, states, 100).perks).map((p) => p.name);
    // The prerequisite Improved Protection now sits before Ward Mastery, with Restoration's perks.
    expect(names.indexOf("Improved Protection")).toBeLessThan(names.indexOf("Ward Mastery"));
    const restoration = names.filter((n) => ["Apprentice Restoration", "Adept Restoration", "Expert Restoration", "Master Restoration", "Improved Healing", "Respite", "Improved Protection", "Improved Wards", "Ward Mastery"].includes(n));
    const at = names.indexOf(restoration[0]);
    expect(names.slice(at, at + restoration.length)).toEqual(restoration);
  });
});
