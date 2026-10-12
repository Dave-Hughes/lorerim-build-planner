import { siteCard } from "@/lib/og/card";
import { currentVersion, gameData } from "@/lib/rules/server";

/** The site's link-preview card (WO-33): one image for every page that isn't a build, cached for good. */
export const dynamic = "force-static";

export async function GET() {
  const v = currentVersion();
  const res = await siteCard({ version: v.id, skills: gameData(v.id)?.skills ?? [] });
  res.headers.set("cache-control", "public, max-age=31536000, immutable");
  return res;
}
