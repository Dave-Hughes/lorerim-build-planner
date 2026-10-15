"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGameData } from "@/components/game-data";
import { perkText, type GameData, type Perk } from "@/lib/rules/data";
import { perkRequirementText, perkStatus, type PerkStatus } from "@/lib/rules/derive";
import { labelSizes, placeLabels, withSelected, type LabelOptions, type LabelRequest, type PlacedLabel } from "@/lib/rules/labels";
import { drawingSize, fitHeight, treeLayout, type LayoutPadding, type TreeLayout } from "@/lib/rules/layout";
import { pageZoom } from "@/lib/zoom";
import { isHeld, lineLook, lineState, prerequisiteLines } from "@/lib/rules/tree-states";
import type { LevelState } from "@/lib/rules/types";
import styles from "./tree.module.css";

export interface TreeProps {
  tree: string;
  states: LevelState[];
  level: number;
  selectedId?: string | null;
  /** When given, stars are buttons that select; otherwise the tree is read-only. */
  onSelect?: (id: string) => void;
  /** On small screens, what the bottom sheet shows for a tapped star (defaults to the perk's own words). */
  details?: (id: string) => React.ReactNode;
  /** Tree or list, when the page holds it (the tabs carry the toggle on phones). */
  view?: TreeView;
  onView?: (view: TreeView) => void;
  /** Leave out the Tree / List switch (the page shows the list beside the tree). */
  noToggle?: boolean;
  /** Below this window width a tapped star opens a bottom sheet (the shared page: 1100). */
  sheetBelow?: number;
  /** The box's height, when the page decides it (the editor's tall tree, WO-26). */
  height?: number;
  /** At the start of the toolbar: the open tree's icon, name and value (the editor's panel, WO-62). */
  heading?: React.ReactNode;
  /** The list grouped by skill needed (default), or by state: can take now, taken, not yet (WO-62's phone sheet). */
  listBy?: "skill" | "state";
  /**
   * Perks that can't go with what's held (WO-68, WO-69), with the reason: a dashed red ring, the
   * name struck through, the reason in the hover tag, and not clickable.
   */
  ruled?: Map<string, string>;
  /** The legend's word for a star that can be taken: "Can take by level 25" on a stretch (WO-69). */
  openLabel?: string;
}

export type TreeView = "tree" | "list";

/** The Tree / List switch. */
export function ViewToggle({ view, onView, className }: { view: TreeView; onView: (view: TreeView) => void; className?: string }) {
  return (
    <span className={`${styles.seg} ${className ?? ""}`} role="group" aria-label="Show the tree as">
      <button type="button" aria-pressed={view === "tree"} onClick={() => onView("tree")}>
        Tree
      </button>
      <button type="button" aria-pressed={view === "list"} onClick={() => onView("list")}>
        List
      </button>
    </span>
  );
}

/** Below this window width the tree is a pan-and-zoom sky with a bottom sheet. */
const SMALL = 900;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Star radius, line width and label size scale with the drawing: 16px stars at 900 wide, 22px at 1600. */
function sizesFor(width: number) {
  const t = clamp((width - 900) / 700, 0, 1);
  // Under 900 wide the names are 12px, the smallest the design allows, so a crowded tree keeps every one (WO-75).
  return { star: width < 600 ? 7 : 8 + 3 * t, line: 1 + 0.5 * t, font: width < 900 ? 12 : Math.round(13 + 2 * t) };
}

function padFor(width: number): LayoutPadding {
  return width < 600 ? { x: 40, top: 22, bottom: 40 } : { x: 70, top: 30, bottom: 58 };
}

function requirementLine(d: GameData, p: Perk, st: PerkStatus): string {
  if (p.tree === "Destiny") return st.state === "taken" ? `Level ${st.takenAt[0]}` : "";
  const rank = Math.min(st.ranksTaken, st.ranks - 1);
  let req = perkRequirementText(p, rank) || (p.book ? "Book" : "No requirement");
  // Ranks taken so far; a star with some of them says so after its name instead.
  if (st.ranks > 1 && (st.ranksTaken === 0 || st.ranksTaken >= st.ranks)) req += ` (${st.ranksTaken}/${st.ranks})`;
  return req;
}

/** "Electromancy 1/2" for a star with some of its ranks; the name alone otherwise. */
function nameLine(p: Perk, st: PerkStatus): string {
  return st.ranks > 1 && st.ranksTaken > 0 && st.ranksTaken < st.ranks ? `${p.name} ${st.ranksTaken}/${st.ranks}` : p.name;
}

/** A taken star's name-only label keeps its rank: "Short Blade Focus 3", not "Short Blade Focus" (WO-74). */
function shortLine(p: Perk, st: PerkStatus): string | undefined {
  return st.ranks > 1 && st.ranksTaken >= st.ranks && !st.granted ? `${p.name} ${st.ranksTaken}` : undefined;
}

