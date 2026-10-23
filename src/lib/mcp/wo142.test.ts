import { describe, expect, it } from "vitest";
import { citiesOf } from "@/lib/places/inside";
import { docToMarkdown, markdownToDoc } from "@/lib/playthroughs/markdown";
import { namedIn } from "@/lib/playthroughs/review";
import { getQuest, getRules, playerState, searchFacts, styleGuide } from "./facts";
import { LEVEL_ONE } from "./rules-text";
import { startsAt, suggestFrom } from "./playthroughs";
import { questsData } from "@/lib/quests/data";

/** WO-142: four things the thief test showed, and six from the bard and conjurer tests. */

const open = (name: string, level: number, done: string[] = []) => getQuest({ name }, undefined, playerState({ level, done })).openForYou;
const suggested = (where: string) => suggestFrom("https://planner.test", { level: 12, where }, { level: 12 }).suggestions.map((s) => s.name);

describe("1. a line's order never gates a quest", () => {
  it("Running Wild is open at level 5 with nothing done, and says nothing of Ode To The Tundrastriders", () => {
    const rw = open("Running Wild", 5);
    expect(rw?.state).toBe("open");
    expect(rw?.says).not.toMatch(/comes after|Tundrastriders/);
  });
  it("Dawnguard's chain still locks on the quest's own needs: Bloodline waits on Awakening, and is open once it is done", () => {
    expect(open("Bloodline", 30)?.says).toMatch(/^unknown: needs After Awakening/);
    expect(open("Bloodline", 30, ["Awakening"])?.state).toBe("open");
  });
});

describe("2. the objective matcher", () => {
  it("'Buy a horse at the Riften Stables' matches nothing: a place inside another quest's objective is no match", () => {
    expect(namedIn("Buy a horse at the Riften Stables")).toBeNull();
  });
  it("'Catch the white horse roaming the fields of Whiterun' is Running Wild, sure", () => {
    expect(namedIn("Catch the white horse roaming the fields of Whiterun")).toMatchObject({ named: { name: "Running Wild" }, sure: true });
  });
  it("most of an objective's words still match: Caught Red Handed's Marks of Dibella", () => {
    expect(namedIn("Get a Mark of Dibella from Haelga at the bunkhouse")).toMatchObject({ named: { name: "Caught Red Handed" }, sure: true });
  });
});

describe("3 and 10. level 1 has no skill points", () => {
  it("says so in get_rules and in How points work", () => {
    expect(getRules().levelOne).toBe(LEVEL_ONE);
    expect(LEVEL_ONE).toBe("Level 1 has no skill points to spend; its skills come from the race and the majors.");
    expect(styleGuide()).toContain(LEVEL_ONE);
  });
});

describe("4. mounts and 8. homes in get_rules", () => {
  const rules = getRules();
  it("a horse costs 1,500 gold at any stable; Running Wild; taming one; the paraglider", () => {
    expect(rules.mounts[0]).toMatchObject({ way: "Buy a horse", costGold: 1500, where: "any stable" });
    expect(rules.mounts.map((m) => m.way)).toEqual(["Buy a horse", "Earn one in Running Wild", "Tame a wild horse and keep it", "The paraglider"]);
    expect(rules.mounts.map((m) => ("by" in m ? m.by : null))).toEqual(expect.arrayContaining(["Simplest Horses", "Paragliding in Skyrim"]));
  });
  it("homes with their prices and gates, and a note that the Creation Club homes aren't in yet", () => {
    const home = (n: string) => rules.homes.find((h) => h.name === n);
    expect(home("Breezehome")).toMatchObject({ town: "Whiterun", costGold: 5000, after: "Dragon Rising" });
    expect(home("Proudspire Manor")).toMatchObject({ town: "Solitude", costGold: 25000 });
    expect(home("Severin Manor")).toMatchObject({ town: "Raven Rock", costGold: 10000, after: "Served Cold" });
    expect(rules.homes.filter((h) => h.costGold === 5000 && /thane/.test("after" in h ? h.after : "")).length).toBe(3);
    expect(rules.homesNote).toMatch(/Creation Club/);
    for (const h of rules.homes) expect(h.source).toMatch(/not rechecked/);
  });
});

