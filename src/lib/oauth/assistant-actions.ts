"use server";

import { auth } from "@/auth";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import type { ActionResult } from "@/lib/builds/actions";
import { revokeAssistant } from "./assistants";

/** Revoke on /me (WO-109): cuts an assistant off from this player's account at once. */
export async function revokeAssistantAction(clientId: string): Promise<ActionResult> {
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: "Sign in first." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  await revokeAssistant(userId, clientId.slice(0, 500));
  return { ok: true, value: undefined };
}
