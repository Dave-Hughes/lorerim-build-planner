"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { TextSelection } from "@tiptap/pm/state";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { LINK_ERROR, isSafeHref, isYoutubeUrl, type GuideDoc } from "@/lib/guide/doc";
import { createEditorHandlers, guideExtensions, transformPastedHTML, type SlashItem } from "./extensions";
import { unsavedGuide, useGuideAutosave, type GuideSaveStatus } from "./use-guide-autosave";
import { insertImages } from "./image-upload";
import prose from "./prose.module.css";
import styles from "./guide-editor.module.css";

export interface GuideEditorProps {
  buildId: string;
  sectionKey: string;
  initial: GuideDoc;
  /** The textbox's accessible name. */
  label: string;
  placeholder: string;
  /** Overview: H2 and H3. Level notes: H3 only. */
  headingLevels?: (2 | 3)[];
  compact?: boolean;
  onStatus?: (status: GuideSaveStatus, error: string | null, retry: () => void) => void;
  /** Every change, as it happens. */
  onChange?: (doc: GuideDoc) => void;
}

type Rect = { left: number; top: number; bottom: number };

// BubbleMenu re-sends its options to the editor whenever these props change identity,
// and every such update re-renders this component: they must be stable.
const BUBBLE_OPTIONS = { placement: "top", offset: 8, flip: true, shift: { padding: 8 } } as const;
const BUBBLE_KEY = "guideBubbleMenu";

/** "example.com/x" becomes "https://example.com/x"; anything else is left as typed. */
function normaliseHref(raw: string): string {
  const v = raw.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(v)) return `https://${v}`;
  return v;
}

function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const set = () => setCoarse(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return coarse;
}

/** Distance from the bottom of the layout viewport to the top of the on-screen keyboard. */
function useKeyboardInset(active: boolean): number {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) return;
    const set = () => setInset(Math.max(0, window.innerHeight - (vv.offsetTop + vv.height)));
    set();
    vv.addEventListener("resize", set);
    vv.addEventListener("scroll", set);
    return () => {
      vv.removeEventListener("resize", set);
      vv.removeEventListener("scroll", set);
    };
  }, [active]);
  return inset;
}

