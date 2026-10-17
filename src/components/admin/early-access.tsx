"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Avatar } from "@/components/ui/avatar";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { LocalDate } from "@/components/ui/local-date";
import { cancelInvite, makeInvite, removeEarlyAccess } from "@/lib/users/invite-actions";
import { INVITE_MESSAGE_MAX, inviteLine, type InviteState } from "@/lib/users/invites";
import styles from "./import-build.module.css";
import own from "./early-access.module.css";

export interface InviteRow {
  id: number;
  label: string;
  createdAt: Date;
  state: InviteState;
  usedByName: string | null;
}
export interface EarlyRow {
  id: string;
  name: string;
  image: string | null;
  at: Date;
}

/**
 * Early access (WO-96): make an invite for someone by name (its link is shown once), see each
 * invite and cancel one nobody has used, and take a player's early access away.
 */
export function EarlyAccess({ invites, people }: { invites: InviteRow[]; people: EarlyRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState<{ path: string; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const run = (f: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      setError(null);
      const r = await f();
      if (!r.ok) setError(r.error ?? null);
      router.refresh();
    });
  const make = () =>
    start(async () => {
      setError(null);
      const r = await makeInvite(name, message);
      if (!r.ok) return setError(r.error);
      setLink({ path: r.value.path, label: name.trim() });
      setName("");
      setMessage("");
      router.refresh();
    });

  return (
    <section aria-labelledby="early-title" className={styles.section}>
      <h2 id="early-title" className="title">
        Early access
      </h2>

      <h3 className="label">Invite someone</h3>
      <form
        className={styles.row}
        onSubmit={(e) => {
          e.preventDefault();
          make();
        }}
      >
        <label className={`field ${own.name}`}>
          <span className="label">Name</span>
          <input className="input" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={`field ${own.message}`}>
          <span className="label">What Tapps says</span>
          <textarea className="textarea" value={message} maxLength={INVITE_MESSAGE_MAX} rows={3} placeholder={inviteLine(name.trim() || "[Name]")} onChange={(e) => setMessage(e.target.value)} />
          <span className="field-hint">Leave it empty for the usual line.</span>
        </label>
        <button type="submit" className="btn btn-primary" disabled={!name.trim() || pending}>
          Make invite
        </button>
      </form>
      {link && (
        <div className={own.link} role="status">
          <span className="muted">For {link.label}:</span>
          <code className={own.url}>{typeof window === "undefined" ? link.path : new URL(link.path, window.location.origin).toString()}</code>
          <CopyLinkButton path={link.path} />
          <span className="muted">It works once, for 14 days.</span>
        </div>
      )}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <h3 className="label">Invites</h3>
      {invites.length ? (
        <ul className={own.list} aria-label="Invites">
          {invites.map((i) => (
            <li key={i.id}>
              <span className={own.who}>{i.label}</span>
              <span className="muted">
                <LocalDate date={i.createdAt} />
              </span>
              <span className={i.state === "waiting" ? own.waiting : "muted"}>{i.state === "waiting" ? "Waiting" : i.state === "used" ? `Used by ${i.usedByName ?? "a deleted account"}` : "Ran out"}</span>
              {i.state === "waiting" && (
                <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => cancelInvite(i.id))}>
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">None yet.</p>
      )}

      <h3 className="label">People with early access</h3>
      {people.length ? (
        <ul className={own.list} aria-label="People with early access">
          {people.map((p) => (
            <li key={p.id}>
              <span className={own.who}>
                <Avatar name={p.name} image={p.image} size={28} />
                {p.name}
              </span>
              <span className="muted">
                <LocalDate date={p.at} />
              </span>
              <span />
              <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => removeEarlyAccess(p.id))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Nobody yet.</p>
      )}
    </section>
  );
}
