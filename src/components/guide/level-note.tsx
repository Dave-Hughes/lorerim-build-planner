"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { textLength, type GuideDoc } from "@/lib/guide/doc";
import { GuideView } from "./guide-view";
import styles from "./guide-section.module.css";

const COLLAPSED = 200;
/** One line of the level card's note: 17px at line height 1.55 (build-view.module.css). */
const NOTE_LINE = 17 * 1.55;

/**
 * A level's notes; over ~200px they collapse with "Read more". With `lines` (the level card, WO-29),
 * a note over about 600 characters is clamped to that many lines instead.
 */
export function LevelNote({ doc, level, lines }: { doc: GuideDoc; level: number; lines?: number }) {
  const body = useRef<HTMLDivElement>(null);
  const [measuredLong, setLong] = useState(false);
  const [open, setOpen] = useState(false);
  const long = lines ? textLength(doc) > 600 : measuredLong;
  useLayoutEffect(() => {
    const el = body.current;
    if (!el || lines) return;
    const measure = () => setLong(el.scrollHeight > COLLAPSED + 60);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lines]);
  const collapsed = long && !open;
  return (
    <section aria-label={`Notes for level ${level}`} className={styles.levelNote}>
      <div ref={body} className={`${styles.body} ${collapsed ? styles.collapsed : ""}`} style={collapsed ? { maxHeight: lines ? Math.round(lines * NOTE_LINE) : COLLAPSED } : undefined}>
        <GuideView doc={doc} idPrefix={`level-${level}`} />
        {collapsed && <div className={`${styles.fade} ${styles.fadePanel}`} aria-hidden="true" />}
      </div>
      {collapsed && (
        <button type="button" className={`btn btn-sm ${styles.more}`} onClick={() => setOpen(true)}>
          Read more
        </button>
      )}
    </section>
  );
}
