"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { LINK_ERROR, isSafeHref, isYoutubeUrl, type GuideDoc } from "@/lib/guide/doc";
import { createEditorHandlers, guideExtensions, transformPastedHTML, type MenuBridge, type SlashItem } from "./extensions";
import { useGameData } from "@/components/game-data";
import { searchMentions, type MentionInfo } from "@/lib/guide/mention";
import { loadItems, loadedItems } from "@/lib/items/items";
import { MentionChipIcon } from "./mention-chip";
import { unsavedGuide, useGuideAutosave, type GuideSaveStatus } from "./use-guide-autosave";
import { Tooltip } from "@/components/ui/tooltip";
import { insertImages } from "./image-upload";
import prose from "./prose.module.css";
import styles from "./guide-editor.module.css";
import { pageZoom } from "@/lib/zoom";

export interface GuideEditorProps {
  buildId: string;
  sectionKey: string;
  initial: GuideDoc;
  /** The textbox's accessible name. */
  label: string;
  placeholder?: string;
  /** Overview: H2 and H3. Level notes: H3 only. */
  headingLevels?: (2 | 3)[];
  compact?: boolean;
  /** The intro: bold, italic and links only (implies compact). */
  inline?: boolean;
  onStatus?: (status: GuideSaveStatus, error: string | null, retry: () => void) => void;
  /** Every change, as it happens. */
  onChange?: (doc: GuideDoc) => void;
}

type Rect = { left: number; top: number; bottom: number };


const MENU_WIDTH = 320;
/** A floating menu's left edge: at the caret, but kept inside the screen. */
const menuLeft = (left: number) => Math.max(16, Math.min(left, window.innerWidth - Math.min(MENU_WIDTH, window.innerWidth - 32) - 16));

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

