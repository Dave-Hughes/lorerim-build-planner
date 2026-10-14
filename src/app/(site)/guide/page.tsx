import type { Metadata } from "next";
import Link from "next/link";
import { readGuide } from "@/lib/game-guide/guide";
import styles from "@/components/game-guide/guide.module.css";

export const metadata: Metadata = {
  title: "Guide",
  description: "How LoreRim 5.0.4.8 plays: character creation, leveling, survival, combat, magic, crafting, travel, death and the keys, checked against the installed files.",
};

/** The guide's front page (WO-66): its 11 chapters, each with its number, title, subtitle and sections. */
export default function GuideIndex() {
  const { chapters } = readGuide();
  return (
    <main className={`page ${styles.index}`}>
      <header className={styles.indexHead}>
        <h1 className={styles.h1}>Guide</h1>
        <p className={styles.byline}>For LoreRim 5.0.4.8</p>
      </header>
      <ol className={styles.indexList}>
        {chapters.map((c) => (
          <li key={c.slug} className={styles.indexItem}>
            <span className={styles.indexNum}>{c.number}</span>
            <div className={styles.indexText}>
              <h2 className={styles.indexTitle}>
                <Link href={`/guide/${c.slug}`}>{c.title}</Link>
              </h2>
              {c.subtitle && <p className={styles.indexSub}>{c.subtitle}</p>}
              <ul className={styles.indexSections}>
                {c.sections.map((s) => (
                  <li key={s.id}>
                    <Link href={`/guide/${c.slug}#${s.id}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.indexRef}>
        <Link href="/guide/mods">Which mod runs what</Link>
        <Link href="/guide/questions">All questions</Link>
      </p>
    </main>
  );
}
