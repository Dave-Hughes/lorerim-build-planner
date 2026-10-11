/**
 * The guide editor's Tiptap setup: StarterKit trimmed to the guide's node and
 * mark types (src/lib/guide/doc.ts), the Tip / Warning / Spoiler blocks, the
 * "/" block menu and Ctrl/Cmd+K for links.
 */
import { Extension, Node, mergeAttributes, type Editor, type Range } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import { isSafeHref } from "@/lib/guide/doc";
import type { MentionInfo } from "@/lib/guide/mention";
import { GuideImage } from "./image-node";
import { guideMention } from "./mention-node";

export type CalloutName = "tip" | "warning" | "spoiler";

/** A framed block (Tip, Warning) or a closed one (Spoiler) holding ordinary paragraphs and lists. */
function callout(name: CalloutName) {
  return Node.create({
    name,
    group: "block",
    content: "block+",
    defining: true,
    parseHTML() {
      return [{ tag: `div[data-callout="${name}"]` }];
    },
    renderHTML({ HTMLAttributes }) {
      return ["div", mergeAttributes(HTMLAttributes, { "data-callout": name }), 0];
    },
  });
}

/**
 * Leaving a block: Enter on an empty last line of a Tip, Warning, Spoiler or quote moves that
 * line out below it, and Backspace at the start of an empty one does the same, as in lists.
 */
const BlockExit = Extension.create({
  name: "blockExit",
  addKeyboardShortcuts() {
    const containers = ["tip", "warning", "spoiler", "blockquote"];
    const exit = (atStartOnly: boolean) => () => {
      const { state } = this.editor;
      const { $from, empty } = state.selection;
      if (!empty || $from.depth < 2) return false;
      const para = $from.parent;
      const box = $from.node($from.depth - 1);
      if (para.type.name !== "paragraph" || para.content.size !== 0 || !containers.includes(box.type.name)) return false;
      if (!atStartOnly && $from.index($from.depth - 1) !== box.childCount - 1) return false;
      return this.editor.commands.lift(box.type.name);
    };
    return { Enter: exit(false), Backspace: exit(true) };
  },
});

export interface SlashItem {
  title: string;
  keywords: string;
  run: (editor: Editor, range: Range) => void;
}

/** Connects a suggestion plugin ("/" blocks, "@" mentions) to the React component that draws its menu. */
export interface MenuBridge<T> {
  items: (query: string) => T[];
  onStart: (props: SuggestionProps<T>) => void;
  onUpdate: (props: SuggestionProps<T>) => void;
  onExit: () => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
}
export type SlashBridge = MenuBridge<SlashItem>;

function forwardMenu<T>(get: () => MenuBridge<T> | null): MenuBridge<T> {
  return {
    items: (q) => get()?.items(q) ?? [],
    onStart: (p) => get()?.onStart(p),
    onUpdate: (p) => get()?.onUpdate(p),
    onExit: () => get()?.onExit(),
    onKeyDown: (e) => get()?.onKeyDown(e) ?? false,
  };
}

/**
 * The editor is created once, but the React component's handlers change every render.
 * These forwarders are what the extensions hold; `set` swaps in the latest handlers.
 */
export function createEditorHandlers() {
  let current: {
    slash: SlashBridge;
    mention: MenuBridge<MentionInfo>;
    link: () => void;
    files: (files: File[], pos?: number) => void;
  } | null = null;
  return {
    slash: forwardMenu(() => current?.slash ?? null),
    mention: forwardMenu(() => current?.mention ?? null),
    onLink: () => current?.link(),
    /** Image files dropped or pasted into the editor. */
    onFiles: (f: File[], pos?: number) => current?.files(f, pos),
    set(next: NonNullable<typeof current>) {
      current = next;
    },
  };
}

