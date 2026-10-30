import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { registerBuildTools } from "./build-tools";
import { registerFactTools } from "./fact-tools";
import { registerPlaythroughTools, registerSuggestionTools } from "./playthrough-tools";

/**
 * WO-111b: every tool's input is plain fields, one level deep, no unions. Some connectors check
 * arguments against the JSON schema before sending and don't always get an anyOf right.
 */
function registered(runs = true) {
  const tools = new Map<string, z.ZodType>();
  const server = { registerTool: (name: string, cfg: { inputSchema: z.ZodType }) => void tools.set(name, cfg.inputSchema) };
  const guarded = async () => ({ content: [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = server as any;
  registerFactTools(s, guarded);
  registerBuildTools(s, guarded, "https://planner.test");
  // The quest and place suggestions stay with playthroughs off (WO-182); the rest of the playthrough tools go.
  registerSuggestionTools(s, guarded, "https://planner.test", runs);
  if (runs) registerPlaythroughTools(s, guarded, "https://planner.test");
  return tools;
}

afterEach(() => vi.unstubAllEnvs());

describe("tool input schemas (WO-111b)", () => {
  it("carry no anyOf or oneOf in any tool, nor a field of two types", () => {
    const tools = registered();
    expect(tools.size).toBe(43); // suggest_places (WO-128), get_person (WO-159); WO-181 took the three chapter tools out and added set_theme
    for (const [name, schema] of tools) {
      const json = JSON.stringify(z.toJSONSchema(schema, { io: "input" }));
      expect(json, name).not.toMatch(/"(anyOf|oneOf)"/);
      // zod writes a union of plain types as "type": [...], which is a union all the same.
      expect(json, name).not.toMatch(/"type":\[/);
    }
  });
  it("take the done-when as flat fields and check_progression's build and buildId as two", () => {
    const tools = registered();
    const props = (name: string) => Object.keys((z.toJSONSchema(tools.get(name)!, { io: "input" }) as { properties: object }).properties);
    expect(props("add_objective")).toEqual(expect.arrayContaining(["quest", "stage", "reachKey", "reachTarget", "fromSave", "byHand"]));
    expect(props("add_objective")).not.toContain("doneWhen");
    expect(props("check_progression")).toEqual(["build", "buildId"]);
  });
  // WO-182: the same shapes with playthroughs off, and none of the run's tools or inputs.
  it("hold with playthroughs off, and no tool or input is a run's", () => {
    vi.stubEnv("FEATURE_PLAYTHROUGHS", "off");
    const tools = registered(false);
    expect(tools.size).toBe(25);
    for (const [name, schema] of tools) {
      const json = z.toJSONSchema(schema, { io: "input" }) as { properties: Record<string, unknown> };
      expect(JSON.stringify(json), name).not.toMatch(/"(anyOf|oneOf)"/);
      expect(JSON.stringify(json), name).not.toMatch(/"type":\[/);
      for (const k of ["playthrough", "act", "answers", "never"]) expect(Object.keys(json.properties), `${name} takes ${k}`).not.toContain(k);
    }
    for (const n of ["create_playthrough", "add_act", "add_objective", "set_theme", "set_snapshot", "get_quest_log", "list_my_playthroughs"]) expect(tools.has(n), n).toBe(false);
    for (const n of ["suggest_quests", "suggest_places", "get_quest", "set_details"]) expect(tools.has(n), n).toBe(true);
  });
});
