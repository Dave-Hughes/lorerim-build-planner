import "server-only";
import { lookup } from "node:dns/promises";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getPublicOrigin } from "mcp-handler";
import { db, schema } from "@/db";
import { OAuthFailure, cimdUrl, fetchCimd, newSecret, type CodeRow, type OAuthStore, type TokenRow } from "./core";

/** The OAuth rules' store, in the database (WO-109). */
export const dbStore: OAuthStore = {
  async insertCode(row) {
    await db().insert(schema.oauthCodes).values(row);
  },
  async useCode(hash, now) {
    const rows = await db()
      .update(schema.oauthCodes)
      .set({ usedAt: now })
      .where(and(eq(schema.oauthCodes.hash, hash), isNull(schema.oauthCodes.usedAt), gt(schema.oauthCodes.expiresAt, now)))
      .returning();
    return (rows[0] as CodeRow | undefined) ?? null;
  },
  async findCode(hash) {
    const rows = await db().select().from(schema.oauthCodes).where(eq(schema.oauthCodes.hash, hash)).limit(1);
    return (rows[0] as CodeRow | undefined) ?? null;
  },
  async insertTokens(rows) {
    await db().insert(schema.oauthTokens).values(rows);
  },
  async findToken(hash) {
    const rows = await db().select().from(schema.oauthTokens).where(eq(schema.oauthTokens.hash, hash)).limit(1);
    return (rows[0] as TokenRow | undefined) ?? null;
  },
  async spendRefresh(hash, now) {
    const rows = await db()
      .update(schema.oauthTokens)
      .set({ revokedAt: now })
      .where(and(eq(schema.oauthTokens.hash, hash), eq(schema.oauthTokens.kind, "refresh"), isNull(schema.oauthTokens.revokedAt), gt(schema.oauthTokens.expiresAt, now)))
      .returning();
    return (rows[0] as TokenRow | undefined) ?? null;
  },
  async revokePair(pair, now) {
    await db().update(schema.oauthTokens).set({ revokedAt: now }).where(and(eq(schema.oauthTokens.pair, pair), isNull(schema.oauthTokens.revokedAt)));
  },
  async revokeGrant(grant, now) {
    await db().update(schema.oauthTokens).set({ revokedAt: now }).where(and(eq(schema.oauthTokens.grant, grant), isNull(schema.oauthTokens.revokedAt)));
  },
  async touch(hash, now) {
    await db().update(schema.oauthTokens).set({ lastUsedAt: now }).where(eq(schema.oauthTokens.hash, hash));
  },
};

/** The site's public origin: the issuer, and where the MCP route lives. */
export const originOf = (req: Request) => getPublicOrigin(req);
export const resourceOf = (origin: string) => `${origin}/api/mcp`;

/**
 * Local test servers only: lets a CIMD client_id be http://localhost (the e2e flow serves one). Never
 * on Vercel, whatever it's set to.
 */
export const allowLocalClients = () => process.env.OAUTH_ALLOW_LOCAL_CLIENTS === "1" && !process.env.VERCEL_ENV;

const lookupAll = async (host: string) => (await lookup(host, { all: true })).map((a) => a.address);

export interface Client {
  id: string;
  kind: "cimd" | "registered";
  name: string;
  redirectUris: string[];
}

/**
 * A client by its id: a CIMD URL is fetched (and cached as its headers allow, at most a day); any
 * other id must have registered. Throws OAuthFailure when it can't be used.
 */
export async function resolveClient(clientId: string, now = new Date()): Promise<Client> {
  if (!clientId || clientId.length > 500) throw new OAuthFailure("invalid_client", "No client_id.");
  const [known] = await db().select().from(schema.oauthClients).where(eq(schema.oauthClients.id, clientId)).limit(1);
  if (cimdUrl(clientId, allowLocalClients())) {
    const cached = known?.fetchedAt && now.getTime() - known.fetchedAt.getTime() < Number(known.metadata._cacheSeconds ?? 0) * 1000;
    if (known && cached) return { id: known.id, kind: "cimd", name: known.name, redirectUris: known.redirectUris };
    const c = await fetchCimd(clientId, { fetch, lookup: lookupAll, allowLocal: allowLocalClients() });
    const row = { id: c.id, kind: "cimd", name: c.name, redirectUris: c.redirectUris, metadata: { ...c.metadata, _cacheSeconds: c.cacheSeconds }, fetchedAt: now };
    await db().insert(schema.oauthClients).values(row).onConflictDoUpdate({ target: schema.oauthClients.id, set: { name: row.name, redirectUris: row.redirectUris, metadata: row.metadata, fetchedAt: now } });
    return { id: c.id, kind: "cimd", name: c.name, redirectUris: c.redirectUris };
  }
  if (!known || known.kind !== "registered") throw new OAuthFailure("invalid_client", "Unknown client_id. Register first, or use a client ID metadata document.");
  return { id: known.id, kind: "registered", name: known.name, redirectUris: known.redirectUris };
}

/** RFC 7591: a public client registers its name and redirect URIs and gets a random id. */
export async function registerClient(meta: Record<string, unknown>): Promise<{ id: string; name: string; redirectUris: string[] }> {
  const uris = Array.isArray(meta.redirect_uris) ? meta.redirect_uris.filter((x): x is string => typeof x === "string" && x.length < 500) : [];
  if (!uris.length) throw new OAuthFailure("invalid_redirect_uri", "redirect_uris is required.");
  for (const u of uris) {
    try {
      const p = new URL(u);
      if (p.hash) throw new Error();
    } catch {
      throw new OAuthFailure("invalid_redirect_uri", `Not a redirect URI: ${u.slice(0, 100)}`);
    }
  }
  if (meta.token_endpoint_auth_method && meta.token_endpoint_auth_method !== "none") throw new OAuthFailure("invalid_client_metadata", "Only public clients (token_endpoint_auth_method none) are accepted.");
  const name = typeof meta.client_name === "string" && meta.client_name.trim() ? meta.client_name.trim().slice(0, 80) : "An assistant";
  const id = `planner-${newSecret().slice(0, 24)}`;
  await db().insert(schema.oauthClients).values({ id, kind: "registered", name, redirectUris: uris, metadata: meta });
  return { id, name, redirectUris: uris };
}
