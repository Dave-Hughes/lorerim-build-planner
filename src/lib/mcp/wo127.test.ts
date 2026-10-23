import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { styleGuide } from "./facts";

describe("a reason to travel (WO-127)", () => {
  it("get_style_guide gives rule 19 and the How to build line, with Honesty after it (from 22 since WO-128's rule 20 and WO-129's 21)", () => {
    const guide = styleGuide();
    expect(guide).toMatch(/^19\. Give the character a reason to travel: why they leave one town for the next/m);
    // Softened under WO-139 (Dave, 23 Oct): it comes from the story as the acts are written; it isn't asked up front.
    expect(guide).toContain("A character needs a reason to leave town now and then; it usually comes from the story as you write the acts (rule 19). Don't ask for it up front.");
    expect(guide).toMatch(/^22\. A draft is a draft\./m);
  });

  it("no rule a tool or comment names is past the guide's last", () => {
    const last = Math.max(...[...styleGuide().matchAll(/^(\d+)\. /gm)].map((m) => Number(m[1])));
    const dir = path.join(process.cwd(), "src", "lib", "mcp");
    const past: string[] = [];
    for (const f of readdirSync(dir).filter((n) => /\.tsx?$/.test(n) && !n.includes(".test."))) {
      for (const m of readFileSync(path.join(dir, f), "utf8").matchAll(/\brules? (\d+)(?:(?: to |-| and )(\d+))?/g)) {
        const n = Number(m[2] ?? m[1]);
        if (n > last) past.push(`${f}: ${m[0]}`);
      }
    }
    // 37 since WO-148 (Missives, rule 37); the Before you design rules are 27 to 36 (WO-139); Honesty keeps 22 to 26.
    expect(last).toBe(37);
    expect(past).toEqual([]);
  });
});
