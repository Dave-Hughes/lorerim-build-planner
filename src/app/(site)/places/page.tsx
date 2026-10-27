import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchBox } from "@/components/search/search-box";
import { placeHref, placesData, placeType, type Place } from "@/lib/places/data";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Places", ...siteMetadata("/places", "Places") };

const href = (q: Record<string, string | undefined>) => {
  const p = new URLSearchParams(Object.entries(q).filter((e): e is [string, string] => !!e[1]));
  return p.size ? `/places?${p}` : "/places";
};
/** A type's name in the plural: the records' own location types ("Cave", "NordicRuin"), said as words. */
const plural = (type: string) => {
  const w = placeType(type).toLowerCase();
  return w.endsWith("y") ? `${w.slice(0, -1)}ies` : w.endsWith("s") || w.endsWith("h") ? `${w}es` : `${w}s`;
};

/** Places (WO-154): the holds as compact sections (a few notable places, "all N"), and a filter by the records' location types. */
export default async function PlacesPage({ searchParams }: { searchParams: Promise<{ q?: string; hold?: string; type?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100).trim();
  if (q) redirect(`/search?q=${encodeURIComponent(q)}`);
  const places = placesData().places;
  const types = [...places.reduce((m, p) => m.set(p.type, (m.get(p.type) ?? 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
  const type = types.find(([t]) => t === sp.type)?.[0];
  const holdsAll = [...places.reduce((m, p) => m.set(p.hold ?? "Elsewhere", [...(m.get(p.hold ?? "Elsewhere") ?? []), p]), new Map<string, Place[]>())].sort(([a], [b]) => (a === "Elsewhere" ? 1 : b === "Elsewhere" ? -1 : a.localeCompare(b)));
  const hold = holdsAll.find(([h]) => h === sp.hold)?.[0];
  const listing = !!(type || hold);
  const pool = places.filter((p) => (!type || p.type === type) && (!hold || (p.hold ?? "Elsewhere") === hold));
  // Notable: the places quests go to, then the ones worth the most to clear.
  const notable = (ps: Place[]) => [...ps].sort((a, b) => (b.quests?.length ?? 0) - (a.quests?.length ?? 0) || b.clearXp - a.clearXp || a.name.localeCompare(b.name)).slice(0, 4);

  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.top}>
        <h1 className={`title ${styles.h1}`}>Places</h1>
        <SearchBox placeholder="Search places, people, quests" />
      </div>

      <div className={styles.chips} aria-label="Kinds of place">
        <Link href={href({ hold })} className={`${styles.chip} ${!type ? styles.chipOn : ""}`}>
          All kinds
        </Link>
        {types.map(([t, n]) => (
          <Link key={t} href={href({ type: t, hold })} className={`${styles.chip} ${type === t ? styles.chipOn : ""}`}>
            {placeType(t)} <small>{n}</small>
          </Link>
        ))}
      </div>

      {listing ? (
        <section className={styles.sec} aria-labelledby="list">
          <div className={styles.shead}>
            <h2 id="list" className={styles.h2}>
              {type ? `All ${plural(type)}` : "All places"}
              {hold ? ` in ${hold}` : ""}
            </h2>
            <span className={styles.cnt}>{pool.length}</span>
          </div>
          {[...pool]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => (
              <div key={p.id} className={styles.qrow}>
                <Link href={placeHref(p.name) ?? "/places"}>{p.name}</Link>
                <span>{[placeType(p.type), p.hold].filter(Boolean).join(", ")}</span>
              </div>
            ))}
        </section>
      ) : (
        <div className={styles.groupGrid}>
          {holdsAll.map(([h, ps]) => (
            <section key={h} className={styles.group} aria-labelledby={`h-${h}`}>
              <div className={styles.groupHead}>
                <h2 id={`h-${h}`}>{h}</h2>
                <span>{ps.length} places</span>
              </div>
              <div className={styles.few}>
                {notable(ps).map((p) => (
                  <span key={p.id}>
                    <Link href={placeHref(p.name) ?? "/places"}>{p.name}</Link>
                    <small>{placeType(p.type)}</small>
                  </span>
                ))}
              </div>
              <Link href={href({ hold: h })} className={styles.all}>
                All {ps.length} ›
              </Link>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
