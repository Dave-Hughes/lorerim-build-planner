import { describe, expect, it } from "vitest";
import { questsOn } from "@/lib/features";
import { needsOf, openState, parseWhere, type Where } from "./open";
import { checkedLine, levelChip } from "./words";

const MAIN = ["MQ101", "MQ102", "MQ103", "MQ104", "MQ105", "MQ106"];
const at = (w: Partial<Where>): Where => ({ level: null, mainAt: null, finished: [], ...w });
const wyrmstooth = { id: "wyrmstooth", minLevel: 20, after: ["rise-in-the-east", "main-quest"], mainQuestAt: "MQ105" };

describe("what's open to you (WO-100)", () => {
  it("counts nothing as open or locked with no level entered", () => {
    expect(openState({ id: "a", after: [] }, at({}), MAIN)).toBeNull();
    expect(openState(wyrmstooth, at({ finished: ["rise-in-the-east"], mainAt: "MQ106" }), MAIN)).toBeNull();
  });

  it("holds a line back until your level reaches its minLevel", () => {
    const moon = { id: "ill-met-by-moonlight", minLevel: 25, after: [] };
    expect(openState(moon, at({ level: 22 }), MAIN)).toBe("locked");
    expect(openState(moon, at({ level: 25 }), MAIN)).toBe("open");
    expect(openState({ id: "any", after: [] }, at({ level: 1 }), MAIN)).toBe("open");
  });

  it("needs every line in `after` finished", () => {
    const w = at({ level: 22, mainAt: "MQ105" });
    expect(openState(wyrmstooth, w, MAIN)).toBe("locked");
    expect(needsOf(wyrmstooth, w, MAIN)).toEqual([
      { kind: "level", level: 20, ok: true },
      { kind: "line", id: "rise-in-the-east", ok: false },
      { kind: "main", edid: "MQ105", ok: true },
    ]);
    expect(openState(wyrmstooth, { ...w, finished: ["rise-in-the-east"] }, MAIN)).toBe("open");
  });

  it("needs the main quest at or past mainQuestAt", () => {
    const w = at({ level: 22, finished: ["rise-in-the-east"] });
    expect(openState(wyrmstooth, w, MAIN)).toBe("locked");
    expect(openState(wyrmstooth, { ...w, mainAt: "MQ104" }, MAIN)).toBe("locked");
    expect(openState(wyrmstooth, { ...w, mainAt: "MQ105" }, MAIN)).toBe("open");
    expect(openState(wyrmstooth, { ...w, mainAt: "MQ106" }, MAIN)).toBe("open");
  });

  it("doesn't block on the main quest when how far isn't known", () => {
    const line = { id: "x", after: ["main-quest"] };
    expect(openState(line, at({ level: 5 }), MAIN)).toBe("open");
    expect(needsOf(line, at({ level: 5 }), MAIN)).toEqual([{ kind: "main-unchecked" }]);
  });

  it("reads a stored Where leniently", () => {
    expect(parseWhere('{"level":22,"mainAt":"MQ105","finished":["thieves-guild"]}')).toEqual({ level: 22, mainAt: "MQ105", finished: ["thieves-guild"] });
    expect(parseWhere("not json")).toEqual({ level: null, mainAt: null, finished: [] });
    expect(parseWhere('{"level":-3}').level).toBeNull();
  });

  it("says a line's level the way the cards do", () => {
    expect(levelChip(undefined, 22)).toEqual({ text: "Any level", above: false });
    expect(levelChip(20, 22)).toEqual({ text: "Level 20", above: false });
    expect(levelChip(25, 22)).toEqual({ text: "Opens at level 25", above: true });
    expect(levelChip(25, null)).toEqual({ text: "Level 25", above: false });
    expect(checkedLine({ start: "files", gate: "files", size: "players" })).toBe("Start and needs from the game files. Length from players.");
  });
});

describe("the Quests switch (WO-100)", () => {
  it("is on in dev and on staging when unset, off on production", () => {
    expect(questsOn({ NODE_ENV: "development" })).toBe(true);
    expect(questsOn({ NODE_ENV: "production", VERCEL_ENV: "preview" })).toBe(true);
    expect(questsOn({ NODE_ENV: "production", VERCEL_ENV: "production" })).toBe(false);
    expect(questsOn({ NODE_ENV: "production" })).toBe(false);
    expect(questsOn({ NODE_ENV: "production", VERCEL_ENV: "production", FEATURE_QUESTS: "on" })).toBe(true);
    expect(questsOn({ NODE_ENV: "development", FEATURE_QUESTS: "off" })).toBe(false);
  });
});
