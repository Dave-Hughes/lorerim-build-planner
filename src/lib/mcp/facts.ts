import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { perkText, rankCount, type GameData, type Perk } from "@/lib/rules/data";
import type { BuildPlan } from "@/lib/rules/types";
import { currentVersion } from "@/lib/rules/versions";
import { categories, homeName, questsData } from "@/lib/quests/data";
import { stories, storyById, storyOfLine } from "@/lib/quests/stories-data";
import { storyOrder, type Story } from "@/lib/quests/story";
import { resolveNevers, type Nevers } from "@/lib/quests/never";
import { openFor, questNames, type PlayerState } from "@/lib/quests/open";
import type { Never } from "@/lib/playthroughs/types";
import type { Quest, QuestLine } from "@/lib/quests/types";
import { startChecked } from "@/lib/quests/types";
import { TRAIT_CHOICES } from "@/lib/rules/trait-choices";

/**
 * The planner's facts for assistants (WO-108): read-only answers from src/data/lorerim-<version>/,
 * never from anything else. Each function returns plain JSON for the MCP route to send.
 */

export { DEFAULT_VERSION, FactsError, versionData } from "./errors";
import { DEFAULT_VERSION, FactsError, versionData } from "./errors";
import { gearData } from "@/lib/gear/data";
import { doorSources } from "@/lib/quests/player-source";
import { questHref } from "@/lib/quests/slugs";
import { doorPage, playersWords } from "@/lib/quests/reads";
import { notSureOf, peopleData, personByName } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { HOMES, HOMES_NOTE, MOUNTS, TOME_TRIALS } from "./living";
import { howPointsWork, pointRules } from "./rules-text";
import { playthroughsOn } from "@/lib/playthroughs/gate";
import { canTakeAt, issuesOf, planFromPlain, stateAt, type PlainBuild } from "./plan";

/** The quest data is for the current version only. */
function questsFor(version: string) {
  versionData(version);
  if (version !== currentVersion().id) throw new FactsError(`Quest facts are only for LoreRim ${currentVersion().id}.`);
  return questsData();
}

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").trim();

function byIdOrName<T extends { id?: string; name: string }>(list: T[], what: string, id?: string, name?: string): T {
  if (!id && !name) throw new FactsError(`Give the ${what}'s id or name.`);
  const hit = id ? list.find((x) => x.id && norm(x.id) === norm(id)) : list.find((x) => norm(x.name) === norm(name!));
  if (hit) return hit;
  const like = name ? list.filter((x) => norm(x.name).includes(norm(name))).slice(0, 5) : [];
  throw new FactsError(`No ${what} ${id ? `with the id ${id}` : `named ${name}`}.${like.length ? ` Close: ${like.map((x) => x.name).join(", ")}.` : ""}`);
}

const perkName = (d: GameData, id: string) => {
  const p = d.perkById.get(id);
  return p ? `${p.tree}: ${p.name}` : id;
};

/** Kinds search_facts looks through. */
export const FACT_KINDS = ["perk", "spell", "trait", "race", "birthsign", "deity", "quest line", "story", "quest", "item"] as const;
export type FactKind = (typeof FACT_KINDS)[number];

export interface Hit {
  kind: FactKind;
  id: string;
  name: string;
  line: string;
  /** For a quest found by more than its name (WO-133): what matched, "an objective: Catch the white, or palonimo, horse". */
  why?: string;
  /** A quest's own page address (WO-147), which the door turns into a link. */
  href?: string;
}

/** What search says when nothing matched (WO-133): never send the assistant to the web. */
export const NO_MATCH = "No quest matched. Ask the player where they saw it or what it gives.";

// Words a player puts round a quest's name that no quest is found by: "the horse quest", "how do I start Palonimo".
const FILLER = new Set(["the", "a", "an", "quest", "quests", "in", "of", "on", "at", "to", "for", "with", "called", "named", "how", "do", "i", "start", "lorerim", "skyrim", "about", "one"]);
/** A text's words, case and punctuation aside ("Joslin's horse" -> "joslin's horse"). */
const wordsOf = (t: string) => norm(t).replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
/** Whether a word starts a word of the text: "horse" in "horses", not "no" in "Dragonstone". */
const holds = (text: string, w: string) => ` ${text}`.includes(` ${w}`);
// What get_quest takes for a name (WO-133): what players call it, who's in it, what starts it; never an objective's words.
const NAMED_BY = ["what players call it", "someone in it", "what starts it"];

/**
 * A quest found by more than its name (WO-133): what players call it, the people and creatures in it, what starts it by
 * reading, its objectives and its endings. Every word must be somewhere in those; the first field that holds them all
 * says why it matched, else the one that holds the most. A name match is rank 1; these come after, by the field.
 */
