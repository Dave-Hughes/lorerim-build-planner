import { describe, expect, it } from "vitest";
import { rules } from "./rules-view";
import { reviewGates, type GateAct } from "@/lib/playthroughs/gate-review";
import { reviewPlaythrough } from "@/lib/playthroughs/review";
import { holdNamed } from "@/lib/places/holds";
import { getQuest, getRules, playerState, styleGuide } from "./facts";
import { gateWorld, missivesAt, placesAt, shelfPlaces, suggestFrom } from "./playthroughs";
import { questsData } from "@/lib/quests/data";

/** WO-148: what re-planning Kyria's Acts III and IV couldn't get from the door. */

const act = (n: string, name: string, place: string, levelFrom: number, levelTo: number | null, objectives: GateAct["objectives"] = []): GateAct => ({ n, name, place, levelFrom, levelTo, route: [], objectives });
const line = (id: string, oid = 1) => ({ id: oid, text: id, link: { kind: "line" as const, id }, detect: null });
const quest = (edid: string, oid = 1) => ({ id: oid, text: edid, link: { kind: "quest" as const, id: edid }, detect: null });

describe("6. gate chains across acts", () => {
  const world = gateWorld();
  it("Kyria's Act IV: Dawnguard waits for level 30 and its first way in needs Laid to Rest, which fits Act III in Morthal", () => {
    const w = reviewGates([act("III", "Morthal", "Morthal", 20, 25), act("IV", "The Dawn", "Fort Dawnguard", 25, 28, [line("dawnguard")])], world);
    expect(w).toHaveLength(1);
    expect(w[0].code).toBe("gate-chain");
    expect(w[0].message).toContain("Act IV The Dawn links Dawnguard, which waits for level 30; the act runs only to level 28");
    expect(w[0].message).toContain("its first way in (Durak comes to find you in any inn) needs Laid to Rest, which no earlier act has");
    expect(w[0].message).toContain("Laid to Rest fits Act III, in Morthal.");
    expect(w[0].message).toContain("Talk to Agmaer in Fort Dawnguard needs nothing");
  });
  it("with Laid to Rest in an earlier act and the level there, nothing is said", () => {
    const w = reviewGates([act("III", "Morthal", "Morthal", 20, 25, [quest("MS14")]), act("IV", "The Dawn", "Fort Dawnguard", 30, 33, [line("dawnguard")])], world);
    expect(w).toEqual([]);
  });
  it("Vigilant needs level 25, The House of Horrors and Kindred Judgment: the missing lines are named with the act they fit", () => {
    const w = reviewGates([act("III", "Morthal", "Morthal", 20, 25, [quest("MS14")]), act("IV", "Dawn", "Fort Dawnguard", 30, 33, [line("dawnguard")]), act("V", "Vigil", "Dawnstar", 25, 28, [line("vigilants")])], world);
    expect(w).toHaveLength(1);
    expect(w[0].message).toContain("links Vigilant");
    expect(w[0].message).toContain("needs The House of Horrors, which no earlier act has");
    expect(w[0].message).not.toContain("needs Dawnguard");
    expect(w[0].message).toMatch(/The House of Horrors fits Act (III|IV)/);
  });
  it("says it once for a line, however many of its quests an act links, and an act's own earlier objective counts", () => {
    const w = reviewGates([act("IV", "The Dawn", "Fort Dawnguard", 25, 28, [line("dawnguard", 1), quest("DLC1VQ02", 2)])], world);
    expect(w).toHaveLength(1);
    // Laid to Rest in the same act, before it, is there.
    const ok = reviewGates([act("IV", "The Dawn", "Fort Dawnguard", 30, 33, [quest("MS14", 1), line("dawnguard", 2)])], world);
    expect(ok).toEqual([]);
  });
});

describe("1. suggest_quests takes a hold", () => {
  const stories = (where: string) => suggestFrom("https://planner.test", { level: 15, where }, { level: 15 }).suggestions;
  it("a hold is every town in it: Haafingar and Hjaalmarch give quests, as Solitude does", () => {
    expect(holdNamed("Haafingar")?.towns).toEqual(expect.arrayContaining(["Solitude", "Dragon Bridge"]));
    expect(holdNamed("the Pale")?.towns).toEqual(expect.arrayContaining(["Dawnstar"]));
    expect(holdNamed("Whiterun hold")?.towns).toContain("Whiterun");
    expect(holdNamed("The Rift")?.towns).toContain("Riften");
    expect(holdNamed("Narnia")).toBeNull();
    const haafingar = stories("Haafingar").map((s) => s.name);
    expect(haafingar.length).toBeGreaterThan(0);
    expect(haafingar).toEqual(expect.arrayContaining(["The Bards College", "The Wolf Queen Awakened"]));
    expect(stories("Hjaalmarch").length).toBeGreaterThan(0);
    expect(stories("Narnia")).toEqual([]);
  });
  it("a hold is not every hold: Haafingar leaves out Windhelm's Brotherhood and Riften's Thieves Guild", () => {
    const names = stories("Haafingar").map((s) => s.name);
    expect(names).not.toContain("Join the Dark Brotherhood");
    expect(names).not.toContain("Join the Thieves Guild");
  });
});

