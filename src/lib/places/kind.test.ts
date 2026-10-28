import { describe, expect, it } from "vitest";
import { placeByName, placesData } from "./data";
import { placeKind } from "./kind";

describe("which kind of page a place gets (WO-162)", () => {
  const kind = (name: string) => placeKind(placeByName(name)!);
  it("Riverwood is a town, the Sleeping Giant Inn and Dragonsreach are inside one, Bleak Falls Barrow is dangerous", () => {
    expect(kind("Riverwood")).toBe("town");
    expect(kind("Sleeping Giant Inn")).toBe("inside");
    expect(kind("Dragonsreach")).toBe("inside");
    expect(kind("Bleak Falls Barrow")).toBe("dangerous");
  });
  it("the Bee and Barb is an inn inside Riften (Riften's places aren't in the index yet, WO-166, so it is shown as the record will have it)", () => {
    expect(placeKind({ type: "Inn", inTown: "Riften", actors: { count: 9, hostile: false } })).toBe("inside");
    const real = placeByName("The Bee and Barb");
    if (real) expect(placeKind(real)).toBe("inside");
  });
  it("a town that bandits hold is dangerous, and every cave, ruin, fort and lair is", () => {
    expect(placeKind({ type: "Town", actors: { count: 54, livesHere: "Bandit" } })).toBe("dangerous");
    for (const p of placesData().places.filter((x) => ["Cave", "NordicRuin", "DwemerRuin", "DragonLair", "Mine", "Fort"].includes(x.type))) expect(placeKind(p), p.name).toBe("dangerous");
  });
  it("an inn that isn't inside a town (a roadside one) is a town-style page, not a dungeon", () => {
    expect(placeKind({ type: "Inn", actors: { count: 3, hostile: false } })).toBe("town");
  });
});
