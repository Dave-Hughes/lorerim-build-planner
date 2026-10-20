import "server-only";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { isValidBuildId } from "@/lib/builds/ids";
import { readPlan } from "@/lib/rules/convert";
import { currentVersion, isKnownVersion, requireGameData } from "@/lib/rules/server";
import { resolveLink } from "./links";
import { assemble, type PlaythroughView, type SnapshotRow } from "./view";

/**
 * Reading playthroughs (WO-111). A private one is only its owner's: anyone else gets null, as for
 * builds, and the page 404s.
 */

export type PlaythroughRow = typeof schema.playthroughs.$inferSelect;

export interface PlaythroughRecord extends PlaythroughRow {
  author: { name: string; handle: string | null };
  build: { id: string; name: string; levels: number; race: string; birthsign: string; deity: string | null; start: string; traits: string[] } | null;
  snapshot: SnapshotRow | null;
  view: PlaythroughView;
}

export async function getPlaythrough(id: string, viewerId: string | null): Promise<PlaythroughRecord | null> {
  if (!isValidBuildId(id)) return null;
  const [row] = await db()
    .select({ p: schema.playthroughs, authorName: schema.users.name, authorHandle: schema.users.handle })
    .from(schema.playthroughs)
    .innerJoin(schema.users, eq(schema.users.id, schema.playthroughs.ownerId))
    .where(eq(schema.playthroughs.id, id))
    .limit(1);
  if (!row) return null;
  const p = row.p;
  if (p.visibility === "private" && p.ownerId !== viewerId) return null;
  const [acts, chapters, snapshots, build] = await Promise.all([
    db().select().from(schema.playthroughActs).where(eq(schema.playthroughActs.playthroughId, p.id)).orderBy(asc(schema.playthroughActs.position)),
    db().select().from(schema.playthroughChapters).where(eq(schema.playthroughChapters.playthroughId, p.id)).orderBy(asc(schema.playthroughChapters.position)),
    db().select().from(schema.playthroughSnapshots).where(eq(schema.playthroughSnapshots.playthroughId, p.id)).limit(1),
    p.buildId
      ? db()
          .select({ id: schema.builds.id, name: schema.builds.name, plan: schema.builds.plan, visibility: schema.builds.visibility, ownerId: schema.builds.ownerId })
          .from(schema.builds)
          .where(eq(schema.builds.id, p.buildId))
          .limit(1)
      : Promise.resolve([]),
  ]);
  const objectives = acts.length
    ? await db()
        .select()
        .from(schema.playthroughObjectives)
        .where(inArray(schema.playthroughObjectives.actId, acts.map((a) => a.id)))
        .orderBy(asc(schema.playthroughObjectives.position))
    : [];
  const d = requireGameData(isKnownVersion(p.gameVersion) ? p.gameVersion : currentVersion().id);
  const snapshot = (snapshots[0] as SnapshotRow | undefined) ?? null;
  // The build shows only when the reader could open it too.
  const b = build[0];
  const plan = b && (b.visibility !== "private" || b.ownerId === viewerId) ? readPlan(b.plan) : null;
  return {
    ...p,
    author: { name: row.authorName ?? "Unknown", handle: row.authorHandle ?? null },
    build:
      b && plan
        ? {
            id: b.id,
            name: b.name,
            levels: plan.levels.length,
            race: plan.race,
            birthsign: plan.birthsign,
            deity: plan.deity ?? null,
            start: [plan.start, plan.startOption].filter(Boolean).join(", "),
            traits: plan.traits ?? [],
          }
        : null,
    snapshot,
    view: assemble({
      acts,
      objectives,
      chapters,
      snapshot,
      link: (l) => {
        const r = resolveLink(d, l);
        return r ? { tag: r.tag, name: r.name, href: r.href } : null;
      },
    }),
  };
}

export interface PlaythroughCard {
  id: string;
  name: string;
  line: string;
  visibility: PlaythroughRow["visibility"];
  draftedBy: string | null;
  showDrafted: boolean;
  acts: number;
  currentAct: number;
  author: string;
  updatedAt: Date;
}

/** Cards for a grid: each one's act count and the act the player is in. */
async function cards(where: ReturnType<typeof eq> | ReturnType<typeof and>, limit: number): Promise<PlaythroughCard[]> {
  const rows = await db()
    .select({
      id: schema.playthroughs.id,
      name: schema.playthroughs.name,
      line: schema.playthroughs.line,
      visibility: schema.playthroughs.visibility,
      draftedBy: schema.playthroughs.draftedBy,
      showDrafted: schema.playthroughs.showDrafted,
      updatedAt: schema.playthroughs.updatedAt,
      author: schema.users.name,
      acts: sql<number>`(select count(*)::int from ${schema.playthroughActs} a where a.playthrough_id = ${schema.playthroughs.id})`,
    })
    .from(schema.playthroughs)
    .innerJoin(schema.users, eq(schema.users.id, schema.playthroughs.ownerId))
    .where(where)
    .orderBy(desc(schema.playthroughs.updatedAt))
    .limit(limit);
  if (!rows.length) return [];
  // The act the player is in: the first with an objective not done. Worked out as the page does.
  const full = await Promise.all(rows.map((r) => currentActOf(r.id)));
  return rows.map((r, i) => ({ ...r, author: r.author ?? "Unknown", currentAct: full[i] }));
}

async function currentActOf(id: string): Promise<number> {
  const [acts, snapshots] = await Promise.all([
    db().select().from(schema.playthroughActs).where(eq(schema.playthroughActs.playthroughId, id)),
    db().select().from(schema.playthroughSnapshots).where(eq(schema.playthroughSnapshots.playthroughId, id)).limit(1),
  ]);
  if (!acts.length) return 0;
  const objectives = await db().select().from(schema.playthroughObjectives).where(inArray(schema.playthroughObjectives.actId, acts.map((a) => a.id)));
  const v = assemble({ acts, objectives, chapters: [], snapshot: (snapshots[0] as SnapshotRow | undefined) ?? null, link: () => null });
  return v.current ? v.acts.indexOf(v.current) + 1 : 0;
}

export const listMyPlaythroughs = (userId: string) => cards(eq(schema.playthroughs.ownerId, userId), 100);
export const listListedPlaythroughs = () => cards(eq(schema.playthroughs.visibility, "public"), 60);

/** The player's own builds, for the playthrough's Build picker. */
export async function myBuildChoices(userId: string) {
  return db().select({ id: schema.builds.id, name: schema.builds.name }).from(schema.builds).where(eq(schema.builds.ownerId, userId)).orderBy(desc(schema.builds.updatedAt)).limit(100);
}

/** Whether a playthrough with this id is the viewer's (for actions and uploads). */
export async function isOwner(userId: string, id: string): Promise<boolean> {
  const [r] = await db()
    .select({ id: schema.playthroughs.id })
    .from(schema.playthroughs)
    .where(and(eq(schema.playthroughs.id, id), eq(schema.playthroughs.ownerId, userId)))
    .limit(1);
  return !!r;
}
