/**
 * Traits that ask for a choice in game. The planner records it so a reader can tell, say, which
 * weapon a Focused Combat build focuses on. Options are the game's own (its trait texts).
 */
export const TRAIT_CHOICES: Record<string, { question: string; options: string[] }> = {
  "Focused Combat": { question: "Which weapon type?", options: ["One-Handed", "Two-Handed", "Marksman"] },
  "Focused Magic": { question: "Which school?", options: ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration"] },
  "Fatal Attraction": { question: "Which gender?", options: ["Male", "Female"] },
};

/** A trait as the shared page writes it: "Focused Combat: Two-Handed" once its choice is made. */
export function traitWithChoice(trait: string, choices: Record<string, string> | undefined): string {
  const c = choices?.[trait];
  return c && TRAIT_CHOICES[trait]?.options.includes(c) ? `${trait}: ${c}` : trait;
}

/** Only the choices for traits still held, with an option the trait offers. */
export function keptTraitChoices(traits: string[], choices: Record<string, string> | undefined): Record<string, string> | undefined {
  const kept = Object.entries(choices ?? {}).filter(([t, c]) => traits.includes(t) && TRAIT_CHOICES[t]?.options.includes(c));
  return kept.length ? Object.fromEntries(kept) : undefined;
}
