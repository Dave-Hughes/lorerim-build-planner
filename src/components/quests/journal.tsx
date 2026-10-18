"use client";

import { useState } from "react";
import styles from "./quests.module.css";

/** A quest's journal (WO-100): hidden until opened, then the first entry, then the rest on request. */
export function QuestRow({ name, xp, first, journal }: { name: string; xp: number; first: boolean; journal: string[] }) {
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState(false);
  const shown = all ? journal : journal.slice(0, 1);
  return (
    <li className={styles.q}>
      <span className={styles.qn}>
        {name}
        {first && <span className={styles.first}>Starts here</span>}
      </span>
      <span className={`${styles.xp} ${xp ? "" : styles.zero}`}>{xp ? `${xp} XP` : "No XP"}</span>
      <span className={styles.j}>
        {journal.length > 0 && (
          <button type="button" className={styles.link} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? "Hide journal" : "Journal ›"}
          </button>
        )}
      </span>
      {open && (
        <span className={styles.qopen}>
          {shown.map((t, i) => (
            <p key={i} className={styles.entry}>
              “{t}”
            </p>
          ))}
          {!all && journal.length > 1 && (
            <span className={styles.next}>
              <button type="button" className="btn btn-sm" onClick={() => setAll(true)}>
                Show the next {journal.length - 1} {journal.length === 2 ? "entry" : "entries"}
              </button>
              <span className="muted">These give the story away</span>
            </span>
          )}
        </span>
      )}
    </li>
  );
}
