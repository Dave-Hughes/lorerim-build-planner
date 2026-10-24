import "server-only";
import { isHelper } from "@/lib/mcp/quest-log";
import { questsData } from "@/lib/quests/data";
import type { ActView } from "@/lib/playthroughs/view";
import { meetsAt, placesData, placeType, rangeOf, type Place } from "./data";

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

export type When = "fits now" | `plant now, pay off later (levels ${string})` | "too high for this act" | "levels not checked yet";

/** A boss's level as [lowest, highest]: "level 40", "leveled 19-24", "leveled from 7"; null for one that matches her level. */
function bossRange(level: string | undefined): [number, number] | null {
  const l = level ?? "";
  let m = /^level (\d+)/.exec(l);
  if (m) return [Number(m[1]), Number(m[1])];
  m = /^leveled (\d+)-(\d+)/.exec(l);
  if (m) return [Number(m[1]), Number(m[2])];
  m = /^leveled from (\d+)/.exec(l);
  if (m) return [Number(m[1]), Number(m[1])];
  return null;
}

/**
 * When a place fits the act's levels, judged by what she'll meet and leniently (WO-148 item 9, Dave: a character can usually
 * take enemies several levels above her unless badly under-geared, and a boss 15 or more above isn't out of the question). With the
 * act's top level T, the weakest enemy F she meets at T (`atLevel`, WO-150; the place's floor when no row is open to her yet) and the
 * boss's lowest level B: fits now when F is at or below T and B is within 20 of T ("the boss is a hard fight at this level" from 10 above); plant now, pay off later when F is 10 or more above T or B
 * is more than 20 above, from the level she can face it ("levels N and up"); too high for this act only when F is 20 or more above T.
 * A boss that matches her level never counts against her. The thresholds are guidance.
 */
export function fitOf(p: Place, levelFrom: number, levelTo: number | null): { when: When; note?: string } {
  const top = levelTo ?? levelFrom + 10;
  if (!p.actors) return { when: "levels not checked yet" };
  const floor = meetsAt(p.actors, top)?.[0] ?? rangeOf(p.actors)[0];
  const boss = bossRange(p.actors.boss?.level);
  const floorGap = floor - top;
  const bossGap = boss ? boss[0] - top : -Infinity;
  if (floorGap >= 20) return { when: "too high for this act" };
  if (floorGap >= 10 || bossGap > 20) return { when: `plant now, pay off later (levels ${Math.max(floor - 10, boss ? boss[0] - 20 : 0)} and up)` };
  return { when: "fits now", ...(bossGap >= 10 ? { note: "the boss is a hard fight at this level" } : {}) };
}

export const whenFor = (p: Place, levelFrom: number, levelTo: number | null): When => fitOf(p, levelFrom, levelTo).when;

/**
 * What she'll meet there, said with its range and never hidden (WO-148 item 9, WO-150): "enemies from level 6, never below 6; at 12 you
 * meet 6 to 12; the boss Zulakaroth, Keeper of the Dragonstone, level 40". `at` is the act's top level.
 */
