/**
 * Free text with the names it holds turned into links (WO-154: every person and place named on a page links to their own page).
 * Pure: the caller says which names and where each goes. A name matches whole (not inside a longer word), case as written, the longest
 * first, so "Broken Oar Grotto" wins over "Broken Oar". A name followed by a capitalised word is the start of a longer name the caller
 * doesn't know ("Riverwood Trader"), and is left as text: a link goes on a whole name or on none (WO-154 Part 4).
 */
export interface NameLink {
  text: string;
  href: string;
  /** Goes to another site, in a new tab (a mod's Nexus page). */
  external?: boolean;
}

export type Piece = { text: string; href?: string; external?: boolean };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The pattern for a list of names, built once per list (a page links many sentences against the same few thousand names). */
const compiled = new WeakMap<NameLink[], { byText: Map<string, NameLink>; re: RegExp } | null>();
function compile(names: NameLink[]) {
  if (compiled.has(names)) return compiled.get(names)!;
  const usable = names.filter((n) => n.text.trim().length > 1);
  let out: { byText: Map<string, NameLink>; re: RegExp } | null = null;
  if (usable.length) {
    const byText = new Map(usable.map((n) => [n.text, n]));
    const pattern = [...byText.keys()].sort((a, b) => b.length - a.length).map(escape).join("|");
    out = { byText, re: new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])(?!\\s+\\p{Lu})`, "gu") };
  }
  compiled.set(names, out);
  return out;
}

export function linkNames(text: string, names: NameLink[]): Piece[] {
  const c = compile(names);
  if (!text || !c) return [{ text }];
  const { byText, re } = c;
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    const hit = byText.get(m[0])!;
    out.push({ text: m[0], href: hit.href, ...(hit.external ? { external: true } : {}) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