function questMatch(q: Quest, words: string[]): { rank: number; why: string } | null {
  const fields: [string, string[]][] = [
    ["what players call it", q.calledBy ?? []],
    ["someone in it", q.people ?? []],
    // The item by its records' name, though the words say where it is ("The Palonimo Mare").
    ["what starts it", [...(q.start?.raw?.ways ?? []), ...(q.start?.ways ?? [])].filter((w) => /^(Read|Get) /.test(w.how)).map((w) => w.how.replace(/^(Read|Get) /, ""))],
    ["an objective", q.objectives],
    ["an ending", q.endings.map((e) => e.text).filter(Boolean)],
  ];
  const all = wordsOf(fields.flatMap(([, v]) => v).join(" | "));
  if (!words.every((w) => holds(all, w))) return null;
  const scored = fields.flatMap(([label, values], i) => values.map((v) => ({ i, label, v, n: words.filter((w) => holds(wordsOf(v), w)).length })));
  const whole = scored.find((x) => x.n === words.length);
  const best = whole ?? [...scored].sort((a, b) => b.n - a.n || a.i - b.i)[0];
  const v = best.v.length > 120 ? `${best.v.slice(0, 117)}...` : best.v;
  return { rank: 2 + (whole ? whole.i : fields.length), why: `${best.label}: ${v}` };
}

const firstSentence = (t: string) => (t.replace(/<([^>]*)>/g, "$1").match(/^.*?[.!?](\s|$)/)?.[0] ?? t).trim().slice(0, 200);

/** The words players use for getting a follower (WO-137 item 5), searched beside a follower line's name. */
const FOLLOWER_WORDS = "follower companion free frees freeing freed rescue rescuing recruit recruiting hire hiring join joins jail jailed prison cell";

/** Where a follower line's opening quest starts and who gives it: "Riften Jail Inigo". */
function followerPlaces(l: QuestLine): string {
  const q = l.quests.find((x) => x.edid === l.opening) ?? l.quests[0];
  return [...new Set([q?.start?.who, q?.start?.where, ...(q?.start?.ways ?? []).flatMap((w) => [w.who, w.where])].filter(Boolean))].join(" ");
}

/** Perks, spells, traits, races, birthsigns, deities, quest lines and stories by name or word: 20 at most. */
export function searchFacts(query: string, kinds: FactKind[] = [...FACT_KINDS], version = DEFAULT_VERSION, limit = 20): { hits: Hit[]; more: number; note?: string } {
  const d = versionData(version);
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) throw new FactsError("Say what to look for.");
  const all: (Hit & { text: string })[] = [];
  const want = new Set(kinds);
  if (want.has("perk")) for (const p of d.perks) all.push({ kind: "perk", id: p.id, name: p.name, line: `${p.tree} perk${p.skill ? `, needs ${p.tree} ${p.skill}` : ""}`, text: p.text ?? p.rankTexts?.join(" ") ?? "" });
  if (want.has("spell")) for (const s of d.spells) all.push({ kind: "spell", id: s.id, name: s.name, line: `${s.tier} ${s.school}${s.cost ? `, ${s.cost} Magicka` : ""}`, text: s.text });
  if (want.has("trait")) for (const t of d.traits) all.push({ kind: "trait", id: t.name, name: t.name, line: firstSentence(t.text), text: t.text });
  if (want.has("race")) for (const r of d.races) all.push({ kind: "race", id: r.name, name: r.name, line: `Health ${r.health}, Magicka ${r.magicka}, Stamina ${r.stamina}`, text: "" });
  if (want.has("birthsign")) for (const b of d.birthsigns) all.push({ kind: "birthsign", id: b.name, name: b.name, line: firstSentence(b.text), text: b.text });
  if (want.has("deity"))
    for (const g of d.deities) {
      const t = d.deityText[g];
      all.push({ kind: "deity", id: g, name: g, line: t?.follower ? firstSentence(t.follower.text) : "A deity", text: [t?.follower?.text, t?.devotee?.text, t?.tenets?.text].filter(Boolean).join(" ") });
    }
  if (version === currentVersion().id) {
    const { lines } = questsData();
    // One record per line (WO-160): a line told as a story is the same page, so its story's name and pitch are found on the line's record
    // and no second "story" record is made. Asking for stories alone finds the lines that have one.
    if (want.has("quest line") || want.has("story"))
      for (const l of lines) {
        const s = storyOfLine(l.id);
        if (!want.has("quest line") && !s) continue;
        // A follower's line is also found by how players talk about getting them (WO-137 item 5): "free Inigo", "Inigo jail".
        const follower = l.category === "followers" ? ` ${FOLLOWER_WORDS} ${followerPlaces(l)}` : "";
        all.push({ kind: "quest line", id: l.id, name: l.name, line: [s?.name, homeName(l.category), l.where, l.prince].filter(Boolean).join(" | "), text: [s ? `${s.name} ${s.pitch}` : "", l.quests.map((q) => q.name).join(" "), follower].join(" ") });
      }
  }
  const has = (t: string) => words.every((w) => norm(t).includes(w));
  const ranked: { h: Hit; rank: number }[] = all
    .map((h) => ({ h: { kind: h.kind, id: h.id, name: h.name, line: h.line } as Hit, rank: norm(h.name) === norm(query) ? 0 : has(h.name) ? 1 : has(`${h.name} ${h.line} ${h.text}`) ? 2 : -1 }))
    .filter((x) => x.rank >= 0);
  // A quest by its name, or by what's in it (WO-133): "Palonimo", "white horse" and "the horse quest" find Running Wild.
  if (want.has("quest") && version === currentVersion().id) {
    const asked = wordsOf(query).split(" ").filter((w) => w && !FILLER.has(w));
    const look = asked.length ? asked : wordsOf(query).split(" ").filter(Boolean);
    for (const l of questsData().lines)
      for (const q of l.quests) {
        const hit = { kind: "quest" as const, id: q.edid, name: q.name, line: `A quest in ${l.name}`, ...(questHref(q.edid) ? { href: questHref(q.edid)! } : {}) };
        if (wordsOf(q.name) === wordsOf(query)) ranked.push({ h: hit, rank: 0 });
        else if (look.every((w) => holds(wordsOf(q.name), w))) ranked.push({ h: hit, rank: 1 });
        else {
          const m = questMatch(q, look);
          if (m) ranked.push({ h: { ...hit, why: m.why }, rank: m.rank });
        }
      }
  }
  // An item by name (WO-142 item 9): names only, so set_gear can be given one that exists. Ranked after everything else so a
  // piece of gear never pushes a quest or a perk out of 20; one of a name and type once, whichever plugin has more.
  if (want.has("item") && version === currentVersion().id) {
    const seen = new Set<string>();
    for (const it of gearData().items) {
      const type = it.slot ?? it.type ?? it.weaponType ?? (it.kind === "ammo" ? "Ammo" : it.kind);
      const key = `${norm(it.name)}|${type}`;
      if (seen.has(key) || !words.every((w) => norm(it.name).includes(w))) continue;
      seen.add(key);
      ranked.push({ h: { kind: "item", id: it.id, name: it.name, line: [type, it.armorType].filter(Boolean).join(", ") }, rank: 10 + (norm(it.name) === norm(query) ? 0 : 1) });
    }
  }
  ranked.sort((a, b) => a.rank - b.rank || a.h.name.length - b.h.name.length || a.h.name.localeCompare(b.h.name));
  return { hits: ranked.slice(0, limit).map(({ h }) => h), more: Math.max(0, ranked.length - limit), ...(ranked.length ? {} : { note: NO_MATCH }) };
}

