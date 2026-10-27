/**
 * Free text with the names it holds turned into links (WO-154: every person and place named on a page links to their own page).
 * Pure: the caller says which names and where each goes. A name matches whole (not inside a longer word), case as written, the longest
 * first, so "Broken Oar Grotto" wins over "Broken Oar".
 */
export interface NameLink {
  text: string;
  href: string;
}

export type Piece = { text: string; href?: string };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function linkNames(text: string, names: NameLink[]): Piece[] {
  const usable = names.filter((n) => n.text.trim().length > 1);
  if (!text || !usable.length) return [{ text }];
  const byText = new Map(usable.map((n) => [n.text, n.href]));
  const pattern = [...byText.keys()].sort((a, b) => b.length - a.length).map(escape).join("|");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])`, "gu");
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], href: byText.get(m[0]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
