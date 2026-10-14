/**
 * The FAQ (WO-63): content/faq/*.md is the only place its words live. One `##` per section, one
 * `###` per question, the answer below it in plain markdown (lists, bold, code, pipe tables). Read
 * and rendered at build time; nothing here runs in the browser.
 */
import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";

export interface FaqQuestion {
  id: string;
  question: string;
  /** The answer as HTML, from the file's markdown. */
  html: string;
  /** The answer as plain text, for the filter and the structured data. */
  text: string;
}
export interface FaqSection {
  id: string;
  title: string;
  questions: FaqQuestion[];
}
export interface Faq {
  title: string;
  /** The line under the title: "For LoreRim 5.0.4.8." */
  byline: string;
  sections: FaqSection[];
}

/** An id from a heading's text, stable for the same text: "Why can't I fast travel?" -> "why-cant-i-fast-travel". */
export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const marked = new Marked({ gfm: true });

/** Markdown to plain text: the HTML with its tags and entities taken out. */
function plain(html: string): string {
  return html
    .replace(/<\/(p|li|tr|h\d)>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parses a FAQ file's markdown. */
export function parseFaq(md: string): Faq {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let title = "FAQ";
  const head: string[] = [];
  const sections: FaqSection[] = [];
  let section: FaqSection | null = null;
  let q: { question: string; body: string[] } | null = null;
  const flush = () => {
    if (q && section) {
      const html = marked.parse(q.body.join("\n").trim(), { async: false }) as string;
      section.questions.push({ id: slug(q.question), question: q.question, html, text: plain(html) });
    }
    q = null;
  };
  for (const line of lines) {
    if (/^# /.test(line)) title = line.slice(2).trim();
    else if (/^## /.test(line)) {
      flush();
      const t = line.slice(3).trim();
      section = { id: slug(t), title: t, questions: [] };
      sections.push(section);
    } else if (/^### /.test(line)) {
      flush();
      q = { question: line.slice(4).trim(), body: [] };
    } else if (q) (q as { body: string[] }).body.push(line);
    else if (!section && line.trim()) head.push(line.trim());
  }
  flush();
  return { title, byline: head.join(" ").replace(/\.$/, ""), sections };
}

const read = new Map<string, Faq>();

/** A FAQ page's file, content/faq/<name>.md: read and rendered once per server, never in the browser. */
export function readFaq(name: string): Faq {
  const hit = read.get(name);
  if (hit && process.env.NODE_ENV === "production") return hit;
  const faq = parseFaq(fs.readFileSync(path.join(process.cwd(), "content", "faq", `${name}.md`), "utf8"));
  read.set(name, faq);
  return faq;
}

/** FAQPage structured data: one Question per `###`, its answer as plain text. */
export function faqJsonLd(faq: Faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.sections.flatMap((s) =>
      s.questions.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.text } })),
    ),
  };
}
