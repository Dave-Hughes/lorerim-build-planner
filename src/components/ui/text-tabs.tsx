"use client";

import { useRef, useState } from "react";
import styles from "./text-tabs.module.css";

export interface TextTab {
  key: string;
  name: string;
  /** The second line: what's in it. */
  sub?: string;
  panel: React.ReactNode;
}

/**
 * Open-text tabs on one rule, the open one in white over an ember underline (the build page's
 * tabs). Arrow keys move between them; `?tab=<key>` keeps the open one in the address.
 */
export function TextTabs({ label, tabs, initial }: { label: string; tabs: TextTab[]; initial?: string }) {
  const [open, setOpen] = useState(() => (tabs.some((t) => t.key === initial) ? initial! : tabs[0].key));
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const choose = (key: string) => {
    setOpen(key);
    const url = new URL(window.location.href);
    if (key === tabs[0].key) url.searchParams.delete("tab");
    else url.searchParams.set("tab", key);
    window.history.replaceState(null, "", url);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.key === open);
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = tabs[(i + step + tabs.length) % tabs.length].key;
    choose(next);
    refs.current[next]?.focus();
  };
  return (
    <>
      <div role="tablist" aria-label={label} className={styles.tabs} onKeyDown={onKey}>
        {tabs.map((t) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[t.key] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={open === t.key}
            aria-controls={`panel-${t.key}`}
            tabIndex={open === t.key ? 0 : -1}
            className={styles.tab}
            onClick={() => choose(t.key)}
          >
            <span className={styles.tabName}>{t.name}</span>
            {t.sub && <span className={styles.tabSub}>{t.sub}</span>}
          </button>
        ))}
      </div>
      {tabs.map((t) =>
        t.key === open ? (
          <div key={t.key} id={`panel-${t.key}`} role="tabpanel" aria-labelledby={`tab-${t.key}`}>
            {t.panel}
          </div>
        ) : null,
      )}
    </>
  );
}