function meet(p: Place, at: number): string | null {
  const a = p.actors;
  if (!a) return null;
  const [floor] = rangeOf(a);
  const now = meetsAt(a, at);
  const boss = a.boss;
  const range = (r: [number, number]) => (r[0] === r[1] ? `${r[0]}` : `${r[0]} to ${r[1]}`);
  return `enemies from level ${floor}${a.zoneMin ? `, never below ${a.zoneMin}` : ""}${now ? `; at ${at} you meet ${range(now)}` : `; nothing here is in play yet at ${at}`}${boss ? `; the boss ${[boss.name, boss.level].filter(Boolean).join(", ")}` : ""}`;
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
 * the world (rule 20). An Orc stronghold stays in: a destination with a gate and a reason. Guild halls are stops too (WO-151).
 */
const STOPS = new Set(["City", "Town", "Settlement", "Inn", "Temple", "Keep", "Stables", "House", "PlayerHouse", "Guild"]);

/**
 * Not a suggestion (WO-151): a stop, or anything the index says sits inside a town (a guild hall, an inn, a temple), where nobody
 * starts out hostile. A "boss" in the Thieves Guild Headquarters is a guildmaster, not a fight.
 */
const notASuggestion = (p: Place) => STOPS.has(p.type) || !!p.inTown || (p.actors?.hostile === false && !isStronghold(p));

/** An Orc stronghold stays in as a destination, but its people aren't enemies: no levels, no boss, no fit (WO-151). */
const isStronghold = (p: Place) => p.type === "OrcStronghold";

/** How far, in a player's words: "a short walk from Riften". The kilometres only sort. */
export function farFrom(near: { town: string; walk?: string }): string {
  switch (near.walk) {
    case "next to it":
      return `next to ${near.town}`;
    case undefined:
      return `near ${near.town}`;
    default:
      return `${near.walk} from ${near.town}`;
  }
}

/** The town whose dialogue quest a line belongs to ("Riften Dialogue", "Whiterun City Dialogue"), else null. */
function gossipTown(quest: string | undefined): string | null {
  const m = /^(.+?)(?: City)? Dialogue$/i.exec(quest ?? "");
  return m ? (towns().find((t) => key(t) === key(m[1])) ?? null) : null;
}

let listed: Set<string> | null = null;
/**
 * The quests a place can name (WO-151): ones the planner lists by name and a player sees by name. A handler, a helper or a vendor
 * script ("BCSLL Vendor Quest") is background and never named, as the quest log does.
 */
function namedQuests(names: readonly string[] | undefined): string[] {
  listed ??= new Set(questsData().lines.flatMap((l) => l.quests.map((q) => q.name)));
  return [...new Set(names ?? [])].filter((n) => listed!.has(n) && !isHelper(n));
}

/** The places near the act's towns, those the game itself points at first, then the nearest. */
export function placesNear(townList: readonly string[], levelFrom: number, levelTo: number | null, used: Used, limit = 16) {
  const want = new Set(townList.map(key));
  const taken = new Set([...used.linked.map((u) => key(u.place)), ...used.passedBy.map((u) => key(u.place))]);
  const near = placesData()
    .places.filter((p) => p.nearestTown && want.has(key(p.nearestTown.town)) && !notASuggestion(p))
    .sort((a, b) => Number(!a.pointers?.length) - Number(!b.pointers?.length) || a.nearestTown!.km - b.nearestTown!.km);
  return near.slice(0, limit).map((p) => {
    const pointers = (p.pointers ?? [])
      .flatMap((x) => {
        if (x.kind === "book") return [x];
        if (x.speaker) return [x];
        // A line with no speaker is the town's gossip only when it belongs to that town's dialogue quest ("Riften Dialogue"); the records
        // name no alias or follower for any other, so it's left out (WO-151).
        const gossip = gossipTown(x.quest);
        return gossip ? [{ ...x, speaker: `people in ${gossip}`, quest: undefined }] : [];
      })
      // A line someone in a town says first, then other lines, then books; four at most.
      .sort((a, b) => Number(!a.speaker) - Number(!b.speaker) || Number(a.kind === "book") - Number(b.kind === "book"))
      .slice(0, 4)
      .map((x) => ({
        ...(x.kind === "book" ? { book: x.book } : { who: x.speaker, ...(x.speakerPlace ? { where: x.speakerPlace } : {}) }),
        says: x.words,
        ...(x.quest ? { inQuest: x.quest } : {}),
      }));
    const quests = namedQuests(p.quests);
    const stronghold = isStronghold(p);
    const fit = stronghold ? null : fitOf(p, levelFrom, levelTo);
    const enemies = stronghold ? null : meet(p, levelTo ?? levelFrom);
    return {
      place: p.name,
      type: placeType(p.type),
      ...(p.hold ? { hold: p.hold } : {}),
      nearestTown: p.nearestTown ? farFrom(p.nearestTown) : null,
      ...(stronghold
        ? {
            // The people live there and aren't a fight: the game's own words to a stranger at the door.
            welcome: `The Orcs of ${p.name} live here. ${p.enters ? `At the door they say: "${p.enters.words}"` : "Outsiders aren't welcome."}`,
          }
        : p.actors
          ? { levels: `${rangeOf(p.actors)[0]} to ${rangeOf(p.actors)[1]}` }
          : { levels: "not checked yet" }),
      ...(!stronghold && bossLine(p) ? { boss: bossLine(p) } : {}),
      ...(!stronghold ? { clearXp: p.clearXp } : {}),
      ...(enemies ? { enemies } : {}),
      ...(fit ? { when: fit.when } : {}),
      ...(fit?.note ? { fitNote: fit.note } : {}),
      pointers,
      ...(pointers.length ? {} : { noPointer: "Nothing in the game names it. A hook here is the player's own: write it and say it's theirs." }),
      ...(quests.length ? { questGoesThere: quests, note: `${quests.join(" and ")} already ${quests.length === 1 ? "goes" : "go"} there: use the quest, never a hook of your own.` } : {}),
      ...(taken.has(key(p.name)) ? { alreadyInThePlaythrough: true } : {}),
    };
  });
}
