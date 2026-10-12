"use server";

import { and, eq, like, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { newBuildId, isValidBuildId } from "./ids";
import { getBuild } from "./queries";
import { buildDetailsSchema, buildVisibilitySchema, parseBuildPlan, type BuildDetails } from "./validate";
import { convertPlan, droppedSentence } from "@/lib/rules/convert";
import { guideDocSchema, imageUrls, isGuideKey, isInlineOnly, levelOfKey, limitFor, textLength, tooLongMessage } from "@/lib/guide/doc";
import { deleteBuildImages, deleteImagesIfUnused, isOurImage } from "@/lib/guide/images";
import { copyGuide } from "@/lib/guide/queries";
import { currentVersion, isKnownVersion, requireGameData } from "@/lib/rules/server";

export type ActionResult<T = undefined> = { ok: true; value: T } | { ok: false; error: string };

async function requireUser(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function orNull(s: string): string | null {
  return s.trim() === "" ? null : s.trim();
}

/** Replaces a build's tags, all at once (one batch). The caller has checked ownership. */
async function setTags(buildId: string, slugs: string[]) {
  const unique = [...new Set(slugs)];
  const del = db().delete(schema.buildTags).where(eq(schema.buildTags.buildId, buildId));
  if (unique.length) await db().batch([del, db().insert(schema.buildTags).values(unique.map((tagSlug) => ({ buildId, tagSlug })))]);
  else await del;
}

/**
 * Likes or unlikes a build for the signed-in player, keeping the build's like_count in step in the
 * same statement. Not your own build, and only builds you can see. updated_at is left alone: a like
 * doesn't make a build newer.
 */
export async function setLike(buildId: string, liked: boolean): Promise<ActionResult<{ liked: boolean; count: number }>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Sign in with Discord to like builds." };
  if (!isValidBuildId(buildId)) return { ok: false, error: "Unknown build." };
  const [build] = await db().select({ ownerId: schema.builds.ownerId, visibility: schema.builds.visibility }).from(schema.builds).where(eq(schema.builds.id, buildId)).limit(1);
  if (!build || build.visibility === "private") return { ok: false, error: "Unknown build." };
  if (build.ownerId === userId) return { ok: false, error: "You can't like your own build." };
  const result = liked
    ? await db().execute(sql`
        WITH changed AS (
          INSERT INTO build_like (user_id, build_id) VALUES (${userId}, ${buildId}) ON CONFLICT DO NOTHING RETURNING 1
        )
        UPDATE build SET like_count = like_count + (SELECT count(*) FROM changed)::int, updated_at = updated_at
        WHERE id = ${buildId} RETURNING like_count`)
    : await db().execute(sql`
        WITH changed AS (
          DELETE FROM build_like WHERE user_id = ${userId} AND build_id = ${buildId} RETURNING 1
        )
        UPDATE build SET like_count = greatest(0, like_count - (SELECT count(*) FROM changed)::int), updated_at = updated_at
        WHERE id = ${buildId} RETURNING like_count`);
  const count = Number((result.rows[0] as { like_count?: number } | undefined)?.like_count ?? 0);
  revalidatePath(`/b/${buildId}`);
  return { ok: true, value: { liked, count } };
}

/** Creates a build from the creation flow and returns its id. */
export async function createBuild(input: { details: BuildDetails; plan: unknown }): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Sign in with Discord to save a build." };
  const details = buildDetailsSchema.safeParse(input.details);
  if (!details.success) return { ok: false, error: details.error.issues[0]?.message ?? "Check the build details." };
  let plan;
  try {
    plan = parseBuildPlan(input.plan);
  } catch {
    return { ok: false, error: "The build's choices didn't pass validation." };
  }
  const id = newBuildId();
  await db()
    .insert(schema.builds)
    .values({
      id,
      ownerId: userId,
      name: details.data.name,
      description: details.data.description,
      coverImageUrl: orNull(details.data.coverImageUrl),
      writeupUrl: orNull(details.data.writeupUrl),
      visibility: details.data.visibility,
      gameVersion: plan.gameVersion,
      plan,
    });
  if (details.data.tags) await setTags(id, details.data.tags);
  revalidatePath("/");
  revalidatePath("/me");
  return { ok: true, value: { id } };
}

