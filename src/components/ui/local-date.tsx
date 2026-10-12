"use client";

import { useSyncExternalStore } from "react";
import { formatDate, formatDayMonth } from "@/lib/format/date";

const noop = () => () => {};
const zone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * A date in the viewer's own time zone, in a <time datetime>. The server doesn't know the viewer's
 * zone, so it renders UTC and the browser puts the right day in as it starts.
 */
export function LocalDate({ date, short, prefix = "" }: { date: Date | string; short?: boolean; prefix?: string }) {
  const tz = useSyncExternalStore(noop, zone, () => "UTC");
  const iso = typeof date === "string" ? date : date.toISOString();
  return (
    <time dateTime={iso}>
      {prefix}
      {short ? formatDayMonth(iso, tz) : formatDate(iso, tz)}
    </time>
  );
}
