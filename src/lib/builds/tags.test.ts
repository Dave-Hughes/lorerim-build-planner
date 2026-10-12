import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { MAX_TAGS, TAGS, suggestedTags } from "./tags";

describe("tags", () => {
  it("has the 21 tags, and the migrations seed exactly these", () => {
    expect(TAGS).toHaveLength(21);
    const sql = fs
      .readdirSync("drizzle")
      .filter((f) => f.endsWith(".sql"))
      .map((f) => fs.readFileSync(`drizzle/${f}`, "utf8"))
      .join("\n");
    for (const t of TAGS) expect(sql, t.slug).toContain(`('${t.slug}', '${t.name}', '${t.group}'`);
  });

  it("suggests the tags that match the majors", () => {
    expect(suggestedTags(["One-Handed", "Heavy Armor", "Block"])).toEqual(["one-handed", "heavy-armor", "shield"]);
    expect(suggestedTags(["Destruction", "Alteration", "Conjuration"])).toEqual(["destruction", "alteration", "conjuration"]);
    expect(suggestedTags(["Evasion", "Sneak", "Speech"])).toEqual(["light-armor", "stealth"]);
    expect(suggestedTags(["Smithing", "Speech", "Wayfarer"])).toEqual(["crafter"]);
    expect(suggestedTags(["Speech", "Wayfarer", "Alchemy"])).toEqual([]);
    expect(suggestedTags([])).toEqual([]);
  });

  it("never suggests more than the limit or the same tag twice", () => {
    const s = suggestedTags(["One-Handed", "One-Handed", "Two-Handed", "Marksman", "Heavy Armor", "Destruction", "Illusion"]);
    expect(new Set(s).size).toBe(s.length);
    expect(s.length).toBeLessThanOrEqual(MAX_TAGS);
  });

  it("suggests Stealth for Sneak, Thief for Finesse and Crafter for Smithing", () => {
    expect(suggestedTags(["Marksman", "Sneak", "Alchemy"])).toEqual(["marksman", "stealth"]);
    expect(suggestedTags(["Finesse", "Smithing"])).toEqual(["thief", "crafter"]);
  });
});
