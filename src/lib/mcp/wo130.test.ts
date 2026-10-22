import { describe, expect, it } from "vitest";
import { getQuest, playerState } from "./facts";
import { suggestQuests } from "./playthroughs";

describe("a work-shelf line's order is no gate (WO-130)", () => {
  it("answers Caught Red Handed open at level 6 with no quests done, not after Stoking the Flames", () => {
    const q = getQuest({ name: "Caught Red Handed" }, undefined, playerState({ level: 6, done: [] }));
    expect(q.openForYou?.state).toBe("open");
    expect(q.openForYou?.says).not.toMatch(/Stoking the Flames/);
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
