import { describe, expect, it } from "vitest";
import { peopleData, personByName } from "@/lib/people/data";
import { placesData } from "@/lib/places/data";
import { peopleAt } from "@/lib/places/people";

/**
 * WO-183 Part 1 (PC): the people a player can look up are people. A generic or leveled actor has no page; where someone is found is a place a player can go;
 * sex and race are what the game shows; a trainer is what the class record teaches; only a keeper rents rooms.
 */
const one = (name: string) => personByName(name);

describe("generic and leveled actors are not people (WO-183 Part 1)", () => {
  it("the audit's examples have no page, no search result and no address", () => {
    for (const n of ["Mercenary", "Goblin", "Frost Troll", "Jumping Shock Spider", "Dark Brotherhood Assassin", "Imperial Commander"]) {
      expect(one(n), n).toBeNull();
      expect(peopleData().all.find((p) => p.name === n), n).toBeUndefined();
    }
  });
  it("a named person is still a person, unique flag or not", () => {
    for (const n of ["Odahviing", "Neloth", "Aela the Huntress", "Hulda", "Belethor", "Ulfric Stormcloak", "Delphine"]) expect(one(n), n).not.toBeNull();
  });
  it("no two people share a page address", () => {
    const slugs = peopleData().all.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("where to find someone is a place a player can go (WO-183 Part 1)", () => {
  const TEST = /^(?:Marker Storage Unit|Actor Room|Quick Test Cell|You're not supposed to be here|Do Not Delete.*|DLC\d+ Warehouse.*|Test\w*|.*Holding Cell)$/i;
  it("no person is placed in a developer's cell", () => {
    const bad = peopleData().all.flatMap((p) => p.rows.filter((r) => r.cell && TEST.test(r.cell)).map((r) => `${p.name}: ${r.cell}`));
    expect(bad).toEqual([]);
  });
  it("a cell out in Tamriel under a city's location is not in the city", () => {
    const riften = peopleData().all.flatMap((p) => p.rows.filter((r) => r.inTown === "Riften" && r.cell === "Gromm's Pass"));
    expect(riften).toEqual([]);
  });
});

describe("sex, race, role and what they do (WO-183 Part 1)", () => {
  it("Moira the hagraven is a woman; Alara is one person", () => {
    expect(one("Moira")?.sex).toBe("female");
    expect([one("Alara"), one("High Priestess Alara")].filter(Boolean)).toHaveLength(1);
  });
  it("no race is a record's name", () => {
    const races = new Set(peopleData().all.map((p) => p.race).filter(Boolean));
    expect([...races].filter((r) => / Race$|^Elder$/.test(r!))).toEqual([]);
  });
  it("Neloth is no farmer and trains Enchanting; the Companions train their skills", () => {
    expect(one("Neloth")?.role).toBeUndefined();
    expect(one("Neloth")?.trainer).toMatchObject({ skill: "Enchanting", cap: 90 });
    const trains = (n: string) => one(n)?.trainer?.skill;
    expect(trains("Aela the Huntress")).toBe("Marksman");
    expect(trains("Njada Stonearm")).toBe("Block");
    expect(trains("Athis")).toBe("One-Handed");
    expect(trains("Farkas")).toBe("Heavy Armor");
    expect(trains("Vilkas")).toBe("Two-Handed");
  });
  it("only the keeper rents rooms: Hulda, not Mikael or Saadia", () => {
    expect(one("Hulda")?.innkeeper).toBe(true);
    expect(one("Mikael")?.innkeeper).toBeUndefined();
    expect(one("Saadia")?.innkeeper).toBeUndefined();
  });
  it("a place page lists a person once (Mathies)", () => {
    for (const p of placesData().places.filter((x) => x.type === "City" || x.type === "Town")) {
      const names = peopleAt(p).houses.flatMap((h) => h.people.map((x) => x.name));
      expect(names.filter((n, i) => names.indexOf(n) !== i), p.name).toEqual([]);
    }
  });
});
