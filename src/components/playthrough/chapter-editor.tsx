"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { EditBar } from "@/components/editor/edit-bar";
import { GuideEditor } from "@/components/guide/guide-editor";
import { saveKeptGuides, type GuideSaveStatus } from "@/components/guide/use-guide-autosave";
import type { BuildVisibility } from "@/lib/builds/validate";
import { STORY_IMAGES, STORY_IMAGE_ERROR, type GuideDoc } from "@/lib/guide/doc";
import { saveChapter } from "@/lib/playthroughs/actions";
import type { ChapterKind } from "@/lib/playthroughs/types";
import page from "@/components/guide/guide-page.module.css";
import s from "./edit.module.css";

/**
 * A chapter, entry or beat in the Story editor (WO-111): its title, and its text with up to 5 of the
 * author's images, saved as typed under the Story's own rules (WO-79).
 */
export function ChapterEditor({ pid, playthrough, visibility, chapter }: { pid: string; playthrough: string; visibility: BuildVisibility; chapter: { id: number; kind: ChapterKind; title: string; fromSave: string | null; doc: GuideDoc } }) {
  const target = `p:${pid}`;
  const key = `chapter:${chapter.id}`;
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null }>({ status: "idle", error: null });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null) => setSave({ status, error }), []);
  useEffect(() => saveKeptGuides(target), [target]);
  const [title, setTitle] = useState(chapter.title);
  const [fromSave, setFromSave] = useState(chapter.fromSave ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const send = (input: { title?: string; fromSave?: string | null }) =>
    start(async () => {
      const r = await saveChapter(pid, chapter.id, input);
      setError(r.ok ? null : r.error);
    });
  return (
    <>
      <EditBar
        buildId=""
        name={playthrough}
        current="story"
        visibility={visibility}
        save={error ? { state: "failed", error } : save.status === "failed" ? { state: "failed", error: save.error } : pending || save.status === "saving" ? { state: "saving" } : { state: "saved" }}
      />
      <main className={`page ${page.main}`}>
        <h1 className={`title ${page.h1}`}>{chapter.kind === "chapter" ? "Chapter" : chapter.kind === "entry" ? "Entry" : "Beat"}</h1>
        <div className={page.fields}>
          <label className={s.field}>
            <span className="label">Title</span>
            <input className="input" value={title} maxLength={60} required onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== chapter.title && send({ title })} />
          </label>
          {chapter.kind === "entry" && (
            <label className={s.field}>
              <span className="label">From save (optional)</span>
              <input className="input" value={fromSave} maxLength={60} placeholder="[Save 7, 19 Oct 2026]" onChange={(e) => setFromSave(e.target.value)} onBlur={() => send({ fromSave: fromSave.trim() || null })} />
            </label>
          )}
          {error && (
            <span role="alert" className={s.error}>
              {error}
            </span>
          )}
          <section aria-label="Text" className={page.guideField}>
            <span className="label">Text</span>
            <GuideEditor buildId={target} sectionKey={key} initial={chapter.doc} label="Text" onStatus={onStatus} maxImages={{ max: STORY_IMAGES, message: STORY_IMAGE_ERROR }} />
          </section>
        </div>
      </main>
    </>
  );
}
