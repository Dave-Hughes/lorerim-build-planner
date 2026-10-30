import { notFound, redirect } from "next/navigation";
import { playthroughsOn } from "@/lib/features";
import { buildOfRun } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string; chapter: string }>;

/** The Story is retired (WO-181): a chapter's old address goes to the character's Playthrough tab. */
export default async function ChapterPage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const { id } = await params;
  const bid = await buildOfRun(id);
  redirect(bid ? `/b/${bid}?tab=playthrough` : `/p/${id}`);
}
