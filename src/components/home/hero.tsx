import { HERO } from "@/lib/coming-soon/art";
import { SearchLauncher } from "./search-launcher";
import styles from "./home.module.css";

/* eslint-disable @next/next/no-img-element */
/**
 * The home page's hero (WO-157): the coming soon night scene, full width, moving on CSS alone (stars, aurora, the fire's six frames), with
 * the site's name in the pixel face, one line, and the search box that opens the palette. The header sits over it. `compact` is the
 * signed-in version, shorter and without the line.
 */
export function HomeHero({ compact, line, children }: { compact?: boolean; line?: string; children?: React.ReactNode }) {
  const layer = (src: string, className = "", style?: React.CSSProperties, key?: string) => <img key={key ?? src} className={`${styles.layer} ${className}`} src={src} alt="" style={style} />;
  return (
    <section className={`${styles.hero} ${compact ? styles.compact : ""}`} aria-label="LoreRim Planner">
      {layer(HERO.sky)}
      {layer(HERO.stars[0])}
      {layer(HERO.stars[1], styles.starsB)}
      {layer(HERO.aurora[0])}
      {layer(HERO.aurora[1], styles.auroraB)}
      {HERO.landLayers.map((l) => layer(l.src))}
      {HERO.fg.map((src, i) => layer(src, `${styles.fire} ${i === 0 ? styles.first : ""}`, { animationDelay: i === 0 ? "0s" : `${-1.2 + i * 0.2}s` }))}
      <span className={styles.shade} />
      <div className={styles.big}>
        <h1 className={styles.title}>
          LoreRim
          <br />
          Planner
        </h1>
        {line && !compact ? <p className={styles.line}>{line}</p> : null}
        <SearchLauncher />
        {children}
      </div>
    </section>
  );
}
