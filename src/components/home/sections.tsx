/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Change } from "@/lib/changes";
import { formatDayMonth } from "@/lib/format/date";
import styles from "./home.module.css";

/** What each kind of change is, said before the name. */
const KIND: Record<Change["kind"], string> = { quest: "Quest", line: "Quest line", report: "Player report" };

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
            <span className={styles.nameRow}>
              <span className={styles.kind}>{KIND[c.kind]}</span>
              <Link href={c.href}>{c.name}</Link>
            </span>
            {c.what && <span className={styles.what}>{c.what}</span>}
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

/** Three ways to use it, last (WO-182): the quests, the places and people, and the builds. */
export function ThreeWays() {
  return (
    <section className={`${styles.sec} ${styles.rule}`} aria-labelledby="ways">
      <h2 id="ways" className={styles.h2}>
        Three ways to use it
      </h2>
      <div className={styles.ways}>
        <div className={styles.w}>
          <span className={styles.n}>1</span>
          <h3>Look up a quest</h3>
          <p>How it starts, what it needs and what each step asks of you, read from the game&apos;s own files.</p>
          <Link href="/quests">Browse quests ›</Link>
        </div>
        <div className={styles.w}>
          <span className={styles.n}>2</span>
          <h3>Find a place or a person</h3>
          <p>Where it is on the map and who is there; where a person is through the day, what they sell and train.</p>
          <Link href="/places">Browse places ›</Link>
        </div>
        <div className={styles.w}>
          <span className={styles.n}>3</span>
          <h3>Build a character</h3>
          <p>Race, birthsign, god and traits, then perks and skills level by level, inside LoreRim&apos;s rules.</p>
          <Link href="/new">Make a character ›</Link>
        </div>
      </div>
    </section>
  );
}
