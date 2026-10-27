"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { reportQuest } from "@/lib/quests/report-actions";
import { REPORT_FIELD_MAX, type ReportKind } from "@/lib/quests/player-types";
import { REPORT_TEXT_MAX, REPORT_THANKS, REPORT_WHAT, type ReportWhat } from "@/lib/quests/report-words";
import styles from "./quest-report.module.css";

/**
 * This was wrong (WO-103), under a quest line's quests: what was wrong and what happened in the player's game. Signed
 * out, it asks for Discord first (WO-121a Part 5), and the sign-in comes back here with the form open (`open`).
 */
export function QuestReport({ lineId, quests, signedIn, signIn, open: startOpen = false, label = "This was wrong", buttonClass }: { lineId: string; quests: { edid: string; name: string }[]; signedIn: boolean; signIn: React.ReactNode; open?: boolean; label?: string; buttonClass?: string }) {
  const id = useId();
  // A modal (WO-154 Part 4): the button opens it, and so does coming back from signing in.
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<ReportKind>("wrong");
  const [quest, setQuest] = useState(quests[0]?.edid ?? "");
  const [fields, setFields] = useState({ who: "", where: "", how: "", place: "" });
  const [what, setWhat] = useState<ReportWhat | null>(null);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  // Back from signing in: the form is where the player left it.
  useEffect(() => {
    if (startOpen) dialog.current?.showModal();
  }, [startOpen]);
  const send = () => {
    if (kind === "wrong" && !what) return setError("Choose what was wrong.");
    if (kind === "wrong" && !text.trim()) return setError("Say what happened in your game.");
    if (kind === "how" && !fields.who.trim() && !fields.where.trim() && !fields.how.trim()) return setError("Say who starts it, where, or what you did.");
    if (kind === "where" && !fields.place.trim()) return setError("Say where it is: the town, the building, the nearest landmark.");
    setError(null);
    start(async () => {
      const r = await reportQuest(lineId, what ?? "Something else", text, kind === "wrong" ? undefined : { kind, quest, fields });
      if (r.ok) setDone(true);
      else setError(r.error);
    });
  };
  return (
    <>
      <button type="button" className={buttonClass ?? styles.link} onClick={() => dialog.current?.showModal()}>
        {label}
      </button>
      <dialog ref={dialog} className={`frame ${styles.modal}`} aria-labelledby={`${id}-title`}>
        <h2 id={`${id}-title`} className={styles.modalTitle}>
          Report a mistake
        </h2>
        {done && (
          <>
            <p className={styles.done} role="status">
              {REPORT_THANKS}
            </p>
            <span className={styles.actions}>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => dialog.current?.close()}>
                Close
              </button>
            </span>
          </>
        )}
        {!signedIn && !done && (
          <div id={id} className={styles.formIn}>
            <p>Sign in with Discord to tell us. You&apos;ll come back here.</p>
            {signIn}
          </div>
        )}
      {signedIn && !done && (
        <form
          id={id}
          className={styles.formIn}
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <fieldset className={styles.whats}>
            <legend className="label">What are you sending?</legend>
            {(
              [
                ["wrong", "Something's wrong"],
                ["how", "I know how this starts"],
                ["where", "I know where this is"],
              ] as const
            ).map(([k, l]) => (
              <label key={k} className={styles.what}>
                <input type="radio" name={`${id}-kind`} value={k} checked={kind === k} onChange={() => setKind(k)} />
                <span>{l}</span>
              </label>
            ))}
          </fieldset>
          {kind !== "wrong" && quests.length > 1 && (
            <label className="field">
              <span className="sub-label">Which quest?</span>
              <select className="select" value={quest} onChange={(e) => setQuest(e.target.value)}>
                {quests.map((q) => (
                  <option key={q.edid} value={q.edid}>
                    {q.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {kind === "wrong" && (
            <fieldset className={styles.whats}>
              <legend className="label">What was wrong?</legend>
              {REPORT_WHAT.map((w) => (
                <label key={w} className={styles.what}>
                  <input type="radio" name={`${id}-what`} value={w} checked={what === w} onChange={() => setWhat(w)} />
                  <span>{w}</span>
                </label>
              ))}
            </fieldset>
          )}
          {kind === "how" && (
            <>
              <label className="field">
                <span className="sub-label">Who starts it, or gives it?</span>
                <input className="input" value={fields.who} maxLength={REPORT_FIELD_MAX} onChange={(e) => setFields((f) => ({ ...f, who: e.target.value }))} />
              </label>
              <label className="field">
                <span className="sub-label">Where is that?</span>
                <input className="input" value={fields.where} maxLength={REPORT_FIELD_MAX} placeholder="[The building, the town]" onChange={(e) => setFields((f) => ({ ...f, where: e.target.value }))} />
              </label>
              <label className="field">
                <span className="sub-label">What did you do?</span>
                <input className="input" value={fields.how} maxLength={REPORT_FIELD_MAX} onChange={(e) => setFields((f) => ({ ...f, how: e.target.value }))} />
              </label>
            </>
          )}
          {kind === "where" && (
            <label className="field">
              <span className="sub-label">Where is it?</span>
              <input className="input" value={fields.place} maxLength={REPORT_FIELD_MAX} placeholder="[The town, the building, the nearest landmark]" onChange={(e) => setFields((f) => ({ ...f, place: e.target.value }))} />
            </label>
          )}
          <label className="field">
            <span className="sub-label">{kind === "wrong" ? "What happened in your game?" : "Anything else?"}</span>
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
            <button type="button" className="btn btn-sm btn-quiet" onClick={() => dialog.current?.close()}>
              Cancel
            </button>
          </span>
        </form>
      )}
      </dialog>
    </>
  );
}
