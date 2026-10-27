/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Change } from "@/lib/changes";
import { formatDayMonth } from "@/lib/format/date";
import styles from "./home.module.css";

/** New in the world: real changes only, from the data builds and the approved reports (src/lib/changes.ts). */
export function NewInTheWorld({ changes }: { changes: Change[] }) {
  if (!changes.length) return null;
  const half = Math.ceil(changes.length / 2);
  const column = (rows: Change[]) => (
    <div>
      {rows.map((c) => (
        <div key={`${c.kind}-${c.href}`} className={styles.u}>
          <img className={styles.px} src={`/icons/${c.icon}.svg`} alt="" width={32} height={32} />
          <span>
            <Link href={c.href}>{c.name}</Link>
            <span className={styles.what}>{c.what}</span>
          </span>
          <time dateTime={c.date}>{formatDayMonth(`${c.date}T12:00:00Z`)}</time>
        </div>
      ))}
    </div>
  );
  return (
    <section className={styles.sec} aria-labelledby="new">
      <span className={styles.head}>
        <h2 id="new" className={styles.h2}>
          New in the world
        </h2>
        <Link href="/changes">Everything that changed ›</Link>
      </span>
      <div className={styles.upd}>
        {column(changes.slice(0, half))}
        {column(changes.slice(half))}
      </div>
    </section>
  );
}

/** Three ways to use it, last. */
export function ThreeWays({ playthroughs }: { playthroughs: boolean }) {
  return (
    <section className={`${styles.sec} ${styles.rule}`} aria-labelledby="ways">
      <h2 id="ways" className={styles.h2}>
        Three ways to use it
      </h2>
      <div className={styles.ways}>
        <div className={styles.w}>
          <span className={styles.n}>1</span>
          <h3>Build a character</h3>
          <p>Race, birthsign, god and traits, then perks and skills level by level, inside LoreRim&apos;s rules.</p>
          <Link href="/new">Make a character ›</Link>
        </div>
        <div className={styles.w}>
          <span className={styles.n}>2</span>
          <h3>Plan the life</h3>
          <p>Acts with a goal and a place, and the quests and jobs in each. Your save says where you stand.</p>
          {playthroughs ? <Link href="/characters?run=1">See a playthrough ›</Link> : null}
        </div>
        <div className={styles.w}>
          <span className={styles.n}>3</span>
          <h3>Ask your Claude</h3>
          <p>Your own Claude can draft a character here, and read your save to it.</p>
        </div>
      </div>
    </section>
  );
}
