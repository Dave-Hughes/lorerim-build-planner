/**
 * WO-109: sign-in for assistants, end to end, with plain fetch as the assistant: a registered client
 * and a CIMD client this test serves itself, through consent, token, refresh, whoami and revoke.
 */
import http from "node:http";
import type { AddressInfo } from "node:net";
import { createHash, randomBytes } from "node:crypto";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { TEST_USER_HANDLE, TEST_USER_NAME } from "./seed";

test.describe.configure({ mode: "serial" });

const REDIRECT = "http://127.0.0.1:59999/cb";
const ip = () => `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
const pkce = () => {
  const verifier = randomBytes(32).toString("base64url");
  return { verifier, challenge: createHash("sha256").update(verifier).digest("base64url") };
};

/** A JSON-RPC call to the MCP route, the 2025 way: initialize first isn't needed for a stateless tools/call. */
async function mcp(base: string, from: string, body: object, token?: string) {
  return fetch(new URL("/api/mcp", base), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18", "x-forwarded-for": from, ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, ...body }),
  });
}
async function whoami(base: string, from: string, token?: string) {
  const res = await mcp(base, from, { method: "tools/call", params: { name: "whoami", arguments: {} } }, token);
  const text = await res.text();
  const data = text.startsWith("{") ? text : (text.split("\n").find((l) => l.startsWith("data: "))?.slice(6) ?? "{}");
  return { res, result: JSON.parse(data).result as { content: { text: string }[]; isError?: boolean } | undefined };
}

/** Consent as the signed-in test author: open authorize, Allow, and catch the redirect's code. */
async function approve(page: Page, base: string, clientId: string, challenge: string, state: string, full = true) {
  let landed = "";
  await page.route("http://127.0.0.1:59999/**", async (route) => {
    landed = route.request().url();
    await route.fulfill({ status: 200, body: "ok" });
  });
  // `full: false` leaves out scope and resource, as a client may: then every scope is asked for.
  const q = new URLSearchParams({ response_type: "code", client_id: clientId, redirect_uri: REDIRECT, code_challenge: challenge, code_challenge_method: "S256", state, ...(full ? { scope: "facts builds:write", resource: new URL("/api/mcp", base).toString() } : {}) });
  await page.goto(`/oauth/authorize?${q}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("to use your LoreRim Planner account?");
  await expect(page.getByText("Look up perks, spells and quests")).toBeVisible();
  await expect(page.getByText("Draft builds in your account")).toBeVisible();
  // Asking for no scopes grants only those with tools today (WO-110).
  if (!full) await expect(page.getByText("Write playthroughs in your account")).toHaveCount(0);
  await page.getByRole("button", { name: "Allow" }).click();
  await expect.poll(() => landed).toContain("code=");
  const u = new URL(landed);
  expect(u.searchParams.get("state")).toBe(state);
  return u.searchParams.get("code")!;
}

