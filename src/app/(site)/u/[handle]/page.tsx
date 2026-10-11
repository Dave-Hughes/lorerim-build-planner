import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { Avatar } from "@/components/ui/avatar";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { getPlayerByHandle, listListedBuildsByOwner } from "@/lib/builds/queries";
import styles from "./player.module.css";

type Params = Promise<{ handle: string }>;

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

/** A player's public page: their listed builds, the same for every visitor (the owner too). */
export default async function PlayerPage({ params }: { params: Params }) {
  const [{ handle }, session] = await Promise.all([params, auth()]);
  const player = await getPlayerByHandle(handle);
  if (!player) notFound();
  const builds = await listListedBuildsByOwner(player.id);
  const isOwner = session?.user?.id === player.id;
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <div className={styles.who}>
          <Avatar name={player.name} image={player.image} size={56} />
          <div className={styles.whoText}>
            <h1 className={`title ${styles.h1}`}>{player.name}</h1>
            <p className={styles.count}>
              {builds.length} build{builds.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {isOwner && <CopyLinkButton path={`/u/${player.handle}`} />}
      </div>
      {builds.length === 0 ? (
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
      )}
    </main>
  );
}
