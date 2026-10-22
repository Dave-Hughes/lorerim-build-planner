import { describe, expect, it } from "vitest";
import { FactsError, NO_MATCH, getQuest, searchFacts } from "./facts";

/** WO-133: a quest found by what players call it, not only its name. */
describe("search finds a quest by what's in it (WO-133)", () => {
  const first = (q: string) => searchFacts(q).hits.find((h) => h.kind === "quest");
  const names = (q: string) => searchFacts(q).hits.map((h) => h.name);

  it("finds Running Wild by the horse, its name in the records and the community's", () => {
    expect(searchFacts("Palonimo").hits[0]).toMatchObject({ kind: "quest", id: "0WRHorseQ", name: "Running Wild" });
    expect(searchFacts("Palonimo").hits[0].why).toBe("someone in it: Palonimo");
    expect(first("white horse")).toMatchObject({ name: "Running Wild", why: "what players call it: white horse" });
    expect(names("palomino horse whiterun")).toContain("Running Wild");
    expect(names("the horse quest")).toContain("Running Wild");
    expect(names("the horse in Whiterun")).toContain("Running Wild");
    expect(names("horse quest whiterun")).toContain("Running Wild");
  });

  it("still puts a name match first", () => {
    expect(searchFacts("Running Wild").hits[0]).toMatchObject({ kind: "quest", name: "Running Wild" });
    expect(searchFacts("Running Wild").hits[0].why).toBeUndefined();
    expect(searchFacts("Haggling").hits[0]).toMatchObject({ kind: "perk", name: "Haggling" });
  });

  it("finds by the note that starts it, an objective and an ending, saying which", () => {
    expect(first("Palonimo Mare")?.why).toBe("what starts it: The Palonimo Mare");
    expect(searchFacts("imperial saddle").hits.find((h) => h.name === "Running Wild")?.why).toMatch(/^an ending: I went to Joslin/);
  });

  it("says plainly when nothing matches, and sends the assistant to the player, not the web", () => {
    expect(searchFacts("zzqxv").hits).toEqual([]);
    expect(searchFacts("zzqxv").note).toBe(NO_MATCH);
    expect(() => getQuest({ name: "zzqxv" })).toThrow(FactsError);
    expect(() => getQuest({ name: "zzqxv" })).toThrow(/Ask the player where they saw it or what it gives/);
  });

  it("get_quest by a name that isn't one answers for the quest it finds, with what matched", () => {
    const a = getQuest({ name: "Palonimo" });
    expect(a.found).toEqual({ asked: "Palonimo", is: "Running Wild", because: "someone in it: Palonimo" });
    expect(a.quest.name).toBe("Running Wild");
  });
});
