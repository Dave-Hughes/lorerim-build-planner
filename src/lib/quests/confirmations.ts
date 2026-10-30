import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type ConfirmKind = "quest" | "person" | "place";

/** The players who confirmed a page (WO-154 Part 3), earliest first: their Discord names, and whether this one is among them. */
export async function confirmationsOf(kind: ConfirmKind, key: string, userId: string | null): Promise<{ names: string[]; mine: boolean; /** Everyone but this player, for the Players line that says "You confirmed this" (WO-184). */ others: string[]; mineAt: string | null }> {
  try {
    const rows = await db()
      .select({ id: schema.pageConfirmations.userId, name: schema.users.name, handle: schema.users.handle, at: schema.pageConfirmations.createdAt })
      .from(schema.pageConfirmations)
      .innerJoin(schema.users, eq(schema.users.id, schema.pageConfirmations.userId))
      .where(and(eq(schema.pageConfirmations.kind, kind), eq(schema.pageConfirmations.key, key)))
      .orderBy(asc(schema.pageConfirmations.createdAt));
    const mine = userId ? rows.find((r) => r.id === userId) : undefined;
    return { names: rows.map((r) => r.name ?? r.handle ?? "A player"), mine: !!mine, others: rows.filter((r) => r !== mine).map((r) => r.name ?? r.handle ?? "A player"), mineAt: mine ? mine.at.toISOString() : null };
  } catch {
    // The table isn't there yet on this database: nobody has confirmed anything.
    return { names: [], mine: false, others: [], mineAt: null };
  }
}

/** Record the player's word; saying it twice is one. */
export async function confirmPage(kind: ConfirmKind, key: string, userId: string): Promise<void> {
  await db().insert(schema.pageConfirmations).values({ kind, key, userId }).onConflictDoNothing();
}

/** Take it back. */
export async function undoConfirm(kind: ConfirmKind, key: string, userId: string): Promise<void> {
  await db()
    .delete(schema.pageConfirmations)
    .where(and(eq(schema.pageConfirmations.kind, kind), eq(schema.pageConfirmations.key, key), eq(schema.pageConfirmations.userId, userId)));
}
