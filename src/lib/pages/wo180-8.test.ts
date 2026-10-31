import { describe, expect, it } from "vitest";
import { peopleData, personByName } from "@/lib/people/data";
import { placesData } from "@/lib/places/data";
import { peopleAt, shopsOf, type House } from "@/lib/places/people";
import { questsData } from "@/lib/quests/data";

/**
 * WO-180 Part 8 (PC): the shops against UESP's Merchants table (Whiterun, Solitude, Windhelm, Riften, Markarth, Winterhold; 30 Oct), and the causes of the 22 the reviewer found:
 * one vendor faction is one shop with one keeper, the urchins are not shops, a seller with no town placement still has hers, the kind is what the list is about,
 * two people with one name are two people, and the two story fills and the People sections say it.
 */
const town = (n: string) => placesData().places.find((p) => p.name === n && ["City", "Town", "Settlement"].includes(p.type))!;
const shops = (n: string) => shopsOf(peopleAt(town(n)).houses, n);
const by = (n: string, keeper: string) => shops(n).find((s) => s.keeper.name === keeper);

describe("one vendor faction is one shop, and it has one keeper (WO-180 Part 8)", () => {
  it("separate factions in one room are separate shops: the Ragged Flagon's smiths and apothecary, the College's four spell sellers, Understone Keep's two smiths", () => {
    for (const k of ["Arnskar Ember-Master", "Syndus", "Vanryth Gatharian", "Herluin Lothaire"]) expect(by("Riften", k)?.cell, k).toBe("The Ragged Flagon");
    expect(by("Riften", "Herluin Lothaire")?.kind).toBe("apothecary");
    expect(by("Riften", "Syndus")?.kind).toBe("blacksmith");
    for (const k of ["Colette Marence", "Drevis Neloren", "Faralda", "Phinis Gestor"]) expect(by("Winterhold", k)?.cell, k).toBe("Hall of Countenance");
    expect(by("Markarth", "Ghorza gra-Bagol")?.cell).toBe("Understone Keep");
    expect(by("Markarth", "Moth gro-Bagol")?.cell).toBe("Understone Keep");
  });
  it("one faction is one shop even in the open: Hermir and Oengul, Seren and Rustleif, Vittoria Vici and Aquillius Aeresius", () => {
    expect(by("Windhelm", "Oengul War-Anvil")?.staff.map((x) => x.name)).toEqual(["Hermir Strong-Heart"]);
    expect(by("Windhelm", "Hermir Strong-Heart")).toBeUndefined();
    expect(by("Dawnstar", "Rustleif")?.staff.map((x) => x.name)).toEqual(["Seren"]);
    expect(by("Solitude", "Vittoria Vici")?.staff.map((x) => x.name)).toEqual(["Aquillius Aeresius"]);
  });
  it("the keeper is the faction's owner, not whoever sleeps there: Bothela, Beirand, Adrianne, Lisbet (UESP: 'Lisbet (Imedhnain)'), Nurelion, Angeline", () => {
    expect(by("Markarth", "Bothela")?.name).toBe("The Hag's Cure");
    expect(by("Markarth", "Bothela")?.staff.map((x) => x.name)).toEqual(["Muiri"]);
    expect(by("Solitude", "Beirand")?.name).toBe("Solitude Blacksmith");
    expect(by("Solitude", "Beirand")?.staff.map((x) => x.name)).toEqual(["Heimvar"]);
    expect(by("Whiterun", "Adrianne Avenicci")?.staff.map((x) => x.name)).toEqual(["Ulfberth War-Bear"]);
    expect(by("Markarth", "Lisbet")?.name).toBe("Arnleif and Sons Trading Company");
    expect(by("Windhelm", "Nurelion")?.staff.map((x) => x.name)).toEqual(["Quintus Navale"]);
    expect(by("Solitude", "Angeline Morrard")?.staff.map((x) => x.name)).toEqual(["Vivienne Onis"]);
  });
});

describe("orphans and urchins are not shops (WO-180 Part 8)", () => {
  it("Kidmer's adoptable children sell nothing and are no stall in a town with no market; Sofie, who has the list as her own, is at the Windhelm gate", () => {
    for (const [name, c] of [["Elandra", "Falkreath"], ["Brundil", "Markarth"], ["Urshug", "Winterhold"], ["Terlan", "Windhelm"]] as const) {
      const p = personByName(name);
      expect(p?.shop, name).toBeUndefined();
      expect(p?.sells, name).toBeUndefined();
      expect(shops(c).some((s) => s.keeper.name === name || s.staff.some((x) => x.name === name)), `${c}: ${name}`).toBe(false);
    }
    expect(by("Windhelm", "Sofie")?.kind).toBe("flowers");
  });
  it("never a stall in a town whose worldspace is not the chest's", () => {
    const people = [...shops("Riften"), ...shops("Windhelm")];
    expect(people.length).toBeGreaterThan(5);
    const win = peopleAt(town("Windhelm")).houses;
    const stalls: House[] = [{ name: "Windhelm", href: null, people: win.flatMap((h) => h.people).filter((p) => p.shop?.stall) }];
    expect(shopsOf(stalls, "Windhelm").length).toBeGreaterThan(0);
    expect(shopsOf(stalls, "Falkreath")).toEqual([]);
  });
  it("Adara is Kerah's child and no seller; the stall is Kerah's", () => {
    expect(by("Markarth", "Kerah")?.name).toBe("Kerah's stall in the market");
    expect(personByName("Adara (Markarth)")).toBeNull();
    expect(peopleData().all.find((p) => p.name === "Adara" && p.inTown === "Markarth")?.shop).toBeUndefined();
  });
});

