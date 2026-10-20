import Link from "next/link";
import { Ornament, StoryText } from "@/components/build/story-view";
import { formatDate } from "@/lib/format/date";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { roman, type ChapterView } from "@/lib/playthroughs/view";
import { ReadAnyway } from "./tale-controls";
import { PlaythroughTabs } from "./tabs";
import s from "./tale.module.css";

/**
 * The Tale view (WO-111), as the PlaythroughTale board: the Story tab's book page (WO-79) with a
 * contents rail. Chapters from before the game, then each act's entries and beats in order; a beat not
 * reached yet shows its title and what opens it; every entry and beat links back to its objective.
 */
export function TaleView({ p, isOwner, from }: { p: PlaythroughRecord; isOwner: boolean; from: number | null }) {
  const v = p.view;
  const actN = from ?? (v.current ? v.acts.indexOf(v.current) + 1 : 1);
  const back = { href: `/p/${p.id}?act=${actN}#objs`, label: `‹ Back to the quest log, Act ${roman(actN)}` };
  const before = v.chapters.filter((c) => c.actId === null);
  const character = [p.build?.race, p.build ? `The ${p.build.birthsign}` : null, p.build?.deity, v.acts.length ? `Act ${v.current ? v.current.n : "I"} of ${roman(v.acts.length)}` : null].filter(Boolean).join(" | ");
  return (
    <div className={s.tale}>
      <div className={`page ${s.head}`}>
        {isOwner && (
          <Link href="/me#playthroughs" style={{ fontSize: 15, alignSelf: "flex-start" }}>
            ‹ My playthroughs
          </Link>
        )}
        <div className={s.who}>
          <span className={s.name}>{p.name}</span>
          <span className={s.by}>
            by {p.author.name}
            {p.draftedBy && p.showDrafted ? ` | Drafted with ${p.draftedBy}` : ""}
          </span>
        </div>
        <PlaythroughTabs p={p} current="tale" backTo={back} />
      </div>

      <header className={`${s.opening} ${p.coverImageUrl ? "" : s.openingPlain}`}>
        {p.coverImageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.coverImageUrl} alt="" className={s.openingImage} />
            <div className={s.fade} aria-hidden="true" />
          </>
        )}
        <div className={s.words}>
          <h1 className={s.title}>{p.name}</h1>
          {p.line && <p className={s.line}>{p.line}</p>}
        </div>
      </header>

      <div className={`page ${s.grid}`}>
        <nav className={s.toc} aria-label="Contents">
          {before.length > 0 && <span className={s.part}>Before Skyrim</span>}
          {before.map((c) => (
            <TocLink key={c.id} c={c} />
          ))}
          {v.acts.map((a) => {
            const mine = v.chapters.filter((c) => c.actId === a.id);
            return (
              <div key={a.id} style={{ display: "contents" }}>
                <span className={s.part}>
                  Act {a.n} {a.name}
                </span>
                {mine.length ? mine.map((c) => <TocLink key={c.id} c={c} />) : <span className={s.tocEmpty}>Nothing written yet</span>}
              </div>
            );
          })}
          {isOwner && (
            <span className={s.tocAdd}>
              <Link href={`/p/${p.id}/edit?tale=1`} className="btn btn-sm">
                Add a chapter
              </Link>
              <span>Up to 5 images a chapter, your own. Captions under each.</span>
            </span>
          )}
        </nav>

        <div className={s.pieces}>
          {v.chapters.length === 0 && <p className={s.empty}>Nothing written yet.</p>}
          {v.chapters.map((c, i) => (
            <div key={c.id} style={{ display: "contents" }}>
              {i > 0 && v.chapters[i - 1].actId !== c.actId && <Ornament wide />}
              {c.open ? <Piece c={c} p={p} isOwner={isOwner} /> : <Waiting c={c} p={p} isOwner={isOwner} />}
            </div>
          ))}
          <div className={s.end}>
            <Ornament filled wide />
            {character && <p className={s.character}>{character}</p>}
            <Link href={back.href} style={{ fontSize: 16 }}>
              Back to the quest log ›
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TocLink({ c }: { c: ChapterView }) {
  const small = c.kind === "entry" && c.fromSave ? `from ${c.fromSave.toLowerCase()}` : !c.open && c.waitsOn ? (c.waitsOn.reach ? `at ${c.waitsOn.reach}` : "waiting") : "";
  return (
    <a href={`#c${c.id}`} className={c.open ? undefined : s.locked}>
      {c.title}
      {small && <small>{small}</small>}
    </a>
  );
}

