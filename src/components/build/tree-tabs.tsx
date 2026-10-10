"use client";

import { useGameData } from "@/components/game-data";
import { heldCount } from "@/lib/rules/tree-states";
import type { LevelState } from "@/lib/rules/types";
import { SkillIcon } from "@/components/ui/skill-icon";
import styles from "./tree-tabs.module.css";

export function TreeTabs({ state, active, onChange }: { state: LevelState; active: string; onChange: (tree: string) => void }) {
  const d = useGameData();
  const destinyLeft = state.destinyPoints - state.destinyPointsSpent;
  // How many perks the build holds in a tree, in ember after its name; nothing when none.
  const held = (tree: string) => {
    const n = heldCount(d, tree, state);
    return n ? (
      <span className={styles.held}>
        {n}
        <span className="sr-only"> held</span>
      </span>
    ) : null;
  };
  return (
    <div role="tablist" aria-label="Perk trees" className={styles.tabs}>
      {d.skills.map((s) => (
        <button key={s} role="tab" type="button" aria-selected={active === s} className={styles.tab} onClick={() => onChange(s)}>
          <SkillIcon name={s} /> {s} {held(s)} <span className={styles.val}>{state.skills[s]}</span>
        </button>
      ))}
      <button role="tab" type="button" aria-selected={active === "Destiny"} className={styles.tab} onClick={() => onChange("Destiny")}>
        <SkillIcon name="Destiny" /> Destiny {held("Destiny")} <span className={styles.val}>{destinyLeft} left</span>
      </button>
    </div>
  );
}