/** A perk as the editor shows it: tree, ranks, what each rank needs and says, and what it rules out. */
export function getPerk(args: { id?: string; name?: string }, version = DEFAULT_VERSION) {
  const d = versionData(version);
  const p: Perk = byIdOrName(d.perks, "perk", args.id, args.name);
  const ranks = rankCount(p);
  const ruledOutBy = d.perks.filter((x) => x.excludes?.includes(p.id)).map((x) => `${x.tree}: ${x.name}`);
  const rules = [...new Set([...(p.excludes ?? []).map((x) => perkName(d, x)), ...ruledOutBy])];
  return {
    id: p.id,
    tree: p.tree,
    name: p.name,
    ranks,
    needs: {
      perks: p.requires.map((r) => perkName(d, r)),
      ...(p.requires.length > 1 ? { anyOf: p.anyOf } : {}),
      ...(p.book ? { book: `Learned from ${p.book}, not a perk point` } : {}),
      ...(p.carryItems ? { carry: p.carryItems } : {}),
      ...(p.quest ? { quest: p.quest } : {}),
    },
    rankDetails: Array.from({ length: ranks }, (_, i) => {
      const t = perkText(p, i);
      const skill = p.rankSkills?.[i] ?? (i === 0 ? p.skill : undefined);
      return {
        rank: i + 1,
        ...(p.tree !== "Destiny" && skill !== undefined ? { skill: `${p.tree} ${skill}` } : {}),
        ...(p.rankLevels?.[i] ? { level: p.rankLevels[i] } : {}),
        text: t.text,
        ...(t.effect ? { effect: t.effect } : {}),
      };
    }),
    rulesOut: rules,
    cost: p.tree === "Destiny" ? "1 Destiny point" : p.book ? "No perk point (a book)" : "1 perk point a rank",
    source: "game files",
  };
}

/** A spell: school, tier, cost, effect and the tomes that teach it. Where it's sold isn't in the data yet. */
export function getSpell(args: { id?: string; name?: string }, version = DEFAULT_VERSION) {
  const d = versionData(version);
  const s = args.id ? (d.spellById.get(args.id) ?? byIdOrName(d.spells, "spell", args.id)) : byIdOrName(d.spells, "spell", undefined, args.name);
  return {
    id: s.id,
    name: s.name,
    school: s.school,
    tier: s.tier,
    cost: s.cost,
    cast: s.cast,
    effect: s.text,
    ...(s.also?.length ? { alsoDoes: s.also } : {}),
    tomes: s.tomes,
    soldBy: { checked: "not yet", note: "Where it's sold isn't in the planner's data yet, so no merchant is given. Don't name one from memory." },
    source: "game files",
  };
}

/**
 * A quest line's or story's start. Only lines that have passed the start check (those written up as
 * a story) are answered in full; for the rest, the name and category with checked: "not yet".
 */
/**
 * One quest's ways in, as the start check words each starter (who to ask and what, and where), with
 * their needs, the first objective as `then`, and who and where when one person starts it (WO-121b:
 * back once the answer key passed). A start not checked yet gives none.
 */
/** How many places a read-this way gives unless every one is asked for (WO-137 item 2). */
const PLACES_SHOWN = 8;

/**
 * Where the thing to read is (WO-137 item 2): eight places at most, grouped by area in the data's order, and how to ask
 * for the rest; every place with `all`.
 */