describe("5. suggest_quests by a place inside a city", () => {
  it("places inside a city map to it", () => {
    expect(citiesOf(["Blue Palace"])).toEqual(["Solitude"]);
    expect(citiesOf(["Temple of Dibella"])).toEqual(["Markarth"]);
    expect(citiesOf(["Hall of Countenance, Winterhold College"])).toEqual(["Winterhold"]);
    // A name in two cities is left out, never guessed.
    expect(citiesOf(["Hall of the Dead", "Jarl's Longhouse"])).toEqual([]);
  });
  it("Solitude gives the Bards College and The Man Who Cried Wolf's line, Markarth and Winterhold their own", () => {
    const solitude = suggested("Solitude");
    expect(solitude).toEqual(expect.arrayContaining(["The Bards College", "The Wolf Queen Awakened"]));
    expect(suggested("Markarth").length).toBeGreaterThan(0);
    expect(suggested("Winterhold")).toContain("Join the College of Winterhold");
    expect(suggested("Winterhold").every((n) => n !== "Join the Dark Brotherhood")).toBe(true);
  });
  it("a story starting in the Blue Palace is a thing to do in Solitude", () => {
    const { byId } = questsData();
    const line = byId.get("the-wolf-queen-awakened")!;
    expect(startsAt(line, line.quests.find((q) => q.edid === line.opening)!, undefined)).toEqual(expect.arrayContaining(["Blue Palace", "Solitude"]));
  });
});

describe("6. a place condition is where the quest is, not a need", () => {
  it("A Lovely Letter is open for you, in Riverwood, with no place in its needs and its trigger placed", () => {
    const q = getQuest({ name: "A Lovely Letter" }, undefined, playerState({ level: 5 }));
    expect(q.openForYou?.says).toBe("open for you, in Riverwood");
    expect(JSON.stringify(q.quest.start.needs)).not.toMatch(/When you enter|the place you enter/);
    const trigger = q.quest.start.ways?.find((w) => /walk into any inn/.test(w.way));
    expect(trigger?.where).toBe("Riverwood");
  });
  it("no start in the data holds a place condition as a need", () => {
    const left = questsData().lines.flatMap((l) => l.quests.flatMap((q) => [...(q.start?.needs ?? []), ...(q.start?.ways ?? []).flatMap((w) => w.needs ?? [])].filter((n) => /^(When you (enter|leave)|the place you)/.test(n)).map(() => q.edid)));
    expect(left).toEqual([]);
  });
});

describe("7. a chapter keeps its paragraphs", () => {
  const written = "She came down the road at dusk.\n\nThe inn was shut.\nA light burned upstairs.\n\n## The door\n\n> Who is there?\n\nShe knocked, **twice**, and read the [sign](https://example.com/sign).";
  it("reads back as it was written", () => {
    expect(docToMarkdown(markdownToDoc(written))).toBe(written);
  });
  it("two paragraphs stay two blocks", () => {
    expect(markdownToDoc("One.\n\nTwo.").content).toHaveLength(2);
    expect(docToMarkdown(markdownToDoc("One.\n\nTwo."))).toBe("One.\n\nTwo.");
  });
});

describe("9. an item by name", () => {
  it("search_facts finds Thieves Guild Cuirass and iron greatsword, names only, after anything else", () => {
    expect(searchFacts("Thieves Guild Cuirass").hits[0]).toMatchObject({ kind: "item", name: "Thieves Guild Cuirass", line: "Body, Light" });
    const iron = searchFacts("iron greatsword", ["item"]).hits;
    expect(iron[0]).toMatchObject({ kind: "item", name: "Iron Greatsword", line: "Greatsword" });
    expect(JSON.stringify(iron)).not.toMatch(/damage|weight/i);
    // A quest or a perk that matches still comes first.
    expect(searchFacts("Running Wild").hits[0].kind).toBe("quest");
  });
});
