/**
 * The guide (WO-66): content/guide/NN-slug.md is the only place its words live, one file per
 * chapter (the format is content/guide/README.md). Read and rendered at build time with marked,
 * plus a small pass for the guide's own syntax: `## Heading {#id}` sections, `:::more`, `:::mods`
 * and `:::ask{q="..."}` blocks, `[[F1]]` key caps, and (WO-70) `{{term}}` and `{{text|id}}`, the
 * words content/guide/terms.md explains in a tooltip. A file that breaks the format fails the
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
  /** Its Nexus Mods id (skyrimspecialedition), when known (WO-70). */
  nexus?: string;
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
  /** A file in public/icons, without .svg (WO-70). */
  icon?: string;
  /** Where its text marks each term: the section's id, or none for the lead (WO-70). */
  uses: { term: string; section?: string }[];
  /** The file it came from, for error messages. */
  file: string;
}

/** A word the guide explains in a tooltip (WO-70), from content/guide/terms.md. */
export interface GuideTerm {
  id: string;
  name: string;
  aka: string[];
  icon?: string;
  nexus?: string;
  /** The /guide link to the section that explains it in full. */
  see?: string;
  /** The definition, as inline HTML, and as plain text. */
  html: string;
  text: string;
  /** Where its `see:` line is, for error messages. */
  seeLine?: number;
}

/** The terms by id, and by name and aka (lower case). */
export interface TermIndex {
  byId: Map<string, GuideTerm>;
  byName: Map<string, GuideTerm>;
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
/** `[[F1]]` as a key cap. */
const keys = (md: string) => md.replace(/\[\[([^\]]+)\]\]/g, (_, k: string) => `<kbd>${escape(k)}</kbd>`);

const TERM = /\{\{([^}|]+)(?:\|([^}]*))?\}\}/g;

/** A term in the page: a link to its entry (so it works without scripts), its icon in front, and its id for the tooltip. */
export function termHtml(t: GuideTerm, text: string): string {
  const icon = t.icon ? `<img class="guide-term-icon" src="/icons/${t.icon}.svg" alt="" width="16" height="16">` : "";
  return `<a class="guide-term" href="/guide/terms#${t.id}" data-term="${t.id}">${icon}${escape(text)}</a>`;
}

/**
 * A line's `{{term}}` and `{{text|id}}` marks, as term links. The text must be a term's name or
 * aka, or the id must exist; otherwise the build fails here. Without an index the marks show as
 * their text (a chapter read on its own, as in the tests).
 */
function markTerms(line: string, n: number, file: string, terms: TermIndex | undefined, used: (id: string) => void): string {
  return line.replace(TERM, (_, text: string, id?: string) => {
    if (!terms) return text;
    const t = id !== undefined ? terms.byId.get(id.trim()) : terms.byName.get(text.trim().toLowerCase());
    if (!t) throw new GuideError(file, n, id !== undefined ? `No term has the id "${id.trim()}".` : `No term is called "${text.trim()}". Add it to terms.md, or give its id: {{${text.trim()}|id}}.`);
    used(t.id);
    return termHtml(t, text.trim());
  });
}
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
      else if (/^\d+$/.test(sub[2].trim())) m.nexus = sub[2].trim();
      else throw new GuideError(file, n, "A nexus: id is the number in the mod's Nexus Mods address.");
    } else throw new GuideError(file, n, `A mods item must be "- **Name**: text", or a "where:", "tag:" or "nexus:" under one.`);
  }
  return mods;
}

/** Parses one chapter file. `file` is its name, `05-fighting.md`; `terms` resolves its {{terms}}. */
export function parseChapter(md: string, file: string, terms?: TermIndex): GuideChapter {
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
  if (front.icon) checkIcon(front.icon, file, 1);
  const chapter: GuideChapter = { slug: m[2], number: Number(front.chapter ?? m[1]), title: front.title, subtitle: front.subtitle || undefined, icon: front.icon || undefined, lead: "", sections: [], uses: [], file };
  const mark = (text: string, n: number) =>
    markTerms(text, n, file, terms, (id) => {
      const at = section?.id;
      if (!chapter.uses.some((u) => u.term === id && u.section === at)) chapter.uses.push({ term: id, section: at });
    });

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
      else block.lines.push({ text: mark(line, n), n });
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
      section.body.push(mark(line, n));
    } else leadLines.push(mark(line, n));
  }
  if (block) throw new GuideError(file, block.start, `The :::${block.kind} block is not closed with :::.`);
  finishSection();
  chapter.lead = html(leadLines.join("\n"));
  return chapter;
}

export interface Guide {
  chapters: GuideChapter[];
  terms: GuideTerm[];
}

/** An icon must be one of public/icons. */
function checkIcon(icon: string, file: string, line: number) {
  if (!fs.existsSync(path.join(process.cwd(), "public", "icons", `${icon}.svg`))) throw new GuideError(file, line, `There is no icon "${icon}" in public/icons.`);
}

/**
 * content/guide/terms.md (WO-70): `## Term {#id}`, optional `- aka:`, `- icon:`, `- nexus:` and
 * `- see:` lines, and one or two plain sentences. HTML comments are skipped.
 */
