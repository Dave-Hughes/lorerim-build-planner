import { describe, expect, it } from "vitest";
import { requireGameData } from "@/lib/rules/data";
import { computeBuild } from "@/lib/rules/engine";
import { levelChanges } from "@/lib/rules/derive";
import { gearAt, gearChanges } from "@/lib/rules/gear";
import { stretchAt } from "@/lib/rules/stretches";
import { IRIEL_PLAN } from "./iriel";

const d = requireGameData("5.0.4.8");
const states = computeBuild(IRIEL_PLAN, d);

/** What Iriel's staging build page showed on 15 Oct 2026: the card's title, perks and Destiny, new gear, and gear worn. */
const STAGING: Record<number, { title: string; perks: string[]; gearNew: string[]; worn: string[] }> = {
  1: {
    title: "Level 1",
    perks: ["Ranged Combat Training", "Stealth 1", "Alchemical Lore 1", "Agility", "Cheap Tricks", "Trapper", "Destiny"],
    gearNew: ["Hunting Light Bow", "Iron Arrow", "Bosmeri Hood", "Hide Cuirass", "Hide Bracers", "Hide Boots", "Poison vials"],
    worn: ["Hunting Light Bow", "Iron Arrow", "Bosmeri Hood", "Hide Cuirass", "Hide Bracers", "Hide Boots", "Poison vials"],
  },
  20: {
    title: "Level 20",
    perks: ["Anatomical Lore", "Scout"],
    gearNew: [],
    worn: ["Elven Light Bow", "Elven Arrow", "Bosmeri Hood", "Leather Scout Armor", "Leather Scout Gauntlets", "Leather Scout Boots", "Silver Garnet Ring"],
  },
  36: {
    title: "Levels 36 to 42",
    perks: ["Sniper", "Athletics 2", "Combat Reflexes", "Acrobatics", "Nimble Fingers 1", "Cutpurse", "Poisoner"],
    gearNew: ["Glass Helmet", "Glass Gauntlets", "Glass Boots"],
    worn: ["Glass Light Bow", "Glass Arrow", "Glass Helmet", "Glass Cuirass", "Glass Gauntlets", "Glass Boots", "Amulet of Kynareth", "Silver Garnet Ring"],
  },
  50: {
    title: "Levels 46 to 50",
    perks: ["Glass Smithing", "Tripwire", "Cloak and Dagger", "Problem Solver", "Salt on the Wound", "Immunization"],
    gearNew: [],
    worn: ["Ebony Light Bow", "Ebony Arrow", "Glass Helmet", "Glass Cuirass", "Glass Gauntlets", "Glass Boots", "Amulet of Kynareth", "Silver Garnet Ring"],
  },
};

describe("WO-86: Iriel's fixture matches her staging build page", () => {
  for (const [at, want] of Object.entries(STAGING)) {
    it(`at level ${at}`, () => {
      // The card opens on the level that holds the stretch's choices (WO-69).
      const span = stretchAt(IRIEL_PLAN, Number(at));
      const level = span.to;
      expect(span.from > 1 && span.from < span.to ? `Levels ${span.from} to ${span.to}` : `Level ${level}`).toBe(want.title);
      const c = levelChanges(d, IRIEL_PLAN, states, level);
      const perks = c.perks.map((p) => `${p.name}${p.rank ? ` ${p.rank}` : ""}`);
      expect([...perks, ...c.destiny.map((p) => p.name)].sort()).toEqual([...want.perks].sort());
      expect(gearChanges(IRIEL_PLAN, level).map((g) => g.name.trim()).filter(Boolean).sort()).toEqual([...want.gearNew].sort());
      expect(gearAt(IRIEL_PLAN, level).map((g) => g.name).sort()).toEqual([...want.worn].sort());
    });
  }

  it("takes 15 Marksman perks by level 50", () => {
    expect(Object.keys(states[49].perksTaken).filter((id) => id.startsWith("Marksman:"))).toHaveLength(15);
  });
});
