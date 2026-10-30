import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { mapStrings, mend, REASON_KEYS, SAID_NAMES } from "@/lib/pages/player-words";
import { currentVersion } from "@/lib/rules/server";
import { MAIN } from "./open";
import { currentPlayerFacts } from "./player-facts-store";
import { isPlaceholder } from "./placeholder";
import { overlayLines } from "./player-overlay";
import type { LineGate, QuestLine, QuestsFile } from "./types";

/**
 * quests.json for the current LoreRim version (WO-100), read once per server from disk, so it never
 * lands in a client bundle: pages send the browser only what each one shows.
 */
let cached: (QuestsFile & { byId: Map<string, QuestLine> }) | null = null;
let overlaid: { version: number; data: QuestsFile & { byId: Map<string, QuestLine> } } | null = null;

/**
 * The quest data with the approved player facts laid over it (WO-146 Part 3), when there are any: what every page and tool
 * reads. The facts are kept fresh by loadPlayerFacts, which the pages and the door call first.
 */
export function questsData() {
  const base = baseQuestsData();
  const { list, version } = currentPlayerFacts();
  if (!list.length) return base;
  if (overlaid?.version === version) return overlaid.data;
  const lines = overlayLines(base.lines, list);
  overlaid = { version, data: { ...base, lines, byId: new Map(lines.map((l) => [l.id, l])) } };
  return overlaid.data;
}

/**
 * A line's read says "the records set no level for it" when its opening has no level check; when the start check has found one, the page has
 * one answer (WO-160 Part 6): the clause goes and the level shows.
 */
const NO_LEVEL = /(?:[;,]\s*(?:and\s+)?|\s+and\s+)the records set no level(?: gate)?(?: for it)?(?=\.\s*$)/i;
const tidyRead = (l: QuestLine): QuestLine => (l.minLevel && l.read?.about && NO_LEVEL.test(l.read.about) ? { ...l, read: { ...l.read, about: l.read.about.replace(NO_LEVEL, "") } } : l);

/**
 * Missives (WO-183 Part 4): the board's one sentence says "each is a short delivery", which is true of the deliveries only, so a job that kills, gathers
 * or finds something doesn't say it; and Solstheim has no jarl, so the rieklings job doesn't send you to one for the bounty.
 */
const DELIVERY = /;\s*each is a short delivery(?=\.?\s*$)/i;
const isDelivery = (name: string) => /^Deliver\b/i.test(name);
function tidyMissives(l: QuestLine): QuestLine {
  if (l.id !== "missives") return l;
  const drop = (a: string[] | undefined, jarl: boolean) => (a && jarl ? a.filter((x) => !/bounty from the jarl/i.test(x)) : a);
  return {
    ...l,
    ...(l.board ? { board: { ...l.board, says: l.board.says.replace(DELIVERY, "") } } : {}),
    quests: l.quests.map((q) => {
      const jarl = /rieklings/i.test(q.name);
      const ways = q.start?.ways?.map((w) => (isDelivery(q.name) ? w : { ...w, how: w.how.replace(DELIVERY, "") }));
      return {
        ...q,
        ...(q.start && ways ? { start: { ...q.start, ways } } : {}),
        ...(jarl ? { objectives: drop(q.objectives, true), read: q.read ? { ...q.read, steps: q.read.steps?.map((s) => ({ ...s, objectives: drop(s.objectives, true) ?? [] })) } : q.read } : {}),
      };
    }),
  };
}

