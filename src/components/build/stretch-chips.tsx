"use client";

import { stretchName, stretches } from "@/lib/rules/stretches";
import type { BuildPlan } from "@/lib/rules/types";
import styles from "./stretch-chips.module.css";

/**
 * A build that skips ahead (WO-69): one chip per stretch, `11 to 25` over `13 perks`, the open one
 * in ember. On the build page they sit under the ruler; in the editor (`tabs`) they are the level
 * tabs themselves, underlined when open, with a red dot on a stretch that has a problem.
 */
export function StretchChips({ plan, level, onChange, tabs, problems }: { plan: Pick<BuildPlan, "levels">; level: number; onChange: (to: number) => void; tabs?: boolean; problems?: Set<number> }) {
  return (
    <div className={tabs ? styles.tabs : styles.chips} role="group" aria-label="Levels written">
      {stretches(plan).map((s) => {
        const n = plan.levels[s.to - 1]?.perks.length ?? 0;
        const on = level >= s.from && level <= s.to;
        const bad = problems?.has(s.to);
        return (
          <button
            key={s.to}
            type="button"
            aria-pressed={on}
            aria-label={`${s.from === s.to ? "Level" : "Levels"} ${stretchName(s)}${bad ? ", has a problem" : ""}`}
            className={`${tabs ? styles.tab : styles.chip} ${on ? styles.on : ""}`}
            onClick={() => onChange(s.to)}
            data-stretch={stretchName(s)}
          >
            {tabs ? (
              <>
                <span className={styles.tabLabel}>{s.from === s.to ? "Level" : "Levels"}</span>
                <span className={styles.name}>
                  {stretchName(s)}
                  {bad && <i className={styles.dot} aria-hidden="true" />}
                </span>
              </>
            ) : (
              <>
                <span className={styles.name}>{stretchName(s)}</span>
                <span className={styles.sub}>
                  {n} perk{n === 1 ? "" : "s"}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
