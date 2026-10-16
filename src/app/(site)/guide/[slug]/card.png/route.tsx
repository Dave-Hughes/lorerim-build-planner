import { guideCard } from "@/lib/og/card";
import { chapterBySlug, readGuide } from "@/lib/game-guide/guide";

type Params = Promise<{ slug: string }>;

/**
 * A guide chapter's link-preview card (WO-88), one per chapter, made at build time. Not behind the
 * site guide's switch (WO-81): it's a picture of the chapter, linked only from the chapter's own tags.
 */
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return readGuide().chapters.map((c) => ({ slug: c.slug }));
}

export async function GET(_req: Request, { params }: { params: Params }) {
  const c = chapterBySlug((await params).slug);
  if (!c) return new Response("Not found", { status: 404 });
  const res = await guideCard({ number: c.number, title: c.title, subtitle: c.subtitle, icon: c.icon });
  res.headers.set("cache-control", "public, max-age=31536000, immutable");
  return res;
}
