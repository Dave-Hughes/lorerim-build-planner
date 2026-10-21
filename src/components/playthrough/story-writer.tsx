"use client";

/* eslint-disable @next/next/no-img-element */
import type { Editor } from "@tiptap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { StoryText } from "@/components/build/story-view";
import { EditBar, useEditFrame, type SaveState } from "@/components/editor/edit-bar";
import { GuideEditor } from "@/components/guide/guide-editor";
import { insertImages } from "@/components/guide/image-upload";
import { saveKeptGuides, type GuideSaveStatus } from "@/components/guide/use-guide-autosave";
import { Images } from "@/components/editor/images-panel";
import { ImageSlot, focusPosition, type ImageFocus } from "@/components/ui/image-slot";
import { InfoTip } from "@/components/ui/info-tip";
import { saveGuideSection } from "@/lib/builds/actions";
import type { BuildVisibility } from "@/lib/builds/validate";
import { STORY_IMAGES, STORY_IMAGE_ERROR, lineDoc, type GuideDoc } from "@/lib/guide/doc";
import * as act from "@/lib/playthroughs/actions";
import r from "@/components/reader/reader.module.css";
import s from "./story-writer.module.css";

export interface WriterItem {
  key: string;
  href: string;
  title: string;
  chapterId?: number;
  /** A locked chapter: the objective that unlocks it (WO-118). */
  unlocks?: string | null;
}
export interface WriterGroup {
  /** "Prologue", "Act I The Sister's House"; none for the title page. */
  label: string | null;
  actId: number | null;
  reorder: boolean;
  items: WriterItem[];
  /** + Add a chapter. */
  add: boolean;
}
export interface WriterPage {
  key: string;
  kind: "title" | "story" | "chapter";
  where: string;
  kicker: string | null;
  title: string;
  titlePlaceholder: string;
  /** Under the title: the tale's line, the save a chapter was written from, the build Story's line; null: none here. */
  line: string | null;
  lineLabel: string | null;
  plate: string | null;
  /** What stays in view of the plate (WO-118): a chapter's, positioned here. */
  plateFocus: { x: number; y: number } | null;
  /** The text's first image, the plate readers see when it has none of its own. */
  fromText: string | null;
  doc: GuideDoc | null;
  chapterId: number | null;
  actId: number | null;
  /** Unlocks when (WO-118): a chapter in an act, none or one of the act's objectives. */
  unlocks: { value: number | null; options: { id: number; text: string }[] } | null;
}
type Owner = { kind: "run"; id: string; buildId: string; name: string; visibility: BuildVisibility } | { kind: "build"; id: string; name: string; visibility: BuildVisibility };
type Near = { href: string; title: string } | null;

/**
 * The Story written where it's read (WO-117), as the EditStory board: Contents on the left in reading
 * order, and on the right the reader's own plate (image, kicker, title, line) and 680px column,
 * typed in place. Images go where they show; a chapter in an act can say which objective unlocks it
 * (WO-118); Preview hides every control and shows the page as readers get it.
 */
