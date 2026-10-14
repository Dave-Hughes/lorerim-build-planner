/**
 * Star labels for the perk trees. In the game a star's name shows when you
 * point at it; here each name shows when there is room. Labels are placed once
 * for a tree and level, greedily in priority order (taken, can take now, not
 * yet; within a priority, stars lower in the tree first), trying below the
 * star, then above, right, left, then below and above shifted sideways. A spot
 * that would overlap another label or a star (lines end at stars), leave the
 * box, or sit nearer another star than its own is not used; a star without a
 * spot shows its name on hover and focus instead. "Nearer another star" means that star is at least
 * as near both to the label's edge and to its centre. Among the spots that fit, one
 * clear of every line is preferred.
 *
 * Selecting a star never moves a label: if it has none, its label is added in
 * the spot that hides the fewest others (see withSelected).
 */

export interface LabelRequest {
  id: string;
  x: number;
  y: number;
  /** The name, then at most one more line (its requirement). */
  lines: [string] | [string, string];
  /** 1 taken, 2 can take now, 3 not yet (0, an older "selected", counts as 1). */
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
  /** Crowded: the name alone, without its requirement line. */
  nameOnly?: boolean;
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

/** Distance from a point to the nearest point of a rectangle. */
function distTo(r: Rect, x: number, y: number): number {
  const dx = Math.max(r.x - x, 0, x - (r.x + r.w));
  const dy = Math.max(r.y - y, 0, y - (r.y + r.h));
  return Math.hypot(dx, dy);
}

/**
 * Whether label `c` reads as belonging to star `other` rather than `own`: `other` is at least as
 * near both to the label's nearest edge and to its centre.
 */
export function nearerTo(c: Rect, other: { x: number; y: number }, own: { x: number; y: number }): boolean {
  const cx = c.x + c.w / 2;
  const cy = c.y + c.h / 2;
  return distTo(c, other.x, other.y) <= distTo(c, own.x, own.y) && Math.hypot(other.x - cx, other.y - cy) <= Math.hypot(own.x - cx, own.y - cy);
}

/**
 * The spots a star's label may take, in order of preference: the full label, then (taken and
 * can-take stars, where they are crowded) the name alone.
 */
export function labelCandidates(s: LabelRequest, o: LabelOptions): PlacedLabel[] {
  const full = spots(s, o, false);
  // Every star may fall back to its name alone (WO-73: every star keeps a label at Fit).
  return s.lines[1] ? [...full, ...spots(s, o, true)] : full;
}

function spots(s: LabelRequest, o: LabelOptions, nameOnly: boolean): PlacedLabel[] {
  const measure = o.measure ?? estimateWidth;
  const sz = labelSizes(o.font);
  const two = !!s.lines[1] && !nameOnly;
  const w = Math.ceil(Math.max(measure(s.lines[0], sz.name), two ? measure(s.lines[1]!, sz.sub) : 0)) + 2;
  const h = sz.lineName + (two ? sz.lineSub : 0);
  const r = o.star;
  const below = s.y + r + GAP;
  const above = s.y - r - GAP - h;
  const shift = Math.round(w * 0.35);
  return [
    { id: s.id, nameOnly, side: "below", x: s.x - w / 2, y: below, w, h },
    { id: s.id, nameOnly, side: "above", x: s.x - w / 2, y: above, w, h },
    { id: s.id, nameOnly, side: "right", x: s.x + r + GAP + 2, y: s.y - h / 2, w, h },
    { id: s.id, nameOnly, side: "left", x: s.x - r - GAP - 2 - w, y: s.y - h / 2, w, h },
    { id: s.id, nameOnly, side: "below", x: s.x - w / 2 + shift, y: below, w, h },
    { id: s.id, nameOnly, side: "below", x: s.x - w / 2 - shift, y: below, w, h },
    { id: s.id, nameOnly, side: "above", x: s.x - w / 2 + shift, y: above, w, h },
    { id: s.id, nameOnly, side: "above", x: s.x - w / 2 - shift, y: above, w, h },
    // Crowded (the name alone, or a one-line label): staggered up to three rows deep, over a
    // neighbour's label row (WO-73), and further to the sides.
    ...(nameOnly || !s.lines[1]
      ? ([1, 2].flatMap((k) =>
          [0, shift, -shift].flatMap((dx) => [
            { id: s.id, nameOnly, side: "above", x: s.x - w / 2 + dx, y: above - k * h, w, h },
            { id: s.id, nameOnly, side: "below", x: s.x - w / 2 + dx, y: below + k * h, w, h },
          ]),
        ) as PlacedLabel[])
      : []),
    // Off to a corner: the label's near edge just past the star's side.
    ...[2 * shift, -2 * shift, w / 2 + r + GAP, -(w / 2 + r + GAP), Math.round(w * 0.15), -Math.round(w * 0.15), Math.round(w * 0.55), -Math.round(w * 0.55)].flatMap((dx) => [
      { id: s.id, nameOnly, side: "below" as const, x: s.x - w / 2 + dx, y: below, w, h },
      { id: s.id, nameOnly, side: "above" as const, x: s.x - w / 2 + dx, y: above, w, h },
      { id: s.id, nameOnly, side: (dx > 0 ? "right" : "left") as "right" | "left", x: s.x - w / 2 + dx, y: s.y - h / 2, w, h },
    ]),
  ];
}

/**
 * Whether a spot can hold its star's label at all, ignoring other labels: inside the box, over no
 * star, and nearer its own star than any other.
 */
export function spotAllowed(c: PlacedLabel, stars: LabelRequest[], o: LabelOptions): boolean {
  if (c.x < 0 || c.y < 0 || c.x + c.w > o.width || c.y + c.h > o.height) return false;
  const own = stars.find((s) => s.id === c.id);
  for (const s of stars) {
    if (overlaps(c, starRect(s.x, s.y, o.star))) return false;
    if (own && s.id !== c.id && nearerTo(c, s, own)) return false;
  }
  return true;
}

const clearOfLines = (c: Rect, o: LabelOptions) => !(o.lines ?? []).some((l) => crosses({ x: c.x - 1, y: c.y - 1, w: c.w + 2, h: c.h + 2 }, l));
/** clearOfLines for a spot from `allowed` in placeLabels, whose lines never change for it (WO-71). */
const clearKnown = new WeakMap<PlacedLabel, boolean>();
function clearSpot(c: PlacedLabel, o: LabelOptions): boolean {
  let clear = clearKnown.get(c);
  if (clear === undefined) clearKnown.set(c, (clear = clearOfLines(c, o)));
  return clear;
}

/**
 * Labels for a tree at a level, with no star selected. `spots`, kept by the caller for one layout and
 * set of options, holds each label's allowed spots by its star and text (WO-71): they depend on
 * nothing else, and most labels read the same from one level to the next.
 */
export function placeLabels(stars: LabelRequest[], o: LabelOptions, spots?: Map<string, PlacedLabel[]>): Map<string, PlacedLabel> {
  const placed: PlacedLabel[] = [];
  const out = new Map<string, PlacedLabel>();
  const rank = (s: LabelRequest) => Math.max(1, s.priority);
  const order = [...stars].filter((s) => rank(s) <= (o.maxPriority ?? 3)).sort((a, b) => rank(a) - rank(b) || b.y - a.y || a.x - b.x);
  const byId = new Map(stars.map((s) => [s.id, s]));
  const put = (c: PlacedLabel) => {
    placed.push(c);
    out.set(c.id, c);
  };
  const take = (c: PlacedLabel) => {
    placed.splice(placed.indexOf(c), 1);
    out.delete(c.id);
  };
  // A star's spots, and which of them are allowed, don't depend on what is placed: worked out once
  // per star (WO-71), not again on each pass and squeeze.
  const allowedSpots = spots ?? new Map<string, PlacedLabel[]>();
  const allowed = (s: LabelRequest) => {
    // The name-only spots are offered to taken and can-take stars only (labelCandidates).
    const key = `${s.id}\u0001${s.lines.join("\u0002")}\u0001${rank(s) <= 2 ? 1 : 0}`;
    let a = allowedSpots.get(key);
    if (!a) allowedSpots.set(key, (a = labelCandidates(s, o).filter((c) => spotAllowed(c, stars, o))));
    return a;
  };
  const tryPlace = (s: LabelRequest) => {
    const fits = allowed(s).filter((c) => !placed.some((p) => overlaps(c, p)));
    const hit = fits.find((c) => clearSpot(c, o)) ?? fits[0];
    if (hit) put(hit);
    else squeeze(s);
  };
  // Rank by rank; a second pass per rank, since making room for one star can free a spot for another.
  for (const r of [1, 2, 3]) {
    const group = order.filter((s) => rank(s) === r);
    group.forEach(tryPlace);
    group.filter((s) => !out.has(s.id)).forEach(tryPlace);
  }
  return out;

  // A star with no room: move the labels in its way (as important) to another spot of their own (the
  // name alone, for a two-line label), if that makes room for its name.
  function squeeze(s: LabelRequest) {
    // A two-line label squeezes in with its name alone; a one-line label (Destiny) as it is (WO-73).
    for (const c of allowed(s).filter((c) => c.nameOnly || !s.lines[1])) {
      const blockers = placed.filter((p) => overlaps(c, p));
      if (!blockers.length || !blockers.every((b) => rank(byId.get(b.id)!) === rank(s))) continue;
      blockers.forEach(take);
      const moved: PlacedLabel[] = [];
      for (const b of blockers) {
        const bs = byId.get(b.id)!;
        const alt = allowed(bs).find((x) => (x.nameOnly || !bs.lines[1]) && !(x.x === b.x && x.y === b.y) && !overlaps(x, c) && !placed.some((p) => overlaps(x, p)));
        if (!alt) break;
        put(alt);
        moved.push(alt);
      }
      if (moved.length === blockers.length) return put(c);
      moved.forEach(take);
      blockers.forEach(put);
    }
  }
}

/**
 * The labels with `id` selected: unchanged if it already has one; otherwise its label goes in the
 * allowed spot that hides the fewest others, and only those are hidden. Nothing else moves.
 */
export function withSelected(base: Map<string, PlacedLabel>, id: string | null | undefined, stars: LabelRequest[], o: LabelOptions): Map<string, PlacedLabel> {
  if (!id || base.has(id)) return base;
  const s = stars.find((x) => x.id === id);
  if (!s) return base;
  const all = labelCandidates(s, o);
  const allowed = all.filter((c) => spotAllowed(c, stars, o));
  const inBox = all.filter((c) => c.x >= 0 && c.y >= 0 && c.x + c.w <= o.width && c.y + c.h <= o.height);
  const pool = allowed.length ? allowed : inBox.length ? inBox : all.slice(0, 1);
  const others = [...base.values()];
  const cost = (c: PlacedLabel) => others.filter((p) => overlaps(c, p)).length * 2 + (clearOfLines(c, o) ? 0 : 1);
  const best = pool.reduce((a, b) => (cost(b) < cost(a) ? b : a));
  const out = new Map([...base].filter(([, p]) => !overlaps(best, p)));
  out.set(id, best);
  return out;
}
