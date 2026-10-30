import { describe, expect, it } from "vitest";
import { getQuest } from "@/lib/mcp/facts";
import { dangerOf, doorPage, pageOf, shortPage } from "./reads";
import { placeByName } from "@/lib/places/data";
import type { Quest, QuestRead } from "./types";

/** WO-154: a quest page and the door say the same thing, from the quest's read or, where it has none, the older rules. */

const quest = (over: Partial<Quest> = {}): Quest => ({ edid: "X1", name: "X", type: "Miscellaneous", xp: 100, journal: [], stages: [], endings: [], objectives: [], source: "rules", ...over });
const read: QuestRead = {
  canDo: "talk",
  canDoWhy: "Mercer Frey gives it in the Cistern",
  needs: [{ what: "Finish Scoundrel's Folly", kind: "quest" }, { what: "Level 10", kind: "level" }],
  starts: [{ who: "Mercer Frey", where: "the Cistern, under the Ragged Flagon in Riften", how: "Talk to Mercer once Scoundrel's Folly is done." }],
  firstStep: "Meet Mercer Frey outside Snow Veil Sanctum",
  takesYou: [{ place: "Largashbur", hold: "The Rift", why: "ask Chief Yamarz" }, { place: "A Place Nobody Mapped", why: "somewhere" }],
  choices: [{ choice: "Help Jaree-Ra", leadsTo: "the Icerunner's loot" }],
  steps: [{ branch: "main", objectives: ["Meet Mercer"] }, { branch: "Turn him in", objectives: ["Report to the guard captain"] }],
  rewards: [{ what: "Karliah's Invisibility (spell)", when: "at the end" }],
  opens: ["Scoundrel's Folly"],
  closes: ["the Thieves Guild"],
  unsure: [{ field: "where", why: "the records place him in the cistern; his schedule isn't in these files" }],
  fixed: ["firstStep"],
};

describe("a quest with a read", () => {
  const p = pageOf(quest({ read, source: "reads" }));
  it("says the read's words in the page's order, never reworded", () => {
    expect(p.source).toBe("reads");
    expect(p.canDo).toEqual({ label: "Talk to someone to start it" });
    expect(p.needs.map((n) => n.text)).toEqual(["Finish Scoundrel's Folly", "Level 10"]);
    expect(p.starts).toEqual([{ how: "Talk to Mercer once Scoundrel's Folly is done.", who: "Mercer Frey", where: "the Cistern, under the Ragged Flagon in Riften" }]);
    expect(p.firstStep).toBe("Meet Mercer Frey outside Snow Veil Sanctum");
    expect(p.choices).toEqual([{ choice: "Help Jaree-Ra", leadsTo: "the Icerunner's loot" }]);
    expect(p.gets).toEqual({ xp: 100, type: "Miscellaneous", rewards: [{ what: "Karliah's Invisibility (spell)", when: "at the end" }] });
    expect(p.opens.map((o) => o.text)).toEqual(["Scoundrel's Folly"]);
    expect(p.closes).toEqual(["the Thieves Guild"]);
  });
  it("groups steps by branch, the main one without a heading", () => {
    expect(p.steps).toEqual([{ objectives: ["Meet Mercer"] }, { branch: "Turn him in", objectives: ["Report to the guard captain"] }]);
  });
  it("gives a place its danger from the places index, and none for a place it doesn't know", () => {
    expect(p.takesYou[0]).toMatchObject({ place: "Largashbur", hold: "The Rift", why: "ask Chief Yamarz" });
    expect(p.takesYou[1]).toEqual({ place: "A Place Nobody Mapped", why: "somewhere" });
    expect(p.takesYou[1]).not.toHaveProperty("danger");
  });
  it("says how sure we are, with what the reader couldn't settle", () => {
    expect(p.sure).toBe("Read from the game files and checked by a second reader. Unsure: where");
    expect(p.unsure).toEqual([{ field: "where", why: "the records place him in the cistern; his schedule isn't in these files" }]);
  });
  it("a way a player found in game replaces the read's for that person, and the line says so", () => {
    const q = quest({ read, source: "reads", start: { checked: "files", ways: [{ how: "Talk to Mercer Frey by the door", who: "Mercer Frey", where: "the Flagon", checked: "players", source: "Dave, watched in game, 23 Oct 2026" }] } });
    const got = pageOf(q);
    expect(got.starts).toEqual([{ how: "Talk to Mercer Frey by the door", who: "Mercer Frey", where: "the Flagon", reportedBy: { source: "Dave, watched in game, 23 Oct 2026" } }]);
    // WO-157: the confidence line says what the page is read from, and a player's input is only a count.
    expect(got.sure).toMatch(/^Read from the game files and checked by a second reader/);
    expect(got.reports).toBe(1);
    expect(got.sure).not.toMatch(/Dave/);
  });
});

