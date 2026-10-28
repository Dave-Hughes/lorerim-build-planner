import { HERO } from "@/lib/coming-soon/art";
import { HeroMotion } from "./hero-motion";
import { SearchLauncher } from "./search-launcher";
import styles from "./home.module.css";

/* eslint-disable @next/next/no-img-element */
/**
 * The home page's hero (WO-157): the coming soon night scene, full width, moving on CSS alone (stars, aurora, the fire's six frames), with
 * the site's name in the pixel face, one line, and the search box that opens the palette. The header sits over it. Signed in it is the same
 * hero, the whole sky and all, without the buttons (WO-173).
 */
export function HomeHero({ line, children }: { line?: string; children?: React.ReactNode }) {
  const bare = !children;
  // `depth` is how far a layer drifts with the pointer and the scroll (WO-170): the far ones least, the fire most.
  const layer = (src: string, className = "", depth = 0.1, style?: React.CSSProperties, key?: string) => <img key={key ?? src} className={`${styles.layer} ${styles.drift} ${className}`} src={src} alt="" style={{ ...style, "--d": depth } as React.CSSProperties} />;
  const embers = [-14, -9, -4, 0, 5, 10, 15, 20];
  return (
    <section className={styles.hero} aria-label="LoreRim Planner">
      {layer(HERO.sky, "", 0.1)}
      {layer(HERO.stars[0], "", 0.15)}
      {layer(HERO.stars[1], styles.starsB, 0.15)}
      {layer(HERO.aurora[0], "", 0.25)}
      {layer(HERO.aurora[1], styles.auroraB, 0.25)}
      {/* Alduin crosses the aurora about every 22 seconds, and a shooting star goes by every nine (WO-170). */}
      <span className={`${styles.alduin} ${styles.drift}`} style={{ "--d": 0.3 } as React.CSSProperties} aria-hidden="true">
        <img src="/quests/stories/main-quest/dragon.png" alt="" />
      </span>
      <i className={`${styles.shoot} ${styles.shootA}`} aria-hidden="true" />
      <i className={`${styles.shoot} ${styles.shootB}`} aria-hidden="true" />
      {HERO.landLayers.map((l, i) => layer(l.src, "", [0.3, 0.4, 0.55, 0.7, 0.85, 1][i] ?? 1))}
      {HERO.fg.map((src, i) => layer(src, `${styles.fire} ${i === 0 ? styles.first : ""}`, 1.2, { animationDelay: i === 0 ? "0s" : `${-1.2 + i * 0.2}s` }))}
      {/* Embers rise from Tapps's fire. */}
      <span className={`${styles.embers} ${styles.drift}`} style={{ "--d": 1.2 } as React.CSSProperties} aria-hidden="true">
        {embers.map((x, i) => (
          <i key={i} style={{ marginLeft: `${x}px`, animationDelay: `${-((i * 0.55) % 3.6).toFixed(2)}s` }} />
        ))}
      </span>
      <HeroMotion />
      <span className={styles.shade} />
      <div className={`${styles.big} ${bare ? styles.bare : ""}`}>
        <h1 className={styles.title}>
          LoreRim Planner
        </h1>
        {line ? <p className={styles.line}>{line}</p> : null}
        <SearchLauncher />
        {children}
      </div>
    </section>
  );
}
