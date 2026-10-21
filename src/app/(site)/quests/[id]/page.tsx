/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import { QuestReport } from "@/components/quests/quest-report";
import { QuestRow } from "@/components/quests/journal";
import { LineNeeds, type AfterLine } from "@/components/quests/line-start";
import { categories, categorySlug, gateOf, homeName, mainOrder, questsData } from "@/lib/quests/data";
import { MAIN } from "@/lib/quests/open";
import { storyOfLine } from "@/lib/quests/stories-data";
import { fromLabel } from "@/lib/quests/words";
import { siteMetadata } from "@/lib/og/metadata";
import type { Quest, QuestLine } from "@/lib/quests/types";
import styles from "@/components/quests/quests.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const l = questsData().byId.get(id);
  return l ? { title: l.name, ...siteMetadata(`/quests/${l.id}`, l.name, l.begins ?? homeName(l.category)) } : {};
}

const GOLD = { small: "a small purse of gold", medium: "a purse of gold", large: "a large purse of gold" } as const;

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
  // Back from signing in to report (WO-121a Part 5): the form opens where it was.
  const reporting = (await searchParams).report === "1";
  const signedIn = !!(await auth())?.user?.id;
  const { byId, categories: cats, shelves } = questsData();
  const line = byId.get(id);
  if (!line) notFound();
  const home = cats[line.category] ? categories().find((c) => c.key === line.category)! : null;
  const slug = home?.slug ?? "side-stories";
  const main = mainOrder();
  const after: AfterLine[] = line.after
    .filter((a) => a !== MAIN)
    .map((a) => byId.get(a))
    .filter((l): l is QuestLine => !!l)
    .map((l) => ({ id: l.id, name: l.name, home: homeName(l.category), where: l.where, source: l.sources.map((s) => s.name).join(", "), begins: l.begins, quoted: l.beginsFrom === "opening" }));
  const opening = line.quests.find((q) => q.edid === line.opening);
  const story = [...(opening && opening.xp > 0 ? [opening] : []), ...line.quests.filter((q) => q.xp > 0 && q !== opening)];
  const jobs = line.quests.filter((q) => q.xp === 0);
  const rewards = line.quests.filter((q) => q.rewards);
  const sibs = siblings(line);
  const checkedFrom = (k: keyof QuestLine["checked"]) => fromLabel(line.checked[k]);
  const giverFrom = line.giver?.source === "uesp" ? "UESP" : "game files";
  const waysIn = line.ways ?? (opening?.start?.checked === "files" ? opening.start.ways : undefined);
  const told = storyOfLine(line.id);
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
              How to start it
            </h2>
            <dl className={styles.who}>
              {line.giver && (
                <>
                  <dt>Who</dt>
                  <dd>
                    {line.giver.name}
                    <span className={styles.src}>{giverFrom}</span>
                  </dd>
                </>
              )}
              {line.giver?.place && (
                <>
                  <dt>Where</dt>
                  <dd>
                    {line.giver.place}
                    <span className={styles.src}>{giverFrom}</span>
                  </dd>
                </>
              )}
              {/* No one giver (WO-121): the opening quest's ways in, as the start check words them; every opening's, when the line has more than one (WO-121b). */}
              {!line.giver && !!waysIn?.length && (
                <>
                  <dt>Ways in</dt>
                  <dd>
                    <ul className={styles.waysList}>
                      {waysIn.map((w, i) => (
                        <li key={i}>{w.how}</li>
                      ))}
                    </ul>
                    <span className={styles.src}>game files</span>
                  </dd>
                </>
              )}
              {!line.giver && line.firstObjective && (
                <>
                  <dt>First step</dt>
                  <dd>
                    {line.firstObjective}
                    <span className={styles.src}>game files</span>
                  </dd>
                </>
              )}
              {line.start && (
                <>
                  <dt>How</dt>
                  <dd>
                    {line.start}
                    {checkedFrom("start") && <span className={styles.src}>{checkedFrom("start")}</span>}
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
              {checkedFrom("size") && <small>{checkedFrom("size")}</small>}
            </span>
            <span className={styles.fact}>
              <b>Enemies</b>
              <span>{line.level ?? "Not listed"}</span>
              {checkedFrom("level") && <small>{checkedFrom("level")}</small>}
            </span>
            <span className={styles.fact}>
              <b>Quest XP</b>
              <span>{line.xpTotal.toLocaleString("en-US")}</span>
              <small>{xpNote(line.quests)}</small>
            </span>
          </div>

          <section className={styles.panel} aria-labelledby="rewards-title">
            <h2 id="rewards-title" className={styles.h2}>
              Rewards
            </h2>
            {rewards.length ? (
              <>
                <span className="muted">From the game files, not checked in game</span>
                <ul className={styles.rewards}>
                  {rewards.map((q) => (
                    <li key={q.edid}>
                      <b>{q.name}</b>: {[q.rewards!.gold && GOLD[q.rewards!.gold], ...(q.rewards!.items ?? [])].filter(Boolean).join(", ")}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <span className={styles.soft}>Not listed yet.</span>
            )}
          </section>

          <section aria-labelledby="quests-title" className={styles.questsSection}>
            <span className={styles.questsHead}>
              <h2 id="quests-title" className={styles.h2}>
                Quests
              </h2>
              <span className="muted">Journals are hidden until you open them</span>
            </span>
            {story.length > 0 && (
              <div className={styles.group}>
                <div className={styles.ghead}>
                  <h3>The story</h3>
                  <span>
                    {story.length} quest{story.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className={styles.qlist}>
                  {story.map((q) => (
                    <QuestRow key={q.edid} edid={q.edid} name={q.name} xp={q.xp} first={q === opening} journal={q.journal} endings={q.endings} start={q.start} />
                  ))}
                </ul>
              </div>
            )}
            {jobs.length > 0 && (
              <div className={styles.group}>
                <div className={styles.ghead}>
                  <h3>Jobs and bounties</h3>
                  <span>
                    {jobs.length} job{jobs.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className={styles.qlist}>
                  {jobs.map((q) => (
                    <QuestRow key={q.edid} edid={q.edid} name={q.name} xp={q.xp} first={q === opening} journal={q.journal} endings={q.endings} start={q.start} />
                  ))}
                </ul>
              </div>
            )}
          </section>
          <QuestReport lineId={line.id} signedIn={signedIn} open={reporting} signIn={<SignInButton redirectTo={`/quests/${line.id}?report=1#report`} className="btn btn-sm btn-primary" label="Sign in with Discord" />} />
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
