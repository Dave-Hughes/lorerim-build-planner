import "server-only";

/**
 * Switches for parts held back from launch (WO-81), read from the environment so they come back
 * without a code change: "on" (or "1", "true") turns one on, anything else turns it off. Unset, they're
 * on only under `next dev`, plus on staging (Vercel previews) for a switch marked `staging`; production
 * leaves them off, and the e2e server sets each one.
 */
function flag(
  name: string,
  { staging = false }: { staging?: boolean } = {},
): boolean {
  const v = process.env[name]?.trim().toLowerCase();
  if (!v)
    return (
      process.env.NODE_ENV === "development" ||
      (staging && process.env.VERCEL_ENV === "preview")
    );
  return v === "on" || v === "1" || v === "true";
}

/** The Story (WO-79): its tab, its page in the edit bar, its route, and its tag on build cards. */
export const storyOn = () => flag("FEATURE_STORY");
/** The site's beginner's guide: /guide and its chapters, Mods, Questions and Terms, and its links. */
export const siteGuideOn = () => flag("FEATURE_SITE_GUIDE");
/** The Gear page (WO-92): /gear, every item's page, and Gear in the header. On by default on staging, so Dave can review it there. */
export const gearOn = () => flag("FEATURE_GEAR", { staging: true });

export interface Features {
  story: boolean;
  siteGuide: boolean;
  gear: boolean;
}
export const features = (): Features => ({
  story: storyOn(),
  siteGuide: siteGuideOn(),
  gear: gearOn(),
});
