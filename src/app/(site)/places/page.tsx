import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchBox } from "@/components/search/search-box";
import { MapView } from "@/components/places/map-view";
import { mapPlaces } from "@/lib/map/data";
import { mapEntry, mapPins } from "@/lib/places/map";
import { PLACE_GROUPS, groupFrom, groupOf } from "@/lib/places/groups";
import { placeCounts, placeHrefOf, placeLabel, placesData, placeType, type Place } from "@/lib/places/data";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";
import { holdWords } from "@/lib/places/hold-words";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Places", ...siteMetadata("/places", "Places") };

const href = (q: Record<string, string | undefined>) => {
  const p = new URLSearchParams(Object.entries(q).filter((e): e is [string, string] => !!e[1]));
  return p.size ? `/places?${p}` : "/places";
};
/** Places (WO-154): the holds as compact sections (a few notable places, "all N"), and a filter by the records' location types. */
export default async function PlacesPage({ searchParams }: { searchParams: Promise<{ q?: string; hold?: string; type?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100).trim();
  if (q) redirect(`/search?q=${encodeURIComponent(q)}`);
  const places = placesData().places;
  // About ten kinds a player would pick, not the records' thirty-eight types (WO-167 review); an old ?type=Cave link lands on its group.
  // One count per kind, the build's own (WO-178): every place of the kind; the Map page says "on the map" for the ones it can pin.
  const counts = placeCounts().groups;
  const groups = PLACE_GROUPS.map((g) => ({ ...g, n: counts[g.key]?.all ?? 0 })).filter((g) => g.n > 0);
  const group = groupFrom(sp.type);
  const type = group?.key;
  const holdsAll = [...places.reduce((m, p) => m.set(p.hold ?? "Elsewhere", [...(m.get(p.hold ?? "Elsewhere") ?? []), p]), new Map<string, Place[]>())].sort(([a], [b]) => (a === "Elsewhere" ? 1 : b === "Elsewhere" ? -1 : a.localeCompare(b)));
  const hold = holdsAll.find(([h]) => h === sp.hold)?.[0];
  const listing = !!(type || hold);
  const pool = places.filter((p) => (!type || groupOf(p.type) === type) && (!hold || (p.hold ?? "Elsewhere") === hold));
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
        {groups.map((g) => (
          <Link key={g.key} title={`${g.n} places in all; the map draws the ones it can pin`} href={href({ type: g.key, hold })} className={`${styles.chip} ${type === g.key ? styles.chipOn : ""}`}>
            {g.label} <small>{g.n}</small>
          </Link>
        ))}
      </div>

      {/* The whole map with every pinned place, narrowed by the same kind and hold (WO-167); hover a pin for the place. */}
      {(() => {
        const entry = mapEntry();
        if (!entry) return null;
        const shown = mapPins().filter((p) => (!type || groupOf(p.type) === type) && (!hold || p.hold === hold));
        // The same number the Map page gives: every place it can pin, a place inside a town once at its town's pin.
        const onMap = mapPlaces().filter((p) => (!type || groupOf(p.type) === type) && (!hold || p.hold === hold)).length;
        return (
          <section aria-label="Map of Skyrim" className="map-section">
            <MapView entry={entry} pins={shown} mode="whole" title="Skyrim" mapHref="/map" />
            <p className="muted" style={{ margin: "8px 0 0", fontSize: 14 }}>
              {onMap} {onMap === 1 ? "place" : "places"} on the map, those inside a town counted once at the town&apos;s pin. Skyrim only: Solstheim and the mods&apos; lands have no map here yet.
            </p>
          </section>
        );
      })()}

      {listing ? (
        <section className={styles.sec} aria-labelledby="list">
          <div className={styles.shead}>
            <h2 id="list" className={styles.h2}>
              {group ? `All ${group.all}` : "All places"}
              {hold ? ` in ${hold}` : ""}
            </h2>
            <span className={styles.cnt}>{pool.length}</span>
          </div>
          {[...pool]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => (
              <div key={p.id} className={styles.qrow}>
                <Link href={placeHrefOf(p)}>{placeLabel(p)}</Link>
                <span>{[placeType(p.type), p.hold ? `${holdWords(p.hold)}` : null].filter(Boolean).join(", ")}</span>
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
                    <Link href={placeHrefOf(p)}>{placeLabel(p)}</Link>
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
