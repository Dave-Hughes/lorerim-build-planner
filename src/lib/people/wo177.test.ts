import { describe, expect, it } from "vitest";
import { peopleData } from "./data";
import { questsData } from "@/lib/quests/data";
import { mapStrings } from "@/lib/pages/player-words";

/** WO-177 Part 5: the reads are mended where they load, so no page says "in her own house, Bryling's House". */
const REPEATED = /\b(?:his|her|their)(?: own)? (\w+), [A-Z][^,.;]*\b\1\b/i;

function strings(o: unknown): string[] {
  const out: string[] = [];
  mapStrings(o, (s) => (out.push(s), s));
  return out;
}

describe("the reads say a place once", () => {
  it("no people read has a possessive place that its own name repeats", () => {
    const bad = peopleData().all.flatMap((p) => strings(p.read ?? {}).filter((s) => REPEATED.test(s)).map((s) => `${p.name}: ${s.slice(0, 100)}`));
    expect(bad).toEqual([]);
  });
  it("no quest or line read has one either", () => {
    const bad = strings(questsData().lines).filter((s) => REPEATED.test(s));
    expect(bad.slice(0, 5)).toEqual([]);
  });
});
