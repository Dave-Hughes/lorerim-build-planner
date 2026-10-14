/** Browse builds state, shared by the page (server) and its filter row (client). */
export interface BrowseState {
  q: string;
  tags: string[];
  race: string;
  /** A version id, or "all". */
  version: string;
  sort: "newest" | "liked";
}

/** The Browse builds address for a state: only what differs from the defaults, so links stay short. */
export function browseHref(s: BrowseState, defaultVersion: string, n?: number): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.tags.length) p.set("tags", s.tags.join(","));
  if (s.race) p.set("race", s.race);
  if (s.sort !== "newest") p.set("sort", s.sort);
  if (s.version !== defaultVersion) p.set("version", s.version);
  if (n) p.set("n", String(n));
  const qs = p.toString();
  return qs ? `/?${qs}` : "/";
}
