import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { WizardLoader as Wizard } from "@/components/creation/wizard-loader";
import { SignInButton, SiteHeader } from "@/components/site-header";
import { GameDataProvider } from "@/components/game-data";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { editFrameForBuild } from "@/lib/edit/frame";
import { getBuild } from "@/lib/builds/queries";
import { getGuide } from "@/lib/guide/queries";
import { docText, firstParagraph, isEmptyDoc } from "@/lib/guide/doc";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Set up build" };
export const dynamic = "force-dynamic";

export default async function SetupPage({ params }: { params: Params }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  if (!isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  // The theme preview opens with the build's intro, as the page does (the intro, else the guide's first paragraph).
  const [guide, frame] = await Promise.all([getGuide(id, build.plan), editFrameForBuild(build, userId)]);
  const intro = guide.intro && !isEmptyDoc(guide.intro.doc) ? guide.intro.doc : firstParagraph(guide.overview?.doc);
  return (
    <EditFrameProvider data={frame}>
      <SiteHeader />
      <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
        <Wizard
          mode="edit"
          buildId={id}
          initialPlan={build.plan}
          initialDetails={{
            name: build.name,
            description: build.description,
            coverImageUrl: build.coverImageUrl ?? "",
            writeupUrl: build.writeupUrl ?? "",
            visibility: build.visibility,
            // No tags yet: the Name step suggests some from the majors.
            tags: build.tags.length ? build.tags : null,
          }}
          signedIn
          introStart={docText(intro).slice(0, 400)}
          drafted={build.draftedBy ? { by: build.draftedBy, show: build.showDrafted !== false } : null}
          signIn={<SignInButton redirectTo={`/b/${id}/setup`} className="btn btn-primary" />}
        />
      </GameDataProvider>
    </EditFrameProvider>
  );
}
