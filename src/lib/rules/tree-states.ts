/**
 * How a perk tree shows what the build has: which lines are its path and where it can
 * go next. A star is held when it has at least one rank (or its tree is granted).
 */
import type { GameData } from "./data";
import type { PerkStatus } from "./derive";
import type { TreeEdge } from "./layout";

export type LineState = "held" | "next" | "other";

export function isHeld(s: PerkStatus | undefined): boolean {
  return !!s && (s.ranksTaken > 0 || s.granted);
}

/**
 * held: both ends held (the path you are on). next: one end held, the other can be taken now
 * (where you can go). other: everything else. The game's lines aren't always drawn parent to
 * child, so either end may be the held one.
 */
export function lineState(a: PerkStatus | undefined, b: PerkStatus | undefined): LineState {
  if (isHeld(a) && isHeld(b)) return "held";
  if ((isHeld(a) && b?.state === "open") || (isHeld(b) && a?.state === "open")) return "next";
  return "other";
}

export interface LineLook {
  kind: LineState | "chain";
  /** Width as a multiple of the tree's line size. */
  width: number;
  dashed: boolean;
}

/**
 * How a line is drawn. held: ember, 2.5x, on top. next: brass. chain (a selected star's
 * prerequisites): dashed brass. other: grey; "either of" lines keep their dashes.
 */
export function lineLook(state: LineState, anyOf: boolean, inChain: boolean): LineLook {
  if (state === "held") return { kind: "held", width: 2.5, dashed: false };
  if (inChain) return { kind: "chain", width: 1.2, dashed: true };
  if (state === "next") return { kind: "next", width: 1, dashed: false };
  return { kind: "other", width: 1, dashed: anyOf };
}

/**
 * For a selected star that isn't held: the lines from it back down to the nearest held stars,
 * following its prerequisites in the same tree, as "from>to" keys of the tree's lines.
 */
export function prerequisiteLines(d: GameData, edges: TreeEdge[], status: Map<string, PerkStatus>, selected: string | null | undefined): Set<string> {
  const out = new Set<string>();
  if (!selected || isHeld(status.get(selected))) return out;
  const lineKey = (x: string, y: string) => {
    const e = edges.find((e) => (e.from === x && e.to === y) || (e.from === y && e.to === x));
    return e ? `${e.from}>${e.to}` : null;
  };
  const seen = new Set<string>();
  const walk = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const p = d.perkById.get(id);
    for (const r of p?.requires ?? []) {
      if (!status.has(r)) continue; // another tree
      const k = lineKey(r, id);
      if (k) out.add(k);
      if (!isHeld(status.get(r))) walk(r);
    }
  };
  walk(selected);
  return out;
}

/** Perks held in a tree by a level's state (every perk of a tree Master of One grants). */
export function heldCount(d: GameData, tree: string, s: { perksTaken: Record<string, number[]>; destinyTaken: Record<string, number>; grantedTree: string | null }): number {
  if (tree === "Destiny") return Object.keys(s.destinyTaken).length;
  if (s.grantedTree === tree) return d.perksByTree.get(tree)?.length ?? 0;
  return Object.entries(s.perksTaken).filter(([id, levels]) => levels.length > 0 && d.perkById.get(id)?.tree === tree).length;
}
