"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { BuildVisibility } from "@/lib/builds/validate";
import { answer, enterByHand, saveDetails, tick } from "@/lib/playthroughs/actions";
import type { ObjectiveStatus } from "@/lib/playthroughs/types";
import s from "./play.module.css";

/**
 * The Play view's controls (WO-111), for the owner only: the tick, Accept and Skip on a suggestion,
 * the hand entry for where you stand, and who can see it. Each calls the same write the tools use.
 */

function useAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const go = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "That didn't save. Try again.");
      else {
        setError(null);
        router.refresh();
      }
    });
  return { pending, error, go };
}

/** The checkbox on a `hand` objective: ticks it, or takes the tick back. */
export function TickBox({ id, objectiveId, done, label }: { id: string; objectiveId: number; done: boolean; label: string }) {
  const { pending, error, go } = useAction();
  const next: ObjectiveStatus = done ? "todo" : "done";
  return (
    <>
      <button
        type="button"
        className={s.box}
        role="checkbox"
        aria-checked={done}
        aria-label={label}
        disabled={pending}
        onClick={() => go(() => tick(id, objectiveId, next))}
      >
        {done ? "✓" : ""}
      </button>
      {error && (
        <span role="alert" className={s.error} style={{ gridColumn: "2 / -1" }}>
          {error}
        </span>
      )}
    </>
  );
}

/** Under way and Later, beside To do, for the owner's own objectives. */
export function StatusPick({ id, objectiveId, status }: { id: string; objectiveId: number; status: ObjectiveStatus }) {
  const { pending, go } = useAction();
  return (
    <select
      className={s.st}
      aria-label="Status"
      value={status === "done" ? "todo" : status}
      disabled={pending}
      onChange={(e) => go(() => tick(id, objectiveId, e.target.value as ObjectiveStatus))}
      style={{ background: "none", border: 0, color: "inherit", font: "inherit", cursor: "pointer" }}
    >
      <option value="todo">To do</option>
      <option value="doing">Under way</option>
      <option value="later">Later</option>
    </select>
  );
}

export function Answer({ id, objectiveId }: { id: string; objectiveId: number }) {
  const { pending, error, go } = useAction();
  return (
    <span className={s.answer}>
      <button type="button" className={`btn btn-sm ${s.btnP}`} disabled={pending} onClick={() => go(() => answer(id, objectiveId, true))}>
        Accept
      </button>
      <button type="button" className="btn btn-sm" disabled={pending} onClick={() => go(() => answer(id, objectiveId, false))}>
        Skip
      </button>
      <span className={s.note}>Nothing is added until you accept it</span>
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </span>
  );
}

/** Enter it by hand: level, day, place, and the skills and counts the objectives name. */
export function HandEntry({ id, initial, skills, counts }: { id: string; initial: { level: number | null; day: number | null; place: string; skills: Record<string, number>; counts: Record<string, number> }; skills: string[]; counts: string[] }) {
  const [open, setOpen] = useState(false);
  const { pending, error, go } = useAction();
  if (!open)
    return (
      <button type="button" className={s.linkButton} onClick={() => setOpen(true)}>
        Enter it by hand
      </button>
    );
  const num = (v: FormDataEntryValue | null) => (v === null || String(v).trim() === "" ? null : Number(v));
  return (
    <form
      className={s.form}
      aria-label="Where you stand, by hand"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const level = num(f.get("level"));
        go(async () => {
          if (!level) return { ok: false, error: "Give your level." };
          const r = await enterByHand(id, {
            label: "By hand",
            level,
            day: num(f.get("day")),
            place: String(f.get("place") ?? ""),
            skills: Object.fromEntries(skills.flatMap((k) => (num(f.get(`skill:${k}`)) === null ? [] : [[k, num(f.get(`skill:${k}`))!]]))),
            counts: Object.fromEntries(counts.flatMap((k) => (num(f.get(`count:${k}`)) === null ? [] : [[k, num(f.get(`count:${k}`))!]]))),
          });
          if (r.ok) setOpen(false);
          return r;
        });
      }}
      style={{ gridColumn: "1 / -1" }}
    >
      <div className={s.formRow}>
        <label className={s.field}>
          <span className="label">Level</span>
          <input className="input" name="level" type="number" min={1} max={100} required defaultValue={initial.level ?? ""} />
        </label>
        <label className={s.field}>
          <span className="label">Day</span>
          <input className="input" name="day" type="number" min={1} defaultValue={initial.day ?? ""} />
        </label>
        <label className={s.field} style={{ gridColumn: "span 2" }}>
          <span className="label">Place</span>
          <input className="input" name="place" maxLength={80} defaultValue={initial.place} />
        </label>
        {skills.map((k) => (
          <label key={k} className={s.field}>
            <span className="label">{k}</span>
            <input className="input" name={`skill:${k}`} type="number" min={0} max={200} defaultValue={initial.skills[k] ?? ""} />
          </label>
        ))}
        {counts.map((k) => (
          <label key={k} className={s.field}>
            <span className="label">{k}</span>
            <input className="input" name={`count:${k}`} type="number" min={0} defaultValue={initial.counts[k] ?? ""} />
          </label>
        ))}
      </div>
      <div className={s.formActions}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
          Save
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setOpen(false)}>
          Cancel
        </button>
        {error && (
          <span role="alert" className={s.error}>
            {error}
          </span>
        )}
      </div>
    </form>
  );
}

const VIS: { v: BuildVisibility; label: string }[] = [
  { v: "private", label: "Private" },
  { v: "unlisted", label: "Link only" },
  { v: "public", label: "Listed" },
];

export function Visibility({ id, initial }: { id: string; initial: BuildVisibility }) {
  const [v, setV] = useState(initial);
  const { pending, error, go } = useAction();
  return (
    <>
      <div className={s.vis} role="group" aria-label="Who can see it">
        {VIS.map((o) => (
          <button
            key={o.v}
            type="button"
            aria-pressed={v === o.v}
            disabled={pending}
            onClick={() => {
              const before = v;
              setV(o.v);
              go(async () => {
                const r = await saveDetails(id, { visibility: o.v });
                if (!r.ok) setV(before);
                return r;
              });
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </>
  );
}
