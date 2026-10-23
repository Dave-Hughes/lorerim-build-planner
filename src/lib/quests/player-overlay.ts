import type { PlayerFact } from "./player-facts-store";
import { alreadyAmong } from "./player-source";
import type { Quest, QuestLine, QuestStart } from "./types";

/**
 * An approved player fact laid over a quest's start (WO-146 Part 3), the way overrides.json lays Dave's finds: the way
 * carries `checked: "players"` and the source, so the pages and get_quest say it is a player's report, not the game files.
 * A fact that names the words of a way it replaces takes that way's place (and its place in the "One of" need);
 * otherwise it is one more way in. The record form (`raw`) is the files' and stays as it is.
 */
export function overlayStart(start: QuestStart, fact: PlayerFact): QuestStart {
  const ways = start.ways ?? [];
  // A second player's word that a way on the page is right (WO-146 Part 1b): their source joins the way's, nothing else changes.
  // Only a way a player's report already holds, and never the same player twice.
  if (fact.confirms) {
    const at = ways.findIndex((w) => w.how === fact.replaces && w.checked === "players");
    if (at < 0) return start;
    const have = [ways[at].source ?? "", ...(ways[at].also ?? [])];
    if (alreadyAmong(have, fact.source)) return start;
    return { ...start, ways: ways.map((w, i) => (i === at ? { ...w, also: [...(w.also ?? []), fact.source] } : w)) };
  }
  const at = fact.replaces ? ways.findIndex((w) => w.how === fact.replaces) : -1;
  const mine = { how: fact.way.how, checked: "players" as const, source: fact.source, ...(fact.way.who ? { who: fact.way.who } : {}), ...(fact.way.where ? { where: fact.way.where } : {}), ...(fact.way.whereIs?.length ? { whereIs: fact.way.whereIs } : {}) };
  let needs = start.needs ?? [];
  let next: NonNullable<QuestStart["ways"]>;
  if (at >= 0) {
    const old = ways[at];
    // Its needs stay; a place the player gave replaces the unplaced note and the files' places.
    const { unplaced: _gone, whereIs: oldPlaces, whereIsArea: oldAreas, ...kept } = old;
    void _gone;
    next = ways.map((w, i) => (i === at ? { ...kept, ...mine, ...(fact.way.whereIs?.length ? {} : { ...(oldPlaces ? { whereIs: oldPlaces } : {}), ...(oldAreas ? { whereIsArea: oldAreas } : {}) }) } : w));
    needs = needs.map((n) => n.split(old.how).join(fact.way.how));
  } else {
    next = [...ways, mine];
    const one = needs.findIndex((n) => n.startsWith("One of: "));
    if (one >= 0) needs = needs.map((n, i) => (i === one ? `${n}; or ${mine.how}` : n));
    else if (ways.length === 1 && needs[0] === ways[0].how) needs = [`One of: ${ways[0].how}; or ${mine.how}`, ...needs.slice(1)];
    else if (!ways.length) needs = [mine.how, ...needs];
  }
  return { ...start, needs, ways: next };
}

/** The lines with every approved fact laid over its quest. Lines and quests with none are the same objects. */
export function overlayLines(lines: QuestLine[], facts: readonly PlayerFact[]): QuestLine[] {
  if (!facts.length) return lines;
  return lines.map((line) => {
    const mine = facts.filter((f) => f.lineId === line.id);
    if (!mine.length) return line;
    const quests = line.quests.map((q): Quest => {
      const about = mine.filter((f) => f.quest === q.edid);
      if (!about.length || !q.start) return q;
      return { ...q, start: about.reduce((s, f) => overlayStart(s, f), q.start) };
    });
    return { ...line, quests };
  });
}
