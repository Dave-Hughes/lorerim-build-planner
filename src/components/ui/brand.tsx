import Link from "next/link";
import styles from "./brand.module.css";

export function Brand({ context }: { context?: React.ReactNode }) {
  return (
    <span className={styles.wrap}>
      <Link href="/" className={styles.brand} aria-label="LoreRim Build Planner">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <path d="M11 1 L13 9 L21 11 L13 13 L11 21 L9 13 L1 11 L9 9 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {/* The wordmark shows from 600px up; below that the star mark alone links home. */}
        <span className={styles.word} aria-hidden="true">
          LoreRim Build Planner
        </span>
      </Link>
      {context && <span className={styles.context}>{context}</span>}
    </span>
  );
}
