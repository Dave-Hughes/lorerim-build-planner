import { describe, expect, it } from "vitest";
import { questsData } from "@/lib/quests/data";
import { peopleData } from "@/lib/people/data";
import { placesData } from "@/lib/places/data";
import { peopleAt } from "@/lib/places/people";

/**
 * WO-183 Parts 2 and 3 (PC): what a place page and a quest page are told is true, or the page says it isn't sure. Each test is for a cause the audit found, not for a
 * sampled page: a level no player reaches, a guild's home with a danger block, a place with its record's name, a realm with Tamriel's defaults, a town measured to a town,
 * and a field cut in the middle.
 */
const places = () => placesData().places;
const named = (n: string) => places().find((p) => p.name === n)!;

describe("a place says only what is true of it (WO-183 Part 2)", () => {
  it("no level a player is told of is above 100 (Borogove had 1 to 18000)", () => {
    const high = places().filter((p) => (p.actors?.ceiling ?? 0) > 100 || (p.actors?.floor ?? 0) > 100);
    expect(high.map((p) => `${p.name}: ${p.actors?.floor} to ${p.actors?.ceiling}`)).toEqual([]);
  });
  it("a guild's home has no danger block: the Dark Brotherhood's sanctuaries are guild homes, not towns", () => {
    for (const n of ["Dark Brotherhood Sanctuary", "Dawnstar Sanctuary"]) {
      const p = named(n);
      expect(p.type, n).toBe("Guild");
      expect(p.actors?.hostile, n).toBe(false);
      expect(p.actors?.boss, n).toBeUndefined();
    }
  });
  it("a place is called what the game calls it: the Hall of Attainment, with its residents and its old name kept for the redirect", () => {
    const hall = named("Hall of Attainment");
    expect(hall.recordName).toBe("Dormitory");
    expect(places().some((p) => p.name === "Dormitory")).toBe(false);
    expect(peopleAt(hall).total).toBeGreaterThan(0);
  });
  it("a place outside Tamriel says its realm and claims none of Tamriel's defaults", () => {
    for (const [n, realm] of [["Borogove", "The Shivering Isles"], ["Lipsand Cave", "Coldharbour"], ["Krakevisa", "Wyrmstooth"]] as const) {
      const p = named(n);
      expect(p.realm, n).toBe(realm);
      expect(p.clearXp, n).toBeUndefined();
      expect(p.respawns, n).toBeUndefined();
    }
    expect(places().filter((p) => p.realm && p.world === "Tamriel")).toEqual([]);
  });
  it("the nearest town is the nearest by distance, a city counted: Solitude Sawmill is by Solitude", () => {
    expect(named("Solitude Sawmill").nearestTown?.town).toBe("Solitude");
  });
});

describe("a field is never cut in the middle (WO-183 Part 3)", () => {
  // The words of a read, not the game's own text (a journal entry, a step) or a line someone says.
  const SKIP = new Set(["journal", "stages", "endings", "raw", "unsure", "evidence", "verdicts", "fixed", "objectives", "steps", "shared", "text", "words", "log", "pointers"]);
  function strings(o: unknown, path: string, out: [string, string][] = []): [string, string][] {
    if (typeof o === "string") out.push([path, o]);
    else if (Array.isArray(o)) o.forEach((x, i) => strings(x, `${path}[${i}]`, out));
    else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) if (!SKIP.has(k)) strings(v, `${path}.${k}`, out);
    return out;
  }
  const cut = (s: string) => s.split("(").length !== s.split(")").length || /\b(?:and|or|but)\.$/.test(s) || /^nearest\b/i.test(s);
  it("no quest or person read holds an unmatched bracket or ends on its joining word", () => {
    const all: [string, string][] = [];
    for (const l of questsData().lines) for (const q of l.quests) strings(q.read ?? {}, `quest ${q.name}`, all);
    for (const p of peopleData().all) strings(p.read ?? {}, `person ${p.name}`, all);
    expect(all.filter(([, s]) => cut(s)).map(([p, s]) => `${p}: ${s.slice(0, 100)}`)).toEqual([]);
  });
  it("the editor's wording stays out of the places a quest takes you", () => {
    const text = questsData().lines.flatMap((l) => l.quests.flatMap((q) => (q.read?.takesYou ?? []).map((t) => t.place)));
    expect(text.filter((s) => /\bis placed\b/i.test(s))).toEqual([]);
  });
});
