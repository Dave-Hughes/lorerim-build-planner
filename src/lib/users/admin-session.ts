import "server-only";
import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { adminDiscordIds } from "./admin";

/** The session cookie's names: plain on localhost, __Secure- on https. */
export const SESSION_COOKIES = ["__Secure-authjs.session-token", "authjs.session-token"];

/** What the coming soon page asks of a session: is it an admin's, and has its player been let in early. */
export interface SessionAccess {
  admin: boolean;
  earlyAccessAt: Date | null;
}

/** Who passes the coming soon page (WO-84, WO-96): an admin, or someone let in early by an invite. */
export function passes(access: SessionAccess | null): boolean {
  return !!access && (access.admin || access.earlyAccessAt !== null);
}

/** One query for both: the live session's player, their early access, and whether their Discord account is an admin's. */
export async function sessionAccess(token: string): Promise<SessionAccess | null> {
  const ids = adminDiscordIds();
  const admin = ids.length
    ? sql<boolean>`exists(${db()
        .select({ one: sql`1` })
        .from(schema.accounts)
        .where(and(eq(schema.accounts.userId, schema.sessions.userId), eq(schema.accounts.provider, "discord"), inArray(schema.accounts.providerAccountId, ids)))})`
    : sql<boolean>`false`;
  const rows = await db()
    .select({ admin, earlyAccessAt: schema.users.earlyAccessAt })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.sessionToken, token), gt(schema.sessions.expires, new Date())))
    .limit(1);
  const r = rows[0];
  return r ? { admin: !!r.admin, earlyAccessAt: r.earlyAccessAt ?? null } : null;
}

/** Whether a session token gets past the coming soon page. `lookup` is for tests. */
export async function passesSession(token: string | undefined, lookup: (token: string) => Promise<SessionAccess | null> = sessionAccess): Promise<boolean> {
  if (!token) return false;
  return passes(await lookup(token));
}
