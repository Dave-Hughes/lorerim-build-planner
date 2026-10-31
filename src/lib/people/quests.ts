import "server-only";
import { questsData } from "@/lib/quests/data";
import { pageOf } from "@/lib/quests/reads";
import { questHref } from "@/lib/quests/slugs";
import { nameKey, peopleData, type Person } from "./data";

/** A quest a person has a part in: its name and page, and what the read says their part is. */
export interface PersonQuest {
  name: string;
  edid: string;
  href: string;
  /** "She gives it" is said by the page; the read's own words for their role when it has them. */
  role?: string;
  gives: boolean;
}

let built: Map<string, PersonQuest[]> | null = null;

/** Every quest that names a person, by the name's key: those it starts with them (who), and those whose read lists them among its people. */
export function questsOfPeople(): Map<string, PersonQuest[]> {
  if (built) return built;
  const out = new Map<string, PersonQuest[]>();
  const put = (name: string, q: PersonQuest) => {
    const k = nameKey(name);
    const list = out.get(k) ?? [];
    const at = list.findIndex((x) => x.href === q.href);
    if (at < 0) out.set(k, [...list, q]);
    else if (q.gives && !list[at].gives) list[at] = { ...list[at], gives: true };
  };
  for (const line of questsData().lines)
    for (const quest of line.quests) {
      const href = questHref(quest.edid);
      if (!href || !quest.name) continue;
      const page = pageOf(quest);
      for (const s of page.starts) if (s.who) put(s.who, { name: quest.name, edid: quest.edid, href, gives: true });
      for (const p of page.people) put(p.name, { name: quest.name, edid: quest.edid, href, ...(p.role ? { role: p.role } : {}), gives: false });
    }
  built = out;
  return out;
}

export const questsOf = (name: string): PersonQuest[] => questsOfPeople().get(nameKey(name)) ?? [];

/**
 * The quests of one person (WO-180 Part 9a). A name only one person has is the quests that name it. A name two people have (Wilhelm of Windhelm, Wilhelm of Ivarstead) is each one's
 * own: those the records tie to their record, and the ones that name the name and no record, to the one players mean (the bare address). A quest the records tie to the other one is not theirs.
 */
export function questsOfPerson(person: Person): PersonQuest[] {
  const named = questsOf(person.name);
  if (!person.label) return named;
  const mine = new Set(person.rows.flatMap((r) => r.questIds ?? []));
  const others = new Set(peopleData().all.filter((p) => p !== person && nameKey(p.name) === nameKey(person.name)).flatMap((p) => p.rows.flatMap((r) => r.questIds ?? [])));
  const main = peopleData().byName.get(nameKey(person.name)) === person;
  return named.filter((q) => mine.has(q.edid) || (main && !others.has(q.edid)));
}
