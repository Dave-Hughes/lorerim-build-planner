/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { OpenCount } from "@/components/quests/open-count";
import { QuestSearch } from "@/components/quests/quest-search";
import { WherePanel } from "@/components/quests/where-panel";
import { categories, finishable, gateOf, homeName, linesIn, mainOrder, questsData, searchLines } from "@/lib/quests/data";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/quests/quests.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quests", ...siteMetadata("/quests", "Quests") };

type Search = Promise<{ q?: string }>;

/** The Quests home (WO-100, QuestHome): search, Where you are, the six categories, and Jobs and errands. */
export default async function QuestsHome({ searchParams }: { searchParams: Search }) {
  const q = ((await searchParams).q ?? "").slice(0, 100).trim();
  const { shelves, lines } = questsData();
  const main = mainOrder();
  const results = q ? searchLines(q) : [];
  const work = lines.filter((l) => l.category === "work");
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.homeHead}>
        <h1 className={`title ${styles.h1}`}>Quests</h1>
        <QuestSearch initial={q} />
      </div>

      {q && (
        <section aria-labelledby="results-title" className={styles.results}>
          <h2 id="results-title" className={styles.h2}>
            {results.length ? `${results.length} quest line${results.length === 1 ? "" : "s"} for “${q}”` : `Nothing for “${q}”`}
          </h2>
          {results.length > 0 && (
            <ul className={styles.resultList}>
              {results.map(({ line, hit }) => (
                <li key={line.id}>
                  <Link href={`/quests/${line.id}`}>{line.name}</Link>
                  <span className="muted">
                    {homeName(line.category)}
                    {hit && ` | ${hit}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <WherePanel main={main} finishable={finishable()} />

      <div className={styles.cats}>
        {categories().map((c) => (
          <Link key={c.key} href={`/quests/c/${c.slug}`} className={`frame ${styles.cat}`}>
            <img className={styles.art} src={`/quests/${c.slug}.png`} alt="" width={160} height={64} />
            <span className={styles.catBody}>
              <span className={styles.catName}>
                <img className={styles.px} src={`/icons/quest-${c.slug}.svg`} alt="" width={32} height={32} />
                <span className={styles.catTitle}>{c.name}</span>
              </span>
              <span className={styles.sub}>{c.subtitle}</span>
              <span className={styles.desc}>{c.more}</span>
              <span className={styles.catFoot}>
                <OpenCount gates={linesIn(c.key).map(gateOf)} main={main.map((m) => m.edid)} />
                <span className={styles.go}>Browse ›</span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      {shelves.work && (
        <section aria-labelledby="jobs-title" className={styles.jobs}>
          <span className={styles.jobsHead}>
            <img className={styles.px} src="/icons/quest-jobs-and-errands.svg" alt="" width={48} height={48} />
            <span className={styles.jobsWords}>
              <h2 id="jobs-title" className={styles.jobsTitle}>
                {shelves.work.name}
              </h2>
              <span className={styles.sub}>{shelves.work.subtitle}</span>
            </span>
          </span>
          <span className={styles.jobChips}>
            {work.map((l) => (
              <Link key={l.id} href={`/quests/${l.id}`} className={styles.job}>
                {l.name} <small>{l.quests.length}</small>
              </Link>
            ))}
          </span>
        </section>
      )}
    </main>
  );
}
