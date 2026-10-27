"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { previousStop, readTrail } from "@/lib/trail/trail";
import { TRAIL_EVENT } from "./nav-trail";
import styles from "./page-kit.module.css";

/**
 * The way back on a quest, line, person or place page (WO-159 Part 3). Opened from a page on this site, it goes back to that page and
 * names it ("Back to The Golden Claw"); opened from outside (a shared link, a search engine), it goes to the page's home in the World and
 * names that. `home` is that home, which is also what the server renders.
 */
export function BackButton({ home }: { home: { href: string; label: string } }) {
  const [from, setFrom] = useState<{ href: string; label: string } | null>(null);
  useEffect(() => {
    const read = () => {
      const stop = previousStop(readTrail(), location.pathname);
      setFrom(stop && stop.title ? { href: stop.path, label: stop.title } : null);
    };
    read();
    window.addEventListener(TRAIL_EVENT, read);
    return () => window.removeEventListener(TRAIL_EVENT, read);
  }, []);
  const to = from ?? home;
  return (
    <Link href={to.href} className={styles.backButton}>
      <span className={styles.backArrow} aria-hidden="true" />
      Back to {to.label}
    </Link>
  );
}
