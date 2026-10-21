import type { BuildPlan } from "@/lib/rules/types";

/**
 * Only what changed (WO-122): the fields of `plan` that differ from `base`, the plan this page last saved or loaded,
 * written over `stored`, the build as it is now. A Set up page left open while the connector changed the start, then
 * used to change the mode, writes the mode and leaves the connector's start alone. A field is a whole top-level part of
 * the plan (the start, the majors, the levels), so two changes to the same part still meet: the later one wins.
 */
export function mergeChanged(stored: BuildPlan, base: BuildPlan, plan: BuildPlan): BuildPlan {
  const out = { ...stored } as Record<string, unknown>;
  const before = base as unknown as Record<string, unknown>;
  const after = plan as unknown as Record<string, unknown>;
  for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (JSON.stringify(before[k]) === JSON.stringify(after[k])) continue;
    if (after[k] === undefined) delete out[k];
    else out[k] = after[k];
  }
  return out as unknown as BuildPlan;
}
