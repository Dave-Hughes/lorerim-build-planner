import "server-only";
import { and, asc, desc, eq, inArray, isNotNull, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/db";
import { isValidBuildId } from "@/lib/builds/ids";
import { imageHold } from "@/lib/builds/queries";
import { readPlan } from "@/lib/rules/convert";
import { currentVersion, isKnownVersion, requireGameData } from "@/lib/rules/server";
import { resolveLink } from "./links";
import { assemble, roman, type PlaythroughView, type SnapshotRow } from "./view";

/**
 * Reading playthroughs (WO-111). A private one is only its owner's: anyone else gets null, as for
 * builds, and the page 404s. A character has one visibility (WO-179 Part 2): its run's is the build's, whatever the run's own column holds.
 */

export type PlaythroughRow = typeof schema.playthroughs.$inferSelect;

export interface PlaythroughRecord extends PlaythroughRow {
  author: { name: string; handle: string | null };
  build: {
    id: string;
    name: string;
    levels: number;
    race: string;
    birthsign: string;
    deity: string | null;
    start: string;
    traits: string[];
    visibility: PlaythroughRow["visibility"];
    /** The character's one cover (WO-114): the build's, unless an admin holds it back. */
    coverImageUrl: string | null;
    coverFocus: { x: number; y: number } | null;
    /** The character's pronouns, when set (WO-179). */
    pronoun: "she" | "he" | "they" | null;
  } | null;
  snapshot: SnapshotRow | null;
  view: PlaythroughView;
}

export async function getPlaythrough(id: string, viewerId: string | null): Promise<PlaythroughRecord | null> {
  if (!isValidBuildId(id)) return null;
  const [row] = await db()
    .select({ p: schema.playthroughs, authorName: schema.users.name, authorHandle: schema.users.handle, characterVisibility: schema.builds.visibility })
    .from(schema.playthroughs)
    .innerJoin(schema.users, eq(schema.users.id, schema.playthroughs.ownerId))
    .leftJoin(schema.builds, eq(schema.builds.id, schema.playthroughs.buildId))
    .where(eq(schema.playthroughs.id, id))
    .limit(1);
  if (!row) return null;
  // The character's visibility is the run's (WO-179 Part 2); a run with no character yet has its own.
  const p = { ...row.p, visibility: row.characterVisibility ?? row.p.visibility };
  if (p.visibility === "private" && p.ownerId !== viewerId) return null;
  const [acts, chapters, snapshots, build] = await Promise.all([
    db().select().from(schema.playthroughActs).where(eq(schema.playthroughActs.playthroughId, p.id)).orderBy(asc(schema.playthroughActs.position)),
    db().select().from(schema.playthroughChapters).where(eq(schema.playthroughChapters.playthroughId, p.id)).orderBy(asc(schema.playthroughChapters.position)),
    db().select().from(schema.playthroughSnapshots).where(eq(schema.playthroughSnapshots.playthroughId, p.id)).limit(1),
    p.buildId
      ? db()
          .select({ id: schema.builds.id, name: schema.builds.name, plan: schema.builds.plan, visibility: schema.builds.visibility, ownerId: schema.builds.ownerId, coverImageUrl: schema.builds.coverImageUrl })
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
  // A cover waiting on an admin (WO-40) never reaches the page: the plain band instead.
  const held = b?.coverImageUrl && plan ? await imageHold(b.id, [b.coverImageUrl]) : null;
  const coverShown = b?.coverImageUrl && plan && !(held && (held.all || held.hidden.has(b.coverImageUrl))) ? b.coverImageUrl : null;
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
            visibility: b.visibility,
            coverImageUrl: coverShown,
            coverFocus: plan.coverFocus ?? null,
            pronoun: plan.pronoun ?? null,
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
  buildId: string | null;
  buildName: string | null;
  line: string;
  visibility: PlaythroughRow["visibility"];
  draftedBy: string | null;
  showDrafted: boolean;
  acts: number;
  currentAct: number;
  author: string;
  updatedAt: Date;
  run: RunSummary;
}

/** Cards for a grid: each one's act count and the act the player is in. */
/** A run's visibility, the character's (WO-179 Part 2), else its own. */
const runVisibility = sql<PlaythroughRow["visibility"]>`coalesce(${schema.builds.visibility}, ${schema.playthroughs.visibility})`;

async function cards(where: SQL | undefined, limit: number): Promise<PlaythroughCard[]> {
  const rows = await db()
    .select({
      id: schema.playthroughs.id,
      name: schema.playthroughs.name,
      line: schema.playthroughs.line,
      visibility: runVisibility,
      draftedBy: schema.playthroughs.draftedBy,
      showDrafted: schema.playthroughs.showDrafted,
      updatedAt: schema.playthroughs.updatedAt,
      author: schema.users.name,
      buildId: schema.playthroughs.buildId,
      buildName: sql<string | null>`(select b.name from ${schema.builds} b where b.id = ${schema.playthroughs.buildId})`,
      acts: sql<number>`(select count(*)::int from ${schema.playthroughActs} a where a.playthrough_id = ${schema.playthroughs.id})`,
    })
    .from(schema.playthroughs)
    .innerJoin(schema.users, eq(schema.users.id, schema.playthroughs.ownerId))
    .leftJoin(schema.builds, eq(schema.builds.id, schema.playthroughs.buildId))
    .where(where)
    .orderBy(desc(schema.playthroughs.updatedAt))
    .limit(limit);
  if (!rows.length) return [];
  // The act the player is in: the first with an objective not done. Worked out as the page does.
  const full = await Promise.all(rows.map((r) => runOf(r.id)));
  return rows.map((r, i) => ({ ...r, author: r.author ?? "Unknown", currentAct: full[i].act, run: full[i] }));
}

/** Where a run stands, for a card (WO-114): its act, place, level and day from the snapshot, and n of m done. */
export interface RunSummary {
  id: string;
  /** The act the player is in, 1 for Act I; 0 with no acts. */
  act: number;
  actName: string | null;
  /** How many acts the run has. */
  acts: number;
  place: string | null;
  level: number | null;
  day: number | null;
  done: number;
  total: number;
}

async function runOf(id: string): Promise<RunSummary> {
  const [acts, snapshots] = await Promise.all([
    db().select().from(schema.playthroughActs).where(eq(schema.playthroughActs.playthroughId, id)),
    db().select().from(schema.playthroughSnapshots).where(eq(schema.playthroughSnapshots.playthroughId, id)).limit(1),
  ]);
  const snap = (snapshots[0] as SnapshotRow | undefined) ?? null;
  const none = {
    id,
    act: 0,
    actName: null,
    place: null,
    level: snap?.level ?? null,
    day: snap?.day ?? null,
    done: 0,
    total: 0,
    acts: 0,
  };
  if (!acts.length) return none;
  const objectives = await db().select().from(schema.playthroughObjectives).where(inArray(schema.playthroughObjectives.actId, acts.map((a) => a.id)));
  const v = assemble({ acts, objectives, chapters: [], snapshot: snap, link: () => null });
  const cur = v.current;
  return { ...none, act: cur ? v.acts.indexOf(cur) + 1 : 0, actName: cur?.name ?? null, place: snap?.place || cur?.place || null, done: v.done, total: v.total, acts: v.acts.length };
}

/** Each of the player's builds with a run (WO-114): the build's id to its latest run's summary. */
export async function runsByBuild(userId: string): Promise<Map<string, RunSummary & { name: string }>> {
  const rows = await db()
    .select({ id: schema.playthroughs.id, buildId: schema.playthroughs.buildId, name: schema.playthroughs.name })
    .from(schema.playthroughs)
    .where(and(eq(schema.playthroughs.ownerId, userId), isNotNull(schema.playthroughs.buildId)))
    .orderBy(desc(schema.playthroughs.updatedAt));
  const out = new Map<string, RunSummary & { name: string }>();
  for (const r of rows) if (r.buildId && !out.has(r.buildId)) out.set(r.buildId, { ...(await runOf(r.id)), name: r.name });
  return out;
}

/** Of these builds, those with a Listed run (WO-154 Part 5): the build's id to its latest listed run's summary, for the public Characters page. */
export async function listedRunsByBuild(buildIds: string[]): Promise<Map<string, RunSummary & { name: string }>> {
  const out = new Map<string, RunSummary & { name: string }>();
  if (!buildIds.length) return out;
  const rows = await db()
    .select({ id: schema.playthroughs.id, buildId: schema.playthroughs.buildId, name: schema.playthroughs.name })
    .from(schema.playthroughs)
    .innerJoin(schema.builds, eq(schema.builds.id, schema.playthroughs.buildId))
    .where(and(inArray(schema.playthroughs.buildId, buildIds), eq(schema.builds.visibility, "public")))
    .orderBy(desc(schema.playthroughs.updatedAt));
  for (const r of rows) if (r.buildId && !out.has(r.buildId)) out.set(r.buildId, { ...(await runOf(r.id)), name: r.name });
  return out;
}

export const listMyPlaythroughs = (userId: string) => cards(eq(schema.playthroughs.ownerId, userId), 100);
export const listListedPlaythroughs = () => cards(sql`${runVisibility} = 'public'`, 60);

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

/** The character a run belongs to (WO-179 Part 2), for the old /p/ editor addresses; null for a run from before characters. */
export async function buildOfRun(id: string): Promise<string | null> {
  if (!isValidBuildId(id)) return null;
  const [r] = await db().select({ buildId: schema.playthroughs.buildId }).from(schema.playthroughs).where(eq(schema.playthroughs.id, id)).limit(1);
  return r?.buildId ?? null;
}

/** A build's run (WO-114), the latest, when the viewer may see it: the owner always, others while the character is Listed or Link only (its one visibility, WO-179 Part 2). */
export async function runOfBuild(buildId: string, viewerId: string | null) {
  const [r] = await db()
    .select({ id: schema.playthroughs.id, name: schema.playthroughs.name, ownerId: schema.playthroughs.ownerId, visibility: schema.builds.visibility })
    .from(schema.playthroughs)
    .innerJoin(schema.builds, eq(schema.builds.id, schema.playthroughs.buildId))
    .where(eq(schema.playthroughs.buildId, buildId))
    .orderBy(desc(schema.playthroughs.updatedAt))
    .limit(1);
  if (!r) return null;
  if (r.visibility === "private" && r.ownerId !== viewerId) return null;
  return r;
}

/** "Part of a run: Kyria Severa, Act I The Sister's House ›" (WO-114), when the viewer may see the run. */
export async function runLineOf(buildId: string, viewerId: string | null): Promise<{ id: string; name: string; act: string | null } | null> {
  const r = await runOfBuild(buildId, viewerId);
  if (!r) return null;
  const sum = await runOf(r.id);
  return { id: r.id, name: r.name, act: sum.act ? `Act ${roman(sum.act)} ${sum.actName ?? ""}`.trim() : null };
}
