import { describe, expect, it } from "vitest";
import { canTickByHand, readsFromSave, workOut, type ObjectiveFacts } from "./status";
import { objectiveSchema } from "./validate";

const base: ObjectiveFacts = { kind: "once", doneBy: "save", detect: { quest: "FreeformRiften11", stage: 20 }, status: "todo", accepted: true };
const snap = (stage: number) => ({ level: 6, skills: {}, questStages: { FreeformRiften11: stage } });

describe("every objective has a box; the save can tick it too (WO-123)", () => {
  it("can be ticked by hand, whatever its kind", () => {
    expect(canTickByHand()).toBe(true);
    expect(workOut({ ...base, status: "done" }, snap(10))).toMatchObject({ done: true, shown: "hand" });
    expect(workOut({ kind: "once", doneBy: "hand", status: "done", accepted: true }, null)).toMatchObject({ done: true, shown: "hand" });
  });
  it("keeps a hand tick when a later save doesn't show it done; a save that does ticks it from the save", () => {
    expect(workOut({ ...base, status: "done" }, snap(10)).shown).toBe("hand");
    expect(workOut({ ...base, status: "todo" }, snap(20))).toMatchObject({ done: true, shown: "save" });
    expect(workOut({ ...base, status: "done" }, snap(20)).shown).toBe("save");
  });
  it("with the switch off, leaves it to the tick", () => {
    expect(workOut({ ...base, doneBy: "hand" }, snap(20)).done).toBe(false);
  });
  it("knows what the save can read: a quest, or a number", () => {
    expect(readsFromSave(base)).toBe(true);
    expect(readsFromSave({ kind: "once", detect: null })).toBe(false);
    expect(readsFromSave({ kind: "reach", reach: { key: "skill:Speech", target: 40 } })).toBe(true);
  });
  it("is on by default when there's something to read, and the tick when there's nothing", () => {
    const parse = (o: object) => objectiveSchema.parse({ text: "Get a Mark of Dibella from Haelga", kind: "once", ...o });
    expect(parse({ doneBy: null, detect: { quest: "FreeformRiften11" } }).doneBy).toBe("save");
    expect(parse({ doneBy: null }).doneBy).toBe("hand");
    expect(objectiveSchema.parse({ text: "Reach Speech 40", kind: "reach", doneBy: null, reach: { key: "skill:Speech", target: 40 } }).doneBy).toBe("save");
    expect(objectiveSchema.parse({ text: "Reach Speech 40", kind: "reach", doneBy: "hand", reach: { key: "skill:Speech", target: 40 } }).doneBy).toBe("hand");
  });
});
