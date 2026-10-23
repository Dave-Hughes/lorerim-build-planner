import { describe, expect, it } from "vitest";
import { styleGuide } from "./facts";
import { resolveLinkName } from "./playthroughs";
import { actTowns, fitOf, placesNear, unmeasured, whenFor } from "@/lib/places/suggest";
import { placeByName, type Place } from "@/lib/places/data";
import { resolveLink } from "@/lib/playthroughs/links";
import { versionData } from "./errors";
import { DEFAULT_VERSION } from "./errors";

/** WO-128: places with a reason. suggest_places (Part 2), rule 20 (Part 3), place links and passed by (Part 4). */

const none = { linked: [], passedBy: [] };
const act = (place: string, objectives: { detect?: { quest: string } | null; link?: { kind: "quest"; id: string } | null }[] = []) => ({
  place,
  objectives: objectives.map((o) => ({ detect: o.detect ?? null, link: o.link ?? null })),
}) as never;

describe("suggest_places (Part 2)", () => {
  it("an act set in Riverwood: Embershard Mine with its pointer, Bleak Falls Barrow named as the Golden Claw's", () => {
    const towns = actTowns([act("Riverwood")], 0);
    expect(towns).toEqual(["Riverwood"]);
    const out = placesNear(towns, 1, 5, none);
    const mine = out.find((p) => p.place === "Embershard Mine")!;
    expect(mine).toBeDefined();
    expect(mine.pointers.map((x) => x.says)).toContain("Old Embershard Mine's up there. Used to produce a lot of iron, but collapsed and taken over by criminals, I hear.");
    expect(mine.when).toBe("fits now");
    const barrow = out.find((p) => p.place === "Bleak Falls Barrow")!;
    expect(barrow.questGoesThere).toContain("The Golden Claw");
    expect(barrow.note).toMatch(/use the quest, never a hook of your own/);
    expect(barrow.pointers.some((x) => "who" in x && x.who === "Camilla Valerius" && x.where === "Riverwood Trader")).toBe(true);
  });

  it("an act set in Ivarstead: Geirmund's Hall, Wilhelm's line, planted now and paid off later", () => {
    const out = placesNear(actTowns([act("Ivarstead")], 0), 6, 12, none);
    const hall = out.find((p) => p.place === "Geirmund's Hall")!;
    // Judged leniently since WO-148 item 9: the boss is level 40, so it is 28 above the act's 12: planted, from level 20.
    expect(hall.when).toBe("plant now, pay off later (levels 20 and up)");
    expect(hall.pointers[0]).toMatchObject({ who: "Wilhelm", where: "Vilemyr Inn" });
    expect(hall.boss).toBe("Sigdis Gauldurson, level 40");
  });

  it("an act's towns come from its place, its linked quests' starts and earlier acts", () => {
    // Under the Table starts with Romlyn Dreth in Riften.
    const acts = [act("Helgen"), act("the road east", [{ link: { kind: "quest", id: "FreeformRiften03" } }])];
    expect(actTowns(acts, 1)).toEqual(expect.arrayContaining(["Riften", "Helgen"]));
  });

  it("a town the index doesn't measure from is known, and said, not guessed around", () => {
    expect(actTowns([act("Whiterun")], 0)).toEqual(["Whiterun"]);
    // Whiterun and the other capitals are measured since WO-144 Part 1 (they were this test's example before); a name no
    // place is nearest to is still said, never guessed around.
    expect(unmeasured(["Whiterun", "Riverwood"])).toEqual([]);
    expect(unmeasured(["Whiterun", "Nowhereville"])).toEqual(["Nowhereville"]);
  });

  it("what the playthrough already uses is marked, and nothing is in a city or a home", () => {
    const out = placesNear(["Riverwood"], 1, 5, { linked: [{ place: "Embershard Mine", act: "Act I", type: "Mine", town: "Riverwood" }], passedBy: [] });
    expect(out.find((p) => p.place === "Embershard Mine")?.alreadyInThePlaythrough).toBe(true);
    expect(out.every((p) => !/^(City|Town|Settlement|House|PlayerHouse)$/.test(p.type))).toBe(true);
  });

  it("when: judged by what she'll meet, leniently (WO-148 item 9)", () => {
    const place = (boss: string | undefined, levels: [number, number]): Place => ({ id: "x", name: "X", type: "Cave", clearXp: 100, actors: { count: 5, levels, ...(boss ? { boss: { level: boss } } : {}) } });
    const at = (boss: string | undefined, levels: [number, number], from = 1, to = 5) => whenFor(place(boss, levels), from, to);
    // A boss more than 20 above is planted, from the level she can face it; a scaling one fits.
    expect(at("level 30", [1, 30])).toBe("plant now, pay off later (levels 10 and up)");
    expect(at("leveled from 1", [1, 24])).toBe("fits now");
    // The floor itself well above her (10) is planted; 20 above is too high.
    expect(at(undefined, [15, 30])).toBe("plant now, pay off later (levels 5 and up)");
    expect(at("level 50", [30, 50])).toBe("too high for this act");
    // Embershard Mine's records: enemies 6 to 10, the boss leveled 3 to 24, for an act at 1 to 5: fits.
    expect(at("leveled 3-24", [6, 10])).toBe("fits now");
    // A boss 10 to 20 above fits, and says it is a hard fight; one within 10 says nothing.
    expect(fitOf(place("level 18", [3, 20]), 1, 5)).toEqual({ when: "fits now", note: "the boss is a hard fight at this level" });
    expect(fitOf(place("level 24", [3, 20]), 5, 10)).toEqual({ when: "fits now", note: "the boss is a hard fight at this level" });
    expect(fitOf(place("level 12", [3, 20]), 1, 5)).toEqual({ when: "fits now" });
    // No levels read yet.
    expect(whenFor({ id: "x", name: "X", type: "Cave", clearXp: 1 }, 1, 5)).toBe("levels not read yet");
  });
  it("a wide range is said, never hidden: enemies, the floor and the boss", () => {
    const out = placesNear(["Riverwood"], 1, 5, none);
    const barrow = out.find((p) => p.place === "Bleak Falls Barrow")!;
    expect(barrow.enemies).toMatch(/^enemies about 6 to 20, never below 6; the boss Zulakaroth/);
    // Its boss is 35 above an act at 1 to 5: planted for later, from the level she can face it.
    expect(barrow.when).toBe("plant now, pay off later (levels 20 and up)");
  });
});

