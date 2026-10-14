import type { Metadata } from "next";
import { FaqView } from "@/components/faq/faq-view";
import { faqJsonLd, readFaq } from "@/lib/faq/faq";

/**
 * The FAQ (WO-63): the gameplay questions players ask most, from content/faq/gameplay.md, rendered
 * at build time. Install and performance sections come later on the same page.
 */
export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the gameplay questions LoreRim players ask most, for LoreRim 5.0.4.8.",
};

export default function FaqPage() {
  const faq = readFaq("gameplay");
  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)).replace(/</g, "\\u003c") }} />
      <FaqView faq={faq} />
    </main>
  );
}
