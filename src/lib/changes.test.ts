import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const file = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "lorerim-5.0.4.8", "changes.json"), "utf8")) as { changes: { kind: string; edid?: string; id?: string; date: string }[] };

/** WO-157: the home page's "New in the world" comes from this generated file: real, dated, newest first. */
describe("changes.json", () => {
  it("has dated quest and line changes, newest first", () => {
    expect(file.changes.length).toBeGreaterThan(50);
    for (const c of file.changes) {
      expect(["quest", "line"]).toContain(c.kind);
      expect(c.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.kind === "quest" ? c.edid : c.id).toBeTruthy();
    }
    const dates = file.changes.map((c) => c.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
});
