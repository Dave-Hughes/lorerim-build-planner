import { describe, expect, it } from "vitest";
import pureMage from "../../../e2e/fixtures/pure-mage.json";
import iriel from "../../../e2e/fixtures/iriel.json";
import azrem from "../../../e2e/fixtures/azrem.json";
import { repeatLevel, restoreLevelSpend } from "@/components/editor/plan-ops";
import { requireGameData } from "./data";
import { computeBuild } from "./engine";
import type { BuildPlan, LevelPlan } from "./types";

const d = requireGameData("5.0.4.8");
const PURE_MAGE = pureMage.plan as unknown as BuildPlan;
const SCHOOLS = { Illusion: 1, Alteration: 1, Conjuration: 1, Destruction: 1, Restoration: 1 };

/** Pure Mage with level `n` changed. */
const withLevel = (plan: BuildPlan, n: number, change: Partial<LevelPlan>): BuildPlan => ({ ...plan, levels: plan.levels.map((lv, i) => (i === n - 1 ? { ...lv, ...change } : lv)) });

describe("repeatLevel (WO-56)", () => {
  it("Pure Mage level 34 repeated from 33 gives the same five +1s and Magicka", () => {
    const cleared = withLevel(PURE_MAGE, 34, { skillPoints: {}, attribute: undefined });
    const { plan, skipped } = repeatLevel(cleared, 34, d);
    expect(plan.levels[33].skillPoints).toEqual(SCHOOLS);
    expect(plan.levels[33].attribute).toBe("magicka");
    expect(skipped).toEqual([]);
  });

  it("a raise at max skill is skipped and listed", () => {
    // Pure Mage keeps the schools at the max skill. Two Illusion points at 33 take it to 84, the
    // max at 34, so repeating them at 34 has nowhere to go; the other schools still get +1.
    const { plan, skipped } = repeatLevel(withLevel(PURE_MAGE, 33, { skillPoints: { ...SCHOOLS, Illusion: 2 } }), 34, d);
    expect(plan.levels[33].skillPoints).toEqual({ Alteration: 1, Conjuration: 1, Destruction: 1, Restoration: 1 });
    expect(skipped).toEqual(["Illusion stays at 84, the max skill at level 34."]);
  });

  it("a raise past +5 is skipped and listed", () => {
    const { plan, skipped } = repeatLevel(withLevel(PURE_MAGE, 33, { skillPoints: { Speech: 6 } }), 34, d);
    expect(plan.levels[33].skillPoints).toEqual({ Speech: 5 });
    expect(skipped).toEqual(["Speech: +6 is more than +5 in one level-up."]);
  });

  it("a raise the points don't cover is skipped and listed, and the rest stay banked", () => {
    // Ten +5s at a point each is 50 points. Spending that at 33 banks nothing, so 34 has 30: six fit.
    const greedy = { Speech: 5, Smithing: 5, Sneak: 5, Finesse: 5, Marksman: 5, "One-Handed": 5, "Two-Handed": 5, Block: 5, "Heavy Armor": 5, Alchemy: 5 };
    const { plan, skipped } = repeatLevel(withLevel(PURE_MAGE, 33, { skillPoints: greedy }), 34, d);
    expect(skipped).toEqual(["Two-Handed +5 didn't fit: 0 skill points left.", "Block +5 didn't fit: 0 skill points left.", "Heavy Armor +5 didn't fit: 0 skill points left.", "Alchemy +5 didn't fit: 0 skill points left."]);
    const st = computeBuild(plan)[33];
    expect(st.skillPointsSpent).toBeLessThanOrEqual(st.skillPointsAvailable);
    expect(st.issues.map((i) => i.code)).not.toContain("skill-points-over");
  });

  it("the Master of One skill can still go past max skill", () => {
    const moo: BuildPlan = { ...PURE_MAGE, traits: ["Master of One"], masterOfOneSkill: "Destruction" };
    const { plan, skipped } = repeatLevel(withLevel(moo, 33, { skillPoints: { Destruction: 1 } }), 34, d);
    expect(plan.levels[33].skillPoints).toEqual({ Destruction: 1 });
    expect(skipped).toEqual([]);
  });

  it("perks, extras, gear, spells and the note at this level are untouched", () => {
    const busy = withLevel(PURE_MAGE, 34, {
      perks: ["Destruction:Novice Destruction"],
      extras: [{ kind: "trainer", skill: "Illusion" }],
      spells: [{ id: d.spells[0].id }],
      note: "Kept.",
    });
    const { plan } = repeatLevel(busy, 34, d);
    const [a, b] = [busy.levels[33], plan.levels[33]];
    expect({ perks: b.perks, extras: b.extras, spells: b.spells, note: b.note, destiny: b.destiny }).toEqual({ perks: a.perks, extras: a.extras, spells: a.spells, note: a.note, destiny: a.destiny });
    expect(plan.gear).toBe(busy.gear);
  });

  it("repeating then undoing gives back the plan as it was", () => {
    const start = withLevel(PURE_MAGE, 34, { skillPoints: { Enchanting: 2 }, attribute: "health" });
    const { plan, before } = repeatLevel(start, 34, d);
    expect(plan).not.toEqual(start);
    expect(restoreLevelSpend(plan, 34, before)).toEqual(start);
  });
});

describe("repeatLevel on every level of the real builds", () => {
  for (const [name, fixture] of [
    ["Pure Mage", pureMage],
    ["Iriel", iriel],
    ["Azrem", azrem],
  ] as const) {
    it(`${name}: the level repeated has no new problems`, () => {
      const plan = fixture.plan as unknown as BuildPlan;
      const was = computeBuild(plan);
      for (let L = 3; L <= plan.levels.length; L++) {
        const next = computeBuild(repeatLevel(plan, L, d).plan);
        const old = new Set(was[L - 1].issues.map((i) => i.message));
        expect(next[L - 1].issues.filter((i) => !old.has(i.message)).map((i) => i.message), `level ${L}`).toEqual([]);
      }
    });

    // Building forward, the way the button is used: the build cut at level L, then L repeated. Nothing
    // anywhere gets a new problem. (Repeating a level in the middle of a finished build can push a
    // later level over: those were planned around the old spend.)
    it(`${name}: building forward, repeating the last level adds no problem anywhere`, () => {
      const plan = fixture.plan as unknown as BuildPlan;
      for (let L = 3; L <= plan.levels.length; L++) {
        const cut = { ...plan, levels: plan.levels.slice(0, L) };
        const key = (st: ReturnType<typeof computeBuild>) => st.flatMap((x) => x.issues.map((i) => `${x.level}: ${i.message}`));
        const old = new Set(key(computeBuild(cut)));
        expect(key(computeBuild(repeatLevel(cut, L, d).plan)).filter((m) => !old.has(m)), `level ${L}`).toEqual([]);
      }
    });
  }
});
