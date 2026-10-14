"use client";

import { useEffect } from "react";

/**
 * A link to a question opens it (WO-66): on load and when the address's #id changes, the
 * <details> with that id (or holding it) opens and comes into view. Without scripts the pages
 * still read in full; the question just starts closed.
 */
export function OpenFromHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      // The FAQ's ids (old links, redirected here) are the ends of the guide's longer questions:
      // #why-cant-i-fast-travel opens "I learned Apparition. Why can't I fast travel?".
      const el = document.getElementById(id) ?? document.querySelector<HTMLElement>(`details[id$="-${CSS.escape(id)}"]`);
      if (!el) return;
      const details = el instanceof HTMLDetailsElement ? el : el.closest("details");
      if (details && !details.open) details.open = true;
      requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
