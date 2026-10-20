import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GameDataProvider } from "@/components/game-data";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { editFrameForBuild } from "@/lib/edit/frame";
import { SiteHeader } from "@/components/site-header";
import { GuidePage } from "@/components/guide/guide-page";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";
import { getBuild } from "@/lib/builds/queries";
import { emptyDoc } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Guide" };
export const dynamic = "force-dynamic";

export default async function GuideEditPage({ params }: { params: Params }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  if (!isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  const [guide, frame] = await Promise.all([getGuide(id, build.plan), editFrameForBuild(build, userId)]);
  return (
    <EditFrameProvider data={frame}>
      <SiteHeader />
      <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
        <GuidePage buildId={id} name={build.name} visibility={build.visibility} plan={build.plan} initial={guide.overview?.doc ?? emptyDoc()} intro={guide.intro?.doc ?? emptyDoc()} />
      </GameDataProvider>
    </EditFrameProvider>
  );
}
