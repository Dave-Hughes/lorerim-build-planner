import { describe, expect, it } from "vitest";
import { rules } from "./rules-view";
import { getQuest, playerState } from "./facts";

/** WO-137 after the PC's check (22 Oct): Deathbrand's level is the gate on its ways in, and the judge reads it. */
describe("Deathbrand's gate (WO-137 item 1, the PC's check)", () => {
  const at = (level: number) => getQuest({ name: "Deathbrand" }, undefined, playerState({ level, done: [] }));

  it("its ways are reading the book and the pirates at Haknir's Shoal, each at level 20; no level-up way, no Geldis", () => {
    const ways = rules("Deathbrand").quest.start.ways ?? [];
    expect(ways.map((w) => [w.way, w.needs])).toEqual([
      ["Read Deathbrand", ["Level 20"]],
      ["Go to Haknir's Shoal, where pirates have landed, and take the map from their leader", ["Level 20"]],
    ]);
  });

  it("locked at level 10, open at 20: a patch's catch-up helper is no way in, and reading is one with its own needs", () => {
    expect(at(10).openForYou?.says).toBe("locked: needs level 20");
    expect(at(20).openForYou?.says).toBe("open for you");
  });
});
