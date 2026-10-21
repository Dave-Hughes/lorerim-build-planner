"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { setQuestReport } from "@/lib/quests/report-actions";
import styles from "./import-build.module.css";

export interface QuestReportRow {
  id: number;
  lineId: string;
  lineName: string;
  questName: string | null;
  what: string;
  text: string;
  said: string;
  source: "site" | "assistant";
  client: string | null;
  status: string;
  createdAt: string;
  name: string | null;
  handle: string | null;
}

const STATUSES = ["new", "fixed", "not a problem"];
const when = (iso: string) => iso.slice(0, 16).replace("T", " ") + " UTC";

function Status({ id, status }: { id: number; status: string }) {
  const [value, setValue] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <label className={styles.file}>
      <span className="sub-label">Status</span>
      <select
        className="select"
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          start(async () => {
            const r = await setQuestReport(id, next);
            setError(r.ok ? null : r.error);
          });
        }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

/**
 * Quest reports (WO-103, WO-121a Part 5): newest first, the line linking to its page, what, the player's words, who
 * sent it and from where (the page, or an assistant with what the planner had said), and a status per report.
 */
export function QuestReports({ reports }: { reports: QuestReportRow[] }) {
  return (
    <section aria-labelledby="quest-reports-title" className={styles.section}>
      <h2 id="quest-reports-title" className="title">
        Quest reports
      </h2>
      {reports.length === 0 && <p className="muted">No reports yet.</p>}
      <ol className={styles.reports} aria-label="Quest reports, newest first">
        {reports.map((r) => (
          <li key={r.id}>
            <div className={styles.reportHead}>
              <Link href={`/quests/${r.lineId}`}>{r.lineName}</Link>
              {r.questName && <span className="muted">{r.questName}</span>}
              <span className="label">{r.what}</span>
            </div>
            <p className={styles.reportBy}>
              {r.name ?? "A player"}
              {r.handle && <span className="muted"> @{r.handle}</span>} | {r.source === "assistant" ? `Through ${r.client ?? "an assistant"}` : "On the quest page"} | <span className="muted">{when(r.createdAt)}</span>
            </p>
            {r.said && (
              <p>
                <span className="sub-label">The planner said</span> {r.said}
              </p>
            )}
            <p>
              <span className="sub-label">{r.source === "assistant" ? "They saw" : "What happened"}</span> {r.text}
            </p>
            <Status id={r.id} status={r.status} />
          </li>
        ))}
      </ol>
    </section>
  );
}
