import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GameDataProvider } from "@/components/game-data";
import { SiteHeader } from "@/components/site-header";
import { StoryWriter } from "@/components/playthrough/story-writer";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { editFrameForBuild } from "@/lib/edit/frame";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";
import { getBuild } from "@/lib/builds/queries";
import { docText, emptyDoc, firstPlate } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";
import { playthroughsOn, storyOn } from "@/lib/features";
import { runOfBuild } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Story" };
export const dynamic = "force-dynamic";

/** The build's Story (WO-79) in edit mode (WO-117): written in the reader's own layout, as a run's is. */
export default async function StoryEditPage({ params }: { params: Params }) {
  // Held back for launch (WO-81).
  if (!storyOn()) notFound();
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  if (!isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  // One tale per character (WO-114): with a run, the tale is the run's, and this editor is off.
  const run = playthroughsOn() ? await runOfBuild(id, userId) : null;
  if (run) redirect(`/b/${id}/edit/story/title`);
  const [guide, frame] = await Promise.all([getGuide(id, build.plan), editFrameForBuild(build, userId)]);
  const doc = guide.story?.doc ?? emptyDoc();
  const title = docText(guide["story:title"]?.doc);
  const line = docText(guide["story:line"]?.doc);
  return (
    <EditFrameProvider data={frame}>
      <SiteHeader />
      <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
        <StoryWriter
          owner={{ kind: "build", id, name: build.name, visibility: build.visibility }}
          groups={[{ label: null, actId: null, reorder: false, items: [{ key: "story", href: `/b/${id}/edit/story`, title: title || "The story" }], add: false }]}
          page={{ key: "story", kind: "story", where: "The story", kicker: null, title, titlePlaceholder: "[The story's title]", line, lineLabel: "A line under the title", plate: null, plateFocus: null, fromText: firstPlate(doc), doc, chapterId: null, actId: null, unlocks: null }}
          prev={null}
          next={null}
        />
      </GameDataProvider>
    </EditFrameProvider>
  );
}