function wherePlaces(where: string[], areas: string[] | undefined, all: boolean) {
  const shown = all ? where : where.slice(0, PLACES_SHOWN);
  const groups: { area: string; places: string[] }[] = [];
  shown.forEach((w, i) => {
    const area = areas?.[i] ?? "";
    const g = groups.at(-1);
    if (g && g.area === area) g.places.push(w);
    else groups.push({ area, places: [w] });
  });
  const more = where.length - shown.length;
  return {
    whereIs: shown,
    // Grouped only when the places span more than one area.
    ...(areas?.length && groups.length > 1 ? { whereIsByArea: groups.map((g) => (g.area ? g : { places: g.places })) } : {}),
    ...(more > 0 ? { morePlaces: `${more} more place${more === 1 ? "" : "s"}, ${where.length} in all: ask again with places: true to list them.` } : {}),
  };
}

function startOf(
  q: Quest | undefined,
  allPlaces = false,
): {
  ways?: { way: string; needs?: string[]; who?: string; where?: string; checked?: string; whereIs?: string[]; whereIsIt?: string }[];
  then?: string;
  onTheWay?: string[];
  who?: string;
  where?: string;
} {
  const st = q?.start;
  if (!st) return {};
  // A start the planner hasn't checked gives no instructions (WO-146): but a way a player told it, approved by an admin,
  // is said as exactly that, with its source, and nothing else is.
  if (!startChecked(st)) {
    const players = (st.ways ?? []).filter((w) => w.checked === "players");
    return players.length
      ? { ways: players.map((w) => ({ way: w.how, ...(w.who ? { who: w.who } : {}), ...(w.where ? { where: w.where } : {}), checked: doorSources(w.source ?? "", w.also), ...(w.whereIs?.length ? wherePlaces(w.whereIs, w.whereIsArea, allPlaces) : {}) })) }
      : {};
  }
  const ways = st.ways?.length
    ? st.ways.map((w) => ({
        way: w.how,
        ...(w.needs?.length ? { needs: w.needs } : {}),
        ...(w.who ? { who: w.who } : {}),
        ...(w.where ? { where: w.where } : {}),
        // A player found it in game (WO-131 Part 0): say so, and who, beside the files' facts.
        ...(w.checked === "players" ? { checked: doorSources(w.source ?? "", w.also) } : {}),
        // Where the thing to read is (WO-131 Part 2), from the game files; or that it isn't checked, which is no direction.
        ...(w.whereIs?.length ? wherePlaces(w.whereIs, w.whereIsArea, allPlaces) : {}),
        ...(w.unplaced ? { whereIsIt: `${w.unplaced} Don't tell the player where to look.` } : {}),
      }))
    : (st.needs ?? []).filter((n) => /^(Ask|Talk to|After|Through|It )/.test(n)).slice(0, 1).map((n) => ({ way: n }));
  // Only the words (WO-136, Bob 22 Oct): the record form (start.raw) stays in the data and for the open-or-locked judge,
  // never through the door. Every fact in it is in the ways and needs, and an assistant can only repeat it to a player.
  return {
    ...(st.who ? { who: st.who, ...(st.where ? { where: st.where } : {}) } : {}),
    // If the war changes hands (WO-138 Part 4b), and who sends you to it (G1, G2).
    ...(st.whoElse ? { orIfTheWarChangesHands: st.whoElse } : {}),
    ...(st.sentBy ? { sentBy: st.sentBy } : {}),
    ways,
    ...(st.then ? { then: st.thenWhere ? `${st.then} at ${st.thenWhere}` : st.then } : {}),
    // A locked door on the way is the first step's detail (WO-148 item 5), never a need of the start.
    ...(st.doors?.length ? { onTheWay: st.doors } : {}),
  };
}

/**
 * How a line or story starts, with where each fact was checked. A line with no story answers for the quest asked (WO-137
 * item 3): its own checked start is the answer, and what the line still lacks is said once, in a sentence. Only when the
 * quest itself isn't checked does it give no instructions.
 */
export function questStart(line: QuestLine, story: Story | undefined, quest?: Quest) {
  const category = homeName(line.category);
  if (!story) {
    const head = { kind: "quest line" as const, id: line.id, name: line.name, category };
    if (!quest || !startChecked(quest.start))
      return {
        ...head,
        checked: "not yet",
        note: `This quest's start hasn't passed the planner's start check, so no instructions are given. Say it isn't checked yet rather than filling the gap.${quest?.start?.ways?.some((w) => w.checked === "players") ? " A player's report is below: say it is that, not the game files." : ""}`,
      };
    // A line whose quests are all checked (one by one, or as a class like Missives) is checked; else say which aren't, once.
    const open = line.quests.filter((x) => !startChecked(x.start));
    return {
      ...head,
      checked: "files",
      ...(open.length
        ? { aboutTheLine: `${quest.name}'s start is checked (below). ${open.length} of the ${line.quests.length} quests in ${line.name} aren't yet: say so only if the player asks about those.` }
        : {}),
    };
  }
  const first = storyOrder(story)[0];
  const from = (c: string | undefined) => (c === "not yet" ? "not yet" : "files");
  return {
    kind: "story" as const,
    id: story.id,
    name: story.name,
    line: { id: line.id, name: line.name },
    category,
    checked: "files",
    start: story.start.map((s) => ({ text: s.text, checked: s.checked })),
    // Who and where only when one person starts it (WO-121b), the ways in, and then the task.
    firstQuest: { name: first.name, ...startOf(line.quests.find((q) => q.edid === first.edid)), ...(first.task ? { then: first.task } : {}), checked: first.checked },
    ...(line.gate ? { gate: { text: line.gate, checked: from(line.checked.gate) } } : {}),
    ...(line.minLevel ? { minLevel: line.minLevel } : {}),
    opens: story.opens.map((o) => ({
      line: o.line,
      name: o.name,
      needs: o.needs.map((n) => ({ text: n.text, checked: n.checked, ...(n.why ? { why: n.why } : {}) })),
      ...(o.or ? { or: o.or } : {}),
    })),
  };
}

