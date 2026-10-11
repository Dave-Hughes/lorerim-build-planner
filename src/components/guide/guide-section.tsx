"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GuideDoc } from "@/lib/guide/doc";
import { GuideView, guideHeadings } from "./guide-view";
import styles from "./guide-section.module.css";

const COLLAPSED = 600;

/**
 * The build's guide on the shared build page: a contents list when there are three or more
 * H2s, and long guides shown to ~600px with "Read the guide" (remembered for the session).
 */
export function GuideSection({ buildId, doc, full }: { buildId: string; doc: GuideDoc; /** All of it, never collapsed (the Guide tab). */ full?: boolean }) {
  const headings = guideHeadings(doc);
  const body = useRef<HTMLDivElement>(null);
  const storageKey = `lorerim-guide-open:${buildId}`;
  const [long, setLong] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      // Read once on load: the page is server-rendered, so session storage isn't known until here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (window.sessionStorage.getItem(storageKey) === "1") setOpen(true);
    } catch {
      // No session storage: starts closed.
    }
  }, [storageKey]);

  useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setLong(el.scrollHeight > COLLAPSED + 120);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const expand = () => {
    setOpen(true);
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Remembered for this page view only.
    }
  };
  const collapsed = long && !open && !full;

  return (
    <section aria-label="Guide" className={styles.section}>
      <span className="label">Guide</span>
      {headings.length >= 3 && (
        <nav aria-label="Contents" className={styles.contents}>
          <ol>
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} onClick={expand}>
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div ref={body} className={`${styles.body} ${collapsed ? styles.collapsed : ""}`} style={collapsed ? { maxHeight: COLLAPSED } : undefined}>
        <GuideView doc={doc} />
        {collapsed && <div className={styles.fade} aria-hidden="true" />}
      </div>
      {collapsed && (
        <button type="button" className={`btn ${styles.more}`} onClick={expand}>
          Read the guide
        </button>
      )}
    </section>
  );
}
