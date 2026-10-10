/**
 * The written guide's document: Tiptap JSON with a fixed set of node and mark
 * types. The server validates every save against this schema, and the build
 * page renders only these types; raw HTML is never stored or rendered.
 */
import { z } from "zod";

export interface GuideMark {
  type: "bold" | "italic" | "strike" | "link";
  attrs?: { href: string };
}

export interface GuideNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: GuideNode[];
  text?: string;
  marks?: GuideMark[];
}

export interface GuideDoc extends GuideNode {
  type: "doc";
  content: GuideNode[];
}

/** `overview` for the whole build, `level:<n>` for a level's notes. */
export type GuideKey = "overview" | `level:${number}`;

export const GUIDE_LIMITS = { overview: 60_000, level: 6_000 } as const;

export function limitFor(key: string): number {
  return key === "overview" ? GUIDE_LIMITS.overview : GUIDE_LIMITS.level;
}

export function isGuideKey(key: string): key is GuideKey {
  return key === "overview" || /^level:([1-9]\d?|100)$/.test(key);
}

/** Only http and https links, ever. */
export function isSafeHref(href: string): boolean {
  try {
    const u = new URL(href);
    return (u.protocol === "http:" || u.protocol === "https:") && !/\s/.test(href);
  } catch {
    return false;
  }
}

/** A YouTube watch, share or embed link. */
export function isYoutubeUrl(src: string): boolean {
  return /^https:\/\/(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)[\w-]{6,}/.test(src);
}

export const LINK_ERROR = "Links must start with http:// or https://";

const mark = z.discriminatedUnion("type", [
  z.object({ type: z.literal("bold") }),
  z.object({ type: z.literal("italic") }),
  z.object({ type: z.literal("strike") }),
  z.object({
    type: z.literal("link"),
    attrs: z.object({ href: z.string().max(2000).refine(isSafeHref, LINK_ERROR) }),
  }),
]);

const children = () => z.array(node).max(10_000).optional();

const node: z.ZodType<GuideNode> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({ type: z.literal("paragraph"), content: children() }),
    z.object({ type: z.literal("heading"), attrs: z.object({ level: z.union([z.literal(2), z.literal(3)]) }), content: children() }),
    z.object({ type: z.literal("bulletList"), content: children() }),
    z.object({
      type: z.literal("orderedList"),
      attrs: z.object({ start: z.number().int().min(0).max(10_000).optional() }).optional(),
      content: children(),
    }),
    z.object({ type: z.literal("listItem"), content: children() }),
    z.object({ type: z.literal("blockquote"), content: children() }),
    z.object({ type: z.literal("horizontalRule") }),
    z.object({ type: z.literal("hardBreak") }),
    z.object({ type: z.literal("tip"), content: children() }),
    z.object({ type: z.literal("warning"), content: children() }),
    z.object({ type: z.literal("spoiler"), content: children() }),
    z.object({
      type: z.literal("youtube"),
      attrs: z.object({ src: z.string().max(500).refine(isYoutubeUrl, "Only YouTube videos can be embedded"), start: z.number().int().min(0).optional() }),
    }),
    z.object({ type: z.literal("text"), text: z.string().min(1).max(60_000), marks: z.array(mark).max(4).optional() }),
  ]),
);

export const guideDocSchema = z.object({ type: z.literal("doc"), content: z.array(node).max(10_000) });

/** Characters of text in a document (what the limits count). */
export function textLength(n: GuideNode): number {
  return (n.text?.length ?? 0) + (n.content ?? []).reduce((sum, c) => sum + textLength(c), 0);
}

export function emptyDoc(): GuideDoc {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

/** Old plain-text notes as the starting paragraphs of a section (blank lines split paragraphs). */
export function notesToDoc(text: string): GuideDoc {
  const paras = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!paras.length) return emptyDoc();
  return {
    type: "doc",
    content: paras.map((p) => ({
      type: "paragraph",
      content: p.split("\n").flatMap((line, i): GuideNode[] => (i ? [{ type: "hardBreak" }, ...(line ? [{ type: "text", text: line }] : [])] : line ? [{ type: "text", text: line }] : [])),
    })),
  };
}

export function isEmptyDoc(doc: GuideDoc | null | undefined): boolean {
  return !doc || (textLength(doc) === 0 && !JSON.stringify(doc).includes('"youtube"'));
}

/** "Too long to save: 61,200 of 60,000 characters" */
export function tooLongMessage(length: number, limit: number): string {
  return `Too long to save: ${length.toLocaleString("en-US")} of ${limit.toLocaleString("en-US")} characters`;
}
