import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import { UploadForm } from "@/components/challenge/upload-form";
import { challengeOn } from "@/lib/features";
import { boardRows, type BoardRow } from "@/lib/challenge/store";
import styles from "@/components/challenge/challenge.module.css";

export const metadata: Metadata = { title: "Leaderboard | Zenithar's Challenge", description: "Runs of Zenithar's Challenge, uploaded by the players who made them." };
export const dynamic = "force-dynamic";

const days = (n: number) => n.toFixed(n < 10 ? 1 : 0);

function Board({ rows }: { rows: BoardRow[] }) {
  if (rows.length === 0) return <p>No runs yet.</p>;
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rank} />
            <th>Character</th>
            <th>Player</th>
            <th className={styles.n}>Level</th>
            <th className={styles.n}>Days</th>
            <th className={styles.n}>Made</th>
            <th className={styles.n}>Rules broken</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id}>
              <td className={styles.rank}>{i + 1}</td>
              <td>
                <Link href={`/challenge/run/${row.id}`}>{row.characterName}</Link>
              </td>
              <td>{row.player}</td>
              <td className={styles.n}>{row.level}</td>
              <td className={styles.n}>{days(row.days)}</td>
              <td className={styles.n}>{row.itemsMade.toLocaleString("en-US")}</td>
              <td className={`${styles.n} ${row.rulesBroken === 0 ? styles.clean : styles.broke}`}>{row.rulesBroken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The leaderboard: one table for each mode, cleanest runs first, then the longest lived. The upload sits above them. */
export default async function Leaderboard() {
  if (!challengeOn()) notFound();
  const session = await auth().catch(() => null);
  // A table that isn't there yet (a preview that hasn't run the migration) reads as an empty board, not an error.
  const [oath, honor] = await Promise.all([boardRows("oath").catch(() => []), boardRows("honor").catch(() => [])]);
  return (
    <main className={`page ${styles.main}`}>
      <section className={styles.section}>
        <h1 className={styles.runTitle}>Leaderboard</h1>
        <p>Runs are ranked by the fewest rules broken, then by the most in-game days.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Add your run</h2>
        {session?.user ? (
          <>
            <p className={styles.path}>Documents\My Games\Skyrim Special Edition\SKSE\ZenitharsChallenge\</p>
            <UploadForm />
          </>
        ) : (
          <SignInButton redirectTo="/challenge/leaderboard" className="btn btn-primary" />
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Oath</h2>
        <Board rows={oath} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Honor</h2>
        <Board rows={honor} />
      </section>
    </main>
  );
}
