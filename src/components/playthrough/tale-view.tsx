import Link from "next/link";
import { Ornament, StoryText } from "@/components/build/story-view";
import { firstPlate } from "@/lib/guide/doc";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { roman, type ChapterView } from "@/lib/playthroughs/view";
import { ContentsDrawer, ReadAnyway, TaleBar } from "./tale-controls";
import s from "./tale.module.css";

/**
 * The Tale page (WO-114), as the revised PlaythroughTale board: a reading page with the least UI in
 * the way. No site header, band, tabs row or rail: the opening plate with the Tale's title and
 * epigraph, a thin bar over it that fades on scroll, then the 680px column in the Story tab's rendering
 * (WO-79), with Contents in a drawer from the left edge.
 */
export function TaleView({ p, isOwner, from }: { p: PlaythroughRecord; isOwner: boolean; from: number | null }) {
  const v = p.view;
  const actN = from ?? (v.current ? v.acts.indexOf(v.current) + 1 : 1);
  const back = `/p/${p.id}?act=${actN}#objs`;
  // The plate: the first chapter's first image, else the character's cover, else the dark ground.
  const first = v.chapters[0];
  const fromChapter = first?.open ? firstPlate(first.doc) : null;
  const plate = fromChapter ?? p.build?.coverImageUrl ?? null;
  const character = [p.build?.race, p.build ? `The ${p.build.birthsign}` : null, p.build?.deity, v.acts.length ? `Act ${v.current ? v.current.n : "I"} of ${roman(v.acts.length)}` : null].filter(Boolean).join(" | ");
  const contents = [
    ...(v.chapters.some((c) => c.actId === null) ? [{ part: "Before Skyrim", items: v.chapters.filter((c) => c.actId === null) }] : []),
    ...v.acts.map((a) => ({ part: `Act ${a.n} ${a.name}`, items: v.chapters.filter((c) => c.actId === a.id) })),
  ].map((g) => ({ part: g.part, items: g.items.map((c) => ({ id: c.id, title: c.title, open: c.open, small: tocSmall(c) })) }));

  return (
    <div className={s.tale}>
      <TaleBar name={p.name} play={`/p/${p.id}`} build={p.build ? `/p/${p.id}/build` : null} back={{ href: back, label: `‹ Quest log, Act ${roman(actN)}` }} />
      <header className={`${s.opening} ${plate ? "" : s.openingPlain}`}>
        {plate && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={plate} alt="" className={s.openingImage} />
            <div className={s.fade} aria-hidden="true" />
          </>
        )}
        <div className={s.words}>
          <h1 className={s.title}>{p.taleTitle || p.name}</h1>
          {(p.taleLine || (!p.taleTitle && p.line)) && <p className={s.line}>{p.taleLine || p.line}</p>}
          <p className={s.by}>
            {p.name}, by {p.author.name}
          </p>
        </div>
      </header>

      <ContentsDrawer groups={contents} addHref={isOwner ? `/p/${p.id}/edit?tale=1` : null} />

      <div className={s.pieces}>
        {v.chapters.length === 0 && <p className={s.empty}>Nothing written yet.</p>}
        {v.chapters.map((c, i) => (
          <div key={c.id} style={{ display: "contents" }}>
            {i > 0 && v.chapters[i - 1].actId !== c.actId && <Ornament wide />}
            {c.open ? <Piece c={c} p={p} isOwner={isOwner} skipOpening={i === 0 && !!fromChapter} /> : <Waiting c={c} p={p} isOwner={isOwner} />}
          </div>
        ))}
        <div className={s.end}>
          <Ornament filled wide />
          {character && <p className={s.character}>{character}</p>}
          <Link href={back} style={{ fontSize: 16 }}>
            Back to the quest log ›
          </Link>
        </div>
      </div>
    </div>
  );
}

function tocSmall(c: ChapterView): string {
  if (c.kind === "entry" && c.fromSave) return `from ${c.fromSave.toLowerCase()}`;
  if (!c.open && c.waitsOn) return c.waitsOn.reach ? `at ${c.waitsOn.reach}` : "waiting";
  return "";
}

/** The sub line, in the dimmer grey: "Before Skyrim", or "Act I | from save 5". */
function subLine(c: ChapterView): string {
  if (c.kind === "chapter") return "Before Skyrim";
  return [c.act, c.fromSave ? `from ${c.fromSave.toLowerCase()}` : null].filter(Boolean).join(" | ");
}

const objectiveHref = (p: PlaythroughRecord, oid: number) => {
  const n = p.view.acts.findIndex((a) => a.objectives.some((o) => o.id === oid)) + 1;
  return `/p/${p.id}?act=${n}#o${oid}`;
};

function Piece({ c, p, isOwner, skipOpening }: { c: ChapterView; p: PlaythroughRecord; isOwner: boolean; skipOpening: boolean }) {
  const text = <StoryText doc={c.doc} idPrefix={`c${c.id}`} cap={c.kind === "chapter"} skipOpening={skipOpening} />;
  return (
    <article id={`c${c.id}`} className={s.piece} data-chapter={c.id}>
      <h2 className={s.ch}>{c.title}</h2>
      {subLine(c) && <span className={s.sub}>{subLine(c)}</span>}
      {c.kind === "chapter" ? text : <div className={s.entry}>{text}</div>}
      {c.inGame && (
        <span className={s.game}>
          In the game: <Link href={objectiveHref(p, c.inGame.id)}>{c.inGame.text}</Link>
        </span>
      )}
      {isOwner && (
        <span className={s.tools}>
          <Link href={`/p/${p.id}/edit/tale/${c.id}`}>Edit</Link>
          {c.writtenBy && <span>written by {c.writtenBy}</span>}
        </span>
      )}
    </article>
  );
}

/** A beat not reached yet: its title in italic and one line, no box. */
function Waiting({ c, p, isOwner }: { c: ChapterView; p: PlaythroughRecord; isOwner: boolean }) {
  const w = c.waitsOn!;
  const now = w.reach && p.snapshot ? reachNow(p, w.id) : null;
  return (
    <div id={`c${c.id}`} className={s.wait} data-chapter={c.id}>
      <span className={s.waitTitle}>{c.title}</span>
      <ReadAnyway id={p.id} chapterId={c.id} isOwner={isOwner} when={w.reach ? `At ${w.reach}${now !== null ? `; ${now} now` : ""}.` : `After ${lower(w.text)}.`}>
        <article className={s.piece} style={{ width: "100%" }}>
          <div className={s.entry}>
            <StoryText doc={c.doc} idPrefix={`c${c.id}`} cap={false} />
          </div>
          {isOwner && (
            <span className={s.tools}>
              <Link href={`/p/${p.id}/edit/tale/${c.id}`}>Edit</Link>
              {c.writtenBy && <span>written by {c.writtenBy}</span>}
            </span>
          )}
        </article>
      </ReadAnyway>
    </div>
  );
}

/** The number the save has for a reach objective, for "At Speech 40; 30 now". */
function reachNow(p: PlaythroughRecord, oid: number): number | null {
  for (const a of p.view.acts) for (const o of a.objectives) if (o.id === oid) return o.worked.meter?.value ?? null;
  return null;
}

/** "Hunt and tan her first hides" as the end of "After ...": its first letter lowered. */
const lower = (t: string) => (/^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);
