import "server-only";
import { peopleData, roleWords, type Person } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { placeHref, placesData, rangeOf, type Place } from "./data";
import { placeKind } from "./kind";

/**
 * Who a place's page names (WO-162): the people placed in a town (their `inTown`) or in an inn, temple or hall (their `cell`), grouped by the
 * home or building they sleep in, each with the role from the people reads and what they do for a player. Animals and the many with a name
 * and nothing else (a guard, a citizen, a soldier) are left out: only people a player asks about, the same as the people pages.
 */
export interface PlaceChip {
  kind: "sells" | "trains" | "follower" | "rents" | "quests";
  text: string;
}
export interface PlacePerson {
  name: string;
  href: string;
  role: string | null;
  chips: PlaceChip[];
  /** What they sell, in a few words, for the page's summary. */
  sells: string | null;
  trains: string | null;
  follower: boolean;
  keeper: boolean;
  gives: number;
}
export interface House {
  name: string;
  /** A building with a page of its own (an inn, a temple), else null. */
  href: string | null;
  people: PlacePerson[];
}

const ANIMAL = /\b(cat|chick|chicken|dog|horse|goat|cow|rabbit|deer|fox|skeever|mudcrab|pig|sheep|wolf|bear)\b/i;

const notable = (p: Person) => !!(p.read || p.follower || p.marriage || p.sells || p.trainer || p.innkeeper || questsOf(p.name).length > 0);

/** "general goods, 7 am to 8 pm" is "general goods": what is sold, without the hours or the aside. */
const shortSells = (s: string) => s.split(/[;(]|,\s*\d/)[0].trim().replace(/\.$/, "");

function personOf(p: Person): PlacePerson {
  const read = p.read;
  const sells = read ? shortSells(read.sells) : p.sells ? "goods" : "";
  const trainsSkill = read ? (read.trains ? (p.trainer?.skill ?? read.trains.split(/[\s(,]/)[0]) : null) : (p.trainer?.skill ?? null);
  const gives = questsOf(p.name).filter((q) => q.gives).length;
  const role = (read?.role ? read.role.split(";")[0].trim() : roleWords(p.role)) || null;
  const chips: PlaceChip[] = [];
  if (sells) chips.push({ kind: "sells", text: "Sells" });
  if (trainsSkill) chips.push({ kind: "trains", text: `Trains ${trainsSkill}` });
  if (p.follower) chips.push({ kind: "follower", text: "Follower" });
  if (p.innkeeper) chips.push({ kind: "rents", text: "Rents rooms" });
  if (gives > 0) chips.push({ kind: "quests", text: gives === 1 ? "Gives a quest" : "Gives quests" });
  return { name: p.name, href: `/people/${p.slug}`, role, chips, sells: sells || null, trains: trainsSkill, follower: !!p.follower, keeper: !!p.innkeeper, gives };
}

/** The people at a place, grouped by the building they sleep in; a town's, or an inn's, temple's or hall's. */
export function peopleAt(place: Place): { houses: House[]; total: number } {
  const here = peopleData().all.filter((p) => !(p.race && ANIMAL.test(p.race)) && notable(p) && (placeKind(place) === "inside" ? p.cell === place.name : p.inTown === place.name));
  const groups = new Map<string, PlacePerson[]>();
  for (const p of here) {
    const home = p.cell && p.cell !== place.name ? p.cell : place.name;
    groups.set(home, [...(groups.get(home) ?? []), personOf(p)]);
  }
  const houses: House[] = [...groups]
    .map(([name, people]) => ({
      name,
      href: name === place.name ? null : placeHref(name),
      // The keeper first, then the ones with something for a player, then the rest.
      people: people.sort((a, b) => Number(b.keeper) - Number(a.keeper) || b.chips.length - a.chips.length || a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.people.length - a.people.length || a.name.localeCompare(b.name));
  return { houses, total: here.length };
}

/** The dangerous places whose nearest town is this one (a name once: a mod's second record of a place is left out), nearest first. */
export function closeBy(town: Place): { place: Place; range: [number, number] | null; words: string }[] {
  const seen = new Map<string, Place>();
  for (const p of placesData().places) {
    if (p.nearestTown?.town !== town.name || p === town || placeKind(p) !== "dangerous") continue;
    const had = seen.get(p.name);
    if (!had || (p.actors?.count ?? 0) > (had.actors?.count ?? 0)) seen.set(p.name, p);
  }
  return [...seen.values()]
    .sort((a, b) => (a.nearestTown!.km ?? 0) - (b.nearestTown!.km ?? 0) || a.name.localeCompare(b.name))
    .slice(0, 8)
    .map((p) => ({ place: p, range: p.actors && (p.actors.floor !== undefined || p.actors.atLevel?.length) ? rangeOf(p.actors) : null, words: p.nearestTown!.walk === "next to it" ? "next to it" : (p.nearestTown!.walk ?? "close by") }));
}
