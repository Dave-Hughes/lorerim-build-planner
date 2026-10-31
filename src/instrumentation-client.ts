import { initBotId } from "botid/client/core";
import { BOT_PROTECTED } from "@/lib/moderation/protect";

/*
 * Vercel BotID (WO-40), Basic mode: POSTs from the site's pages carry the check. The paths are listed in src/lib/moderation/protect.ts, with the reason, and a test fails when a page or
 * a route that asks `looksLikeBot()` (src/lib/moderation/bot.ts, on Vercel only) is left off it (WO-185 Part 1).
 */
initBotId({ protect: BOT_PROTECTED });
