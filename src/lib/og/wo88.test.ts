import { describe, expect, it } from "vitest";
import { GET as sitePng } from "@/app/og/site.png/route";
import { GET as chapterPng } from "@/app/(site)/guide/[slug]/card.png/route";
import { generateMetadata as chapterMeta } from "@/app/(site)/guide/[slug]/page";
import { metadata as termsMeta } from "@/app/(site)/guide/terms/page";
import { siteMetadata } from "./metadata";
import { readGuide } from "@/lib/game-guide/guide";

/** A PNG's width and height, from its IHDR chunk. */
async function pngSize(res: Response): Promise<{ type: string | null; w: number; h: number; png: boolean }> {
  const b = Buffer.from(await res.arrayBuffer());
  return { type: res.headers.get("content-type"), png: b.subarray(1, 4).toString() === "PNG", w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
const images = (m: unknown) => JSON.stringify((m as { openGraph?: { images?: unknown } }).openGraph?.images ?? null);

describe("WO-88: link preview cards in the pixel style", () => {
  it("/og/site.png and a chapter's card.png are 1200 by 630 PNGs", async () => {
    expect(await pngSize(await sitePng())).toMatchObject({ png: true, w: 1200, h: 630 });
    const res = await chapterPng(new Request("http://x/guide/staying-alive/card.png"), { params: Promise.resolve({ slug: "staying-alive" }) });
    expect(res.status).toBe(200);
    expect(await pngSize(res)).toMatchObject({ png: true, w: 1200, h: 630 });
  }, 30_000);

  it("every chapter has its own card; a chapter page names it; /guide/terms keeps the site's", async () => {
    expect(readGuide().chapters.map((c) => c.slug)).toContain("staying-alive");
    const m = await chapterMeta({ params: Promise.resolve({ slug: "staying-alive" }) });
    expect(images(m)).toContain("/guide/staying-alive/card.png");
    expect(JSON.stringify(m.twitter)).toContain("/guide/staying-alive/card.png");
    // Terms sets no card of its own, so the root layout's (siteMetadata("./")) site card stands.
    expect(termsMeta.openGraph).toBeUndefined();
    expect(images({ ...siteMetadata("./"), ...termsMeta })).toContain("/og/site.png");
  });
});
