import { describe, expect, it } from "vitest";
import { isOpen } from "./status";
import { whereLine } from "./view";

describe("chapters locked until their objective is done (WO-124 Part 5)", () => {
  it("locks a chapter or an entry tied to an objective, as it did a beat, and opens it when that's done", () => {
    for (const kind of ["chapter", "entry", "beat"] as const) {
      expect(isOpen({ kind, opensAfter: 7 }, new Set())).toBe(false);
      expect(isOpen({ kind, opensAfter: 7 }, new Set([7]))).toBe(true);
    }
    expect(isOpen({ kind: "chapter", opensAfter: null }, new Set())).toBe(true);
  });
});

describe("where she is, in one line (WO-124 Part 5)", () => {
  it("says the level, day and place, and which save it came from and when", () => {
    expect(whereLine({ source: "save", label: "Save 70", level: 10, day: 15, place: "Ivarstead", at: "2026-10-21T12:00:00Z" })).toBe("Level 10, day 15, Ivarstead. From Save 70, 21 Oct.");
    expect(whereLine({ source: "hand", label: "By hand", level: 6, day: null, place: null, at: "2026-10-20T09:00:00Z" })).toBe("Level 6. From your own entry, 20 Oct.");
    expect(whereLine(null)).toBeNull();
  });
});