/** One quest's objectives and the endings its records flag, each with its journal line and when it shows. */
type RulesFacts = ReturnType<typeof rulesFacts>;
function questFacts(q: Quest, allPlaces = false): RulesFacts & Partial<ReturnType<typeof doorPage>> {
  // A quest with a read says what the read says and nothing from the older rules (WO-154 Part 1b): no start block, objectives, endings or
  // run changes of the rules'. Its XP is in `gets`.
  // (The cast is for the older block's type only: the tests that read `start` ask about quests with no read.)
  if (q.source === "reads") return { edid: q.edid, name: q.name, ...doorPage(q) } as unknown as RulesFacts & ReturnType<typeof doorPage>;
  return rulesFacts(q, allPlaces);
}

export function rulesFacts(q: Quest, allPlaces = false) {
  return {
    edid: q.edid,
    name: q.name,
    // The page's sections 2 to 10, in the page's order (WO-154), from the quest's read or, where it has none, the older rules.
    ...doorPage(q),
    start: {
      // A start the answer key confirmed (WO-136 ruling 2) says it's from the wiki, with the page.
      checked: q.start?.checked === "uesp" ? `from ${q.start.source ?? "UESP"}, confirmed in the planner's answer key${q.start.url ? ` (${q.start.url})` : ""}` : (q.start?.checked ?? "not yet"),
      ...startOf(q, allPlaces),
      ...(startChecked(q.start) && q.start?.needs?.length ? { needs: q.start.needs } : {}),
    },
    // What it pays (WO-148 item 4): its type and quest XP from Experience.ini, said plainly when it is none.
    ...(q.type ? { type: q.type } : {}),
    xp: q.xp,
    pays: `${q.type ? `${q.type}: ` : ""}${q.type ? "pays" : "Pays"} ${q.xp ? `${q.xp} quest XP` : "no quest XP"}`,
    objectives: q.objectives,
    endings: q.endings.map((e) => ({ stage: e.stage, ends: e.fails ? ("fails" as const) : ("completes" as const), ...(e.text ? { text: e.text } : {}), ...(e.when ? { when: e.when } : {}) })),
    ...(q.endings.length ? {} : { note: "The records flag no ending for this quest. Don't say how it ends." }),
    ...(changesRun(q) ?? {}),
  };
}

const CHANGE_WORDS = { mount: "a mount", house: "a house", follower: "a follower", item: "a unique item", gold: "a lot of gold" } as const;

/**
 * What a quest's endings hand over that changes a run (WO-129 Part 6), from its stage text and endings: each with the
 * stage it comes at, the ending's journal line, the stage text that says it, and whether it's one ending's of several.
 */
export function changesRun(q: Quest) {
  const ends = q.rewards?.endings ?? [];
  if (!ends.length) return null;
  return {
    changesTheRun: ends.map((e) => ({
      gives: CHANGE_WORDS[e.kind],
      atStage: e.stage,
      ending: e.text,
      ...(e.fromText ? { saidAt: { stage: e.from, text: e.fromText } } : {}),
      ...(e.only ? { onlyThisEnding: true } : {}),
    })),
    changesTheRunNote: `An ending of ${q.name} hands over ${[...new Set(ends.map((e) => CHANGE_WORDS[e.kind]))].join(" or ")}${ends.some((e) => e.only) ? ", and the player chooses which ending" : ""}. Say what that does to the character's run and ask the player before recommending it (rule 21).`,
  };
}

/**
 * get_quest (WO-115): a story, quest line or one quest, by id (a line or story id from search_facts, or
 * a quest's EDID) or by name. Answers how it starts, as get_quest_start did, and the quest's objectives
 * and endings: the named quest, or the line's opening quest.
 */
