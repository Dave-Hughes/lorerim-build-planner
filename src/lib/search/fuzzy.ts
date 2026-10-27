/**
 * A search that forgives spelling (WO-154: Dave typed "Palonimo" for the white horse, "palonimo" in the records). Pure.
 * Every word of the query has to match a word of the text: the same word, a start of it, or a near miss (one letter wrong, missing,
 * extra or swapped for a short word, two for a long one). The score is lower for a better match.
 */
export const words = (s: string): string[] => s.toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9]+/).filter(Boolean);

/** Edit distance with a swap of two neighbours counting as one, and a give-up point so long words don't cost much. */
export function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

/** How well one query word matches a text's words: 0 the same, 1 a start of one, 2 and 3 near misses; null for none. */
function wordScore(q: string, text: string[]): number | null {
  let best: number | null = null;
  const room = q.length >= 7 ? 2 : q.length >= 4 ? 1 : 0;
  for (const t of text) {
    let s: number | null = null;
    if (t === q) s = 0;
    else if (t.startsWith(q)) s = 1;
    else if (room) {
      const d = distance(q, t.slice(0, q.length + room), room);
      const whole = distance(q, t, room);
      const m = Math.min(d, whole);
      if (m <= room) s = 1 + m;
    }
    if (s !== null && (best === null || s < best)) best = s;
    if (best === 0) break;
  }
  return best;
}

/** The score of a text for a query, or null when a query word matches nothing in it. */
export function fuzzyScore(query: string[], text: string): number | null {
  const tw = words(text);
  let total = 0;
  for (const q of query) {
    const s = wordScore(q, tw);
    if (s === null) return null;
    total += s;
  }
  return total;
}
