import "server-only";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { questsData } from "./data";
import { loadPlayerFacts } from "./player-facts";
import type { Decision, PlayerWay } from "./player-types";

/**
 * A person approves (WO-146 Part 3): from a report and its proposal, an admin writes the player fact the pages and get_quest
 * show as a player's report, not the game files, or says it is not a problem. The agent never writes a fact; this does, and only
 * an admin reaches it.
 */

export class ApprovalError extends Error {}

/** "23 Oct 2026". */
const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** The way as an admin may edit it before approving. */
export const wayInput = z.object({
  how: z.string().trim().min(1, "Say how it starts.").max(400),
  who: z.string().trim().max(120).optional(),
  where: z.string().trim().max(200).optional(),
  whereIs: z.array(z.string().trim().min(1).max(200)).max(4).optional(),
  replaces: z.string().trim().max(400).nullable().optional(),
});
export type ApprovedWay = z.infer<typeof wayInput>;

/** The source line the pages show: "@handle, 23 Oct 2026", or the player's name when they have no handle. */
export const sourceOf = (who: { handle: string | null; name: string | null }, at: Date) => `${who.handle ? `@${who.handle}` : (who.name ?? "a player")}, ${day(at)}`;

/**
 * Approve a report: its proposal's way as it stands, or the admin's edit. Writes one quest_player_fact, marks the report fixed with
 * the decision, and loads the facts again at once so this server shows it now (others within a minute).
 */
export async function approveReport(id: number, adminId: string, edit?: ApprovedWay): Promise<{ fact: number }> {
  const [r] = await db()
    .select({ r: schema.questReports, handle: schema.users.handle, name: schema.users.name })
    .from(schema.questReports)
    .innerJoin(schema.users, eq(schema.users.id, schema.questReports.userId))
    .where(eq(schema.questReports.id, id))
    .limit(1);
  if (!r) throw new ApprovalError("No such report.");
  if (r.r.decision) throw new ApprovalError("That report has been decided already.");
  if (!r.r.quest) throw new ApprovalError("The report names no quest, so there is nothing to put on a page.");
  const proposed = r.r.proposal?.way ? { ...r.r.proposal.way, replaces: r.r.proposal.replaces } : null;
  const chosen = edit ?? proposed;
  if (!chosen) throw new ApprovalError("There is no way to approve: propose one first, or write it in Edit and approve.");
  const parsed = wayInput.safeParse(chosen);
  if (!parsed.success) throw new ApprovalError(parsed.error.issues[0]?.message ?? "Check the way.");
  const { replaces, ...way } = parsed.data;
  const line = questsData().byId.get(r.r.lineId);
  const quest = line?.quests.find((q) => q.edid === r.r.quest);
  if (!line || !quest) throw new ApprovalError("That quest isn't in the planner's data any more.");
  // A way it replaces must be one the quest has (by its page words), else it is a new way.
  const base = quest.start?.ways ?? [];
  if (replaces && !base.some((w) => w.how === replaces)) throw new ApprovalError(`The quest has no way that reads "${replaces}". Clear the replaces field to add a new way.`);
  const stored: PlayerWay = { how: way.how, ...(way.who ? { who: way.who } : {}), ...(way.where ? { where: way.where } : {}), ...(way.whereIs?.length ? { whereIs: way.whereIs } : {}) };
  const now = new Date();
  const [fact] = await db()
    .insert(schema.questPlayerFacts)
    .values({ lineId: r.r.lineId, quest: r.r.quest, replaces: replaces || null, way: stored, source: sourceOf(r, r.r.createdAt), reportId: r.r.id, userId: r.r.userId })
    .returning({ id: schema.questPlayerFacts.id });
  const decision: Decision = { outcome: edit ? "edited and approved" : "approved", by: adminId, at: now.toISOString(), fact: fact.id };
  await db().update(schema.questReports).set({ status: "fixed", decision }).where(eq(schema.questReports.id, id));
  await loadPlayerFacts(true);
  return { fact: fact.id };
}

/** "Not a problem": the report is closed, no fact written. */
export async function dismissReport(id: number, adminId: string): Promise<void> {
  const decision: Decision = { outcome: "not a problem", by: adminId, at: new Date().toISOString() };
  const rows = await db().update(schema.questReports).set({ status: "not a problem", decision }).where(eq(schema.questReports.id, id)).returning({ id: schema.questReports.id });
  if (!rows[0]) throw new ApprovalError("No such report.");
}

/**
 * The lines on /me (WO-146 Part 3): "Your report on Running Wild is on the planner now. Thank you." for each of the player's
 * reports an admin approved in the last thirty days, newest first.
 */
export async function approvedFor(userId: string): Promise<{ id: number; says: string }[]> {
  const rows = await db()
    .select({ id: schema.questReports.id, lineId: schema.questReports.lineId, quest: schema.questReports.quest })
    .from(schema.questReports)
    .where(and(eq(schema.questReports.userId, userId), sql`${schema.questReports.decision}->>'outcome' in ('approved', 'edited and approved')`, gt(schema.questReports.createdAt, sql`now() - interval '30 days'`)))
    .orderBy(desc(schema.questReports.createdAt))
    .limit(10);
  const { byId } = questsData();
  return rows.map((r) => {
    const line = byId.get(r.lineId);
    const name = (r.quest ? line?.quests.find((q) => q.edid === r.quest)?.name : null) ?? line?.name ?? r.lineId;
    return { id: r.id, says: `Your report on ${name} is on the planner now. Thank you.` };
  });
}
