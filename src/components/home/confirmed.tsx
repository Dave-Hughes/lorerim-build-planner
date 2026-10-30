/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ago, type Confirmed } from "@/lib/confirmed/recent";
import styles from "./home.module.css";

const ICON = { quest: "quest-side-stories", person: "quest-people", place: "quest-travel" } as const;

/**
 * Recently confirmed by players (WO-184 Part 4, board HomeConfirmed): above New in the world, the latest confirmations and the facts players told us that an
 * admin approved, one card a page. Nothing yet, and the section isn't drawn.
 */
export function RecentlyConfirmed({ cards }: { cards: Confirmed[] }) {
  if (!cards.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="confirmed">
      <span className={styles.head}>
        <h2 id="confirmed" className={styles.h2}>
          Recently confirmed by players
        </h2>
        <Link href="/help-fill-the-gaps">Help fill the gaps ›</Link>
      </span>
      <div className={styles.rc}>
        {cards.map((c) => (
          <Link key={`${c.kind}:${c.href}`} href={c.href} className={styles.rcard}>
            <span className={styles.rtop}>
              <img className={styles.px} src={`/icons/${ICON[c.kind]}.svg`} alt="" width={18} height={18} />
              <span className={styles.rkind}>{c.what}</span>
            </span>
            <b>{c.name}</b>
            <span className={styles.rby}>
              {c.image ? <img className={styles.rav} src={c.image} alt="" width={24} height={24} /> : <span className={styles.rav} />}
              {c.how === "confirmed" ? "Confirmed by" : "Told to us by"} {c.by}
              <time dateTime={c.at.toISOString()}>{ago(c.at)}</time>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
