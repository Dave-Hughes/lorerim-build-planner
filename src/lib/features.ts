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
/** The Gear page (WO-92): /gear, every item's page, and Gear in the header. */
export const gearOn = () => flag("FEATURE_GEAR");
/**
 * The Quests pages (WO-100): /quests, its categories and lines, and Quests in the header. Unlike the
 * others, unset it's on on staging too (Vercel's preview), so Dave sees it there without a setting.
 */
export const questsOn = (env: Record<string, string | undefined> = process.env) => {
  const v = env.FEATURE_QUESTS?.trim().toLowerCase();
  if (!v) return env.NODE_ENV === "development" || env.VERCEL_ENV === "preview";
  return v === "on" || v === "1" || v === "true";
};

/**
 * The planner's MCP route (WO-108), for assistants: the same as the Quests pages, on in dev and on
 * staging unset, off on production unless FEATURE_MCP says so.
 */
export const mcpOn = (env: Record<string, string | undefined> = process.env) => {
  const v = env.FEATURE_MCP?.trim().toLowerCase();
  if (!v) return env.NODE_ENV === "development" || env.VERCEL_ENV === "preview";
  return v === "on" || v === "1" || v === "true";
};

/**
 * Playthroughs (WO-111): /p/<id>, /playthroughs, My playthroughs on /me, Playthroughs in the header,
 * and the assistants' playthrough tools. On in dev and on staging unset, as the Quests pages.
 */
export const playthroughsOn = (env: Record<string, string | undefined> = process.env) => {
  const v = env.FEATURE_PLAYTHROUGHS?.trim().toLowerCase();
  if (!v) return env.NODE_ENV === "development" || env.VERCEL_ENV === "preview";
  return v === "on" || v === "1" || v === "true";
};

/**
 * Progress tracking (WO-181 Part 3): ticks and done marks on objectives, "x of y done", where she is in your game, her pin on the maps and the tools
 * that write them. Off for now, whatever the environment; turn it back on with PROGRESS_TRACKING=on and everything returns as it was.
 */
export const progressTracking = (env: Record<string, string | undefined> = process.env) => {
  const v = env.PROGRESS_TRACKING?.trim().toLowerCase();
  return v === "on" || v === "1" || v === "true";
};

export interface Features {
  story: boolean;
  siteGuide: boolean;
  gear: boolean;
  quests: boolean;
  playthroughs: boolean;
}
export const features = (): Features => ({ story: storyOn(), siteGuide: siteGuideOn(), gear: gearOn(), quests: questsOn(), playthroughs: playthroughsOn() });
