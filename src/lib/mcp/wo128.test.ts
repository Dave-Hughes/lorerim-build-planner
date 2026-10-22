import { describe, expect, it } from "vitest";
import { styleGuide } from "./facts";
import { resolveLinkName } from "./playthroughs";
import { actTowns, placesNear, unmeasured, whenFor } from "@/lib/places/suggest";
import { placeByName } from "@/lib/places/data";
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
    expect(hall.when).toBe("plant now, pay off later (levels 40 and up)");
    expect(hall.pointers[0]).toMatchObject({ who: "Wilhelm", where: "Vilemyr Inn" });
    expect(hall.boss).toBe("Sigdis Gauldurson, level 40");
  });

  it("an act's towns come from its place, its linked quests' starts and earlier acts", () => {
    // Under the Table starts with Romlyn Dreth in Riften.
    const acts = [act("Helgen"), act("the road east", [{ link: { kind: "quest", id: "FreeformRiften03" } }])];
    expect(actTowns(acts, 1)).toEqual(expect.arrayContaining(["Riften", "Helgen"]));
  });

  it("a city the index doesn't measure from yet is known, and said, not guessed around", () => {
    expect(actTowns([act("Whiterun")], 0)).toEqual(["Whiterun"]);
    expect(unmeasured(["Whiterun", "Riverwood"])).toEqual(["Whiterun"]);
  });

  it("what the playthrough already uses is marked, and nothing is in a city or a home", () => {
    const out = placesNear(["Riverwood"], 1, 5, { linked: [{ place: "Embershard Mine", act: "Act I", type: "Mine", town: "Riverwood" }], passedBy: [] });
    expect(out.find((p) => p.place === "Embershard Mine")?.alreadyInThePlaythrough).toBe(true);
    expect(out.every((p) => !/^(City|Town|Settlement|House|PlayerHouse)$/.test(p.type))).toBe(true);
  });

  it("when: a fixed boss above the act is later, a scaling one fits, a place whose weakest is above is too high", () => {
    const at = (boss: string, levels: [number, number]) => whenFor({ id: "x", name: "X", type: "Cave", clearXp: 100, actors: { count: 5, levels, boss: { level: boss } } }, 1, 5);
    expect(at("level 30", [1, 30])).toBe("plant now, pay off later (levels 30 and up)");
    expect(at("leveled from 1", [1, 24])).toBe("fits now");
    expect(at("level 50", [30, 50])).toBe("too high for this act");
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
