import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  OAuthFailure,
  exchangeCode,
  fetchCimd,
  isPrivateAddress,
  issueCode,
  parseScopes,
  pkceMatches,
  readCimdDocument,
  redirectAllowed,
  refreshTokens,
  revokeToken,
  scopeRefusal,
  sha256,
  verifyAccess,
  type CodeRow,
  type OAuthStore,
  type TokenRow,
} from "./core";

/** The rules' store, in memory. */
function memory(): OAuthStore & { tokens: TokenRow[] } {
  const codes: CodeRow[] = [];
  const tokens: TokenRow[] = [];
  return {
    tokens,
    async insertCode(r) {
      codes.push({ ...r });
    },
    async useCode(hash, now) {
      const c = codes.find((x) => x.hash === hash && !x.usedAt && x.expiresAt > now);
      if (!c) return null;
      c.usedAt = now;
      return { ...c };
    },
    async findCode(hash) {
      return codes.find((x) => x.hash === hash) ?? null;
    },
    async insertTokens(rows) {
      tokens.push(...rows.map((r) => ({ ...r })));
    },
    async findToken(hash) {
      return tokens.find((t) => t.hash === hash) ?? null;
    },
    async spendRefresh(hash, now) {
      const t = tokens.find((x) => x.hash === hash && x.kind === "refresh" && !x.revokedAt && x.expiresAt > now);
      if (!t) return null;
      t.revokedAt = now;
      return { ...t };
    },
    async revokePair(pair, now) {
      for (const t of tokens) if (t.pair === pair && !t.revokedAt) t.revokedAt = now;
    },
    async revokeGrant(grant, now) {
      for (const t of tokens) if (t.grant === grant && !t.revokedAt) t.revokedAt = now;
    },
    async touch(hash, now) {
      const t = tokens.find((x) => x.hash === hash);
      if (t) t.lastUsedAt = now;
    },
  };
}

const verifier = "a".repeat(43) + "-verifier_value.~";
const challenge = createHash("sha256").update(verifier).digest("base64url");
const REDIRECT = "https://claude.ai/api/mcp/auth_callback";
const ask = { clientId: "https://claude.ai/oauth/claude.json", userId: "u1", redirectUri: REDIRECT, codeChallenge: challenge, scopes: ["facts", "builds:write"], resource: "https://planner.test/api/mcp" };

async function signedIn(store = memory(), now = new Date("2026-10-19T12:00:00Z")) {
  const code = await issueCode(store, ask, now);
  const t = await exchangeCode(store, { code, verifier, clientId: ask.clientId, redirectUri: REDIRECT, resource: ask.resource }, now);
  return { store, code, t, now };
}

describe("PKCE (WO-109)", () => {
  it("accepts the right verifier and refuses a wrong or missing one", () => {
    expect(pkceMatches(verifier, challenge)).toBe(true);
    expect(pkceMatches(verifier + "x", challenge)).toBe(false);
    expect(pkceMatches(null, challenge)).toBe(false);
    expect(pkceMatches("short", challenge)).toBe(false);
  });
});

describe("codes (WO-109)", () => {
  it("gives tokens once for the right verifier, client and redirect", async () => {
    const { t } = await signedIn();
    expect(t).toMatchObject({ token_type: "Bearer", expires_in: 8 * 3600, scope: "facts builds:write" });
    expect(t.access_token).toHaveLength(43);
  });

  it("refuses a used code, and a reuse revokes every token the code gave", async () => {
    const { store, code, t, now } = await signedIn();
    await expect(exchangeCode(store, { code, verifier, clientId: ask.clientId, redirectUri: REDIRECT }, now)).rejects.toThrow(OAuthFailure);
    expect(await verifyAccess(store, t.access_token, now)).toBeNull();
    expect(store.tokens.every((x) => x.revokedAt)).toBe(true);
  });

  it("refuses an expired code, a wrong verifier, another redirect or another client", async () => {
    const store = memory();
    const now = new Date("2026-10-19T12:00:00Z");
    const late = await issueCode(store, ask, now);
    await expect(exchangeCode(store, { code: late, verifier, clientId: ask.clientId, redirectUri: REDIRECT }, new Date(now.getTime() + 11 * 60_000))).rejects.toThrow(/expired/);
    for (const wrong of [
      { verifier: verifier + "x" },
      { redirectUri: REDIRECT + "/" },
      { clientId: "https://other.example/c.json" },
    ]) {
      const code = await issueCode(store, ask, now);
      await expect(exchangeCode(store, { code, verifier, clientId: ask.clientId, redirectUri: REDIRECT, ...wrong }, now)).rejects.toThrow(OAuthFailure);
    }
  });

  it("matches a redirect URI exactly: a trailing slash or another port is refused", () => {
    expect(redirectAllowed(REDIRECT, [REDIRECT])).toBe(true);
    expect(redirectAllowed(REDIRECT + "/", [REDIRECT])).toBe(false);
    expect(redirectAllowed("http://localhost:3000/cb", ["http://localhost:3001/cb"])).toBe(false);
  });
});

