"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameData } from "@/components/game-data";
import { Tree } from "@/components/build/tree";
import { IRIEL_LEVELS, IRIEL_MARKSMAN, marksmanStates } from "@/lib/coming-soon-tree";
import { DISCORD } from "@/lib/links";
import { TraitText } from "@/components/ui/trait-text";
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

/** Where the tree starts (WO-85): level 20, so it never opens as a grey outline. */
const FIRST = 20;

/**
 * The coming soon page (WO-84, second pass WO-85: the canvas boards ComingSoon2 and ComingSoon2Phone):
 * the hero, then a section for each of its four lines, each with a visual (real screens of Iriel's
 * build, two trait cards from the game's own text, and her Marksman tree lighting level by level,
 * drawn by the app's own tree, read only), then why Tapps made it, and the foot. No sign-up, no
 * tracking, nothing stored.
 */
export function ComingSoon() {
  const d = useGameData();
  const { tick, still } = useTicks();
  // Levels 20 to 50, then the hold at 50; reduced motion shows 50, finished.
  const span = IRIEL_LEVELS - FIRST + 1;
  const level = still ? IRIEL_LEVELS : Math.min(IRIEL_LEVELS, FIRST + (tick % (span + HOLD)));
  const states = useMemo(() => marksmanStates((id) => d.perkById.get(id)?.skill ?? 0), [d]);
  const taken = IRIEL_MARKSMAN.filter((p) => p.at <= level);
  const newest = taken.at(-1)?.at;
  const beat = still ? 0 : Math.floor(tick / 3);
  const frame = (pose: keyof typeof BEATS) => `/icons/tapps-${pose}-${still ? 0 : BEATS[pose][beat % BEATS[pose].length]}.svg`;
  const traits = ["Focused Combat", "Witcher"].map((n) => d.traits.find((t) => t.name === n)).filter((t) => !!t);

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
            <Line icon="speech">Share it with the community</Line>
          </ul>
          <div className={styles.soonRow}>
            <p className={styles.soon}>Opening soon</p>
            <a className={styles.button} href={DISCORD}>
              Join the LoreRim Discord
            </a>
          </div>
        </div>
        <p className={styles.credit}>Tapps, in LoreRim 5.0.4.8</p>
      </section>

      <div className={styles.sections}>
        <Feature icon="race-nord" title="Plan a character" text="Each build gets its own page, led by the author's cover art.">
          <Shot src="/coming-soon/cover.webp" size={[2880, 1120]} alt="Iriel Thornwhisper, Green Pact Hunter: the top of her build page" />
        </Feature>

        <Feature icon="destiny" title="Race, deity, traits, perks and gear" text="Names, descriptions and art come straight from LoreRim's own files.">
          <div className={styles.stack}>
            <Shot src="/coming-soon/character.webp" size={[2560, 248]} alt="Iriel's race, birthsign, deity, traits, game mode and start" muted />
            <div className={styles.traits}>
              {traits.map((t) => (
                <div key={t.name} className={styles.trait}>
                  {t.image && <div className={styles.traitArt} style={{ backgroundImage: `url(${t.image})` }} aria-hidden="true" />}
                  <div className={styles.traitFade} aria-hidden="true" />
                  <div className={styles.traitWords}>
                    <span className={styles.traitName}>{t.name}</span>
                    <span className={styles.traitText}>
                      <TraitText text={t.text} colours />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Shot src="/coming-soon/gear.webp" size={[2560, 908]} alt="Iriel's gear from level 1 to 50, at level 20" muted />
          </div>
        </Feature>

        <Feature
          icon="tab-levels"
          title="Level by level"
          text="Step through a build one level at a time and see what was picked at each."
          note={
            <>
              <span className={styles.wideOnly}>Right:</span>
              <span className={styles.narrowOnly}>Below:</span> Iriel&apos;s Marksman perks, from Tapps&apos;s sample build, in the order she takes them.
            </>
          }
          label="Iriel Thornwhisper's Marksman perks"
        >
          <div className={styles.stack}>
            <div className={styles.treeRow}>
              <div className={`frame ${styles.treeBox}`}>
                <Tree tree="Marksman" states={states} level={level} still noToggle />
              </div>
              <div className={styles.treeSide}>
                <div className={styles.counter} aria-live="off">
                  Level <span className={styles.counterNum} data-level={level}>{level}</span>
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
            <Shot src="/coming-soon/level.webp" size={[2560, 1570]} alt="Iriel at level 20: the level ruler and the level card, with skill points, a perk, a Destiny star and a note" muted />
          </div>
        </Feature>

        <Feature
          icon="speech"
          title="Share it"
          text="Every build has a link with its own preview card, ready to post where LoreRim players are."
          after={
            <a className={styles.button} href={DISCORD}>
              Join the LoreRim Discord
            </a>
          }
          narrow
        >
          <Shot src="/coming-soon/card.webp" size={[1200, 630]} alt="The preview card for Iriel's build link" />
        </Feature>
      </div>

      <section className={styles.why} aria-labelledby="why-title">
        <div className={styles.whyInner}>
          <h2 id="why-title" className={styles.h2}>
            Why I made this
          </h2>
          <div className={styles.panels}>
            <div className={styles.panel}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.pix} src={frame("lost")} alt="Tapps holding a map, a question mark over his helmet" width={180} height={180} />
              <p className={styles.say}>I love LoreRim. When I first dove in, I was lost.</p>
            </div>
            <div className={styles.panel}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.pix} src={frame("writing")} alt="Tapps writing on a page with a quill" width={180} height={180} />
              <p className={styles.say}>So I built what I wished I&apos;d had then: a place to plan a character and see how other people play theirs.</p>
            </div>
            <div className={styles.panel}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.pix} src={frame("cheers")} alt="Tapps with a tankard of mead" width={180} height={180} />
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
            <img className={styles.pix} src="/icons/logo-0.svg" alt="" width={32} height={32} />
            <span className={styles.footName}>LoreRim Build Planner</span>
          </span>
          <span className={styles.muted}>Made by Tapps. Not affiliated with the LoreRim team.</span>
          <span className={styles.grow} />
          <a className={styles.footLink} href={DISCORD}>
            LoreRim Discord
          </a>
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

/** One of the hero's lines, told: the icon, a heading and a sentence on the left, the visual on the right (stacked on phones). */
function Feature({
  icon,
  title,
  text,
  note,
  after,
  label,
  narrow,
  children,
}: {
  icon: string;
  title: string;
  text: string;
  note?: React.ReactNode;
  after?: React.ReactNode;
  label?: string;
  /** The visual at most 760 wide (the share card). */
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.feature} aria-label={label ?? title}>
      <div className={styles.featureText}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.pix} src={`/icons/${icon}.svg`} alt="" width={48} height={48} />
        <h2 className={styles.featureTitle}>{title}</h2>
        <p className={styles.featureLead}>{text}</p>
        {note && <p className={styles.featureNote}>{note}</p>}
        {after && <div className={styles.featureAfter}>{after}</div>}
      </div>
      <div className={`${styles.featureVisual} ${narrow ? styles.featureNarrow : ""}`}>{children}</div>
    </section>
  );
}

/** A screenshot in the brass corner frame. */
function Shot({ src, alt, size, muted }: { src: string; alt: string; size: [number, number]; muted?: boolean }) {
  return (
    <div className={`frame ${styles.shot} ${muted ? styles.shotMuted : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={size[0]} height={size[1]} loading="lazy" />
    </div>
  );
}
