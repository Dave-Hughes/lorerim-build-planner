import "server-only";
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import { personBySlug, roleWords } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { placeBySlug, placeLabel, placeType } from "@/lib/places/data";
import { dangerOf, pageOf } from "@/lib/quests/reads";
import { questBySlug } from "@/lib/quests/slugs";

/** What the hover preview on a link to a person, place or quest says (WO-157 Part 5): the icon, the name, who or what it is, and one useful fact. Words from the pages, nothing new. */
export interface Preview {
  icon: string;
  name: string;
  line: string;
  fact?: string;
}

const join = (parts: (string | undefined | false | null)[]) => parts.filter(Boolean).join(" | ");

export async function previewOf(href: string): Promise<Preview | null> {
  const person = /^\/people\/([a-z0-9-]+)$/.exec(href);
  if (person) {
    const p = personBySlug(person[1]);
    if (!p) return null;
    const quests = questsOf(p.name);
    const gives = quests.find((q) => q.gives);
    const fact = gives
      ? `Gives ${gives.name}`
      : p.trainer
        ? `Trains ${p.trainer.skill}${p.trainer.cap ? `, up to ${p.trainer.cap}` : ""}`
        : p.sells
          ? "Sells goods"
          : p.cell
            ? `Placed in ${p.cell}`
            : undefined;
    return { icon: "quest-people", name: p.name, line: join([p.inTown, roleWords(p.role) ?? p.race]), ...(fact ? { fact } : {}) };
  }
  const place = /^\/places\/([a-z0-9-]+)$/.exec(href);
  if (place) {
    const p = placeBySlug(place[1]);
    if (!p) return null;
    const danger = dangerOf(p);
    const fact = danger ?? (p.quests?.length ? `${p.quests.length} quest${p.quests.length === 1 ? " goes" : "s go"} here` : undefined);
    return { icon: "quest-travel", name: placeLabel(p), line: join([p.hold ? `${p.hold} hold` : null, placeType(p.type)]), ...(fact ? { fact } : {}) };
  }
  const quest = /^\/quests\/q\/([a-z0-9-]+)$/.exec(href);
  if (quest) {
    await loadPlayerFacts();
    const hit = questBySlug(quest[1]);
    if (!hit?.quest.name) return null;
    const start = pageOf(hit.quest).starts[0];
    const fact = start ? (start.who ? `Starts with ${start.who}` : start.how) : undefined;
    return { icon: "quest-side-stories", name: hit.quest.name, line: hit.line.name, ...(fact ? { fact } : {}) };
  }
  return null;
}
