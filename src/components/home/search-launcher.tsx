"use client";

import { OPEN_SEARCH } from "@/components/search/search-palette";
import { ShortcutHint } from "@/components/search/shortcut-hint";
import styles from "./home.module.css";

/** The home page's big search box: a button that opens the command palette. */
export function SearchLauncher() {
  return (
    <button type="button" className={styles.find} onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH))} aria-label="Search the site">
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l4 4" />
      </svg>
      <span>Search quests, people, places and characters</span>
      <ShortcutHint className={styles.kbd} />
    </button>
  );
}
