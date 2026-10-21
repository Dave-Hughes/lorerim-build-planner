import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { readPlan } from "@/lib/rules/convert";
import { REVISIONS_KEPT } from "./writes";
import { planChanges, savedByWords } from "./revisions";

/** A build's saves for /admin (WO-122), newest first: when, who, and what changed from the save before. Null when there's no such build. */
export async function buildHistory(buildId: string) {
  const [build] = await db().select({ id: schema.builds.id, name: schema.builds.name }).from(schema.builds).where(eq(schema.builds.id, buildId.slice(0, 40))).limit(1);
  if (!build) return null;
  const rows = await db()
    .select({ id: schema.buildRevisions.id, at: schema.buildRevisions.at, by: schema.buildRevisions.by, client: schema.buildRevisions.client, plan: schema.buildRevisions.plan })
    .from(schema.buildRevisions)
    .where(eq(schema.buildRevisions.buildId, build.id))
    .orderBy(desc(schema.buildRevisions.id))
    .limit(REVISIONS_KEPT);
  const saves = rows.map((r, i) => {
    const before = rows[i + 1];
    return { id: r.id, at: r.at, who: savedByWords(r.by, r.client), changes: before ? planChanges(readPlan(before.plan), readPlan(r.plan)) : null };
  });
  return { build, saves };
}
