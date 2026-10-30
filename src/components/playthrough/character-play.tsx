/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { pro, type Pronoun } from "@/lib/pronouns";
import { progressTracking } from "@/lib/features";
import { actPage, type ActPageData } from "@/lib/playthroughs/act-page";
import { editPlayHref } from "@/lib/playthroughs/hrefs";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { mapEntry } from "@/lib/places/map";
import { themeLines, hasWho } from "@/lib/playthroughs/theme";
import { standLine, whereLine } from "@/lib/playthroughs/view";
import { WhereIsShe } from "./play-controls";
import { ActBody } from "./act-body";
import { ActMap } from "./act-map";
import { Backstory } from "./backstory";
import s from "./character-play.module.css";

/**
 * The Playthrough tab (WO-181), from the canvas boards CharacterTheme and CharacterThemeAct. A rail of her card and her acts; beside it, who she is
 * and how she plays with the Begin Act I panel, or one act with its At a glance band, its steps and its own map. `?act=N` opens act N. A character
 * with nothing written about her opens on Act I. Nothing here is done or not done unless progress tracking is on (Part 3).
 */
export const whoWords = (pronoun: Pronoun | null | undefined) => {
  const p = pro(pronoun);
  return {
    heading: `Who ${p.subject} ${p.be}`,
    sub: `Where ${p.subject === "they" ? "they're" : `${p.subject}'s`} from, and how ${p.subject} ${p.subject === "they" ? "play" : "plays"}\u00a0›`,
    plays: `How ${p.subject} ${p.subject === "they" ? "play" : "plays"}`,
    will: `${p.subject.charAt(0).toUpperCase()}${p.subject.slice(1)} will`,
    wont: `${p.subject.charAt(0).toUpperCase()}${p.subject.slice(1)} won't`,
  };
};

const href = (p: PlaythroughRecord, act: number | null) => {
  const base = p.build ? `/b/${p.build.id}?tab=playthrough` : `/p/${p.id}`;
  return act === null ? base : `${base}${base.includes("?") ? "&" : "?"}act=${act}`;
};