/** Small line icons for the toolbar, drawn on a 16px grid in the text colour. */
const ICONS: Record<string, React.ReactNode> = {
  Heading: <path d="M3 3v10M11 3v10M3 8h8" />,
  Bold: <path d="M4 3h5a2.5 2.5 0 0 1 0 5H4zM4 8h6a2.5 2.5 0 0 1 0 5H4z" />,
  Italic: <path d="M7 3h6M3 13h6M10 3 6 13" />,
  "Bulleted list": (
    <>
      <path d="M6 4h8M6 8h8M6 12h8" />
      <circle cx="2.5" cy="4" r="1" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  "Numbered list": <path d="M6 4h8M6 8h8M6 12h8M2 3h1v3M1.5 6h2M1.5 10.5c.5-1 2-1 2 0s-2 1.5-2 2.5h2" />,
  Quote: <path d="M3 4v8M6 5h7M6 8h7M6 11h5" />,
  Divider: <path d="M1 8h14M4 4h8M4 12h8" strokeDasharray="0" />,
  Link: <path d="M7 9a3 3 0 0 0 4.2 0l2-2a3 3 0 0 0-4.2-4.2l-.8.8M9 7a3 3 0 0 0-4.2 0l-2 2a3 3 0 0 0 4.2 4.2l.8-.8" />,
  Image: (
    <>
      <rect x="1.5" y="2.5" width="13" height="11" />
      <path d="m2 12 4-4 3 3 2-2 3 3" />
      <circle cx="11" cy="5.5" r="1" />
    </>
  ),
};

function ToolIcon({ name }: { name: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/** "Bold  ⌘B" on a Mac, "Bold  Ctrl+B" elsewhere. */
function shortcut(keys: string): string {
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return mac ? keys.replace("Mod+Shift+", "⌘⇧").replace("Mod+Alt+", "⌘⌥").replace("Mod+", "⌘") : keys.replace("Mod+", "Ctrl+");
}

type Tool = { name: string; keys?: string; on: boolean; run: () => void };

/**
 * The formatting toolbar, always visible at the top of the field (sticky in a long guide). Level
 * notes get the short set; the guide gets the full set and More for the rarer blocks.
 */
function Toolbar({
  editor,
  inline,
  full,
  levels,
  onLink,
  onImage,
  onYoutube,
}: {
  editor: Editor;
  inline: boolean;
  full: boolean;
  levels: (2 | 3)[];
  onLink: () => void;
  onImage: () => void;
  onYoutube: () => void;
}) {
  const [more, setMore] = useState(false);
  // Opened without taking focus from the text, so Esc leaves focus in the editor.
  const moreWrap = useRef<HTMLSpanElement>(null);
  useDismiss({ open: more, onClose: () => setMore(false), inside: [moreWrap] });
  const c = () => editor.chain().focus();
  const level = levels[0] ?? 2;
  const tools: Tool[] = inline
    ? [
        { name: "Bold", keys: "Mod+B", on: editor.isActive("bold"), run: () => c().toggleBold().run() },
        { name: "Italic", keys: "Mod+I", on: editor.isActive("italic"), run: () => c().toggleItalic().run() },
        { name: "Link", on: editor.isActive("link"), run: onLink },
      ]
    : full
    ? [
        { name: "Heading", keys: `Mod+Alt+${level}`, on: editor.isActive("heading"), run: () => c().toggleHeading({ level }).run() },
        { name: "Bold", keys: "Mod+B", on: editor.isActive("bold"), run: () => c().toggleBold().run() },
        { name: "Italic", keys: "Mod+I", on: editor.isActive("italic"), run: () => c().toggleItalic().run() },
        { name: "Bulleted list", keys: "Mod+Shift+8", on: editor.isActive("bulletList"), run: () => c().toggleBulletList().run() },
        { name: "Numbered list", keys: "Mod+Shift+7", on: editor.isActive("orderedList"), run: () => c().toggleOrderedList().run() },
        { name: "Quote", keys: "Mod+Shift+B", on: editor.isActive("blockquote"), run: () => c().toggleBlockquote().run() },
        { name: "Divider", on: false, run: () => c().setHorizontalRule().run() },
        { name: "Link", on: editor.isActive("link"), run: onLink },
        { name: "Image", on: false, run: onImage },
      ]
    : [
        { name: "Bold", keys: "Mod+B", on: editor.isActive("bold"), run: () => c().toggleBold().run() },
        { name: "Italic", keys: "Mod+I", on: editor.isActive("italic"), run: () => c().toggleItalic().run() },
        { name: "Bulleted list", keys: "Mod+Shift+8", on: editor.isActive("bulletList"), run: () => c().toggleBulletList().run() },
        { name: "Divider", on: false, run: () => c().setHorizontalRule().run() },
        { name: "Link", on: editor.isActive("link"), run: onLink },
      ];
  const moreItems: { name: string; on: boolean; run: () => void }[] = [
    { name: "Tip", on: editor.isActive("tip"), run: () => c().wrapIn("tip").run() },
    { name: "Warning", on: editor.isActive("warning"), run: () => c().wrapIn("warning").run() },
    { name: "Spoiler", on: editor.isActive("spoiler"), run: () => c().wrapIn("spoiler").run() },
    { name: "YouTube video", on: false, run: onYoutube },
  ];
  return (
    <div role="toolbar" aria-label="Format" className={styles.toolbar}>
      {tools.map((t) => (
        <Tooltip key={t.name} content={t.keys ? `${t.name}  ${shortcut(t.keys)}` : t.name}>
          <button
            type="button"
            className={styles.tool}
            aria-label={t.name}
            aria-pressed={t.on}
            // Keep the selection: act on mousedown without taking focus from the editor.
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
          >
            <ToolIcon name={t.name} />
          </button>
        </Tooltip>
      ))}
      {full && (
        <span ref={moreWrap} className={styles.moreWrap}>
          <button type="button" className={`${styles.tool} ${styles.toolText}`} aria-haspopup="menu" aria-expanded={more} onMouseDown={(e) => e.preventDefault()} onClick={() => setMore((m) => !m)}>
            More
          </button>
          {more && (
            <span role="menu" aria-label="More blocks" className={styles.moreMenu}>
              {moreItems.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  role="menuitem"
                  className={styles.moreItem}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setMore(false);
                    m.run();
                  }}
                >
                  {m.name}
                </button>
              ))}
            </span>
          )}
        </span>
      )}
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
    <div className={styles.floating} style={{ left: menuLeft(rect.left), top: rect.bottom + 6 }}>
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

interface MenuState<T> {
  items: T[];
  index: number;
  rect: Rect;
  command: (item: T) => void;
}

const NO_RECT: Rect = { left: 0, top: 0, bottom: 0 };
const toRect = (r: DOMRect): Rect => ({ left: r.left, top: r.top, bottom: r.bottom });

/** State and keyboard handling for a suggestion menu ("/" blocks or "@" mentions). */
function useMenu<T>() {
  const [menu, setMenu] = useState<MenuState<T> | null>(null);
  const bridge = (items: (q: string) => T[] | Promise<T[]>): MenuBridge<T> => ({
    items,
    onStart: (p) => {
      const r = p.clientRect?.();
      if (r) setMenu({ items: p.items, index: 0, rect: toRect(r), command: p.command });
    },
    onUpdate: (p) => {
      const r = p.clientRect?.();
      setMenu((m) => ({ items: p.items, index: Math.min(m?.index ?? 0, Math.max(0, p.items.length - 1)), rect: r ? toRect(r) : (m?.rect ?? NO_RECT), command: p.command }));
    },
    onExit: () => setMenu(null),
    onKeyDown: (event) => {
      const m = menu;
      if (!m || !m.items.length) return false;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const step = event.key === "ArrowDown" ? 1 : -1;
        setMenu({ ...m, index: (m.index + step + m.items.length) % m.items.length });
        return true;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        m.command(m.items[m.index]);
        return true;
      }
      if (event.key === "Escape") {
        setMenu(null);
        return true;
      }
      return false;
    },
  });
  // The mouse moves the same highlight the keys do (WO-57), so Enter picks what's lit.
  const highlight = (i: number) => setMenu((m) => (m && m.index !== i ? { ...m, index: i } : m));
  return { menu, bridge, close: () => setMenu(null), highlight };
}

