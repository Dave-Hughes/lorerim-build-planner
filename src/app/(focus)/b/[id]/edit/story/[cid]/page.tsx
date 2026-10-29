import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { RunStoryEdit } from "@/components/playthrough/story-edit";
import { getBuild } from "@/lib/builds/queries";
import { playthroughsOn } from "@/lib/features";
import { runOfBuild } from "@/lib/playthroughs/queries";

export const metadata: Metadata = { title: "Editing the story" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string; cid: string }>;

/** A page of the character's Story in edit mode (WO-117, WO-179 Part 2): the title page, a chapter, or an act's chapter not written yet. */
export default async function EditStoryPagePage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const [{ id, cid }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(/^\d+$/.test(cid) ? `/b/${id}/story/${cid}` : `/b/${id}`);
  const run = await runOfBuild(id, userId);
  // A character with no run has its one Story page here.
  if (!run) redirect(`/b/${id}/edit/story`);
  return RunStoryEdit({ id: run.id, page: cid });
}
