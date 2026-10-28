import "server-only";
import { afterWar, isGarrison, placeByName, placesNamed, rangeOf, hasLevels, type Place } from "@/lib/places/data";
import { GOLD, RUN_CHANGE } from "./run-change";
import { questHref } from "./slugs";
import { questsData } from "./data";
import { doorSources } from "./player-source";
import { checkedLabel } from "./story";
import type { Quest, QuestRead, QuestWays } from "./types";

/**
 * What a quest page and the door say about a quest (WO-154, docs/data/quest-pages.md), in one shape. A quest with a read (an agent
 * read its records and a second checked it, WO-153) is said in the read's own words, never reworded; one with none yet is said
 * from the older rules and marked `source: "rules"`, so the page and the door can say so. Sections run in the page's order:
 * can I do it, what do I need first, how to start, where it takes me, choices, what I get, what it opens and closes, the steps,
 * and how sure we are.
 */

export interface PageLink {
  text: string;
  /** The quest's own page, when the text is a quest the planner has. */
  href?: string;
  /** The part of `text` that is the quest's name, when the text goes on after it ("Name (a third way, added by a mod)"). */
  name?: string;
  /** The mod the quest comes from, when it isn't the base game: named once with its Nexus page (WO-154 Part 4). */
  mod?: { name: string; modid?: string };
}

export interface QuestPage {
  source: "reads" | "rules";
  /** Section 2. Null when the older rules can't say. */
  canDo: { label: string; why?: string } | null;
  /** Section 3. Empty: nothing is needed, any level. */
  needs: PageLink[];
  /** Section 4: who and where, what to do, and who said so when it isn't the game files. */
  starts: { how: string; who?: string; where?: string; reportedBy?: { source: string; also?: string[] }; whereIs?: string[]; unplaced?: string }[];
  firstStep?: string;
  /** Section 5, in order, each with the places index's words for its danger when it knows the place. */
  takesYou: { place: string; hold?: string; why?: string; danger?: string }[];
  /** Section 6. */
  choices: { choice: string; leadsTo?: string }[];
  /** Section 7. */
  gets: { xp: number; type?: string; rewards: { what: string; when?: string }[] };
  /** Section 8. */
  opens: PageLink[];
  closes: string[];
  /** Section 9: the journal's objectives, by branch when it branches. */
  steps: { branch?: string; objectives: string[] }[];
  /** The choices tied to their steps ("N ways to finish it"), for a read quest that has them. */
  ways?: QuestWays;
  /** The mods that changed it, beyond its own. */
  changedBy: { name: string; modid?: string }[];
  /** The people the read names (role in the quest), in its order. */
  people: { name: string; role?: string }[];
  /** Information Confidence's first line (WO-157): what the page is read from; nothing about what a player reported. */
  sure: string;
  /** How many player reports an admin approved for this quest (WO-157): a count, never the words. */
  reports: number;
  /** What the reader couldn't settle, field by field, with why: under the line, folded. */
  unsure: { field: string; why?: string }[];
}

const CAN_DO: Record<NonNullable<QuestRead["canDo"]>, string> = {
  talk: "Talk to someone to start it",
  "by itself": "Starts by itself",
  radiant: "Repeats: a radiant job",
  cut: "Cut from the game: only the console starts it",
  background: "Not a quest you'll see: it runs in the background",
};

let byName: Map<string, string | null> | null = null;
let modOf: Map<string, { name: string; modid?: string }> | null = null;
/**
 * A quest the planner has by its name, as a link; nothing when two share the name or none has it. A name followed by a note in brackets
 * ("The Book of Love - Fastred's Choice (a third way for Fastred, added by a mod)") links the name, and says its mod with the Nexus page.
 */
function linkFor(text: string): PageLink {
  byName ??= (() => {
    const m = new Map<string, string | null>();
    for (const l of questsData().lines)
      for (const q of l.quests) {
        const k = q.name.trim().toLowerCase();
        m.set(k, m.has(k) ? null : q.edid);
      }
    return m;
  })();
  modOf ??= new Map(questsData().lines.flatMap((l) => l.quests.filter((q) => q.mod && !q.mod.base).map((q) => [q.edid, q.mod!] as const)));
  const name = text.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const edid = byName.get(name.toLowerCase());
  const href = edid ? questHref(edid) : null;
  if (!href) return { text };
  const mod = modOf.get(edid!);
  return { text, href, ...(name !== text ? { name } : {}), ...(mod && mod.name.toLowerCase() !== name.toLowerCase() ? { mod } : {}) };
}