/** A ring split into one arc per rank, taken arcs in ember, 2px gaps between arcs. */
function rankRing(st: PerkStatus, sizePx: number): string {
  const n = st.ranks;
  const gap = (2 / (Math.PI * sizePx)) * 360; // 2px of the ring's circumference, in degrees
  const stops: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n;
    const b = ((i + 1) * 360) / n;
    const c = i < st.ranksTaken ? "var(--perk)" : "#2f3a4a";
    stops.push(`transparent ${a}deg ${a + gap / 2}deg`, `${c} ${a + gap / 2}deg ${b - gap / 2}deg`, `transparent ${b - gap / 2}deg ${b}deg`);
  }
  return `conic-gradient(${stops.join(", ")})`;
}

function stateWords(st: PerkStatus): string {
  return st.state === "taken" ? "taken" : st.state === "open" ? "can take now" : "not available yet";
}

/** Width of text in the page's body face, measured once the fonts are in. */
function useMeasure(el: HTMLElement | null) {
  // Label widths must be measured in the real face: until the web fonts have loaded, the canvas
  // measures a fallback, so measure again (and so place labels again) once they are ready.
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    let live = true;
    void document.fonts.ready.then(() => live && setFontsReady((n) => n + 1));
    const onDone = () => live && setFontsReady((n) => n + 1);
    document.fonts.addEventListener("loadingdone", onDone);
    return () => {
      live = false;
      document.fonts.removeEventListener("loadingdone", onDone);
    };
  }, []);
  return useMemo(() => {
    if (!el || typeof document === "undefined") return undefined;
    const ctx = document.createElement("canvas").getContext("2d");
    const family = getComputedStyle(el).fontFamily;
    if (!ctx) return undefined;
    void fontsReady;
    // Measured at the bold weight held and selected labels use, so no label is ever wider than its box.
    // Each text and size once (WO-74): label placement asks for the same names again and again.
    const known = new Map<string, number>();
    return (text: string, size: number) => {
      const key = `${size}\u0001${text}`;
      let w = known.get(key);
      if (w === undefined) {
        ctx.font = `600 ${size}px ${family}`;
        known.set(key, (w = ctx.measureText(text).width));
      }
      return w;
    };
  }, [el, fontsReady]);
}

