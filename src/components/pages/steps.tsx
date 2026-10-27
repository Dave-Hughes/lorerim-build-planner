"use client";

import { useState, type ReactNode } from "react";
import styles from "./page-kit.module.css";

/** The numbered steps of a way. More than 8: the first 6 and "Show all N steps" (WO-154). */
export function Steps({ items, from = 1 }: { items: ReactNode[]; from?: number }) {
  const [all, setAll] = useState(false);
  const long = items.length > 8;
  const shown = long && !all ? items.slice(0, 6) : items;
  return (
    <>
      <ol className={styles.path} start={from}>
        {shown.map((t, i) => (
          <li key={i}>
            <span className={styles.num}>{from + i}</span>
            <span className={styles.txt}>{t}</span>
          </li>
        ))}
      </ol>
      {long && (
        <button type="button" className={styles.more} aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? "Show fewer steps" : `Show all ${items.length} steps`}
        </button>
      )}
    </>
  );
}
