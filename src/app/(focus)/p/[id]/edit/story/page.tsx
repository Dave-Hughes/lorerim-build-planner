import { notFound, redirect } from "next/navigation";
import { playthroughsOn } from "@/lib/features";
import { buildOfRun } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string }>;

/** The Story is retired (WO-181): its editor goes to the Playthrough tab in edit mode. */
export default async function EditStoryPage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const { id } = await params;
  const bid = await buildOfRun(id);
  redirect(bid ? `/b/${bid}/edit/play` : `/p/${id}/edit/play`);
}
