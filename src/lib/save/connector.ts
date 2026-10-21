import { closeSync, existsSync, openSync, readdirSync, readFileSync, readSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { readHeader, readSave, type QuestForms, type SaveRead } from "./read";

/**
 * The save connector's work (WO-112 Part 3), in Node: find the saves in the player's folders, list them by
 * character from their headers alone, and read the newest one, or the newest of a character. It answers
 * with the reader's fields only; the save file goes nowhere.
 */

export interface SaveFile {
  file: string;
  character: string;
  level: number;
  place: string;
  saveNumber: number;
  /** When the file was written, ISO. */
  when: string;
}

/** The folders to look in when none are set: every profile's saves under the LoreRim folder, and the game's own. */
export function defaultFolders(home: string): string[] {
  return ["C:\\LoreRim", join(home, "Documents", "My Games", "Skyrim Special Edition", "Saves")];
}

/** Every .ess in a folder: a folder of saves, a profile (its saves), or the LoreRim folder (each profile's saves). */
export function saveFiles(folders: string[]): string[] {
  const out = new Set<string>();
  const ess = (dir: string) => {
    try {
      for (const f of readdirSync(dir)) if (f.toLowerCase().endsWith(".ess")) out.add(join(dir, f));
    } catch {
      // a folder that isn't there, or can't be read, has no saves
    }
  };
  const isDir = (p: string) => {
    try {
      return statSync(p).isDirectory();
    } catch {
      return false;
    }
  };
  for (const folder of folders) {
    if (!folder || !isDir(folder)) continue;
    ess(folder);
    if (isDir(join(folder, "saves"))) ess(join(folder, "saves"));
    const profiles = join(folder, "profiles");
    if (isDir(profiles)) for (const p of readdirSync(profiles)) ess(join(profiles, p, "saves"));
  }
  return [...out];
}

/** The first part of a file: a save's header and screenshot (320 by 192 pixels, about 240 KB) fit in 1 MB. */
function head(file: string, bytes = 1 << 20): Uint8Array {
  const fd = openSync(file, "r");
  try {
    const buf = new Uint8Array(bytes);
    const n = readSync(fd, buf, 0, bytes, 0);
    return buf.subarray(0, n);
  } finally {
    closeSync(fd);
  }
}

/** The saves in the folders, newest first, each from its header alone. A file that isn't a save is skipped. */
export function listSaves(folders: string[], opts: { character?: string; limit?: number } = {}): SaveFile[] {
  const rows: SaveFile[] = [];
  for (const file of saveFiles(folders)) {
    try {
      const h = readHeader(head(file));
      rows.push({ file, character: h.name, level: h.level, place: h.place, saveNumber: h.saveNumber, when: statSync(file).mtime.toISOString() });
    } catch {
      // not a save the reader knows
    }
  }
  rows.sort((a, b) => (a.when < b.when ? 1 : a.when > b.when ? -1 : b.saveNumber - a.saveNumber));
  const who = opts.character?.trim().toLowerCase();
  const picked = who ? rows.filter((r) => r.character.trim().toLowerCase() === who) : rows;
  return picked.slice(0, opts.limit ?? 10);
}

/** What the reader found in a save, as set_snapshot takes it (rule 18): source "save", its label, and the fields. */
export function snapshotOf(s: SaveRead) {
  const questStages = Object.fromEntries(Object.entries(s.quests).flatMap(([k, q]) => (k.length <= 80 && q.stage <= 10_000 ? [[k, q.stage]] : [])));
  return { source: "save" as const, label: `Save ${s.saveNumber}`, level: s.level, xp: s.xp, day: s.day, ...(s.place ? { place: s.place } : {}), skills: s.skills ?? {}, questStages,
    ...(s.counts ? { counts: s.counts } : {}) };
}

export type LatestAnswer =
  | { found: true; note: string | null; file: string; when: string; save: Omit<SaveRead, "quests"> & { quests: number }; snapshot: ReturnType<typeof snapshotOf> }
  | { found: false; note: string; saves: SaveFile[] };

/**
 * The newest save across the folders. With a character: when the newest save is someone else, that
 * character's newest instead, and it says so; with no save of theirs, the five newest saves to choose from.
 */
export function readLatest(folders: string[], forms: QuestForms, character?: string): LatestAnswer {
  const all = listSaves(folders, { limit: 10_000 });
  if (!all.length) return { found: false, note: "There are no saves in the save folders. Check the connector's folders setting.", saves: [] };
  let pick = all[0];
  let note: string | null = null;
  const who = character?.trim();
  if (who && pick.character.trim().toLowerCase() !== who.toLowerCase()) {
    const theirs = all.find((r) => r.character.trim().toLowerCase() === who.toLowerCase());
    if (!theirs)
      return {
        found: false,
        note: `There's no save of ${who}. The newest saves are below: ask the player which one to read.`,
        saves: all.slice(0, 5),
      };
    note = `The newest save is ${pick.character}'s (Save ${pick.saveNumber}); this is ${theirs.character}'s newest, Save ${theirs.saveNumber}.`;
    pick = theirs;
  }
  const s = readSave(new Uint8Array(readFileSync(pick.file)), forms);
  const { quests, ...rest } = s;
  return { found: true, note, file: basename(pick.file), when: pick.when, save: { ...rest, quests: Object.keys(quests).length }, snapshot: snapshotOf(s) };
}

/** quest_forms.json beside the server, or in the planner's data when run from the repo. */
export function loadForms(paths: string[]): QuestForms {
  for (const p of paths) if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8")) as QuestForms;
  return {};
}
