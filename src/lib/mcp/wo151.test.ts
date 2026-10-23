import { describe, expect, it } from "vitest";
import { placesData } from "@/lib/places/data";
import { questsData } from "@/lib/quests/data";
import { farFrom, placesNear } from "@/lib/places/suggest";

/**
 * WO-151: what suggest_places says, read as a player. Run on the real places index (Riften, levels 1 to 6, as Kyria's Act I asks)
 * and on the words each fix puts in a player's mouth.
 */

const none = { linked: [], passedBy: [] };
const riften = () => placesNear(["Riften"], 1, 6, none, 1000);
const said = JSON.stringify;

describe("distance in a player's words", () => {
  it("the walk band, never kilometres", () => {
    expect(farFrom({ town: "Riften", walk: "next to it" })).toBe("next to Riften");
    expect(farFrom({ town: "Riften", walk: "a short walk" })).toBe("a short walk from Riften");
    expect(farFrom({ town: "Riften", walk: "half a day" })).toBe("half a day from Riften");
    expect(farFrom({ town: "Riften", walk: "a long day's road" })).toBe("a long day's road from Riften");
    expect(farFrom({ town: "Riften" })).toBe("near Riften");
  });
  it("no place the door lists, in any town, says a distance in kilometres", () => {
    const towns = [...new Set(placesData().places.flatMap((p) => (p.nearestTown ? [p.nearestTown.town] : [])))];
    for (const t of towns) for (const p of placesNear([t], 1, 10, none, 1000)) expect(said(p), `${p.place} near ${t}`).not.toMatch(/\bkm\b|\d km/i);
  });
  it("the places still come nearest first", () => {
    const km = (name: string) => placesData().places.find((p) => p.name === name)!.nearestTown!.km;
    const out = riften().filter((p) => "pointers" in p && p.pointers.length);
    const kms = out.map((p) => km(p.place));
    expect(kms).toEqual([...kms].sort((a, b) => a - b));
  });
});

describe("no guild halls or friendly places as suggestions", () => {
  it("the Thieves Guild Headquarters is a stop, not a place to clear", () => {
    expect(riften().map((p) => p.place)).not.toContain("Thieves Guild Headquarters");
  });
  it("no guild hall or anything inside a town comes back from any town", () => {
    const inside = new Set(placesData().places.filter((p) => p.type === "Guild" || p.inTown).map((p) => p.name));
    const towns = [...new Set(placesData().places.flatMap((p) => (p.nearestTown ? [p.nearestTown.town] : [])))];
    for (const t of towns) for (const p of placesNear([t], 1, 10, none, 1000)) expect(inside.has(p.place), `${p.place} near ${t}`).toBe(false);
  });
  it("an Orc stronghold stays in as a destination, with no enemies, no boss and no fit, and the people's own words", () => {
    const l = riften().find((p) => p.place === "Largashbur")!;
    expect(l).toBeDefined();
    for (const k of ["enemies", "levels", "boss", "when", "fitNote", "clearXp"]) expect(l, k).not.toHaveProperty(k);
    expect((l as { welcome: string }).welcome).toBe(
      `The Orcs of Largashbur live here. At the door they say: "This is our stronghold. Here, we are free to live as Malacath intended, away from the prying eyes of the Nords. You're not an Orc, or Blood-Kin, so stay out. We only help our own."`,
    );
  });
  it("every stronghold, in every town, has the same shape", () => {
    const towns = [...new Set(placesData().places.flatMap((p) => (p.nearestTown ? [p.nearestTown.town] : [])))];
    let seen = 0;
    for (const t of towns) for (const p of placesNear([t], 1, 10, none, 1000)) if (p.type === "Orc stronghold") {
      seen++;
      expect(p).toHaveProperty("welcome");
      expect(p).not.toHaveProperty("enemies");
      expect(p).not.toHaveProperty("boss");
    }
    expect(seen).toBeGreaterThan(0);
  });
});

