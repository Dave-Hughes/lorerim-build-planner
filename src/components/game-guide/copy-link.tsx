"use client";

import { useState } from "react";
import styles from "./guide.module.css";

/** A section's or question's own link (WO-63, WO-66): shown on hover or focus; copies the full URL and says "Copied" for 2s. */
export function CopyLink({ id, label }: { id: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    // Inside a question's summary: copying never opens or closes it.
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(new URL(`#${id}`, window.location.href.split("#")[0]).toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard: the link still works from the address bar.
    }
  };
  return (
    <button type="button" className={`${styles.link} ${copied ? styles.linkCopied : ""}`} aria-label={`Copy a link to: ${label}`} onClick={(e) => void copy(e)}>
      {copied ? (
        <span className={styles.copied}>Copied</span>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
          {/* Two square chain links, in pixels like the planner's icons. */}
          <path d="M1 5h6v2H3v2h4v2H1zM9 5h6v6H9V9h4V7H9zM5 7h6v2H5z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
