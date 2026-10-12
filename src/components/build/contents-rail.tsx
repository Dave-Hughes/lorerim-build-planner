"use client";

import { useEffect, useState } from "react";
import { pageZoom } from "@/lib/zoom";
import styles from "./contents-rail.module.css";

export interface RailItem {
  key: string;
  label: string;
  count?: number;
  /** A tree under Perks: indented, smaller. */
  sub?: boolean;
  /** Destiny's gold. */
  destiny?: boolean;
  /** The id of the section it scrolls to. */
  target?: string;
  /** Done first: open a tree, unfold Destiny, switch tabs. */
  onGo?: () => void;
  /** Shown as chosen without being the section in view (the open tree). */
  marked?: boolean;
}

/** Below the pinned bar: a section is "in view" once its top passes this line (page pixels). */
const LINE = 96;

/**
 * The contents rail on wide screens (WO-35): the page's sections, the one in view marked in ember
 * with a bar and aria-current. A click scrolls to the section, below the pinned bar; trees open
 * their tree, Destiny unfolds. Hidden under 1600 wide (CSS), where nothing else changes.
 */
export function ContentsRail({ items }: { items: RailItem[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const targets = items.filter((i) => i.target && !i.sub).map((i) => `${i.key}|${i.target}`).join(",");
  useEffect(() => {
    const list = targets ? targets.split(",").map((t) => t.split("|") as [string, string]) : [];
    let frame = 0;
    const check = () => {
      frame = 0;
      const sticky = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sticky-top")) || 0;
      const line = (LINE + sticky) * pageZoom();
      let found: string | null = null;
      for (const [key, id] of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line + 1) found = key;
      }
      // At the foot of the page the last sections can't reach the line: the lowest one in view counts.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        for (const [key, id] of list) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < window.innerHeight) found = key;
        }
      }
      setCurrent(found ?? list[0]?.[0] ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targets]);

  const go = (item: RailItem) => {
    item.onGo?.();
    if (!item.target) return;
    // After the section has opened (a tree, Destiny) or the tab has switched.
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(item.target!)?.scrollIntoView({ block: "start" })));
  };

  return (
    <nav aria-label="On this page" className={styles.rail}>
      {items.map((item) => {
        const on = !item.sub && current === item.key;
        return (
          <a
            key={item.key}
            href={item.target ? `#${item.target}` : "#"}
            className={`${styles.item} ${item.sub ? styles.sub : ""} ${item.destiny ? styles.destiny : ""} ${on ? styles.on : ""} ${item.marked ? styles.marked : ""}`}
            aria-current={on ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              go(item);
            }}
          >
            <span>{item.label}</span>
            {item.count !== undefined && <span className={styles.count}>{item.count}</span>}
          </a>
        );
      })}
    </nav>
  );
}
