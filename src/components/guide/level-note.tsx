"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { GuideDoc } from "@/lib/guide/doc";
import { GuideView } from "./guide-view";
import styles from "./guide-section.module.css";

const COLLAPSED = 200;

/** A level's notes in the "At level N" panel; over ~200px they collapse with "Read more". */
export function LevelNote({ doc, level }: { doc: GuideDoc; level: number }) {
  const body = useRef<HTMLDivElement>(null);
  const [long, setLong] = useState(false);
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setLong(el.scrollHeight > COLLAPSED + 60);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const collapsed = long && !open;
  return (
    <section aria-label={`Notes for level ${level}`} className={styles.levelNote}>
      <div ref={body} className={`${styles.body} ${collapsed ? styles.collapsed : ""}`} style={collapsed ? { maxHeight: COLLAPSED } : undefined}>
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
