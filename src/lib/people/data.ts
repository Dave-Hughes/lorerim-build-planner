import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { EDITOR_BODY, mapStrings, mend, playerWords, RECORD, REASON_KEYS } from "@/lib/pages/player-words";
import type { Unsure } from "@/lib/pages/unsure";
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

export interface SellerShop {
  kind: string;
  /** The vendor faction the shop is (WO-180 Part 8): one faction, one shop, however many people belong to it. */
  faction?: string;
  /** This seller keeps the shop; the others in its faction are its assistants. */
  keeper?: true;
  hours?: string;
  cell?: string;
  stall?: true;
  outdoors?: true;
  world?: string;
}

/** A quest stage that moves a person to a named place (WO-185 Part 4, people_moves.py): "After The Ritual: Fort Justice", "During Infiltration: Meridia's Sanctum". */
export interface PersonMove {
  when: "after" | "during";
  quest: string;
  place: string;
}

export interface PersonRow {
  name: string;
  race?: string;
  sex?: string;
  cell?: string;
  inTown?: string;
  role?: string;
  /** A generic or leveled actor, not a person: no page (WO-183 Part 1). */
  generic?: true;
  /** What they are to a player, from the records' own fields (the WO-156 dump, joined in build.py): essential, a follower, a spouse, a merchant, a trainer. */
  essential?: true;
  follower?: true;
  marriage?: true;
  sells?: true;
  /** The shop the vendor faction puts them in (WO-180 Part 7a, shops.py): what it sells, its hours, and where the vendor chest stands: an interior (`cell`), a stall in a city's market, or the open (their forge). */
  shop?: SellerShop;
  /** Where a quest's stage moves them to, in the order the quests go. */
  moves?: PersonMove[];
  /** The quests this base record is in (editor ids), by record and not by name (WO-180 Part 9a). */
  questIds?: string[];
  /** Made by the game, on a name more than one record has: the bare address goes to the one players mean. */
  vanilla?: true;
  innkeeper?: true;
  trainer?: { skill: string; cap?: number };
  /** The people read (WO-155 by way of WO-159), when this person has been read and checked. */
  read?: PersonRead;
}

