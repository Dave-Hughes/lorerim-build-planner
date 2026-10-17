/* eslint-disable @next/next/no-img-element */
import { HERO } from "@/lib/coming-soon/art";
import cs from "@/components/coming-soon/coming-soon.module.css";
import styles from "./invite.module.css";

/**
 * The invite's scene (WO-96): the coming soon page's pixel night, Tapps writing by the fire, the
 * wordmark in the sky, and Tapps's line in the story's cream dialogue box, with the one button under it.
 */
export function InviteScene({ line, children }: { line: string; children?: React.ReactNode }) {
  return (
    <main className={`${cs.page} ${styles.page}`}>
      <section className={`${cs.hero} ${styles.scene}`}>
        <img className={cs.px} src={HERO.sky} alt="" />
        <img className={`${cs.px} ${cs.stars}`} src={HERO.stars[0]} alt="" />
        <img className={`${cs.px} ${cs.aurora}`} src={HERO.aurora[0]} alt="" />
        {HERO.landLayers.map((l, i) => (
          <img key={l.src} className={cs.px} src={l.src} alt={i === HERO.landLayers.length - 1 ? "A night in Skyrim drawn in pixels: an aurora over snowy peaks, a pine forest, and Tapps writing in a book by a campfire" : ""} />
        ))}
        <div className={cs.fireGlow} aria-hidden="true" />
        <img className={cs.px} src={HERO.fg[0]} alt="" />
        <div className={cs.heroFade} aria-hidden="true" />
        <div className={cs.heroWords}>
          <h1 className={cs.title}>
            <img className={cs.wordmark} src={HERO.wordmark} alt="LoreRim Build Planner" width={113} height={38} />
          </h1>
        </div>
      </section>
      <div className={styles.talk}>
        <div className={cs.dialog}>
          <img className={`${cs.pix} ${cs.dialogFace}`} src="/icons/tapps.svg" alt="" width={24} height={24} />
          <div className={cs.dialogWords}>
            <span className={cs.dialogLabel}>Tapps</span>
            <p className={cs.dialogLine}>{line}</p>
          </div>
        </div>
        {children && <div className={styles.action}>{children}</div>}
      </div>
    </main>
  );
}
