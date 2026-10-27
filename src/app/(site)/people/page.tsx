import type { Metadata } from "next";
import Link from "next/link";
import { PageSearch } from "@/components/pages/page-search";
import { peopleData } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { searchEverything } from "@/lib/search/everything";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "People", ...siteMetadata("/people", "People") };

/** People (WO-154): those who give quests or have a part in one, by name, and a search over everyone the records place. */
export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").slice(0, 100).trim();
  const found = q ? searchEverything(q, 60).people : null;
  const withQuests = peopleData()
    .all.filter((p) => questsOf(p.name).length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.top}>
        <h1 className={`title ${styles.h1}`}>People</h1>
        <PageSearch placeholder="Search people, quests, places" />
      </div>
      {found ? (
        <section className={styles.sec} aria-labelledby="found">
          <div className={styles.shead}>
            <h2 id="found" className={styles.h2}>
              {found.length ? `For “${q}”` : `Nobody for “${q}”`}
            </h2>
          </div>
          {found.map((f) => (
            <div key={f.href} className={styles.qrow}>
              <Link href={f.href}>{f.name}</Link>
              <span>{f.note}</span>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.sec} aria-labelledby="all">
          <div className={styles.shead}>
            <h2 id="all" className={styles.h2}>
              People in quests
            </h2>
            <span className={styles.cnt}>{withQuests.length}</span>
          </div>
          {withQuests.map((p) => (
            <div key={p.slug} className={styles.qrow}>
              <Link href={`/people/${p.slug}`}>{p.name}</Link>
              <span>{[p.race, p.inTown].filter(Boolean).join(", ")}</span>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