export function StoryWriter({ owner, groups, page, prev, next }: { owner: Owner; groups: WriterGroup[]; page: WriterPage; prev: Near; next: Near }) {
  const router = useRouter();
  const run = owner.kind === "run";
  const target = run ? `p:${owner.id}` : owner.id;
  const sectionKey = page.kind === "story" ? "story" : page.chapterId !== null ? `chapter:${page.chapterId}` : page.actId !== null ? `act:${page.actId}` : "";
  const [preview, setPreview] = useState(false);
  const [band, setBand] = useState<SaveState>({ state: "idle" });
  const [editorStatus, setEditorStatus] = useState<{ status: GuideSaveStatus; error: string | null; retry: () => void } | null>(null);
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null, retry: () => void) => setEditorStatus({ status, error, retry }), []);
  useEffect(() => saveKeptGuides(target), [target]);
  const [doc, setDoc] = useState<GuideDoc | null>(page.doc);
  const [title, setTitle] = useState(page.title);
  const [line, setLine] = useState(page.line ?? "");
  const [plate, setPlate] = useState(page.plate);
  const [plateFocus, setPlateFocus] = useState(page.plateFocus);
  const frame = useEditFrame();
  const [unlocks, setUnlocks] = useState(page.unlocks?.value ?? null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [uploading, setUploading] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLInputElement>(null);

  const send = async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBand({ state: "saving" });
    const res = await fn();
    setBand(res.ok ? { state: "saved" } : { state: "failed", error: res.error ?? "That didn't save." });
    return res.ok;
  };
  const saveTitle = () => {
    const t = title.trim();
    if (!t && page.kind !== "title") return setTitle(page.title);
    if (t === page.title) return;
    if (!run) return void send(() => saveGuideSection(owner.id, "story:title", lineDoc(t)));
    if (page.kind === "title") return void send(() => act.saveDetails(owner.id, { taleTitle: t }));
    if (page.chapterId !== null) return void send(() => act.saveChapter(owner.id, page.chapterId!, { title: t }));
    if (page.actId !== null) return void send(() => act.writeActChapter(owner.id, page.actId!, { title: t }));
  };
  const saveLine = () => {
    const l = line.trim();
    if (l === (page.line ?? "").trim()) return;
    if (!run) return void send(() => saveGuideSection(owner.id, "story:line", lineDoc(l)));
    if (page.kind === "title") return void send(() => act.saveDetails(owner.id, { taleLine: l }));
    if (page.chapterId !== null) return void send(() => act.saveChapter(owner.id, page.chapterId!, { fromSave: l || null }));
  };
  const savePlate = async (url: string | null) => {
    if (!run) return;
    const ok = await send(() => (page.kind === "title" ? act.saveTalePicture(owner.id, url) : act.saveChapterImage(owner.id, page.chapterId!, url)));
    if (ok) {
      setPlate(url);
      setPlateFocus(null);
    }
  };
  const saveFocus = async (focus: ImageFocus) => {
    if (!run || page.chapterId === null) return;
    setPlateFocus(focus);
    await send(() => act.saveChapterFocus(owner.id, page.chapterId!, focus));
  };
  const upload = async (file: File | undefined) => {
    if (!file || !run) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/playthroughs/${owner.id}/images`, { method: "POST", body: form }).catch(() => null);
    const body = (await res?.json().catch(() => ({}))) as { url?: string; error?: string } | undefined;
    setUploading(false);
    if (body?.url) await savePlate(body.url);
    else setBand({ state: "failed", error: body?.error ?? "The upload didn't finish. Try again." });
  };

  // The band: the editor's own saving first, then the fields'.
  const shown: SaveState =
    editorStatus?.status === "failed"
      ? { state: "failed", error: editorStatus.error, retry: editorStatus.error?.startsWith("Too long") ? undefined : editorStatus.retry }
      : band.state === "failed"
        ? band
        : editorStatus?.status === "saving" || band.state === "saving"
          ? { state: "saving" }
          : { state: "saved" };
  const shownPlate = plate ?? (preview || !run ? page.fromText : null);
  const editBuildId = owner.kind === "run" ? owner.buildId : owner.id;

  return (
    <>
      <EditBar buildId={editBuildId} name={owner.name} current="story" visibility={owner.visibility} save={shown} />
      <main className={`page ${s.main}`}>
        <aside className={`${s.contents} ${preview ? s.dimmed : ""}`} aria-label="Contents">
          <span className={s.contentsHead}>
            <span className={s.head}>Contents</span>
            {run && <InfoTip label="About the contents" text="Drag a chapter to move it. A chapter sits in the Prologue or in an act; any chapter in an act can unlock when one of its objectives is done." />}
          </span>
          {groups.map((g, gi) => (
            <ContentsGroup key={gi} owner={owner} g={g} current={page.key} />
          ))}
        </aside>

        <div className={`${s.sheet} ${preview ? s.previewing : ""}`}>
          <div className={s.strip}>
            <span className="muted">{page.where}</span>
            <span className={s.stripRight}>
              {run && frame?.run && <Images runId={owner.id} groups={frame.run.pictures} />}
              <span className={s.seg} role="group" aria-label="Write or preview">
                <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>
                  Write
                </button>
                <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>
                  Preview
                </button>
              </span>
            </span>
          </div>

          <header className={`${s.plate} ${shownPlate ? "" : s.plateEmpty}`}>
            {/* Its own image, with Change, Position and Remove over it (WO-118); else the image readers get. */}
            {!preview && run && plate ? (
              <ImageSlot
                url={plate}
                focus={plateFocus}
                label="The image"
                busy={uploading}
                positionable={page.chapterId !== null}
                onFile={(file) => void upload(file)}
                onRemove={() => void savePlate(null)}
                onFocus={(focus) => void saveFocus(focus)}
                imageClassName={s.plateImage}
                toolsClassName={s.plateTools}
              >
                <div className={s.plateFade} aria-hidden="true" />
              </ImageSlot>
            ) : (
              shownPlate && (
                <>
                  <img src={shownPlate} alt="" className={s.plateImage} style={plate && plateFocus ? { objectPosition: focusPosition(plateFocus) } : undefined} />
                  <div className={s.plateFade} aria-hidden="true" />
                </>
              )
            )}
            {!preview && run && !plate && (page.kind === "title" || page.chapterId !== null) && (
              <input ref={picker} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label="The image" onChange={(ev) => void upload(ev.target.files?.[0])} />
            )}
            {!preview && run && !plate && (page.kind === "title" || page.chapterId !== null) && (
              <span className={s.plateSlot}>
                <button type="button" className="btn" onClick={() => picker.current?.click()}>
                  {uploading ? "Uploading" : "Add an image"}
                </button>
              </span>
            )}
            <div className={s.words}>
              {page.kicker && <span className={r.kicker}>{page.kicker}</span>}
              {preview ? (
                <h1 className={r.title}>{title || page.titlePlaceholder}</h1>
              ) : (
                <input className={`${r.title} ${s.titleInput}`} aria-label="Title" value={title} placeholder={page.titlePlaceholder} maxLength={60} onChange={(ev) => setTitle(ev.target.value)} onBlur={saveTitle} />
              )}
              {page.lineLabel &&
                (preview ? (
                  line && <p className={r.line}>{page.kind === "chapter" ? `From ${line.toLowerCase()}` : line}</p>
                ) : (
                  <input
                    className={`${r.line} ${s.lineInput}`}
                    aria-label={page.lineLabel}
                    value={line}
                    placeholder={page.kind === "chapter" ? "[Save 7, 19 Oct 2026]" : "[A line under the title]"}
                    maxLength={page.kind === "chapter" ? 60 : 140}
                    onChange={(ev) => setLine(ev.target.value)}
                    onBlur={saveLine}
                  />
                ))}
            </div>
          </header>

          {page.unlocks && page.chapterId !== null && run && !preview && (
            <div className={s.opens}>
              <label className="muted" htmlFor="unlocks-when">
                Unlocks when
              </label>
              <select
                id="unlocks-when"
                className={`select ${s.opensSelect}`}
                value={unlocks ?? ""}
                onChange={(ev) => {
                  const v = ev.target.value ? Number(ev.target.value) : null;
                  setUnlocks(v);
                  void send(() => act.saveChapter(owner.id, page.chapterId!, { unlocksWhen: v }));
                }}
              >
                <option value="">None</option>
                {page.unlocks.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.text}
                  </option>
                ))}
              </select>
              <InfoTip label="About unlocks when" text="Readers see the chapter once this objective is done. Until then the story shows its title and what unlocks it." />
            </div>
          )}

          <div className={r.body}>
            {page.kind !== "title" && doc && (
              <article className={`${r.col} ${s.col}`}>
                {preview ? (
                  <StoryText doc={doc} idPrefix={`w${page.key}`} cap skipOpening={!plate && !!page.fromText} />
                ) : (
                  <>
                    <span className={s.insert}>
                      <button type="button" className="btn btn-sm" disabled={!editor} onClick={() => image.current?.click()}>
                        + Image
                      </button>
                      <button type="button" className="btn btn-sm" disabled={!editor} onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                        + Break
                      </button>
                      <span className={s.insertRule} aria-hidden="true" />
                      <input
                        ref={image}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="sr-only"
                        aria-label="Add an image to the text"
                        onChange={(ev) => {
                          const files = [...(ev.target.files ?? [])];
                          if (editor && files.length) void insertImages(editor, target, files);
                          ev.target.value = "";
                        }}
                      />
                    </span>
                    <div className={s.editor}>
                      <GuideEditor
                        key={page.key}
                        buildId={target}
                        sectionKey={sectionKey}
                        initial={doc}
                        label="Text"
                        placeholder="[The story goes here.]"
                        onStatus={onStatus}
                        onChange={setDoc}
                        onEditor={setEditor}
                        maxImages={{ max: STORY_IMAGES, message: STORY_IMAGE_ERROR }}
                      />
                    </div>
                  </>
                )}
              </article>
            )}
            <nav className={s.foot} aria-label="The story">
              {prev ? (
                <Link href={prev.href} className={s.footLink}>
                  ‹ {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {!preview && run && page.chapterId !== null ? (
                <button
                  type="button"
                  className={s.remove}
                  onClick={() => {
                    if (!window.confirm(`Remove ${page.title}?`)) return;
                    void send(() => act.removeChapter(owner.id, page.chapterId!)).then((ok) => ok && router.push(`/p/${owner.id}/edit/story`));
                  }}
                >
                  Remove this chapter
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={next.href} className={s.footLink}>
                  {next.title} ›
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}

function ContentsGroup({ owner, g, current }: { owner: Owner; g: WriterGroup; current: string }) {
  const router = useRouter();
  const [dragging, setDragging] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pid = owner.id;
  const make = async () => {
    setError(null);
    const res = await act.newChapter(pid, { title: "A new chapter", actId: g.actId });
    if (res.ok) router.push(`/p/${pid}/edit/story/${res.value}`);
    else setError(res.error);
  };
  const row = (it: WriterItem, i: number) => {
    const drag =
      owner.kind === "run" && g.reorder && it.chapterId !== undefined
        ? {
            draggable: true,
            onDragStart: () => setDragging(it.chapterId!),
            onDragOver: (ev: React.DragEvent) => dragging !== null && ev.preventDefault(),
            onDrop: async (ev: React.DragEvent) => {
              ev.preventDefault();
              if (dragging === null || dragging === it.chapterId) return;
              setDragging(null);
              const res = await act.moveChapter(pid, dragging, i + 1);
              if (res.ok) router.refresh();
              else setError(res.error);
            },
            onDragEnd: () => setDragging(null),
          }
        : {};
    return (
      <Link key={it.key} href={it.href} className={`${s.item} ${it.unlocks ? s.itemLocked : ""}`} aria-current={it.key === current ? "page" : undefined} {...drag}>
        <span className={s.itemTitle}>
          {it.unlocks && <img src="/icons/mark-lock.svg" alt="Locked" width={16} height={16} className="px" />}
          {it.title}
        </span>
        {it.unlocks && <span className={s.tag}>Unlocks when: {it.unlocks}</span>}
      </Link>
    );
  };
  return (
    <div className={s.group} role={g.label ? "group" : undefined} aria-label={g.label ?? undefined}>
      {g.label && <span className={`${s.groupHead} ${g.items.length ? "" : s.groupEmpty}`}>{g.label}</span>}
      {g.items.map((it, i) => row(it, i))}
      {g.label && !g.items.length && <span className={s.nothing}>Nothing written yet.</span>}
      {owner.kind === "run" && g.add && (
        <button type="button" className={s.addRow} onClick={() => void make()}>
          + Add a chapter
        </button>
      )}
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </div>
  );
}
