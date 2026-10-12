import { describe, expect, it } from "vitest";
import { requireGameData } from "./data";

// WO-41: the built spells.json, read through the game-data loader.
const d = requireGameData("5.0.4.8");
const byName = (name: string) => d.spells.filter((s) => s.name === name);

describe("spells", () => {
  it("Fireball is Destruction, Adept, cost 240, and deals 40 fire damage", () => {
    const [fireball] = byName("Fireball");
    expect(fireball).toMatchObject({ school: "Destruction", tier: "Adept", cost: 240 });
    expect(fireball.text).toContain("deals 40 fire damage");
    expect(d.spellById.get(fireball.id)).toBe(fireball);
  });

  it("knows each spell's tier", () => {
    expect(byName("Cloudkill")[0]).toMatchObject({ school: "Destruction", tier: "Expert" });
    expect(byName("Forbidden Sun")[0]).toMatchObject({ school: "Destruction", tier: "Master" });
    expect(byName("Shadow Clone on Self")[0]).toMatchObject({ school: "Illusion", tier: "Master" });
  });

  it("the Destruction Novice pool has 14 spells, with Flames and Sparks, and not Eldritch Blast", () => {
    const pool = d.spellPicks.pools["Destruction:Novice Destruction"].map((id) => d.spellById.get(id)?.name);
    expect(pool).toHaveLength(14);
    expect(pool).toContain("Flames");
    expect(pool).toContain("Sparks");
    expect(pool).not.toContain("Eldritch Blast");
    expect(byName("Eldritch Blast")).toHaveLength(1);
  });

  it("gives 2 picks per Novice to Expert perk and 1 per Master perk", () => {
    expect(["Novice", "Apprentice", "Adept", "Expert", "Master"].map((t) => d.spellPicks.perTier[t as "Novice"])).toEqual([2, 2, 2, 2, 1]);
  });

  it("has no two entries with the same name, school and tier", () => {
    const keys = d.spells.map((s) => `${s.name}|${s.school}|${s.tier}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("keys every pool by a tier perk the version has, and every pooled id is a spell", () => {
    expect(Object.keys(d.spellPicks.pools)).toHaveLength(25);
    for (const [perk, ids] of Object.entries(d.spellPicks.pools)) {
      expect(d.perkById.has(perk), perk).toBe(true);
      for (const id of ids) expect(d.spellById.has(id), id).toBe(true);
    }
  });
});
