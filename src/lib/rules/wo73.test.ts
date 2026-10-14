import { describe, expect, it } from "vitest";
import { requireGameData } from "./data";
import { levelCellLabel, type LevelMark } from "./derive";
import { drawingSize, treeLayout } from "./layout";
import { overlaps, placeLabels, type LabelRequest } from "./labels";

const d = requireGameData("5.0.4.8");

/** A tree at Fit in a box, every star "not yet" with a requirement line: the hardest case for its labels. */
function atFit(tree: string, w: number, h: number) {
  const pad = { x: 70, top: 30, bottom: 58 };
  const dims = drawingSize(d, tree, w, h, pad, drawingSize(d, tree, w, h, pad).fitScale);
  const layout = treeLayout(d, tree, dims.width, dims.height, pad);
  const stars: LabelRequest[] = layout.nodes.map((n) => {
    const p = d.perkById.get(n.id)!;
    const need = p.rankSkills?.[0] ?? p.skill ?? 0;
    return { id: n.id, x: n.x, y: n.y, lines: tree === "Destiny" || !need ? [p.name] : [p.name, `${tree} ${need}`], priority: 3 };
  });
  const lines = layout.edges.map((e) => {
    const a = layout.nodes.find((n) => n.id === e.from)!;
    const b = layout.nodes.find((n) => n.id === e.to)!;
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  });
  const placed = placeLabels(stars, { width: layout.width, height: layout.height, star: 8, font: 13, lines });
  return { layout, stars, placed: [...placed.values()] };
}

describe("WO-73: layout and polish", () => {
  // Measured with the estimate of the font's widths: e2e/wo73.spec.ts checks every star's label with the real fonts.
  it("point 1: at Fit every label is inside the box and none overlap; One-Handed keeps all of them", () => {
    // The editor's tree panel at 1512 × 806, and the build page's Destiny box at 1440.
    for (const [tree, w, h] of [
      ["One-Handed", 946, 605],
      ["Destiny", 946, 605],
      ["Destiny", 890, 498],
    ] as const) {
      const { layout, stars, placed } = atFit(tree, w, h);
      if (tree === "One-Handed") expect(placed.length, `${tree} at ${w}×${h}`).toBe(stars.length);
      for (const p of placed) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.x + p.w).toBeLessThanOrEqual(layout.width);
        expect(p.y + p.h).toBeLessThanOrEqual(layout.height);
      }
      for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) expect(overlaps(placed[i], placed[j]), `${placed[i].id} / ${placed[j].id}`).toBe(false);
    }
  });

  it("point 12: a level cell's name says what its marks show", () => {
    const mark: LevelMark = { level: 30, perks: 10, destiny: true, destinies: 2, spells: 2, stone: false, skill100: false, notes: true, gear: false, deity: false, problems: 0 };
    expect(levelCellLabel(mark, 21)).toBe("Levels 21 to 30, 10 perks, 2 Destiny, 2 spells, notes");
    expect(levelCellLabel({ ...mark, level: 6, perks: 1, destinies: 0, destiny: false, spells: 0, notes: false, gear: true, stone: true, problems: 1 }, 6)).toBe(
      "Level 6, 1 perk, standing stone, new gear, 1 problem",
    );
  });
});
