/**
 * Constellation layouts for perk trees. Skill trees grow upward from the
 * first perk; the Destiny tree radiates out from its centre.
 */
import { PERKS_BY_TREE, type Perk } from "./data";

export interface TreeNode {
  id: string;
  x: number;
  y: number;
}

export interface TreeEdge {
  from: string;
  to: string;
  /** True when the perk needs any one of its prerequisites, not all. */
  anyOf: boolean;
  /** True when the prerequisite lives in another tree. */
  cross: boolean;
}

export interface TreeLayout {
  width: number;
  height: number;
  nodes: TreeNode[];
  edges: TreeEdge[];
  /** Prerequisites from other trees, drawn as a note rather than a node. */
  external: { id: string; tree: string; name: string; forId: string }[];
}

/** Horizontal spacing between nodes in a row: never closer than COL_MIN, no wider than COL_MAX. */
const COL_MIN = 44;
const COL_MAX = 118;
const ROW = 92;
const PAD_X = 50;
const PAD_TOP = 36;
const PAD_BOTTOM = 64;
/** A node's name is this wide; closer neighbours step down so names don't touch. */
const LABEL = 110;
const STAGGER = 46;

function depths(perks: Perk[]): Map<string, number> {
  const ids = new Set(perks.map((p) => p.id));
  const byId = new Map(perks.map((p) => [p.id, p]));
  const depth = new Map<string, number>();
  const d = (p: Perk): number => {
    const known = depth.get(p.id);
    if (known !== undefined) return known;
    const parents = p.requires.filter((r) => ids.has(r)).map((r) => byId.get(r)!);
    const v = parents.length ? 1 + Math.max(...parents.map(d)) : 0;
    depth.set(p.id, v);
    return v;
  };
  perks.forEach(d);
  return depth;
}

function layered(perks: Perk[], minWidth: number): TreeLayout {
  const depth = depths(perks);
  const rows: Perk[][] = [];
  for (const p of perks) (rows[depth.get(p.id)!] ??= []).push(p);
  const pos = new Map<string, number>();
  rows.forEach((row, ri) => {
    if (ri > 0) {
      const bc = new Map<string, number>();
      row.forEach((p, i) => {
        const parents = p.requires.filter((r) => pos.has(r));
        bc.set(p.id, parents.length ? parents.reduce((a, r) => a + pos.get(r)!, 0) / parents.length : i / Math.max(1, row.length));
      });
      row.sort((a, b) => bc.get(a.id)! - bc.get(b.id)! || (a.skill ?? 0) - (b.skill ?? 0) || a.name.localeCompare(b.name));
    } else {
      row.sort((a, b) => (a.skill ?? 0) - (b.skill ?? 0) || a.name.localeCompare(b.name));
    }
    row.forEach((p, i) => pos.set(p.id, row.length > 1 ? i / (row.length - 1) : 0.5));
  });
  const widest = Math.max(...rows.map((r) => r.length));
  const width = Math.max(minWidth, PAD_X * 2 + (widest - 1) * COL_MIN);
  const gaps = rows.map((row) => Math.max(COL_MIN, Math.min(COL_MAX, (width - PAD_X * 2) / Math.max(1, row.length - 1))));
  // Nodes in a crowded row take turns stepping down, so that any two names at the same height are LABEL apart.
  const levels = rows.map((row, ri) => (row.length > 1 ? Math.min(3, Math.ceil(LABEL / gaps[ri])) : 1));
  const height = PAD_TOP + PAD_BOTTOM + (rows.length - 1) * ROW + levels.reduce((a, k) => a + (k - 1) * STAGGER, 0);
  const nodes: TreeNode[] = [];
  let cursor = height - PAD_BOTTOM;
  rows.forEach((row, ri) => {
    const k = levels[ri];
    const top = cursor - (k - 1) * STAGGER;
    const gap = gaps[ri];
    const span = (row.length - 1) * gap;
    const left = (width - span) / 2;
    row.forEach((p, i) => nodes.push({ id: p.id, x: row.length > 1 ? left + i * gap : width / 2, y: top + (i % k) * STAGGER }));
    cursor = top - ROW;
  });
  return finish(perks, nodes, width, height);
}

function radial(perks: Perk[], room: number): TreeLayout {
  const depth = depths(perks);
  const rings: Perk[][] = [];
  for (const p of perks) (rings[depth.get(p.id)!] ??= []).push(p);
  const angle = new Map<string, number>();
  const size = Math.max(560, Math.min(760, room));
  const c = size / 2;
  const step = (c - 56) / Math.max(1, rings.length - 1);
  const nodes: TreeNode[] = [];
  rings.forEach((ring, ri) => {
    if (ri === 0) {
      ring.forEach((p) => {
        angle.set(p.id, 0);
        nodes.push({ id: p.id, x: c, y: c });
      });
      return;
    }
    const mean = (p: Perk) => {
      const parents = p.requires.filter((r) => angle.has(r)).map((r) => angle.get(r)!);
      if (!parents.length) return 0;
      // Mean of angles via vectors so that 350° and 10° average to 0°, not 180°.
      const x = parents.reduce((a, t) => a + Math.cos(t), 0);
      const y = parents.reduce((a, t) => a + Math.sin(t), 0);
      return Math.atan2(y, x);
    };
    const keyed = ring.map((p) => ({ p, a: mean(p) }));
    keyed.sort((a, b) => a.a - b.a || a.p.name.localeCompare(b.p.name));
    const r = ri * step;
    const n = keyed.length;
    const slot = (2 * Math.PI) / n;
    // Spread the ring evenly, rotated so each node sits as close as it can
    // to the direction of its own prerequisites.
    let offset = -Math.PI / 2;
    if (ri > 1) {
      const sx = keyed.reduce((acc, k, i) => acc + Math.cos(k.a - i * slot), 0);
      const sy = keyed.reduce((acc, k, i) => acc + Math.sin(k.a - i * slot), 0);
      offset = Math.atan2(sy, sx);
    }
    keyed.forEach(({ p }, i) => {
      const a = offset + i * slot;
      angle.set(p.id, a);
      nodes.push({ id: p.id, x: c + r * Math.cos(a), y: c + r * Math.sin(a) });
    });
  });
  return finish(perks, nodes, size, size);
}

function finish(perks: Perk[], nodes: TreeNode[], width: number, height: number): TreeLayout {
  const ids = new Set(perks.map((p) => p.id));
  const edges: TreeEdge[] = [];
  const external: TreeLayout["external"] = [];
  for (const p of perks)
    for (const r of p.requires) {
      if (ids.has(r)) edges.push({ from: r, to: p.id, anyOf: p.anyOf, cross: false });
      else {
        const [tree, ...rest] = r.split(":");
        external.push({ id: r, tree, name: rest.join(":"), forId: p.id });
      }
    }
  return { width, height, nodes: nodes.map((n) => ({ ...n, x: Math.round(n.x), y: Math.round(n.y) })), edges, external };
}

const cache = new Map<string, TreeLayout>();

/**
 * Layout for a tree. `width` is the room available; a tree spreads into it
 * and grows wider (scrolling) only when its widest row needs more.
 */
export function treeLayout(tree: string, width = 600): TreeLayout {
  const key = `${tree}:${width}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const perks = PERKS_BY_TREE.get(tree) ?? [];
  const out = tree === "Destiny" ? radial(perks, width) : layered(perks, Math.max(320, width));
  cache.set(key, out);
  return out;
}
