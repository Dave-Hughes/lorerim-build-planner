import { describe, expect, it } from "vitest";
import { dayAndNight, dayHours, placeOnly } from "@/lib/people/day";
import { personByName } from "@/lib/people/data";
import { placeByName } from "@/lib/places/data";
import { placeHref } from "@/lib/places/data";

/**
 * WO-185 Part 6a (PC), after Bob's reviewer checked a third of the new lines against UESP and found them wrong or unsupported: a window still open when the quest ends is After; a line
 * UESP contradicts is kept and marked; a bed or home is no move; "any hour" fills only what the specific rows leave; only a place's name is a place; and Part 7: the priory's cell finds its page.
 */
const moves = (n: string) => personByName(n)?.moves ?? [];

describe("After and During (WO-185 Part 6a)", () => {
  it("Pavo Attius is at his house after Kolskeggr Mine (the quest ends at its last stage), Drovas Relvi after Reluctant Steward, Babette at Dawnstar after Hail Sithis!", () => {
    expect(moves("Pavo Attius")).toEqual([{ when: "after", quest: "Kolskeggr Mine", place: "Pavo's House" }]);
    expect(moves("Drovas Relvi").map((m) => [m.when, m.quest])).toEqual([["after", "Reluctant Steward"]]);
    expect(moves("Babette").map((m) => [m.when, m.quest, m.place])).toContainEqual(["after", "Hail Sithis!", "Dawnstar Sanctuary"]);
    expect(moves("Babette").some((m) => m.when === "during" && m.quest === "Hail Sithis!")).toBe(false);
  });
  it("a bed or a home is no move: Delphine's inn and Ancano's dormitory", () => {
    expect(moves("Delphine").map((m) => m.quest)).not.toContain("A Blade in the Dark");
    expect(moves("Ancano")).toEqual([]);
  });
  it("the lines UESP contradicts are kept and marked, not dropped: Gaston Bellefort, Illia, Hadvar, Ralof, Esbern, Delphine's Sky Haven", () => {
    for (const [n, q] of [["Gaston Bellefort", "Destroy the Dark Brotherhood!"], ["Illia", "Repentance"], ["Hadvar", "Message to Whiterun"], ["Ralof", "Message to Whiterun"], ["Esbern", "The Throat of the World"], ["Delphine", "The Throat of the World"]] as const)
      expect(moves(n).some((m) => m.quest === q && m.maybeLoreRim), n).toBe(true);
    expect(moves("Pavo Attius").some((m) => m.maybeLoreRim)).toBe(false);
  });
});

describe("a day with an 'any hour' row and named places only (WO-185 Part 6a)", () => {
  const rows = [
    { from: "any hour", for: "24 hours", where: "a spot in Solitude" },
    { from: "8 am", for: "10 hours", where: "Temple of the Divines, Solitude" },
    { from: "10 pm", for: "8 hours", where: "her room, Hall of Attainment" },
  ];
  it("the specific rows win and 'any hour' fills only the hours they leave", () => {
    const hours = dayHours(rows)!;
    expect(hours[9]).toBe("Temple of the Divines");
    expect(hours[1]).toBe("her room"); // (the strip names the first part; By day and At night name a place: below)
    expect(hours[19]).not.toBeNull(); // (the hour no specific row names)
  });
  it("a room is the place it is in; a cellar is no place", () => {
    const isPlace = (n: string) => /Temple of the Divines|Hall of Attainment|Solitude/.test(n);
    expect(dayAndNight(rows, isPlace)).toEqual({ day: "Temple of the Divines", night: "Hall of Attainment" });
    expect(placeOnly("Cellar", isPlace)).toBeNull();
    expect(placeOnly("her room, Hall of Attainment", isPlace)).toBe("Hall of Attainment");
    expect(dayAndNight([{ from: "8 am", for: "10 hours", where: "Cellar" }], isPlace)).toEqual({ day: null, night: null });
  });
});

describe("Abbot Cosmas's place has a page (WO-185 Part 7)", () => {
  it("the cell's name finds the priory, a monastery in Coldharbour", () => {
    const p = placeByName("Holy Brothers of Marukh Priory");
    expect(p?.type).toBe("Monastery");
    expect(p?.realm).toBe("Coldharbour");
    expect(placeHref("Marukh's Underground Priory")).toBe(placeHref("Holy Brothers of Marukh Priory"));
    expect(placeHref("Marukh's Underground Priory")).toBeTruthy();
  });
});
