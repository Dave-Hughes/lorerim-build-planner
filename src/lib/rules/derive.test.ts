import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { computeBuild } from "./engine";
import { levelChanges, levelMarks, perkStatus, perksByLevel, skillStepInfo } from "./derive";
import { fitHeight, treeLayout } from "./layout";
import { overlaps, placeLabels, starRect } from "./labels";
import { heldCount, isHeld, lineLook, lineState, prerequisiteLines } from "./tree-states";
import type { PerkStatus } from "./derive";
import { requireGameData } from "./data";
import type { BuildPlan } from "./types";

const plan = sample as unknown as BuildPlan;
const d = requireGameData(plan.gameVersion);
const states = computeBuild(plan);

describe("levelChanges", () => {
  it("lists what changed at level 6", () => {
    const c = levelChanges(d, plan, states, 6);
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
    const c = levelChanges(d, plan, states, 4);
    expect(c.perks.find((p) => p.name === "Craftsmanship")?.book).toBe("The Armorer's Encyclopedia");
    expect(c.trainer).toEqual([{ skill: "Block", count: 1 }]);
  });
});

describe("levelMarks", () => {
  it("flags Destiny picks and stone changes", () => {
    const m = levelMarks(d, plan, states);
    expect(m.map((x) => x.destiny)).toEqual([true, false, false, false, true, false]);
    expect(m.map((x) => x.stone)).toEqual([false, false, true, false, false, false]);
    expect(m[0].perks).toBe(3);
  });
});

describe("perksByLevel", () => {
  it("groups by tree with Destiny last", () => {
    const g = perksByLevel(d, plan, states, 6);
    expect(g.map((x) => x.tree)).toEqual(["Heavy Armor", "Block", "One-Handed", "Alchemy", "Smithing", "Wayfarer", "Destiny"]);
    expect(g[1].perks.map((p) => p.level)).toEqual([1, 2, 6]);
  });
});

describe("perkStatus", () => {
  it("reports taken, open and locked", () => {
    expect(perkStatus(d, states, 6, "Block:Powerful Bashes").state).toBe("taken");
    expect(perkStatus(d, states, 6, "Block:Powerful Bashes").takenAt).toEqual([6]);
    // Block is 46 at level 6; Overpowering Bashes needs 50 and Powerful Bashes.
    const locked = perkStatus(d, states, 6, "Block:Overpowering Bashes");
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
    const s = perkStatus(d, st, 7, "Block:Overpowering Bashes");
    expect(s.state).toBe("open");
    expect(s.openedThisLevel).toBe("Opened this level: raising Block from 46 to 50 met its requirement.");
  });

  it("locks a perk the held ones rule out", () => {
    // The sample build holds Weapon Mastery from level 1.
    const s = perkStatus(d, states, 6, "Block:Weapons Master");
    expect(s.state).toBe("locked");
    expect(s.reasons).toContain("Can't be held with One-Handed: Weapon Mastery.");
  });

  it("counts ranks and their requirements", () => {
    const s = perkStatus(d, states, 6, "One-Handed:Weapon Mastery");
    expect([s.ranksTaken, s.ranks]).toEqual([1, 2]);
    // Rank 2 needs One-Handed 20 (it is 45); only the spent perk point stands in the way.
    expect(s.reasons).toEqual(["No perk point to spend at this level."]);
  });

  it("knows Destiny points", () => {
    const s = perkStatus(d, states, 6, "Destiny:Focus");
    expect(s.state).toBe("locked");
    expect(s.reasons.join(" ")).toMatch(/next one comes at level 10/);
  });
});