describe("2. suggest_quests never returns start: null", () => {
  it("the five the thief test named, and everything else, say how they start", () => {
    const all = suggestFrom("https://planner.test", { level: 15, where: "Solitude" }, { level: 15 }).suggestions;
    for (const name of ["The Bards College", "The Wolf Queen Awakened", "Lights Out!", "Battle of the Champions", "Odd jobs in Haafingar"]) {
      const s = all.find((x) => x.name === name);
      expect(s, name).toBeDefined();
      expect(typeof s!.start === "string" && s!.start.length > 0, name).toBe(true);
    }
    expect(all.find((x) => x.name === "Odd jobs in Haafingar")?.start).toBe("Separate jobs; open one for how it starts.");
    for (const where of ["Haafingar", "Whiterun", "Riften", "Windhelm", "Markarth", "Winterhold", "Morthal"]) {
      for (const s of suggestFrom("https://planner.test", { level: 30, where }, { level: 30 }).suggestions) expect(s.start, `${where}: ${s.name}`).toEqual(expect.any(String));
    }
  });
});

describe("3. suggest_places takes a place and levels", () => {
  it("near Solitude at 15 to 20, and a hold: the same places, pointers and fit as for an act", () => {
    const solitude = placesAt("Solitude", "15 to 20");
    expect(solitude.towns).toContain("Solitude");
    expect(solitude.levels).toBe("15 to 20");
    expect(solitude.places.length).toBeGreaterThan(0);
    expect(solitude.places[0]).toHaveProperty("when");
    const hold = placesAt("Haafingar", "15 to 20");
    expect(hold.where).toBe("Haafingar, a hold");
    expect(hold.towns).toEqual(expect.arrayContaining(["Solitude", "Dragon Bridge"]));
    // A place stands for the town nearest it.
    expect(placesAt("Embershard Mine", "1 to 5").towns).toEqual(["Riverwood"]);
  });
  it("asks for levels, and says when it knows no such place", () => {
    expect(() => placesAt("Solitude", undefined)).toThrow(/levels/);
    expect(() => placesAt("Solitude", "high")).toThrow(/levels/i);
    expect(() => placesAt("Narnia", "1 to 5")).toThrow(/No town, hold or place called Narnia/);
    expect(() => placesAt(undefined, "1 to 5")).toThrow(/where/);
  });
});

describe("4. get_quest says what a quest pays", () => {
  it("a Side Quest pays 100, and The Heart of Dibella and The Blessings of Nature pay none, said plainly", () => {
    expect(rules("Running Wild").quest).toMatchObject({ type: "Side Quest", xp: 100, pays: "Side Quest: pays 100 quest XP" });
    for (const name of ["The Heart of Dibella", "The Blessings of Nature"]) {
      const q = rules(name === "The Heart of Dibella" ? "T01" : "T03").quest;
      expect(q.xp, name).toBe(0);
      expect(q.pays, name).toMatch(/no quest XP$/);
    }
    // A quest with a read says it in what it gets (WO-154).
    expect(getQuest({ name: "Bleak Falls Barrow" }).quest.gets?.xp).toBe("200 XP (Main Quest)");
  });
});

