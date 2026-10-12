import "server-only";
import { checkBotId } from "botid/server";

export const BOT_MESSAGE = "That didn't look like a person. Reload the page and try again.";

/**
 * Vercel BotID (WO-40), Basic mode, on the actions that write and on sign-in. Only checked on
 * Vercel's deployments (locally there's no BotID to ask); if the check itself fails, the request
 * goes through rather than blocking a player.
 */
export async function looksLikeBot(): Promise<boolean> {
  if (!process.env.VERCEL) return false;
  try {
    return (await checkBotId()).isBot;
  } catch {
    return false;
  }
}
