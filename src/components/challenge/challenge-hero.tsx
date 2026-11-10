import styles from "./challenge.module.css";

/* eslint-disable @next/next/no-img-element */
const px = (name: string) => `/challenge/px/${name}.png`;

/**
 * The challenge's hero: a smithy of its own (scripts/challenge/build.py). Stone wall, Zenithar's banner, Tapps at
 * the anvil and the forge behind him, six frames of hammer and fire. It moves on CSS alone and stops for anyone who
 * asks for less motion.
 */
export function ChallengeHero({ over, title, line, children }: { over?: string; title: string; line: string; children?: React.ReactNode }) {
  return (
    <section className={styles.hero} aria-label={title}>
      <img className={styles.layer} src={px("smithy-room")} alt="" />
      <img className={`${styles.layer} ${styles.glow}`} src={px("smithy-glow")} alt="" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <img key={i} className={`${styles.layer} ${styles.forge} ${i === 0 ? styles.first : ""}`} src={px(`smithy-fg-${i}`)} alt="" style={{ animationDelay: `${i * 0.2 - 1.2}s` }} />
      ))}
      <span className={styles.shade} />
      <div className={styles.big}>
        <h1 className={styles.heroTitle}>
          {over ? <span className={styles.heroOver}>{over}</span> : null}
          {title}
        </h1>
        <p className={styles.heroLine}>{line}</p>
        {children ? <span className={styles.cta}>{children}</span> : null}
      </div>
    </section>
  );
}
