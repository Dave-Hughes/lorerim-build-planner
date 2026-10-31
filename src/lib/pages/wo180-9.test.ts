import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { peopleData, personByName, personBySlug } from "@/lib/people/data";
import { questsOfPerson } from "@/lib/people/quests";
import { placesData } from "@/lib/places/data";
import { peopleAt, shopsOf } from "@/lib/places/people";
import { questsData } from "@/lib/quests/data";

/**
 * WO-180 Part 9a (PC): the same-name split gives each person their own quests, the bare address goes to the one players mean, the nameless of one name stay one page, Rare Gifts is
 * said the same on the text the page shows, Endon and Sofie and the inns are as UESP and the town say.
 */
const named = (n: string) => peopleData().all.filter((p) => p.name === n);
const of = (p: ReturnType<typeof personByName>) => questsOfPerson(p!).map((q) => q.name);
const city = (n: string) => placesData().places.find((p) => p.name === n && ["City", "Town", "Settlement"].includes(p.type))!;

describe("each of two people with one name has their own quests (WO-180 Part 9a)", () => {
  it("Wilhelm of Windhelm has the warehouse's A Simple Delivery and none of the Ivarstead innkeeper's; Wilhelm of Ivarstead the reverse", () => {
    const wind = named("Wilhelm").find((p) => p.inTown === "Windhelm")!;
    const ivar = named("Wilhelm").find((p) => p.inTown === "Ivarstead")!;
    expect(of(wind)).toContain("A Simple Delivery");
    expect(of(wind)).not.toContain("Lifting the Shroud");
    expect(of(ivar)).not.toContain("A Simple Delivery");
    expect(of(ivar).length).toBeGreaterThan(0);
  });
  it("Brurid of Windhelm gives no Infiltration; Adara of Markarth is nobody's escort to the College; Frida and Jacob keep their own", () => {
    expect(of(named("Brurid").find((p) => p.inTown === "Windhelm")!)).not.toContain("Infiltration");
    expect(of(named("Adara").find((p) => p.inTown === "Markarth")!)).not.toContain("Gretolde's daughter");
    const allQuests = (n: string) => named(n).map((p) => of(p));
    for (const n of ["Frida", "Jacob"]) {
      const lists = allQuests(n).map((l) => new Set(l));
      for (let i = 0; i < lists.length; i++) for (let j = i + 1; j < lists.length; j++) expect([...lists[i]].filter((x) => lists[j].has(x)), n).toEqual([]); // no quest on two of them
    }
  });
});

describe("the bare address goes to the one players mean (WO-180 Part 9a)", () => {
  it("/people/sven is Riverwood's Sven, the follower and the quest's own; Kynesgrove's takes his town", () => {
    const sven = personBySlug("sven")!;
    expect(sven.inTown).toBe("Riverwood");
    expect(sven.label).toBe("Sven (Riverwood)");
    expect(named("Sven").find((p) => p.inTown === "Kynesgrove")?.slug).not.toBe("sven");
    expect(personByName("Sven")?.inTown).toBe("Riverwood");
  });
  it("Wilhelm of Ivarstead (vanilla, the quests' own) has the bare address", () => {
    expect(personBySlug("wilhelm")?.inTown).toBe("Ivarstead");
  });
});

describe("nameless names stay one page (WO-180 Part 9a)", () => {
  it("the Dark Brotherhood Initiate, an Attendant, a Worker are one page each", () => {
    for (const n of ["Dark Brotherhood Initiate", "Attendant", "Worker"]) expect(named(n).length, n).toBeLessThanOrEqual(1);
    expect(peopleData().all.filter((p) => /Dark Brotherhood Initiate/.test(p.name)).length).toBeLessThanOrEqual(1);
  });
});

describe("Rare Gifts, said on the text the page shows (WO-180 Part 9a)", () => {
  const six = questsData().lines.flatMap((l) => l.quests).filter((q) => /^Favor110[A-Z]/.test(q.edid));
  const pronoun: Record<string, string> = { Dawnstar: "he", Falkreath: "he", Morthal: "she", Solitude: "he", Whiterun: "she", Windhelm: "he" };
  it("every string of all six pages says the rare item the giver asks for, with the giver's pronoun, and none the requested item", () => {
    expect(six.length).toBe(6);
    for (const q of six) {
      const text = JSON.stringify(q);
      const they = pronoun[q.edid.replace("Favor110", "")];
      expect(text, q.edid).not.toMatch(/requested item|one of a rare|rare item brought to them|bring one to them|ask you to find one of/);
      expect(q.objectives[0], q.edid).toMatch(new RegExp(`^Bring the rare item ${they} asks for to \\w`));
      expect(q.read?.steps?.[0]?.objectives?.[0], q.edid).toMatch(new RegExp(`^Bring the rare item ${they} asks for to \\w`));
    }
  });
});

describe("Endon, Sofie and the inns (WO-180 Part 9a)", () => {
  it("Endon's Sells line has none of the editors' words; his page says he sells from his house, as Markarth's line does", () => {
    const e = personByName("Endon")!;
    expect(e.read?.sells).not.toMatch(/buy list|shared|jeweller/);
    expect(e.shop?.cell).toBe("Endon's House");
    const line = shopsOf(peopleAt(city("Markarth")).houses, "Markarth").find((s) => s.keeper.name === "Endon")!;
    expect(line.cell).toBe(e.shop?.cell);
  });
  it("Sofie sells flowers on the streets, not from a stall in the market", () => {
    const s = shopsOf(peopleAt(city("Windhelm")).houses, "Windhelm").find((x) => x.keeper.name === "Sofie")!;
    expect(s.name).toBe("Sofie's basket on the streets");
    expect(s.name).not.toMatch(/market/);
  });
  it("an inn names the one who rents the rooms: Orgnar, Corpulus Vinius, Keerava", () => {
    const keeperAt = (inn: string, town: string) => {
      const h = peopleAt(city(town)).houses.find((x) => x.name === inn)!;
      return h.people[0].name;
    };
    expect(keeperAt("Sleeping Giant Inn", "Riverwood")).toBe("Orgnar");
    expect(keeperAt("The Winking Skeever", "Solitude")).toBe("Corpulus Vinius");
    expect(keeperAt("The Bee and Barb", "Riften")).toBe("Keerava");
  });
  it("no line has two brackets in a row (the shop's cell and its assistants are one bracket)", () => {
    const src = readFileSync("src/components/places/place-town.tsx", "utf8");
    expect(src).toMatch(/with \{staffLinks\(s\)\}\)/);
    expect(src).toMatch(/!\(s\.noun && s\.cell\)/);
  });
});