describe("no helper names in questGoesThere", () => {
  it("Riften's list names neither the guild's trophy enabler nor a vendor script", () => {
    expect(said(riften())).not.toMatch(/Radiant Guild Trophy Enabler|BCSLL|Vendor Quest/);
  });
  it("no handler, helper or vendor script anywhere; every name is a quest the planner lists", () => {
    const listed = new Set<string>();
    for (const l of questsData().lines) for (const q of l.quests) listed.add(q.name);
    const towns = [...new Set(placesData().places.flatMap((p) => (p.nearestTown ? [p.nearestTown.town] : [])))];
    for (const t of towns)
      for (const p of placesNear([t], 1, 10, none, 1000)) for (const q of (p as { questGoesThere?: string[] }).questGoesThere ?? []) {
        expect(listed.has(q), `${q} at ${p.place}`).toBe(true);
        expect(q).not.toMatch(/\b(handlers?|helpers?|pointer|hook|enabler|vendor)\b|_/i);
      }
  });
  it("a real quest still shows: Trinity Restored at Nightingale Hall", () => {
    expect((riften().find((p) => p.place === "Nightingale Hall") as { questGoesThere: string[] }).questGoesThere).toContain("Trinity Restored");
  });
});

describe("pointers with no speaker", () => {
  const pointers = (name: string) => riften().find((x) => x.place === name)!.pointers as { who?: string; says: string; inQuest?: string }[];
  it("a line from the town's own dialogue quest is people in that town, without the dialogue quest named", () => {
    const g = pointers("Faldar's Tooth").find((x) => x.who === "people in Riften")!;
    expect(g.says).toMatch(/^City got attacked once/);
    expect(g).not.toHaveProperty("inQuest");
  });
  it("a quest's line with no speaker, or a follower's comment, is left out: Forelhost's Valmir line and Crystaldrift Cave's \"Fancy a trip?\"", () => {
    expect(said(pointers("Forelhost"))).not.toContain("Return to me here once you've obtained the mask");
    expect(said(pointers("Crystaldrift Cave"))).not.toContain("Fancy a trip");
  });
  it("a place left with no line says so, and no place anywhere says someone the line doesn't name", () => {
    expect(riften().find((x) => x.place === "Lost Prospect Mine")).toHaveProperty("noPointer");
    for (const t of [...new Set(placesData().places.flatMap((x) => (x.nearestTown ? [x.nearestTown.town] : [])))]) {
      const out = placesNear([t], 1, 10, none, 1000);
      expect(said(out), t).not.toMatch(/someone the line doesn't name/);
      for (const p of out) for (const x of p.pointers as { who?: string; book?: string }[]) expect(!!x.who || !!x.book, `${p.place} near ${t}`).toBe(true);
    }
  });
  it("a gossip line names the town its dialogue quest belongs to, not the place's nearest town", () => {
    const names = new Set<string>();
    for (const t of ["Riften", "Whiterun", "Solitude"]) for (const p of placesNear([t], 1, 10, none, 1000)) for (const x of p.pointers as { who?: string }[]) if (x.who?.startsWith("people in ")) names.add(x.who);
    expect([...names].sort()).toEqual(expect.arrayContaining(["people in Riften", "people in Solitude", "people in Whiterun"]));
  });
  it("a named speaker stays named", () => {
    const n = riften().find((x) => x.place === "Nightingale Hall")!;
    expect(n.pointers[0]).toMatchObject({ who: "Karliah" });
  });
});

describe("levels not checked yet", () => {
  it("a place with no levels in the data says so in those words, in its levels and its fit", () => {
    for (const name of ["Fallowstone Cave", "Sanctum of Malacath", "The Thief Doomstone"]) {
      const p = riften().find((x) => x.place === name)!;
      expect(p, name).toMatchObject({ levels: "not checked yet", when: "levels not checked yet" });
      expect(p).not.toHaveProperty("enemies");
    }
  });
  it("a place with levels in the data passes them through", () => {
    expect(riften().find((x) => x.place === "Lost Prospect Mine")).toMatchObject({ levels: "6 to 50" });
  });
});
