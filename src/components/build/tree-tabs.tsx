"use client";

import { SKILLS } from "@/lib/rules/data";
import type { LevelState } from "@/lib/rules/types";
import styles from "./tree-tabs.module.css";

export function TreeTabs({ state, active, onChange }: { state: LevelState; active: string; onChange: (tree: string) => void }) {
  const destinyLeft = state.destinyPoints - state.destinyPointsSpent;
  return (
    <div role="tablist" aria-label="Perk trees" className={styles.tabs}>
      {SKILLS.map((s) => (
        <button key={s} role="tab" type="button" aria-selected={active === s} className={styles.tab} onClick={() => onChange(s)}>
          {s} <span className={styles.val}>{state.skills[s]}</span>
        </button>
      ))}
      <button role="tab" type="button" aria-selected={active === "Destiny"} className={styles.tab} onClick={() => onChange("Destiny")}>
        Destiny <span className={styles.val}>{destinyLeft} left</span>
      </button>
    </div>
  );
}
