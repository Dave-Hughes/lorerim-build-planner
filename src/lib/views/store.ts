import "server-only";
import { lt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { pageNamed } from "@/lib/pages/page-named";

/** Page views per day (WO-184 Part 3): one row per page per day, counted on the server, kept 90 days. No cookie, address or account. */
export async function countView(kind: "quest" | "person" | "place", key: string): Promise<void> {
  if (!pageNamed(kind, key)) return;
  const day = new Date().toISOString().slice(0, 10);
  try {
    await db()
      .insert(schema.pageViews)
      .values({ kind, key, day, n: 1 })
      .onConflictDoUpdate({ target: [schema.pageViews.kind, schema.pageViews.key, schema.pageViews.day], set: { n: sql`${schema.pageViews.n} + 1` } });
    // Old days go as new ones come, a few at a time.
    if (Math.random() < 0.02) await db().delete(schema.pageViews).where(lt(schema.pageViews.day, new Date(Date.now() - 90 * 86_400_000).toISOString().slice(0, 10)));
  } catch {
    // The table isn't there yet on this database, or it is busy: a missed look is no harm.
  }
}

/** Looks at each page in the last seven days, by "kind:key". */
export async function weekViews(): Promise<Map<string, number>> {
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
  try {
    const rows = await db()
      .select({ kind: schema.pageViews.kind, key: schema.pageViews.key, n: sql<number>`sum(${schema.pageViews.n})::int` })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.day} >= ${since}`)
      .groupBy(schema.pageViews.kind, schema.pageViews.key);
    return new Map(rows.map((r) => [`${r.kind}:${r.key}`, r.n]));
  } catch {
    return new Map();
  }
}
