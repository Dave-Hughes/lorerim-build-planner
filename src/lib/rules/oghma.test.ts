import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { computeBuild } from "./engine";
import { emptyLevel, levelFacts } from "./derive";
import { requireGameData } from "./data";
import type { BuildPlan, LevelPlan } from "./types";

const d = requireGameData("5.0.4.8");
const SIX = ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration", "Enchanting"];

/** The sample build stretched to 30 levels, Alteration raised each level until it is 78 at level 30. */
function thirty(): BuildPlan {
  const base = sample as unknown as BuildPlan;
  const levels: LevelPlan[] = [...base.levels, ...Array.from({ length: 24 }, () => ({ ...emptyLevel(), attribute: "magicka" as const }))];
  let plan: BuildPlan = { ...base, levels };
  for (let L = 2; L <= 30; L++) {
    const now = computeBuild(plan)[L - 1].skillsBefore.Alteration;
    const room = Math.min(5, 78 - now, d.maxSkillAt(L) - now);
    if (room <= 0) continue;
    plan = { ...plan, levels: plan.levels.map((lv, i) => (i === L - 1 ? { ...lv, skillPoints: { ...lv.skillPoints, Alteration: room } } : lv)) };
  }
  return plan;
}

const withOghma = (plan: BuildPlan, level: number): BuildPlan => ({
  ...plan,
  levels: plan.levels.map((lv, i) => (i === level - 1 ? { ...lv, extras: [...lv.extras, { kind: "oghma" as const, skills: SIX }] } : lv)),
});

describe("the Oghma Infinium (WO-44)", () => {
  const plan = thirty();
  const before = computeBuild(plan);

  it("the test build has Alteration 78 at level 30, where max skill is 80", () => {
    expect(before[29].skills.Alteration).toBe(78);
    expect(before[29].maxSkill).toBe(80);
  });

  it("at level 30 it takes Alteration to 83, past the max, with no problem", () => {
    const states = computeBuild(withOghma(plan, 30));
    expect(states[29].skills.Alteration).toBe(83);
    expect(states[29].issues.map((i) => i.code)).not.toContain("skill-over-max");
    for (const sk of SIX.slice(1)) expect(states[29].skills[sk]).toBe(Math.min(100, before[29].skills[sk] + 5));
  });

  it("gives the level 3 more perk points", () => {
    expect(computeBuild(withOghma(plan, 30))[29].perkPoints).toBe(before[29].perkPoints + 3);
  });

  it("shows on the level: six +5 skills and +3 perk points", () => {
    const p = withOghma(plan, 30);
    const f = levelFacts(d, p, computeBuild(p), 30);
    expect(f.oghma?.skills.map((x) => [x.sk, x.n])).toEqual(SIX.map((sk) => [sk, 5]));
    expect(f.oghma?.perkPoints).toBe(3);
  });

  it("a second Oghma raises oghma-repeat, and gives nothing", () => {
    const twice = withOghma(withOghma(plan, 20), 30);
    const states = computeBuild(twice);
    expect(states[29].issues.map((i) => i.code)).toContain("oghma-repeat");
    expect(states[29].issues.find((i) => i.code === "oghma-repeat")?.message).toBe("The Oghma Infinium can only be read once.");
    expect(states[29].perkPoints).toBe(before[29].perkPoints + 3);
  });
});
