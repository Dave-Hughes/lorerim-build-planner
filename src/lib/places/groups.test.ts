import { describe, expect, it } from "vitest";
import { PLACE_GROUPS, groupOf } from "./groups";
import { placesData } from "./data";

describe("the kinds of place a player would pick (WO-167 review)", () => {
  it("is about ten groups", () => {
    expect(PLACE_GROUPS.length).toBeGreaterThanOrEqual(8);
    expect(PLACE_GROUPS.length).toBeLessThanOrEqual(12);
  });
  it("names every location type the index has, once", () => {
    const named = PLACE_GROUPS.flatMap((g) => g.types);
    expect(new Set(named).size).toBe(named.length);
    const missing = [...new Set(placesData().places.map((p) => p.type))].filter((t) => !named.includes(t));
    expect(missing).toEqual([]);
  });
  it("puts the places a player means where they expect", () => {
    expect(groupOf("City")).toBe("cities");
    expect(groupOf("Inn")).toBe("inns");
    expect(groupOf("House")).toBe("homes");
    expect(groupOf("NordicRuin")).toBe("ruins");
    expect(groupOf("DragonLair")).toBe("camps");
    expect(groupOf("SomethingNew")).toBe("landmarks");
  });
});
