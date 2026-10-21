import { createHash, randomBytes } from "node:crypto";
import { expect, type BrowserContext, type Page } from "@playwright/test";
import { OTHER_SESSION_TOKEN, TEST_SESSION_TOKEN } from "./seed";

/** Signs the context in as the test author (or, with `other`, as Someone Else), the way Auth.js would after Discord. */
export async function signIn(context: BrowserContext, who: "author" | "other" = "author") {
  const value = who === "other" ? OTHER_SESSION_TOKEN : TEST_SESSION_TOKEN;
  await context.addCookies([{ name: "authjs.session-token", value, domain: "localhost", path: "/" }]);
}

/* ---------- The MCP door, as an assistant (WO-110, WO-111) ---------- */

const MCP_REDIRECT = "http://127.0.0.1:59999/cb";
export const ip = () => `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

/** A token for whoever `context` is signed in as, through register, consent and the token endpoint. */
export async function tokenFor(page: Page, context: BrowserContext, base: string, from: string, scope?: string) {
  await context.setExtraHTTPHeaders({ "x-forwarded-for": from });
  const reg = await fetch(new URL("/oauth/register", base), { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": from }, body: JSON.stringify({ client_name: "E2E Claude", redirect_uris: [MCP_REDIRECT] }) });
  const { client_id } = await reg.json();
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  let landed = "";
  await page.route("http://127.0.0.1:59999/**", async (r) => {
    landed = r.request().url();
    await r.fulfill({ body: "ok" });
  });
  await page.goto(`/oauth/authorize?${new URLSearchParams({ response_type: "code", client_id, redirect_uri: MCP_REDIRECT, code_challenge: challenge, code_challenge_method: "S256", ...(scope ? { scope } : {}) })}`);
  await page.getByRole("button", { name: "Allow" }).click();
  await expect.poll(() => landed).toContain("code=");
  const t = await fetch(new URL("/oauth/token", base), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": from },
    body: new URLSearchParams({ grant_type: "authorization_code", code: new URL(landed).searchParams.get("code")!, code_verifier: verifier, client_id, redirect_uri: MCP_REDIRECT }),
  });
  return ((await t.json()) as { access_token: string; scope: string });
}

/** One tool call through the door; the answer's text and whether it's a refusal. */
export async function call(base: string, from: string, token: string, name: string, args: object) {
  const res = await fetch(new URL("/api/mcp", base), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18", "x-forwarded-for": from, authorization: `Bearer ${token}` },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
  });
  const text = await res.text();
  // Refused before the tool runs (WO-109b: a 401 or 403 that starts sign-in): the status and the challenge.
  if (res.status === 401 || res.status === 403) return { status: res.status, text: res.headers.get("www-authenticate") ?? "", isError: true, json: () => ({}) };
  const data = JSON.parse(text.startsWith("{") ? text : (text.split("\n").find((l) => l.startsWith("data: "))?.slice(6) ?? "{}"));
  const r = data.result as { content: { text: string }[]; isError?: boolean };
  return { status: res.status, text: r.content[0].text, isError: !!r.isError, json: () => JSON.parse(r.content[0].text) };
}


/* ---------- Edit mode (WO-117) ---------- */

/**
 * Every change saves as it's made: the band says Saving the moment something changes, then ✓ Saved
 * once it's on the server, so ✓ Saved after a change means that change is saved.
 */
export async function savedInBand(page: Page) {
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("status")).toHaveText(/✓ Saved/, { timeout: 15_000 });
}

/** The edit tabs: Set up, Levels, Guide, Story, Play (WO-118). */
export const editTab = (page: Page, name: string) => page.getByRole("navigation", { name: "Edit tabs" }).getByRole("link", { name: new RegExp(`^${name}`) });
