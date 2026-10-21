import { mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { listSaves, readLatest, saveFiles, snapshotOf } from "./connector";
import { buildSave } from "./fixture";

// The save connector (WO-112 Part 3) on a LoreRim folder and the game's own saves folder, built here.

let root: string;
let lorerim: string;
let documents: string;
const FORMS = { "skyrim.esm:041f91": "FreeformRiften11" };

function put(dir: string, file: string, save: Uint8Array, minutesAgo: number) {
  mkdirSync(dir, { recursive: true });
  const p = join(dir, file);
  writeFileSync(p, save);
  const t = new Date(Date.UTC(2026, 9, 20, 22, 0) - minutesAgo * 60_000);
  utimesSync(p, t, t);
}

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "save-connector-"));
  lorerim = join(root, "LoreRim");
  documents = join(root, "Saves");
  const kyria = (n: number) => buildSave({ name: "Kyria Severa", saveNumber: n, quests: [{ form: 0x041f91, stages: [[10, 1], [12, 1]] }] });
  put(join(lorerim, "profiles", "Extreme DLSS5", "saves"), "Save62_Kyria.ess", kyria(62), 10);
  put(join(lorerim, "profiles", "Extreme DLSS5", "saves"), "Save61_Kyria.ess", kyria(61), 20);
  put(join(lorerim, "profiles", "Extreme", "saves"), "Save243_Azrem.ess", buildSave({ name: "Azrem Shieldbreaker", saveNumber: 243, level: 21 }), 60);
  put(join(lorerim, "profiles", "Extreme", "saves"), "notes.ess", new TextEncoder().encode("not a save"), 5);
  put(documents, "Autosave1_Varsk.ess", buildSave({ name: "Varsk", saveNumber: 1, level: 1 }), 600);
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("the save connector", () => {
  it("finds every profile's saves under the LoreRim folder, and a saves folder's own", () => {
    expect(saveFiles([lorerim, documents, join(root, "nowhere")]).length).toBe(5);
  });

  it("lists the saves newest first, from their headers, skipping a file that isn't a save", () => {
    const saves = listSaves([lorerim, documents]);
    expect(saves.map((s) => [s.character, s.saveNumber])).toEqual([["Kyria Severa", 62], ["Kyria Severa", 61], ["Azrem Shieldbreaker", 243], ["Varsk", 1]]);
    expect(listSaves([lorerim, documents], { character: "azrem shieldbreaker" }).map((s) => s.saveNumber)).toEqual([243]);
    expect(listSaves([lorerim, documents], { limit: 1 })).toHaveLength(1);
  });

  it("reads the newest save, with what set_snapshot takes", () => {
    const a = readLatest([lorerim, documents], FORMS);
    expect(a.found && a.note).toBeNull();
    if (!a.found) throw new Error("not found");
    expect(a.save).toMatchObject({ name: "Kyria Severa", level: 10, day: 15, place: "The Rift", saveNumber: 62, quests: 1 });
    expect(a.snapshot).toEqual({ source: "save", label: "Save 62", level: 10, xp: 197, day: 15, place: "The Rift", skills: {}, questStages: { FreeformRiften11: 12 } });
  });

  it("reads a character's newest when the newest save is someone else's, and says so", () => {
    const a = readLatest([lorerim, documents], FORMS, "Azrem Shieldbreaker");
    if (!a.found) throw new Error("not found");
    expect(a.note).toBe("The newest save is Kyria Severa's (Save 62); this is Azrem Shieldbreaker's newest, Save 243.");
    expect(a.save.level).toBe(21);
  });

  it("with no save of that character, lists the five newest to choose from", () => {
    const a = readLatest([lorerim, documents], FORMS, "Lydia");
    expect(a.found).toBe(false);
    if (a.found) throw new Error("found");
    expect(a.note).toBe("There's no save of Lydia. The newest saves are below: ask the player which one to read.");
    expect(a.saves.map((s) => s.saveNumber)).toEqual([62, 61, 243, 1]);
  });

  it("passes skills and the lute to set_snapshot when the save has them (WO-123)", () => {
    const s = snapshotOf({ name: "K", level: 10, xp: 0, xpToNext: 525, day: 15, place: "", saveNumber: 70, race: "", quests: {}, skills: { Speech: 45 }, counts: { lute: 199 } });
    expect(s).toMatchObject({ skills: { Speech: 45 }, counts: { lute: 199 } });
  });

  it("leaves out a stage past what a snapshot holds", () => {
    const s = snapshotOf({ name: "K", level: 1, xp: 0, xpToNext: 75, day: 1, place: "", saveNumber: 1, race: "", quests: { A: { stage: 20, completed: false }, B: { stage: 20000, completed: false } } });
    expect(s.questStages).toEqual({ A: 20 });
    expect("place" in s).toBe(false);
  });

  it("is in the style guide: read the save with it, never set a snapshot from memory", () => {
    const style = readFileSync(join(process.cwd(), "content", "mcp", "style.md"), "utf8");
    expect(style).toContain("When the player has the save connector, read the save with it and pass what it found to set_snapshot unchanged. Never set a snapshot from memory.");
  });
});
