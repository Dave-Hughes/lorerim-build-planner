"use client";

import { useEffect, useState } from "react";
import { checkedLabel } from "@/lib/quests/story";
import type { QuestEnding, QuestStart } from "@/lib/quests/types";
import styles from "./quests.module.css";

/**
 * A quest's journal (WO-100): hidden until opened, then the first entry, then the rest on request,
 * then How it starts and How it can end (WO-115 Part 5), each closed until asked for and marked
 * checked or not. A link to #q-<edid> (a story's next step, WO-106) or #end-<edid> opens the row; How
 * it can end stays closed either way.
 */
export function QuestRow({ edid, name, xp, first, journal, endings, start }: { edid: string; name: string; xp: number; first: boolean; journal: string[]; endings: QuestEnding[]; start?: QuestStart }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      if (window.location.hash === `#q-${edid}` || window.location.hash === `#end-${edid}`) setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [edid]);
  const [all, setAll] = useState(false);
  const shown = all ? journal : journal.slice(0, 1);
  return (
    <li className={styles.q} id={`q-${edid}`}>
      <span className={styles.qn}>
        {name}
        {first && <span className={styles.first}>Starts here</span>}
      </span>
      <span className={`${styles.xp} ${xp ? "" : styles.zero}`}>{xp ? `${xp} XP` : "No XP"}</span>
      <span className={styles.j}>
        {(journal.length > 0 || start) && (
          <button type="button" className={styles.link} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? "Hide journal" : "Journal ›"}
          </button>
        )}
      </span>
      {open && (
        <span className={styles.qopen}>
          {shown.map((t, i) => (
            <p key={i} className={styles.entry}>
              “{t}”
            </p>
          ))}
          {!all && journal.length > 1 && (
            <span className={styles.next}>
              <button type="button" className="btn btn-sm" onClick={() => setAll(true)}>
                Show the next {journal.length - 1} {journal.length === 2 ? "entry" : "entries"}
              </button>
              <span className="muted">These give the story away</span>
            </span>
          )}
          {start && <Starts start={start} />}
          <Endings edid={edid} endings={endings} />
        </span>
      )}
    </li>
  );
}

/**
 * How it starts (WO-115 Part 5, on WO-121): each way in as the start check words it (who to ask and
 * what, and where), then the first step and where it is. No who above the ways: for a quest with many
 * ways in, one name would be a guess.
 */
function Starts({ start }: { start: QuestStart }) {
  return (
    <details className={styles.ends}>
      <summary>How it starts</summary>
      {start.checked !== "files" ? (
        <p className="muted">Its start isn&apos;t checked yet.</p>
      ) : (
        <>
          {start.ways?.length ? (
            <ul className={styles.waysList}>
              {start.ways.map((w, i) => (
                <li key={i}>
                  {w.how}
                  {w.needs?.length ? <span className="muted"> ({w.needs.join("; ")})</span> : null}
                </li>
              ))}
            </ul>
          ) : (
            !start.needs?.length && <p className="muted">It runs from the start of the game.</p>
          )}
          {start.then && (
            <p className={styles.soft}>
              Then: {start.then}
              {start.thenWhere ? ` at ${start.thenWhere}` : ""}
            </p>
          )}
          <span className={styles.src}>{checkedLabel(start.checked)}</span>
        </>
      )}
    </details>
  );
}

/** How it can end: each ending's journal line, with when it shows and whether it fails the quest in muted text. */
function Endings({ edid, endings }: { edid: string; endings: QuestEnding[] }) {
  const told = endings.filter((e) => e.text);
  return (
    <details className={styles.ends} id={`end-${edid}`}>
      <summary>How it can end</summary>
      {told.length ? (
        told.map((e, i) => (
          <p key={i} className={styles.ending}>
            <span className={styles.entry}>“{e.text}”</span>
            {(e.fails || e.when) && <span className="muted">{[e.fails && "Fails the quest", e.when && `When ${e.when}`].filter(Boolean).join(" | ")}</span>}
          </p>
        ))
      ) : (
        <p className="muted">{endings.length ? "Its records end it without a journal line." : "Its records don't list an ending."}</p>
      )}
    </details>
  );
}
