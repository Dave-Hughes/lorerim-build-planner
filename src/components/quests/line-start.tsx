import Link from "next/link";
import { NOWHERE, needsOf } from "@/lib/quests/open";
import type { LineGate } from "@/lib/quests/types";
import styles from "./quests.module.css";

export interface AfterLine {
  id: string;
  name: string;
  home: string;
  where: string | null;
  source: string;
  begins: string | null;
  quoted: boolean;
}

/**
 * A line's needs, as facts (WO-100; WO-115, 20 Oct: the Quests pages carry no player context, so no
 * marks against where you are): its level, the lines that come first, and the main quest.
 */
export function LineNeeds({ gate, after, main }: { gate: LineGate; after: AfterLine[]; main: { edid: string; name: string }[] }) {
  const needs = needsOf(gate, NOWHERE, main.map((m) => m.edid));
  const nameOf = (id: string) => after.find((a) => a.id === id)?.name ?? id;
  const mainName = (edid: string) => main.find((m) => m.edid === edid)?.name ?? edid;
  if (!needs.length) return <p className={styles.needsNone}>Nothing needed first: any level can start it.</p>;
  return (
    <ul className={styles.needs} aria-label="Needs">
      {needs.map((n, i) => (
        <li key={i} className={styles.need}>
          <span className={`${styles.mark} ${styles.neutral}`}>·</span>
          <span>
            {n.kind === "level" ? (
              `Level ${n.level}`
            ) : n.kind === "line" ? (
              <>
                <Link href={`/quests/${n.id}`}>{nameOf(n.id)}</Link> done
              </>
            ) : n.kind === "main" ? (
              `The main quest through ${mainName(n.edid)}`
            ) : (
              "Part of the main quest comes first; how far isn't checked yet."
            )}
          </span>
          {n.kind === "line" && <span className={styles.why}>{after.find((a) => a.id === n.id)?.home ?? ""}</span>}
        </li>
      ))}
    </ul>
  );
}
