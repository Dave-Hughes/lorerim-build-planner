"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { reportQuest } from "@/lib/quests/report-actions";
import { REPORT_TEXT_MAX, REPORT_THANKS, REPORT_WHAT, type ReportWhat } from "@/lib/quests/report-words";
import styles from "./quest-report.module.css";

/**
 * This was wrong (WO-103), under a quest line's quests: what was wrong and what happened in the player's game. Signed
 * out, it asks for Discord first (WO-121a Part 5), and the sign-in comes back here with the form open (`open`).
 */
export function QuestReport({ lineId, signedIn, signIn, open: startOpen = false }: { lineId: string; signedIn: boolean; signIn: React.ReactNode; open?: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(startOpen);
  const [what, setWhat] = useState<ReportWhat | null>(null);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  // Back from signing in: the form is where the player left it.
  useEffect(() => {
    if (startOpen) document.getElementById("report")?.scrollIntoView({ block: "center" });
  }, [startOpen]);
  const send = () => {
    if (!what) return setError("Choose what was wrong.");
    if (!text.trim()) return setError("Say what happened in your game.");
    setError(null);
    start(async () => {
      const r = await reportQuest(lineId, what, text);
      if (r.ok) setDone(true);
      else setError(r.error);
    });
  };
  if (done)
    return (
      <p id="report" className={styles.done} role="status">
        {REPORT_THANKS}
      </p>
    );
  return (
    <div id="report" className={styles.wrap}>
      <button type="button" className={styles.link} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        This was wrong
      </button>
      {open && !signedIn && (
        <div id={id} className={styles.form}>
          <p>Sign in with Discord to tell us. You&apos;ll come back here.</p>
          {signIn}
        </div>
      )}
      {open && signedIn && (
        <form
          id={id}
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <fieldset className={styles.whats}>
            <legend className="label">What was wrong?</legend>
            {REPORT_WHAT.map((w) => (
              <label key={w} className={styles.what}>
                <input type="radio" name={`${id}-what`} value={w} checked={what === w} onChange={() => setWhat(w)} />
                <span>{w}</span>
              </label>
            ))}
          </fieldset>
          <label className="field">
            <span className="sub-label">What happened in your game?</span>
            <textarea className="input" rows={4} value={text} maxLength={REPORT_TEXT_MAX} onChange={(e) => setText(e.target.value)} />
          </label>
          {error && (
            <span className="field-error" role="alert">
              {error}
            </span>
          )}
          <span className={styles.actions}>
            <button type="submit" className="btn btn-sm btn-primary" disabled={pending}>
              {pending ? "Sending…" : "Send"}
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
