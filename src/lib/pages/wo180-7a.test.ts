import { describe, expect, it } from "vitest";
import { placesData } from "@/lib/places/data";
import { peopleAt, shopsOf } from "@/lib/places/people";
import { questsData } from "@/lib/quests/data";

/**
 * WO-180 Part 7a (PC): a shop is the vendor faction's own data. The sellers below were checked against UESP's city pages (their "People" tables, where a dagger or "[a]" means
 * "only sells goods at the market") on 30 Oct: 14 stalls and 12 shops across Whiterun, Solitude, Windhelm, Riften and Markarth.
 */
const city = (n: string) => placesData().places.find((p) => p.name === n && p.type === "City")!;
const shops = (n: string) => shopsOf(peopleAt(city(n)).houses);
const STALL = "stall in the market";

describe("shops from the vendor factions (WO-180 Part 7a)", () => {
  it("UESP's market-only sellers have a stall in the market, in all five cities", () => {
    const stalls: [string, string][] = [
      ["Whiterun", "Carlotta Valentia"], ["Whiterun", "Fralia Gray-Mane"], ["Whiterun", "Anoriath"],
      ["Solitude", "Addvar"], ["Solitude", "Evette San"], ["Solitude", "Jala"],
      ["Windhelm", "Aval Atheron"], ["Windhelm", "Hillevi Cruel-Sea"], ["Windhelm", "Niranye"],
      ["Riften", "Brand-Shei"], ["Riften", "Grelka"], ["Riften", "Marise Aravel"],
      ["Markarth", "Kerah"], ["Markarth", "Hogni Red-Arm"],
    ];
    for (const [c, who] of stalls) expect(shops(c).find((s) => s.keeper.name === who)?.name, `${c}: ${who}`).toBe(`${who}'s ${STALL}`);
  });
  it("UESP's shops are shops, named by the building, with the keeper who is there", () => {
    const buildings: [string, string][] = [
      ["Whiterun", "Belethor's General Goods"], ["Whiterun", "Arcadia's Cauldron"], ["Whiterun", "Warmaiden's"],
      ["Solitude", "Bits and Pieces"], ["Solitude", "Radiant Raiment"], ["Solitude", "Angeline's Aromatics"],
      ["Windhelm", "Sadri's Used Wares"], ["Windhelm", "The White Phial"],
      ["Riften", "Elgrim's Elixirs"], ["Riften", "The Pawned Prawn"],
      ["Markarth", "Arnleif and Sons Trading Company"], ["Markarth", "The Hag's Cure"],
    ];
    for (const [c, name] of buildings) expect(shops(c).map((s) => s.name), `${c}: ${name}`).toContain(name);
    expect(shops("Whiterun").find((s) => s.name === "Belethor's General Goods")?.keeper.name).toBe("Belethor");
  });
  it("a home is never the shop: Beirand's blacksmith is Solitude Blacksmith, not Bits and Pieces where he sleeps; Falion works from his house", () => {
    expect(shops("Solitude").find((s) => s.name === "Bits and Pieces")?.keeper.name).toBe("Sayma");
    expect(shops("Solitude").map((s) => s.name)).toContain("Solitude Blacksmith");
    const morthal = placesData().places.find((p) => p.name === "Morthal")!;
    const names = shopsOf(peopleAt(morthal).houses).map((s) => s.name);
    expect(names).toContain("Falion's spell shop in Falion's House");
    expect(names).not.toContain("Falion's House");
  });
  it("what it sells is what its vendor list takes, in a word players use", () => {
    const kind = (c: string, who: string) => shops(c).find((s) => s.keeper.name === who)?.kind;
    expect(kind("Windhelm", "Audmund")).toBe("weapons");
    expect(kind("Markarth", "Endon")).toBe("silversmith");
    expect(kind("Markarth", "Anton Virane")).toBe("food");
    expect(kind("Markarth", "Ghorza gra-Bagol")).toBe("blacksmith");
    expect(kind("Markarth", "Bothela")).toBe("apothecary");  // (the keeper; Muiri is her assistant: WO-180 Part 8)
    expect(kind("Whiterun", "Fralia Gray-Mane")).toBe("jewelry");
  });
  it("a shop has its hours when it closes, and no mod's nameless 'Worker' is a shopkeeper", () => {
    expect(shops("Whiterun").find((s) => s.name === "Belethor's General Goods")?.hours).toBe("8 am to 8 pm");
    for (const c of ["Whiterun", "Solitude", "Windhelm", "Riften", "Markarth"]) {
      expect(shops(c).some((s) => s.keeper.name === "Worker"), c).toBe(false);
      expect(shops(c).every((s) => s.hours !== "midnight to midnight"), c).toBe(true);
    }
  });
  it("a smith in the open works at a forge, not a stall", () => {
    expect(shops("Whiterun").find((s) => s.keeper.name === "Eorlund Gray-Mane")?.name).toBe("The Skyforge");
  });
});

describe("a story quest says its person, and a role is never a name (WO-180 Part 7a)", () => {
  const quest = (edid: string) => questsData().lines.flatMap((l) => l.quests).find((q) => q.edid === edid)!;
  it("the steps of A False Front, Rare Gifts, Blood on the Ice and The Frozen Heart say the courier, the steward, Othriel and the requested item", () => {
    expect(quest("CWMission03").objectives.slice(0, 2)).toEqual(["Find the enemy courier", "Retrieve the enemy courier's package"]);
    expect(quest("Favor110Windhelm").objectives).toEqual(["Bring the rare item he asks for to Torbjorn"]);  // (WO-180 Part 9a)
    expect(quest("MS11").objectives.filter((o) => /steward/.test(o)).length).toBeGreaterThan(2);
    expect(quest("ksws07MainQuest").objectives.at(-1)).toBe("Kill Othriel.");
    for (const e of ["CWMission03", "Favor110Windhelm", "MS11", "MS11b", "ksws07MainQuest"]) expect(JSON.stringify([quest(e).objectives, quest(e).read?.steps]), e).not.toMatch(/job names|who gave you the job/);
  });
  it("no People list names someone by a role the job fills", () => {
    const bad = questsData().lines.flatMap((l) => l.quests.flatMap((q) => (q.read?.people ?? []).filter((p) => /^(the )?(quest giver|target|captive|troublemaker|victim|contact)$/i.test(p.name)).map((p) => `${q.name}: ${p.name}`)));
    expect(bad).toEqual([]);
    const names = (n: string) => (questsData().lines.flatMap((l) => l.quests).find((q) => q.name === n)?.read?.people ?? []).map((p) => p.name);
    expect(names("Hunting the Monster")).toContain("A Dawnguard member who gives out jobs");
    expect(names("Rescue Mission")).toContain("The person you're sent to rescue");
    expect(names("Hired Muscle")).toContain("The troublemaker the job picks");
    const mathies = names("Ill Met By Moonlight");
    expect(mathies.filter((n) => /Mathies/.test(n))).toEqual(["Mathies"]);
    expect(mathies).toContain("Indara Caerellia");
  });
});
