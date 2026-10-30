import type { Never, Theme } from "./types";

/** Who she is (WO-181), read off a playthrough: whether anything is written, and the three lists as the page shows them. Pure. */
type Told = { theme: Theme | null; never: Never[] | null };

export function hasWho(p: Told): boolean {
  const t = p.theme ?? {};
  return !!(t.backstory?.trim() || t.from || t.gods || t.goal || t.will?.length || t.grey?.length || p.never?.length);
}

export function themeLines(p: Told): { will: string[]; wont: string[]; grey: string[] } {
  const t = p.theme ?? {};
  return { will: t.will ?? [], wont: (p.never ?? []).map((n) => (n.words ?? n.what).trim()).filter(Boolean), grey: t.grey ?? [] };
}
