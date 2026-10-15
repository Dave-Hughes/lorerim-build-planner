import { describe, expect, it } from "vitest";
import { AUTHOR_TOUR, READER_TOUR } from "./tour";

describe("WO-80: the reader's tour", () => {
  it("point 3: eight stops in page order, the last for whichever of Guide and Story the build has", () => {
    const both = READER_TOUR({ guide: true, story: true });
    expect(both.stops.map((s) => s.target)).toEqual(["level-row", "pinned-bar", "level-card", "attributes-skills", "perks", "gear", "spells", "build-tabs"]);
    expect(both.stops.at(-1)!.title).toBe("Guide and Story");
    expect(READER_TOUR({ guide: false, story: true }).stops.at(-1)!.title).toBe("Story");
    expect(READER_TOUR({ guide: false, story: false }).stops).toHaveLength(7);
    // Gear and spells are skipped on a build without them.
    expect(both.stops.filter((s) => s.optional).map((s) => s.target)).toEqual(["gear", "spells"]);
  });

  it("point 5: one or two short sentences a stop, and none of the old bits", () => {
    const lines = [READER_TOUR({ guide: true, story: true }), AUTHOR_TOUR].flatMap((t) => [t.welcome.text, ...t.stops.map((s) => s.text)]);
    for (const l of lines) expect(l, l).not.toMatch(/mead|Tapps likes|Tapps never|Shiny|leftovers|bites|proud|pictures/i);
    for (const l of READER_TOUR({ guide: true, story: true }).stops.map((s) => s.text)) expect(l.split(/(?<=[.!?])\s+/).length, l).toBeLessThanOrEqual(2);
  });
});
