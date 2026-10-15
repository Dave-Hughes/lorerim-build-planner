"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameData } from "@/components/game-data";
import { Tree } from "@/components/build/tree";
import { IRIEL_LEVELS, IRIEL_MARKSMAN, marksmanStates } from "@/lib/coming-soon-tree";
import { DISCORD } from "@/lib/links";
import styles from "./coming-soon.module.css";

/** One level every 170 ms; at 50 it holds about 2.7 s, then starts again (WO-84). */
const TICK = 170;
const HOLD = 16;
/** Tapps' frames on each beat (three ticks, about half a second). The last frame of each set is a blink. */
const BEATS = { lost: [0, 1, 0, 1, 0, 1, 2, 1], writing: [0, 1, 2, 2, 3, 2, 2, 2], cheers: [0, 0, 1, 0, 0, 0, 2, 0] } as const;

/** Ticks, paused while the tab is hidden; none with reduced motion. */
function useTicks(): { tick: number; still: boolean } {
  const [tick, setTick] = useState(0);
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      if (timer === undefined) timer = window.setInterval(() => setTick((t) => t + 1), TICK);
    };
    const sync = () => {
      setStill(mq.matches);
      if (mq.matches || document.hidden) stop();
      else start();
    };
    sync();
    mq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return { tick, still };
}

/**
 * The coming soon page (WO-84, the canvas boards ComingSoon and ComingSoonPhone): the hero, Iriel's
 * Marksman tree lighting star by star (the app's own tree, read only), two real screens, why Tapps made
 * it, and the foot. No sign-up, no tracking, nothing stored.
 */
export function ComingSoon() {
  const d = useGameData();
  const { tick, still } = useTicks();
  // Levels 1 to 50, then the hold at 50; reduced motion shows 50, finished.
  const level = still ? IRIEL_LEVELS : Math.min(IRIEL_LEVELS, (tick % (IRIEL_LEVELS + HOLD)) + 1);
  const states = useMemo(() => marksmanStates((id) => d.perkById.get(id)?.skill ?? 0), [d]);
  const taken = IRIEL_MARKSMAN.filter((p) => p.at <= level);
  const newest = taken.at(-1)?.at;
  const beat = still ? 0 : Math.floor(tick / 3);
  const frame = (pose: keyof typeof BEATS) => `/icons/tapps-${pose}-${still ? 0 : BEATS[pose][beat % BEATS[pose].length]}.svg`;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.drift}
          src="/coming-soon/hero.webp"
          srcSet="/coming-soon/hero-1200.webp 1200w, /coming-soon/hero.webp 2400w"
          sizes="100vw"
          alt="An archer on a stone ledge above a valley in Skyrim, in LoreRim"
        />
        <div className={styles.heroFade} aria-hidden="true" />
        <div className={styles.heroWords}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.pix} src="/icons/logo-0.svg" alt="" width={48} height={48} />
          <h1 className={styles.title}>
            LoreRim
            <br />
            Build Planner
          </h1>
          <ul className={styles.lines}>
            <Line icon="race-nord">Plan a character for LoreRim</Line>
            <Line icon="destiny">Pick race, deity, perks, spells, gear and more</Line>
            <Line icon="tab-levels">See what changes at each level</Line>
            <Line icon="speech">
              <span>
                Share it with the community on the <a href={DISCORD}>LoreRim Discord</a>
              </span>
            </Line>
          </ul>
          <p className={styles.soon}>Opening soon</p>
        </div>
        <p className={styles.credit}>Tapps, in LoreRim 5.0.4.8</p>
      </section>

      <section className={styles.band} aria-label="Iriel Thornwhisper's Marksman perks">
        <div className={styles.treeHead}>
          <h2 className={styles.h2}>Iriel Thornwhisper, levels 1 to 50</h2>
          <span className={styles.muted}>Sample build by Tapps</span>
        </div>
        <p className={styles.treeLead}>Marksman perks, in the order she takes them.</p>
        <div className={styles.treeRow}>
          <div className={`frame ${styles.treeBox}`}>
            <Tree tree="Marksman" states={states} level={level} still noToggle />
          </div>
          <div className={styles.treeSide}>
            <div className={styles.counter} aria-live="off">
              Level <span className={styles.counterNum} data-level={level}>{level}</span> <span className={styles.counterOf}>of 50</span>
            </div>
            <ol className={styles.taken} aria-label="Taken">
              {taken.map((p) => (
                <li key={p.id} className={p.at === newest ? styles.takenNew : undefined}>
                  <span>{d.perkById.get(p.id)?.name ?? p.id}</span>
                  <span className={styles.lv}>Lv {p.at}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.screens}`} aria-label="Two screens">
        <figure className={styles.screen}>
          <div className={`frame ${styles.screenFrame}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coming-soon/build-page.webp" alt="The build page for Iriel Thornwhisper, Green Pact Hunter" width={1440} height={900} loading="lazy" />
          </div>
          <figcaption className={styles.caption}>The build page</figcaption>
        </figure>
        <figure className={styles.screen}>
          <div className={`frame ${styles.screenFrame} ${styles.screenRuler}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/coming-soon/ruler.webp" alt="The level ruler for levels 1 to 50, with perks, Destiny, stones, notes and gear marked" width={1300} height={75} loading="lazy" />
          </div>
          <figcaption className={styles.caption}>Levels 1 to 50 on one ruler</figcaption>
        </figure>
      </section>

      <section className={styles.why} aria-labelledby="why-title">
        <div className={styles.whyInner}>
          <h2 id="why-title" className={styles.h2}>
            Why I made this
          </h2>
          <div className={styles.panels}>
            <div className={styles.panel}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.pix} src={frame("lost")} alt="Tapps holding a map, a question mark over his helmet" width={150} height={150} />
              <p className={styles.say}>I love LoreRim. When I first dove in, I was lost.</p>
            </div>
            <div className={styles.panel}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.pix} src={frame("writing")} alt="Tapps writing on a page with a quill" width={150} height={150} />
              <p className={styles.say}>So I built what I wished I&apos;d had then: a place to plan a character and see how other people play theirs.</p>
            </div>
            <div className={styles.panel}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.pix} src={frame("cheers")} alt="Tapps with a tankard of mead" width={150} height={150} />
              <p className={styles.say}>
                It&apos;s my way of giving something back to the LoreRim team and everyone who plays it. Come find me on the <a href={DISCORD}>LoreRim Discord</a>.
              </p>
              <p className={styles.sign}>Tapps</p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.foot}>
        <div className={styles.footInner}>
          <span className={styles.made}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.pix} src="/icons/tapps.svg" alt="" width={32} height={32} />
            <span>Made by Tapps.</span>
          </span>
          <span className={styles.muted}>Not affiliated with the LoreRim team.</span>
          <span className={styles.grow} />
          <span className={styles.domain}>lorerimplanner.com</span>
        </div>
      </footer>
    </div>
  );
}

function Line({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <li>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.pix} src={`/icons/${icon}.svg`} alt="" width={32} height={32} />
      {children}
    </li>
  );
}
