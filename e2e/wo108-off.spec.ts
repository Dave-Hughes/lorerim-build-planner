/**
 * WO-108: the MCP route switched off, on the "launch" project's server (FEATURE_MCP off).
 */
import { expect, test } from "@playwright/test";

test("with FEATURE_MCP off, the MCP route is not found", async ({ request }) => {
  expect((await request.get("/api/mcp")).status()).toBe(404);
  expect((await request.post("/api/mcp", { data: { jsonrpc: "2.0", id: 1, method: "tools/list" } })).status()).toBe(404);
});
