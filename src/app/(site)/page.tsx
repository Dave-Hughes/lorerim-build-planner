import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { HomeHero } from "@/components/home/hero";
import { YourCharacters } from "@/components/home/you";
import { RecentCharacters, NewInTheWorld, ThreeWays } from "@/components/home/sections";
import { TourOffer } from "@/components/tour/tour";
import { tourSampleId } from "@/lib/builds/sample-config";
import { searchBuilds } from "@/lib/builds/queries";
import { recentChanges } from "@/lib/changes";
import { playthroughsOn, questsOn } from "@/lib/features";
import { currentVersion } from "@/lib/rules/server";
import styles from "@/components/home/home.module.css";

export const dynamic = "force-dynamic";

const BROWSE = ["q", "tags", "race", "sort", "version", "n", "run"];
type Search = Promise<Record<string, string | string[] | undefined>>;

/**
 * The home page (WO-157): the night scene, then what's new. A new visitor gets the way in; a signed-in player gets their characters. The
 * old browse addresses (/?q=…) go to Characters.
 */
export default async function Home({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const asked = BROWSE.filter((k) => sp[k] !== undefined);
  if (asked.length) {
    const p = new URLSearchParams();
    for (const k of asked) p.set(k, String([sp[k]].flat()[0]));
    redirect(`/characters?${p.toString()}`);
  }
  const session = await auth();
  const userId = session?.user?.id;
  const [recent, changes] = await Promise.all([
    searchBuilds({ gameVersion: currentVersion().id, sort: "newest", limit: 5 }).then((r) => r.builds),
    questsOn() ? recentChanges(6) : Promise.resolve([]),
  ]);
  return (
    <>
      {/* A first visit: Tapps offers the sample build (WO-80). */}
      <TourOffer href={`/b/${tourSampleId()}`} />
      <HomeHero compact={!!userId} line={userId ? undefined : "Plan a LoreRim character from the first perk to the last quest, checked against the game's own files."}>
        {userId ? null : (
          <span className={styles.cta}>
            <Link href="/new" className="btn btn-primary btn-lg">
              Make a character
            </Link>
            <Link href="/characters" className="btn btn-lg">
              Browse characters
            </Link>
          </span>
        )}
      </HomeHero>
      <main className={styles.main}>
        <RecentCharacters builds={recent} />
        <NewInTheWorld changes={changes} />
        {userId ? <YourCharacters userId={userId} /> : <ThreeWays playthroughs={playthroughsOn()} />}
      </main>
    </>
  );
}
