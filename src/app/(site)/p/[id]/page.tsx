import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PlayView } from "@/components/playthrough/play-view";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string }>;

/** A Listed or Link only playthrough's name; nothing about a private one. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!playthroughsOn()) return {};
  const p = await getPlaythrough((await params).id, null);
  return p ? { title: p.name, description: p.line || undefined } : {};
}

/** The playthrough's Play view (WO-111): its quest log. Private ones 404 to anyone but the owner. */
export default async function PlaythroughPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, { act }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, viewerId);
  if (!p) notFound();
  const n = Number(act);
  return <PlayView p={p} isOwner={viewerId === p.ownerId} actIndex={Number.isInteger(n) && n >= 1 ? n - 1 : null} />;
}
