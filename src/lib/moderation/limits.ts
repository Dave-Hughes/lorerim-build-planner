import "server-only";
import { createHash } from "node:crypto";
import { and, count, eq, gt, lt, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { newAccountMessage, newAccountUntil } from "./age";

/**
 * Per-account limits (WO-40), counted in the database over a rolling window. New builds (copies too)
 * count the account's builds; reports count its reports; uploads and likes count rate_event rows.
 */
export const LIMITS = {
  build: { max: 10, hours: 24 },
  upload: { max: 20, hours: 24 },
  like: { max: 60, hours: 1 },
  report: { max: 10, hours: 24 },
} as const;
export type LimitKind = keyof typeof LIMITS;

export const DAY_LIMIT_MESSAGE = "That's a lot for one day. Try again tomorrow.";
export const HOUR_LIMIT_MESSAGE = "That's a lot for one hour. Try again in an hour.";

/** The message when this account is over its limit for `kind`, else null. */
export async function overLimit(userId: string, kind: LimitKind): Promise<string | null> {
  const { max, hours } = LIMITS[kind];
  const since = sql`now() - make_interval(hours => ${hours})`;
  let n: number;
  if (kind === "build") {
    const [r] = await db().select({ n: count() }).from(schema.builds).where(and(eq(schema.builds.ownerId, userId), gt(schema.builds.createdAt, since)));
    n = r.n;
  } else if (kind === "report") {
    const [r] = await db().select({ n: count() }).from(schema.buildReports).where(and(eq(schema.buildReports.reporterId, userId), gt(schema.buildReports.createdAt, since)));
    n = r.n;
  } else {
    const [r] = await db()
      .select({ n: count() })
      .from(schema.rateEvents)
      .where(and(eq(schema.rateEvents.userId, userId), eq(schema.rateEvents.kind, kind), gt(schema.rateEvents.at, since)));
    n = r.n;
  }
  return n >= max ? (hours === 1 ? HOUR_LIMIT_MESSAGE : DAY_LIMIT_MESSAGE) : null;
}

/** Counts an upload or a like, and clears this account's events older than two days (they no longer count). */
export async function recordEvent(userId: string, kind: "upload" | "like") {
  await db().batch([
    db().insert(schema.rateEvents).values({ userId, kind }),
    db()
      .delete(schema.rateEvents)
      .where(and(eq(schema.rateEvents.userId, userId), lt(schema.rateEvents.at, sql`now() - interval '2 days'`))),
  ]);
}

/** Null when this account may list builds and upload images; else why not (a Discord account under 7 days old). */
export async function newAccountHold(userId: string): Promise<string | null> {
  const [row] = await db()
    .select({ id: schema.accounts.providerAccountId })
    .from(schema.accounts)
    .where(and(eq(schema.accounts.userId, userId), eq(schema.accounts.provider, "discord")))
    .limit(1);
  const until = newAccountUntil(row?.id ?? null);
  return until ? newAccountMessage(until) : null;
}

/** Limits per IP for callers with no account (WO-108, WO-109): calls a minute. */
/** `mcp-write` counts by player, not IP (WO-110): an assistant's writes to one account. */
export const IP_LIMITS = { mcp: 60, oauth: 30, "mcp-write": 30 } as const;
export const MCP_CALLS_A_MINUTE = IP_LIMITS.mcp;
export const MCP_LIMIT_MESSAGE = "Too many calls. Try again in a minute.";

/** What's stored for a caller: a SHA-256 of their IP, never the IP. */
export const ipSubject = (kind: keyof typeof IP_LIMITS, ip: string) => createHash("sha256").update(`${kind}:${ip}`).digest("hex");
export const mcpSubject = (ip: string) => ipSubject("mcp", ip);

/**
 * Counts one call of `kind` from `ip` and says whether it's over the limit: the message for the call
 * past it in a minute, else null. A call over the limit isn't counted, and events older than an hour go.
 */
export async function ipCall(kind: keyof typeof IP_LIMITS, ip: string): Promise<string | null> {
  const subject = ipSubject(kind, ip);
  const [r] = await db()
    .select({ n: count() })
    .from(schema.rateEvents)
    .where(and(eq(schema.rateEvents.subject, subject), eq(schema.rateEvents.kind, kind), gt(schema.rateEvents.at, sql`now() - interval '1 minute'`)));
  if (r.n >= IP_LIMITS[kind]) return MCP_LIMIT_MESSAGE;
  await db().batch([
    db().insert(schema.rateEvents).values({ subject, kind }),
    db()
      .delete(schema.rateEvents)
      .where(and(eq(schema.rateEvents.subject, subject), eq(schema.rateEvents.kind, kind), lt(schema.rateEvents.at, sql`now() - interval '1 hour'`))),
  ]);
  return null;
}

/** The MCP route's limit: 60 calls a minute per IP. */
export const mcpCall = (ip: string) => ipCall("mcp", ip);
