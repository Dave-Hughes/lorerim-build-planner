"use client";

import { useEffect, useRef, useState } from "react";
import { saveBuildPlan } from "@/lib/builds/actions";
import type { BuildPlan } from "@/lib/rules/types";

export type SaveStatus = "saved" | "saving" | "unsaved" | "failed";

/** Saves the plan a moment after it stops changing. */
export function useAutosave(buildId: string, plan: BuildPlan, initial: BuildPlan) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const last = useRef(initial);
  const inFlight = useRef<Promise<void> | null>(null);
  const latest = useRef(plan);

  useEffect(() => {
    latest.current = plan;
    if (plan === last.current) return;
    setStatus("unsaved");
    const t = setTimeout(async () => {
      if (inFlight.current) await inFlight.current;
      const toSave = latest.current;
      if (toSave === last.current) return;
      setStatus("saving");
      inFlight.current = (async () => {
        const r = await saveBuildPlan(buildId, toSave);
        if (r.ok) {
          last.current = toSave;
          setError(null);
          setStatus(latest.current === toSave ? "saved" : "unsaved");
        } else {
          setError(r.error);
          setStatus("failed");
        }
      })();
      await inFlight.current;
      inFlight.current = null;
    }, 800);
    return () => clearTimeout(t);
  }, [buildId, plan, tick]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (status === "saved") return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [status]);

  return { status, error, retry: () => setTick((t) => t + 1) };
}
