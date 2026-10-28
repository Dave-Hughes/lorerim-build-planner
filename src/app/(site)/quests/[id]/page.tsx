/* eslint-disable @next/next/no-img-element */
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import { Linked } from "@/components/pages/linked";
import { InformationConfidence, PageTop, TitleBox } from "@/components/pages/page-kit";
import { linkable, opensNames, ownPlaceNames } from "@/lib/pages/names";
import { playerWords, quoteQuest } from "@/lib/pages/player-words";
import k from "@/components/pages/page-kit.module.css";
import { QuestReport } from "@/components/quests/quest-report";
import { LineJobs, LineStory, LineToc } from "@/components/quests/line-parts";
import type { AfterLine } from "@/components/quests/line-start";
import { categories, dlcOf, homeName, mainOrder, questsData } from "@/lib/quests/data";
import { lineView } from "@/lib/quests/line-view";
import { MAIN, NOWHERE, needsOf } from "@/lib/quests/open";
import { rowOf } from "@/lib/quests/reads";
import { siteMetadata } from "@/lib/og/metadata";
import { questHref } from "@/lib/quests/slugs";
import { storyOfLine } from "@/lib/quests/stories-data";
import type { Quest, QuestLine } from "@/lib/quests/types";
import styles from "@/components/quests/quests.module.css";
import l from "@/components/quests/line-page.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  await loadPlayerFacts();
  const line = questsData().byId.get(id);
  if (!line) return {};
  const story = storyOfLine(line.id);
  return { title: story?.name ?? line.name, ...siteMetadata(`/quests/${line.id}`, story?.name ?? line.name, story?.pitch ?? line.read?.about ?? line.begins ?? homeName(line.category)) };
}

/** A line read's field names as a player says them. */
const LINE_FIELD_WORDS: Record<string, string> = { about: "what it is", getIn: "how to get in", order: "the order of its quests", branches: "the choices", gives: "what it gives", closes: "what it closes" };

/** Jobs and errands lines that share a mod with this one (Missives' Wyrmstooth board). */
function siblings(line: QuestLine): QuestLine[] {
  if (line.category === "work") return [];
  const mods = line.sources.filter((s) => !s.base).map((s) => s.name.toLowerCase());
  if (!mods.length) return [];
  return questsData().lines.filter((l) => l.category === "work" && l.sources.some((s) => mods.some((m) => s.name.toLowerCase().includes(m))));
}

/**
 * A quest line (WO-160, LinePage): the one page for every line, told as a story or as its quests in order. The pitch, At a glance, the story,
 * Along the way, what the line gives and closes, and a rail with the contents, what it opens and how it starts in full; Information
 * Confidence last. A line with a story (stories.json) takes the story's name as its title; the line's own name is a tag under it.
 */
