import "server-only";
import { and, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { REPORTS_TO_HIDE } from "@/lib/moderation/reports";
import { docText, firstParagraph, isEmptyDoc } from "@/lib/guide/doc";
import { db, schema } from "@/db";
import { readPlan } from "@/lib/rules/convert";
import type { BuildPlan } from "@/lib/rules/types";
import { SAMPLE_BUILD_ID, isValidBuildId } from "./ids";
import { sampleBuild } from "./sample";
import type { BuildRecord, BuildSummary } from "./types";
import { isHandle } from "@/lib/users/handles";
import { assignHandle } from "@/lib/users/assign-handle";

const summaryFields = {
  id: schema.builds.id,
  name: schema.builds.name,
  description: schema.builds.description,
  coverImageUrl: schema.builds.coverImageUrl,
  visibility: schema.builds.visibility,
  gameVersion: schema.builds.gameVersion,
  race: sql<string>`${schema.builds.plan}->>'race'`,
  traits: sql<string[]>`${schema.builds.plan}->'traits'`,
  levels: sql<number>`jsonb_array_length(${schema.builds.plan}->'levels')`,
  videoId: sql<string | null>`${schema.builds.plan}->>'videoId'`,
  // Held back (WO-40): an admin hid it, or the build has enough open reports.
  coverHeld: sql<boolean>`(exists(select 1 from ${schema.hiddenImages} h where h.url = ${schema.builds.coverImageUrl}) or (select count(*) from ${schema.buildReports} r where r.build_id = ${schema.builds.id} and r.cleared_at is null) >= ${REPORTS_TO_HIDE})`,
  updatedAt: schema.builds.updatedAt,
  likeCount: schema.builds.likeCount,
  authorName: schema.users.name,
  authorImage: schema.users.image,
  authorHandle: schema.users.handle,
};

function summaries() {
  return db().select(summaryFields).from(schema.builds).innerJoin(schema.users, eq(schema.users.id, schema.builds.ownerId)).$dynamic();
}

type SummaryRow = Awaited<ReturnType<typeof summaries>>[number];

function toSummary(r: SummaryRow): BuildSummary {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    coverImageUrl: r.coverHeld ? null : r.coverImageUrl,
    coverHeld: !!(r.coverHeld && r.coverImageUrl),
    visibility: r.visibility,
    gameVersion: r.gameVersion,
    race: r.race,
    traits: r.traits ?? [],
    levels: Number(r.levels),
    updatedAt: r.updatedAt,
    author: { name: r.authorName ?? "Unknown", image: r.authorImage ?? null, handle: r.authorHandle ?? null },
    likeCount: Number(r.likeCount ?? 0),
    videoId: r.videoId ?? null,
  };
}

/**
 * The build featured on Browse (WO-39), with the start of its intro (the intro, else the guide's
 * first paragraph), or null. Only a Listed build counts.
 */
export async function getFeaturedBuild(): Promise<(BuildSummary & { intro: string }) | null> {
  const rows = await summaries()
    .where(and(eq(schema.builds.visibility, "public"), isNotNull(schema.builds.featuredAt)))
    .orderBy(desc(schema.builds.featuredAt))
    .limit(1);
  const build = rows[0] && toSummary(rows[0]);
  if (!build) return null;
  const guide = await db()
    .select({ key: schema.buildGuides.key, doc: schema.buildGuides.doc })
    .from(schema.buildGuides)
    .where(and(eq(schema.buildGuides.buildId, build.id), inArray(schema.buildGuides.key, ["intro", "overview"])));
  const intro = guide.find((g) => g.key === "intro" && !isEmptyDoc(g.doc))?.doc ?? firstParagraph(guide.find((g) => g.key === "overview")?.doc);
  return { ...build, intro: docText(intro).slice(0, 400) };
}

