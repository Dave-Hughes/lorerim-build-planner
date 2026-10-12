import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { computeBuild } from "./engine";
import { deitiesFollowed, deityChanges, levelFacts, levelMarks } from "./derive";
import { requireGameData } from "./data";
import type { BuildPlan } from "./types";

const d = requireGameData("5.0.4.8");
const plan: BuildPlan = {
  ...(sample as unknown as BuildPlan),
  deity: "Syrabane",
};
plan.levels = plan.levels.map((lv, i) => (i === 2 ? { ...lv, deity: "The Magna-Ge" } : lv));

describe("changing deity later (WO-43)", () => {
  it("Syrabane at level 1, the Magna-Ge from level 3", () => {
    const states = computeBuild(plan);
    expect(states.map((s) => s.deity)).toEqual(["Syrabane", "Syrabane", "The Magna-Ge", "The Magna-Ge", "The Magna-Ge", "The Magna-Ge"]);
    expect(deityChanges(plan)).toEqual([{ level: 3, name: "The Magna-Ge", prev: "Syrabane" }]);
    expect(levelFacts(d, plan, states, 3).deity).toEqual({ name: "The Magna-Ge", prev: "Syrabane" });
    expect(levelFacts(d, plan, states, 4).deity).toBeNull();
    expect(levelMarks(d, plan, states).map((m) => m.deity)).toEqual([false, false, true, false, false, false]);
    expect(deitiesFollowed(plan)).toEqual(["Syrabane", "The Magna-Ge"]);
  });

  it("choosing the deity already followed changes nothing", () => {
    const same = { ...plan, levels: plan.levels.map((lv, i) => (i === 1 ? { ...lv, deity: "Syrabane" } : lv)) };
    expect(deityChanges(same)).toEqual([{ level: 3, name: "The Magna-Ge", prev: "Syrabane" }]);
  });
});
