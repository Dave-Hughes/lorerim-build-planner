import { describe, expect, it } from "vitest";
import { rules } from "./rules-view";
import { getQuest, playerState, searchFacts } from "./facts";
import { startsAt } from "./playthroughs";
import { questsData } from "@/lib/quests/data";

const quest = (edid: string) => questsData().lines.flatMap((l) => l.quests).find((x) => x.edid === edid)!;

/** WO-131 Part 0: Running Wild's note, where Dave found it in game, marked as a player's report. */
describe("Running Wild's note (WO-131 Part 0)", () => {
  it("get_quest says the board outside Joslin's house, that a player found it, and where the files put it", () => {
    const start = rules("Running Wild").quest.start;
    expect(start.ways).toEqual([
      {
        way: "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun",
        checked: "a player's report, not the game files (Dave, found in game, 22 Oct 2026)",
        whereIs: ["Whiterun, near Hearth-Healer's Hall and Joslin's House"],
      },
    ]);
    expect(start.then).toBe("Catch the white, or palonimo, horse roaming the fields of Whiterun");
  });

  it("the page's data marks the way as a player's, and keeps the record's form in raw", () => {
    const q = quest("0WRHorseQ");
    expect(q.start?.ways?.[0]).toMatchObject({ checked: "players", source: "Dave, found in game, 22 Oct 2026" });
    expect(q.start?.raw?.ways?.[0].how).toBe("Read The Palonimo Mare");
  });

  it("search still finds it by the note's name", () => {
    expect(searchFacts("Palonimo Mare").hits.find((h) => h.name === "Running Wild")?.why).toBe("what starts it: The Palonimo Mare");
  });
});

/** WO-131 Part 2: where each read-this item is, from the PC's readables file; or that it isn't checked, never a direction. */
describe("where the thing you read is (WO-131 Part 2)", () => {
  const readWays = () => questsData().lines.flatMap((l) => l.quests.flatMap((q) => (q.start?.ways ?? []).filter((w) => /^(Read|Get) /.test(w.how)).map((w) => ({ q, w }))));

  it("every read-this way has its places or says where to find it isn't checked", () => {
    const ways = readWays();
    // WO-138 R4 words four books with their prerequisite ("On Wyrmstooth, read ...", "After The Oblivion Engine has begun, read ..."), so they no longer start "Read".
    expect(ways.length).toBeGreaterThan(55);
    expect(ways.filter(({ w }) => !w.whereIs?.length && !w.unplaced)).toEqual([]);
  });

  it("places are in the game's words: a door by name, a chest by what it is, random loot without its list", () => {
    expect(quest("0WRAddTheKeyQ").start?.ways?.map((w) => w.whereIs)).toEqual([["In a chest somewhere in Whiterun"], ["Somewhere in Whiterun, near Dragonsreach Dungeon and Dragonsreach"]]);
    expect(quest("Trad_001_ProfaneDivinityQuest").start?.ways?.[0].whereIs).toEqual(["Carried by Erden Relvel, somewhere in Morrowind"]);
    const all = JSON.stringify(readWays().map(({ w }) => w.whereIs ?? []));
    expect(all).not.toMatch(/somewhere in Skyrim|near somewhere|[A-Za-z]+_[A-Za-z]|LItem|Editor Smoke Test/);
  });

  it("a way with no place says so, and the quest is never open for that way alone", () => {
    const falion = getQuest({ id: "OK_FH_Quest" }, undefined, playerState({ level: 50, done: [] }));
    expect(rules("OK_FH_Quest").quest.start.ways?.[0]).toMatchObject({ way: "Read A Letter From Falion", whereIsIt: "Where to find A Letter From Falion isn't checked yet. Don't tell the player where to look." });
    expect(falion.openForYou?.state).not.toBe("open");
  });

  it("a read-this quest starts where its item is, for suggest_quests' where", () => {
    const read = { start: { checked: "files" as const, ways: [{ how: "Read A Note", whereIs: ["Dragonsreach, Whiterun"] }] } };
    expect(startsAt({ where: "Riften", giver: undefined }, read)).toEqual(["Dragonsreach, Whiterun"]);
    const none = { start: { checked: "files" as const, ways: [{ how: "Read A Note", unplaced: "Where to find A Note isn't checked yet." }] } };
    expect(startsAt({ where: "Riften", giver: undefined }, none)).toEqual([]);
    const talk = { start: { checked: "files" as const, ways: [{ how: "Talk to Vex", where: "The Ragged Flagon" }] } };
    expect(startsAt({ where: "Riften", giver: undefined }, talk)).toContain("Riften");
  });
});
