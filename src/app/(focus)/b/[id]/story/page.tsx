import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GameDataProvider } from "@/components/game-data";
import { SiteHeader } from "@/components/site-header";
import { StoryPage } from "@/components/guide/story-page";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";
import { getBuild } from "@/lib/builds/queries";
import { docText, emptyDoc } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Story" };
export const dynamic = "force-dynamic";

/** The owner's page for the build's Story (WO-79). */
export default async function StoryEditPage({ params }: { params: Params }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  if (!isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  const guide = await getGuide(id, build.plan);
  return (
    <>
      <SiteHeader />
      <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
        <StoryPage
          buildId={id}
          name={build.name}
          visibility={build.visibility}
          plan={build.plan}
          initial={guide.story?.doc ?? emptyDoc()}
          title={docText(guide["story:title"]?.doc)}
          line={docText(guide["story:line"]?.doc)}
        />
      </GameDataProvider>
    </>
  );
}
