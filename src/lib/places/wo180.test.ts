import { describe, expect, it } from "vitest";
import { peopleData } from "@/lib/people/data";
import { placesData } from "./data";
import { peopleAt } from "./people";

/** WO-180 (PC): a city's people are the ones who live in it; what is quoted is the game's words, not its markup. */
const city = (name: string) => placesData().places.find((p) => p.name === name && p.type === "City")!;
const everyone = (name: string) => peopleAt(city(name)).houses.flatMap((h) => h.people.map((x) => x.name));

describe("a city's people", () => {
  it("Whiterun lists who lives in it, not the Spider in Bleak Falls Temple, Jon the Mad, Sild or the Greybeards", () => {
    const names = everyone("Whiterun");
    for (const out of ["Web Mother", "Arvel the Swift", "Jon the Mad", "The Beast", "Sild the Warlock", "Arngeir"]) expect(names, out).not.toContain(out);
    for (const inn of ["Balgruuf the Greater", "Irileth", "Ysolda", "Danica Pure-Spring"]) expect(names, inn).toContain(inn);
    expect(peopleAt(city("Whiterun")).total).toBeLessThan(110);
  });
  it("no city lists people from a dungeon, a cave, a fort or a mine it is only the hold of", () => {
    const outlying = new Set(placesData().places.filter((p) => !p.inTown && ["Cave", "NordicRuin", "Fort", "Mine", "Camp", "DwemerRuin"].includes(p.type)).map((p) => p.name));
    for (const c of ["Whiterun", "Riften", "Solitude", "Windhelm", "Markarth", "Falkreath", "Dawnstar", "Winterhold", "Morthal"]) {
      const homes = peopleAt(city(c)).houses.map((h) => h.name).filter((n) => outlying.has(n));
      expect(homes, c).toEqual([]);
    }
  });
});

describe("what a person is shown as", () => {
  it("a trainer's skill is as the game shows it, never the record's: One-Handed, not OneHanded", () => {
    const skills = new Set(peopleData().all.flatMap((p) => (p.trainer ? [p.trainer.skill] : [])));
    expect([...skills].filter((s) => /[a-z][A-Z]/.test(s) || s === "Speechcraft" || s === "Lockpick")).toEqual([]);
    expect(skills.has("One-Handed")).toBe(true);
  });
});

describe("what a place page quotes", () => {
  it("only a line someone says, in the game's words: no markup, no hole, no game file's name for a quest", async () => {
    const { saidAbout } = await import("./said");
    const { questsData } = await import("@/lib/quests/data");
    const player = new Set(questsData().lines.flatMap((l) => l.quests.map((q) => q.name)));
    const bad: string[] = [];
    for (const p of placesData().places) {
      for (const q of saidAbout(p.pointers).all) {
        if (q.kind === "dialogue" && !q.speaker) bad.push(`${p.name}: no speaker: ${q.words.slice(0, 40)}`);
        if (/\[pagebreak\]|<|>|size=|face=|WIDTH|img:\/\/|\b(?:Jarl of|to|Steward to) ,|,\s*,/i.test(q.words)) bad.push(`${p.name}: ${q.words.slice(0, 60)}`);
        if (q.quest && !player.has(q.quest)) bad.push(`${p.name}: in ${q.quest}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
