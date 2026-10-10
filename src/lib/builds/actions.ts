"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { newBuildId, isValidBuildId } from "./ids";
import { getBuild } from "./queries";
import { buildDetailsSchema, parseBuildPlan, type BuildDetails } from "./validate";
import { convertPlan, droppedSentence } from "@/lib/rules/convert";
import { currentVersion, isKnownVersion, requireGameData } from "@/lib/rules/server";

export type ActionResult<T = undefined> = { ok: true; value: T } | { ok: false; error: string };

async function requireUser(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function orNull(s: string): string | null {
  return s.trim() === "" ? null : s.trim();
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
  revalidatePath("/me");
  return { ok: true, value: { id: newId } };
}

/**
 * Copies a build made for an older LoreRim version into the signed-in user's builds,
 * moved to the current version. The original is never changed. `dropped` lists what
 * the current version doesn't have (empty when everything carried over).
 */
export async function copyBuildForVersion(id: string): Promise<ActionResult<{ id: string; dropped: string }>> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Sign in with Discord to copy a build." };
  const source = await getBuild(id, userId);
  if (!source) return { ok: false, error: "Unknown build." };
  if (!isKnownVersion(source.gameVersion)) return { ok: false, error: `LoreRim ${source.gameVersion} is no longer in the planner.` };
  const current = currentVersion();
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
  revalidatePath("/me");
  return { ok: true, value: { id: newId, dropped: dropped.length ? droppedSentence(current.id, dropped) : "" } };
}

export async function deleteBuild(id: string): Promise<void> {
  const userId = await requireUser();
  if (!userId || !isValidBuildId(id)) return;
  await db()
    .delete(schema.builds)
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)));
  revalidatePath("/");
  revalidatePath("/me");
  redirect("/me");
}
