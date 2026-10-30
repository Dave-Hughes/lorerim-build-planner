import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { SCOPES, scopeRefusal, shownScopes, verifyAccess, type Scope } from "./core";
import { dbStore } from "./store";

/** The token's details as the MCP tools see them (ctx.http.authInfo). */
export interface PlannerAuth {
  token: string;
  clientId: string;
  scopes: string[];
  expiresAt?: number;
  extra?: Record<string, unknown>;
}

/**
 * withMcpAuth's check (WO-109): no bearer token is fine (the facts tools stay open); a token that
 * isn't a live access token throws, so the library answers 401 with the challenge and the client
 * refreshes or signs in again. The error never carries the token.
 */
export async function verifyBearer(_req: Request, bearer?: string): Promise<PlannerAuth | undefined> {
  if (!bearer) return undefined;
  const row = await verifyAccess(dbStore, bearer);
  if (!row) throw new Error("An unknown, revoked or expired access token.");
  return { token: bearer, clientId: row.clientId, scopes: row.scopes, expiresAt: Math.floor(row.expiresAt.getTime() / 1000), extra: { userId: row.userId } };
}

export const NO_SIGN_IN = "This connector was added without sign-in. Remove it in Claude and add it again with Sign in now.";

/** The signed-in player, or the words that say why not: no token, or a token without `scope`. */
export function signedIn(auth: PlannerAuth | undefined, scope?: Scope): { userId: string; scopes: string[] } | { refusal: string } {
  const userId = auth?.extra?.userId;
  if (!auth || typeof userId !== "string") return { refusal: NO_SIGN_IN };
  if (scope && !auth.scopes.includes(scope)) return { refusal: scopeRefusal(scope) };
  return { userId, scopes: auth.scopes };
}

/** whoami: the player's planner name and handle, and what this sign-in may do. */
export async function whoami(userId: string, scopes: string[]) {
  const [u] = await db().select({ name: schema.users.name, handle: schema.users.handle }).from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  return {
    name: u?.name ?? null,
    handle: u?.handle ?? null,
    page: u?.handle ? `/u/${u.handle}` : null,
    scopes: shownScopes(scopes).map((s) => ({ scope: s, means: SCOPES[s as Scope] ?? s })),
  };
}

/** The signed-in player for a write, with the assistant's name as it signed in ("Claude"). */
export async function writer(auth: PlannerAuth | undefined, scope: Scope): Promise<{ userId: string; clientName: string } | { refusal: string }> {
  const who = signedIn(auth, scope);
  if ("refusal" in who) return who;
  const [c] = await db().select({ name: schema.oauthClients.name }).from(schema.oauthClients).where(eq(schema.oauthClients.id, auth!.clientId)).limit(1);
  return { userId: who.userId, clientName: c?.name ?? "an assistant" };
}
