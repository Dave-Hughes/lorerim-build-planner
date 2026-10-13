import { emptyLevel } from "@/lib/rules/derive";
import type { BuildPlan } from "@/lib/rules/types";
import { currentVersion } from "@/lib/rules/versions";
import type { BuildDetails } from "./validate";

/** Deity got its own step in WO-58, after Traits. Old links and drafts keep their step keys. */
export const STEPS = ["race", "birthsign", "skills", "traits", "deity", "mode", "name"] as const;
export type Step = (typeof STEPS)[number];

export const STEP_NAMES: Record<Step, string> = {
  race: "Race",
  birthsign: "Birthsign",
  skills: "Skills",
  traits: "Traits",
  deity: "Deity",
  mode: "Mode and start",
  // The step key stays "name" so saved drafts keep working (WO-36).
  name: "Details",
};

export interface Draft {
  details: BuildDetails;
  plan: BuildPlan;
  step: Step;
}

/** A blank plan, for the current LoreRim version unless another is given. */
export function emptyPlan(gameVersion: string = currentVersion().id): BuildPlan {
  return {
    schema: 1,
    gameVersion,
    race: "",
    birthsign: "",
    mode: "Naaktiid",
    deity: "",
    start: "",
    majors: [],
    minors: [],
    traits: [],
    levels: [emptyLevel()],
    gear: [],
    notes: "",
  };
}

export function emptyDetails(): BuildDetails {
  return { name: "", description: "", coverImageUrl: "", writeupUrl: "", visibility: "unlisted", tags: null };
}

export const DRAFT_KEY = "lorerim-build-planner-draft-v1";

/** Reads the in-progress new build from this browser, if any. Never throws. */
export function loadDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<Draft>;
    if (!d || typeof d !== "object" || !d.plan || !d.details) return null;
    return { details: { ...emptyDetails(), ...d.details }, plan: { ...emptyPlan(), ...d.plan }, step: STEPS.includes(d.step as Step) ? (d.step as Step) : "race" };
  } catch {
    return null;
  }
}

export function saveDraft(d: Draft): boolean {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to clear.
  }
}
