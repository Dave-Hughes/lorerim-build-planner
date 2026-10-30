/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { questsOn } from "@/lib/features";
import { gapCatalog, type Gap } from "@/lib/gaps/catalog";
import { answeredSet } from "@/lib/tips/store";
import { weekViews } from "@/lib/views/store";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "./gaps.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Help fill the gaps", ...siteMetadata("/help-fill-the-gaps", "Help fill the gaps", "What the planner isn't sure of yet, the pages players open most first.") };

const PAGE = 50;
const KINDS = [
  { id: "all", label: "All" },
  { id: "quest", label: "Quests" },
  { id: "person", label: "People" },
  { id: "place", label: "Places" },
] as const;
const ICON = { quest: "quest-side-stories", person: "quest-people", place: "quest-travel" } as const;

/**
 * Help fill the gaps (WO-184 Part 3, board HelpGaps): every quest, person and place with anything under Not sure yet, the ones players open most first. Public. "I know this" opens
 * that page at its form. How many looked is a count of page views a week with no cookie, address or account kept.
 */
export default async function HelpGaps({ searchParams }: { searchParams: Promise<{ kind?: string; n?: string }> }) {
  if (!questsOn()) notFound();
  const sp = await searchParams;
  const kind = KINDS.find((k) => k.id === sp.kind)?.id ?? "all";
  const shown = Math.min(2000, Math.max(PAGE, Math.floor(Number(sp.n)) || PAGE));
  const [catalog, views, answered] = await Promise.all([Promise.resolve(gapCatalog()), weekViews(), answeredSet()]);
  // A line an admin has taken a player's word on is no longer a gap; a page with none left is not listed.
  const all = catalog.flatMap((g) => {
    const missing = g.missing.filter((m) => !answered.has(`${g.kind}:${g.key}:${m.toLowerCase()}`));
    return missing.length ? [{ ...g, missing }] : [];
  });
  const looked = (g: Gap) => views.get(`${g.kind}:${g.key}`) ?? 0;
  const counts = { all: all.length, quest: all.filter((g) => g.kind === "quest").length, person: all.filter((g) => g.kind === "person").length, place: all.filter((g) => g.kind === "place").length };
  const list = (kind === "all" ? all : all.filter((g) => g.kind === kind)).slice().sort((a, b) => looked(b) - looked(a) || a.name.localeCompare(b.name));
  const rows = list.slice(0, shown);
  const q = (k: string, n?: number) => `/help-fill-the-gaps?${new URLSearchParams({ ...(k === "all" ? {} : { kind: k }), ...(n && n > PAGE ? { n: String(n) } : {}) }).toString()}`.replace(/\?$/, "");
  return (
    <main className={`page ${styles.main}`}>
      <h1 className="title">Help fill the gaps</h1>
      <p className={styles.lede}>What the planner isn&apos;t sure of yet, the pages players open most first. If you know one, say what you know. An admin checks it before it goes on the page, credited to your Discord name.</p>
      <div className={styles.bar}>
        <nav className={styles.chips} aria-label="Filter">
          {KINDS.map((k) => (
            <Link key={k.id} href={q(k.id)} className={`${styles.chip} ${kind === k.id ? styles.on : ""}`} aria-current={kind === k.id ? "page" : undefined}>
              {k.label} {counts[k.id].toLocaleString("en-US")}
            </Link>
          ))}
        </nav>
        <span className={styles.order}>Most looked at first</span>
      </div>
      {rows.length === 0 ? (
        <p className={styles.empty}>Nothing is unsure here.</p>
      ) : (
        <ul className={styles.list}>
          {rows.map((g) => (
            <li key={`${g.kind}:${g.key}`} className={styles.it}>
              <img className={styles.px} src={`/icons/${ICON[g.kind]}.svg`} alt="" width={24} height={24} />
              <span className={styles.nm}>
                <Link href={g.href}>{g.name}</Link>
                <small>{g.sub}</small>
              </span>
              <span className={styles.miss}>
                {g.missing.slice(0, 4).map((m) => (
                  <span key={m}>? {m}</span>
                ))}
                {g.missing.length > 4 && <span>and {g.missing.length - 4} more</span>}
              </span>
              <span className={styles.v}>{looked(g) > 0 ? `${looked(g).toLocaleString("en-US")} looked this week` : ""}</span>
              <Link className={styles.go} href={`${g.href}#know-0`}>
                I know this ›
              </Link>
            </li>
          ))}
        </ul>
      )}
      {list.length > rows.length && (
        <Link href={q(kind, shown + PAGE)} className={styles.more}>
          Show more ›
        </Link>
      )}
    </main>
  );
}
