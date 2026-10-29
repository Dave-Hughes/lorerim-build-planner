import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBuild } from "@/lib/builds/queries";
import { isKnownVersion } from "@/lib/rules/server";
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
 * A chapter's old address (WO-116): it goes to the character's (WO-179); a run on no build keeps showing here.
 */
export default async function ChapterPage({ params, searchParams }: { params: Params; searchParams: Promise<{ act?: string; tab?: string; level?: string }> }) {
  // A chapter is at the character's address (WO-179): `/b/<id>/story/<chapter>`.
  if (playthroughsOn()) {
    const { id, chapter } = await params;
    const p = await getPlaythrough(id, (await auth())?.user?.id ?? null);
    if (p?.build && isKnownVersion((await getBuild(p.build.id, p.ownerId === (await auth())?.user?.id ? p.ownerId : null))?.gameVersion ?? "")) redirect(`/b/${p.build.id}/story/${chapter}`);
  }
  return PlaythroughPage({ params, searchParams });
}
