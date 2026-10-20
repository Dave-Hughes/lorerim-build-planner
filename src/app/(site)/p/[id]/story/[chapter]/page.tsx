import type { Metadata } from "next";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";
import PlaythroughPage from "../../page";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string; chapter: string }>;

/** A Listed or Link only run's chapter title; nothing about a private one. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!playthroughsOn()) return {};
  const { id, chapter } = await params;
  const p = await getPlaythrough(id, null);
  const c = p?.view.chapters.find((x) => String(x.id) === chapter && x.open);
  return p ? { title: c ? `${c.title}: ${p.name}` : p.name } : {};
}

/**
 * A chapter's own address (WO-116): the character's page with the reader open on it, so a scene can
 * be linked. Opened from the page, the reader pushes this address over the page instead.
 */
export default async function ChapterPage({ params, searchParams }: { params: Params; searchParams: Promise<{ act?: string; tab?: string; level?: string }> }) {
  return PlaythroughPage({ params, searchParams });
}
