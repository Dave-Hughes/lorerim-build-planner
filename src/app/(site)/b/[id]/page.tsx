import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BuildView } from "@/components/build/build-view";
import { RetiredBuild } from "@/components/build/retired-build";
import { GameDataProvider } from "@/components/game-data";
import { SignInButton } from "@/components/site-header";
import { getBuild } from "@/lib/builds/queries";
import { formatDate } from "@/lib/format/date";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string; copy?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const build = await getBuild(id, null);
  if (!build) return { title: "Build not found" };
  return { title: build.name, description: build.description || `A LoreRim ${build.gameVersion} build by ${build.author.name}.` };
}

export default async function BuildPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { level, copy }, session] = await Promise.all([params, searchParams, auth()]);
  const viewerId = session?.user?.id ?? null;
  const build = await getBuild(id, viewerId);
  if (!build) notFound();
  const { createdAt: _createdAt, updatedAt, ...rest } = build;
  void _createdAt;
  const isOwner = !!viewerId && viewerId === build.ownerId;
  if (!isKnownVersion(build.gameVersion)) return <RetiredBuild build={{ ...rest, updatedAt: updatedAt.toISOString() }} isOwner={isOwner} />;
  return (
    <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
      <BuildView
        build={{ ...rest, updatedAt: updatedAt.toISOString() }}
        updatedLabel={formatDate(updatedAt)}
        isOwner={isOwner}
        signedIn={!!viewerId}
        initialLevel={Number(level) || 1}
        signInToCopy={<SignInButton redirectTo={`/b/${id}?copy=1`} className="btn btn-primary" label="Copy to my builds" />}
        autoCopy={copy === "1"}
      />
    </GameDataProvider>
  );
}
