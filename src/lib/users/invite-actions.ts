"use server";

import { and, eq, gt, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { isAdmin } from "./admin";
import { INVITE_MESSAGE_MAX, hashInviteToken, inviteExpiry, isInviteToken, newInviteToken } from "./invites";
import type { ActionResult } from "@/lib/builds/actions";

/**
 * Come in (WO-96): uses the invite for the signed-in player and lets them in early, then opens the
 * app. The update only matches an invite that's unused and in date, so one link lets one person in,
 * however fast two people click. A used, run-out or unknown link just shows its page again.
 */
export async function acceptInvite(token: string): Promise<void> {
  const userId = (await auth())?.user?.id;
  const back = `/invite/${encodeURIComponent(token)}`;
  if (!userId || !isInviteToken(token)) redirect(back);
  if (await looksLikeBot()) redirect(back);
  const now = new Date();
  const used = await db()
    .update(schema.invites)
    .set({ usedBy: userId, usedAt: now })
    .where(and(eq(schema.invites.tokenHash, hashInviteToken(token)), isNull(schema.invites.usedBy), gt(schema.invites.expiresAt, now)))
    .returning({ id: schema.invites.id });
  if (!used.length) redirect(back);
  await db().update(schema.users).set({ earlyAccessAt: now }).where(and(eq(schema.users.id, userId), isNull(schema.users.earlyAccessAt)));
  revalidatePath("/admin");
  redirect("/");
}

async function adminOnly(): Promise<string | null> {
  const userId = (await auth())?.user?.id ?? null;
  return userId && (await isAdmin(userId)) ? userId : null;
}

/**
 * Make invite (WO-96): a new link for a named person, with Tapps's line written for them when the
 * admin gives one. The link is returned once and never kept.
 */
export async function makeInvite(label: string, message = ""): Promise<ActionResult<{ path: string }>> {
  const userId = await adminOnly();
  if (!userId) return { ok: false, error: "Only admins can make invites." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  const name = label.trim().slice(0, 60);
  if (!name) return { ok: false, error: "Who is it for? Add a name." };
  const line = message.trim();
  if (line.length > INVITE_MESSAGE_MAX) return { ok: false, error: `Keep Tapps's line under ${INVITE_MESSAGE_MAX} characters.` };
  const token = newInviteToken();
  await db().insert(schema.invites).values({ tokenHash: hashInviteToken(token), label: name, message: line || null, createdBy: userId, expiresAt: inviteExpiry() });
  revalidatePath("/admin");
  return { ok: true, value: { path: `/invite/${token}` } };
}

/** Cancel: takes back an invite nobody has used yet. */
export async function cancelInvite(id: number): Promise<ActionResult> {
  if (!(await adminOnly())) return { ok: false, error: "Only admins can cancel invites." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  await db().delete(schema.invites).where(and(eq(schema.invites.id, id), isNull(schema.invites.usedBy)));
  revalidatePath("/admin");
  return { ok: true, value: undefined };
}

/** Remove: takes a player's early access away; the coming soon page is back on their next page. */
export async function removeEarlyAccess(userId: string): Promise<ActionResult> {
  if (!(await adminOnly())) return { ok: false, error: "Only admins can remove early access." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  await db().update(schema.users).set({ earlyAccessAt: null }).where(eq(schema.users.id, userId));
  revalidatePath("/admin");
  return { ok: true, value: undefined };
}
