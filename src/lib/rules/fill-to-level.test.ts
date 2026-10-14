import { describe, expect, it } from "vitest";
import {
  attributeOrder,
  fillToLevel,
  type FillSettings,
} from "@/components/editor/plan-ops";
import { requireGameData } from "./data";
import { computeBuild } from "./engine";
import type { BuildPlan, LevelPlan } from "./types";

const d = requireGameData("5.0.4.8");
const blank = (): LevelPlan =>
  ({
    skillPoints: {},
    perks: [],
    destiny: [],
    extras: [],
    note: "",
  }) as unknown as LevelPlan;

/** Jo'Vashar from the WO-64 canvas: a fresh build, level 1 only. */
const JO: BuildPlan = {
  schema: 1,
  gameVersion: "5.0.4.8",
  race: "Khajiit",
  birthsign: "Lord",
  mode: "Konahrik",
  deity: "Riddle'Thar",
  start: "Merchant",
  startOption: "Cyrodiil",
  majors: ["Two-Handed", "Evasion", "Alteration"],
  minors: ["Block", "Wayfarer", "Smithing", "Restoration", "Sneak", "Speech"],
  traits: ["Focused Combat", "Monk"],
  traitChoices: { "Focused Combat": "Two-Handed" },
  levels: [blank()],
  gear: [],
  notes: "",
} as unknown as BuildPlan;

const SETTINGS: FillSettings = {
  to: 30,
  targets: [
    ["Two-Handed", 75],
    ["Evasion", 90],
    ["Alteration", 60],
    ["Block", 40],
    ["Smithing", 30],
  ],
  attributes: { magicka: 10, stamina: 12, health: 7 },
  first: "magicka",
  perks: [
    "Two-Handed:Great Weapon Mastery",
    "Evasion:Agility",
    "Alteration:Novice Alteration",
    "Evasion:Unarmored",
    "Alteration:Apprentice Alteration",
    "Two-Handed:Barbaric Might",
    "Two-Handed:Quarterstaff & Battlestaff Focus",
    "Alteration:Improved Mage Armor",
    "Evasion:Dodge",
    "Block:Improved Blocking",
    "Alteration:Adept Alteration",
    "Two-Handed:Mighty Strike",
    "Alteration:Expert Alteration",
  ],
};

describe("fillToLevel (WO-64)", () => {
  const { plan, report } = fillToLevel(JO, SETTINGS, d);
  const states = computeBuild(plan, d);

  it("gives the canvas numbers for Jo'Vashar at 30", () => {
    expect(plan.levels).toHaveLength(30);
    expect([report.health, report.magicka, report.stamina]).toEqual([
      135, 150, 220,
    ]);
    const evasion = report.targets.find((t) => t.skill === "Evasion")!;
    expect(evasion.end).toBe(80);
    expect(evasion.reason).toBe("80 at most: the max skill at level 30");
    expect(report.targets.find((t) => t.skill === "Two-Handed")!.reason).toBe(
      "By level 25",
    );
    expect(
      report.perks.find((p) => p.id === "Alteration:Adept Alteration")!.level,
    ).toBe(10);
    expect(report.skillPointsLeft).toBe(450);
    expect(report.perkPointsLeft).toBe(21);
  });

  it("says why Mighty Strike and Expert Alteration don't fit", () => {
    const mighty = report.perks.find(
      (p) => p.id === "Two-Handed:Mighty Strike",
    )!;
    const expert = report.perks.find(
      (p) => p.id === "Alteration:Expert Alteration",
    )!;
    expect(mighty.level).toBeNull();
    expect(mighty.reason).toMatch(/^Not by level 30: needs Two-Handed \d+/);
    expect(expert.level).toBeNull();
    expect(expert.reason).toMatch(
      /^Not by level 30: needs Alteration \d+, above the target$/,
    );
  });

  it("leaves no problem on any level", () => {
    expect(states.flatMap((s) => s.issues)).toEqual([]);
  });

  it("leaves level 1 and the setup as they were", () => {
    expect(plan.levels[0]).toBe(JO.levels[0]);
    expect({ ...plan, levels: [] }).toEqual({ ...JO, levels: [] });
  });

  it("spends the attributes as told, Take first first", () => {
    const got = plan.levels.slice(1).map((lv) => lv.attribute);
    expect(got.filter((a) => a === "magicka")).toHaveLength(10);
    expect(got.filter((a) => a === "stamina")).toHaveLength(12);
    expect(got.filter((a) => a === "health")).toHaveLength(7);
    expect(got.slice(0, 10).every((a) => a === "magicka")).toBe(true);
  });

  it("takes them in turn when told Evenly", () => {
    expect(
      attributeOrder({
        to: 7,
        attributes: { health: 2, magicka: 2, stamina: 2 },
        first: "even",
      }),
    ).toEqual(["health", "magicka", "stamina", "health", "magicka", "stamina"]);
  });

  it("gives a ranked perk listed twice two ranks", () => {
    const ranked = d.perks.find(
      (p) =>
        p.tree === "Two-Handed" && (p.ranks ?? 1) > 1 && !p.requires.length,
    )!;
    const r = fillToLevel(
      JO,
      { ...SETTINGS, perks: [ranked.id, ranked.id] },
      d,
    );
    const placed = r.report.perks.map((p) => p.level);
    expect(placed.every((l) => l !== null)).toBe(true);
    expect(computeBuild(r.plan, d)[29].perksTaken[ranked.id]).toHaveLength(2);
  });

  it("places a listed Destiny star at the first level with a Destiny point", () => {
    const star = d.perks.find(
      (p) => p.tree === "Destiny" && !p.requires.length,
    )!;
    const r = fillToLevel(JO, { ...SETTINGS, perks: [star.id] }, d);
    const at = r.report.perks[0].level;
    expect(at).not.toBeNull();
    expect(r.plan.levels[at! - 1].destiny).toEqual([star.id]);
    expect(computeBuild(r.plan, d).flatMap((s) => s.issues)).toEqual([]);
  });
});
