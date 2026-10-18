"use client";

import { useWhere } from "@/lib/quests/where";
import styles from "./quests.module.css";

/**
 * Where you are (WO-100): your level, how far the main quest is done, and the lines other lines wait
 * for. Kept in this browser; Clear empties it. On a phone it folds up under its heading.
 */
export function WherePanel({ main, finishable }: { main: { edid: string; name: string }[]; finishable: { id: string; name: string }[] }) {
  const [where, set] = useWhere();
  return (
    <section aria-labelledby="where-title" className={styles.whereSection}>
      <details className={styles.whereFold} open>
        <summary className={styles.whereHead}>
          <h2 id="where-title" className={styles.whereTitle}>
            Where you are
          </h2>
        </summary>
        <div className={`frame ${styles.where}`}>
          <LevelField />
          <label className="field">
            <span className="label">Main quest, done up to</span>
            <select className="select" value={where.mainAt ?? ""} onChange={(e) => set({ mainAt: e.target.value || null })}>
              <option value="">Not started</option>
              {main.map((q) => (
                <option key={q.edid} value={q.edid}>
                  {q.name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.finished}>
            <span className="label" id="finished-label">
              Finished
            </span>
            <span role="group" aria-labelledby="finished-label" className={styles.chips}>
              {finishable.map((f) => {
                const on = where.finished.includes(f.id);
                return (
                  <button key={f.id} type="button" className={styles.chip} aria-pressed={on} onClick={() => set({ finished: on ? where.finished.filter((x) => x !== f.id) : [...where.finished, f.id] })}>
                    <span className={styles.tick} aria-hidden="true">
                      {on ? "✓" : ""}
                    </span>
                    {f.name}
                  </button>
                );
              })}
            </span>
          </div>
        </div>
      </details>
      <button type="button" className={styles.clear} onClick={() => set(null)}>
        Clear
      </button>
    </section>
  );
}

/** Your level: the same stored number on every Quests page. */
export function LevelField({ className }: { className?: string }) {
  const [where, set] = useWhere();
  return (
    <label className={`field ${className ?? ""}`}>
      <span className="label">Your level</span>
      <input
        className={`input ${styles.levelInput}`}
        type="number"
        inputMode="numeric"
        min={1}
        max={999}
        value={where.level ?? ""}
        onChange={(e) => {
          const n = Math.floor(Number(e.target.value));
          set({ level: e.target.value === "" || !Number.isFinite(n) || n < 1 ? null : Math.min(999, n) });
        }}
      />
    </label>
  );
}
