"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameData } from "@/components/game-data";
import { Tree } from "@/components/build/tree";
import { GearView } from "@/components/build/gear-view";
import { LevelCard } from "@/components/build/build-view";
import { TraitText } from "@/components/ui/trait-text";
import { IRIEL_AUTHOR, IRIEL_NOTES, IRIEL_PLAN } from "@/lib/coming-soon/iriel";
import { computeBuild } from "@/lib/rules/engine";
import { levelMarks } from "@/lib/rules/derive";
import { stretches } from "@/lib/rules/stretches";
import { notedLevels } from "@/lib/guide/doc";
import { DISCORD } from "@/lib/links";
import { HERO, STORY } from "@/lib/coming-soon/art";
import styles from "./coming-soon.module.css";

/** One level every 280 ms (WO-86), so new gear can be read; at 50 it holds 16 levels' time, then starts from 1. */
const TICK = 280;
const LAST = 50;
const HOLD = 16;
/** Where the tree opens (WO-85): level 20, so it never shows as a grey outline. */
const FIRST = 20;
/** A level card every 5 ticks (about 1.4 s). The hero's fire steps every tick, its stars swap every 3, its aurora every 24; the story panels step every 2 (WO-87). */
const CARD_TICKS = 5;
const STAR_TICKS = 3;
const AURORA_TICKS = 24;
const PANEL_TICKS = 2;

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

/** The shared clock's level: 20 to 50 the first time, then 1 to 50, holding at 50 between. */
function levelAt(tick: number): number {
  const first = LAST + HOLD - FIRST + 1;
  const v = tick < first ? FIRST + tick : 1 + ((tick - first) % (LAST + HOLD));
  return Math.min(LAST, v);
}

/**
 * The coming soon page (WO-84 to WO-86; fourth pass WO-87: the canvas boards ComingSoon4 and
 * ComingSoon4Phone). A pixel night in Skyrim with Tapps writing by the fire, how this started in four
 * pixel panels, what it is, a section for each of its four lines, and what comes later. Iriel's tree,
 * gear timeline and level cards are the app's own components, read only, drawn from her build (a
 * fixture copied from staging) and played on one clock. No sign-up, no tracking, nothing stored.
 */
