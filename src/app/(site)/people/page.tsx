import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchBox } from "@/components/search/search-box";
import { peopleData, type Person } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "People", ...siteMetadata("/people", "People") };

/**
 * What a person is to a player, from the game's own records and factions (WO-154 Part 4; design rule 10: nothing we made up): the groups
 * and how to tell who is in one.
 */
const GROUPS: { key: string; title: string; is: (p: Person) => boolean }[] = [
  { key: "followers", title: "Followers", is: (p) => !!p.follower },
  { key: "spouses", title: "Spouses", is: (p) => !!p.marriage },
  { key: "merchants", title: "Merchants", is: (p) => !!p.sells },
  { key: "trainers", title: "Trainers", is: (p) => !!p.trainer },
  { key: "innkeepers", title: "Innkeepers", is: (p) => !!p.innkeeper || p.role === "JobInnkeeper" },
  { key: "quest-givers", title: "Quest givers", is: (p) => questsOf(p.name).some((q) => q.gives) },
];

const href = (q: Record<string, string | undefined>) => {
  const p = new URLSearchParams(Object.entries(q).filter((e): e is [string, string] => !!e[1]));
  return p.size ? `/people?${p}` : "/people";
};

/** People (WO-154): the groups a player asks about, each a few names and "all N"; a group or a town opens its whole list. */
export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ q?: string; group?: string; town?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100).trim();
  if (q) redirect(`/search?q=${encodeURIComponent(q)}`);
  const all = peopleData().all.filter((p) => p.name.trim());
  const group = GROUPS.find((g) => g.key === sp.group);
  const town = sp.town?.slice(0, 60);
  const towns = [...all.reduce((m, p) => (p.inTown ? m.set(p.inTown, (m.get(p.inTown) ?? 0) + 1) : m), new Map<string, number>())].sort(([a], [b]) => a.localeCompare(b));
  const pool = all.filter((p) => (!group || group.is(p)) && (!town || p.inTown === town));
  const listing = !!(group || town);
  const members = (g: (typeof GROUPS)[number]) => all.filter(g.is).sort((a, b) => a.name.localeCompare(b.name));
  const what = (p: Person) => [p.race, p.inTown].filter(Boolean).join(", ");

  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.top}>
        <h1 className={`title ${styles.h1}`}>People</h1>
        <SearchBox placeholder="Search people, quests, places" />
      </div>

      <div className={styles.chips} aria-label="Groups">
        <Link href="/people" className={`${styles.chip} ${!listing ? styles.chipOn : ""}`}>
          All groups
        </Link>
        {GROUPS.map((g) => (
          <Link key={g.key} href={href({ group: g.key, town })} className={`${styles.chip} ${group?.key === g.key ? styles.chipOn : ""}`}>
            {g.title} <small>{all.filter(g.is).length}</small>
          </Link>
        ))}
      </div>
      <form method="get" action="/people" className={styles.chips}>
        {group && <input type="hidden" name="group" value={group.key} />}
        <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <span className="sub-label">Town</span>
          <select className="select" name="town" defaultValue={town ?? ""}>
            <option value="">Anywhere</option>
            {towns.map(([t, n]) => (
              <option key={t} value={t}>
                {t} ({n})
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn btn-sm">
          Show
        </button>
      </form>

      {listing ? (
        <section className={styles.sec} aria-labelledby="list">
          <div className={styles.shead}>
            <h2 id="list" className={styles.h2}>
              {[group?.title, town].filter(Boolean).join(" in ")}
            </h2>
            <span className={styles.cnt}>{pool.length}</span>
          </div>
          {pool
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 300)
            .map((p) => (
              <div key={p.slug} className={styles.qrow}>
                <Link href={`/people/${p.slug}`}>{p.name}</Link>
                <span>{what(p)}</span>
              </div>
            ))}
          {pool.length > 300 && <p className={styles.plain}>The first 300 of {pool.length}. Pick a town to narrow it.</p>}
        </section>
      ) : (
        <div className={styles.groupGrid}>
          {GROUPS.map((g) => {
            const list = members(g);
            // The ones with quests first: they are the people a player asks about.
            const few = [...list].sort((a, b) => questsOf(b.name).length - questsOf(a.name).length || a.name.localeCompare(b.name)).slice(0, 6);
            return (
              <section key={g.key} className={styles.group} aria-labelledby={`g-${g.key}`}>
                <div className={styles.groupHead}>
                  <h2 id={`g-${g.key}`}>{g.title}</h2>
                  <span>{list.length}</span>
                </div>
                <div className={styles.few}>
                  {few.map((p) => (
                    <span key={p.slug}>
                      <Link href={`/people/${p.slug}`}>{p.name}</Link>
                      <small>{p.inTown}</small>
                    </span>
                  ))}
                </div>
                <Link href={href({ group: g.key })} className={styles.all}>
                  All {list.length} ›
                </Link>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
