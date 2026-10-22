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
  expect(tools.map((t) => t.name).sort()).toEqual(["add_act", "add_level", "add_objective", "check_progression", "create_build", "create_playthrough", "finish_draft", "finish_draft_playthrough", "get_build", "get_creation", "get_perk", "get_playthrough", "get_quest", "get_quest_log", "get_quest_start", "get_rules", "get_spell", "get_style_guide", "get_tree", "list_my_builds", "list_my_playthroughs", "move_act", "move_objective", "remove_act", "remove_chapter", "remove_last_level", "remove_objective", "report_quest", "search_facts", "set_act", "set_chapter", "set_creation", "set_details", "set_gear", "set_level", "set_objective", "set_playthrough", "set_snapshot", "set_status", "suggest_objective", "suggest_places", "suggest_quests", "whoami", "write_chapter"]);

  // No unions in any tool's input (WO-111b): no anyOf or oneOf, and no field of two types.
  for (const t of tools) expect(JSON.stringify(t.inputSchema), t.name).not.toMatch(/"(anyOf|oneOf)"|"type":\[/);

  expect(JSON.parse(textOf(await client.callTool({ name: "search_facts", arguments: { query: "Haggling" } }))).hits[0]).toMatchObject({ id: "Speech:Haggling" });
  expect(JSON.parse(textOf(await client.callTool({ name: "get_perk", arguments: { name: "Haggling" } })))).toMatchObject({ tree: "Speech", ranks: 1 });
  const spell = JSON.parse(textOf(await client.callTool({ name: "get_spell", arguments: { name: "Holy Fire" } })));
  expect(spell).toMatchObject({ school: "Destruction", tier: "Apprentice", soldBy: { checked: "not yet" } });
  expect(JSON.parse(textOf(await client.callTool({ name: "get_quest_start", arguments: { id: "gravewind" } })))).toMatchObject({ checked: "not yet" });
  expect(JSON.parse(textOf(await client.callTool({ name: "get_quest_start", arguments: { id: "become-the-dragonborn" } })))).toMatchObject({ checked: "files", firstQuest: { name: "Unbound" } });
  const ice = JSON.parse(textOf(await client.callTool({ name: "get_quest", arguments: { name: "Blood on the Ice" } })));
  expect(ice.quest.endings.map((e: { stage: number }) => e.stage)).toEqual([100, 250]);
  // Open for you (WO-115 Part 3): only when told where the player is; a quest the planner can't judge is unknown.
  expect(ice).not.toHaveProperty("openForYou");
  const arms = JSON.parse(textOf(await client.callTool({ name: "get_quest", arguments: { name: "Take Up Arms", level: 6 } })));
  expect(arms.openForYou).toMatchObject({ state: "open", says: "open for you" });
  const honor = JSON.parse(textOf(await client.callTool({ name: "get_quest", arguments: { name: "Proving Honor", level: 6 } })));
  expect(honor.openForYou.state).toBe("unknown");
  expect(honor.openForYou.says).toMatch(/^unknown: /);
  // A quest whose start isn't checked is unknown through the door, never open (WO-115 Part 4).
  const unchecked = JSON.parse(textOf(await client.callTool({ name: "get_quest", arguments: { id: "on-hogithum", level: 40 } })));
  expect(unchecked.openForYou).toMatchObject({ state: "unknown", says: "unknown: the start isn't checked yet" });
  expect(textOf(await client.callTool({ name: "get_style_guide", arguments: {} }))).toContain("Unknown means say unknown.");
  expect(JSON.parse(textOf(await client.callTool({ name: "check_progression", arguments: { build: plan } })))).toMatchObject({ levels: 6 });
  expect(textOf(await client.callTool({ name: "get_style_guide", arguments: {} }))).toContain("How to write for LoreRim Build Planner");
  // WO-119: the rules and a whole tree, and How points work in the style guide.
  expect(JSON.parse(textOf(await client.callTool({ name: "get_rules", arguments: {} })))).toMatchObject({ skillPointsPerLevel: 30, maxRaisePerSkillPerLevel: 5 });
  expect(JSON.parse(textOf(await client.callTool({ name: "get_tree", arguments: { skill: "Two-Handed" } }))).perks.length).toBeGreaterThan(10);
  expect(textOf(await client.callTool({ name: "get_style_guide", arguments: {} }))).toContain("## How points work");

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
