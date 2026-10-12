"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { isValidBuildId } from "@/lib/builds/ids";
import { imageUrls } from "@/lib/guide/doc";
import { removeImages } from "@/lib/guide/images";
import { isAdmin } from "@/lib/users/admin";
import { BOT_MESSAGE, looksLikeBot } from "./bot";
import { overLimit } from "./limits";
import { REPORT_REASONS, type ReportReason } from "./reports";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Reports a build (WO-40): once per signed-in player per build, never your own. Three open reports
 * hide its images until an admin decides.
 */
export async function reportBuild(buildId: string, reason: ReportReason, note: string): Promise<Result> {
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: "Sign in with Discord to report a build." };
  if (!isValidBuildId(buildId) || !REPORT_REASONS.some((r) => r.id === reason)) return { ok: false, error: "Choose what's wrong." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  const [build] = await db().select({ ownerId: schema.builds.ownerId, visibility: schema.builds.visibility }).from(schema.builds).where(eq(schema.builds.id, buildId)).limit(1);
  if (!build || build.visibility === "private") return { ok: false, error: "Unknown build." };
  if (build.ownerId === userId) return { ok: false, error: "You can't report your own build." };
  const limit = await overLimit(userId, "report");
  if (limit) return { ok: false, error: limit };
  const rows = await db()
    .insert(schema.buildReports)
    .values({ buildId, reporterId: userId, reason, note: note.trim().slice(0, 300) })
    .onConflictDoNothing()
    .returning({ id: schema.buildReports.id });
  if (!rows[0]) return { ok: false, error: "You've already reported this build. Thanks; an admin will look." };
  revalidatePath(`/b/${buildId}`);
  revalidatePath("/");
  return { ok: true };
}

export type ReviewAction = "keep" | "hide" | "remove";

async function adminOnly(): Promise<boolean> {
  return isAdmin((await auth())?.user?.id);
}

/** An image the check listed or couldn't check: keep it, hide it behind the panel, or delete it from the store. */
export async function reviewImage(checkId: number, action: ReviewAction): Promise<Result> {
  if (!(await adminOnly())) return { ok: false, error: "Only admins can do that." };
  const [check] = await db().select().from(schema.imageChecks).where(eq(schema.imageChecks.id, checkId)).limit(1);
  if (!check) return { ok: false, error: "That image isn't on the list." };
  if (check.url && action !== "keep") await takeDown([check.url], action === "remove");
  await db().update(schema.imageChecks).set({ review: action === "keep" ? "kept" : action === "hide" ? "hidden" : "removed" }).where(eq(schema.imageChecks.id, checkId));
  revalidateAll(check.buildId);
  return { ok: true };
}

/** A reported build: keep it (its images come back), or hide or remove its cover and guide images. Clears its reports. */
export async function reviewBuild(buildId: string, action: ReviewAction): Promise<Result> {
  if (!(await adminOnly())) return { ok: false, error: "Only admins can do that." };
  if (!isValidBuildId(buildId)) return { ok: false, error: "Unknown build." };
  if (action !== "keep") {
    const [build] = await db().select({ cover: schema.builds.coverImageUrl }).from(schema.builds).where(eq(schema.builds.id, buildId)).limit(1);
    const guide = await db().select({ doc: schema.buildGuides.doc }).from(schema.buildGuides).where(eq(schema.buildGuides.buildId, buildId));
    const urls = new Set<string>(build?.cover ? [build.cover] : []);
    for (const g of guide) for (const u of imageUrls(g.doc)) urls.add(u);
    await takeDown([...urls], action === "remove");
  }
  await db()
    .update(schema.buildReports)
    .set({ clearedAt: new Date() })
    .where(and(eq(schema.buildReports.buildId, buildId), isNull(schema.buildReports.clearedAt)));
  revalidateAll(buildId);
  return { ok: true };
}

/** Hides images behind the panel everywhere they show; with `remove`, also deletes them from the store and drops them as covers. */
async function takeDown(urls: string[], remove: boolean) {
  if (!urls.length) return;
  await db()
    .insert(schema.hiddenImages)
    .values(urls.map((url) => ({ url })))
    .onConflictDoNothing();
  if (remove) {
    await db().update(schema.builds).set({ coverImageUrl: null }).where(inArray(schema.builds.coverImageUrl, urls));
    await removeImages(urls);
  }
}

function revalidateAll(buildId: string | null) {
  if (buildId) revalidatePath(`/b/${buildId}`);
  revalidatePath("/");
  revalidatePath("/admin/review");
}
