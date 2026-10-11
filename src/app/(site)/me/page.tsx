import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { SignInButton } from "@/components/site-header";
import { handleFor, listBuildsByOwner } from "@/lib/builds/queries";
import styles from "../home.module.css";

export const metadata: Metadata = { title: "My builds" };
export const dynamic = "force-dynamic";

export default async function MyBuilds() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return (
      <main className={`page ${styles.main}`}>
        <h1 className={`title ${styles.h1}`}>
          My builds
        </h1>
        <p className="muted">Sign in to see the builds you have made.</p>
        <SignInButton redirectTo="/me" />
      </main>
    );
  }
  const [builds, handle] = await Promise.all([listBuildsByOwner(userId), handleFor(userId)]);
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className={`title ${styles.h1}`}>
          My builds
        </h1>
        <span className={styles.headActions}>
          {handle && (
            <Link href={`/u/${handle}`} className="btn btn-sm">
              My page
            </Link>
          )}
          <Link href="/new" className="btn btn-primary btn-sm">
            New build
          </Link>
        </span>
      </div>
      {builds.length === 0 ? (
        <p className="muted">None yet.</p>
      ) : (
        <BuildGrid>
          {builds.map((b) => (
            <BuildCard key={b.id} build={b} mine />
          ))}
        </BuildGrid>
      )}
    </main>
  );
}
