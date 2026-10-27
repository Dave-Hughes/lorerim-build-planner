/**
 * What the quest page says about where to meet someone (WO-154 Part 4): the place the read names, and not the hours. Dave's rule: the quest
 * page names the person and the one place to meet them for this quest; where they are through the day is on their own page.
 * The reads word it as a place and then a schedule ("the Riften Fishery by day; Bolli's House early morning"), so the place is what comes
 * before the first thing that is a time, a second place after a semicolon, or a clause about what they do.
 */
const CUT = [
  /[;:(]/, // a second place, a note
  /\.\s/, // a second sentence
  /\s+-\s+/,
  /,\s+(?:he|she|they|who|working|selling|walking|hanging|eating|trains|sleeps|stands|stays)\b/i,
  /\s+(?:from|by day|by night|at night|early|late|until|after|before|at first|at all hours|in the (?:morning|evening|afternoon)|for \d+|around \d|\d+(?::\d+)?\s*(?:am|pm))\b/i,
];

export function placeOnly(where: string | undefined): string | undefined {
  if (!where) return undefined;
  let t = where.trim();
  for (const re of CUT) {
    const m = re.exec(t);
    if (m && m.index > 0) t = t.slice(0, m.index);
  }
  t = t.replace(/[\s,.]+$/, "").replace(/^(?:behind the counter in|out in|inside)\s+/i, "");
  return t || undefined;
}

/** A place the read doesn't know: "wherever the long-dead lovers are", "somewhere in Skyrim". The page says "Not known yet". */
export const vaguePlace = (text: string | undefined): boolean => !!text && /\b(wherever|somewhere|anywhere)\b/i.test(text);