describe("rule 20 (Part 3)", () => {
  it("get_style_guide gives rule 20 and its How to build line, Honesty after it (22 to 26 since WO-129's rule 21)", () => {
    const g = styleGuide();
    expect(g).toMatch(/^20\. Bring the character to places as well as quests\. When an act visits a town, call suggest_places/m);
    expect(g).toContain("When an act visits a town, call suggest_places before writing its objectives (rule 20).");
    expect(g).toMatch(/^22\. A draft is a draft\./m);
    expect(g).toMatch(/^26\. When the player says a quest's facts are wrong/m);
  });
});

describe("place links (Part 4)", () => {
  it("a place links by its name and reads back with its name, never its form id", () => {
    const { link, name } = resolveLinkName(DEFAULT_VERSION, { kind: "place", name: "embershard mine" });
    expect(link.kind).toBe("place");
    expect(name).toBe("Embershard Mine");
    expect(link.id).toBe(placeByName("Embershard Mine")!.id);
    expect(resolveLink(versionData(DEFAULT_VERSION), link)).toMatchObject({ name: "Embershard Mine", tag: "Place", where: "Mine, by Riverwood" });
  });

  it("a place the index doesn't have is refused, with the closest names", () => {
    expect(() => resolveLinkName(DEFAULT_VERSION, { kind: "place", name: "Embershard Mines of Doom" })).toThrow(/No place called .* The closest: .*Embershard Mine/);
  });
});
