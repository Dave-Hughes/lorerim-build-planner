"use client";

import type { LevelMark } from "@/lib/rules/derive";
import styles from "./level-nav.module.css";

export const WINDOW = 12;

export function windowStart(level: number, total: number): number {
  const size = Math.min(WINDOW, total);
  return Math.max(1, Math.min(level - Math.floor(size / 2), total - size + 1));
}

function Star({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="#f0913f" />
    </svg>
  );
}

export function LevelLegend() {
  return (
    <div className={styles.legend}>
      <span>
        <i className={styles.keyPerk} />
        Perk
      </span>
      <span>
        <i className={styles.keyDestiny} />
        Destiny
      </span>
      <span>
        <i className={styles.keyStone} />
        Standing stone
      </span>
      <span>
        <Star />
        Skill 100 perk
      </span>
      <span>
        <i className={styles.keyNotes} />
        Notes
      </span>
    </div>
  );
}

export function LevelStepper({ level, total, onChange }: { level: number; total: number; onChange: (level: number) => void }) {
  return (
    <div className={styles.stepper}>
      <button type="button" className="btn btn-icon" aria-label="Previous level" disabled={level <= 1} onClick={() => onChange(level - 1)}>
        ‹
      </button>
      <span className={styles.viewing}>
        <span className="label">Viewing level</span>
        <span className={styles.viewingNum}>{level}</span>
        <span className="muted">of {total}</span>
      </span>
      <button type="button" className="btn btn-icon" aria-label="Next level" disabled={level >= total} onClick={() => onChange(level + 1)}>
        ›
      </button>
    </div>
  );
}

/** The whole build on one line. Only marks that matter: Destiny, stones, Skill 100 perks, notes. */
export function LevelRuler({ marks, level, onChange }: { marks: LevelMark[]; level: number; onChange: (level: number) => void }) {
  const total = marks.length;
  const start = windowStart(level, total);
  const size = Math.min(WINDOW, total);
  const x = (n: number) => `${(((n - 0.5) / total) * 100).toFixed(4)}%`;
  const pick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const n = Math.min(total, Math.max(1, Math.ceil(((e.clientX - r.left) / r.width) * total)));
    onChange(n);
  };
  return (
    <div className={styles.scroller}>
      <div className={styles.ruler} aria-label={`Whole build, levels 1 to ${total}`} onClick={pick} role="presentation">
        <div className={styles.window} style={{ left: `${((start - 1) / total) * 100}%`, width: `${(size / total) * 100}%` }} />
        {marks.map((m) => {
          const five = m.level % 5 === 0 || m.level === 1;
          const inWindow = m.level >= start && m.level < start + size;
          return (
            <span key={m.level}>
              <span className={`${styles.tick} ${five ? styles.tickFive : ""} ${inWindow ? styles.tickNear : ""}`} style={{ left: x(m.level) }} />
              {five && (
                <span className={styles.tickLabel} style={{ left: x(m.level) }}>
                  {m.level}
                </span>
              )}
              {m.destiny && <span className={styles.markDestiny} style={{ left: x(m.level) }} />}
              {m.stone && <span className={styles.markStone} style={{ left: x(m.level) }} />}
              {m.skill100 && (
                <span className={styles.markStar} style={{ left: x(m.level) }}>
                  <Star size={12} />
                </span>
              )}
              {m.notes && <span className={styles.markNotes} style={{ left: x(m.level) }} />}
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
export function LevelRow({ marks, level, onChange }: { marks: LevelMark[]; level: number; onChange: (level: number) => void }) {
  const total = marks.length;
  const start = windowStart(level, total);
  const size = Math.min(WINDOW, total);
  const shown = marks.slice(start - 1, start - 1 + size);
  return (
    <div className={styles.scroller}>
      <div className={styles.row} style={{ gridTemplateColumns: `repeat(${size}, minmax(56px, 1fr))` }}>
        {shown.map((m) => {
          const on = m.level === level;
          const past = m.level <= level;
          const cls = [styles.cell, on ? styles.cellOn : past ? styles.cellPast : styles.cellFuture].join(" ");
          return (
            <button
              key={m.level}
              type="button"
              className={cls}
              aria-label={`Level ${m.level}${m.notes ? ", notes" : ""}${m.problems ? `, ${m.problems} problem${m.problems > 1 ? "s" : ""}` : ""}`}
              aria-current={on ? "true" : undefined}
              onClick={() => onChange(m.level)}
            >
              <span className={styles.cellNum}>{m.level}</span>
              <span className={styles.cellMarks}>
                {Array.from({ length: Math.min(4, m.perks) }, (_, i) => (
                  <i key={i} className={styles.cellPerk} />
                ))}
                {m.destiny && <i className={styles.cellDestiny} />}
                {m.stone && <i className={styles.cellStone} />}
                {m.notes && <i className={styles.cellNotes} />}
              </span>
              {m.problems > 0 && <i className={styles.cellProblem} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
