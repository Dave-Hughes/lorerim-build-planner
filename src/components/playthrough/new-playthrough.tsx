"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { newPlaythrough } from "@/lib/playthroughs/actions";

/** A new private playthrough: its name, one line, and the build it follows, if any. */
export function NewPlaythrough({ builds }: { builds: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        start(async () => {
          const r = await newPlaythrough({ name: String(f.get("name") ?? ""), line: String(f.get("line") ?? ""), buildId: String(f.get("build") ?? "") || null });
          if (r.ok) router.push(`/p/${r.value.id}/edit`);
          else setError(r.error);
        });
      }}
    >
      <label className="field">
        <span className="label">Name</span>
        <input className="input" name="name" maxLength={80} required placeholder="[The character's name]" />
      </label>
      <label className="field">
        <span className="label">One line</span>
        <input className="input" name="line" maxLength={140} placeholder="[Who they are, in one sentence]" />
      </label>
      <label className="field">
        <span className="label">Build</span>
        <select className="select" name="build" defaultValue="">
          <option value="">No build yet</option>
          {builds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          Make it
        </button>
        {error && (
          <span role="alert" className="field-error">
            {error}
          </span>
        )}
      </span>
    </form>
  );
}
