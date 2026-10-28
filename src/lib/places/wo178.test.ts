import { describe, expect, it } from "vitest";
import { placeCounts, placeSlug, placesData } from "./data";
import { PLACE_GROUPS, groupOf } from "./groups";
import { placeDrawer } from "@/lib/map/data";
import path from "node:path";
import { gettingThere, inFrame, mapEntry, placeMap, toTexture } from "./map";
import { peopleAt } from "./people";

/**
 * WO-178 (PC): the data a player would call wrong, on the real places index. What the build writes for the Mac: `pinAt` for a place inside a town,
 * the counts, and the places Bob's cold review named.
 */
const places = () => placesData().places;
const named = (name: string, type?: string) => places().find((p) => p.name === name && (!type || p.type === type))!;

describe("a place inside a town is shown at its town's pin", () => {
  it("the Temple of Kynareth and Jorrvaskr have the position of Whiterun, and no position of their own", () => {
    const whiterun = named("Whiterun", "City");
    for (const name of ["Temple of Kynareth", "Jorrvaskr"]) {
      const p = named(name);
      expect(p.pos, name).toBeUndefined();
      expect(p.pinAt, name).toEqual({ world: whiterun.world, pos: whiterun.pos });
    }
  });
  it("every place inside a town has one, but those whose town has no position", () => {
    const without = places().filter((p) => p.inTown && !p.pos && !p.pinAt);
    expect(without.map((p) => `${p.name} in ${p.inTown}`)).toEqual(["The Retching Netch in Raven Rock"]);
  });
  it("a place with a position of its own has no pinAt", () => {
    expect(places().filter((p) => p.pos && p.pinAt)).toEqual([]);
  });
});

describe("one count per kind", () => {
  it("the build's counts are the places' own, by type", () => {
    const { summary } = placesData();
    expect(summary.places).toBe(places().length);
    const onMap = (p: ReturnType<typeof places>[number]) => (p.world === "Tamriel" && !!p.pos) || p.pinAt?.world === "Tamriel";
    expect(summary.onMap).toBe(places().filter(onMap).length);
    for (const [type, n] of Object.entries(summary.byType)) {
      const of = places().filter((p) => p.type === type);
      expect([type, n.all, n.onMap]).toEqual([type, of.length, of.filter(onMap).length]);
    }
  });
  it("by group, the count every page reads: 29 towns and cities, 21 of them on Tamriel's map", () => {
    const c = placeCounts();
    expect(c.groups.cities).toEqual({ all: 29, onMap: 21 });
    expect(Object.values(c.groups).reduce((n, g) => n + g.all, 0)).toBe(places().length);
    for (const g of PLACE_GROUPS) expect(c.groups[g.key].all, g.key).toBe(places().filter((p) => groupOf(p.type) === g.key).length);
  });
  it("the map can show temples and guilds, homes and landmarks that sit in a town, not one", () => {
    const c = placeCounts().groups;
    expect(c.temples.onMap).toBeGreaterThan(20);
    expect(c.homes.onMap).toBeGreaterThan(c.homes.all * 0.8);
  });
});

describe("the places Bob's cold review named", () => {
  it("Castle Volkihar is a castle with people in it, no fort with skeletons from level 1 to 150", () => {
    const p = named("Castle Volkihar");
    expect(p.type).toBe("Castle");
    expect(p.actors).toEqual({ count: expect.any(Number), hostile: false });
  });
  it("the Soul Cairn has no position on Tamriel's map", () => {
    const p = named("Soul Cairn");
    expect(p.pos).toBeUndefined();
    expect(p.world).toBeUndefined();
    expect(p.nearestTown).toBeUndefined();
  });
  it("High Hrothgar is reached from Ivarstead by the 7,000 Steps", () => {
    const p = named("High Hrothgar");
    expect(p.nearestTown?.town).toBe("Ivarstead");
    expect(gettingThere(p)).toBe("Up the 7,000 Steps from Ivarstead.");
  });
  it("Bleak Falls Barrow is up the mountain from Riverwood, not right next to it", () => {
    const text = gettingThere(named("Bleak Falls Barrow"))!;
    expect(text).toMatch(/^Up the mountain west of Riverwood, /);
    expect(text).not.toMatch(/right next to it/);
  });
  it("a place level with its town still says right next to it", () => {
    const flat = places().find((p) => p.nearestTown?.walk === "next to it" && p.pos?.[2] != null && Math.abs(p.pos[2] - (named(p.nearestTown.town, "Town")?.pos?.[2] ?? 1e9)) < 600);
    if (flat) expect(gettingThere(flat)).toMatch(/right next to it/);
  });
  it("Riverwood has Alvor's forge, smelter and tanning rack", () => {
    const crafting = named("Riverwood", "Town").worthGoingFor?.crafting ?? [];
    for (const station of ["a forge", "a smelter", "a tanning rack", "a sharpening wheel", "an armor workbench"]) expect(crafting).toContain(station);
  });
  it("Riverwood's quests are Before the Storm, Bleak Falls Barrow and The Golden Claw, not the peace council", () => {
    expect(named("Riverwood", "Town").quests).toEqual(["Before the Storm", "Bleak Falls Barrow", "The Golden Claw"]);
  });
  it("no place lists a courier's job as a quest that goes there", () => {
    expect(places().flatMap((p) => (p.quests ?? []).filter((q) => /^Deliver a /.test(q)).map((q) => `${p.name}: ${q}`))).toEqual([]);
    expect(named("Whiterun", "City").quests).not.toContain("Deliver a Letter Distant");
  });
});