export function ComingSoon() {
  const d = useGameData();
  const { tick, still } = useTicks();
  const level = still ? LAST : levelAt(tick);
  const states = useMemo(() => computeBuild(IRIEL_PLAN, d), [d]);
  const cards = useMemo(() => stretches(IRIEL_PLAN), []);
  const marks = useMemo(() => levelMarks(d, IRIEL_PLAN, states, notedLevels(IRIEL_NOTES)), [d, states]);
  // Her Marksman perks, in the order she takes them, up to this level.
  const taken = useMemo(
    () =>
      Object.entries(states[LAST - 1].perksTaken)
        .filter(([id]) => d.perkById.get(id)?.tree === "Marksman")
        .map(([id, at]) => ({ id, at: at[0] }))
        .sort((a, b) => a.at - b.at),
    [d, states],
  ).filter((p) => p.at <= level);
  const newest = taken.at(-1)?.at;
  const card = cards[still ? 0 : Math.floor(tick / CARD_TICKS) % cards.length];
  // The hero and the panels; with reduced motion, their first frames.
  const fg = still ? 0 : tick % HERO.fg.length;
  const starsA = still || Math.floor(tick / STAR_TICKS) % 2 === 0;
  const auroraA = still || Math.floor(tick / AURORA_TICKS) % 2 === 0;
  const panel = still ? 0 : Math.floor(tick / PANEL_TICKS);
  const traits = ["Focused Combat", "Witcher"].map((n) => d.traits.find((t) => t.name === n)).filter((t) => !!t);
  const range = card.from < card.to;

  return (
    <div className={styles.page}>
      {/* A night in Skyrim in pixels: the layers back to front, the fire and stars on the clock (WO-87). */}
      <section className={styles.hero}>
        {/* eslint-disable @next/next/no-img-element */}
        <img className={styles.px} src={HERO.sky} alt="" />
        <img className={styles.px} src={HERO.stars[0]} alt="" style={{ opacity: starsA ? 1 : 0 }} />
        <img className={styles.px} src={HERO.stars[1]} alt="" style={{ opacity: starsA ? 0 : 1 }} />
        <img className={`${styles.px} ${styles.aurora}`} src={HERO.aurora[0]} alt="" style={{ opacity: auroraA ? 1 : 0 }} />
        <img className={`${styles.px} ${styles.aurora}`} src={HERO.aurora[1]} alt="" style={{ opacity: auroraA ? 0 : 1 }} />
        <img className={styles.px} src={HERO.land} alt="A night in Skyrim drawn in pixels: an aurora over snowy peaks, a pine forest, and Tapps writing in a book by a campfire" />
        <img className={styles.px} src={HERO.fg[fg]} alt="" data-fg={fg} />
        {/* eslint-enable @next/next/no-img-element */}
        <div className={styles.heroFade} aria-hidden="true" />
        <div className={styles.heroWords}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.pix} src="/icons/logo-0.svg" alt="" width={48} height={48} />
          <h1 className={styles.title}>
            LoreRim
            <br />
            Build Planner
          </h1>
          <div className={styles.soonBlock}>
            <p className={styles.soon}>Opening soon</p>
            <p className={styles.soonLine}>
              Will be shared in the{" "}
              <a className={styles.soonLink} href={DISCORD}>
                Modding Bungalo
              </a>{" "}
              Discord.
            </p>
          </div>
        </div>
      </section>

      {/* How this started: Tapps's story in four pixel panels (WO-87). */}
      <section className={styles.story} aria-labelledby="story-title">
        <div className={styles.storyInner}>
          <h2 id="story-title" className={styles.h2}>
            How this started
          </h2>
          <div className={styles.panels}>
            {STORY.map((p) => (
              <figure key={p.label} className={styles.panel}>
                <div className={`frame ${styles.panelArt}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.pix} src={p.frames[panel % p.frames.length]} alt={p.alt} width={160} height={100} />
                </div>
                <figcaption className={styles.panelWords}>
                  <span className={styles.panelLabel}>{p.label}</span>
                  <span className={styles.say}>{p.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* What it is, in plain words, before the four sections. */}
      <section className={styles.what} aria-labelledby="what-title">
        <h2 id="what-title" className={styles.featureTitle}>
          What it is
        </h2>
        <div className={styles.whatBody}>
          <p className={styles.whatText}>
            A character planner for LoreRim. You plan a build level by level, with the game&apos;s own perks, traits, spells and gear, then publish it with a link or keep it to yourself.
          </p>
          <p className={styles.whatNote}>It starts with LoreRim 5.0.4.8. Later versions will be supported as they come out.</p>
          <ul className={styles.whatLines}>
            <Line icon="race-nord">Plan a character for LoreRim</Line>
            <Line icon="destiny">Pick race, deity, perks, spells, gear and more</Line>
            <Line icon="tab-levels">See what changes at each level</Line>
            <Line icon="speech">Share it with the community</Line>
          </ul>
        </div>
      </section>

      <div className={styles.sections}>
        <Feature
          icon="race-nord"
          title="Plan a character"
          text="Plan, build, publish and share your character builds."
          after={
            <p className={styles.featureIconLine}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.pix} src="/icons/sneak.svg" alt="" width={32} height={32} />
              Or keep them private.
            </p>
          }
        >
          <Shot src="/coming-soon/cover.webp" size={[2880, 1120]} alt="Iriel Thornwhisper, Green Pact Hunter: the top of her build page" />
        </Feature>

        <Feature icon="destiny" title="Race, deity, traits, perks, gear and more" text="All names, descriptions and other data come right from the LoreRim files.">
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
            {/* Her gear, played on the tree's clock (WO-86). */}
            <div className={`frame ${styles.live}`} data-live="gear">
              <GearView plan={IRIEL_PLAN} level={level} play />
            </div>
          </div>
        </Feature>

        <Feature
          icon="tab-levels"
          title="Level by level"
          text="Step through builds a level at a time, or fast track your build using level ranges. See details about what changes from each level, as well as the author's notes for that level."
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
            {/* Her level cards, one after another, on their own slower clock (WO-86). */}
            <div className={`frame ${styles.live} ${styles.cards}`} data-live="cards">
              <div className={styles.cardHead} data-card={`${card.from}-${card.to}`}>
                {range ? `Levels ${card.from} to` : "Level"} <span className={styles.cardNum}>{card.to}</span> <span className={styles.cardOf}>of {LAST}</span>
              </div>
              <div className={styles.ruler} aria-hidden="true">
                <span className={styles.rulerBox} style={{ left: `${((card.from - 1) / LAST) * 100}%`, width: `${((card.to - card.from + 1) / LAST) * 100}%` }} data-range={`${card.from}-${card.to}`} />
                {marks.map((m) => (
                  <span key={m.level} className={styles.rulerMark} style={{ left: `${((m.level - 1) / LAST) * 100}%` }}>
                    <i className={m.destiny ? styles.markDestiny : undefined} />
                    <i className={m.perks ? styles.markPerk : styles.markNone} />
                    <i className={m.gear ? styles.markGear : undefined} />
                  </span>
                ))}
              </div>
              <LevelCard d={d} build={{ plan: IRIEL_PLAN, author: IRIEL_AUTHOR }} states={states} level={card.to} note={IRIEL_NOTES[`level:${card.to}`] ?? null} glance />
            </div>
          </div>
        </Feature>

        <Feature
          icon="speech"
          title="Share it"
          text={
            <>
              Every build has a link with its own preview card, ready to post to the <a href={DISCORD}>Modding Bungalo</a> Discord server.
            </>
          }
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

      {/* Coming later (WO-87). */}
      <section className={styles.later} aria-labelledby="later-title">
        <div className={styles.laterInner}>
          <h2 id="later-title" className={styles.h2}>
            Coming later
          </h2>
          <div className={styles.laterCards}>
            <Later icon="tab-story" title="Story and roleplay" text="A build's own story, in the author's words and screenshots, for when you want a character to play and not only numbers." />
            <Later
              icon="chapter-staying-alive"
              title="LoreRim survival guide"
              text="How LoreRim plays, chapter by chapter: character creation, leveling, survival, combat, magic, crafting, travel, death and the keys, checked against the game's files."
            />
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

/** A framed card in Coming later: a 64 px pixel icon, a name, a sentence. */
function Later({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className={`frame ${styles.laterCard}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.pix} src={`/icons/${icon}.svg`} alt="" width={64} height={64} />
      <div className={styles.laterWords}>
        <span className={styles.laterTitle}>{title}</span>
        <span className={styles.laterText}>{text}</span>
      </div>
    </div>
  );
}

/** One of the hero's lines, told: the icon, a heading and words on the left, the visual on the right (stacked where the columns wrap). */
function Feature({
  icon,
  title,
  text,
  after,
  label,
  narrow,
  children,
}: {
  icon: string;
  title: string;
  text: React.ReactNode;
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
        {after && <div className={styles.featureAfter}>{after}</div>}
      </div>
      <div className={`${styles.featureVisual} ${narrow ? styles.featureNarrow : ""}`}>{children}</div>
    </section>
  );
}

/** A screenshot in the brass corner frame, sized so nothing jumps as it loads. */
function Shot({ src, alt, size, muted }: { src: string; alt: string; size: [number, number]; muted?: boolean }) {
  return (
    <div className={`frame ${styles.shotFrame} ${muted ? styles.shotMuted : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={size[0]} height={size[1]} loading="lazy" />
    </div>
  );
}
