import fixture from "./iriel.json";
import { readPlan } from "@/lib/rules/convert";
import type { BuildPlan } from "@/lib/rules/types";
import type { GuideDoc } from "@/lib/guide/doc";

/**
 * Iriel Thornwhisper, Tapps's sample build (WO-86): a copy of staging build 7h38zdhjnu, read from its
 * build page, so the coming soon page draws her real tree, gear and level cards with the app's own
 * components and never reads production's database. To refresh it, export her build again.
 */
export const IRIEL_PLAN: BuildPlan = readPlan(fixture.plan as unknown as BuildPlan);
/** Her level notes, by `level:<n>` (a stretch's note sits at its last level). */
export const IRIEL_NOTES = fixture.notes as unknown as Record<string, GuideDoc>;
export const IRIEL_AUTHOR = { name: "Tapps", image: "/icons/tapps.svg", handle: null };
