"use client";

import type { Stretch } from "@/lib/rules/stretches";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { LevelMark } from "@/lib/rules/derive";
import { Tooltip } from "@/components/ui/tooltip";
import styles from "./level-nav.module.css";
import { pageZoom } from "@/lib/zoom";

export const WINDOW = 12;

export function windowStart(level: number, total: number): number {
  const size = Math.min(WINDOW, total);
  return Math.max(1, Math.min(level - Math.floor(size / 2), total - size + 1));
}

/** The gear mark: the Other slot's satchel (WO-32), decorative. */
function GearMark({ className, style, level }: { className?: string; style?: React.CSSProperties; level?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/slot-other.svg" alt="" aria-hidden="true" width={12} height={12} className={className} style={style} data-gear-level={level} />;
}

function Star({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="#f0913f" />
    </svg>
  );
}

/** What the level marks mean: only the marks this build has (WO-31). */
export function LevelLegend({ marks }: { marks: LevelMark[] }) {
  const has = (k: "perks" | "destiny" | "stone" | "deity" | "skill100" | "notes" | "gear") => marks.some((m) => (k === "perks" ? m.perks > 0 : m[k]));
  return (
    <div className={styles.legend}>
      {has("perks") && (
        <span>
          <i className={styles.keyPerk} />
          Perk
        </span>
      )}
      {has("destiny") && (
        <span>
          <i className={styles.keyDestiny} />
          Destiny
        </span>
      )}
      {has("stone") && (
        <span>
          <i className={styles.keyStone} />
          Standing stone
        </span>
      )}
      {has("deity") && (
        <span>
          <i className={styles.keyDeity} />
          Deity
        </span>
      )}
      {has("skill100") && (
        <span>
          <Star />
          Skill 100 perk
        </span>
      )}
      {has("notes") && (
        <span>
          <i className={styles.keyNotes} />
          Notes
        </span>
      )}
      {has("gear") && (
        <span>
          <GearMark className={styles.keyGear} />
          Gear
        </span>
      )}
    </div>
  );
}

export function LevelStepper({
  level,
  total,
  onChange,
  slim,
  onStep,
  tip,
  from,
  prev,
  next,
}: {
  level: number;
  total: number;
  onChange: (level: number) => void;
  slim?: boolean;
  /** Told when ‹ or › is clicked (the arrow-key hint counts them, WO-49). */
  onStep?: () => void;
  /** Shown by the stepper: the arrow-key hint. */
  tip?: React.ReactNode;
  /** Skip ahead (WO-69): where the open stretch starts, and the stretches either side to step to. */
  from?: number;
  prev?: number | null;
  next?: number | null;
}) {
  const step = (n: number) => {
    onStep?.();
    onChange(n);
  };
  const before = prev === undefined ? (level > 1 ? level - 1 : null) : prev;
  const after = next === undefined ? (level < total ? level + 1 : null) : next;
  const stretch = from !== undefined && from > 1 && from < level;
  return (
    <div className={`${styles.stepper} ${slim ? styles.stepperSlim : ""}`}>
      <Tooltip content="Previous level (←)">
        <button type="button" className="btn btn-icon" aria-label="Previous level (←)" disabled={before === null} onClick={() => before !== null && step(before)}>
          ‹
        </button>
      </Tooltip>
      {/* Slim (the pinned bar): "LVL 12 / 20", the number in an ember box that flashes when it changes (WO-49). */}
      <span className={styles.viewing}>
        <span className={styles.viewingWord}>{stretch ? (slim ? `Levels ${from} to` : `Levels ${from} to`) : slim ? "Lvl" : "Level"}</span>
        {slim ? (
          <span key={level} className={styles.levelBox}>
            {level}
          </span>
        ) : (
          <span className={styles.viewingNum}>{level}</span>
        )}
        <span className="muted">
          {slim ? "/" : "of"} {total}
        </span>
      </span>
      <Tooltip content="Next level (→)">
        <button type="button" className="btn btn-icon" aria-label="Next level (→)" disabled={after === null} onClick={() => after !== null && step(after)}>
          ›
        </button>
      </Tooltip>
      {tip}
    </div>
  );
}

/** The whole build on one line. Only marks that matter: Destiny, stones, Skill 100 perks, notes. */
export function LevelRuler({ marks, level, onChange, spans, win }: { marks: LevelMark[]; level: number; onChange: (level: number) => void; spans?: Stretch[]; win?: Stretch }) {
  const total = marks.length;
  // The window over the levels the row shows: twelve levels, or (WO-69) the levels its twelve stretches cover.
  const start = win ? win.from : windowStart(level, total);
  const size = win ? win.to - win.from + 1 : Math.min(WINDOW, total);
  const x = (n: number) => `${(((n - 0.5) / total) * 100).toFixed(4)}%`;
  const at = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.min(total, Math.max(1, Math.ceil(((e.clientX - r.left) / r.width) * total)));
  };
  // A click jumps to the level under the pointer; dragging (the window or anywhere on the ruler)
  // moves the level, and so the row, as the pointer goes.
  const drag = useRef<{ x: number; moved: boolean; last: number } | null>(null);
  return (
    <div className={styles.rulerWrap}>
      <div
        className={styles.ruler}
        aria-label={`Whole build, levels 1 to ${total}`}
        role="presentation"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          drag.current = { x: e.clientX, moved: false, last: level };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          if (!d.moved && Math.abs(e.clientX - d.x) < 4) return;
          d.moved = true;
          const n = at(e);
          if (n !== d.last) {
            d.last = n;
            onChange(n);
          }
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (d && !d.moved) onChange(at(e));
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {/* A build that skips ahead (WO-69): each stretch is one box over its levels, the open one in ember. */}
        {spans?.map((sp) =>
          sp.from < sp.to ? (
            <span
              key={sp.to}
              className={`${styles.span} ${level >= sp.from && level <= sp.to ? styles.spanOn : ""}`}
              style={{ left: `${((sp.from - 1) / total) * 100}%`, width: `${((sp.to - sp.from + 1) / total) * 100}%` }}
            />
          ) : null,
        )}
        <div data-window="" className={styles.window} style={{ left: `${((start - 1) / total) * 100}%`, width: `${(size / total) * 100}%` }} />
        {marks.map((m) => {
          // The ends always say where the build starts and stops; every fifth level between.
          const five = m.level % 5 === 0 || m.level === 1 || m.level === total;
          const inWindow = m.level >= start && m.level < start + size;
          return (
            <span key={m.level}>
              <span className={`${styles.tick} ${five ? styles.tickFive : ""} ${inWindow ? styles.tickNear : ""}`} style={{ left: x(m.level) }} />
              {/* Skip a fifth-level label crowding the last one (e.g. 20 next to 21). */}
              {five && !(m.level !== total && m.level !== 1 && total - m.level < 3) && (
                <span className={styles.tickLabel} style={{ left: x(m.level) }}>
                  {m.level}
                </span>
              )}
              {m.destiny && <span className={styles.markDestiny} style={{ left: x(m.level) }} />}
              {m.stone && <span className={styles.markStone} style={{ left: x(m.level) }} />}
              {m.deity && <span className={styles.markDeity} style={{ left: x(m.level) }} />}
              {m.skill100 && (
                <span className={styles.markStar} style={{ left: x(m.level) }}>
                  <Star size={12} />
                </span>
              )}
              {m.notes && <span className={styles.markNotes} style={{ left: x(m.level) }} />}
              {m.gear && <GearMark className={styles.markGear} style={{ left: x(m.level) }} level={m.level} />}
            </span>
          );
        })}
        <span className={styles.cursorLine} style={{ left: x(level) }} />
        <span className={styles.cursorDiamond} style={{ left: x(level) }} />
      </div>
    </div>
  );
}

