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

/** What a read's place says when it names no place: a spot, "around", "wherever". */
const NO_PLACE = /^(?:around|about|near|by|wherever|somewhere|anywhere)\b|\b(?:a|some|any)\s+(?:set\s+)?(?:spot|place|point)\b|\bwherever\b|\bsomewhere\b/i;
/** Their bed, their room, their post, in a place: the place ("her bed in Meridia's Sanctum" is "Meridia's Sanctum"). */
const OWN_SPOT = /^(?:her|his|their|its)\s+(?:own\s+)?(?:bed|beds|room|rooms|quarters|house|home|cell|chambers?|post|stall|desk|corner|spot|table|chair)\s+(?:in|at|of|inside)\s+(?:the\s+)?/i;

/** The named place a read's words give ("her bed in Meridia's Sanctum" is "Meridia's Sanctum"), or null when they name none ("around a spot by Riften"). */
export function placeOnly(where: string): string | null {
  const first = where.split(",")[0].trim();
  if (!first) return null;
  const t = first.replace(OWN_SPOT, "").replace(/^(?:the\s+)/i, "").trim();
  return !t || NO_PLACE.test(first) || NO_PLACE.test(t) ? null : t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Where a person is by day (8 am to 6 pm) and at night (10 pm to 6 am), each the place the read puts them in most of those hours (WO-185 Part 4):
 * said plainly, one of them left out when the read doesn't say it, never "around a spot by".
 */
export function dayAndNight(rows: DayRow[]): { day: string | null; night: string | null } {
  const laid: (string | null)[] = Array.from({ length: 24 }, () => null);
  for (const r of rows) {
    const at = /^any hour$/i.test(r.from) ? 0 : hourOf(r.from);
    const len = /^any hour$/i.test(r.from) ? 24 : spanOf(r.for);
    if (at === null || len === null || len <= 0) continue;
    for (let i = 0; i < Math.min(24, Math.ceil(len)); i++) {
      const h = (at + i) % 24;
      if (laid[h] === null) laid[h] = placeOnly(r.where) ?? "";
    }
  }
  const most = (hrs: number[]) => {
    const counts = new Map<string, number>();
    for (const h of hrs) if (laid[h]) counts.set(laid[h]!, (counts.get(laid[h]!) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  };
  return { day: most([8, 9, 10, 11, 12, 13, 14, 15, 16, 17]), night: most([22, 23, 0, 1, 2, 3, 4, 5]) };
}

/** The place a person is in most hours of the day, and the places in the order they first appear. */
export function mainPlace(hours: (string | null)[]): { main: string; places: string[] } | null {
  const counts = new Map<string, number>();
  for (const h of hours) if (h) counts.set(h, (counts.get(h) ?? 0) + 1);
  if (!counts.size) return null;
  const places = [...counts.keys()];
  return { main: [...counts].sort((a, b) => b[1] - a[1])[0][0], places };
}
