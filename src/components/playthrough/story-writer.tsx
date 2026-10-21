"use client";

/* eslint-disable @next/next/no-img-element */
import type { Editor } from "@tiptap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { StoryText } from "@/components/build/story-view";
import { EditBar, type SaveState } from "@/components/editor/edit-bar";
import { GuideEditor } from "@/components/guide/guide-editor";
import { insertImages } from "@/components/guide/image-upload";
import { saveKeptGuides, type GuideSaveStatus } from "@/components/guide/use-guide-autosave";
import { InfoTip } from "@/components/ui/info-tip";
import { saveGuideSection } from "@/lib/builds/actions";
import type { BuildVisibility } from "@/lib/builds/validate";
import { STORY_IMAGES, STORY_IMAGE_ERROR, lineDoc, type GuideDoc } from "@/lib/guide/doc";
import * as act from "@/lib/playthroughs/actions";
import type { ChapterKind } from "@/lib/playthroughs/types";
import r from "@/components/reader/reader.module.css";
import s from "./story-writer.module.css";

export interface WriterItem {
  key: string;
  href: string;
  title: string;
  /** "Entry", "Beat": a muted tag on the row. */
  tag?: string;
  /** An act's chapter not written yet: a dashed row. */
  dashed?: boolean;
  chapterId?: number;
}
export interface WriterGroup {
  label: string | null;
  actId: number | null;
  reorder: boolean;
  /** An act's own chapter, first in its group. */
  act?: WriterItem;
  items: WriterItem[];
  adds: { kind: "chapter" | "entry-or-beat"; label: string }[];
  /** An act with nothing written. */
  empty?: boolean;
  lastObjective?: number | null;
}
export interface WriterPage {
  key: string;
  kind: "title" | "story" | ChapterKind;
  where: string;
  kicker: string | null;
  title: string;
  titlePlaceholder: string;
  /** Under the title: the tale's line, an entry's save, the build Story's line; null: none here. */
  line: string | null;
  lineLabel: string | null;
  plate: string | null;
  /** The text's first image, the plate readers see when it has none of its own. */
  fromText: string | null;
  doc: GuideDoc | null;
  chapterId: number | null;
  actId: number | null;
  opens: { value: number | null; options: { id: number; text: string }[] } | null;
}
type Owner = { kind: "run"; id: string; buildId: string; name: string; visibility: BuildVisibility } | { kind: "build"; id: string; name: string; visibility: BuildVisibility };
type Near = { href: string; title: string } | null;

