"use client";

/* eslint-disable @next/next/no-img-element -- a thumbnail of the screenshot being reported. */
import { useRef, useState, useTransition, type ReactNode } from "react";
import { reportScreenshot } from "@/lib/screenshots/actions";
import { sendTip } from "@/lib/tips/actions";
import { TIP_MAX, TIP_WORDS } from "@/lib/tips/words";
import styles from "./page-kit.module.css";

/**
 * Report a mistake on a place or a person (WO-184 Part 2, with "This screenshot isn't this place" from Part 1): what is wrong on the page, or a screenshot that
 * isn't it. Both wait on an admin. Signed out, the button is the sign-in button.
 */
export function ReportMistake({ kind, pageKey, what, shots, signedIn, signIn }: { kind: "place" | "person"; pageKey: string; what: string; shots: { id: number; thumbUrl: string }[]; signedIn: boolean; signIn: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [about, setAbout] = useState<"page" | "shot">("page");
  const [shot, setShot] = useState(shots[0]?.id ?? 0);
  const [words, setWords] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();
  if (!signedIn) return <>{signIn}</>;

  const send = () =>
    start(async () => {
      const r = about === "shot" ? await reportScreenshot(shot, words) : await sendTip({ kind, key: pageKey, type: "mistake", field: "", words, how: "game" });
      if (!r.ok) return setError(r.error);
      setError("");
      setSent(true);
      setWords("");
    });

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={() => {
          setSent(false);
          dialog.current?.showModal();
        }}
      >
        Report a mistake
      </button>
      <dialog ref={dialog} className={`frame ${styles.dialog}`} aria-labelledby={`mistake-${pageKey}`}>
        <h2 id={`mistake-${pageKey}`} className={styles.confirmedTitle}>
          Report a mistake
        </h2>
        {sent ? (
          <>
            <p className={styles.plain}>Sent. Thanks. An admin will look at it.</p>
            <span className={styles.buttons}>
              <button type="button" className="btn btn-primary" onClick={() => dialog.current?.close()}>
                Close
              </button>
            </span>
          </>
        ) : (
          <>
            <div className={styles.radios} role="radiogroup" aria-label="What is wrong">
              <label>
                <input type="radio" name="mistake-about" checked={about === "page"} onChange={() => setAbout("page")} />
                Something on this page
              </label>
              {shots.length > 0 && (
                <label>
                  <input type="radio" name="mistake-about" checked={about === "shot"} onChange={() => setAbout("shot")} />
                  This screenshot isn&apos;t this {what}
                </label>
              )}
            </div>
            {about === "shot" && shots.length > 1 && (
              <div className={styles.radios} role="radiogroup" aria-label="Which screenshot">
                {shots.map((s, i) => (
                  <label key={s.id}>
                    <input type="radio" name="mistake-shot" checked={shot === s.id} onChange={() => setShot(s.id)} />
                    <img src={s.thumbUrl} alt={`Screenshot ${i + 1}`} width={96} height={54} />
                  </label>
                ))}
              </div>
            )}
            <label className={styles.knowLabel}>
              {about === "shot" ? "What is it a screenshot of? (optional)" : "What is wrong?"}
              <textarea value={words} maxLength={TIP_MAX} onChange={(e) => setWords(e.target.value)} required={about === "page"} />
            </label>
            {error && (
              <p role="alert" className={styles.knowErr}>
                {error}
              </p>
            )}
            <span className={styles.buttons}>
              <button type="button" className="btn btn-primary" disabled={pending || (about === "page" && !words.trim())} onClick={() => (about === "page" && !words.trim() ? setError(TIP_WORDS.needWords) : send())}>
                Send it
              </button>
              <button type="button" className="btn" onClick={() => dialog.current?.close()}>
                Cancel
              </button>
            </span>
          </>
        )}
      </dialog>
    </>
  );
}
