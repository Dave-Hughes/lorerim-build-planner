/**
 * Set up's steps (WO-58): each is done, not started, or has a problem, from the same checks.
 * The step being shown is "now" on top of that, in the rail.
 */
import type { GameData } from "@/lib/rules/data";
import { TRAIT_CHOICES } from "@/lib/rules/trait-choices";
import type { BuildPlan } from "@/lib/rules/types";
import type { Step } from "./draft";

export type StepCheck = { state: "done" } | { state: "next" } | { state: "problem"; problem: string };

const more = (n: number, one: string) => `Choose ${n} more ${one}${n === 1 ? "" : "s"}`;

export function checkStep(d: GameData, plan: BuildPlan, name: string, step: Step): StepCheck {
  switch (step) {
    case "race":
      return plan.race ? { state: "done" } : { state: "next" };
    case "birthsign":
      return plan.birthsign || plan.traits.includes("Master of Destiny") ? { state: "done" } : { state: "next" };
    case "skills": {
      const majors = d.rules.majorCount - plan.majors.length;
      const minors = d.rules.minorCount - plan.minors.length;
      if (majors <= 0 && minors <= 0) return { state: "done" };
      if (!plan.majors.length && !plan.minors.length) return { state: "next" };
      return { state: "problem", problem: majors > 0 ? more(majors, "major") : more(minors, "minor") };
    }
    case "traits": {
      // No traits is valid; a trait that asks for a choice needs one.
      for (const t of plan.traits) {
        if (t === "Master of One" && !plan.masterOfOneSkill) return { state: "problem", problem: "Master of One needs a skill" };
        const c = TRAIT_CHOICES[t];
        if (c && !c.options.includes(plan.traitChoices?.[t] ?? ""))
          return { state: "problem", problem: `${t} needs ${t === "Focused Combat" || t === "Focused Magic" ? "a skill" : "a choice"}` };
      }
      return { state: "done" };
    }
    case "deity":
      // None is a choice.
      return { state: "done" };
    case "mode": {
      if (!plan.start) return { state: "next" };
      const start = d.startByName.get(plan.start);
      if (start?.options?.length && !plan.startOption) return { state: "problem", problem: `Choose a ${(start.optionLabel ?? "choice").toLowerCase()}` };
      return { state: "done" };
    }
    case "name":
      return name.trim() ? { state: "done" } : { state: "next" };
  }
}
