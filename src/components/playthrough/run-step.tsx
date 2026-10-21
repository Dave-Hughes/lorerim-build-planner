"use client";

import { useState } from "react";
import type { RunInput } from "@/lib/playthroughs/writes";
import { objectiveRefusal } from "@/lib/playthroughs/status";
import { FIRST_ACT, startObjective } from "@/lib/playthroughs/validate";
import e from "./edit.module.css";
import p from "./play.module.css";

/**
 * The run step (WO-114), as the NewCharacter board: the run's name and line, Act I from where the
 * character starts (prefilled, all of it changeable), and its first objectives: the start's own quest
 * when the planner knows it, then any the player adds. Used by New character's seventh step and by
 * Add a run on a build alone. Nothing is checked twice: the server's prepareRun has the last word.
 */
export function RunStep({
  initial,
  startQuest,
  pending,
  error,
  onConfirm,
  back,
}: {
  initial: { name: string; line: string; place: string };
  startQuest: { edid: string; name: string; xp?: number } | null;
  pending: boolean;
  error: string | null;
  onConfirm: (run: RunInput) => void;
  back?: React.ReactNode;
}) {
  const [name, setName] = useState(initial.name);
  const [line, setLine] = useState(initial.line.slice(0, 140));
  const [act, setAct] = useState<{ name: string; levels: string; place: string; goal: string }>({ name: FIRST_ACT.name, levels: FIRST_ACT.levels, place: initial.place, goal: "" });
  const [withQuest, setWithQuest] = useState(!!startQuest);
  const [mine, setMine] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const refused = draft.trim() ? objectiveRefusal(draft, "once") : null;

  const confirm = () =>
    onConfirm({
      name,
      line,
      act,
      objectives: [
        ...(withQuest && startQuest ? [startObjective(startQuest)] : []),
        ...mine.map((text) => ({ text, kind: "once" as const, doneBy: "hand" as const })),
      ],
    });
  const field = (label: string, value: string, set: (v: string) => void, max: number, placeholder?: string) => (
    <label className={e.field}>
      <span className={e.lbl}>{label}</span>
      <input className={`input ${e.in}`} value={value} maxLength={max} placeholder={placeholder} onChange={(ev) => set(ev.target.value)} />
    </label>
  );
  return (
    <section className={`frame ${e.panel}`} aria-labelledby="run-step" style={{ gap: 20 }}>
      <h2 id="run-step" className={e.h2}>
        The run
      </h2>
      <div className={e.row} style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)" }}>
        {field("Name", name, setName, 80)}
        {field("One line", line, setLine, 140, "[Who the character is, in one sentence]")}
      </div>
      <span className={p.note}>Act I is set from the start you chose. Change any of it now or later.</span>
      <div className={`${e.row} ${e.three}`}>
        {field("Act I", act.name, (v) => setAct({ ...act, name: v }), 60)}
        {field("Levels", act.levels, (v) => setAct({ ...act, levels: v }), 30)}
        {field("Place", act.place, (v) => setAct({ ...act, place: v }), 80, "[Where the start puts the character]")}
      </div>
      {field("The goal, in one line", act.goal, (v) => setAct({ ...act, goal: v }), 200, "[What the character is trying to do in the first days]")}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span className={e.headRule}>
          <span className={e.lbl} style={{ fontSize: 16, color: "var(--soft)" }}>
            Objectives
          </span>
          <span className={p.note}>{startQuest ? "From the start; the rest are yours" : "Yours, or your assistant's later"}</span>
        </span>
        {withQuest && startQuest && (
          <div className={p.obj}>
            <span className={p.box} aria-hidden="true" />
            <span className={p.t}>
              {startQuest.name}
              <span className={p.kind}>Quest</span>
            </span>
            <button type="button" className="btn btn-sm" onClick={() => setWithQuest(false)}>
              Remove
            </button>
            <span className={p.why}>
              The start&apos;s own quest. The save says when it&apos;s done.{startQuest.xp ? ` ${startQuest.xp} XP.` : ""}
            </span>
          </div>
        )}
        {mine.map((t, i) => (
          <div key={`${t}-${i}`} className={p.obj}>
            <span className={p.box} aria-hidden="true" />
            <span className={p.t}>{t}</span>
            <button type="button" className="btn btn-sm" onClick={() => setMine(mine.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <form
          className={e.add}
          onSubmit={(ev) => {
            ev.preventDefault();
            if (!draft.trim() || refused) return;
            setMine([...mine, draft.trim()]);
            setDraft("");
          }}
        >
          <input className={`input ${e.sm} ${refused ? e.bad : ""}`} style={{ flex: "1 1 280px" }} aria-label="New objective" placeholder="[One thing you'll know is done: a person met, a place reached]" maxLength={160} value={draft} onChange={(ev) => setDraft(ev.target.value)} />
          <button type="submit" className="btn btn-sm" disabled={!draft.trim() || !!refused}>
            Add an objective
          </button>
          <span className={p.note}>Or connect an assistant and ask it to draft the run</span>
        </form>
        {refused && <span className={e.warn}>{refused}</span>}
      </div>

      <span style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn btn-primary" disabled={pending || !name.trim()} onClick={confirm}>
          {pending ? "Saving…" : "Confirm"}
        </button>
        {back}
        {error && (
          <span role="alert" className="field-error">
            {error}
          </span>
        )}
      </span>
    </section>
  );
}
