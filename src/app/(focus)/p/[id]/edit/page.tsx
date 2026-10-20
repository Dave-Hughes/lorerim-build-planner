import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GameDataProvider } from "@/components/game-data";
import { EditPlaythrough, type EditData } from "@/components/playthrough/edit-playthrough";
import { docText } from "@/lib/guide/doc";
import { playthroughsOn } from "@/lib/features";
import { questLinkables } from "@/lib/playthroughs/links";
import { getPlaythrough, myBuildChoices } from "@/lib/playthroughs/queries";
import { clientVersion, currentVersion, isKnownVersion } from "@/lib/rules/server";

export const metadata: Metadata = { title: "Editing a playthrough" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string; tale?: string }>;

/** Editing a playthrough by hand (WO-111): only its owner; anyone else goes to the Play view. */
export default async function EditPlaythroughPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, { act, tale }, session] = await Promise.all([params, searchParams, auth()]);
  const userId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, userId);
  if (!p) notFound();
  if (p.ownerId !== userId) redirect(`/p/${id}`);
  const version = isKnownVersion(p.gameVersion) ? p.gameVersion : currentVersion().id;
  const builds = await myBuildChoices(p.ownerId);
  const data: EditData = {
    id: p.id,
    name: p.name,
    line: p.line,
    buildId: p.buildId,
    visibility: p.visibility,
    draftedBy: p.draftedBy,
    showDrafted: p.showDrafted,
    coverImageUrl: p.build?.coverImageUrl ?? null,
    taleTitle: p.taleTitle ?? "",
    taleLine: p.taleLine ?? "",
    builds,
    acts: p.view.acts.map((a) => ({
      id: a.id,
      n: a.n,
      name: a.name,
      levelFrom: a.levelFrom,
      levelTo: a.levelTo,
      place: a.place,
      goal: a.goal,
      standingRule: a.standingRule,
      imageUrl: a.imageUrl ?? null,
      chapterId: a.chapter,
      objectives: a.objectives.map((o) => ({
        id: o.id,
        text: o.text,
        kind: o.kind,
        link: o.link,
        linkName: o.linkShown?.name ?? null,
        doneBy: o.doneBy,
        detect: o.detect,
        reach: o.reach,
        why: o.why,
        suggestedBy: o.suggestedBy,
        accepted: o.accepted,
      })),
    })),
    // The scene's first lines only; the whole of it is in the Story editor.
    chapters: p.view.chapters.map((c) => ({ id: c.id, kind: c.kind, title: c.title, actId: c.actId, opensAfter: c.opensAfter, firstLine: docText(c.doc).slice(0, 200) })),
  };
  const linkables = questLinkables().map(({ kind, id: lid, name, where }) => ({ kind, id: lid, name, where }));
  return (
    <GameDataProvider version={version} serverVersion={clientVersion(version)}>
      <EditPlaythrough data={data} actId={Number(act) || null} tale={tale === "1"} linkables={linkables} />
    </GameDataProvider>
  );
}
