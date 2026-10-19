/**
 * WO-108: the MCP route, through the MCP SDK's own client (FEATURE_MCP on, the main server):
 * initialize, tools/list, one call of each tool, and the per-IP limit.
 */
import { expect, test } from "@playwright/test";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import plan from "../src/lib/rules/__fixtures__/sample-build.json";

const textOf = (r: unknown) => ((r as { content: { type: string; text: string }[] }).content[0]?.text ?? "");

async function connect(baseURL: string, ip: string) {
  const client = new Client({ name: "wo108-e2e", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL("/api/mcp", baseURL), { requestInit: { headers: { "x-forwarded-for": ip } } }));
  return client;
}

/** A made-up address per run, so the limit counts only this test's calls. */
const fakeIp = () => `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

test("initialize, tools/list and one call of each tool", async ({ baseURL }) => {
  const client = await connect(baseURL!, fakeIp());
  expect(client.getServerVersion()?.name).toBe("LoreRim Build Planner");
  const { tools } = await client.listTools();
  expect(tools.map((t) => t.name).sort()).toEqual(["add_level", "check_progression", "create_build", "finish_draft", "get_build", "get_perk", "get_quest_start", "get_spell", "get_style_guide", "list_my_builds", "remove_last_level", "search_facts", "set_details", "set_gear", "set_level", "whoami"]);

  expect(JSON.parse(textOf(await client.callTool({ name: "search_facts", arguments: { query: "Haggling" } }))).hits[0]).toMatchObject({ id: "Speech:Haggling" });
  expect(JSON.parse(textOf(await client.callTool({ name: "get_perk", arguments: { name: "Haggling" } })))).toMatchObject({ tree: "Speech", ranks: 1 });
  const spell = JSON.parse(textOf(await client.callTool({ name: "get_spell", arguments: { name: "Holy Fire" } })));
  expect(spell).toMatchObject({ school: "Destruction", tier: "Apprentice", soldBy: { checked: "not yet" } });
  expect(JSON.parse(textOf(await client.callTool({ name: "get_quest_start", arguments: { id: "gravewind" } })))).toMatchObject({ checked: "not yet" });
  expect(JSON.parse(textOf(await client.callTool({ name: "get_quest_start", arguments: { id: "become-the-dragonborn" } })))).toMatchObject({ checked: "files", firstQuest: { name: "Unbound" } });
  expect(JSON.parse(textOf(await client.callTool({ name: "check_progression", arguments: { build: plan } })))).toMatchObject({ levels: 6 });
  expect(textOf(await client.callTool({ name: "get_style_guide", arguments: {} }))).toContain("How to write for LoreRim Build Planner");

  const bad = await client.callTool({ name: "get_perk", arguments: { name: "Haggling", version: "9.9.9" } });
  expect(bad.isError).toBe(true);
  expect(textOf(bad)).toMatch(/isn't in the planner/);
  await client.close();
});

test("the 61st call in a minute from one IP is refused", async ({ baseURL }) => {
  test.setTimeout(120_000);
  const client = await connect(baseURL!, fakeIp());
  for (let i = 0; i < 60; i++) {
    const r = await client.callTool({ name: "get_style_guide", arguments: {} });
    expect(r.isError, `call ${i + 1}`).toBeFalsy();
  }
  const over = await client.callTool({ name: "get_style_guide", arguments: {} });
  expect(over.isError).toBe(true);
  expect(textOf(over)).toBe("Too many calls. Try again in a minute.");
  // Another IP isn't held back.
  const other = await connect(baseURL!, fakeIp());
  expect((await other.callTool({ name: "get_style_guide", arguments: {} })).isError).toBeFalsy();
  await client.close();
  await other.close();
});