export function CharacterPlay({ p, isOwner, actIndex }: { p: PlaythroughRecord; isOwner: boolean; actIndex: number | null }) {
  const v = p.view;
  const who = hasWho(p);
  const pronoun = p.build?.pronoun ?? null;
  const words = whoWords(pronoun);
  const tracking = progressTracking();
  const asked = actIndex !== null ? v.acts[actIndex] : null;
  // With nothing written about her, the tab opens on Act I; with something, on who she is (WO-181).
  const showWho = !asked && who;
  const act = asked ?? (showWho ? null : (v.acts[0] ?? null));
  const entry = mapEntry();
  const data = act ? actPage(p, act, isOwner) : null;
  const first = showWho && v.acts[0] ? actPage(p, v.acts[0], isOwner, { nearby: false }) : null;
  const cover = p.build?.coverImageUrl ?? null;

  return (
    <div className={s.root}>
      <aside className={s.rail}>
        {who ? (
          <Link href={href(p, null)} scroll={false} className={`${s.card} ${showWho ? s.cardOn : ""}`} aria-current={showWho ? "true" : undefined}>
            {cover ? <img src={cover} alt="" /> : null}
            <span>
              <b>{words.heading}</b>
              <small>{words.sub}</small>
            </span>
          </Link>
        ) : isOwner ? (
          <Link href={`${editPlayHref(p)}#who`} className={s.write}>
            Write {pro(pronoun).subject === "they" ? "who they are" : `who ${pro(pronoun).subject} is`} ›
          </Link>
        ) : null}
        <section aria-labelledby="acts-h">
          <h2 id="acts-h" className={s.rl}>
            Acts
          </h2>
          {v.acts.map((a, i) => {
            const on = a === act;
            const steps = a.objectives.filter((o) => isOwner || o.worked.shown !== "suggested").length;
            return (
              <Link key={a.id} href={href(p, i + 1)} scroll={false} className={`${s.act} ${on ? s.actOn : ""}`} aria-current={on ? "true" : undefined}>
                <b>
                  {a.n} {a.name}
                </b>
                <i>{tracking ? `${a.done} of ${a.total} done` : `${steps} ${steps === 1 ? "step" : "steps"}`}</i>
                <small>{[a.levels, a.place].filter(Boolean).join(" | ")}</small>
              </Link>
            );
          })}
          {v.acts.length === 0 && <p className={s.empty}>No acts yet.{isOwner ? " Add the first in Edit." : ""}</p>}
        </section>
      </aside>

      <div className={s.main}>
        {showWho && (
          <>
            <WhoView p={p} words={words} />
            {first && v.acts[0] && <Begin p={p} act={v.acts[0]} data={first} entry={entry} her={pro(pronoun).object} />}
          </>
        )}
        {act && data && (
          <>
            <section className={s.sec} aria-label={`Act ${act.n} ${act.name}`}>
              {/* Where she is in your game: progress tracking only (WO-181 Part 3). */}
              {tracking &&
                (isOwner ? (
                  <WhereIsShe
                    id={p.id}
                    pronoun={pronoun}
                    line={whereLine(p.snapshot)}
                    characters={[...new Set([p.name, p.build?.name].filter((n): n is string => !!n))]}
                    objectives={v.acts.flatMap((x) => x.objectives.flatMap((o) => (o.kind === "once" && o.doneBy === "save" && o.detect && o.accepted ? [{ detect: o.detect }] : [])))}
                    skills={p.snapshot?.skills ?? {}}
                  />
                ) : (
                  standLine(p.snapshot) && <span className={s.note}>{standLine(p.snapshot)}</span>
                ))}
              <div className={s.acthead}>
                <span className={s.actroman}>{act.n}</span>
                <h2 className={s.actname}>{act.name}</h2>
                <span className={s.actcount}>{data.count} {data.count === 1 ? "objective" : "objectives"}</span>
              </div>
              <Glance data={data} her={pro(pronoun).object} />
              {data.intro && <p className={s.intro}>{data.intro}</p>}
              {data.throughout && (
                <p className={s.throughout}>
                  <b>Throughout the act:</b> {data.throughout}
                </p>
              )}
              {data.passedBy && <p className={s.note}>Passed by: {data.passedBy}</p>}
              <ActBody entry={entry} steps={data.steps} stops={data.stops} notOnMap={data.notOnMap} mapHref={data.mapHref} runId={p.id} owner={isOwner} tracking={tracking} label={`Map of Act ${act.n}, ${act.name}`} />
            </section>
            {data.nearby.length > 0 && (
              <section className={s.sec} aria-labelledby="near-h">
                <h2 id="near-h" className={s.h2}>
                  <img src="/icons/quest-jobs-and-errands.svg" alt="" width={30} height={30} />
                  Also nearby<small>Quests and places on {pro(pronoun).possessive} route</small>
                </h2>
                <div className={s.along}>
                  {data.nearby.map((n) => (
                    <span key={n.href}>
                      <img src={n.kind === "quest" ? "/icons/quest-main-stories.svg" : "/icons/quest-travel.svg"} alt="" width={24} height={24} />
                      <b>
                        <Link href={n.href} className={n.kind === "place" ? s.pl : s.pe}>
                          {n.name}
                        </Link>
                      </b>
                      <small>{n.note}</small>
                    </span>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
        {!act && !showWho && v.acts.length === 0 && <p className={s.empty}>{isOwner ? "Nothing is planned yet. Add the first act in Edit." : "Nothing is planned yet."}</p>}
      </div>
    </div>
  );
}

/** Her At a glance: levels (red), where it takes her (teal), and who is with her (orange, not drawn when no one is). */
function Glance({ data, her }: { data: ActPageData; her: string }) {
  const cols = 2 + (data.withHer.length ? 1 : 0);
  return (
    <div className={s.band} style={{ "--n": cols } as React.CSSProperties}>
      <div>
        <span className={`${s.k} ${s.cRed}`}>
          <img src="/icons/tab-levels.svg" alt="" />
          Levels
        </span>
        <span className={s.v}>{data.levels.replace(/^Levels\s+/i, "")}</span>
      </div>
      <div>
        <span className={`${s.k} ${s.cTeal}`}>
          <img src="/icons/quest-travel.svg" alt="" />
          Where it takes {her}
        </span>
        <span className={s.v}>{data.where}</span>
        {data.whereSub && <span className={s.s}>{data.whereSub}</span>}
      </div>
      {data.withHer.length > 0 && (
        <div>
          <span className={`${s.k} ${s.cOrange}`}>
            <img src="/icons/quest-followers.svg" alt="" />
            With {her}
          </span>
          <span className={s.v}>
            {data.withHer.map((w, i) => (
              <span key={w.name}>
                {i > 0 ? ", " : ""}
                {w.href ? (
                  <Link href={w.href} className={s.vlink}>
                    {w.name}
                  </Link>
                ) : (
                  w.name
                )}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

function WhoView({ p, words }: { p: PlaythroughRecord; words: ReturnType<typeof whoWords> }) {
  const t = p.theme ?? {};
  const paragraphs = (t.backstory ?? "").split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const facts = [
    ["From", t.from],
    ["Gods", t.gods],
    ["Goal", t.goal],
  ].filter((x): x is [string, string] => !!x[1]);
  const lines = themeLines(p);
  const cols = [
    { key: "will", label: words.will, cls: s.will, tone: s.cGreen, items: lines.will },
    { key: "wont", label: words.wont, cls: s.wont, tone: s.cRed, items: lines.wont },
    { key: "grey", label: "Grey areas", cls: s.grey, tone: s.cViolet, items: lines.grey },
  ].filter((c) => c.items.length);
  return (
    <>
      {(paragraphs.length > 0 || facts.length > 0) && (
        <section className={s.sec} aria-labelledby="who-h">
          <h2 id="who-h" className={s.h2}>
            <img src="/icons/tab-play.svg" alt="" />
            {words.heading}
          </h2>
          {paragraphs.length > 0 && <Backstory paragraphs={paragraphs} />}
          {facts.length > 0 && (
            <div className={s.sumrow} style={{ "--n": facts.length } as React.CSSProperties}>
              {facts.map(([k, v]) => (
                <span key={k}>
                  <b>{k}</b>
                  {v}
                </span>
              ))}
            </div>
          )}
        </section>
      )}
      {cols.length > 0 && (
        <section className={s.sec} aria-labelledby="plays-h">
          <h2 id="plays-h" className={s.h2}>
            <img src="/icons/quest-ways.svg" alt="" />
            {words.plays}
          </h2>
          <div className={s.band} style={{ "--n": cols.length } as React.CSSProperties}>
            {cols.map((c) => (
              <div key={c.key} className={c.cls}>
                <span className={`${s.k} ${c.tone}`}>{c.label}</span>
                <ul>
                  {c.items.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

/** Begin Act I: the loudest thing on the page; the whole panel is the click, Act I's own map behind it. */
function Begin({ p, act, data, entry, her }: { her: string; p: PlaythroughRecord; act: PlaythroughRecord["view"]["acts"][number]; data: ActPageData; entry: ReturnType<typeof mapEntry> }) {
  const placed = data.stops.some((x) => x.slug);
  return (
    <Link href={href(p, 1)} scroll={false} className={s.start} aria-label={`Begin Act ${act.n}, ${act.name}`}>
      {entry && placed && (
        <div className={s.startMap} aria-hidden="true">
          <ActMap entry={entry} stops={data.stops} still label="" />
        </div>
      )}
      <div className={s.startIn}>
        <div className={s.startTitle}>
          <span className={s.roman}>{act.n}</span>
          <span className={s.startName}>{act.name}</span>
        </div>
        {data.intro && <p className={s.startGoal}>{data.intro}</p>}
        <div className={s.startFacts}>
          <span>
            <b className={s.cRed}>Levels</b> {data.levels.replace(/^Levels\s+/i, "")}
          </span>
          <span>
            <b className={s.cTeal}>Where</b> {data.where}
          </span>
          {data.withHer.length > 0 && (
            <span>
              <b className={s.cOrange}>With {her}</b> {data.withHer.map((w) => w.name).join(", ")}
            </span>
          )}
          <span>
            {data.count} {data.count === 1 ? "objective" : "objectives"}
          </span>
        </div>
        <span className={s.begin}>Begin Act {act.n} ›</span>
      </div>
    </Link>
  );
}
