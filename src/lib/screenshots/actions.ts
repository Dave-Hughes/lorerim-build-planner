"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { pageNamed } from "@/lib/pages/page-named";
import { isAdmin } from "@/lib/users/admin";
import { approveShot, leadShot, removeShot, reportShot, shotRow } from "./store";
import { SHOT_WORDS } from "./words";

type Result = { ok: true } | { ok: false; error: string };

const refresh = async (id: number) => {
  const row = await shotRow(id);
  const page = row ? pageNamed(row.kind, row.key) : null;
  if (page) revalidatePath(page.href);
  revalidatePath("/admin/review");
  revalidatePath("/me");
};

async function admin(): Promise<string | null> {
  const id = (await auth())?.user?.id;
  return id && (await isAdmin(id)) ? id : null;
}

/** Approve a screenshot waiting on an admin (or clear a report on a live one); with `trust`, its sender's next ones go live at once. */
export async function approveScreenshot(id: number, trust = false): Promise<Result> {
  const adminId = await admin();
  if (!adminId) return { ok: false, error: SHOT_WORDS.adminOnly };
  const row = await shotRow(Number(id));
  const page = row ? pageNamed(row.kind, row.key) : null;
  if (!(await approveShot(Number(id), adminId, !!trust, page?.name ?? "a page"))) return { ok: false, error: SHOT_WORDS.gone };
  await refresh(Number(id));
  return { ok: true };
}

/** Take a screenshot off its page. Its sender can remove their own; an admin any. */
export async function removeScreenshot(id: number): Promise<Result> {
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: SHOT_WORDS.signIn };
  const row = await shotRow(Number(id));
  if (!row) return { ok: false, error: SHOT_WORDS.gone };
  const isMine = row.userId === userId;
  if (!isMine && !(await isAdmin(userId))) return { ok: false, error: SHOT_WORDS.adminOnly };
  if (!(await removeShot(Number(id), userId, false))) return { ok: false, error: SHOT_WORDS.gone };
  await refresh(Number(id));
  return { ok: true };
}

/** An admin's delete: it goes from the page for everyone, and its files from the store. */
export async function deleteScreenshot(id: number): Promise<Result> {
  const adminId = await admin();
  if (!adminId) return { ok: false, error: SHOT_WORDS.adminOnly };
  if (!(await removeShot(Number(id), adminId, true))) return { ok: false, error: SHOT_WORDS.gone };
  await refresh(Number(id));
  return { ok: true };
}

/** Make a live screenshot lead its page. */
export async function leadScreenshot(id: number): Promise<Result> {
  const adminId = await admin();
  if (!adminId) return { ok: false, error: SHOT_WORDS.adminOnly };
  if (!(await leadShot(Number(id), adminId))) return { ok: false, error: SHOT_WORDS.gone };
  await refresh(Number(id));
  return { ok: true };
}

/** "This screenshot isn't this place": the report puts it back on the review list. */
export async function reportScreenshot(id: number, note: string): Promise<Result> {
  if (!questsOn()) return { ok: false, error: "Not found." };
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: SHOT_WORDS.signIn };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  if (!(await reportShot(Number(id), userId, String(note ?? "")))) return { ok: false, error: SHOT_WORDS.gone };
  await refresh(Number(id));
  return { ok: true };
}