function baseQuestsData() {
  if (cached) return cached;
  const file = path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "quests.json");
  let data: QuestsFile = { categories: {}, shelves: {}, lines: [] };
  try {
    data = JSON.parse(readFileSync(file, "utf8")) as QuestsFile;
    // The reads' assembled wording ("in her own house, Bryling's House") is said once, here (WO-177 Part 5).
    data = { ...data, lines: mapStrings(data.lines, mend, REASON_KEYS) };
  } catch {
    // Not built yet.
  }
  // Placeholder objectives are hidden here (WO-147 Part 2), so no page and no tool ever reads one.
  const SAID = SAID_NAMES;
  data = { ...data, lines: data.lines.map((l) => (l.quests.some((q) => SAID[q.name]) ? { ...l, quests: l.quests.map((q) => (SAID[q.name] ? { ...q, name: SAID[q.name] } : q)) } : l)) };
  const lines = data.lines.map((l) => (l.quests.some((q) => q.objectives?.some(isPlaceholder)) ? { ...l, quests: l.quests.map((q) => (q.objectives?.some(isPlaceholder) ? { ...q, objectives: q.objectives.filter((o) => !isPlaceholder(o)) } : q)) } : l));
  const tidied = lines.map(tidyRead).map(tidyMissives);
  cached = { ...data, lines: tidied, byId: new Map(tidied.map((l) => [l.id, l])) };
  return cached;
}

/** A category's URL word: "Daedric Princes" -> daedric-princes (the scene's and icon's name too). */
export const categorySlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** The six categories in their order, each with its slug and key. */
export function categories() {
  return Object.entries(questsData().categories).map(([key, c]) => ({ key, slug: categorySlug(c.name), ...c }));
}

/** The lines a category holds: those it's home to and those `also` in it. */
export function linesIn(key: string): QuestLine[] {
  return questsData().lines.filter((l) => l.category === key || l.also.includes(key));
}

export const gateOf = (l: QuestLine): LineGate => ({ id: l.id, minLevel: l.minLevel, after: l.after, mainQuestAt: l.mainQuestAt });

/** The main quest's own quests in order, Unbound to Dragonslayer: the "done up to" choices. */
export function mainOrder(): { edid: string; name: string }[] {
  const main = questsData().byId.get(MAIN);
  return (main?.quests ?? []).filter((q) => /^MQ\d/.test(q.edid)).map((q) => ({ edid: q.edid, name: q.name }));
}

/** The lines other lines wait for (all but the main quest): the Finished chips. */
export function finishable(): { id: string; name: string }[] {
  const { lines, byId } = questsData();
  const ids: string[] = [];
  for (const l of lines) for (const a of l.after) if (a !== MAIN && !ids.includes(a)) ids.push(a);
  return ids.map((id) => ({ id, name: byId.get(id)?.name ?? id }));
}

/** A category's name by key, the home or a shelf. */
/**
 * The expansion a line is from, when every quest in it is (the line's sources say "Base game" for Dawnguard and Dragonborn, and a quest's page
 * says the expansion): one name for one thing everywhere (WO-177).
 */
export function dlcOf(line: QuestLine): string | null {
  const first = line.quests[0]?.mod?.name;
  return first && ["Dawnguard", "Dragonborn", "Hearthfires"].includes(first) && line.quests.every((q) => q.mod?.name === first) ? first : null;
}

export function homeName(key: string): string {
  const { categories: c, shelves } = questsData();
  return c[key]?.name ?? shelves[key]?.name ?? key;
}

/** Search: lines whose name, quests' names or journals have every word, best first. */
export function searchLines(query: string, limit = 30): { line: QuestLine; hit: string }[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const has = (t: string) => {
    const s = t.toLowerCase();
    return words.every((w) => s.includes(w));
  };
  const out: { line: QuestLine; hit: string; rank: number }[] = [];
  for (const line of questsData().lines) {
    if (has(line.name)) {
      out.push({ line, hit: "", rank: 0 });
      continue;
    }
    const q = line.quests.find((q) => has(q.name));
    if (q) {
      out.push({ line, hit: q.name, rank: 1 });
      continue;
    }
    const j = line.quests.flatMap((q) => q.journal.map((t) => ({ q, t }))).find(({ t }) => has(t));
    if (j) out.push({ line, hit: j.q.name, rank: 2 });
  }
  return out.sort((a, b) => a.rank - b.rank || a.line.name.localeCompare(b.line.name)).slice(0, limit);
}
