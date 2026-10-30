import { describe, expect, it } from "vitest";
import { questsData } from "@/lib/quests/data";

/**
 * WO-183 Part 3 (PC): what a quest page is told is true or the page says it isn't sure. A gate nobody read is not "Any level"; a contract pays its leveled gold; an item you
 * need is not a reward; a quest no record starts says so; a way to finish never ends in failing.
 */
const lines = () => questsData().lines;
const quest = (name: string) => lines().flatMap((l) => l.quests).find((q) => q.name === name)!;

describe("a gate is known or the page says it isn't (WO-183 Part 3)", () => {
  it("a line with a gate or a minimum level has it checked: no default posing as a fact", () => {
    const bad = lines().filter((l) => (l.gate || l.minLevel) && !l.checked?.gate);
    expect(bad.map((l) => l.name)).toEqual([]);
  });
  it("a level a start condition names is the line's minimum level", () => {
    const by = (n: string) => lines().find((l) => l.name === n)!;
    expect(by("Belethor's Sister").minLevel).toBe(20);
    expect(by("The Cause").minLevel).toBe(46);
    expect(by("Unfathomable Depths").minLevel).toBe(14);
  });
  it("a start the planner can't put in words leaves its gate unchecked", () => {
    const unknown = lines().filter((l) => !l.checked?.gate);
    expect(unknown.length).toBeGreaterThan(0);
    expect(unknown.some((l) => l.gate || l.minLevel)).toBe(false);
  });
});

describe("story-manager starts, choices and Thieves Guild jobs say what the records say (WO-183 Part 6)", () => {
  it("the Guild's four city jobs start by Delvin Mallory's word after five jobs in the city, not by 'another quest'", () => {
    for (const [name, city] of [["Imitation Amnesty", "Whiterun"], ["Silver Lining", "Markarth"], ["The Dainty Sload", "Solitude"], ["Summerset Shadows", "Windhelm"]]) {
      const s = quest(name).start!;
      expect(s.needs, name).toEqual([`Talk to Delvin Mallory once you have done five Thieves Guild jobs in ${city}`]);
      expect(s.who).toBe("Delvin Mallory");
      expect(JSON.stringify(s.ways), name).not.toMatch(/Another quest starts it/);
    }
  });
  it("The Words of Power: Arngeir, after the previous quest, with no condition left unsaid", () => {
    const s = quest("The Words of Power").start!;
    expect(s.who).toBe("Arngeir");
    expect((s.needs ?? []).join(" ")).toMatch(/After "Speak to Arngeir for further training" in The Way of the Voice/);
    expect(JSON.stringify(s)).not.toMatch(/can't put in words/);
  });
  it("a Black Book's reward is one of three named abilities, in the game's words", () => {
    const of = (n: string) => (quest(n).rewards?.choice?.of ?? []).map((c) => c.name);
    expect(of("Black Book: The Winds of Change")).toEqual(["Scholar's Insight", "Companion's Insight", "Lover's Insight"]);
    expect(of("Black Book: Untold Legends")).toEqual(["Black Market", "Secret Servant", "Bardic Knowledge"]);
    expect(of("Black Book: The Hidden Twilight")).toEqual(["Mora's Agony", "Mora's Grasp", "Mora's Boon"]);
    expect(quest("Black Book: The Winds of Change").rewards?.choice?.pick).toBe(1);
    expect((quest("Black Book: The Winds of Change").read?.rewards ?? []).map((r) => r.what)).toEqual(["Your pick of three abilities: Scholar's Insight, Companion's Insight or Lover's Insight"]);
    for (const c of lines().flatMap((l) => l.quests).flatMap((q) => q.rewards?.choice?.of ?? [])) expect(c.says, c.name).toMatch(/\S/);
  });
});

describe("rewards, starts and ways are what the records say (WO-183 Part 3)", () => {
  it("a contract pays its leveled gold", () => {
    expect((quest("Contract: Kill Nazeem").read?.rewards ?? []).map((r) => r.what)).toContain("Gold, by your level");
  });
  it("an item you need is no reward: the Amulet of Mara in The Bonds of Matrimony", () => {
    expect(JSON.stringify(quest("The Bonds of Matrimony").rewards ?? {})).not.toContain("Amulet of Mara");
    expect((quest("The Bonds of Matrimony").read?.rewards ?? []).map((r) => r.what)).not.toContain("Amulet of Mara");
  });
  it("a quest no record starts says so: Boethiah's Bidding", () => {
    expect(quest("Boethiah's Bidding").noStart).toBe(true);
    expect(quest("Dragon Rising").noStart).toBeUndefined();
  });
  it("no way to finish a quest is a way to fail it", () => {
    const bad = lines().flatMap((l) => l.quests.flatMap((q) => (q.read?.ways?.ways ?? []).filter((w) => /\bfail/i.test(`${w.ends ?? ""} ${w.title}`)).map((w) => `${q.name}: ${w.title}`)));
    expect(bad).toEqual([]);
    expect(quest("Back-Stabbing Rodents").read?.ways).toBeUndefined();
  });
});
