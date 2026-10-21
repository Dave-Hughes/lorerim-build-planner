import { describe, expect, it } from "vitest";
import { lineDoc, type GuideDoc } from "@/lib/guide/doc";
import { styleGuide } from "@/lib/mcp/facts";
import { runStops, stopAt, storyStop } from "./reader";
import { assemble, type ChapterRow, type ObjectiveRow } from "./view";

const IMG = "https://abc123.public.blob.vercel-storage.com/dev/playthroughs/e2ekyrya22/plate-0001.webp";
const ACT_IMG = "https://abc123.public.blob.vercel-storage.com/dev/playthroughs/e2ekyrya22/act-00001.webp";
const withImage: GuideDoc = { type: "doc", content: [{ type: "image", attrs: { src: IMG, alt: "" } }, { type: "paragraph", content: [{ type: "text", text: "The bells rang." }] }] };

const row = (id: number, v: Partial<ObjectiveRow> = {}): ObjectiveRow => ({ id, actId: 1, position: id, text: `o${id}`, kind: "once", link: null, doneBy: "hand", detect: null, reach: null, why: null, status: "todo", suggestedBy: null, accepted: true, ...v });
const act = (id: number, position: number, v: Record<string, unknown> = {}) => ({ id, position, name: `Act ${id}`, levelFrom: 1, levelTo: null, place: "", goal: "", standingRule: null, ...v });
const ch = (id: number, v: Partial<ChapterRow>): ChapterRow => ({ id, actId: null, kind: "chapter", position: id, title: `c${id}`, opensAfter: null, fromSave: null, writtenBy: null, createdAt: new Date(), doc: lineDoc("Words."), ...v });

// Kyria's tale, out of order on purpose: an act's chapter written after its entries still reads first.
const view = assemble({
  acts: [act(1, 1, { name: "The Sister's House" }), act(2, 2, { imageUrl: ACT_IMG })],
  objectives: [row(10, { text: "Warn Haelga, or expose her" }), row(11, { text: "Hunt and tan her first hides" }), row(12, { actId: 1, kind: "reach", doneBy: "save", reach: { key: "skill:Speech", target: 40 } })],
  chapters: [
    ch(1, { title: "Chapter One", doc: withImage }),
    ch(5, { actId: 1, kind: "entry", title: "The Mark of Dibella", opensAfter: 10, fromSave: "Save 7", position: 2 }),
    ch(6, { actId: 1, kind: "beat", title: "Made with Care", opensAfter: 11, position: 3 }),
    ch(7, { actId: 1, kind: "beat", title: "The Note Under the Door", opensAfter: 12, position: 4 }),
    ch(8, { actId: 1, kind: "act", title: "The Sister's House", position: 5 }),
    ch(9, { actId: 2, kind: "act", title: "The Bard's Road", position: 6 }),
  ],
  snapshot: { source: "save", label: "Save 7", xp: null, day: null, place: null, readBy: null, at: new Date(), prevLabel: null, prevLevel: null, prevSkills: null, level: 6, skills: { Speech: 30 }, questStages: {}, counts: {} },
  link: () => null,
});

describe("the act's own chapter (WO-116)", () => {
  it("reads first in its act, and the act knows it", () => {
    expect(view.chapters.map((c) => c.id)).toEqual([1, 8, 5, 6, 7, 9]);
    expect(view.acts.map((a) => a.chapter)).toEqual([8, 9]);
  });
  it("is never a Story marker or an open beat; entries and beats hang off their objectives", () => {
    const [haelga, hunt] = view.acts[0].objectives;
    expect(haelga.tale).toEqual([expect.objectContaining({ id: 5, title: "The Mark of Dibella", open: true })]);
    expect(hunt.tale).toEqual([expect.objectContaining({ id: 6, open: false, opens: "opens when you tick this" })]);
    expect(view.acts[0].openBeats).toEqual([]);
  });
});

describe("the reader's stops (WO-116)", () => {
  const stops = runStops({ id: "e2ekyrya22", taleLine: "What is beautiful?", view, cover: "https://cover", isOwner: true });

  it("walk the whole tale in reading order, each at its own address", () => {
    expect(stops.map((s) => s.title)).toEqual(["Chapter One", "The Sister's House", "The Mark of Dibella", "Made with Care", "The Note Under the Door", "The Bard's Road"]);
    expect(stops[2].href).toBe("/p/e2ekyrya22/story/5");
    expect(stopAt(stops, "/p/e2ekyrya22/story/6")).toBe(3);
    expect(stopAt(stops, "/p/e2ekyrya22")).toBe(-1);
  });
  it("say where they are: the kicker, the place, the line", () => {
    expect(stops[0]).toMatchObject({ kicker: "Before Skyrim", place: "Before Skyrim", line: "What is beautiful?", cap: true, entry: false });
    expect(stops[1]).toMatchObject({ kicker: "Act I", place: "Act I", cap: true });
    expect(stops[2]).toMatchObject({ kicker: "Act I", place: "Act I | from save 7", line: "From save 7", cap: false, entry: true });
  });
  it("take the chapter's first image for the plate, else the act's picture, else the cover", () => {
    expect(stops[0]).toMatchObject({ plate: IMG, plateFromText: true });
    expect(stops[2]).toMatchObject({ plate: "https://cover", plateFromText: false });
    expect(stops[5]).toMatchObject({ plate: ACT_IMG, plateFromText: false });
  });
  it("stop at a waiting beat with what opens it", () => {
    expect(stops[3].waiting).toBe("Opens when you tick Hunt and tan her first hides.");
    expect(stops[4].waiting).toBe("Opens at Speech 40. Speech 30 now.");
    expect(stops[2].waiting).toBeNull();
  });
  it("send an entry's In the game back to its row, and the owner's Edit to the Story editor", () => {
    expect(stops[2].game).toEqual({ text: "Warn Haelga, or expose her", href: "/p/e2ekyrya22?act=1#o10" });
    expect(stops[1].game).toBeNull();
    expect(stops[2].edit).toBe("/p/e2ekyrya22/edit/story/5");
    expect(runStops({ id: "e2ekyrya22", taleLine: null, view, cover: null, isOwner: false })[2].edit).toBeNull();
  });
  it("give a build alone's Story one stop at /b/<id>/story", () => {
    const s = storyStop({ id: "e2estry222", title: "The Writ", line: "", doc: withImage, cover: null, isOwner: true });
    expect(s).toMatchObject({ href: "/b/e2estry222/story", title: "The Writ", line: null, plate: IMG, plateFromText: true, edit: "/b/e2estry222/edit/story", kicker: null });
  });
});

describe("the style guide (WO-116)", () => {
  it("says an act can open with its own chapter, and beats and entries hang off objectives", () => {
    expect(styleGuide()).toContain("Each act can open with its own chapter: the story of that stretch, written before the player plays it. Beats and entries hang off objectives.");
    // WO-117: the pictures are the player's.
    expect(styleGuide()).toContain("Assistants can't add pictures. When you finish a draft, give the player the addPictures link so they can add the cover and the story's pictures.");
  });
});
