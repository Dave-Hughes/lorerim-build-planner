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

/**
 * `overview` for the whole build, `intro` for the short lead-in on the shared page, `level:<n>`
 * for a level's notes.
 */
export type GuideKey = "overview" | "intro" | `level:${number}`;

export const GUIDE_LIMITS = { overview: 60_000, intro: 1_200, level: 6_000 } as const;

export function limitFor(key: string): number {
  return key === "overview" ? GUIDE_LIMITS.overview : key === "intro" ? GUIDE_LIMITS.intro : GUIDE_LIMITS.level;
}

/** The intro holds paragraphs of text with bold, italic and links only. */
export function isInlineOnly(doc: GuideDoc): boolean {
  const ok = (n: GuideNode, top: boolean): boolean => {
    if (top) return n.type === "paragraph" && (n.content ?? []).every((c) => ok(c, false));
    if (n.type === "hardBreak") return true;
    return n.type === "text" && (n.marks ?? []).every((m) => m.type === "bold" || m.type === "italic" || m.type === "link");
  };
  return doc.content.every((n) => ok(n, true));
}

/** The first paragraph with text, as a document of its own (the intro for builds without one). */
export function firstParagraph(doc: GuideDoc | null | undefined): GuideDoc | null {
  const p = doc?.content.find((n) => n.type === "paragraph" && textLength(n) > 0);
  return p ? { type: "doc", content: [p] } : null;
}

/** The level a `level:<n>` key is for, or null. */
export function levelOfKey(key: string): number | null {
  const m = /^level:(\d+)$/.exec(key);
  return m ? Number(m[1]) : null;
}

/** Levels whose notes have something in them. */
export function notedLevels(sections: Record<string, GuideDoc>): Set<number> {
  const out = new Set<number>();
  for (const [key, doc] of Object.entries(sections)) {
    const level = levelOfKey(key);
    if (level && !isEmptyDoc(doc)) out.add(level);
  }
  return out;
}

export function isGuideKey(key: string): key is GuideKey {
  return key === "overview" || key === "intro" || /^level:([1-9]\d?|100)$/.test(key);
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

/** Guide images: kinds, size and count. */
export const IMAGE_LIMITS = { bytes: 4 * 1024 * 1024, perBuild: 40 } as const;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
export const IMAGE_TYPE_ERROR = "Only PNG, JPEG, WebP or GIF images.";
export const IMAGE_COUNT_ERROR = `This build already has ${IMAGE_LIMITS.perBuild} images, the most it can have.`;

/** "Too big: 5.0 MB. Images can be up to 4 MB." */
export function imageTooBigMessage(bytes: number): string {
  return `Too big: ${(bytes / 1024 / 1024).toFixed(1)} MB. Images can be up to ${IMAGE_LIMITS.bytes / 1024 / 1024} MB.`;
}

/** An image in our Blob store, under a build's folder: <env>/builds/<buildId>/<name>.<ext> */
export function isGuideImageUrl(src: string): boolean {
  return /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/(production|staging|dev)\/builds\/[23456789abcdefghjkmnpqrstuvwxyz]{10}\/[\w-]{8,64}\.(png|jpg|webp|gif)$/.test(src);
}

/** Every image a document shows. */
export function imageUrls(n: GuideNode, out: Set<string> = new Set()): Set<string> {
  if (n.type === "image" && typeof n.attrs?.src === "string") out.add(n.attrs.src);
  for (const c of n.content ?? []) imageUrls(c, out);
  return out;
}

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
    z.object({
      type: z.literal("image"),
      attrs: z.object({
        src: z.string().max(300).refine(isGuideImageUrl, "Images must be uploaded to the guide"),
        alt: z.string().max(300).nullish(),
        caption: z.string().max(300).nullish(),
        width: z.number().int().min(1).max(20_000).nullish(),
        height: z.number().int().min(1).max(20_000).nullish(),
      }),
    }),
    z.object({
      type: z.literal("mention"),
      // Only what the chip refers to: never its text, which comes from the game data. Items keep their
      // name too, shown until the item index is fetched.
      attrs: z
        .object({
          kind: z.enum(["perk", "destiny", "skill", "trait", "birthsign", "stone", "race", "item"]),
          id: z.string().min(1).max(200),
          label: z.string().max(200).nullish(),
        })
        .transform(({ kind, id, label }) => (kind === "item" && label ? { kind, id, label } : { kind, id })),
    }),
    z.object({ type: z.literal("text"), text: z.string().min(1).max(60_000), marks: z.array(mark).max(4).optional() }),
  ]),
);

export const guideDocSchema = z.object({ type: z.literal("doc"), content: z.array(node).max(10_000) });

/** Characters of text in a document (what the limits count). */
export function textLength(n: GuideNode): number {
  return (n.text?.length ?? 0) + (n.content ?? []).reduce((sum, c) => sum + textLength(c), 0);
}

/** Words in a document, for "6 min read". */
export function docWords(n: GuideNode): number {
  const own = n.text ? n.text.split(/\s+/).filter(Boolean).length : 0;
  return own + (n.content ?? []).reduce((sum, c) => sum + docWords(c), 0);
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
  return !doc || (textLength(doc) === 0 && !/"type":"(youtube|image|mention)"/.test(JSON.stringify(doc)));
}

/** "Too long to save: 61,200 of 60,000 characters" */
export function tooLongMessage(length: number, limit: number): string {
  return `Too long to save: ${length.toLocaleString("en-US")} of ${limit.toLocaleString("en-US")} characters`;
}
