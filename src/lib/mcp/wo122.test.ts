import { describe, expect, it } from "vitest";
import { versionData } from "./errors";
import { checkedCreation, creationProblems, planFromCreate } from "./plan";

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
