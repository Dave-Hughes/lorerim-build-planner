import "server-only";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GameDataProvider } from "@/components/game-data";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { SiteHeader } from "@/components/site-header";
import { EditPlaythrough, type EditData } from "@/components/playthrough/edit-playthrough";
import { editFrameForRun } from "@/lib/edit/frame";
import { standLine } from "@/lib/playthroughs/view";
import { playthroughsOn, progressTracking } from "@/lib/features";
import { personLinkables, placeLinkables, questLinkables } from "@/lib/playthroughs/links";
import { getPlaythrough, myBuildChoices } from "@/lib/playthroughs/queries";
import { clientVersion, currentVersion, isKnownVersion } from "@/lib/rules/server";

/**
 * The Play tab in edit mode (WO-117): the run editor (WO-111) under the edit band, hero and tabs.
 * Only its owner; anyone else goes to the Play view.
 */
export async function RunEdit({ id, act }: { id: string; act?: string }) {
  if (!playthroughsOn()) notFound();
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, userId);
  if (!p) notFound();
  if (p.ownerId !== userId) redirect(`/p/${id}`);
  const version = isKnownVersion(p.gameVersion) ? p.gameVersion : currentVersion().id;
  const [builds, frame] = await Promise.all([myBuildChoices(p.ownerId), editFrameForRun(p, userId)]);
  const data: EditData = {
    id: p.id,
    // One name (WO-179): the character's, whatever the run was first called.
    name: p.build?.name ?? p.name,
    line: p.line,
    buildId: p.buildId,
    visibility: p.visibility,
    draftedBy: p.draftedBy,
    showDrafted: p.showDrafted,
    coverImageUrl: p.build?.coverImageUrl ?? null,
    pronoun: p.build?.pronoun ?? null,
    answers: p.answers ?? [],
    mods: p.mods ?? [],
    tracking: progressTracking(),
    theme: p.theme ?? {},
    never: (p.never ?? []).map((n) => n.words ?? n.what),
    builds,
    characters: [...new Set([p.name, p.build?.name].filter((n): n is string => !!n))],
    stand: (() => {
      const snap = p.snapshot;
      const keys = p.view.acts.flatMap((a) => a.objectives.flatMap((o) => (o.reach ? [o.reach.key] : [])));
      return {
        line: standLine(snap),
        initial: { level: snap?.level ?? null, day: snap?.day ?? null, place: snap?.place ?? "", skills: snap?.skills ?? {}, counts: snap?.counts ?? {} },
        skills: [...new Set(keys.filter((k) => k.startsWith("skill:")).map((k) => k.slice(6)))],
        counts: [...new Set(keys.filter((k) => k.startsWith("count:")).map((k) => k.slice(6)))],
      };
    })(),
    acts: p.view.acts.map((a) => ({
      id: a.id,
      n: a.n,
      name: a.name,
      levelFrom: a.levelFrom,
      levelTo: a.levelTo,
      place: a.place,
      goal: a.goal,
      standingRule: a.standingRule,
      route: a.route ?? [],
      imageUrl: a.imageUrl ?? null,
      imageFocus: a.imageFocus ?? null,
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
        stop: o.stop ?? null,
        suggestedBy: o.suggestedBy,
        accepted: o.accepted,
      })),
    })),
  };
  const linkables = [...questLinkables(), ...placeLinkables(), ...personLinkables()].map(({ kind, id: lid, name, where }) => ({ kind, id: lid, name, where }));
  return (
    <EditFrameProvider data={frame}>
      {/* The site header over the edit bar, as on every edit tab (WO-124). */}
      <SiteHeader />
      <GameDataProvider version={version} serverVersion={clientVersion(version)}>
        <EditPlaythrough data={data} actId={Number(act) || null} linkables={linkables} />
      </GameDataProvider>
    </EditFrameProvider>
  );
}
