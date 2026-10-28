import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { linkNames } from "@/lib/pages/link-names";
import { linkable, opensNames, peopleNames } from "@/lib/pages/names";
import { placeHref, placesData } from "@/lib/places/data";
import { lineView } from "./line-view";
import { questsData } from "./data";
import { pageOf } from "./reads";
import { storyOfLine } from "./stories-data";

/**
 * WO-160 Part 5: every person and place a line page names, in any of its text, is linked when it has a page. The page's words are the quests'
 * first steps and notes, At a glance, the pitch, what the line gives and closes; each goes through the same linker the page uses, and any name
 * the index has (every person, every place) that is written whole in them and not linked is a failure.
 */
const LINES = ["main-quest", "dragonborn", "dawnguard", "companions"];

/** Names that are also plain words or generic roles: a person called "Guard" is not what a sentence about a guard means. */
const COMMON = new Set(["Guard", "Bandit", "Prisoner", "Warrior", "Soldier", "Priest", "Mage", "Thief", "Farmer", "Child", "Citizen", "Traveler", "Hunter", "Miner", "Skeleton", "Dragon", "Draugr", "Giant", "Vampire", "Orc", "Elder", "Blade", "Dunmer", "Skeever", "Nord", "Imperial", "Breton", "Redguard", "Khajiit", "Argonian", "Altmer", "Bosmer", "Orsimer"]);

/** Names of quests and items: a person's or place's name inside one is not that person or place (WO-160 Part 6), so it is not a miss. */
const ITEMS: string[] = (JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "lorerim-5.0.4.8", "items.json"), "utf8")) as { name?: string }[]).map((i) => i.name ?? "");
const WHOLE = new Set([...questsData().lines.flatMap((l) => l.quests.map((q) => q.name.trim())), ...ITEMS].flatMap((n) => [n, n.replace(/^The\s+/, "")]).filter((n) => n.split(/\s+/).length >= 2 && n.length >= 8));

function unlinked(text: string, broad: string[]): string[] {
  const pieces = linkNames(text, linkable()).map((p) => (p.href ? p : { text: [...WHOLE].reduce((t, w) => (t.includes(w) ? t.split(w).join(" ") : t), p.text) }));
  const linked = new Set(pieces.filter((p) => p.href).map((p) => p.text));
  const plain = pieces.filter((p) => !p.href).map((p) => p.text).join("\u0000");
  return broad.filter((n) => !linked.has(n) && new RegExp(`(?<![\\p{L}\\p{N}])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])(?!\\s+\\p{Lu})`, "u").test(plain));
}

describe("names on the main quest, Dragonborn, Dawnguard and the Companions", () => {
  // Every place with a page, and every person a quest line may name (peopleNames: whole names, anyone in a quest, a read, a follower or a trader).
  const broad = [...new Set([...placesData().places.filter((p) => placeHref(p.name)).map((p) => p.name), ...peopleNames().map((n) => n.text)])].filter((n) => n.length > 3 && !COMMON.has(n));
  for (const id of LINES) {
    it(`${id}: every name with a page is a link`, () => {
      const line = questsData().byId.get(id)!;
      const v = lineView(line);
      const texts = [
        storyOfLine(id)?.pitch ?? line.read?.about ?? "",
        ...v.chapters.flatMap((c) => c.quests.flatMap((q) => [q.task ?? "", q.note ?? ""])),
        ...v.jobs.flatMap((j) => [j.task ?? "", j.note ?? ""]),
        v.glance.start.sub ?? "",
        ...v.glance.start.more,
        v.glance.where ?? "",
        ...(line.read?.gives ?? []),
        ...(line.read?.closes ?? []),
        ...line.quests.flatMap((q) => pageOf(q).closes),
      ].filter(Boolean);
      const missed = new Map<string, string>();
      for (const t of texts) for (const n of unlinked(t, broad)) missed.set(n, t.slice(0, 80));
      expect([...missed].map(([n, t]) => `${n}: ${t}`)).toEqual([]);
    }, 30_000);
  }
});

/** What a sentence links: [text, href] for each link, in order. */
const links = (text: string, names = linkable()) => linkNames(text, names).filter((p) => p.href).map((p) => [p.text, p.href] as const);

