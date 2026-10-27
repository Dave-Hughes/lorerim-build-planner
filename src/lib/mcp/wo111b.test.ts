import { describe, expect, it } from "vitest";
import { z } from "zod";
import { registerBuildTools } from "./build-tools";
import { registerFactTools } from "./fact-tools";
import { registerPlaythroughTools } from "./playthrough-tools";

/**
 * WO-111b: every tool's input is plain fields, one level deep, no unions. Some connectors check
 * arguments against the JSON schema before sending and don't always get an anyOf right.
 */
function registered() {
  const tools = new Map<string, z.ZodType>();
  const server = { registerTool: (name: string, cfg: { inputSchema: z.ZodType }) => void tools.set(name, cfg.inputSchema) };
  const guarded = async () => ({ content: [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = server as any;
  registerFactTools(s, guarded);
  registerBuildTools(s, guarded, "https://planner.test");
  registerPlaythroughTools(s, guarded, "https://planner.test");
  return tools;
}

describe("tool input schemas (WO-111b)", () => {
  it("carry no anyOf or oneOf in any tool, nor a field of two types", () => {
    const tools = registered();
    expect(tools.size).toBe(45); // suggest_places (WO-128), get_person (WO-159)
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
});
