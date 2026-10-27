"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { confirmPage, confirmationsOf, undoConfirm, type ConfirmKind } from "./confirmations";

type Result = { ok: true; names: string[] } | { ok: false; error: string };
const KINDS: ConfirmKind[] = ["quest", "person", "place"];

async function run(kind: string, key: string, path: string, change: typeof confirmPage): Promise<Result> {
  if (!questsOn() || !KINDS.includes(kind as ConfirmKind)) return { ok: false, error: "Not found." };
  const userId = (await auth())?.user?.id;
  if (!userId) return { ok: false, error: "Sign in with Discord to confirm." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  const k = String(key).slice(0, 200);
  await change(kind as ConfirmKind, k, userId);
  if (path.startsWith("/")) revalidatePath(path);
  return { ok: true, names: (await confirmationsOf(kind as ConfirmKind, k, userId)).names };
}

/** "I can confirm this is accurate": a signed-in player's word on a quest, person or place page. */
export const confirmAccurate = async (kind: string, key: string, path: string): Promise<Result> => run(kind, key, path, confirmPage);

/** Undo it. */
export const undoConfirmation = async (kind: string, key: string, path: string): Promise<Result> => run(kind, key, path, undoConfirm);
