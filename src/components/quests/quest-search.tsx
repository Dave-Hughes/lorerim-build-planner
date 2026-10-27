"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./quests.module.css";

/** Search quests (WO-100): line names, quest names and the journals' words. Results go to the line. */
export function QuestSearch({ initial }: { initial: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  return (
    <form
      role="search"
      className={styles.search}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/quests?q=${encodeURIComponent(q.trim())}` : "/quests");
      }}
    >
      <label className="field">
        <span className="sr-only">Search quests</span>
        <input className="input" type="search" value={q} placeholder="Search quests, people, places" onChange={(e) => setQ(e.target.value)} />
      </label>
    </form>
  );
}
