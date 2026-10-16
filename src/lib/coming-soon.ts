/**
 * The coming soon switch (WO-84): FEATURE_COMING_SOON set to "on" (or "1", "true") puts the coming
 * soon page in front of every page. Unlike the WO-81 switches it has no `next dev` default: unset, it
 * is off everywhere, so dev, staging and e2e show the app. Dave turns it on for production only.
 * No "server-only" here: the proxy reads it.
 */
export function comingSoonOn(env: Record<string, string | undefined> = process.env): boolean {
  const v = env.FEATURE_COMING_SOON?.trim().toLowerCase();
  return v === "on" || v === "1" || v === "true";
}

/** Paths that are never the coming soon page: sign-in, the share card, icons and files, the page itself. */
export function passesComingSoon(path: string): boolean {
  return (
    path === "/signin" ||
    path === "/coming-soon" ||
    path.startsWith("/api/") ||
    path.startsWith("/og") ||
    path.startsWith("/_next/") ||
    path.startsWith("/icons/") ||
    path.startsWith("/coming-soon/") ||
    // A file: an image, the icon, robots.txt. Not a build's card.png: that would show a build
    // to anyone with the link while the site is closed (Dave, 16 Oct).
    (/\.[a-z0-9]+$/i.test(path) && !path.startsWith("/b/") && !path.startsWith("/u/"))
  );
}
