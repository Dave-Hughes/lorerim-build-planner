import "server-only";
import { peopleData, roleWords, type Person, type SellerShop } from "@/lib/people/data";
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
  /** Runs a shop (WO-180 Part 7a): the vendor faction they belong to has a vendor chest placed and a list of what it takes. The record's "sells" flag alone is not that (a Companion, a bard and a housecarl have it). An innkeeper's food is the inn's. */
  shopkeeper: boolean;
  /** The shop they work at, from the vendor faction's own data (shops.py): what it sells, its hours, and where its chest stands. */
  shop: SellerShop | null;
}
export interface House {
  name: string;
  /** A building with a page of its own (an inn, a temple), else null. */
  href: string | null;
  people: PlacePerson[];
}

const ANIMAL = /\b(cat|chick|chicken|dog|horse|goat|cow|rabbit|deer|fox|skeever|mudcrab|pig|sheep|wolf|bear|(?:death)?hound)\b/i;

const notable = (p: Person) => !!(p.read || p.follower || p.marriage || p.sells || p.trainer || p.innkeeper || questsOf(p.name).length > 0);

const PEOPLE = /^(Nord|Imperial|Breton|Redguard|Dunmer|Altmer|Bosmer|Orsimer|Khajiit|Argonian|Elder)$/;
const TITLED = /^(dead|ghostly|wounded|visiting|sickly|blasphemous|hired|imperial|stormcloak|subjugated|alik'r|silver hand|housecarl|commander|acolyte|dragonsreach)\b/i;

/** Anyone with a person page who sleeps here: someone a player asks about, or a person with a name of their own (Hod, Embry, Dorthe), not a type of soldier or a creature. */
const lives = (p: Person) => notable(p) || (p.rows.length === 1 && !!p.race && PEOPLE.test(p.race) && !TITLED.test(p.name));

/**
 * What a shop sells, in a word players use (WO-180 Part 6a): blacksmith, general goods, apothecary, food, spells. By the shop's name first, then what the read says it
 * sells and the job it gives; the first of these that matches wins. "Goods" alone says nothing, so a shop whose words give no kind is general goods.
 */
const KINDS: [RegExp, string][] = [
  [/warmaiden/i, "weapons and armor"],
  [/apothecar|alchem|potion|ingredient|elixir|cauldron|wisdoms?|concoction|\bcure\b|phial|aromatic/i, "apothecary"],
  [/blacksmith|smith|forge|anvil|hammer|weapon|armou?r/i, "blacksmith"],
  [/court wizard|spell/i, "spells"],
  [/fletch|arrow|\bbows?\b/i, "fletcher"],
  [/huntsman|hunter/i, "hunting goods"],
  [/meadery|\bmead\b/i, "mead"],
  [/bakery|bakeshop|bread|baker|cookhouse|\bfood\b|\bdrink\b|\bale\b|innkeepers|inn goods/i, "food"],
  [/clothing|raiment|tailor|clothes/i, "clothing"],
  [/\bbooks?\b|arcanaeum|writings/i, "books"],
  [/jewel|\bgems?\b/i, "jewelry"],
];
export const kindOf = (...texts: (string | null | undefined)[]) => {
  const s = texts.filter(Boolean).join(" ; ");
  return KINDS.find(([re]) => re.test(s))?.[1] ?? "general goods";
};
/** What a seller's place is called when it has no name of its own and is not a stall in the market: "Lod's smithy", "Falion's spell shop". */
const NOUN: Record<string, string> = { blacksmith: "smithy", apothecary: "apothecary", spells: "spell shop", silversmith: "silversmith", fletcher: "fletchery", weapons: "weapon shop" };

/** A building whose name says it is a shop. */
const SHOPPY = /goods|cauldron|wisdoms?|smith|forge|bakery|bakeshop|stall|warmaiden|trader|market|store|shop|armou?r|fletch|apothecary|alchem|emporium|wares|meadery|elixirs|oddments|imports|warehouse|company|raiment|aromatics|phial/i;
/** A building a person lives in, or a hall, keep or temple: its name is not a shop's. */
const HOMELY = /\b(?:house|home|residence|lodging|quarters|bunkhouse|shack|hall|keep|palace|castle|temple|barracks|jail)\b/i;
/** The name the places call a building by: the people's cells say "Pawned Prawn" where the places say "The Pawned Prawn". */
const officialName = (name: string) => placesNamed(name)[0]?.name ?? placesNamed(`The ${name}`)[0]?.name ?? name;
/** Whether the place of this name is of this type; the people's cells say "The Bee and Barb" where the places say "Bee and Barb". */
const placeOfType = (name: string | null | undefined, type: string) => !!name && [name, name.replace(/^the\s+/i, "")].some((n) => placesNamed(n).some((x) => x.type === type));
/** A seller in the open at a forge the places do not list: UESP's "Eorlund works at the Skyforge" (the chest stands beside it). */
const FORGES: Record<string, string> = { "Eorlund Gray-Mane": "The Skyforge" };

/** A mod's nameless worker ("Worker", at a brothel in every city) is no shopkeeper a player can look for. */
const GENERIC_SELLER = /^(?:worker|vendor|merchant|shopkeeper|clerk|servant|customer)$/i;

function personOf(p: Person, row?: Person["rows"][number]): PlacePerson {
  const read = p.read;
  // The shop is the vendor faction's (WO-180 Part 7a). A follower's is theirs, not a shop; an innkeeper's food is the inn's.
  // (the row they are placed by: a name placed in two towns, Frida's, has its shop in one.)
  const mine = row ? row.shop : p.shop;
  const shop = mine && !p.follower && !GENERIC_SELLER.test(p.name) && !(mine.kind === "food" && placeOfType(mine.cell, "Inn")) ? mine : null;
  const shopkeeper = !!shop;
  const sells = shop?.kind ?? "";
  const readKeeper = !!read && /\binnkeeper\b|rents rooms/i.test(read.role ?? "") && !/stand-in|\bbard\b|barmaid|\bserver\b/i.test(read.role ?? "");
  const keeper = !!p.innkeeper || readKeeper;
  const trainsSkill = read ? (read.trains ? (p.trainer?.skill ?? read.trains.split(/[\s(,]/)[0]) : null) : (p.trainer?.skill ?? null);
  const gives = questsOf(p.name).filter((q) => q.gives).length;
  // Roles are in sentence case wherever they are said (WO-177).
  const raw = (read?.role ? read.role.split(";")[0].trim() : roleWords(p.role)) || null;
  const role = raw ? `${raw.charAt(0).toUpperCase()}${raw.slice(1)}` : null;
  const chips: PlaceChip[] = [];
  // "Sells" is for the person who runs a shop, not everyone the record flags as a vendor (a Companion, a bard and a housecarl have it).
  if (shopkeeper) chips.push({ kind: "sells", text: "Sells" });
  if (trainsSkill) chips.push({ kind: "trains", text: `Trains ${trainsSkill}` });
  if (p.follower) chips.push({ kind: "follower", text: "Follower" });
  if (keeper) chips.push({ kind: "rents", text: "Rents rooms" });
  if (gives > 0) chips.push({ kind: "quests", text: gives === 1 ? "Gives a quest" : "Gives quests" });
  return {
    name: p.name,
    href: `/people/${p.slug}`,
    role,
    chips,
    sells: sells || null,
    trains: trainsSkill,
    follower: !!p.follower,
    keeper,
    keeperRank: readKeeper ? 2 : p.innkeeper ? 1 : 0,
    gives,
    read: !!read,
    shopkeeper,
    shop,
  };
}

export interface Shop {
  /** The shop or the stall; when it has no name of its own, the keeper's name and what it is ("Brand-Shei's stall"). */
  name: string;
  href: string | null;
  keeper: PlacePerson;
  /** What it sells in a word players use ("blacksmith", "general goods", "apothecary", "food"). */
  kind: string;
  /** Set when the shop has no name of its own: the page says "<keeper>'s <noun>" ("stall in the market", "smithy in Understone Keep"). */
  noun: string | null;
  /** When it is open, in words ("8 am to 8 pm"); null when it never closes. */
  hours: string | null;
}

/**
 * The shops among a place's houses (WO-180 Part 7a), from the vendor factions' own data and no longer from a guess at the keeper's cell: a seller's shop is where their
 * vendor chest stands. A chest in a building the places call a Store (or a meadery) is that shop, named by the building; a chest in the open in a city is "<keeper>'s stall in
 * the market"; a chest in the open elsewhere is the seller's own forge or stand ("Alvor's smithy"); a chest in a home, a keep or a hall is the seller working from there
 * ("Ghorza's smithy in Understone Keep"), never the home as a shop. What it sells is what the vendor list takes, and the hours are the faction's. One shop each; the keeper
 * is who sleeps there, else the better-known seller, and the ones who sell from another's chest (Ysolda, from Belethor's) are in that shop.
 */
export function shopsOf(houses: House[]): Shop[] {
  const out = new Map<string, Shop & { rank: number }>();
  for (const h of houses) {
    for (const p of h.people) {
      const s = p.shop;
      if (!s || !p.shopkeeper) continue;
      const cell = s.cell ? officialName(s.cell) : null;
      // (a house the places call a Store is still a house: Falion sells from his, he doesn't keep a shop called "Falion's House")
      const building = !!cell && !HOMELY.test(cell) && (placeOfType(cell, "Store") || placeOfType(cell, "Meadery") || (SHOPPY.test(cell) && !placeOfType(cell, "Inn")));
      let name: string | null = null;
      let href: string | null = null;
      let noun: string | null = null;
      let key: string;
      if (building) {
        name = cell;
        href = placeHref(cell!);
        key = cell!.toLowerCase();
      } else if (s.stall && FORGES[p.name]) {
        name = FORGES[p.name];
        href = placeHref(name);
        key = name.toLowerCase();
      } else if (s.stall) {
        // a smith in the open in a city works at a forge (the Skyforge), not a stall in its market
        noun = s.kind === "blacksmith" ? "forge" : "stall in the market";
        key = `stall|${p.name}`;
      } else {
        const base = NOUN[s.kind] ?? "shop";
        noun = cell ? `${base} in ${cell}` : base;
        href = cell ? placeHref(cell) : null;
        key = cell ? `${cell}|${s.kind}`.toLowerCase() : `own|${p.name}`;
      }
      const rank = (cell && h.name === cell ? 4 : 0) + (p.read ? 1 : 0);
      const had = out.get(key);
      if (!had || rank > had.rank) out.set(key, { name: name ?? `${p.name}'s ${noun}`, href, keeper: p, kind: s.kind, noun, hours: s.hours ?? null, rank });
    }
  }
  return [...out.values()].map((s): Shop => ({ name: s.name, href: s.href, keeper: s.keeper, kind: s.kind, noun: s.noun, hours: s.hours })).sort((a, b) => a.name.localeCompare(b.name));
}

/** The inns among a place's houses: a building the places call an Inn, or one whose keeper the read names; a keeper in a shop is not an inn. */
export function innsOf(houses: House[]): House[] {
  return houses.filter((h) => h.people.some((p) => p.keeper) && (placeOfType(h.name, "Inn") || h.people.some((p) => p.keeperRank === 2)) && !placeOfType(h.name, "Store"));
}

/** The people at a place, grouped by the building they sleep in; a town's, or an inn's, temple's or hall's. */
export function peopleAt(place: Place): { houses: House[]; total: number } {
  const inside = placeKind(place) === "inside";
  // A hall or temple in a town: the name can be in four towns (Hall of the Dead), so a row has to be in this one's town too.
  const sameName = placesNamed(place.name).length > 1;
  // The cell is called what the game calls it, which may be an alias of the place's name (Volkihar Keep for Castle Volkihar, WO-178).
  const named = (cell: string | null | undefined) => !!cell && (cell === place.name || cell === place.recordName || !!place.aliases?.includes(cell));
  const placed = (r: Person["rows"][number]) => (inside ? named(r.cell) && (!sameName || !place.inTown || !r.inTown || r.inTown === place.inTown) : r.inTown === place.name || named(r.cell));
  const here = peopleData().all.filter((p) => !(p.race && ANIMAL.test(p.race)) && lives(p) && p.rows.some(placed));
  const groups = new Map<string, PlacePerson[]>();
  for (const p of here) {
    const row = p.rows.find(placed)!;
    const home = row.cell && !named(row.cell) ? row.cell : place.name;
    groups.set(home, [...(groups.get(home) ?? []), personOf(p, row)]);
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

/** A place people use and live at, next to a town: a farm, the stables, a meadery (WO-180 Part 5a). */
const NEAR_TYPES = new Set(["Farm", "Stables", "House", "Mill", "Inn", "Building", "Meadery"]);

/** The places whose nearest town is this one: the dangerous ones (a name once: a mod's second record of a place is left out) and the farms and stables next to it, nearest first. */
export function closeBy(town: Place): { place: Place; range: [number, number] | null; words: string }[] {
  const seen = new Map<string, Place>();
  for (const p of placesData().places) {
    if (p.nearestTown?.town !== town.name || p === town) continue;
    if (placeKind(p) !== "dangerous" && !(NEAR_TYPES.has(p.type) && !p.inTown && (p.nearestTown.km ?? 9) <= 1)) continue;
    // Two places of one name in different holds (the Imperial camps) are two places.
    const k = `${p.name}|${p.hold ?? ""}`;
    const had = seen.get(k);
    if (!had || (p.actors?.count ?? 0) > (had.actors?.count ?? 0)) seen.set(k, p);
  }
  return [...seen.values()]
    .sort((a, b) => (a.nearestTown!.km ?? 0) - (b.nearestTown!.km ?? 0) || a.name.localeCompare(b.name))
    .slice(0, 10)
    .map((p) => ({ place: p, range: p.actors && (p.actors.floor !== undefined || p.actors.atLevel?.length) ? rangeOf(p.actors) : null, words: p.nearestTown!.walk === "next to it" ? "next to it" : (p.nearestTown!.walk ?? "close by") }));
}
