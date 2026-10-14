"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyLink } from "./copy-link";
import { OpenFromHash } from "./open-from-hash";
import styles from "./guide.module.css";

export interface QuestionGroup {
  chapter: { slug: string; number: number; title: string };
  section: { id: string; title: string };
  asks: { id: string; question: string; html: string; text: string }[];
}

/** Every word typed is in the question or its answer (case-insensitive), as the FAQ's filter did. */
function matches(a: { question: string; text: string }, words: string[]): boolean {
  const hay = `${a.question} ${a.text}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/**
 * All questions (WO-66): every question in the guide, under its chapter and section (each linking
 * back), with the FAQ's filter. The filter is the one part that needs scripts.
 */
export function QuestionsView({ groups, total }: { groups: QuestionGroup[]; total: number }) {
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = groups.map((g) => ({ ...g, asks: g.asks.filter((a) => !words.length || matches(a, words)) }));
  const chapters = [...new Set(groups.map((g) => g.chapter.slug))];
  const any = shown.some((g) => g.asks.length);
  return (
    <div className={styles.chapter}>
      <OpenFromHash />
      <header className={styles.chapterHead}>
        <h1 className={styles.h1}>All questions</h1>
        <p className={styles.sub}>
          {total} questions players ask, from every chapter of the guide.
        </p>
      </header>
      <label className={styles.filter}>
        <span className="sr-only">Filter questions</span>
        <input className="input" type="search" placeholder="Filter questions" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      {words.length > 0 && !any && (
        <p className={styles.none} role="status">
          No questions match &quot;{q.trim()}&quot;.{" "}
          <button type="button" className="btn btn-sm" onClick={() => setQ("")}>
            Clear
          </button>
        </p>
      )}
      {chapters.map((slug) => {
        const mine = shown.filter((g) => g.chapter.slug === slug);
        const c = mine[0].chapter;
        return (
          <section key={slug} aria-labelledby={`q-${slug}`} className={styles.qChapter} hidden={!mine.some((g) => g.asks.length)}>
            <h2 id={`q-${slug}`} className={styles.h2}>
              <Link href={`/guide/${slug}`}>
                {c.title}
              </Link>
            </h2>
            {mine.map((g) => (
              <div key={g.section.id} className={styles.asks} hidden={!g.asks.length}>
                <h3>
                  <Link href={`/guide/${slug}#${g.section.id}`}>{g.section.title}</Link>
                </h3>
                {g.asks.map((a) => (
                  <details key={a.id} id={a.id} className={styles.ask}>
                    <summary>
                      <span>{a.question}</span>
                      <CopyLink id={a.id} label={a.question} />
                    </summary>
                    <div className={`${styles.answer} ${styles.prose}`} dangerouslySetInnerHTML={{ __html: a.html }} />
                  </details>
                ))}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
