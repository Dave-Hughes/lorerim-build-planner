import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { styleGuide } from "./facts";

describe("a reason to travel (WO-127)", () => {
  it("get_style_guide gives rule 19 and the How to build line, with Honesty from 20", () => {
    const guide = styleGuide();
    expect(guide).toMatch(/^19\. Give the character a reason to travel: why they leave one town for the next/m);
    expect(guide).toContain("Before writing a playthrough, settle the character's reason to travel (rule 19) with the player.");
    expect(guide).toMatch(/^20\. A draft is a draft\./m);
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
    expect(last).toBe(24);
    expect(past).toEqual([]);
  });
});
