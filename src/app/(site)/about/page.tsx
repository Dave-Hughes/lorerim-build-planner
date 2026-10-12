import type { Metadata } from "next";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "./about.module.css";

export const metadata: Metadata = { title: "About", ...siteMetadata("/about", "About") };

/** A note from Dave (WO-37), as a note found in game: torn parchment, a little crooked, sealed in wax. */
export default function AboutPage() {
  return (
    <main className={styles.main}>
      <article aria-label="About" className={styles.note}>
        <span className={styles.seal} aria-hidden="true" />
        <h1 className={styles.greeting}>To whoever finds this,</h1>
        <p>We came to LoreRim the way most do: died in the first cave, came back, died a little later. Somewhere between the third bandit camp and the hundredth perk, we fell for it.</p>
        <p>
          This planner is our way of paying that back. Plan a character one level at a time, share it, and learn from the ones who walked the road before you. If it gets one new player
          through their first winter, it was worth the ink.
        </p>
        <p className={styles.last}>Walk well. Mind the frostbite spiders.</p>
        <p className={styles.signed}>— Tapps, by candlelight</p>
      </article>
    </main>
  );
}
