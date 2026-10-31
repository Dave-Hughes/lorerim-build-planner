import { describe, expect, it } from "vitest";
import { questsData } from "./data";
import { lineView } from "./line-view";
import { pageOf } from "./reads";
import { startCell } from "./start-cell";

/** WO-180 Part 7b: a phrase that stands alone in a band cell starts with a capital, on every quest and every line. */
const startsWithLower = (t: string | null | undefined) => !!t && /^[a-z]/.test(t.trim());

describe("the band cells' first letters", () => {
  it("the How it starts cell of every quest page: the headline and the place line", () => {
    const bad: string[] = [];
    for (const l of questsData().lines)
      for (const q of l.quests) {
        const c = startCell(pageOf(q));
        for (const t of [c.value, c.sub]) if (startsWithLower(t)) bad.push(`${q.name}: ${t}`);
      }
    expect(bad.slice(0, 10), `${bad.length} cells`).toEqual([]);
  });
  it("every cell of every line's band", () => {
    const bad: string[] = [];
    for (const l of questsData().lines) {
      const g = lineView(l).glance;
      for (const [k, v] of Object.entries({ "start value": g.start.value, "start sub": g.start.sub, "level value": g.level.value, "level sub": g.level.sub, "length value": g.length.value, "length sub": g.length.sub, "xp value": g.xp?.value, "xp sub": g.xp?.sub, where: g.where }))
        if (startsWithLower(v as string | null | undefined)) bad.push(`${l.name} ${k}: ${v}`);
    }
    expect(bad.slice(0, 10), `${bad.length} cells`).toEqual([]);
  });
});