export default async function QuestLinePage({ params, searchParams }: { params: Params; searchParams: Promise<{ report?: string }> }) {
  const { id } = await params;
  // The approved player facts, laid over the quest data (WO-146).
  await loadPlayerFacts();
  // Back from signing in to report (WO-121a Part 5): the form opens where it was.
  const reporting = (await searchParams).report === "1";
  const signedIn = !!(await auth())?.user?.id;
  const { byId, categories: cats, shelves } = questsData();
  const line = byId.get(id);
  if (!line) notFound();
  // A line of one quest isn't a line (WO-154): its quest's page is the page.
  if (line.quests.length === 1 && line.category !== "work" && questHref(line.quests[0].edid)) redirect(questHref(line.quests[0].edid)!);
  const home = cats[line.category] ? categories().find((c) => c.key === line.category)! : null;
  const main = mainOrder();
  const after: AfterLine[] = line.after
    .filter((a) => a !== MAIN)
    .map((a) => byId.get(a))
    .filter((x): x is QuestLine => !!x)
    .map((x) => ({ id: x.id, name: x.name, home: homeName(x.category), where: x.where, source: x.sources.map((s) => s.name).join(", "), begins: x.begins, quoted: x.beginsFrom === "opening" }));
  const view = lineView(line);
  const told = storyOfLine(line.id);
  const lr = line.read;
  const names = [...linkable(), ...ownPlaceNames(line.quests.map((q) => q.name))];
  const opensWords = opensNames();
  const shelf = view.shelf;
  const read = line.quests.filter((q) => q.source === "reads").length;
  const sibs = siblings(line);
  const rows = new Map(line.quests.map((q: Quest, i) => [q.edid, rowOf(q, i > 0 ? line.quests[i - 1] : undefined)]));
  const gives = line.quests.map((q) => ({ edid: q.edid, name: q.name, what: rows.get(q.edid)!.rewards.filter((r) => !/^Gold\b/i.test(r.what)) })).filter((g) => g.what.length > 0);
  const closes = line.quests.flatMap((q) => rows.get(q.edid)!.closes.map((text) => ({ edid: q.edid, name: q.name, text })));
  const pitch = told?.pitch ?? lr?.about ?? null;
  // What the line needs first, as rows with text only: a level is red, a line or the main quest to finish first is green.
  const nameOf = (id: string) => after.find((a) => a.id === id)?.name ?? id;
  const mainName = (edid: string) => main.find((m) => m.edid === edid)?.name ?? edid;
  const needs = needsOf({ id: line.id, minLevel: line.minLevel, after: line.after, mainQuestAt: line.mainQuestAt }, NOWHERE, main.map((m) => m.edid))
    .map((n) =>
      n.kind === "level"
        ? { tone: "danger" as const, text: `Level ${n.level}`, href: null }
        : n.kind === "line"
          ? { tone: "done" as const, text: `${nameOf(n.id)} done`, href: `/quests/${n.id}` }
          : n.kind === "main"
            ? { tone: "done" as const, text: `The main quest through ${mainName(n.edid)}`, href: null }
            : { tone: "done" as const, text: "Part of the main quest comes first; how far isn't checked yet.", href: null },
    )
    .filter((n) => n.text.trim());
  const g = view.glance;
  const cells = [
    { key: "start", icon: "quest-sure", tone: l.cGreen, label: "How it starts", ...g.start, vSmall: g.start.value.length > 30 },
    { key: "level", icon: "tab-levels", tone: l.cRed, label: "Level", ...g.level, vSmall: false },
    { key: "length", icon: "tab-play", tone: l.cOrange, label: "Length", ...g.length, vSmall: false },
    ...(g.xp ? [{ key: "xp", icon: "quest-rewards", tone: l.cGold, label: "Quest XP", ...g.xp, vSmall: false }] : []),
    ...(g.where ? [{ key: "where", icon: "quest-travel", tone: l.cTeal, label: "Where it takes you", value: g.where, sub: null, vSmall: true }] : []),
  ];
  // The read's own sentences, without the editors' hedges in them: what is unsure goes to Not sure yet (WO-177).
  const hedged: { field: string; why?: string }[] = [];
  const said = (field: string, x: string) => {
    const r = playerWords(x);
    for (const u of r.unsure) hedged.push({ field, why: u });
    return quoteQuest(r.text);
  };
  const givesText = (lr?.gives ?? []).map((x) => said("What the whole line gives", x));
  const closesText = (lr?.closes ?? []).map((x) => said("What it closes", x));
  const hasStory = view.chapters.length > 0;
  const toc = [
    ...(hasStory ? [{ id: "story", label: shelf ? "Jobs" : "The story", icon: "tab-play" }] : []),
    ...(view.jobs.length ? [{ id: "along", label: "Along the way", icon: "quest-jobs-and-errands" }] : []),
    ...(lr?.gives?.length || (!lr?.gives && gives.length) ? [{ id: "gives", label: "What the whole line gives", icon: "quest-rewards" }] : []),
    ...(lr?.closes?.length || (!lr?.closes && closes.length) ? [{ id: "closes", label: "What it closes", icon: "quest-changes" }] : []),
    ...(view.opens.length ? [{ id: "opens", label: "Opens other stories", icon: "quest-ways" }] : []),
    { id: "sure-line", label: "Information Confidence", icon: "quest-sure" },
  ];

  return (
    <main className={l.root}>
      <div className={`page ${l.top}`}>
        <PageTop back={{ href: home ? `/quests/c/${home.slug}` : "/quests", label: home?.name ?? shelves[line.category]?.name ?? "Quests" }} />
        <TitleBox
          title={view.title}
          tags={
            <>
              {view.lineTag && <span className={k.role}>{view.lineTag}</span>}
              {line.prince && <span className={k.tag}>{line.prince}</span>}
              {line.where && <span className={k.tag}>{line.where}</span>}
              {(dlcOf(line) ? [{ name: dlcOf(line)!, modid: undefined as string | undefined }] : line.sources).map((s) =>
                s.modid ? (
                  <a key={s.name} href={`https://www.nexusmods.com/skyrimspecialedition/mods/${s.modid}`} target="_blank" rel="noreferrer" className={k.tag}>
                    {s.name} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span key={s.name} className={k.tag}>
                    {s.name}
                  </span>
                ),
              )}
              {view.chapterCount > 0 && <span className={k.tag}>{view.chapterCount} chapters</span>}
              <span className={k.tag}>
                {view.questCount} quest{view.questCount === 1 ? "" : "s"}
              </span>
            </>
          }
        />
        {pitch ? (
          <p className={l.pitch}>
            <Linked text={pitch} names={names} />
          </p>
        ) : line.begins ? line.beginsFrom === "opening" ? <p className={styles.quote}>“{line.begins}”</p> : <p className={l.pitch}>{line.begins}</p> : null}
      </div>

      <section className={l.band} aria-label="At a glance">
        <div className={`page ${l.glance}`} style={{ "--cols": cells.length } as React.CSSProperties}>
          {cells.map((c) => (
            <div key={c.key} className={l.gl}>
              <span className={`${l.k} ${c.tone}`}>
                <img className={l.px} src={`/icons/${c.icon}.svg`} alt="" width={18} height={18} />
                {c.label}
              </span>
              <span className={`${l.v} ${c.key === "xp" ? l.cGold : ""} ${c.vSmall ? l.vSmall : ""}`}>{c.key === "where" ? (
                  g.whereList ? (
                    // Each name whole, the list wrapping between names; the rest is a link to the story that visits them (WO-177).
                    <>
                      {g.whereList.names.map((n, i) => (
                        <span key={n}>
                          {i > 0 && ", "}
                          <span className={l.nw}>
                            <Linked text={n} names={names} />
                          </span>
                        </span>
                      ))}
                      {g.whereList.more > 0 && (
                        <>
                          {" and "}
                          <a href={`#${toc[0]?.id ?? "story"}`} className={l.nw}>
                            {g.whereList.more} more
                          </a>
                        </>
                      )}
                    </>
                  ) : (
                    <Linked text={c.value} names={names} />
                  )
                ) : (
                  c.value
                )}</span>
              {c.sub && (
                <span className={l.s}>
                  <Linked text={c.sub} names={names} />
                </span>
              )}
              {c.key === "start" &&
                g.start.more.map((t, i) => (
                  <span key={i} className={l.s}>
                    <Linked text={t} names={names} />
                  </span>
                ))}
              {c.key === "start" && needs.length > 0 && (
                <ul className={l.needs} aria-label="Needs">
                  {needs.map((n, i) => (
                    <li key={i} className={`${l.need} ${n.tone === "danger" ? l.needDanger : l.needDone}`}>
                      <i />
                      <span>{n.href ? <Link href={n.href}>{n.text.replace(/ done$/, "")}</Link> : n.text}{n.href ? " done" : ""}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className={`page ${l.cols}`}>
        <div className={l.main}>
          {hasStory && <LineStory chapters={view.chapters} numbered={view.numbered} hideable={view.numbered && view.chapters.length > 1} id="story" title={shelf ? "Jobs" : "The story"} icon="tab-play" />}

          {line.board && (
            <section className={l.sec} aria-labelledby="board-h">
              <div className={l.sechd}>
                <h2 id="board-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-jobs-and-errands.svg" alt="" width={30} height={30} />
                  {line.board.name}
                </h2>
                <span className={l.cap}>{line.quests.length} jobs</span>
              </div>
              <p className={l.body}>{line.board.says}</p>
              <p className={l.cap}>{line.board.boards?.length ? `Where the boards are: ${line.board.boards.join("; ")}.` : "Where the boards are isn't checked yet."}</p>
            </section>
          )}
          {line.radiant && (
            <section className={l.sec} aria-labelledby="radiant-h">
              <div className={l.sechd}>
                <h2 id="radiant-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-jobs-and-errands.svg" alt="" width={30} height={30} />
                  {line.radiant.name}
                </h2>
                <span className={l.cap}>{line.radiant.jobs} kinds</span>
              </div>
              <p className={l.body}>{line.radiant.says}</p>
            </section>
          )}

          <LineJobs jobs={view.jobs} note={view.jobsNote} id="along" />

          {lr?.gives?.length ? (
            <section className={l.sec} id="gives" aria-labelledby="gives-h">
              <div className={l.sechd}>
                <h2 id="gives-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-rewards.svg" alt="" width={30} height={30} />
                  What the whole line gives
                </h2>
              </div>
              <ul className={`${l.list} ${l.gives}`}>
                {givesText.map((x, i) => (
                  <li key={i}>
                    <Linked text={x} names={names} />
                  </li>
                ))}
              </ul>
            </section>
          ) : !lr?.gives && gives.length > 0 ? (
            <section className={l.sec} id="gives" aria-labelledby="gives-h">
              <div className={l.sechd}>
                <h2 id="gives-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-rewards.svg" alt="" width={30} height={30} />
                  What the whole line gives
                </h2>
              </div>
              <ul className={`${l.list} ${l.gives}`}>
                {gives.map((x) => (
                  <li key={x.edid}>
                    <b>{x.name}</b>: <Linked text={x.what.map((r) => r.what + (r.when ? ` (${r.when})` : "")).join("; ")} names={names} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {lr?.closes?.length ? (
            <section className={l.sec} id="closes" aria-labelledby="closes-h">
              <div className={l.sechd}>
                <h2 id="closes-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-changes.svg" alt="" width={30} height={30} />
                  What it closes
                </h2>
              </div>
              <ul className={`${l.list} ${l.closes}`}>
                {closesText.map((x, i) => (
                  <li key={i}>
                    <Linked text={x} names={names} />
                  </li>
                ))}
              </ul>
            </section>
          ) : !lr?.closes && closes.length > 0 ? (
            <section className={l.sec} id="closes" aria-labelledby="closes-h">
              <div className={l.sechd}>
                <h2 id="closes-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-changes.svg" alt="" width={30} height={30} />
                  What it closes
                </h2>
              </div>
              <ul className={`${l.list} ${l.closes}`}>
                {closes.map((x) => (
                  <li key={x.edid}>
                    <Linked text={x.text} names={names} /> <span className="muted">| {x.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {view.opens.length > 0 && (
            <section className={l.sec} id="opens" aria-labelledby="opens-h">
              <div className={l.sechd}>
                <h2 id="opens-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-ways.svg" alt="" width={30} height={30} />
                  Opens other stories
                </h2>
              </div>
              <div className={l.opensGrid}>
                {view.opens.map((o) => (
                  <div key={o.id} className={l.op}>
                    <Link href={`/quests/${o.id}`}>{o.name}</Link>
                    {o.needs.length > 0 && (
                      <ul className={l.needs} aria-label={`Needs for ${o.name}`}>
                        {o.needs.map((n, i) => (
                          <li key={i} className={`${l.need} ${n.tone === "done" ? l.needDone : n.tone === "danger" ? l.needDanger : l.needOther}`}>
                            <i />
                            <span>
                              <Linked text={n.text} names={opensWords} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {sibs.length > 0 && (
            <section className={l.sec} aria-labelledby="sibs-h">
              <div className={l.sechd}>
                <h2 id="sibs-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-jobs-and-errands.svg" alt="" width={30} height={30} />
                  {shelves.work?.name ?? "Jobs and errands"}
                </h2>
              </div>
              <div className={l.how}>
                {sibs.map((x) => (
                  <Link key={x.id} href={`/quests/${x.id}`}>
                    {x.name} ({x.quests.length}) ›
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={l.rail}>
          <LineToc items={toc} />
        </aside>
      </div>

      <div className={`page ${l.foot}`}>
        <InformationConfidence
          id="sure-line"
          line={`Read from the game files and checked by a second reader${read === line.quests.length ? "" : `; ${line.quests.length - read} of its ${line.quests.length} quests are from the planner's older rules`}`}
          sources={[
            { mark: "yes", name: "LoreRim's game files", note: "The line and its quests, read, then checked by a second reader" },
            { mark: "no", name: "UESP", note: "Not compared yet" },
            { mark: "no", name: "Players", note: "No one has confirmed this page yet." },
          ]}
          unsure={[...(lr?.unsure ?? []).filter((u) => !lr?.verdicts || lr.verdicts[u.field] === "unsure").map((u) => ({ ...u, field: LINE_FIELD_WORDS[u.field] ?? u.field })), ...view.unsure, ...hedged]}
          actions={
            <QuestReport
              lineId={line.id}
              quests={line.quests.map((q) => ({ edid: q.edid, name: q.name }))}
              signedIn={signedIn}
              open={reporting}
              label="Report a mistake"
              buttonClass="btn"
              signIn={<SignInButton redirectTo={`/quests/${line.id}?report=1`} className="btn btn-sm btn-primary" label="Sign in with Discord" />}
            />
          }
        />
      </div>
    </main>
  );
}
