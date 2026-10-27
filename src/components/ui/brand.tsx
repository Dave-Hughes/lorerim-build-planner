import Link from "next/link";
import { PixelLogo } from "./pixel-logo";
import styles from "./brand.module.css";

export function Brand({ context }: { context?: React.ReactNode }) {
  return (
    <span className={styles.wrap}>
      <Link href="/" className={styles.brand} aria-label="LoreRim Planner">
        <PixelLogo size={32} glint />
        {/* The wordmark shows from 600px up; below that the pixel star alone links home. */}
        <span className={styles.word} aria-hidden="true">
          LoreRim Planner
        </span>
      </Link>
      {context && <span className={styles.context}>{context}</span>}
    </span>
  );
}
