import { describe, expect, it } from "vitest";
import { drawnTheme } from "@/lib/themes";
import { standLine } from "./view";

describe("Where you stand (WO-118)", () => {
  it("is one line from a save: level, day, place, skills, the save", () => {
    expect(standLine({ source: "save", label: "Save 7", level: 6, day: 7, place: "Riften", skills: { Speech: 30, "Two-Handed": 36 } })).toBe("Level 6 | Day 7 | Riften | Speech 30, Two-Handed 36 | from Save 7");
  });
  it("leaves out what isn't given, and names the owner's own entry", () => {
    expect(standLine({ source: "hand", label: "By hand", level: 6, day: null, place: null, skills: {} })).toBe("Level 6 | from your own entry");
  });
  it("is nothing with no save and no entry", () => {
    expect(standLine(null)).toBeNull();
  });
});

describe("themes, off for now (WO-118)", () => {
  it("draw every page in Ember, whatever is stored", () => {
    expect(drawnTheme("parchment")).toBe("ember");
    expect(drawnTheme("aurora")).toBe("ember");
    expect(drawnTheme(undefined)).toBe("ember");
  });
});
