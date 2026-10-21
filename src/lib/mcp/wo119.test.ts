import { describe, expect, it } from "vitest";
import { RULES_5_0_4_8 } from "@/lib/rules/constants";
import { OGHMA_PERK_POINTS } from "@/lib/rules/engine";
import sample from "@/lib/rules/__fixtures__/sample-build.json";
import { readPlan } from "@/lib/rules/convert";
import type { BuildPlan } from "@/lib/rules/types";
import kyria from "./__fixtures__/kyria-drafted.json";
import { versionData } from "./errors";
import { getRules, getTree, styleGuide } from "./facts";
import { issuesOf, planFromPlain, type PlainBuild } from "./plan";
import { reviewBuild } from "./review";
import { howPointsWork } from "./rules-text";

describe("How points work (WO-119), from the rules", () => {
  const text = howPointsWork();
  it("says every number the engine counts with", () => {
    const r = RULES_5_0_4_8;
    expect(text).toContain(`**Skill points:** ${r.skillPointsPerLevel} a level`);
    expect(text).toContain(`**A skill rises at most ${r.maxRaisePerSkillPerLevel}** in one level`);
    for (const [below, cost] of r.skillCostBands) expect(text).toContain(`${cost} below ${below}`);
    expect(text).toContain(`${r.skillCostTop} below ${r.skillCeiling}`);
    expect(text).toContain(`${r.maxSkillBase} plus the level, up to ${r.skillCeiling}`);
    expect(text).toContain(`${r.startingPerkPoints} at the start, ${r.naaktiidBonusPerkPoints} more in Naaktiid, ${r.masterOfDestinyPerkPoints} more with Master of Destiny`);
    expect(text).toContain(`the Oghma Infinium: ${OGHMA_PERK_POINTS} more`);
    expect(text).toContain(r.destinyPointLevels.join(", "));
    expect(text).toContain(`${r.trainerSessionsPerLevel} sessions a level`);
  });
  it("changes when a rule does: written from the rules, not by hand", () => {
    expect(howPointsWork({ ...RULES_5_0_4_8, skillPointsPerLevel: 31 })).toContain("**Skill points:** 31 a level");
  });
  it("is in the style guide, with How to build", () => {
    expect(styleGuide()).toContain(text);
    expect(styleGuide()).not.toContain("{{how-points-work}}");
    expect(styleGuide()).toContain("## How to build");
  });
  it("get_rules answers the same numbers", () => {
    expect(getRules()).toMatchObject({ skillPointsPerLevel: 30, maxRaisePerSkillPerLevel: 5, perkPoints: { atStart: 3, perLevel: 1 }, destinyPoints: { atLevels: [5, 10, 15, 20, 25, 30] } });
  });
});

describe("get_tree (WO-119)", () => {
  it("gives a whole tree in one answer, by the skill each perk first needs", () => {
    const t = getTree({ skill: "two-handed" });
    expect(t.tree).toBe("Two-Handed");
    expect(t.perks.length).toBeGreaterThan(10);
    const skills = t.perks.map((p) => Number(/(\d+)$/.exec(p.rankDetails[0]?.skill ?? "0")?.[1] ?? 0));
    expect(skills).toEqual([...skills].sort((a, b) => a - b));
    for (const p of t.perks) expect(p).toMatchObject({ id: expect.any(String), ranks: expect.any(Number), needs: expect.any(Object), rulesOut: expect.any(Array) });
  });
  it("names the trees when it can't find one", () => {
    expect(() => getTree({ skill: "Juggling" })).toThrow(/The trees: .*Two-Handed/);
  });
});

describe("reviewBuild (WO-119)", () => {
  const d = versionData("5.0.4.8");
  const review = (plan: BuildPlan) => {
    const { plan: parsed, states, issues } = issuesOf(d, plan);
    expect(issues).toEqual([]);
    return reviewBuild(d, parsed, states);
  };
  it("gives Kyria as drafted her three warnings, with the levels and skills", () => {
    const w = review(planFromPlain(d, kyria as unknown as PlainBuild));
    expect(w.map((x) => x.code)).toEqual(["skill-points-piling", "perk-point-unspent", "destiny-unspent"]);
    const [skills, perk, destiny] = w;
    expect(skills.message).toMatch(/^169 skill points unspent since level 6\./);
    expect(skills.message).toContain("Two-Handed, Heavy Armor, Speech and Destruction are at max skill for level 23 (73)");
    expect(skills.message).toContain("Smithing 25");
    expect(skills.message).toContain("Restoration 25");
    expect(perk.message).toMatch(/^1 perk point unspent since level 5\./);
    expect(destiny.message).toMatch(/^5 Destiny points unspent since level 1\./);
  });
  it("gives the sample build none", () => {
    expect(review(readPlan(sample as unknown as BuildPlan))).toEqual([]);
  });
});
