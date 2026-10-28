/**
 * A character's pronouns (WO-179): the editor said "About her" and the page "Where is she in your game?" of a character with none set. The
 * character's own are used, and "them" when none is set.
 */
export type Pronoun = "she" | "he" | "they";

export const PRONOUNS: { key: Pronoun; label: string }[] = [
  { key: "she", label: "She / her" },
  { key: "he", label: "He / him" },
  { key: "they", label: "They / them" },
];

export interface Pro {
  subject: string;
  object: string;
  possessive: string;
  /** "is" or "are", agreeing with the subject. */
  be: string;
}

export function pro(p: Pronoun | null | undefined): Pro {
  if (p === "she") return { subject: "she", object: "her", possessive: "her", be: "is" };
  if (p === "he") return { subject: "he", object: "him", possessive: "his", be: "is" };
  return { subject: "they", object: "them", possessive: "their", be: "are" };
}
