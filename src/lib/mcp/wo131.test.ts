import { describe, expect, it } from "vitest";
import { getQuest, searchFacts } from "./facts";
import { questsData } from "@/lib/quests/data";

/** WO-131 Part 0: Running Wild's note, where Dave found it in game, marked as a player's report. */
describe("Running Wild's note (WO-131 Part 0)", () => {
  it("get_quest says the board outside Joslin's house, and that a player found it", () => {
    const start = getQuest({ name: "Running Wild" }).quest.start;
    expect(start.ways).toEqual([
      {
        way: "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun",
        checked: "a player's report, not the game files (Dave, found in game, 22 Oct 2026)",
      },
    ]);
    expect(start.then).toBe("Catch the white, or palonimo, horse roaming the fields of Whiterun");
  });

  it("the page's data marks the way as a player's, and keeps the record's form in raw", () => {
    const q = questsData().lines.flatMap((l) => l.quests).find((x) => x.edid === "0WRHorseQ")!;
    expect(q.start?.ways?.[0]).toMatchObject({ checked: "players", source: "Dave, found in game, 22 Oct 2026" });
    expect(q.start?.raw?.ways?.[0].how).toBe("Read The Palonimo Mare");
  });

  it("search still finds it by the note's name", () => {
    expect(searchFacts("Palonimo Mare").hits.find((h) => h.name === "Running Wild")?.why).toBe("what starts it: The Palonimo Mare");
  });
});
