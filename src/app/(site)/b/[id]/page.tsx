import type { Metadata } from "next";
import { Heart } from "@/components/build/heart";
import likeStyles from "@/components/build/like-button.module.css";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BuildView } from "@/components/build/build-view";
import { RetiredBuild } from "@/components/build/retired-build";
import { GameDataProvider } from "@/components/game-data";
import { SignInButton } from "@/components/site-header";
import { isAdmin } from "@/lib/users/admin";
import { getBuild, imageHold } from "@/lib/builds/queries";
import { imageUrls, withHiddenImages } from "@/lib/guide/doc";
import { buildMetadata } from "@/lib/og/metadata";
import { getGuide } from "@/lib/guide/queries";
import { storyOn } from "@/lib/features";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string; copy?: string; tab?: string; imported?: string; skipped?: string; dropped?: string }>;

/** Link previews (WO-33): a listed or link-only build's own card; nothing about a private one. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata(await getBuild(id, null));
}

export default async function BuildPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { level, copy, tab, imported, skipped, dropped }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const build = await getBuild(id, viewerId);
  if (!build) notFound();
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
  return (
    <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
      <BuildView
        build={{ ...rest, coverImageUrl: coverHeld ? null : rest.coverImageUrl, coverHeld, updatedAt: updatedAt.toISOString() }}
        isOwner={isOwner}
        signedIn={!!viewerId}
        initialLevel={Number(level) || 1}
        initialTab={tab === "guide" || (tab === "story" && story) ? tab : "levels"}
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
        autoCopy={copy === "1"}
        admin={
          admin
            ? {
                featured: !!featuredAt,
                // Just imported (WO-90): its id, for SAMPLE_BUILD_ID, and what didn't come across.
                imported: imported === "1" ? { skipped: Number(skipped) || 0, dropped: dropped ? dropped.split(",").filter(Boolean) : [] } : null,
              }
            : null
        }
        guide={hold ? Object.fromEntries(Object.entries(docs).map(([k, d]) => [k, withHiddenImages(d, held)])) : docs}
      />
    </GameDataProvider>
  );
}
