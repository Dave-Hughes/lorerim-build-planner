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
import { GOLD, RUN_CHANGE } from "@/lib/quests/run-change";
import { questBySlug, questHref } from "@/lib/quests/slugs";
import { checkedLabel } from "@/lib/quests/story";
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
  const art = home?.slug ?? "side-stories";
  const here = line.quests.findIndex((q) => q.edid === quest.edid);
  const before = !shelf && here > 0 ? line.quests[here - 1] : null;
  const after = !shelf && here < line.quests.length - 1 ? line.quests[here + 1] : null;
  const told = quest.endings.filter((e) => e.text);

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
  const ways = start?.ways ?? [];
  const players = ways.filter((w) => w.checked === "players");
  const gold = quest.rewards?.gold ? GOLD[quest.rewards.gold] : null;
  const items = quest.rewards?.items ?? [];

  return (
    <main className={`page ${styles.main} ${styles.inner}`}>
      <Link href={`/quests/${line.id}`} className={styles.back}>
        ‹ {line.name}
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
            <Link href={`/quests/${line.id}`}>{line.name}</Link>
            {line.where && <span>{line.where}</span>}
            <span className="muted">{quest.xp ? `${quest.xp} XP` : "No XP"}</span>
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
          <section className={`frame ${styles.panel}`} aria-labelledby="start-title">
            <h2 id="start-title" className={styles.h2}>
              How to start it
            </h2>
            {start && startChecked(start) ? (
              <>
                {start.who && (
                  <dl className={styles.who}>
                    <dt>Who</dt>
                    <dd>
                      {start.who}
                      {start.whoElse && <span className="muted"> ({start.whoElse})</span>}
                    </dd>
                    {start.where && (
                      <>
                        <dt>Where</dt>
                        <dd>{start.where}</dd>
                      </>
                    )}
                  </dl>
                )}
                {ways.length ? (
                  <ul className={styles.waysList}>
                    {ways.map((w, i) => (
                      <li key={i}>
                        {w.how}
                        {w.needs?.length ? <span className="muted"> ({w.needs.join("; ")})</span> : null}
                        {w.checked === "players" ? <span className={styles.src}>{w.also?.length ? pageSources(w.source ?? "", w.also) : `player report${w.source ? `, ${w.source}` : ""}`}</span> : null}
                        {w.whereIs?.length ? <span className="muted"> ({w.whereIs.join("; ")})</span> : null}
                        {w.unplaced ? <span className="muted"> ({w.unplaced})</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : start.needs?.length ? (
                  <ul className={styles.waysList}>
                    {start.needs.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">It runs from the start of the game.</p>
                )}
                {start.then && (
                  <p>
                    <b>First step:</b> {start.then}
                    {start.thenWhere ? ` at ${start.thenWhere}` : ""}
                  </p>
                )}
                <span className={styles.src}>{checkedLabel(start.checked, start.source)}</span>
              </>
            ) : (
              <>
                <p className="muted">Its start isn&apos;t checked yet.</p>
                {players.length > 0 && (
                  <ul className={styles.waysList}>
                    {players.map((w, i) => (
                      <li key={i}>
                        {w.how}
                        <span className={styles.src}>{w.also?.length ? pageSources(w.source ?? "", w.also) : `player report${w.source ? `, ${w.source}` : ""}`}</span>
                        {w.whereIs?.length ? <span className="muted"> ({w.whereIs.join("; ")})</span> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {forYou && (
              <p>
                <b>For {forYou.run}:</b> {forYou.says}
              </p>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="objectives-title">
            <h2 id="objectives-title" className={styles.h2}>
              Objectives
            </h2>
            {quest.objectives.length ? (
              <ul className={styles.waysList}>
                {quest.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            ) : (
              <span className={styles.soft}>Its records list no objectives.</span>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="ends-title">
            <h2 id="ends-title" className={styles.h2}>
              How it can end
            </h2>
            {told.length ? (
              told.map((e, i) => (
                <p key={i} className={styles.ending}>
                  <span className={styles.entry}>“{e.text}”</span>
                  {(e.fails || e.when) && <span className="muted">{[e.fails && "Fails the quest", e.when && `When ${e.when}`].filter(Boolean).join(" | ")}</span>}
                </p>
              ))
            ) : (
              <span className={styles.soft}>{quest.endings.length ? "Its records end it without a journal line." : "Its records don't list an ending."}</span>
            )}
            {(gold || items.length > 0 || quest.rewards?.endings?.length) && (
              <>
                <span className="muted">From the game files, not checked in game</span>
                <ul className={styles.rewards}>
                  {(gold || items.length > 0) && (
                    <li>
                      <b>Rewards</b>: {[gold, ...items].filter(Boolean).join(", ")}
                    </li>
                  )}
                  {quest.rewards?.endings?.map((e) => (
                    <li key={`${e.kind}${e.stage}`}>
                      <span className={styles.runChange}>{RUN_CHANGE[e.kind]}</span>
                      {e.only && <span className="muted"> (one ending of several)</span>}: &ldquo;{e.text}&rdquo;
                      {e.fromText && <span className={styles.runFrom}> The journal says before it: &ldquo;{e.fromText}&rdquo;</span>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="part-title">
            <h2 id="part-title" className={styles.h2}>
              {shelf ? "On the shelf" : "Part of"}
            </h2>
            <p>
              <Link href={`/quests/${line.id}`}>{line.name}</Link>
              {" "}
              <span className="muted">
                {homeName(line.category)}, {line.quests.length} quest{line.quests.length === 1 ? "" : "s"}
                {shelf ? ", each one on its own" : ""}
              </span>
            </p>
            {(before || after) && (
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
