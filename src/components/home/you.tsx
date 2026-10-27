import Link from "next/link";
import { listBuildsByOwner } from "@/lib/builds/queries";
import styles from "./home.module.css";

const SHOWN = 6;

/**
 * Your characters, last and small (WO-157 Part 9): signed in, the home is the visitor's home, and at its foot one row of your characters
 * as small covers with the name, each a link, and the way to all of them. Where they stand, their drafts and your Claude are on My characters.
 */
export async function YourCharacters({ userId }: { userId: string }) {
  const builds = await listBuildsByOwner(userId);
  if (!builds.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="mine">
      <span className={styles.head}>
        <h2 id="mine" className={styles.h2}>
          Your characters
        </h2>
        <Link href="/me">All my characters ›</Link>
      </span>
      <div className={styles.mini}>
        {builds.slice(0, SHOWN).map((b) => (
          <Link key={b.id} href={`/b/${b.id}`} className={styles.miniCard}>
            <span className={styles.miniImage} style={b.coverImageUrl && !b.coverHeld ? { backgroundImage: `url("${b.coverImageUrl}")` } : undefined} />
            <span className={styles.miniName}>{b.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
