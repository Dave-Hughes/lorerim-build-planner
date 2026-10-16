"use client";

import { useEffect, useRef, useState } from "react";
import { STORY } from "@/lib/coming-soon/art";
import styles from "./coming-soon.module.css";

/** How fast a line types out. */
const TYPE_MS = 32;

/**
 * "How this started" as a little cutscene that the page's scroll drives (Dave, 15 Oct). The section is
 * tall and the cutscene stays pinned in the middle of the screen while it passes: each quarter of the
 * scroll is a scene. Each scene is a whole multiple of its 160 by 100 pixels, with Tapps's line typing
 * out in a dialogue box under it and a level marker for each scene (a click scrolls to it). With
 * reduced motion the lines appear whole. The whole story is also in the page as plain text.
 */
export function Cutscene({ frame, still }: { frame: number; still: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState(0);
  const [progress, setProgress] = useState(0);
  const line = STORY[scene].text;
  const shown = still ? line.length : typed;

  // The scene follows the scroll through the track.
  useEffect(() => {
    let raf = 0;
    const place = () => {
      raf = 0;
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      setProgress(p);
      const next = Math.min(STORY.length - 1, Math.floor(p * STORY.length));
      setScene((s) => {
        if (s !== next) setTyped(0);
        return next;
      });
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Type the line out.
  useEffect(() => {
    if (still || typed >= line.length) return;
    const t = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
    return () => window.clearTimeout(t);
  }, [typed, line, still]);

  // A marker scrolls to the middle of its scene's stretch of the track.
  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const top = window.scrollY + r.top + ((i + 0.5) / STORY.length) * span;
    window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  };
  const s = STORY[scene];

  return (
    <div ref={track} className={styles.track}>
      <div className={styles.pinned}>
        <div className={styles.cutscene}>
          <h2 id="story-title" className={styles.h2}>
            How this started
          </h2>
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
              </p>
            </div>
          </div>
          {/* The line between the markers fills as the page scrolls, so it's clear the scroll tells the story. */}
          <ol
            className={styles.steps}
            style={
              {
                "--fill": Math.min(
                  1,
                  (progress * STORY.length) / (STORY.length - 1),
                ),
              } as React.CSSProperties
            }
          >
            {STORY.map((p, i) => (
              <li key={p.label}>
                <button
                  type="button"
                  className={styles.step}
                  aria-pressed={i === scene}
                  data-passed={i < scene || undefined}
                  onClick={() => go(i)}
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
      </div>
    </div>
  );
}
