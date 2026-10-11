"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGameData } from "@/components/game-data";
import { perkText, type GameData, type Perk } from "@/lib/rules/data";
import { perkRequirementText, perkStatus, type PerkStatus } from "@/lib/rules/derive";
import { labelSizes, placeLabels, withSelected, type LabelRequest, type PlacedLabel } from "@/lib/rules/labels";
import { fitHeight, treeLayout, type LayoutPadding } from "@/lib/rules/layout";
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
  return { star: width < 600 ? 7 : 8 + 3 * t, line: 1 + 0.5 * t, font: Math.round(13 + 2 * t) };
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

/** A ring split into one arc per rank, taken arcs in ember, 2px gaps between arcs. */
function rankRing(st: PerkStatus, sizePx: number): string {
  const n = st.ranks;
  const gap = (2 / (Math.PI * sizePx)) * 360; // 2px of the ring's circumference, in degrees
  const stops: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n;
    const b = ((i + 1) * 360) / n;
    const c = i < st.ranksTaken ? "var(--ember)" : "#2f3a4a";
    stops.push(`transparent ${a}deg ${a + gap / 2}deg`, `${c} ${a + gap / 2}deg ${b - gap / 2}deg`, `transparent ${b - gap / 2}deg ${b}deg`);
  }
  return `conic-gradient(${stops.join(", ")})`;
}

function stateWords(st: PerkStatus): string {
  return st.state === "taken" ? "taken" : st.state === "open" ? "can take now" : "not available yet";
}

/** Width of text in the page's body face, measured once the fonts are in. */
function useMeasure(el: HTMLElement | null) {
  return useMemo(() => {
    if (!el || typeof document === "undefined") return undefined;
    const ctx = document.createElement("canvas").getContext("2d");
    const family = getComputedStyle(el).fontFamily;
    if (!ctx) return undefined;
    return (text: string, size: number) => {
      ctx.font = `${size}px ${family}`;
      return ctx.measureText(text).width;
    };
  }, [el]);
}

