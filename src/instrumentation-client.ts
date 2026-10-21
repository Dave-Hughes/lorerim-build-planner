import { initBotId } from "botid/client/core";

/*
 * Vercel BotID (WO-40), Basic mode: POSTs from the site's pages carry the check, which covers sign-in
 * (from any page's header, and the /signin page) and the server actions that write (create, save, like, report, copy), and
 * the image uploads. The server asks it in src/lib/moderation/bot.ts, on Vercel only. Not the guide's
 * autosave endpoint (/api/builds/<id>/guide): it's sent with keepalive as the page closes, and
 * BotID's client can't sign a request then.
 */
initBotId({
  protect: [
    { path: "/", method: "POST" },
    // The sign-in page behind the coming soon page (WO-84): without it here, its button's POST had no
    // BotID token, read as a bot, and did nothing (found 16 Oct on lorerimplanner.com).
    { path: "/signin", method: "POST" },
    { path: "/new", method: "POST" },
    { path: "/me", method: "POST" },
    { path: "/b/*", method: "POST" },
    { path: "/u/*", method: "POST" },
    // "/admin/*" doesn't cover /admin itself, where Import a build (WO-90) posts: without this its
    // button read as a bot (found 16 Oct on lorerimplanner.com).
    { path: "/admin", method: "POST" },
    { path: "/admin/*", method: "POST" },
    // An early-access invite's Come in (WO-96).
    { path: "/invite/*", method: "POST" },
    // This was wrong on a quest line's page (WO-103).
    { path: "/quests/*", method: "POST" },
    { path: "/api/covers", method: "POST" },
    { path: "/api/builds/*/images", method: "POST" },
  ],
});
