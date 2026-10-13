import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import { requireGameData } from "./data";
import { computeBuild } from "./engine";
import { enchantTarget, readEnchantLine, searchEnchantments } from "./enchantments";
import type { BuildPlan } from "./types";

const d = requireGameData("5.0.4.8");
const named = (name: string) => d.enchantments.find((e) => e.name === name)!;
const names = (target: ReturnType<typeof enchantTarget>) => searchEnchantments(d, target, "", 200).map((e) => e.name);

describe("enchantments that fit the item (WO-54)", () => {
  it("a ring lists Fortify Magicka (Rank I) but not Fire", () => {
    const ring = names(enchantTarget("Ring", { kind: "armor", slot: "Ring" }));
    expect(ring).toContain("Fortify Magicka (Rank I)");
    expect(ring).not.toContain("Fire");
  });
  it("a sword lists Fire but no armour enchantment", () => {
    const sword = names(enchantTarget("Main hand", { kind: "weapon" }));
    expect(sword).toContain("Fire");
    expect(sword).not.toContain("Fortify Magicka (Rank I)");
  });
  it("search narrows by every word", () => {
    expect(searchEnchantments(d, enchantTarget("Ring"), "magicka rank").map((e) => e.name)).toEqual(["Fortify Magicka (Rank I)", "Fortify Magicka (Rank II)"]);
  });
});

describe("reading a saved line", () => {
  it("a picked id reads as the game's name, with its text", () => {
    const e = named("Fortify Magicka (Rank I)");
    expect(readEnchantLine(d, e.id)).toEqual({ name: "Fortify Magicka (Rank I)", enchantment: e });
  });
  it("the author's own words still read as text", () => {
    expect(readEnchantLine(d, "Fortify Destruction 20%")).toEqual({ name: "Fortify Destruction 20%" });
  });
});

describe("an enchantment only a power teaches", () => {
  function plan(line: string, perks: string[] = []): BuildPlan {
    const base = sample as unknown as BuildPlan;
    const levels = [...base.levels, ...Array.from({ length: 30 - base.levels.length }, () => ({ skillPoints: {}, perks: [] as string[], destiny: [] as string[], extras: [], note: "" }))];
    levels[29] = { ...levels[29], perks };
    return { ...base, levels, gear: [{ slot: "Main hand", name: "Steel Sword", fromLevel: 30, note: "", made: { base: "Steel Sword", enchantments: [line] } }] };
  }
  const problems = (p: BuildPlan) => computeBuild(p)[29].issues.filter((i) => i.code === "enchant-power").map((i) => i.message);

  it("Fireburst at 30 without Arcane Experimentation is a problem", () => {
    expect(problems(plan(named("Fireburst").id))).toEqual(["Fireburst comes from the Arcane Experimentation power; the perk isn't taken by level 30."]);
    expect(problems(plan(named("Fireburst").id, ["Enchanting:Arcane Experimentation"]))).toEqual([]);
  });
  it("Elemental Fury can also be disenchanted, so it isn't", () => {
    expect(problems(plan(named("Elemental Fury").id))).toEqual([]);
  });
});