/** Saves the level-by-level choices. Only the owner can. */
export async function saveBuildPlan(id: string, input: unknown): Promise<ActionResult<{ updatedAt: string }>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Your sign-in expired. Sign in again to keep saving." };
  if (!isValidBuildId(id)) return { ok: false, error: "Unknown build." };
  let plan;
  try {
    plan = parseBuildPlan(input);
  } catch {
    return { ok: false, error: "The build's choices didn't pass validation." };
  }
  const rows = await db()
    .update(schema.builds)
    .set({ plan, gameVersion: plan.gameVersion })
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)))
    .returning({ updatedAt: schema.builds.updatedAt });
  if (!rows[0]) return { ok: false, error: "Only the build's author can change it." };
  // Notes for levels the build no longer has go with them.
  await db()
    .delete(schema.buildGuides)
    .where(
      and(
        eq(schema.buildGuides.buildId, id),
        like(schema.buildGuides.key, "level:%"),
        sql`substring(${schema.buildGuides.key} from 7)::int > ${plan.levels.length}`,
      ),
    );
  revalidatePath(`/b/${id}`);
  return { ok: true, value: { updatedAt: rows[0].updatedAt.toISOString() } };
}

/** Saves name, description, links and visibility. Only the owner can. */
export async function saveBuildDetails(id: string, input: BuildDetails): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Your sign-in expired. Sign in again to keep saving." };
  const details = buildDetailsSchema.safeParse(input);
  if (!details.success) return { ok: false, error: details.error.issues[0]?.message ?? "Check the build details." };
  const rows = await db()
    .update(schema.builds)
    .set({
      name: details.data.name,
      description: details.data.description,
      coverImageUrl: orNull(details.data.coverImageUrl),
      writeupUrl: orNull(details.data.writeupUrl),
      visibility: details.data.visibility,
    })
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)))
    .returning({ id: schema.builds.id });
  if (!rows[0]) return { ok: false, error: "Only the build's author can change it." };
  if (details.data.tags) await setTags(id, details.data.tags);
  revalidatePath(`/b/${id}`);
  revalidatePath("/");
  revalidatePath("/me");
  return { ok: true, value: undefined };
}

/** Changes who can see a build (the edit bar's control). Only the owner can. */
export async function setBuildVisibility(id: string, visibility: unknown): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Your sign-in expired. Sign in again to keep saving." };
  const v = buildVisibilitySchema.safeParse(visibility);
  if (!v.success) return { ok: false, error: "Choose Listed, Link only or Only you." };
  const rows = await db()
    .update(schema.builds)
    .set({ visibility: v.data })
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)))
    .returning({ id: schema.builds.id });
  if (!rows[0]) return { ok: false, error: "Only the build's author can change it." };
  revalidatePath(`/b/${id}`);
  revalidatePath("/");
  revalidatePath("/me");
  return { ok: true, value: undefined };
}

/** Copies a visible build into the signed-in user's builds and opens it. */
export async function copyBuild(id: string): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Sign in with Discord to copy a build." };
  const source = await getBuild(id, userId);
  if (!source) return { ok: false, error: "Unknown build." };
  const newId = newBuildId();
  await db()
    .insert(schema.builds)
    .values({
      id: newId,
      ownerId: userId,
      name: source.isSample ? source.name : `${source.name} (copy)`,
      description: source.description,
      coverImageUrl: source.coverImageUrl,
      writeupUrl: null,
      visibility: "private",
      gameVersion: source.gameVersion,
      plan: source.plan,
    });
  if (!source.isSample) await copyGuide(source.id, newId);
  revalidatePath("/me");
  return { ok: true, value: { id: newId } };
}

/**
 * Copies a build into the signed-in user's builds, moved to another LoreRim version (the
 * current one unless `toVersion` says otherwise). The original is never changed. `dropped` lists what
 * the current version doesn't have (empty when everything carried over).
 */
