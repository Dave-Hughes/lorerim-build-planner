import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { BuildView } from "@/components/build/build-view";
import { GameDataProvider } from "@/components/game-data";
import { PlaythroughTabs, RunHero } from "@/components/playthrough/tabs";
import { SignInButton } from "@/components/site-header";
import { getBuild, imageHold } from "@/lib/builds/queries";
import { playthroughsOn, storyOn } from "@/lib/features";
import { imageUrls, withHiddenImages } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";
import { getPlaythrough } from "@/lib/playthroughs/queries";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";
import s from "@/components/playthrough/play.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string; tab?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!playthroughsOn()) return {};
  const p = await getPlaythrough((await params).id, null);
  return p ? { title: `${p.name}: the build` } : {};
}

/**
 * The character's Build tab (WO-114), as the CharacterBuildTab board: the build itself under the run's
 * cover, its ruler marking the run's level "You are here", and its Levels, Guide and Story row.
 */
export default async function RunBuildPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  if (!playthroughsOn()) notFound();
  const [{ id }, { level, tab }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const p = await getPlaythrough(id, viewerId);
  if (!p) notFound();
  if (!p.buildId) redirect(`/p/${id}`);
  const isOwner = viewerId === p.ownerId;
  const build = p.build ? await getBuild(p.build.id, viewerId) : null;
  const head = (
    <div className={`page ${s.main}`} style={{ paddingBottom: 0 }}>
      {isOwner && (
        <Link href="/me" className={s.back}>
          ‹ My characters
        </Link>
      )}
      <RunHero p={p} isOwner={isOwner} />
      <PlaythroughTabs p={p} current="build" isOwner={isOwner} />
    </div>
  );
  // A private build in a shared run: the run shows, the build doesn't.
  if (!build || !isKnownVersion(build.gameVersion))
    return (
      <>
        {head}
        <p className="page muted" style={{ padding: "32px 0 72px" }}>
          {build ? "This build is for a LoreRim version the planner no longer has." : "The build is private."}
        </p>
      </>
    );
  const guide = await getGuide(build.id, build.plan, true);
  const story = storyOn();
  const docs = Object.fromEntries(Object.entries(guide).filter(([k]) => story || !k.startsWith("story")).map(([k, v]) => [k, v.doc]));
  const urls = Object.values(docs).flatMap((d) => [...imageUrls(d)]);
  const hold = urls.length ? await imageHold(build.id, urls) : null;
  const held = (src: string) => !!hold && (hold.all || hold.hidden.has(src));
  const { createdAt: _c, updatedAt, ...rest } = build;
  void _c;
  return (
    <>
      {head}
      <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
        <BuildView
          build={{ ...rest, coverImageUrl: null, coverHeld: false, updatedAt: updatedAt.toISOString() }}
          isOwner={isOwner}
          signedIn={!!viewerId}
          initialLevel={Number(level) || p.snapshot?.level || 1}
          initialTab={tab === "guide" || tab === "story" ? tab : "levels"}
          signInToCopy={<SignInButton redirectTo={`/b/${build.id}?copy=1`} label="Copy to my builds" />}
          inRun={{ here: p.snapshot?.level ?? null }}
          taleInRun={`/p/${p.id}/tale`}
          guide={hold ? Object.fromEntries(Object.entries(docs).map(([k, d]) => [k, withHiddenImages(d, held)])) : docs}
        />
      </GameDataProvider>
    </>
  );
}
