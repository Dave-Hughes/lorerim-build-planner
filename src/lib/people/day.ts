/**
 * A person's day as 24 hours (WO-165): the read's day rows ("8 am", "for 2 hours", "the Riverwood Trader, Riverwood") laid out hour by hour, each
 * hour with the first place the rows name for it, for the day strip. Rows with no hours (any hour, 24 hours) are the whole day.
 */
export interface DayRow {
  from: string;
  for: string;
  where: string;
  doing?: string;
}

/** "8 am", "midnight", "noon", "3:30 pm" as a start hour (0 to 23), or null for "any hour" and the words this can't read. */
export function hourOf(from: string): number | null {
  const t = from.trim().toLowerCase();
  if (t === "midnight") return 0;
  if (t === "noon") return 12;
  const m = /^(\d{1,2})(?::\d\d)?\s*(am|pm)$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]) % 12;
  return m[2] === "pm" ? h + 12 : h;
}

/** "2 hours", "1 hour", "30 minutes", "24 hours" as hours; null when the words aren't a length. */
export function spanOf(span: string): number | null {
  const m = /^(\d+(?:\.\d+)?)\s*(hours?|minutes?)$/i.exec(span.trim());
  if (!m) return null;
  return /^h/i.test(m[2]) ? Number(m[1]) : Number(m[1]) / 60;
}

/** The place's name in a row ("the Riverwood Trader, Riverwood" is "the Riverwood Trader"). */
export const placeKeyOf = (where: string) => where.split(",")[0].trim().replace(/^the\s+/i, "");

/** The 24 hours' places, from the rows; an hour no row covers is null. Null overall when the rows don't give hours to lay out. */
export function dayHours(rows: DayRow[]): (string | null)[] | null {
  const hours: (string | null)[] = Array.from({ length: 24 }, () => null);
  let laid = 0;
  for (const r of rows) {
    const at = /^any hour$/i.test(r.from) ? 0 : hourOf(r.from);
    const len = /^any hour$/i.test(r.from) ? 24 : spanOf(r.for);
    if (at === null || len === null || len <= 0) continue;
    for (let i = 0; i < Math.min(24, Math.ceil(len)); i++) {
      const h = (at + i) % 24;
      if (!hours[h]) {
        hours[h] = placeKeyOf(r.where);
        laid++;
      }
    }
  }
  return laid ? hours : null;
}

/** The place a person is in most hours of the day, and the places in the order they first appear. */
export function mainPlace(hours: (string | null)[]): { main: string; places: string[] } | null {
  const counts = new Map<string, number>();
  for (const h of hours) if (h) counts.set(h, (counts.get(h) ?? 0) + 1);
  if (!counts.size) return null;
  const places = [...counts.keys()];
  return { main: [...counts].sort((a, b) => b[1] - a[1])[0][0], places };
}
