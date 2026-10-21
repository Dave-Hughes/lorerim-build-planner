import { describe, expect, it } from "vitest";
import { gateOf, signInNeeds } from "@/lib/mcp/sign-in-tools";
import { lineFor } from "./reports";

describe("quest reports (WO-121a Part 5)", () => {
  it("find the line by its id or name, or by one of its quests", () => {
    expect(lineFor("wyrmstooth")).toEqual({ lineId: "wyrmstooth", edid: null });
    expect(lineFor("Waking Nightmare")).toEqual({ lineId: "waking-nightmare", edid: null });
    expect(lineFor("DA16")).toEqual({ lineId: "waking-nightmare", edid: "DA16" });
    expect(lineFor("Dark Ancestor")?.lineId).toBe("dark-ancestor");
    expect(lineFor("No Such Quest")).toBeNull();
  });
  it("need sign-in through the door, and facts is enough", () => {
    expect(signInNeeds().get("report_quest")).toBe("facts");
    const call = { method: "tools/call", params: { name: "report_quest" } };
    expect(gateOf(call, null)).toEqual({ refuse: "sign-in" });
    expect(gateOf(call, { scopes: ["facts"] })).toBeNull();
  });
});
