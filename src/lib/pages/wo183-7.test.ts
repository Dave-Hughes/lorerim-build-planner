import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { placesData } from "@/lib/places/data";
import { questsData } from "@/lib/quests/data";

/**
 * WO-183 Part 7 (PC): Dave's "Blue in the Face" and its Gromm's Pass were missing because a Creation Club plugin keeps its string tables in its own archive, which the quest and
 * place scans did not read: its quests had no name and its location no name. Both are on the planner now, with the rest of that plugin's kind; the coverage check is in the report.
 */
const quests = () => questsData().lines.flatMap((l) => l.quests);

describe("what the Creation Club plugins' own archives hold (WO-183 Part 7)", () => {
  it("Blue in the Face is a quest, on its own line, and sends you to Gromm's Pass", () => {
    const q = quests().find((x) => x.edid === "ccBGSSSE040_Quest");
    expect(q?.name).toBe("Blue in the Face");
    expect(q?.objectives).toContain("Head to Gromm's Pass");
    expect(questsData().lines.find((l) => l.quests.some((x) => x.edid === "ccBGSSSE040_Quest"))?.name).toBe("Blue in the Face");
  });
  it("Gromm's Pass is a place in the Rift, with its quest and its people there", () => {
    const p = placesData().places.find((x) => x.name === "Gromm's Pass");
    expect(p?.hold).toBe("The Rift");
    expect(p?.quests).toContain("Blue in the Face");
    expect(p?.pos).toBeTruthy();
  });
  it("the rest of that kind came with it: 44 quests from 19 Creation Club plugins, Saints and Seducers' own among them", () => {
    const cc = quests().filter((q) => /^cc[A-Za-z]{3,6}SSE\d/i.test(q.edid) || /^DLCDwarvenPuzzle/.test(q.edid));
    expect(cc.length).toBeGreaterThanOrEqual(44);
    expect(quests().some((q) => q.name === "Balance of Power" && /ccBGSSSE025/i.test(q.edid))).toBe(true);
    expect(quests().some((q) => q.name === "Ghosts of the Tribunal")).toBe(true);
  });
  it("the Fishing jobs' totals are the game's to set, not a nought (Stocking Up)", () => {
    const text = JSON.stringify(quests().filter((q) => /^ccBGSSSE001_Radiant/.test(q.edid)));
    expect(text).not.toMatch(/Obtain 0 |Fish up 0 /);
  });
  it("Battle of the Champions names no one giver: the Stormcloak captain and the Imperial legate each start it", () => {
    const q = quests().find((x) => x.edid === "ccFFBSSE001_Quest")!;
    expect(q.start?.who).toBeUndefined();
    expect(q.start?.ways?.length).toBe(2);
  });
});

describe("the coverage check is in the report (WO-183 Part 7)", () => {
  const report = readFileSync("gamedata/5.0.4.8/quests_report.md", "utf8");
  it("has the section, the whole-load-order line, and every quest it leaves out says why", () => {
    expect(report).toContain("## Coverage across the load order (WO-183 Part 7)");
    expect(report).toMatch(/Whole load order \(\d+ plugins\)/);
    const left = report.split("\n").filter((l) => l.startsWith("- quests missing"));
    expect(left.length).toBeGreaterThan(0);
    for (const l of left) expect(l, l).toMatch(/removed from the game|lead-in or machinery/);
  });
});
