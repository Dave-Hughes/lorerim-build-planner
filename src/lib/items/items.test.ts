import { describe, expect, it } from "vitest";
import { fitsSlot, searchItems, type GameItem } from "./items";

const item = (name: string, kind: GameItem["kind"], extra: Partial<GameItem> = {}): GameItem => ({ id: `Test.esp:${name}`, name, kind, stats: "", ...extra });
const ITEMS: GameItem[] = [
  item("Iron Cuirass", "armor", { slot: "Body", armorType: "Heavy", stats: "Heavy armor, 25 armor, 30 weight" }),
  item("Steel Spear", "weapon", { weaponType: "Spear" }),
  item("Steel Sword", "weapon", { weaponType: "Sword" }),
  item("Steel Greatsword", "weapon", { weaponType: "Greatsword" }),
  item("Ancient Steel Spear", "weapon", { weaponType: "Spear" }),
  item("Steel Armor", "armor", { slot: "Body", armorType: "Heavy" }),
  item("Steel Shield", "armor", { slot: "Shield", armorType: "Heavy" }),
  item("Steel Arrow", "ammo", { weaponType: "Arrow" }),
];

describe("searchItems", () => {
  it("puts names that start with the query first, then names that contain it", () => {
    expect(searchItems(ITEMS, "steel sp").map((i) => i.name)).toEqual(["Steel Spear", "Ancient Steel Spear"]);
    expect(searchItems(ITEMS, "ancient").map((i) => i.name)).toEqual(["Ancient Steel Spear"]);
    expect(searchItems(ITEMS, "spear").map((i) => i.name)).toEqual(["Steel Spear", "Ancient Steel Spear"]);
    // Whole-query matches first; then names with every word somewhere.
    expect(searchItems(ITEMS, "steel s").map((i) => i.name).slice(0, 4)).toEqual(["Steel Spear", "Steel Sword", "Steel Shield", "Ancient Steel Spear"]);
    expect(searchItems(ITEMS, "steel", 3)).toHaveLength(3);
    expect(searchItems(ITEMS, "  ")).toEqual([]);
  });
  it("matches every word anywhere in the name or the type line", () => {
    expect(searchItems(ITEMS, "iron armor").map((i) => i.name)).toEqual(["Iron Cuirass"]);
    expect(searchItems(ITEMS, "spear ancient").map((i) => i.name)).toEqual(["Ancient Steel Spear"]);
  });
});

describe("fitsSlot", () => {
  const names = (slot: string) => ITEMS.filter((i) => fitsSlot(i, slot)).map((i) => i.name);
  it("offers weapons for the main hand, one-handed weapons and shields for the off hand", () => {
    expect(names("Main hand")).toEqual(["Steel Spear", "Steel Sword", "Steel Greatsword", "Ancient Steel Spear"]);
    expect(names("Off hand")).toEqual(["Steel Spear", "Steel Sword", "Ancient Steel Spear", "Steel Shield"]);
  });
  it("offers armor by its slot and ammunition for Ammo", () => {
    expect(names("Body")).toEqual(["Iron Cuirass", "Steel Armor"]);
    expect(names("Ammo")).toEqual(["Steel Arrow"]);
    expect(names("Other")).toHaveLength(ITEMS.length);
  });
});