const PLURAL: Record<string, string> = {
  Bandit: "bandits",
  Draugr: "draugr",
  Skeleton: "skeletons",
  Imperial: "Imperials",
  Falmer: "Falmer",
  Bear: "bears",
  Forsworn: "Forsworn",
  Giant: "giants",
  Warlock: "warlocks",
  Hagraven: "hagravens",
  Spider: "spiders",
  Wolf: "wolves",
  Thalmor: "Thalmor",
  Vampire: "vampires",
  Riekling: "rieklings",
  Troll: "trolls",
  Dragon: "dragons",
  Necromancer: "necromancers",
  DragonPriest: "dragon priests",
  Spriggan: "spriggans",
  Chaurus: "chaurus",
};

/** "after the war: level 1 to 27" (WO-172): what a camp's garrison is, not the one guard who is there before it. */
const warWords = ([lo, hi]: [number, number]) => `after the war: level ${hi > lo ? `${lo} to ${hi}` : lo}`;

/**
 * How dangerous a place is, in the places index's words: "bandits from level 6; the boss Chief Yamarz, level 45". Nothing for a place the
 * index doesn't know, one whose people aren't hostile, or one with no levels checked: never a made-up one.
 */
export function dangerOf(place: Place | null | undefined): string | undefined {
  const a = place?.actors;
  if (!place || !a || a.hostile === false) return undefined;
  const war = afterWar(a);
  const [lo, hi] = hasLevels(a) ? rangeOf(a) : [0, 0];
  const who = a.livesHere ? (PLURAL[a.livesHere] ?? a.livesHere.toLowerCase()) : "enemies";
  const boss = (b: typeof a.boss) => (b ? `; the boss ${[b.name, b.level].filter(Boolean).join(", ")}` : "");
  // A camp with a guard or two before the war and a garrison after it says the garrison's levels as well, and where there is nobody before it, only those (WO-172).
  if (war && isGarrison(a)) return `${warWords(war.range)}${boss(war.boss)}`;
  if (!hasLevels(a)) return undefined;
  return `${who} from level ${lo}${hi > lo ? `, up to ${hi}` : ""}${boss(a.boss)}${war ? `; ${warWords(war.range)}` : ""}`;
}

/** A level the index gives as "leveled 19-24" or "45", in words: "19 to 24", "45". */
export const levelWords = (level: string | undefined) => (level ? level.replace(/^(leveled|levels?)\s*/i, "").replace(/\s*-\s*/g, " to ") : "");

/**
 * What a place page and a quest's "Where it takes you" say about danger, as parts: the foes with their level range, whether it has traps,
 * and the boss on its own line. `"none"` for a place whose people aren't hostile, null for one the index doesn't have or has no levels for
 * (said "Not known yet", never a made-up level).
 */
export function dangerParts(place: Place | null | undefined): { foes: string; traps: boolean; boss?: string } | "none" | null {
  const a = place?.actors;
  if (!place) return null;
  if (a && a.hostile === false) return "none";
  const war = afterWar(a);
    const traps = !!place.danger?.traps;
  const bossOf = (b: NonNullable<typeof a>["boss"]) => (b?.name ? `The boss, ${b.name}${b.level ? `, is level ${levelWords(b.level)}` : ""}` : undefined);
  if (war && isGarrison(a)) {
    const boss = bossOf(war.boss);
    return { foes: `${warWords(war.range).charAt(0).toUpperCase()}${warWords(war.range).slice(1)}`, traps, ...(boss ? { boss } : {}) };
  }
  if (!a || !hasLevels(a)) return null;
  const [lo, hi] = rangeOf(a);
  const who = a.livesHere ? (PLURAL[a.livesHere] ?? a.livesHere.toLowerCase()) : "enemies";
  const boss = bossOf(a.boss);
  return { foes: `${who.charAt(0).toUpperCase()}${who.slice(1)} from level ${lo}${hi > lo ? ` to ${hi}` : ""}${war ? `; ${warWords(war.range)}` : ""}`, traps, ...(boss ? { boss } : {}) };
}

