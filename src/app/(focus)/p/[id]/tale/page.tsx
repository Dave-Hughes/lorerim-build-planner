import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/** The Tale page is gone (WO-116): the story opens in the reader, from its beginning. */
export default async function TalePage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, session] = await Promise.all([params, auth()]);
  const p = await getPlaythrough(id, session?.user?.id ?? null);
  if (!p) notFound();
  const first = p.view.chapters[0];
  redirect(first ? `/p/${id}/story/${first.id}` : `/p/${id}`);
}
