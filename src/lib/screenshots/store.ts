import "server-only";
import { and, count, desc, eq, gt, inArray, isNotNull, or, sql } from "drizzle-orm";
import sharp from "sharp";
import { db, schema } from "@/db";
import { currentEnvironment } from "@/db/environments";
import { removeImages, storeImage, type ImageKind } from "@/lib/guide/images";
import { checkImage } from "@/lib/moderation/check";
import { newAccountHold } from "@/lib/moderation/limits";
import { isAdmin } from "@/lib/users/admin";
import { SHOT_THUMB, SHOT_WIDTH, SHOT_WORDS, SHOTS_A_DAY, SHOTS_WAITING, type ShotKind, type ShotStatus } from "./words";

/**
 * Screenshots of places and people (WO-184 Part 1). A player's upload is stored at full size and served at 1600 wide with a thumbnail. The nudity
 * check runs on every one: a refused screenshot is never stored. An approved player's (or an admin's) goes live at once; any other waits on an admin,
 * and only its uploader and the admins see it until then.
 */

export interface Shot {
  id: number;
  kind: ShotKind;
  key: string;
  url: string;
  thumbUrl: string;
  status: ShotStatus;
  lead: boolean;
  check: string;
  by: { id: string; name: string | null; image: string | null };
  at: Date;
  /** This viewer sent it. */
  mine: boolean;
  /** A player said it isn't this place (or person); an admin has not decided. */
  reported: string | null;
}

const prefix = (kind: ShotKind, key: string) => {
  const env = currentEnvironment();
  return `${env === "development" ? "dev" : env}/screenshots/${kind}/${key.replace(/[^a-zA-Z0-9_-]/g, "")}/`;
};

export async function isTrusted(userId: string): Promise<boolean> {
  if (await isAdmin(userId)) return true;
  const [row] = await db().select({ id: schema.trustedPlayers.userId }).from(schema.trustedPlayers).where(eq(schema.trustedPlayers.userId, userId)).limit(1);
  return !!row;
}

const cols = {
  id: schema.pageScreenshots.id,
  kind: schema.pageScreenshots.kind,
  key: schema.pageScreenshots.key,
  url: schema.pageScreenshots.url,
  thumbUrl: schema.pageScreenshots.thumbUrl,
  status: schema.pageScreenshots.status,
  lead: schema.pageScreenshots.lead,
  check: schema.pageScreenshots.check,
  at: schema.pageScreenshots.createdAt,
  reported: schema.pageScreenshots.reportNote,
  reportedAt: schema.pageScreenshots.reportedAt,
  userId: schema.pageScreenshots.userId,
  name: schema.users.name,
  image: schema.users.image,
};

type Row = { id: number; kind: ShotKind; key: string; url: string; thumbUrl: string; status: ShotStatus; lead: boolean; check: string; at: Date; reported: string | null; reportedAt: Date | null; userId: string; name: string | null; image: string | null };
const shape = (r: Row, viewer: string | null): Shot => ({
  id: r.id,
  kind: r.kind,
  key: r.key,
  url: r.url,
  thumbUrl: r.thumbUrl,
  status: r.status,
  lead: r.lead,
  check: r.check,
  by: { id: r.userId, name: r.name, image: r.image },
  at: r.at,
  mine: !!viewer && viewer === r.userId,
  reported: r.reportedAt ? (r.reported ?? "") : null,
});

/**
 * The screenshots of a page this viewer may see, leading one first: everyone sees the live ones, the uploader also sees theirs under review, and an
 * admin sees every one that is waiting or reported. The led one (an admin's choice), else the earliest live, leads.
 */
export async function shotsFor(kind: ShotKind, key: string, viewer: { id: string | null; admin: boolean }): Promise<Shot[]> {
  try {
    const rows = (await db()
      .select(cols)
      .from(schema.pageScreenshots)
      .leftJoin(schema.users, eq(schema.users.id, schema.pageScreenshots.userId))
      .where(and(eq(schema.pageScreenshots.kind, kind), eq(schema.pageScreenshots.key, key), inArray(schema.pageScreenshots.status, ["live", "review"])))
      .orderBy(schema.pageScreenshots.createdAt)) as Row[];
    const seen = rows.filter((r) => r.status === "live" || viewer.admin || (!!viewer.id && r.userId === viewer.id));
    const live = seen.filter((r) => r.status === "live");
    const led = live.find((r) => r.lead) ?? live[0];
    const ordered = [...(led ? [led] : []), ...seen.filter((r) => r !== led)];
    return ordered.map((r) => shape(r, viewer.id));
  } catch {
    // The table isn't there yet on this database: no screenshots.
    return [];
  }
}

