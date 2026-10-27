import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { questsData } from "@/lib/quests/data";
import { questHref } from "@/lib/quests/slugs";
import { currentVersion } from "@/lib/rules/server";

/**
 * What changed in the world (WO-157): the home page's "New in the world". A quest's ways or read and a line's read come from changes.json,
 * which scripts/gamedata/build.py dates by when each read was committed; a player's report an admin approved comes from the database.
 * Nothing here is written by hand, and an entry whose quest or line the pages no longer have is left out.
 */
export interface Change {
  kind: "quest" | "line" | "report";
  icon: string;
  name: string;
  href: string;
  what: string;
  /** YYYY-MM-DD. */
  date: string;
}

interface Generated {
  kind: "quest" | "line";
  edid?: string;
  id?: string;
  ways?: number;
  date: string;
}

let file: Generated[] | null = null;
function generated(): Generated[] {
  if (file) return file;
  try {
    file = (JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", `lorerim-${currentVersion().id}`, "changes.json"), "utf8")) as { changes: Generated[] }).changes;
  } catch {
    file = [];
  }
  return file;
}

const dayOf = (d: Date) => d.toISOString().slice(0, 10);

/** Every change, newest first. */
export async function allChanges(): Promise<Change[]> {
  const data = questsData();
  const quests = new Map(data.lines.flatMap((l) => l.quests.map((q) => [q.edid, q] as const)));
  const out: Change[] = [];
  for (const g of generated()) {
    if (g.kind === "line") {
      const line = g.id ? data.byId.get(g.id) : undefined;
      if (line) out.push({ kind: "line", icon: "quest-side-stories", name: line.name, href: `/quests/${line.id}`, what: "The whole line, read from the game files", date: g.date });
      continue;
    }
    const q = g.edid ? quests.get(g.edid) : undefined;
    const href = g.edid ? questHref(g.edid) : null;
    if (!q?.name || !href) continue;
    out.push({ kind: "quest", icon: "quest-side-stories", name: q.name, href, what: (g.ways ?? 0) > 1 ? `${g.ways} ways to finish it, each with its steps` : "Its steps, read from the game files", date: g.date });
  }
  // A player's report an admin approved: the quest it is about, the day it was approved.
  const facts = await db()
    .select({ quest: schema.questPlayerFacts.quest, at: schema.questPlayerFacts.createdAt })
    .from(schema.questPlayerFacts)
    .orderBy(desc(schema.questPlayerFacts.createdAt))
    .limit(40)
    .catch(() => []);
  for (const f of facts) {
    const q = quests.get(f.quest);
    const href = questHref(f.quest);
    if (q?.name && href) out.push({ kind: "report", icon: "quest-sure", name: q.name, href, what: "A player's report, approved", date: dayOf(f.at) });
  }
  return out.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
}

/**
 * The few for the home page: the newest of each kind first (a quest, a line, a report), then the next newest, shown newest first, so one
 * day's hundred quests don't fill the list.
 */
export async function recentChanges(limit = 6): Promise<Change[]> {
  const all = await allChanges();
  const picked: Change[] = [];
  for (const kind of ["quest", "line", "report"] as const) {
    const first = all.find((c) => c.kind === kind);
    if (first) picked.push(first);
  }
  for (const c of all) {
    if (picked.length >= limit) break;
    if (!picked.includes(c)) picked.push(c);
  }
  return picked.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
}
