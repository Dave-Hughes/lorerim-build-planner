import { describe, expect, it } from "vitest";
import { gateOf, signInNeeds } from "@/lib/mcp/sign-in-tools";
import { isMcpResource, resourceAt } from "./resource";

const O = "https://planner.test";

describe("the door on any path (WO-109b)", () => {
  it("accepts /api/mcp and any path under it on this host, and nothing else", () => {
    expect(isMcpResource(O, `${O}/api/mcp`)).toBe(true);
    expect(isMcpResource(O, `${O}/api/mcp/signed-in`)).toBe(true);
    expect(isMcpResource(O, `${O}/api/mcp/a/b`)).toBe(true);
    expect(isMcpResource(O, `${O}/api/mcp?x=1`)).toBe(false);
    expect(isMcpResource(O, `${O}/api/mcp/signed-in#top`)).toBe(false);
    expect(isMcpResource(O, `https://elsewhere.test/api/mcp`)).toBe(false);
    expect(isMcpResource(O, `${O}/api/mcpx`)).toBe(false);
    expect(isMcpResource(O, `${O}/oauth/token`)).toBe(false);
    expect(isMcpResource(O, "not a url")).toBe(false);
  });
  it("names the path the client used as the resource", () => {
    expect(resourceAt(O, undefined)).toBe(`${O}/api/mcp`);
    expect(resourceAt(O, ["signed-in"])).toBe(`${O}/api/mcp/signed-in`);
  });
});

describe("a 401 that starts sign-in (WO-109b)", () => {
  const call = (name: string) => ({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: {} } });
  it("asks for sign-in for whoami and the write tools with no token", () => {
    expect(gateOf(call("whoami"), null)).toEqual({ refuse: "sign-in" });
    expect(gateOf(call("create_build"), null)).toEqual({ refuse: "sign-in" });
    expect(gateOf(call("write_chapter"), null)).toEqual({ refuse: "sign-in" });
  });
  it("lets the facts tools, initialize and tools/list through", () => {
    expect(gateOf(call("search_facts"), null)).toBeNull();
    expect(gateOf(call("suggest_quests"), null)).toBeNull();
    expect(gateOf({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }, null)).toBeNull();
    expect(gateOf({ jsonrpc: "2.0", id: 1, method: "tools/list" }, null)).toBeNull();
    expect(gateOf(null, null)).toBeNull();
  });
  it("names the scope a token lacks, and lets a token with nothing missing through", () => {
    expect(gateOf(call("whoami"), { scopes: ["facts"] })).toBeNull();
    expect(gateOf(call("add_level"), { scopes: ["facts"] })).toEqual({ refuse: "scope", scope: "builds:write" });
    expect(gateOf(call("add_level"), { scopes: ["facts", "builds:write"] })).toBeNull();
    expect(signInNeeds().get("set_snapshot")).toBe("playthroughs:write");
  });
});