describe("WO-160 Part 6: the names the first pass missed", () => {
  it("a short name links by the name the text uses: first name, or title and first name", () => {
    expect(links("Talk to Farengar")).toEqual([["Farengar", "/people/farengar-secret-fire"]]);
    expect(links("Talk to Jarl Balgruuf")).toEqual([["Jarl Balgruuf", "/people/balgruuf-the-greater"]]);
    expect(links("bring Storn what he asks")).toEqual([["Storn", "/people/storn-crag-strider"]]);
    expect(links("Refuse Harkon's gift")).toEqual([["Harkon", "/people/lord-harkon"]]);
    expect(links("Kodlak's funeral")).toEqual([["Kodlak", "/people/kodlak-whitemane"]]);
  });

  it("a whole name still wins over its short one, and a short name is left whole before 'the' and a capital", () => {
    expect(links("Talk to Farengar Secret-Fire")).toEqual([["Farengar Secret-Fire", "/people/farengar-secret-fire"]]);
    expect(links("Talk to Jarl Balgruuf the Greater")).toEqual([["Balgruuf the Greater", "/people/balgruuf-the-greater"]]);
  });

  it("'the' before a place's name does not stop the match", () => {
    expect(links("meet him at the Winking Skeever")).toEqual([["Winking Skeever", "/places/the-winking-skeever"]]);
  });

  it("a quest's name in brackets is that quest, and a name inside a quest's or an item's name is never a person or place", () => {
    const closes = links("Paarthurnax dies if you kill him (Paarthurnax)");
    expect(closes[0][1]).toMatch(/^\/people\//);
    expect(closes[1][1]).toMatch(/^\/quests\/q\//);
    expect(links("the mountain is shut (The Throat of the World)")).toEqual([["The Throat of the World", expect.stringMatching(/^\/quests\/q\//)]]);
    expect(links("Retrieve the Horn of Jurgen Windcaller")).toEqual([]);
    expect(links("a word of Fire Breath (The Throat of the World, A Blade in the Dark)").map((l) => l[0])).toEqual(["The Throat of the World", "A Blade in the Dark"]);
    expect(links("the horn is kept (The Horn of Jurgen Windcaller)")).toEqual([["The Horn of Jurgen Windcaller", expect.stringMatching(/^\/quests\/q\//)]]);
  });

  it("Opens other stories links its places and the quests it waits for", () => {
    const sail = links("Or sail to Raven Rock from Windhelm's docks", opensNames());
    expect(sail.map((l) => l[0])).toEqual(expect.arrayContaining(["Raven Rock"]));
    expect(links("The Way of the Voice", opensNames())[0][1]).toMatch(/^\/quests\/q\//);
    expect(links("Rise in the East", opensNames())[0][1]).toMatch(/^\/quests\/q\//);
  });

  it("a place called another name in the words links to its page", () => {
    expect(links("sail to Volkihar Keep").map((l) => l[1])).toEqual([placeHref("Castle Volkihar")]);
    expect(links("Dimhollow Cavern")[0][1]).toBe(placeHref("Dimhollow Crypt"));
    expect(links("Driftshade Refuge")[0][1]).toBe(placeHref("Driftshade Sanctuary"));
  });

  it("WO-177: a word that ends another name is not a person (Dragon Blood), a name that starts a sentence still links", () => {
    expect(links("Bring 3 Dragon Blood, 3 Dragon Bile and 3 Dragon Rheum to Farengar").filter((l) => l[1]?.includes("blood-curse"))).toEqual([]);
    expect(links("Bring 3 Dragon Blood to Farengar")).toEqual([["Farengar", "/people/farengar-secret-fire"]]);
    expect(links("Meet Farengar and go")).toEqual([["Farengar", "/people/farengar-secret-fire"]]);
    expect(links("Then Storn asks. Kodlak waits")).toEqual([["Storn", "/people/storn-crag-strider"], ["Kodlak", "/people/kodlak-whitemane"]]);
  });

  it("a faction or group is not a person", () => {
    for (const w of ["the Silver Hand", "the Greybeards", "the Blades"]) expect(links(w).filter((l) => l[1]?.startsWith("/people/"))).toEqual([]);
  });
});

describe("WO-177: a quest named after 'in the quest' is that quest, not the person", () => {
  it("links the person at the start and the quest after the words", () => {
    const got = links("Paarthurnax dies if you kill him in the quest Paarthurnax");
    expect(got[0][1]).toMatch(/^\/people\//);
    expect(got[1][1]).toMatch(/^\/quests\/q\//);
  });
});

describe("WO-177 Part 5: a place after a title is a role", () => {
  it("does not link Whiterun in 'Jarl of Whiterun', and links it elsewhere", () => {
    expect(links("Jarl of Whiterun").filter((l) => l[1]?.startsWith("/places/"))).toEqual([]);
    expect(links("Go to Whiterun").map((l) => l[1])).toEqual(expect.arrayContaining([expect.stringMatching(/^\/places\//)]));
  });
});
