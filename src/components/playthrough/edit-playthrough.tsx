"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditBar, type SaveState } from "@/components/editor/edit-bar";
import type { ExtraMention } from "@/lib/guide/mention";
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
  const { error, save, setError } = useSave(onSaved);
  const [name, setName] = useState(data.name);
  const [line, setLine] = useState(data.line);
  const [uploading, setUploading] = useState(false);
  return (
    <section className={s.panel} aria-labelledby="details" style={{ gap: 14 }}>
      <h2 id="details" className={`${s.h2} ${s.h2s}`}>
        The playthrough
      </h2>
      <label className={s.field}>
        <span className={s.lbl}>Name</span>
        <input className={`input ${s.in}`} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} onBlur={() => name !== data.name && save(() => act.saveDetails(data.id, { name }), true)} />
      </label>
      <label className={s.field}>
        <span className={s.lbl}>One line</span>
        <textarea className={`textarea ${s.in}`} rows={3} value={line} maxLength={140} onChange={(e) => setLine(e.target.value)} onBlur={() => line !== data.line && save(() => act.saveDetails(data.id, { line }), true)} />
      </label>
      <label className={s.field}>
        <span className={s.lbl}>Build</span>
        <select className="select" value={data.buildId ?? ""} onChange={(e) => save(() => act.saveDetails(data.id, { buildId: e.target.value || null }), true)}>
          <option value="">No build yet</option>
          {data.builds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      {/* The character's one cover is the build's (WO-114), uploaded as Set up uploads it. */}
      <span className={s.field}>
        <span className={s.lbl}>Cover</span>
        {data.buildId ? (
          <span className={s.actions} style={{ alignItems: "center" }}>
            <label className="btn btn-sm" style={{ cursor: "pointer" }}>
              {uploading ? "Uploading" : data.coverImageUrl ? "Change it" : "Add one"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  const form = new FormData();
                  form.append("file", file);
                  const res = await fetch("/api/covers", { method: "POST", body: form }).catch(() => null);
                  const body = (await res?.json().catch(() => ({}))) as { url?: string; error?: string } | undefined;
                  setUploading(false);
                  if (body?.url) save(() => act.saveCover(data.id, body.url!), true);
                  else setError(body?.error ?? "The upload didn't finish. Try again.");
                }}
              />
            </label>
            {data.coverImageUrl && (
              <button type="button" className="btn btn-sm" onClick={() => save(() => act.saveCover(data.id, null), true)}>
                Remove
              </button>
            )}
          </span>
        ) : (
          <span className={s.note}>The cover is the build&apos;s. Link a build to add one.</span>
        )}
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
