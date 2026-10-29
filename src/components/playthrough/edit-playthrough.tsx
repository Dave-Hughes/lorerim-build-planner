"use client";

import { pro } from "@/lib/pronouns";
import { ModsEditor } from "@/components/ui/mods-editor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditBar, type SaveState } from "@/components/editor/edit-bar";
import type { ExtraMention } from "@/lib/guide/mention";
import type { Answer } from "@/lib/playthroughs/types";
import * as act from "@/lib/playthroughs/actions";
import { Report, useSave, type EditData } from "./edit-parts";
import { PlayEdit } from "./play-edit";
import s from "./edit.module.css";

export type { EditAct, EditChapter, EditData, EditObjective } from "./edit-parts";

/**
 * Editing a playthrough by hand (WO-111): the Play tab in edit mode (WO-117, PlayEdit), and until the
 * Story is written in the reader, the Story tab's chapters list. Every change goes through the same
 * writes the assistants' tools use, and shows their refusal where it was made.
 */

export function EditPlaythrough({ data, actId, linkables }: { data: EditData; actId: number | null; linkables: ExtraMention[] }) {
  const [band, setBand] = useState<SaveState>({ state: "idle" });
  const current = data.acts.find((a) => a.id === actId) ?? data.acts[0] ?? null;
  return (
    <Report.Provider value={setBand}>
      <EditBar buildId={data.buildId ?? ""} name={data.name} current="play" visibility={data.visibility} save={band} />
      <PlayEdit data={data} current={current} linkables={linkables} details={<Details data={data} onSaved={() => {}} />} />
    </Report.Provider>
  );
}

/** The playthrough's own details: name, line, build, the opening image, the AI assisted mark, delete. */
function Details({ data, onSaved }: { data: EditData; onSaved: () => void }) {
  const router = useRouter();
  const { error, save } = useSave(onSaved);
  return (
    <section className={s.panel} aria-labelledby="details" style={{ gap: 14 }}>
      <h2 id="details" className={`${s.h2} ${s.h2s}`}>
        The playthrough
      </h2>
      {/* The character's name, line and cover are the character's, one set (WO-179): they are in Set up, not here. */}
      <span className={s.note}>
        {data.buildId ? (
          <>
            The name, the line under it and the cover are the character&apos;s: <Link href={`/b/${data.buildId}/setup?step=name`}>change them in Set up ›</Link>
          </>
        ) : (
          "The name, the line under it and the cover are the character's."
        )}
      </span>
      <Answers data={data} save={save} />
      <span className={s.field}>
        <span className={s.lbl}>Mods this character needs</span>
        <ModsEditor mods={data.mods} idPrefix="run-mod" onChange={(mods) => save(() => act.saveDetails(data.id, { mods }), true)} />
      </span>
      {data.draftedBy && (
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 15 }}>
          <input type="checkbox" defaultChecked={data.showDrafted} onChange={(e) => save(() => act.saveDetails(data.id, { showDrafted: e.target.checked }), true)} />
          AI assisted mark: Show it
        </label>
      )}
      <button
        type="button"
        className="btn btn-sm"
        style={{ alignSelf: "flex-start" }}
        onClick={() => {
          if (!window.confirm(`Delete ${data.name}? Its acts, objectives and tale go with it.`)) return;
          save(async () => {
            const r = await act.removePlaythrough(data.id);
            if (r.ok) router.push("/me#playthroughs");
            return r;
          });
        }}
      >
        Delete the playthrough
      </button>
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </section>
  );
}

/**
 * About her (WO-139 Part 2): the Before you design answers as a plain list the player can edit, each saved as the whole
 * list when a field is left; a row is saved once it has both a question and an answer.
 */
function Answers({ data, save }: { data: EditData; save: ReturnType<typeof useSave>["save"] }) {
  const [rows, setRows] = useState<Answer[]>(data.answers);
  const [saved, setSaved] = useState(JSON.stringify(data.answers));
  const keep = (next: Answer[]) => {
    const kept = next.filter((r) => r.question.trim() && r.answer.trim());
    if (JSON.stringify(kept) === saved) return;
    setSaved(JSON.stringify(kept));
    save(() => act.saveDetails(data.id, { answers: kept }), true);
  };
  const set = (i: number, patch: Partial<Answer>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <span className={s.field}>
      <span className={s.lbl}>About {pro(data.pronoun).object}</span>
      {rows.map((r, i) => (
        <span key={i} className={s.answerRow}>
          <input className={`input ${s.in}`} aria-label={`Question ${i + 1}`} placeholder="[The question]" value={r.question} maxLength={300} onChange={(e) => set(i, { question: e.target.value })} onBlur={() => keep(rows)} />
          <textarea className={`textarea ${s.in}`} aria-label={`Answer ${i + 1}`} placeholder="[Her answer]" rows={2} value={r.answer} maxLength={300} onChange={(e) => set(i, { answer: e.target.value })} onBlur={() => keep(rows)} />
          <button
            type="button"
            className="btn btn-sm"
            style={{ alignSelf: "flex-start" }}
            onClick={() => {
              const next = rows.filter((_, j) => j !== i);
              setRows(next);
              keep(next);
            }}
          >
            Remove
          </button>
        </span>
      ))}
      {rows.length < 12 && (
        <button type="button" className="btn btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setRows((r) => [...r, { question: "", answer: "" }])}>
          Add an answer
        </button>
      )}
    </span>
  );
}
