import { describe, expect, it } from "vitest";
import { questsData } from "@/lib/quests/data";
import { pageOf, NOT_STARTED } from "@/lib/quests/reads";
import { lineView, categoryRow } from "@/lib/quests/line-view";
import { gateKnown } from "@/lib/quests/gate";
import { tableRow } from "@/lib/quests/table-rows";
import { peopleData } from "@/lib/people/data";
import { placeByRecordName, placesData } from "@/lib/places/data";

/**
 * WO-183 Part 4 (Mac): a default never prints as a fact. "Any level" says the start was read and asks for nothing; "Starts by itself" and "Talk to someone to
 * start it" say how a quest begins, so they need the data to say it; "Lives in" needs a town the records place the person in. Each is checked on the
 * pages' own functions, over every quest line and quest.
 */
describe("a default does not pose as a fact (WO-183 Part 4)", () => {
  const lines = questsData().lines;

  it("a line whose gate nobody read says 'Not sure yet', never 'Any level'", () => {
    const bad: string[] = [];
    for (const l of lines) {
      const unread = !gateKnown(l);
      const said = [lineView(l).glance.level.value, categoryRow(l, l.category).level];
      if (unread && said.some((s) => /any level/i.test(s))) bad.push(l.name);
      if (!unread && !l.minLevel && !said.every((s) => /any level/i.test(s))) bad.push(`${l.name}: a read gate with none said ${said.join(" / ")}`);
      expect(tableRow(l).levelKnown, l.name).toBe(!unread);
    }
    expect(bad).toEqual([]);
    // The line the audit named: The Whispering Door has its gate (20), so its page says Level 20, not "Any level".
    const door = lines.find((l) => /whispering-door/i.test(l.id));
    if (door) expect(lineView(door).glance.level.value).toBe("Level 20");
  });

  it("a quest no record starts says 'Not started in normal play', and never 'Starts by itself'", () => {
    const noStart = lines.flatMap((l) => l.quests.filter((q) => q.noStart));
    expect(noStart.length).toBeGreaterThan(10);
    for (const q of noStart) {
      const p = pageOf(q);
      if (p.source === "reads") expect(p.canDo?.label, q.name).toBe(NOT_STARTED);
      expect(p.starts, q.name).toEqual([]);
    }
  });

  it("'Talk to someone to start it' is said only where the start names someone", () => {
    const bad = lines.flatMap((l) => l.quests.filter((q) => { const p = pageOf(q); return p.canDo?.label === "Talk to someone to start it" && !p.starts.some((s) => s.who); }).map((q) => q.name));
    expect(bad).toEqual([]);
  });

  it("a generic actor has no person page, and a place's old record name goes to its in-game name", () => {
    const names = new Set(peopleData().all.map((p) => p.name));
    for (const generic of ["Goblin", "Mercenary", "Dark Brotherhood Assassin", "Frost Troll"]) expect(names.has(generic), generic).toBe(false);
    expect(placeByRecordName("dormitory")?.name).toBe("Hall of Attainment");
    expect(placesData().places.some((p) => p.name === "Dormitory")).toBe(false);
  });
});
