"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EditBar } from "@/components/editor/edit-bar";
import type { BuildVisibility } from "@/lib/builds/validate";
import { addRun } from "@/lib/playthroughs/actions";
import { FIRST_ACT, startObjective } from "@/lib/playthroughs/validate";
import styles from "./plan-run.module.css";

/**
 * The Playthrough tab of a character with no run yet (WO-159): what a playthrough is, in one line, and Plan a playthrough, which makes
 * the run as the Start a run page does (Act I from the start the character chose, the start's quest as its first objective) and opens it.
 */
export function PlanRun({
  buildId,
  name,
  visibility,
  initial,
  startQuest,
}: {
  buildId: string;
  name: string;
  visibility: BuildVisibility;
  initial: { name: string; line: string; place: string };
  startQuest: { edid: string; name: string; xp?: number } | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const plan = () =>
    start(async () => {
      const r = await addRun(buildId, {
        name: initial.name,
        line: initial.line.slice(0, 140),
        act: { ...FIRST_ACT, place: initial.place, goal: "" },
        objectives: startQuest ? [startObjective(startQuest)] : [],
      });
      if (r.ok) router.push(`/p/${r.value.id}/edit/play`);
      else setError(r.error);
    });
  return (
    <>
      <EditBar buildId={buildId} name={name} current="play" visibility={visibility} />
      <main className={`page ${styles.main}`}>
        <h1 className={`title ${styles.h1}`}>Playthrough</h1>
        <p className={styles.line}>A playthrough plans this character&apos;s run through the game in acts, each with a goal, a place and its quests. Your save says where you stand.</p>
        <span className={styles.row}>
          <button type="button" className="btn btn-primary" disabled={pending} onClick={plan}>
            Plan a playthrough
          </button>
          {error && (
            <span role="alert" className="field-error">
              {error}
            </span>
          )}
        </span>
        {/* What one looks like (WO-164): a sample act, faded, so the sentence above isn't all there is. */}
        <section className={styles.sample} aria-label="A sample act, faded">
          <div className={styles.sampleAct}>
            <h2 className={styles.sampleName}>Act I: Helgen to Riverwood</h2>
            <span className={styles.sampleWhere}>Levels 1 to 5 | Riverwood</span>
            <ul className={styles.sampleList}>
              <li>Escape Helgen with your life</li>
              <li>Take the road to Riverwood and meet Alvor</li>
              <li>Reach level 5 with Destruction at 25</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
