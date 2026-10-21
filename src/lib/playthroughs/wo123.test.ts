import { describe, expect, it } from "vitest";
import { reviewPlaythrough } from "./review";
import { canTickByHand, reachValue, readsFromSave, saveGives, workOut, type ObjectiveFacts } from "./status";
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

describe("warnings while drafting a playthrough (WO-123 Part 2)", () => {
  const o = (id: number, text: string, extra: object = {}) => ({ id, text, kind: "once" as const, link: null, reach: null, ...extra });
  it("names the quest an unlinked objective's words mean, through a phrase only it uses", () => {
    expect(reviewPlaythrough([o(1, "Get a Mark of Dibella from Haelga at the bunkhouse")])).toEqual([
      { code: "objective-not-linked", objective: "1", message: "'Get a Mark of Dibella from Haelga at the bunkhouse' is Caught Red Handed (FreeformRiften11); link it so the save can tick it." },
    ]);
  });
  it("names a quest line or follower by its name in the words", () => {
    expect(reviewPlaythrough([o(2, "Join the Bards College")])[0].message).toMatch(/^'Join the Bards College' names the quest line .*Bards College; link it/);
    expect(reviewPlaythrough([o(3, "Ask Mjoll the Lioness to come along")])[0].message).toBe("'Ask Mjoll the Lioness to come along' names Mjoll the Lioness, a follower; link it.");
  });
  it("leaves a linked objective, and words that name nothing, alone", () => {
    expect(reviewPlaythrough([o(4, "Get a Mark of Dibella from Haelga", { link: { kind: "quest", id: "FreeformRiften11" } })])).toEqual([]);
    expect(reviewPlaythrough([o(5, "Hunt and tan her first hides"), o(6, "Take a room at the Bee and Barb"), o(7, "Get a lute, then a spare")])).toEqual([]);
  });
  it("says a number the save can't give is the player's to tick; a level, a skill and the lute it reads", () => {
    const reach = (id: number, key: string, target: number) => ({ id, text: "x", kind: "reach" as const, link: null, reach: { key, target } });
    expect(reviewPlaythrough([reach(8, "count:books read", 10)])).toEqual([{ code: "reach-not-readable", objective: "8", message: "books read 10 can't be read from a save; the player ticks it." }]);
    expect(reviewPlaythrough([reach(9, "level", 10), reach(10, "skill:Speech", 40), reach(11, "count:Lute", 66)])).toEqual([]);
  });
  it("reads the save's lute whatever the label's case", () => {
    expect(reachValue({ level: 10, skills: {}, counts: { lute: 199 } }, "count:Lute")).toBe(199);
    expect(saveGives("count:lute")).toBe(true);
    expect(saveGives("count:books read")).toBe(false);
  });
});
