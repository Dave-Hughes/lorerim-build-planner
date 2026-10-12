import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";

/**
 * Admins (WO-39): Discord account ids listed in the ADMIN_DISCORD_IDS environment variable (comma
 * or space separated), set in Vercel and never committed. Empty or unset means no admins.
 */
export function adminDiscordIds(): string[] {
  return (process.env.ADMIN_DISCORD_IDS ?? "")
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** True when this user signed in with a Discord account on the admin list. */
export async function isAdmin(userId: string | null | undefined): Promise<boolean> {
  const ids = adminDiscordIds();
  if (!userId || !ids.length) return false;
  const rows = await db()
    .select({ id: schema.accounts.providerAccountId })
    .from(schema.accounts)
    .where(and(eq(schema.accounts.userId, userId), eq(schema.accounts.provider, "discord"), inArray(schema.accounts.providerAccountId, ids)))
    .limit(1);
  return rows.length > 0;
}