/** The perks of a tree as a plain list, grouped by the skill they need, then level and book perks. */
function PerkList({ d, tree, status, onSelect, selectedId, hidden }: { d: GameData; tree: string; status: Map<string, PerkStatus>; onSelect?: (id: string) => void; selectedId?: string | null; hidden?: boolean }) {
  const perks = d.perksByTree.get(tree) ?? [];
  const groups: { label: string; perks: Perk[] }[] = [];
  const add = (label: string, p: Perk) => {
    const g = groups.find((x) => x.label === label) ?? (groups.push({ label, perks: [] }), groups[groups.length - 1]);
    g.perks.push(p);
  };
  const order = [`Up to ${tree} 25`, `${tree} 26 to 50`, `${tree} 51 to 75`, `${tree} 76 to 100`, "Character level", "Book"];
  for (const p of perks) {
    if (tree === "Destiny") add("Destiny", p);
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
              const where = st.state === "taken" && st.takenAt.length ? `Taken at level ${st.takenAt.join(", ")}` : st.state === "taken" ? "Taken" : st.state === "open" ? "Can take now" : "Not available yet";
              const body = (
                <>
                  <i className={`${styles.listDot} ${styles[st.state]}`} />
                  <span className={styles.listName}>{p.name}</span>
                  {req && <span className={styles.listReq}>{req}</span>}
                  <span className={`${styles.listState} ${styles[`state_${st.state}`]}`}>{where}</span>
                </>
              );
              return (
                <li key={p.id}>
                  {onSelect && !hidden ? (
                    <button type="button" className={styles.listRow} aria-pressed={p.id === selectedId} onClick={() => onSelect(p.id)}>
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

function ReadOnlyDetails({ d, id, st }: { d: GameData; id: string; st: PerkStatus }) {
  const p = d.perkById.get(id)!;
  const words = perkText(p, Math.max(0, st.ranksTaken - 1));
  return (
    <div className={styles.sheetBody}>
      <h2 className={styles.sheetTitle}>{p.name}</h2>
      {requirementLine(d, p, st) && <span className={styles.listReq}>{requirementLine(d, p, st)}</span>}
      {words.text && <p className="flavor">{words.text}</p>}
      {words.effect && <p>{words.effect}</p>}
      <span className={styles[`state_${st.state}`]}>{st.state === "taken" ? `Taken${st.takenAt.length ? ` at level ${st.takenAt.join(", ")}` : ""}` : st.state === "open" ? "Can take now" : "Not available yet"}</span>
    </div>
  );
}

/** A sheet from the bottom of the screen; tap outside, swipe it down or press Escape to close. */
function BottomSheet({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
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
        className={styles.sheet}
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

export function Tree({ tree, states, level, selectedId, onSelect, details, view: heldView, onView }: TreeProps) {
  const d = useGameData();
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  // `top`: where the drawing starts on the page (below the toolbar), for short windows.
  const [room, setRoom] = useState({ w: 0, vw: 1440, vh: 900, top: 0 });
  useLayoutEffect(() => {
    if (!wrap) return;
    const set = () => {
      const bar = wrap.firstElementChild as HTMLElement | null;
      const top = Math.round(wrap.getBoundingClientRect().top + window.scrollY + (bar?.offsetHeight ?? 0));
      setRoom({ w: Math.floor(wrap.clientWidth), vw: window.innerWidth, vh: window.innerHeight, top });
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
  const [localView, setLocalView] = useState<TreeView>("tree");
  const view = heldView ?? localView;
  const setView = onView ?? setLocalView;
  const [localSelected, setLocalSelected] = useState<string | null>(null);
  const selected = selectedId ?? localSelected;
  const [sheet, setSheet] = useState<string | null>(null);

  // The visible frame, and the drawing inside it (bigger when zoomed on a small screen).
  const w0 = room.w;
  // No taller than the tree needs at fit size, so no empty band sits under it.
  const fitted = w0 > 0 ? fitHeight(d, tree, w0, padFor(w0)) : Infinity;
  // A short laptop window: the tree takes the height left under it, so its bottom row shows unscrolled.
  const left = room.vh - room.top - 48; // room for the legend under it
  const short = !small && room.vh < 900 && left >= 300;
  const h0 = Math.max(220, Math.min(fitted, small ? Math.round(w0 * 1.2) : short ? Math.min(left, w0) : Math.max(380, Math.min(room.vh - 240, w0))));
  // Zoom and pan change together, in one update.
  const [view2d, setView2d] = useState({ z: 1, x: 0, y: 0 });
  const zoom = view2d.z;
  const pan = view2d;
  const z = small ? zoom : 1;
  const W = Math.round(w0 * z);
  const H = Math.round(h0 * z);
  const size = sizesFor(W);

  const layout = useMemo(() => (w0 > 0 ? treeLayout(d, tree, W, H, padFor(W)) : null), [d, tree, W, H, w0]);
  const status = useMemo(() => {
    const m = new Map<string, PerkStatus>();
    for (const p of d.perksByTree.get(tree) ?? []) m.set(p.id, perkStatus(d, states, level, p.id));
    return m;
  }, [d, tree, states, level]);

  // Labels are placed once for the tree and level; selecting a star only adds its own label.
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
        // A star with ranks already taken counts as taken.
        priority: st.state === "taken" || st.ranksTaken > 0 ? 1 : st.state === "open" ? 2 : 3,
      };
    });
    // A small screen at fit size labels only taken stars (and the selected one); zooming in makes room for the rest.
    const pos = new Map(layout.nodes.map((n) => [n.id, n]));
    const lines = layout.edges.map((e) => ({ x1: pos.get(e.from)!.x, y1: pos.get(e.from)!.y, x2: pos.get(e.to)!.x, y2: pos.get(e.to)!.y }));
    const opts = { width: W, height: H, star: size.star, font: size.font, measure, lines, maxPriority: small && z < 1.2 ? 1 : 3 };
    return { requests, opts, base: placeLabels(requests, opts) };
  }, [layout, d, status, W, H, size.star, size.font, measure, small, z]);
  const labels = useMemo(() => (placing ? withSelected(placing.base, selected, placing.requests, placing.opts) : new Map<string, PlacedLabel>()), [placing, selected]);

  const select = useCallback(
    (id: string) => {
      if (onSelect) onSelect(id);
      else setLocalSelected(id);
      if (small) setSheet(id);
    },
    [onSelect, small],
  );

  // ---- pan and zoom (small screens) ----
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ moved: boolean; dist: number; lastTap: number; tapX: number; tapY: number }>({ moved: false, dist: 0, lastTap: 0, tapX: 0, tapY: 0 });
  const sky = useRef<HTMLDivElement>(null);
  const clampTo = useCallback((v: { z: number; x: number; y: number }) => ({ z: v.z, x: clamp(v.x, w0 - w0 * v.z, 0), y: clamp(v.y, h0 - h0 * v.z, 0) }), [w0, h0]);
  /** Zoom by `factor` keeping the point (px, py) of the frame where it is. */
  const zoomAt = useCallback(
    (px: number, py: number, factor: number) =>
      setView2d((v) => {
        const next = clamp(v.z * factor, 1, 3);
        return clampTo({ z: next, x: px - ((px - v.x) / v.z) * next, y: py - ((py - v.y) / v.z) * next });
      }),
    [clampTo],
  );
  const fit = () => setView2d({ z: 1, x: 0, y: 0 });
  useEffect(() => {
    const el = sky.current;
    if (!el || !small) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.01));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [small, zoomAt]);
  const local = (e: React.PointerEvent) => {
    const r = sky.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const gestures = small
    ? {
        onPointerDown: (e: React.PointerEvent) => {
          pointers.current.set(e.pointerId, local(e));
          gesture.current.moved = false;
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
          if (pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (gesture.current.dist > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, dist / gesture.current.dist);
            gesture.current.dist = dist;
            gesture.current.moved = true;
          } else if (Math.hypot(now.x - prev.x, now.y - prev.y) > 0 && (gesture.current.moved || Math.abs(now.x - prev.x) + Math.abs(now.y - prev.y) > 3)) {
            gesture.current.moved = true;
            setView2d((v) => clampTo({ ...v, x: v.x + now.x - prev.x, y: v.y + now.y - prev.y }));
          }
        },
        onPointerUp: (e: React.PointerEvent) => {
          const at = local(e);
          pointers.current.delete(e.pointerId);
          if (gesture.current.moved || pointers.current.size) return;
          const g = gesture.current;
          const t = e.timeStamp;
          if (t - g.lastTap < 300 && Math.hypot(at.x - g.tapX, at.y - g.tapY) < 30) {
            zoomAt(at.x, at.y, 1.6);
            g.lastTap = 0;
          } else Object.assign(g, { lastTap: t, tapX: at.x, tapY: at.y });
        },
        onPointerCancel: (e: React.PointerEvent) => pointers.current.delete(e.pointerId),
      }
    : {};

  const pos = useMemo(() => new Map(layout?.nodes.map((n) => [n.id, n]) ?? []), [layout]);
  const chain = useMemo(() => (layout ? prerequisiteLines(d, layout.edges, status, selected) : new Set<string>()), [d, layout, status, selected]);
  // Grey lines first, then where you can go, then the selected star's needs, then your path on top.
  const lines = useMemo(() => {
    const order = { other: 0, next: 1, chain: 2, held: 3 };
    return (layout?.edges ?? [])
      .map((e) => ({ e, look: lineLook(lineState(status.get(e.from), status.get(e.to)), e.anyOf, chain.has(`${e.from}>${e.to}`)) }))
      .sort((a, b) => order[a.look.kind] - order[b.look.kind]);
  }, [layout, status, chain]);
  const sheetStatus = sheet ? status.get(sheet) : undefined;

  return (
    <div className={styles.box} ref={setWrap}>
      <div className={styles.toolbar}>
        {/* On phones the tabs carry the switch, at the end of their row. */}
        <ViewToggle view={view} onView={setView} className={onView ? styles.segWide : undefined} />
        {small && view === "tree" && (
          <span className={styles.zoom}>
            <button type="button" className="btn btn-sm btn-icon" aria-label="Zoom in" onClick={() => zoomAt(w0 / 2, h0 / 2, 1.4)} disabled={zoom >= 3}>
              +
            </button>
            <button type="button" className="btn btn-sm btn-icon" aria-label="Zoom out" onClick={() => zoomAt(w0 / 2, h0 / 2, 1 / 1.4)} disabled={zoom <= 1}>
              −
            </button>
            <button type="button" className="btn btn-sm" onClick={fit} disabled={zoom === 1}>
              Fit
            </button>
          </span>
        )}
      </div>

      {view === "list" ? (
        <PerkList d={d} tree={tree} status={status} onSelect={select} selectedId={selected} />
      ) : (
        <>
          {/* Screen readers get the list first. */}
          <PerkList d={d} tree={tree} status={status} hidden />
          <div
            ref={sky}
            className={`${styles.sky} ${small ? styles.skySmall : ""}`}
            style={{ height: h0, touchAction: small ? (z > 1 ? "none" : "pan-y") : undefined }}
            {...gestures}
          >
            {layout && (
              <div className={styles.canvas} style={{ width: W, height: H, transform: small ? `translate(${pan.x}px, ${pan.y}px)` : undefined, ["--star" as string]: `${size.star * 2}px`, ["--label" as string]: `${labelSizes(size.font).name}px`, ["--sub" as string]: `${labelSizes(size.font).sub}px` }}>
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
                  const aria = `${p.name}${req ? `, ${req}` : ""}, ${stateWords(st)}`;
                  const extra = [
                    ...layout.external.filter((x) => x.forId === n.id).map((x) => `${p.anyOf ? "or" : "and"} ${x.tree}: ${x.name}`),
                    ...(p.excludes ?? []).map((x) => {
                      const o = d.perkById.get(x);
                      return `Not with ${o && o.tree !== p.tree ? `${o.tree}: ` : ""}${o?.name ?? x}`;
                    }),
                  ];
                  const label = labels.get(n.id);
                  const partial = st.ranksTaken > 0 && st.ranksTaken < st.ranks && !st.granted;
                  const held = isHeld(st);
                  const look = held ? (partial ? styles.partial : styles.taken) : st.state === "open" ? styles.open : styles.locked;
                  const cls = [styles.star, look, isSel ? styles.selected : "", label ? "" : styles.unlabelled].join(" ");
                  const style = { left: n.x, top: n.y, ...(partial ? { ["--ring" as string]: rankRing(st, size.star * 2 * 1.3) } : {}) };
                  // Shown on hover and focus when there was no room for the label, or when it says more than the label.
                  const tag = (!label || extra.length > 0) && (
                    <span className={styles.tag} aria-hidden="true">
                      <b>{nameLine(p, st)}</b>
                      {req && <span>{req}</span>}
                      {extra.map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                    </span>
                  );
                  const title = [perkText(p, Math.max(0, st.ranksTaken - 1)).text, ...extra].filter(Boolean).join("\n");
                  return (
                    <span key={n.id}>
                      {onSelect || small ? (
                        <button type="button" className={cls} style={style} aria-label={aria} aria-pressed={onSelect ? isSel : undefined} onClick={() => select(n.id)}>
                          {tag}
                        </button>
                      ) : (
                        <span className={cls} style={style} aria-label={aria} role="img" tabIndex={0} title={title || undefined} onClick={() => setLocalSelected(n.id)}>
                          {tag}
                        </span>
                      )}
                      {label && (
                        <span
                          className={`${styles.label} ${styles[`side_${label.side}`]} ${isSel ? styles.labelSelected : ""} ${held ? styles.labelHeld : st.state === "locked" ? styles.labelLocked : ""}`}
                          style={{ left: label.x, top: label.y, width: label.w }}
                          aria-hidden="true"
                          onClick={() => (onSelect || small ? select(n.id) : setLocalSelected(n.id))}
                        >
                          <span className={styles.labelName}>{nameLine(p, st)}</span>
                          {req && !label.nameOnly && <span className={styles.labelReq}>{req}</span>}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
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
          Can take now
        </span>
        <span>
          <i className={styles.keyLocked} />
          Not yet
        </span>
      </div>

      {small && sheet && sheetStatus && (
        <BottomSheet label={d.perkById.get(sheet)?.name ?? "Perk"} onClose={() => setSheet(null)}>
          {details ? details(sheet) : <ReadOnlyDetails d={d} id={sheet} st={sheetStatus} />}
        </BottomSheet>
      )}
    </div>
  );
}
