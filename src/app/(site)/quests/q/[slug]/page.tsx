/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { QuestReport } from "@/components/quests/quest-report";
import { SignInButton } from "@/components/site-header";
import { openForYou, playerState } from "@/lib/mcp/facts";
import { toldOf } from "@/lib/mcp/playthroughs";
import { categories, categorySlug, homeName, questsData } from "@/lib/quests/data";
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import { pageSources } from "@/lib/quests/player-source";
import { pageOf } from "@/lib/quests/reads";
import { questBySlug, questHref } from "@/lib/quests/slugs";
import { startChecked } from "@/lib/quests/types";
import { listMyPlaythroughs } from "@/lib/playthroughs/queries";
import { playthroughsOn } from "@/lib/features";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/quests/quests.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  await loadPlayerFacts();
  const found = questBySlug((await params).slug);
  if (!found) return {};
  const { line, quest } = found;
  return { title: `${quest.name || quest.edid} | ${line.name}`, ...siteMetadata(questHref(quest.edid) ?? "/quests", quest.name || quest.edid, quest.start?.then ?? line.begins ?? homeName(line.category)) };
}

/**
 * A quest's own page (WO-147 Part 1): how it starts, the first step, its objectives, how it can end and what changes a run, what it
 * is part of, where it was checked, and the report forms for that quest. A shelf's quest stands alone; a story's names the
 * quests before and after it. With a playthrough, whether it is open for the player.
 */
