import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Editor } from "@/components/editor/editor";
import { GameDataProvider } from "@/components/game-data";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { editFrameForBuild } from "@/lib/edit/frame";
import { SiteHeader } from "@/components/site-header";
import { getBuild } from "@/lib/builds/queries";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";
import { getGuide } from "@/lib/guide/queries";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string; from?: string; dropped?: string; tab?: string; act?: string }>;

export const metadata: Metadata = { title: "Edit build" };
export const dynamic = "force-dynamic";

export default async function EditPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { level, from, dropped, tab, act }, session] = await Promise.all([params, searchParams, auth()]);
  // The character's page names its tabs ?tab=playthrough; the editor's are paths (WO-179 Part 2).
  if (tab === "playthrough") redirect(`/b/${id}/edit/play${act ? `?act=${encodeURIComponent(act)}` : ""}`);
  if (tab === "story") redirect(`/b/${id}/edit/story`);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  // The editor only works against the build's own version; one the planner no longer has can only be viewed.
  if (!isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  const [guide, frame] = await Promise.all([getGuide(id, build.plan), editFrameForBuild(build, userId)]);
  return (
    <EditFrameProvider data={frame}>
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
    </EditFrameProvider>
  );
}