/** Twelve levels around the one being viewed, each with its marks. */
/** A cell in the level row: one level, or (WO-69) a stretch, `from` to `level`, with its levels' marks together. */
export type LevelStop = LevelMark & { from: number };

/** The row's stops: every level, or one per stretch with the marks of its levels merged. */
export function levelStops(marks: LevelMark[], spans?: Stretch[]): LevelStop[] {
  if (!spans) return marks.map((m) => ({ ...m, from: m.level }));
  return spans.map((sp) => {
    const ms = marks.slice(sp.from - 1, sp.to);
    const last = marks[sp.to - 1];
    return {
      ...last,
      from: sp.from,
      perks: ms.reduce((n, m) => n + m.perks, 0),
      destiny: ms.some((m) => m.destiny),
      stone: ms.some((m) => m.stone),
      skill100: ms.some((m) => m.skill100),
      gear: ms.some((m) => m.gear),
      deity: ms.some((m) => m.deity),
      problems: ms.reduce((n, m) => n + m.problems, 0),
    };
  });
}

/** The stops the row shows: twelve around the open one. */
function shownStops(stops: LevelStop[], level: number) {
  const at = Math.max(0, stops.findIndex((x) => level >= x.from && level <= x.level));
  const size = Math.min(WINDOW, stops.length);
  const first = windowStart(at + 1, stops.length) - 1;
  return { shown: stops.slice(first, first + size), size };
}

