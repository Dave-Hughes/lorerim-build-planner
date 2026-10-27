"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./recent.module.css";

/**
 * The strip of recent characters (WO-157 Part 10). The cards are on the page from the start; once it is mounted and not yet in view they wait, and
 * the first time the strip comes into view they rise in one after another. Without JavaScript, or with it already on screen, nothing waits.
 */
export function RecentStrip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rise, setRise] = useState<"idle" | "armed" | "go">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) {
      setRise("go");
      return;
    }
    setRise("armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRise("go");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={styles.strip} data-rise={rise}>
      {children}
    </div>
  );
}
