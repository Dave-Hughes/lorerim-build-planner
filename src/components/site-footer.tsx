import Link from "next/link";
import styles from "./site-footer.module.css";

/** The foot of every site page (WO-37): one quiet link, to the About note. */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <Link href="/about" className={styles.link}>
          About
        </Link>
      </div>
    </footer>
  );
}
