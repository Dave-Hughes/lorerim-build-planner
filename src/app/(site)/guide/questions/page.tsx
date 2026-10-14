import type { Metadata } from "next";
import { GuideNav } from "@/components/game-guide/guide-nav";
import { QuestionsView, type QuestionGroup } from "@/components/game-guide/questions-view";
import { TermTips } from "@/components/game-guide/term-tips";
import { guideJsonLd, readGuide, termTips } from "@/lib/game-guide/guide";
import styles from "@/components/game-guide/guide.module.css";

export const metadata: Metadata = {
  title: "All questions",
  description: "Every question in the LoreRim guide, with its answer, for LoreRim 5.0.4.8.",
};

/** All questions (WO-66): every :::ask in the guide under its chapter and section, with the filter; the FAQ's structured data. */
export default function QuestionsPage() {
  const guide = readGuide();
  const groups: QuestionGroup[] = guide.chapters.flatMap((c) =>
    c.sections
      .filter((s) => s.asks.length)
      .map((s) => ({ chapter: { slug: c.slug, number: c.number, title: c.title }, section: { id: s.id, title: s.title }, asks: s.asks })),
  );
  return (
    <main className={`page ${styles.layout}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(guide)).replace(/</g, "\\u003c") }} />
      <GuideNav chapters={guide.chapters} page="questions" />
      <QuestionsView groups={groups} total={groups.reduce((n, g) => n + g.asks.length, 0)} />
      <TermTips terms={termTips(guide)} />
    </main>
  );
}
