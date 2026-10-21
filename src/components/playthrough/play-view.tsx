import Link from "next/link";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { standLine, whereLine, type ActView, type ObjectiveView } from "@/lib/playthroughs/view";
import { Answer, TickBox, WhereIsShe } from "./play-controls";
import { ReaderProvider, ReaderLink, StoryCard } from "@/components/reader/reader";
import { actImageOf, runStops } from "@/lib/playthroughs/reader";
import { docText, docWords, firstPlate } from "@/lib/guide/doc";
import { ActCard } from "./act-card";
import { RunHero } from "./tabs";
import s from "./play.module.css";

/**
 * A run whose build the reader can't open, or that has none yet: the run's own band over its Play
 * view, with no tabs (WO-116; with a build, Play is a tab of the build's page).
 */
export function PlayView({ p, isOwner, actIndex }: { p: PlaythroughRecord; isOwner: boolean; actIndex: number | null }) {
  const stops = runStops({ id: p.id, taleLine: p.taleLine, view: p.view, cover: p.build?.coverImageUrl ?? null, coverFocus: p.build?.coverFocus ?? null, isOwner, titlePicture: p.coverImageUrl });
  return (
    <ReaderProvider stops={stops} back={{ href: `/p/${p.id}`, label: `${p.name}'s playthrough` }} runId={p.id} title={p.taleTitle || p.name}>
      <main className={`page ${s.main}`}>
        {isOwner && (
          <Link href="/me" className={s.back}>
            ‹ My characters
          </Link>
        )}
        <RunHero p={p} isOwner={isOwner} />
        <PlayBody p={p} isOwner={isOwner} actIndex={actIndex} />
      </main>
    </ReaderProvider>
  );
}

/** Play's tab line (WO-116): "Act I, 4 of 16 done". */
export function playSub(p: PlaythroughRecord): string {
  const v = p.view;
  if (!v.total) return v.current ? `Act ${v.current.n}` : "No objectives yet";
  return `${v.current ? `Act ${v.current.n}, ` : ""}${v.done} of ${v.total} done`;
}

/**
 * The Play view (WO-111), calmer (WO-118, the PlayCalm board): the acts down the left, the one being
 * read open and the rest one line each; the act takes the width, with where you stand in one quiet
 * line over it once there's a save or the owner's own entry, its card, its goal, what she keeps doing
 * throughout it, and its objectives. The owner ticks in place; everything else is in Edit.
 */
