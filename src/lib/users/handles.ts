/**
 * Handles for /u/<handle>: made from the Discord name. Lowercase letters, digits and "-", 3 to 30
 * characters; "player" when nothing usable is left; "-2", "-3"... when taken.
 */
export const HANDLE_MIN = 3;
export const HANDLE_MAX = 30;
export const FALLBACK_HANDLE = "player";

/** The handle a name asks for, before checking whether it's taken. */
export function handleBase(name: string | null | undefined): string {
  const base = (name ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // accents off their letters: "Éowyn" -> "eowyn"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, HANDLE_MAX)
    .replace(/-+$/, "");
  return base.length >= HANDLE_MIN ? base : FALLBACK_HANDLE;
}

/** The first of base, base-2, base-3... that isn't taken, never longer than HANDLE_MAX. */
export function freeHandle(base: string, taken: ReadonlySet<string>): string {
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const suffix = `-${n}`;
    const h = `${base.slice(0, HANDLE_MAX - suffix.length).replace(/-+$/, "")}${suffix}`;
    if (!taken.has(h)) return h;
  }
}

/** Whether a string could be a handle at all (the /u/<handle> route checks this before any query). */
export function isHandle(s: string): boolean {
  return s.length >= HANDLE_MIN && s.length <= HANDLE_MAX && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);
}
