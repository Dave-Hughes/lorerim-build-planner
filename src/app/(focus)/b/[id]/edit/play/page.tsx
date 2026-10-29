import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { PlanRun } from "@/components/playthrough/plan-run";
import { RunEdit } from "@/components/playthrough/run-edit";
import { SiteHeader } from "@/components/site-header";
import { getBuild } from "@/lib/builds/queries";
import { editFrameForBuild } from "@/lib/edit/frame";
import { playthroughsOn } from "@/lib/features";
import { runOfBuild } from "@/lib/playthroughs/queries";
import { isKnownVersion, requireGameData } from "@/lib/rules/server";

export const metadata: Metadata = { title: "Editing a playthrough" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string }>;

/**
 * The Playthrough tab in edit mode (WO-117), under its character (WO-179 Part 2): the run's editor, or, with no run yet, the page that
 * plans one (WO-159). Only the owner; anyone else goes to the character's page.
 */
export default async function EditPlayPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, { act }, session] = await Promise.all([params, searchParams, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId || !isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  const run = await runOfBuild(id, userId);
  if (run) return RunEdit({ id: run.id, act });
  const start = build.plan.start ? requireGameData(build.gameVersion).startByName.get(build.plan.start) : undefined;
  return (
    <EditFrameProvider data={await editFrameForBuild(build, userId)}>
      <SiteHeader />
      <PlanRun buildId={id} name={build.name} visibility={build.visibility} initial={{ name: build.name, line: build.description, place: start?.place ?? "" }} startQuest={start?.quest ?? null} />
    </EditFrameProvider>
  );
}