const MENU_ITEM = 38;

function Menu<T>({
  state,
  id,
  label,
  onPick,
  onHighlight,
  onClose,
  render,
}: {
  state: MenuState<T>;
  id: string;
  label: string;
  onPick: (i: number) => void;
  onHighlight: (i: number) => void;
  onClose: () => void;
  render: (item: T) => React.ReactNode;
}) {
  // A click outside the list closes it (Esc is the editor's: the suggestion handles it, focus stays in the text).
  const floating = useRef<HTMLDivElement>(null);
  useDismiss({ open: state.items.length > 0, onClose, inside: [floating] });
  if (!state.items.length) return null;
  // Every item shows: open below the caret, or above it when there isn't room below.
  const height = state.items.length * MENU_ITEM + 10;
  // Measured in screen pixels, placed in the page's (scaled up on a big monitor, WO-35).
  const z = pageZoom();
  const below = window.innerHeight - state.rect.bottom - 14;
  const above = state.rect.top - 14;
  const up = height > below && above > below;
  const room = Math.max(160, up ? above : below);
  return (
    <div
      ref={floating}
      className={styles.floating}
      style={{ left: menuLeft(state.rect.left) / z, ...(up ? { bottom: (window.innerHeight - state.rect.top + 6) / z } : { top: (state.rect.bottom + 6) / z }), ["--menu-max" as string]: `${room / z}px` }}
    >
      <ul role="listbox" id={id} aria-label={label} className={styles.menu}>
        {state.items.map((item, i) => (
          <li
            key={i}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === state.index}
            className={styles.menuItem}
            onMouseEnter={() => onHighlight(i)}
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(i);
            }}
          >
            {render(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GuideEditor({ buildId, sectionKey, initial, label, placeholder = "", headingLevels = [2, 3], compact: compactProp, inline = false, onStatus, onChange }: GuideEditorProps) {
  const compact = compactProp || inline;
  const { status, error, change, retry } = useGuideAutosave(buildId, sectionKey);
  useEffect(() => onStatus?.(status, error, retry), [status, error, retry, onStatus]);

  const coarse = useCoarsePointer();
  const [focused, setFocused] = useState(false);
  const inset = useKeyboardInset(coarse && focused);
  const [linking, setLinking] = useState(false);
  const [youtube, setYoutube] = useState<Rect | null>(null);
  const d = useGameData();
  const { menu: slash, bridge: slashBridge, close: closeSlash, highlight: highlightSlash } = useMenu<SlashItem>();
  const { menu: mention, bridge: mentionBridge, close: closeMention, highlight: highlightMention } = useMenu<MentionInfo>();
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
  const [extensions] = useState(() => guideExtensions({ placeholder, headingLevels, slash: handlers.slash, mention: handlers.mention, onLink: handlers.onLink, inlineOnly: inline }));

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
        if (inline) return true; // The intro takes no images.
        handlers.onFiles(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.length) return false;
        if (inline) return true;
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
    handlers.set({
      slash: slashBridge(items),
      // "@" searches the build's own LoreRim version, items included once their index is fetched
      // (the first "@" fetches it; until then the game's other things show).
      mention: mentionBridge((q) => {
        const now = searchMentions(d, q);
        if (loadedItems(d.version.id) || !q.trim()) {
          if (!q.trim()) void loadItems(d.version.id);
          return now;
        }
        return loadItems(d.version.id).then(() => searchMentions(d, q));
      }),
      link: () => setLinking(true),
      files: (files, pos) => editor && void insertImages(editor, buildId, files, pos),
    });
  });

  // Text kept in this browser from a save that didn't finish: save it now.
  useEffect(() => {
    if (editor && startDoc.unsaved) change(startDoc.doc);
  }, [editor, startDoc, change]);

  // The "/" menu is a listbox the textbox controls; screen readers follow the highlighted option.
  useEffect(() => {
    const dom = editor?.view.dom;
    if (!dom) return;
    const open = slash?.items.length ? { id: menuId, index: slash.index } : mention?.items.length ? { id: `${menuId}-at`, index: mention.index } : null;
    if (open) {
      dom.setAttribute("aria-controls", open.id);
      dom.setAttribute("aria-activedescendant", `${open.id}-${open.index}`);
    } else {
      dom.removeAttribute("aria-controls");
      dom.removeAttribute("aria-activedescendant");
    }
  }, [editor, slash, mention, menuId]);

  // Close the link form when the selection collapses.
  useEffect(() => {
    if (!editor) return;
    const off = () => editor.state.selection.empty && !editor.isActive("link") && setLinking(false);
    editor.on("selectionUpdate", off);
    return () => void editor.off("selectionUpdate", off);
  }, [editor]);

  if (!editor) return <div className={`${prose.prose} ${styles.content} ${compact ? styles.compact : ""}`} aria-busy="true" />;

  const openLink = () => setLinking(true);
  const toolbar = (
    <Toolbar
      editor={editor}
      inline={inline}
      full={!compact}
      levels={headingLevels}
      onLink={openLink}
      onImage={() => filePicker?.click()}
      onYoutube={() => {
        const c = editor.view.coordsAtPos(editor.state.selection.from);
        setYoutube({ left: c.left, top: c.top, bottom: c.bottom });
      }}
    />
  );
  return (
    <div className={styles.wrap}>
      {!coarse && (
        <div className={styles.toolbarBar}>
          {toolbar}
          {linking && <LinkForm editor={editor} onDone={() => setLinking(false)} />}
        </div>
      )}
      <EditorContent editor={editor} />
      {slash && <Menu state={slash} id={menuId} label="Blocks" onPick={(i) => slash.command(slash.items[i])} onHighlight={highlightSlash} onClose={closeSlash} render={(item) => item.title} />}
      {mention && (
        <Menu
          state={mention}
          id={`${menuId}-at`}
          label="Game things"
          onPick={(i) => mention.command(mention.items[i])}
          onHighlight={highlightMention}
          onClose={closeMention}
          render={(m) => (
            <span className={styles.mentionItem}>
              <MentionChipIcon info={m} />
              <span>{m.name}</span>
              <span className={styles.mentionKind}>{m.kindLabel}</span>
            </span>
          )}
        />
      )}
      {/* The intro takes no images. */}
      {!inline && (
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
      )}
      {youtube && <YoutubePrompt editor={editor} rect={youtube} onDone={() => setYoutube(null)} />}
      {coarse && focused && (
        // On touch devices the toolbar sits above the keyboard, not over the selection.
        <div className={styles.touchBar} style={{ bottom: inset }}>
          {linking ? <LinkForm editor={editor} onDone={() => setLinking(false)} /> : toolbar}
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
