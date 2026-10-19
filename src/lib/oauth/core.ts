/**
 * Sign-in for assistants (WO-109): the planner as an OAuth 2.1 authorization server for its own MCP.
 * The rules live here, over a small store, so they're tested without a database; store.ts is the
 * database. Tokens and codes are random 32-byte strings, kept only as SHA-256s, and never logged.
 */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const CODE_MINUTES = 10;
export const ACCESS_HOURS = 8;
export const REFRESH_DAYS = 90;

/** The scopes, and how the consent page and the refusals say them. */
export const SCOPES = {
  facts: "Look up perks, spells and quests",
  "builds:write": "Draft builds in your account",
  "playthroughs:write": "Write playthroughs in your account",
} as const;
export type Scope = keyof typeof SCOPES;
export const SCOPE_LIST = Object.keys(SCOPES) as Scope[];

export const newSecret = () => randomBytes(32).toString("base64url");
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** PKCE (S256): the verifier's SHA-256, base64url, must be the challenge. */
export function pkceMatches(verifier: string | null | undefined, challenge: string): boolean {
  if (!verifier || !/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) return false;
  const made = Buffer.from(createHash("sha256").update(verifier).digest("base64url"));
  const want = Buffer.from(challenge);
  return made.length === want.length && timingSafeEqual(made, want);
}

/** A redirect URI must be one of the client's, character for character: no trailing slash, no other port. */
export const redirectAllowed = (uri: string, allowed: readonly string[]) => allowed.includes(uri);

/** The scopes asked for: all of them when none is named; null when one isn't ours. */
export function parseScopes(param: string | null | undefined): Scope[] | null {
  const asked = (param ?? "").split(/\s+/).filter(Boolean);
  if (!asked.length) return [...SCOPE_LIST];
  if (asked.some((s) => !(s in SCOPES))) return null;
  return SCOPE_LIST.filter((s) => asked.includes(s));
}

/** What a tool says when the token lacks its scope. */
export const scopeRefusal = (scope: Scope) => `Your sign-in doesn't allow this. Reconnect and allow ${SCOPES[scope].charAt(0).toLowerCase()}${SCOPES[scope].slice(1)}.`;

/* ---------- Client ID Metadata Documents ---------- */

/** Loopback, private, link-local and other addresses a fetch must never reach. */
export function isPrivateAddress(ip: string): boolean {
  const v4 = ip.replace(/^::ffff:/i, "");
  const m = v4.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
  }
  const s = ip.toLowerCase();
  return s === "::" || s === "::1" || s.startsWith("fc") || s.startsWith("fd") || s.startsWith("fe8") || s.startsWith("fe9") || s.startsWith("fea") || s.startsWith("feb") || s.startsWith("ff");
}

export interface CimdClient {
  id: string;
  name: string;
  redirectUris: string[];
  metadata: Record<string, unknown>;
  /** How long it may be cached, at most a day. */
  cacheSeconds: number;
}

export class OAuthFailure extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** A client_id that's a CIMD URL: HTTPS, no fragment, a path (or http on a local test server). */
export function cimdUrl(clientId: string, allowLocal = false): URL | null {
  let u: URL;
  try {
    u = new URL(clientId);
  } catch {
    return null;
  }
  if (u.hash || u.username || u.password) return null;
  if (u.protocol === "https:") return u;
  return allowLocal && u.protocol === "http:" ? u : null;
}

/** Checks a fetched document: its client_id must be the URL exactly, with redirect URIs and a name. */
export function readCimdDocument(url: string, doc: unknown): Omit<CimdClient, "cacheSeconds"> {
  if (!doc || typeof doc !== "object") throw new OAuthFailure("invalid_client", "The client's metadata document isn't JSON.");
  const d = doc as Record<string, unknown>;
  if (d.client_id !== url) throw new OAuthFailure("invalid_client", "The client's metadata document names a different client_id.");
  const uris = Array.isArray(d.redirect_uris) ? d.redirect_uris.filter((x): x is string => typeof x === "string") : [];
  if (!uris.length) throw new OAuthFailure("invalid_client", "The client's metadata document has no redirect_uris.");
  if (d.token_endpoint_auth_method && d.token_endpoint_auth_method !== "none") throw new OAuthFailure("invalid_client", "Only public clients (token_endpoint_auth_method none) are accepted.");
  const name = typeof d.client_name === "string" && d.client_name.trim() ? d.client_name.trim().slice(0, 80) : new URL(url).host;
  return { id: url, name, redirectUris: uris, metadata: d };
}

