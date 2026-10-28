import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { peopleData, personHref } from "@/lib/people/data";
import { currentVersion } from "@/lib/rules/server";
import { questHref } from "@/lib/quests/slugs";
import { linkNames } from "./link-names";
import { questsOf } from "@/lib/people/quests";
import { isSharedName, placeHrefOf, placeQualifier, placesData, placesNamed } from "@/lib/places/data";
import type { NameLink } from "./link-names";

import { questsData } from "@/lib/quests/data";

let placeLinks: NameLink[] | null = null;
let modLinks: NameLink[] | null = null;

/** Every mod the quest data names with a Nexus id, as an outside link (WO-154 Part 4: a mod named anywhere links to its page, in a new tab). */
export function modNames(): NameLink[] {
  if (modLinks) return modLinks;
  const seen = new Map<string, string>();
  for (const l of questsData().lines) {
    for (const s of l.sources) if (s.modid && !s.base) seen.set(s.name, s.modid);
    for (const q of l.quests) {
      if (q.mod?.modid && !q.mod.base) seen.set(q.mod.name, q.mod.modid);
      for (const m of q.changedBy ?? []) if (m.modid) seen.set(m.name, m.modid);
    }
  }
  modLinks = [...seen].filter(([name]) => name.length > 3).map(([text, id]) => ({ text, href: `https://www.nexusmods.com/skyrimspecialedition/mods/${id}`, external: true }));
  return modLinks;
}

/**
 * How a sentence says which of several places of one name it means (WO-172): "Hall of the Dead in Whiterun", "Imperial Military Camp, the
 * Reach", "Whiterun's Hall of the Dead". A kind (camp, landmark) is no way to say it in a sentence, so those names get no qualified form.
 */
function qualifiedForms(name: string, q: string): string[] {
  const ways = [q, q.replace(/^the /, "The ")];
  return [...new Set(ways)].flatMap((w) => [`${name} in ${w}`, `${name}, ${w}`, `${name} of ${w}`, `${w}'s ${name}`]);
}

/**
 * Every place the index has, as links: a place's name is proper enough to link wherever it stands in a page's words. A name more than one
 * place has (the Imperial Military Camp is eight) is a link only where the words say which ("in the Reach"), or where the page is about
 * one of them (`ownPlaceNames`); bare, it is plain text and not a guess.
 */
export function placeNames(): NameLink[] {
  placeLinks ??= placesData()
    .places.filter((p) => p.name.length > 3)
    .flatMap((p) => {
      const href = placeHrefOf(p);
      if (isSharedName(p.name)) {
        const q = placeQualifier(p);
        // A hold or a town starts with a capital ("the Reach" is The Reach); a kind or a number is no way to say which in a sentence.
        return q && /^(the )?[A-Z]/.test(q) ? qualifiedForms(p.name, q).map((text) => ({ text, href })) : [];
      }
      // The words say "the Winking Skeever" for The Winking Skeever, and a quest may call a place by another name (Volkihar Keep): all go to the one page.
      const bare = /^The\s+\S+\s+\S+/.test(p.name) ? [p.name.replace(/^The\s+/, "")] : [];
      return [p.name, ...bare, ...(p.aliases ?? [])].map((text) => ({ text, href }));
    });
  return placeLinks;
}

/**
 * The places of a shared name that a quest goes to: on that quest's page the bare name is the quest's own place, as long as exactly one of the
 * places with that name lists it (WO-172). Add these to the page's names.
 */
export function ownPlaceNames(quests: string[]): NameLink[] {
  const wanted = new Set(quests);
  const byName = new Map<string, NameLink[]>();
  for (const p of placesData().places) {
    if (!isSharedName(p.name) || !p.quests?.some((q) => wanted.has(q))) continue;
    byName.set(p.name, [...(byName.get(p.name) ?? []), { text: p.name, href: placeHrefOf(p) }]);
  }
  return [...byName.values()].filter((xs) => xs.length === 1 && placesNamed(xs[0].text).length > 1).map((xs) => xs[0]);
}

