import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allChanges } from "@/lib/changes";
import { questsOn } from "@/lib/features";
import { formatDate } from "@/lib/format/date";
import styles from "@/components/home/home.module.css";

export const metadata: Metadata = { title: "Everything that changed" };
export const dynamic = "force-dynamic";

/** Every change the home page's "New in the world" draws from, newest first, a day at a time. */
export default async function Changes() {
  if (!questsOn()) notFound();
  const all = await allChanges();
  const days = [...new Set(all.map((c) => c.date))];
  return (
    <main className={`page ${styles.sec}`} style={{ paddingTop: 48, paddingBottom: 80, gap: 40 }}>
      <h1 className="title">Everything that changed</h1>
      {days.length === 0 ? <p className="muted">Nothing yet.</p> : null}
      {days.map((d) => (
        <section key={d} className={styles.sec} style={{ gap: 0 }}>
          <h2 className={styles.h2} style={{ fontSize: 24, paddingBottom: 12, borderBottom: "1px solid var(--rule-strong)" }}>
            {formatDate(`${d}T12:00:00Z`)}
          </h2>
          {all
            .filter((c) => c.date === d)
            .map((c) => (
              <div key={`${c.kind}-${c.href}`} className={styles.u} style={{ gridTemplateColumns: "32px minmax(0, 1fr)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.px} src={`/icons/${c.icon}.svg`} alt="" width={32} height={32} />
                <span>
                  <Link href={c.href}>{c.name}</Link>
                  <span className={styles.what}>{c.what}</span>
                </span>
              </div>
            ))}
        </section>
      ))}
    </main>
  );
}
