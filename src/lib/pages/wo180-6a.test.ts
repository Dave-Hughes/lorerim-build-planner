import { describe, expect, it } from "vitest";
import { peopleData } from "@/lib/people/data";
import { questsData } from "@/lib/quests/data";
import { placesData } from "@/lib/places/data";
import { innsOf, peopleAt, shopsOf } from "@/lib/places/people";

/**
 * WO-180 Part 6a (PC): a step never says an alias by its editor name split into words, and a city's shops are named by the shop or the stall, each
 * with its keeper and what it sells. The first is `plain_alias` in quest_pages.py (and `in_read_words`, which prefers the read's own words); the
 * second is `shopsOf` in places/people.ts.
 */

/**
 * Every step a quest page can show: the read's steps and the ways through it. (A quest's `steps` and `objectives` are the game's quest log, in the
 * records' own words: "Kill the target" in the Dark Brotherhood's contract is the game's sentence, and the page does not show it.)
 */
function steps(name: string): string[] {
  const out: string[] = [];
  for (const l of questsData().lines)
    for (const q of l.quests) {
      if (q.name !== name) continue;
      for (const b of q.read?.steps ?? []) out.push(...(b.objectives ?? []));
      for (const w of q.read?.ways?.ways ?? []) out.push(...(w.steps ?? []));
      out.push(...(q.read?.ways?.shared ?? []));
    }
  return out;
}
const allSteps = () => questsData().lines.flatMap((l) => l.quests.flatMap((q) => steps(q.name ?? "").map((s) => [q.name, s] as const)));

describe("a step says the read's words, or what the job picks, never an alias split into words (WO-180 Part 6a)", () => {
  it("Rescue Mission says captive and Vilkas, not the victim and the questgiver", () => {
    const s = steps("Rescue Mission");
    expect(s).toContain("Escort the captive back home");
    expect(s).toContain("Return to Vilkas");
    expect(s.filter((x) => /victim|questgiver|quest giver/i.test(x))).toEqual([]);
  });
  it("Maggot says who and where in words and the three dazzled victims are one step", () => {
    const s = steps("Maggot");
    expect(s).toContain("Take back your name from the person the quest names, in the place it names");
    expect(s.filter((x) => /dazzled/.test(x)).length).toBe(1);
    expect(s.filter((x) => /target location|the owner|the victim/i.test(x))).toEqual([]);
  });
  it("Feral Soul-Shriven, Cultists vs Player, Hunting the Monster and the Kill the Target pages", () => {
    expect(steps("Feral Soul-Shriven")).toEqual(expect.arrayContaining(["Defeat the enemy the quest marks"]));
    expect(steps("Cultists vs Player")).toEqual(expect.arrayContaining(["Search the cultists' bodies"]));
    expect(steps("Cultists vs Player").filter((x) => /search the person$/i.test(x))).toEqual([]);
    expect(steps("Hunting the Monster").filter((x) => /the vampire at the dungeon/i.test(x))).toEqual([]);
    for (const n of ["The Hunt", "The Dark Brotherhood Forever"]) expect(steps(n).filter((x) => /^Kill the target\.?$/i.test(x)), n).toEqual([]);
  });
  it("no step on any page holds a split-up alias name or 'the quest giver'", () => {
    const bad = allSteps().filter(([, s]) => /\bthe (?:target location|bounty location|quest ?giver|itemto get|item to get|animal den location|player is it)\b|\bthe actor\b|\bQuestGiver\b/i.test(s));
    expect(bad.map(([n, s]) => `${n}: ${s}`)).toEqual([]);
  });
  it("a step is never said twice in a row", () => {
    const twice: string[] = [];
    for (const l of questsData().lines)
      for (const q of l.quests) {
        const list = q.objectives ?? [];
        list.forEach((s, i) => i && s === list[i - 1] && twice.push(`${q.name}: ${s}`));
      }
    expect(twice).toEqual([]);
  });
  it("a quest keeps its name (its address) whatever its steps say", () => {
    const names = questsData().lines.flatMap((l) => l.quests.map((q) => q.name));
    expect(names.filter((n) => /the job names|gave you the job/.test(n ?? ""))).toEqual([]);
  });
});

