import { buildCard, siteCard } from "@/lib/og/card";
import { getBuild, imageHold } from "@/lib/builds/queries";

type Params = Promise<{ id: string }>;

/**
 * A build's link-preview card (WO-33). The page's tags put `?v=<updatedAt>` on the URL, so an edit
 * gives a new image and this one can be cached for good. A private build has none (its page shows
 * the site's card); one with no cover gets the site's card with its name.
 */
export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const build = await getBuild(id, null);
  if (!build || build.visibility === "private") return new Response("Not found", { status: 404 });
  // A cover waiting on an admin (WO-40) isn't drawn; that card is cached only briefly.
  const hold = build.coverImageUrl ? await imageHold(build.id, [build.coverImageUrl]) : null;
  const coverHeld = !!hold && (hold.all || hold.hidden.size > 0);
  const res = build.coverImageUrl && !coverHeld
    ? await buildCard({
        name: build.name,
        description: build.description,
        cover: build.coverImageUrl,
        focus: build.plan.coverFocus,
        race: build.plan.race,
        birthsign: build.plan.traits.includes("Master of Destiny") ? "" : build.plan.birthsign,
        mode: build.plan.mode,
        author: build.author.name,
        levels: build.plan.levels.length,
        version: build.gameVersion,
        video: !!build.plan.videoId,
      })
    : await siteCard({ title: build.name, version: build.gameVersion, video: !!build.plan.videoId });
  res.headers.set("cache-control", coverHeld ? "public, max-age=300" : "public, max-age=31536000, immutable");
  return res;
}