const SlashCommand = Extension.create<{ bridge: SlashBridge | null }>({
  name: "slashCommand",
  addOptions() {
    return { bridge: null };
  },
  addProseMirrorPlugins() {
    const bridge = this.options.bridge;
    return [
      Suggestion<SlashItem>({
        editor: this.editor,
        pluginKey: new PluginKey("slashCommand"),
        char: "/",
        startOfLine: true,
        // Only on an otherwise empty paragraph: "/" then what is being searched for.
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          return $from.parent.type.name === "paragraph" && $from.parent.textContent.startsWith("/");
        },
        items: ({ query }) => bridge?.items(query) ?? [],
        command: ({ editor, range, props }) => props.run(editor, range),
        render: () => ({
          onStart: (p) => bridge?.onStart(p),
          onUpdate: (p) => bridge?.onUpdate(p),
          onExit: () => bridge?.onExit(),
          onKeyDown: ({ event }) => bridge?.onKeyDown(event) ?? false,
        }),
      }),
    ];
  },
});

const LinkShortcut = Extension.create<{ onLink: (() => void) | null }>({
  name: "linkShortcut",
  addOptions() {
    return { onLink: null };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-k": () => {
        this.options.onLink?.();
        return true;
      },
    };
  },
});

export function guideExtensions({
  placeholder,
  headingLevels,
  slash,
  mention,
  onLink,
  inlineOnly = false,
}: {
  placeholder: string;
  headingLevels: (2 | 3)[];
  slash: SlashBridge;
  mention: MenuBridge<MentionInfo>;
  onLink: () => void;
  /** The intro: paragraphs with bold, italic and links, nothing else (no lists, headings, blocks). */
  inlineOnly?: boolean;
}) {
  const kit = StarterKit.configure({
    code: false,
    codeBlock: false,
    underline: false,
    ...(inlineOnly ? { heading: false, bulletList: false, orderedList: false, listItem: false, listKeymap: false, blockquote: false, horizontalRule: false, strike: false } : { heading: { levels: headingLevels } }),
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      isAllowedUri: (url) => isSafeHref(url),
      shouldAutoLink: (url) => isSafeHref(/^https?:\/\//i.test(url) ? url : `https://${url}`),
    },
  });
  if (inlineOnly)
    return [kit, Placeholder.configure({ placeholder: ({ editor }) => (editor.isEmpty ? placeholder : "") }), Typography.configure({ emDash: false }), LinkShortcut.configure({ onLink })];
  return [
    StarterKit.configure({
      code: false,
      codeBlock: false,
      underline: false,
      heading: { levels: headingLevels },
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        isAllowedUri: (url) => isSafeHref(url),
        shouldAutoLink: (url) => isSafeHref(/^https?:\/\//i.test(url) ? url : `https://${url}`),
      },
    }),
    Placeholder.configure({ placeholder: ({ editor }) => (editor.isEmpty ? placeholder : "") }),
    // No em dashes (design rule 2): "--" stays as typed.
    Typography.configure({ emDash: false }),
    Youtube.configure({ nocookie: true, inline: false, width: 640, height: 360 }),
    GuideImage,
    guideMention({
      items: ({ query }) => mention.items(query),
      render: () => ({
        onStart: (p) => mention.onStart(p),
        onUpdate: (p) => mention.onUpdate(p),
        onExit: () => mention.onExit(),
        onKeyDown: ({ event }) => mention.onKeyDown(event),
      }),
    }),
    callout("tip"),
    callout("warning"),
    callout("spoiler"),
    BlockExit,
    SlashCommand.configure({ bridge: slash }),
    LinkShortcut.configure({ onLink }),
  ];
}

/**
 * Pasted HTML from Docs, Word, Discord or a web page: headings are mapped onto the guide's
 * two levels. Everything the guide has no node or mark for (fonts, colours, sizes, tables,
 * images) is dropped by the editor's schema when the HTML is parsed.
 */
export function transformPastedHTML(html: string): string {
  return html
    .replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2")
    .replace(/<(\/?)h[4-6](\s|>)/gi, "<$1h3$2");
}
