import "server-only";
import { and, count, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { pageNamed } from "@/lib/pages/page-named";
import { TIP_LINK_MAX, TIP_MAX, TIP_WORDS, TIPS_A_DAY, TIPS_AN_HOUR, type TipHow, type TipKind, type TipType } from "./words";

/**
 * What players tell the planner (WO-184 Part 2). A tip waits on an admin; nothing reaches a page until it is approved, and every decision keeps who made it and when.
 */
export class TipError extends Error {}

export interface TipInput {
  userId: string;
  kind: TipKind;
  key: string;
  type: TipType;
  field: string;
  words: string;
  how: TipHow;
  link?: string | null;
  screenshotUrl?: string | null;
}

export async function fileTip(input: TipInput): Promise<{ id: number }> {
  if (!pageNamed(input.kind, input.key)) throw new TipError(TIP_WORDS.gone);
  const words = input.words.replace(/\s+/g, " ").trim();
  if (!words) throw new TipError(TIP_WORDS.needWords);
  if (words.length > TIP_MAX) throw new TipError(TIP_WORDS.tooLong);
  const [hour] = await db().select({ n: count() }).from(schema.pageTips).where(and(eq(schema.pageTips.userId, input.userId), gt(schema.pageTips.createdAt, sql`now() - interval '1 hour'`)));
  const [day] = await db().select({ n: count() }).from(schema.pageTips).where(and(eq(schema.pageTips.userId, input.userId), gt(schema.pageTips.createdAt, sql`now() - interval '24 hours'`)));
  if (hour.n >= TIPS_AN_HOUR || day.n >= TIPS_A_DAY) throw new TipError(TIP_WORDS.limit);
  const link = (input.link ?? "").trim().slice(0, TIP_LINK_MAX);
  const [row] = await db()
    .insert(schema.pageTips)
    .values({
      kind: input.kind,
      key: input.key,
      type: input.type,
      field: input.field.trim().slice(0, 120),
      words,
      how: input.how,
      link: input.how === "other" && /^https?:\/\//i.test(link) ? link : null,
      screenshotUrl: input.screenshotUrl ?? null,
      userId: input.userId,
    })
    .returning({ id: schema.pageTips.id });
  return row;
}

/** The fields this player has already told a page about, waiting or taken (for "Sent. Thanks."). */
export async function sentFields(kind: TipKind, key: string, userId: string | null): Promise<string[]> {
  if (!userId) return [];
  try {
    const rows = await db()
      .select({ field: schema.pageTips.field })
      .from(schema.pageTips)
      .where(and(eq(schema.pageTips.kind, kind), eq(schema.pageTips.key, key), eq(schema.pageTips.userId, userId), eq(schema.pageTips.type, "know"), inArray(schema.pageTips.status, ["new", "approved"])));
    return rows.map((r) => r.field);
  } catch {
    return [];
  }
}

export interface Answered {
  field: string;
  words: string;
  by: string;
  at: Date;
}

/** What admins approved for a page: each answers one Not sure yet line, as a player's report. The newest answer to a field wins. */
export async function answeredFor(kind: TipKind, key: string): Promise<Answered[]> {
  try {
    const rows = await db()
      .select({ field: schema.pageTips.field, words: schema.pageTips.words, shown: schema.pageTips.shown, name: schema.users.name, at: schema.pageTips.decidedAt, made: schema.pageTips.createdAt })
      .from(schema.pageTips)
      .innerJoin(schema.users, eq(schema.users.id, schema.pageTips.userId))
      .where(and(eq(schema.pageTips.kind, kind), eq(schema.pageTips.key, key), eq(schema.pageTips.type, "know"), eq(schema.pageTips.status, "approved")))
      .orderBy(desc(schema.pageTips.decidedAt));
    const seen = new Set<string>();
    const out: Answered[] = [];
    for (const r of rows) {
      const f = r.field.toLowerCase();
      if (seen.has(f)) continue;
      seen.add(f);
      out.push({ field: r.field, words: r.shown || r.words, by: r.name ?? "A player", at: r.at ?? r.made });
    }
    return out;
  } catch {
    return [];
  }
}

export interface TipRow {
  id: number;
  kind: TipKind;
  key: string;
  type: TipType;
  field: string;
  words: string;
  how: TipHow;
  link: string | null;
  screenshotUrl: string | null;
  status: string;
  reading: { words: string; fits: string; confidence: string; model: string; at: string } | null;
  at: Date;
  by: string;
}

const tipCols = {
  id: schema.pageTips.id,
  kind: schema.pageTips.kind,
  key: schema.pageTips.key,
  type: schema.pageTips.type,
  field: schema.pageTips.field,
  words: schema.pageTips.words,
  how: schema.pageTips.how,
  link: schema.pageTips.link,
  screenshotUrl: schema.pageTips.screenshotUrl,
  status: schema.pageTips.status,
  reading: schema.pageTips.reading,
  at: schema.pageTips.createdAt,
  by: schema.users.name,
};

/** The tips waiting on an admin, newest first. */
export async function tipsToReview(): Promise<TipRow[]> {
  const rows = await db().select(tipCols).from(schema.pageTips).innerJoin(schema.users, eq(schema.users.id, schema.pageTips.userId)).where(eq(schema.pageTips.status, "new")).orderBy(desc(schema.pageTips.createdAt)).limit(200);
  return rows.map((r) => ({ ...r, by: r.by ?? "A player" }));
}

export async function countTipsToReview(): Promise<number> {
  const [r] = await db().select({ n: count() }).from(schema.pageTips).where(eq(schema.pageTips.status, "new"));
  return r.n;
}

/** What this player sent, newest first (/me). */
export async function tipsOf(userId: string): Promise<TipRow[]> {
  const rows = await db().select(tipCols).from(schema.pageTips).innerJoin(schema.users, eq(schema.users.id, schema.pageTips.userId)).where(eq(schema.pageTips.userId, userId)).orderBy(desc(schema.pageTips.createdAt)).limit(100);
  return rows.map((r) => ({ ...r, by: r.by ?? "A player" }));
}

/** An admin's decision on a tip: who and when are kept. `shown` is the admin's edit of the player's words, for an approval. */
export async function decideTip(id: number, adminId: string, status: "approved" | "rejected" | "fixed" | "sent" | "not a mistake", shown?: string): Promise<boolean> {
  const rows = await db()
    .update(schema.pageTips)
    .set({ status, decidedBy: adminId, decidedAt: new Date(), ...(shown?.trim() ? { shown: shown.trim().slice(0, TIP_MAX) } : {}) })
    .where(and(eq(schema.pageTips.id, id), eq(schema.pageTips.status, "new")))
    .returning({ id: schema.pageTips.id });
  return rows.length > 0;
}

/** Every Not sure yet line an admin has taken a player's word on, as "kind:key:field" in lower case: Help fill the gaps leaves those lines out. */
export async function answeredSet(): Promise<Set<string>> {
  try {
    const rows = await db().select({ kind: schema.pageTips.kind, key: schema.pageTips.key, field: schema.pageTips.field }).from(schema.pageTips).where(and(eq(schema.pageTips.type, "know"), eq(schema.pageTips.status, "approved")));
    return new Set(rows.map((r) => `${r.kind}:${r.key}:${r.field.toLowerCase()}`));
  } catch {
    return new Set();
  }
}