/** The max-age a response allows, capped at a day; 0 for no-store or no-cache. */
export function cacheSecondsOf(cacheControl: string | null): number {
  const c = (cacheControl ?? "").toLowerCase();
  if (/no-store|no-cache/.test(c)) return 0;
  const m = c.match(/max-age=(\d+)/);
  return Math.min(86400, m ? Number(m[1]) : 3600);
}

export interface CimdFetchDeps {
  fetch: typeof fetch;
  /** The addresses a host name resolves to. */
  lookup: (host: string) => Promise<string[]>;
  /** Local test servers only (http://localhost); never on production. */
  allowLocal?: boolean;
}

const MAX_DOC_BYTES = 64 * 1024;

/**
 * Fetches a CIMD document: HTTPS only, public hosts only, 5 seconds, 64 KB, at most one redirect and
 * only to the same host.
 */
export async function fetchCimd(clientId: string, deps: CimdFetchDeps): Promise<CimdClient> {
  const url = cimdUrl(clientId, deps.allowLocal);
  if (!url) throw new OAuthFailure("invalid_client", "A client_id that's a URL must be https.");
  let at = url;
  for (let hop = 0; hop < 2; hop++) {
    if (!deps.allowLocal) {
      const ips = await deps.lookup(at.hostname).catch(() => []);
      if (!ips.length || ips.some(isPrivateAddress)) throw new OAuthFailure("invalid_client", "The client's metadata host isn't a public address.");
    }
    const res = await deps.fetch(at, { redirect: "manual", signal: AbortSignal.timeout(5000), headers: { accept: "application/json" } });
    if (res.status >= 300 && res.status < 400) {
      const to = res.headers.get("location");
      const next = to ? new URL(to, at) : null;
      if (hop > 0 || !next || next.host !== url.host || next.protocol !== url.protocol) throw new OAuthFailure("invalid_client", "The client's metadata document redirects too far.");
      at = next;
      continue;
    }
    if (!res.ok) throw new OAuthFailure("invalid_client", `The client's metadata document answered ${res.status}.`);
    const text = await readCapped(res, MAX_DOC_BYTES);
    let doc: unknown;
    try {
      doc = JSON.parse(text);
    } catch {
      throw new OAuthFailure("invalid_client", "The client's metadata document isn't JSON.");
    }
    return { ...readCimdDocument(clientId, doc), cacheSeconds: cacheSecondsOf(res.headers.get("cache-control")) };
  }
  throw new OAuthFailure("invalid_client", "The client's metadata document redirects too far.");
}