describe("5. a key or a door isn't a start", () => {
  it("A Rat Problem and Laid to Rest: a door is never a need, and is the first step's detail only when it is on the way", () => {
    for (const name of ["A Rat Problem", "Laid to Rest"]) {
      const a = getQuest({ name }, undefined, playerState({ level: 15 }));
      expect(JSON.stringify(rules(name).quest.start.needs ?? []), name).not.toMatch(/door|Key/i);
      expect(a.openForYou?.says, name).not.toMatch(/door|Key/i);
    }
    // Igna's basement key is on the way: the first step goes into that cell.
    expect(rules("A Rat Problem").quest.start.onTheWay).toEqual(["The door from Whiterun into Igna's Basement needs the Key to Igna's Basement."]);
    // Sorli's House is in Stonehills and no step goes there (WO-148 Part 2): dropped.
    expect(rules("Laid to Rest").quest.start.onTheWay).toBeUndefined();
    expect(getQuest({ name: "Laid to Rest" }, undefined, playerState({ level: 15 })).openForYou?.state).toBe("open");
  });
  it("no quest anywhere has one in its needs or ways, in words or in the record form", () => {
    const left = questsData().lines.flatMap((l) =>
      l.quests.filter((q) => /^The door from /m.test(JSON.stringify([q.start?.needs, q.start?.ways?.map((w) => w.needs), q.start?.raw?.needs]).replace(/\\n/g, "\n").replace(/"/g, "\n"))).map((q) => q.edid),
    );
    expect(left).toEqual([]);
  });
});

describe("7. Missives: route-aware, never a lump", () => {
  it("rule 37 is in the style guide", () => {
    expect(styleGuide()).toMatch(/^37\. Missives are board jobs, and no tool can promise where one goes/m);
    expect(styleGuide()).toContain("Never budget missives as a lump");
  });
  it("a stop with a board that sends her on says to read it for notes addressed to the next town", () => {
    expect(missivesAt("Markarth", "Solitude")).toBe("Read Markarth's board for notes addressed to Solitude.");
    expect(missivesAt("Markarth", undefined)).toBeNull();
    expect(missivesAt("Ivarstead", "Riften")).toBeNull();
    expect(missivesAt("Riften", "Riften Mistveil Keep")).toBeNull();
  });
  it("a lump, the whole line, or a gathering missive is warned about; one near delivery is not", () => {
    const obj = (over: object) => ({ id: 1, text: "x", kind: "once" as const, link: null, reach: null, ...over });
    const codes = (o: object) => reviewPlaythrough([obj(o) as never]).map((w) => w.code);
    expect(codes({ text: "Do five missives on the road", kind: "once" })).toContain("missives-lump");
    expect(codes({ text: "Do every missive in Markarth" })).toContain("missives-lump");
    expect(codes({ text: "Missives", link: { kind: "line", id: "missives" } })).toContain("missives-lump");
    expect(codes({ text: "Read missives", kind: "reach", reach: { key: "count:missives read", target: 6 } })).toContain("missives-lump");
    const gather = questsData().byId.get("missives")!.quests.find((q) => /^Gather Firewood$/.test(q.name))!;
    expect(codes({ text: "Gather firewood for Markarth", link: { kind: "quest", id: gather.edid } })).toContain("missives-gathering");
    const near = questsData().byId.get("missives")!.quests.find((q) => q.name === "Deliver a Letter Near")!;
    expect(codes({ text: "Deliver a letter near Markarth", link: { kind: "quest", id: near.edid } })).toEqual([]);
    expect(codes({ text: "Read one missive before she leaves Markarth" })).toEqual([]);
  });
});

describe("8. Tome Trials, modeled and gated", () => {
  it("get_rules: 36 exams, 50, 100 and 200 XP, the Speech needs, after Tending the Flames, a quest the planner has", () => {
    const t = getRules().tomeTrials;
    expect(t.exams).toBe(36);
    expect(t.xp).toEqual([{ tier: 1, xp: 50 }, { tier: 2, xp: 100, needs: "Speech 50" }, { tier: 3, xp: 200, needs: "Speech 75" }]);
    expect(t.after).toBe("Tending the Flames");
    expect(questsData().lines.some((l) => l.quests.some((q) => q.name === t.after))).toBe(true);
    expect(t.says).toMatch(/^None of the 36 exams is open until Tending the Flames is complete/);
    expect(t.says).toContain("With Callings, its Historian pays half again");
  });
});

describe("Part 2: three things on the live door", () => {
  const stories = (where: string) => suggestFrom("https://planner.test", { level: 20, where }, { level: 20 }).suggestions;
  const places = (id: string) => shelfPlaces(questsData().byId.get(id)!);

  it("a shelf's place is where its own quests start: Markarth Side is not in Haafingar, and no Reach, Whiterun or Rift line is", () => {
    const names = stories("Haafingar").map((s) => s.name);
    for (const out of ["Markarth Side", "More to do in Whiterun", "Odd jobs in the Reach", "Odd jobs in the Rift", "Odd jobs in Whiterun Hold", "Fists of Fury"]) expect(names, out).not.toContain(out);
    expect(names).toContain("Odd jobs in Haafingar");
    // It is a shelf in Markarth: its second quest starts at the Boiling Cauldron in Markarth Side.
    expect(places("markarth-side")).toEqual(expect.arrayContaining(["Markarth Side"]));
    expect(places("markarth-side").join("|")).not.toMatch(/Dragon Bridge/);
    expect(stories("Markarth").map((s) => s.name)).toContain("Markarth Side");
  });
  it("every shelf the Haafingar hold returns has a quest that starts in a Haafingar town", () => {
    const towns = (holdNamed("Haafingar")?.towns ?? []).map((t) => t.toLowerCase());
    for (const s of stories("Haafingar")) {
      const line = questsData().lines.find((l) => l.name === s.name);
      if (line?.category !== "work") continue;
      expect(shelfPlaces(line).some((p) => towns.some((t) => p.toLowerCase().includes(t))), s.name).toBe(true);
    }
  });
  it("an unnamed trigger is you arriving there: Laid to Rest reads 'when you arrive in Morthal', and no way says 'something placed'", () => {
    const ltr = rules("Laid to Rest").quest.start.ways?.[0] as { way: string };
    expect(ltr.way).toBe("It starts when you arrive in Morthal");
    const left = questsData().lines.flatMap((l) => l.quests.flatMap((q) => (q.start?.ways ?? []).filter((w) => /something placed/.test(w.how)).map(() => q.edid)));
    expect(left).toEqual([]);
    // A named one keeps its name; the UESP wording for The Cause stands.
    expect(rules("The Cause").quest.start.ways?.[0]).toMatchObject({ way: expect.stringContaining("A courier brings you Stranger's Plea") });
  });
  it("and a trigger way is a way in, not a need: the quest is open for you", () => {
    expect(getQuest({ name: "Laid to Rest" }, undefined, playerState({ level: 15 })).openForYou?.says).toBe("open for you");
  });
});