export type AddResult = { ok: true; shot: Shot } | { ok: false; status: number; error: string };

/** Checks, resizes, stores and records one upload. The caller has checked the size, the type and the tick box. */
export async function addShot({ kind, key, userId, bytes, type, ext }: { kind: ShotKind; key: string; userId: string; bytes: Uint8Array; type: string; ext: ImageKind["ext"] }): Promise<AddResult> {
  const hold = await newAccountHold(userId);
  if (hold) return { ok: false, status: 403, error: hold };
  const [day] = await db()
    .select({ n: count() })
    .from(schema.pageScreenshots)
    .where(and(eq(schema.pageScreenshots.userId, userId), gt(schema.pageScreenshots.createdAt, sql`now() - interval '24 hours'`)));
  if (day.n >= SHOTS_A_DAY) return { ok: false, status: 429, error: SHOT_WORDS.dayLimit };
  const [waiting] = await db()
    .select({ n: count() })
    .from(schema.pageScreenshots)
    .where(and(eq(schema.pageScreenshots.userId, userId), eq(schema.pageScreenshots.status, "review")));
  if (waiting.n >= SHOTS_WAITING) return { ok: false, status: 429, error: SHOT_WORDS.waitingLimit };

  const { outcome, scores } = await checkImage(bytes, type);
  if (outcome === "refused") {
    await db().insert(schema.imageChecks).values({ uploaderId: userId, buildId: null, kind: "screenshot", scores, outcome, url: null });
    return { ok: false, status: 422, error: SHOT_WORDS.refused };
  }
  let big: Buffer;
  let small: Buffer;
  try {
    const image = sharp(bytes, { failOn: "none" }).rotate();
    big = await image.clone().resize({ width: SHOT_WIDTH, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
    small = await image.clone().resize({ width: SHOT_THUMB, withoutEnlargement: true }).jpeg({ quality: 78 }).toBuffer();
  } catch {
    return { ok: false, status: 415, error: SHOT_WORDS.notAShot };
  }
  const folder = prefix(kind, key);
  let originalUrl: string, url: string, thumbUrl: string;
  try {
    originalUrl = await storeImage("", bytes, { ext, type }, folder);
    url = await storeImage("", big, { ext: "jpg", type: "image/jpeg" }, folder);
    thumbUrl = await storeImage("", small, { ext: "jpg", type: "image/jpeg" }, folder);
  } catch {
    return { ok: false, status: 502, error: "The screenshot store didn't take it. Try again." };
  }
  // Live at once for an approved player's (or an admin's) screenshot unless the check flagged it; any other player's waits on an admin.
  // (When the check can't run, an approved player is not held up for it: the admin who approved them is the judgment.)
  const live = outcome !== "listed" && (await isTrusted(userId));
  const [row] = await db()
    .insert(schema.pageScreenshots)
    .values({ kind, key, originalUrl, url, thumbUrl, userId, status: live ? "live" : "review", check: outcome, scores })
    .returning({ id: schema.pageScreenshots.id });
  const [shot] = await shotsByIds([row.id], userId);
  return { ok: true, shot };
}

async function shotsByIds(ids: number[], viewer: string | null): Promise<Shot[]> {
  if (!ids.length) return [];
  const rows = (await db().select(cols).from(schema.pageScreenshots).leftJoin(schema.users, eq(schema.users.id, schema.pageScreenshots.userId)).where(inArray(schema.pageScreenshots.id, ids))) as Row[];
  return rows.map((r) => shape(r, viewer));
}

/** The screenshot, for a decision: its row, or null. */
export async function shotRow(id: number) {
  const [r] = await db().select().from(schema.pageScreenshots).where(eq(schema.pageScreenshots.id, id)).limit(1);
  return r ?? null;
}

/** Approve a waiting (or reported) screenshot; with `trust`, its sender's next ones go live at once. */
export async function approveShot(id: number, adminId: string, trust: boolean, pageName: string): Promise<boolean> {
  const row = await shotRow(id);
  if (!row || row.status === "removed") return false;
  await db().update(schema.pageScreenshots).set({ status: "live", reportNote: null, reportedBy: null, reportedAt: null, decidedBy: adminId, decidedAt: new Date() }).where(eq(schema.pageScreenshots.id, id));
  if (trust) await db().insert(schema.trustedPlayers).values({ userId: row.userId, addedBy: adminId, source: `a screenshot of ${pageName}` }).onConflictDoNothing();
  return true;
}

/** Take a screenshot off its page: it is never shown again, and its sender sees that it was removed. With `forGood`, its files go from the store too. */
export async function removeShot(id: number, by: string, forGood: boolean): Promise<boolean> {
  const row = await shotRow(id);
  if (!row || row.status === "removed") return false;
  await db().update(schema.pageScreenshots).set({ status: "removed", lead: false, reportNote: null, reportedBy: null, reportedAt: null, decidedBy: by, decidedAt: new Date() }).where(eq(schema.pageScreenshots.id, id));
  if (forGood) await removeImages([row.originalUrl, row.url, row.thumbUrl]);
  return true;
}

/** Make this screenshot lead its page (and no other); a waiting one is approved by it. */
export async function leadShot(id: number, adminId: string): Promise<boolean> {
  const row = await shotRow(id);
  if (!row || row.status === "removed") return false;
  await db().update(schema.pageScreenshots).set({ lead: false }).where(and(eq(schema.pageScreenshots.kind, row.kind), eq(schema.pageScreenshots.key, row.key)));
  // Making a waiting screenshot lead approves it: it becomes the hero.
  await db().update(schema.pageScreenshots).set({ lead: true, status: "live", reportNote: null, reportedBy: null, reportedAt: null, decidedBy: adminId, decidedAt: new Date() }).where(eq(schema.pageScreenshots.id, id));
  return true;
}

/** "This screenshot isn't this place": it goes back on the review list with the report; it stays up until an admin decides. */
export async function reportShot(id: number, userId: string, note: string): Promise<boolean> {
  const row = await shotRow(id);
  if (!row || row.status !== "live") return false;
  await db().update(schema.pageScreenshots).set({ reportNote: note.trim().slice(0, 300), reportedBy: userId, reportedAt: new Date() }).where(eq(schema.pageScreenshots.id, id));
  return true;
}

/** What this player sent, newest first, with what happened to each (/me). */
export async function shotsOf(userId: string) {
  const rows = (await db()
    .select(cols)
    .from(schema.pageScreenshots)
    .leftJoin(schema.users, eq(schema.users.id, schema.pageScreenshots.userId))
    .where(eq(schema.pageScreenshots.userId, userId))
    .orderBy(desc(schema.pageScreenshots.createdAt))
    .limit(100)) as Row[];
  return rows.map((r) => shape(r, userId));
}

/** The review list's screenshots: every one waiting, and every live one a player reported, newest first. */
export async function shotsToReview() {
  const rows = (await db()
    .select(cols)
    .from(schema.pageScreenshots)
    .leftJoin(schema.users, eq(schema.users.id, schema.pageScreenshots.userId))
    .where(or(eq(schema.pageScreenshots.status, "review"), and(eq(schema.pageScreenshots.status, "live"), isNotNull(schema.pageScreenshots.reportedAt))))
    .orderBy(desc(schema.pageScreenshots.createdAt))
    .limit(200)) as Row[];
  return rows.map((r) => shape(r, null));
}

export async function countShotsToReview(): Promise<number> {
  const [r] = await db()
    .select({ n: count() })
    .from(schema.pageScreenshots)
    .where(or(eq(schema.pageScreenshots.status, "review"), and(eq(schema.pageScreenshots.status, "live"), isNotNull(schema.pageScreenshots.reportedAt))));
  return r.n;
}
