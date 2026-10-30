"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { confirmAccurate, undoConfirmation } from "@/lib/quests/confirm-actions";
import styles from "./page-kit.module.css";

/**
 * "Confirm it's accurate" (WO-154 Part 3, board QuestConfirm): a signed-in player's word that the page matches their game. A dialog says
 * it is recorded, with the players who confirmed, and Close and Undo. Signed out, the button is the sign-in button.
 */
export function ConfirmButton({ kind, id, path, title, signedIn, mine, signIn }: { kind: "quest" | "person" | "place"; id: string; path: string; title: string; signedIn: boolean; mine: boolean; signIn: ReactNode }) {
  const [names, setNames] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(mine);
  // Undo from the Players line changes `mine` from outside this button: follow it (adjusting state while rendering, not in an effect).
  const [seen, setSeen] = useState(mine);
  if (mine !== seen) {
    setSeen(mine);
    setDone(mine);
  }
  const [pending, start] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);
  if (!signedIn) return <>{signIn}</>;

  const confirm = () =>
    start(async () => {
      const r = await confirmAccurate(kind, id, path);
      if (!r.ok) return setError(r.error);
      setError("");
      setNames(r.names);
      setDone(true);
      dialog.current?.showModal();
    });
  const undo = () =>
    start(async () => {
      const r = await undoConfirmation(kind, id, path);
      if (!r.ok) return setError(r.error);
      setDone(false);
      setNames(null);
      dialog.current?.close();
    });

  return (
    <>
      {done ? (
        <span className="btn" aria-disabled="true" style={{ opacity: 0.6 }}>
          Confirmed
        </span>
      ) : (
        <button type="button" className="btn btn-primary" onClick={confirm} disabled={pending}>
          Confirm it&apos;s accurate
        </button>
      )}
      {error && <span role="alert" className={styles.src}>{error}</span>}
      <dialog ref={dialog} className={`frame ${styles.dialog}`} aria-labelledby="confirmed-title" onClose={() => setNames((n) => n)}>
        <h2 id="confirmed-title" className={styles.confirmedTitle}>
          <span className={`${styles.mark} ${styles.markYes}`}>✓</span>
          Confirmed
        </h2>
        <p className={styles.plain}>Your name is now on {title} with the players who confirmed it&apos;s accurate.</p>
        <span className={styles.names} style={{ gridColumn: "auto" }}>
          {(names ?? []).map((n, i) => (
            <span key={i}>{n}</span>
          ))}
        </span>
        <span className={styles.buttons} style={{ paddingTop: 6 }}>
          <button type="button" className="btn btn-primary" onClick={() => dialog.current?.close()}>
            Close
          </button>
          <button type="button" className="btn" onClick={undo} disabled={pending}>
            Undo
          </button>
        </span>
      </dialog>
    </>
  );
}
