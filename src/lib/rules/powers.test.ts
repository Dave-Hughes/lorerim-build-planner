import { describe, expect, it } from "vitest";
import sample from "./__fixtures__/sample-build.json";
import overrides from "../../../gamedata/5.0.4.8/overrides.json";
import { computeBuild } from "./engine";
import { requireGameData } from "./data";
import { abilitiesKnown, shoutWords, shoutWordsLine } from "./powers";
import { addAbility, addShout } from "@/components/editor/plan-ops";
import type { BuildPlan, LevelPlan } from "./types";

const d = requireGameData("5.0.4.8");
const base = sample as unknown as BuildPlan;
const ability = (name: string) => d.abilities.find((a) => a.name === name)!;
const shout = (name: string) => d.shouts.find((s) => s.name === name)!;
const empty = (): LevelPlan => ({ skillPoints: {}, perks: [], destiny: [], extras: [], note: "" });

/** The sample build stretched to `n` levels (the new ones empty), with `perk` taken at `at`. */
function plan(n: number, perk?: { id: string; at: number }): BuildPlan {
  const levels = [...base.levels, ...Array.from({ length: Math.max(0, n - base.levels.length) }, empty)];
  if (perk) levels[perk.at - 1] = { ...levels[perk.at - 1], perks: [...levels[perk.at - 1].perks, perk.id] };
  return { ...base, levels };
}

describe("powers.json", () => {
  it("War Cry is a Lesser power, and Speech's War Cry perk grants it", () => {
    const warCry = ability("War Cry");
    expect(warCry.kind).toBe("Lesser power");
    expect(d.abilityFromPerks["Speech:War Cry"]).toEqual([warCry.id]);
  });

  it("Unrelenting Force's words read Fus Ro Dah, and Slow Time's carry their meanings", () => {
    expect(shout("Unrelenting Force").words.join(" ")).toBe("Fus Ro Dah");
    expect(shoutWordsLine(shout("Slow Time"))).toBe("Tiid Klo Ul: Time, Sand, Eternity");
  });

  it("no ability name matches the skip list", () => {
    const skip = (overrides as { powers: { skipNames: string[] } }).powers.skipNames;
    const skipped = (name: string) => skip.some((s) => (s.endsWith("…") ? name.startsWith(s.slice(0, -1).trimEnd()) : name === s));
    expect(d.abilities.filter((a) => skipped(a.name)).map((a) => a.name)).toEqual([]);
  });

  it("every perk link is to a perk in a tree and an ability in the list", () => {
    for (const [perk, ids] of Object.entries(d.abilityFromPerks)) {
      expect(d.perkById.has(perk), perk).toBe(true);
      for (const id of ids) expect(d.abilityById.has(id), id).toBe(true);
    }
  });
});

describe("abilities and shouts in a build", () => {
  const warCry = ability("War Cry").id;

  it("taking Speech:War Cry at level 12 gives War Cry from level 12", () => {
    const p = plan(14, { id: "Speech:War Cry", at: 12 });
    expect(abilitiesKnown(d, p, 11).map((a) => a.id)).not.toContain(warCry);
    expect(abilitiesKnown(d, p, 12).find((a) => a.id === warCry)).toMatchObject({ level: 12, fromPerk: "Speech:War Cry" });
  });

  it("adding War Cry by hand when the perk gives it raises ability-repeat", () => {
    const p = addAbility(plan(14, { id: "Speech:War Cry", at: 12 }), 13, { id: warCry, where: "Jorrvaskr" });
    const states = computeBuild(p);
    expect(states[12].issues).toContainEqual({ code: "ability-repeat", message: "War Cry comes from the War Cry perk, taken at level 12." });
  });

  it("adding the same ability twice raises ability-repeat", () => {
    const id = ability("Aetherial Cloak").id;
    const states = computeBuild(addAbility(addAbility(plan(8), 2, { id }), 7, { id }));
    expect(states[1].issues.map((i) => i.code)).not.toContain("ability-repeat");
    expect(states[6].issues.map((i) => i.code)).toContain("ability-repeat");
  });

  it("two Unrelenting Force rows (1 word at 5, 3 words at 20) give 3 words from 20", () => {
    const id = shout("Unrelenting Force").id;
    const p = addShout(addShout(plan(22), 5, { id, words: 1 }), 20, { id, words: 3, where: "High Hrothgar" });
    expect(shoutWords(d, p, id, 4)).toBe(0);
    expect(shoutWords(d, p, id, 19)).toBe(1);
    expect(shoutWords(d, p, id, 20)).toBe(3);
    expect(computeBuild(p).flatMap((s) => s.issues).map((i) => i.code)).not.toContain("shout-words");
  });

  it("a shout's word count going down raises shout-words", () => {
    const id = shout("Unrelenting Force").id;
    const states = computeBuild(addShout(addShout(plan(10), 3, { id, words: 2 }), 9, { id, words: 1 }));
    expect(states[8].issues).toContainEqual({ code: "shout-words", message: "Unrelenting Force drops to 1 word; 2 were already known." });
  });
});
