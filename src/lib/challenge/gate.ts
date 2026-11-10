/**
 * Zenithar's Challenge: the page about the challenge mod, the leaderboard and each player's run. No "server-only"
 * here: the proxy reads it.
 *
 * FEATURE_CHALLENGE set to "on" (or "1", "true") turns the pages on; "off" turns them off. Unset, they are on under
 * `next dev` and on staging (Vercel's preview), so Dave sees them there without a setting, and off on production
 * until he sets it. Off, every address under /challenge is the not found page.
 */
export const challengeOn = (env: Record<string, string | undefined> = process.env) => {
  const v = env.FEATURE_CHALLENGE?.trim().toLowerCase();
  if (!v) return env.NODE_ENV === "development" || env.VERCEL_ENV === "preview";
  return v === "on" || v === "1" || v === "true";
};

/** The addresses that belong to the challenge. They stay open when the coming soon page covers the rest of the site. */
export function isChallengePath(path: string): boolean {
  return /^\/challenge(\/|$)/.test(path);
}
