"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LocalDate } from "@/components/ui/local-date";
import { HOW_OPTIONS, TIP_MAX, TIP_WORDS, type TipHow, type TipKind } from "@/lib/tips/words";
import { SHOT_BYTES, SHOT_WORDS } from "@/lib/screenshots/words";
import styles from "./page-kit.module.css";

/** A line a player's report answered, approved by an admin: shown as a player's report, never as the game files. */
export interface AnsweredLine {
  field: string;
  words: string;
  by: string;
  at: string;
}

/**
 * Not sure yet, with "I know this" on every line (WO-184 Part 2, board Confirm). It opens the form under that line: what do you know, how do you know it, and
 * an optional screenshot. An admin reads it before it shows on the page. Signed out, the line says "Sign in to tell us". A line a player's report answered says
 * so, in the player's words, marked as theirs.
 */
export function NotSureList({ kind, pageKey, fields, signedIn, sent, answered, signIn, seeAll }: { kind: TipKind; pageKey: string; fields: string[]; signedIn: boolean; sent: string[]; answered: AnsweredLine[]; signIn: ReactNode; seeAll?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const [done, setDone] = useState<string[]>(sent.map((f) => f.toLowerCase()));
  const root = useRef<HTMLUListElement>(null);
  // "I know this ›" on Help fill the gaps opens that page at the form: /…#know-<n>.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const m = /^#know-(\d+)$/.exec(window.location.hash);
      if (m && Number(m[1]) < fields.length) {
        // Signed out, the link scrolls to the line and offers sign-in, nothing more: a form would lose what was typed on Send (WO-184 Part 9).
        if (signedIn) setOpen(Number(m[1]));
        root.current?.scrollIntoView({ block: "center" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [fields.length, signedIn]);
  const said = (f: string) => answered.find((a) => a.field.toLowerCase() === f.toLowerCase().replace(/\.$/, ""));

  return (
    <>
      <ul className={styles.unsure} ref={root}>
        {fields.map((f, i) => {
          const a = said(f);
          const sentAlready = done.includes(f.toLowerCase());
          return (
            <li key={f} className={styles.unsureLi}>
              <span className={styles.unsureRow}>
                <span>{f.charAt(0).toUpperCase() + f.slice(1)}.</span>
                {a ? null : sentAlready ? (
                  <span className={styles.thanks}>{TIP_WORDS.sent}</span>
                ) : signedIn ? (
                  <button type="button" className={styles.linkBtn} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                    I know this ›
                  </button>
                ) : (
                  <span className={styles.signLink}>{signIn}</span>
                )}
              </span>
              {a && (
                <span className={styles.answered}>
                  A player&apos;s report, not the game files: {a.words} <span className={styles.by}>({a.by}, <LocalDate date={a.at} short />)</span>
                </span>
              )}
              {open === i && !a && (
                <KnowForm
                  kind={kind}
                  pageKey={pageKey}
                  field={f}
                  onCancel={() => setOpen(null)}
                  onSent={() => {
                    setDone((d) => [...d, f.toLowerCase()]);
                    setOpen(null);
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
      {seeAll && (
        <a href="/help-fill-the-gaps" className={styles.seeAll}>
          See everything we&apos;re unsure of ›
        </a>
      )}
    </>
  );
}

function KnowForm({ kind, pageKey, field, onCancel, onSent }: { kind: TipKind; pageKey: string; field: string; onCancel: () => void; onSent: () => void }) {
  const [words, setWords] = useState("");
  const [how, setHow] = useState<TipHow>("game");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!words.trim()) return setError(TIP_WORDS.needWords);
    if (file && file.size > SHOT_BYTES) return setError(SHOT_WORDS.tooBig);
    setBusy(true);
    setError("");
    const form = new FormData();
    form.set("kind", kind);
    form.set("key", pageKey);
    form.set("type", "know");
    form.set("field", field);
    form.set("words", words);
    form.set("how", how);
    if (how === "other") form.set("link", link);
    if (file) form.set("file", file);
    try {
      const res = await fetch("/api/tips", { method: "POST", body: form });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) return setError(body.error ?? "That didn't send. Try again.");
      onSent();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.knowForm} role="group" aria-label={`What you know about ${field.toLowerCase()}`}>
      <label className={styles.knowLabel}>
        What do you know?
        <textarea value={words} maxLength={TIP_MAX} onChange={(e) => setWords(e.target.value)} placeholder="What you saw, and where" required />
      </label>
      <span className={styles.knowLabel} id={`how-${field}`}>
        How do you know?
      </span>
      <div className={styles.radios} role="radiogroup" aria-labelledby={`how-${field}`}>
        {HOW_OPTIONS.map((h) => (
          <label key={h.id}>
            <input type="radio" name={`how-${field}`} checked={how === h.id} onChange={() => setHow(h.id)} />
            {h.label}
          </label>
        ))}
      </div>
      {how === "other" && (
        <label className={styles.knowLabel}>
          The link
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" />
        </label>
      )}
      <label className={styles.knowLabel}>
        A screenshot, if you have one (optional)
        <input type="file" accept="image/png,image/jpeg" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <p className={styles.knowNote}>An admin reads it before it shows on the page. It&apos;s credited to your Discord name.</p>
      {error && (
        <p role="alert" className={styles.knowErr}>
          {error}
        </p>
      )}
      <div className={styles.knowBtns}>
        <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={send}>
          {busy ? "Sending…" : "Send it"}
        </button>
        <button type="button" className="btn btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
