import Link from "next/link";
import { nexusUrl, type GuideChapter, type GuideSection } from "@/lib/game-guide/guide";
import { ChapterIcon } from "./guide-nav";
import { CopyLink } from "./copy-link";
import { OpenFromHash } from "./open-from-hash";
import styles from "./guide.module.css";

/**
 * A chapter of the guide (WO-66), as in docs/sketches/guide-chapter.html: its number, title,
 * subtitle and lead; then each section's explanation, More detail and Related Mods (collapsed),
 * and Players ask, each question collapsed to itself; Previous and Next at the foot. All of it is
 * HTML: the pages read in full without scripts.
 */
export function ChapterView({ chapter, prev, next }: { chapter: GuideChapter; prev?: GuideChapter; next?: GuideChapter }) {
  return (
    <article className={styles.chapter}>
      <OpenFromHash />
      <header className={styles.chapterHead}>
        <span className={styles.chapterNo}>
          {chapter.icon && <ChapterIcon icon={chapter.icon} size={32} />}
          Chapter {chapter.number}
        </span>
        <h1 className={styles.h1}>{chapter.title}</h1>
        {chapter.subtitle && <p className={styles.sub}>{chapter.subtitle}</p>}
        <div className={`${styles.lead} ${styles.prose}`} dangerouslySetInnerHTML={{ __html: chapter.lead }} />
      </header>
      {chapter.sections.map((s) => (
        <Section key={s.id} s={s} />
      ))}
      <nav className={styles.next} aria-label="Chapters">
        {prev ? (
          <Link href={`/guide/${prev.slug}`}>
            <small>Previous</small>
            <span>
              {prev.icon && <ChapterIcon icon={prev.icon} />}
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/guide/${next.slug}`} className={styles.fwd}>
            <small>Next</small>
            <span>
              {next.icon && <ChapterIcon icon={next.icon} />}
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}

function Section({ s }: { s: GuideSection }) {
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className={styles.section}>
      <h2 id={`${s.id}-title`} className={styles.h2}>
        {s.title}
        <CopyLink id={s.id} label={s.title} />
      </h2>
      <div className={styles.prose} dangerouslySetInnerHTML={{ __html: s.html }} />
      {s.more && (
        <details className={styles.more}>
          <summary>More detail</summary>
          <div className={`${styles.moreBody} ${styles.prose}`} dangerouslySetInnerHTML={{ __html: s.more }} />
        </details>
      )}
      {s.mods && (
        <details className={styles.mods}>
          <summary>
            Related Mods{" "}
            <span className={styles.count}>
              {s.mods.length} mod{s.mods.length === 1 ? "" : "s"}
            </span>
          </summary>
          <dl className={styles.modList}>
            {s.mods.map((m) => (
              <div key={m.name} className={styles.mod}>
                <dt>
                  <ModName name={m.name} nexus={m.nexus} />
                </dt>
                <dd>
                  <span dangerouslySetInnerHTML={{ __html: m.html }} />
                  {m.where && <span className={styles.where} dangerouslySetInnerHTML={{ __html: m.where }} />}
                  {m.tag && <span className={styles.tag}>{m.tag}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
      {s.asks.length > 0 && (
        <div className={styles.asks}>
          <h3>Players ask</h3>
          {s.asks.map((a) => (
            <details key={a.id} id={a.id} className={styles.ask}>
              <summary>
                <span>{a.question}</span>
                <CopyLink id={a.id} label={a.question} />
              </summary>
              <div className={`${styles.answer} ${styles.prose}`} dangerouslySetInnerHTML={{ __html: a.html }} />
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

/** A mod's name, linked to its Nexus Mods page when its id is known (WO-70). */
export function ModName({ name, nexus }: { name: string; nexus?: string }) {
  if (!nexus) return <>{name}</>;
  return (
    <a href={nexusUrl(nexus)} target="_blank" rel="noreferrer" className={styles.nexus}>
      {name}
      <svg width="10" height="10" viewBox="0 0 10 10" aria-label="(opens Nexus Mods in a new tab)" role="img" shapeRendering="crispEdges">
        <path d="M4 1h5v5H8V3L4 7 3 6l4-4H4zM1 2h2v1H2v5h5V7h1v2H1z" fill="currentColor" />
      </svg>
    </a>
  );
}
