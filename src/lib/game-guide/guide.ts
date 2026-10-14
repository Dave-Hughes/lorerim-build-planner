/**
 * The guide (WO-66): content/guide/NN-slug.md is the only place its words live, one file per
 * chapter (the format is content/guide/README.md). Read and rendered at build time with marked,
 * plus a small pass for the guide's own syntax: `## Heading {#id}` sections, `:::more`, `:::mods`
 * and `:::ask{q="..."}` blocks, and `[[F1]]` key caps. A file that breaks the format fails the
 * build with its name and line.
 */
import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";

export interface GuideMod {
  name: string;
  /** What it does here, as inline HTML. */
  html: string;
  /** Its settings file or MO2 option, as inline HTML. */
  where?: string;
  tag?: string;
}
export interface GuideAsk {
  id: string;
  question: string;
  html: string;
  /** The answer as plain text, for the filter and the structured data. */
  text: string;
}
export interface GuideSection {
  id: string;
  title: string;
  html: string;
  more?: string;
  mods?: GuideMod[];
  asks: GuideAsk[];
}
export interface GuideChapter {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  lead: string;
  sections: GuideSection[];
  /** The file it came from, for error messages. */
  file: string;
}

/** The build failing on a broken guide file: "05-fighting.md:120: ..." */
export class GuideError extends Error {
  constructor(file: string, line: number, message: string) {
    super(`content/guide/${file}:${line}: ${message}`);
    this.name = "GuideError";
  }
}

/** An id from a question's text, as the FAQ made them: "Why can't I fast travel?" -> "why-cant-i-fast-travel". */
export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const marked = new Marked({ gfm: true });

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** `[[F1]]` as a key cap. `{{term}}` and `{{text|id}}` show as their text until WO-70 adds tooltips. */
const keys = (md: string) =>
  md
    .replace(/\{\{([^}|]+)(?:\|[^}]*)?\}\}/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, (_, k: string) => `<kbd>${escape(k)}</kbd>`);
/** A block of markdown as HTML; tables in a scrolling frame. */
function html(md: string): string {
  const out = marked.parse(keys(md).trim(), { async: false }) as string;
  return out.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
}
const inline = (md: string) => marked.parseInline(keys(md).trim(), { async: false }) as string;

