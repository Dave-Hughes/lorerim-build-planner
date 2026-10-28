import { loadPlayerFacts } from "@/lib/quests/player-facts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTop, TitleBox } from "@/components/pages/page-kit";
import { CategoryRows } from "@/components/quests/category-rows";
import { categories, linesIn, searchLines } from "@/lib/quests/data";
import { categoryRow } from "@/lib/quests/line-view";
import { tableRows } from "@/lib/quests/table-rows";
import { BackButton } from "@/components/pages/back-button";
import { QuestTable } from "@/components/quests/quest-table";
import hero from "@/components/quests/category-hero.module.css";
import { siteMetadata } from "@/lib/og/metadata";
import k from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type Search = Promise<{ q?: string }>;

/** Main stories in the order most players meet them. */
const MAIN_ORDER = ["main-quest", "dragonborn", "dawnguard"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = categories().find((c) => c.slug === slug);
  return c ? { title: c.name, ...siteMetadata(`/quests/c/${c.slug}`, c.name, c.subtitle) } : {};
}

/**
 * A category (WO-160, MainStoriesPage): its lines as rows with the story's name, tags, pitch, how it starts and its XP, then its single
 * quests. Main stories is the three stories, numbered, then the mods' quests tied to them. No boxes, no Tell me more.
 */
export default async function QuestCategoryPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  await loadPlayerFacts();
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const c = categories().find((c) => c.slug === slug);
  if (!c) notFound();
  const main = c.key === "main";
  const q = (sp.q ?? "").slice(0, 100).trim();
  let lines = linesIn(c.key);
  if (q && !main) {
    const words = q.toLowerCase().split(/\s+/);
    const hits = new Set(searchLines(q, 500).map((r) => r.line.id));
    const has = (t: string | null) => !!t && words.every((w) => t.toLowerCase().includes(w));
    lines = lines.filter((l) => hits.has(l.id) || has(l.prince) || has(l.where));
  }
  // Every category but Main stories is a table (WO-163): a short banner, filters, and one sortable table.
  if (!main) {
    const sentence = c.subtitle.charAt(0).toLowerCase() + c.subtitle.slice(1);
    return (
      <main>
        <section className={hero.hero} aria-label={c.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={hero.scene} src={`/quests/${c.slug}.png`} alt="" />
          <span className={hero.fade} />
          <div className={`page ${hero.t}`}>
            <BackButton home={{ href: "/quests", label: "Quests" }} />
            <h1 className={hero.h1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={hero.px} src={`/icons/quest-${c.slug}.svg`} alt="" width={64} height={64} />
              {c.name}
            </h1>
            <p className={hero.lead}>
              {linesIn(c.key).length} {sentence}. {c.more.split(/(?<=[.!?])\s+/).slice(-1)[0]}
            </p>
          </div>
        </section>
        <div className="page" style={{ paddingTop: 30, paddingBottom: 80 }}>
          <QuestTable rows={tableRows(lines)} q={q} label={c.name} />
        </div>
      </main>
    );
  }
  const rows = lines.map((l) => categoryRow(l, c.key));
  // Main stories: the three stories this category is home to, in order; the others sit in their own category and are tied to these.
  const stories = main ? MAIN_ORDER.map((id) => rows.find((r) => r.id === id)).filter((r): r is (typeof rows)[number] => !!r) : rows.filter((r) => !r.solo);
  const solos = main ? rows.filter((r) => !MAIN_ORDER.includes(r.id)) : rows.filter((r) => r.solo);
  return (
    <main className={`page ${k.main}`}>
      <PageTop back={{ href: "/quests", label: "Quests" }} />
      <TitleBox title={c.name} />
      <p className={k.lede}>{c.subtitle}.</p>
      <p style={{ margin: 0, maxWidth: 900, fontSize: 16, color: "var(--muted)" }}>{c.more}</p>
      <CategoryRows lines={stories} solos={solos} q={q} fixed={main} open={main ? "Open the story ›" : "Open ›"} soloTitle={main ? "Tied to these stories" : "Single quests"} soloNote={main ? "Quests from LoreRim's mods that hang off the three. Each also sits in its own category." : undefined} />
    </main>
  );
}
