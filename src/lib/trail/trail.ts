/**
 * The pages a visitor has been through in this tab (WO-159 Part 3), so a back link on a quest, line, person or place page can go back to
 * the page they came from and name it. It lives in sessionStorage, mirrors the browser's history when they step back, and starts over when
 * the tab is opened from outside the site (a shared link, a search engine).
 */
const KEY = "planner.trail";
const MAX = 30;

export interface Stop {
  /** Path and query, as the address bar shows them. */
  path: string;
  /** The page's title, without the site's name. */
  title: string;
}


export function readTrail(): Stop[] {
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((s): s is Stop => typeof s?.path === "string" && typeof s?.title === "string") : [];
  } catch {
    return [];
  }
}

export function writeTrail(trail: Stop[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(trail.slice(-MAX)));
  } catch {
    // Storage blocked: the links go to their home pages.
  }
}

/** A page's own name: the first part of its title ("Lights Out! | Side stories | LoreRim Build Planner" is "Lights Out!"); the home page's is "Home". */
export const cleanTitle = (title: string) => {
  const t = title.split(/\s+\|\s+/)[0].trim();
  return !t || /^LoreRim (Build )?Planner$/.test(t) ? "Home" : t;
};

/** The pathname part of a stop's path. */
export const pathnameOf = (path: string) => path.split("?")[0];

/** The page before this one: the latest stop whose page is not this one, or null when the visitor came from outside. */
export function previousStop(trail: Stop[], here: string): Stop | null {
  for (let i = trail.length - 1; i >= 0; i--) if (pathnameOf(trail[i].path) !== here) return trail[i];
  return null;
}