/** The people a page names, as links: only those the index has, by the exact name the read gives. */
export function personNames(names: (string | undefined)[]): NameLink[] {
  const seen = new Set<string>();
  const out: NameLink[] = [];
  for (const n of names) {
    if (!n || seen.has(n)) continue;
    seen.add(n);
    const href = personHref(n);
    if (href) out.push({ text: n, href });
  }
  return out;
}

let peopleLinks: NameLink[] | null = null;

type PersonT = ReturnType<typeof peopleData>["all"][number];
const worthy = (p: PersonT) => !!(p.read || p.follower || p.marriage || p.trainer || p.innkeeper || questsOf(p.name).length > 0);

/** Factions and groups the records keep as "people" (the Silver Hand, the Greybeards): a link on one would go to a page that is not a person. */
const FACTIONS = new Set(["silver hand", "greybeards", "blades", "companions", "stormcloaks", "dawnguard", "thalmor", "volkihar", "vigilants of stendarr", "penitus oculus", "imperial legion", "dark brotherhood", "thieves guild", "bards college", "forsworn"]);
/** A name the records place many times with nothing to say who it is (Stormcloak Soldier, Silver Hand) is a kind of person, not a person. */
const isGroup = (p: PersonT) => FACTIONS.has(p.name.trim().toLowerCase()) || (p.rows.length >= 3 && !p.read && !p.follower && !p.marriage && !p.trainer && !p.innkeeper);

/**
 * The people a quest line's text may name, as links (WO-160 Part 5): everyone with a page who is a person a player asks about (is in a quest,
 * has been read, or is a follower, spouse, merchant, trainer or innkeeper), and anyone whose name is more than one word (a whole name is not
 * a common word). The many with one word for a name and nothing else (a guard, a bandit, a creature) are left out: a link on one would be wrong.
 */
export function peopleNames(): NameLink[] {
  peopleLinks ??= peopleData()
    .all.filter((p) => {
      if (p.name.length <= 3 || isGroup(p)) return false;
      // A whole name is not a common word; a one-word name needs more than a shop to be someone ("Trader" is a job).
      return /^\p{Lu}\S*(?:\s+\S+)+$/u.test(p.name.trim()) ? true : worthy(p);
    })
    .map((p) => ({ text: p.name, href: `/people/${p.slug}` }));
  return peopleLinks;
}

/** First words that are not a first name: a title, a colour, a kind of thing. */
const NOT_A_NAME = new Set(["Arch", "Archmage", "Arch-Mage", "High", "Old", "Young", "Black", "White", "Red", "Blind", "Mad", "Lost", "Grand", "Silver", "Dark", "Fort", "Castle", "Dragon", "Blood", "Ghost", "Lord", "Jarl", "Lady", "Thane", "Queen", "King", "Captain", "Commander", "Master", "Brother", "Sister", "Legate", "General", "Steward", "Housecarl", "Dame", "Mistress", "Grandmaster", "Guard", "Orc", "Dead", "Sickly", "Wounded", "Visiting", "Hired", "Imperial", "Stormcloak", "Whiterun", "Windhelm", "Solitude", "Riften", "Markarth", "Falkreath", "Dawnstar", "Morthal", "Winterhold", "The"]);
const TITLE_WORDS = new Set(["Jarl", "Lord", "Lady", "Thane", "Queen", "King", "Captain", "Commander", "Master", "Brother", "Sister", "Legate", "General", "Steward", "Housecarl", "Dame", "Mistress", "Grandmaster"]);

let shortLinks: NameLink[] | null = null;

/**
 * The short names a quest's words use for a person with a longer one (WO-160 Part 6): "Farengar" for Farengar Secret-Fire, "Storn" for Storn
 * Crag-Strider, "Harkon" for Lord Harkon, "Kodlak" for Kodlak Whitemane; with a title in front, "Jarl Balgruuf". Only for someone a player asks
 * about (in a quest, read, a follower, spouse, trainer or innkeeper), and only a first name that is a name: four letters or more, nobody else's
 * first word, not a place and not a title or a common word.
 */
