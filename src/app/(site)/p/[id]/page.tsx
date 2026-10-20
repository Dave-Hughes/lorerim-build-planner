import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CharacterPage, tabParam } from "@/components/build/character-page";
import { PlayView } from "@/components/playthrough/play-view";
import { getBuild } from "@/lib/builds/queries";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";
import { isKnownVersion } from "@/lib/rules/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string; tab?: string; level?: string }>;

/** A Listed or Link only playthrough's name; nothing about a private one. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!playthroughsOn()) return {};
  const p = await getPlaythrough((await params).id, null);
  return p ? { title: p.name, description: p.line || undefined } : {};
}

/**
 * The run's address (WO-116): the character's page, opened on Play. A run whose build the reader
 * can't open, or with no build yet, is its Play view under its own band. Private ones 404 to anyone
 * but the owner.
 */
export default async function PlaythroughPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, { act, tab, level }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, viewerId);
  if (!p) notFound();
  const n = Number(act);
  const actIndex = Number.isInteger(n) && n >= 1 ? n - 1 : null;
  const build = p.build ? await getBuild(p.build.id, viewerId) : null;
  if (!build || !isKnownVersion(build.gameVersion)) return <PlayView p={p} isOwner={viewerId === p.ownerId} actIndex={actIndex} />;
  return <CharacterPage build={build} viewerId={viewerId} run={p} tab={tabParam(tab, true, "play", level)} level={Number(level) || 0} actIndex={actIndex} />;
}