export function PlayBody({ p, isOwner, actIndex }: { p: PlaythroughRecord; isOwner: boolean; actIndex: number | null }) {
  const v = p.view;
  const act = (actIndex !== null ? v.acts[actIndex] : null) ?? v.current;
  const stand = standLine(p.snapshot);
  const card = act ? actCard(p, act) : null;
  const shown = act ? act.objectives.filter((o) => isOwner || o.worked.shown !== "suggested") : [];
  // Done objectives fold into one line at the end (WO-124), so the list is what's left to do.
  const left = shown.filter((o) => !o.worked.done);
  const done = shown.filter((o) => o.worked.done);
  const story = storyPicture(p);

  return (
    <div className={s.body}>
      <div className={s.grid}>
        <aside className={s.col}>
          {/* Her story, always on show (WO-124, the PlayRail board). */}
          <StoryCard picture={story.url} focus={story.focus} title={p.taleTitle || p.name} label="Her story" />
          <section aria-labelledby="acts">
            <span className={`${s.head} ${s.headRule}`}>
              <h2 id="acts" className={`${s.h2} ${s.h2s}`}>
                Acts
              </h2>
            </span>
            <div className={s.acts}>
              {v.acts.map((a, i) => {
                const open = a === act;
                const state = a.total > 0 && a.done === a.total ? s.actDone : open ? s.actNow : s.actLater;
                return (
                  <Link key={a.id} href={`/p/${p.id}?act=${i + 1}`} scroll={false} className={`${s.act} ${state} ${open ? s.actOpenRow : ""}`} aria-current={open ? "true" : undefined}>
                    <span className={s.actName}>
                      {a.n} {a.name}
                    </span>
                    <span className={s.actCnt}>
                      {a.done} of {a.total}
                    </span>
                    {open && <span className={s.actWhere}>{[a.levels, a.place].filter(Boolean).join(" | ")}</span>}
                    {open && (
                      <span className={s.bar}>
                        <i style={{ width: `${a.total ? Math.round((a.done / a.total) * 100) : 0}%` }} />
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        </aside>

        <div className={`${s.col} ${s.actCol}`}>
          {act ? (
            <>
              {isOwner ? (
                <WhereIsShe
                  id={p.id}
                  line={whereLine(p.snapshot)}
                  characters={[...new Set([p.name, p.build?.name].filter((n): n is string => !!n))]}
                  objectives={v.acts.flatMap((a) => a.objectives.flatMap((o) => (o.kind === "once" && o.doneBy === "save" && o.detect && o.accepted ? [{ detect: o.detect }] : [])))}
                  skills={p.snapshot?.skills ?? {}}
                />
              ) : (
                stand && (
                  <span className={s.standLine} aria-label="Where you stand">
                    {stand}
                  </span>
                )
              )}
              {card ? (
                // The act opens with its story (WO-116): the card, then the goal line leads the objectives.
                <section aria-label={`Act ${act.n} ${act.name}`} className={s.actOpen}>
                  <ActCard key={card.chapterId} runId={p.id} isOwner={isOwner} {...card} />
                  {act.goal && <span className={s.goal}>{act.goal}</span>}
                  {act.standingRule && <Throughout text={act.standingRule} />}
                </section>
              ) : (
                <section className={`frame ${s.panel}`} aria-labelledby="act-head">
                  <span className={s.head}>
                    <h2 id="act-head" className={s.h2}>
                      Act {act.n} {act.name}
                    </h2>
                    <span className={s.note}>{[act.levels, act.place].filter(Boolean).join(" | ")}</span>
                  </span>
                  {act.goal && <span className={s.goal}>{act.goal}</span>}
                  {act.standingRule && <Throughout text={act.standingRule} />}
                </section>
              )}

              <section aria-labelledby="objs" className={s.objs}>
                <span className={`${s.head} ${s.headRule}`}>
                  <h2 id="objs" className={`${s.h2} ${s.h2s}`}>
                    Objectives
                  </h2>
                  {shown.length > 0 && <span className={s.note}>{left.length ? `${left.length} to do` : "All done"}</span>}
                </span>
                {left.map((o) => (
                  <Objective key={o.id} o={o} p={p} isOwner={isOwner} />
                ))}
                {done.length > 0 && (
                  <details className={s.doneFold}>
                    <summary>
                      <span className={s.doneMark} aria-hidden="true">
                        ✓
                      </span>
                      {done.length} done <span aria-hidden="true">▾</span>
                    </summary>
                    {done.map((o) => (
                      <Objective key={o.id} o={o} p={p} isOwner={isOwner} />
                    ))}
                  </details>
                )}
                {shown.length === 0 && <p className="muted">No objectives in this act yet.</p>}
              </section>
            </>
          ) : (
            <p className="muted">No acts yet.{isOwner ? " Add the first in Edit." : ""}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Her story's picture (WO-124): the story's own, else its first chapter's, else the cover. */
function storyPicture(p: PlaythroughRecord): { url: string | null; focus: { x: number; y: number } | null } {
  if (p.coverImageUrl) return { url: p.coverImageUrl, focus: null };
  const first = p.view.chapters.find((c) => c.open);
  const plate = first ? firstPlate(first.doc) : null;
  if (plate) return { url: plate, focus: null };
  return { url: p.build?.coverImageUrl ?? null, focus: p.build?.coverFocus ?? null };
}

/** What she keeps doing all through the act (WO-118: "Standing rule" was the old word). */
function Throughout({ text }: { text: string }) {
  return (
    <span className={s.rule}>
      <b>Throughout the act:</b> {text}
    </span>
  );
}

/** An act's story card (WO-116): read from the act's first chapter (WO-118), its image, first lines and length; none without a chapter. */
function actCard(p: PlaythroughRecord, act: ActView) {
  const v = p.view;
  const c = act.chapter !== null ? v.chapters.find((x) => x.id === act.chapter) : undefined;
  if (!c) return null;
  const open = v.chapters.filter((x) => x.actId === act.id && x.open);
  const minutes = Math.max(1, Math.ceil(open.reduce((n, x) => n + docWords(x.doc), 0) / 200));
  const all = v.chapters.filter((x) => x.actId === act.id).length;
  const paras = c.open ? c.doc.content.filter((n) => n.type === "paragraph").map((n) => docText(n).trim()).filter(Boolean) : [];
  return {
    chapterId: c.id,
    n: act.n,
    name: act.name,
    ...(() => {
      const own = actImageOf(v, act);
      return own ? { picture: own.url, focus: own.focus } : { picture: p.build?.coverImageUrl ?? null, focus: p.build?.coverFocus ?? null };
    })(),
    lines: paras.slice(0, 2).join(" "),
    length: `${minutes} min | ${all === 1 ? "a chapter" : `${all} chapters`}`,
    read: !!c.readAt,
  };
}

function Objective({ o, p, isOwner }: { o: ObjectiveView; p: PlaythroughRecord; isOwner: boolean }) {
  const w = o.worked;
  const suggested = w.shown === "suggested";
  const cls = [s.obj, w.done ? s.objDone : "", suggested ? s.sug : ""].join(" ");
  // Every objective has a box (WO-123); the save's word, once it shows it done, can't be ticked away (WO-111a).
  const canTick = isOwner && !suggested && w.shown !== "save";
  return (
    <>
      <div className={cls} id={`o${o.id}`}>
        {canTick ? <TickBox id={p.id} objectiveId={o.id} done={w.done} label={o.text} /> : <span className={s.box} aria-hidden="true">{w.done ? "✓" : ""}</span>}
        <span className={s.t}>
          {o.linkShown?.href ? <Link href={o.linkShown.href}>{o.text}</Link> : o.text}
          {o.linkShown && <span className={s.kind}>{o.linkShown.tag}</span>}
        </span>
        {/* The status on the right says only Under way (WO-118); done shows in the box. */}
        {w.shown === "doing" ? <span className={`${s.st} ${s.stNow}`}>Under way</span> : w.shown === "save" ? <span className={s.st}>From your save</span> : <span />}
        {o.why && <span className={s.why}>{o.why}</span>}
        {w.meter && (
          <span className={s.meter}>
            <i style={{ "--w": `${w.meter.value === null ? 0 : Math.min(100, Math.round((w.meter.value / w.meter.target) * 100))}%` } as React.CSSProperties} />
            {w.meter.value === null ? `${w.meter.label} ${w.meter.target}: not read yet` : `${w.meter.label} ${w.meter.value} of ${w.meter.target}${p.snapshot?.source === "save" ? ", from your save" : ""}`}
          </span>
        )}
        {suggested && isOwner && <Answer id={p.id} objectiveId={o.id} />}
        {/* Story markers (WO-116): the chapters that hang off this objective. */}
        {o.tale.map((t) =>
          t.open ? (
            <ReaderLink key={t.id} href={`/p/${p.id}/story/${t.id}`} className={s.mark}>
              <span className={s.markKind}>Story</span>
              <b>{t.title}</b>
              <span aria-hidden="true">›</span>
            </ReaderLink>
          ) : (
            <span key={t.id} className={`${s.mark} ${s.markWait}`}>
              <span className={s.markKind}>Locked</span> <i className={s.markTitle}>{t.title}</i> <span>{t.opens}</span>
            </span>
          ),
        )}
      </div>
    </>
  );
}

