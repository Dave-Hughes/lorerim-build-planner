import "server-only";
import { and, count, eq, gt, isNotNull, isNull, max, min, sql } from "drizzle-orm";
import { db, schema } from "@/db";

/**
 * The player's connected assistants (WO-109), for /me: each client with a live refresh token, when it
 * first connected, when it was last used, and what it may do.
 */
export async function connectedAssistants(userId: string) {
  const now = new Date();
  const live = await db()
    .select({
      clientId: schema.oauthTokens.clientId,
      since: min(schema.oauthTokens.createdAt),
      scopes: sql<string[]>`(array_agg(${schema.oauthTokens.scopes} order by ${schema.oauthTokens.createdAt} desc))[1]`,
    })
    .from(schema.oauthTokens)
    .where(and(eq(schema.oauthTokens.userId, userId), eq(schema.oauthTokens.kind, "refresh"), isNull(schema.oauthTokens.revokedAt), gt(schema.oauthTokens.expiresAt, now)))
    .groupBy(schema.oauthTokens.clientId);
  if (!live.length) return [];
  const used = await db()
    .select({ clientId: schema.oauthTokens.clientId, at: max(schema.oauthTokens.lastUsedAt), first: min(schema.oauthTokens.createdAt) })
    .from(schema.oauthTokens)
    .where(eq(schema.oauthTokens.userId, userId))
    .groupBy(schema.oauthTokens.clientId);
  const clients = await db().select({ id: schema.oauthClients.id, name: schema.oauthClients.name }).from(schema.oauthClients);
  // Builds its tools made (WO-110), by the name it signed in with.
  const drafted = await db()
    .select({ by: schema.builds.draftedBy, n: count() })
    .from(schema.builds)
    .where(and(eq(schema.builds.ownerId, userId), isNotNull(schema.builds.draftedBy)))
    .groupBy(schema.builds.draftedBy);
  return live
    .map((l) => ({
      clientId: l.clientId,
      name: clients.find((c) => c.id === l.clientId)?.name ?? "An assistant",
      drafted: drafted.find((x) => x.by === (clients.find((c) => c.id === l.clientId)?.name ?? ""))?.n ?? 0,
      scopes: l.scopes ?? [],
      since: used.find((u) => u.clientId === l.clientId)?.first ?? l.since ?? now,
      lastUsed: used.find((u) => u.clientId === l.clientId)?.at ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Revoke: every token this client holds for this player. */
export async function revokeAssistant(userId: string, clientId: string) {
  await db()
    .update(schema.oauthTokens)
    .set({ revokedAt: new Date() })
    .where(and(eq(schema.oauthTokens.userId, userId), eq(schema.oauthTokens.clientId, clientId), isNull(schema.oauthTokens.revokedAt)));
}
