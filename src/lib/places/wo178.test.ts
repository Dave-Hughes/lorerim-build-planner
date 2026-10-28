import { describe, expect, it } from "vitest";
import { placeCounts, placesData } from "./data";
import { PLACE_GROUPS, groupOf } from "./groups";
import { gettingThere } from "./map";

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
