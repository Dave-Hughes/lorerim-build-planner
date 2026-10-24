/* eslint-disable @next/next/no-img-element */
import { pageSources } from "@/lib/quests/player-source";
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import { QuestReport } from "@/components/quests/quest-report";
import { QuestRow } from "@/components/quests/journal";
import { rowOf } from "@/lib/quests/reads";
import { townsIn } from "@/lib/places/suggest";
import { LineNeeds, type AfterLine } from "@/components/quests/line-start";
import { categories, categorySlug, gateOf, homeName, mainOrder, questsData } from "@/lib/quests/data";
import { MAIN } from "@/lib/quests/open";
import { storyOfLine } from "@/lib/quests/stories-data";
import { siteMetadata } from "@/lib/og/metadata";
import { questHref } from "@/lib/quests/slugs";
import type { Quest, QuestLine } from "@/lib/quests/types";
import { startChecked } from "@/lib/quests/types";
import styles from "@/components/quests/quests.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  await loadPlayerFacts();
  const l = questsData().byId.get(id);
  return l ? { title: l.name, ...siteMetadata(`/quests/${l.id}`, l.name, l.begins ?? homeName(l.category)) } : {};
}


/** "14 quests pay 100; the rest pay none" */
function xpNote(quests: Quest[]): string {
  const paying = quests.filter((q) => q.xp > 0);
  if (!paying.length) return "None of its quests pay XP";
  const same = paying.every((q) => q.xp === paying[0].xp);
  const head = `${paying.length} quest${paying.length === 1 ? "" : "s"} pay${paying.length === 1 ? "s" : ""} ${same ? paying[0].xp : "XP"}`;
  return paying.length < quests.length ? `${head}; the rest pay none` : head;
}

/** Jobs and errands lines that share a mod with this one (Missives' Wyrmstooth board). */
function siblings(line: QuestLine): QuestLine[] {
  if (line.category === "work") return [];
  const mods = line.sources.filter((s) => !s.base).map((s) => s.name.toLowerCase());
  if (!mods.length) return [];
  return questsData().lines.filter((l) => l.category === "work" && l.sources.some((s) => mods.some((m) => s.name.toLowerCase().includes(m))));
}

