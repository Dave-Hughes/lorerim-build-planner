"use client";

import { useId, useRef, useState, useTransition } from "react";
import { reportBuild } from "@/lib/moderation/actions";
import { REPORT_REASONS, type ReportReason } from "@/lib/moderation/reports";
import { useDismiss } from "@/lib/use-dismiss";
import styles from "./report-build.module.css";

/**
 * The quiet Report link at the foot of a build page (WO-40), for signed-in players who don't own it.
 * It asks what's wrong, with an optional line; one report per player per build.
 */
export function ReportBuild({ buildId }: { buildId: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useDismiss({ open, onClose: () => setOpen(false), inside: [wrap], trigger: button });
  const send = () => {
    if (!reason) return setError("Choose what's wrong.");
    setError(null);
    start(async () => {
      const r = await reportBuild(buildId, reason, note);
      if (r.ok) {
        setDone("Thanks. An admin will look.");
        setOpen(false);
      } else setError(r.error);
    });
  };
  if (done)
    return (
      <p className={styles.done} role="status">
        {done}
      </p>
    );
  return (
    <div ref={wrap} className={styles.wrap}>
      <button ref={button} type="button" className={styles.link} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        Report
      </button>
      {open && (
        <form
          id={id}
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <fieldset className={styles.reasons}>
            <legend className="label">What&apos;s wrong?</legend>
            {REPORT_REASONS.map((r) => (
              <label key={r.id} className={styles.reason}>
                <input type="radio" name={`${id}-reason`} value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} />
                <span>{r.label}</span>
              </label>
            ))}
          </fieldset>
          <label className="field">
            <span className="sub-label">Anything to add (optional)</span>
            <input className="input" value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} />
          </label>
          {error && (
            <span className="field-error" role="alert">
              {error}
            </span>
          )}
          <span className={styles.actions}>
            <button type="submit" className="btn btn-sm btn-primary" disabled={pending}>
              {pending ? "Sending…" : "Send report"}
            </button>
            <button type="button" className="btn btn-sm btn-quiet" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </span>
        </form>
      )}
    </div>
  );
}
