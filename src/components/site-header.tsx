import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import styles from "./site-header.module.css";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className={styles.header}>
      <div className={`page ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path d="M11 1 L13 9 L21 11 L13 13 L11 21 L9 13 L1 11 L9 9 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span>LoreRim Build Planner</span>
        </Link>
        <nav aria-label="Main" className={styles.nav}>
          <Link href="/">Browse builds</Link>
          {user && <Link href="/">My builds</Link>}
          <Link href="/">New build</Link>
        </nav>
        {user ? (
          <form
            className={styles.account}
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <span>{user.name}</span>
            <button className="btn" type="submit">
              Sign out
            </button>
          </form>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("discord");
            }}
          >
            <button className="btn" type="submit">
              Sign in with Discord
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