export default async function QuestPage({ params, searchParams }: { params: Params; searchParams: Promise<{ report?: string }> }) {
  await loadPlayerFacts();
  const slug = (await params).slug;
  const found = questBySlug(slug);
  if (!found) notFound();
  const { line, quest } = found;
  const reporting = (await searchParams).report === "1";
  const userId = (await auth())?.user?.id ?? null;
  const name = quest.name || quest.edid;
  const start = quest.start;
  const home = questsData().categories[line.category] ? categories().find((c) => c.key === line.category)! : null;
  const shelf = line.category === "work";
  // A line of one quest isn't a line (WO-154): the quest sits in its category.
  const lone = line.quests.length === 1;
  const art = home?.slug ?? "side-stories";
  const here = line.quests.findIndex((q) => q.edid === quest.edid);
  const before = !shelf && here > 0 ? line.quests[here - 1] : null;
  const after = !shelf && here < line.quests.length - 1 ? line.quests[here + 1] : null;
  const page = pageOf(quest);

  // Open for the player (WO-147): through their most recent run with a save, when they have one.
  let forYou: { run: string; says: string } | null = null;
  if (userId && playthroughsOn()) {
    const runs = await listMyPlaythroughs(userId);
    const run = runs[0];
    if (run) {
      const state = playerState(await toldOf({ playthrough: run.id }, userId));
      forYou = { run: run.name, says: openForYou(line, quest, state).says };
    }
  }

  return (
    <main className={`page ${styles.main} ${styles.inner}`}>
      <Link href={lone && home ? `/quests/c/${home.slug}` : `/quests/${line.id}`} className={styles.back}>
        ‹ {lone && home ? homeName(line.category) : line.name}
      </Link>
      <div className={`frame ${styles.cover}`}>
        <img src={`/quests/${art}.png`} alt="" className={styles.coverArt} />
        <span className={styles.coverFade} aria-hidden="true" />
        <div className={styles.coverWords}>
          <span className={styles.coverName}>
            <img className={styles.px} src={`/icons/quest-${home ? home.slug : categorySlug(questsData().shelves[line.category]?.name ?? "jobs-and-errands")}.svg`} alt="" width={48} height={48} />
            <h1 className={`title ${styles.coverTitle}`}>{name}</h1>
          </span>
          <span className={styles.coverMeta}>
            {lone ? <span>{homeName(line.category)}</span> : <Link href={`/quests/${line.id}`}>{line.name}</Link>}
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
          </span>
        </div>
      </div>

      <div className={styles.lineGrid}>
        <div className={styles.lineMain}>
          {page.canDo && (
            <section className={`frame ${styles.panel}`} aria-labelledby="can-title">
              <h2 id="can-title" className={styles.h2}>
                Can I do it?
              </h2>
              <p>
                {page.canDo.label}
                {page.canDo.why ? `. ${page.canDo.why}` : ""}
              </p>
            </section>
          )}

          {(page.source === "reads" || startChecked(start)) && (
            <section className={styles.panel} aria-labelledby="needs-title">
              <h2 id="needs-title" className={styles.h2}>
                What you need first
              </h2>
              {page.needs.length ? (
                <ul className={styles.waysList}>
                  {page.needs.map((n, i) => (
                    <li key={i}>{n.href ? <Link href={n.href}>{n.text}</Link> : n.text}</li>
                  ))}
                </ul>
              ) : (
                <p>Nothing: any level</p>
              )}
            </section>
          )}

          <section className={styles.panel} aria-labelledby="start-title">
            <h2 id="start-title" className={styles.h2}>
              How to start it
            </h2>
            {page.starts.length ? (
              <ul className={styles.waysList}>
                {page.starts.map((w, i) => (
                  <li key={i}>
                    {w.how}
                    {w.who && !w.how.includes(w.who) ? <span className="muted"> ({w.who})</span> : null}
                    {w.where && !w.how.includes(w.where) ? <span className="muted"> | {w.where}</span> : null}
                    {w.whereIs?.length ? <span className="muted"> ({w.whereIs.join("; ")})</span> : null}
                    {w.unplaced ? <span className="muted"> ({w.unplaced})</span> : null}
                    {w.reportedBy ? <span className={styles.src}>{w.reportedBy.also?.length ? pageSources(w.reportedBy.source, w.reportedBy.also) : `player report${w.reportedBy.source ? `, ${w.reportedBy.source}` : ""}`}</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Its start isn&apos;t read yet.</p>
            )}
            {page.firstStep && (
              <p>
                <b>First step:</b> {page.firstStep}
                {start?.doors?.map((d) => (
                  <span key={d} className="muted"> ({d.replace(/\.$/, "")})</span>
                ))}
              </p>
            )}
            {forYou && (
              <p>
                <b>For {forYou.run}:</b> {forYou.says}
              </p>
            )}
          </section>

          {page.takesYou.length > 0 && (
            <section className={styles.panel} aria-labelledby="takes-title">
              <h2 id="takes-title" className={styles.h2}>
                Where it takes you
              </h2>
              <ol className={styles.waysList}>
                {page.takesYou.map((t, i) => (
                  <li key={i}>
                    <b>{t.place}</b>
                    {t.hold ? <span className="muted">, {t.hold}</span> : null}
                    {t.why ? <> | {t.why}</> : null}
                    {t.danger ? <span className="muted"> | {t.danger}</span> : null}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {page.choices.length > 0 && (
            <section className={styles.panel} aria-labelledby="choices-title">
              <h2 id="choices-title" className={styles.h2}>
                Choices that matter
              </h2>
              <ul className={styles.waysList}>
                {page.choices.map((c, i) => (
                  <li key={i}>
                    {c.choice}
                    {c.leadsTo ? <span className="muted"> | {c.leadsTo}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className={styles.panel} aria-labelledby="gets-title">
            <h2 id="gets-title" className={styles.h2}>
              What you get
            </h2>
            <ul className={styles.rewards}>
              <li>
                <b>XP</b>: {page.gets.xp ? `${page.gets.xp}${page.gets.type ? ` (${page.gets.type})` : ""}` : "none"}
              </li>
              {page.gets.rewards.map((r, i) => (
                <li key={i}>
                  {r.what}
                  {r.when ? <span className="muted"> | {r.when}</span> : null}
                </li>
              ))}
            </ul>
          </section>

          {(page.opens.length > 0 || page.closes.length > 0 || (page.source === "rules" && (before || after))) && (
            <section className={styles.panel} aria-labelledby="opens-title">
              <h2 id="opens-title" className={styles.h2}>
                What it opens and closes
              </h2>
              {page.opens.length > 0 && (
                <p>
                  <b>Opens</b>:{" "}
                  {page.opens.map((o, i) => (
                    <span key={i}>
                      {i > 0 ? ", " : ""}
                      {o.href ? <Link href={o.href}>{o.text}</Link> : o.text}
                    </span>
                  ))}
                </p>
              )}
              {page.closes.length > 0 && (
                <p>
                  <b>Closes</b>: {page.closes.join("; ")}
                </p>
              )}
              {page.source === "rules" && (before || after) && (
                <p>
                  {before && (
                    <>
                      Before it: <Link href={questHref(before.edid) ?? `/quests/${line.id}`}>{before.name || before.edid}</Link>
                    </>
                  )}
                  {before && after && <span className="muted"> | </span>}
                  {after && (
                    <>
                      After it: <Link href={questHref(after.edid) ?? `/quests/${line.id}`}>{after.name || after.edid}</Link>
                    </>
                  )}
                </p>
              )}
            </section>
          )}

          {page.steps.length > 0 && (
            <section className={styles.panel} aria-labelledby="steps-title">
              <h2 id="steps-title" className={styles.h2}>
                The steps
              </h2>
              {page.steps.map((st, i) => (
                <div key={i}>
                  {st.branch && <h3 className={styles.h3}>{st.branch}</h3>}
                  <ul className={styles.waysList}>
                    {st.objectives.map((o, j) => (
                      <li key={j}>{o}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          <p className={styles.sure}>{page.sure}</p>
          {page.unsure.some((u) => u.why) && (
            <details className={styles.ends}>
              <summary>Why we&apos;re unsure</summary>
              <ul className={styles.waysList}>
                {page.unsure.filter((u) => u.why).map((u, i) => (
                  <li key={i}>
                    <b>{u.field}</b>: {u.why}
                  </li>
                ))}
              </ul>
            </details>
          )}

          <QuestReport
            lineId={line.id}
            quests={[{ edid: quest.edid, name }]}
            signedIn={!!userId}
            open={reporting}
            signIn={<SignInButton redirectTo={`${questHref(quest.edid)}?report=1#report`} className="btn btn-sm btn-primary" label="Sign in with Discord" />}
          />
        </div>
        <aside className={styles.side} />
      </div>
    </main>
  );
}
