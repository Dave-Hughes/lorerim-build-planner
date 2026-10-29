import { describe, expect, it } from "vitest";
import { peopleData } from "@/lib/people/data";
import { questsData } from "@/lib/quests/data";
import { placesData } from "@/lib/places/data";
import { closeBy, peopleAt, shopsOf } from "@/lib/places/people";
import { placeOnly, placePhrase, vaguePlace } from "@/lib/pages/where";
import { isTemplateName } from "@/lib/pages/player-words";

/**
 * WO-180 Part 4a (PC): the reads are in a player's words. A guess or a note about the files is taken out of a read where the reads are loaded
 * (read_clean.py) and its field is listed under Not sure yet; what the reads copied from the game (a step's objectives) keeps the game's words.
 * The quest and person reads, the start's ways and the line reads are walked here, the way a page reads them.
 */
const GAME = new Set(["objectives", "steps", "shared", "unsure", "raw", "evidence", "verdicts", "fixed"]);

function strings(o: unknown, path = "", out: [string, string][] = []): [string, string][] {
  if (typeof o === "string") out.push([path, o]);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, `${path}[]`, out));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) if (!GAME.has(k)) strings(v, `${path}.${k}`, out);
  return out;
}

const quoted = (s: string) => s.replace(/["“][^"”]*["”]/g, "");
const read = () => {
  const all: [string, string][] = [];
  for (const l of questsData().lines) {
    strings(l.read ?? {}, `line ${l.id}`, all);
    for (const q of l.quests) {
      strings(q.read ?? {}, `quest ${q.name}`, all);
      strings({ needs: q.start?.needs, ways: q.start?.ways, then: q.start?.then }, `start ${q.name}`, all);
    }
  }
  for (const p of peopleData().all) strings(p.read ?? {}, `person ${p.name}`, all);
  return all;
};
const bad = (re: RegExp, text: (s: string) => string = (s) => s) =>
  read()
    .filter(([, s]) => re.test(text(s)))
    .map(([p, s]) => `${p}: ${s.slice(0, 120)}`);

describe("the reads in a player's words (WO-180 Part 4a)", () => {
  it("no empty bracket, no 'the the', no blank the game fills, no role the records name", () => {
    expect(bad(/\(\s*\)/)).toEqual([]);
    expect(bad(/\bthe the\b/i)).toEqual([]);
    expect(bad(/<[^<>]+>/)).toEqual([]);
    expect(bad(/\b(?:riverwood|faction) friend\b|\bthe field co\b|\bthe actor\b|\bthe npc\b/i)).toEqual([]);
  });
  it("no guess in a read's own words (what is said in quotes is the game's)", () => {
    expect(bad(/\b(?:probably|most likely|likely|possibly|perhaps|presumably)\b/i, quoted)).toEqual([]);
  });
  it("no note about the files: no records, no script, no 'these files', no 'amount not in'", () => {
    expect(bad(/\b(?:the|these) (?:records?|files)\b|\bquest'?s? script\b|\bamount not in\b|\bscript event\b/i, quoted)).toEqual([]);
  });
  it("a skill is Speech, never Speechcraft", () => {
    expect(bad(/\bSpeechcraft\b/)).toEqual([]);
  });
  it("a place the page puts 'in' in front of is a place: never 'in where', 'in in' or 'in most likely'", () => {
    const said: string[] = [];
    for (const l of questsData().lines)
      for (const q of l.quests)
        for (const w of q.read?.starts ?? []) {
          if (!w.where || vaguePlace(w.where)) continue;
          const place = placeOnly(w.where);
          if (place) said.push(`${q.name}: ${w.who ?? ""} ${placePhrase(place, true)}`);
        }
    expect(said.filter((s) => /\bin (?:in|where|most likely|probably|likely|possibly|still)\b/i.test(s))).toEqual([]);
  });
  it("a job named by a placeholder is not listed under that name", () => {
    const names: string[] = [];
    for (const l of questsData().lines) {
      for (const o of l.read?.order ?? []) names.push(o.quest ?? "");
    }
    for (const p of peopleData().all) for (const q of p.read?.quests ?? []) names.push(q.quest);
    expect(names.filter((n) => isTemplateName(n) || /^The item$/i.test(n) || /<[^>]+>/.test(n))).toEqual([]);
    expect(names).toContain("A delivery");
  });
  it("a field that lost a guess is listed under Not sure yet", () => {
    const q = questsData().lines.flatMap((l) => l.quests).find((x) => x.name === "No Mercy")!;
    expect(q.read?.takesYou?.some((t) => t.place === "Altar of Molag Bal")).toBe(true);
    expect(q.read?.takesYou?.some((t) => /most likely/.test(t.place))).toBe(false);
    expect(q.read?.unsure?.some((u) => u.field === "takesYou")).toBe(true);
  });
});

describe("what a place says of its shops and its books (WO-180 Part 4a)", () => {
  const whiterun = () => placesData().places.find((p) => p.name === "Whiterun" && p.type === "City")!;
  it("Whiterun's shops are a few kinds, each said once, not a run of the reads' pieces", () => {
    const kinds = [...new Set(peopleAt(whiterun()).houses.flatMap((h) => h.people.flatMap((x) => (x.sells ? [x.sells] : []))))];
    expect(kinds.length).toBeLessThanOrEqual(8);
    expect(kinds.filter((k) => k.length > 30 || /\bat\b|,/.test(k))).toEqual([]);
  });
  it("Whiterun does not count Honningbrew Meadery or Whiterun Stables, which stand outside the walls", () => {
    const homes = peopleAt(whiterun()).houses.map((h) => h.name);
    expect(homes).not.toContain("Honningbrew Meadery");
    expect(homes).not.toContain("Whiterun Stables");
    const mead = placesData().places.find((p) => p.name === "Honningbrew Meadery")!;
    expect(mead.inTown).toBeFalsy();
    expect(mead.pos).toBeTruthy();
  });
  it("Hendraheim quotes 'Warrior's Challenge' once", () => {
    const h = placesData().places.find((p) => p.name === "Hendraheim")!;
    expect((h.pointers ?? []).filter((x) => x.kind === "book" && x.book === "Warrior's Challenge")).toHaveLength(1);
  });
  it("Riverwood's lines by Ralof, Hod, Sigrid and Alvor belong to Before the Storm, not to the peace council", () => {
    const r = placesData().places.find((p) => p.name === "Riverwood" && p.type !== "House")!;
    const bySpeaker = (n: string) => (r.pointers ?? []).filter((x) => x.speaker === n && x.quest).map((x) => x.quest);
    for (const n of ["Ralof", "Hod", "Sigrid", "Alvor"]) expect(bySpeaker(n), n).not.toContain("Season Unending");
    expect((r.pointers ?? []).some((x) => x.quest === "Before the Storm")).toBe(true);
  });
  it("no skill book is a Speechcraft one", () => {
    const books = placesData().places.flatMap((p) => p.worthGoingFor?.skillBooks ?? []);
    expect(books.filter((b) => /^Speechcraft:/.test(b))).toEqual([]);
    expect(books.some((b) => /^Speech:/.test(b))).toBe(true);
  });
});

describe("the second check (WO-180 Part 5a)", () => {
  // A quest's steps are the planner's words once their blanks are filled, so they are walked too (the game's own quoted words aside).
  const stepStrings = () => {
    const out: [string, string][] = [];
    for (const l of questsData().lines)
      for (const q of l.quests) {
        for (const s of q.read?.steps ?? []) for (const o of s.objectives ?? []) out.push([q.name, o]);
        for (const o of q.objectives ?? []) out.push([q.name, o]);
      }
    return out.map(([n, s]) => [n, quoted(s)] as [string, string]);
  };
  const stepBad = (re: RegExp) => stepStrings().filter(([, s]) => re.test(s)).map(([n, s]) => `${n}: ${s}`);
  it("a step has its blanks filled: no tag, no 'the the', no 'the actor', no 'The one'", () => {
    expect(stepBad(/<[^<>]+>/)).toEqual([]);
    expect(stepBad(/the the|the actor|^The one has/i)).toEqual([]);
    expect(stepStrings().some(([n, s]) => n === "Cultists vs Player" && s === "Search the person")).toBe(true);
    expect(stepStrings().some(([n, s]) => n === "Maggot" && /^The victim has been dazzled/.test(s))).toBe(true);
  });
  it("Hunter's Mark names its two jobs as what they are and says where each takes you once", () => {
    const line = questsData().lines.find((l) => l.id === "hunters-mark")!;
    expect(line.quests.map((q) => q.name)).toEqual(["Mark an animal den", "Mark an animal den (second job)"]);
    expect(line.quests.every((q) => isTemplateName(q.name ?? ""))).toBe(true);
    const places = new Set(line.quests.flatMap((q) => (q.read?.takesYou ?? []).map((t) => t.place)));
    expect([...places]).toEqual(["an animal den in the hold you are in"]);
  });
  it("a place that starts with a preposition or an adverb gets no 'in' in front of it", () => {
    for (const w of ["out on the road", "out around Ivarstead", "after you earn the Ebony Mail", "with you", "around Ivarstead", "in the Sleeping Giant Inn"]) {
      expect(placePhrase(w, true)).toBe(w);
    }
    expect(placePhrase("the Sleeping Giant Inn", true)).toBe("in the Sleeping Giant Inn");
    expect(placePhrase("out on the road", false)).toBe("Out on the road");
  });
  it("Whiterun's Shops and beds is one item per shop, with its name, its keeper and what it sells", () => {
    const shops = shopsOf(peopleAt(placesData().places.find((p) => p.name === "Whiterun" && p.type === "City")!).houses);
    const names = shops.map((s) => s.name);
    for (const n of ["Arcadia's Cauldron", "Belethor's General Goods", "Warmaiden's"]) expect(names, n).toContain(n);
    expect(shops.find((s) => s.name === "Arcadia's Cauldron")?.kind).toBe("apothecary");
    expect(shops.find((s) => s.name === "Belethor's General Goods")?.keeper.name).toBe("Belethor");
    // A bard, a Companion and a housecarl have the record's "sells" flag and run no shop.
    const keepers = shops.map((s) => s.keeper.name);
    for (const n of ["Mikael", "Aela the Huntress", "Lydia", "Farkas"]) expect(keepers, n).not.toContain(n);
    expect(new Set(names).size).toBe(names.length);
  });
  it("Close by lists the farms and the stables next to Whiterun, not only the dangerous places", () => {
    const whiterun = placesData().places.find((p) => p.name === "Whiterun" && p.type === "City")!;
    const near = closeBy(whiterun).map((c) => c.place.name);
    expect(near).toContain("Honningbrew Meadery");
    expect(near).toContain("Whiterun Stables");
  });
  it("no record talk in the reads: 'role not shown', 'separate from the recipient'", () => {
    const people: string[] = [];
    for (const l of questsData().lines) for (const q of l.quests) for (const p of q.read?.people ?? []) people.push(`${q.name}: ${p.role ?? ""}`);
    expect(people.filter((s) => /records|role not shown/i.test(s))).toEqual([]);
    const text = peopleData().all.flatMap((p) => strings(p.read ?? {}, `person ${p.name}`).map(([, s]) => s));
    expect(text.filter((s) => /separate from the recipient/i.test(s))).toEqual([]);
  });
});
