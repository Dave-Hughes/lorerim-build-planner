/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/search/search-box";
import { siteSearch } from "@/lib/search/site";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

const KIND_ICON = { Quest: "quest-side-stories", "Quest line": "quest-main-stories", Person: "quest-people", Place: "quest-travel", Character: "tab-set-up", Guide: "tab-guide" } as const;

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search", ...siteMetadata("/search", "Search") };

/** The results page (WO-154 Part 4): quests, people and places, each with what it is and why it matched. */
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").slice(0, 100).trim();
  const found = q ? await siteSearch(q, { limit: 30 }) : null;
  const groups = found
    ? ([
        ["Quests", found.quests],
        ["People", found.people],
        ["Places", found.places],
      ] as const)
    : [];
  const total = found ? found.quests.length + found.people.length + found.places.length : 0;
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.top}>
        <h1 className={`title ${styles.h1}`}>{q ? `Results for “${q}”` : "Search"}</h1>
        <SearchBox initial={q} placeholder="Search quests, people, places" />
      </div>
      {found && total === 0 && <p className={styles.plain}>Nothing matches “{q}”. Check the spelling, or try a person, a place or a word from the quest.</p>}
      {groups.map(([title, list]) =>
        list.length ? (
          <section key={title} className={styles.sec} aria-labelledby={`g-${title}`}>
            <div className={styles.shead}>
              <h2 id={`g-${title}`} className={styles.h2}>
                {title}
              </h2>
              <span className={styles.cnt}>{list.length}</span>
            </div>
            {list.map((h) => (
              <div key={h.href} className={styles.result}>
                <span className={styles.resultHead}>
                  {h.kind && <img className={styles.px} src={`/icons/${KIND_ICON[h.kind]}.svg`} alt="" width={20} height={20} />}
                  {h.kind && <span className={styles.kind}>{h.kind}</span>}
                  <Link href={h.href}>{h.name}</Link>
                </span>
                {h.note ? <span className={styles.src}>{h.note}</span> : null}
                <span className={styles.why}>{h.why}</span>
              </div>
            ))}
          </section>
        ) : null,
      )}
    </main>
  );
}
