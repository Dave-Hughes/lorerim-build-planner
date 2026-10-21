"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import type { ActionResult } from "@/lib/builds/actions";
import type { BuildVisibility } from "@/lib/builds/validate";
import { playthroughsOn } from "@/lib/features";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { currentVersion } from "@/lib/rules/server";
import type { ActInput, ObjectiveInput, SnapshotInput } from "./validate";
import type { ObjectiveStatus } from "./types";
import * as w from "./writes";

/**
 * The playthrough pages' actions (WO-111): each runs one write from writes.ts for the signed-in
 * player, the same writes the assistants' tools use, and answers with the refusal's words.
 */

async function run<T>(id: string | null, write: (userId: string) => Promise<T>): Promise<ActionResult<T>> {
  if (!playthroughsOn()) return { ok: false, error: "Not found." };
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Your sign-in expired. Sign in again to keep saving." };
  try {
    const value = await write(userId);
    if (id) {
      revalidatePath(`/p/${id}`);
      revalidatePath(`/p/${id}/tale`);
      revalidatePath(`/p/${id}/edit`);
    }
    revalidatePath("/me");
    return { ok: true, value };
  } catch (e) {
    if (e instanceof w.PlaythroughError) return { ok: false, error: e.message };
    throw e;
  }
}

export async function newPlaythrough(input: { name: string; line?: string; buildId?: string | null }): Promise<ActionResult<{ id: string }>> {
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  return run(null, async (u) => ({ id: await w.createPlaythrough(u, { ...input, gameVersion: currentVersion().id }) }));
}

export const saveDetails = async (id: string, input: { name?: string; line?: string; buildId?: string | null; visibility?: BuildVisibility; showDrafted?: boolean; taleTitle?: string; taleLine?: string }) =>
  run(id, (u) => w.setDetails(u, id, input));
/** The character's cover, set on the build (WO-114). */
export const saveCover = async (id: string, url: string | null) => run(id, (u) => w.setCover(u, id, url));
export const removePlaythrough = async (id: string) => run(null, (u) => w.deletePlaythrough(u, id));

export const newAct = async (id: string, input: ActInput) => run(id, (u) => w.addAct(u, id, input));
export const saveAct = async (id: string, actId: number, input: Partial<ActInput>) => run(id, (u) => w.setAct(u, id, actId, input));
export const saveActImage = async (id: string, actId: number, url: string | null) => run(id, (u) => w.setActImage(u, id, actId, url));
export const removeAct = async (id: string, actId: number) => run(id, (u) => w.removeAct(u, id, actId));
export const moveAct = async (id: string, actId: number, to: "up" | "down" | number) => run(id, (u) => w.moveAct(u, id, actId, to));

export const newObjective = async (id: string, actId: number, input: ObjectiveInput, after?: number | null) => run(id, (u) => w.addObjective(u, id, actId, input, { after }));
export const saveObjective = async (id: string, objectiveId: number, input: Partial<ObjectiveInput>) => run(id, (u) => w.setObjective(u, id, objectiveId, input));
export const removeObjective = async (id: string, objectiveId: number) => run(id, (u) => w.removeObjective(u, id, objectiveId));
/** Up, down, to a place (1-based), or with `toAct` to the end of another act (WO-117). */
export const moveObjective = async (id: string, objectiveId: number, to: "up" | "down" | number, toAct?: number) => run(id, (u) => w.moveObjective(u, id, objectiveId, to, toAct));
export const tick = async (id: string, objectiveId: number, status: ObjectiveStatus) => run(id, (u) => w.setStatus(u, id, objectiveId, status));
export const answer = async (id: string, objectiveId: number, accept: boolean) => run(id, (u) => w.answerSuggestion(u, id, objectiveId, accept));

export const newChapter = async (id: string, input: { title: string; actId?: number | null; unlocksWhen?: number | null }) => run(id, (u) => w.addChapter(u, id, input));
export const saveChapter = async (id: string, chapterId: number, input: { title?: string; doc?: unknown; unlocksWhen?: number | null; fromSave?: string | null }) => run(id, (u) => w.setChapter(u, id, chapterId, input));
export const removeChapter = async (id: string, chapterId: number) => run(id, (u) => w.removeChapter(u, id, chapterId));
export const moveChapter = async (id: string, chapterId: number, to: "up" | "down" | number) => run(id, (u) => w.moveChapter(u, id, chapterId, to));
export const saveChapterImage = async (id: string, chapterId: number, url: string | null) => run(id, (u) => w.setChapterImage(u, id, chapterId, url));
export const saveChapterFocus = async (id: string, chapterId: number, focus: { x: number; y: number } | null) => run(id, (u) => w.setChapterFocus(u, id, chapterId, focus));
export const saveActFocus = async (id: string, actId: number, focus: { x: number; y: number } | null) => run(id, (u) => w.setActFocus(u, id, actId, focus));
export const saveTalePicture = async (id: string, url: string | null) => run(id, (u) => w.setTalePicture(u, id, url));
/** An act's chapter, made on its first word (WO-117). */
export const writeActChapter = async (id: string, actId: number, input: { title?: string; doc?: unknown }) => run(id, (u) => w.writeActChapter(u, id, actId, input));

/** Enter it by hand: level, day, place and the skills the objectives name. */
export const enterByHand = async (id: string, input: Omit<SnapshotInput, "source" | "readBy">) => run(id, (u) => w.setSnapshot(u, id, { ...input, source: "hand", readBy: null }));

/** The owner read a beat before it opened; kept, and nothing is ticked. */
export const readEarly = async (id: string, chapterId: number) => run(null, (u) => w.markRead(u, id, [chapterId]));

/** A chapter's text from the Story editor, autosaved (the same checks as the Story, WO-79). */
export const saveChapterDoc = async (id: string, chapterId: number, doc: unknown) => run(id, (u) => w.setChapter(u, id, chapterId, { doc }));

/** Add a run to a build alone (WO-114), from the same step. */
export const addRun = async (buildId: string, input: w.RunInput) =>
  run(null, async (u) => {
    const id = await w.attachRun(u, buildId, input);
    revalidatePath(`/b/${buildId}`);
    return { id };
  });
