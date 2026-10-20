import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GameDataProvider } from "@/components/game-data";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { ChapterEditor } from "@/components/playthrough/chapter-editor";
import { editFrameForRun } from "@/lib/edit/frame";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";
import { addChapter } from "@/lib/playthroughs/writes";
import { clientVersion, currentVersion, isKnownVersion } from "@/lib/rules/server";

export const metadata: Metadata = { title: "Editing the tale" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string; cid: string }>;

/** A chapter, entry or beat in the Story editor (WO-111), under the Story tab (WO-117), for the playthrough's owner. */
export default async function ChapterEditPage({ params }: { params: Params }) {
  if (!playthroughsOn()) notFound();
  const [{ id, cid }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, userId);
  if (!p) notFound();
  if (p.ownerId !== userId) redirect(`/p/${id}/story/${cid}`);
  // An act's chapter by its act (WO-117): the act card's way in, its chapter if written, else a new one.
  const actKey = /^act-(\d+)$/.exec(cid);
  if (actKey) {
    const a = p.view.acts.find((x) => x.id === Number(actKey[1]));
    if (!a) notFound();
    const id2 = a.chapter ?? (await addChapter(userId!, id, { kind: "act", title: a.name.slice(0, 60), actId: a.id }));
    redirect(`/p/${id}/edit/story/${id2}`);
  }
  const c = p.view.chapters.find((x) => x.id === Number(cid));
  if (!c) notFound();
  const version = isKnownVersion(p.gameVersion) ? p.gameVersion : currentVersion().id;
  const frame = await editFrameForRun(p, userId);
  return (
    <EditFrameProvider data={frame}>
      <GameDataProvider version={version} serverVersion={clientVersion(version)}>
        <ChapterEditor pid={id} playthrough={p.name} visibility={p.visibility} chapter={{ id: c.id, kind: c.kind, title: c.title, fromSave: c.fromSave, doc: c.doc }} />
      </GameDataProvider>
    </EditFrameProvider>
  );
}
