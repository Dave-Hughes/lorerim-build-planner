import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { TaleView } from "@/components/playthrough/tale-view";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ from?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!playthroughsOn()) return {};
  const p = await getPlaythrough((await params).id, null);
  return p ? { title: `${p.name}: the tale` } : {};
}

/** The playthrough's Tale view (WO-111). `from` is the act the reader came from, for the way back. */
export default async function TalePage({ params, searchParams }: { params: Params; searchParams: Search }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, { from }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, viewerId);
  if (!p) notFound();
  const n = Number(from);
  return <TaleView p={p} isOwner={viewerId === p.ownerId} from={Number.isInteger(n) && n >= 1 && n <= p.view.acts.length ? n : null} />;
}
