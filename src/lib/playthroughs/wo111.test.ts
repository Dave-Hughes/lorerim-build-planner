import { describe, expect, it } from "vitest";
import { checkGuideDoc } from "@/lib/guide/doc";
import { parseScopes } from "@/lib/oauth/core";
import { questsData } from "@/lib/quests/data";
import { stories } from "@/lib/quests/stories-data";
import { suggestQuests } from "@/lib/mcp/playthroughs";
import { markdownToDoc, MarkdownError } from "./markdown";
import { isOpen, RULE_14, workOut, type ObjectiveFacts } from "./status";
import { objectiveSchema, parseLevels } from "./validate";
import { assemble, type ObjectiveRow } from "./view";

const refusal = (input: Parameters<typeof objectiveSchema.safeParse>[0]) => {
  const r = objectiveSchema.safeParse(input);
  return r.success ? null : r.error.issues[0]?.message;
};

describe("objectives the player can know are done (rule 14)", () => {
  it("refuses a done-once objective with no done-when", () => {
    expect(refusal({ text: "Sing for the children at Honorhall", kind: "once", doneBy: null })).toBe(RULE_14);
  });
  it("refuses a standing rule: every, each, always, whenever", () => {
    expect(refusal({ text: "Read every new book", kind: "once", doneBy: "hand" })).toBe(RULE_14);
    expect(refusal({ text: "Sing whenever you can", kind: "once", doneBy: "hand" })).toBe(RULE_14);
  });
  it("refuses one that starts Keep, Always or Never", () => {
    expect(refusal({ text: "Keep playing the Bee and Barb", kind: "once", doneBy: "hand" })).toBe(RULE_14);
    expect(refusal({ text: "Never draw the sword", kind: "once", doneBy: "hand" })).toBe(RULE_14);
  });
  it("takes a number and one the player ticks", () => {
    expect(refusal({ text: "Read 10 books", kind: "reach", doneBy: null, reach: { key: "count:books read", target: 10 } })).toBeNull();
    expect(refusal({ text: "Sing for the children at Honorhall", kind: "once", doneBy: "hand" })).toBeNull();
  });
  it("reads levels as the player writes them", () => {
    expect(parseLevels("1 to 6")).toEqual({ from: 1, to: 6 });
    expect(parseLevels("40 and up")).toEqual({ from: 40, to: null });
    expect(typeof parseLevels("soon")).toBe("string");
  });
});

const base: ObjectiveFacts = { kind: "once", doneBy: "hand", status: "todo", accepted: true };
const snap = { level: 6, skills: { Speech: 30 }, questStages: { FreeformRiften11: 12 }, counts: { "books read": 4 } };

describe("done, worked out", () => {
  it("from the save's quest stage", () => {
    expect(workOut({ ...base, doneBy: "save", detect: { quest: "FreeformRiften11", stage: 12 } }, snap).shown).toBe("save");
    expect(workOut({ ...base, doneBy: "save", detect: { quest: "FreeformRiften11", stage: 20 } }, snap).done).toBe(false);
    expect(workOut({ ...base, doneBy: "save", detect: { quest: "FreeformRiften11" } }, snap).done).toBe(true);
    expect(workOut({ ...base, doneBy: "save", detect: { quest: "FreeformRiften05" } }, snap).done).toBe(false);
  });
  it("from a number reached, with the meter", () => {
    const speech = workOut({ ...base, kind: "reach", doneBy: "save", reach: { key: "skill:Speech", target: 40 } }, snap);
    expect(speech).toMatchObject({ done: false, shown: "doing", meter: { value: 30, target: 40, label: "Speech" } });
    expect(workOut({ ...base, kind: "reach", doneBy: "save", reach: { key: "level", target: 6 } }, snap).done).toBe(true);
    expect(workOut({ ...base, kind: "reach", doneBy: "save", reach: { key: "skill:Speech", target: 30 } }, { ...snap, skills: { Speech: 30 } }).done).toBe(true);
  });
  it("from the player's tick", () => {
    expect(workOut({ ...base, status: "done" }, null).shown).toBe("hand");
  });
});

const row = (id: number, v: Partial<ObjectiveRow> = {}): ObjectiveRow => ({ id, actId: 1, position: id, text: `o${id}`, kind: "once", link: null, doneBy: "hand", detect: null, reach: null, why: null, status: "todo", suggestedBy: null, accepted: true, ...v });
const act = { id: 1, position: 1, name: "The Sister's House", levelFrom: 1, levelTo: 6, place: "Riften", goal: "", standingRule: null };
const beat = { id: 9, actId: 1, kind: "beat" as const, position: 1, title: "Made with Care", opensAfter: 2, fromSave: null, writtenBy: null, createdAt: new Date(), doc: { type: "doc" as const, content: [] } };

