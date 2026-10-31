import { describe, expect, it } from "vitest";
import { isNamedPerson } from "@/lib/people/data";
import { placesData } from "@/lib/places/data";

/**
 * WO-184 Part 10: a boss is said only when it is someone. The reviewer's list of kinds that were said ("Its boss is Kagouti.", "Pirate.", "Frost Troll.") stays unsaid, and the
 * named ones stay (Captain Hargar and a dragon's own name).
 */
const bosses = () => {
  const out = new Set<string>();
  for (const p of placesData().places) {
    const w = (p as { afterTheWar?: { boss?: { name?: string } } }).afterTheWar;
    for (const b of [p.actors?.boss, w?.boss]) if (b?.name) out.add(b.name);
  }
  return [...out].sort();
};

describe("a place's boss is someone (WO-184 Part 10)", () => {
  it("none of the reviewer's kinds is said", () => {
    for (const n of ["Kagouti", "Pirate", "Troll", "Frost Troll", "Ghost", "Spellsword", "First Mate", "Silver Hand", "Malevolent Necromancer", "Northwatch Interrogator", "Warehouse Traps Reset Test Guy", "Imperial Soldier", "Marauder", "Skeleton", "Prisoner", "Orc", "Giant", "Werebear", "Bandit Chief", "Hired Guard", "Thalmor Soldier", "Frostbite Spider", "Ice Wolf", "Desert Wolf"])
      expect(isNamedPerson(n), n).toBe(false);
  });
  it("the named ones are said, with a page or not", () => {
    for (const n of ["Captain Hargar", "Ben Sala", "Elenwen", "Esbern", "Krilqolaasdaan", "Warlord Gathrik", "Halvar the Drunk", "Movarth Piquine", "Silas Marceau", "Jyrik Gauldurson", "Haknir Death-Brand"])
      expect(isNamedPerson(n), n).toBe(true);
  });
  it("of every place's boss, the reviewer's examples are unsaid and Captain Hargar is said", () => {
    const all = bosses();
    const said = new Set(all.filter(isNamedPerson));
    for (const n of ["Kagouti", "Pirate", "Troll", "Frost Troll", "Ghost", "Spellsword", "First Mate", "Silver Hand", "Malevolent Necromancer", "Northwatch Interrogator", "Warehouse Traps Reset Test Guy"]) {
      expect(all, n).toContain(n);
      expect(said.has(n), n).toBe(false);
    }
    expect(said.has("Captain Hargar")).toBe(true);
    // Most of the 240 are someone (a dragon's own name, a lord); the kinds are about a third.
    expect(said.size).toBeGreaterThan(150);
    expect(all.length - said.size).toBeLessThan(100);
  });
});
