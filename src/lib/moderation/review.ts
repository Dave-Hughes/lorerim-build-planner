import "server-only";
import { desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { REPORT_REASONS } from "./reports";
import { countShotsToReview } from "@/lib/screenshots/store";
import { countTipsToReview } from "@/lib/tips/store";

async function countPlayerReview(): Promise<number> {
  const [shots, tips, reports] = await Promise.all([countShotsToReview(), countTipsToReview(), db().select({ n: sql<number>`count(*)::int` }).from(schema.questReports).where(eq(schema.questReports.status, "new"))]);
  return shots + tips + (reports[0]?.n ?? 0);
}

export interface ReviewImage {
  kind: "image";
  id: number;
  at: Date;
  url: string;
  outcome: "listed" | "unchecked";
  scores: Record<string, number> | null;
  uploader: string;
  /** The build it shows on, when one does. */
  build: { id: string; name: string } | null;
}

export interface ReviewBuild {
  kind: "build";
  at: Date;
  build: { id: string; name: string; cover: string | null; owner: string };
  reports: { reason: string; note: string; by: string; at: Date }[];
}

/** How many things wait on the admins: listed or unchecked images, and builds with open reports. */
export async function countOpenReview(): Promise<number> {
  const [images, builds] = await Promise.all([
    db().select({ n: sql<number>`count(*)::int` }).from(schema.imageChecks).where(eq(schema.imageChecks.review, "open")),
    db().select({ n: sql<number>`count(distinct ${schema.buildReports.buildId})::int` }).from(schema.buildReports).where(isNull(schema.buildReports.clearedAt)),
  ]);
  // WO-184: what players know and the screenshots waiting are on the same list.
  const extra = await countPlayerReview().catch(() => 0);
  return (images[0]?.n ?? 0) + (builds[0]?.n ?? 0) + extra;
}

/** The review list (WO-40): images the check listed or couldn't check, and reported builds, newest first. */
export async function listOpenReview(): Promise<(ReviewImage | ReviewBuild)[]> {
  const images = await db()
    .select({
      id: schema.imageChecks.id,
      at: schema.imageChecks.createdAt,
      url: schema.imageChecks.url,
      outcome: schema.imageChecks.outcome,
      scores: schema.imageChecks.scores,
      uploader: schema.users.name,
      buildId: sql<string | null>`coalesce(${schema.imageChecks.buildId}, (select b.id from ${schema.builds} b where b.cover_image_url = ${schema.imageChecks.url} limit 1))`,
    })
    .from(schema.imageChecks)
    .leftJoin(schema.users, eq(schema.users.id, schema.imageChecks.uploaderId))
    .where(eq(schema.imageChecks.review, "open"))
    .orderBy(desc(schema.imageChecks.createdAt))
    .limit(200);
  const reports = await db()
    .select({
      buildId: schema.buildReports.buildId,
      reason: schema.buildReports.reason,
      note: schema.buildReports.note,
      at: schema.buildReports.createdAt,
      by: schema.users.name,
    })
    .from(schema.buildReports)
    .innerJoin(schema.users, eq(schema.users.id, schema.buildReports.reporterId))
    .where(isNull(schema.buildReports.clearedAt))
    .orderBy(desc(schema.buildReports.createdAt));
  const buildIds = [...new Set([...reports.map((r) => r.buildId), ...images.flatMap((i) => (i.buildId ? [i.buildId] : []))])];
  const builds = buildIds.length
    ? await db()
        .select({ id: schema.builds.id, name: schema.builds.name, cover: schema.builds.coverImageUrl, owner: schema.users.name })
        .from(schema.builds)
        .innerJoin(schema.users, eq(schema.users.id, schema.builds.ownerId))
        .where(inArray(schema.builds.id, buildIds))
    : [];
  const byId = new Map(builds.map((b) => [b.id, b]));
  const label = (reason: string) => REPORT_REASONS.find((r) => r.id === reason)?.label ?? reason;
  const out: (ReviewImage | ReviewBuild)[] = images.flatMap((i) =>
    i.url
      ? [
          {
            kind: "image" as const,
            id: i.id,
            at: i.at,
            url: i.url,
            outcome: i.outcome === "listed" ? ("listed" as const) : ("unchecked" as const),
            scores: i.scores,
            uploader: i.uploader ?? "Unknown",
            build: i.buildId && byId.get(i.buildId) ? { id: i.buildId, name: byId.get(i.buildId)!.name } : null,
          },
        ]
      : [],
  );
  const grouped = new Map<string, ReviewBuild>();
  for (const r of reports) {
    const b = byId.get(r.buildId);
    if (!b) continue;
    const item = grouped.get(r.buildId) ?? { kind: "build" as const, at: r.at, build: { id: b.id, name: b.name, cover: b.cover, owner: b.owner ?? "Unknown" }, reports: [] };
    item.reports.push({ reason: label(r.reason), note: r.note, by: r.by ?? "Unknown", at: r.at });
    grouped.set(r.buildId, item);
  }
  out.push(...grouped.values());
  return out.sort((a, b) => b.at.getTime() - a.at.getTime());
}