export interface Person extends PersonRow {
  slug: string;
  /** Set when more than one person has the name ("Wilhelm (Windhelm)"): each is a person of their own, a base record, with their own page (WO-180 Part 8). */
  label?: string;
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

/** A name that is a job, not a person: the many of it are one page. */
const JOB_NAME = /^(?:worker|courier|nobleman|pilgrim|refugee|adventurer|attendant|assassin|vendor|merchant|servant|customer|guard|soldier|farmer|miner|priest|patron|traveler|traveller)$|\b(?:initiate|guard)$/i;

/** A placement of someone a player can look up: read, a seller, a follower, a spouse, a trainer or an innkeeper. A "Worker" at a brothel in every city is not one. */
const known = (r: PersonRow) => !!(r.read || r.shop || r.follower || r.marriage || r.trainer || r.innkeeper);
/** A named person at home in a town: the other Adara, the girl at Endon's, is one though the records give her nothing else. */
const athome = (r: PersonRow) => !!(r.inTown && r.cell && !JOB_NAME.test(r.name));

/**
 * Whether two placements of one name can be one person (WO-180 Part 8: Wilhelm of Windhelm is not Wilhelm of Ivarstead, nor Adara of Markarth the girl at Stonehills). Two people a
 * player can look up who differ in town, race or sex, where both say it, are two; the many nameless of one name (a Worker, a Courier) are one page, as they were.
 */
const sameOne = (a: PersonRow, b: PersonRow) =>
  JOB_NAME.test(a.name) ||
  !((known(a) && (known(b) || athome(b))) || (known(b) && athome(a))) || ((!a.inTown || !b.inTown || a.inTown === b.inTown) && (!a.race || !b.race || a.race === b.race) && (!a.sex || !b.sex || a.sex === b.sex));

let cached: { all: Person[]; byName: Map<string, Person>; bySlug: Map<string, Person> } | null = null;

export function peopleData() {
  if (cached) return cached;
  let rows: PersonRow[] = [];
  try {
    rows = (JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "people.json"), "utf8")) as { people: PersonRow[] }).people;
    // The reads' assembled wording ("in her own house, Bryling's House") is said once, here (WO-177 Part 5).
    rows = rows.map((row) => {
      // A race the records name with an id (0Asy1um_OthrielSnowElfRace) has no player-facing name: nothing (WO-180).
      const r = row.race && RECORD.test(row.race) ? { ...row, race: undefined } : row;
      const trained = r.trainer ? { ...r, trainer: { ...r.trainer, skill: skillWords(r.trainer.skill) } } : r;
      if (!trained.read) return trained;
      const read = mapStrings(trained.read, mend, REASON_KEYS);
      // A schedule note or a change that talks about the game's packages and aliases is the editors' (WO-180 Part 2): the note goes, the row stays.
      return {
        ...trained,
        read: {
          ...read,
          changes: (read.changes ?? []).filter((c) => !EDITOR_BODY.test(c)),
          day: (read.day ?? []).map((d) => (d.doing && EDITOR_BODY.test(d.doing) ? { ...d, doing: "" } : d)),
        },
      };
    });
  } catch {
    // Not built yet.
  }
  const grouped = new Map<string, PersonRow[]>();
  // A generic or leveled actor (Mercenary, Goblin, Frost Troll) is no person (WO-183 Part 1): no page, no search result, no address.
  // (A name some of whose records are generic and some a person's keeps only the person's.)
  for (const r of rows) if (r.name?.trim() && !r.generic) grouped.set(nameKey(r.name), [...(grouped.get(nameKey(r.name)) ?? []), r]);
  const all: Person[] = [];
  const bySlug = new Map<string, Person>();
  const byName = new Map<string, Person>();
  for (const [key, whole] of grouped) {
    // The placements that can be one person are one; the ones that cannot are each a person of their own, the better-known first.
    const clusters: PersonRow[][] = [];
    for (const r of [...whole].sort((a, b) => score(b) - score(a))) {
      const home = clusters.find((c) => c.every((m) => sameOne(r, m)));
      if (home) home.push(r);
      else clusters.push([r]);
    }
    // The bare address goes to the one players mean: a follower, a quest's own person, the one the game made (WO-180 Part 9a); the others take their town in brackets.
    const meant = (c: PersonRow[]) => (c.some((r) => r.follower) ? 32 : 0) + (c.some((r) => r.questIds?.length) ? 16 : 0) + (c.some((r) => r.vanilla) ? 8 : 0);
    clusters.sort((a, b) => meant(b) - meant(a));
    const labelOf = (c: PersonRow[]) => c.find((r) => r.inTown)?.inTown ?? c.find((r) => r.cell)?.cell ?? c.find((r) => r.race)?.race ?? "";
    const labels = clusters.map(labelOf);
    clusters.forEach((group, ci) => {
    const base = [...group].sort((a, b) => score(b) - score(a))[0];
    let slug = slugOf(ci === 0 ? base.name : `${base.name}-${labels[ci] || ci + 1}`) || "person";
    // A different name that makes the same slug ("Tolfdir" and "Tolfdir!"): the later one takes a number.
    for (let n = 2; bySlug.has(slug); n++) slug = `${slugOf(base.name) || "person"}-${n}`;
    // What a name is to a player is true wherever it is placed: Sven follows you from either of his two placements.
    const flags = {
      ...(group.some((g) => g.follower) ? { follower: true as const } : {}),
      ...(group.some((g) => g.marriage) ? { marriage: true as const } : {}),
      ...(group.some((g) => g.sells) ? { sells: true as const } : {}),
      ...(group.some((g) => g.shop) ? { shop: group.find((g) => g.shop)!.shop } : {}),
      ...(group.some((g) => g.moves?.length) ? { moves: group.find((g) => g.moves?.length)!.moves } : {}),
      ...(group.some((g) => g.innkeeper) ? { innkeeper: true as const } : {}),
      ...(!base.trainer && group.some((g) => g.trainer) ? { trainer: group.find((g) => g.trainer)!.trainer } : {}),
    };
    const person: Person = {
      ...base,
      ...flags,
      slug,
      ...(clusters.length > 1 && labels[ci] ? { label: `${base.name} (${labels[ci]})` } : {}),
      rows: group,
      cells: [...new Set([base.cell, ...group.map((g) => g.cell)].filter((c): c is string => !!c))],
    };
    all.push(person);
    bySlug.set(slug, person);
    if (ci === 0) byName.set(key, person);
    });
  }
  cached = { all, byName, bySlug };
  return cached;
}