describe("skillStepInfo", () => {
  it("limits raises by points, +5 and max skill", () => {
    const info = skillStepInfo(d, plan, states, 6);
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
  const trees = [...d.skills, "Destiny"];

  it("draws every star of every tree inside its box", () => {
    for (const tree of trees) {
      const l = treeLayout(d, tree, 900, 700);
      expect(l.nodes.length, tree).toBe(d.perksByTree.get(tree)!.length);
      for (const n of l.nodes) {
        expect(n.x).toBeGreaterThanOrEqual(0);
        expect(n.x).toBeLessThanOrEqual(l.width);
        expect(n.y).toBeGreaterThanOrEqual(0);
        expect(n.y).toBeLessThanOrEqual(l.height);
      }
    }
  });

  it("keeps the game's relative positions: left/right and above/below never change", () => {
    for (const tree of trees) {
      for (const [w, h] of [[400, 700], [900, 700], [1600, 1240]]) {
        const l = treeLayout(d, tree, w, h);
        const at = new Map(l.nodes.map((n) => [n.id, n]));
        const perks = d.perksByTree.get(tree)!;
        for (const a of perks)
          for (const b of perks) {
            if (a === b) continue;
            const [ax, ay] = a.pos!;
            const [bx, by] = b.pos!;
            const pa = at.get(a.id)!;
            const pb = at.get(b.id)!;
            // Same order across, and the game's y up is the screen's y down.
            const sign = (v: number) => (Math.abs(v) < 1e-6 ? 0 : Math.sign(v));
            expect(sign(bx - ax), `${tree}: ${a.name} / ${b.name} across`).toBe(sign((pb.x - pa.x) / l.scale));
            expect(sign(by - ay), `${tree}: ${a.name} / ${b.name} up`).toBe(sign((pa.y - pb.y) / l.scale));
          }
        // One scale for both axes: distances keep their proportions.
        const [a, b] = perks;
        const game = Math.hypot(b.pos![0] - a.pos![0], b.pos![1] - a.pos![1]);
        const screen = Math.hypot(at.get(b.id)!.x - at.get(a.id)!.x, at.get(b.id)!.y - at.get(a.id)!.y);
        expect(screen).toBeCloseTo(game * l.scale, 6);
      }
    }
  });

  it("draws the game's own lines", () => {
    for (const tree of trees) {
      const l = treeLayout(d, tree, 900, 700);
      expect(l.edges.map((e) => [e.from, e.to]), tree).toEqual(d.linksByTree.get(tree));
    }
  });

  it("fits a box to the tree: at the fitted height the width binds and nothing is left over", () => {
    const pad = { x: 40, top: 22, bottom: 40 };
    for (const tree of trees) {
      const h = fitHeight(d, tree, 390, pad);
      const l = treeLayout(d, tree, 390, h, pad);
      const ys = l.nodes.map((n) => n.y);
      const xs = l.nodes.map((n) => n.x);
      expect(Math.min(...xs), tree).toBeCloseTo(pad.x, 4);
      expect(Math.min(...ys), tree).toBeGreaterThanOrEqual(pad.top - 0.5);
      expect(Math.min(...ys), tree).toBeLessThanOrEqual(pad.top + 1);
      expect(Math.max(...ys), tree).toBeGreaterThanOrEqual(h - pad.bottom - 1);
    }
  });

  it("notes prerequisites from other trees", () => {
    const l = treeLayout(d, "Evasion", 900, 700);
    expect(l.external).toEqual([{ id: "Heavy Armor:Conditioning", tree: "Heavy Armor", name: "Conditioning", forId: "Evasion:Dodge" }]);
  });
});

describe("placeLabels", () => {
  // Tree boxes at 1440, 1920 and 2560 wide: width, then the window height less header and tabs.
  const boxes = [
    { width: 900, height: 700, star: 8, font: 13 },
    { width: 1200, height: 880, star: 9.5, font: 14 },
    { width: 1600, height: 1240, star: 11, font: 15 },
  ];
  const req = (id: string) => {
    const p = d.perkById.get(id)!;
    return p.tree === "Destiny" ? "" : p.skill ? `${p.tree} ${p.skill}` : "No requirement";
  };

  it("never lets a label overlap another label or a star, in any tree", () => {
    for (const tree of [...d.skills, "Destiny"])
      for (const box of boxes)
        for (const states of ["none", "mixed"] as const) {
          const l = treeLayout(d, tree, box.width, box.height);
          const stars = l.nodes.map((n, i) => ({
            id: n.id,
            x: n.x,
            y: n.y,
            lines: (req(n.id) ? [d.perkById.get(n.id)!.name, req(n.id)] : [d.perkById.get(n.id)!.name]) as [string] | [string, string],
            priority: states === "none" ? 3 : i === 0 ? 0 : (i % 3) + 1,
          }));
          const placed = [...placeLabels(stars, box).values()];
          for (const a of placed) {
            expect(a.x >= 0 && a.y >= 0 && a.x + a.w <= box.width && a.y + a.h <= box.height, `${tree} ${box.width}: ${a.id} in the box`).toBe(true);
            for (const b of placed) if (a !== b) expect(overlaps(a, b), `${tree} ${box.width}: ${a.id} / ${b.id}`).toBe(false);
            for (const s of stars) expect(overlaps(a, starRect(s.x, s.y, box.star)), `${tree} ${box.width}: ${a.id} over ${s.id}`).toBe(false);
          }
          if (states === "mixed") expect(placed.some((p) => p.id === stars[0].id), `${tree}: the selected star is labelled`).toBe(true);
        }
  });

  it("labels most stars of a tree at 1920", () => {
    const l = treeLayout(d, "Block", 1200, 880);
    const stars = l.nodes.map((n) => ({ id: n.id, x: n.x, y: n.y, lines: [d.perkById.get(n.id)!.name, req(n.id)] as [string, string], priority: 3 }));
    expect(placeLabels(stars, boxes[1]).size).toBeGreaterThanOrEqual(stars.length * 0.7);
  });
});

describe("tree states", () => {
  const st = (state: PerkStatus["state"], ranksTaken = 0, ranks = 1): PerkStatus => ({ state, ranksTaken, ranks, takenAt: [], granted: false, reasons: [] });

  it("lines: held to held, held to can-take, and everything else", () => {
    expect(lineState(st("taken", 1), st("taken", 1))).toBe("held");
    expect(lineState(st("taken", 1), st("open"))).toBe("next");
    expect(lineState(st("open"), st("taken", 1))).toBe("next");
    expect(lineState(st("taken", 1), st("locked"))).toBe("other");
    expect(lineState(st("open"), st("open"))).toBe("other");
    expect(lineState(st("locked"), st("locked"))).toBe("other");
  });

  it("a star with 1 of 2 ranks counts as held", () => {
    const partial = st("open", 1, 2);
    expect(isHeld(partial)).toBe(true);
    expect(lineState(st("taken", 1), partial)).toBe("held");
    expect(lineState(partial, st("open"))).toBe("next");
  });

  it("on the sample build: Block's path is held, and an either-of line keeps its own flag", () => {
    const l = treeLayout(d, "Block", 900, 700);
    const status = new Map(l.nodes.map((n) => [n.id, perkStatus(d, states, 6, n.id)]));
    const line = (a: string, b: string) => l.edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a))!;
    const e1 = line("Block:Improved Blocking", "Block:Powerful Bashes");
    expect(lineState(status.get(e1.from), status.get(e1.to))).toBe("held");
    // "Either of" lines keep their dashes when they aren't on the path; on the path they are solid.
    const either = [...d.skills].flatMap((t) => treeLayout(d, t, 900, 700).edges).find((e) => e.anyOf);
    expect(either).toBeDefined();
    expect(lineLook("other", true, false)).toEqual({ kind: "other", width: 1, dashed: true });
    expect(lineLook("held", true, false)).toEqual({ kind: "held", width: 2.5, dashed: false });
    expect(lineLook("next", false, false).kind).toBe("next");
    expect(lineLook("other", false, true)).toEqual({ kind: "chain", width: 1.2, dashed: true });
    // Overpowering Bashes isn't held: its line back to Powerful Bashes (held) is its chain.
    const chain = prerequisiteLines(d, l.edges, status, "Block:Overpowering Bashes");
    expect(chain.size).toBeGreaterThan(0);
    expect(prerequisiteLines(d, l.edges, status, "Block:Powerful Bashes").size).toBe(0);
  });

  it("counts held perks per tree", () => {
    const s6 = states[5];
    expect(heldCount(d, "Block", s6)).toBe(3);
    expect(heldCount(d, "Destruction", s6)).toBe(0);
    expect(heldCount(d, "Destiny", s6)).toBe(Object.keys(s6.destinyTaken).length);
  });
});
