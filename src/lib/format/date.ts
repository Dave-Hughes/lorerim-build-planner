/** "9 Oct 2026", in the given time zone (the viewer's on the page: see LocalDate). */
export function formatDate(d: Date | string, timeZone = "UTC"): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone }).format(typeof d === "string" ? new Date(d) : d);
}

/** "11 Oct", in the given time zone. */
export function formatDayMonth(d: Date | string, timeZone = "UTC"): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone }).format(typeof d === "string" ? new Date(d) : d);
}