export function shortNames(): NameLink[] {
  if (shortLinks) return shortLinks;
  const people = peopleData().all.filter((p) => !isGroup(p));
  const firstOf = (p: PersonT) => {
    const w = p.name.trim().split(/\s+/);
    return TITLE_WORDS.has(w[0]) ? w[1] : w[0];
  };
  const count = new Map<string, number>();
  for (const p of people) {
    const f = firstOf(p);
    if (f) count.set(f, (count.get(f) ?? 0) + 1);
  }
  const places = new Set(placeNames().map((n) => n.text));
  const seen = new Set<string>();
  shortLinks = [];
  for (const p of people) {
    const first = firstOf(p);
    if (!first || !worthy(p) || p.name.trim().split(/\s+/).length < 2 || /['’]s$/.test(first)) continue;
    if (first.length < 4 || !/^\p{Lu}[\p{L}'-]+$/u.test(first) || NOT_A_NAME.has(first) || count.get(first) !== 1 || places.has(first) || seen.has(first)) continue;
    seen.add(first);
    shortLinks.push({ text: first, href: `/people/${p.slug}`, short: true });
  }
  return shortLinks;
}

let blockLinks: NameLink[] | null = null;

/**
 * The quests and items whose names hold a person's or a place's name (Retrieve the Horn of Jurgen Windcaller, The Throat of the World): plain
 * text where they stand, so a name inside one is never linked as the person or place (WO-160 Part 6). Only multi-word names that hold one.
 */
function blockers(base: NameLink[]): NameLink[] {
  if (blockLinks) return blockLinks;
  const names = new Set<string>();
  for (const l of questsData().lines) for (const q of l.quests) names.add(q.name.trim());
  for (const i of itemNames()) names.add(i);
  const out: NameLink[] = [];
  for (const n of names) {
    if (n.split(/\s+/).length < 2 || n.length < 8) continue;
    if (!linkNames(n, base).some((x) => x.href)) continue;
    out.push({ text: n, href: "", plain: true });
    if (/^The\s+/.test(n)) out.push({ text: n.replace(/^The\s+/, ""), href: "", plain: true });
  }
  blockLinks = out;
  return out;
}

/** The names of the items the game has (WO-160 Part 6), for blockers(). */
function itemNames(): string[] {
  try {
    return (JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "items.json"), "utf8")) as { name?: string }[]).map((i) => i.name ?? "").filter(Boolean);
  } catch {
    return [];
  }
}

let questLinks: NameLink[] | null = null;
let bracketLinks: NameLink[] | null = null;

/** Every quest with a page, by name. */
function questNames(): { text: string; href: string }[] {
  if (questLinks) return questLinks;
  const seen = new Map<string, string>();
  for (const l of questsData().lines) for (const q of l.quests) {
    const href = questHref(q.edid);
    if (href && q.name.trim().length > 4 && !seen.has(q.name.trim())) seen.set(q.name.trim(), href);
  }
  questLinks = [...seen].map(([text, href]) => ({ text, href }));
  return questLinks;
}

let everyLink: NameLink[] | null = null;

/**
 * Every place and person a sentence on a quest page may name: one list, so the pattern is built once. A place wins over a person of the same
 * name; a quest's name in brackets is that quest; the name of a quest or item that holds a person's or place's name is plain text.
 */
export function linkable(): NameLink[] {
  if (everyLink) return everyLink;
  const base = [...peopleNames(), ...placeNames()];
  bracketLinks ??= questNames().map((q) => ({ ...q, bracketed: true }));
  everyLink = [...blockers(base), ...peopleNames(), ...shortNames(), ...placeNames(), ...bracketLinks];
  return everyLink;
}

let opensLinks: NameLink[] | null = null;

/** The names for a line's Opens other stories: those, and every quest's name as a link to the quest ("The Way of the Voice"). */
export function opensNames(): NameLink[] {
  opensLinks ??= [...linkable(), ...questNames()];
  return opensLinks;
}
