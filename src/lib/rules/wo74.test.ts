import { describe, expect, it } from "vitest";
import { crowds, labelCandidates, leaderLine, type LabelRequest } from "./labels";

const o = { width: 800, height: 600, star: 8, font: 13 };

describe("WO-74: labels that read as their star's", () => {
  it("point 3: a taken star's short label keeps its rank", () => {
    const s: LabelRequest = { id: "One-Handed:Short Blade Focus", x: 400, y: 300, lines: ["Short Blade Focus", "One-Handed 75 (3/3)"], priority: 1, short: "Short Blade Focus 3" };
    const short = labelCandidates(s, o).find((c) => c.nameOnly)!;
    const plain = labelCandidates({ ...s, short: undefined }, o).find((c) => c.nameOnly)!;
    expect(short.w).toBeGreaterThan(plain.w);
  });

  it("point 3: no spot sits more than half a label's width out to the side", () => {
    const s: LabelRequest = { id: "X", x: 400, y: 300, lines: ["Mace Focus", "One-Handed 25 (0/3)"], priority: 3 };
    for (const c of labelCandidates(s, o)) {
      if (c.side === "left" || c.side === "right") continue;
      expect(Math.abs(c.x + c.w / 2 - s.x)).toBeLessThanOrEqual(c.w / 2);
    }
  });

  it("point 3: labels on one row closer than 10px crowd each other; on different rows they don't", () => {
    expect(crowds({ x: 0, y: 0, w: 50, h: 16 }, { x: 58, y: 0, w: 50, h: 16 })).toBe(true);
    expect(crowds({ x: 0, y: 0, w: 50, h: 16 }, { x: 61, y: 0, w: 50, h: 16 })).toBe(false);
    expect(crowds({ x: 0, y: 0, w: 50, h: 16 }, { x: 52, y: 20, w: 50, h: 16 })).toBe(false);
  });

  it("point 2: a leader line runs from the star's edge to the label's nearest point", () => {
    const line = leaderLine({ id: "X", side: "above", x: 380, y: 200, w: 40, h: 16 }, { x: 400, y: 300 }, 8);
    expect(line).toEqual({ x1: 400, y1: 291, x2: 400, y2: 216 });
  });
});
