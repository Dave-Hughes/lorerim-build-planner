import "server-only";
import { questsData } from "@/lib/quests/data";
import type { ActView } from "@/lib/playthroughs/view";
import { placesData, placeType, type Place } from "./data";

/**
 * suggest_places (WO-128 Part 2): the places near where an act goes, each with what points at it in the game and when
 * it fits the act's levels, and what the playthrough already uses, so an assistant ties a few places to people in the
 * act's towns and varies them. Read-only; never a place in a city or a home (the index holds none).
 */

const key = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

let townNames: string[] | null = null;
let measured: Set<string> | null = null;
/**
 * Every town an act can name, longest first so "Riverwood" beats "River": the towns the places index measures from, and
 * the towns quests start in (the data build's start.towns), so a city the index doesn't measure from yet is still known.
 */
function towns(): string[] {
  measured ??= new Set(placesData().places.flatMap((p) => (p.nearestTown ? [key(p.nearestTown.town)] : [])));
  townNames ??= [
    ...new Set([
      ...placesData().places.flatMap((p) => (p.nearestTown ? [p.nearestTown.town] : [])),
      ...questsData().lines.flatMap((l) => l.quests.flatMap((q) => q.start?.towns ?? [])).filter((t) => !t.includes(",") && !/ or /.test(t)),
    ]),
  ].sort((a, b) => b.length - a.length);
  return townNames;
}

/** The towns the places index has no place nearest to: an act there gets no places until the index measures from them. */
export function unmeasured(list: readonly string[]): string[] {
  towns();
  return list.filter((t) => !measured!.has(key(t)));
}

/** The towns a line of words names ("Riverwood and Whiterun", "the road to Ivarstead"). */
export function townsIn(text: string | null | undefined): string[] {
  if (!text) return [];
  let rest = ` ${key(text)} `;
  const out: string[] = [];
  for (const t of towns()) {
    const k = ` ${key(t)} `;
    if (rest.includes(k)) {
      out.push(t);
      rest = rest.replace(k, " ");
    }
  }
  return out;
}

let questTowns: Map<string, string[]> | null = null;
/** The towns a planner quest starts in, by its edid (its start's ways and giver, from the data build). */
function townsOfQuest(edid: string): string[] {
  questTowns ??= new Map(questsData().lines.flatMap((l) => l.quests.map((q) => [q.edid, q.start?.towns ?? []] as const)));
  return questTowns.get(edid) ?? [];
}

/**
 * Where an act goes (Part 2): the towns its place names, the towns its linked quests start in, and earlier acts' places.
 * `extra` is any more stops the act names (its route, WO-129).
 */
export function actTowns(acts: readonly Pick<ActView, "place" | "objectives">[], at: number, extra: readonly string[] = []): string[] {
  const a = acts[at];
  const quests = a.objectives.flatMap((o) => [o.detect?.quest, o.link?.kind === "quest" ? o.link.id : null]).filter((q): q is string => !!q);
  const all = [...townsIn(a.place), ...extra.flatMap((x) => townsIn(x)), ...quests.flatMap(townsOfQuest).flatMap((t) => townsIn(t)), ...acts.slice(0, at).flatMap((x) => townsIn(x.place))];
  return [...new Set(all)];
}

export type When = "fits now" | `plant now, pay off later (levels ${string})` | "too high for this act" | "levels not read yet";

/**
 * When a place fits the act's levels. Its top is the boss's level when the record fixes it, else the highest placed actor;
 * a boss leveled from N (or to your level) scales with her, so N is its floor. Fits when the top is within the act's
 * levels; too high when even its weakest actor is above them; otherwise planted now and paid off once she reaches the top.
 */
