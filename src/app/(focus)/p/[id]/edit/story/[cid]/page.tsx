import { notFound, redirect } from "next/navigation";
import { playthroughsOn } from "@/lib/features";
import { buildOfRun } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string; cid: string }>;

/** The Story is retired (WO-181): its editor's pages go to the Playthrough tab in edit mode. */
export default async function EditStoryPagePage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const { id } = await params;
  const bid = await buildOfRun(id);
  redirect(bid ? `/b/${bid}/edit/play` : `/p/${id}/edit/play`);
}
