import { Heart } from "@/components/build/heart";
import likeStyles from "@/components/build/like-button.module.css";
import { BuildView, type BuildTab } from "@/components/build/build-view";
import { RetiredBuild } from "@/components/build/retired-build";
import { GameDataProvider } from "@/components/game-data";
import { PlayBody, playSub } from "@/components/playthrough/play-view";
import { SignInButton } from "@/components/site-header";
import { isAdmin } from "@/lib/users/admin";
import { imageHold } from "@/lib/builds/queries";
import type { BuildRecord } from "@/lib/builds/types";
import { imageUrls, withHiddenImages } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";
import { playthroughsOn, storyOn } from "@/lib/features";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";

/**
 * One page for a build and a character (WO-116): the build page's hero, then one row of tabs. A build
 * alone has Levels and Guide; a character with a run has Play first, then Levels and Guide. `/b/<id>`
 * opens on Levels, `/p/<id>` on Play; the URL's `tab` picks another.
 */
export async function CharacterPage({
  build,
  viewerId,
  run,
  tab,
  level,
  actIndex = null,
  copy = false,
  imported = null,
}: {
  build: BuildRecord;
  viewerId: string | null;
  /** The build's run, when the viewer may see it. */
  run: PlaythroughRecord | null;
  tab: BuildTab;
  level: number;
  actIndex?: number | null;
  copy?: boolean;
  imported?: { skipped: number; dropped: string[] } | null;
}) {
  const { createdAt: _createdAt, updatedAt, featuredAt, ...rest } = build;
  void _createdAt;
  const isOwner = !!viewerId && viewerId === build.ownerId;
  const [guide, admin] = await Promise.all([getGuide(build.id, build.plan, !build.isSample), build.isSample ? false : isAdmin(viewerId)]);
  // Images waiting on an admin (WO-40) never reach the page: the cover becomes a plain hero, guide images a panel.
  // The Story is held back for launch (WO-81): its sections stay saved, but never reach the page.
  const story = storyOn();
  const docs = Object.fromEntries(Object.entries(guide).filter(([k]) => story || !k.startsWith("story")).map(([k, v]) => [k, v.doc]));
  const urls = [...(build.coverImageUrl ? [build.coverImageUrl] : []), ...Object.values(docs).flatMap((d) => [...imageUrls(d)])];
  const hold = build.isSample || !urls.length ? null : await imageHold(build.id, urls);
  const held = (src: string) => !!hold && (hold.all || hold.hidden.has(src));
  const coverHeld = !!build.coverImageUrl && held(build.coverImageUrl);
  if (!isKnownVersion(build.gameVersion)) return <RetiredBuild build={{ ...rest, updatedAt: updatedAt.toISOString() }} isOwner={isOwner} />;
  const id = build.id;
  return (
    <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
      <BuildView
        // A character's hero carries the run's name and line (WO-116); the build's own page, its own.
        build={{ ...rest, ...(run ? { name: run.name, description: run.line || rest.description } : {}), coverImageUrl: coverHeld ? null : rest.coverImageUrl, coverHeld, updatedAt: updatedAt.toISOString() }}
        isOwner={isOwner}
        signedIn={!!viewerId}
        initialLevel={level || run?.snapshot?.level || 1}
        initialTab={tab}
        signInToCopy={<SignInButton redirectTo={`/b/${id}?copy=1`} className={build.plan.videoId ? "btn" : "btn btn-primary"} label="Copy to my builds" />}
        signInToLike={
          <SignInButton
            redirectTo={`/b/${id}`}
            className={likeStyles.signIn}
            label={
              <>
                <Heart /> Like <span className={likeStyles.n}>{build.likeCount}</span>
              </>
            }
          />
        }
        autoCopy={copy}
        admin={admin ? { featured: !!featuredAt, imported } : null}
        playTab={run ? { node: <PlayBody p={run} isOwner={viewerId === run.ownerId} actIndex={actIndex} />, sub: playSub(run), here: run.snapshot?.level ?? null } : null}
        startRun={!run && isOwner && playthroughsOn() && !build.isSample ? `/b/${id}/run` : null}
        guide={hold ? Object.fromEntries(Object.entries(docs).map(([k, d]) => [k, withHiddenImages(d, held)])) : docs}
      />
    </GameDataProvider>
  );
}

/** The `tab` a URL asks for, if the page has it. */
export function tabParam(tab: string | undefined, hasRun: boolean, home: BuildTab): BuildTab {
  if (tab === "levels" || tab === "guide") return tab;
  if (tab === "play" && hasRun) return "play";
  return hasRun ? home : "levels";
}
