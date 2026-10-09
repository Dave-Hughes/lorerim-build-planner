const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "9 Oct 2026". Always UTC so server and client agree. */
export function formatDate(d: Date | string): string {
  return fmt.format(typeof d === "string" ? new Date(d) : d);
}