/** A skill as the game shows it, not as the records key it (WO-180: "Trains OneHanded"). */
const SKILLS: Record<string, string> = { OneHanded: "One-Handed", TwoHanded: "Two-Handed", LightArmor: "Light Armor", HeavyArmor: "Heavy Armor", Lockpick: "Lockpicking" };
export const skillWords = (skill: string) => SKILLS[skill] ?? skill.replace(/([a-z])([A-Z])/g, "$1 $2");

/** A person by their name, case and spacing aside; null when the index has none. */
export const personByName = (name: string) => peopleData().byName.get(nameKey(name)) ?? null;

/**
 * A person's own address for a quest (WO-180 Part 9b): two people can share a name (Wilhelm of Windhelm and Wilhelm of Ivarstead), and a quest names the one its records tie it
 * to. With none tied, the bare address, the one players mean.
 */
export const personHrefForQuest = (name: string, edid: string): string | null => {
  const same = peopleData().all.filter((p) => nameKey(p.name) === nameKey(name));
  const tied = same.find((p) => p.rows.some((r) => r.questIds?.includes(edid)));
  const p = tied ?? same[0];
  return p ? `/people/${p.slug}` : null;
};

/** What a person is, in a few words, from their own page: the read's role, else the records' job (WO-177: a quest's People gave a role to some and none to the rest). */
export function roleOfName(name: string): string | null {
  const p = personByName(name);
  if (!p) return null;
  const raw = p.read?.role ? p.read.role.split(";")[0].trim() : roleWords(p.role);
  return raw || null;
}
export const personBySlug = (slug: string) => peopleData().bySlug.get(slug) ?? null;
export const personHref = (name: string): string | null => {
  const p = personByName(name);
  return p ? `/people/${p.slug}` : null;
};

/**
 * What a person's page is not sure of (WO-159, WO-177 Part 5): what the checker could not settle, the read's own hedges about what changes where they
 * are, and, for a person not read yet, where they are through the day and night. One place for it, so the page and Help fill the gaps (WO-184) agree.
 */
export function personUnsure(person: Person): Unsure[] {
  const read = person.read;
  const say = (u: Unsure): Unsure => ({ ...u, field: pronounField(u.field, person.sex) });
  if (!read) return [{ field: "where they are through the day and night" }, { field: "what changes where they are" }, ...(person.follower || person.marriage ? [{ field: "how to recruit or marry them" }] : [])].map(say);
  const hedged: Unsure[] = [];
  for (const c of read.changes ?? []) for (const why of playerWords(c).unsure) hedged.push({ field: "What changes where they are", why });
  return [...notSureOf(read), ...hedged].map(say);
}

/**
 * A Not sure yet field in the person's own pronoun (WO-180 Part 7b): "Where they are through the day and night" on a page that says he or she says "Where she is through the day and
 * night". Written once with "they"; a person of no known sex keeps it.
 */
export function pronounField(field: string, sex: string | undefined | null): string {
  const subject = sex === "female" ? "she" : sex === "male" ? "he" : null;
  if (!subject) return field;
  const object = subject === "she" ? "her" : "him";
  const cap = (w: string, at: string) => (at === at.toUpperCase() && at !== at.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w);
  return field
    .replace(/\b(they) (are)\b/gi, (_m, t: string) => `${cap(subject, t)} is`)
    .replace(/\b(they) (can|will|must|may)\b/gi, (_m, t: string, v: string) => `${cap(subject, t)} ${v}`)
    .replace(/\b(they) (\w+)\b/gi, (_m, t: string, v: string) => `${cap(subject, t)} ${/(s|x|z|ch|sh)$/.test(v) ? `${v}es` : v === "have" ? "has" : `${v}s`}`)
    .replace(/\bthem\b/gi, (m) => cap(object, m));
}
