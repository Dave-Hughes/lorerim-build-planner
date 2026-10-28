import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import { NewPlaythrough } from "@/components/playthrough/new-playthrough";
import { playthroughsOn } from "@/lib/features";
import { myBuildChoices } from "@/lib/playthroughs/queries";
import styles from "../../home.module.css";

export const metadata: Metadata = { title: "New playthrough" };
export const dynamic = "force-dynamic";

export default async function NewPlaythroughPage() {
  if (!playthroughsOn()) notFound();
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <main className={`page ${styles.main}`}>
      <h1 className={`title ${styles.h1}`}>New playthrough</h1>
      {userId ? (
        <NewPlaythrough builds={await myBuildChoices(userId)} />
      ) : (
        <>
          <p className="muted" style={{ maxWidth: 560, margin: 0 }}>
            A playthrough plans a character&apos;s run through the game in acts, each with a goal, a place and its quests. Your save says where you stand.
          </p>
          <SignInButton redirectTo="/playthroughs/new" />
        </>
      )}
    </main>
  );
}