/** A build the viewer may see: public or unlisted for anyone, private only for its owner. */
export async function getBuild(id: string, viewerId: string | null): Promise<BuildRecord | null> {
  if (id === SAMPLE_BUILD_ID) return sampleBuild();
  if (!isValidBuildId(id)) return null;
  const rows = await db()
    .select({
      build: schema.builds,
      authorName: schema.users.name,
      authorImage: schema.users.image,
      authorHandle: schema.users.handle,
      tags: sql<string[]>`coalesce((select array_agg(bt.tag_slug order by t.sort) from ${schema.buildTags} bt join ${schema.tags} t on t.slug = bt.tag_slug where bt.build_id = ${schema.builds.id}), '{}')`,
      liked: viewerId
        ? sql<boolean>`exists(select 1 from ${schema.buildLikes} bl where bl.build_id = ${schema.builds.id} and bl.user_id = ${viewerId})`
        : sql<boolean>`false`,
    })
    .from(schema.builds)
    .innerJoin(schema.users, eq(schema.users.id, schema.builds.ownerId))
    .where(eq(schema.builds.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.build.visibility === "private" && row.build.ownerId !== viewerId) return null;
  return {
    ...row.build,
    plan: readPlan(row.build.plan as BuildPlan),
    author: { name: row.authorName ?? "Unknown", image: row.authorImage ?? null, handle: row.authorHandle ?? null },
    tags: row.tags ?? [],
    likeCount: row.build.likeCount,
    likedByViewer: !!row.liked,
  };
}

/**
 * Which of a build's images are held back (WO-40): all of them while it has 3 or more open reports,
 * else those an admin hid or removed.
 */
export async function imageHold(buildId: string, urls: string[]): Promise<{ all: boolean; hidden: Set<string> }> {
  const [reports, hidden] = await Promise.all([
    db()
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.buildReports)
      .where(and(eq(schema.buildReports.buildId, buildId), isNull(schema.buildReports.clearedAt))),
    urls.length ? db().select({ url: schema.hiddenImages.url }).from(schema.hiddenImages).where(inArray(schema.hiddenImages.url, urls)) : Promise.resolve([]),
  ]);
  return { all: (reports[0]?.n ?? 0) >= REPORTS_TO_HIDE, hidden: new Set(hidden.map((h) => h.url)) };
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

/**
 * The Listed builds a player has liked, newest like first, with when they liked each. Link-only and
 * private builds never show, even when liked.
 */
export async function listLikedBuilds(userId: string, limit = 60): Promise<(BuildSummary & { likedAt: Date })[]> {
  const rows = await db()
    .select({ ...summaryFields, likedAt: schema.buildLikes.createdAt })
    .from(schema.buildLikes)
    .innerJoin(schema.builds, eq(schema.builds.id, schema.buildLikes.buildId))
    .innerJoin(schema.users, eq(schema.users.id, schema.builds.ownerId))
    .where(and(eq(schema.buildLikes.userId, userId), eq(schema.builds.visibility, "public")))
    .orderBy(desc(schema.buildLikes.createdAt))
    .limit(limit);
  return rows.map((r) => ({ ...toSummary(r), likedAt: r.likedAt }));
}

/** The signed-in user's handle, set now if they have none yet (users from before handles). */
export async function handleFor(userId: string): Promise<string | null> {
  return assignHandle(db(), userId);
}

export interface BrowseQuery {
  /** Words to find in the name, description, author, race, traits, deity, birthsign and start. */
  q?: string;
  /** Tag slugs; a build must have all of them. */
  tags?: string[];
  race?: string;
  gameVersion?: string;
  sort?: "newest" | "liked";
  limit?: number;
}

/** Listed builds for Browse builds, filtered and sorted; `more` when there are more than `limit`. */
export async function searchBuilds(f: BrowseQuery): Promise<{ builds: BuildSummary[]; more: boolean }> {
  const limit = f.limit ?? 24;
  const where = [eq(schema.builds.visibility, "public")];
  if (f.gameVersion) where.push(eq(schema.builds.gameVersion, f.gameVersion));
  if (f.race) where.push(sql`${schema.builds.plan}->>'race' = ${f.race}`);
  const q = f.q?.trim();
  if (q) {
    // Every word must appear somewhere: "nord shield" finds a Nord with a shield.
    for (const word of q.split(/\s+/).slice(0, 8)) {
      const p = `%${word.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
      where.push(
        sql`(${schema.builds.name} ilike ${p} or ${schema.builds.description} ilike ${p} or ${schema.users.name} ilike ${p} or ${schema.builds.plan}->>'race' ilike ${p} or (${schema.builds.plan}->'traits')::text ilike ${p} or ${schema.builds.plan}->>'deity' ilike ${p} or ${schema.builds.plan}->>'birthsign' ilike ${p} or ${schema.builds.plan}->>'start' ilike ${p} or ${schema.builds.plan}->>'startOption' ilike ${p})`,
      );
    }
  }
  const tags = [...new Set(f.tags ?? [])];
  if (tags.length)
    where.push(
      sql`(select count(*) from ${schema.buildTags} bt where bt.build_id = ${schema.builds.id} and bt.tag_slug in (${sql.join(
        tags.map((t) => sql`${t}`),
        sql`, `,
      )})) = ${tags.length}`,
    );
  const order = f.sort === "liked" ? [desc(schema.builds.likeCount), desc(schema.builds.updatedAt)] : [desc(schema.builds.updatedAt)];
  const rows = await summaries()
    .where(and(...where))
    .orderBy(...order)
    .limit(limit + 1);
  return { builds: rows.slice(0, limit).map(toSummary), more: rows.length > limit };
}
