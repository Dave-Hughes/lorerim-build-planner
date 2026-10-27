"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page-kit.module.css";

/** The search box at the top of a quest, person, line or place page: it asks the Quests page, which looks in all three. */
export function PageSearch({ placeholder = "Search quests, people, places" }: { placeholder?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      className={styles.search}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/quests?q=${encodeURIComponent(q.trim())}` : "/quests");
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#8e9bab" strokeWidth="1.6" aria-hidden="true">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l4 4" />
      </svg>
      <label style={{ flex: 1, display: "flex", height: "100%" }}>
        <span className="sr-only">Search</span>
        <input type="search" value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} />
      </label>
    </form>
  );
}
