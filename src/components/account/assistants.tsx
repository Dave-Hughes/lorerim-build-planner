"use client";

import { useState, useTransition } from "react";
import { LocalDate } from "@/components/ui/local-date";
import { revokeAssistantAction } from "@/lib/oauth/assistant-actions";
import styles from "./assistants.module.css";

export interface AssistantRow {
  clientId: string;
  name: string;
  /** What it may do, in plain words. */
  may: string[];
  since: Date;
  lastUsed: Date | null;
  /** Builds its tools drafted (WO-110). */
  drafted: number;
}

/** Assistants (WO-109): each connected assistant, what it may do, and Revoke. */
export function Assistants({ rows }: { rows: AssistantRow[] }) {
  const [revoked, setRevoked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <section aria-labelledby="assistants-title" className={styles.section}>
      <h2 id="assistants-title" className={`title ${styles.h2}`}>
        Assistants
      </h2>
      {rows.length === 0 ? (
        <p className="muted">No assistant is connected to your account.</p>
      ) : (
        <ul className={styles.list} aria-label="Assistants">
          {rows.map((r) => {
            const gone = revoked.includes(r.clientId);
            return (
              <li key={r.clientId}>
                <span className={styles.name}>{r.name}</span>
                <span className={styles.may}>
                  {r.may.join(" | ")}
                  {r.drafted > 0 && <span className="muted"> | {r.drafted === 1 ? "1 build drafted" : `${r.drafted} builds drafted`}</span>}
                </span>
                <span className="muted">
                  Connected <LocalDate date={r.since} />
                </span>
                <span className="muted">{r.lastUsed ? <LocalDate date={r.lastUsed} prefix="Last used " /> : "Not used yet"}</span>
                {gone ? (
                  <span className={styles.revoked}>Revoked</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm"
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        setError(null);
                        const res = await revokeAssistantAction(r.clientId);
                        if (res.ok) setRevoked((v) => [...v, r.clientId]);
                        else setError(res.error);
                      })
                    }
                  >
                    Revoke
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </section>
  );
}
