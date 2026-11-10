import Link from "next/link";
import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import styles from "./challenge.module.css";

/** The header of the challenge's pages: the site's name, the challenge's two pages, and Discord sign-in for uploading a run. */
export async function ChallengeHeader() {
  const user = (await auth().catch(() => null))?.user;
  return (
    <header className={styles.header}>
      <div className={`page ${styles.headerInner}`}>
        <Link href="/challenge" className={styles.wordmark}>
          LoreRim Planner
        </Link>
        <nav className={styles.nav} aria-label="Challenge pages">
          <Link href="/challenge">Zenithar&apos;s Challenge</Link>
          <Link href="/challenge/leaderboard">Leaderboard</Link>
        </nav>
        <span className={styles.account}>{user ? <span className={styles.signedIn}>{user.name}</span> : <SignInButton redirectTo="/challenge/leaderboard" className="btn btn-sm" />}</span>
      </div>
    </header>
  );
}

export function ChallengeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.footerInner}`}>
        <span>LoreRim Planner</span>
        <p>Fan-made. Not affiliated with Bethesda or the LoreRim team.</p>
      </div>
    </footer>
  );
}
