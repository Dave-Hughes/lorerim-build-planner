import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { computeBuild } from "./engine";
import { levelChanges, levelMarks, perkStatus, perksByLevel, skillStepInfo } from "./derive";
import { treeLayout } from "./layout";
import { PERKS_BY_TREE, SKILLS } from "./data";
import type { BuildPlan } from "./types";

const plan = sample as unknown as BuildPlan;
const states = computeBuild(plan);

describe("levelChanges", () => {
  it("lists what changed at level 6", () => {
    const c = levelChanges(plan, states, 6);
    expect(c.attribute).toBe("health");
    expect(c.skills).toEqual([
      { skill: "One-Handed", from: 40, to: 45 },
      { skill: "Evasion", from: 20, to: 25 },
      { skill: "Alchemy", from: 20, to: 25 },
    ]);
    expect(c.perks.map((p) => [p.name, p.requirement])).toEqual([["Powerful Bashes", "Block 25"]]);
    expect(c.banked).toBe(10);
  });

  it("marks book perks and trainer sessions at level 4", () => {
    const c = levelChanges(plan, states, 4);
    expect(c.perks.find((p) => p.name === "Craftsmanship")?.book).toBe("The Armorer's Encyclopedia");
    expect(c.trainer).toEqual([{ skill: "Block", count: 1 }]);
  });
});

describe("levelMarks", () => {
  it("flags Destiny picks and stone changes", () => {
    const m = levelMarks(plan, states);
    expect(m.map((x) => x.destiny)).toEqual([true, false, false, false, true, false]);
    expect(m.map((x) => x.stone)).toEqual([false, false, true, false, false, false]);
    expect(m[0].perks).toBe(3);
  });
});

describe("perksByLevel", () => {
  it("groups by tree with Destiny last", () => {
    const g = perksByLevel(plan, states, 6);
    expect(g.map((x) => x.tree)).toEqual(["Heavy Armor", "Block", "One-Handed", "Alchemy", "Smithing", "Wayfarer", "Destiny"]);
    expect(g[1].perks.map((p) => p.level)).toEqual([1, 2, 6]);
  });
});

describe("perkStatus", () => {
  it("reports taken, open and locked", () => {
    expect(perkStatus(states, 6, "Block:Powerful Bashes").state).toBe("taken");
    expect(perkStatus(states, 6, "Block:Powerful Bashes").takenAt).toEqual([6]);
    // Block is 46 at level 6; Overpowering Bashes needs 50 and Powerful Bashes.
    const locked = perkStatus(states, 6, "Block:Overpowering Bashes");
    expect(locked.state).toBe("locked");
    expect(locked.reasons[0]).toMatch(/Needs Block 50/);
  });

  it("explains what opened a perk this level", () => {
    const withBlock: BuildPlan = {
      ...plan,
      levels: [
        ...plan.levels,
        { attribute: "health", skillPoints: { Block: 4 }, perks: [], destiny: [], extras: [], note: "" },
      ],
    };
    const st = computeBuild(withBlock);
    const s = perkStatus(st, 7, "Block:Overpowering Bashes");
    expect(s.state).toBe("open");
    expect(s.openedThisLevel).toBe("Opened this level: raising Block from 46 to 50 met its requirement.");
  });

  it("locks a perk the held ones rule out", () => {
    // The sample build holds Weapon Mastery from level 1.
    const s = perkStatus(states, 6, "Block:Weapons Master");
    expect(s.state).toBe("locked");
    expect(s.reasons).toContain("Can't be held with One-Handed: Weapon Mastery.");
  });

  it("counts ranks and their requirements", () => {
    const s = perkStatus(states, 6, "One-Handed:Weapon Mastery");
    expect([s.ranksTaken, s.ranks]).toEqual([1, 2]);
    // Rank 2 needs One-Handed 20 (it is 45); only the spent perk point stands in the way.
    expect(s.reasons).toEqual(["No perk point to spend at this level."]);
  });

  it("knows Destiny points", () => {
    const s = perkStatus(states, 6, "Destiny:Focus");
    expect(s.state).toBe("locked");
    expect(s.reasons.join(" ")).toMatch(/next one comes at level 10/);
  });
});

describe("skillStepInfo", () => {
  it("limits raises by points, +5 and max skill", () => {
    const info = skillStepInfo(plan, states, 6);
    const heavy = info.find((i) => i.skill === "Heavy Armor")!;
    expect(heavy.from).toBe(50);
    expect(heavy.nextCost).toBe(3);
    const one = info.find((i) => i.skill === "One-Handed")!;
    expect(one.added).toBe(5);
    expect(one.atFive).toBe(true);
    expect(one.canAdd).toBe(false);
  });
});

describe("treeLayout", () => {
  it("places every perk of every tree inside its canvas with no overlaps in a row", () => {
    for (const tree of [...SKILLS, "Destiny"]) {
      const l = treeLayout(tree);
      expect(l.nodes.length).toBe(PERKS_BY_TREE.get(tree)!.length);
      for (const n of l.nodes) {
        expect(n.x).toBeGreaterThanOrEqual(0);
        expect(n.x).toBeLessThanOrEqual(l.width);
        expect(n.y).toBeGreaterThanOrEqual(0);
        expect(n.y).toBeLessThanOrEqual(l.height);
      }
      const seen = new Set(l.nodes.map((n) => `${n.x},${n.y}`));
      expect(seen.size).toBe(l.nodes.length);
    }
  });

  it("notes prerequisites from other trees", () => {
    const l = treeLayout("Evasion");
    expect(l.external).toEqual([{ id: "Heavy Armor:Conditioning", tree: "Heavy Armor", name: "Conditioning", forId: "Evasion:Dodge" }]);
  });
});
