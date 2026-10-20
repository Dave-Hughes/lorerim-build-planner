"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditBar, type SaveState } from "@/components/editor/edit-bar";
import type { ExtraMention } from "@/lib/guide/mention";
import * as act from "@/lib/playthroughs/actions";
import type { ChapterKind } from "@/lib/playthroughs/types";
import { Report, useSave, type EditData } from "./edit-parts";
import { PlayEdit } from "./play-edit";
import s from "./edit.module.css";

export type { EditAct, EditChapter, EditData, EditObjective } from "./edit-parts";

/**
 * Editing a playthrough by hand (WO-111): the Play tab in edit mode (WO-117, PlayEdit), and until the
 * Story is written in the reader, the Story tab's chapters list. Every change goes through the same
 * writes the assistants' tools use, and shows their refusal where it was made.
 */

export function EditPlaythrough({ data, actId, tale, linkables }: { data: EditData; actId: number | null; tale: boolean; linkables: ExtraMention[] }) {
  const [band, setBand] = useState<SaveState>({ state: "idle" });
  const onSaved = () => {};
  const current = data.acts.find((a) => a.id === actId) ?? data.acts[0] ?? null;
  return (
    <Report.Provider value={setBand}>
      <EditBar buildId={data.buildId ?? ""} name={data.name} current={tale ? "story" : "play"} visibility={data.visibility} save={band} />
      {tale ? (
        <main className={`page ${s.main}`} style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
          <div className={s.col}>
            <Chapters data={data} onSaved={onSaved} />
          </div>
        </main>
      ) : (
      <PlayEdit data={data} current={current} linkables={linkables} details={<Details data={data} onSaved={onSaved} />} />
      )}
    </Report.Provider>
  );
}

function Moves({ onMove, first, last, label }: { onMove: (to: "up" | "down") => void; first: boolean; last: boolean; label: string }) {
  return (
    <span className={s.moves}>
      <button type="button" className={s.move} disabled={first} aria-label={`Move ${label} up`} onClick={() => onMove("up")}>
        ▲
      </button>
      <button type="button" className={s.move} disabled={last} aria-label={`Move ${label} down`} onClick={() => onMove("down")}>
        ▼
      </button>
    </span>
  );
}

const KIND_LABEL: Record<ChapterKind, string> = { chapter: "Before the game", act: "The act's chapter", entry: "Entry", beat: "Beat" };

function Chapters({ data, onSaved }: { data: EditData; onSaved: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const { error, save } = useSave(onSaved);
  const actName = (id: number | null) => {
    const a = data.acts.find((x) => x.id === id);
    return a ? `Act ${a.n}` : "";
  };
  const groups = [{ id: null as number | null, name: "Before Skyrim" }, ...data.acts.map((a) => ({ id: a.id as number | null, name: `Act ${a.n} ${a.name}` }))];
  return (
    <section aria-labelledby="chapters" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <span className={s.headRule}>
        <h2 id="chapters" className={`${s.h2} ${s.h2s}`}>
          The tale
        </h2>
        <Link href={`/p/${data.id}/tale`} className={s.note}>
          Read it ›
        </Link>
      </span>
      {groups.map((g) => {
        const mine = data.chapters.filter((c) => c.actId === g.id);
        if (!mine.length && g.id !== null) return null;
        return (
          <div key={String(g.id)}>
            <span className={s.lbl}>{g.name}</span>
            {mine.map((c, i) => (
              <div key={c.id} className={s.chapter}>
                <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <span className={s.chapterTitle}>{c.title}</span>
                  <span className={s.note}>{[KIND_LABEL[c.kind], actName(c.actId)].filter(Boolean).join(" | ")}</span>
                </span>
                <span className={s.actions}>
                  <Moves label={c.title} first={i === 0} last={i === mine.length - 1} onMove={(to) => save(() => act.moveChapter(data.id, c.id, to), true)} />
                  <Link href={`/p/${data.id}/edit/story/${c.id}`} className="btn btn-sm">
                    Edit
                  </Link>
                  <button type="button" className="btn btn-sm" onClick={() => window.confirm(`Remove ${c.title}?`) && save(() => act.removeChapter(data.id, c.id), true)}>
                    Remove
                  </button>
                </span>
              </div>
            ))}
            {g.id === null && !mine.length && <p className="muted">No chapters before the game yet.</p>}
          </div>
        );
      })}
      <form
        className={s.add}
        onSubmit={(e) => {
          e.preventDefault();
          save(async () => {
            const r = await act.newChapter(data.id, { kind: "chapter", title });
            if (r.ok) router.push(`/p/${data.id}/edit/story/${r.value}`);
            return r;
          });
        }}
      >
        <input className={`input ${s.sm}`} style={{ flex: "1 1 260px" }} aria-label="New chapter's title" placeholder="[Chapter Five: The Road North]" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit" className="btn btn-sm">
          Add a chapter
        </button>
        <span className={s.note}>Up to 5 images a chapter, your own. Captions under each.</span>
        {error && (
          <span role="alert" className={s.error}>
            {error}
          </span>
        )}
      </form>
    </section>
  );
}

/** The playthrough's own details: name, line, build, the opening image, the AI assisted mark, delete. */
function Details({ data, onSaved }: { data: EditData; onSaved: () => void }) {
  const router = useRouter();
  const { error, save, setError } = useSave(onSaved);
  const [name, setName] = useState(data.name);
  const [line, setLine] = useState(data.line);
  const [taleTitle, setTaleTitle] = useState(data.taleTitle);
  const [taleLine, setTaleLine] = useState(data.taleLine);
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
        <span className={s.lbl}>The tale&apos;s title</span>
        <input className={`input ${s.in}`} value={taleTitle} maxLength={60} placeholder={data.name} onChange={(e) => setTaleTitle(e.target.value)} onBlur={() => taleTitle !== data.taleTitle && save(() => act.saveDetails(data.id, { taleTitle }), true)} />
      </label>
      <label className={s.field}>
        <span className={s.lbl}>Its epigraph</span>
        <input className={`input ${s.in}`} value={taleLine} maxLength={140} placeholder="[A line under the title, if any]" onChange={(e) => setTaleLine(e.target.value)} onBlur={() => taleLine !== data.taleLine && save(() => act.saveDetails(data.id, { taleLine }), true)} />
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
