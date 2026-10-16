import { describe, expect, it } from "vitest";
import items from "@/data/lorerim-5.0.4.8/items.json";
import recipes from "@/data/lorerim-5.0.4.8/recipes.json";
import type { GameItem } from "@/lib/items/search";
import { PAGE_SIZE, backLabel, gearHref, gearType, itemSlug, parseGearQuery, queryGear, slugIndex, typeCounts, type GearQuery, type Recipes } from "./query";

const all = items as GameItem[];
const rec = recipes as Recipes;
const q = (over: Partial<GearQuery> = {}): GearQuery => ({ kind: "armor", type: "", armor: "", source: "", q: "", sort: "name", page: 1, ...over });

describe("the Gear list (WO-92)", () => {
  it("filters by tab, type and armor, and sorts by armor rating with the name breaking ties", () => {
    const r = queryGear(all, rec, q({ type: "Body", armor: "Light", sort: "armor" }));
    expect(r.rows[0].name).toBe("Daedric Mail Cuirass");
    for (const row of r.rows) expect(row.type).toBe("Body");
    const full = all.filter((i) => i.kind === "armor" && gearType(i) === "Body" && i.armorType === "Light");
    expect(r.total).toBe(full.length);
    const ratings = r.rows.map((x) => x.armor ?? 0);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it("sorts by name, damage and weight", () => {
    const names = queryGear(all, rec, q({ kind: "weapon" })).rows.map((r) => r.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    const dmg = queryGear(all, rec, q({ kind: "weapon", sort: "damage" })).rows.map((r) => r.damage ?? 0);
    expect(dmg).toEqual([...dmg].sort((a, b) => b - a));
    const w = queryGear(all, rec, q({ kind: "weapon", sort: "weight" })).rows.map((r) => r.weight ?? 0);
    expect(w).toEqual([...w].sort((a, b) => a - b));
  });

  it("filters by source: Can be made has a Make recipe, Not listed has none", () => {
    const made = queryGear(all, rec, q({ source: "made" }));
    const none = queryGear(all, rec, q({ source: "none" }));
    expect(made.total + none.total).toBe(made.counts.armor);
    for (const r of made.rows) expect(r.station).toBeTruthy();
    for (const r of none.rows) expect(r.station).toBeNull();
  });

  it("searches the name, the stats and the game's text", () => {
    expect(queryGear(all, rec, q({ q: "glass cuirass" })).rows[0].name).toBe("Glass Cuirass");
    // Only Savior's Hide's text has these words: not its name, not its stats.
    expect(queryGear(all, rec, q({ q: "grown in power" })).rows.map((r) => r.name)).toContain("Savior's Hide");
    expect(queryGear(all, rec, q({ q: "zzqx nothing" })).total).toBe(0);
  });

  it("pages 50 at a time and keeps a page past the end on the last", () => {
    const one = queryGear(all, rec, q());
    expect(one.rows).toHaveLength(PAGE_SIZE);
    const two = queryGear(all, rec, q({ page: 2 }));
    expect(two.rows[0].id).not.toBe(one.rows[0].id);
    const far = queryGear(all, rec, q({ page: 999 }));
    expect(far.page).toBe(far.pages);
  });

  it("lists armor types in GEAR_TYPES order, only those with items", () => {
    const t = typeCounts(all, "armor").map((x) => x.name);
    expect(t.slice(0, 4)).toEqual(["Head", "Circlet", "Face", "Body"]);
    expect(typeCounts(all, "ammo").map((x) => x.name).sort()).toEqual(["Arrow", "Bolt"]);
  });

  it("reads and writes the URL, dropping defaults and anything unknown", () => {
    const g = parseGearQuery({ kind: "armor", type: "Body", armor: "Light", sort: "armor", page: "2" });
    expect(gearHref(g)).toBe("/gear?type=Body&armor=Light&sort=armor&page=2");
    expect(parseGearQuery({ kind: "weapons", armor: "Light", sort: "armor" })).toMatchObject({ kind: "weapon", armor: "", sort: "name" });
    expect(gearHref(q())).toBe("/gear");
    expect(backLabel(g)).toBe("Light armor for the body");
    expect(backLabel(q())).toBe("Gear");
  });
});

describe("item pages (WO-92)", () => {
  it("makes a URL-safe slug that is unique for every item", () => {
    expect(itemSlug("Skyrim.esm:013939")).toBe("skyrim-esm-013939");
    const slugs = all.map((i) => itemSlug(i.id));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("resolves an old id in an item's `also` to that item", () => {
    const { bySlug, old } = slugIndex(all);
    const withAlso = all.find((i) => i.also?.length)!;
    expect(old.get(itemSlug(withAlso.also![0]))?.id).toBe(withAlso.id);
    expect(bySlug.get(itemSlug(withAlso.id))?.id).toBe(withAlso.id);
  });
});
