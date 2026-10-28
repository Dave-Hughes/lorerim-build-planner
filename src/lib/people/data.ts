import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { currentVersion } from "@/lib/rules/server";

/**
 * The people index (WO-144 Part 2), as scripts/gamedata/people.py and build.py write people.json: every named person a design touches,
 * with the race, sex, the cell they are placed in and the town it is in, and a Job* role for a few. Read once per server from disk.
 * A person's page is by name (WO-154): rows that share a name are one person's placements (Ulfric Stormcloak is placed in more than one
 * cell), and the page is built on the best placed of them.
 */

/** What a read says about a person (WO-159): the checker's corrected object, field by field, with each field's verdict. */
export interface PersonRead {
  firstMeet: string;
  day: { from: string; for: string; where: string; doing: string }[];
  changes: string[];
  role: string;
  sells: string;
  trains: string;
  joins: string;
  marries: string;
  fightsWith: string;
  quests: { quest: string; how: string }[];
  canDie: string;
  unsure: { field: string; why: string }[];
  /** Per field: agree, fix (the checker corrected it), unsure, or players (a player's found-in-game fact replaced it). */
  verdicts: Record<string, string>;
  /** The fields a player's found-in-game fact replaced, and the number of reports approved. */
  fromPlayers?: string[];
  reports?: number;
}

/** A field's name in a player's words, for "Not sure yet". */
export const READ_FIELD_WORDS: Record<string, string> = {
  firstMeet: "Where you first meet them",
  day: "Where they are through the day and night",
  changes: "What changes where they are",
  role: "What they are to you",
  sells: "What they sell",
  trains: "What they train",
  joins: "How they join you",
  marries: "Whether and how you can marry them",
  fightsWith: "How they fight",
  quests: "Which quests they are in",
  canDie: "Whether they can die",
};

/**
 * What a read is not sure of (WO-165): only the fields the checker marked unsure, each with the reasons the read gives for it, in a player's
 * words. A doubt the reader noted on a field the checker settled (agreed or corrected) isn't listed: the checker's word is the page's.
 */
export function notSureOf(read: PersonRead): { field: string; why?: string }[] {
  const out: { field: string; why?: string }[] = [];
  for (const [f, v] of Object.entries(read.verdicts)) {
    if (v !== "unsure") continue;
    const reasons = read.unsure.filter((u) => u.field === f);
    if (!reasons.length) out.push({ field: READ_FIELD_WORDS[f] ?? f });
    for (const r of reasons) out.push({ field: READ_FIELD_WORDS[f] ?? f, why: r.why });
  }
  return out;
}

/** The fields the checker could not settle: the page says "not sure" beside them. */
export const unsureFields = (read: PersonRead) => new Set(Object.entries(read.verdicts).filter(([, v]) => v === "unsure").map(([f]) => f));

export interface PersonRow {
  name: string;
  race?: string;
  sex?: string;
  cell?: string;
  inTown?: string;
  role?: string;
  /** What they are to a player, from the records' own fields (the WO-156 dump, joined in build.py): essential, a follower, a spouse, a merchant, a trainer. */
  essential?: true;
  follower?: true;
  marriage?: true;
  sells?: true;
  innkeeper?: true;
  trainer?: { skill: string; cap?: number };
  /** The people read (WO-155 by way of WO-159), when this person has been read and checked. */
  read?: PersonRead;
}

export interface Person extends PersonRow {
  slug: string;
  /** Every cell the name is placed in, the base row's first. */
  cells: string[];
  /** Every placement of the name (a person can be placed in more than one town, or twice in one). */
  rows: PersonRow[];
}

/** A role's words, for the Job* keyword the records carry. */
const ROLE_WORDS: Record<string, string> = {
  JobInnkeeper: "Innkeeper",
  JobPriest: "Priest",
  JobJarl: "Jarl",
  JobSteward: "Steward",
  JobHousecarl: "Housecarl",
  JobMerchant: "Sells goods",
  JobBlacksmith: "Blacksmith",
  JobApothecary: "Apothecary",
  JobCourtWizard: "Court wizard",
  JobOrcChief: "Orc chief",
  JobOrcWiseWoman: "Orc wise woman",
  JobHostler: "Hostler",
  JobSpellVendor: "Sells spells",
  JobFletcher: "Fletcher",
  JobMiner: "Miner",
  JobMinstrel: "Bard",
  JobHireling: "Hireling",
  JobHunter: "Hunter",
  JobLumberjack: "Lumberjack",
  JobFarmer: "Farmer",
};
export const roleWords = (role: string | undefined) => (role ? (ROLE_WORDS[role] ?? null) : null);

export const slugOf = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const nameKey = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

/** Which of two placements of one name is the better base: one that has been read says most, then one with a town and a cell and a race. */
const score = (r: PersonRow) => (r.read ? 8 : 0) + (r.inTown ? 4 : 0) + (r.cell ? 2 : 0) + (r.race ? 1 : 0);

let cached: { all: Person[]; byName: Map<string, Person>; bySlug: Map<string, Person> } | null = null;

export function peopleData() {
  if (cached) return cached;
  let rows: PersonRow[] = [];
  try {
    rows = (JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "people.json"), "utf8")) as { people: PersonRow[] }).people;
  } catch {
    // Not built yet.
  }
  const grouped = new Map<string, PersonRow[]>();
  for (const r of rows) if (r.name?.trim()) grouped.set(nameKey(r.name), [...(grouped.get(nameKey(r.name)) ?? []), r]);
  const all: Person[] = [];
  const bySlug = new Map<string, Person>();
  const byName = new Map<string, Person>();
  for (const [key, group] of grouped) {
    const base = [...group].sort((a, b) => score(b) - score(a))[0];
    let slug = slugOf(base.name) || "person";
    // A different name that makes the same slug ("Tolfdir" and "Tolfdir!"): the later one takes a number.
    for (let n = 2; bySlug.has(slug); n++) slug = `${slugOf(base.name) || "person"}-${n}`;
    // What a name is to a player is true wherever it is placed: Sven follows you from either of his two placements.
    const flags = {
      ...(group.some((g) => g.follower) ? { follower: true as const } : {}),
      ...(group.some((g) => g.marriage) ? { marriage: true as const } : {}),
      ...(group.some((g) => g.sells) ? { sells: true as const } : {}),
      ...(group.some((g) => g.innkeeper) ? { innkeeper: true as const } : {}),
      ...(!base.trainer && group.some((g) => g.trainer) ? { trainer: group.find((g) => g.trainer)!.trainer } : {}),
    };
    const person: Person = { ...base, ...flags, slug, rows: group, cells: [...new Set([base.cell, ...group.map((g) => g.cell)].filter((c): c is string => !!c))] };
    all.push(person);
    bySlug.set(slug, person);
    byName.set(key, person);
  }
  cached = { all, byName, bySlug };
  return cached;
}

/** A person by their name, case and spacing aside; null when the index has none. */
export const personByName = (name: string) => peopleData().byName.get(nameKey(name)) ?? null;
export const personBySlug = (slug: string) => peopleData().bySlug.get(slug) ?? null;
export const personHref = (name: string): string | null => {
  const p = personByName(name);
  return p ? `/people/${p.slug}` : null;
};
