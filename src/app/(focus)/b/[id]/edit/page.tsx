import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Editor } from "@/components/editor/editor";
import { GameDataProvider } from "@/components/game-data";
import { SiteHeader } from "@/components/site-header";
import { getBuild } from "@/lib/builds/queries";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";
import { getGuide } from "@/lib/guide/queries";

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
  const guide = await getGuide(id, build.plan);
  return (
    <>
      <SiteHeader />
      <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
        <Editor
          buildId={id}
          name={build.name}
          visibility={build.visibility}
          initialPlan={build.plan}
          initialLevel={Number(level) || 0}
          converted={from ? { from: from.slice(0, 40), dropped: (dropped ?? "").slice(0, 600) } : undefined}
          guide={Object.fromEntries(Object.entries(guide).map(([k, v]) => [k, v.doc]))}
        />
      </GameDataProvider>
    </>
  );
}
