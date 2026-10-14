"use client";

import { stretchName, stretches } from "@/lib/rules/stretches";
import type { BuildPlan } from "@/lib/rules/types";
import styles from "./stretch-chips.module.css";

/**
 * A build that skips ahead (WO-69): one chip per stretch, `11 to 25` over `13 perks`, the open one
 * in ember. In place of the level bars, on the build page and in the editor.
 */
export function StretchChips({ plan, level, onChange }: { plan: Pick<BuildPlan, "levels">; level: number; onChange: (to: number) => void }) {
  return (
    <div className={styles.chips} role="group" aria-label="Levels written">
      {stretches(plan).map((s) => {
        const n = plan.levels[s.to - 1]?.perks.length ?? 0;
        const on = level >= s.from && level <= s.to;
        return (
          <button key={s.to} type="button" aria-pressed={on} className={`${styles.chip} ${on ? styles.on : ""}`} onClick={() => onChange(s.to)} data-stretch={stretchName(s)}>
            <span className={styles.name}>{stretchName(s)}</span>
            <span className={styles.sub}>
              {n} perk{n === 1 ? "" : "s"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
