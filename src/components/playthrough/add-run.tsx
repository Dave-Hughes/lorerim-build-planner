"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FocusHeader } from "@/components/ui/focus-header";
import { addRun } from "@/lib/playthroughs/actions";
import { RunStep } from "./run-step";

/** Add a run to a build alone (WO-114): The run step, then the run's Play view. */
export function AddRun({ buildId, buildName, initial, startQuest }: { buildId: string; buildName: string; initial: { name: string; line: string; place: string }; startQuest: { edid: string; name: string; xp?: number } | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <FocusHeader
        context={`Add a run to ${buildName}`}
        actions={
          <Link href={`/b/${buildId}`} className="btn btn-sm">
            Cancel
          </Link>
        }
      />
      <main className="page" style={{ paddingTop: 32, paddingBottom: 72 }}>
        <RunStep
          initial={initial}
          startQuest={startQuest}
          pending={pending}
          error={error}
          onConfirm={(run) =>
            start(async () => {
              const r = await addRun(buildId, run);
              if (r.ok) router.push(`/p/${r.value.id}`);
              else setError(r.error);
            })
          }
        />
      </main>
    </>
  );
}
