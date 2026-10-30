import { describe, expect, it } from "vitest";
import { placeByName } from "./data";
import { peopleAt } from "./people";
import { saidAbout } from "./said";

const named = (town: string) => {
  const { houses } = peopleAt(placeByName(town)!);
  return houses.flatMap((h) => h.people);
};

describe("who a town's page lists (WO-162 Part 5)", () => {
  it("lists Riverwood's Sven and Hod, and the rest who sleep there with a page of their own", () => {
    const names = named("Riverwood").map((p) => p.name);
    for (const n of ["Sven", "Hod", "Sigrid", "Embry", "Dorthe", "Alvor", "Hilde"]) expect(names).toContain(n);
  });

  it("gives Sven the chips his record has from either of his placements, and a seller a kind", () => {
    const sven = named("Riverwood").find((p) => p.name === "Sven")!;
    // A bard the record flags as a vendor is not a shopkeeper, so no "Sells" tag (WO-180 Part 6a).
    expect(sven.chips.map((c) => c.kind)).toEqual(expect.arrayContaining(["follower"]));
    expect(sven.chips.map((c) => c.kind)).not.toContain("sells");
    const alvor = named("Riverwood").find((p) => p.name === "Alvor")!;
    expect(alvor.sells).toBe("blacksmith");
  });

  it("puts the keeper the read gives first, and gives her the Rents rooms chip", () => {
    const inn = placeByName("Sleeping Giant Inn")!;
    const people = peopleAt(inn).houses.flatMap((h) => h.people);
    expect(people[0].name).toBe("Delphine");
    expect(people[0].chips.map((c) => c.text)).toContain("Rents rooms");
    expect(people.find((p) => p.name === "Orgnar")?.keeper).toBe(true);
  });

  it("lists the Greybeards at High Hrothgar with Arngeir first", () => {
    const hh = placeByName("High Hrothgar")!;
    expect(hh.type).toBe("Monastery");
    const names = peopleAt(hh).houses.flatMap((h) => h.people.map((p) => p.name));
    expect(names[0]).toBe("Arngeir");
    expect(names).toEqual(expect.arrayContaining(["Borri", "Einarth", "Wulfgar"]));
  });
});

describe("what people say about a place", () => {
  it("shows one line per text", () => {
    const words = "They build a huge stone holding cell.";
    const { all } = saidAbout([
      { kind: "book", book: "Book One", words },
      { kind: "book", book: "Book Two", words },
    ] as never);
    expect(all).toHaveLength(1);
  });
});