/**
 * A place by the name a quest's words give. A name more than one place has (eight Imperial camps) is the quest's own when exactly one of them
 * lists that quest as going there (`quest`), and no place when that can't say (WO-172).
 */
export function placeNamed(name: string, quest?: string): Place | null {
  const cleaned = name.replace(/^the /i, "").trim();
  const unique = placeByName(name) ?? placeByName(cleaned);
  if (unique || !quest) return unique;
  const own = [...placesNamed(name), ...(cleaned === name ? [] : placesNamed(cleaned))].filter((p) => p.quests?.includes(quest));
  return own.length === 1 ? own[0] : null;
}

/** The ways a player found in game (WO-131, WO-146), which override what the records place (Dave's in-game checks win). */
const playerWays = (q: Quest) => (q.start?.ways ?? []).filter((w) => w.checked === "players");

/**
 * A who or where the reader filled with a statement of absence ("not named in these records", "not given in these records") has
 * nothing in it: it is left out, and the reader's `unsure` note says why (WO-154 Part 1b: leave out any field with nothing in it).
 */
const blank = (t: string | undefined) => !t?.trim() || /^(not\b[^.]*\b(records|files|given|named|placed|listed|known|recorded)|none\b|no one\b|nobody\b|unknown\b|n\/a\b)/i.test(t.trim());

/** The read's field names as a player says them. */
const FIELD_WORDS: Record<string, string> = { canDo: "can I do it", needs: "what you need", starts: "how to start", firstStep: "first step", takesYou: "where it takes you", choices: "choices", rewards: "what you get", opens: "what it opens", closes: "what it closes", steps: "steps", people: "people", where: "where", who: "who", hold: "hold" };

/**
 * A read's field key as a player says it (WO-177 Part 6, WO-180): "takesYou" is "where it takes you", and so is "takesYou.hold." and "takesYou.Saarthal:":
 * one item for a field, whatever part of it the reader was unsure of. A key the planner has no words for gives nothing and is never printed.
 */