function subLine(c: ChapterView): string {
  const when = formatDate(c.createdAt);
  if (c.kind === "chapter") return `Before Skyrim | written ${when}`;
  return [c.act, c.fromSave ? `from ${c.fromSave.toLowerCase()}` : null, c.writtenBy ? `written by ${c.writtenBy}, ${when}` : `written ${when}`].filter(Boolean).join(" | ");
}

function InGame({ c, p }: { c: ChapterView; p: PlaythroughRecord }) {
  if (!c.inGame) return null;
  const n = p.view.acts.findIndex((a) => a.objectives.some((o) => o.id === c.inGame!.id)) + 1;
  return (
    <span className={s.meta}>
      <span>
        In the game: <Link href={`/p/${p.id}?act=${n}#o${c.inGame.id}`}>{c.inGame.text}</Link>, {c.inGame.act}
      </span>
    </span>
  );
}

function Piece({ c, p, isOwner }: { c: ChapterView; p: PlaythroughRecord; isOwner: boolean }) {
  const text = <StoryText doc={c.doc} idPrefix={`c${c.id}`} cap={c.kind === "chapter"} />;
  return (
    <article id={`c${c.id}`} className={s.piece}>
      <h2 className={s.ch}>{c.title}</h2>
      <span className={s.sub}>{subLine(c)}</span>
      {c.kind === "chapter" ? text : <div className={s.entry}>{text}</div>}
      <InGame c={c} p={p} />
      {isOwner && (
        <span className={s.meta}>
          <Link href={`/p/${p.id}/edit/tale/${c.id}`} className="btn btn-sm">
            Edit
          </Link>
          {c.writtenBy && <span>The assistant wrote this; you can change any line.</span>}
        </span>
      )}
    </article>
  );
}

function Waiting({ c, p, isOwner }: { c: ChapterView; p: PlaythroughRecord; isOwner: boolean }) {
  const w = c.waitsOn!;
  const n = p.view.acts.findIndex((a) => a.objectives.some((o) => o.id === w.id)) + 1;
  const link = <Link href={`/p/${p.id}?act=${n}#o${w.id}`}>{w.text}</Link>;
  return (
    <div id={`c${c.id}`} className={`frame ${s.wait}`}>
      <span className={s.waitTitle}>{c.title}</span>
      <span>
        {w.reach ? (
          <>
            Opens at {w.reach}, from {link}.{p.snapshot ? "" : " No save read yet."}
          </>
        ) : (
          <>
            Opens when {p.view.acts[n - 1]?.objectives.find((o) => o.id === w.id)?.doneBy === "save" ? "your save shows" : "you tick"} {link} in {w.act}. The scene is written and waits for the game to get there.
          </>
        )}
      </span>
      <ReadAnyway id={p.id} chapterId={c.id} isOwner={isOwner}>
        <article className={s.piece} style={{ width: "100%", paddingTop: 12 }}>
          <span className={s.sub} style={{ marginTop: 0 }}>
            {subLine(c)}
          </span>
          <div className={s.entry}>
            <StoryText doc={c.doc} idPrefix={`c${c.id}`} cap={false} />
          </div>
        </article>
      </ReadAnyway>
    </div>
  );
}
