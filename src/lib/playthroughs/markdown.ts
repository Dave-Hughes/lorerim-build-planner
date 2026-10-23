import { isSafeHref, type GuideDoc, type GuideMark, type GuideNode } from "@/lib/guide/doc";

/**
 * A chapter's text as an assistant sends it (WO-111): Markdown with paragraphs, a heading (## or
 * ###), a quote (>), a rule (---), **bold**, *italic* and [links](https://...). No images: those are
 * the author's own, uploaded on the site. The result is a guide document, checked by its validator
 * and the Story's limits like anything typed in the editor.
 */
export class MarkdownError extends Error {}

const IMAGE = /!\[[^\]]*\]\([^)]*\)/;

function inline(text: string): GuideNode[] {
  const out: GuideNode[] = [];
  // **bold**, *italic* or _italic_, [text](url)
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  const push = (t: string, marks?: GuideMark[]) => {
    if (!t) return;
    out.push(marks?.length ? { type: "text", text: t, marks } : { type: "text", text: t });
  };
  for (let m = re.exec(text); m; m = re.exec(text)) {
    push(text.slice(last, m.index));
    if (m[2]) push(m[2], [{ type: "bold" }]);
    else if (m[3] ?? m[4]) push((m[3] ?? m[4])!, [{ type: "italic" }]);
    else if (m[5]) {
      if (!isSafeHref(m[6])) throw new MarkdownError("Links must start with http:// or https://");
      push(m[5], [{ type: "link", attrs: { href: m[6] } }]);
    }
    last = m.index + m[0].length;
  }
  push(text.slice(last));
  return out;
}

export function markdownToDoc(md: string): GuideDoc {
  if (IMAGE.test(md)) throw new MarkdownError("No images in the text: the author adds their own on the site.");
  const blocks = md.replace(/\r\n?/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const content: GuideNode[] = [];
  for (const b of blocks) {
    const h = /^(#{1,3})\s+(.+)$/.exec(b);
    if (h && !b.includes("\n")) {
      content.push({ type: "heading", attrs: { level: h[1].length === 3 ? 3 : 2 }, content: inline(h[2].trim()) });
    } else if (/^(-{3,}|\*{3,})$/.test(b)) {
      content.push({ type: "horizontalRule" });
    } else if (b.startsWith(">")) {
      const text = b.split("\n").map((l) => l.replace(/^>\s?/, "")).join("\n");
      content.push({ type: "blockquote", content: text.split(/\n\s*\n/).map((p) => ({ type: "paragraph", content: lines(p) })) });
    } else {
      content.push({ type: "paragraph", content: lines(b) });
    }
  }
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

/** A paragraph's lines, joined by hard breaks. */
function lines(p: string): GuideNode[] {
  return p.split("\n").flatMap((l, i) => [...(i ? [{ type: "hardBreak" } as GuideNode] : []), ...inline(l.trim())]);
}

/** A text node as Markdown, with its one mark: **bold**, *italic*, [link](url). */
function inlineMarkdown(n: GuideNode): string {
  if (n.type === "hardBreak") return "\n";
  if (n.type !== "text") return (n.content ?? []).map(inlineMarkdown).join("");
  const t = n.text ?? "";
  const mark = n.marks?.[0];
  if (!mark || !t) return t;
  if (mark.type === "bold") return `**${t}**`;
  if (mark.type === "italic") return `*${t}*`;
  if (mark.type === "link" && typeof mark.attrs?.href === "string") return `[${t}](${mark.attrs.href})`;
  return t;
}

/**
 * A chapter's text as it was written (WO-142 item 7): the reverse of markdownToDoc, so what get_playthrough gives back keeps
 * its paragraphs, a heading, a quote or a rule, and can go back through set_chapter unchanged. A list from the editor is
 * dashes, an image (the author's own) nothing.
 */
export function docToMarkdown(doc: GuideDoc | GuideNode): string {
  const block = (n: GuideNode): string => {
    switch (n.type) {
      case "paragraph":
        return (n.content ?? []).map(inlineMarkdown).join("");
      case "heading":
        return `${n.attrs?.level === 3 ? "###" : "##"} ${(n.content ?? []).map(inlineMarkdown).join("")}`;
      case "blockquote":
        return (n.content ?? []).map((p) => block(p).split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n")).join("\n>\n");
      case "horizontalRule":
        return "---";
      case "bulletList":
      case "orderedList":
        return (n.content ?? []).map((li, i) => `${n.type === "orderedList" ? `${i + 1}.` : "-"} ${(li.content ?? []).map(block).join(" ")}`).join("\n");
      case "image":
      case "hiddenImage":
        return "";
      default:
        return (n.content ?? []).map(inlineMarkdown).join("");
    }
  };
  return (doc.content ?? []).map(block).filter((b) => b !== "").join("\n\n");
}
