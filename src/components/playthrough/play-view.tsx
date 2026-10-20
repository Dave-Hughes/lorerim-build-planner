import Link from "next/link";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { formatDate } from "@/lib/format/date";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { skillsMoved, type ActView, type ObjectiveView } from "@/lib/playthroughs/view";
import { Answer, HandEntry, StatusPick, TickBox, Visibility } from "./play-controls";
import { Byline, PlaythroughTabs } from "./tabs";
import s from "./play.module.css";

/**
 * The Play view (WO-111), as the Playthrough board on canvas row 23: where you stand from the
 * snapshot, the acts down the left, the act's objectives with their status worked out, one-line
 * pointers to the tale (never its text), and on the right what's next, the character, and who can see it.
 */
export function PlayView({ p, isOwner, actIndex }: { p: PlaythroughRecord; isOwner: boolean; actIndex: number | null }) {
  const v = p.view;
  const act = (actIndex !== null ? v.acts[actIndex] : null) ?? v.current;
  const snap = p.snapshot;
  const moved = snap ? skillsMoved(snap) : [];
  const reachKeys = v.acts.flatMap((a) => a.objectives.flatMap((o) => (o.reach ? [o.reach.key] : [])));
  const skills = [...new Set(reachKeys.filter((k) => k.startsWith("skill:")).map((k) => k.slice(6)))];
  const counts = [...new Set(reachKeys.filter((k) => k.startsWith("count:")).map((k) => k.slice(6)))];
  const curIdx = v.current ? v.acts.indexOf(v.current) : -1;
  const next = v.current ? nextUp(v.current) : null;
  const nextAct = curIdx >= 0 ? v.acts[curIdx + 1] : undefined;

  return (
    <main className={`page ${s.main}`}>
      {isOwner && (
        <Link href="/me#playthroughs" className={s.back}>
          ‹ My playthroughs
        </Link>
      )}

      <div className={`frame ${s.band}`}>
        <div className={s.bandHead}>
          <h1 className={s.name}>{p.name}</h1>
          <span className={s.bandActions}>
            {isOwner && (
              <Link href={`/p/${p.id}/edit`} className="btn">
                Edit
              </Link>
            )}
            <CopyLinkButton path={`/p/${p.id}`} className="btn" />
          </span>
        </div>
        {p.line && <span className={s.lineText}>{p.line}</span>}
        <Byline p={p} />
      </div>

      <PlaythroughTabs p={p} current="play" />

      <section aria-labelledby="stand" className={s.stand}>
        <span className={s.head}>
          <h2 id="stand" className={s.h2}>
            Where you stand
          </h2>
          <span className={s.note}>
            {snap ? `From ${snap.label.toLowerCase() === "by hand" ? "your own entry" : snap.label}, ${formatDate(snap.at)}${snap.source === "save" ? ", read by the helper" : ""}` : "No save read yet"}
            {isOwner && (
              <>
                {" | "}
                <HandEntry
                  id={p.id}
                  initial={{ level: snap?.level ?? null, day: snap?.day ?? null, place: snap?.place ?? "", skills: snap?.skills ?? {}, counts: snap?.counts ?? {} }}
                  skills={skills}
                  counts={counts}
                />
              </>
            )}
          </span>
        </span>
        {snap ? (
          <div className={s.cells}>
            <span className={s.cell}>
              <b>Act</b>
              <span>{v.current ? `${v.current.n} ${v.current.name}` : "None yet"}</span>
              {v.current?.place && <small>{v.current.place}</small>}
            </span>
            <span className={s.cell}>
              <b>Level</b>
              <span>{snap.level}</span>
              {snap.xp !== null && <small>{snap.xp} XP</small>}
            </span>
            <span className={s.cell}>
              <b>Day</b>
              <span>{snap.day ?? "Not given"}</span>
              {snap.day !== null && <small>in Skyrim</small>}
            </span>
            <span className={s.cell}>
              <b>Skills that moved</b>
              <span>{moved.length ? moved.map((m) => `${m.name} ${m.value}`).join(" | ") : "None"}</span>
              {snap.prevLabel && <small>since {snap.prevLabel.toLowerCase() === "by hand" ? "your last entry" : snap.prevLabel}</small>}
            </span>
          </div>
        ) : (
          <p className={s.empty}>Where you stand comes from your save through the helper, or from you by hand.</p>
        )}
      </section>

      <div className={s.grid}>
        <aside className={s.col} style={{ gap: 20 }}>
          <section aria-labelledby="acts">
            <span className={`${s.head} ${s.headRule}`}>
              <h2 id="acts" className={`${s.h2} ${s.h2s}`}>
                Acts
              </h2>
              <span className={s.note}>{v.acts.length}</span>
            </span>
            <div className={s.acts}>
              {v.acts.map((a, i) => {
                const state = a.total > 0 && a.done === a.total ? s.actDone : a === act ? s.actNow : s.actLater;
                return (
                  <Link key={a.id} href={`/p/${p.id}?act=${i + 1}`} className={`${s.act} ${state}`} aria-current={a === act ? "true" : undefined}>
                    <span className={s.actN}>{a.n}</span>
                    <h3>{a.name}</h3>
                    <span className={s.actCnt}>
                      {a.done} of {a.total}
                    </span>
                    <span className={s.actWhere}>{[a.levels, a.place].filter(Boolean).join(" | ")}</span>
                    <span className={s.bar}>
                      <i style={{ width: `${a.total ? Math.round((a.done / a.total) * 100) : 0}%` }} />
                    </span>
                  </Link>
                );
              })}
            </div>
            {isOwner && (
              <span style={{ display: "block", paddingTop: 14 }}>
                <Link href={`/p/${p.id}/edit?add=act`} className="btn btn-sm">
                  Add an act
                </Link>
              </span>
            )}
          </section>
        </aside>

        <div className={s.col}>
          {act ? (
            <>
              <section className={`frame ${s.panel}`} aria-labelledby="act-head">
                <span className={s.head}>
                  <h2 id="act-head" className={s.h2}>
                    Act {act.n} {act.name}
                  </h2>
                  <span className={s.note}>{[act.levels, act.place].filter(Boolean).join(" | ")}</span>
                </span>
                {act.goal && <span className={s.goal}>{act.goal}</span>}
                {act.standingRule && <span className={s.rule}>Standing rule: {act.standingRule}</span>}
              </section>

              <section aria-labelledby="objs" className={s.objs}>
                <span className={`${s.head} ${s.headRule}`}>
                  <h2 id="objs" className={`${s.h2} ${s.h2s}`}>
                    Objectives
                  </h2>
                  <span className={s.note}>Ticked from your save where it can tell; the rest by you</span>
                </span>
                {act.openBeats.length > 0 &&
                  act.openBeats.map((cid) => {
                    const c = v.chapters.find((x) => x.id === cid)!;
                    return (
                      <div key={cid} className={s.tale}>
                        <span>
                          <span className={s.taleTitle}>{c.title}</span> is open in the tale.{" "}
                          <Link href={`/p/${p.id}/tale?from=${v.acts.indexOf(act) + 1}#c${c.id}`}>Read it ›</Link>
                        </span>
                      </div>
                    );
                  })}
                {act.objectives.map((o) => (
                  <Objective key={o.id} o={o} p={p} isOwner={isOwner} actN={v.acts.indexOf(act) + 1} />
                ))}
                {act.objectives.length === 0 && <p className="muted">No objectives in this act yet.</p>}
                {isOwner && (
                  <span className={s.add}>
                    <Link href={`/p/${p.id}/edit?act=${act.id}`} className="btn btn-sm">
                      Add an objective
                    </Link>
                    <span className={s.note}>A quest, a quest line, a spell, an item, or your own words</span>
                  </span>
                )}
              </section>
            </>
          ) : (
            <p className="muted">No acts yet.{isOwner ? " Add the first on the edit page." : ""}</p>
          )}
        </div>

        <aside className={s.side}>
          <section className={`frame ${s.panel}`} aria-labelledby="next">
            <h2 id="next" className={`${s.h2} ${s.h2s}`}>
              Next
            </h2>
            <dl className={s.who}>
              <dt>In the game</dt>
              <dd>{next?.game ?? "Nothing left in this act"}</dd>
              <dt>In the tale</dt>
              <dd>{next?.tale ?? "Nothing waiting"}</dd>
              <dt>Next act</dt>
              <dd>{nextAct ? `${nextAct.name}, from level ${nextAct.levelFrom}${nextAct.goal ? `: ${nextAct.goal}` : ""}` : "This is the last act"}</dd>
            </dl>
          </section>

          {p.build && (
            <section className={s.panel} aria-labelledby="char">
              <h2 id="char" className={`${s.h2} ${s.h2s}`}>
                The character
              </h2>
              <dl className={s.who}>
                <dt>Race</dt>
                <dd>{p.build.race}</dd>
                <dt>Birthsign</dt>
                <dd>The {p.build.birthsign}</dd>
                {p.build.deity && (
                  <>
                    <dt>Deity</dt>
                    <dd>{p.build.deity}</dd>
                  </>
                )}
                {p.build.start && (
                  <>
                    <dt>Start</dt>
                    <dd>{p.build.start}</dd>
                  </>
                )}
                {p.build.traits.length > 0 && (
                  <>
                    <dt>Traits</dt>
                    <dd>{p.build.traits.join(", ")}</dd>
                  </>
                )}
              </dl>
              <Link href={`/b/${p.build.id}`}>The build, level by level ›</Link>
            </section>
          )}

          {isOwner && (
            <section className={s.panel} aria-labelledby="keep">
              <h2 id="keep" className={`${s.h2} ${s.h2s}`}>
                Keeping it current
              </h2>
              <dl className={s.who}>
                <dt>Assistant</dt>
                <dd>{p.draftedBy ? `${p.draftedBy}, through the planner's door. Last change ${formatDate(p.updatedAt)}.` : "None. You made it on the site."}</dd>
                <dt>Save</dt>
                <dd>{snap ? (snap.source === "save" ? `${snap.label}, read ${formatDate(snap.at)} by the helper${snap.readBy ? ` for ${snap.readBy}` : ""}.` : `Entered by hand, ${formatDate(snap.at)}.`) : "None read yet."}</dd>
              </dl>
              <span className={s.note}>The assistant drafts and suggests. You tick, accept, and publish.</span>
            </section>
          )}

          {isOwner && (
            <section aria-labelledby="see" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h2 id="see" className={`${s.h2} ${s.h2s}`}>
                Who can see it
              </h2>
              <Visibility id={p.id} initial={p.visibility} />
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

/** What's next in the act: the first objective not done, and the first beat still waiting. */
function nextUp(a: ActView): { game: string | null; tale: string | null } {
  const game = a.objectives.find((o) => o.accepted && !o.worked.done) ?? null;
  let tale: string | null = null;
  for (const o of a.objectives) {
    const t = o.tale.find((x) => !x.open);
    if (t) {
      tale = `${t.title}, ${t.opens === "opens when you tick this" ? `when you tick ${o.text}` : t.opens.replace(/^opens /, "")}`;
      break;
    }
  }
  return { game: game?.text ?? null, tale };
}

const SHOWN: Record<string, string> = { save: "Done, from your save", hand: "Done, ticked by you", doing: "Under way", todo: "To do", later: "Later" };

function Objective({ o, p, isOwner, actN }: { o: ObjectiveView; p: PlaythroughRecord; isOwner: boolean; actN: number }) {
  const w = o.worked;
  const suggested = w.shown === "suggested";
  const cls = [s.obj, w.done ? s.objDone : "", suggested ? s.sug : ""].join(" ");
  // The save's word, once it shows the stage, can't be ticked away (WO-111a).
  const canTick = isOwner && !suggested && o.kind === "once" && w.shown !== "save";
  const stCls = w.shown === "save" ? `${s.st} ${s.stSave}` : w.shown === "doing" ? `${s.st} ${s.stNow}` : s.st;
  return (
    <>
      <div className={cls} id={`o${o.id}`}>
        {canTick ? <TickBox id={p.id} objectiveId={o.id} done={w.done} label={o.text} /> : <span className={s.box} aria-hidden="true">{w.done ? "✓" : ""}</span>}
        <span className={s.t}>
          {o.linkShown?.href ? <Link href={o.linkShown.href}>{o.text}</Link> : o.text}
          {o.linkShown && <span className={s.kind}>{o.linkShown.tag}</span>}
        </span>
        {suggested ? (
          <span className={s.st}>Suggested by {o.suggestedBy}</span>
        ) : isOwner && !w.done && o.kind === "once" ? (
          <StatusPick id={p.id} objectiveId={o.id} status={o.status} save={o.doneBy === "save"} />
        ) : (
          <span className={stCls}>{SHOWN[w.shown]}</span>
        )}
        {o.why && <span className={s.why}>{o.why}</span>}
        {w.meter && (
          <span className={s.meter}>
            <i style={{ "--w": `${w.meter.value === null ? 0 : Math.min(100, Math.round((w.meter.value / w.meter.target) * 100))}%` } as React.CSSProperties} />
            {w.meter.value === null ? `${w.meter.label} ${w.meter.target}: not read yet` : `${w.meter.label} ${w.meter.value} of ${w.meter.target}${p.snapshot?.source === "save" ? ", from your save" : ""}`}
          </span>
        )}
        {suggested && isOwner && <Answer id={p.id} objectiveId={o.id} />}
      </div>
      {o.tale.map((t) =>
        t.open ? (
          <div key={t.id} className={s.tale}>
            <span>
              <span className={s.taleTitle}>{t.title}</span> opened from this.{" "}
              <Link href={`/p/${p.id}/tale?from=${actN}#c${t.id}`}>Read it ›</Link>
            </span>
          </div>
        ) : (
          <div key={t.id} className={`${s.tale} ${s.taleWait}`}>
            <span>
              <span className={s.taleTitle}>{t.title}</span> {t.opens}.
            </span>
          </div>
        ),
      )}
    </>
  );
}

