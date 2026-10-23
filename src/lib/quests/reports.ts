import "server-only";
import { and, count, desc, eq, gt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { questsData } from "./data";
import { changesNothing } from "./player-source";
import { REPORT_FIELD_MAX, REPORT_KINDS, type ReportFields, type ReportKind } from "./player-types";
import { REPORT_TEXT_MAX, REPORT_WHAT, type ReportWhat } from "./report-words";

/**
 * Quest reports (WO-103, WO-121a Part 5): a signed-in player's word that a quest page was wrong, from the page's This
 * was wrong or through an assistant's report_quest. Both file the same way, with the same limit.
 */

/** 5 an hour per account (WO-103). */
export const QUEST_REPORTS_AN_HOUR = 5;
export const QUEST_REPORT_LIMIT_MESSAGE = "You've sent a few already. Try again later.";

export class QuestReportError extends Error {}

/** A quest line by its id or name, or the line a quest is in by the quest's EDID or name; null when none is. */
export function lineFor(quest: string): { lineId: string; edid: string | null } | null {
  const q = quest.trim().toLowerCase();
  if (!q) return null;
  const { lines, byId } = questsData();
  const line = byId.get(q) ?? lines.find((l) => l.name.toLowerCase() === q);
  if (line) return { lineId: line.id, edid: null };
  for (const l of lines) {
    const hit = l.quests.find((x) => x.edid.toLowerCase() === q) ?? l.quests.find((x) => x.name.toLowerCase() === q);
    if (hit) return { lineId: l.id, edid: hit.edid };
  }
  return null;
}

export interface QuestReportInput {
  userId: string;
  lineId: string;
  quest?: string | null;
  what: string;
  text: string;
  /** What the report is (WO-146): "wrong" when left out. */
  kind?: ReportKind;
  /** For a how or where report: who, where, how, place. */
  fields?: ReportFields;
  said?: string;
  source: "site" | "assistant";
  client?: string | null;
}

/** The fields of a how or where report as they are kept: each trimmed to a line, empty ones dropped. */
export function cleanFields(fields: ReportFields | undefined): ReportFields {
  const out: ReportFields = {};
  for (const k of ["who", "where", "how", "place"] as const) {
    const v = (fields?.[k] ?? "").replace(/\s+/g, " ").trim().slice(0, REPORT_FIELD_MAX);
    if (v) out[k] = v;
  }
  return out;
}

/**
 * Files a report: the line must exist; a "wrong" report says which part (`what`, one of REPORT_WHAT) and what happened, as
 * before; a "how" or "where" report (WO-146) names one quest of the line and what the player knows (who, where, what they
 * did for how; the place for where), with free text optional. Refused past the limit.
 */
export async function fileQuestReport(input: QuestReportInput): Promise<{ id: number }> {
  if (!questsData().byId.has(input.lineId)) throw new QuestReportError("No quest line has that id.");
  const kind: ReportKind = input.kind ?? "wrong";
  if (!REPORT_KINDS.includes(kind)) throw new QuestReportError(`Say what you're sending: ${REPORT_KINDS.join(", ")}.`);
  const fields = kind === "wrong" ? undefined : cleanFields(input.fields);
  if (kind !== "wrong") {
    const line = questsData().byId.get(input.lineId)!;
    if (!input.quest || !line.quests.some((q) => q.edid === input.quest)) throw new QuestReportError("Say which quest of the line you mean.");
    if (kind === "how" && !fields!.who && !fields!.where && !fields!.how) throw new QuestReportError("Say who starts it, where, or what you did.");
    if (kind === "where" && !fields!.place) throw new QuestReportError("Say where it is: the town, the building, the nearest landmark.");
  }
  // A how or where report says what it is in its kind; the part it is about is the page's own.
  const what = (kind === "how" ? "How to start it" : kind === "where" ? "Who and where" : REPORT_WHAT.find((w) => w.toLowerCase() === input.what.trim().toLowerCase())) as ReportWhat | undefined;
  if (!what) throw new QuestReportError(`Say what was wrong: ${REPORT_WHAT.join(", ")}.`);
  const text = input.text.trim().slice(0, REPORT_TEXT_MAX);
  if (!text && kind === "wrong") throw new QuestReportError("Say what happened in your game.");
  const [r] = await db()
    .select({ n: count() })
    .from(schema.questReports)
    .where(and(eq(schema.questReports.userId, input.userId), gt(schema.questReports.createdAt, sql`now() - interval '1 hour'`)));
  if (r.n >= QUEST_REPORTS_AN_HOUR) throw new QuestReportError(QUEST_REPORT_LIMIT_MESSAGE);
  const [row] = await db()
    .insert(schema.questReports)
    .values({
      lineId: input.lineId,
      quest: input.quest ?? null,
      what,
      text,
      kind,
      ...(fields ? { fields } : {}),
      said: (input.said ?? "").trim().slice(0, REPORT_TEXT_MAX),
      userId: input.userId,
      source: input.source,
      client: input.client?.slice(0, 80) ?? null,
    })
    .returning({ id: schema.questReports.id });
  return row;
}

/** /admin's Quest reports, newest first, with the line's name and the player's. */
export async function listQuestReports(limit = 100) {
  const rows = await db()
    .select({
      id: schema.questReports.id,
      lineId: schema.questReports.lineId,
      quest: schema.questReports.quest,
      what: schema.questReports.what,
      text: schema.questReports.text,
      said: schema.questReports.said,
      source: schema.questReports.source,
      client: schema.questReports.client,
      status: schema.questReports.status,
      kind: schema.questReports.kind,
      fields: schema.questReports.fields,
      proposal: schema.questReports.proposal,
      decision: schema.questReports.decision,
      createdAt: schema.questReports.createdAt,
      name: schema.users.name,
      handle: schema.users.handle,
    })
    .from(schema.questReports)
    .innerJoin(schema.users, eq(schema.users.id, schema.questReports.userId))
    .orderBy(desc(schema.questReports.createdAt))
    .limit(limit);
  const { byId } = questsData();
  return rows.map((r) => {
    const line = byId.get(r.lineId);
    const quest = r.quest ? line?.quests.find((q) => q.edid === r.quest) : undefined;
    return {
      ...r,
      lineName: line?.name ?? r.lineId,
      questName: r.quest ? (quest?.name ?? r.quest) : null,
      // The quest's page text now (WO-146 Part 3): the ways in as the page says them, a player's report marked as one.
      onThePage: pageWays(quest),
      ways: (quest?.start?.ways ?? []).map((w) => w.how),
      // The proposal says what the page already says (WO-146 Part 1b).
      noChange: changesNothing(r.proposal, quest?.start?.ways ?? []),
    };
  });
}

/** A quest's ways in as the page puts them, for an admin to read a proposal against. */
export function pageWays(quest: { start?: { ways?: { how: string; who?: string; where?: string; whereIs?: string[]; unplaced?: string; checked?: string; source?: string }[]; then?: string } } | undefined): string[] {
  const ways = quest?.start?.ways ?? [];
  return ways.map((w) => [w.how, w.where && !w.how.includes(w.where) ? `in ${w.where}` : "", w.whereIs?.length ? `(${w.whereIs.join("; ")})` : "", w.unplaced ?? "", w.checked === "players" ? `[a player's report: ${w.source}]` : ""].filter(Boolean).join(" "));
}

export const REPORT_STATUSES = ["new", "fixed", "not a problem"] as const;

export async function setQuestReportStatus(id: number, status: string): Promise<boolean> {
  const s = REPORT_STATUSES.find((x) => x === status);
  if (!s) return false;
  const rows = await db().update(schema.questReports).set({ status: s }).where(eq(schema.questReports.id, id)).returning({ id: schema.questReports.id });
  return !!rows[0];
}
