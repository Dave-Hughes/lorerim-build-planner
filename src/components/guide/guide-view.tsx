/**
 * Draws a guide document from its JSON. Only the guide's own node and mark
 * types are drawn; anything else is dropped. Links are http/https only and
 * open in a new tab with rel="nofollow ugc noopener".
 */
import { Fragment } from "react";
import { isGuideImageUrl, isSafeHref, isYoutubeUrl, type GuideDoc, type GuideMark, type GuideNode } from "@/lib/guide/doc";
import { GuideMention } from "./guide-facts";
import { HIDDEN_IMAGE_TEXT } from "@/lib/moderation/reports";
import prose from "./prose.module.css";

export interface GuideHeading {
  id: string;
  text: string;
}

function plainText(n: GuideNode): string {
  return (n.text ?? "") + (n.content ?? []).map(plainText).join("");
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

/** The H2s, with the ids their headings get when drawn. */
export function guideHeadings(doc: GuideDoc, prefix = "guide"): GuideHeading[] {
  return doc.content
    .map((n, i) => ({ n, i }))
    .filter(({ n }) => n.type === "heading" && n.attrs?.level === 2)
    .map(({ n, i }) => ({ id: `${prefix}-${slug(plainText(n)) || "part"}-${i}`, text: plainText(n) }));
}

function youtubeEmbed(src: string, start?: unknown): string | null {
  if (!isYoutubeUrl(src)) return null;
  const id = src.match(/(?:v=|embed\/|shorts\/|youtu\.be\/)([\w-]{6,})/)?.[1];
  if (!id) return null;
  const s = typeof start === "number" && start > 0 ? `?start=${Math.floor(start)}` : "";
  return `https://www.youtube-nocookie.com/embed/${id}${s}`;
}

function withMarks(text: string, marks: GuideMark[] | undefined, key: string): React.ReactNode {
  let out: React.ReactNode = text;
  for (const m of marks ?? []) {
    if (m.type === "bold") out = <strong>{out}</strong>;
    else if (m.type === "italic") out = <em>{out}</em>;
    else if (m.type === "strike") out = <s>{out}</s>;
    else if (m.type === "link" && m.attrs && isSafeHref(m.attrs.href))
      out = (
        <a href={m.attrs.href} target="_blank" rel="nofollow ugc noopener">
          {out}
        </a>
      );
  }
  return <Fragment key={key}>{out}</Fragment>;
}

function draw(n: GuideNode, key: string, headingIds: Map<number, string>, index?: number): React.ReactNode {
  const kids = () => (n.content ?? []).map((c, i) => draw(c, `${key}.${i}`, headingIds));
  switch (n.type) {
    case "paragraph":
      return <p key={key}>{kids()}</p>;
    case "heading":
      return n.attrs?.level === 2 ? (
        <h2 key={key} id={index !== undefined ? headingIds.get(index) : undefined}>
          {kids()}
        </h2>
      ) : (
        <h3 key={key}>{kids()}</h3>
      );
    case "bulletList":
      return <ul key={key}>{kids()}</ul>;
    case "orderedList": {
      const start = typeof n.attrs?.start === "number" && n.attrs.start !== 1 ? n.attrs.start : undefined;
      return (
        <ol key={key} start={start}>
          {kids()}
        </ol>
      );
    }
    case "listItem":
      return <li key={key}>{kids()}</li>;
    case "blockquote":
      return <blockquote key={key}>{kids()}</blockquote>;
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "tip":
    case "warning":
      return (
        <aside key={key} className={`frame ${prose.callout} ${n.type === "warning" ? prose.warning : ""}`}>
          <span className={prose.calloutLabel}>{n.type === "tip" ? "Tip" : "Warning"}</span>
          {kids()}
        </aside>
      );
    case "spoiler":
      return (
        <details key={key}>
          <summary>Spoiler, tap to show</summary>
          {kids()}
        </details>
      );
    case "youtube": {
      const src = typeof n.attrs?.src === "string" ? youtubeEmbed(n.attrs.src, n.attrs.start) : null;
      // The frame's accessible name (required for iframes), not a tooltip.
      return src ? <iframe key={key} src={src} title="YouTube video" loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen /> : null;
    }
    case "image": {
      const a = n.attrs ?? {};
      if (typeof a.src !== "string" || !isGuideImageUrl(a.src)) return null;
      const w = typeof a.width === "number" ? a.width : undefined;
      const h = typeof a.height === "number" ? a.height : undefined;
      const caption = typeof a.caption === "string" && a.caption.trim() ? a.caption : null;
      return (
        <figure key={key}>
          {/* Column width at most, never wider than the image itself; explicit size so nothing shifts. */}
          <a href={a.src} target="_blank" rel="noopener">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.src} alt={typeof a.alt === "string" ? a.alt : ""} width={w} height={h} loading="lazy" decoding="async" />
          </a>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case "hiddenImage":
      return (
        <figure key={key} className={prose.hiddenImage}>
          <span>{HIDDEN_IMAGE_TEXT}</span>
        </figure>
      );
    case "mention":
      return typeof n.attrs?.kind === "string" && typeof n.attrs?.id === "string" ? <GuideMention key={key} kind={n.attrs.kind} id={n.attrs.id} label={typeof n.attrs.label === "string" ? n.attrs.label : null} /> : null;
    case "text":
      return n.text ? withMarks(n.text, n.marks, key) : null;
    default:
      return null;
  }
}

export function GuideView({ doc, idPrefix = "guide" }: { doc: GuideDoc; idPrefix?: string }) {
  const ids = new Map<number, string>();
  const headings = guideHeadings(doc, idPrefix);
  let h = 0;
  doc.content.forEach((n, i) => {
    if (n.type === "heading" && n.attrs?.level === 2) ids.set(i, headings[h++].id);
  });
  return <div className={prose.prose}>{doc.content.map((n, i) => draw(n, String(i), ids, i))}</div>;
}
