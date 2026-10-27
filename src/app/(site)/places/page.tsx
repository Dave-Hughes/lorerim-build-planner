import type { Metadata } from "next";
import Link from "next/link";
import { PageSearch } from "@/components/pages/page-search";
import { placeHref, placesData, placeType } from "@/lib/places/data";
import { searchEverything } from "@/lib/search/everything";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Places", ...siteMetadata("/places", "Places") };

/** Places (WO-154): every cave, ruin, fort and camp the index has, by hold, and a search. */
export default async function PlacesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").slice(0, 100).trim();
  const found = q ? searchEverything(q, 60).places : null;
  const byHold = new Map<string, ReturnType<typeof placesData>["places"]>();
  for (const p of placesData().places) byHold.set(p.hold ?? "Elsewhere", [...(byHold.get(p.hold ?? "Elsewhere") ?? []), p]);
  const holds = [...byHold.entries()].sort(([a], [b]) => (a === "Elsewhere" ? 1 : b === "Elsewhere" ? -1 : a.localeCompare(b)));
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.top}>
        <h1 className={`title ${styles.h1}`}>Places</h1>
        <PageSearch placeholder="Search places, people, quests" />
      </div>
      {found ? (
        <section className={styles.sec} aria-labelledby="found">
          <div className={styles.shead}>
            <h2 id="found" className={styles.h2}>
              {found.length ? `For “${q}”` : `No place for “${q}”`}
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
        holds.map(([hold, ps]) => (
          <section key={hold} className={styles.sec} aria-labelledby={`h-${hold}`}>
            <div className={styles.shead}>
              <h2 id={`h-${hold}`} className={styles.h2}>
                {hold}
              </h2>
              <span className={styles.cnt}>{ps.length}</span>
            </div>
            {[...ps]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((p) => (
                <div key={p.id} className={styles.qrow}>
                  <Link href={placeHref(p.name) ?? "/places"}>{p.name}</Link>
                  <span>{placeType(p.type)}</span>
                </div>
              ))}
          </section>
        ))
      )}
    </main>
  );
}
