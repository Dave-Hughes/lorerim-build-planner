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
import { StoryWriter, type WriterGroup, type WriterPage } from "./story-writer";

const KIND = { chapter: "Chapter", act: "The act's chapter", entry: "Entry", beat: "Beat" } as const;

/**
 * The Story tab in edit mode for a run (WO-117), as the EditStory board: Contents in reading order
 * (the title page, the chapters before Skyrim, then each act's chapter, entries and beats), and the
 * page being written, at /p/<id>/edit/story/<page>: `title`, a chapter's id, or `act-<id>` for an act's
 * chapter not written yet (made by its first word).
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
  // An act's chapter already written: its own address.
  const actKey = /^act-(\d+)$/.exec(key);
  if (actKey) {
    const a = v.acts.find((x) => x.id === Number(actKey[1]));
    if (!a) notFound();
    if (a.chapter) redirect(`${base}/${a.chapter}`);
  }

  const groups: WriterGroup[] = [
    { label: null, actId: null, reorder: false, items: [{ key: "title", href: `${base}/title`, title: "The title page" }], adds: [] },
    {
      label: "Before Skyrim",
      actId: null,
      reorder: true,
      items: v.chapters.filter((c) => c.actId === null).map((c) => ({ key: String(c.id), href: `${base}/${c.id}`, title: c.title, chapterId: c.id })),
      adds: [{ kind: "chapter", label: "+ Add a chapter" }],
    },
    ...v.acts.map((a) => {
      const mine = v.chapters.filter((c) => c.actId === a.id && c.kind !== "act");
      const own = v.chapters.find((c) => c.actId === a.id && c.kind === "act");
      return {
        label: `Act ${a.n} ${a.name}`,
        actId: a.id,
        reorder: true,
        lastObjective: a.objectives.at(-1)?.id ?? null,
        act: own ? { key: String(own.id), href: `${base}/${own.id}`, title: own.title, chapterId: own.id } : { key: `act-${a.id}`, href: `${base}/act-${a.id}`, title: "+ Write the act's chapter", dashed: true },
        items: mine.map((c) => ({ key: String(c.id), href: `${base}/${c.id}`, title: c.title, tag: c.kind === "entry" ? "Entry" : "Beat", chapterId: c.id })),
        adds: [{ kind: "entry-or-beat" as const, label: "+ Add an entry or a beat" }],
        empty: !own && !mine.length,
      } satisfies WriterGroup;
    }),
  ];
  const order = groups.flatMap((g) => [...(g.act ? [g.act] : []), ...g.items]);
  const at = order.findIndex((x) => x.key === key);
  if (at < 0) notFound();

  let page: WriterPage;
  if (key === "title") {
    page = { key, kind: "title", where: "The title page", kicker: null, title: p.taleTitle ?? "", titlePlaceholder: p.name, line: p.taleLine ?? "", lineLabel: "A line under the title", plate: p.coverImageUrl, doc: null, chapterId: null, actId: null, opens: null, fromText: null };
  } else if (actKey) {
    const a = v.acts.find((x) => x.id === Number(actKey[1]))!;
    page = { key, kind: "act", where: `Act ${a.n}`, kicker: `Act ${a.n}`, title: a.name, titlePlaceholder: a.name, line: null, lineLabel: null, plate: a.imageUrl ?? null, doc: emptyDoc(), chapterId: null, actId: a.id, opens: null, fromText: null };
  } else {
    const c = v.chapters.find((x) => String(x.id) === key)!;
    const a = c.actId !== null ? v.acts.find((x) => x.id === c.actId) : undefined;
    const n = a ? `Act ${roman(v.acts.indexOf(a) + 1)}` : null;
    page = {
      key,
      kind: c.kind,
      where: [n ?? "Before Skyrim", KIND[c.kind]].join(" | "),
      kicker: n ?? "Before Skyrim",
      title: c.title,
      titlePlaceholder: "[Its title]",
      line: c.kind === "entry" ? (c.fromSave ?? "") : null,
      lineLabel: c.kind === "entry" ? "The save it was written from" : null,
      plate: c.kind === "act" ? (a?.imageUrl ?? null) : (c.imageUrl ?? null),
      doc: c.doc,
      chapterId: c.id,
      actId: a?.id ?? null,
      opens: c.kind === "entry" || c.kind === "beat" ? { value: c.opensAfter, options: (a?.objectives ?? []).map((o) => ({ id: o.id, text: o.text })) } : null,
      fromText: firstPlate(c.doc),
    };
  }
  const near = (i: number) => (order[i] ? { href: order[i].href, title: order[i].key.startsWith("act-") ? `${groups.find((g) => g.act?.key === order[i].key)?.label ?? "The act"}'s chapter` : order[i].title } : null);
  const version = isKnownVersion(p.gameVersion) ? p.gameVersion : currentVersion().id;
  const frame = await editFrameForRun(p, userId);
  return (
    <EditFrameProvider data={frame}>
      <GameDataProvider version={version} serverVersion={clientVersion(version)}>
        <StoryWriter owner={{ kind: "run", id, buildId: p.buildId ?? "", name: p.name, visibility: p.visibility }} groups={groups} page={page} prev={near(at - 1)} next={near(at + 1)} />
      </GameDataProvider>
    </EditFrameProvider>
  );
}
