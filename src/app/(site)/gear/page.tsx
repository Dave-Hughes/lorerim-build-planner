import type { Metadata } from "next";
import Link from "next/link";
import { GearControls } from "@/components/gear/gear-controls";
import { GearTypeIcon, PluginName, Station, num } from "@/components/gear/gear-bits";
import { gearData } from "@/lib/gear/data";
import { KINDS, PAGE_SIZE, SORTS, gearHref, parseGearQuery, queryGear, type GearQuery, type GearRow } from "@/lib/gear/query";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/gear/gear.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Gear", ...siteMetadata("/gear", "Gear") };

type Search = Promise<Record<string, string | string[] | undefined>>;

/** The item's page, remembering the list it came from for the back link. */
function itemHref(row: GearRow, from: string): string {
  return `/gear/${row.slug}${from ? `?from=${encodeURIComponent(from)}` : ""}`;
}

/** The Gear page (WO-92): every indexed item, by tab and type, filtered and sorted on the server. */
export default async function GearPage({ searchParams }: { searchParams: Search }) {
  const asked = parseGearQuery(await searchParams);
  const { items, recipes } = gearData();
  const { rows, total, page, pages, counts, types, type } = queryGear(items, recipes, asked);
  const g: GearQuery = { ...asked, type, page };
  const from = gearHref(g).replace(/^\/gear\??/, "");
  const sortLabel = SORTS[g.kind].find((s) => s.sort === g.sort)!.label;
  const first = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(total, page * PAGE_SIZE);
  const what = g.kind === "armor" ? "pieces" : g.kind === "weapon" ? "weapons" : "kinds of ammo";
  const statCols = g.kind === "armor" ? (["armor", "weight"] as const) : g.kind === "weapon" ? (["damage", "weight"] as const) : (["damage"] as const);
  const colLabel = { armor: "Armor", damage: "Damage", weight: "Weight" };
  const arrow = (k: string) => (g.sort === k ? (k === "weight" ? " ↑" : " ↓") : "");
  const statLine = (r: GearRow) =>
    statCols
      .filter((k) => r[k])
      .map((k) => `${num(r[k])} ${k}`)
      .join(", ");

  return (
    <main className={`page ${styles.main}`}>
      <h1 className={`title ${styles.h1}`}>Gear</h1>
      <nav aria-label="Kind" className={styles.tabs}>
        {KINDS.map((k) => (
          <Link key={k.kind} href={gearHref({ kind: k.kind })} aria-current={k.kind === g.kind ? "page" : undefined} className={styles.tab}>
            {k.label} <small>{counts[k.kind].toLocaleString("en-US")}</small>
          </Link>
        ))}
      </nav>
      <GearControls query={g} types={types} sortLabel={sortLabel} />
      <div className={styles.countLine}>
        <span>
          {total.toLocaleString("en-US")} {total === 1 ? what.replace(/s$/, "").replace("kinds of ammo", "kind of ammo") : what}
        </span>
        {total > PAGE_SIZE && (
          <span className={styles.wide}>
            {first} to {last}
          </span>
        )}
      </div>

      {total === 0 ? (
        <p className="muted">Nothing matches.</p>
      ) : (
        <>
          <div className={`frame ${styles.tableFrame}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.iconCol}>
                    <span className="sr-only">Type</span>
                  </th>
                  <th>Name</th>
                  {statCols.map((k) => (
                    <th key={k} className={`${styles.numCol} ${g.sort === k ? styles.sorted : ""}`} aria-sort={g.sort === k ? (k === "weight" ? "ascending" : "descending") : undefined}>
                      {colLabel[k]}
                      {arrow(k)}
                    </th>
                  ))}
                  <th>Plugin</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.iconCol}>
                      <GearTypeIcon kind={r.kind} type={r.type} />
                    </td>
                    <td>
                      <Link href={itemHref(r, from)} className={styles.name}>
                        {r.name}
                      </Link>
                      {r.text && <span className={styles.text}>{r.text}</span>}
                    </td>
                    {statCols.map((k) => (
                      <td key={k} className={styles.numCol}>
                        {num(r[k])}
                      </td>
                    ))}
                    <td className={styles.plugin}>
                      <PluginName plugin={r.plugin} />
                    </td>
                    <td>{r.station ? <Station name={r.station} /> : <span className={styles.unknown}>Not listed</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* A phone (GearPhone): name over a stat line, the station after a bar. */}
          <ul className={styles.list} aria-label="Gear">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={itemHref(r, from)} className={styles.item}>
                  <GearTypeIcon kind={r.kind} type={r.type} />
                  <span className={styles.itemName}>{r.name}</span>
                  <span aria-hidden="true" />
                  <span className={styles.itemStats}>
                    {statLine(r)}
                    {r.station && <span className={styles.itemStation}> | {r.station}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className={styles.pager}>
          <span>
            Page {page} of {pages}
          </span>
          {page > 1 ? (
            <Link href={gearHref({ ...g, page: page - 1 })} className="btn" aria-label="Previous page">
              ‹
            </Link>
          ) : (
            <span className={`btn ${styles.off}`} aria-hidden="true">
              ‹
            </span>
          )}
          {page < pages ? (
            <Link href={gearHref({ ...g, page: page + 1 })} className="btn" aria-label="Next page">
              ›
            </Link>
          ) : (
            <span className={`btn ${styles.off}`} aria-hidden="true">
              ›
            </span>
          )}
        </nav>
      )}
    </main>
  );
}
