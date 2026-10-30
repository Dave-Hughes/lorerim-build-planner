import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { questsData } from "@/lib/quests/data";
import { pageOf } from "@/lib/quests/reads";
import { lineView } from "@/lib/quests/line-view";
import before from "./__fixtures__/wo180-6b-before.json";

/**
 * WO-180 Part 6b (Mac): the step check. A step on a quest page that holds a fill the pipeline made from an alias is a failure, however the
 * fill reads. Two kinds:
 *  - an alias's own editor name split into words ("the victim", "the target location", "the owner": what `legacy_alias` said before Part 6a),
 *    unless the records themselves write that sentence in plain words (the allowlist, checked against the raw record's stage log and objectives);
 *  - "the person the job names" and the others `ROLE_PHRASES` lists: an honest fill for a job whose people and places the game picks at run
 *    time, so they are counted, not forbidden, and the count has a ceiling that only a deliberate change raises.
 */

type Raw = { name: string; aliases?: Record<string, string>; objectives: { text: string }[]; stages: { log: string[] }[] };
const RAW: Raw[] = JSON.parse(readFileSync(path.join(process.cwd(), "gamedata", "5.0.4.8", "quests_raw.json"), "utf8")).quests;

/** What `legacy_alias` (quest_pages.py) says for an alias name: "TargetLocation" is "the target location", "Victim01" is "the victim". */
function legacy(name: string): string {
  const n = name.trim().split(".")[0].replace(/^[A-Za-z]{0,6}\d+(?=[A-Za-z])/, "");
  const words = (n.replace(/_/g, " ").match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g) ?? []).filter((w) => !/\d/.test(w)).map((w) => w.toLowerCase()).filter((w) => !["alias", "ref", "quest"].includes(w));
  return `the ${(words.length ? words : ["one"]).join(" ")}`;
}

/** The game's own words for a thing, and words the pipeline's fill never makes: allowed whatever the record says. */
const TITLES = new Set(["the player", "the jarl", "the steward", "the innkeeper", "the alchemist", "the general", "the vampire", "the fort", "the city", "the town", "the hold", "the inn", "the book", "the beast", "the item", "the one"]);

const TAG = /<Alias=([^<>.]+)>/gi;
const norm = (s: string) => s.toLowerCase().replace(/[.\s]+$/g, "").replace(/\s+/g, " ").trim();

/**
 * The sentences a quest's own objectives and stage log would come out as with each blank filled the old way: <Alias=Enemy> as "the enemy". A
 * step that is one of these was made by `plain_alias`, not written by anyone. A blank that is a title word ("the jarl") or "the
 * item" is the allowlist; a sentence with no blank in it is the records' own and is never in this set.
 */
function filledSentences(q: Raw): string[] {
  const texts = [...q.objectives.map((o) => o.text), ...q.stages.flatMap((s) => s.log)].filter((t): t is string => typeof t === "string");
  const out: string[] = [];
  for (const t of texts)
    for (const sentence of t.split(/(?<=[.!?])\s+/)) {
      let fills = 0;
      const said = sentence.replace(TAG, (_, name: string) => {
        const p = legacy(name);
        if (TITLES.has(p)) return p;
        fills++;
        return p;
      });
      if (fills && !/<[^<>]+>/.test(said)) out.push(norm(said));
    }
  return out;
}

const STEP_FILLS = new Map<string, string[]>();
for (const q of RAW) STEP_FILLS.set(q.name, [...new Set([...(STEP_FILLS.get(q.name) ?? []), ...filledSentences(q)])]);

/**
 * Allowlisted by Mac, for Bob to rule (WO-180 Part 6b): a step that is a fill but reads as a player would say it. The record's blank is
 * <Alias=ForswornCamp>, which the game fills with one of its Forsworn camps; "the Forsworn camp" names the kind of place, and the quest page's
 * where-band already names the camps.
 */
const ALLOWED = new Set(["Lisbet's Missing Shipment: Retrieve Lisbet's shipment from the Forsworn camp"]);

/** A step that is one of its quest's sentences filled from an alias's editor name (the read's own longer sentence that starts the same way is not). */
export function badSteps(name: string, steps: string[]): string[] {
  const fills = STEP_FILLS.get(name) ?? [];
  return steps.filter((s) => fills.includes(norm(s)));
}

function stepsOf(q: { read?: { steps?: { objectives?: string[] }[]; ways?: { ways?: { steps?: string[] }[]; shared?: string[] } } }) {
  const out: string[] = [];
  for (const b of q.read?.steps ?? []) out.push(...(b.objectives ?? []));
  for (const w of q.read?.ways?.ways ?? []) out.push(...(w.steps ?? []));
  out.push(...(q.read?.ways?.shared ?? []));
  return out;
}

describe("the step check (WO-180 Part 6b)", () => {
  it("fails on the order's own examples as they were before Part 6a: Maggot, Feral Soul-Shriven and Rescue Mission", () => {
    for (const [name, steps] of Object.entries(before)) expect(badSteps(name, steps).length, name).toBeGreaterThan(0);
    expect(badSteps("Maggot", before.Maggot)).toEqual(expect.arrayContaining(["Take back your name from the owner in the target location"]));
    expect(badSteps("Feral Soul-Shriven", before["Feral Soul-Shriven"])).toEqual(["Defeat the enemy"]);
    expect(badSteps("Rescue Mission", before["Rescue Mission"])).toEqual(expect.arrayContaining(["Rescue the victim from the lair", "Talk to the victim"]));
  });

  it("passes on a sentence the records write themselves, and on a read's own longer sentence", () => {
    // The Dark Brotherhood's contract says "Kill the target" in its own journal; "Defeat the enemy the quest marks" is a read's.
    expect(badSteps("Feral Soul-Shriven", ["Defeat the enemy the quest marks"])).toEqual([]);
    expect(badSteps("Maggot", ["Take back your name from the person the quest names, in the place it names"])).toEqual([]);
  });

  it("no step on any quest page holds a split-up alias name", () => {
    const bad = questsData().lines.flatMap((l) => l.quests.flatMap((q) => badSteps(q.name ?? "", stepsOf(q)).map((s) => `${q.name}: ${s}`))).filter((x) => !ALLOWED.has(x));
    expect(bad).toEqual([]);
  });

  it("the steps that say the job picks it stay few: a ceiling, not a ban", () => {
    const P = ["the person the job names", "the place the job names", "the person who gave you the job", "the one the job names"];
    const n = questsData().lines.flatMap((l) => l.quests.flatMap((q) => stepsOf(q).filter((s) => P.some((p) => s.includes(p))))).length;
    expect(n).toBeLessThanOrEqual(70);
  });
});

describe("a place phrase that stands alone starts with a capital (WO-180 Part 6b)", () => {
  it("every quest page's Where it takes you, and every line's, starts with a capital", () => {
    const lower: string[] = [];
    for (const l of questsData().lines) {
      const v = lineView(l);
      for (const n of v.glance.whereList?.names ?? []) if (/^[a-z]/.test(n)) lower.push(`${l.name} (line): ${n}`);
      if (v.glance.where && /^[a-z]/.test(v.glance.where)) lower.push(`${l.name} (line): ${v.glance.where}`);
      for (const q of l.quests) for (const t of pageOf(q).takesYou) if (/^[a-z]/.test(t.place)) lower.push(`${q.name}: ${t.place}`);
    }
    expect(lower.slice(0, 20)).toEqual([]);
  });
});
