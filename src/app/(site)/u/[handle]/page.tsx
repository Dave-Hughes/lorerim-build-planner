import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { Avatar } from "@/components/ui/avatar";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { TextTabs } from "@/components/ui/text-tabs";
import { getPlayerByHandle, listLikedBuilds, listListedBuildsByOwner } from "@/lib/builds/queries";
import styles from "./player.module.css";

type Params = Promise<{ handle: string }>;
type Search = Promise<{ tab?: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { handle } = await params;
  const player = await getPlayerByHandle(handle);
  if (!player) return { title: "Not found" };
  const builds = await listListedBuildsByOwner(player.id);
  // The social image: the newest listed build's cover, else the site's default.
  const cover = builds.find((b) => b.coverImageUrl)?.coverImageUrl;
  const title = `Builds by ${player.name}`;
  return { title, openGraph: { title, ...(cover ? { images: [cover] } : {}) }, twitter: cover ? { card: "summary_large_image", images: [cover] } : undefined };
}

/**
 * A player's public page, the same for every visitor (the owner too): their listed builds, and the
 * listed builds they have liked.
 */
export default async function PlayerPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ handle }, { tab }, session] = await Promise.all([params, searchParams, auth()]);
  const player = await getPlayerByHandle(handle);
  if (!player) notFound();
  const [builds, liked] = await Promise.all([listListedBuildsByOwner(player.id), listLikedBuilds(player.id)]);
  const isOwner = session?.user?.id === player.id;
  const buildsLabel = `${builds.length} build${builds.length === 1 ? "" : "s"}`;
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <div className={styles.who}>
          <Avatar name={player.name} image={player.image} size={56} />
          <div className={styles.whoText}>
            <h1 className={`title ${styles.h1}`}>{player.name}</h1>
            <p className={styles.count}>
              {buildsLabel} · {liked.length} liked
            </p>
          </div>
        </div>
        {isOwner && <CopyLinkButton path={`/u/${player.handle}`} />}
      </div>
      <div className={styles.sections}>
        <TextTabs
          label="Player sections"
          initial={tab}
          tabs={[
            {
              key: "builds",
              name: "Builds",
              sub: buildsLabel,
              panel:
                builds.length === 0 ? (
                  <div className={styles.empty}>
                    <p className="muted">No listed builds yet.</p>
                    {isOwner && (
                      <p className="muted">
                        Only listed builds show here. <Link href="/me">My builds</Link>
                      </p>
                    )}
                  </div>
                ) : (
                  <BuildGrid>
                    {builds.map((b) => (
                      <BuildCard key={b.id} build={b} />
                    ))}
                  </BuildGrid>
                ),
            },
            {
              key: "liked",
              name: "Liked",
              sub: `${liked.length} build${liked.length === 1 ? "" : "s"}`,
              panel:
                liked.length === 0 ? (
                  <div className={styles.empty}>
                    <p className="muted">No liked builds yet.</p>
                  </div>
                ) : (
                  <BuildGrid>
                    {liked.map((b) => (
                      <BuildCard key={b.id} build={b} likedAt={b.likedAt} />
                    ))}
                  </BuildGrid>
                ),
            },
          ]}
        />
      </div>
    </main>
  );
}
