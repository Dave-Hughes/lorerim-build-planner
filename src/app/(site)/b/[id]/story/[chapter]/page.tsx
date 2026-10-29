import type { Metadata } from "next";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough, runOfBuild } from "@/lib/playthroughs/queries";
import { getBuild } from "@/lib/builds/queries";
import BuildPage from "../../page";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string; chapter: string }>;

/** A Listed or Link only character's chapter title; nothing about a private one. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!playthroughsOn()) return {};
  const { id, chapter } = await params;
  const build = await getBuild(id, null);
  const line = build ? await runOfBuild(id, null) : null;
  const p = line ? await getPlaythrough(line.id, null) : null;
  const c = p?.view.chapters.find((x) => String(x.id) === chapter && x.open);
  return build ? { title: c ? `${c.title}: ${build.name}` : build.name } : {};
}

/**
 * A chapter's own address (WO-179), under the character: the character's page with the reader open on it, so a scene can be linked. The
 * old `/p/<id>/story/<chapter>` goes here.
 */
export default async function ChapterPage({ params, searchParams }: { params: Promise<{ id: string; chapter: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  return BuildPage({ params: params.then(({ id }) => ({ id })), searchParams });
}
