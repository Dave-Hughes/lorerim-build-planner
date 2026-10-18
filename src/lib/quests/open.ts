/**
 * Where you are, and what's open to you (WO-100). Pure: the pages and the tests share it.
 *
 * A line is open when its minLevel is at most your level, every line in its `after` is finished,
 * and, for the main quest, yours is at or past its `mainQuestAt`. A line that needs part of the main
 * quest with no `mainQuestAt` doesn't block. With no level entered, nothing is open or locked.
 */
import type { LineGate } from "./types";

export const MAIN = "main-quest";

export interface Where {
  level: number | null;
  /** The main quest quest you're done up to (its EDID), or null for not started. */
  mainAt: string | null;
  /** Finished lines, by id. */
  finished: string[];
}

export const NOWHERE: Where = { level: null, mainAt: null, finished: [] };

/** Whether you're done with the main quest through `edid`, given the main quest's quests in order. */
export function mainDone(where: Where, edid: string, mainOrder: string[]): boolean {
  if (!where.mainAt) return false;
  const at = mainOrder.indexOf(where.mainAt);
  const need = mainOrder.indexOf(edid);
  return at >= 0 && need >= 0 && at >= need;
}

export type Need =
  | { kind: "level"; level: number; ok: boolean }
  | { kind: "line"; id: string; ok: boolean }
  | { kind: "main"; edid: string; ok: boolean }
  | { kind: "main-unchecked" };

/** A line's needs, each checked against where you are. */
export function needsOf(line: LineGate, where: Where, mainOrder: string[]): Need[] {
  const out: Need[] = [];
  if (line.minLevel) out.push({ kind: "level", level: line.minLevel, ok: where.level !== null && where.level >= line.minLevel });
  for (const a of line.after) {
    if (a === MAIN) out.push(line.mainQuestAt ? { kind: "main", edid: line.mainQuestAt, ok: mainDone(where, line.mainQuestAt, mainOrder) } : { kind: "main-unchecked" });
    else out.push({ kind: "line", id: a, ok: where.finished.includes(a) });
  }
  return out;
}

/** "open", "locked", or null when no level is entered (nothing is counted then). */
export function openState(line: LineGate, where: Where, mainOrder: string[]): "open" | "locked" | null {
  if (where.level === null) return null;
  return needsOf(line, where, mainOrder).every((n) => n.kind === "main-unchecked" || n.ok) ? "open" : "locked";
}

/** Reads a stored Where leniently: anything odd falls back to nothing entered. */
export function parseWhere(raw: string | null | undefined): Where {
  try {
    const v = JSON.parse(raw ?? "null") as Partial<Where> | null;
    if (!v || typeof v !== "object") return NOWHERE;
    const level = typeof v.level === "number" && Number.isFinite(v.level) && v.level >= 1 && v.level <= 999 ? Math.floor(v.level) : null;
    return {
      level,
      mainAt: typeof v.mainAt === "string" ? v.mainAt : null,
      finished: Array.isArray(v.finished) ? v.finished.filter((f): f is string => typeof f === "string") : [],
    };
  } catch {
    return NOWHERE;
  }
}
