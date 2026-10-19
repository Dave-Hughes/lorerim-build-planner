import { describe, expect, it } from "vitest";
import sample from "@/lib/rules/__fixtures__/sample-build.json";
import { mcpOn } from "@/lib/features";
import { answer, MAX_BYTES } from "./answer";
import { FactsError, checkProgression, getPerk, getQuestStart, getSpell, searchFacts, styleGuide, versionData } from "./facts";

describe("the facts tools (WO-108)", () => {
  it("refuses a version the planner doesn't ship, naming those it does", () => {
    expect(() => versionData("9.9.9")).toThrow(FactsError);
    expect(() => versionData("9.9.9")).toThrow(/It has: .*5\.0\.4\.8/);
  });

  it("search_facts finds Haggling and Holy Fire, 20 at most, saying how many were left out", () => {
    expect(searchFacts("Haggling").hits[0]).toMatchObject({ kind: "perk", id: "Speech:Haggling", name: "Haggling" });
    expect(searchFacts("holy fire", ["spell"]).hits[0]).toMatchObject({ kind: "spell", name: "Holy Fire" });
    const many = searchFacts("a");
    expect(many.hits).toHaveLength(20);
    expect(many.more).toBeGreaterThan(0);
    expect(searchFacts("Gravewind", ["quest line"]).hits[0]).toMatchObject({ kind: "quest line", id: "gravewind" });
  });

  it("get_perk gives Haggling's tree, rank, requirement and text", () => {
    const p = getPerk({ name: "Haggling" });
    expect(p).toMatchObject({ id: "Speech:Haggling", tree: "Speech", ranks: 1, needs: { perks: [] }, cost: "1 perk point a rank" });
    expect(p.rankDetails[0]).toMatchObject({ rank: 1, skill: "Speech 0" });
    expect(p.rankDetails[0].text).toContain("greedy merchants");
    expect(() => getPerk({ name: "No Such Perk" })).toThrow(FactsError);
  });

  it("get_perk lists what a perk needs and rules out", () => {
    const withNeeds = getPerk({ id: "One-Handed:Weapon Mastery" });
    expect(withNeeds.tree).toBe("One-Handed");
    const ruled = getPerk({ name: "Weapons Master" });
    expect(ruled.rulesOut.length).toBeGreaterThan(0);
  });

  it("get_spell gives Holy Fire's school, tier, cost and tomes, and says where it's sold isn't checked", () => {
    const s = getSpell({ name: "Holy Fire" });
    expect(s).toMatchObject({ name: "Holy Fire", school: "Destruction", tier: "Apprentice", cost: 120 });
    expect(s.tomes).toContain("Spell Tome (Apprentice): Holy Fire");
    expect(s.soldBy.checked).toBe("not yet");
  });

  it("get_quest_start gives Gravewind no instructions, marked not checked", () => {
    const g = getQuestStart("gravewind");
    expect(g).toMatchObject({ id: "gravewind", checked: "not yet" });
    expect(g).not.toHaveProperty("start");
    expect(g).not.toHaveProperty("firstQuest");
  });

  it("get_quest_start gives Become the Dragonborn its checked start, from the story or its line", () => {
    for (const id of ["become-the-dragonborn", "main-quest"]) {
      const s = getQuestStart(id);
      expect(s).toMatchObject({ kind: "story", id: "become-the-dragonborn", checked: "files" });
      if (s.kind !== "story") throw new Error("not a story");
      expect(s.start[0]).toMatchObject({ checked: "files" });
      expect(s.start.some((x) => x.checked === "not yet")).toBe(true);
      expect(s.firstQuest).toMatchObject({ name: "Unbound", task: "Make your way to the Keep" });
    }
  });

  it("check_progression returns the issue for an illegal perk, the last level, and what's takeable next", () => {
    const ok = checkProgression(sample);
    expect(ok.levels).toBe(6);
    expect(ok.last?.level).toBe(6);
    expect(ok.canTakeNext.length).toBeGreaterThan(0);
    const bad = structuredClone(sample) as typeof sample;
    bad.levels[0].perks.push("Destruction:Expert Destruction");
    const r = checkProgression(bad);
    expect(r.issues.some((i) => i.level === 1 && /Expert Destruction/.test(i.message))).toBe(true);
    expect(() => checkProgression({ nonsense: true })).toThrow(FactsError);
  });

  it("get_style_guide is the planner's writing rules", () => {
    expect(styleGuide()).toMatch(/^# How to write for LoreRim Build Planner/);
  });

  it("cuts an answer at 64 KB and says so", () => {
    const big = answer("x".repeat(MAX_BYTES * 2)).content[0].text;
    expect(new TextEncoder().encode(big).length).toBeLessThanOrEqual(MAX_BYTES);
    expect(big).toContain("Cut at 64 KB");
  });

  it("FEATURE_MCP is on in dev and staging unset, off on production", () => {
    expect(mcpOn({ NODE_ENV: "development" })).toBe(true);
    expect(mcpOn({ NODE_ENV: "production", VERCEL_ENV: "preview" })).toBe(true);
    expect(mcpOn({ NODE_ENV: "production", VERCEL_ENV: "production" })).toBe(false);
    expect(mcpOn({ NODE_ENV: "production", VERCEL_ENV: "production", FEATURE_MCP: "on" })).toBe(true);
  });
});
