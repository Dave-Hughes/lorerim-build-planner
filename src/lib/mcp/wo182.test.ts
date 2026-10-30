import { describe, expect, it } from "vitest";
import { gateOf, signInNeeds } from "./sign-in-tools";
import { styleGuide } from "./facts";
import { parseScopes, shownScopes } from "@/lib/oauth/core";
import { isPlaythroughPath, playthroughsOn } from "@/lib/playthroughs/gate";

/** WO-182: launch without playthroughs. The off case is asked for here, whatever the test environment has. */
const OFF = { FEATURE_PLAYTHROUGHS: "off" };
const ON = { FEATURE_PLAYTHROUGHS: "on" };

describe("the playthroughs switch (WO-182)", () => {
  it("is off unless it says on, except under next dev", () => {
    expect(playthroughsOn({})).toBe(false);
    expect(playthroughsOn({ VERCEL_ENV: "preview" })).toBe(false);
    expect(playthroughsOn({ VERCEL_ENV: "production" })).toBe(false);
    expect(playthroughsOn({ NODE_ENV: "development" })).toBe(true);
    expect(playthroughsOn(OFF)).toBe(false);
    expect(playthroughsOn(ON)).toBe(true);
    expect(playthroughsOn({ FEATURE_PLAYTHROUGHS: "off", NODE_ENV: "development" })).toBe(false);
  });

  it("names every address that exists only for playthroughs, and none of a character's own", () => {
    for (const p of ["/p/abc", "/p/abc/tale", "/p/abc/edit/play", "/playthroughs", "/playthroughs/new", "/b/abc/play", "/b/abc/run", "/b/abc/edit/play", "/b/abc/story", "/b/abc/story/2", "/b/abc/edit/story", "/b/abc/edit/story/title", "/b/abc/story/edit", "/api/playthroughs/abc/images", "/api/map/character", "/api/map/characters"]) expect(isPlaythroughPath(p), p).toBe(true);
    for (const p of ["/", "/b/abc", "/b/abc/edit", "/b/abc/guide", "/b/abc/setup", "/people", "/places", "/places/riften", "/pages", "/map", "/api/mcp", "/api/map/places", "/characters", "/me"]) expect(isPlaythroughPath(p), p).toBe(false);
  });
});

describe("the door with playthroughs off (WO-182)", () => {
  it("knows no playthrough tool: a call to one starts no sign-in", () => {
    const off = signInNeeds(OFF);
    for (const n of ["create_playthrough", "add_act", "set_snapshot", "get_quest_log", "suggest_places"]) expect(off.has(n), n).toBe(false);
    expect(off.get("create_build")).toBe("builds:write");
    expect(gateOf({ method: "tools/call", params: { name: "create_playthrough" } }, null, OFF)).toBeNull();
    expect(gateOf({ method: "tools/call", params: { name: "create_playthrough" } }, null, ON)).toEqual({ refuse: "sign-in" });
  });

  it("grants and shows no playthrough scope", () => {
    expect(parseScopes("", OFF)).toEqual(["facts", "builds:write"]);
    expect(parseScopes("facts playthroughs:write", OFF)).toEqual(["facts"]);
    expect(parseScopes("playthroughs:write", OFF)).toBeNull();
    expect(parseScopes("", ON)).toEqual(["facts", "builds:write", "playthroughs:write"]);
    expect(shownScopes(["facts", "playthroughs:write"], OFF)).toEqual(["facts"]);
  });

  it("gives a style guide with the questions that shape a build and nothing about a run", () => {
    const g = styleGuide(false);
    expect(g).toContain("## Before you design");
    expect(g).toContain("27. Will this character be the Dragonborn?");
    expect(g).toContain("28. How do they fight, once they do?");
    expect(g).toContain("35. Ask when it matters");
    expect(g).toContain("36. When a design depends on something LoreRim doesn't ship");
    expect(g).toContain("The planner has no playthroughs yet.");
    for (const gone of ["## Playthroughs", "## Who she is", "29. How do they start out?", "32. Alone, or with someone?", "33. Do they want a home?", "34. Where does the story end?", "Callings", "set_theme", "set_details answers", "an act", "objective"]) expect(g, gone).not.toContain(gone);
    expect(g.replace("The planner has no playthroughs yet.", "")).not.toMatch(/playthrough|\bacts?\b|\btale\b|\btick|\bsave\b/i);
    // Nothing a build rule cites was renumbered: the rules that stay keep their numbers.
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26]) expect(g).toMatch(new RegExp(`^${n}\\. `, "m"));
  });

  it("still gives the full guide with playthroughs on", () => {
    const g = styleGuide(true);
    for (const kept of ["## Playthroughs", "## Who she is", "29. How do they start out?", "37. Missives are board jobs", "Keep the answers on the playthrough with set_details answers"]) expect(g, kept).toContain(kept);
    expect(g).not.toContain("[runs]");
    expect(g).not.toContain("[launch]");
    expect(g).not.toContain("The planner has no playthroughs yet.");
  });
});
