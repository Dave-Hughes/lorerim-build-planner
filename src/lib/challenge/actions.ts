"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { challengeOn } from "./gate";
import { MAX_RUN_FILE_BYTES, RUN_FILE_WORDS, readRunFile } from "./run-file";
import { removeRun, saveRun } from "./store";

export type UploadState = { error: string } | null;

const WORDS = {
  off: "The challenge pages are closed.",
  signIn: "Sign in with Discord first.",
  noFile: "Choose your run file first.",
  older: "The run on your page for this character is newer than that file.",
  badDate: RUN_FILE_WORDS.notRunFile,
} as const;

/** Takes a player's run file from the upload form, checks its seal and saves it. On success it goes to the run's page. */
export async function uploadRun(_previous: UploadState, formData: FormData): Promise<UploadState> {
  if (!challengeOn()) return { error: WORDS.off };
  const userId = (await auth())?.user?.id;
  if (!userId) return { error: WORDS.signIn };
  if (await looksLikeBot()) return { error: BOT_MESSAGE };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: WORDS.noFile };
  if (file.size > MAX_RUN_FILE_BYTES) return { error: RUN_FILE_WORDS.tooBig };

  const read = readRunFile(await file.text());
  if (!read.ok) return { error: read.error };
  if (Number.isNaN(new Date(read.run.written).getTime())) return { error: WORDS.badDate };

  const saved = await saveRun(userId, read.run, read.seal);
  if (!saved.ok) return { error: WORDS.older };
  revalidatePath("/challenge/leaderboard");
  revalidatePath(`/challenge/run/${saved.id}`);
  redirect(`/challenge/run/${saved.id}`);
}

/** A player takes their own run off the leaderboard. */
export async function deleteRun(formData: FormData): Promise<void> {
  const userId = (await auth())?.user?.id;
  const id = String(formData.get("id") ?? "");
  if (!userId || !id) return;
  await removeRun(id, userId);
  revalidatePath("/challenge/leaderboard");
  redirect("/challenge/leaderboard");
}
