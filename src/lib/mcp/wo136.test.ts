import { describe, expect, it } from "vitest";
import { getQuest, getQuestStart, playerState, searchFacts } from "./facts";
import { suggestQuests } from "./playthroughs";
import { questsData } from "@/lib/quests/data";

/** WO-136: Missives as one class (ruling 3), a key row counts as checked (ruling 2), no "(0/0)" counter (ruling 6). */
const SAYS = "Missives: take a missive from the notice board in any hold's capital or a courier's request; each is a short delivery.";
const all = () => questsData().lines.flatMap((l) => l.quests);

describe("jobs from a board (WO-136 ruling 3)", () => {
  it("the Missives line carries the class's one sentence, covering the jobs the check hasn't traced", () => {
    const line = questsData().byId.get("missives")!;
    expect(line.board).toEqual({ name: "Jobs from a board", says: SAYS, boards: null, jobs: 364 });
    const untraced = line.quests.filter((q) => q.start?.board);
    expect(untraced).toHaveLength(364);
    expect(untraced.every((q) => q.start?.checked === "files" && q.start.ways?.[0].how === SAYS)).toBe(true);
  });

  it("get_quest on a missive says the sentence once, that the boards aren't placed yet, and it can be judged", () => {
    const a = getQuest({ id: "missives" }, undefined, playerState({ level: 5, done: [] }));
    expect(a.jobFromABoard).toEqual({ says: SAYS, boards: "Where the boards are isn't checked yet. Don't name one." });
    expect(a.quest.start.ways).toEqual([{ way: SAYS }]);
    expect(a.openForYou?.state).toBe("open");
  });
});

describe("a key row counts as checked (WO-136 ruling 2)", () => {
  it("Yngol's Barrow and the other four are checked from the wiki, and say so", () => {
    const yngol = getQuest({ name: "Yngol's Barrow" }).quest.start;
    expect(yngol.checked).toBe("from UESP, confirmed in the planner's answer key (https://en.uesp.net/wiki/Skyrim:Yngol%27s_Barrow)");
    expect(yngol.ways).toEqual([{ way: "No one gives it" }]);
    expect(getQuest({ name: "Sleepwalking Into A Nightmare" }).quest.start.checked).toMatch(/^from Nexus, confirmed/);
    for (const edid of ["DLC2BlackBook03Quest", "DLC2KagrumezQST", "dunVolunruudQST"]) expect(all().find((q) => q.edid === edid)?.start?.checked).toBe("uesp");
  });
});

describe("a counter the game sets at run time (WO-136 ruling 6)", () => {
  it("never shows (0/0); one the records set keeps its count", () => {
    expect(JSON.stringify(questsData().lines)).not.toContain("(0/0)");
    expect(all().find((q) => q.edid === "CR03")?.objectives[0]).toBe("Collect the sample pelts");
    expect(JSON.stringify(all().find((q) => q.name === "Spread the Love")?.objectives)).toContain("(0/20)");
  });
});

/** WO-136, Bob 22 Oct: the record form never goes through the door; every fact in it is in the ways and needs, in the game's words. */
describe("no raw start text through the door (WO-136)", () => {
  const RECORD = /"raw"|GetInFaction|GetIsRace|== 1|Init quest/;
  it("get_quest and get_quest_start, for every quest, line and story, with and without a player", () => {
    const ids = [...questsData().lines.map((l) => l.id), ...all().map((q) => q.edid)];
    const leaks = ids.flatMap((id) => {
      const out = [JSON.stringify(getQuest({ id })), JSON.stringify(getQuestStart(id)), JSON.stringify(getQuest({ id }, undefined, playerState({ level: 20, done: [] })))].join("\n");
      return RECORD.test(out) ? [`${id}: ${out.match(RECORD)![0]}`] : [];
    });
    expect(leaks).toEqual([]);
  });
  it("search_facts and suggest_quests", async () => {
    for (const q of ["Orc", "Init", "Deathbrand", "The Cursed Tribe", "Palonimo"]) expect(JSON.stringify(searchFacts(q))).not.toMatch(RECORD);
    for (const where of [undefined, "Riften", "Whiterun", "Windhelm"]) expect(JSON.stringify(await suggestQuests("https://planner.test", { level: 30, where }, null))).not.toMatch(RECORD);
  });
  it("the data keeps it, for the open-or-locked judge", () => {
    expect(all().find((q) => q.edid === "DA06")?.start?.raw?.needs.join(" ")).toMatch(/GetIsRace Orc == 1/);
  });
});
