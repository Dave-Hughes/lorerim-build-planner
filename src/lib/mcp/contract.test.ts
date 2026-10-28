import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { placesData } from "@/lib/places/data";
import { actTowns, fitOf, placesNear, townsIn } from "@/lib/places/suggest";
import { questsData } from "@/lib/quests/data";
import { DEFAULT_VERSION, versionData } from "./errors";
import { checkProgression, getCreation, getPerk, getQuest, getRules, getSpell, getTree, playerState, searchFacts, withQuestLink } from "./facts";
import { questLog } from "./quest-log";
import { placesAt, suggestFrom } from "./playthroughs";

/**
 * The contract tests (WO-150): every tool that reads a generated file, run on the real generated data, never a fixture, so a field
 * the PC renames or retypes in a generated file (WO-144 Part 1d's `levels` to `floor`, `ceiling`, `atLevel`) turns a test red
 * here and not a live tool red for a player. Each call must not throw, and nothing it says may hold a stray "undefined" or "NaN".
 */

const clean = (what: string, answer: unknown) => {
  const text = JSON.stringify(answer);
  expect(text, what).not.toMatch(/undefined|NaN|\[object/);
};

describe("suggest_places on the real places.json", () => {
  const places = placesData().places;
  const towns = [...new Set(places.flatMap((p) => (p.nearestTown ? [p.nearestTown.town] : [])))];

  it("the index has the shape the tool reads: every place with hostile actors has a floor, a ceiling and a table, or none of the three (WO-176: one or two low actors in a place meant for more are not its levels)", () => {
    const levelless = (a: NonNullable<(typeof places)[number]["actors"]>) => a.floor === undefined && a.ceiling === undefined && a.atLevel === undefined && a.count <= 2;
    const bad = places.filter((p) => p.actors && p.actors.hostile !== false && !p.actors.afterTheWar && !levelless(p.actors) && !(Number.isFinite(p.actors.floor) && Number.isFinite(p.actors.ceiling) && Array.isArray(p.actors.atLevel))).map((p) => p.name);
    expect(bad).toEqual([]);
  });
  it("every town, at three stretches of levels, with and without an end: no throw, a fit and its words for every place", () => {
    for (const town of towns) {
      for (const [from, to] of [[1, 5], [15, 20], [40, null]] as const) {
        const out = placesNear([town], from, to, { linked: [], passedBy: [] }, 1000);
        for (const p of out) {
          // An Orc stronghold's people aren't a fight: it has no fit (WO-151).
          if (p.type !== "Orc stronghold") expect(p.when, `${p.place} near ${town}`).toMatch(/^(fits now|plant now, pay off later \(levels \d+ and up\)|too high for this act|levels not checked yet)$/);
          if ("levels" in p) expect(p.levels, p.place).toMatch(/^(\d+ to \d+|not checked yet)$/);
          clean(`${p.place} near ${town}`, p);
        }
      }
    }
  });
  it("every place's fit, at every fifth level: no throw, a real answer", () => {
    for (const p of places) for (let lv = 1; lv <= 100; lv += 5) expect(fitOf(p, lv, lv + 4).when, `${p.name} at ${lv}`).toEqual(expect.any(String));
  });
  it("by a town, a hold and a place, as the tool takes them: Solitude at 15 to 20, Haafingar, Embershard Mine", () => {
    for (const where of ["Solitude", "Whiterun", "Riften", "Markarth", "Windhelm", "Haafingar", "Hjaalmarch", "the Pale", "the Reach", "Eastmarch", "the Rift", "Falkreath", "Winterhold", "Embershard Mine"]) {
      const a = placesAt(where, "15 to 20");
      expect(a.places.length, where).toBeGreaterThan(0);
      clean(`placesAt ${where}`, a);
    }
  });
  it("for acts as the stored form reads them: Riverwood, Solitude and Ivarstead, and a route's stops", () => {
    const act = (place: string) => ({ place, objectives: [] });
    for (const place of ["Riverwood", "Solitude", "Ivarstead"]) {
      const t = actTowns([act(place)] as never, 0);
      expect(t.length, place).toBeGreaterThan(0);
      clean(place, placesNear(t, 1, 12, { linked: [], passedBy: [] }));
    }
    expect(townsIn("Solitude").length).toBeGreaterThan(0);
  });
});

describe("get_quest, get_quest_log and suggest_quests on the real quests.json", () => {
  const lines = questsData().lines;
  it("get_quest for every quest, and with a player at three levels: no throw, a link, a clean answer", () => {
    for (const l of lines)
      for (const q of l.quests) {
        const a = withQuestLink(getQuest({ id: q.edid }), "https://planner.test");
        expect(a.link, q.edid).toMatch(/^https:\/\/planner\.test\/quests\/q\//);
        clean(q.edid, a);
        for (const level of [5, 20, 50]) clean(`${q.edid} at ${level}`, getQuest({ id: q.edid }, undefined, playerState({ level })));
      }
  }, 30_000);
  it("get_quest_log with every quest started: no throw, every entry with a page", () => {
    const questStages = Object.fromEntries(lines.flatMap((l) => l.quests.map((q) => [q.edid, 10] as const)));
    const log = questLog({ label: "Save", level: 30, questStages }, 40, "https://planner.test");
    clean("log", log);
    expect(JSON.stringify(log)).toContain("/quests/q/");
  });
  it("suggest_quests for every town and hold, at three levels, with and without a place", () => {
    for (const where of [undefined, "Solitude", "Whiterun", "Riften", "Windhelm", "Markarth", "Winterhold", "Morthal", "Haafingar", "Hjaalmarch", "the Pale", "the Reach", "Eastmarch", "the Rift", "Falkreath"])
      for (const level of [5, 20, 60]) {
        const a = suggestFrom("https://planner.test", { level, where }, { level });
        for (const s of a.suggestions) expect(typeof s.start, `${where} ${s.name}`).toBe("string");
        clean(`${where} at ${level}`, a);
      }
  });
});

describe("the other generated files, through the tools that read them", () => {
  const d = versionData();
  it("get_perk for every perk and get_tree for every tree", () => {
    for (const p of d.perks) clean(p.id, getPerk({ id: p.id }));
    for (const tree of d.perksByTree.keys()) clean(tree, getTree({ skill: tree }));
  });
  it("get_spell for every spell, get_creation, get_rules", () => {
    for (const s of d.spells) clean(s.id, getSpell({ id: s.id }));
    clean("creation", getCreation());
    clean("rules", getRules());
  });
  it("search_facts finds a sample of every kind by name, items included", () => {
    const items = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${DEFAULT_VERSION}`, "items.json"), "utf8")) as { name: string }[];
    for (const name of [...d.perks.slice(0, 40).map((p) => p.name), ...d.spells.slice(0, 40).map((s) => s.name), ...d.traits.map((t) => t.name), ...d.races.map((r) => r.name), ...items.filter((_, i) => i % 150 === 0).map((i) => i.name)]) clean(name, searchFacts(name));
  });
  it("check_progression on a drafted build", () => {
    const build = JSON.parse(readFileSync(path.join(process.cwd(), "src", "lib", "mcp", "__fixtures__", "kyria-drafted.json"), "utf8"));
    clean("check", checkProgression(build));
  });
});
