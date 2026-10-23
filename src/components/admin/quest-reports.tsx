"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { approveQuestFact, dismissQuestFact, proposeQuestFact, proposeQuestFacts, setQuestReport } from "@/lib/quests/report-actions";
import type { Decision, Proposal, ReportFields, ReportKind } from "@/lib/quests/player-types";
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
  /** WO-146: what it is, what the player filled in, what the agent proposed, what was decided, and the quest's page now. */
  kind: ReportKind;
  fields: ReportFields | null;
  proposal: Proposal | null;
  decision: Decision | null;
  onThePage: string[];
  ways: string[];
}

const KIND: Record<ReportKind, string> = { wrong: "Something's wrong", how: "How it starts", where: "Where it is" };
const FIELD: Record<keyof ReportFields, string> = { who: "Who", where: "Where", how: "What they did", place: "The place" };

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

/** Propose, Approve, Edit and approve and Not a problem on one report (WO-146): an admin's, and the only way a fact reaches a page. */
function Decide({ r, router }: { r: QuestReportRow; router: ReturnType<typeof useRouter> }) {
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const p = r.proposal;
  const [how, setHow] = useState(p?.way?.how ?? "");
  const [who, setWho] = useState(p?.way?.who ?? "");
  const [where, setWhere] = useState(p?.way?.where ?? "");
  const [whereIs, setWhereIs] = useState((p?.way?.whereIs ?? []).join("; "));
  const [replaces, setReplaces] = useState(p?.replaces ?? "");
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const res = await fn();
      if (res.ok) {
        setError(null);
        setEditing(false);
        router.refresh();
      } else setError(res.error ?? "That didn't work.");
    });
  if (r.decision) return <p className={styles.decided}>{r.decision.outcome[0].toUpperCase() + r.decision.outcome.slice(1)}, {when(r.decision.at)}.</p>;
  return (
    <>
      {!p && (
        <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(async () => proposeQuestFact(r.id))}>
          {pending ? "Proposing…" : "Propose"}
        </button>
      )}
      {p && (
        <div className={styles.proposal}>
          <p>
            <span className="sub-label">Proposed</span> {p.words}
          </p>
          <p>
            <span className="sub-label">Against the records</span> {p.fits}, {p.confidence} confidence. {p.why}
          </p>
          {p.replaces && (
            <p>
              <span className="sub-label">Replaces</span> {p.replaces}
            </p>
          )}
          <p className="muted">
            {p.model}, {when(p.at)}
          </p>
        </div>
      )}
      {editing && (
        <div className={styles.editForm}>
          <label className="field">
            <span className="sub-label">Way in, as the page says it</span>
            <input className="input" value={how} maxLength={400} onChange={(e) => setHow(e.target.value)} />
          </label>
          <label className="field">
            <span className="sub-label">Who</span>
            <input className="input" value={who} maxLength={120} onChange={(e) => setWho(e.target.value)} />
          </label>
          <label className="field">
            <span className="sub-label">Where</span>
            <input className="input" value={where} maxLength={200} onChange={(e) => setWhere(e.target.value)} />
          </label>
          <label className="field">
            <span className="sub-label">Places for a thing to read, separated by semicolons</span>
            <input className="input" value={whereIs} maxLength={600} onChange={(e) => setWhereIs(e.target.value)} />
          </label>
          <label className="field">
            <span className="sub-label">Replaces</span>
            <select className="select" value={replaces} onChange={(e) => setReplaces(e.target.value)}>
              <option value="">A new way</option>
              {r.ways.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <span className={styles.decide}>
        {p?.way && !editing && (
          <button type="button" className="btn btn-sm btn-primary" disabled={pending} onClick={() => run(async () => approveQuestFact(r.id))}>
            Approve
          </button>
        )}
        {!editing ? (
          <button type="button" className="btn btn-sm" disabled={pending} onClick={() => setEditing(true)}>
            Edit and approve
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              disabled={pending}
              onClick={() => run(async () => approveQuestFact(r.id, { how, who: who || undefined, where: where || undefined, whereIs: whereIs.split(";").map((x) => x.trim()).filter(Boolean), replaces: replaces || null }))}
            >
              Save and approve
            </button>
            <button type="button" className="btn btn-sm btn-quiet" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        )}
        <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(async () => dismissQuestFact(r.id))}>
          Not a problem
        </button>
      </span>
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}

/** Propose on every new how or where report without a proposal (WO-146 Part 2's batch step). */
function ProposeAll({ router }: { router: ReturnType<typeof useRouter> }) {
  const [said, setSaid] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <span className={styles.decide}>
      <button
        type="button"
        className="btn btn-sm"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await proposeQuestFacts();
            setSaid(r.ok ? (r.results.length ? `${r.results.filter((x) => x.ok).length} of ${r.results.length} proposed.${r.results.some((x) => !x.ok) ? ` ${r.results.find((x) => !x.ok)!.message}` : ""}` : "Nothing new to propose.") : r.error);
            router.refresh();
          })
        }
      >
        {pending ? "Proposing…" : "Propose on new reports"}
      </button>
      {said && <span role="status">{said}</span>}
    </span>
  );
}

/**
 * Quest reports (WO-103, WO-121a Part 5): newest first, the line linking to its page, what, the player's words, who
 * sent it and from where (the page, or an assistant with what the planner had said), and a status per report.
 */
export function QuestReports({ reports }: { reports: QuestReportRow[] }) {
  const router = useRouter();
  return (
    <section aria-labelledby="quest-reports-title" className={styles.section}>
      <h2 id="quest-reports-title" className="title">
        Quest reports
      </h2>
      {reports.length === 0 && <p className="muted">No reports yet.</p>}
      {reports.some((r) => r.kind !== "wrong" && !r.proposal && !r.decision) && <ProposeAll router={router} />}
      <ol className={styles.reports} aria-label="Quest reports, newest first">
        {reports.map((r) => (
          <li key={r.id}>
            <div className={styles.reportHead}>
              <Link href={`/quests/${r.lineId}`}>{r.lineName}</Link>
              {r.questName && <span className="muted">{r.questName}</span>}
              <span className="label">{r.kind === "wrong" ? r.what : KIND[r.kind]}</span>
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
            {r.fields && Object.keys(r.fields).length > 0 && (
              <ul className={styles.fieldsList} aria-label="What they said">
                {(Object.keys(FIELD) as (keyof ReportFields)[]).filter((k) => r.fields![k]).map((k) => (
                  <li key={k}>
                    <span className="sub-label">{FIELD[k]}</span> {r.fields![k]}
                  </li>
                ))}
              </ul>
            )}
            {r.text && (
              <p>
                <span className="sub-label">{r.kind !== "wrong" ? "They added" : r.source === "assistant" ? "They saw" : "What happened"}</span> {r.text}
              </p>
            )}
            {r.kind !== "wrong" && (
              <ul className={styles.pageNow} aria-label="On the page now">
                {r.onThePage.length ? r.onThePage.map((w) => <li key={w}><span className="sub-label">On the page now</span> {w}</li>) : <li className="muted">The page has no way in yet.</li>}
              </ul>
            )}
            {r.kind !== "wrong" && <Decide r={r} router={router} />}
            <Status id={r.id} status={r.status} />
          </li>
        ))}
      </ol>
    </section>
  );
}