export function parseTerms(md: string, file = "terms.md"): TermIndex & { terms: GuideTerm[] } {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const terms: GuideTerm[] = [];
  let cur: (GuideTerm & { def: string[] }) | null = null;
  let i = 0;
  if (lines[0]?.trim() === "---") {
    for (i = 1; i < lines.length && lines[i].trim() !== "---"; i++);
    i++;
  }
  const finish = () => {
    if (!cur) return;
    const { def, ...t } = cur;
    if (!def.join("").trim()) throw new GuideError(file, 1, `The term "${t.name}" has no definition.`);
    t.html = inline(def.join(" "));
    t.text = plain(t.html);
    terms.push(t);
  };
  let comment = false;
  for (; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;
    if (comment || line.trim().startsWith("<!--")) {
      comment = !line.includes("-->");
      continue;
    }
    if (/^## /.test(line)) {
      const h = /^## (.+?)\s*\{#([\w-]+)\}\s*$/.exec(line);
      if (!h) throw new GuideError(file, n, "A term's heading needs its id: ## Term {#id}.");
      if (terms.some((t) => t.id === h[2]) || (cur as GuideTerm | null)?.id === h[2]) throw new GuideError(file, n, `Two terms have the id "${h[2]}".`);
      finish();
      cur = { id: h[2], name: h[1], aka: [], html: "", text: "", def: [] };
      continue;
    }
    if (!cur) continue;
    const kv = /^- (aka|icon|nexus|see):\s*(.*)$/.exec(line);
    if (kv) {
      const v = kv[2].trim();
      if (kv[1] === "aka") cur.aka.push(...v.split(",").map((x) => x.trim()).filter(Boolean));
      else if (kv[1] === "icon") {
        checkIcon(v, file, n);
        cur.icon = v;
      } else if (kv[1] === "nexus") {
        if (!/^\d+$/.test(v)) throw new GuideError(file, n, "A nexus: id is the number in the mod's Nexus Mods address.");
        cur.nexus = v;
      } else {
        cur.see = v;
        cur.seeLine = n;
      }
    } else if (line.trim()) cur.def.push(line.trim());
  }
  finish();
  const byId = new Map(terms.map((t) => [t.id, t]));
  const byName = new Map<string, GuideTerm>();
  for (const t of terms)
    for (const name of [t.name, ...t.aka]) {
      const k = name.toLowerCase();
      if (byName.has(k) && byName.get(k) !== t) throw new GuideError(file, 1, `"${name}" names two terms: ${byName.get(k)!.id} and ${t.id}.`);
      byName.set(k, t);
    }
  return { terms, byId, byName };
}

/** Every `/guide/...` link (and each term's `see`) must reach a chapter (and section) that exists; questions get unique ids. */
export function checkGuide(chapters: GuideChapter[], terms: GuideTerm[] = []): Guide {
  const bySlug = new Map(chapters.map((c) => [c.slug, c]));
  const reaches = (href: string) => {
    const [p, hash] = href.split("#");
    const to = p.replace(/^\/guide\/?/, "");
    if (!to || to === "questions" || to === "mods" || to === "terms") return true;
    const target = bySlug.get(to);
    return !!target && (!hash || target.sections.some((s) => s.id === hash || s.asks.some((a) => a.id === hash)));
  };
  for (const t of terms) if (t.see && (!t.see.startsWith("/guide") || !reaches(t.see))) throw new GuideError("terms.md", t.seeLine ?? 1, `The see: link ${t.see} goes to no chapter or section.`);
  const seen = new Set<string>();
  for (const c of chapters) {
    const all = [c.lead, ...c.sections.flatMap((s) => [s.html, s.more ?? "", ...(s.mods ?? []).flatMap((m) => [m.html, m.where ?? ""]), ...s.asks.map((a) => a.html)])].join("\n");
    for (const [, href] of all.matchAll(/href="(\/guide[^"]*)"/g)) {
      if (href.startsWith("/guide/terms#")) continue;
      if (!reaches(href)) throw new GuideError(c.file, lineOf(c, href), `The link ${href} goes to no chapter or section.`);
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
  return { chapters, terms };
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
  const index = parseTerms(fs.readFileSync(path.join(dir, "terms.md"), "utf8"));
  const guide = checkGuide(
    files.map((f) => parseChapter(fs.readFileSync(path.join(dir, f), "utf8"), f, index)),
    [...index.terms].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" })),
  );
  cached = guide;
  return guide;
}

export function chapterBySlug(slugName: string): GuideChapter | undefined {
  return readGuide().chapters.find((c) => c.slug === slugName);
}

/** Every mod the chapters name, A to Z, with the sections that name it, their `where` lines and its Nexus id. */
export function modIndex(guide: Guide) {
  const out = new Map<string, { name: string; nexus?: string; places: { chapter: GuideChapter; section: GuideSection; html: string; where?: string }[] }>();
  for (const c of guide.chapters)
    for (const s of c.sections)
      for (const m of s.mods ?? []) {
        const e = out.get(m.name) ?? { name: m.name, places: [] };
        e.nexus ??= m.nexus;
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

/** A mod's Nexus Mods page (WO-70). */
export const nexusUrl = (id: string) => `https://www.nexusmods.com/skyrimspecialedition/mods/${id}`;

/** Where each term is marked: the chapters and sections, for the terms page's "Used in". */
export function termUses(guide: Guide): Map<string, { chapter: GuideChapter; section?: GuideSection }[]> {
  const out = new Map<string, { chapter: GuideChapter; section?: GuideSection }[]>();
  for (const c of guide.chapters)
    for (const u of c.uses) {
      const list = out.get(u.term) ?? [];
      list.push({ chapter: c, section: c.sections.find((s) => s.id === u.section) });
      out.set(u.term, list);
    }
  return out;
}

/** The tooltips' data (WO-70): each term's name, definition and links, by id. */
export function termTips(guide: Guide): Record<string, { name: string; html: string; see?: string; nexus?: string }> {
  return Object.fromEntries(guide.terms.map((t) => [t.id, { name: t.name, html: t.html, see: t.see, nexus: t.nexus }]));
}
