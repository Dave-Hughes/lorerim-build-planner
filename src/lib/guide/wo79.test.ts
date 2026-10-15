import { describe, expect, it } from "vitest";
import { STORY_IMAGES, isGuideKey, isPlainLine, limitFor, lineDoc, storyOf, type GuideDoc } from "./doc";

const text: GuideDoc = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "The ship put in at Windhelm." }] }] };

describe("WO-79: the Story", () => {
  it("has its own keys and limits: a 60-character title, a 140-character opening line, 5 images", () => {
    for (const k of ["story", "story:title", "story:line"]) expect(isGuideKey(k)).toBe(true);
    expect(isGuideKey("story:other")).toBe(false);
    expect(limitFor("story:title")).toBe(60);
    expect(limitFor("story:line")).toBe(140);
    expect(STORY_IMAGES).toBe(5);
  });

  it("shows only with a title and some text", () => {
    expect(storyOf({ story: text })).toBeNull();
    expect(storyOf({ "story:title": lineDoc("The Writ") })).toBeNull();
    expect(storyOf({ story: text, "story:title": lineDoc("The Writ"), "story:line": lineDoc("Mephala's work.") })).toMatchObject({ title: "The Writ", line: "Mephala's work." });
  });

  it("takes the title and opening line as one line of plain text", () => {
    expect(isPlainLine(lineDoc("The Writ"))).toBe(true);
    expect(isPlainLine(lineDoc(""))).toBe(true);
    expect(isPlainLine({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Bold", marks: [{ type: "bold" }] }] }] })).toBe(false);
    expect(isPlainLine({ type: "doc", content: [text.content[0], text.content[0]] })).toBe(false);
  });
});
