/**
 * The paths whose POSTs carry Vercel BotID's token (WO-40, WO-185 Part 1). BotID reads a POST to a path that isn't listed as a bot, and a bot is told "That didn't look like a
 * person" (the WO-184 uploads) or, from a sign-in button, silently nothing. So: every page (a server action posts to the page that shows it, and every page's header has the
 * sign-in button), and every route a page's script posts to that asks `looksLikeBot()`. `bot-protect.test.ts` fails when a page or a checked route is left out. Not the
 * guide's autosave (/api/builds/<id>/guide): it is sent with keepalive as the page closes, and BotID's client can't sign a request then.
 */
export const BOT_PROTECTED: { path: string; method: "POST" }[] = [
  { path: "/", method: "POST" },
  // The pages. A bare section and everything under it.
  ...["/signin", "/new", "/me", "/admin", "/invite", "/quests", "/people", "/places", "/gear", "/guide", "/characters", "/map", "/changes", "/search", "/playthroughs", "/help-fill-the-gaps", "/coming-soon", "/oauth/authorize"].map((path) => ({ path, method: "POST" as const })),
  ...["/b", "/u", "/p", "/admin", "/invite", "/quests", "/people", "/places", "/gear", "/guide", "/playthroughs"].map((p) => ({ path: `${p}/*`, method: "POST" as const })),
  // The routes a page posts to.
  { path: "/api/covers", method: "POST" },
  { path: "/api/builds/*/images", method: "POST" },
  { path: "/api/screenshots", method: "POST" },
  { path: "/api/tips", method: "POST" },
];

/** BotID's own matching: `*` is anything, the rest is literal, and the whole path must match. */
export const botPathMatches = (pattern: string, path: string): boolean => new RegExp(`^${pattern.replace(/[.?+^$[\]\\(){}|-]/g, "\\$&").split("*").join(".*")}$`).test(path);

export const isBotProtected = (path: string): boolean => BOT_PROTECTED.some((p) => botPathMatches(p.path, path));
