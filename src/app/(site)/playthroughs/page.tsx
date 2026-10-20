import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaythroughCards } from "@/components/playthrough/cards";
import { playthroughsOn } from "@/lib/features";
import { listListedPlaythroughs } from "@/lib/playthroughs/queries";
import styles from "../home.module.css";

export const metadata: Metadata = { title: "Playthroughs" };
export const dynamic = "force-dynamic";

/** Listed playthroughs, newest first (WO-111). Nothing more for now. */
export default async function PlaythroughsPage() {
  if (!playthroughsOn()) notFound();
  const rows = await listListedPlaythroughs();
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className={`title ${styles.h1}`}>Playthroughs</h1>
      </div>
      {rows.length === 0 ? <p className="muted">None listed yet.</p> : <PlaythroughCards rows={rows} />}
    </main>
  );
}
