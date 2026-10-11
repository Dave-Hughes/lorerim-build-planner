import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { MAX_TAGS, TAGS, suggestedTags } from "./tags";

describe("tags", () => {
  it("has the 20 starting tags, and migration 0005 seeds exactly these", () => {
    expect(TAGS).toHaveLength(20);
    const sql = fs.readFileSync("drizzle/0005_tags.sql", "utf8");
    for (const t of TAGS) expect(sql, t.slug).toContain(`('${t.slug}', '${t.name}', '${t.group}'`);
  });

  it("suggests the tags that match the majors", () => {
    expect(suggestedTags(["One-Handed", "Heavy Armor", "Block"])).toEqual(["one-handed", "heavy-armor", "shield"]);
    expect(suggestedTags(["Destruction", "Alteration", "Conjuration"])).toEqual(["destruction", "alteration", "conjuration"]);
    expect(suggestedTags(["Evasion", "Sneak", "Speech"])).toEqual(["light-armor"]);
    expect(suggestedTags(["Smithing", "Speech", "Wayfarer"])).toEqual([]);
    expect(suggestedTags([])).toEqual([]);
  });

  it("never suggests more than the limit or the same tag twice", () => {
    const s = suggestedTags(["One-Handed", "One-Handed", "Two-Handed", "Marksman", "Heavy Armor", "Destruction", "Illusion"]);
    expect(new Set(s).size).toBe(s.length);
    expect(s.length).toBeLessThanOrEqual(MAX_TAGS);
  });
});
