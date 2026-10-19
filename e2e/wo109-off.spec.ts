/**
 * WO-109: sign-in for assistants switched off, on the "launch" project's server (FEATURE_MCP off).
 */
import { expect, test } from "@playwright/test";

test("with FEATURE_MCP off, the metadata, the OAuth endpoints and the consent page are not found", async ({ request }) => {
  for (const path of ["/.well-known/oauth-authorization-server", "/.well-known/oauth-protected-resource", "/oauth/authorize?client_id=x"]) expect((await request.get(path)).status(), path).toBe(404);
  for (const path of ["/oauth/token", "/oauth/register", "/oauth/revoke"]) expect((await request.post(path, { data: {} })).status(), path).toBe(404);
});
