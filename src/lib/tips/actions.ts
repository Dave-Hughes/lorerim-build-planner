"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { pageNamed } from "@/lib/pages/page-named";
import { ProposeError } from "@/lib/quests/propose";
import { isAdmin } from "@/lib/users/admin";
import { trustByName, untrust } from "@/lib/trust/store";
import { readTip } from "./read";
import { decideTip, fileTip, TipError } from "./store";
import { TIP_WORDS, type TipHow, type TipKind, type TipType } from "./words";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

type Result = { ok: true } | { ok: false; error: string };

/** "I know this" and Report a mistake, sent without a screenshot (the form with one goes through /api/tips). Signed in only. */
export async function sendTip(input: { kind: TipKind; key: string; type: TipType; field: string; words: string; how: TipHow; link?: string }): Promise<Result> {
  if (!questsOn()) return { ok: false, error: "Not found." };
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: TIP_WORDS.signIn };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  try {
    await fileTip({ userId, kind: input.kind, key: String(input.key).slice(0, 200), type: input.type === "mistake" ? "mistake" : "know", field: String(input.field ?? ""), words: String(input.words ?? ""), how: input.how, link: input.link });
    return { ok: true };
  } catch (e) {
    if (e instanceof TipError) return { ok: false, error: e.message };
    throw e;
  }
}

async function adminId(): Promise<string | null> {
  const id = (await auth())?.user?.id;
  return id && (await isAdmin(id)) ? id : null;
}

async function tipPath(id: number): Promise<string | null> {
  const [t] = await db().select({ kind: schema.pageTips.kind, key: schema.pageTips.key }).from(schema.pageTips).where(eq(schema.pageTips.id, id)).limit(1);
  return t ? (pageNamed(t.kind, t.key)?.href ?? null) : null;
}

/** An admin's decision on a tip. Approve (as written, or `shown` edited) puts it on the page as a player's report. */
export async function decideTipAction(id: number, status: "approved" | "rejected" | "fixed" | "sent" | "not a mistake", shown?: string): Promise<Result> {
  const admin = await adminId();
  if (!admin) return { ok: false, error: TIP_WORDS.adminOnly };
  const href = await tipPath(Number(id));
  if (!(await decideTip(Number(id), admin, status, shown))) return { ok: false, error: "That one has been decided already." };
  if (href) revalidatePath(href);
  revalidatePath("/admin/review");
  revalidatePath("/me");
  return { ok: true };
}

/** The agent reads a tip against the records (never changing a page). */
export async function readTipAction(id: number): Promise<{ ok: true; words: string } | { ok: false; error: string }> {
  if (!(await adminId())) return { ok: false, error: TIP_WORDS.adminOnly };
  try {
    const r = await readTip(Number(id));
    revalidatePath("/admin/review");
    return { ok: true, words: r.words };
  } catch (e) {
    if (e instanceof ProposeError) return { ok: false, error: e.message };
    throw e;
  }
}

export async function trustPlayerAction(name: string): Promise<Result> {
  const admin = await adminId();
  if (!admin) return { ok: false, error: TIP_WORDS.adminOnly };
  const r = await trustByName(String(name), admin);
  if (!r.ok) return r;
  revalidatePath("/admin/review");
  return { ok: true };
}

export async function untrustPlayerAction(userId: string): Promise<Result> {
  if (!(await adminId())) return { ok: false, error: TIP_WORDS.adminOnly };
  await untrust(String(userId));
  revalidatePath("/admin/review");
  return { ok: true };
}
