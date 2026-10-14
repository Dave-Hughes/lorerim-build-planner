/**
 * The Altmer battlemage from the Skip ahead canvas (WO-69, KeyLevelPage.dc.html): level 1, then
 * stretches 2 to 10, 11 to 25 and 26 to 50. Its stretches, perks, Destiny and attribute splits are
 * the canvas's; the raises are set so that, from this build's real starting skills, the totals are
 * the canvas's: 95 spent over 2 to 10 (175 carried in to 11), 625 available, 510 spent and 115
 * carried over 11 to 25, and 13 of 15 perk points.
 */
import { emptyLevel } from "../derive";
import { skippedLevel } from "../stretches";
import type { BuildPlan, LevelPlan } from "../types";

const skipped = (n: number): LevelPlan[] => Array.from({ length: n }, skippedLevel);

export function altmerSkipsPlan(): BuildPlan {
  return {
    schema: 1,
    gameVersion: "5.0.4.8",
    race: "Altmer",
    birthsign: "Mage",
    mode: "Konahrik",
    deity: "",
    start: "Merchant",
    startOption: "Cyrodiil",
    majors: ["Destruction", "Alteration", "Enchanting"],
    minors: ["Restoration", "Illusion", "Conjuration", "Block", "Evasion", "Speech"],
    traits: [],
    gear: [],
    notes: "",
    levels: [
      {
        ...emptyLevel(),
        perks: ["Destruction:Novice Destruction", "Alteration:Novice Alteration", "Enchanting:Enchanter's Insight"],
        destiny: ["Destiny:Destiny"],
        note: "Altmer for the Magicka. The three starting perks go to Destruction, Alteration and Enchanting.",
      },
      ...skipped(8),
      {
        ...emptyLevel(),
        attributes: { health: 2, magicka: 6, stamina: 1 },
        skillPoints: { Destruction: 20, Alteration: 15, Block: 5, Evasion: 5, Restoration: 5, Illusion: 2, Speech: 1 },
        perks: [
          "Restoration:Novice Restoration",
          "Alteration:Unskilled Spellcasting",
          "Alteration:Metamagic",
          "Illusion:Novice Illusion",
          "Enchanting:Arcane Artificery",
          "Destruction:Arcane Focus",
          "Alteration:Transmutation",
          "Restoration:Improved Healing",
          "Illusion:Empowered Illusion",
        ],
        destiny: ["Destiny:Focus", "Destiny:Mage"],
        note: "Destruction and Alteration first. The Alteration perks with no skill requirement are worth taking now, while points are cheap.",
      },
      ...skipped(14),
      {
        ...emptyLevel(),
        attributes: { health: 4, magicka: 9, stamina: 2 },
        skillPoints: { Destruction: 25, Alteration: 25, Enchanting: 45, Restoration: 45, Illusion: 48, Block: 5, Speech: 4 },
        perks: [
          "Destruction:Apprentice Destruction",
          "Destruction:Empowered Destruction",
          "Destruction:Pyromancy",
          "Alteration:Apprentice Alteration",
          "Alteration:Improved Mage Armor",
          "Enchanting:Elemental Lore",
          "Enchanting:Soul Gem Mastery",
          "Block:Improved Blocking",
          "Destruction:Adept Destruction",
          "Destruction:Impact",
          "Alteration:Adept Alteration",
          "Alteration:Stability",
          "Destruction:Expert Destruction",
        ],
        destiny: ["Destiny:Magicka Surge", "Destiny:Sorcerer"],
        note: "Take Impact as soon as Destruction reaches 50. Everything else in this stretch can wait for it.\n\nBlock stays low until 26. Until then the shield is for bashing.",
      },
      ...skipped(24),
      {
        ...emptyLevel(),
        attributes: { health: 7, magicka: 15, stamina: 3 },
        skillPoints: { Destruction: 25, Alteration: 25, Block: 30 },
        perks: [
          "Block:Strong Grip",
          "Block:Experienced Blocking",
          "Block:Weapons Master",
          "Destruction:Cremation",
          "Alteration:Expert Alteration",
          "Destruction:Fire Mastery",
          "Destruction:Master Destruction",
          "Alteration:Master Alteration",
        ],
        destiny: ["Destiny:Fortification", "Destiny:Absorbtion"],
        note: "Fire Mastery and Master Destruction come at 100.",
      },
    ],
  } as BuildPlan;
}
