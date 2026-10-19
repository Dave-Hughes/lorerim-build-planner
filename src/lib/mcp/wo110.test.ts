import { describe, expect, it } from "vitest";
import sample from "@/lib/rules/__fixtures__/sample-build.json";
import { parseScopes } from "@/lib/oauth/core";
import type { BuildPlan } from "@/lib/rules/types";
import { FactsError, versionData } from "./errors";
import * as names from "./names";
import { DRAFT_CAP, draftCapRefusal, issuesOf, levelFromInput, plainOf, planFromCreate, refusal } from "./plan";
import { checkProgression } from "./facts";

const d = versionData();
const nord = { race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech"] };

describe("names, not ids (WO-110)", () => {
  it("refuses a skill it doesn't know, listing every skill", () => {
    expect(() => names.skill(d, "Swordplay")).toThrow(/^No skill called Swordplay\. Skills are: .*Two-Handed/);
    expect(names.skill(d, "two-handed")).toBe("Two-Handed");
  });

  it("refuses Leadership, which two trees have, with both ids", () => {
    expect(() => names.perk(d, "Leadership")).toThrow("More than one tree has a perk called Leadership. Use one of: Speech:Leadership, Destiny:Leadership.");
    expect(names.perk(d, "Speech:Leadership")).toBe("Speech:Leadership");
  });

  it('reads "Name (2/3)" as a later rank of the same perk', () => {
    const ranked = d.perks.find((p) => p.ranks >= 3 && d.perks.filter((x) => x.name === p.name).length === 1)!;
    expect(names.perk(d, `${ranked.name} (2/${ranked.ranks})`)).toBe(ranked.id);
    expect(names.perk(d, ranked.name)).toBe(ranked.id);
  });

  it("refuses a start option that isn't the start's, naming its choices", () => {
    expect(names.startOption(d, "Regular (Inn)", "the bee and barb")).toBe("The Bee and Barb");
    expect(() => names.startOption(d, "Regular (Inn)", "Dawnstar's Shore")).toThrow(/Dawnstar's Shore isn't a choice for Regular \(Inn\)\. Its inns are: .*The Bannered Mare/);
  });

  it("lists the closest five for a trait or a spell it doesn't know", () => {
    expect(() => names.spell(d, "Holy Fyre")).toThrow(/^No spell called Holy Fyre\. The closest: .*Holy Fire/);
  });
});

describe("create_build's checks (WO-110)", () => {
  it("refuses four majors with the editor's own rule, at character creation", () => {
    const { issues } = issuesOf(d, planFromCreate(d, { ...nord, majors: [...nord.majors, "Marksman"] }));
    expect(issues).toContainEqual({ level: 0, message: "Only 3 major skills." });
    expect(refusal(issues).message).toMatch(/^Nothing was saved\. Character creation: /);
  });

  it("accepts a sound Nord, with level 1 and no issues", () => {
    const { issues, plan } = issuesOf(d, planFromCreate(d, nord));
    expect(issues).toEqual([]);
    expect(plan.levels).toHaveLength(1);
  });

  it("refuses a start option given without a start, and one that isn't the start's", () => {
    expect(() => planFromCreate(d, { ...nord, startOption: "The Bee and Barb" })).toThrow(FactsError);
    expect(() => planFromCreate(d, { ...nord, start: "Regular (Inn)", startOption: "Windhelm Docks" })).toThrow(/isn't a choice/);
  });
});

describe("adding and changing levels (WO-110)", () => {
  const base = issuesOf(d, planFromCreate(d, nord)).plan;

  it("add_level with a perk the build can't take returns the issue at its level", () => {
    const plan: BuildPlan = { ...base, levels: [...base.levels, levelFromInput(d, { attribute: "Stamina", perks: ["Destruction:Expert Destruction"] }, 2)] };
    const { issues } = issuesOf(d, plan);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.every((i) => i.level === 2)).toBe(true);
    expect(refusal(issues).message).toMatch(/^Nothing was saved\. Level 2: .*Destruction/);
  });

  it("set_level that breaks a later level stops at the first issue", () => {
    // Level 2 takes Great Weapon Mastery; level 3 takes Barbaric Might, which needs it.
    const two = levelFromInput(d, { attribute: "Stamina", perks: ["Great Weapon Mastery"] }, 2);
    const three = levelFromInput(d, { attribute: "Stamina", perks: ["Barbaric Might"] }, 3);
    const good = { ...base, levels: [...base.levels, two, three] };
    expect(issuesOf(d, good).issues).toEqual([]);
    // Take level 2's perk back: level 3's loses what it needs, and that's the first issue.
    const broken = { ...good, levels: good.levels.map((lv, i) => (i === 1 ? levelFromInput(d, { attribute: "Stamina" }, 2) : lv)) };
    const { issues } = issuesOf(d, broken);
    expect(issues[0].level).toBe(3);
    expect(refusal(issues.slice(0, 1)).message).toMatch(/^Nothing was saved\. Level 3: .*Great Weapon Mastery/);
  });

  it("refuses an attribute it doesn't know", () => {
    expect(() => levelFromInput(d, { attribute: "Luck" }, 2)).toThrow("No attribute called Luck. Attributes are: Health, Magicka, Stamina.");
  });
});

describe("limits and scopes (WO-110)", () => {
  it("refuses a 21st private draft", () => {
    expect(draftCapRefusal(DRAFT_CAP - 1)).toBeNull();
    expect(draftCapRefusal(DRAFT_CAP)).toBe("You have 20 drafts. Publish or delete one on the site first.");
  });

  it("grants facts and builds:write when a client asks for no scopes", () => {
    expect(parseScopes("")).toEqual(["facts", "builds:write"]);
  });
});

describe("check_progression on the plain shape (WO-110)", () => {
  it("takes what get_build returns and answers with the last level and what's takeable", () => {
    const plain = plainOf(d, sample as unknown as BuildPlan);
    expect(plain.levels[0].perks.length).toBeGreaterThan(0);
    const r = checkProgression(plain);
    expect(r.levels).toBe(plain.levels.length);
    expect(r.last?.level).toBe(plain.levels.length);
  });
});
