import { playerField, playerReason } from "./player-words";

/**
 * What Information Confidence says is Not sure yet (WO-157, WO-177 Part 5), as plain data so Help fill the gaps (WO-184) lists exactly the same
 * lines the page shows: no field key, no record or file, a reason only in a player's words, one place not two, each line once.
 */
export interface Unsure {
  field: string;
  why?: string;
}

const KEY = /^[A-Za-z]+(?:\.[A-Za-z]+)+[:.]*$|^[a-z]+[A-Z][A-Za-z]*[:.]*$/;

export function cleanUnsure(unsure: Unsure[]): { fields: string[]; reasons: string[] } {
  const clean = unsure
    .filter((u) => !KEY.test(u.field.trim()))
    .map((u) => {
      const why = u.why ? playerReason(u.why) : null;
      return { field: playerField(u.field), ...(why ? { why } : {}) };
    });
  // One place is not two (WO-180 Part 6b): "Where" and "Where it takes you" are the same doubt, said once as the longer.
  const fields = [...new Set(clean.map((u) => u.field))]
    .filter((f, _, all) => !(f.toLowerCase() === "where" && all.some((g) => g.toLowerCase() === "where it takes you")))
    .map((f) => f.charAt(0).toUpperCase() + f.slice(1));
  const reasons = [...new Set(clean.filter((u) => u.why).map((u) => u.why as string))];
  return { fields, reasons };
}
