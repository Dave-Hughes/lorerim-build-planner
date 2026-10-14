import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterView } from "@/components/game-guide/chapter-view";
import { GuideNav } from "@/components/game-guide/guide-nav";
import { chapterBySlug, readGuide } from "@/lib/game-guide/guide";
import styles from "@/components/game-guide/guide.module.css";

type Params = Promise<{ slug: string }>;

/** Built at build time from content/guide (WO-66): a broken file fails the build. */
export const dynamicParams = false;
export function generateStaticParams() {
  return readGuide().chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = chapterBySlug((await params).slug);
  if (!c) return {};
  return { title: { absolute: `${c.title} | LoreRim Guide` }, description: c.subtitle };
}

export default async function ChapterPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { chapters } = readGuide();
  const i = chapters.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  return (
    <main className={`page ${styles.layout}`}>
      <GuideNav chapters={chapters} current={slug} />
      <ChapterView chapter={chapters[i]} prev={chapters[i - 1]} next={chapters[i + 1]} />
    </main>
  );
}
