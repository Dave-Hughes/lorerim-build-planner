import type { Metadata } from "next";
import Link from "next/link";
import { GuideNav } from "@/components/game-guide/guide-nav";
import { modIndex, readGuide } from "@/lib/game-guide/guide";
import styles from "@/components/game-guide/guide.module.css";

export const metadata: Metadata = {
  title: "Which mod runs what",
  description: "Every mod the LoreRim guide names, A to Z, with the sections that name it and where its settings are.",
};

/** Which mod runs what (WO-66): every mod in a Related Mods list, A to Z, with the sections naming it and its settings. */
export default function ModsPage() {
  const guide = readGuide();
  const mods = modIndex(guide);
  return (
    <main className={`page ${styles.layout}`}>
      <GuideNav chapters={guide.chapters} page="mods" />
      <div className={styles.chapter}>
        <header className={styles.chapterHead}>
          <h1 className={styles.h1}>Which mod runs what</h1>
          <p className={styles.sub}>Every mod the guide names, A to Z, with the sections that name it and where its settings are.</p>
        </header>
        <dl className={styles.modIndex}>
          {mods.map((m) => (
            <div key={m.name} className={styles.mod} id={`mod-${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              <dt>{m.name}</dt>
              <dd>
                {m.places.map((p) => (
                  <span key={`${p.chapter.slug}-${p.section.id}`} className={styles.modPlace}>
                    <Link href={`/guide/${p.chapter.slug}#${p.section.id}`}>
                      {p.chapter.title}: {p.section.title}
                    </Link>
                    <span dangerouslySetInnerHTML={{ __html: p.html }} />
                    {p.where && <span className={styles.where} dangerouslySetInnerHTML={{ __html: p.where }} />}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
