import { describe, expect, it } from "vitest";
import sample from "@/lib/rules/__fixtures__/sample-build.json";
import { mcpOn } from "@/lib/features";
import { questsData } from "@/lib/quests/data";
import { answer, MAX_BYTES } from "./answer";
import { FactsError, checkProgression, getPerk, getQuest, getQuestStart, getSpell, playerState, searchFacts, styleGuide, versionData } from "./facts";
import { plainOf } from "./plan";
import type { BuildPlan } from "@/lib/rules/types";

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

  // Gravewind's quests are all checked now, so it answers (WO-137 item 3); On Hogithum's opening quest isn't.
  it("get_quest_start gives On Hogithum no instructions, marked not checked", () => {
    const g = getQuestStart("on-hogithum");
    expect(g).toMatchObject({ id: "on-hogithum", checked: "not yet" });
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
      expect(s.firstQuest).toMatchObject({ name: "Unbound", then: "Make your way to the Keep" });
      // Unbound has two ways in and no single giver, so no who (WO-121b).
      expect(s.firstQuest).not.toHaveProperty("who");
    }
  });

  it("check_progression, on the plain shape get_build gives, returns the issue for an illegal perk, the last level, and what's takeable next", () => {
    const d = versionData();
    const plain = plainOf(d, sample as unknown as BuildPlan);
    const ok = checkProgression(plain);
    expect(ok.levels).toBe(6);
    expect(ok.last?.level).toBe(6);
    expect(ok.canTakeNext.length).toBeGreaterThan(0);
    const bad = structuredClone(plain);
    bad.levels[0].perks.push("Destruction:Expert Destruction");
    const r = checkProgression(bad);
    expect(r.issues.some((i) => i.level === 1 && /Expert Destruction/.test(i.message))).toBe(true);
    expect(() => checkProgression({ race: "Nord", majors: ["Nonsense"], minors: [], levels: [{}] })).toThrow(/No skill called Nonsense\. Skills are:/);
  });

  it("get_style_guide is the planner's writing rules", () => {
    expect(styleGuide()).toMatch(/^# How to write for LoreRim Build Planner/);
    expect(styleGuide()).toContain("Never say how a quest ends unless the planner lists that ending.");
    // WO-115 Part 4: open only when the planner says so.
    expect(styleGuide()).toContain("Never call a quest available, open or possible unless the planner answers open for you. Unknown means say unknown.");
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

describe("get_quest (WO-115)", () => {
  it("gives Blood on the Ice's two endings, by name or EDID, with its objectives", () => {
    for (const q of [getQuest({ name: "Blood on the Ice" }), getQuest({ id: "MS11" }), getQuest({ id: "blood-on-the-ice" })]) {
      expect(q.quest).toMatchObject({ edid: "MS11", name: "Blood on the Ice" });
      expect(q.quest.endings.map((e) => [e.stage, e.ends])).toEqual([
        [100, "completes"],
        [250, "completes"],
      ]);
      expect(q.quest.endings[0].text).toContain("Wuunferth the Unliving was the Butcher of Windhelm");
      expect(q.quest.endings[1].text).toContain("Calixto Corrium was the Butcher of Windhelm");
      expect(q.quest.objectives.length).toBeGreaterThan(0);
      expect(q.quest).not.toHaveProperty("note");
    }
  });

  it("gives Innocence Lost's endings with the Dark Brotherhood's start", () => {
    const q = getQuest({ id: "DB01" });
    expect(q).toMatchObject({ kind: "story", line: { id: "dark-brotherhood" } });
    expect(q.quest).toMatchObject({ edid: "DB01", name: "Innocence Lost" });
    // Read from its records (WO-154): its steps and what it gives, not stage numbers or journal endings.
    expect(JSON.stringify(q.quest)).toContain("Talk to Aventus Aretino");
    expect(q.quest.source).toBe("reads");
    expect(q.quest).not.toHaveProperty("endings");
  });

  it("says so when a quest's records list no ending", () => {
    const q = getQuest({ name: "Caught Red Handed" });
    expect(q.quest).toMatchObject({ edid: "FreeformRiften11", endings: [] });
    expect(q.quest.note).toMatch(/no ending/);
  });

  it("a line answers for its opening quest; get_quest_start is the same answer", () => {
    expect(getQuest({ id: "gravewind" }).quest.edid).toBe(questsData().byId.get("gravewind")!.opening);
    expect(getQuestStart("become-the-dragonborn")).toEqual(getQuest({ id: "become-the-dragonborn" }));
    expect(getQuest({ name: "Become the Dragonborn" }).quest.name).toBe("Unbound");
    expect(() => getQuest({ name: "No Such Quest" })).toThrow(FactsError);
    expect(() => getQuest({})).toThrow(FactsError);
  });
});

describe("get_quest, open for you (WO-115 Part 3)", () => {
  it("gives a quest's ways in, its first objective as then, and who and where when one person starts it", () => {
    const love = getQuest({ name: "The Book of Love" });
    expect(love.quest.start).toMatchObject({ checked: "files", then: "Talk to Fastred at Fellstar Farm" });
    expect(love.quest.start.ways?.[0].way).toMatch(/^Ask Dinya Balu "Just tell me what to do." in Temple of Mara/);
    expect(love.quest.start).toMatchObject({ who: "Dinya Balu", where: "Temple of Mara" });
    expect(love.quest.start.ways?.[0]).toMatchObject({ who: "Dinya Balu", where: "Temple of Mara" });
    const unbound = getQuest({ id: "MQ101" });
    expect(unbound.quest.starts?.length).toBeGreaterThan(0);
    for (const w of unbound.quest.starts ?? []) expect(w.how).toEqual(expect.any(String));
  });
  it("answers open, locked or unknown only when told where the player is", () => {
    expect(getQuest({ id: "MS11" })).not.toHaveProperty("openForYou");
    const companions = getQuest({ name: "Take Up Arms" }, undefined, playerState({ level: 6 }));
    expect(companions.openForYou).toMatchObject({ state: "open", says: "open for you" });
    // A line's order is no gate (WO-142 item 1): mid-line, a quest is judged on its own checked needs. Bloodline needs
    // Awakening, so it waits on that and says so; with Awakening done it is open.
    const later = getQuest({ name: "Bloodline" }, undefined, playerState({ level: 30 }));
    expect(later.openForYou?.state).toBe("unknown");
    expect(later.openForYou?.says).toMatch(/^unknown: needs After Awakening/);
    expect(getQuest({ name: "Bloodline" }, undefined, playerState({ level: 30, done: ["Awakening"] })).openForYou?.state).toBe("open");
    // Proving Honor can also be asked of Farkas, Aela or Vilkas, which needs nothing before it.
    expect(getQuest({ name: "Proving Honor" }, undefined, playerState({ level: 6 })).openForYou?.state).toBe("open");
  });
  it("finished lines count every quest in them", () => {
    const p = playerState({ level: 10, done: ["companions"] });
    expect(p.done.has("C00")).toBe(true);
  });
});
