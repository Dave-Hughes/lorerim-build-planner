import "server-only";
import { questsData } from "./data";
import type { Quest, QuestLine } from "./types";

/**
 * A page for every quest (WO-147 Part 1): /quests/q/<slug>, the slug from the quest's name. Quests that share a name (WO-174 Part 1: an address is
 * never an editor id) tell themselves apart by their town when each has its own, else by the word in which their editor ids differ
 * (Prophet: hunter, vampire; Contract: Kill the target: Markarth, Windhelm), and the one left over keeps the bare name. Computed once from the
 * quests' names, towns and EDIDs, which no player fact changes; the quests themselves are read from questsData each time, so an approved fact shows
 * on the page. An address made from the EDID before WO-174 still finds its quest (legacyQuestHref), for the page to redirect.
 */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Entry = { lineId: string; edid: string; name: string; town: string | null };
let built: { byEdid: Map<string, string>; bySlug: Map<string, { lineId: string; edid: string }>; legacy: Map<string, string> } | null = null;

/** What a group of EDIDs does not share: each one with its common start and end cut off, as words. "Contract, Markarth" and "…Windhelm" give markarth and windhelm. */
function tails(edids: string[]): Map<string, string> {
  let pre = edids[0];
  let suf = edids[0];
  for (const e of edids) {
    while (!e.startsWith(pre)) pre = pre.slice(0, -1);
    while (!e.endsWith(suf)) suf = suf.slice(1);
  }
  // Cut at a word's edge, never in the middle of one (Eastmarch, Falkreath share a final h).
  const edge = (e: string, i: number) => i <= 0 || i >= e.length || /[A-Z]/.test(e[i]) || /[^A-Za-z]/.test(e[i]) || /[^A-Za-z]/.test(e[i - 1]);
  while (pre && !edge(edids[0], pre.length)) pre = pre.slice(0, -1);
  while (suf && !edge(edids[0], edids[0].length - suf.length)) suf = suf.slice(1);
  return new Map(
    edids.map((e) => {
      const mid = e.slice(pre.length, Math.max(pre.length, e.length - suf.length));
      return [e, slugify(mid.replace(/([a-z])([A-Z])/g, "$1 $2"))];
    }),
  );
}

function build() {
  if (built) return built;
  const all: Entry[] = questsData().lines.flatMap((l) => l.quests.map((q) => ({ lineId: l.id, edid: q.edid, name: slugify(q.name ?? ""), town: q.start?.towns?.length === 1 ? slugify(q.start.towns[0]) : null })));
  const byEdid = new Map<string, string>();
  const bySlug = new Map<string, { lineId: string; edid: string }>();
  const edids = new Set(all.map((q) => slugify(q.edid)));
  const take = (q: Entry, want: string) => {
    let slug = want;
    // A name that is some quest's editor id, or already taken, takes its line, then a number, so no address is an editor id.
    if (edids.has(slug) || bySlug.has(slug)) slug = `${want}-${slugify(q.lineId)}`;
    for (let n = 2; edids.has(slug) || bySlug.has(slug); n++) slug = `${want}-${n}`;
    byEdid.set(q.edid, slug);
    bySlug.set(slug, { lineId: q.lineId, edid: q.edid });
  };
  const groups = new Map<string, Entry[]>();
  for (const q of all) groups.set(q.name || slugify(q.edid), [...(groups.get(q.name || slugify(q.edid)) ?? []), q]);
  for (const [name, group] of groups) {
    if (group.length === 1) {
      take(group[0], group[0].name ? name : `quest-${name}`);
      continue;
    }
    // Its own town, when that is only its own in the group.
    const townCount = new Map<string, number>();
    for (const q of group) if (q.town) townCount.set(q.town, (townCount.get(q.town) ?? 0) + 1);
    const rest: Entry[] = [];
    for (const q of group) {
      if (q.town && townCount.get(q.town) === 1) take(q, `${name}-${q.town}`);
      else rest.push(q);
    }
    if (rest.length === 1) take(rest[0], name);
    else if (rest.length > 1) {
      const t = tails(rest.map((q) => q.edid));
      // The word they differ in when there is one; when the editor ids share nothing (zzzAomBountyVampire, BQ03Haafingar) a number, never the whole id.
      const word = (q: Entry) => {
        const w = t.get(q.edid) ?? "";
        return w && w.length <= 16 && w !== slugify(q.edid) ? w : null;
      };
      rest.forEach((q, i) => take(q, word(q) ? `${name}-${word(q)}` : i === 0 ? name : `${name}-${i + 1}`));
    }
  }
  // The addresses WO-147 made: the name when alone, else the EDID.
  const legacy = new Map<string, string>();
  const count = new Map<string, number>();
  for (const q of all) count.set(q.name, (count.get(q.name) ?? 0) + 1);
  for (const q of all) {
    let slug = q.name && count.get(q.name) === 1 && !edids.has(q.name) ? q.name : slugify(q.edid);
    if (legacy.has(slug)) slug = `${slug}-${slugify(q.lineId)}`;
    legacy.set(slug, q.edid);
  }
  built = { byEdid, bySlug, legacy };
  return built;
}

/** The quest's page address, or null for a quest the planner doesn't know. */
export const questHref = (edid: string): string | null => {
  const slug = build().byEdid.get(edid);
  return slug ? `/quests/q/${slug}` : null;
};

/** The page address for an address made before WO-174 (from a name, or an editor id), when it is not the quest's address now. */
export function legacyQuestHref(slug: string): string | null {
  const edid = build().legacy.get(slug);
  const href = edid ? questHref(edid) : null;
  return href && href !== `/quests/q/${slug}` ? href : null;
}

/** The quest a slug names, with its line, as the data is now. */
export function questBySlug(slug: string): { line: QuestLine; quest: Quest } | null {
  const hit = build().bySlug.get(slug);
  if (!hit) return null;
  const line = questsData().byId.get(hit.lineId);
  const quest = line?.quests.find((q) => q.edid === hit.edid);
  return line && quest ? { line, quest } : null;
}
