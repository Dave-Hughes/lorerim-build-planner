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
