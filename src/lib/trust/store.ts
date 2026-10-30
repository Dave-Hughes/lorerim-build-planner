import "server-only";
import { asc, eq, ilike, or } from "drizzle-orm";
import { db, schema } from "@/db";
import { adminDiscordIds } from "@/lib/users/admin";

/** Approved players (WO-184 Part 5): the people whose screenshots go live at once. The check still runs on every one. */
export async function trustedList() {
  const admins = adminDiscordIds();
  const adminRows = admins.length
    ? await db()
        .select({ id: schema.users.id, name: schema.users.name, image: schema.users.image })
        .from(schema.accounts)
        .innerJoin(schema.users, eq(schema.users.id, schema.accounts.userId))
        .where(or(...admins.map((a) => eq(schema.accounts.providerAccountId, a))))
    : [];
  const players = await db()
    .select({ id: schema.users.id, name: schema.users.name, image: schema.users.image, source: schema.trustedPlayers.source, at: schema.trustedPlayers.createdAt })
    .from(schema.trustedPlayers)
    .innerJoin(schema.users, eq(schema.users.id, schema.trustedPlayers.userId))
    .orderBy(asc(schema.trustedPlayers.createdAt));
  return { admins: adminRows, players };
}

export async function countTrusted(): Promise<number> {
  const { players } = await trustedList();
  return players.length;
}

/** Add a player by the Discord name they show on the planner; false when no one has that name. */
export async function trustByName(name: string, adminId: string): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
  const n = name.trim().replace(/^@/, "");
  if (!n) return { ok: false, error: "Type their Discord name." };
  const rows = await db().select({ id: schema.users.id, name: schema.users.name }).from(schema.users).where(or(ilike(schema.users.name, n), ilike(schema.users.handle, n))).limit(2);
  if (rows.length === 0) return { ok: false, error: `No one has signed in as ${n}.` };
  if (rows.length > 1) return { ok: false, error: `More than one player is called ${n}. Add them from one of their screenshots.` };
  await db().insert(schema.trustedPlayers).values({ userId: rows[0].id, addedBy: adminId, source: "added by name" }).onConflictDoNothing();
  return { ok: true, name: rows[0].name ?? n };
}

export async function untrust(userId: string): Promise<void> {
  await db().delete(schema.trustedPlayers).where(eq(schema.trustedPlayers.userId, userId));
}
