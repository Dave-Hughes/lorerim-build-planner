import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CharacterPage, tabParam } from "@/components/build/character-page";
import { getBuild } from "@/lib/builds/queries";
import { buildMetadata } from "@/lib/og/metadata";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough, runOfBuild } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string; copy?: string; tab?: string; act?: string; imported?: string; skipped?: string; dropped?: string }>;

/** Link previews (WO-33): a listed or link-only build's own card; nothing about a private one. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata(await getBuild(id, null));
}

/** The build's page (WO-116): with a run the viewer may see, the character's page, opened on Levels. */
export default async function BuildPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { level, copy, tab, act, imported, skipped, dropped }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const build = await getBuild(id, viewerId);
  if (!build) notFound();
  const line = playthroughsOn() && !build.isSample ? await runOfBuild(build.id, viewerId) : null;
  const run = line ? await getPlaythrough(line.id, viewerId) : null;
  const n = Number(act);
  return (
    <CharacterPage
      build={build}
      viewerId={viewerId}
      run={run}
      tab={tabParam(tab, !!run, "levels")}
      level={Number(level) || 0}
      actIndex={Number.isInteger(n) && n >= 1 ? n - 1 : null}
      copy={copy === "1"}
      // Just imported (WO-90): its id, for SAMPLE_BUILD_ID, and what didn't come across.
      imported={imported === "1" ? { skipped: Number(skipped) || 0, dropped: dropped ? dropped.split(",").filter(Boolean) : [] } : null}
    />
  );
}