function Toolbar({ editor, levels, onLink }: { editor: Editor; levels: (2 | 3)[]; onLink: () => void }) {
  const b = (label: string, active: boolean, run: () => void) => (
    <button
      key={label}
      type="button"
      className={styles.tool}
      aria-pressed={active}
      // Keep the selection: act on mousedown without taking focus from the editor.
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
    >
      {label}
    </button>
  );
  return (
    <div role="toolbar" aria-label="Format" className={styles.toolbar}>
      {b("Bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
      {b("Italic", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
      {b("Strike", editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run())}
      {b("Link", editor.isActive("link"), onLink)}
      {levels.includes(2) && b("Heading 2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
      {levels.includes(3) && b("Heading 3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
      {b("Quote", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
    </div>
  );
}

function LinkForm({ editor, onDone }: { editor: Editor; onDone: () => void }) {
  const [value, setValue] = useState<string>(() => (editor.getAttributes("link").href as string | undefined) ?? "");
  const [error, setError] = useState<string | null>(null);
  const apply = () => {
    if (!value.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return onDone();
    }
    const href = normaliseHref(value);
    if (!isSafeHref(href)) return setError(LINK_ERROR);
    // Link the words, then put the cursor just after them so typing carries on outside the link.
    editor
      .chain()
      .extendMarkRange("link")
      .setLink({ href })
      .command(({ tr }) => {
        tr.setSelection(TextSelection.create(tr.doc, tr.selection.to)).removeStoredMark(editor.schema.marks.link);
        return true;
      })
      .run();
    editor.view.focus();
    onDone();
  };
  return (
    <div className={styles.linkForm}>
      <label className={styles.linkField}>
        <span className="sr-only">Link</span>
        <input
          className="input"
          type="url"
          inputMode="url"
          autoFocus
          value={value}
          placeholder="https://"
          aria-invalid={!!error}
          aria-describedby={error ? "guide-link-error" : undefined}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              editor.commands.focus();
              onDone();
            }
          }}
        />
      </label>
      <button type="button" className="btn btn-sm btn-primary" onMouseDown={(e) => e.preventDefault()} onClick={apply}>
        Apply
      </button>
      {editor.isActive("link") && (
        <button
          type="button"
          className="btn btn-sm btn-quiet"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            onDone();
          }}
        >
          Remove
        </button>
      )}
      {error && (
        <span id="guide-link-error" role="alert" className={`field-error ${styles.linkError}`}>
          {error}
        </span>
      )}
    </div>
  );
}

function YoutubePrompt({ editor, rect, onDone }: { editor: Editor; rect: Rect; onDone: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const apply = () => {
    const src = normaliseHref(value);
    if (!isYoutubeUrl(src)) return setError("Paste a YouTube link (youtube.com or youtu.be).");
    editor.chain().focus().setYoutubeVideo({ src }).run();
    onDone();
  };
  return (
    <div className={styles.floating} style={{ left: rect.left, top: rect.bottom + 6 }}>
      <div className={styles.linkForm}>
        <label className={styles.linkField}>
          <span className="sr-only">YouTube link</span>
          <input
            className="input"
            type="url"
            autoFocus
            value={value}
            placeholder="https://www.youtube.com/watch?v="
            aria-invalid={!!error}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                editor.commands.focus();
                onDone();
              }
            }}
          />
        </label>
        <button type="button" className="btn btn-sm btn-primary" onClick={apply}>
          Add
        </button>
        {error && (
          <span role="alert" className={`field-error ${styles.linkError}`}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

interface SlashState {
  items: SlashItem[];
  index: number;
  rect: Rect;
  command: (item: SlashItem) => void;
}

function SlashMenu({ state, onPick, id }: { state: SlashState; onPick: (i: number) => void; id: string }) {
  if (!state.items.length) return null;
  return (
    <div className={styles.floating} style={{ left: state.rect.left, top: state.rect.bottom + 6 }}>
      <ul role="listbox" id={id} aria-label="Blocks" className={styles.menu}>
        {state.items.map((item, i) => (
          <li
            key={item.title}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === state.index}
            className={styles.menuItem}
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(i);
            }}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GuideEditor({ buildId, sectionKey, initial, label, placeholder, headingLevels = [2, 3], compact, onStatus, onChange }: GuideEditorProps) {
  const { status, error, change, retry } = useGuideAutosave(buildId, sectionKey);
  useEffect(() => onStatus?.(status, error, retry), [status, error, retry, onStatus]);

  const coarse = useCoarsePointer();
  const [focused, setFocused] = useState(false);
  const inset = useKeyboardInset(coarse && focused);
  const [linking, setLinking] = useState(false);
  const [youtube, setYoutube] = useState<Rect | null>(null);
  const [slash, setSlash] = useState<SlashState | null>(null);
  const [handlers] = useState(createEditorHandlers);
  const [filePicker, setFilePicker] = useState<HTMLInputElement | null>(null);
  const menuId = `guide-blocks-${sectionKey.replace(":", "-")}`;

  const items = useCallback(
    (query: string): SlashItem[] => {
      const q = query.toLowerCase();
      const all: SlashItem[] = [
        ...(headingLevels.includes(2)
          ? [{ title: "Heading", keywords: "heading h2 title", run: (e: Editor, r: { from: number; to: number }) => e.chain().focus().deleteRange(r).setNode("heading", { level: 2 }).run() }]
          : [{ title: "Heading", keywords: "heading h3 title", run: (e: Editor, r: { from: number; to: number }) => e.chain().focus().deleteRange(r).setNode("heading", { level: 3 }).run() }]),
        { title: "Bulleted list", keywords: "bullet list ul", run: (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run() },
        { title: "Numbered list", keywords: "numbered ordered list ol", run: (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run() },
        { title: "Quote", keywords: "quote blockquote", run: (e, r) => e.chain().focus().deleteRange(r).toggleBlockquote().run() },
        { title: "Divider", keywords: "divider rule line hr", run: (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run() },
        { title: "Tip", keywords: "tip note", run: (e, r) => e.chain().focus().deleteRange(r).wrapIn("tip").run() },
        { title: "Warning", keywords: "warning caution", run: (e, r) => e.chain().focus().deleteRange(r).wrapIn("warning").run() },
        { title: "Spoiler", keywords: "spoiler hidden", run: (e, r) => e.chain().focus().deleteRange(r).wrapIn("spoiler").run() },
        {
          title: "Image",
          keywords: "image picture screenshot photo",
          run: (e, r) => {
            e.chain().focus().deleteRange(r).run();
            filePicker?.click();
          },
        },
        {
          title: "YouTube video",
          keywords: "youtube video embed",
          run: (e, r) => {
            const c = e.view.coordsAtPos(r.from);
            e.chain().focus().deleteRange(r).run();
            setYoutube({ left: c.left, top: c.top, bottom: c.bottom });
          },
        },
      ];
      return all.filter((i) => !q || i.title.toLowerCase().includes(q) || i.keywords.includes(q));
    },
    [headingLevels, filePicker],
  );


  // Created once; the extensions read the latest handlers through the boxes above.
  const [extensions] = useState(() => guideExtensions({ placeholder, headingLevels, slash: handlers.slash, onLink: handlers.onLink }));

  const [startDoc] = useState<{ doc: GuideDoc; unsaved: boolean }>(() => {
    const kept = unsavedGuide(buildId, sectionKey);
    return kept ? { doc: kept, unsaved: true } : { doc: initial, unsaved: false };
  });

  const editor = useEditor({
    extensions,
    content: startDoc.doc,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        "aria-label": label,
        "aria-multiline": "true",
        role: "textbox",
        class: `${prose.prose} ${styles.content} ${compact ? styles.compact : ""}`,
      },
      transformPastedHTML,
      // Images dropped or pasted in are uploaded where they land.
      handleDrop: (view, event, _slice, moved) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) => f.type.startsWith("image/") || f.name.includes("."));
        if (moved || !files.length) return false;
        event.preventDefault();
        handlers.onFiles(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.length) return false;
        handlers.onFiles(files);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      const doc = editor.getJSON() as GuideDoc;
      change(doc);
      onChange?.(doc);
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  });

  // Give the editor's extensions this render's handlers.
  useLayoutEffect(() => {
    handlers.set(
      {
        items,
        onStart: (p) => {
          const r = p.clientRect?.();
          if (r) setSlash({ items: p.items, index: 0, rect: { left: r.left, top: r.top, bottom: r.bottom }, command: p.command });
        },
        onUpdate: (p) => {
          const r = p.clientRect?.();
          setSlash((s) => ({ items: p.items, index: Math.min(s?.index ?? 0, Math.max(0, p.items.length - 1)), rect: r ? { left: r.left, top: r.top, bottom: r.bottom } : (s?.rect ?? { left: 0, top: 0, bottom: 0 }), command: p.command }));
        },
        onExit: () => setSlash(null),
        onKeyDown: (event) => {
          const s = slash;
          if (!s || !s.items.length) return false;
          if (event.key === "ArrowDown") {
            setSlash({ ...s, index: (s.index + 1) % s.items.length });
            return true;
          }
          if (event.key === "ArrowUp") {
            setSlash({ ...s, index: (s.index - 1 + s.items.length) % s.items.length });
            return true;
          }
          if (event.key === "Enter") {
            s.command(s.items[s.index]);
            return true;
          }
          if (event.key === "Escape") {
            setSlash(null);
            return true;
          }
          return false;
        },
      },
      () => setLinking(true),
      (files, pos) => editor && void insertImages(editor, buildId, files, pos),
    );
  });

  // Text kept in this browser from a save that didn't finish: save it now.
  useEffect(() => {
    if (editor && startDoc.unsaved) change(startDoc.doc);
  }, [editor, startDoc, change]);

  // The "/" menu is a listbox the textbox controls; screen readers follow the highlighted option.
  useEffect(() => {
    const dom = editor?.view.dom;
    if (!dom) return;
    if (slash?.items.length) {
      dom.setAttribute("aria-controls", menuId);
      dom.setAttribute("aria-activedescendant", `${menuId}-${slash.index}`);
    } else {
      dom.removeAttribute("aria-controls");
      dom.removeAttribute("aria-activedescendant");
    }
  }, [editor, slash, menuId]);

  // Close the link form when the selection collapses.
  useEffect(() => {
    if (!editor) return;
    const off = () => editor.state.selection.empty && !editor.isActive("link") && setLinking(false);
    editor.on("selectionUpdate", off);
    return () => void editor.off("selectionUpdate", off);
  }, [editor]);

  // Stable between renders (see BUBBLE_OPTIONS); changes only when the link form opens or closes.
  const shouldShow = useCallback(
    ({ editor: e, state }: { editor: Editor; state: Editor["state"] }) => e.isEditable && (!state.selection.empty || (linking && e.isActive("link"))),
    [linking],
  );

  if (!editor) return <div className={`${prose.prose} ${styles.content} ${compact ? styles.compact : ""}`} aria-busy="true" />;

  const openLink = () => setLinking(true);
  return (
    <div className={styles.wrap}>
      {!coarse && (
        <BubbleMenu
          editor={editor}
          pluginKey={BUBBLE_KEY}
          shouldShow={shouldShow}
          options={BUBBLE_OPTIONS}
          className={styles.bubble}
        >
          {linking ? <LinkForm editor={editor} onDone={() => setLinking(false)} /> : <Toolbar editor={editor} levels={headingLevels} onLink={openLink} />}
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
      {slash && <SlashMenu state={slash} id={menuId} onPick={(i) => slash.command(slash.items[i])} />}
      <input
        ref={setFilePicker}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        hidden
        aria-label="Add images"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) void insertImages(editor, buildId, files);
        }}
      />
      {youtube && <YoutubePrompt editor={editor} rect={youtube} onDone={() => setYoutube(null)} />}
      {coarse && focused && (
        // On touch devices the toolbar sits above the keyboard, not over the selection.
        <div className={styles.touchBar} style={{ bottom: inset }}>
          {linking ? <LinkForm editor={editor} onDone={() => setLinking(false)} /> : <Toolbar editor={editor} levels={headingLevels} onLink={openLink} />}
        </div>
      )}
    </div>
  );
}

/** "Saved", "Saving…", or why it isn't saved. */
export function guideSaveLabel(status: GuideSaveStatus, error: string | null): string | null {
  if (status === "saving") return "Saving…";
  if (status === "saved") return "Saved";
  if (status === "failed") return error ? `Not saved. ${error}` : "Not saved";
  return null;
}
