"use client";

import Link from "next/link";
import { useState } from "react";
import { checkedLabel, storyOrder, type Story } from "@/lib/quests/story";
import styles from "./quests.module.css";

type Props = { story: Story; mainOrder: string[] };

function Src({ checked }: { checked: Story["start"][number]["checked"] }) {
  return <span className={styles.src}>{checkedLabel(checked)}</span>;
}

/**
 * The story, chapter by chapter (WO-106): the first chapter's name and quests, later ones hidden until
 * asked for. No progress (WO-115, 20 Oct: the Quests pages carry no player context).
 */
export function StorySoFar({ story }: Props) {
  const [all, setAll] = useState(false);
  const quests = storyOrder(story).length;
  return (
    <section aria-labelledby="sofar-title" className={styles.sofar}>
      <span className={styles.sofarHead}>
        <h2 id="sofar-title" className={styles.h2}>
          The story
        </h2>
        <span className="muted">
          {story.chapters.length} chapters | {quests} quests
        </span>
      </span>
      <ol className={styles.chapters}>
        {story.chapters.map((c, i) => {
          const shown = i === 0 || all;
          return (
            <li key={i} className={`${styles.ch} ${i === 0 ? styles.chNow : styles.chLater}`}>
              <span className={styles.chN}>{i + 1}</span>
              <h3>{shown ? c.name : `Chapter ${i + 1}`}</h3>
              <span className={styles.cnt}>
                {c.quests.length} quest{c.quests.length === 1 ? "" : "s"}
              </span>
              {shown && (
                <span className={styles.qs}>
                  {c.quests.map((q) => (
                    <span key={q.edid}>{q.name}</span>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!all && story.chapters.length > 1 && (
        <span className={styles.next}>
          <button type="button" className="btn btn-sm" onClick={() => setAll(true)}>
            Show the rest
          </button>
          <span className="muted">Chapter names give the story away</span>
        </span>
      )}
    </section>
  );
}

/** Opens other stories: each opened line and what it needs, as facts. */
export function StoryOpens({ story }: Props) {
  return (
    <section className={`${styles.panel} ${styles.sidePanel}`} aria-labelledby="opens-title">
      <h2 id="opens-title" className={styles.sideTitle}>
        Opens other stories
      </h2>
      <div className={styles.opens}>
        {story.opens.map((o) => (
          <div key={o.line} className={styles.op}>
            <Link href={`/quests/${o.line}`} className={styles.opName}>
              {o.name}
            </Link>
            <ul className={styles.needs} aria-label={`Needs for ${o.name}`}>
              {o.needs.map((n, i) => (
                <li key={i} className={styles.need}>
                  <span className={`${styles.mark} ${styles.neutral}`}>·</span>
                  <span>{n.text}</span>
                  {n.checked === "not yet" && <span className={styles.src}>not checked yet{n.why ? `: ${n.why}` : ""}</span>}
                </li>
              ))}
              {o.or && (
                <li className={styles.need}>
                  <span className={`${styles.mark} ${styles.neutral}`}>·</span>
                  <span>{o.or.text}</span>
                  {o.or.checked === "not yet" && <span className={styles.src}>not checked yet</span>}
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Along the way: the jobs that open as the story goes on, hidden until asked for. */
export function AlongTheWay({ story }: { story: Story }) {
  const [open, setOpen] = useState(false);
  const n = story.alongside.length;
  if (!n) return null;
  return (
    <section className={`${styles.panel} ${styles.sidePanel}`} aria-labelledby="along-title">
      <h2 id="along-title" className={styles.sideTitle}>
        Along the way
      </h2>
      <span className={styles.soft}>
        {n} job{n === 1 ? "" : "s"} that open{n === 1 ? "s" : ""} as the story goes on. They pay no quest XP.
      </span>
      <button type="button" className={styles.link} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Hide them" : "Show them ›"}
      </button>
      {open && (
        <ul className={styles.alongList}>
          {story.alongside.map((q) => (
            <li key={q.edid}>
              <b>{q.name}</b>
              {q.task && (
                <span>
                  {q.task}
                  <Src checked={q.checked} />
                </span>
              )}
              {q.who && <span className="muted">{q.who}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
