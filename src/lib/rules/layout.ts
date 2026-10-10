/**
 * Perk trees drawn as the game lays them out: each star at the game's own
 * position, only scaled into the box (one scale for both axes, y flipped so
 * the tree grows upward, centred). Stars are never reordered or nudged. The
 * lines are the ones the game draws (`linksTo`), which mostly match the
 * prerequisites; where they don't, the game's picture wins on screen and the
 * rules (`requires`) win in the engine.
 */
import type { GameData } from "./data";

export interface TreeNode {
  id: string;
  x: number;
  y: number;
}

export interface TreeEdge {
  from: string;
  to: string;
  /** True when the star at `to` needs any one of its prerequisites, not all. */
  anyOf: boolean;
}

export interface TreeLayout {
  width: number;
  height: number;
  /** Pixels per game unit. */
  scale: number;
  nodes: TreeNode[];
  edges: TreeEdge[];
  /** Prerequisites from other trees, shown with the star's name rather than drawn. */
  external: { id: string; tree: string; name: string; forId: string }[];
}

export interface LayoutPadding {
  x: number;
  top: number;
  bottom: number;
}

/** Room around the stars for their labels. */
export const DEFAULT_PADDING: LayoutPadding = { x: 70, top: 30, bottom: 58 };

export function treeLayout(d: GameData, tree: string, width: number, height: number, pad: LayoutPadding = DEFAULT_PADDING): TreeLayout {
  const perks = (d.perksByTree.get(tree) ?? []).filter((p) => p.pos);
  const xs = perks.map((p) => p.pos![0]);
  const ys = perks.map((p) => p.pos![1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 1e-6);
  const spanY = Math.max(maxY - minY, 1e-6);
  const roomX = Math.max(1, width - 2 * pad.x);
  const roomY = Math.max(1, height - pad.top - pad.bottom);
  // One scale for both axes: the tree fills the width or the height, whichever binds first.
  const scale = Math.min(roomX / spanX, roomY / spanY);
  const offX = pad.x + (roomX - spanX * scale) / 2;
  const offY = pad.top + (roomY - spanY * scale) / 2;
  const nodes = perks.map((p) => ({
    id: p.id,
    x: offX + (p.pos![0] - minX) * scale,
    y: offY + (maxY - p.pos![1]) * scale,
  }));

  const ids = new Set(nodes.map((n) => n.id));
  const edges: TreeEdge[] = (d.linksByTree.get(tree) ?? [])
    .filter(([a, b]) => ids.has(a) && ids.has(b))
    .map(([from, to]) => {
      const p = d.perkById.get(to);
      return { from, to, anyOf: !!p?.anyOf && p.requires.includes(from) };
    });

  const external: TreeLayout["external"] = [];
  for (const p of perks)
    for (const r of p.requires) {
      const o = d.perkById.get(r);
      if (o && o.tree !== tree) external.push({ id: r, tree: o.tree, name: o.name, forId: p.id });
    }

  return { width, height, scale, nodes, edges, external };
}
