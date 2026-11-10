import { HERO } from "@/lib/coming-soon/art";
import styles from "./challenge.module.css";

/* eslint-disable @next/next/no-img-element */
const px = (name: string) => `/challenge/px/${name}.png`;

/**
 * The challenge's hero: the site's night scene (sky, stars, aurora, the land) with its own foreground, Tapps at an
 * anvil beside a forge, six frames (scripts/challenge/build.py). It moves on CSS alone and stops for anyone who
 * asks for less motion.
 */
export function ChallengeHero({ title, line, children }: { title: string; line: string; children?: React.ReactNode }) {
  const layer = (src: string, className = "") => <img key={src} className={`${styles.layer} ${className}`} src={src} alt="" />;
  return (
    <section className={styles.hero} aria-label={title}>
      {layer(HERO.sky)}
      {layer(HERO.stars[0])}
      {layer(HERO.stars[1], styles.starsB)}
      {layer(HERO.aurora[0])}
      {layer(HERO.aurora[1], styles.auroraB)}
      {HERO.landLayers.map((l) => layer(l.src))}
      {layer(px("hero-glow"))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <img key={i} className={`${styles.layer} ${styles.forge} ${i === 0 ? styles.first : ""}`} src={px(`hero-fg-${i}`)} alt="" style={{ animationDelay: `${i * 0.2 - 1.2}s` }} />
      ))}
      <span className={styles.shade} />
      <div className={styles.big}>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroLine}>{line}</p>
        {children ? <span className={styles.cta}>{children}</span> : null}
      </div>
    </section>
  );
}
