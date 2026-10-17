import "server-only";
import { desc, eq, isNotNull } from "drizzle-orm";
import { db, schema } from "@/db";

/** The /admin Early access section's lists (WO-96). The page checks the admin first. */
/** For /admin: every invite, newest first, with who used it. */
export async function listInvites() {
  return db()
    .select({ id: schema.invites.id, label: schema.invites.label, createdAt: schema.invites.createdAt, expiresAt: schema.invites.expiresAt, usedBy: schema.invites.usedBy, usedByName: schema.users.name })
    .from(schema.invites)
    .leftJoin(schema.users, eq(schema.users.id, schema.invites.usedBy))
    .orderBy(desc(schema.invites.createdAt));
}

/** For /admin: everyone let in early, latest first. */
export async function listEarlyAccess() {
  return db()
    .select({ id: schema.users.id, name: schema.users.name, image: schema.users.image, at: schema.users.earlyAccessAt })
    .from(schema.users)
    .where(isNotNull(schema.users.earlyAccessAt))
    .orderBy(desc(schema.users.earlyAccessAt));
}
