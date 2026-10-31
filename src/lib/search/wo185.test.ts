import { describe, expect, it } from "vitest";
import { searchEverything } from "./everything";

/** WO-185 Part 3: one row per thing, and the missive kinds open on their own anchor. */
describe("search lists a thing once", () => {
  const queries = ["di", "dawn", "de", "deli", "letter", "the", "a", "ri", "sol", "whi", "jarl", "ar", "ko", "con", "kill", "arn", "pro", "fet", "bandit", "mjoll"];
  it("never lists two rows with one name and kind in any list", () => {
    for (const q of queries) {
      const r = searchEverything(q, 30);
      for (const [group, list] of Object.entries(r)) {
        const seen = new Set<string>();
        for (const h of list) {
          const key = `${h.kind}|${h.name}`;
          expect(seen.has(key), `"${q}" lists ${key} twice in ${group}`).toBe(false);
          seen.add(key);
        }
      }
    }
  });
  it("gives the missive kinds one row that opens the kind on its line, saying how many boards", () => {
    const rows = searchEverything("di", 30).quests.filter((q) => q.name === "Deliver a Letter Distant");
    expect(rows).toHaveLength(1);
    expect(rows[0].href).toBe("/quests/missives#kind-deliver-a-letter");
    expect(rows[0].note).toMatch(/^Missives, on \d+ boards$/);
  });
  it("says what every row is", () => {
    for (const list of Object.values(searchEverything("dawn", 30))) for (const h of list) expect(h.kind, h.name).toBeTruthy();
  });
});
