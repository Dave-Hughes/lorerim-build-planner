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

export function linkNames(text: string, names: NameLink[]): Piece[] {
  const usable = names.filter((n) => n.text.trim().length > 1);
  if (!text || !usable.length) return [{ text }];
  const byText = new Map(usable.map((n) => [n.text, n]));
  const pattern = [...byText.keys()].sort((a, b) => b.length - a.length).map(escape).join("|");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])(?!\\s+\\p{Lu})`, "gu");
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
