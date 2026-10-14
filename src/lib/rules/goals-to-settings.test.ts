import { describe, expect, it } from "vitest";
import {
  attributeSettings,
  defaultAttribute,
  fillToLevel,
  goalsToSettings,
} from "@/components/editor/plan-ops";
import { requireGameData, type GameData } from "./data";
import { computeBuild } from "./engine";
import { emptyLevel } from "./derive";
import type { BuildPlan } from "./types";

const d = requireGameData("5.0.4.8");

/** The canvas's Altmer test build (WO-65): a fresh mage, level 1 only. */
const ALTMER: BuildPlan = {
  schema: 1,
  gameVersion: "5.0.4.8",
  race: "Altmer",
  birthsign: "Mage",
  mode: "Konahrik",
  start: "Merchant",
  startOption: "Cyrodiil",
  majors: ["Destruction", "Alteration", "Conjuration"],
  minors: [
    "Restoration",
    "Illusion",
    "Enchanting",
    "Alchemy",
    "Speech",
    "Evasion",
  ],
  traits: [],
  traitChoices: {},
  levels: [emptyLevel()],
  gear: [],
  notes: "",
} as unknown as BuildPlan;

const goals = (ids: string[], to = 20) =>
  goalsToSettings(ALTMER, ids, to, "magicka", d);

describe("goalsToSettings (WO-65)", () => {
  it("Impact alone brings Novice and Empowered Destruction, in order, and a Destruction target of 50", () => {
    const g = goals(["Destruction:Impact"]);
    expect(g.settings.perks).toEqual([
      "Destruction:Novice Destruction",
      "Destruction:Empowered Destruction",
      "Destruction:Impact",
    ]);
    expect(g.settings.targets[0]).toEqual(["Destruction", 50]);
    expect(new Set(g.along)).toEqual(
      new Set([
        "Destruction:Novice Destruction",
        "Destruction:Empowered Destruction",
      ]),
    );
  });

  it("Expert Destruction brings the Novice, Apprentice and Adept path and a target of 75", () => {
    const g = goals(["Destruction:Expert Destruction"]);
    expect(g.settings.perks).toEqual([
      "Destruction:Novice Destruction",
      "Destruction:Apprentice Destruction",
      "Destruction:Adept Destruction",
      "Destruction:Expert Destruction",
    ]);
    expect(g.settings.targets[0]).toEqual(["Destruction", 75]);
    expect(g.paths["Destruction:Expert Destruction"]).toEqual([
      "Destruction:Novice Destruction",
      "Destruction:Apprentice Destruction",
      "Destruction:Adept Destruction",
    ]);
  });

  it('an "either" perk takes its cheaper prerequisite', () => {
    // You Shall Not Pass needs Charge Tap (60) or Wand Mastery (50).
    const g = goals(["Enchanting:You Shall Not Pass"]);
    expect(g.along.has("Enchanting:Wand Mastery")).toBe(true);
    expect(g.along.has("Enchanting:Charge Tap")).toBe(false);
  });

  it('an "either" perk takes the one already coming along', () => {
    const g = goals(["Enchanting:Charge Tap", "Enchanting:You Shall Not Pass"]);
    expect(g.along.has("Enchanting:Wand Mastery")).toBe(false);
    expect(g.settings.perks.indexOf("Enchanting:Charge Tap")).toBeLessThan(
      g.settings.perks.indexOf("Enchanting:You Shall Not Pass"),
    );
  });

  it("a prerequisite in another tree comes along", () => {
    // The game's one cross-tree link is an "either" (Dodge: Conditioning or Agility), so make it a plain one here.
    const dodge = d.perkById.get("Evasion:Dodge")!;
    const perkById = new Map(d.perkById).set(dodge.id, {
      ...dodge,
      anyOf: false,
      requires: ["Heavy Armor:Conditioning"],
    });
    const g = goalsToSettings(ALTMER, ["Evasion:Dodge"], 20, "magicka", {
      ...d,
      perkById,
    } as GameData);
    expect([...g.along]).toEqual(["Heavy Armor:Conditioning"]);
    expect(g.settings.perks).toEqual([
      "Heavy Armor:Conditioning",
      "Evasion:Dodge",
    ]);
  });

  it("two goals that rule each other out are reported, not filled", () => {
    const g = goals([
      "Block:Weapons Master",
      "Two-Handed:Great Weapon Mastery",
    ]);
    expect(g.clashes).toHaveLength(1);
    expect(g.clashes[0].message).toBe(
      "Weapons Master can't be held with Two-Handed: Great Weapon Mastery.",
    );
    expect(g.settings.perks).toEqual([]);
  });

  it("spare points go to the majors, then the minors, after the goals' trees", () => {
    const g = goals(["Alteration:Adept Alteration"]);
    expect(g.settings.targets.map(([s]) => s)).toEqual([
      "Alteration",
      "Destruction",
      "Conjuration",
      "Restoration",
      "Illusion",
      "Enchanting",
      "Alchemy",
      "Speech",
      "Evasion",
    ]);
  });

  it("X first gives X half the level-ups, taken first; Even splits them", () => {
    expect(attributeSettings("magicka", 30)).toEqual({
      attributes: { magicka: 15, health: 7, stamina: 7 },
      first: "magicka",
    });
    expect(attributeSettings("even", 20)).toEqual({
      attributes: { health: 7, magicka: 6, stamina: 6 },
      first: "even",
    });
    expect(defaultAttribute(ALTMER, d)).toBe("magicka");
  });

  it("the canvas goals on an Altmer to 30 fill with no problems, every goal placed", () => {
    const ids = [
      "Destruction:Impact",
      "Destruction:Expert Destruction",
      "Destruction:Cremation",
      "Alteration:Adept Alteration",
    ];
    const g = goalsToSettings(ALTMER, ids, 30, "magicka", d);
    const { plan, report } = fillToLevel(ALTMER, g.settings, d);
    expect(computeBuild(plan, d).flatMap((s) => s.issues)).toEqual([]);
    for (const id of ids)
      expect(report.perks.find((p) => p.id === id)?.level).not.toBeNull();
    expect(plan.levels).toHaveLength(30);
  });
});