describe("WO-178 Part 2: the second cold review", () => {
  it("only a place marked as on a mountain is up one, and Bleak Falls Barrow and High Hrothgar are", () => {
    const says = places().filter((p) => /^Up the mountain/.test(gettingThere(p) ?? ""));
    expect(says.every((p) => p.mountain)).toBe(true);
    expect(says.map((p) => p.name)).toEqual(["Bleak Falls Barrow"]); // High Hrothgar has its own words (the 7,000 Steps)
    expect(places().filter((p) => p.mountain).map((p) => p.name).sort()).toEqual(["Bleak Falls Barrow", "High Hrothgar"]);
    for (const [name, type] of [["Riverwood", "Town"], ["Nightgate Inn", undefined], ["Frostflow Lighthouse", undefined]] as const) {
      const p = named(name, type);
      expect(gettingThere(p) ?? "", name).not.toMatch(/mountain/);
    }
    expect(places().some((p) => p.world !== "Tamriel" && /^Up the mountain/.test(gettingThere(p) ?? ""))).toBe(false);
  });
  it("Bleak Falls Barrow says one thing: a short walk from Riverwood, up the mountain", () => {
    const p = named("Bleak Falls Barrow");
    expect(p.nearestTown).toMatchObject({ town: "Riverwood", walk: "a short walk" });
    expect(gettingThere(p)).toBe("Up the mountain west of Riverwood, a short walk.");
  });
  it("Castle Volkihar has a hold, its people (the game calls its cell Volkihar Keep) and a map that stays on the picture", () => {
    const p = named("Castle Volkihar");
    expect(p.hold).toBe("Haafingar");
    expect(peopleAt(p).total).toBeGreaterThan(5);
    expect(placeMap(p)).not.toBeNull();
    const drawer = placeDrawer(placeSlug(p))!;
    expect(drawer.inside.length).toBeGreaterThan(3);
    expect(drawer.inside.map((x) => x.name)).not.toContain("Garmr"); // a hound is not a person
  });
  it("the Soul Cairn is a realm, reached through Castle Volkihar's portal", () => {
    const p = named("Soul Cairn");
    expect(p.type).toBe("Realm");
    expect(gettingThere(p)).toBe("Through the portal in Castle Volkihar.");
  });
  it("a city's drawer names its jarl, its housecarl and its priestess, not only the Companions", () => {
    const names = placeDrawer(placeSlug(named("Whiterun", "City")))!.inside.map((x) => x.name);
    expect(names).toEqual(expect.arrayContaining(["Balgruuf the Greater", "Irileth", "Danica Pure-Spring"]));
    expect(names.length).toBeLessThanOrEqual(6);
  });
});

describe("WO-178 Part 3: the third cold review", () => {
  it("Castle Volkihar's pin is on the island the paper map draws, not in the sea beside it", async () => {
    const sharp = (await import("sharp")).default;
    const m = mapEntry()!;
    const p = named("Castle Volkihar");
    const { px, py } = toTexture(m, p.pos![0], p.pos![1]);
    expect(inFrame(m, px, py)).toBe(true);
    const { data, info } = await sharp(path.join(process.cwd(), "public", "maps", "tamriel.webp")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const k = info.width / (m.border[2] - m.border[0]);
    const at = (Math.round((py - m.border[1]) * k) * info.width + Math.round((px - m.border[0]) * k)) * 3;
    const [r, , b] = [data[at], data[at + 1], data[at + 2]];
    expect(r, `the pin's pixel is ${[data[at], data[at + 1], data[at + 2]]}: paper is warm, sea is blue`).toBeGreaterThan(b);
    expect(placeMap(p)).not.toBeNull();
  });
  it("the Soul Cairn has a level range in the data, so its page's danger section shows the foe lines (the page test, e2e/wo178p3.spec.ts, reads it)", () => {
    const a = named("Soul Cairn").actors!;
    expect(a.floor).toBe(13);
    expect(named("Soul Cairn").pos).toBeUndefined();
  });
  it("no place is called only a common noun with no marker: no page for 'Dungeon'", () => {
    expect(places().filter((p) => p.name === "Dungeon")).toEqual([]);
    expect(places().filter((p) => /^(Dungeon|Cave|Camp|Fort|Mine|Ruins|Tower|Lair|Den|Hideout|Barrow|Temple)$/i.test(p.name))).toEqual([]);
  });
  it("a few placed level 1 to 3 creatures, and a town's own people and guards, are not a place's fight", () => {
    for (const name of ["Darkwater Pass", "Northwind Mine", "Headwaters of Harstrad", "Ivarstead", "Riverwood", "Rorikstead", "Karthwasten"]) {
      const a = named(name).actors!;
      expect(a.floor, name).toBeUndefined();
      expect(a.boss, name).toBeUndefined();
    }
    expect(named("Helgen", "Town").actors!.floor).toBeDefined();
  });
});
