"use server";

import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { isAdmin } from "@/lib/users/admin";
import type { ReportFields, ReportKind } from "./player-types";
import { revalidatePath } from "next/cache";
import { ApprovalError, approveReport, closeNoChange, dismissReport, type ApprovedWay } from "./approvals";
import type { Proposal } from "./player-types";
import { ProposeError } from "./propose";
import { proposeNewReports, proposeReport } from "./proposals";
import { QuestReportError, fileQuestReport, setQuestReportStatus } from "./reports";

type Result = { ok: true } | { ok: false; error: string };

/**
 * This was wrong (WO-103), sent from a quest line's page; signed in only (WO-121a Part 5). With `about` (WO-146) it is
 * what the player knows instead: how a quest starts or where it is, naming the quest and the fields.
 */
export async function reportQuest(lineId: string, what: string, text: string, about?: { kind: ReportKind; quest: string; fields: ReportFields }): Promise<Result> {
  if (!questsOn()) return { ok: false, error: "Not found." };
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: "Sign in with Discord to tell us." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  try {
    await fileQuestReport({
      userId,
      lineId: String(lineId).slice(0, 120),
      what: String(what),
      text: String(text),
      source: "site",
      ...(about ? { kind: about.kind, quest: String(about.quest).slice(0, 120), fields: about.fields } : {}),
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof QuestReportError) return { ok: false, error: e.message };
    throw e;
  }
}

/** /admin's status select on a quest report. */
export async function setQuestReport(id: number, status: string): Promise<Result> {
  if (!(await isAdmin((await auth())?.user?.id))) return { ok: false, error: "Only admins can do that." };
  return (await setQuestReportStatus(Number(id), String(status))) ? { ok: true } : { ok: false, error: "Unknown report." };
}

/** Propose on one report (WO-146 Part 2): the agent reads it against the quest's records and writes a proposal. Admins only. */
export async function proposeQuestFact(id: number): Promise<{ ok: true; proposal: Proposal } | { ok: false; error: string }> {
  if (!(await isAdmin((await auth())?.user?.id))) return { ok: false, error: "Only admins can do that." };
  try {
    return { ok: true, proposal: await proposeReport(Number(id)) };
  } catch (e) {
    if (e instanceof ProposeError) return { ok: false, error: e.message };
    throw e;
  }
}

/** Propose on every new how or where report without one yet, up to BATCH_MAX. Admins only. */
export async function proposeQuestFacts(): Promise<{ ok: true; results: { id: number; ok: boolean; message: string }[] } | { ok: false; error: string }> {
  if (!(await isAdmin((await auth())?.user?.id))) return { ok: false, error: "Only admins can do that." };
  return { ok: true, results: await proposeNewReports() };
}

/** Approve a report as proposed, or as the admin edited it (WO-146 Part 3): writes the player fact. Admins only. */
export async function approveQuestFact(id: number, edit?: ApprovedWay): Promise<Result> {
  const adminId = (await auth())?.user?.id;
  if (!(await isAdmin(adminId))) return { ok: false, error: "Only admins can do that." };
  try {
    await approveReport(Number(id), adminId!, edit);
    revalidatePath("/me");
    return { ok: true };
  } catch (e) {
    if (e instanceof ApprovalError) return { ok: false, error: e.message };
    throw e;
  }
}

/** Not a problem: close the report with no fact. Admins only. */
export async function dismissQuestFact(id: number): Promise<Result> {
  const adminId = (await auth())?.user?.id;
  if (!(await isAdmin(adminId))) return { ok: false, error: "Only admins can do that." };
  try {
    await dismissReport(Number(id), adminId!);
    return { ok: true };
  } catch (e) {
    if (e instanceof ApprovalError) return { ok: false, error: e.message };
    throw e;
  }
}

/** Close a report whose proposal changes nothing: the page already says it (WO-146 Part 1b). Admins only. */
export async function closeQuestFact(id: number): Promise<Result> {
  const adminId = (await auth())?.user?.id;
  if (!(await isAdmin(adminId))) return { ok: false, error: "Only admins can do that." };
  try {
    await closeNoChange(Number(id), adminId!);
    return { ok: true };
  } catch (e) {
    if (e instanceof ApprovalError) return { ok: false, error: e.message };
    throw e;
  }
}
