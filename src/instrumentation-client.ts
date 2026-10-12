import { initBotId } from "botid/client/core";

/*
 * Vercel BotID (WO-40), Basic mode: POSTs from the site's pages carry the check, which covers sign-in
 * (from any page's header) and the server actions that write (create, save, like, report, copy), and
 * the image uploads. The server asks it in src/lib/moderation/bot.ts, on Vercel only. Not the guide's
 * autosave endpoint (/api/builds/<id>/guide): it's sent with keepalive as the page closes, and
 * BotID's client can't sign a request then.
 */
initBotId({
  protect: [
    { path: "/", method: "POST" },
    { path: "/new", method: "POST" },
    { path: "/me", method: "POST" },
    { path: "/b/*", method: "POST" },
    { path: "/u/*", method: "POST" },
    { path: "/admin/*", method: "POST" },
    { path: "/api/covers", method: "POST" },
    { path: "/api/builds/*/images", method: "POST" },
  ],
});
