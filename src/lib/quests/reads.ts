import "server-only";
import { placeByName, rangeOf, hasLevels, type Place } from "@/lib/places/data";
import { GOLD, RUN_CHANGE } from "./run-change";
import { questHref } from "./slugs";
import { questsData } from "./data";
import { doorSources, pageSources } from "./player-source";
import { checkedLabel } from "./story";
import type { Quest, QuestRead } from "./types";

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
  /** Section 10: one line. */
  sure: string;
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
/** A quest the planner has by its name, as a link; nothing when two share the name or none has it. */
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
  const edid = byName.get(text.trim().toLowerCase());
  const href = edid ? questHref(edid) : null;
  return href ? { text, href } : { text };
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

/**
 * How dangerous a place is, in the places index's words: "bandits from level 6; the boss Chief Yamarz, level 45". Nothing for a place the
 * index doesn't know, one whose people aren't hostile, or one with no levels checked: never a made-up one.
 */
export function dangerOf(place: Place | null | undefined): string | undefined {
  const a = place?.actors;
  if (!place || !a || a.hostile === false || !hasLevels(a)) return undefined;
  const [lo, hi] = rangeOf(a);
  const who = a.livesHere ? (PLURAL[a.livesHere] ?? a.livesHere.toLowerCase()) : "enemies";
  const boss = a.boss ? `; the boss ${[a.boss.name, a.boss.level].filter(Boolean).join(", ")}` : "";
  return `${who} from level ${lo}${hi > lo ? `, up to ${hi}` : ""}${boss}`;
}

function placeNamed(name: string): Place | null {
  const cleaned = name.replace(/^the /i, "").trim();
  return placeByName(name) ?? placeByName(cleaned);
}

/** The ways a player found in game (WO-131, WO-146), which override what the records place (Dave's in-game checks win). */
const playerWays = (q: Quest) => (q.start?.ways ?? []).filter((w) => w.checked === "players");

function viaReads(q: Quest, r: QuestRead): QuestPage {
  const players = playerWays(q);
  const said = new Set(players.map((w) => w.who).filter(Boolean));
  const starts = [
    ...players.map((w) => ({ how: w.how, ...(w.who ? { who: w.who } : {}), ...(w.where ? { where: w.where } : {}), reportedBy: { source: w.source ?? "", ...(w.also?.length ? { also: w.also } : {}) }, ...(w.whereIs?.length ? { whereIs: w.whereIs } : {}), ...(w.unplaced ? { unplaced: w.unplaced } : {}) })),
    ...(r.starts ?? []).filter((s) => !(s.who && said.has(s.who))).map((s) => ({ how: s.how ?? "", ...(s.who ? { who: s.who } : {}), ...(s.where ? { where: s.where } : {}) })),
  ].filter((s) => s.how || s.who);
  const unsure = (r.unsure ?? []).filter((u) => u.field);
  const fields = [...new Set(unsure.map((u) => u.field))].join(", ");
  const sure = players.length
    ? `Checked in game by a player: ${pageSources(players[0].source ?? "", players[0].also)}${unsure.length ? `. Unsure: ${fields}` : ""}`
    : `Read from the game files and checked by a second reader${unsure.length ? `. Unsure: ${fields}` : ""}`;
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
      const danger = dangerOf(placeNamed(t.place));
      return { place: t.place, ...(t.hold ? { hold: t.hold } : {}), ...(t.why ? { why: t.why } : {}), ...(danger ? { danger } : {}) };
    }),
    choices: r.choices ?? [],
    gets: { xp: q.xp, ...(q.type ? { type: q.type } : {}), rewards: r.rewards ?? [] },
    opens: (r.opens ?? []).map(linkFor),
    closes: r.closes ?? [],
    steps: (r.steps ?? []).map((s) => ({ ...(s.branch && s.branch !== "main" ? { branch: s.branch } : {}), objectives: s.objectives ?? [] })).filter((s) => s.objectives.length),
    sure,
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
    sure: `Not read yet: this page is from the planner's older rules, and ${st && st.checked !== "not yet" ? `its start is checked (${checkedLabel(st.checked, st.source)})` : "its start isn't checked yet"}`,
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
  const starts = p.starts.map((s) => ({ how: s.how, ...(s.who ? { who: s.who } : {}), ...(s.where ? { where: s.where } : {}), ...(s.reportedBy ? { checked: doorSources(s.reportedBy.source, s.reportedBy.also) } : {}) }));
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
    howSure: p.sure,
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