export function fieldWords(key: string): string | null {
  const head = key.replace(/[:.\s]+$/, "").split(".")[0];
  const words = FIELD_WORDS[`${head.charAt(0).toLowerCase()}${head.slice(1)}`];
  if (words) return words;
  return /^[A-Za-z][A-Za-z ,'-]*$/.test(head) && head.includes(" ") ? key : null;
}

/** "1 report approved", "2 reports approved": the only way a page or the door says a player's input counted. */
export const playersWords = (n: number) => `${n} ${n === 1 ? "report" : "reports"} approved`;
const reportCount = (ways: { also?: string[] }[]) => ways.reduce((n, w) => n + 1 + (w.also?.length ?? 0), 0);

function viaReads(q: Quest, r: QuestRead): QuestPage {
  const players = playerWays(q);
  // A player's way replaces the read's start for the same person, or for no one in particular when it names no one.
  const said = new Set(players.map((w) => w.who ?? ""));
  const starts = [
    ...players.map((w) => ({ how: w.how, ...(w.who ? { who: w.who } : {}), ...(w.where ? { where: w.where } : {}), reportedBy: { source: w.source ?? "", ...(w.also?.length ? { also: w.also } : {}) }, ...(w.whereIs?.length ? { whereIs: w.whereIs } : {}), ...(w.unplaced ? { unplaced: w.unplaced } : {}) })),
    ...(r.starts ?? []).filter((s) => !said.has(blank(s.who) ? "" : (s.who ?? ""))).map((s) => ({ how: s.how ?? "", ...(!blank(s.who) ? { who: s.who } : {}), ...(!blank(s.where) ? { where: s.where } : {}) })),
  ].filter((s) => s.how || s.who);
  const unsure = (r.unsure ?? []).filter((u) => u.field).flatMap((u) => {
    const field = fieldWords(u.field);
    return field ? [{ ...u, field }] : [];
  });
  const fields = [...new Set(unsure.map((u) => u.field))].join(", ");
  const sure = `Read from the game files and checked by a second reader${unsure.length ? `. Unsure: ${fields}` : ""}`;
  return {
    source: "reads",
    canDo: r.canDo ? { label: CAN_DO[r.canDo], ...(r.canDo !== "talk" && r.canDoWhy ? { why: r.canDoWhy } : {}) } : null,
    // A needed quest is a link to its page when the planner has it by that name (the read's "Finish Scoundrel's Folly" links the quest).
    needs: (r.needs ?? []).map((n) => {
      const href = n.kind === "quest" ? linkFor(n.what.replace(/^(finish|complete|after)\s+/i, "")).href : undefined;
      return { text: n.what, ...(href ? { href } : {}) };
    }),
    starts,
    ...(r.firstStep ? { firstStep: r.firstStep } : {}),
    takesYou: (r.takesYou ?? []).map((t) => {
      const danger = dangerOf(placeNamed(t.place, q.name));
      return { place: t.place, ...(!blank(t.hold) ? { hold: t.hold } : {}), ...(t.why ? { why: t.why } : {}), ...(danger ? { danger } : {}) };
    }),
    choices: r.choices ?? [],
    gets: { xp: q.xp, ...(q.type ? { type: q.type } : {}), rewards: r.rewards ?? [] },
    opens: (r.opens ?? []).map(linkFor),
    closes: r.closes ?? [],
    steps: (r.steps ?? []).map((s) => ({ ...(s.branch && s.branch !== "main" ? { branch: s.branch } : {}), objectives: s.objectives ?? [] })).filter((s) => s.objectives.length),
    ...(r.ways?.ways?.length ? { ways: r.ways } : {}),
    changedBy: q.changedBy ?? [],
    people: (r.people ?? []).filter((p) => !blank(p.name)),
    sure,
    reports: reportCount(players),
    unsure,
  };
}

/** The older rules' page for a quest with no read yet: what the start check and the records gave, in the same shape. */
function viaRules(q: Quest): QuestPage {
  const st = q.start;
  const ways = st?.ways ?? [];
  const starts = ways.length
    ? ways.map((w) => ({ how: w.how, ...(w.who ? { who: w.who } : {}), ...(w.where ? { where: w.where } : {}), ...(w.checked === "players" ? { reportedBy: { source: w.source ?? "", ...(w.also?.length ? { also: w.also } : {}) } } : {}), ...(w.whereIs?.length ? { whereIs: w.whereIs } : {}), ...(w.unplaced ? { unplaced: w.unplaced } : {}) }))
    : st?.who
      ? [{ how: `Talk to ${st.who}`, who: st.who, ...(st.where ? { where: st.where } : {}) }]
      : [];
  const rewards = [
    ...(q.rewards?.gold ? [{ what: GOLD[q.rewards.gold] }] : []),
    ...(q.rewards?.items ?? []).map((what) => ({ what })),
    ...(q.rewards?.endings ?? []).map((e) => ({ what: `${RUN_CHANGE[e.kind]}: “${e.text}”`, when: e.only ? "one ending of several" : "at the end" })),
  ];
  return {
    source: "rules",
    canDo: null,
    // The start check writes each way into its needs too ("One of: ..."); a need that only repeats a way is no need.
    needs: (st?.needs ?? []).filter((n) => !/^One of: /.test(n) && !ways.some((w) => w.how === n)).map((text) => ({ text })),
    starts,
    ...(st?.then ? { firstStep: st.thenWhere ? `${st.then} at ${st.thenWhere}` : st.then } : {}),
    takesYou: [],
    choices: [],
    gets: { xp: q.xp, ...(q.type ? { type: q.type } : {}), rewards },
    opens: [],
    closes: [],
    steps: q.objectives.length ? [{ objectives: q.objectives }] : [],
    changedBy: q.changedBy ?? [],
    people: (q.people ?? []).map((name) => ({ name })),
    sure: `Not read yet: this page is from the planner's older rules, and ${st && st.checked !== "not yet" ? `its start is checked (${checkedLabel(st.checked, st.source)})` : "its start isn't checked yet"}`,
    reports: reportCount(playerWays(q)),
    unsure: [],
  };
}

/** The page's data for a quest: its read when it has one, else the older rules. */
export const pageOf = (q: Quest): QuestPage => (q.read && q.source === "reads" ? viaReads(q, q.read) : viaRules(q));

/**
 * What get_quest says for a quest (the page's sections 2 to 10, in order) and suggest_quests' short form (2, 3, 4 and 7). The older
 * rules' answer says `source: "rules"` and what that means; a player's report says so beside the fact it replaced.
 */
export function doorPage(q: Quest) {
  const p = pageOf(q);
  // Who, where, then how: the order a player looks for them.
  const starts = p.starts.map((s) => ({
    ...(s.who ? { who: s.who } : {}),
    ...(s.where ? { where: s.where } : {}),
    how: s.how,
    ...(s.reportedBy ? { checked: doorSources(s.reportedBy.source, s.reportedBy.also) } : {}),
    // Where the thing to read is, from the readables file, or that it isn't checked: never a direction (WO-131).
    ...(s.whereIs?.length ? { whereIs: s.whereIs } : {}),
    ...(s.unplaced ? { whereIsIt: `${s.unplaced} Don't tell the player where to look.` } : {}),
  }));
  return {
    source: p.source,
    ...(p.source === "rules" ? { sourceNote: "This quest hasn't been read yet; these fields are from the planner's older rules. Say it isn't read yet rather than filling the gap." } : {}),
    canDo: p.canDo ? (p.canDo.why ? `${p.canDo.label}: ${p.canDo.why}` : p.canDo.label) : "not read yet",
    needs: p.needs.length ? p.needs.map((n) => n.text) : ["Nothing: any level"],
    starts,
    ...(p.firstStep ? { firstStep: p.firstStep } : {}),
    takesYou: p.takesYou,
    choices: p.choices,
    gets: { xp: p.gets.xp ? `${p.gets.xp} XP${p.gets.type ? ` (${p.gets.type})` : ""}` : "no XP", rewards: p.gets.rewards },
    opens: p.opens.map((o) => o.text),
    closes: p.closes,
    steps: p.steps,
    // The choices tied to the steps each takes, when the quest has them: the page's "N ways to finish it".
    ...(p.ways ? { ways: p.ways.ways.map((w) => ({ way: w.title, ...(w.ends ? { ends: w.ends } : {}), steps: w.steps })), ...(p.ways.shape === "endings" ? { stepsEveryWayTakes: p.ways.shared } : {}) } : {}),
    ...(p.changedBy.length ? { changedBy: p.changedBy.map((m) => m.name) } : {}),
    howSure: p.sure,
    ...(p.reports ? { playerReports: playersWords(p.reports) } : {}),
    ...(p.unsure.length ? { unsure: p.unsure } : {}),
  };
}

/** suggest_quests' short form: can I do it, what I need, how to start, what I get. */
export function shortPage(q: Quest) {
  const d = doorPage(q);
  return { canDo: d.canDo, needs: d.needs, starts: d.starts, gets: d.gets, source: d.source };
}

/**
 * A quest's row on its line's page (WO-154): what it is in one line, where it takes you with the danger, and what it needs
 * (the line page drops what the quest before it already needed). Words from the page, nothing new.
 */
export function rowOf(q: Quest, before?: Quest) {
  const p = pageOf(q);
  const prior = new Set(before ? pageOf(before).needs.map((n) => n.text) : []);
  // A read's first step says what the quest is; the older rules' says how it starts, which is what they know best.
  const summary = (p.source === "reads" ? (p.firstStep ?? p.starts[0]?.how) : (p.starts[0]?.how ?? p.firstStep)) ?? null;
  return {
    summary: summary && summary.length > 170 ? `${summary.slice(0, 167).trimEnd()}...` : summary,
    places: p.takesYou.slice(0, 3).map((t) => [t.place, t.danger].filter(Boolean).join(": ")),
    // What the quest before it already needed isn't repeated, and neither is finishing that quest: the order says it.
    needs: p.needs.map((n) => n.text).filter((t) => !prior.has(t) && !(before && t.includes(before.name))),
    canDo: p.canDo,
    source: p.source,
    closes: p.closes,
    rewards: p.gets.rewards,
    where: p.starts.find((s) => s.where)?.where ?? null,
    town: q.start?.towns?.[0] ?? null,
  };
}
