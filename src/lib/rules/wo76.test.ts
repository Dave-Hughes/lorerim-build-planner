import { describe, expect, it } from "vitest";
import sevari from "./__fixtures__/sevari.json";
import { requireGameData } from "./data";
import { picksAt, spellsToChoose, spellsToChooseAt } from "./spells";
import type { BuildPlan } from "./types";

const d = requireGameData("5.0.4.8");
const plan = sevari.plan as unknown as BuildPlan;

describe("WO-76: spells to choose", () => {
  it("counts each level's picks left and the build's, a Master tier perk giving 1", () => {
    // 51 to 75: Master Illusion (1), Novice Restoration (2), Novice Destruction (2).
    const at75 = picksAt(d, plan, 75);
    expect(at75.find((p) => p.perk === "Illusion:Master Illusion")).toMatchObject({ count: 1, chosen: 0, left: 1 });
    expect(spellsToChooseAt(d, plan, 75)).toBe(5);
    const all = spellsToChoose(d, plan);
    expect(all.levels.map((x) => x.level)).toEqual([75, 100]);
    expect(all.total).toBe(all.levels.reduce((n, x) => n + x.left, 0));
  });

  it("a chosen spell counts down, and the levels with none left drop out", () => {
    const pool = d.spellPicks.pools["Illusion:Master Illusion"].filter((id) => d.spellById.has(id));
    const levels = plan.levels.map((lv, i) => (i === 74 ? { ...lv, spells: [...(lv.spells ?? []), { id: pool[0], where: "Master Illusion" }] } : lv));
    const after = { ...plan, levels };
    expect(picksAt(d, after, 75).find((p) => p.perk === "Illusion:Master Illusion")).toMatchObject({ chosen: 1, left: 0 });
    expect(spellsToChooseAt(d, after, 75)).toBe(4);
  });

  it("puts the tier perks with picks left first", () => {
    const pool = d.spellPicks.pools["Illusion:Master Illusion"].filter((id) => d.spellById.has(id));
    const levels = plan.levels.map((lv, i) => (i === 74 ? { ...lv, spells: [{ id: pool[0], where: "Master Illusion" }] } : lv));
    const order = picksAt(d, { ...plan, levels }, 75);
    expect(order[order.length - 1].perk).toBe("Illusion:Master Illusion");
  });
});