export function LevelRow({ marks, level, onChange, spans }: { marks: LevelMark[]; level: number; onChange: (level: number) => void; spans?: Stretch[] }) {
  const { shown, size } = shownStops(levelStops(marks, spans), level);
  // On phones the row scrolls sideways: keep the current level in view (moving the row, never
  // the page) and fade the edge that has more.
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setEdges({ start: el.scrollLeft > 2, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
    const cell = el.querySelector<HTMLElement>('[aria-current="true"]');
    if (cell && el.scrollWidth > el.clientWidth) el.scrollTo({ left: cell.offsetLeft - (el.clientWidth - cell.offsetWidth) / 2 });
    const frame = requestAnimationFrame(measure);
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [level]);
  return (
    <div className={`${styles.rowWrap} ${edges.start ? styles.moreBefore : ""} ${edges.end ? styles.moreAfter : ""}`}>
      <div ref={scroller} data-row-frame="" className={styles.rowScroller}>
      <div className={styles.row} style={{ ["--cols" as string]: size }}>
        {shown.map((m) => {
          const on = level >= m.from && level <= m.level;
          const past = m.level <= level;
          const name = m.from < m.level ? `${m.from} to ${m.level}` : `${m.level}`;
          const cls = [styles.cell, on ? styles.cellOn : past ? styles.cellPast : styles.cellFuture].join(" ");
          const cell = (
            <button
              key={m.level}
              type="button"
              className={cls}
              aria-label={`${m.from < m.level ? "Levels" : "Level"} ${name}${m.notes ? ", notes" : ""}${m.gear ? ", new gear" : ""}${m.problems ? `, ${m.problems} problem${m.problems > 1 ? "s" : ""}` : ""}`}
              data-stop={name}
              aria-current={on ? "true" : undefined}
              onClick={() => onChange(m.level)}
            >
              <span className={`${styles.cellNum} ${m.from < m.level ? styles.cellSpan : ""}`}>{name}</span>
              <span className={styles.cellMarks}>
                {Array.from({ length: Math.min(4, m.perks) }, (_, i) => (
                  <i key={i} className={styles.cellPerk} />
                ))}
                {m.destiny && <i className={styles.cellDestiny} />}
                {m.stone && <i className={styles.cellStone} />}
                {m.deity && <i className={styles.cellDeity} />}
                {m.notes && <i className={styles.cellNotes} />}
                {m.gear && <GearMark className={styles.cellGear} />}
              </span>
              {m.problems > 0 && <i className={styles.cellProblem} />}
            </button>
          );
          // A level with problems says how many on hover and focus.
          return m.problems > 0 ? (
            <Tooltip key={m.level} content={`${m.problems} problem${m.problems === 1 ? "" : "s"} at ${m.from < m.level ? "levels" : "level"} ${name}`}>
              {cell}
            </Tooltip>
          ) : (
            cell
          );
        })}
      </div>
      </div>
    </div>
  );
}

/**
 * Keeps what the reader is looking at where it is on screen when the level changes: call `hold()`
 * just before changing level, put `ref` on the level row. With `sections` (ids, top to bottom,
 * WO-49): when the level row is off screen, the first of them whose top is at or below the pinned
 * bars is held instead, so a reader down at Gear or Spells doesn't jump when the level card above
 * changes height.
 */
const NO_SECTIONS: readonly string[] = [];

export function useHoldInPlace<T extends HTMLElement>(level: number, sections: readonly string[] = NO_SECTIONS) {
  const ref = useRef<T>(null);
  const held = useRef<{ id: string | null; top: number } | null>(null);
  const hold = useCallback(() => {
    const row = ref.current;
    // The bottom of whatever is pinned over the page (the edit bar, the pinned bar).
    let pinned = 0;
    for (const el of document.querySelectorAll<HTMLElement>("[data-pinned-bar], [data-edit-bar]")) pinned = Math.max(pinned, el.getBoundingClientRect().bottom);
    const rowBox = row?.getBoundingClientRect();
    if (rowBox && rowBox.bottom > pinned && rowBox.top < window.innerHeight) {
      held.current = { id: null, top: rowBox.top };
      return;
    }
    const els = sections.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const below = els.find((el) => el.getBoundingClientRect().top >= pinned - 1);
    const target = below ?? els[els.length - 1];
    held.current = target ? { id: target.id, top: target.getBoundingClientRect().top } : rowBox ? { id: null, top: rowBox.top } : null;
  }, [sections]);
  useLayoutEffect(() => {
    const was = held.current;
    held.current = null;
    if (!was) return;
    const el = was.id ? document.getElementById(was.id) : ref.current;
    if (!el) return;
    const moved = el.getBoundingClientRect().top - was.top;
    if (Math.abs(moved) > 0.5) window.scrollBy({ top: moved, behavior: "instant" });
  }, [level]);
  return { ref, hold };
}

/**
 * The ruler (the whole build) over the row (a close-up of twelve levels), joined by two thin lines
 * from the window's edges to the row's, like a zoom. The lines are measured from where the window
 * and row really are, every frame while the window moves (150 ms), and on any resize.
 */
/**
 * The ruler and the level row, for every build. A build that skips ahead (WO-69) passes its
 * stretches: each is one cell in the row and one box on the ruler, and the ruler's window covers
 * the levels the row's cells span.
 */
export function LevelBars({ marks, level, onChange, spans }: { marks: LevelMark[]; level: number; onChange: (level: number) => void; spans?: Stretch[] }) {
  const { shown } = shownStops(levelStops(marks, spans), level);
  const win = spans && shown.length ? { from: shown[0].from, to: shown[shown.length - 1].level } : undefined;
  const box = useRef<HTMLDivElement>(null);
  const left = useRef<SVGLineElement>(null);
  const right = useRef<SVGLineElement>(null);
  const ruler = marks.length > WINDOW;
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || !ruler) return;
    const draw = () => {
      const win = el.querySelector<HTMLElement>("[data-window]");
      const row = el.querySelector<HTMLElement>("[data-row-frame]");
      if (!win || !row || !left.current || !right.current) return;
      const b = el.getBoundingClientRect();
      const w = win.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      // Screen pixels to the drawing's own (the page may be scaled up on a big monitor).
      const z = pageZoom();
      const set = (line: SVGLineElement, x1: number, x2: number) => {
        line.setAttribute("x1", String((x1 - b.left) / z));
        line.setAttribute("y1", String((w.bottom - b.top) / z));
        line.setAttribute("x2", String((x2 - b.left) / z));
        line.setAttribute("y2", String((r.top - b.top) / z));
      };
      set(left.current, w.left, r.left);
      set(right.current, w.right, r.right);
    };
    // Follow the window while it moves, then settle. The first line is drawn in the next frame, still
    // before it paints (WO-71): measured here, during the commit, it forced a layout of the whole
    // page that the rest of the commit (the level's notes editor) undid, so the page was laid out twice.
    let frame = 0;
    const until = performance.now() + 220;
    const follow = () => {
      draw();
      if (performance.now() < until) frame = requestAnimationFrame(follow);
    };
    frame = requestAnimationFrame(follow);
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    window.addEventListener("resize", draw);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, [level, ruler, marks.length]);
  return (
    <div ref={box} className={styles.bars}>
      {ruler && <LevelRuler marks={marks} level={level} onChange={onChange} spans={spans} win={win} />}
      {ruler && (
        <svg className={styles.connectors} aria-hidden="true">
          <line ref={left} />
          <line ref={right} />
        </svg>
      )}
      <LevelRow marks={marks} level={level} onChange={onChange} spans={spans} />
    </div>
  );
}

