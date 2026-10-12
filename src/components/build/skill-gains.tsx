import { SkillIcon } from "@/components/ui/skill-icon";
import styles from "./skill-gains.module.css";

export interface SkillGain {
  skill: string;
  gain: number;
  from: number;
  to: number;
  /** After from → to, muted: "(max skill 61 at level 11)". */
  note?: React.ReactNode;
}

/**
 * Skill changes as four aligned columns: icon, name, the gain (ember, the easiest thing to see,
 * its "+" lined up down the list) and from → to. The name truncates first on narrow screens.
 */
export function SkillGains({ rows, className = "" }: { rows: SkillGain[]; className?: string }) {
  return (
    <span className={`${styles.list} ${className}`}>
      {rows.map((r) => (
        <span key={r.skill} className={styles.row}>
          <SkillIcon name={r.skill} />
          <span className={styles.name}>{r.skill}</span>
          <span className={styles.gain}>+{r.gain}</span>
          <span className={styles.fromTo}>
            {r.from} → {r.to}
          </span>
          {/* Its own line under the name, so it never squeezes the columns. */}
          {r.note && <span className={styles.note}>{r.note}</span>}
        </span>
      ))}
    </span>
  );
}
