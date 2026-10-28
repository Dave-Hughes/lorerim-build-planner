import "server-only";
import { peopleData, roleWords, type Person } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { placeHref, placeHrefOf, placesData, placesNamed, rangeOf, type Place } from "./data";
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
  /** 2 when the read names them the keeper, 1 when only the record does, so the keeper the read gives comes first. */
  keeperRank: number;
  gives: number;
  read: boolean;
}
export interface House {
  name: string;
  /** A building with a page of its own (an inn, a temple), else null. */
  href: string | null;
  people: PlacePerson[];
}

const ANIMAL = /\b(cat|chick|chicken|dog|horse|goat|cow|rabbit|deer|fox|skeever|mudcrab|pig|sheep|wolf|bear)\b/i;

const notable = (p: Person) => !!(p.read || p.follower || p.marriage || p.sells || p.trainer || p.innkeeper || questsOf(p.name).length > 0);

const PEOPLE = /^(Nord|Imperial|Breton|Redguard|Dunmer|Altmer|Bosmer|Orsimer|Khajiit|Argonian|Elder)$/;
const TITLED = /^(dead|ghostly|wounded|visiting|sickly|blasphemous|hired|imperial|stormcloak|subjugated|alik'r|silver hand|housecarl|commander|acolyte|dragonsreach)\b/i;

/** Anyone with a person page who sleeps here: someone a player asks about, or a person with a name of their own (Hod, Embry, Dorthe), not a type of soldier or a creature. */
const lives = (p: Person) => notable(p) || (p.rows.length === 1 && !!p.race && PEOPLE.test(p.race) && !TITLED.test(p.name));

/** "general goods, 7 am to 8 pm" is "general goods": what is sold, without the hours or the aside. */
const shortSells = (s: string) => s.split(/[;(]|,\s*\d/)[0].trim().replace(/\.$/, "");

/** What a seller sells, in a few words: the read's, else the job the record gives, else what the building's name says, else just goods. */
const SHOP: Record<string, string> = { JobBlacksmith: "blacksmith", JobApothecary: "apothecary", JobMerchant: "general goods", JobSpellVendor: "spells", JobFletcher: "fletcher's goods" };
const shopOf = (p: Person) => (p.read ? shortSells(p.read.sells) : p.sells ? (SHOP[p.role ?? ""] ?? (/trader|general/i.test(p.cell ?? "") ? "general goods" : /smith|forge/i.test(p.cell ?? "") ? "blacksmith" : "goods")) : "");

function personOf(p: Person): PlacePerson {
  const read = p.read;
  const sells = shopOf(p);
  const readKeeper = !!read && /\binnkeeper\b|rents rooms/i.test(read.role ?? "");
  const keeper = !!p.innkeeper || readKeeper;
  const trainsSkill = read ? (read.trains ? (p.trainer?.skill ?? read.trains.split(/[\s(,]/)[0]) : null) : (p.trainer?.skill ?? null);
  const gives = questsOf(p.name).filter((q) => q.gives).length;
  // Roles are in sentence case wherever they are said (WO-177).
  const raw = (read?.role ? read.role.split(";")[0].trim() : roleWords(p.role)) || null;
  const role = raw ? `${raw.charAt(0).toUpperCase()}${raw.slice(1)}` : null;
  const chips: PlaceChip[] = [];
  if (sells) chips.push({ kind: "sells", text: "Sells" });
  if (trainsSkill) chips.push({ kind: "trains", text: `Trains ${trainsSkill}` });
  if (p.follower) chips.push({ kind: "follower", text: "Follower" });
  if (keeper) chips.push({ kind: "rents", text: "Rents rooms" });
  if (gives > 0) chips.push({ kind: "quests", text: gives === 1 ? "Gives a quest" : "Gives quests" });
  return { name: p.name, href: `/people/${p.slug}`, role, chips, sells: sells || null, trains: trainsSkill, follower: !!p.follower, keeper, keeperRank: readKeeper ? 2 : p.innkeeper ? 1 : 0, gives, read: !!read };
}

/** The people at a place, grouped by the building they sleep in; a town's, or an inn's, temple's or hall's. */
export function peopleAt(place: Place): { houses: House[]; total: number } {
  const inside = placeKind(place) === "inside";
  // A hall or temple in a town: the name can be in four towns (Hall of the Dead), so a row has to be in this one's town too.
  const sameName = placesNamed(place.name).length > 1;
  const placed = (r: Person["rows"][number]) => (inside ? r.cell === place.name && (!sameName || !place.inTown || !r.inTown || r.inTown === place.inTown) : r.inTown === place.name || r.cell === place.name);
  const here = peopleData().all.filter((p) => !(p.race && ANIMAL.test(p.race)) && lives(p) && p.rows.some(placed));
  const groups = new Map<string, PlacePerson[]>();
  for (const p of here) {
    const row = p.rows.find(placed)!;
    const home = row.cell && row.cell !== place.name ? row.cell : place.name;
    groups.set(home, [...(groups.get(home) ?? []), personOf(p)]);
  }
  // A building whose name is in more than one town (a Hall of the Dead) is the one in this town.
  const town = inside ? place.inTown : place.name;
  const homeHref = (name: string) => {
    const mine = placesNamed(name).length > 1 ? placesNamed(name).find((x) => x.inTown === town) : null;
    return mine ? placeHrefOf(mine) : placeHref(name);
  };
  const houses: House[] = [...groups]
    .map(([name, people]) => ({
      name,
      href: name === place.name ? null : homeHref(name),
      // The keeper first, then the ones with something for a player, then the rest.
      people: people.sort((a, b) => b.keeperRank - a.keeperRank || b.chips.length - a.chips.length || Number(b.read) - Number(a.read) || a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.people.length - a.people.length || a.name.localeCompare(b.name));
  return { houses, total: here.length };
}

/** The dangerous places whose nearest town is this one (a name once: a mod's second record of a place is left out), nearest first. */
export function closeBy(town: Place): { place: Place; range: [number, number] | null; words: string }[] {
  const seen = new Map<string, Place>();
  for (const p of placesData().places) {
    if (p.nearestTown?.town !== town.name || p === town || placeKind(p) !== "dangerous") continue;
    // Two places of one name in different holds (the Imperial camps) are two places.
    const k = `${p.name}|${p.hold ?? ""}`;
    const had = seen.get(k);
    if (!had || (p.actors?.count ?? 0) > (had.actors?.count ?? 0)) seen.set(k, p);
  }
  return [...seen.values()]
    .sort((a, b) => (a.nearestTown!.km ?? 0) - (b.nearestTown!.km ?? 0) || a.name.localeCompare(b.name))
    .slice(0, 8)
    .map((p) => ({ place: p, range: p.actors && (p.actors.floor !== undefined || p.actors.atLevel?.length) ? rangeOf(p.actors) : null, words: p.nearestTown!.walk === "next to it" ? "next to it" : (p.nearestTown!.walk ?? "close by") }));
}
