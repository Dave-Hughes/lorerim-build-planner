import { describe, expect, it } from "vitest";
import { questsData } from "@/lib/quests/data";
import { peopleData, personHrefForQuest } from "./data";
import { questsOfPerson } from "./quests";

/** WO-180 Part 9b: two people who share a name keep their own quests, and a quest links the one its records name. */
describe("people who share a name", () => {
  const same = new Map<string, ReturnType<typeof peopleData>["all"]>();
  for (const p of peopleData().all) same.set(p.name, [...(same.get(p.name) ?? []), p]);
  const split = [...same].filter(([, v]) => v.length > 1);

  it("are separate pages, each listing only the quests its record is tied to", () => {
    expect(split.length).toBeGreaterThan(3);
    for (const [name, people] of split.slice(0, 40)) {
      const lists = people.map((p) => new Set(questsOfPerson(p).map((q) => q.name)));
      // A quest tied to a record is on that person's page and on no other's of the same name (a quest naming both is rare and allowed to be on both).
      for (const p of people) {
        for (const r of p.rows) for (const id of r.questIds ?? []) {
          const q = questsData().lines.flatMap((l) => l.quests).find((x) => x.edid === id);
          if (!q) continue;
          const others = people.filter((o) => o !== p && o.rows.some((r2) => r2.questIds?.includes(id)));
          if (!others.length) expect(lists[people.indexOf(p)].has(q.name), `${name} (${p.slug}) should list ${q.name}`).toBe(true);
        }
      }
    }
  });
  it("a quest links the person its records tie it to, by address", () => {
    let checked = 0;
    for (const [name, people] of split) for (const p of people) for (const r of p.rows) for (const id of r.questIds ?? []) {
      const sole = people.filter((o) => o.rows.some((r2) => r2.questIds?.includes(id)));
      if (sole.length === 1) {
        expect(personHrefForQuest(name, id), `${id} names ${name}`).toBe(`/people/${p.slug}`);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(5);
  });
  it("Wilhelm of Windhelm and Wilhelm of Ivarstead are two pages with their own quests", () => {
    const wilhelms = same.get("Wilhelm") ?? [];
    expect(wilhelms.length).toBeGreaterThanOrEqual(2);
    const quests = wilhelms.map((w) => questsOfPerson(w).map((q) => q.name).sort().join("|"));
    expect(new Set(quests).size).toBe(quests.length);
  });
});
