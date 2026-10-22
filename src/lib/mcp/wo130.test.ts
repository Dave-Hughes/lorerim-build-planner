import { describe, expect, it } from "vitest";
import { getQuest, playerState } from "./facts";
import { suggestQuests } from "./playthroughs";
import { questsData } from "@/lib/quests/data";

describe("a work-shelf line's order is no gate (WO-130)", () => {
  it("never gates Caught Red Handed on Stoking the Flames, and never says a bare open while its ways wait on an unnamed condition", () => {
    const q = getQuest({ name: "Caught Red Handed" }, undefined, playerState({ level: 6, done: [] }));
    expect(q.openForYou?.says).not.toMatch(/Stoking the Flames/);
    // WO-130 follow-up: both ways in carry a condition the start check hasn't named (fn629, fn230, fn70).
    expect(q.openForYou?.state).toBe("unknown");
    expect(q.openForYou?.says).toMatch(/one condition on every way in isn't named yet/);
  });
});

describe("no declining line anywhere in get_quest (WO-130 follow-up)", () => {
  const declines = /Take care now! Bye!|Nothing wrong with that|no part of|can't help you right now|No, not really|Forced Good ?bye|not interested|\(Skip Quest\)|No, thanks/i;
  it("in the start, its words or raw, for every quest", () => {
    // Only the start: a journal line can say "I want no part of it" (T01's failing ending), and that's the game's text.
    const edids = questsData().lines.flatMap((l) => l.quests.map((q) => q.edid));
    const found = edids.filter((id) => declines.test(JSON.stringify(getQuest({ id }).quest.start)));
    expect(found).toEqual([]);
  });
});

describe("suggest_quests keeps to where (WO-130)", () => {
  const stories = async (where: string) => (await suggestQuests("https://planner.test", { level: 30, where }, null)).suggestions.map((s) => s.story);
  it("leaves Join the Dark Brotherhood out of Riften: it starts with Aventus in Windhelm", async () => {
    const riften = await stories("Riften");
    expect(riften).not.toContain("join-the-dark-brotherhood");
    expect(riften).toContain("join-the-thieves-guild");
  });
  it("gives it for Windhelm", async () => {
    expect(await stories("Windhelm")).toContain("join-the-dark-brotherhood");
  });
});