describe("a seller with no town placement still has a shop where the chest stands (WO-180 Part 8)", () => {
  it("Madesi's stall is in Riften's market", () => {
    expect(by("Riften", "Madesi")?.name).toBe("Madesi's stall in the market");
    expect(by("Riften", "Madesi")?.kind).toBe("jewelry");
  });
  it("Drevis Neloren is in Winterhold's shops", () => {
    expect(by("Winterhold", "Drevis Neloren")?.kind).toBe("spells");
  });
});

describe("the kind is what the list buys (WO-180 Part 8)", () => {
  it("the Drunken Huntsman is a fletcher; Anoriath's list is hunting goods; Sofie's is flowers; Carlotta's is food", () => {
    expect(by("Whiterun", "Elrindir")?.kind).toBe("fletcher");
    expect(by("Whiterun", "Anoriath")?.kind).toBe("hunting goods");
    expect(by("Windhelm", "Sofie")?.kind).toBe("flowers");
    expect(by("Whiterun", "Carlotta Valentia")?.kind).toBe("food");
  });
});

describe("people merged by name are separate (WO-180 Part 8)", () => {
  it("Wilhelm of Windhelm and Wilhelm of Ivarstead are two people with a page each, linked from their own towns", () => {
    const both = peopleData().all.filter((p) => p.name === "Wilhelm");
    expect(both.map((p) => p.label).sort()).toEqual(["Wilhelm (Ivarstead)", "Wilhelm (Windhelm)"]);
    expect(new Set(both.map((p) => p.slug)).size).toBe(2);
    expect(by("Windhelm", "Wilhelm")?.keeper.href).toBe(`/people/${both.find((p) => p.inTown === "Windhelm")!.slug}`);
  });
  it("Adara of Markarth is not the girl at Stonehills, and Brurid of the Iron Halls is not the wizard at Treva's Watch", () => {
    for (const name of ["Adara", "Brurid"]) {
      const two = peopleData().all.filter((p) => p.name === name);
      expect(two.length, name).toBe(2);
      expect(new Set(two.map((p) => p.slug)).size, name).toBe(2);
      expect(two.every((p) => p.label), name).toBe(true);
    }
  });
  it("the many of one nameless name are still one page (a Worker, a Courier)", () => {
    expect(peopleData().all.filter((p) => p.name === "Worker").length).toBeLessThanOrEqual(1);
  });
});

describe("a person page and their town agree (WO-180 Part 8)", () => {
  it("Carlotta sells food and her page has no 'misc'; Endon is a silversmith who trades from his house", () => {
    const c = personByName("Carlotta Valentia")!;
    expect(c.shop?.kind).toBe("food");
    expect(JSON.stringify(c.read)).not.toMatch(/'misc'|‘misc’/);
    const e = by("Markarth", "Endon");
    expect(e?.kind).toBe("silversmith");
    expect(e?.cell).toBe("Endon's House");
  });
});

describe("two fills, by name, and the People sections (WO-180 Part 8)", () => {
  const all = questsData().lines.flatMap((l) => l.quests);
  it("Blood on the Ice reads 'Talk to Jorleif, the steward (Captain Lonely-Gale if the Empire holds Windhelm)'", () => {
    const text = "Jorleif, the steward (Captain Lonely-Gale if the Empire holds Windhelm)";
    const steps = all.find((q) => q.edid === "MS11")!.objectives.filter((o) => o.includes("Jorleif"));
    expect(steps.length).toBeGreaterThan(2);
    for (const s of steps) expect(s).toContain(text);
  });
  it("Rare Gifts reads 'Bring one rare item to <person>' on all six pages", () => {
    const six = all.filter((q) => /^Favor110[A-Z]/.test(q.edid));
    expect(six.length).toBe(6);
    for (const q of six) expect(q.objectives[0], q.edid).toMatch(/^Bring one rare item to \w/);
  });
  it("Ill Met By Moonlight gives each of a group its own words, and Hunting the Monster's contact is not described by itself", () => {
    const ill = all.find((q) => q.name === "Ill Met By Moonlight")!.read!.people!;
    expect(ill.find((p) => p.name === "Indara Caerellia")?.role).toMatch(/^one of the dead girl's parents/);
    expect(ill.find((p) => p.name === "Rissing")?.role).toMatch(/^one of the hunters/);
    const hunt = all.find((q) => q.name === "Hunting the Monster")!.read!.people!;
    expect(hunt.find((p) => /last known contact/.test(p.name))?.role).toBeUndefined();
  });
});
