/**
 * Link previews (WO-33): what Messages, Discord and Slack read from a page's Open Graph tags.
 * Every page shows the site's card unless it's a build anyone with the link may see.
 */
import type { Metadata } from "next";

export const SITE_NAME = "LoreRim Build Planner";
export const SITE_LINE = "Plan and share LoreRim character builds level by level.";
export const CARD = { width: 1200, height: 630 } as const;
/** The site's card, for every page that isn't a build (it never changes, so it's cached for good). */
export const SITE_CARD = { url: "/og/site.png", ...CARD, alt: SITE_NAME };

/** The tags every page carries: the site's name and card, a large-image Twitter card, its own URL. */
export function siteMetadata(path: string, title: string = SITE_NAME, description: string = SITE_LINE): Metadata {
  return {
    openGraph: { type: "website", siteName: SITE_NAME, title, description, url: path, images: [SITE_CARD] },
    twitter: { card: "summary_large_image", title, description, images: [SITE_CARD.url] },
  };
}

/** A guide chapter's tags (WO-88): its own card, at /guide/<slug>/card.png. */
export function chapterMetadata(slug: string, title: string, description: string): Metadata {
  const path = `/guide/${slug}`;
  const image = { url: `${path}/card.png`, ...CARD, alt: title };
  return {
    openGraph: { type: "article", siteName: SITE_NAME, title, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

/** What a build page needs to know for its tags. */
export interface BuildForCard {
  id: string;
  name: string;
  description: string;
  visibility: "public" | "unlisted" | "private";
  updatedAt: Date;
  gameVersion: string;
  author: { name: string };
}

/**
 * A build page's metadata. Listed and link-only builds get their own card (its URL carries
 * `updatedAt`, so an edit gives a new image); a private or missing build gets the site's card and
 * the site's name, so nothing about it shows to someone without access.
 */
export function buildMetadata(build: BuildForCard | null): Metadata {
  if (!build || build.visibility === "private") return { title: { absolute: SITE_NAME }, description: SITE_LINE, ...siteMetadata(build ? `/b/${build.id}` : "/") };
  const path = `/b/${build.id}`;
  const description = build.description || `A LoreRim ${build.gameVersion} build by ${build.author.name}.`;
  const image = { url: `${path}/card.png?v=${build.updatedAt.getTime()}`, ...CARD, alt: build.name };
  return {
    title: build.name,
    description,
    openGraph: { type: "website", siteName: SITE_NAME, title: build.name, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title: build.name, description, images: [image.url] },
  };
}

/** The site's own address: the production domain, else this deployment's (staging), else local. */
export function siteBase(): URL {
  const host = process.env.VERCEL_ENV === "production" ? process.env.VERCEL_PROJECT_PRODUCTION_URL : (process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL);
  return new URL(host ? `https://${host}` : `http://localhost:${process.env.PORT ?? 3000}`);
}
