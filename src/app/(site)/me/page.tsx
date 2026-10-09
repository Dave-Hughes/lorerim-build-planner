import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { SignInButton } from "@/components/site-header";
import { listBuildsByOwner } from "@/lib/builds/queries";
import styles from "../home.module.css";

export const metadata: Metadata = { title: "My builds" };
export const dynamic = "force-dynamic";

export default async function MyBuilds() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return (
      <main className={`page ${styles.main}`}>
        <h1 className="title" style={{ fontSize: 44 }}>
          My builds
        </h1>
        <p className="muted">Sign in to see the builds you have made.</p>
        <SignInButton redirectTo="/me" />
      </main>
    );
  }
  const builds = await listBuildsByOwner(userId);
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className="title" style={{ fontSize: 44 }}>
          My builds
        </h1>
        <Link href="/new" className="btn btn-primary btn-sm">
          New build
        </Link>
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
