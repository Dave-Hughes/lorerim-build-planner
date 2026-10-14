"use client";

import { useState } from "react";
import type { Faq, FaqQuestion } from "@/lib/faq/faq";
import styles from "./faq-view.module.css";

/** Every word typed is in the question or its answer (case-insensitive). */
function matches(q: FaqQuestion, words: string[]): boolean {
  const hay = `${q.question} ${q.text}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/**
 * The FAQ page (WO-63): the title and byline, the sections' contents (beside the questions from
 * 900 wide, a Sections button above them on phones), then every question with its answer. A
 * question links to itself (hover or focus shows the link; clicking copies it). The filter is the
 * one part that needs scripts: without them the page reads in full.
 */
export function FaqView({ faq }: { faq: Faq }) {
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = faq.sections.map((s) => ({ ...s, questions: s.questions.filter((x) => !words.length || matches(x, words)) }));
  const visible = shown.filter((s) => s.questions.length);
  const contents = (
    <ul className={styles.contentsList}>
      {faq.sections.map((s) => (
        <li key={s.id} hidden={!visible.some((v) => v.id === s.id)}>
          <a href={`#${s.id}`}>{s.title}</a>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <header className={styles.head}>
        <h1 className={`title ${styles.title}`}>{faq.title}</h1>
        <p className={styles.byline}>{faq.byline}</p>
      </header>
      <div className={styles.layout}>
        <nav aria-label="Sections" className={styles.contents}>
          {contents}
        </nav>
        <div className={styles.main}>
          <details className={styles.phoneContents}>
            <summary className="btn btn-sm">Sections</summary>
            <nav aria-label="Sections">{contents}</nav>
          </details>
          <label className={styles.filter}>
            <span className="sr-only">Filter questions</span>
            <input className="input" type="search" placeholder="Filter questions" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          {words.length > 0 && !visible.length && (
            <p className={styles.none} role="status">
              No questions match &quot;{q.trim()}&quot;.{" "}
              <button type="button" className="btn btn-sm" onClick={() => setQ("")}>
                Clear
              </button>
            </p>
          )}
          {shown.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={styles.section} hidden={!s.questions.length}>
              <h2 id={`${s.id}-title`} className={styles.sectionTitle}>
                {s.title}
              </h2>
              {s.questions.map((x) => (
                <article key={x.id} id={x.id} aria-labelledby={`${x.id}-q`} className={styles.question}>
                  <h3 id={`${x.id}-q`} className={styles.q}>
                    {x.question}
                    <CopyQuestionLink id={x.id} question={x.question} />
                  </h3>
                  <div className={styles.answer} dangerouslySetInnerHTML={{ __html: x.html }} />
                </article>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

/** A question's own link: shown on hover or focus; copies the full URL and says "Copied" for 2s. */
function CopyQuestionLink({ id, question }: { id: string; question: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(`#${id}`, window.location.href.split("#")[0]).toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard: the link still works from the address bar.
    }
  };
  return (
    <button type="button" className={`${styles.link} ${copied ? styles.linkCopied : ""}`} aria-label={`Copy a link to: ${question}`} onClick={() => void copy()}>
      {copied ? (
        <span className={styles.copied}>Copied</span>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
          {/* Two square chain links, in pixels like the planner's icons. */}
          <path d="M1 5h6v2H3v2h4v2H1zM9 5h6v6H9V9h4V7H9zM5 7h6v2H5z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
