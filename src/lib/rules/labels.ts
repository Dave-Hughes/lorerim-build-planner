/**
 * Star labels for the perk trees. In the game a star's name shows when you
 * point at it; here each name shows when there is room. Labels are placed
 * greedily in priority order (the selected star, then taken, can take now, not
 * yet; within a priority, stars lower in the tree first), trying below the
 * star, then above, right, left. A label that would overlap another label or a
 * star (lines end at stars), or leave the box, is not shown; that star shows
 * its name on hover and focus instead. Among the spots that fit, one clear of
 * every line is preferred; a label only sits across a line when nothing else fits.
 */

export interface LabelRequest {
  id: string;
  x: number;
  y: number;
  /** The name, then at most one more line (its requirement). */
  lines: [string] | [string, string];
  /** 0 selected, 1 taken, 2 can take now, 3 not yet. */
  priority: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlacedLabel extends Rect {
  id: string;
  side: "below" | "above" | "right" | "left";
}

export interface LabelOptions {
  width: number;
  height: number;
  /** Star radius in px. */
  star: number;
  /** Name size in px (12 at least); the second line is a size smaller, never under 12. */
  font: number;
  /** Width of a string at a font size. Defaults to an estimate for the body face. */
  measure?: (text: string, size: number) => number;
  /** Which stars get labels at all (small screens at fit size: taken and selected only). */
  maxPriority?: number;
  /** The tree's lines, to keep labels off them where possible. */
  lines?: { x1: number; y1: number; x2: number; y2: number }[];
}

const GAP = 4;

/** An estimate of Sofia Sans widths, for tests and before fonts load. */
export const estimateWidth = (text: string, size: number) => text.length * size * 0.56;

export function labelSizes(font: number) {
  const name = Math.max(12, font);
  const sub = Math.max(12, font - 1);
  return { name, sub, lineName: Math.round(name * 1.2), lineSub: Math.round(sub * 1.2) };
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** Whether a line segment passes through a rectangle (Liang-Barsky clipping). */
export function crosses(r: Rect, l: { x1: number; y1: number; x2: number; y2: number }): boolean {
  let t0 = 0;
  let t1 = 1;
  const dx = l.x2 - l.x1;
  const dy = l.y2 - l.y1;
  const edges: [number, number][] = [
    [-dx, l.x1 - r.x],
    [dx, r.x + r.w - l.x1],
    [-dy, l.y1 - r.y],
    [dy, r.y + r.h - l.y1],
  ];
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return false;
    } else {
      const t = q / p;
      if (p < 0) t0 = Math.max(t0, t);
      else t1 = Math.min(t1, t);
      if (t0 > t1) return false;
    }
  }
  return true;
}

export function starRect(x: number, y: number, r: number): Rect {
  return { x: x - r - 1, y: y - r - 1, w: 2 * r + 2, h: 2 * r + 2 };
}

export function placeLabels(stars: LabelRequest[], o: LabelOptions): Map<string, PlacedLabel> {
  const measure = o.measure ?? estimateWidth;
  const sz = labelSizes(o.font);
  const starRects = new Map(stars.map((s) => [s.id, starRect(s.x, s.y, o.star)]));
  const placed: PlacedLabel[] = [];
  const out = new Map<string, PlacedLabel>();
  const order = [...stars]
    .filter((s) => s.priority <= (o.maxPriority ?? 3))
    .sort((a, b) => a.priority - b.priority || b.y - a.y || a.x - b.x);

  for (const s of order) {
    const w = Math.ceil(Math.max(measure(s.lines[0], sz.name), s.lines[1] ? measure(s.lines[1], sz.sub) : 0)) + 2;
    const h = sz.lineName + (s.lines[1] ? sz.lineSub : 0);
    const r = o.star;
    const candidates: PlacedLabel[] = [
      { id: s.id, side: "below", x: s.x - w / 2, y: s.y + r + GAP, w, h },
      { id: s.id, side: "above", x: s.x - w / 2, y: s.y - r - GAP - h, w, h },
      { id: s.id, side: "right", x: s.x + r + GAP + 2, y: s.y - h / 2, w, h },
      { id: s.id, side: "left", x: s.x - r - GAP - 2 - w, y: s.y - h / 2, w, h },
    ];
    const fits = (c: PlacedLabel) =>
      c.x >= 0 &&
      c.y >= 0 &&
      c.x + c.w <= o.width &&
      c.y + c.h <= o.height &&
      !placed.some((p) => overlaps(c, p)) &&
      ![...starRects.values()].some((sr) => overlaps(c, sr));
    const clear = (c: PlacedLabel) => !(o.lines ?? []).some((l) => crosses({ x: c.x - 1, y: c.y - 1, w: c.w + 2, h: c.h + 2 }, l));
    const hit = candidates.find((c) => fits(c) && clear(c)) ?? candidates.find(fits);
    if (hit) {
      placed.push(hit);
      out.set(s.id, hit);
    } else if (s.priority === 0) {
      // The selected star's label always shows: take the first spot in the box, and hide
      // any neighbour labels it covers.
      const c = candidates.find((c) => c.x >= 0 && c.y >= 0 && c.x + c.w <= o.width && c.y + c.h <= o.height && ![...starRects.values()].some((sr) => overlaps(c, sr))) ?? candidates[0];
      for (const p of placed.filter((p) => overlaps(c, p))) {
        placed.splice(placed.indexOf(p), 1);
        out.delete(p.id);
      }
      placed.push(c);
      out.set(s.id, c);
    }
  }
  return out;
}
