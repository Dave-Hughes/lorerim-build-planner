import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPlaythrough } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string }>;

/** A character's Build is the build's own page (WO-164): `/p/<id>/build` goes to `/b/<id>`; a run with no build stays on its page. */
export default async function RunBuildPage({ params }: { params: Params }) {
  const { id } = await params;
  const p = await getPlaythrough(id, (await auth())?.user?.id ?? null);
  if (!p) notFound();
  redirect(p.build ? `/b/${p.build.id}?tab=levels` : `/p/${id}`);
}
