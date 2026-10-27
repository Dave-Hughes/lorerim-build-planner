"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { cleanTitle, pathnameOf, readTrail, writeTrail } from "@/lib/trail/trail";

/** Event the trail fires when it changes, for the back buttons to read it again. */
export const TRAIL_EVENT = "planner-trail";

let started = false;
let stepped = false;

/**
 * Keeps the trail of pages (src/lib/trail/trail.ts): one stop for each page the visitor opens in this tab, its title filled in once the
 * page has set it. Stepping back with the browser trims the trail to that page; opening the site from elsewhere starts it over.
 */
export function NavTrail() {
  const path = usePathname();
  const search = useSearchParams().toString();
  const here = search ? `${path}?${search}` : path;

  useEffect(() => {
    if (started) return;
    started = true;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    let outside = true;
    try {
      outside = !document.referrer || new URL(document.referrer).origin !== location.origin;
    } catch {
      // An odd referrer counts as outside.
    }
    if (nav?.type === "navigate" && outside) writeTrail([]);
    const pop = () => {
      stepped = true;
    };
    window.addEventListener("popstate", pop);
  }, []);

  useEffect(() => {
    let trail = readTrail();
    const top = trail.at(-1);
    if (!top || top.path !== here) {
      if (stepped) {
        const at = trail.map((s) => s.path).lastIndexOf(here);
        trail = at >= 0 ? trail.slice(0, at + 1) : [...trail, { path: here, title: "" }];
      } else {
        trail = [...trail, { path: here, title: "" }];
      }
    }
    stepped = false;
    const sync = () => {
      const now = readTrail();
      const last = now.at(-1);
      if (!last || pathnameOf(last.path) !== pathnameOf(here)) return;
      const title = cleanTitle(document.title);
      if (last.title !== title) {
        last.title = title;
        writeTrail(now);
        window.dispatchEvent(new Event(TRAIL_EVENT));
      }
    };
    writeTrail(trail);
    window.dispatchEvent(new Event(TRAIL_EVENT));
    const timers = [setTimeout(sync, 0), setTimeout(sync, 200), setTimeout(sync, 800)];
    const watch = new MutationObserver(sync);
    watch.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      timers.forEach(clearTimeout);
      watch.disconnect();
    };
  }, [here]);

  return null;
}
