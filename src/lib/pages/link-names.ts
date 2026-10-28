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
  /** A short name for someone (Farengar for Farengar Secret-Fire): may stand after a title (Jarl Balgruuf), and is not taken before "the" or "of" and a capital (WO-160 Part 6). */
  short?: boolean;
  /** Matches only inside brackets, or after "in the quest": a quest's name written after a sentence, "(The Throat of the World)", is the quest and not the place in it. */
  bracketed?: boolean;
  /** Takes the text and links nothing: the name of a quest or an item holds a person's or place's name, which is not that person or place there. */
  plain?: boolean;
}

export type Piece = { text: string; href?: string; external?: boolean };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The titles a short name may stand after ("Jarl Balgruuf"). */
const TITLES = "Jarl|Lord|Lady|Thane|Queen|King|Captain|Commander|Master|Brother|Sister|Legate|General|Steward|Housecarl|Dame|Mistress|Grandmaster";

interface Compiled {
  normal: Map<string, NameLink>;
  short: Map<string, NameLink>;
  bracketed: Map<string, NameLink>;
  re: RegExp;
}
/** The pattern for a list of names, built once per list (a page links many sentences against the same few thousand names). */
const compiled = new WeakMap<NameLink[], Compiled | null>();
function compile(names: NameLink[]) {
  if (compiled.has(names)) return compiled.get(names)!;
  const usable = names.filter((n) => n.text.trim().length > 1);
  let out: Compiled | null = null;
  if (usable.length) {
    const group = (xs: NameLink[]) => {
      const m = new Map(xs.map((n) => [n.text, n]));
      return { m, alt: [...m.keys()].sort((a, b) => b.length - a.length).map(escape).join("|") };
    };
    const normal = group(usable.filter((n) => !n.short && !n.bracketed));
    const short = group(usable.filter((n) => n.short));
    const bracketed = group(usable.filter((n) => n.bracketed));
    const edge = "(?<![\\p{L}\\p{N}])";
    const parts = [
      // In order: a bracketed quest's name, a whole name, a short name (with a title before it, when it has one).
      // A quest's name in brackets, or after "in the quest" (WO-177: "Paarthurnax dies if you kill him in the quest Paarthurnax").
      ...(bracketed.m.size ? [`(?:(?<=\\((?:[^()]*[,;]\\s+)?)|(?<=\\bin the quest\\s+))(?<br>${bracketed.alt})(?=\\s*[,;)]|\\s*\\.?$)`] : []),
      // A place named after a title and "of" is a role ("Jarl of Whiterun", "Steward of Solitude"), not a place to go to (WO-177 Part 5).
      ...(normal.m.size ? [`(?<!\\b(?:${TITLES}|Guard|Captain|Court Wizard) of\\s)${edge}(?<n>${normal.alt})(?![\\p{L}\\p{N}])(?!\\s+\\p{Lu})`] : []),
      ...(short.m.size ? [`${edge}(?:(?:${TITLES})\\s+)?(?<s>${short.alt})(?![\\p{L}\\p{N}])(?!\\s+\\p{Lu})(?!\\s+(?:the|of)\\s+\\p{Lu})`] : []),
    ];
    out = { normal: normal.m, short: short.m, bracketed: bracketed.m, re: new RegExp(parts.join("|"), "gu") };
  }
  compiled.set(names, out);
  return out;
}

/**
 * A short name standing right after a capitalised word that is not a title, in the middle of a sentence, is the end of a longer name ("Dragon
 * Blood", not Blood), so it is text (WO-177). A word that starts the sentence is only capitalised for that ("Meet Farengar").
 */
function endsAnotherName(before: string): boolean {
  const m = /(?:^|(.)\s+)(\p{Lu}[\p{L}'’-]*)\s+$/u.exec(before);
  if (!m) return false;
  const starts = m[1] === undefined || /[.!?:;"“(]/.test(m[1]);
  return !starts && !new RegExp(`^(?:${TITLES})$`).test(m[2]);
}

export function linkNames(text: string, names: NameLink[], skip?: string): Piece[] {
  const c = compile(names);
  if (!text || !c) return [{ text }];
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(c.re)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    const g = m.groups ?? {};
    const hit = (g.br !== undefined ? c.bracketed.get(g.br) : g.n !== undefined ? c.normal.get(g.n) : c.short.get(g.s))!;
    out.push(hit.plain || (skip !== undefined && hit.href === skip) || (g.s !== undefined && m[0] === g.s && endsAnotherName(text.slice(0, m.index))) ? { text: m[0] } : { text: m[0], href: hit.href, ...(hit.external ? { external: true } : {}) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
