/* eslint-disable @next/next/no-img-element */
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { QuestSearch } from "@/components/quests/quest-search";
import { categories, linesIn, questsData } from "@/lib/quests/data";
import { tableRows } from "@/lib/quests/table-rows";
import { QuestTable } from "@/components/quests/quest-table";
import { searchEverything } from "@/lib/search/everything";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/quests/quests.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quests", ...siteMetadata("/quests", "Quests") };

type Search = Promise<{ q?: string }>;

/** The Quests home (WO-100, QuestHome): search, Where you are, the six categories, and Jobs and errands. */
export default async function QuestsHome({ searchParams }: { searchParams: Search }) {
  await loadPlayerFacts();
  const q = ((await searchParams).q ?? "").slice(0, 100).trim();
  if (q) redirect(`/search?q=${encodeURIComponent(q)}`);
  const { lines } = questsData();
  const found = q ? searchEverything(q) : null;
  // Every line in every category, as the one table (WO-163), sorted by place.
  const rows = tableRows(lines);
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.homeHead}>
        <h1 className={`title ${styles.h1}`}>Quests</h1>
        <QuestSearch initial={q} />
      </div>

      {found && (
        <section aria-labelledby="results-title" className={styles.results}>
          <h2 id="results-title" className={styles.h2}>
            {found.quests.length + found.people.length + found.places.length ? `For “${q}”` : `Nothing for “${q}”`}
          </h2>
          {(
            [
              ["Quests", found.quests],
              ["People", found.people],
              ["Places", found.places],
            ] as const
          ).map(([title, list]) =>
            list.length ? (
              <div key={title}>
                <h3 className={styles.h3}>{title}</h3>
                <ul className={styles.resultList}>
                  {list.map((f) => (
                    <li key={f.href}>
                      <Link href={f.href}>{f.name}</Link>
                      {f.note && <span className="muted">{f.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </section>
      )}

      <div className={styles.cats}>
        {categories().filter((c) => c.key !== "side").map((c) => (
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
                <span className={styles.count}>
                  {linesIn(c.key).length} quest line{linesIn(c.key).length === 1 ? "" : "s"}
                </span>
                <span className={styles.go}>Browse ›</span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      <section aria-labelledby="rest-title" className={styles.rest}>
        <span className={styles.jobsHead}>
          <img className={styles.px} src="/icons/quest-side-stories.svg" alt="" width={48} height={48} />
          <span className={styles.jobsWords}>
            <h2 id="rest-title" className={styles.jobsTitle}>
              Everything else, by place
            </h2>
            <span className={styles.sub}>
              Every quest and line in every category, by the town or place it starts in. <Link href="/quests/c/side-stories">All side stories ›</Link>
            </span>
          </span>
        </span>
        <QuestTable rows={rows} across defaultSort="where" label="Every quest" />
      </section>
    </main>
  );
}
