import Link from "next/link";
import styles from "./quests.module.css";

/**
 * A quest's row on its line's page (WO-154): its name, what it is in one line, where it takes you and how dangerous, what it
 * needs that the quest before didn't, and what it pays. Its page has the rest; the journal and its endings are there as steps.
 */
export function QuestRow({ edid, name, xp, first, href, summary, places, needs }: { edid: string; name: string; xp: number; first: boolean; href?: string | null; summary?: string | null; places?: string[]; needs?: string[] }) {
  return (
    <li className={styles.q} id={`q-${edid}`}>
      <span className={styles.qn}>
        {href ? <Link href={href}>{name}</Link> : name}
        {first && <span className={styles.first}>Starts here</span>}
        {summary && <span className={styles.qhow}>{summary}</span>}
        {places && places.length > 0 && <span className={styles.qhow}>Takes you to {places.join("; ")}</span>}
        {needs && needs.length > 0 && <span className={styles.qhow}>Needs {needs.join("; ")}</span>}
      </span>
      <span className={`${styles.xp} ${xp ? "" : styles.zero}`}>{xp ? `${xp} XP` : "No XP"}</span>
    </li>
  );
}