export function getQuest({ id, name, places }: { id?: string; name?: string; places?: boolean }, version = DEFAULT_VERSION, player: PlayerState | null = null) {
  const { byId, lines } = questsFor(version);
  if (!id && !name) throw new FactsError("Give the quest's id or name. search_facts finds quest lines and stories by name.");
  const quests = lines.flatMap((line) => line.quests.map((quest) => ({ line, quest })));
  let line: QuestLine | undefined;
  let story: Story | undefined;
  let quest: Quest | undefined;
  let found: { asked: string; is: string; because?: string } | undefined;
  const fromId = (key: string) => {
    story = storyById(key);
    line = byId.get(story?.line ?? key);
    const hit = line ? undefined : quests.find((x) => norm(x.quest.edid) === norm(key));
    if (hit) ({ line, quest } = hit);
  };
  if (id) fromId(id);
  else {
    const want = norm(name!);
    story = stories().find((s) => norm(s.name) === want);
    line = story ? byId.get(story.line) : lines.find((l) => norm(l.name) === want);
    if (!line) {
      const hits = quests.filter((x) => norm(x.quest.name) === want);
      if (hits.length > 1) throw new FactsError(`${hits.length} quests are named ${name}: ${hits.map((x) => `${x.quest.edid} in ${x.line.name}`).join(", ")}. Ask again with the EDID as id.`);
      if (hits[0]) ({ line, quest } = hits[0]);
    }
    if (!line) {
      // Not a name: a quest found by what's in it (WO-133), with what matched. Nothing found: ask the player, never the web.
      const hit = searchFacts(name!, ["story", "quest line", "quest"], version).hits.find((h) =>
        h.why ? NAMED_BY.some((b) => h.why!.startsWith(`${b}:`)) : wordsOf(name!).split(" ").filter((w) => !FILLER.has(w)).every((w) => holds(wordsOf(h.name), w)),
      );
      if (!hit) throw new FactsError(`No quest, quest line or story is named ${name}. ${NO_MATCH}`);
      found = { asked: name!, is: hit.name, ...(hit.why ? { because: hit.why } : {}) };
      fromId(hit.id);
    }
  }
  if (!line) throw new FactsError(`No quest, quest line or story ${id ? `with the id ${id}` : `named ${name}`}. search_facts finds them by name.`);
  const l: QuestLine = line;
  story ??= storyOfLine(l.id);
  const s1 = story as Story | undefined;
  const q: Quest = quest ?? l.quests.find((x) => x.edid === (s1 ? storyOrder(s1)[0].edid : l.opening)) ?? l.quests[0];
  return {
    ...(found ? { found } : {}),
    // With no story, the quest asked for answers first (WO-137 item 3); its line follows.
    ...(s1 ? {} : { quest: questFacts(q, places) }),
    // A quest with a read has no rules' start check to report (its note would say there are no instructions): only whose line it is.
    ...(!s1 && q.source === "reads" ? { kind: "quest line" as const, id: l.id, name: l.name, category: homeName(l.category) } : questStart(l, s1, s1 ? undefined : q)),
    // A job from a board (WO-136 ruling 3): the class's one sentence, said once, and where the boards are.
    // A line's radiant templates as one class (WO-138: the Civil War's sieges, battles and rescues).
    ...(l.radiant ? { radiantJobs: { says: l.radiant.says, checked: "files, as a class" } } : {}),
    ...(l.board && q.start?.board ? { jobFromABoard: { says: l.board.says, boards: l.board.boards ?? "Where the boards are isn't checked yet. Don't name one." } } : {}),
    quest: questFacts(q, places),
    // Open for you (WO-115 Part 3): only when the player said where they are.
    ...(player ? { openForYou: openForYou(l, q, player, version) } : {}),
  };
}

/** get_quest's answer with the quest's own page (WO-147 Part 1): `link` is origin and /quests/q/<slug>. */
export function withQuestLink<T extends { quest: { edid: string } }>(answer: T, origin = ""): T & { link?: string } {
  const page = questHref(answer.quest.edid);
  return page ? { ...answer, link: `${origin}${page}` } : answer;
}

/** What the player has told the planner (WO-115 Part 3), as tools take it: their level, what they've finished, a save's quest stages. */
export interface Told {
  level?: number | null;
  /** Finished lines (ids or names) or quests (EDIDs or names). */
  done?: string[];
  /** A save's quest stages by EDID (WO-112). */
  stages?: Record<string, number> | null;
  /** What the character will never do (WO-139), from the playthrough. */
  never?: Never[] | null;
}

/** A playthrough's never list as the quest tools keep to it (WO-139 Part 3). */
export function neversOf(list: readonly Never[] | null | undefined, version = DEFAULT_VERSION): Nevers {
  try {
    return resolveNevers(list, questsFor(version).lines, stories());
  } catch (e) {
    throw new FactsError((e as Error).message);
  }
}

/** What the planner knows of the player, from what they told it: finished lines count every quest in them. */
export function playerState(told: Told, version = DEFAULT_VERSION): PlayerState {
  const { lines } = questsFor(version);
  const names = questNames(lines.flatMap((l) => l.quests));
  const done = new Set<string>();
  for (const raw of told.done ?? []) {
    const k = norm(raw);
    const line = lines.find((l) => norm(l.id) === k || norm(l.name) === k);
    if (line) for (const q of line.quests) done.add(q.edid);
    for (const l of lines) for (const q of l.quests) if (norm(q.edid) === k) done.add(q.edid);
    for (const e of names.get(k) ?? []) done.add(e);
  }
  const never = neversOf(told.never, version).quests;
  const kill = neversOf(told.never, version).kill;
  return { level: told.level ?? null, done, stages: told.stages ?? {}, ...(never.size ? { never } : {}), ...(kill ? { neverKills: kill } : {}) };
}

const SAYS = { open: "open for you", locked: "locked", unknown: "unknown" } as const;

/** One quest of a line, open for the player or not, and why (WO-115 Part 3): what an assistant says about it. */
export function openForYou(line: QuestLine, quest: Quest, p: PlayerState, version = DEFAULT_VERSION) {
  const { lines } = questsFor(version);
  // A line's order is no gate (WO-142 item 1, after WO-130's work shelves): only the records' own needs gate a quest.
  const r = openFor(quest, p, questNames(lines.flatMap((l) => l.quests)));
  // Locked for this character (WO-139): a quest behind something the player said she will never do, in their words.
  if (r.forCharacter) return { state: r.state, says: `locked for this character: ${r.because.join("; ")}`, because: r.because, forCharacter: true as const };
  // With kill on the never list (Part 5): an open quest says it is kill-free as far as its objectives go.
  const kills = p.neverKills ? "kill-free as far as the objectives go" : null;
  return { state: r.state, says: `${r.state === "open" ? `${SAYS.open}${r.places?.length ? `, in ${r.places.join(" or ")}` : ""}` : `${SAYS[r.state]}: ${r.because.join("; ")}`}${kills ? `; ${kills}` : ""}`, because: r.because, ...(kills ? { kills } : {}) };
}

