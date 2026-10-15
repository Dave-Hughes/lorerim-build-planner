import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "@/db";
import { isAdmin } from "./admin";

/** The session cookie's names: plain on localhost, __Secure- on https. */
export const SESSION_COOKIES = ["__Secure-authjs.session-token", "authjs.session-token"];

/** Whether a session token belongs to a signed-in admin (WO-84: admins see the app behind the coming soon page). */
export async function isAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const rows = await db()
    .select({ userId: schema.sessions.userId })
    .from(schema.sessions)
    .where(and(eq(schema.sessions.sessionToken, token), gt(schema.sessions.expires, new Date())))
    .limit(1);
  return isAdmin(rows[0]?.userId);
}
