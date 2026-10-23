/* eslint-disable @next/next/no-img-element */
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryList, type CardLine } from "@/components/quests/category-list";
import { categories, gateOf, homeName, linesIn, mainOrder, searchLines } from "@/lib/quests/data";
import { andList, checkedLine } from "@/lib/quests/words";
import { storyOfLine } from "@/lib/quests/stories-data";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/quests/quests.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type Search = Promise<{ q?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = categories().find((c) => c.slug === slug);
  return c ? { title: c.name, ...siteMetadata(`/quests/c/${c.slug}`, c.name, c.subtitle) } : {};
}

/** A category (WO-100, QuestCategory): its cover, filters and a card for each line in it. */
export default async function QuestCategoryPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  await loadPlayerFacts();
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const c = categories().find((c) => c.slug === slug);
  if (!c) notFound();
  const q = (sp.q ?? "").slice(0, 100).trim();
  let lines = linesIn(c.key);
  if (q) {
    const words = q.toLowerCase().split(/\s+/);
    const hits = new Set(searchLines(q, 500).map((r) => r.line.id));
    const has = (t: string | null) => !!t && words.every((w) => t.toLowerCase().includes(w));
    lines = lines.filter((l) => hits.has(l.id) || has(l.prince) || has(l.where));
  }
  const cards: CardLine[] = lines.map((l) => ({
    ...gateOf(l),
    name: l.name,
    prince: l.prince,
    where: l.where,
    sources: l.sources,
    also: [l.category, ...l.also].filter((k) => k !== c.key).length ? `Also in ${andList([l.category, ...l.also].filter((k) => k !== c.key).map(homeName))}` : "",
    begins: l.begins,
    quoted: l.beginsFrom === "opening",
    start: l.start,
    gate: l.gate,
    size: l.size,
    quests: l.quests.length,
    checked: checkedLine(l.checked),
    ...(storyOfLine(l.id) ? { story: { id: storyOfLine(l.id)!.id, name: storyOfLine(l.id)!.name } } : {}),
  }));
  return (
    <main className={`page ${styles.main} ${styles.inner}`}>
      <Link href="/quests" className={styles.back}>
        ‹ Quests
      </Link>
      <div className={`frame ${styles.cover}`}>
        <img src={`/quests/${c.slug}.png`} alt="" className={styles.coverArt} />
        <span className={styles.coverFade} aria-hidden="true" />
        <div className={styles.coverWords}>
          <span className={styles.coverName}>
            <img className={styles.px} src={`/icons/quest-${c.slug}.svg`} alt="" width={48} height={48} />
            <h1 className={`title ${styles.coverTitle}`}>{c.name}</h1>
          </span>
          <span className={styles.coverSub}>{c.subtitle}</span>
          <span className={styles.coverMore}>{c.more}</span>
        </div>
      </div>
      <CategoryList lines={cards} main={mainOrder().map((m) => m.edid)} q={q} />
    </main>
  );
}
