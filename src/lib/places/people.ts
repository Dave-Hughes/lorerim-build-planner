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
  /** Runs a shop (WO-180 Part 5a): the read says what they sell, or their job is a seller's, or they sleep in a building that is a shop. The record's "sells" flag alone is not that (a Companion, a bard and a housecarl have it). */
  shopkeeper: boolean;
  /** The shop the read names for them ("Belethor's General Goods"), when it is not the building they sleep in. */
  shopName: string | null;
  /** How much the record and the read say they run a shop: 2 for the read's words, 1 for the job. */
  shopRank: number;
  /** They sell from a stall in the market. */
  stall: boolean;
  /** The named place they work at (the Skyforge), when it is not where they sleep. */
  workplace: string | null;
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

/** What a seller sells, by the job the record gives. */
const SHOP: Record<string, string> = { JobBlacksmith: "blacksmith", JobApothecary: "apothecary", JobMerchant: "general goods", JobSpellVendor: "spells", JobFletcher: "fletcher" };
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
/** What the shop is called when it has no name of its own: "Brand-Shei's stall", "Lod's smithy". */
const NOUN: Record<string, string> = { blacksmith: "smithy", apothecary: "apothecary", spells: "spells", food: "food stall", clothing: "clothing stall", books: "bookshop", mead: "mead", fletcher: "fletchery", jewelry: "jewelry stall" };

/** A building whose name says it is a shop. */
const SHOPPY = /goods|cauldron|wisdoms?|smith|forge|bakery|bakeshop|stall|warmaiden|trader|market|store|shop|armou?r|fletch|apothecary|alchem|emporium|wares|meadery|elixirs|oddments|imports|warehouse|company|raiment|aromatics|phial/i;
/** A building a person lives in, or a hall, keep or temple: its name is not a shop's. */
const HOMELY = /\b(?:house|home|residence|lodging|quarters|bunkhouse|shack|hall|keep|palace|castle|temple|barracks|jail)\b/i;
/** The name the places call a building by: the people's cells say "Pawned Prawn" where the places say "The Pawned Prawn". */
const officialName = (name: string) => placesNamed(name)[0]?.name ?? placesNamed(`The ${name}`)[0]?.name ?? name;
/** Whether the place of this name is of this type; the people's cells say "The Bee and Barb" where the places say "Bee and Barb". */
const placeOfType = (name: string | null | undefined, type: string) => !!name && [name, name.replace(/^the\s+/i, "")].some((n) => placesNamed(n).some((x) => x.type === type));
/** A name of a shop or a place: capitalised words, with "and", "of" and "the" between them ("The Mortar and Pestle"). */
const PROPER = String.raw`[A-Z][\w'’-]*(?:\s+(?:and|of|the)\s+[A-Z][\w'’-]*|\s+[A-Z][\w'’-]*)*`;
/** The shop a read names for a seller: "general goods at Belethor's General Goods; trades 7 am to 9 pm", "trades from Belethor's General Goods lists". */
const shopNameOf = (s: string) => new RegExp(String.raw`\b(?:at|from)\s+(${PROPER})`).exec(s)?.[1] ?? null;
/** Where a seller works, from the day the read gives: a stall in the market, or a named place ("the Skyforge"); null when it is only the home they sleep in. */
function workOf(p: Person): { stall: boolean; place: string | null } | null {
  for (const d of p.read?.day ?? []) {
    if (!/\b(?:work|sell|shop|stall|forge|trad|merchant|minding|keeping|running|tending)/i.test(d.doing ?? "")) continue;
    const where = (d.where ?? "").trim();
    if (/\bstall\b|\bmarket\b/i.test(where)) return { stall: true, place: null };
    const named = new RegExp(String.raw`^(the\s+)?(${PROPER})`).exec(where.split(",")[0]);
    if (named) return { stall: false, place: `${named[1] ? "The " : ""}${named[2]}` };
  }
  return null;
}

function personOf(p: Person): PlacePerson {
  const read = p.read;
  const flagged = !!read?.sells || !!p.sells;
  const shopkeeper = flagged && !p.follower && (!!read?.sells || !!SHOP[p.role ?? ""] || SHOPPY.test(p.cell ?? "") || placeOfType(p.cell, "Store"));
  const work = shopkeeper ? workOf(p) : null;
  const shopName = shopkeeper && read?.sells ? shopNameOf(read.sells) : null;
  const sells = shopkeeper ? kindOf(shopName ?? p.cell, read?.sells, read?.role, SHOP[p.role ?? ""]) : "";
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
    shopName,
    shopRank: (read?.sells ? 2 : 0) + (SHOP[p.role ?? ""] ? 1 : 0),
    stall: !!work?.stall,
    workplace: work?.place ?? null,
  };
}

export interface Shop {
  /** The shop or the stall; when it has no name of its own, the keeper's name and what it is ("Brand-Shei's stall"). */
  name: string;
  href: string | null;
  keeper: PlacePerson;
  /** What it sells in a word players use ("blacksmith", "general goods", "apothecary", "food"). */
  kind: string;
  /** Set when the shop has no name of its own: the page says "<keeper>'s <noun>". */
  noun: string | null;
}

/**
 * The shops among a place's houses (WO-180 Part 6a), for every city: one per shop, named by the shop or the stall and never by the keeper's house. A shop is a building
 * the places call a Store; the shop a seller's read names; the named place they work at ("the Skyforge"); else their stall or their trade, said as "Brand-Shei's stall".
 * Every shop is here, with its keeper and what it sells. The ones who sell from another's shop (Ysolda, from Belethor's lists) are in that shop.
 */
export function shopsOf(houses: House[]): Shop[] {
  const out = new Map<string, Shop & { rank: number }>();
  for (const h of houses) {
    const inn = placeOfType(h.name, "Inn");
    for (const p of h.people) {
      if (!p.shopkeeper) continue;
      const isShop = (n: string | null | undefined) => !!n && (placeOfType(n, "Store") || SHOPPY.test(n) || n === h.name);
      let name: string | null = null;
      let href: string | null = null;
      let own = false;
      if (p.shopName && isShop(p.shopName)) {
        name = p.shopName;
        own = h.name === name;
        href = own ? h.href : placeHref(name);
      } else if (!inn && (placeOfType(h.name, "Store") || !HOMELY.test(h.name))) {
        name = officialName(h.name);
        own = true;
        href = h.href ?? placeHref(name);
      } else if (p.workplace && !HOMELY.test(p.workplace) && !placeOfType(p.workplace, "Inn")) {
        name = p.workplace;
        href = placeHref(name);
      } else if (inn) {
        continue; // an innkeeper's goods are the inn's: the page says the inn
      }
      const kind = p.sells ?? "general goods";
      const noun = name ? null : /fence/i.test(p.role ?? "") || kind === "general goods" ? (p.stall ? "stall" : "shop") : (NOUN[kind] ?? "shop");
      const shown = name ?? `${p.name}'s ${noun}`;
      const rank = (own ? 4 : 0) + p.shopRank;
      // Two who sell the same thing from one home with no shop of their own (Windhelm's two smiths) are one shop, the better-known one's.
      const key = name ? name.toLowerCase() : `${h.name}|${kind}`.toLowerCase();
      const had = out.get(key);
      if (!had || rank > had.rank) out.set(key, { name: shown, href, keeper: p, kind, noun, rank });
    }
  }
  return [...out.values()].map((s): Shop => ({ name: s.name, href: s.href, keeper: s.keeper, kind: s.kind, noun: s.noun })).sort((a, b) => a.name.localeCompare(b.name));
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
