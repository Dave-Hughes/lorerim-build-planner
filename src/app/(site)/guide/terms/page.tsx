import type { Metadata } from "next";
import Link from "next/link";
import { GuideNav } from "@/components/game-guide/guide-nav";
import { nexusUrl, readGuide, termUses } from "@/lib/game-guide/guide";
import styles from "@/components/game-guide/guide.module.css";

export const metadata: Metadata = {
  title: "Terms",
  description: "Every word the LoreRim guide explains, A to Z, with where the guide uses it.",
};

/** The guide's terms (WO-70): A to Z, each with its icon, definition, links, and the sections that use it. */
export default function TermsPage() {
  const guide = readGuide();
  const uses = termUses(guide);
  return (
    <main className={`page ${styles.layout}`}>
      <GuideNav chapters={guide.chapters} page="terms" />
      <div className={styles.chapter}>
        <header className={styles.chapterHead}>
          <h1 className={styles.h1}>Terms</h1>
          <p className={styles.sub}>Every word the guide explains in a tooltip, A to Z.</p>
        </header>
        <dl className={styles.termList}>
          {guide.terms.map((t) => {
            const used = uses.get(t.id) ?? [];
            return (
              <div key={t.id} id={t.id} className={styles.termEntry}>
                <dt className={styles.termName}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {t.icon && <img src={`/icons/${t.icon}.svg`} alt="" width={16} height={16} className={styles.chapterIcon} />}
                  {t.name}
                  {t.aka.length > 0 && <span className={styles.termAka}>{t.aka.join(", ")}</span>}
                </dt>
                <dd>
                  <span dangerouslySetInnerHTML={{ __html: t.html }} />
                  {(t.see || t.nexus) && (
                    <span className={styles.termLinks}>
                      {t.see && <Link href={t.see}>Read more</Link>}
                      {t.nexus && (
                        <a href={nexusUrl(t.nexus)} target="_blank" rel="noreferrer">
                          Nexus Mods
                        </a>
                      )}
                    </span>
                  )}
                  {used.length > 0 && (
                    <span className={styles.termUsed}>
                      Used in{" "}
                      {used.map((u, i) => (
                        <span key={`${u.chapter.slug}-${u.section?.id ?? ""}`}>
                          {i > 0 && ", "}
                          <Link href={`/guide/${u.chapter.slug}${u.section ? `#${u.section.id}` : ""}`}>
                            {u.chapter.title}
                            {u.section ? `: ${u.section.title}` : ""}
                          </Link>
                        </span>
                      ))}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </main>
  );
}
