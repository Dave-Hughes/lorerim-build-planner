import Link from "next/link";
import type { GuideChapter } from "@/lib/game-guide/guide";
import styles from "./guide.module.css";

/**
 * The guide's chapter list (WO-66): numbers and titles, the open chapter in ember with its
 * sections under it, then the reference pages. Beside the page from 900 wide (sticky); above it,
 * folded into a Chapters button, on phones.
 */
export function GuideNav({ chapters, current, page }: { chapters: GuideChapter[]; current?: string; page?: "questions" | "mods" | "terms" }) {
  const list = (
    <>
      <p className={styles.tocTitle}>The Guide</p>
      <ol className={styles.tocList}>
        {chapters.map((c) => {
          const on = c.slug === current;
          return (
            <li key={c.slug} className={on ? styles.tocOn : undefined}>
              <Link href={`/guide/${c.slug}`} aria-current={on ? "page" : undefined}>
                <span className={styles.tocNum}>{c.number}</span>
                {c.icon ? <ChapterIcon icon={c.icon} /> : <span />}
                <span>{c.title}</span>
              </Link>
              {on && (
                <ul className={styles.tocSections}>
                  {c.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`}>{s.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
      <div className={styles.tocRef}>
        <Link href="/guide/mods" aria-current={page === "mods" ? "page" : undefined}>
          Which mod runs what
        </Link>
        <Link href="/guide/questions" aria-current={page === "questions" ? "page" : undefined}>
          All questions
        </Link>
        <Link href="/guide/terms" aria-current={page === "terms" ? "page" : undefined}>
          Terms
        </Link>
      </div>
    </>
  );
  return (
    <aside className={styles.toc} aria-label="Guide chapters">
      <div className={styles.tocWide}>{list}</div>
      <details className={styles.tocPhone}>
        <summary>Chapters</summary>
        <div className={styles.tocBody}>{list}</div>
      </details>
    </aside>
  );
}

/** A chapter's pixel icon (WO-70): decorative, crisp at 16 or 32. */
export function ChapterIcon({ icon, size = 16 }: { icon: string; size?: 16 | 32 }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/${icon}.svg`} alt="" width={size} height={size} className={styles.chapterIcon} />;
}