/** The perks of a tree as a plain list, grouped by the skill they need, then level and book perks. */
function PerkList({
  d,
  tree,
  status,
  onSelect,
  selectedId,
  hidden,
  by = "skill",
  ruled,
}: {
  d: GameData;
  tree: string;
  status: Map<string, PerkStatus>;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
  hidden?: boolean;
  by?: "skill" | "state";
  ruled?: Map<string, string>;
}) {
  const perks = d.perksByTree.get(tree) ?? [];
  const groups: { label: string; perks: Perk[] }[] = [];
  const add = (label: string, p: Perk) => {
    const g = groups.find((x) => x.label === label) ?? (groups.push({ label, perks: [] }), groups[groups.length - 1]);
    g.perks.push(p);
  };
  // By state (WO-62): what the build can take now first, then what it holds, then the rest.
  const order =
    by === "state" ? ["Can take now", "Taken", "Not yet"] : [`Up to ${tree} 25`, `${tree} 26 to 50`, `${tree} 51 to 75`, `${tree} 76 to 100`, "Character level", "Book"];
  for (const p of perks) {
    if (by === "state") {
      const st = status.get(p.id)!.state;
      add(st === "open" ? order[0] : st === "taken" ? order[1] : order[2], p);
    } else if (tree === "Destiny") add("Destiny", p);
    else if (p.book) add("Book", p);
    else if (p.rankLevels?.some((l) => l > 0)) add("Character level", p);
    else {
      const s = p.rankSkills?.[0] ?? p.skill ?? 0;
      add(s <= 25 ? order[0] : s <= 50 ? order[1] : s <= 75 ? order[2] : order[3], p);
    }
  }
  groups.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  for (const g of groups) g.perks.sort((a, b) => (a.rankSkills?.[0] ?? a.skill ?? 0) - (b.rankSkills?.[0] ?? b.skill ?? 0) || a.name.localeCompare(b.name));
  return (
    <div className={hidden ? "sr-only" : styles.list} aria-label={`${tree} perks`} role="group">
      {groups.map((g) => (
        <section key={g.label} className={styles.listGroup} aria-label={g.label}>
          <span className={`sub-label ${styles.listHead}`}>{g.label}</span>
          <ul>
            {g.perks.map((p) => {
              const st = status.get(p.id)!;
              const req = requirementLine(d, p, st);
              const why = ruled?.get(p.id);
              const where = why ? "Ruled out" : st.state === "taken" && st.takenAt.length ? `Taken at level ${st.takenAt.join(", ")}` : st.state === "taken" ? "Taken" : st.state === "open" ? "Can take now" : "Not available yet";
              const body = (
                <>
                  <i className={`${styles.listDot} ${why ? styles.ruledDot : styles[st.state]}`} />
                  <span className={styles.listName} data-row-text="">
                    {p.name}
                  </span>
                  {req && (
                    <span className={styles.listReq} data-row-text="">
                      {req}
                    </span>
                  )}
                  <span className={`${styles.listState} ${why ? styles.ruledText : styles[`state_${st.state}`]}`}>{where}</span>
                </>
              );
              return (
                <li key={p.id}>
                  {onSelect && !hidden ? (
                    // data-perk as on a star: the editor's perk card opens beside the row (WO-72).
                    <button type="button" className={styles.listRow} aria-pressed={p.id === selectedId} aria-disabled={why ? true : undefined} title={why} data-perk={p.id} onClick={() => !why && onSelect(p.id)}>
                      {body}
                    </button>
                  ) : (
                    <span className={styles.listRow}>{body}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * What a perk does, for the shared page's details panel and the phones' bottom sheet: its name and
 * tree, the game's text for each rank (ranks taken marked), what it needs, what it can't be held
 * with, and where the build stands with it at `level`.
 */
export function PerkDetails({ id, states, level, onClose }: { id: string; states: LevelState[]; level: number; onClose?: () => void }) {
  const d = useGameData();
  const p = d.perkById.get(id);
  if (!p) return null;
  const st = perkStatus(d, states, level, id);
  const ranks = st.ranks;
  // Where it stands: taken (and when), can be taken now, or not by this level.
  const status = st.granted
    ? "Comes with Master of One"
    : st.takenAt.length
      ? ranks > 1
        ? st.takenAt.map((L, i) => (i === 0 ? `Rank ${i + 1} taken at level ${L}` : `rank ${i + 1} at level ${L}`)).join(", ")
        : `Taken at level ${st.takenAt[0]}`
      : st.state === "open" && !st.noPoint
        ? `Can be taken at level ${level}`
        : `Not taken by level ${level}`;
  const needs = [
    ...(p.tree === "Destiny" ? [] : Array.from({ length: ranks }, (_, i) => perkRequirementText(p, i)).filter((x, i, all) => x && all.indexOf(x) === i)),
    ...(p.requires.length ? [p.requires.map((r) => { const o = d.perkById.get(r); return o && o.tree !== p.tree ? `${o.tree}: ${o.name}` : (o?.name ?? r); }).join(p.anyOf ? " or " : " and ")] : []),
  ];
  const excludes = (p.excludes ?? []).map((x) => {
    const o = d.perkById.get(x);
    return o && o.tree !== p.tree ? `${o.tree}: ${o.name}` : (o?.name ?? x);
  });
  return (
    <section aria-label="Perk details" className={styles.details}>
      <div className={styles.detailsHead}>
        <div>
          <h2 className={styles.sheetTitle}>{nameLine(p, st)}</h2>
          <span className={styles.detailsTree}>
            {p.tree}
            {ranks > 1 ? `, ${ranks} ranks` : ""}
          </span>
        </div>
        {onClose && (
          <button type="button" className={`btn btn-sm btn-icon ${styles.detailsClose}`} aria-label="Close perk details" onClick={onClose}>
            ×
          </button>
        )}
      </div>
      {Array.from({ length: ranks }, (_, i) => {
        const words = perkText(p, i);
        const taken = i < st.ranksTaken;
        return (
          <div key={i} className={styles.detailsRank}>
            {ranks > 1 && (
              <span className={`${styles.detailsRankHead} ${taken ? styles.detailsRankTaken : ""}`}>
                Rank {i + 1}
                {taken ? `, taken at level ${st.takenAt[i]}` : ""}
              </span>
            )}
            {words.text && <p className="flavor">{words.text}</p>}
            {words.effect && words.effect !== words.text && <p className={styles.detailsEffect}>{words.effect}</p>}
          </div>
        );
      })}
      {needs.length > 0 && <p className={styles.detailsLine}>Needs {needs.join("; ")}.</p>}
      {excludes.length > 0 && <p className={styles.detailsLine}>Can&apos;t be held with {excludes.join(" or ")}.</p>}
      <p className={`${styles.detailsStatus} ${styles[`state_${st.state}`]}`}>{status}.</p>
    </section>
  );
}

/** A sheet from the bottom of the screen; tap outside, swipe it down or press Escape to close. */
export function BottomSheet({ label, onClose, children, tall }: { label: string; onClose: () => void; children: React.ReactNode; tall?: boolean }) {
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className={styles.sheetBackdrop} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`${styles.sheet} ${tall ? styles.sheetTall : ""}`}
        style={drag ? { transform: `translateY(${drag}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.sheetHandle}
          onPointerDown={(e) => {
            start.current = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => start.current !== null && setDrag(Math.max(0, e.clientY - start.current))}
          onPointerUp={() => {
            if (drag > 60) onClose();
            setDrag(0);
            start.current = null;
          }}
        >
          <span />
        </div>
        <button type="button" className={`btn btn-sm btn-quiet ${styles.sheetClose}`} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

/** The tree's room: its width, the window, and where the drawing starts on the page (`top`, for short windows). */
function roomOf(wrap: HTMLDivElement) {
  const bar = wrap.firstElementChild as HTMLElement | null;
  // Where the drawing starts: on the page, or below a [data-tree-anchor] that is scrolled to the
  // window's top when it opens (the shared page's perk trees).
  const anchor = wrap.closest<HTMLElement>("[data-tree-anchor]");
  const from = anchor ? anchor.getBoundingClientRect().top : -window.scrollY;
  const top = Math.round(wrap.getBoundingClientRect().top - from + (bar?.offsetHeight ?? 0));
  return { w: Math.floor(wrap.clientWidth), vw: window.innerWidth, vh: window.innerHeight, top };
}

/** Unchanged (the usual case on a new level): the same object, so the tree isn't drawn twice (WO-71). */
function keepRoom<R extends { w: number; vw: number; vh: number; top: number }>(was: R, next: R): R {
  return was.w === next.w && was.vw === next.vw && was.vh === next.vh && was.top === next.top ? was : next;
}

export function Tree({ tree, states, level, selectedId, onSelect, details, view: heldView, onView, noToggle, sheetBelow = SMALL, height, heading, listBy = "skill", ruled, openLabel }: TreeProps) {
  const d = useGameData();
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  // `top`: where the drawing starts on the page (below the toolbar), for short windows.
  const [room, setRoom] = useState({ w: 0, vw: 1440, vh: 900, top: 0 });
  useLayoutEffect(() => {
    if (!wrap) return;
    const set = () => {
      const next = roomOf(wrap);
      setRoom((was) => keepRoom(was, next));
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(wrap);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
    };
    // The level (its problems, its header) can move the tree down: measure again on a new level.
  }, [wrap, level]);
  const measure = useMeasure(wrap);

  const small = room.vw < SMALL;
  const sheetMode = room.vw < sheetBelow;
  const [localView, setLocalView] = useState<TreeView>("tree");
  const view = heldView ?? localView;
  const setView = onView ?? setLocalView;
  const [localSelected, setLocalSelected] = useState<string | null>(null);
  const selected = selectedId ?? localSelected;
  const [sheet, setSheet] = useState<string | null>(null);
  // The star last picked in this tree itself: picking one here never moves the view.
  const [ownPick, setOwnPick] = useState<string | null>(null);

  // The box: the column's width, and WO-8/WO-19's height rule.
  const w0 = room.w;
  const pad = padFor(w0);
  // No taller than the tree needs at fit size, so no empty band sits under it.
  const fitted = w0 > 0 ? fitHeight(d, tree, w0, pad) : Infinity;
  // A short laptop window: the tree takes the height left under it, so its bottom row shows unscrolled.
  const left = room.vh - room.top - 48; // room for the legend under it
  const short = !small && room.vh < 900 && left >= 300;
  // A height the page decides wins, on phones too when the editor's sheet sets one (WO-62).
  // A wide, flat tree (Destiny) still gets about half its width in height, so every star's name has
  // room at Fit (WO-73).
  const want = small ? fitted : Math.max(fitted, Math.round(w0 * 0.6));
  const h0 = height && (!small || sheetBelow === 0) ? height : Math.max(220, Math.min(want, small ? Math.round(w0 * 1.2) : short ? Math.min(left, w0) : Math.max(380, Math.min(room.vh - 240, w0))));
  // Stars, lines and labels keep the box's sizes; only the drawing grows.
  const size = sizesFor(w0);

  // ---- the view: zoom (px per game unit) and the centre, as fractions of the drawing ----
  const base = w0 > 0 ? drawingSize(d, tree, w0, h0, pad) : null;
  const fitScale = base?.fitScale ?? 1;
  const readable = base?.readableScale ?? 1;
  const maxScale = readable * 2;
  // A star picked outside the tree (the level card, the held list) selects it, and the view goes back to Fit.
  const viewKey = `${tree}|${selected && selected !== ownPick ? selected : ""}`;
  const [manual, setManual] = useState<{ key: string; t: number; fx: number; fy: number } | null>(null);
  // The reader's zoom lasts while they stay on this tree at this level: a new level or tree goes back
  // to Fit, and so does coming back to one (WO-78).
  const stay = `${tree}|${level}`;
  const [stayed, setStayed] = useState(stay);
  if (stayed !== stay) {
    setStayed(stay);
    setManual(null);
  }
  // Every tree opens fitted to its box (WO-73); zooming in is the reader's choice.
  const t = clamp(manual?.key === viewKey ? manual.t : fitScale, fitScale, maxScale);
  const dims = w0 > 0 ? drawingSize(d, tree, w0, h0, pad, t) : null;
  const W = dims?.width ?? 0;
  const H = dims?.height ?? 0;
  // Worked out again only when the tree or the drawing's size changes (WO-71).
  const { layout, pos } = useTreeLayout(d, tree, W, H, w0);

  // Where the view starts: the selected star; else this level's newest perk in the tree; else the
  // tree's bottom row, centred (where every tree starts).
  const lv = states[level - 1];
  const newest = (d.perksByTree.get(tree) ?? [])
    .map((p) => ({ id: p.id, at: tree === "Destiny" ? (lv?.destinyTaken[p.id] ?? 0) : Math.max(0, ...(lv?.perksTaken[p.id] ?? [0]).filter((L) => L <= level)) }))
    .filter((x) => x.at > 0)
    .sort((a, b) => b.at - a.at)[0]?.id;
  const focus = (selected && pos.get(selected)) || (newest && pos.get(newest)) || null;
  const centre = manual?.key === viewKey ? { fx: manual.fx, fy: manual.fy } : focus && W ? { fx: focus.x / W, fy: focus.y / H } : { fx: 0.5, fy: 1 };
  const panX = W ? clamp(w0 / 2 - centre.fx * W, Math.min(0, w0 - W), 0) : 0;
  const panY = H ? clamp(h0 / 2 - centre.fy * H, Math.min(0, h0 - H), 0) : 0;
  const setCentre = useCallback((next: { t: number; panX: number; panY: number; W: number; H: number }) => {
    setManual({ key: viewKey, t: next.t, fx: (w0 / 2 - next.panX) / next.W, fy: (h0 / 2 - next.panY) / next.H });
  }, [viewKey, w0, h0]);
  /** Zoom by `factor`, keeping the point (px, py) of the box where it is. */
  const zoomAt = (px: number, py: number, factor: number) => {
    const t2 = clamp(t * factor, fitScale, maxScale);
    const next = drawingSize(d, tree, w0, h0, pad, t2);
    const ux = (px - panX) / W;
    const uy = (py - panY) / H;
    setCentre({ t: t2, panX: px - ux * next.width, panY: py - uy * next.height, W: next.width, H: next.height });
  };
  const panBy = (dx: number, dy: number) =>
    setCentre({ t, panX: clamp(panX + dx, Math.min(0, w0 - W), 0), panY: clamp(panY + dy, Math.min(0, h0 - H), 0), W, H });
  const fit = () => setManual({ key: viewKey, t: fitScale, fx: 0.5, fy: 0.5 });
  const atFit = t <= fitScale + 1e-6;

  const status = useMemo(() => {
    const m = new Map<string, PerkStatus>();
    for (const p of d.perksByTree.get(tree) ?? []) m.set(p.id, perkStatus(d, states, level, p.id));
    return m;
  }, [d, tree, states, level]);

  // Labels are placed once for the tree, level and size; selecting a star only adds its own label.
  const labels = usePlacedLabels(d, layout, status, size.star, size.font, measure, selected);

  const select = (id: string) => {
    setOwnPick(id);
    if (onSelect) onSelect(id);
    else setLocalSelected(id);
    if (sheetMode) setSheet(id);
  };

  // ---- pan and zoom, at every width ----
  const sky = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: false, dist: 0, sx: 0, sy: 0 });
  const [dragging, setDragging] = useState(false);
  // Ctrl/⌘ + wheel (and a trackpad pinch) zooms; a plain wheel is left to scroll the page.
  // (Attached by hand: React's wheel handler is passive and can't stop the page zooming.)
  useEffect(() => {
    const el = sky.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const z = pageZoom();
      zoomAt((e.clientX - r.left) / z, (e.clientY - r.top) / z, Math.exp(-e.deltaY * 0.01));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });
  // The pointer in the drawing's own pixels (the page may be scaled up on a big monitor).
  const local = (e: React.PointerEvent) => {
    const r = sky.current!.getBoundingClientRect();
    const z = pageZoom();
    return { x: (e.clientX - r.left) / z, y: (e.clientY - r.top) / z };
  };
  const gestures = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const at = local(e);
      pointers.current.set(e.pointerId, at);
      gesture.current = { ...gesture.current, moved: false, sx: at.x, sy: at.y };
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        gesture.current.dist = Math.hypot(a.x - b.x, a.y - b.y);
      }
    },
    onPointerMove: (e: React.PointerEvent) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      const now = local(e);
      pointers.current.set(e.pointerId, now);
      const g = gesture.current;
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (g.dist > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, dist / g.dist);
        g.dist = dist;
        g.moved = true;
        return;
      }
      // A 4px threshold, so a click on a star is still a click.
      if (!g.moved && Math.hypot(now.x - g.sx, now.y - g.sy) < 4) return;
      if (!g.moved) {
        g.moved = true;
        setDragging(true);
        sky.current?.setPointerCapture(e.pointerId);
      }
      panBy(now.x - prev.x, now.y - prev.y);
    },
    onPointerUp: (e: React.PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (!pointers.current.size) setDragging(false);
    },
    onPointerCancel: (e: React.PointerEvent) => {
      pointers.current.delete(e.pointerId);
      setDragging(false);
    },
    // A drag ends without selecting the star it started on.
    onClickCapture: (e: React.MouseEvent) => {
      if (gesture.current.moved) {
        e.stopPropagation();
        e.preventDefault();
        gesture.current.moved = false;
      }
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.target !== sky.current) return;
      const step = 48;
      const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      const m = moves[e.key];
      if (!m) return;
      e.preventDefault();
      panBy(m[0], m[1]);
    },
  };
  // Tabbing to a star pans just enough to bring it into view.
  const reveal = (id: string, e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.matches(":focus-visible")) return;
    const n = pos.get(id);
    if (!n) return;
    const m = 40;
    const x = n.x + panX;
    const y = n.y + panY;
    const dx = x < m ? m - x : x > w0 - m ? w0 - m - x : 0;
    const dy = y < m ? m - y : y > h0 - m ? h0 - m - y : 0;
    if (dx || dy) panBy(dx, dy);
  };

  const chain = (layout ? prerequisiteLines(d, layout.edges, status, selected) : new Set<string>());
  // Grey lines first, then where you can go, then the selected star's needs, then your path on top.
  const lines = (() => {
    const order = { other: 0, next: 1, chain: 2, held: 3 };
    return (layout?.edges ?? [])
      .map((e) => ({ e, look: lineLook(lineState(status.get(e.from), status.get(e.to)), e.anyOf, chain.has(`${e.from}>${e.to}`)) }))
      .sort((a, b) => order[a.look.kind] - order[b.look.kind]);
  })();
  const sheetStatus = sheet ? status.get(sheet) : undefined;
  const bigger = W > w0 + 1 || H > h0 + 1;

  return (
    <div className={`${styles.box} ${tree === "Destiny" ? styles.destinyTree : ""}`} ref={setWrap} data-tree={tree}>
      <div className={styles.toolbar}>
        {heading && <span className={styles.heading}>{heading}</span>}
        {/* On phones the tabs carry the switch, at the end of their row. */}
        {!noToggle && <ViewToggle view={view} onView={setView} className={onView ? styles.segWide : undefined} />}
        {view === "tree" && (
          <span className={styles.zoom}>
            <button type="button" className="btn btn-sm btn-icon" aria-label="Zoom in" onClick={() => zoomAt(w0 / 2, h0 / 2, 1.3)} disabled={t >= maxScale - 1e-6}>
              +
            </button>
            <button type="button" className="btn btn-sm btn-icon" aria-label="Zoom out" onClick={() => zoomAt(w0 / 2, h0 / 2, 1 / 1.3)} disabled={atFit}>
              −
            </button>
            <button type="button" className="btn btn-sm" onClick={fit} disabled={atFit}>
              Fit
            </button>
          </span>
        )}
      </div>

      {view === "list" ? (
        <PerkList d={d} tree={tree} status={status} onSelect={select} selectedId={selected} by={listBy} ruled={ruled} />
      ) : (
        <>
          {/* Screen readers get the list first. */}
          <PerkList d={d} tree={tree} status={status} hidden ruled={ruled} />
          <div
            ref={sky}
            tabIndex={0}
            aria-label={`${tree} tree: drag or use the arrow keys to move around, Ctrl and the wheel to zoom`}
            className={`${styles.sky} ${small ? styles.skySmall : ""} ${dragging ? styles.dragging : ""}`}
            style={{ height: h0, touchAction: bigger ? "none" : "pan-y" }}
            {...gestures}
          >
            {layout && (
              <div className={styles.canvas} style={{ width: W, height: H, transform: `translate(${panX}px, ${panY}px)`, ["--star" as string]: `${size.star * 2}px`, ["--label" as string]: `${labelSizes(size.font).name}px`, ["--sub" as string]: `${labelSizes(size.font).sub}px` }}>
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className={styles.edges}>
                  <g fill="none">
                    {lines.map(({ e, look }) => {
                      const a = pos.get(e.from)!;
                      const b = pos.get(e.to)!;
                      const w = size.line * look.width;
                      const key = `${e.from}>${e.to}`;
                      return look.kind === "held" ? (
                        <g key={key}>
                          {/* A faint wider line under the path, instead of a blur. */}
                          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.edgeHalo} strokeWidth={w * 2.6} strokeLinecap="round" />
                          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.edgeHeld} strokeWidth={w} strokeLinecap="round" />
                        </g>
                      ) : (
                        <line
                          key={key}
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          className={styles[`edge_${look.kind}`]}
                          strokeWidth={w}
                          strokeDasharray={look.dashed ? (look.kind === "chain" ? `${4 * w} ${4 * w}` : `${2 * w} ${4 * w}`) : undefined}
                        />
                      );
                    })}
                  </g>
                </svg>
                {layout.nodes.map((n) => {
                  const p = d.perkById.get(n.id)!;
                  const st = status.get(n.id)!;
                  const isSel = n.id === selected;
                  const req = requirementLine(d, p, st);
                  const why = isHeld(st) ? undefined : ruled?.get(n.id);
                  const aria = `${p.name}${req ? `, ${req}` : ""}, ${why ? `ruled out. ${why}` : stateWords(st)}`;
                  const extra = [
                    ...layout.external.filter((x) => x.forId === n.id).map((x) => `${p.anyOf ? "or" : "and"} ${x.tree}: ${x.name}`),
                    ...(why
                      ? why.split(/(?<=\.) /)
                      : (p.excludes ?? []).map((x) => {
                          const o = d.perkById.get(x);
                          return `Not with ${o && o.tree !== p.tree ? `${o.tree}: ` : ""}${o?.name ?? x}`;
                        })),
                  ];
                  const label = labels.get(n.id);
                  const partial = st.ranksTaken > 0 && st.ranksTaken < st.ranks && !st.granted;
                  const held = isHeld(st);
                  const look = why ? styles.ruledStar : held ? (partial ? styles.partial : styles.taken) : st.state === "open" ? styles.open : styles.locked;
                  const cls = [styles.star, look, isSel ? styles.selected : "", label ? "" : styles.unlabelled].join(" ");
                  const style = { left: n.x, top: n.y, ...(partial ? { ["--ring" as string]: rankRing(st, size.star * 2 * 1.3) } : {}) };
                  return (
                    <span key={n.id}>
                      <button type="button" className={cls} style={style} aria-label={aria} aria-pressed={isSel} aria-disabled={why ? true : undefined} data-perk={n.id} data-ruled={why ? "" : undefined} onClick={() => !why && select(n.id)} onFocus={(e) => reveal(n.id, e)}>
                        {/* On hover (mouse) or keyboard focus: the name and what it needs, at once. */}
                        <span className={styles.tag} aria-hidden="true">
                          <b>{nameLine(p, st)}</b>
                          {req && <span>{req}</span>}
                          {extra.map((x) => (
                            <span key={x}>{x}</span>
                          ))}
                        </span>
                      </button>
                      {label && (
                        <span
                          className={`${styles.label} ${styles[`side_${label.side}`]} ${isSel ? styles.labelSelected : ""} ${why ? styles.labelRuled : held ? styles.labelHeld : st.state === "locked" ? styles.labelLocked : ""}`}
                          style={{ left: label.x, top: label.y, width: label.w, height: label.h }}
                          aria-hidden="true"
                          onClick={() => !why && select(n.id)}
                        >
                          <span className={styles.labelName}>{label.nameOnly ? (shortLine(p, st) ?? nameLine(p, st)) : nameLine(p, st)}</span>
                          {req && !label.nameOnly && <span className={styles.labelReq}>{req}</span>}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
            {/* Signs there's more beyond each edge. */}
            {panX < -1 && <span className={`${styles.fade} ${styles.fadeLeft}`} aria-hidden="true" />}
            {panX + W > w0 + 1 && <span className={`${styles.fade} ${styles.fadeRight}`} aria-hidden="true" />}
            {panY < -1 && <span className={`${styles.fade} ${styles.fadeTop}`} aria-hidden="true" />}
            {panY + H > h0 + 1 && <span className={`${styles.fade} ${styles.fadeBottom}`} aria-hidden="true" />}
          </div>
        </>
      )}

      <div className={styles.legend}>
        <span>
          <i className={styles.keyTaken} />
          Taken
        </span>
        <span>
          <i className={styles.keyPartial} style={{ ["--ring" as string]: rankRing({ ranks: 2, ranksTaken: 1, state: "open", takenAt: [], granted: false, reasons: [] }, 13) }} />
          Some ranks
        </span>
        <span>
          <i className={styles.keyOpen} />
          {openLabel ?? "Can take now"}
        </span>
        <span>
          <i className={styles.keyLocked} />
          Not yet
        </span>
        {/* Only when this tree has a star ruled out (WO-73). */}
        {ruled && (d.perksByTree.get(tree) ?? []).some((p) => ruled.has(p.id) && !isHeld(status.get(p.id))) && (
          <span>
            <i className={styles.keyRuled} />
            Ruled out
          </span>
        )}
      </div>

      {sheetMode && sheet && sheetStatus && (
        <BottomSheet label={d.perkById.get(sheet)?.name ?? "Perk"} onClose={() => setSheet(null)}>
          {details ? details(sheet) : <PerkDetails id={sheet} states={states} level={level} />}
        </BottomSheet>
      )}
    </div>
  );
}

/** The tree's layout and each star's place, again only when the tree or the drawing's size changes (WO-71). */
function useTreeLayout(d: GameData, tree: string, W: number, H: number, w0: number) {
  return useMemo(() => {
    const layout = W > 0 ? treeLayout(d, tree, W, H, padFor(w0)) : null;
    return { layout, pos: new Map(layout?.nodes.map((n) => [n.id, n]) ?? []) };
  }, [d, tree, W, H, w0]);
}

/**
 * Placed labels by what they say (WO-71): a level whose labels read the same as one placed before
 * (the Destiny tree on most levels, a tree going back to a level) reuses that placement, since the
 * same labels on the same layout always land in the same places. Per layout, and kept small.
 */
const placedCache = new WeakMap<TreeLayout, { measure: LabelOptions["measure"]; star: number; font: number; byKey: Map<string, Map<string, PlacedLabel>>; spots: Map<string, PlacedLabel[]> }>();
function placedFor(layout: TreeLayout, requests: LabelRequest[], opts: LabelOptions): Map<string, PlacedLabel> {
  let cache = placedCache.get(layout);
  // New sizes place everything again.
  if (!cache || cache.star !== opts.star || cache.font !== opts.font) {
    cache = { measure: opts.measure, star: opts.star, font: opts.font, byKey: new Map(), spots: new Map() };
    placedCache.set(layout, cache);
  }
  // New font measures (a font finished loading, often on a new level) only drop the finished
  // placements: the allowed spots are kept by label size, so they still hold (WO-74).
  if (cache.measure !== opts.measure) {
    cache.measure = opts.measure;
    cache.byKey = new Map();
  }
  const key = requests.map((r) => `${r.id}\u0001${r.lines.join("\u0002")}\u0001${r.priority}`).join("\u0003");
  const hit = cache.byKey.get(key);
  if (hit) return hit;
  // The allowed spots are kept across levels too, by star and label size (placeLabels).
  const placed = placeLabels(requests, opts, cache.spots);
  if (cache.byKey.size >= 40) cache.byKey.delete(cache.byKey.keys().next().value!);
  cache.byKey.set(key, placed);
  return placed;
}

/**
 * The stars' labels. Placing them is the costliest part of drawing a tree, so it runs again only
 * when the tree, its stars' states, the size or the font changes, not on every redraw (WO-71);
 * selecting a star only adds its own label.
 */
function usePlacedLabels(
  d: GameData,
  layout: TreeLayout | null,
  status: Map<string, PerkStatus>,
  star: number,
  font: number,
  measure: ((text: string, size: number) => number) | undefined,
  selected: string | null,
) {
  const placing = useMemo(() => {
    if (!layout) return null;
    const requests: LabelRequest[] = layout.nodes.map((n) => {
      const p = d.perkById.get(n.id)!;
      const st = status.get(n.id)!;
      const req = requirementLine(d, p, st);
      const name = nameLine(p, st);
      return {
        id: n.id,
        x: n.x,
        y: n.y,
        lines: req ? [name, req] : [name],
        short: shortLine(p, st),
        // A star with ranks already taken counts as taken.
        priority: st.state === "taken" || st.ranksTaken > 0 ? 1 : st.state === "open" ? 2 : 3,
      };
    });
    const lines = layout.edges.map((e) => {
      const a = layout.nodes.find((n) => n.id === e.from)!;
      const b = layout.nodes.find((n) => n.id === e.to)!;
      return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    });
    const opts = { width: layout.width, height: layout.height, star, font, measure, lines };
    return { requests, opts, base: placedFor(layout, requests, opts) };
  }, [d, layout, status, star, font, measure]);
  return useMemo(() => (placing ? withSelected(placing.base, selected, placing.requests, placing.opts) : new Map<string, PlacedLabel>()), [placing, selected]);
}
