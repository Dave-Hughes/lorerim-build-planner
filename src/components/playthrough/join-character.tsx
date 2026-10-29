"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import * as act from "@/lib/playthroughs/actions";

/**
 * "Is this the same character as …?" (WO-179) under a character the planner made for a playthrough that had none: a list of the player's other
 * characters with no playthrough, and Join moves the playthrough to the one picked and removes this one (nothing was planned on it).
 */
export function JoinCharacter({ runId, choices }: { runId: string; choices: { id: string; name: string }[] }) {
  const router = useRouter();
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (!choices.length) return null;
  return (
    <span style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        Is this the same character as…?
        <select className="select" value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">Pick one of yours</option>
          {choices.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      {to && (
        <button
          type="button"
          className="btn btn-sm"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await act.joinCharacter(runId, to);
              if (r.ok) router.refresh();
              else setError(r.error);
            })
          }
        >
          {pending ? "Joining…" : "Join"}
        </button>
      )}
      {error && <span role="alert">{error}</span>}
    </span>
  );
}