async function readCapped(res: Response, max: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new OAuthFailure("invalid_client", "The client's metadata document is over 64 KB.");
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/* ---------- Codes and tokens ---------- */

export interface CodeRow {
  hash: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  codeChallenge: string;
  scopes: string[];
  resource: string | null;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface TokenRow {
  hash: string;
  kind: "access" | "refresh";
  pair: string;
  grant: string;
  clientId: string;
  userId: string;
  scopes: string[];
  expiresAt: Date;
  revokedAt: Date | null;
  lastUsedAt?: Date | null;
}

export interface OAuthStore {
  insertCode(row: CodeRow): Promise<void>;
  /** Marks the code used when it's unused and in date, and returns it; else null. One caller wins. */
  useCode(hash: string, now: Date): Promise<CodeRow | null>;
  findCode(hash: string): Promise<CodeRow | null>;
  insertTokens(rows: TokenRow[]): Promise<void>;
  findToken(hash: string): Promise<TokenRow | null>;
  /** Revokes a refresh token that's live and returns it; else null. One caller wins. */
  spendRefresh(hash: string, now: Date): Promise<TokenRow | null>;
  revokePair(pair: string, now: Date): Promise<void>;
  revokeGrant(grant: string, now: Date): Promise<void>;
  touch(hash: string, now: Date): Promise<void>;
}

export interface Issued {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/** A one-time code for an approved request, ten minutes. */
export async function issueCode(store: OAuthStore, r: Omit<CodeRow, "hash" | "expiresAt" | "usedAt">, now = new Date()): Promise<string> {
  const code = newSecret();
  await store.insertCode({ ...r, hash: sha256(code), expiresAt: new Date(now.getTime() + CODE_MINUTES * 60_000), usedAt: null });
  return code;
}

async function issuePair(store: OAuthStore, g: { grant: string; clientId: string; userId: string; scopes: string[] }, now: Date): Promise<Issued> {
  const access = newSecret();
  const refresh = newSecret();
  const pair = sha256(newSecret());
  const base = { pair, grant: g.grant, clientId: g.clientId, userId: g.userId, scopes: g.scopes, revokedAt: null };
  await store.insertTokens([
    { ...base, hash: sha256(access), kind: "access", expiresAt: new Date(now.getTime() + ACCESS_HOURS * 3600_000) },
    { ...base, hash: sha256(refresh), kind: "refresh", expiresAt: new Date(now.getTime() + REFRESH_DAYS * 86400_000) },
  ]);
  return { access_token: access, token_type: "Bearer", expires_in: ACCESS_HOURS * 3600, refresh_token: refresh, scope: g.scopes.join(" ") };
}

/** authorization_code: single use, PKCE checked; a code used twice revokes every token it led to. */
export async function exchangeCode(store: OAuthStore, a: { code: string; verifier: string | null; clientId: string; redirectUri: string; resource?: string | null }, now = new Date()): Promise<Issued> {
  const hash = sha256(a.code);
  const row = await store.useCode(hash, now);
  if (!row) {
    const seen = await store.findCode(hash);
    if (seen?.usedAt) await store.revokeGrant(hash, now);
    throw new OAuthFailure("invalid_grant", "The code is unknown, used or expired.");
  }
  if (row.clientId !== a.clientId || row.redirectUri !== a.redirectUri) throw new OAuthFailure("invalid_grant", "The code was issued to another client or redirect_uri.");
  if (a.resource && row.resource && a.resource !== row.resource) throw new OAuthFailure("invalid_target", "The resource doesn't match the code's.");
  if (!pkceMatches(a.verifier, row.codeChallenge)) throw new OAuthFailure("invalid_grant", "The code_verifier doesn't match.");
  return issuePair(store, { grant: hash, clientId: row.clientId, userId: row.userId, scopes: row.scopes }, now);
}

/** refresh_token: rotated on every use; the old one is refused after, and its access token goes too. */
export async function refreshTokens(store: OAuthStore, a: { refreshToken: string; clientId: string }, now = new Date()): Promise<Issued> {
  const row = await store.spendRefresh(sha256(a.refreshToken), now);
  if (!row) throw new OAuthFailure("invalid_grant", "The refresh token is unknown, used, revoked or expired.");
  if (row.clientId !== a.clientId) throw new OAuthFailure("invalid_grant", "The refresh token was issued to another client.");
  await store.revokePair(row.pair, now);
  return issuePair(store, { grant: row.grant, clientId: row.clientId, userId: row.userId, scopes: row.scopes }, now);
}

/** RFC 7009: revokes a token and its pair. An unknown token is no error. */
export async function revokeToken(store: OAuthStore, token: string, now = new Date()): Promise<void> {
  const row = await store.findToken(sha256(token));
  if (row) await store.revokePair(row.pair, now);
}

/** A live access token's row, touched as used; null for anything else. */
export async function verifyAccess(store: OAuthStore, token: string, now = new Date()): Promise<TokenRow | null> {
  const row = await store.findToken(sha256(token));
  if (!row || row.kind !== "access" || row.revokedAt || row.expiresAt.getTime() <= now.getTime()) return null;
  await store.touch(row.hash, now);
  return row;
}
