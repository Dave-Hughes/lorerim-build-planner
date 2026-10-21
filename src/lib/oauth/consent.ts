import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { OAuthFailure, parseScopes, redirectAllowed, type Scope } from "./core";
import { isMcpResource } from "./resource";
import { resolveClient, type Client } from "./store";

/** An authorization request (WO-109), as the consent page reads it from the query. */
export interface AuthRequest {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state: string | null;
  scope: string | null;
  resource: string | null;
}

export type Checked =
  /** The client or its redirect can't be trusted: show the error here, never redirect. */
  | { ok: false; show: string }
  /** The redirect is the client's: send the error back to it. */
  | { ok: false; back: string }
  | { ok: true; client: Client; scopes: Scope[]; req: AuthRequest };

/** The error redirect: the client's redirect_uri with error and state. */
export function errorRedirect(redirectUri: string, error: string, state: string | null, description?: string): string {
  const u = new URL(redirectUri);
  u.searchParams.set("error", error);
  if (description) u.searchParams.set("error_description", description);
  if (state) u.searchParams.set("state", state);
  return u.toString();
}

/** Checks an authorization request: the client, its redirect, PKCE (S256, required), the scopes and the resource (the door on any path under /api/mcp, WO-109b). */
export async function checkRequest(q: Record<string, string | undefined>, origin: string): Promise<Checked> {
  const clientId = q.client_id ?? "";
  const redirectUri = q.redirect_uri ?? "";
  let client: Client;
  try {
    client = await resolveClient(clientId);
  } catch (e) {
    return { ok: false, show: e instanceof OAuthFailure ? e.message : "The assistant couldn't be checked." };
  }
  if (!redirectAllowed(redirectUri, client.redirectUris)) return { ok: false, show: "The assistant's redirect address isn't one it registered." };
  // An absent field and an empty one are the same: the consent form sends every field back.
  const state = q.state || null;
  const back = (error: string, d: string) => ({ ok: false as const, back: errorRedirect(redirectUri, error, state, d) });
  if (q.response_type !== "code") return back("unsupported_response_type", "response_type must be code.");
  if (!q.code_challenge || !/^[A-Za-z0-9_-]{43}$/.test(q.code_challenge)) return back("invalid_request", "PKCE is required: send code_challenge.");
  if (q.code_challenge_method !== "S256") return back("invalid_request", "code_challenge_method must be S256.");
  if (q.resource && !isMcpResource(origin, q.resource)) return back("invalid_target", "The resource must be this planner's MCP URL.");
  const scopes = parseScopes(q.scope);
  if (!scopes) return back("invalid_scope", "Unknown scope.");
  return { ok: true, client, scopes, req: { clientId, redirectUri, codeChallenge: q.code_challenge, state, scope: q.scope || null, resource: q.resource || null } };
}

/** The consent form's guard: an HMAC of the player and the request, so a cross-site POST can't approve. */
export function consentToken(userId: string, r: AuthRequest): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set.");
  return createHmac("sha256", secret).update(JSON.stringify([userId, r.clientId, r.redirectUri, r.codeChallenge, r.state, r.scope, r.resource])).digest("base64url");
}

export function consentTokenOk(given: string, userId: string, r: AuthRequest): boolean {
  const want = Buffer.from(consentToken(userId, r));
  const got = Buffer.from(given);
  return want.length === got.length && timingSafeEqual(want, got);
}
