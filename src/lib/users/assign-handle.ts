import { and, eq, isNull, like, or } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "@/db/schema";
import { freeHandle, handleBase } from "./handles";

type AnyDb = PgDatabase<PgQueryResultHKT, typeof schema>;

/**
 * Gives a user a handle if they have none; returns their handle. Never changes one already set, so
 * shared /u/ links keep working when a Discord name changes. Used at sign-in and by the backfill.
 */
export async function assignHandle(database: AnyDb, userId: string): Promise<string | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const [user] = await database.select({ name: schema.users.name, handle: schema.users.handle }).from(schema.users).where(eq(schema.users.id, userId)).limit(1);
    if (!user) return null;
    if (user.handle) return user.handle;
    const base = handleBase(user.name);
    const rows = await database
      .select({ handle: schema.users.handle })
      .from(schema.users)
      .where(or(eq(schema.users.handle, base), like(schema.users.handle, `${base.slice(0, 27)}%-%`)));
    const handle = freeHandle(base, new Set(rows.map((r) => r.handle!).filter(Boolean)));
    try {
      // Only where it's still empty: two sign-ins at once can't overwrite each other.
      const done = await database
        .update(schema.users)
        .set({ handle })
        .where(and(eq(schema.users.id, userId), isNull(schema.users.handle)))
        .returning({ handle: schema.users.handle });
      if (done[0]) return done[0].handle;
    } catch {
      // Someone else took that handle a moment ago: look again.
    }
  }
  return null;
}
