import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AddRun } from "@/components/playthrough/add-run";
import { getBuild } from "@/lib/builds/queries";
import { playthroughsOn } from "@/lib/features";
import { runOfBuild } from "@/lib/playthroughs/queries";
import { requireGameData, isKnownVersion } from "@/lib/rules/server";

export const metadata: Metadata = { title: "Add a run" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/** Add a run (WO-114): The run step on one of the player's builds that has none. */
export default async function AddRunPage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId || !isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  const run = await runOfBuild(id, userId);
  if (run) redirect(`/p/${run.id}`);
  const start = build.plan.start ? requireGameData(build.gameVersion).startByName.get(build.plan.start) : undefined;
  return <AddRun buildId={id} buildName={build.name} initial={{ name: build.name, line: build.description, place: start?.place ?? "" }} startQuest={start?.quest ?? null} />;
}