describe("a danger in the places words", () => {
  it("a place with hostile actors: who lives there, from which level, the boss", () => {
    const d = dangerOf(placeByName("Largashbur"));
    // Largashbur is an Orc stronghold: its people aren't hostile, so there is none to say.
    expect(d).toBeUndefined();
    expect(dangerOf(placeByName("Embershard Mine"))).toMatch(/^bandits from level \d+/);
  });
  it("none for a place with no levels checked or nobody there", () => {
    expect(dangerOf(null)).toBeUndefined();
    expect(dangerOf({ id: "x", name: "X", type: "Cave", clearXp: 1 })).toBeUndefined();
  });
});

describe("a quest with no read yet", () => {
  const q = quest({ objectives: ["Find the thing"], start: { checked: "files", needs: [], ways: [{ how: "Talk to Igna" , who: "Igna"}], then: "Go to the basement", thenWhere: "Igna's House" }, rewards: { gold: "small", items: ["a ring"] } });
  const p = pageOf(q);
  it("is said from the older rules and says so", () => {
    expect(p.source).toBe("rules");
    expect(p.canDo).toBeNull();
    expect(p.starts).toEqual([{ how: "Talk to Igna", who: "Igna" }]);
    expect(p.firstStep).toBe("Go to the basement at Igna's House");
    expect(p.steps).toEqual([{ objectives: ["Find the thing"] }]);
    expect(p.sure).toMatch(/^Not read yet/);
  });
});

describe("the door", () => {
  it("get_quest's fields come in the page's order, with the sources named", () => {
    const d = doorPage(quest({ read, source: "reads" }));
    expect(Object.keys(d)).toEqual(["source", "canDo", "needs", "starts", "firstStep", "takesYou", "choices", "gets", "opens", "closes", "steps", "howSure", "unsure"]);
    expect(d.canDo).toBe("Talk to someone to start it");
    expect(d.gets.xp).toBe("100 XP (Miscellaneous)");
  });
  it("a quest with no read says nothing was read, never a blank", () => {
    const d = doorPage(quest());
    expect(d).toMatchObject({ source: "rules", canDo: "not read yet", needs: ["Nothing: any level"] });
    expect(d).toHaveProperty("sourceNote");
  });
  it("suggest_quests' short form has can-do, needs, starts and what it gets, never a null start", () => {
    const s = shortPage(quest({ read, source: "reads" }));
    expect(Object.keys(s)).toEqual(["canDo", "needs", "starts", "gets", "source"]);
    expect(s.starts.length).toBeGreaterThan(0);
  });
});

describe("a quest with a read, on the real data (Part 1b)", () => {
  const a = getQuest({ name: "Speaking With Silence" }) as unknown as { quest: Record<string, unknown> & { starts: Record<string, string>[] } };
  it("shows nothing from the older rules on the door: no start block, objectives, endings or note", () => {
    for (const k of ["start", "objectives", "endings", "note", "pays", "changesTheRun"]) expect(a.quest, k).not.toHaveProperty(k);
    expect(a.quest.source).toBe("reads");
    expect(JSON.stringify(a)).not.toMatch(/start check|hasn't passed/);
  });
  it("gives starts as who, where, then how", () => {
    expect(Object.keys(a.quest.starts[0])).toEqual(["who", "where", "how"]);
    expect(a.quest.starts[0].who).toBe("Mercer Frey");
  });
  it("names the quest's own mod, not its line's", async () => {
    const { questsData } = await import("./data");
    const q = questsData().lines.flatMap((l) => l.quests).find((x) => x.name === "Mourning Never Comes")!;
    expect(q.mod).toEqual({ name: "Base game", base: true });
    expect(questsData().lines.flatMap((l) => l.quests).find((x) => x.name === "The Throat of the World")!.mod).toEqual({ name: "Base game", base: true });
    expect(questsData().lines.flatMap((l) => l.quests).find((x) => x.edid === "DLC1RV06")!.mod).toEqual({ name: "Dawnguard" });
  });
});
