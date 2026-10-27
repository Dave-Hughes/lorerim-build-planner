"use client";

import { useEffect, useRef, useState } from "react";
import { SearchBox } from "./search-box";
import { ShortcutHint } from "./shortcut-hint";
import styles from "./search.module.css";

/** The event a page's own search box fires to open the palette. */
export const OPEN_SEARCH = "open-search";

/**
 * The command palette (WO-154 Part 4): Cmd or Ctrl and K, or the header's Search button, opens one box that finds quests, people, places,
 * builds and guide sections, with the arrow keys and Enter. Esc closes it. On a phone it fills the screen (WO-157).
 */
export function SearchPalette() {
  const dialog = useRef<HTMLDialogElement>(null);
  // The box starts empty each time the palette opens.
  const [round, setRound] = useState(0);
  const open = () => {
    if (!dialog.current?.open) dialog.current?.showModal();
  };
  useEffect(() => {
    // Anything on the page can ask for it: the home page's search box.
    window.addEventListener(OPEN_SEARCH, open);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener(OPEN_SEARCH, open);
      window.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <>
      <button type="button" className={styles.trigger} onClick={open} aria-label="Search the site" aria-keyshortcuts="Control+K Meta+K">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l4 4" />
        </svg>
        <span className={styles.triggerWord}>Search</span>
        <ShortcutHint className={styles.kbd} />
      </button>
      <dialog ref={dialog} className={`frame ${styles.palette}`} aria-label="Search the site" onClose={() => setRound((n) => n + 1)} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <SearchBox key={round} all autoFocus placeholder="Search quests, people, places, builds, the guide" onGo={() => dialog.current?.close()} />
        <p className={styles.hint}>Arrow keys to move, Enter to open, Esc to close.</p>
      </dialog>
    </>
  );
}
