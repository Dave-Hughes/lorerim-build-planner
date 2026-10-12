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
import { getBuild } from "@/lib/builds/queries";
import { buildMetadata } from "@/lib/og/metadata";
import { getGuide } from "@/lib/guide/queries";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string; copy?: string; tab?: string }>;

/** Link previews (WO-33): a listed or link-only build's own card; nothing about a private one. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata(await getBuild(id, null));
}

export default async function BuildPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { level, copy, tab }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const build = await getBuild(id, viewerId);
  if (!build) notFound();
  const { createdAt: _createdAt, updatedAt, featuredAt, ...rest } = build;
  void _createdAt;
  const isOwner = !!viewerId && viewerId === build.ownerId;
  const [guide, admin] = await Promise.all([getGuide(build.id, build.plan, !build.isSample), build.isSample ? false : isAdmin(viewerId)]);
  if (!isKnownVersion(build.gameVersion)) return <RetiredBuild build={{ ...rest, updatedAt: updatedAt.toISOString() }} isOwner={isOwner} />;
  return (
    <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
      <BuildView
        build={{ ...rest, updatedAt: updatedAt.toISOString() }}
        isOwner={isOwner}
        signedIn={!!viewerId}
        initialLevel={Number(level) || 1}
        initialTab={tab === "guide" ? "guide" : "levels"}
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
        admin={admin ? { featured: !!featuredAt } : null}
        guide={Object.fromEntries(Object.entries(guide).map(([k, v]) => [k, v.doc]))}
      />
    </GameDataProvider>
  );
}
