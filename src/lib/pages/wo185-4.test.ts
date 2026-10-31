import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { dayAndNight, placeOnly } from "@/lib/people/day";
import { peopleData, personByName } from "@/lib/people/data";
import { placesData } from "@/lib/places/data";
import { questsData } from "@/lib/quests/data";

/**
 * WO-185 Part 4 (PC): every kind of enemy has its own row and levels; where a quest's stage moves a person to a named place is read from their packages;
 * "By day" and "At night" are plain places; "What people say about it" and the crafting stations in Worth going for are gone from the dungeon pages.
 */
const place = (n: string) => placesData().places.find((p) => p.name === n)!;

describe("enemies, one way (WO-185 Part 4)", () => {
  it("Bleak Falls Barrow lists every kind, most numerous first, each with its own levels", () => {
    const k = place("Bleak Falls Barrow").actors!.kinds!;
    expect(k.map((x) => x.kind)).toEqual(["Draugr", "Bandit", "Skeleton", "Spider", "Troll"]);
    expect(k.map((x) => x.count)).toEqual([91, 31, 18, 14, 1]);
    // (a level 1 skeleton in a zone for level 6 and up is a level 6 one: the place's own range starts at 6)
    expect(k.find((x) => x.kind === "Skeleton")!.range).toEqual([6, 6]);
    expect(k.find((x) => x.kind === "Troll")!.range).toEqual([20, 20]);
  });
  it("on every place, the kinds run most numerous first and sit inside the place's own levels", () => {
    const bad: string[] = [];
    for (const p of placesData().places) {
      const a = p.actors;
      if (!a?.kinds) continue;
      for (let i = 1; i < a.kinds.length; i++) if (a.kinds[i].count > a.kinds[i - 1].count) bad.push(`${p.name}: ${a.kinds[i].kind} after ${a.kinds[i - 1].kind}`);
      if (a.livesHere && a.kinds[0].kind !== a.livesHere) bad.push(`${p.name}: ${a.livesHere} lives here but ${a.kinds[0].kind} leads`);
      if (a.floor !== undefined && a.ceiling !== undefined)
        for (const k of a.kinds) if (k.range && (k.range[0] < a.floor || k.range[1] > Math.max(a.ceiling, a.zoneMin ?? 0))) bad.push(`${p.name}: ${k.kind} ${k.range.join("-")} outside ${a.floor}-${a.ceiling}`);
    }
    expect(bad).toEqual([]);
  });
  it("a camp the war garrisons has its kinds after the war", () => {
    const k = place("Fort Hraggstad").actors!.afterTheWar!.kinds!;
    expect(k.map((x) => x.kind)).toEqual(["Imperial", "Bandit"]);
  });
});

describe("What people say about it is gone from place pages (WO-185 Part 4)", () => {
  it("neither the dungeon page nor the town page has the section or its link", () => {
    for (const f of ["src/app/(site)/places/[slug]/page.tsx", "src/components/places/place-town.tsx"]) expect(readFileSync(f, "utf8"), f).not.toMatch(/What people say about it|PlaceSaid/);
  });
  it("a dungeon's Worth going for has no crafting station, and its map panel neither", () => {
    const page = readFileSync("src/app/(site)/places/[slug]/page.tsx", "utf8");
    expect(page).not.toMatch(/worth\??\.crafting/);
    expect(readFileSync("src/lib/map/data.ts", "utf8")).toMatch(/lived && p\.worthGoingFor\?\.crafting/);
  });
});

describe("By day and at night, plainly (WO-185 Part 4)", () => {
  it("the place the read has them in most of 8 am to 6 pm, and of 10 pm to 6 am; a bed in a place is the place", () => {
    const rows = [
      { from: "8 am", for: "12 hours", where: "Meridia's Sanctum", doing: "going about" },
      { from: "8 pm", for: "2 hours", where: "Meridia's Sanctum", doing: "sweeping" },
      { from: "10 pm", for: "10 hours", where: "her bed in Meridia's Sanctum", doing: "sleeping" },
    ];
    expect(dayAndNight(rows)).toEqual({ day: "Meridia's Sanctum", night: "Meridia's Sanctum" });
    expect(placeOnly("her bed in Meridia's Sanctum")).toBe("Meridia's Sanctum");
    expect(placeOnly("the Riverwood Trader, Riverwood")).toBe("Riverwood Trader");
  });
  it("one of them is left out when the read does not say it, and 'around a spot by' is never a place", () => {
    expect(dayAndNight([{ from: "8 am", for: "10 hours", where: "Jorrvaskr, Whiterun" }])).toEqual({ day: "Jorrvaskr", night: null });
    expect(dayAndNight([{ from: "8 am", for: "10 hours", where: "around a spot by Riften" }])).toEqual({ day: null, night: null });
    expect(placeOnly("a set spot in the fort")).toBeNull();
    expect(placeOnly("wherever she is")).toBeNull();
  });
});

describe("what a quest does to where someone is (WO-185 Part 4)", () => {
  const moved = peopleData().all.filter((p) => p.moves?.length);
  const questNames = new Set(questsData().lines.flatMap((l) => l.quests.map((q) => q.name)));
  it("is read for about a hundred people, at most five a person", () => {
    expect(moved.length).toBeGreaterThan(80);
    expect(Math.max(...moved.map((p) => p.moves!.length))).toBeLessThanOrEqual(5);
  });
  it("every move is After or During a quest that has a page, in a place that has a page", () => {
    const places = new Set(placesData().places.flatMap((p) => [p.name.toLowerCase(), (p as { recordName?: string }).recordName?.toLowerCase()].filter(Boolean) as string[]));
    const bad: string[] = [];
    for (const p of moved)
      for (const m of p.moves!) {
        if (m.when !== "after" && m.when !== "during") bad.push(`${p.name}: ${m.when}`);
        if (!questNames.has(m.quest)) bad.push(`${p.name}: ${m.quest} has no page`);
        if (!places.has(m.place.toLowerCase())) bad.push(`${p.name}: ${m.place} is no place`);
        if (/\bspot\b|\baround\b/i.test(m.place)) bad.push(`${p.name}: ${m.place}`);
      }
    expect(bad).toEqual([]);
  });
  it("Arch-Paladin Laracin is at Fort Justice during The Ritual (the page used to say 'During A New Day: around a spot by Riften')", () => {
    expect(personByName("Arch-Paladin Laracin")?.moves).toEqual([{ when: "during", quest: "The Ritual", place: "Fort Justice" }]);
  });
  it("no page says what changes it any more", () => {
    expect(readFileSync("src/app/(site)/people/[slug]/page.tsx", "utf8")).not.toMatch(/What changes it/);
  });
});
