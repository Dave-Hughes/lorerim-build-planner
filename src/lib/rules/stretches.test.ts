import { describe, expect, it } from "vitest";
import { parseBuildPlan } from "@/lib/builds/validate";
import { altmerSkipsPlan } from "./__fixtures__/altmer-skips";
import { convertPlan } from "./convert";
import { requireGameData } from "./data";
import { emptyLevel } from "./derive";
import { computeBuild } from "./engine";
import { levelsLine, skippedLevel, stretches, writtenLevels } from "./stretches";
import type { BuildPlan } from "./types";

const d = requireGameData("5.0.4.8");
const PLAN = altmerSkipsPlan();
/** The plan with level `n` changed. */
const withLevel = (n: number, change: object): BuildPlan => ({ ...PLAN, levels: PLAN.levels.map((lv, i) => (i === n - 1 ? { ...lv, ...change } : lv)) });

describe("Skip ahead (WO-69)", () => {
  it("stretches() gives 1, 2 to 10, 11 to 25 and 26 to 50", () => {
    expect(stretches(PLAN)).toEqual([
      { from: 1, to: 1 },
      { from: 2, to: 10 },
      { from: 11, to: 25 },
      { from: 26, to: 50 },
    ]);
    expect(levelsLine(writtenLevels(PLAN))).toBe("Levels 1, 10, 25, 50");
    expect(levelsLine([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50])).toBe("Levels 1 to 10, 25, 50");
  });

  it("levels 11 to 25: 625 available, 510 spent, 115 carried, 13 of 15 perk points, and no problems", () => {
    const states = computeBuild(PLAN, d);
    expect(states.flatMap((s) => s.issues)).toEqual([]);
    const before = states[9];
    const at = states[24];
    expect(before.skillPointsBanked).toBe(175);
    expect(at.skillPointsAvailable).toBe(625);
    expect(at.skillPointsSpent).toBe(510);
    expect(at.skillPointsBanked).toBe(115);
    expect(at.perkPointsSpent - before.perkPointsSpent).toBe(13);
    expect(at.perkPoints - before.perkPointsSpent).toBe(15);
    expect(at.destinyPointsSpent - before.destinyPointsSpent).toBe(2);
    expect(at.destinyPoints - before.destinyPointsSpent).toBe(3);
  });

  it("+80 Destruction over 11 to 25 is more than the stretch allows", () => {
    const issues = computeBuild(withLevel(25, { skillPoints: { ...PLAN.levels[24].skillPoints, Destruction: 80 } }), d)[24].issues.map((i) => i.message);
    expect(issues).toContain("Destruction: +80 is more than +75 in 15 level-ups.");
  });

  it("attribute counts that don't add up to 15 are a problem", () => {
    expect(computeBuild(withLevel(25, { attributes: { health: 4, magicka: 9 } }), d)[24].issues.map((i) => i.message)).toContain("Pick 2 more attribute level-ups.");
    expect(computeBuild(withLevel(25, { attributes: { health: 4, magicka: 9, stamina: 6 } }), d)[24].issues.map((i) => i.message)).toContain("4 attribute level-ups too many.");
  });

  it("Impact taken at 25 with Destruction 45 is a perk-skill problem", () => {
    const lower = withLevel(25, { skillPoints: { ...PLAN.levels[24].skillPoints, Destruction: 0 }, perks: ["Destruction:Empowered Destruction", "Destruction:Impact"] });
    const raised = { ...lower, levels: lower.levels.map((lv, i) => (i === 9 ? { ...lv, skillPoints: { ...lv.skillPoints, Destruction: 15 } } : lv)) };
    const s = computeBuild(raised, d)[24];
    expect(s.skills.Destruction).toBe(45);
    expect(s.issues.map((i) => i.code)).toContain("perk-skill");
  });

  it("a skipped level with choices, or a plan ending on a skipped level, is refused", () => {
    expect(() => parseBuildPlan(PLAN)).not.toThrow();
    expect(() => parseBuildPlan(withLevel(15, { perks: ["Block:Improved Blocking"] }))).toThrow();
    expect(() => parseBuildPlan(withLevel(15, { attribute: "health" }))).toThrow();
    expect(() => parseBuildPlan({ ...PLAN, levels: [...PLAN.levels, skippedLevel()] })).toThrow();
    // Attribute counts only end a stretch.
    expect(() => parseBuildPlan({ ...PLAN, levels: [...PLAN.levels, { ...emptyLevel(), attributes: { health: 1 } }] })).toThrow();
  });

  it("the version copy keeps skipped levels and attribute counts", () => {
    const { plan } = convertPlan(d, PLAN);
    expect(plan.levels[14].skipped).toBe(true);
    expect(plan.levels[24].attributes).toEqual({ health: 4, magicka: 9, stamina: 2 });
    expect(stretches(plan)).toEqual(stretches(PLAN));
  });
});
