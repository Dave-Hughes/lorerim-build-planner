import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { perkText, rankCount, type GameData, type Perk } from "@/lib/rules/data";
import type { BuildPlan } from "@/lib/rules/types";
import { currentVersion } from "@/lib/rules/versions";
import { categories, homeName, questsData } from "@/lib/quests/data";
import { storyById, storyOfLine } from "@/lib/quests/stories-data";
import { storyOrder } from "@/lib/quests/story";

/**
 * The planner's facts for assistants (WO-108): read-only answers from src/data/lorerim-<version>/,
 * never from anything else. Each function returns plain JSON for the MCP route to send.
 */

export { DEFAULT_VERSION, FactsError, versionData } from "./errors";
import { DEFAULT_VERSION, FactsError, versionData } from "./errors";
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
export const FACT_KINDS = ["perk", "spell", "trait", "race", "birthsign", "deity", "quest line", "story"] as const;
export type FactKind = (typeof FACT_KINDS)[number];

export interface Hit {
  kind: FactKind;
  id: string;
  name: string;
  line: string;
}

const firstSentence = (t: string) => (t.replace(/<([^>]*)>/g, "$1").match(/^.*?[.!?](\s|$)/)?.[0] ?? t).trim().slice(0, 200);

/** Perks, spells, traits, races, birthsigns, deities, quest lines and stories by name or word: 20 at most. */
export function searchFacts(query: string, kinds: FactKind[] = [...FACT_KINDS], version = DEFAULT_VERSION, limit = 20): { hits: Hit[]; more: number } {
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
    if (want.has("quest line")) for (const l of lines) all.push({ kind: "quest line", id: l.id, name: l.name, line: [homeName(l.category), l.where, l.prince].filter(Boolean).join(" | "), text: l.quests.map((q) => q.name).join(" ") });
    if (want.has("story")) for (const l of lines) {
      const s = storyOfLine(l.id);
      if (s) all.push({ kind: "story", id: s.id, name: s.name, line: firstSentence(s.pitch), text: s.pitch });
    }
  }
  const has = (t: string) => words.every((w) => norm(t).includes(w));
  const ranked = all
    .map((h) => ({ h, rank: norm(h.name) === norm(query) ? 0 : has(h.name) ? 1 : has(`${h.name} ${h.line} ${h.text}`) ? 2 : -1 }))
    .filter((x) => x.rank >= 0)
    .sort((a, b) => a.rank - b.rank || a.h.name.length - b.h.name.length || a.h.name.localeCompare(b.h.name));
  return { hits: ranked.slice(0, limit).map(({ h }) => ({ kind: h.kind, id: h.id, name: h.name, line: h.line })), more: Math.max(0, ranked.length - limit) };
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
export function getQuestStart(id: string, version = DEFAULT_VERSION) {
  const { byId } = questsFor(version);
  const story = storyById(id) ?? storyOfLine(id);
  const line = byId.get(story?.line ?? id);
  if (!line) throw new FactsError(`No quest line or story with the id ${id}. search_facts finds them by name.`);
  const category = homeName(line.category);
  if (!story)
    return {
      kind: "quest line" as const,
      id: line.id,
      name: line.name,
      category,
      checked: "not yet",
      note: "This line's start hasn't passed the planner's start check, so no instructions are given. Say it isn't checked yet rather than filling the gap.",
    };
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
    firstQuest: { name: first.name, ...(first.who ? { who: first.who } : {}), ...(first.where ? { where: first.where } : {}), ...(first.task ? { task: first.task } : {}), checked: first.checked },
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

let style: string | null = null;
/** The planner's writing and layout rules for assistants (content/mcp/style.md). */
export function styleGuide(): string {
  if (style === null) style = readFileSync(path.join(process.cwd(), "content", "mcp", "style.md"), "utf8");
  return style;
}

/** The six categories, for a tool's description. */
export const categoryNames = () => categories().map((c) => c.name);