describe("tokens (WO-109)", () => {
  it("rotates the refresh token on use; the old one and its access token are refused after", async () => {
    const { store, t, now } = await signedIn();
    const later = new Date(now.getTime() + 60_000);
    const next = await refreshTokens(store, { refreshToken: t.refresh_token, clientId: ask.clientId }, later);
    expect(next.refresh_token).not.toBe(t.refresh_token);
    await expect(refreshTokens(store, { refreshToken: t.refresh_token, clientId: ask.clientId }, later)).rejects.toThrow(OAuthFailure);
    expect(await verifyAccess(store, t.access_token, later)).toBeNull();
    expect((await verifyAccess(store, next.access_token, later))?.userId).toBe("u1");
  });

  it("revoke cuts both tokens of a pair", async () => {
    const { store, t, now } = await signedIn();
    await revokeToken(store, t.refresh_token, now);
    expect(await verifyAccess(store, t.access_token, now)).toBeNull();
    await expect(refreshTokens(store, { refreshToken: t.refresh_token, clientId: ask.clientId }, now)).rejects.toThrow(OAuthFailure);
  });

  it("verifyAccess turns away an expired, revoked or refresh token, and touches a good one", async () => {
    const { store, t, now } = await signedIn();
    expect(await verifyAccess(store, t.access_token, new Date(now.getTime() + 8 * 3600_000 + 1))).toBeNull();
    expect(await verifyAccess(store, t.refresh_token, now)).toBeNull();
    expect(await verifyAccess(store, "nonsense", now)).toBeNull();
    const ok = await verifyAccess(store, t.access_token, now);
    expect(ok?.scopes).toEqual(["facts", "builds:write"]);
    expect(store.tokens.find((x) => x.hash === sha256(t.access_token))?.lastUsedAt).toEqual(now);
    await revokeToken(store, t.access_token, now);
    expect(await verifyAccess(store, t.access_token, now)).toBeNull();
  });

  it("keeps only hashes", async () => {
    const { store, t } = await signedIn();
    expect(store.tokens.map((x) => x.hash)).not.toContain(t.access_token);
    expect(store.tokens.map((x) => x.hash)).toContain(sha256(t.access_token));
  });
});

describe("client ID metadata documents (WO-109)", () => {
  const url = "https://assistant.example/oauth/client.json";
  const doc = { client_id: url, client_name: "An Assistant", redirect_uris: [REDIRECT], token_endpoint_auth_method: "none" };
  const respond = (body: unknown, init: ResponseInit = {}) => (async () => new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "max-age=600" }, ...init })) as unknown as typeof fetch;
  const publicHost = async () => ["93.184.216.34"];

  it("takes the name and redirect URIs from a good document", async () => {
    const c = await fetchCimd(url, { fetch: respond(doc), lookup: publicHost });
    expect(c).toMatchObject({ id: url, name: "An Assistant", redirectUris: [REDIRECT], cacheSeconds: 600 });
  });

  it("refuses a document whose client_id isn't its URL", () => {
    expect(() => readCimdDocument(url, { ...doc, client_id: "https://evil.example/c.json" })).toThrow(/different client_id/);
  });

  it("refuses http:// and a host on a private or loopback address", async () => {
    await expect(fetchCimd("http://assistant.example/c.json", { fetch: respond(doc), lookup: publicHost })).rejects.toThrow(/https/);
    await expect(fetchCimd(url, { fetch: respond(doc), lookup: async () => ["10.0.0.5"] })).rejects.toThrow(/public address/);
    await expect(fetchCimd(url, { fetch: respond(doc), lookup: async () => ["127.0.0.1"] })).rejects.toThrow(/public address/);
    for (const ip of ["127.0.0.1", "10.1.2.3", "192.168.1.1", "172.16.0.1", "169.254.169.254", "::1", "fd00::1", "::ffff:10.0.0.1"]) expect(isPrivateAddress(ip), ip).toBe(true);
    expect(isPrivateAddress("93.184.216.34")).toBe(false);
  });

  it("follows one redirect to the same host only", async () => {
    let n = 0;
    const hop = (async (u: URL) => {
      n++;
      if (String(u).endsWith("client.json")) return new Response(null, { status: 302, headers: { location: "https://elsewhere.example/c.json" } });
      return new Response(JSON.stringify(doc));
    }) as unknown as typeof fetch;
    await expect(fetchCimd(url, { fetch: hop, lookup: publicHost })).rejects.toThrow(/redirects too far/);
    expect(n).toBe(1);
  });
});

describe("scopes (WO-109)", () => {
  it("grants the scopes asked for that have tools, only facts and builds:write when none is named, and refuses an unknown one", () => {
    expect(parseScopes("facts builds:write")).toEqual(["facts", "builds:write"]);
    // WO-110: playthroughs:write has no tools until WO-111, so it isn't granted.
    expect(parseScopes("")).toEqual(["facts", "builds:write"]);
    expect(parseScopes(null)).toEqual(["facts", "builds:write"]);
    expect(parseScopes("facts playthroughs:write")).toEqual(["facts"]);
    expect(parseScopes("facts admin")).toBeNull();
  });

  it("says a missing scope in plain words", () => {
    expect(scopeRefusal("builds:write")).toBe("Your sign-in doesn't allow this. Reconnect and allow draft builds in your account.");
  });
});
