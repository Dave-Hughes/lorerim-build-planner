"use client";

import { useEffect, useState } from "react";
import { STORY } from "@/lib/coming-soon/art";
import styles from "./coming-soon.module.css";

/** Letters typed a second, and how long a finished line stays before the next scene. */
const TYPE_MS = 32;
const HOLD_MS = 3400;

/**
 * "How this started" as a little cutscene (Dave, 15 Oct): one scene at a time at a whole multiple
 * of its 160 by 100 pixels, Tapps's line typing out in a dialogue box under it, and a level marker
 * for each scene. It moves on by itself until someone picks a scene. With reduced motion nothing
 * types or moves on; the markers still work. The whole story is also in the page as plain text.
 */
export function Cutscene({ frame, still }: { frame: number; still: boolean }) {
  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState(0);
  const [auto, setAuto] = useState(true);
  const line = STORY[scene].text;
  const shown = still ? line.length : typed;

  // Type the line out, then (while auto) move to the next scene.
  useEffect(() => {
    if (still) return;
    if (typed < line.length) {
      const t = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
      return () => window.clearTimeout(t);
    }
    if (!auto) return;
    const t = window.setTimeout(() => {
      setScene((s) => (s + 1) % STORY.length);
      setTyped(0);
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [typed, line, auto, still]);

  const pick = (i: number) => {
    setAuto(false);
    setScene(i);
    setTyped(0);
  };
  const s = STORY[scene];

  return (
    <div className={styles.cutscene}>
      <div className={`frame ${styles.stage}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.pix}
          src={s.frames[(still ? 0 : frame) % s.frames.length]}
          alt={s.alt}
          width={160}
          height={100}
        />
      </div>
      <div className={styles.dialog} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${styles.pix} ${styles.dialogFace}`}
          src="/icons/tapps.svg"
          alt=""
          width={24}
          height={24}
        />
        <div className={styles.dialogWords}>
          <span className={styles.dialogLabel}>Tapps</span>
          <p className={styles.dialogLine} data-testid="story-line">
            {line.slice(0, shown)}
            <span className={styles.dialogRest}>{line.slice(shown)}</span>
            {shown >= line.length && !still && (
              <span className={styles.dialogMore}>▼</span>
            )}
          </p>
        </div>
      </div>
      <ol className={styles.steps}>
        {STORY.map((p, i) => (
          <li key={p.label}>
            <button
              type="button"
              className={styles.step}
              aria-pressed={i === scene}
              onClick={() => pick(i)}
            >
              <span className={styles.stepMark} aria-hidden="true" />
              {p.label}
            </button>
          </li>
        ))}
      </ol>
      {/* The story in full, for screen readers and search. */}
      <ol className="sr-only">
        {STORY.map((p) => (
          <li key={p.label}>
            {p.label}: {p.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