async function token(base: string, from: string, f: Record<string, string>) {
  return fetch(new URL("/oauth/token", base), { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": from }, body: new URLSearchParams(f) });
}

async function signedInContext(context: BrowserContext, from: string) {
  await signIn(context);
  await context.setExtraHTTPHeaders({ "x-forwarded-for": from });
}

test("the metadata routes answer as the spec asks", async ({ baseURL }) => {
  const as = await (await fetch(new URL("/.well-known/oauth-authorization-server", baseURL), { headers: { "x-forwarded-for": ip() } })).json();
  expect(as).toMatchObject({
    issuer: baseURL!.replace(/\/$/, ""),
    authorization_endpoint: expect.stringMatching(/\/oauth\/authorize$/),
    token_endpoint: expect.stringMatching(/\/oauth\/token$/),
    registration_endpoint: expect.stringMatching(/\/oauth\/register$/),
    revocation_endpoint: expect.stringMatching(/\/oauth\/revoke$/),
    scopes_supported: ["facts", "builds:write", "playthroughs:write"],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    client_id_metadata_document_supported: true,
  });
  const pr = await (await fetch(new URL("/.well-known/oauth-protected-resource", baseURL), { headers: { "x-forwarded-for": ip() } })).json();
  expect(pr).toMatchObject({ resource: new URL("/api/mcp", baseURL).toString(), authorization_servers: [baseURL!.replace(/\/$/, "")] });
});

test("whoami: no token gives the plain message; a bad token gets 401 and the challenge", async ({ baseURL }) => {
  const from = ip();
  const none = await whoami(baseURL!, from);
  expect(none.result?.isError).toBe(true);
  expect(none.result?.content[0].text).toBe("This connector was added without sign-in. Remove it in Claude and add it again with Sign in now.");
  const bad = await whoami(baseURL!, from, "not-a-real-token");
  expect(bad.res.status).toBe(401);
  expect(bad.res.headers.get("www-authenticate")).toContain("/.well-known/oauth-protected-resource");
});

test("a registered client: consent, token, whoami, refresh, then Revoke on /me cuts it off", async ({ baseURL, page, context }) => {
  const from = ip();
  await signedInContext(context, from);
  const reg = await fetch(new URL("/oauth/register", baseURL), { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": from }, body: JSON.stringify({ client_name: "E2E Registered", redirect_uris: [REDIRECT], token_endpoint_auth_method: "none" }) });
  expect(reg.status).toBe(201);
  const { client_id } = await reg.json();

  const { verifier, challenge } = pkce();
  const code = await approve(page, baseURL!, client_id, challenge, "s-1");
  const t1 = await token(baseURL!, from, { grant_type: "authorization_code", code, code_verifier: verifier, client_id, redirect_uri: REDIRECT });
  expect(t1.status).toBe(200);
  const tokens = await t1.json();
  expect(tokens).toMatchObject({ token_type: "Bearer", expires_in: 28800, scope: "facts builds:write" });
  // The code works once.
  expect((await token(baseURL!, from, { grant_type: "authorization_code", code, code_verifier: verifier, client_id, redirect_uri: REDIRECT })).status).toBe(400);

  // That reuse revoked the first pair, so sign in again for the rest.
  const again = pkce();
  const code2 = await approve(page, baseURL!, client_id, again.challenge, "s-2");
  const t2 = await (await token(baseURL!, from, { grant_type: "authorization_code", code: code2, code_verifier: again.verifier, client_id, redirect_uri: REDIRECT })).json();
  const who = await whoami(baseURL!, from, t2.access_token);
  expect(who.res.status).toBe(200);
  expect(JSON.parse(who.result!.content[0].text)).toMatchObject({ name: TEST_USER_NAME, handle: TEST_USER_HANDLE });

  const r = await token(baseURL!, from, { grant_type: "refresh_token", refresh_token: t2.refresh_token, client_id });
  expect(r.status).toBe(200);
  const t3 = await r.json();
  expect((await token(baseURL!, from, { grant_type: "refresh_token", refresh_token: t2.refresh_token, client_id })).status).toBe(400);
  expect((await whoami(baseURL!, from, t3.access_token)).res.status).toBe(200);

  await page.goto("/me");
  const row = page.getByRole("list", { name: "Assistants" }).getByRole("listitem").filter({ hasText: "E2E Registered" });
  await expect(row).toContainText("Draft builds in your account");
  await row.getByRole("button", { name: "Revoke" }).click();
  await expect(row.getByText("Revoked")).toBeVisible();
  const cut = await whoami(baseURL!, from, t3.access_token);
  expect(cut.res.status).toBe(401);
  expect(cut.res.headers.get("www-authenticate")).toContain("resource_metadata");
});

test("a CIMD client served by the test goes through the same flow", async ({ baseURL, page, context }) => {
  const from = ip();
  await signedInContext(context, from);
  const server = http.createServer((req, res) => {
    const id = `http://localhost:${(server.address() as AddressInfo).port}/client.json`;
    res.writeHead(200, { "content-type": "application/json", "cache-control": "max-age=60" });
    res.end(JSON.stringify({ client_id: id, client_name: "E2E Document Client", redirect_uris: [REDIRECT], token_endpoint_auth_method: "none" }));
  });
  await new Promise<void>((ok) => server.listen(0, "127.0.0.1", ok));
  const clientId = `http://localhost:${(server.address() as AddressInfo).port}/client.json`;
  try {
    const { verifier, challenge } = pkce();
    const code = await approve(page, baseURL!, clientId, challenge, "cimd", false);
    const t = await (await token(baseURL!, from, { grant_type: "authorization_code", code, code_verifier: verifier, client_id: clientId, redirect_uri: REDIRECT })).json();
    const who = await whoami(baseURL!, from, t.access_token);
    expect(JSON.parse(who.result!.content[0].text)).toMatchObject({ name: TEST_USER_NAME });
    // Revoke, the RFC 7009 way, cuts the pair.
    await fetch(new URL("/oauth/revoke", baseURL), { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": from }, body: new URLSearchParams({ token: t.refresh_token }) });
    expect((await whoami(baseURL!, from, t.access_token)).res.status).toBe(401);
  } finally {
    server.close();
  }
});

test("without PKCE, or with a redirect the client doesn't have, the request is refused", async ({ baseURL, page, context }) => {
  const from = ip();
  await signedInContext(context, from);
  const { client_id } = await (await fetch(new URL("/oauth/register", baseURL), { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": from }, body: JSON.stringify({ client_name: "E2E Strict", redirect_uris: [REDIRECT] }) })).json();
  // No code_challenge: sent back to the client's redirect with the error, never to a page.
  const res = await page.request.get(`/oauth/authorize?${new URLSearchParams({ response_type: "code", client_id, redirect_uri: REDIRECT, state: "x" })}`, { maxRedirects: 0 });
  expect(res.status()).toBeGreaterThanOrEqual(300);
  const to = new URL(res.headers()["location"]);
  expect(to.origin + to.pathname).toBe(REDIRECT);
  expect(to.searchParams.get("error")).toBe("invalid_request");
  expect(to.searchParams.get("state")).toBe("x");
  await page.goto(`/oauth/authorize?${new URLSearchParams({ response_type: "code", client_id, redirect_uri: REDIRECT + "/", code_challenge: pkce().challenge, code_challenge_method: "S256" })}`);
  await expect(page.getByText("The assistant's redirect address isn't one it registered.")).toBeVisible();
});
