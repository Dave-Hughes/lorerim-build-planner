import { describe, expect, it } from "vitest";
import { openFor, questNames, type PlayerState } from "./open";

const names = questNames([
  { edid: "C00", name: "Take Up Arms" },
  { edid: "C01", name: "Proving Honor" },
  { edid: "MS11", name: "Blood on the Ice" },
]);
const at = (level: number | null, done: string[] = [], stages: Record<string, number> = {}): PlayerState => ({ level, done: new Set(done), stages });
const checked = (needs: string[]) => ({ start: { needs, checked: "files" as const } });

describe("open for you (WO-115 Part 3)", () => {
  it("is unknown, never open, when the start isn't checked", () => {
    expect(openFor({ start: { checked: "not yet" } }, at(30), names)).toEqual({ state: "unknown", because: ["the start isn't checked yet"] });
    expect(openFor({}, at(30), names).state).toBe("unknown");
  });
  it("is open with nothing needed, or only a talk", () => {
    expect(openFor(checked([]), at(6), names).state).toBe("open");
    expect(openFor(checked(["Talk to Kodlak in Jorrvaskr"]), at(6), names).state).toBe("open");
  });
  it("is locked by a level, and says it", () => {
    expect(openFor(checked(["Level 20"]), at(6), names)).toEqual({ state: "locked", because: ["needs level 20"] });
    expect(openFor(checked(["Level 20"]), at(20), names).state).toBe("open");
    expect(openFor(checked(["Level 20"]), at(null), names).state).toBe("unknown");
  });
  it("reads another quest's progress from what was told, and is unknown when nobody said", () => {
    const need = checked(["After Take Up Arms (its stage 200)"]);
    expect(openFor(need, at(6), names).state).toBe("unknown");
    expect(openFor(need, at(6, ["C00"]), names).state).toBe("open");
    expect(openFor(need, at(6, [], { C00: 200 }), names).state).toBe("open");
    expect(openFor(need, at(6, [], { C00: 10 }), names)).toEqual({ state: "locked", because: ["needs Take Up Arms past stage 200"] });
    expect(openFor(checked(["Take Up Arms completed"]), at(6, ["C00"]), names).state).toBe("open");
  });
  it("is unknown for a condition the check can't name, or a global", () => {
    expect(openFor(checked(["a condition the start check can't name yet (fn576 == 1)"]), at(30), names).state).toBe("unknown");
    expect(openFor(checked(["global AKNKECompleted == 0 (now 0)"]), at(30), names).state).toBe("unknown");
  });
  it("takes one of its ways: open if any is, locked if every one is", () => {
    expect(openFor(checked(["One of: Level 40; or Talk to Aela in Jorrvaskr"]), at(6), names).state).toBe("open");
    expect(openFor(checked(["One of: Level 40; or Level 30"]), at(6), names).state).toBe("locked");
    expect(openFor(checked(["One of: Level 40; or Through SomeHelper"]), at(6), names).state).toBe("unknown");
  });
  it("a line's order gates nothing (WO-142 item 1): a quest with no needs of its own is open, and a level still locks it", () => {
    expect(openFor(checked([]), at(6), names)).toEqual({ state: "open", because: [] });
    expect(openFor(checked(["Level 20"]), at(6), names).state).toBe("locked");
  });
  it("a plain After <quest> need waits on that quest, and is met once the player has finished it", () => {
    expect(openFor(checked(["After Take Up Arms"]), at(6), names).state).toBe("unknown");
    expect(openFor(checked(["After Take Up Arms"]), at(6, ["C00"]), names).state).toBe("open");
  });
});
