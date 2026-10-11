import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { BuildPlan } from "@/lib/rules/types";
import { SAMPLE_BUILD_ID, isValidBuildId } from "./ids";
import { sampleBuild } from "./sample";
import type { BuildRecord, BuildSummary } from "./types";
import { isHandle } from "@/lib/users/handles";
import { assignHandle } from "@/lib/users/assign-handle";

function summaries() {
  return db()
    .select({
      id: schema.builds.id,
      name: schema.builds.name,
      description: schema.builds.description,
      coverImageUrl: schema.builds.coverImageUrl,
      visibility: schema.builds.visibility,
      gameVersion: schema.builds.gameVersion,
      race: sql<string>`${schema.builds.plan}->>'race'`,
      traits: sql<string[]>`${schema.builds.plan}->'traits'`,
      levels: sql<number>`jsonb_array_length(${schema.builds.plan}->'levels')`,
      updatedAt: schema.builds.updatedAt,
      authorName: schema.users.name,
      authorImage: schema.users.image,
      authorHandle: schema.users.handle,
    })
    .from(schema.builds)
    .innerJoin(schema.users, eq(schema.users.id, schema.builds.ownerId))
    .$dynamic();
}

type SummaryRow = Awaited<ReturnType<typeof summaries>>[number];

function toSummary(r: SummaryRow): BuildSummary {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    coverImageUrl: r.coverImageUrl,
    visibility: r.visibility,
    gameVersion: r.gameVersion,
    race: r.race,
    traits: r.traits ?? [],
    levels: Number(r.levels),
    updatedAt: r.updatedAt,
    author: { name: r.authorName ?? "Unknown", image: r.authorImage ?? null, handle: r.authorHandle ?? null },
  };
}

/** A build the viewer may see: public or unlisted for anyone, private only for its owner. */
export async function getBuild(id: string, viewerId: string | null): Promise<BuildRecord | null> {
  if (id === SAMPLE_BUILD_ID) return sampleBuild();
  if (!isValidBuildId(id)) return null;
  const rows = await db()
    .select({ build: schema.builds, authorName: schema.users.name, authorImage: schema.users.image, authorHandle: schema.users.handle })
    .from(schema.builds)
    .innerJoin(schema.users, eq(schema.users.id, schema.builds.ownerId))
    .where(eq(schema.builds.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.build.visibility === "private" && row.build.ownerId !== viewerId) return null;
  return {
    ...row.build,
    plan: row.build.plan as BuildPlan,
    author: { name: row.authorName ?? "Unknown", image: row.authorImage ?? null, handle: row.authorHandle ?? null },
  };
}

/** Public builds, newest first; only those for `gameVersion` when one is given. */
export async function listPublicBuilds(gameVersion?: string, limit = 60): Promise<BuildSummary[]> {
  const rows = await summaries()
    .where(
      gameVersion
        ? and(eq(schema.builds.visibility, "public"), eq(schema.builds.gameVersion, gameVersion))
        : eq(schema.builds.visibility, "public"),
    )
    .orderBy(desc(schema.builds.updatedAt))
    .limit(limit);
  return rows.map(toSummary);
}

export async function listBuildsByOwner(ownerId: string): Promise<BuildSummary[]> {
  const rows = await summaries().where(eq(schema.builds.ownerId, ownerId)).orderBy(desc(schema.builds.updatedAt));
  return rows.map(toSummary);
}

/** A player's public face, by handle: name, avatar and handle only (never the email). */
export async function getPlayerByHandle(handle: string): Promise<{ id: string; name: string; image: string | null; handle: string } | null> {
  if (!isHandle(handle)) return null;
  const rows = await db()
    .select({ id: schema.users.id, name: schema.users.name, image: schema.users.image, handle: schema.users.handle })
    .from(schema.users)
    .where(eq(schema.users.handle, handle))
    .limit(1);
  const r = rows[0];
  return r ? { id: r.id, name: r.name ?? "Unknown", image: r.image ?? null, handle: r.handle! } : null;
}

/** A player's listed builds only, newest first: what anyone, the owner included, sees on /u/<handle>. */
export async function listListedBuildsByOwner(ownerId: string): Promise<BuildSummary[]> {
  const rows = await summaries()
    .where(and(eq(schema.builds.ownerId, ownerId), eq(schema.builds.visibility, "public")))
    .orderBy(desc(schema.builds.updatedAt));
  return rows.map(toSummary);
}

/** The signed-in user's handle, set now if they have none yet (users from before handles). */
export async function handleFor(userId: string): Promise<string | null> {
  return assignHandle(db(), userId);
}