export function whenFor(p: Place, levelFrom: number, levelTo: number | null): When {
  const top = levelTo ?? levelFrom + 10;
  const boss = p.actors?.boss?.level ?? "";
  const fixed = /^level (\d+)/.exec(boss);
  const leveled = /^leveled from (\d+)/.exec(boss);
  const scales = leveled || /^your level/.test(boss);
  if (!p.actors && !fixed) return "levels not read yet";
  const [low, high] = p.actors?.levels ?? [0, 0];
  const peak = fixed ? Number(fixed[1]) : scales ? Number(leveled?.[1] ?? 1) : high;
  if (peak <= top) return "fits now";
  if (low > top) return "too high for this act";
  return `plant now, pay off later (levels ${peak} and up)`;
}

/** A boss in words: "Sigdis Gauldurson, level 40", "leveled from 1". */
const bossLine = (p: Place) => {
  const b = p.actors?.boss;
  if (!b) return null;
  return [b.name, b.level].filter(Boolean).join(", ") || null;
};

export interface Used {
  /** Places the playthrough's objectives link to, with the act and the town. */
  linked: { place: string; act: string; type: string; town: string | null }[];
  /** Places an act passes by on purpose. */
  passedBy: { place: string; act: string; why: string }[];
}

/**
 * Stops, not suggestions (WO-147 Part 3, Bob's ruling): towns, settlements, cities, inns, temples, keeps, stables and homes are in
 * the index because routes, search and objectives need them, but suggest_places is for places a character goes to on purpose out in
 * the world (rule 20). An Orc stronghold stays in: a destination with a gate and a reason. Guild halls stay in too: Bob's list
 * didn't name them (WO-147 notes).
 */
const STOPS = new Set(["City", "Town", "Settlement", "Inn", "Temple", "Keep", "Stables", "House", "PlayerHouse"]);

/** The places near the act's towns, those the game itself points at first, then the nearest. */
export function placesNear(townList: readonly string[], levelFrom: number, levelTo: number | null, used: Used, limit = 16) {
  const want = new Set(townList.map(key));
  const taken = new Set([...used.linked.map((u) => key(u.place)), ...used.passedBy.map((u) => key(u.place))]);
  const near = placesData()
    .places.filter((p) => p.nearestTown && want.has(key(p.nearestTown.town)) && !STOPS.has(p.type))
    .sort((a, b) => Number(!a.pointers?.length) - Number(!b.pointers?.length) || a.nearestTown!.km - b.nearestTown!.km);
  return near.slice(0, limit).map((p) => {
    const pointers = (p.pointers ?? [])
      // A line someone in a town says first, then other lines, then books; four at most.
      .slice()
      .sort((a, b) => Number(!a.speaker) - Number(!b.speaker) || Number(a.kind === "book") - Number(b.kind === "book"))
      .slice(0, 4)
      .map((x) => ({
        ...(x.kind === "book" ? { book: x.book } : { who: x.speaker ?? "someone the line doesn't name", ...(x.speakerPlace ? { where: x.speakerPlace } : {}) }),
        says: x.words,
        ...(x.quest ? { inQuest: x.quest } : {}),
      }));
    const quests = p.quests ?? [];
    return {
      place: p.name,
      type: placeType(p.type),
      ...(p.hold ? { hold: p.hold } : {}),
      nearestTown: p.nearestTown ? `${p.nearestTown.town}, ${p.nearestTown.km} km` : null,
      ...(p.actors ? { levels: `${p.actors.levels[0]} to ${p.actors.levels[1]}` } : {}),
      ...(bossLine(p) ? { boss: bossLine(p) } : {}),
      clearXp: p.clearXp,
      when: whenFor(p, levelFrom, levelTo),
      pointers,
      ...(pointers.length ? {} : { noPointer: "Nothing in the game names it. A hook here is the player's own: write it and say it's theirs." }),
      ...(quests.length ? { questGoesThere: quests, note: `${quests.join(" and ")} already ${quests.length === 1 ? "goes" : "go"} there: use the quest, never a hook of your own.` } : {}),
      ...(taken.has(key(p.name)) ? { alreadyInThePlaythrough: true } : {}),
    };
  });
}