/** A quest line (WO-100, QuestLine): how to start it, what it gives, and its quests with their journals. */
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
  const slug = home?.slug ?? "side-stories";
  const main = mainOrder();
  const after: AfterLine[] = line.after
    .filter((a) => a !== MAIN)
    .map((a) => byId.get(a))
    .filter((l): l is QuestLine => !!l)
    .map((l) => ({ id: l.id, name: l.name, home: homeName(l.category), where: l.where, source: l.sources.map((s) => s.name).join(", "), begins: l.begins, quoted: l.beginsFrom === "opening" }));
  const opening = line.quests.find((q) => q.edid === line.opening);
  // A line of jobs from a board lists them once, as the class, not one by one (WO-136 ruling 3): no story rows, no job rows.
  const story = line.board ? [] : [...(opening && opening.xp > 0 ? [opening] : []), ...line.quests.filter((q) => q.xp > 0 && q !== opening)];
  const jobs = line.board ? [] : line.quests.filter((q) => q.xp === 0);
  const shelf0 = line.category === "work";
  const rows = new Map(line.quests.map((q, i) => [q.edid, rowOf(q, i > 0 ? line.quests[i - 1] : undefined)]));
  const gives = line.quests.map((q) => ({ edid: q.edid, name: q.name, what: rows.get(q.edid)!.rewards })).filter((g) => g.what.length > 0);
  const closes = line.quests.flatMap((q) => rows.get(q.edid)!.closes.map((text) => ({ edid: q.edid, name: q.name, text })));
  const read = line.quests.filter((q) => q.source === "reads").length;
  // A shelf of jobs is grouped by where you pick them up (WO-154): the town its start names, else where it is, else "Elsewhere".
  const pickUp = (q: Quest) => {
    const { where, town } = rows.get(q.edid)!;
    return town ?? (where ? (townsIn(where)[0] ?? where) : "Where to pick it up isn't read yet");
  };
  const groups = shelf0 && !line.board ? [...new Set(line.quests.map(pickUp))].map((place) => ({ place, quests: line.quests.filter((q) => pickUp(q) === place) })) : [];
  const sibs = siblings(line);
  const waysIn = line.ways ?? (startChecked(opening?.start) ? opening!.start!.ways : undefined);
  const told = storyOfLine(line.id);
  // A shelf is separate jobs, not a story (WO-147 Part 2): no giver, ways in or first step taken from one of them for the whole.
  const shelf = line.category === "work";
  return (
    <main className={`page ${styles.main} ${styles.inner}`}>
      <Link href={home ? `/quests/c/${home.slug}` : "/quests"} className={styles.back}>
        ‹ {home?.name ?? shelves[line.category]?.name ?? "Quests"}
      </Link>
      {told && (
        <Link href={`/quests/s/${told.id}`} className={styles.storyLink}>
          Read it as a story ›
        </Link>
      )}
      <div className={`frame ${styles.cover}`}>
        <img src={`/quests/${slug}.png`} alt="" className={styles.coverArt} />
        <span className={styles.coverFade} aria-hidden="true" />
        <div className={styles.coverWords}>
          <span className={styles.coverName}>
            <img className={styles.px} src={`/icons/quest-${home ? home.slug : categorySlug(shelves[line.category]?.name ?? "jobs-and-errands")}.svg`} alt="" width={48} height={48} />
            <h1 className={`title ${styles.coverTitle}`}>{line.name}</h1>
          </span>
          <span className={styles.coverMeta}>
            {line.prince && <span>{line.prince}</span>}
            {line.where && <span>{line.where}</span>}
            {line.sources.map((s) =>
              s.modid ? (
                <a key={s.name} href={`https://www.nexusmods.com/skyrimspecialedition/mods/${s.modid}`} target="_blank" rel="noreferrer" className={`${styles.tag} ${styles.mod}`}>
                  {s.name} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span key={s.name} className={styles.tag}>
                  {s.name}
                </span>
              ),
            )}
            <span className="muted">
              {line.quests.length} quest{line.quests.length === 1 ? "" : "s"}
            </span>
          </span>
        </div>
      </div>


      <div className={styles.lineGrid}>
        <div className={styles.lineMain}>
          {line.begins && (line.beginsFrom === "opening" ? <p className={styles.quote}>“{line.begins}”</p> : <p className={styles.plainBig}>{line.begins}</p>)}

          <section className={`frame ${styles.panel}`} aria-labelledby="start-title">
            <h2 id="start-title" className={styles.h2}>
              {shelf ? "How to start them" : "How to start it"}
            </h2>
            {shelf && <p className={styles.soft}>Separate jobs, each with its own start. Open one for how it starts.</p>}
            <dl className={styles.who}>
              {!shelf && line.giver && (
                <>
                  <dt>Who</dt>
                  <dd>
                    {line.giver.name}
                  </dd>
                </>
              )}
              {!shelf && line.giver?.place && (
                <>
                  <dt>Where</dt>
                  <dd>
                    {line.giver.place}
                  </dd>
                </>
              )}
              {/* No one giver (WO-121): the opening quest's ways in, as the start check words them; every opening's, when the line has more than one (WO-121b). */}
              {!shelf && !line.giver && !!waysIn?.length && (
                <>
                  <dt>Ways in</dt>
                  <dd>
                    <ul className={styles.waysList}>
                      {waysIn.map((w, i) => (
                        <li key={i}>
                          {w.how}
                          {w.checked === "players" ? <span className={styles.src}>{w.also?.length ? pageSources(w.source ?? "", w.also) : `player report${w.source ? `, ${w.source}` : ""}`}</span> : null}
                          {"whereIs" in w && w.whereIs?.length ? <span className="muted"> ({w.whereIs.join("; ")})</span> : null}
                          {"unplaced" in w && w.unplaced ? <span className="muted"> ({w.unplaced})</span> : null}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </>
              )}
              {!shelf && !line.giver && line.firstObjective && (
                <>
                  <dt>First step</dt>
                  <dd>
                    {line.firstObjective}
                  </dd>
                </>
              )}
              {line.start && (
                <>
                  <dt>How</dt>
                  <dd>
                    {line.start}
                  </dd>
                </>
              )}
            </dl>
            <div className={styles.needsBlock}>
              <LineNeeds gate={gateOf(line)} after={after} main={main} />
            </div>
          </section>

          <div className={styles.factRow}>
            <span className={styles.fact}>
              <b>Length</b>
              <span>{line.size ?? "Not listed"}</span>
            </span>
            <span className={styles.fact}>
              <b>Enemies</b>
              <span>{line.level ?? "Not listed"}</span>
            </span>
            <span className={styles.fact}>
              <b>Quest XP</b>
              <span>{line.xpTotal.toLocaleString("en-US")}</span>
              <small>{xpNote(line.quests)}</small>
            </span>
          </div>

          {gives.length > 0 && (
            <section className={styles.panel} aria-labelledby="rewards-title">
              <h2 id="rewards-title" className={styles.h2}>
                What the whole line gives
              </h2>
              <ul className={styles.rewards}>
                {gives.map((g) => (
                  <li key={g.edid}>
                    <b>{g.name}</b>: {g.what.map((r) => r.what + (r.when ? ` (${r.when})` : "")).join("; ")}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {closes.length > 0 && (
            <section className={styles.panel} aria-labelledby="closes-title">
              <h2 id="closes-title" className={styles.h2}>
                What it closes
              </h2>
              <ul className={styles.rewards}>
                {closes.map((c) => (
                  <li key={c.edid}>
                    {c.text} <span className="muted">| {c.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="quests-title" className={styles.questsSection}>
            <span className={styles.questsHead}>
              <h2 id="quests-title" className={styles.h2}>
                {shelf ? "Jobs" : "The quests in order"}
              </h2>
            </span>
            {groups.length > 0 &&
              groups.map((g) => (
                <div className={styles.group} key={g.place}>
                  <div className={styles.ghead}>
                    <h3>{g.place}</h3>
                    <span>
                      {g.quests.length} job{g.quests.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <ul className={styles.qlist}>
                    {g.quests.map((q) => (
                      <QuestRow key={q.edid} edid={q.edid} name={q.name} xp={q.xp} first={false} href={questHref(q.edid)} summary={rows.get(q.edid)!.summary} places={rows.get(q.edid)!.places} needs={rows.get(q.edid)!.needs} />
                    ))}
                  </ul>
                </div>
              ))}
            {!shelf0 && story.length > 0 && (
              <div className={styles.group}>
                <div className={styles.ghead}>
                  <h3>{shelf ? "Each one on its own" : "In order"}</h3>
                  <span>
                    {story.length} quest{story.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className={styles.qlist}>
                  {story.map((q) => (
                    <QuestRow key={q.edid} edid={q.edid} name={q.name} xp={q.xp} first={q === opening && line.category !== "work"} href={questHref(q.edid)} summary={rows.get(q.edid)!.summary} places={rows.get(q.edid)!.places} needs={rows.get(q.edid)!.needs} />
                  ))}
                </ul>
              </div>
            )}
            {line.board && (
              <div className={styles.group}>
                <div className={styles.ghead}>
                  <h3>{line.board.name}</h3>
                  <span>{line.quests.length} jobs</span>
                </div>
                <p>{line.board.says}</p>
                <p className="muted">{line.board.boards?.length ? `Where the boards are: ${line.board.boards.join("; ")}.` : "Where the boards are isn't checked yet."}</p>
              </div>
            )}
            {line.radiant && (
              <div className={styles.group}>
                <div className={styles.ghead}>
                  <h3>{line.radiant.name}</h3>
                  <span>{line.radiant.jobs} kinds</span>
                </div>
                <p>{line.radiant.says}</p>
              </div>
            )}
            {!shelf0 && jobs.length > 0 && (
              <div className={styles.group}>
                <div className={styles.ghead}>
                  <h3>Jobs and bounties</h3>
                  <span>
                    {jobs.length} job{jobs.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className={styles.qlist}>
                  {jobs.map((q) => (
                    <QuestRow key={q.edid} edid={q.edid} name={q.name} xp={q.xp} first={q === opening && line.category !== "work"} href={questHref(q.edid)} summary={rows.get(q.edid)!.summary} places={rows.get(q.edid)!.places} needs={rows.get(q.edid)!.needs} />
                  ))}
                </ul>
              </div>
            )}
          </section>
          <p className={styles.sure}>
            {read === line.quests.length ? "Read from the game files and checked by a second reader" : `${read} of ${line.quests.length} quests are read from the game files and checked by a second reader; the rest are from the planner's older rules`}
          </p>
          <QuestReport lineId={line.id} quests={line.quests.map((q) => ({ edid: q.edid, name: q.name }))} signedIn={signedIn} open={reporting} signIn={<SignInButton redirectTo={`/quests/${line.id}?report=1#report`} className="btn btn-sm btn-primary" label="Sign in with Discord" />} />
        </div>

        <aside className={styles.side}>
          {sibs.length > 0 && (
            <section className={`${styles.panel} ${styles.sidePanel}`} aria-labelledby="jobs-side">
              <h2 id="jobs-side" className={styles.sideTitle}>
                {shelves.work?.name ?? "Jobs and errands"}
              </h2>
              {sibs.map((s) => (
                <Link key={s.id} href={`/quests/${s.id}`}>
                  {s.name} ({s.quests.length}) ›
                </Link>
              ))}
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
