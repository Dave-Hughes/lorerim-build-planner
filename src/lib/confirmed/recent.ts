import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { pageNamed } from "@/lib/pages/page-named";

/**
 * Recently confirmed by players (WO-184 Part 4, board HomeConfirmed): the latest confirmations and the player facts an admin approved, one card per page with the
 * newest winning. A page the planner no longer has is left out.
 */
export interface Confirmed {
  kind: "quest" | "person" | "place";
  what: string;
  name: string;
  href: string;
  by: string;
  image: string | null;
  at: Date;
  /** `confirmed` (a player's word the page is right) or `told` (a fact an admin approved). */
  how: "confirmed" | "told";
}

export async function recentlyConfirmed(limit = 8): Promise<Confirmed[]> {
  try {
    const [confirmations, tips, facts] = await Promise.all([
      db()
        .select({ kind: schema.pageConfirmations.kind, key: schema.pageConfirmations.key, at: schema.pageConfirmations.createdAt, by: schema.users.name, image: schema.users.image })
        .from(schema.pageConfirmations)
        .innerJoin(schema.users, eq(schema.users.id, schema.pageConfirmations.userId))
        .orderBy(desc(schema.pageConfirmations.createdAt))
        .limit(40),
      db()
        .select({ kind: schema.pageTips.kind, key: schema.pageTips.key, at: schema.pageTips.decidedAt, by: schema.users.name, image: schema.users.image })
        .from(schema.pageTips)
        .innerJoin(schema.users, eq(schema.users.id, schema.pageTips.userId))
        .where(eq(schema.pageTips.status, "approved"))
        .orderBy(desc(schema.pageTips.decidedAt))
        .limit(40),
      db()
        .select({ key: schema.questPlayerFacts.quest, at: schema.questPlayerFacts.createdAt, by: schema.users.name, image: schema.users.image })
        .from(schema.questPlayerFacts)
        .innerJoin(schema.users, eq(schema.users.id, schema.questPlayerFacts.userId))
        .orderBy(desc(schema.questPlayerFacts.createdAt))
        .limit(40),
    ]);
    const all = [
      ...confirmations.map((c) => ({ ...c, how: "confirmed" as const })),
      ...tips.flatMap((t) => (t.at ? [{ ...t, at: t.at, how: "told" as const }] : [])),
      ...facts.map((f) => ({ kind: "quest" as const, ...f, how: "told" as const })),
    ].sort((a, b) => b.at.getTime() - a.at.getTime());
    const seen = new Set<string>();
    const out: Confirmed[] = [];
    for (const c of all) {
      const id = `${c.kind}:${c.key}`;
      if (seen.has(id)) continue;
      const page = pageNamed(c.kind, c.key);
      if (!page) continue;
      seen.add(id);
      out.push({ kind: c.kind, what: page.what, name: page.name, href: page.href, by: c.by ?? "A player", image: c.image, at: c.at, how: c.how });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    // The tables aren't on this database yet: nothing to show.
    return [];
  }
}

/** "2 hours ago", "yesterday", "3 days ago", else the day. */
export function ago(at: Date, now = new Date()): string {
  const s = Math.max(0, Math.round((now.getTime() - at.getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} ${m === 1 ? "minute" : "minutes"} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ${h === 1 ? "hour" : "hours"} ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "yesterday";
  if (d < 14) return `${d} days ago`;
  return at.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}