describe("a quest objective the player ticks before the save shows it (WO-111a)", () => {
  const quest: ObjectiveFacts = { ...base, doneBy: "save", detect: { quest: "FreeformRiften05", stage: 10 } };
  it("is done, ticked by you, while no snapshot shows the stage", () => {
    expect(workOut({ ...quest, status: "done" }, null)).toMatchObject({ done: true, shown: "hand" });
    expect(workOut({ ...quest, status: "todo" }, null).done).toBe(false);
  });
  it("is the save's once a snapshot shows the stage", () => {
    expect(workOut({ ...quest, status: "done" }, { ...snap, questStages: { FreeformRiften05: 10 } }).shown).toBe("save");
  });
  it("keeps the tick when a snapshot shows the quest not there yet", () => {
    expect(workOut({ ...quest, status: "done" }, { ...snap, questStages: { FreeformRiften05: 5 } })).toMatchObject({ done: true, shown: "hand" });
  });
  it("never lets a number be ticked", () => {
    expect(workOut({ ...base, kind: "reach", doneBy: "save", reach: { key: "level", target: 9 }, status: "done" }, snap).done).toBe(false);
  });
  it("opens the beat it hangs off", () => {
    const v = assemble({ acts: [act], objectives: [row(1), row(2, { doneBy: "save", detect: { quest: "FreeformRiften05" }, status: "done" })], chapters: [beat], snapshot: null, link: () => null });
    expect(v.chapters[0].open).toBe(true);
  });
});

describe("beats and suggestions", () => {
  it("a beat opens only once its objective is done", () => {
    expect(isOpen({ kind: "beat", opensAfter: 2 }, new Set())).toBe(false);
    expect(isOpen({ kind: "beat", opensAfter: 2 }, new Set([2]))).toBe(true);
    expect(isOpen({ kind: "chapter", opensAfter: null }, new Set())).toBe(true);
    const before = assemble({ acts: [act], objectives: [row(1), row(2)], chapters: [beat], snapshot: null, link: () => null });
    expect(before.chapters[0]).toMatchObject({ open: false, waitsOn: { id: 2 } });
    const after = assemble({ acts: [act], objectives: [row(1), row(2, { status: "done" })], chapters: [beat], snapshot: null, link: () => null });
    expect(after.chapters[0].open).toBe(true);
  });
  it("a suggestion counts for nothing until accepted", () => {
    const v = assemble({ acts: [act], objectives: [row(1, { status: "done" }), row(2, { suggestedBy: "Claude", accepted: false, status: "done" })], chapters: [], snapshot: null, link: () => null });
    expect(v.total).toBe(1);
    expect(v.done).toBe(1);
    expect(v.acts[0].objectives[1].worked.shown).toBe("suggested");
  });
});

describe("Markdown to the guide document", () => {
  it("makes paragraphs, a heading, a quote and marks, within the Story's limits", () => {
    const doc = markdownToDoc("## The road\n\nShe walked **north**, *alone*.\n\n> Stendarr keep you.");
    expect(doc.content.map((n) => n.type)).toEqual(["heading", "paragraph", "blockquote"]);
    expect(checkGuideDoc("story", doc).ok).toBe(true);
  });
  it("refuses images, and text over the Story's limit", () => {
    expect(() => markdownToDoc("![a](https://x.test/a.png)")).toThrow(MarkdownError);
    const long = checkGuideDoc("story", markdownToDoc("word ".repeat(13_000)));
    expect(long.ok).toBe(false);
  });
});

describe("suggest_quests", () => {
  it("never offers a line whose start isn't checked", async () => {
    const { byId } = questsData();
    const r = await suggestQuests("https://planner.test", { level: 50 }, null);
    expect(r.suggestions.length).toBeGreaterThan(0);
    for (const s of r.suggestions) {
      const story = stories().find((x) => x.id === s.story)!;
      expect(byId.get(story.line)?.checked.start).toBe("files");
    }
  });
});

describe("scopes (WO-111)", () => {
  it("grants facts, builds:write and playthroughs:write when none are asked for", () => {
    expect(parseScopes("")).toEqual(["facts", "builds:write", "playthroughs:write"]);
  });
});
