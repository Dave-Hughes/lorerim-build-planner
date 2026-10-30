/** The Quests pages' small bits of wording (WO-100), shared by the server pages and the browser. */
import type { Checked, QuestLine } from "./types";

const FROM: Record<Checked, string> = { files: "the game files", "mod page": "the mod page", players: "players" };
const FACT: Record<string, string> = { start: "start", gate: "needs", size: "length", level: "enemies", note: "the note" };

/** "Start and needs from the game files. Length from players." */
export function checkedLine(checked: QuestLine["checked"]): string {
  const by = new Map<Checked, string[]>();
  for (const [k, v] of Object.entries(checked) as [string, Checked][]) {
    if (!FACT[k]) continue;
    by.set(v, [...(by.get(v) ?? []), FACT[k]]);
  }
  return [...by]
    .map(([src, facts]) => {
      const list = facts.length > 1 ? `${facts.slice(0, -1).join(", ")} and ${facts.at(-1)}` : facts[0];
      return `${list[0].toUpperCase()}${list.slice(1)} from ${FROM[src]}.`;
    })
    .join(" ");
}

/** Where a fact came from, said short: "game files" or "field guide" (the mod page and players are in the field guide). */
export const fromLabel = (c: Checked | undefined) => (c === "files" ? "game files" : c ? "field guide" : null);

/** "A and B", "A, B and C". */
export function andList(items: string[]): string {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}` : (items[0] ?? "");
}

/** "20–40 on the island" stays; numbers read as the game writes them. */
export const levelChip = (minLevel: number | undefined, level: number | null, known = true): { text: string; above: boolean } => {
  if (!minLevel) return { text: known ? "Any level" : "Not sure yet", above: false };
  if (level !== null && minLevel > level) return { text: `Opens at level ${minLevel}`, above: true };
  return { text: `Level ${minLevel}`, above: false };
};
