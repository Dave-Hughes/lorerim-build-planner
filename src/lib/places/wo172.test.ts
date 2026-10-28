import { describe, expect, it } from "vitest";
import { isSharedName, placeBySlug, placeByName, placeHref, placeHrefOf, placeLabel, placesData, placesNamed, placesSharingSlug } from "./data";
import { inFrame, mapEntry, mapPins } from "./map";
import { mapPlaces, placeDrawer } from "@/lib/map/data";
import { linkNames } from "@/lib/pages/link-names";
import { ownPlaceNames, placeNames } from "@/lib/pages/names";
import { dangerOf, dangerParts } from "@/lib/quests/reads";
import { searchEverything } from "@/lib/search/everything";

const sharedNames = () => [...placesData().named.values()].filter((g) => g.length > 1);

describe("places that share a name are separate places (WO-172)", () => {
  it("gives every place its own address", () => {
    const hrefs = placesData().places.map((p) => placeHrefOf(p));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const p of placesData().places) expect(placeBySlug(placeHrefOf(p).replace("/places/", ""))).toBe(p);
  });

  it("adds the hold, or the town for a building inside one", () => {
    const camp = placesNamed("Imperial Military Camp").find((p) => p.hold === "The Reach")!;
    expect(placeHrefOf(camp)).toBe("/places/imperial-military-camp-the-reach");
    expect(placeLabel(camp)).toBe("Imperial Military Camp, the Reach");
    const hall = placesNamed("Hall of the Dead").find((p) => p.inTown === "Whiterun")!;
    expect(placeHrefOf(hall)).toBe("/places/hall-of-the-dead-whiterun");
    expect(placeLabel(hall)).toBe("Hall of the Dead, Whiterun");
    expect(placeByName("Hall of the Dead, Whiterun")).toBe(hall);
  });

  it("keeps the old shared address as a list of the places with the name", () => {
    expect(isSharedName("Imperial Military Camp")).toBe(true);
    expect(placeBySlug("imperial-military-camp")).toBeNull();
    expect(placesSharingSlug("imperial-military-camp")).toHaveLength(8);
    expect(placeHref("Imperial Military Camp")).toBe("/places/imperial-military-camp");
    expect(placeByName("Imperial Military Camp")).toBeNull();
  });

  it("names which one wherever a shared name is shown", () => {
    for (const group of sharedNames()) for (const p of group) expect(placeLabel(p).startsWith(`${p.name}, `)).toBe(true);
    const labels = sharedNames().flat().map(placeLabel);
    expect(new Set(labels).size).toBe(labels.length);
    const hits = searchEverything("imperial military camp", 12).places.map((h) => h.name);
    expect(hits).toContain("Imperial Military Camp, the Reach");
    expect(new Set(searchEverything("imperial military camp", 12).places.map((h) => h.href)).size).toBe(hits.length);
  });

  it("draws one pin for one place, each at its own address, inside the map's frame", () => {
    const m = mapEntry()!;
    const pins = mapPins();
    expect(new Set(pins.map((p) => p.href)).size).toBe(pins.length);
    for (const p of pins) expect(inFrame(m, p.px, p.py), p.name).toBe(true);
    const places = mapPlaces();
    expect(new Set(places.map((p) => p.slug)).size).toBe(places.length);
    expect(places.filter((p) => p.name.startsWith("Imperial Military Camp"))).toHaveLength(8);
    expect(places.some((p) => p.name === "Campsite" && !inFrame(m, p.px, p.py))).toBe(false);
  });

  it("opens the drawer of the camp that was picked", () => {
    const reach = placeDrawer("imperial-military-camp-the-reach")!;
    const winterhold = placeDrawer("imperial-military-camp-winterhold")!;
    expect(reach.name).toBe("Imperial Military Camp, the Reach");
    expect(winterhold.name).toBe("Imperial Military Camp, Winterhold");
    expect(reach.gettingThere).not.toBe(winterhold.gettingThere);
  });

  it("links a shared name in a sentence only when the sentence says which", () => {
    const links = (text: string) => linkNames(text, placeNames()).filter((x) => x.href).map((x) => x.href);
    expect(links("Take the letter to the Hall of the Dead in Whiterun.")).toEqual(["/places/hall-of-the-dead-whiterun"]);
    expect(links("Find the Imperial Military Camp, the Reach.")).toEqual(["/places/imperial-military-camp-the-reach"]);
    expect(links("Go to the Hall of the Dead.")).toEqual([]);
    expect(links("Report to the Imperial Military Camp.")).toEqual([]);
  });

  it("links a shared name on the page of the quest that goes to just one of them", () => {
    const own = placesData().places.find((p) => isSharedName(p.name) && p.quests?.length);
    if (!own) return;
    const mine = ownPlaceNames([own.quests![0]]);
    expect(mine.every((n) => placesNamed(n.text).length > 1)).toBe(true);
  });

  it("says a camp's levels after the war, not the one guard's", () => {
    const sons = placesNamed("Sons of Skyrim Military Camp").find((p) => p.hold === "The Reach")!;
    expect(dangerOf(sons)).toMatch(/^after the war: level 4 to 27/);
    expect(dangerOf(sons)).not.toMatch(/up to 2\b/);
    expect(dangerParts(sons)).toMatchObject({ foes: "After the war: level 4 to 27" });
    expect(placeDrawer("sons-of-skyrim-military-camp-the-reach")!.danger).toBe("Level 4 to 27, after the war");
  });
});
