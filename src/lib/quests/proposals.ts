import "server-only";
import { and, asc, eq, isNull, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Proposal } from "./player-types";
import { ProposeError, proposeOne, type Complete, anthropic } from "./propose";

/** Proposing for stored reports (WO-146 Part 2): read the report, ask once, keep the proposal on the report. Nothing reaches the pages. */

/** The most a batch proposes at once, each one call. */
export const BATCH_MAX = 10;

/** One report's proposal, stored on it (replacing an earlier one); the report itself is not changed. */
export async function proposeReport(id: number, complete: Complete = anthropic): Promise<Proposal> {
  const [r] = await db().select().from(schema.questReports).where(eq(schema.questReports.id, id)).limit(1);
  if (!r) throw new ProposeError("No such report.");
  const proposal = await proposeOne({ kind: r.kind, what: r.what, text: r.text, said: r.said, fields: r.fields ?? null, lineId: r.lineId, quest: r.quest }, complete, r.id);
  await db().update(schema.questReports).set({ proposal }).where(eq(schema.questReports.id, id));
  return proposal;
}

/**
 * The batch step an admin can run (WO-146 Part 2's propose_quest_fact): every new report with no proposal yet, oldest first,
 * BATCH_MAX at a time, one call each. A report that fails keeps no proposal and says why; the rest go on.
 */
export async function proposeNewReports(complete: Complete = anthropic): Promise<{ id: number; ok: boolean; message: string }[]> {
  const rows = await db()
    .select({ id: schema.questReports.id })
    .from(schema.questReports)
    .where(and(eq(schema.questReports.status, "new"), isNull(schema.questReports.proposal), ne(schema.questReports.kind, "wrong")))
    .orderBy(asc(schema.questReports.createdAt))
    .limit(BATCH_MAX);
  const out: { id: number; ok: boolean; message: string }[] = [];
  for (const { id } of rows) {
    try {
      const p = await proposeReport(id, complete);
      out.push({ id, ok: true, message: p.words });
    } catch (e) {
      out.push({ id, ok: false, message: e instanceof ProposeError ? e.message : "The call failed." });
    }
  }
  return out;
}