/** HTML as plain text: tags and entities taken out. */
export function plain(h: string): string {
  return h
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

/** The `:::mods` block's items: `- **Name**: text`, with `where:` and `tag:` sub-items. */
function parseMods(lines: { text: string; n: number }[], file: string): GuideMod[] {
  const mods: GuideMod[] = [];
  for (const { text, n } of lines) {
    if (!text.trim()) continue;
    const top = /^- \*\*(.+?)\*\*:\s*(.*)$/.exec(text);
    const sub = /^\s+- (where|tag|nexus):\s*(.*)$/.exec(text);
    if (top) mods.push({ name: top[1], html: inline(top[2]) });
    else if (sub && mods.length) {
      const m = mods[mods.length - 1];
      if (sub[1] === "where") m.where = inline(sub[2]);
      else if (sub[1] === "tag") m.tag = sub[2].trim();
      // `nexus:` ids are read by WO-70 (links to Nexus Mods); accepted and ignored until then.
    } else throw new GuideError(file, n, `A mods item must be "- **Name**: text", or a "where:", "tag:" or "nexus:" under one.`);
  }
  return mods;
}

/** Parses one chapter file. `file` is its name, `05-fighting.md`. */
export function parseChapter(md: string, file: string): GuideChapter {
  const m = /^(\d+)-(.+)\.md$/.exec(file);
  if (!m) throw new GuideError(file, 1, "A chapter file is named NN-slug.md.");
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  const front: Record<string, string> = {};
  if (lines[0]?.trim() === "---") {
    for (i = 1; i < lines.length && lines[i].trim() !== "---"; i++) {
      const kv = /^(\w+):\s*(.*)$/.exec(lines[i]);
      if (kv) front[kv[1]] = kv[2].trim();
    }
    if (i >= lines.length) throw new GuideError(file, 1, "The front matter is not closed with ---.");
    i++;
  }
  if (!front.title) throw new GuideError(file, 1, "The front matter needs a title.");
  const chapter: GuideChapter = { slug: m[2], number: Number(front.chapter ?? m[1]), title: front.title, subtitle: front.subtitle || undefined, lead: "", sections: [], file };

  const leadLines: string[] = [];
  let section: (GuideSection & { body: string[]; stage: number }) | null = null;
  const ids = new Set<string>();
  // The block being read: its kind, where it opened, and its lines.
  let block: { kind: "more" | "mods" | "ask"; q?: string; start: number; lines: { text: string; n: number }[] } | null = null;
  const STAGE = { more: 1, mods: 2, ask: 3 } as const;
  const finishSection = () => {
    if (!section) return;
    const { body, stage: _stage, ...rest } = section;
    void _stage;
    chapter.sections.push({ ...rest, html: html(body.join("\n")) });
  };

  for (; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;
    if (block) {
      if (line.trim() === ":::") {
        const text = block.lines.map((l) => l.text).join("\n");
        if (block.kind === "more") section!.more = html(text);
        else if (block.kind === "mods") section!.mods = parseMods(block.lines, file);
        else {
          const answer = html(text);
          section!.asks.push({ id: slug(block.q!), question: block.q!, html: answer, text: plain(answer) });
        }
        block = null;
      } else if (/^:::\w/.test(line.trim()) || /^## /.test(line)) throw new GuideError(file, block.start, `The :::${block.kind} block is not closed with :::.`);
      else block.lines.push({ text: line, n });
      continue;
    }
    const h = /^## (.+?)\s*\{#([\w-]+)\}\s*$/.exec(line);
    if (/^## /.test(line)) {
      if (!h) throw new GuideError(file, n, "A section heading needs its id: ## Heading {#id}.");
      if (ids.has(h[2])) throw new GuideError(file, n, `Two sections have the id "${h[2]}".`);
      ids.add(h[2]);
      finishSection();
      section = { id: h[2], title: h[1], html: "", asks: [], body: [], stage: 0 };
      continue;
    }
    const open = /^:::(more|mods|ask)(\{q="(.*)"\})?\s*$/.exec(line.trim());
    if (open) {
      if (!section) throw new GuideError(file, n, `A :::${open[1]} block must be inside a section.`);
      const kind = open[1] as "more" | "mods" | "ask";
      if (kind === "ask" && !open[3]) throw new GuideError(file, n, 'A question block is :::ask{q="The question"}.');
      if (section.stage > STAGE[kind] || (kind !== "ask" && section.stage === STAGE[kind]))
        throw new GuideError(file, n, `The :::${kind} block is out of order: more detail, then mods, then questions, and at most one of each but questions.`);
      section.stage = STAGE[kind];
      block = { kind, q: open[3], start: n, lines: [] };
      continue;
    }
    if (line.trim() === ":::") throw new GuideError(file, n, "A ::: closes nothing.");
    if (section) {
      if (section.stage > 0 && line.trim()) throw new GuideError(file, n, "The explanation comes before the section's blocks.");
      section.body.push(line);
    } else leadLines.push(line);
  }
  if (block) throw new GuideError(file, block.start, `The :::${block.kind} block is not closed with :::.`);
  finishSection();
  chapter.lead = html(leadLines.join("\n"));
  return chapter;
}

export interface Guide {
  chapters: GuideChapter[];
}

/** Every `/guide/...` link must reach a chapter (and section) that exists; questions get unique ids. */
export function checkGuide(chapters: GuideChapter[]): Guide {
  const bySlug = new Map(chapters.map((c) => [c.slug, c]));
  const seen = new Set<string>();
  for (const c of chapters) {
    const all = [c.lead, ...c.sections.flatMap((s) => [s.html, s.more ?? "", ...(s.mods ?? []).flatMap((m) => [m.html, m.where ?? ""]), ...s.asks.map((a) => a.html)])].join("\n");
    for (const [, href] of all.matchAll(/href="(\/guide[^"]*)"/g)) {
      const [p, hash] = href.split("#");
      const to = p.replace(/^\/guide\/?/, "");
      if (!to || to === "questions" || to === "mods") continue;
      const target = bySlug.get(to);
      if (!target || (hash && !target.sections.some((s) => s.id === hash) && !target.sections.some((s) => s.asks.some((a) => a.id === hash))))
        throw new GuideError(c.file, lineOf(c, href), `The link ${href} goes to no chapter or section.`);
    }
    // A question's id comes from its text; the same question twice gets -2, -3.
    for (const s of c.sections)
      for (const a of s.asks) {
        let id = a.id;
        for (let k = 2; seen.has(id); k++) id = `${a.id}-${k}`;
        a.id = id;
        seen.add(id);
      }
  }
  return { chapters };
}

/** Where a link is in its file, for the error message. */
function lineOf(c: GuideChapter, href: string): number {
  try {
    const text = fs.readFileSync(path.join(process.cwd(), "content", "guide", c.file), "utf8").split("\n");
    const at = text.findIndex((l) => l.includes(`](${href})`));
    return at + 1 || 1;
  } catch {
    return 1;
  }
}

let cached: Guide | null = null;

/** The whole guide, read from content/guide once per server (every time in development). */
export function readGuide(dir = path.join(process.cwd(), "content", "guide")): Guide {
  if (cached && process.env.NODE_ENV === "production") return cached;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /^\d+-.+\.md$/.test(f))
    .sort();
  const guide = checkGuide(files.map((f) => parseChapter(fs.readFileSync(path.join(dir, f), "utf8"), f)));
  cached = guide;
  return guide;
}

export function chapterBySlug(slugName: string): GuideChapter | undefined {
  return readGuide().chapters.find((c) => c.slug === slugName);
}

/** Every mod the chapters name, A to Z, with the sections that name it and their `where` lines. */
export function modIndex(guide: Guide) {
  const out = new Map<string, { name: string; places: { chapter: GuideChapter; section: GuideSection; html: string; where?: string }[] }>();
  for (const c of guide.chapters)
    for (const s of c.sections)
      for (const m of s.mods ?? []) {
        const e = out.get(m.name) ?? { name: m.name, places: [] };
        e.places.push({ chapter: c, section: s, html: m.html, where: m.where });
        out.set(m.name, e);
      }
  return [...out.values()].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

/** FAQPage structured data for All questions: one Question per :::ask. */
export function guideJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.chapters.flatMap((c) => c.sections.flatMap((s) => s.asks.map((a) => ({ "@type": "Question", name: a.question, acceptedAnswer: { "@type": "Answer", text: a.text } })))),
  };
}
