import "server-only";

/**
 * Switches for parts held back from launch (WO-81), read from the environment so they come back
 * without a code change: "on" (or "1", "true") turns one on. Unset, they're on only under `next dev`;
 * production and staging leave them off, and the e2e server turns them on.
 */
function flag(name: string): boolean {
  const v = process.env[name]?.trim().toLowerCase();
  if (!v) return process.env.NODE_ENV === "development";
  return v === "on" || v === "1" || v === "true";
}

/** The Story (WO-79): its tab, its page in the edit bar, its route, and its tag on build cards. */
export const storyOn = () => flag("FEATURE_STORY");
/** The site's beginner's guide: /guide and its chapters, Mods, Questions and Terms, and its links. */
export const siteGuideOn = () => flag("FEATURE_SITE_GUIDE");

export interface Features {
  story: boolean;
  siteGuide: boolean;
}
export const features = (): Features => ({ story: storyOn(), siteGuide: siteGuideOn() });
