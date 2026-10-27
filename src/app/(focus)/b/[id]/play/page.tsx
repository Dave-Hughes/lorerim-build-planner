import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { PlanRun } from "@/components/playthrough/plan-run";
import { SiteHeader } from "@/components/site-header";
import { getBuild } from "@/lib/builds/queries";
import { editFrameForBuild } from "@/lib/edit/frame";
import { playthroughsOn } from "@/lib/features";
import { runOfBuild } from "@/lib/playthroughs/queries";
import { isKnownVersion, requireGameData } from "@/lib/rules/server";

export const metadata: Metadata = { title: "Playthrough" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * The Playthrough tab of a character with no run yet (WO-159): the owner sees the tab from the start, and it opens here. With a run, the
 * tab is the run's own page.
 */
export default async function PlaythroughTabPage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId || !isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  const run = await runOfBuild(id, userId);
  if (run) redirect(`/p/${run.id}/edit/play`);
  const start = build.plan.start ? requireGameData(build.gameVersion).startByName.get(build.plan.start) : undefined;
  return (
    <EditFrameProvider data={await editFrameForBuild(build, userId)}>
      <SiteHeader />
      <PlanRun buildId={id} name={build.name} visibility={build.visibility} initial={{ name: build.name, line: build.description, place: start?.place ?? "" }} startQuest={start?.quest ?? null} />
    </EditFrameProvider>
  );
}