/**
 * The Story written where it's read (WO-117), as the EditStory board: Contents on the left in reading
 * order, and on the right the reader's own plate (picture, kicker, title, line) and 680px column,
 * typed in place. Pictures go where they show; an entry or beat says which objective opens it; Preview
 * hides every control and shows the page as readers get it.
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
  const [opens, setOpens] = useState(page.opens?.value ?? null);
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
    const ok = await send(() =>
      page.kind === "title" ? act.saveTalePicture(owner.id, url) : page.kind === "act" && page.actId !== null ? act.saveActImage(owner.id, page.actId, url) : act.saveChapterImage(owner.id, page.chapterId!, url),
    );
    if (ok) setPlate(url);
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
  const entryish = page.kind === "entry" || page.kind === "beat";
  const shownPlate = plate ?? (preview || !run ? page.fromText : null);
  const editBuildId = owner.kind === "run" ? owner.buildId : owner.id;

  return (
    <>
      <EditBar buildId={editBuildId} name={owner.name} current="story" visibility={owner.visibility} save={shown} />
      <main className={`page ${s.main}`}>
        <aside className={`${s.contents} ${preview ? s.dimmed : ""}`} aria-label="Contents">
          <span className={s.contentsHead}>
            <span className={s.head}>Contents</span>
            {run && <InfoTip label="About the contents" text="Drag a chapter to move it. Entries and beats belong to an act and open from one of its objectives." />}
          </span>
          {groups.map((g, gi) => (
            <ContentsGroup key={gi} owner={owner} g={g} current={page.key} />
          ))}
        </aside>

        <div className={`${s.sheet} ${preview ? s.previewing : ""}`}>
          <div className={s.strip}>
            <span className="muted">{page.where}</span>
            <span className={s.seg} role="group" aria-label="Write or preview">
              <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>
                Write
              </button>
              <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>
                Preview
              </button>
            </span>
          </div>

          <header className={`${s.plate} ${shownPlate ? "" : s.plateEmpty}`}>
            {shownPlate && (
              <>
                <img src={shownPlate} alt="" className={s.plateImage} />
                <div className={s.plateFade} aria-hidden="true" />
              </>
            )}
            {!preview && run && (
              <input ref={picker} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label="The image" onChange={(ev) => void upload(ev.target.files?.[0])} />
            )}
            {!preview && run && plate && (
              <span className={`on-image ${s.plateTools}`}>
                <button type="button" className="btn btn-sm" onClick={() => picker.current?.click()}>
                  {uploading ? "Uploading" : "Change the image"}
                </button>
                <button type="button" className="btn btn-sm" onClick={() => void savePlate(null)}>
                  Remove
                </button>
              </span>
            )}
            {!preview && run && !plate && (
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
                  line && <p className={r.line}>{page.kind === "entry" ? `From ${line.toLowerCase()}` : line}</p>
                ) : (
                  <input
                    className={`${r.line} ${s.lineInput}`}
                    aria-label={page.lineLabel}
                    value={line}
                    placeholder={page.kind === "entry" ? "[Save 7, 19 Oct 2026]" : "[A line under the title]"}
                    maxLength={page.kind === "entry" ? 60 : 140}
                    onChange={(ev) => setLine(ev.target.value)}
                    onBlur={saveLine}
                  />
                ))}
            </div>
          </header>

          {page.opens && run && !preview && (
            <div className={s.opens}>
              <label className="muted" htmlFor="opens-after">
                Opens when this is done:
              </label>
              <select
                id="opens-after"
                className={`select ${s.opensSelect}`}
                value={opens ?? ""}
                onChange={(ev) => {
                  const v = ev.target.value ? Number(ev.target.value) : null;
                  setOpens(v);
                  void send(() => act.saveChapter(owner.id, page.chapterId!, { opensAfter: v }));
                }}
              >
                {page.kind === "entry" && <option value="">No objective</option>}
                {page.opens.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.text}
                  </option>
                ))}
              </select>
              <InfoTip label="About opens when" text="Readers see this once the objective is done. Until then the story shows its title and what opens it." />
            </div>
          )}

          <div className={r.body}>
            {page.kind !== "title" && doc && (
              <article className={`${r.col} ${s.col}`}>
                {preview ? (
                  <div className={entryish ? r.entry : undefined}>
                    <StoryText doc={doc} idPrefix={`w${page.key}`} cap={!entryish} skipOpening={!plate && !!page.fromText} />
                  </div>
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
                    <div className={`${s.editor} ${entryish ? s.editorEntry : ""}`}>
                      <GuideEditor
                        key={page.key}
                        buildId={target}
                        sectionKey={sectionKey}
                        initial={doc}
                        label="Text"
                        placeholder={page.kind === "act" ? "[Write the act's chapter here: the story of this stretch, before she plays it.]" : "[The story goes here.]"}
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
                  Remove this {page.kind === "act" ? "chapter" : page.kind}
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
  const [adding, setAdding] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pid = owner.id;
  const make = async (kind: "chapter" | "entry" | "beat") => {
    setError(null);
    const res = await act.newChapter(pid, {
      kind,
      title: kind === "chapter" ? "A new chapter" : kind === "entry" ? "A new entry" : "A new beat",
      actId: g.actId,
      opensAfter: kind === "beat" ? (g.lastObjective ?? null) : null,
    });
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
      <Link key={it.key} href={it.href} className={`${s.item} ${it.dashed ? s.itemDashed : ""}`} aria-current={it.key === current ? "page" : undefined} {...drag}>
        <span>{it.title}</span>
        {it.tag && <span className={s.tag}>{it.tag}</span>}
      </Link>
    );
  };
  return (
    <div className={s.group}>
      {g.label && <span className={`${s.groupHead} ${g.empty ? s.groupEmpty : ""}`}>{g.label}</span>}
      {g.empty ? (
        <span className={s.nothing}>
          Nothing written yet. {g.act && <Link href={g.act.href}>Write the act&apos;s chapter ›</Link>}
        </span>
      ) : (
        <>
          {g.act && row(g.act, -1)}
          {g.items.map((it, i) => row(it, i))}
        </>
      )}
      {owner.kind === "run" &&
        !g.empty &&
        g.adds.map((a) =>
          a.kind === "chapter" ? (
            <button key={a.kind} type="button" className={s.addRow} onClick={() => void make("chapter")}>
              {a.label}
            </button>
          ) : adding ? (
            <span key={a.kind} className={s.addTwo}>
              <button type="button" className="btn btn-sm" onClick={() => void make("entry")}>
                An entry
              </button>
              <button type="button" className="btn btn-sm" disabled={!g.lastObjective} title={g.lastObjective ? undefined : "A beat opens from an objective: add one on Play first."} onClick={() => void make("beat")}>
                A beat
              </button>
            </span>
          ) : (
            <button key={a.kind} type="button" className={s.addRow} onClick={() => setAdding(true)}>
              {a.label}
            </button>
          ),
        )}
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </div>
  );
}
