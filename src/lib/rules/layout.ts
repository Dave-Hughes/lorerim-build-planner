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

/** How tall a tree drawn `width` wide stands when its width binds: the stars' span plus the label padding. */
export function fitHeight(d: GameData, tree: string, width: number, pad: LayoutPadding = DEFAULT_PADDING): number {
  const ys = (d.perksByTree.get(tree) ?? []).filter((p) => p.pos).map((p) => p.pos![1]);
  const xs = (d.perksByTree.get(tree) ?? []).filter((p) => p.pos).map((p) => p.pos![0]);
  if (!ys.length) return pad.top + pad.bottom;
  const spanX = Math.max(Math.max(...xs) - Math.min(...xs), 1e-6);
  const spanY = Math.max(...ys) - Math.min(...ys);
  const scale = Math.max(1, width - 2 * pad.x) / spanX;
  return Math.ceil(spanY * scale + pad.top + pad.bottom);
}

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

/** The span of a tree's stars in game units, and the distance between its two closest stars. */
export function treeMetrics(d: GameData, tree: string): { spanX: number; spanY: number; minDist: number } {
  const pts = (d.perksByTree.get(tree) ?? []).filter((p) => p.pos).map((p) => p.pos!);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  let minDist = Infinity;
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) minDist = Math.min(minDist, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]));
  return {
    spanX: Math.max(Math.max(...xs) - Math.min(...xs), 1e-6),
    spanY: Math.max(Math.max(...ys) - Math.min(...ys), 1e-6),
    minDist: Number.isFinite(minDist) && minDist > 0 ? minDist : 1,
  };
}

/** Closest two stars this far apart at the readable size. */
export const READABLE_GAP = 88;
/** The readable size is at most this many times the fit size. */
export const READABLE_CAP = 2.5;

/**
 * The drawing's size for a box: at `scale` px per game unit (the readable scale when not given),
 * never smaller than the box. Readable = the larger of the fit-to-box scale and the scale at which
 * the two closest stars are READABLE_GAP apart, capped at READABLE_CAP times fit. Simple trees still
 * fit the box; dense ones grow past it, and the page pans inside the box.
 */
export function drawingSize(
  d: GameData,
  tree: string,
  boxW: number,
  boxH: number,
  pad: LayoutPadding = DEFAULT_PADDING,
  scale?: number,
): { width: number; height: number; scale: number; fitScale: number; readableScale: number } {
  const m = treeMetrics(d, tree);
  const fitScale = Math.min(Math.max(1, boxW - 2 * pad.x) / m.spanX, Math.max(1, boxH - pad.top - pad.bottom) / m.spanY);
  const readableScale = Math.max(fitScale, Math.min(READABLE_GAP / m.minDist, READABLE_CAP * fitScale));
  const s = scale ?? readableScale;
  return {
    width: Math.max(boxW, Math.ceil(s * m.spanX + 2 * pad.x)),
    height: Math.max(boxH, Math.ceil(s * m.spanY + pad.top + pad.bottom)),
    scale: s,
    fitScale,
    readableScale,
  };
}