const ARROW_TIP_KEY = "lbp.arrowTip";
type ArrowTipStore = { clicks: number; done?: boolean };

function readArrowTip(): ArrowTipStore {
  try {
    const v = JSON.parse(window.localStorage.getItem(ARROW_TIP_KEY) ?? "null") as ArrowTipStore | null;
    return v && typeof v.clicks === "number" ? v : { clicks: 0 };
  } catch {
    return { clicks: 0 };
  }
}
function writeArrowTip(v: ArrowTipStore) {
  try {
    window.localStorage.setItem(ARROW_TIP_KEY, JSON.stringify(v));
  } catch {
    // No storage: the hint may show again, nothing worse.
  }
}

/**
 * The one-time arrow-key hint (WO-49), on devices with a mouse and keyboard: it shows after the
 * player's second click on ‹ or › (on any build), goes after 6 seconds, on the first arrow key or
 * on its ×, and once dismissed or once an arrow key has been used it never shows again.
 */
export function useArrowTip() {
  const [open, setOpen] = useState<"pinned" | "page" | null>(null);
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(null), 6000);
    return () => window.clearTimeout(t);
  }, [open]);
  const done = useCallback(() => {
    writeArrowTip({ ...readArrowTip(), done: true });
    setOpen(null);
  }, []);
  const stepped = useCallback((where: "pinned" | "page") => {
    const v = readArrowTip();
    if (v.done) return;
    const clicks = v.clicks + 1;
    writeArrowTip({ clicks });
    if (clicks >= 2 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setOpen(where);
  }, []);
  return { open, stepped, done };
}

/** The hint's panel: "Tip: ← and → step through levels", with key caps and a ×. */
export function ArrowTip({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.arrowTip} role="status">
      <span>
        Tip: <kbd className={styles.key}>←</kbd> and <kbd className={styles.key}>→</kbd> step through levels
      </span>
      <button type="button" className={styles.arrowTipClose} aria-label="Close the tip" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

