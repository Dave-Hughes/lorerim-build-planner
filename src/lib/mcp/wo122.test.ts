import { describe, expect, it } from "vitest";
import { versionData } from "./errors";
import { checkedCreation, creationProblems, levelFromInput, plainOf, planFromCreate, withCreation } from "./plan";

const d = versionData("5.0.4.8");
const nord = { race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech", "One-Handed", "Alchemy", "Wayfarer"], start: "Regular (Inn)", startOption: "Random" };
const problems = (input: object) => creationProblems(d, planFromCreate(d, { ...nord, ...input })).map((i) => i.message);

describe("creation through the door, as Set up checks it (WO-122)", () => {
  it("passes a whole creation", () => {
    expect(problems({})).toEqual([]);
    expect(checkedCreation(d, planFromCreate(d, nord)).issues).toEqual([]);
  });
  it("asks for the skills still to choose, with how many in all", () => {
    expect(problems({ minors: ["Block", "Restoration"] })).toEqual(["Choose 4 more minor skills (6 in all)."]);
    expect(problems({ majors: [], minors: [] })).toEqual(["Choose 3 major skills.", "Choose 6 minor skills."]);
  });
  it("names a trait's choices", () => {
    expect(problems({ traits: ["Fatal Attraction"] })).toEqual(["Fatal Attraction needs a choice: Male or Female."]);
    expect(problems({ traits: ["Focused Magic"] })).toEqual(["Focused Magic needs a skill: Alteration, Conjuration, Destruction, Illusion or Restoration."]);
    expect(problems({ traits: ["Master of One"] })[0]).toMatch(/^Master of One needs a skill: One-Handed, Two-Handed, .* or Restoration\.$/);
    // Said once, not again in checkCreation's words.
    expect(checkedCreation(d, planFromCreate(d, { ...nord, traits: ["Master of One"] })).issues.map((i) => i.message)).toHaveLength(1);
  });
  it("names a start's options, and every start when there is none", () => {
    expect(problems({ start: "Pilgrim (Temple)", startOption: undefined })).toEqual([
      "Pilgrim (Temple) needs a temple: Random, Temple of the Divines, Temple of Dibella, Temple of Kynareth, Temple of Mara or Temple of Talos.",
    ]);
    expect(problems({ start: "Dragonborn", startOption: undefined })).toEqual(["Dragonborn needs a Helgen keep: Helgen Keep (Start) or Helgen Keep (End)."]);
    expect(problems({ start: "Forsworn", startOption: undefined })).toEqual([]);
    expect(problems({ start: undefined, startOption: undefined })[0]).toMatch(/^Choose a start: Regular \(Inn\), From Overseas, .*\.$/);
  });
  it("asks for a birthsign, unless Master of Destiny takes its place", () => {
    expect(problems({ birthsign: undefined })[0]).toMatch(/^Choose a birthsign: .*\.$/);
    expect(problems({ birthsign: undefined, traits: ["Master of Destiny"] })).toEqual([]);
  });
});

describe("traitChoices, masterOfOneSkill and set_creation's change (WO-122)", () => {
  it("take a trait's choice by the game's option names, and Master of One's skill", () => {
    const plan = planFromCreate(d, { ...nord, traits: ["fatal attraction", "Master of One"], traitChoices: { "Fatal Attraction": "female" }, masterOfOneSkill: "two-handed" });
    expect(plan.traitChoices).toEqual({ "Fatal Attraction": "Female" });
    expect(plan.masterOfOneSkill).toBe("Two-Handed");
    expect(creationProblems(d, plan)).toEqual([]);
    expect(() => planFromCreate(d, { ...nord, traits: ["Fatal Attraction"], traitChoices: { "Fatal Attraction": "Both" } })).toThrow("Both isn't a choice for Fatal Attraction. Its choices are: Male, Female.");
    expect(() => planFromCreate(d, { ...nord, traitChoices: { "Fatal Attraction": "Male" } })).toThrow(/needs the trait/);
    expect(() => planFromCreate(d, { ...nord, masterOfOneSkill: "Sneak" })).toThrow(/needs the trait Master of One/);
  });
  it("changes only what's sent; a new start drops the old option, and choices go with their traits", () => {
    const before = planFromCreate(d, { ...nord, start: "Pilgrim (Temple)", startOption: "Temple of Mara", traits: ["Fatal Attraction"], traitChoices: { "Fatal Attraction": "Male" } });
    before.levels.push(levelFromInput(d, { attribute: "Stamina", skillPoints: { "Two-Handed": 3 } }, 2));
    const mode = withCreation(d, before, { mode: "Konahrik" });
    expect([mode.mode, mode.start, mode.startOption, mode.traitChoices]).toEqual(["Konahrik", "Pilgrim (Temple)", "Temple of Mara", { "Fatal Attraction": "Male" }]);
    expect(mode.levels).toHaveLength(2);
    const start = withCreation(d, before, { start: "Dragonborn" });
    expect(start.startOption).toBeUndefined();
    expect(creationProblems(d, start).map((i) => i.message)).toEqual(["Dragonborn needs a Helgen keep: Helgen Keep (Start) or Helgen Keep (End)."]);
    expect(withCreation(d, before, { traits: ["Skilled"] }).traitChoices).toBeUndefined();
    expect(withCreation(d, before, { traitChoices: { "Fatal Attraction": "Female" } }).traitChoices).toEqual({ "Fatal Attraction": "Female" });
  });
  it("rechecks the levels: a later level the new creation breaks is named", () => {
    const plan = planFromCreate(d, nord);
    // As wo110 drafts it: Barbaric Might at level 3, with Two-Handed a major at 41.
    plan.levels.push(levelFromInput(d, { attribute: "Stamina", skillPoints: { "Two-Handed": 3 }, perks: ["Great Weapon Mastery"] }, 2));
    plan.levels.push(levelFromInput(d, { attribute: "Stamina", skillPoints: { "Two-Handed": 3 }, perks: ["Barbaric Might"] }, 3));
    expect(checkedCreation(d, plan).issues).toEqual([]);
    const issues = checkedCreation(d, withCreation(d, plan, { race: "Breton", majors: ["Destruction", "Heavy Armor", "Smithing"] })).issues;
    expect(issues[0]?.level).toBe(3);
  });
  it("comes back from get_build in the same shape", () => {
    const plain = plainOf(d, planFromCreate(d, { ...nord, traits: ["Focused Magic"], traitChoices: { "Focused Magic": "Destruction" } }));
    expect(plain).toMatchObject({ traits: ["Focused Magic"], traitChoices: { "Focused Magic": "Destruction" } });
  });
});
