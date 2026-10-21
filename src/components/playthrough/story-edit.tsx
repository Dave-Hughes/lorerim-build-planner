import "server-only";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditFrameProvider } from "@/components/editor/edit-bar";
import { GameDataProvider } from "@/components/game-data";
import { editFrameForRun } from "@/lib/edit/frame";
import { emptyDoc, firstPlate } from "@/lib/guide/doc";
import { playthroughsOn } from "@/lib/features";
import { getPlaythrough } from "@/lib/playthroughs/queries";
import { roman } from "@/lib/playthroughs/view";
import { clientVersion, currentVersion, isKnownVersion } from "@/lib/rules/server";
import { StoryWriter, type WriterGroup, type WriterItem, type WriterPage } from "./story-writer";

/**
 * The Story tab in edit mode for a run (WO-117), as the EditStory board: Contents in reading order
 * (WO-118: the title page, the Prologue's chapters, then each act's, a locked one with its lock and
 * what unlocks it), and the page being written, at /p/<id>/edit/story/<page>: `title`, a chapter's
 * id, or `act-<id>` for an act with no chapter yet (made by its first word).
 */
export async function RunStoryEdit({ id, page: key }: { id: string; page: string | null }) {
  if (!playthroughsOn()) notFound();
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, userId);
  if (!p) notFound();
  if (p.ownerId !== userId) redirect(key && /^\d+$/.test(key) ? `/p/${id}/story/${key}` : `/p/${id}`);
  if (!key) redirect(`/p/${id}/edit/story/title`);
  const v = p.view;
  const base = `/p/${id}/edit/story`;
  // An act with a chapter already: its first one's own address.
  const actKey = /^act-(\d+)$/.exec(key);
  if (actKey) {
    const a = v.acts.find((x) => x.id === Number(actKey[1]));
    if (!a) notFound();
    if (a.chapter) redirect(`${base}/${a.chapter}`);
  }
  const objective = new Map(v.acts.flatMap((a) => a.objectives).map((o) => [o.id, o.text]));
  const item = (c: (typeof v.chapters)[number]): WriterItem => ({
    key: String(c.id),
    href: `${base}/${c.id}`,
    title: c.title,
    chapterId: c.id,
    // Still locked: its lock and what unlocks it.
    unlocks: !c.open && c.opensAfter !== null ? (objective.get(c.opensAfter) ?? null) : null,
  });

  const groups: WriterGroup[] = [
    { label: null, actId: null, reorder: false, items: [{ key: "title", href: `${base}/title`, title: "The title page" }], add: false },
    { label: "Prologue", actId: null, reorder: true, items: v.chapters.filter((c) => c.actId === null).map(item), add: true },
    ...v.acts.map((a) => ({ label: `Act ${a.n} ${a.name}`, actId: a.id, reorder: true, items: v.chapters.filter((c) => c.actId === a.id).map(item), add: true })),
  ];
  const order = groups.flatMap((g) => g.items);
  const at = actKey ? -1 : order.findIndex((x) => x.key === key);
  if (!actKey && at < 0) notFound();

  let page: WriterPage;
  if (key === "title") {
    page = { key, kind: "title", where: "The title page", kicker: null, title: p.taleTitle ?? "", titlePlaceholder: p.name, line: p.taleLine ?? "", lineLabel: "A line under the title", plate: p.coverImageUrl, plateFocus: null, doc: null, chapterId: null, actId: null, unlocks: null, fromText: null };
  } else if (actKey) {
    const a = v.acts.find((x) => x.id === Number(actKey[1]))!;
    page = { key, kind: "chapter", where: `Act ${a.n}`, kicker: `Act ${a.n}`, title: a.name, titlePlaceholder: a.name, line: null, lineLabel: null, plate: null, plateFocus: null, doc: emptyDoc(), chapterId: null, actId: a.id, unlocks: null, fromText: null };
  } else {
    const c = v.chapters.find((x) => String(x.id) === key)!;
    const a = c.actId !== null ? v.acts.find((x) => x.id === c.actId) : undefined;
    const n = a ? `Act ${roman(v.acts.indexOf(a) + 1)}` : null;
    page = {
      key,
      kind: "chapter",
      where: n ?? "Prologue",
      kicker: n ?? "Prologue",
      title: c.title,
      titlePlaceholder: "[Its title]",
      // Written from a save: the "from save 7" line stays (WO-118).
      line: c.kind === "entry" && c.fromSave ? c.fromSave : null,
      lineLabel: c.kind === "entry" && c.fromSave ? "The save it was written from" : null,
      plate: c.imageUrl ?? null,
      plateFocus: c.imageFocus ?? null,
      doc: c.doc,
      chapterId: c.id,
      actId: a?.id ?? null,
      unlocks: a ? { value: c.kind === "beat" ? c.opensAfter : null, options: a.objectives.map((o) => ({ id: o.id, text: o.text })) } : null,
      fromText: firstPlate(c.doc),
    };
  }
  // An act with no chapter yet sits after the act's group's place in the order: its neighbours are the act's.
  const near = (i: number) => (order[i] ? { href: order[i].href, title: order[i].title } : null);
  const actAt = actKey ? order.findIndex((x) => groups.findIndex((g) => g.items.includes(x)) > groups.findIndex((g) => g.actId === Number(actKey[1]))) : -1;
  const prev = actKey ? near((actAt < 0 ? order.length : actAt) - 1) : near(at - 1);
  const next = actKey ? (actAt < 0 ? null : near(actAt)) : near(at + 1);
  const version = isKnownVersion(p.gameVersion) ? p.gameVersion : currentVersion().id;
  const frame = await editFrameForRun(p, userId);
  return (
    <EditFrameProvider data={frame}>
      <GameDataProvider version={version} serverVersion={clientVersion(version)}>
        <StoryWriter owner={{ kind: "run", id, buildId: p.buildId ?? "", name: p.name, visibility: p.visibility }} groups={groups} page={page} prev={prev} next={next} />
      </GameDataProvider>
    </EditFrameProvider>
  );
}
