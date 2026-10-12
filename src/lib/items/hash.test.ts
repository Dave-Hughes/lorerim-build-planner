import { describe, expect, it } from "vitest";
import { itemsHash, itemsHashes } from "./hash";

describe("the items URL's hash", () => {
  it("changes when items.json changes, and not otherwise", () => {
    const a = JSON.stringify([{ id: "A:1", name: "Imperial Pike", weaponType: "Greatsword" }]);
    const b = JSON.stringify([{ id: "A:1", name: "Imperial Pike", weaponType: "Polearm" }]);
    expect(itemsHash(a)).toBe(itemsHash(a));
    expect(itemsHash(a)).not.toBe(itemsHash(b));
    expect(itemsHash(a)).toMatch(/^[0-9a-f]{12}$/);
  });

  it("is there for every version with an item index", () => {
    expect(Object.keys(itemsHashes())).toContain("5.0.4.8");
  });
});
