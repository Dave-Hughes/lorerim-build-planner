import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Editor } from "@/components/editor/editor";
import { GameDataProvider } from "@/components/game-data";
import { getBuild } from "@/lib/builds/queries";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string; from?: string; dropped?: string }>;

export const metadata: Metadata = { title: "Edit build" };
export const dynamic = "force-dynamic";

export default async function EditPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { level, from, dropped }, session] = await Promise.all([params, searchParams, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  // The editor only works against the build's own version; one the planner no longer has can only be viewed.
  if (!isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  return (
    <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
      <Editor
        buildId={id}
        name={build.name}
        initialPlan={build.plan}
        initialLevel={Number(level) || 0}
        converted={from ? { from: from.slice(0, 40), dropped: (dropped ?? "").slice(0, 600) } : undefined}
      />
    </GameDataProvider>
  );
}
