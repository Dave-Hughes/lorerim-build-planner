import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allChanges } from "@/lib/changes";
import { questsOn } from "@/lib/features";
import { formatDate } from "@/lib/format/date";
import styles from "@/components/home/home.module.css";

export const metadata: Metadata = { title: "Everything that changed" };
export const dynamic = "force-dynamic";

const KINDS = [
  { key: "", label: "Everything" },
  { key: "quest", label: "Quests" },
  { key: "line", label: "Quest lines" },
  { key: "report", label: "Player reports" },
] as const;

/**
 * Every change the home page's "New in the world" draws from, newest first, a day at a time (WO-161): the newest day open, older days folded
 * with their counts, and a filter by kind at the top.
 */
export default async function Changes({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  if (!questsOn()) notFound();
  const kind = (await searchParams).kind ?? "";
  const every = await allChanges();
  const all = KINDS.some((k) => k.key === kind && k.key) ? every.filter((c) => c.kind === kind) : every;
  const days = [...new Set(all.map((c) => c.date))];
  return (
    <main className={`page ${styles.sec}`} style={{ paddingTop: 48, paddingBottom: 80, gap: 32 }}>
      <h1 className="title">Everything that changed</h1>
      <nav aria-label="Filter by kind" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {KINDS.map((k) => {
          const on = k.key === (KINDS.some((x) => x.key === kind) ? kind : "");
          const n = k.key ? every.filter((c) => c.kind === k.key).length : every.length;
          return (
            <Link key={k.key} href={k.key ? `/changes?kind=${k.key}` : "/changes"} aria-current={on ? "page" : undefined} className={on ? "btn btn-sm btn-primary" : "btn btn-sm"}>
              {k.label} <span style={{ opacity: 0.7 }}>{n}</span>
            </Link>
          );
        })}
      </nav>
      {days.length === 0 ? <p className="muted">Nothing yet.</p> : null}
      {days.map((d, i) => {
        const rows = all.filter((c) => c.date === d);
        return (
          <details key={d} open={i === 0} className={styles.day}>
            <summary className={styles.daySum}>
              <h2 className={styles.h2} style={{ fontSize: 24, margin: 0 }}>
                {formatDate(`${d}T12:00:00Z`)}
              </h2>
              <span className={styles.dayCount}>
                {rows.length} change{rows.length === 1 ? "" : "s"}
              </span>
            </summary>
            {rows.map((c) => (
              <div key={`${c.kind}-${c.href}`} className={styles.u} style={{ gridTemplateColumns: "32px minmax(0, 1fr)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.px} src={`/icons/${c.icon}.svg`} alt="" width={32} height={32} />
                <span>
                  <Link href={c.href}>{c.name}</Link>
                  <span className={styles.what}>{c.what}</span>
                </span>
              </div>
            ))}
          </details>
        );
      })}
    </main>
  );
}
