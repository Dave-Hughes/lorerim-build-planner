import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GameDataProvider } from "@/components/game-data";
import { ChapterEditor } from "@/components/playthrough/chapter-editor";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";
import { clientVersion, currentVersion, isKnownVersion } from "@/lib/rules/server";

export const metadata: Metadata = { title: "Editing the tale" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string; cid: string }>;

/** A chapter, entry or beat in the Story editor (WO-111), for the playthrough's owner. */
export default async function ChapterEditPage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const [{ id, cid }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, userId);
  if (!p) notFound();
  if (p.ownerId !== userId) redirect(`/p/${id}/story/${cid}`);
  const c = p.view.chapters.find((x) => x.id === Number(cid));
  if (!c) notFound();
  const version = isKnownVersion(p.gameVersion) ? p.gameVersion : currentVersion().id;
  const back = (c.kind === "beat" || c.kind === "act") && c.actId ? `/p/${id}/edit?act=${c.actId}` : `/p/${id}/edit?tale=1`;
  return (
    <GameDataProvider version={version} serverVersion={clientVersion(version)}>
      <ChapterEditor pid={id} playthrough={p.name} chapter={{ id: c.id, kind: c.kind, title: c.title, fromSave: c.fromSave, doc: c.doc }} back={back} />
    </GameDataProvider>
  );
}
