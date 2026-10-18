"use client";

import Link from "next/link";
import { needsOf, openState } from "@/lib/quests/open";
import { useWhere } from "@/lib/quests/where";
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
 * A line's needs as a checklist against Where you are (WO-100), and whether it's open to you. With no
 * level entered the needs are listed without marks.
 */
export function LineNeeds({ gate, after, main }: { gate: LineGate; after: AfterLine[]; main: { edid: string; name: string }[] }) {
  const [where] = useWhere();
  const order = main.map((m) => m.edid);
  const needs = needsOf(gate, where, order);
  const state = openState(gate, where, order);
  const known = where.level !== null;
  const nameOf = (id: string) => after.find((a) => a.id === id)?.name ?? id;
  const mainName = (edid: string) => main.find((m) => m.edid === edid)?.name ?? edid;
  if (!needs.length) return <p className={styles.needsNone}>Nothing needed first: any level can start it.</p>;
  const left: string[] = [];
  return (
    <>
      <ul className={styles.needs} aria-label="Needs">
        {needs.map((n, i) => {
          let label: React.ReactNode;
          let why = "";
          let ok: boolean | null = null;
          if (n.kind === "level") {
            label = `Level ${n.level}`;
            ok = n.ok;
            why = known ? `You're ${where.level}` : "";
            if (!n.ok) left.push(`reach level ${n.level}`);
          } else if (n.kind === "line") {
            ok = n.ok;
            label = ok ? (
              <>{nameOf(n.id)} done</>
            ) : (
              <>
                <Link href={`/quests/${n.id}`}>{nameOf(n.id)}</Link> done
              </>
            );
            why = ok ? "Done" : (after.find((a) => a.id === n.id)?.home ?? "");
            if (!n.ok) left.push(`finish ${nameOf(n.id)}`);
          } else if (n.kind === "main") {
            ok = n.ok;
            label = `The main quest through ${mainName(n.edid)}`;
            why = ok ? "Done" : "";
            if (!n.ok) left.push(`get the main quest through ${mainName(n.edid)}`);
          } else {
            label = "Part of the main quest comes first; how far isn't checked yet.";
          }
          const mark = !known || ok === null ? null : ok;
          return (
            <li key={i} className={styles.need}>
              <span className={`${styles.mark} ${mark === true ? styles.yes : mark === false ? styles.no : styles.neutral}`} aria-label={mark === true ? "Done" : mark === false ? "Not yet" : undefined}>
                {mark === true ? "✓" : mark === false ? "✕" : "·"}
              </span>
              <span>{label}</span>
              {why && <span className={styles.why}>{why}</span>}
            </li>
          );
        })}
      </ul>
      {state === "open" && <p className={`${styles.status} ${styles.statusOpen}`}>Open to you.</p>}
      {state === "locked" && <p className={styles.status}>Not open to you yet. Still to do: {left.join(", ")}.</p>}
      {state === null && <p className={styles.statusQuiet}>Enter your level in Where you are to check these.</p>}
    </>
  );
}

/** Down the side: a Do this first card for each line still to finish. */
export function DoFirst({ gate, after, main }: { gate: LineGate; after: AfterLine[]; main: string[] }) {
  const [where] = useWhere();
  if (where.level === null) return null;
  const missing = needsOf(gate, where, main).filter((n): n is { kind: "line"; id: string; ok: boolean } => n.kind === "line" && !n.ok);
  return (
    <>
      {missing.map((n) => {
        const a = after.find((x) => x.id === n.id);
        if (!a) return null;
        return (
          <section key={a.id} className={`frame ${styles.panel} ${styles.sidePanel}`} aria-labelledby={`first-${a.id}`}>
            <h2 id={`first-${a.id}`} className={styles.sideTitle}>
              Do this first
            </h2>
            <Link href={`/quests/${a.id}`} className={styles.firstName}>
              {a.name}
            </Link>
            <span className="muted">{[a.home, a.where, a.source].filter(Boolean).join(" | ")}</span>
            {a.begins && (a.quoted ? <p className={styles.entry}>“{a.begins}”</p> : <p className={styles.plain}>{a.begins}</p>)}
          </section>
        );
      })}
    </>
  );
}