/**
 * get_person (WO-159): a person, by name. Who they are, and when they have been read and checked (people_reads/checked) the same
 * fields their page shows: the first meeting, their day, what changes it, what they sell and train, how they join you, whether
 * you can marry them, how they fight, their quests and how each touches them, and whether they can die. What the checker
 * could not settle is in `notSure`, each with its reason; a person not read yet says so and gives only what the index holds.
 */
export function getPerson({ name }: { name?: string }, origin = "") {
  if (!name?.trim()) throw new FactsError("Give the person's name.");
  const p = personByName(name);
  if (!p) {
    const want = norm(name);
    const like = peopleData().all.filter((x) => norm(x.name).includes(want)).slice(0, 5);
    throw new FactsError(`No person is named ${name}.${like.length ? ` Close: ${like.map((x) => x.name).join(", ")}.` : ""} Ask the player where they met them; don't search the web.`);
  }
  const r = p.read;
  const links = new Map(questsOf(p.name).map((q) => [q.name.toLowerCase(), `${origin}${q.href}`]));
  return {
    person: {
      name: p.name,
      ...(p.race ? { race: p.race } : {}),
      ...(p.sex ? { sex: p.sex } : {}),
      ...(p.inTown ? { town: p.inTown } : {}),
      link: `${origin}/people/${p.slug}`,
      ...(p.follower ? { follower: true } : {}),
      ...(p.marriage ? { canMarry: true } : {}),
      ...(p.essential ? { essential: true } : {}),
      ...(r
        ? {
            firstMeet: r.firstMeet,
            day: r.day,
            changes: r.changes,
            role: r.role,
            sells: r.sells,
            trains: r.trains,
            joins: r.joins,
            marries: r.marries,
            fightsWith: r.fightsWith,
            quests: r.quests.map((q) => ({ quest: q.quest, how: q.how, ...(links.get(q.quest.toLowerCase()) ? { link: links.get(q.quest.toLowerCase()) } : {}) })),
            canDie: r.canDie,
            notSure: notSureOf(r),
          }
        : {}),
    },
    howSure: r
      ? `Read from the game files and checked by a second reader.${r.reports ? ` ${playersWords(r.reports)}: ${(r.fromPlayers ?? []).join(", ")} come from ${r.reports === 1 ? "a player's report" : "player reports"}, not the game files.` : ""}`
      : "From the game files: race, where they are placed and their quests. Where they are through the day, what they offer and how they join you have not been read yet; say so, and don't guess.",
  };
}

/** get_quest_start, kept as an alias of get_quest for a release (WO-115). */
export function getQuestStart(id: string, version = DEFAULT_VERSION) {
  return getQuest({ id }, version);
}

/** A plan run through the planner's rules: its issues by level, where it stands at its last level, and the perks it can take there. */
export function checkPlan(d: GameData, plan: BuildPlan) {
  const { plan: parsed, states, issues } = issuesOf(d, plan);
  const last = states.length;
  return { gameVersion: parsed.gameVersion, levels: parsed.levels.length, issues, last: stateAt(d, states, last), canTakeNext: canTakeAt(d, states, last) };
}

/** check_progression (WO-110): a build in the plain shape get_build returns, not the editor's JSON. */
export function checkProgression(plain: PlainBuild) {
  const d = versionData(plain.gameVersion ?? DEFAULT_VERSION);
  return checkPlan(d, planFromPlain(d, plain));
}

const styles = new Map<boolean, string>();
/**
 * The planner's writing and layout rules for assistants (content/mcp/style.md), with How points work written in from the rules (WO-119),
 * never by hand. With playthroughs off (WO-182) the Playthroughs and Who she is sections go, with every line marked [runs]; the lines marked
 * [launch] take their place, and [[runs:this|launch:that]] says one word either way. Rule numbers stay as they are: a build rule may cite one, so none is renumbered.
 */
export function styleGuide(runs = playthroughsOn()): string {
  const cached = styles.get(runs);
  if (cached !== undefined) return cached;
  const raw = readFileSync(path.join(process.cwd(), "content", "mcp", "style.md"), "utf8").replace("{{how-points-work}}", howPointsWork());
  const out = raw
    .replace(/<!--runs-->\n([\s\S]*?)<!--\/runs-->\n?/g, (_, body: string) => (runs ? body : ""))
    .split("\n")
    .flatMap((l) => (l.startsWith("[runs] ") ? (runs ? [l.slice(7)] : []) : l.startsWith("[launch] ") ? (runs ? [] : [l.slice(9)]) : [l]))
    .join("\n")
    // Inline: [[runs:this|launch:that]] is this with playthroughs on and that with them off.
    .replace(/\[\[runs:([^|\]]*)\|launch:([^\]]*)\]\]/g, (_, on: string, off: string) => (runs ? on : off))
    .replace(/\n{3,}/g, "\n\n");
  styles.set(runs, out);
  return out;
}

