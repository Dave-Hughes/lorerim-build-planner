"use client";

import { openState } from "@/lib/quests/open";
import { useWhere } from "@/lib/quests/where";
import type { LineGate } from "@/lib/quests/types";
import styles from "./quests.module.css";

/** "16 open to you of 20 quest lines", or just "20 quest lines" until a level is entered. */
export function OpenCount({ gates, main }: { gates: LineGate[]; main: string[] }) {
  const [where] = useWhere();
  const n = gates.length;
  const lines = `${n} quest line${n === 1 ? "" : "s"}`;
  if (where.level === null) return <span className={styles.count}>{lines}</span>;
  const open = gates.filter((g) => openState(g, where, main) === "open").length;
  return (
    <span className={styles.count}>
      <span className={styles.open}>{open} open to you</span> of {lines}
    </span>
  );
}