export async function copyBuildForVersion(id: string, toVersion?: string): Promise<ActionResult<{ id: string; dropped: string }>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Sign in with Discord to copy a build." };
  const source = await getBuild(id, userId);
  if (!source) return { ok: false, error: "Unknown build." };
  if (!isKnownVersion(source.gameVersion)) return { ok: false, error: `LoreRim ${source.gameVersion} is no longer in the planner.` };
  if (toVersion !== undefined && !isKnownVersion(toVersion)) return { ok: false, error: `LoreRim ${toVersion} is not in the planner.` };
  const current = toVersion ? { id: toVersion } : currentVersion();
  const { plan, dropped } = convertPlan(requireGameData(current.id), source.plan);
  const newId = newBuildId();
  await db()
    .insert(schema.builds)
    .values({
      id: newId,
      ownerId: userId,
      name: `${source.name} (${current.id})`.slice(0, 80),
      description: source.description,
      coverImageUrl: source.coverImageUrl,
      writeupUrl: null,
      visibility: "private",
      gameVersion: current.id,
      plan,
    });
  if (!source.isSample) await copyGuide(source.id, newId);
  revalidatePath("/me");
  return { ok: true, value: { id: newId, dropped: dropped.length ? droppedSentence(current.id, dropped) : "" } };
}

/**
 * Saves one section of the written guide (`overview` or `level:<n>`). Only the owner can.
 * The document is checked against the guide's node and mark types (links http/https only)
 * and its length limit; it is never truncated. The first save of a section clears the old
 * plain-text note it replaces.
 */
export async function saveGuideSection(buildId: string, key: string, input: unknown): Promise<ActionResult<{ updatedAt: string }>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Your sign-in expired. Sign in again to keep saving." };
  if (!isValidBuildId(buildId) || !isGuideKey(key)) return { ok: false, error: "Unknown guide section." };
  const parsed = guideDocSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "The guide has something it can't save." };
  const doc = parsed.data as typeof parsed.data & { type: "doc" };
  const length = textLength(doc);
  const limit = limitFor(key);
  if (length > limit) return { ok: false, error: tooLongMessage(length, limit) };
  if (key === "intro" && !isInlineOnly(doc)) return { ok: false, error: "The intro takes plain paragraphs with bold, italic and links only." };
  const images = imageUrls(doc);
  if ([...images].some((u) => !isOurImage(u))) return { ok: false, error: "Images must be uploaded to the guide." };

  const level = levelOfKey(key);
  const owned = await db()
    .select({ plan: schema.builds.plan })
    .from(schema.builds)
    .where(and(eq(schema.builds.id, buildId), eq(schema.builds.ownerId, userId)))
    .limit(1);
  if (!owned[0]) return { ok: false, error: "Only the build's author can change it." };
  if (level && level > owned[0].plan.levels.length) return { ok: false, error: `The build has no level ${level}.` };

  const before = await db()
    .select({ doc: schema.buildGuides.doc })
    .from(schema.buildGuides)
    .where(and(eq(schema.buildGuides.buildId, buildId), eq(schema.buildGuides.key, key)))
    .limit(1);

  const rows = await db()
    .insert(schema.buildGuides)
    .values({ buildId, key, doc, textLength: length })
    .onConflictDoUpdate({
      target: [schema.buildGuides.buildId, schema.buildGuides.key],
      set: { doc, textLength: length, updatedAt: new Date() },
    })
    .returning({ updatedAt: schema.buildGuides.updatedAt });

  // The section now lives in the guide; clear the old plain-text note it replaces.
  const plan = owned[0].plan;
  if (key === "overview" && plan.notes) {
    await db().update(schema.builds).set({ plan: { ...plan, notes: "" } }).where(eq(schema.builds.id, buildId));
  }
  // Images taken out of this section are deleted, unless a guide still shows them.
  if (before[0]) {
    const removed = [...imageUrls(before[0].doc)].filter((u) => !images.has(u));
    if (removed.length) await deleteImagesIfUnused(removed);
  }
  if (level && plan.levels[level - 1]?.note) {
    const levels = plan.levels.map((lv, i) => (i === level - 1 ? { ...lv, note: "" } : lv));
    await db().update(schema.builds).set({ plan: { ...plan, levels } }).where(eq(schema.builds.id, buildId));
  }
  revalidatePath(`/b/${buildId}`);
  return { ok: true, value: { updatedAt: rows[0].updatedAt.toISOString() } };
}

export async function deleteBuild(id: string): Promise<void> {
  const userId = await requireUser();
  if (!userId || !isValidBuildId(id)) return;
  const gone = await db()
    .delete(schema.builds)
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)))
    .returning({ id: schema.builds.id });
  // Its guide rows went with it; now its images, unless a copy's guide still shows them.
  if (gone[0]) await deleteBuildImages(id);
  revalidatePath("/");
  revalidatePath("/me");
  redirect("/me");
}
