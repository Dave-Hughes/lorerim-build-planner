import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import { UploadForm } from "@/components/challenge/upload-form";
import { challengeOn } from "@/lib/features";
import { boardRows, type BoardRow } from "@/lib/challenge/store";
import { Avatar } from "@/components/ui/avatar";
import styles from "@/components/challenge/challenge.module.css";

export const metadata: Metadata = { title: "Leaderboard | Zenithar's Challenge", description: "Runs of Zenithar's Challenge, uploaded by the players who made them." };
export const dynamic = "force-dynamic";

/* eslint-disable @next/next/no-img-element */
const Pixel = ({ name, size }: { name: string; size: number }) => <img className={styles.pixel} src={`/icons/${name}.svg`} alt="" width={size} height={size} />;

const days = (n: number) => n.toFixed(n < 10 ? 1 : 0);

function Board({ rows }: { rows: BoardRow[] }) {
  if (rows.length === 0) return <p className={styles.empty}>No runs yet. The first place is open.</p>;
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
              <td className={`${styles.rank} ${i === 0 ? styles.first1 : ""}`}>{i + 1}</td>
              <td>
                <Link href={`/challenge/run/${row.id}`}>{row.characterName}</Link>
              </td>
              <td>
                <span className={styles.who}>
                  <Avatar name={row.player} image={row.image} size={24} />
                  {row.player}
                </span>
              </td>
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

/** The leaderboard: cleanest runs first, then the longest lived. The upload sits above the table. */
export default async function Leaderboard() {
  if (!challengeOn()) notFound();
  const session = await auth().catch(() => null);
  // A table that isn't there yet (a preview that hasn't run the migration) reads as an empty board, not an error.
  const rows = await boardRows().catch(() => []);
  return (
    <>
      <header className={styles.band}>
        <div className={`page ${styles.bandInner}`}>
          <Pixel name="challenge-trophy" size={96} />
          <div className={styles.bandWords}>
            <h1 className={styles.bandTitle}>Leaderboard</h1>
            <p className={styles.bandLine}>Fewest rules broken, then the most days lived</p>
          </div>
        </div>
      </header>
      <main className={`page ${styles.sheet}`}>
        <section className={styles.add}>
          <Pixel name="quest-chest" size={64} />
          <div className={styles.addWords}>
            <h2 className={styles.listName}>Add your run</h2>
            {session?.user ? (
              <>
                <p className={styles.path}>Documents\My Games\Skyrim Special Edition\SKSE\ZenitharsChallenge\</p>
                <UploadForm />
              </>
            ) : (
              <p>The mod writes your run to a file on every save. Sign in to put it here.</p>
            )}
          </div>
          {session?.user ? null : <SignInButton redirectTo="/challenge/leaderboard" className="btn btn-primary" />}
        </section>

        <section className={styles.list}>
          <Board rows={rows} />
        </section>
      </main>
    </>
  );
}
