import { describe, expect, it } from "vitest";
import { questsData } from "./data";
import { pageOf } from "./reads";
import { placeOnly, placePhrase, vaguePlace } from "@/lib/pages/where";
import { fieldWords } from "./reads";

/** WO-177 Part 6: a start's "who" and "where" are joined with an "in" only when the place has no preposition of its own. */
describe("every quest's starts read as sentences", () => {
  it("no 'in in', 'in around' or 'in at' however the where begins", () => {
    const bad: string[] = [];
    for (const l of questsData().lines)
      for (const q of l.quests)
        for (const s of pageOf(q).starts) {
          const where = vaguePlace(s.where) ? undefined : placeOnly(s.where);
          if (!where) continue;
          const text = `${s.who ?? ""} ${placePhrase(where, !!s.who)}`.trim();
          if (/\b(?:in|at|on|by) (?:in|at|on|by|around|near|outside|inside)\b/i.test(text)) bad.push(text);
        }
    expect(bad.slice(0, 10)).toEqual([]);
  });
  it("placePhrase puts the in where it is missing, and only there", () => {
    expect(placePhrase("Falkreath", true)).toBe("in Falkreath");
    expect(placePhrase("in a cell in Falkreath Jail", true)).toBe("in a cell in Falkreath Jail");
    expect(placePhrase("around Ivarstead", true)).toBe("around Ivarstead");
    expect(placePhrase("Falkreath", false)).toBe("In Falkreath");
    expect(placePhrase("in Falkreath", false)).toBe("In Falkreath");
  });
});

describe("field keys are said in a player's words", () => {
  it("maps a key, a dotted key and a name, and gives nothing for an unknown key", () => {
    expect(fieldWords("takesYou")).toBe("where it takes you");
    // One item for a field, whatever part of it the reader was unsure of (WO-180).
    expect(fieldWords("takesYou.hold.")).toBe("where it takes you");
    expect(fieldWords("Starts.where.")).toBe("how to start");
    expect(fieldWords("takesYou.Saarthal:")).toBe("where it takes you");
    expect(fieldWords("fooBar.baz")).toBeNull();
  });
});
