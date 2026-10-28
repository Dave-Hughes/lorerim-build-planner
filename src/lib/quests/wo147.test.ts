import { describe, expect, it } from "vitest";
import { getQuest, searchFacts, withQuestLink } from "@/lib/mcp/facts";
import { questLog } from "@/lib/mcp/quest-log";
import { questsData } from "./data";
import { isPlaceholder } from "./placeholder";
import { legacyQuestHref, questBySlug, questHref } from "./slugs";
import { isTemplateName } from "@/lib/pages/player-words";
import { placesData } from "@/lib/places/data";
import { placesNear } from "@/lib/places/suggest";

/** WO-147: a page for every quest, grab-bags as shelves, placeholder objectives hidden. */

describe("Part 1: a page for every quest", () => {
  // A job template with a placeholder name has no page (WO-180).
  const all = questsData().lines.flatMap((l) => l.quests.filter((q) => !isTemplateName(q.name)).map((q) => ({ line: l, quest: q })));

  it("every quest has an address, each different, and the address finds its quest and its line", () => {
    const hrefs = all.map(({ quest }) => questHref(quest.edid));
    expect(hrefs.every((h) => h && /^\/quests\/q\/[a-z0-9-]+$/.test(h))).toBe(true);
    expect(new Set(hrefs).size).toBe(all.length);
    for (const { line, quest } of all) {
      const found = questBySlug(questHref(quest.edid)!.slice("/quests/q/".length));
      expect(found?.quest.edid).toBe(quest.edid);
      expect(found?.line.id).toBe(line.id);
    }
  });
  it("the name makes the address; two quests of one name tell themselves apart by town or by the word their editor ids differ in (WO-174)", () => {
    expect(questHref("0WRHorseQ")).toBe("/quests/q/running-wild");
    expect(questHref("0WRRatQuest")).toBe("/quests/q/a-rat-problem");
    const twins = all.filter(({ quest }) => quest.name === "Animal Extermination");
    expect(twins.length).toBeGreaterThan(1);
    expect(new Set(twins.map(({ quest }) => questHref(quest.edid))).size).toBe(twins.length);
    // Dungeon Delving (Bandits): the favour for Whiterun and Windhelm keeps the name, each town's copy takes its town.
    expect(questHref("Favor204")).toBe("/quests/q/dungeon-delving-bandits");
    expect(questHref("Favor204Whiterun")).toBe("/quests/q/dungeon-delving-bandits-whiterun");
    expect(questHref("Favor204Windhelm")).toBe("/quests/q/dungeon-delving-bandits-windhelm");
    expect(questHref("DLC1VQ03Hunter")).toBe("/quests/q/prophet-hunter");
    expect(questBySlug("no-such-quest")).toBeNull();
  });
  it("no address is an editor id, and the old ones go to the new (WO-174)", () => {
    const edidSlugs = new Set(all.map(({ quest }) => quest.edid.toLowerCase().replace(/['’`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")));
    const clash = all.filter(({ quest }) => edidSlugs.has(questHref(quest.edid)!.slice("/quests/q/".length))).map(({ quest }) => quest.edid);
    expect(clash).toEqual([]);
    expect(legacyQuestHref("favor204")).toBe("/quests/q/dungeon-delving-bandits");
    expect(legacyQuestHref("favor204whiterun")).toBe("/quests/q/dungeon-delving-bandits-whiterun");
    expect(legacyQuestHref("running-wild")).toBeNull();
  });
  it("get_quest, search_facts and the quest log give the quest's page", () => {
    expect(withQuestLink(getQuest({ name: "Running Wild" }), "https://planner.test").link).toBe("https://planner.test/quests/q/running-wild");
    expect(searchFacts("Running Wild").hits.find((h) => h.kind === "quest")?.href).toBe("/quests/q/running-wild");
    const log = questLog({ label: "Save", level: 5, questStages: { "0WRHorseQ": 10 } }, null, "https://planner.test");
    expect(JSON.stringify(log)).toContain("https://planner.test/quests/q/running-wild");
  });
});

describe("Part 2: grab-bags as shelves", () => {
  const lines = questsData().lines;
  const line = (id: string) => lines.find((l) => l.id === id)!;

  it("the six packs of unrelated quests are shelves with no opening text, the two capitals named for what they are", () => {
    for (const id of ["capital-whiterun", "capital-windhelm", "fists-of-fury", "markarth-side", "more-to-do-in-the-soul-cairn", "the-gift-of-saturalia"]) {
      expect(line(id).category, id).toBe("work");
      expect(line(id).begins, id).toBeNull();
    }
    expect(line("capital-whiterun").name).toBe("More to do in Whiterun");
    expect(line("capital-windhelm").name).toBe("More to do in Windhelm");
  });

  it("the rule the list follows: a side-story line with more than one quest is a story only if one of its quests' starts names another", () => {
    // Dark Ancestor is one quest twice and The Book of Love is a quest and its sequel: kept as lines by judgement (logged in WO-147).
    const kept = new Set(["dark-ancestor", "the-book-of-love"]);
    const named = (l: (typeof lines)[number]) => {
      const names = l.quests.map((q) => [q.edid, q.name] as const).filter(([, n]) => n);
      const need = (re: string) => new RegExp(`(?:After|Through)\\s+"?${re}"?|${re}\\s+(?:stage|completed|not completed)`);
      return l.quests.some((q) => {
        const raw = q.start?.raw;
        const blob = [...(raw?.needs ?? []), ...(raw?.ways ?? []).flatMap((w) => [w.how, ...(w.needs ?? [])])].join(" | ");
        return names.some(([e, n]) => e !== q.edid && need(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(blob));
      });
    };
    const bags = lines.filter((l) => l.category === "side" && l.quests.length > 1 && !named(l) && !kept.has(l.id));
    expect(bags.map((l) => l.id)).toEqual([]);
  });

  it("a shelf has no giver, ways in or first step on its page: the quests' own pages and rows have them", () => {
    // The data still holds the giver of its first quest; the page leaves it off a shelf (the line page's shelf test).
    expect(line("capital-windhelm").category).toBe("work");
  });
});

describe("placeholder objectives", () => {
  it("knows TEST, empty and the editor's own note, and nothing else", () => {
    for (const t of ["TEST", "test", " Test. ", "", "   ", "; the player doesn't see this", "TODO", "Placeholder"]) expect(isPlaceholder(t), JSON.stringify(t)).toBe(true);
    for (const t of ["Test J'zargo's Flame Cloak spell on the undead (0/3)", "Pass Faralda's test using Firebolt", "Talk to Brutius in Morthal about a fishing contest", "Read the Message"]) expect(isPlaceholder(t), t).toBe(false);
  });
  it("Skirmish at Whitewatch no longer says TEST, to the page or the door", () => {
    const q = questsData().byId.get("capital-whiterun")!.quests.find((x) => x.edid === "0WRThaneQ01")!;
    expect(q.objectives).not.toContain("TEST");
    expect(JSON.stringify(getQuest({ name: "Skirmish at Whitewatch" }))).not.toContain('"TEST"');
  });
  it("no quest anywhere has one", () => {
    const left = questsData().lines.flatMap((l) => l.quests.flatMap((q) => q.objectives.filter(isPlaceholder).map(() => q.edid)));
    expect(left).toEqual([]);
  });
});

describe("Part 3: stops are not suggestions", () => {
  const all = placesData().places;
  const towns = [...new Set(all.flatMap((p) => (p.nearestTown ? [p.nearestTown.town] : [])))];
  const out = placesNear(towns, 1, null, { linked: [], passedBy: [] }, 10_000);

  it("suggest_places leaves out towns, settlements, cities, inns, temples, keeps, stables and homes, in every town", () => {
    const stops = /^(city|town|settlement|inn|temple|keep|stables|house|player house)$/;
    expect(out.filter((p) => stops.test(p.type.toLowerCase())).map((p) => `${p.place} (${p.type})`)).toEqual([]);
    // They are in the index all the same: routes, search and objectives need them.
    expect(all.filter((p) => ["Inn", "Temple", "Keep", "Stables", "Town"].includes(p.type)).length).toBeGreaterThan(20);
  });
  it("an Orc stronghold stays: a destination with a gate and a reason", () => {
    const strongholds = all.filter((p) => p.type === "OrcStronghold" && p.nearestTown);
    expect(strongholds.length).toBeGreaterThan(0);
    for (const s of strongholds) expect(out.some((p) => p.place === s.name), s.name).toBe(true);
  });
});
