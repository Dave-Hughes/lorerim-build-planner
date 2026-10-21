"use server";

import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { isAdmin } from "@/lib/users/admin";
import { QuestReportError, fileQuestReport, setQuestReportStatus } from "./reports";

type Result = { ok: true } | { ok: false; error: string };

/** This was wrong (WO-103), sent from a quest line's page; signed in only (WO-121a Part 5). */
export async function reportQuest(lineId: string, what: string, text: string): Promise<Result> {
  if (!questsOn()) return { ok: false, error: "Not found." };
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: "Sign in with Discord to tell us." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  try {
    await fileQuestReport({ userId, lineId: String(lineId).slice(0, 120), what: String(what), text: String(text), source: "site" });
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
