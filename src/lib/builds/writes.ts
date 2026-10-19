import "server-only";
import { and, eq, like, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { BuildPlan } from "@/lib/rules/types";
import { newBuildId } from "./ids";
import type { BuildDetails } from "./validate";

/**
 * A build's writes, shared by the site's actions and the assistant's tools (WO-110), so both save the
 * same way. Callers check the player, the limits and the input first (parseBuildPlan,
 * buildDetailsSchema); these only write, and only to the owner's builds.
 */

const orNull = (s: string): string | null => (s.trim() === "" ? null : s.trim());

/** Replaces a build's tags, all at once (one batch). The caller has checked ownership. */
export async function setTags(buildId: string, slugs: string[]) {
  const unique = [...new Set(slugs)];
  const del = db().delete(schema.buildTags).where(eq(schema.buildTags.buildId, buildId));
  if (unique.length) await db().batch([del, db().insert(schema.buildTags).values(unique.map((tagSlug) => ({ buildId, tagSlug })))]);
  else await del;
}

/** A new build for `userId`; `draftedBy` names the assistant when one of its tools made it. */
export async function insertBuild(userId: string, details: BuildDetails, plan: BuildPlan, draftedBy: string | null = null): Promise<string> {
  const id = newBuildId();
  await db()
    .insert(schema.builds)
    .values({
      id,
      ownerId: userId,
      name: details.name,
      description: details.description,
      coverImageUrl: orNull(details.coverImageUrl),
      writeupUrl: orNull(details.writeupUrl),
      visibility: details.visibility,
      gameVersion: plan.gameVersion,
      plan,
      draftedBy,
    });
  if (details.tags) await setTags(id, details.tags);
  return id;
}

/** Saves a build's choices; null when it isn't this player's. Notes for levels it no longer has go with them. */
export async function writePlan(userId: string, id: string, plan: BuildPlan): Promise<Date | null> {
  const rows = await db()
    .update(schema.builds)
    .set({ plan, gameVersion: plan.gameVersion })
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)))
    .returning({ updatedAt: schema.builds.updatedAt });
  if (!rows[0]) return null;
  await db()
    .delete(schema.buildGuides)
    .where(and(eq(schema.buildGuides.buildId, id), like(schema.buildGuides.key, "level:%"), sql`substring(${schema.buildGuides.key} from 7)::int > ${plan.levels.length}`));
  return rows[0].updatedAt;
}

/** Saves name, description, links and visibility (and tags when given); false when it isn't this player's. */
export async function writeDetails(userId: string, id: string, details: BuildDetails, extra: { showDrafted?: boolean } = {}): Promise<boolean> {
  const rows = await db()
    .update(schema.builds)
    .set({
      name: details.name,
      description: details.description,
      coverImageUrl: orNull(details.coverImageUrl),
      writeupUrl: orNull(details.writeupUrl),
      visibility: details.visibility,
      // Only Listed builds can be featured (WO-39).
      ...(details.visibility === "public" ? {} : { featuredAt: null }),
      ...(extra.showDrafted === undefined ? {} : { showDrafted: extra.showDrafted }),
    })
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)))
    .returning({ id: schema.builds.id });
  if (!rows[0]) return false;
  if (details.tags) await setTags(id, details.tags);
  return true;
}
