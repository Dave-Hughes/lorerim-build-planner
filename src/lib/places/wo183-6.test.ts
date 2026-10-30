import { describe, expect, it } from "vitest";
import { placesData } from "@/lib/places/data";

/**
 * WO-183 Part 6 (PC, Bob's ruling): a place lists the quests that start there, from where the starting person is placed, apart from the quests that send you there.
 * Checked against UESP's "Quests Starting Here" for Whiterun and against wo178's Riverwood three.
 */
const city = (n: string) => placesData().places.find((p) => p.name === n && (p.type === "City" || p.type === "Town"))!;

describe("quests that start here (WO-183 Part 6)", () => {
  it("Whiterun lists the quests UESP lists that a person in Whiterun gives", () => {
    const here = city("Whiterun").startsHere ?? [];
    for (const q of ["Bleak Falls Barrow", "Dragon Rising", "The Whispering Door", "In My Time Of Need", "Missing In Action", "The Blessings of Nature", "Thane of Whiterun", "Rare Gifts"]) expect(here, q).toContain(q);
  });
  it("where the rule and UESP differ is written down: Before the Storm and The Way of the Voice start at no person in Whiterun", () => {
    const here = city("Whiterun").startsHere ?? [];
    expect(here).not.toContain("Before the Storm");
    expect(here).not.toContain("The Way of the Voice");
  });
  it("Riverwood still sends three quests there (wo178) and starts The Golden Claw", () => {
    expect(city("Riverwood").quests).toEqual(["Before the Storm", "Bleak Falls Barrow", "The Golden Claw"]);
    expect(city("Riverwood").startsHere).toContain("The Golden Claw");
  });
  it("a quest that starts at a marker in a place is listed there: High Hrothgar and The Words of Power", () => {
    expect(placesData().places.find((p) => p.name === "High Hrothgar" && p.startsHere)?.startsHere).toContain("The Words of Power");
  });
  it("a quest is listed once, and a helper, a no-start quest or a radiant job per board is never a quest that starts here", () => {
    for (const p of placesData().places) {
      const q = p.startsHere ?? [];
      expect(new Set(q).size, p.name).toBe(q.length);
      for (const n of q) expect(n, `${p.name}: ${n}`).not.toMatch(/\b(Handler|Controller|Tracker|Dialogue|Misc|Scene)\b|Objective Quest$/);
    }
    expect(city("Riften").startsHere).not.toContain("Boethiah's Bidding");
  });
});
