import { describe, expect, it } from "vitest";
import { requireGameData } from "./data";
import { convertPlan } from "./convert";
import { emptyLevel } from "./derive";
import { checkSnapshot, ruledOut, skillCap, snapshotFloor } from "./snapshot";
import type { BuildPlan, Snapshot } from "./types";

const d = requireGameData("5.0.4.8");

/** The canvas's Altmer test build, as a snapshot. */
const ALTMER: BuildPlan = {
  schema: 1,
  gameVersion: "5.0.4.8",
  race: "Altmer",
  birthsign: "Mage",
  mode: "Konahrik",
  deity: "",
  start: "Merchant",
  startOption: "Cyrodiil",
  majors: ["Destruction", "Alteration", "Conjuration"],
  minors: ["Restoration", "Illusion", "Enchanting", "Alchemy", "Speech", "Evasion"],
  traits: [],
  levels: [emptyLevel()],
  gear: [],
  notes: "",
} as unknown as BuildPlan;

const snap = (level: number, perks: string[], skills: Record<string, number> = {}): Snapshot => {
  const n = level - 1;
  return { level, attributes: { health: Math.floor(n / 4), magicka: n - 2 * Math.floor(n / 4), stamina: Math.floor(n / 4) }, perks, skills };
};

describe("snapshots (WO-68)", () => {
  it("Impact and Expert Destruction at 50 pass the check, with the result to store", () => {
    const r = checkSnapshot(ALTMER, snap(50, ["Destruction:Impact", "Destruction:Expert Destruction"]), d);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.skills.Destruction).toBeGreaterThanOrEqual(75);
    for (const id of ["Destruction:Novice Destruction", "Destruction:Empowered Destruction", "Destruction:Impact", "Destruction:Apprentice Destruction", "Destruction:Adept Destruction", "Destruction:Expert Destruction"]) expect(r.result.perks).toContain(id);
    expect(r.result.magicka).toBeGreaterThan(r.result.health);
    expect(Object.keys(r.result.skills)).toHaveLength(18);
  });

  it("picks that need level 25, saved at 20, are refused", () => {
    expect(snapshotFloor(ALTMER, snap(20, ["Destruction:Expert Destruction"]), d)).toBe(25);
    const r = checkSnapshot(ALTMER, snap(20, ["Destruction:Expert Destruction"]), d);
    expect(r).toEqual({ ok: false, error: "Expert Destruction can't be had by level 20." });
  });

  it("a set skill value past what the points allow is refused", () => {
    const tooMuch = snap(12, [], { Destruction: 60, Alteration: 60, Conjuration: 60, Restoration: 60, Illusion: 60 });
    const r = checkSnapshot(ALTMER, tooMuch, d);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/can't reach 60 by level 12\.$/);
    // The most Destruction can be with the others as they are, at level 12.
    const one = snap(12, [], { Alteration: 50 });
    const cap = skillCap(ALTMER, one, "Destruction", 30, d);
    expect(checkSnapshot(ALTMER, { ...one, skills: { ...one.skills, Destruction: cap } }, d).ok).toBe(true);
    expect(checkSnapshot(ALTMER, { ...one, skills: { ...one.skills, Destruction: cap + 1 } }, d).ok).toBe(false);
  });

  it("Weapons Master rules out Weapon Mastery and every perk whose path needs it", () => {
    const out = ruledOut(d, new Set(["Block:Improved Blocking", "Block:Weapons Master"]));
    expect(out.get("One-Handed:Weapon Mastery")).toEqual({ by: "Block:Weapons Master", via: "One-Handed:Weapon Mastery" });
    expect(out.get("Two-Handed:Great Weapon Mastery")?.by).toBe("Block:Weapons Master");
    // Everything in One-Handed that needs Weapon Mastery on every path is ruled out, via it.
    const needs = (id: string, seen = new Set<string>()): boolean => {
      if (id === "One-Handed:Weapon Mastery") return true;
      if (seen.has(id)) return false;
      seen.add(id);
      const p = d.perkById.get(id)!;
      const ways = p.requires.map((r) => needs(r, seen));
      return ways.length > 0 && (p.anyOf ? ways.every(Boolean) : ways.some(Boolean));
    };
    const oneHanded = d.perks.filter((p) => p.tree === "One-Handed");
    for (const p of oneHanded) expect(out.has(p.id), p.id).toBe(needs(p.id));
    expect(out.get("One-Handed:Penetrating Strikes")).toEqual({ by: "Block:Weapons Master", via: "One-Handed:Weapon Mastery" });
    expect(out.has("Block:Weapons Master")).toBe(false);
  });

  it("Set up's own problems don't stop a snapshot; only the filled levels' do", () => {
    expect(checkSnapshot({ ...ALTMER, birthsign: "" }, snap(30, ["Destruction:Impact"]), d).ok).toBe(true);
  });

  it("the version copy keeps the snapshot", () => {
    const s = snap(50, ["Destruction:Impact", "Destruction:Expert Destruction"], { Alteration: 60 });
    const { plan, dropped } = convertPlan(d, { ...ALTMER, snapshot: s });
    expect(dropped).toEqual([]);
    expect(plan.snapshot?.level).toBe(50);
    expect(plan.snapshot?.perks).toEqual(s.perks);
    expect(plan.snapshot?.skills).toEqual({ Alteration: 60 });
    expect(plan.snapshot?.result?.perks).toContain("Destruction:Adept Destruction");
  });
});