/**
 * What LoreRim already lets a character do (WO-139 Part 4), so an assistant doesn't send a player to a mod for something the
 * list ships: Bob's bard test found no way to tell the player that performing is already in the game. Names as the guide
 * gives them; Callings is the one thing here that is not in LoreRim.
 */
export const ACTIVITIES = [
  { activity: "Playing an instrument and performing at inns", inLoreRim: true, by: "Skyrim's Got Talent", note: "The Acoustic Arcanist trait reads from it." },
  { activity: "Fishing", inLoreRim: true, by: "Fishing, a creation" },
  { activity: "Paragliding", inLoreRim: true, by: "the paraglider" },
  { activity: "Taming a wild horse", inLoreRim: true, by: "Simplest Horses" },
  { activity: "Camping", inLoreRim: true, by: "CC's Camping Expansion" },
  { activity: "Reading for experience as a scholar, and experience for role-play in general", inLoreRim: false, by: "Callings", note: "Not part of LoreRim; name it with set_details mods when the design needs it." },
] as const;

/** get_rules (WO-119): the numbers How points work says, for an assistant that hasn't read the style guide. */
export function getRules(version = DEFAULT_VERSION) {
  return { version, ...pointRules(versionData(version).rules), mounts: MOUNTS, homes: HOMES, homesNote: HOMES_NOTE, tomeTrials: TOME_TRIALS, activities: ACTIVITIES, source: "the planner's rules, as its checks count" };
}

/**
 * get_tree (WO-119): every perk in one skill's tree, each with its ranks, the skill each rank needs,
 * its prerequisite perks and what it rules out, by the skill it first needs, so an assistant can plan a
 * skill's perks in one call.
 */
export function getTree({ skill }: { skill: string }, version = DEFAULT_VERSION) {
  const d = versionData(version);
  const tree = [...d.perksByTree.keys()].find((t) => norm(t) === norm(skill));
  if (!tree) throw new FactsError(`No perk tree called ${skill}. The trees: ${[...d.perksByTree.keys()].join(", ")}.`);
  const perks = [...d.perksByTree.get(tree)!].sort((a, b) => (a.rankSkills?.[0] ?? a.skill ?? 0) - (b.rankSkills?.[0] ?? b.skill ?? 0));
  return {
    tree,
    perks: perks.map((p) => {
      const full = getPerk({ id: p.id }, version);
      return { id: full.id, name: full.name, ranks: full.ranks, needs: full.needs, rankDetails: full.rankDetails.map(({ rank, skill: s, level }) => ({ rank, ...(s ? { skill: s } : {}), ...(level ? { level } : {}) })), rulesOut: full.rulesOut, cost: full.cost };
    }),
    source: "game files",
  };
}

/** A game text with its highlight marks taken off: "<25%>" -> "25%". */
const plainText = (t: string) => t.replace(/<([^<>]*)>/g, "$1");

/**
 * get_creation (WO-122): everything character creation asks for, from the same data as Set up: the counts, every race
 * with its skills and powers, every birthsign, the gods each race is offered at the start, the two modes, every start
 * with its options, and every trait with its game text, whether the planner's numbers count it, and its choice.
 */
export function getCreation(version = DEFAULT_VERSION) {
  const d = versionData(version);
  const r = d.rules;
  const ability = (id: string) => d.abilityById.get(id)?.name ?? id;
  return {
    version,
    counts: {
      majors: { count: r.majorCount, bonus: r.majorBonus },
      minors: { count: r.minorCount, bonus: r.minorBonus },
      traits: { upTo: r.maxTraits },
      race: { primaryBonus: r.racePrimaryBonus, secondaryBonus: r.raceSecondaryBonus },
      perkPoints: { atStart: r.startingPerkPoints, naaktiid: r.naaktiidBonusPerkPoints },
    },
    races: d.races.map((x) => ({
      name: x.name,
      primary: x.primary,
      secondary: x.secondary,
      health: x.health,
      magicka: x.magicka,
      stamina: x.stamina,
      powers: (d.abilityFromRaces[x.name]?.powers ?? []).map(ability),
      passives: (d.abilityFromRaces[x.name]?.passives ?? []).map((p) => ({ name: p.name, text: plainText(p.text) })),
      godsAtTheStart: d.startingDeities[x.name] ?? [],
    })),
    birthsigns: d.birthsigns.map((b) => ({ name: b.name, text: plainText(b.text) })),
    modes: d.gameModes.map((m) => ({ name: m.name, text: plainText(m.text) })),
    starts: d.starts.map((s) => ({ name: s.name, source: s.source, text: plainText(s.text), ...(s.options.length ? { option: { label: s.optionLabel ?? "Choice", options: s.options } } : {}) })),
    traits: d.traits.map((t) => {
      const c = TRAIT_CHOICES[t.name];
      const choice = c ? { asks: c.question, options: c.options, send: "traitChoices" } : t.name === "Master of One" ? { asks: "Which skill?", options: d.skills, send: "masterOfOneSkill" } : null;
      return { name: t.name, text: plainText(t.text), plannerCountsIt: t.simulated, ...(choice ? { choice } : {}) };
    }),
    source: "game files, as the planner's Set up shows them",
  };
}

/** The six categories, for a tool's description. */
export const categoryNames = () => categories().map((c) => c.name);