describe("a city's shops are named by the shop or the stall, each with its keeper and what it sells (WO-180 Part 6a)", () => {
  const cities = placesData().places.filter((p) => p.type === "City");
  const shopsIn = (name: string) => shopsOf(peopleAt(cities.find((c) => c.name === name)!).houses);
  const HOME = /(?:'s|s') (?:house|home)$|\bbunkhouse\b|\blodging\b|\bquarters\b|^house /i;

  it("no shop in any city is a keeper's home, and every one has a keeper and a kind", () => {
    for (const c of cities) {
      const shops = shopsOf(peopleAt(c).houses);
      // (a home the places call a Store, like Falion's House in Morthal, is a shop by the places' own word)
      // (WO-180 Part 7a: a seller working from a home is "<keeper>'s smithy in <the home>", never the home as the shop)
      expect(shops.filter((s) => !/ in /.test(s.name) && HOME.test(s.name) && !placesData().places.some((p) => p.name === s.name && p.type === "Store")).map((s) => `${c.name}: ${s.name}`)).toEqual([]);
      expect(shops.filter((s) => !s.keeper.name || !s.kind || s.kind === "goods" || / at /.test(s.kind)).map((s) => `${c.name}: ${s.name}: ${s.kind}`)).toEqual([]);
      const names = shops.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
  it("Whiterun: Warmaiden's, the Skyforge and Carlotta Valentia's stall are there, the keepers' houses are not", () => {
    const shops = shopsIn("Whiterun");
    const by = (n: string) => shops.find((s) => s.name === n);
    expect(by("Warmaiden's")?.keeper.name).toBe("Adrianne Avenicci");
    expect(by("The Skyforge")?.keeper.name).toBe("Eorlund Gray-Mane");
    expect(by("The Skyforge")?.kind).toBe("blacksmith");
    expect(by("Carlotta Valentia's stall in the market")?.keeper.name).toBe("Carlotta Valentia");
    expect(by("Belethor's General Goods")?.kind).toBe("general goods");
    expect(shops.map((s) => s.name)).not.toContain("House Gray-Mane");
    expect(shops.map((s) => s.name)).not.toContain("Carlotta Valentia's House");
  });
  it("the other cities Bob named: Riften, Markarth and Windhelm", () => {
    expect(shopsIn("Riften").map((s) => s.name)).not.toContain("Haelga's Bunkhouse");
    expect(shopsIn("Riften").find((s) => s.keeper.name === "Brand-Shei")?.name).toBe("Brand-Shei's stall in the market");
    expect(shopsIn("Markarth").find((s) => s.keeper.name === "Lisbet")?.name).toBe("Arnleif and Sons Trading Company");
    const sadri = shopsIn("Windhelm").find((s) => s.name === "Sadri's Used Wares");
    expect(sadri?.keeper.name).toBe("Revyn Sadri");
    expect(sadri?.kind).toBe("general goods");
  });
  it("Whiterun has two inns, and only a shopkeeper is tagged Sells", () => {
    const whiterun = cities.find((c) => c.name === "Whiterun")!;
    const { houses } = peopleAt(whiterun);
    expect(innsOf(houses).map((h) => h.name).sort()).toEqual(["The Bannered Mare", "The Roadhouse"]);
    const tagged = new Set(houses.flatMap((h) => h.people).filter((p) => p.chips.some((c) => c.kind === "sells")).map((p) => p.name));
    for (const n of ["Aela the Huntress", "Farkas", "Vilkas", "Lydia", "Lucia", "Mikael"]) expect(tagged.has(n), n).toBe(false);
    expect(tagged.has("Belethor")).toBe(true);
  });
  it("Honningbrew Meadery is a meadery, and there is a person page for every shop's keeper", () => {
    expect(placesData().places.find((p) => p.name === "Honningbrew Meadery")?.type).toBe("Meadery");
    const slugs = new Set(peopleData().all.map((p) => `/people/${p.slug}`));
    for (const c of cities) for (const s of shopsOf(peopleAt(c).houses)) expect(slugs.has(s.keeper.href), `${c.name}: ${s.keeper.name}`).toBe(true);
  });
});
