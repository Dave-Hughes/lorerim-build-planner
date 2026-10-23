import "server-only";
import { questsData } from "./data";
import type { Quest, QuestLine } from "./types";

/**
 * A page for every quest (WO-147 Part 1): /quests/q/<slug>, the slug from the quest's name, from its EDID when two quests
 * share a name (or it has none). Computed once from the quests' names and EDIDs, which no player fact changes; the
 * quests themselves are read from questsData each time, so an approved fact shows on the page.
 */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

let built: { byEdid: Map<string, string>; bySlug: Map<string, { lineId: string; edid: string }> } | null = null;

function build() {
  if (built) return built;
  const all = questsData().lines.flatMap((l) => l.quests.map((q) => ({ lineId: l.id, edid: q.edid, name: slugify(q.name ?? "") })));
  const count = new Map<string, number>();
  for (const q of all) count.set(q.name, (count.get(q.name) ?? 0) + 1);
  const byEdid = new Map<string, string>();
  const bySlug = new Map<string, { lineId: string; edid: string }>();
  // Alone with its name: the name. Sharing it, or nameless: the EDID, which is unique; and a name that is another's EDID loses to it.
  const edids = new Set(all.map((q) => slugify(q.edid)));
  for (const q of all) {
    let slug = q.name && count.get(q.name) === 1 && !edids.has(q.name) ? q.name : slugify(q.edid);
    if (bySlug.has(slug)) slug = `${slug}-${slugify(q.lineId)}`;
    byEdid.set(q.edid, slug);
    bySlug.set(slug, { lineId: q.lineId, edid: q.edid });
  }
  built = { byEdid, bySlug };
  return built;
}

/** The quest's page address, or null for a quest the planner doesn't know. */
export const questHref = (edid: string): string | null => {
  const slug = build().byEdid.get(edid);
  return slug ? `/quests/q/${slug}` : null;
};

/** The quest a slug names, with its line, as the data is now. */
export function questBySlug(slug: string): { line: QuestLine; quest: Quest } | null {
  const hit = build().bySlug.get(slug);
  if (!hit) return null;
  const line = questsData().byId.get(hit.lineId);
  const quest = line?.quests.find((q) => q.edid === hit.edid);
  return line && quest ? { line, quest } : null;
}
