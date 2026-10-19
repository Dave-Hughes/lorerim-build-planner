"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mainDone } from "@/lib/quests/open";
import { checkedLabel, doneCount, storyOrder, type Story, type StoryQuest } from "@/lib/quests/story";
import { useStoryProgress } from "@/lib/quests/story-progress";
import { useWhere } from "@/lib/quests/where";
import styles from "./quests.module.css";

type Props = { story: Story; mainOrder: string[] };

function useProgress({ story, mainOrder }: Props) {
  const order = useMemo(() => storyOrder(story), [story]);
  const edids = useMemo(() => order.map((q) => q.edid), [order]);
  const [last, setLast] = useStoryProgress(story, edids, mainOrder);
  return { order, edids, last, setLast, done: doneCount(edids, last) };
}

function Src({ checked }: { checked: Story["start"][number]["checked"] }) {
  return <span className={styles.src}>{checkedLabel(checked)}</span>;
}

/**
 * Your next step (WO-106): the first quest not done, when and how it starts, and its first task.
 * Mark done moves on one quest; I'm further on sets how far you are.
 */
export function StoryNext(props: Props) {
  const { story } = props;
  const { order, edids, done, setLast } = useProgress(props);
  const [picking, setPicking] = useState(false);
  const next: StoryQuest | undefined = order[done];
  const byEdid = (e: string) => order.find((q) => q.edid === e) ?? story.alongside.find((q) => q.edid === e);
  const from = next?.from ? byEdid(next.from) : undefined;
  return (
    <section className={`frame ${styles.panel}`} aria-labelledby="next-title">
      <h2 id="next-title" className={styles.h2}>
        Your next step
      </h2>
      {next ? (
        <>
          <Link href={`/quests/${story.line}#q-${next.edid}`} className={styles.nextName}>
            {next.name}
          </Link>
          <dl className={styles.who}>
            {from && (
              <>
                <dt>When</dt>
                <dd>
                  {next.atEnd ? `Starts as ${from.name} ends` : `Starts during ${from.name}`}
                  <Src checked={next.checked} />
                </dd>
              </>
            )}
            {next.who && (
              <>
                <dt>Who</dt>
                <dd>
                  {next.who}
                  <Src checked={next.checked} />
                </dd>
              </>
            )}
            {next.where && (
              <>
                <dt>Where</dt>
                <dd>
                  {next.where}
                  <Src checked={next.checked} />
                </dd>
              </>
            )}
            {next.task && (
              <>
                <dt>First task</dt>
                <dd>
                  {next.task}
                  <Src checked={next.checked} />
                </dd>
              </>
            )}
          </dl>
          {next.note && <p className={styles.soft}>{next.note}</p>}
          {done === 0 && (
            <div className={styles.startLines}>
              <span className="label">How it starts</span>
              {story.start.map((s, i) => (
                <p key={i} className={styles.soft}>
                  {s.text}
                  <Src checked={s.checked} />
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className={styles.soft}>You&apos;ve finished this story.</p>
      )}
      <span className={styles.nextButtons}>
        {next && (
          <button type="button" className="btn btn-primary" onClick={() => setLast(next.edid)}>
            Mark done
          </button>
        )}
        <button type="button" className="btn" aria-expanded={picking} onClick={() => setPicking(!picking)}>
          I&apos;m further on
        </button>
      </span>
      {picking && (
        <label className="field">
          <span className="label">Done up to</span>
          <select
            className="select"
            value={edids[done - 1] ?? ""}
            onChange={(e) => {
              setLast(e.target.value || null);
              setPicking(false);
            }}
          >
            <option value="">Not started</option>
            {order.map((q) => (
              <option key={q.edid} value={q.edid}>
                {q.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </section>
  );
}

/** The story so far: chapters done and the current one in full; later ones hidden until asked for. */
export function StorySoFar(props: Props) {
  const { story } = props;
  const { edids, done } = useProgress(props);
  const [all, setAll] = useState(false);
  // Where each chapter starts in story order, and the chapter you're in (-1: all done).
  const starts = story.chapters.map((_, i) => story.chapters.slice(0, i).reduce((n, c) => n + c.quests.length, 0));
  const current = story.chapters.findIndex((c, i) => done < starts[i] + c.quests.length);
  return (
    <section aria-labelledby="sofar-title" className={styles.sofar}>
      <span className={styles.sofarHead}>
        <h2 id="sofar-title" className={styles.h2}>
          The story so far
        </h2>
        <span className="muted">
          {done} of {edids.length} quests done
        </span>
      </span>
      <ol className={styles.chapters}>
        {story.chapters.map((c, i) => {
          const first = starts[i];
          const isDone = current === -1 || i < current;
          const isNow = i === current;
          const shown = isDone || isNow || all;
          return (
            <li key={i} className={`${styles.ch} ${isDone ? styles.chDone : isNow ? styles.chNow : styles.chLater}`}>
              <span className={styles.chN} aria-label={isDone ? `Chapter ${i + 1}, done` : undefined}>
                {i + 1}
              </span>
              <h3>{shown ? c.name : `Chapter ${i + 1}`}</h3>
              <span className={styles.cnt}>
                {c.quests.length} quest{c.quests.length === 1 ? "" : "s"}
              </span>
              {shown && (
                <span className={styles.qs}>
                  {c.quests.map((q, k) => {
                    const n = first + k;
                    return (
                      <span key={q.edid} className={n < done ? styles.qDone : n === done ? styles.qNext : undefined}>
                        {n < done && <span aria-label="done">✓ </span>}
                        {q.name}
                        {n === done && ": next"}
                      </span>
                    );
                  })}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!all && current !== -1 && current < story.chapters.length - 1 && (
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

/** Opens other stories: each opened line, its needs checked against Where you are. */
export function StoryOpens({ story, mainOrder }: Props) {
  const [where] = useWhere();
  const known = where.level !== null;
  const mark = (ok: boolean | null) => (
    <span className={`${styles.mark} ${ok === true ? styles.yes : ok === false ? styles.no : styles.neutral}`} aria-label={ok === true ? "Done" : ok === false ? "Not yet" : undefined}>
      {ok === true ? "✓" : ok === false ? "✕" : "·"}
    </span>
  );
  return (
    <section className={`frame ${styles.panel} ${styles.sidePanel}`} aria-labelledby="opens-title">
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
              {o.needs.map((n, i) => {
                const ok = !known ? null : n.kind === "level" ? (where.level ?? 0) >= n.level : n.kind === "mainQuest" ? mainDone(where, n.at, mainOrder) : where.finished.includes(n.line);
                return (
                  <li key={i} className={styles.need}>
                    {mark(ok)}
                    <span>{n.text}</span>
                    {n.kind === "level" && known && <span className={styles.why}>You&apos;re {where.level}</span>}
                    {n.checked === "not yet" && <span className={styles.src}>not checked yet{n.why ? `: ${n.why}` : ""}</span>}
                  </li>
                );
              })}
              {o.or && (
                <li className={styles.need}>
                  {mark(true)}
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
