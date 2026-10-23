import { afterEach, describe, expect, it } from "vitest";
import { getQuest } from "@/lib/mcp/facts";
import { questsData } from "./data";
import { cleanFields } from "./reports";
import { currentPlayerFacts, setPlayerFacts, type PlayerFact } from "./player-facts-store";
import { overlayStart } from "./player-overlay";
import { SYSTEM, parseProposal, promptFor, proposeOne, type Complete } from "./propose";

/** WO-146: what a player tells the planner, what the agent proposes (a stub model), and a fact laid over a quest once approved. */

const RUNNING_WILD: PlayerFact = {
  id: 1,
  lineId: "capital-whiterun",
  quest: "0WRHorseQ",
  replaces: "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun",
  way: { how: "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun", whereIs: ["Whiterun, near Hearth-Healer's Hall and Joslin's House"] },
  source: "@testplayer, 23 Oct 2026",
};

afterEach(() => setPlayerFacts([]));

describe("what a player sends", () => {
  it("keeps each field a single trimmed line and drops the empty ones", () => {
    expect(cleanFields({ who: "  Joslin \n the  stablehand ", where: "", how: "Read the note", place: undefined })).toEqual({ who: "Joslin the stablehand", how: "Read the note" });
    expect(cleanFields({ place: "x".repeat(300) }).place).toHaveLength(200);
    expect(cleanFields(undefined)).toEqual({});
  });
});

describe("the agent proposes", () => {
  const report = { kind: "where" as const, what: "Who and where", text: "", said: "", fields: { place: "A board right outside Joslin's house, behind the Bannered Mare in Whiterun" }, lineId: "capital-whiterun", quest: "0WRHorseQ" };
  const reply = JSON.stringify({
    words: "Way in: read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun",
    replaces: "Read The Palonimo Mare",
    way: { how: "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun", whereIs: ["Whiterun, near Joslin's House"] },
    fits: "adds a place",
    why: "The records have the note as The Palonimo Mare with no place; the report names the board.",
    confidence: "high",
  });

  it("is told to use only the report and the records, and is given both", () => {
    expect(SYSTEM).toMatch(/Never add a place, a person or a step from memory/);
    const { byId } = questsData();
    const line = byId.get("capital-whiterun")!;
    const prompt = JSON.parse(promptFor(report, line, line.quests.find((q) => q.edid === "0WRHorseQ")));
    expect(prompt.report.fields.place).toMatch(/Joslin's house/);
    expect(prompt.records.quest).toEqual({ edid: "0WRHorseQ", name: "Running Wild" });
    expect(prompt.records.start.ways.length).toBeGreaterThan(0);
  });

  it("one call through a stub, logged, answers a proposal and writes nothing", async () => {
    const calls: string[] = [];
    const stub: Complete = async (system, user) => {
      calls.push(user);
      return { text: `Here is the proposal:\n${reply}`, model: "stub-model", usage: { input_tokens: 10, output_tokens: 5 } };
    };
    const p = await proposeOne(report, stub, 7);
    expect(calls).toHaveLength(1);
    expect(p).toMatchObject({ fits: "adds a place", confidence: "high", model: "stub-model", replaces: "Read The Palonimo Mare" });
    expect(p.way?.whereIs).toEqual(["Whiterun, near Joslin's House"]);
    // Nothing reached the quest data.
    expect(currentPlayerFacts().list).toEqual([]);
  });

  it("refuses an answer that isn't JSON or isn't the shape asked", () => {
    expect(() => parseProposal("I think so.", "m")).toThrow(/JSON/);
    expect(() => parseProposal(JSON.stringify({ words: "x", fits: "maybe", why: "y", confidence: "high" }), "m")).toThrow(/shape/);
    // A report that can't become a way comes back with no way.
    expect(parseProposal(JSON.stringify({ words: "Not a way in", way: null, fits: "agrees", why: "It says what the page says.", confidence: "low" }), "m").way).toBeNull();
  });
});

describe("an approved fact laid over a quest", () => {
  it("replaces the unplaced way: the place and the source show, as a player's report", () => {
    setPlayerFacts([RUNNING_WILD]);
    const q = getQuest({ name: "Running Wild" }).quest.start.ways?.[0] as { way: string; checked?: string; whereIs?: string[] };
    expect(q.checked).toBe("a player's report, not the game files (@testplayer, 23 Oct 2026)");
    expect(q.whereIs).toEqual(["Whiterun, near Hearth-Healer's Hall and Joslin's House"]);
  });

  it("with no facts the data is the generated data, the same object", () => {
    const a = questsData();
    setPlayerFacts([]);
    expect(questsData()).toBe(a);
  });

  it("a replaced way takes its place in the needs, an added way joins them with 'or'", () => {
    const start = { checked: "files" as const, needs: ["One of: Ask A in X; or Read B"], ways: [{ how: "Ask A in X" }, { how: "Read B", unplaced: "Where to find B isn't checked yet." }] };
    const replaced = overlayStart(start, { id: 1, lineId: "l", quest: "q", replaces: "Read B", way: { how: "Read the note on the board", whereIs: ["Whiterun"] }, source: "@p, 1 Oct 2026" });
    expect(replaced.needs).toEqual(["One of: Ask A in X; or Read the note on the board"]);
    expect(replaced.ways?.[1]).toEqual({ how: "Read the note on the board", checked: "players", source: "@p, 1 Oct 2026", whereIs: ["Whiterun"] });
    const added = overlayStart(start, { id: 2, lineId: "l", quest: "q", replaces: null, way: { how: "Ask C in Y", who: "C", where: "Y" }, source: "@p, 1 Oct 2026" });
    expect(added.needs).toEqual(["One of: Ask A in X; or Read B; or Ask C in Y"]);
    expect(added.ways).toHaveLength(3);
    const single = overlayStart({ checked: "files", needs: ["Ask A in X"], ways: [{ how: "Ask A in X" }] }, { id: 3, lineId: "l", quest: "q", replaces: null, way: { how: "Ask C in Y" }, source: "s" });
    expect(single.needs).toEqual(["One of: Ask A in X; or Ask C in Y"]);
  });

  it("a quest whose start isn't checked shows only the player's way, said as that, with the note", () => {
    const { lines } = questsData();
    const line = lines.find((l) => l.quests.some((x) => x.edid === "aaFaraldaQ2"))!;
    expect(getQuest({ id: "aaFaraldaQ2" }).quest.start.ways).toBeUndefined();
    setPlayerFacts([{ id: 9, lineId: line.id, quest: "aaFaraldaQ2", replaces: null, way: { how: "Ask Faralda in the Arcanaeum", who: "Faralda", where: "The Arcanaeum" }, source: "@testplayer, 23 Oct 2026" }]);
    const a = getQuest({ id: "aaFaraldaQ2" }) as unknown as { checked: string; note: string; quest: { start: { ways: unknown[] } } };
    expect(a.checked).toBe("not yet");
    expect(a.note).toMatch(/A player's report is below: say it is that, not the game files/);
    expect(a.quest.start.ways).toEqual([{ way: "Ask Faralda in the Arcanaeum", who: "Faralda", where: "The Arcanaeum", checked: "a player's report, not the game files (@testplayer, 23 Oct 2026)" }]);
  });
});
