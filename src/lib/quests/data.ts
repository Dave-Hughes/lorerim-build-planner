import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { currentVersion } from "@/lib/rules/server";
import { MAIN } from "./open";
import type { LineGate, QuestLine, QuestsFile } from "./types";

/**
 * quests.json for the current LoreRim version (WO-100), read once per server from disk, so it never
 * lands in a client bundle: pages send the browser only what each one shows.
 */
let cached: (QuestsFile & { byId: Map<string, QuestLine> }) | null = null;

export function questsData() {
  if (cached) return cached;
  const file = path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "quests.json");
  let data: QuestsFile = { categories: {}, shelves: {}, lines: [] };
  try {
    data = JSON.parse(readFileSync(file, "utf8")) as QuestsFile;
  } catch {
    // Not built yet.
  }
  cached = { ...data, byId: new Map(data.lines.map((l) => [l.id, l])) };
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
