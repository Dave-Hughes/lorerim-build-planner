/**
 * A line a player reads never names a record and never hedges in the middle of a sentence (WO-177): "…can be shut away; the records don't show
 * when" and "(not checked yet)" are the editors' words. What is unsure comes out of the sentence and goes to Information Confidence's Not sure
 * yet, with its reason. Pure.
 */
const HEDGES: RegExp[] = [
  // "; the records don't show when", ", and the records don't show which one you get"
  /\s*[;,]?\s*(?:and\s+)?the records (?:don't|do not|doesn't|does not) (?:show|say|have|give|tell)\b[^;.()]*/gi,
  // "(not checked yet)", "(not checked yet: LoreRim's files set their chance to 0)", "(the records don't show when)"
  /\s*\((?:not checked yet|isn't checked yet|the records [^)]*)\)/gi,
  /\s*[;,]?\s*not checked yet\b[^;.()]*/gi,
];

export function playerWords(text: string): { text: string; unsure: string[] } {
  const unsure: string[] = [];
  let out = text;
  for (const re of HEDGES) {
    out = out.replace(re, (m) => {
      const clause = m.replace(/^[\s;,]+|\s*[()]\s*/g, " ").replace(/^\s*and\s+/i, "").trim();
      if (clause) unsure.push(clause.charAt(0).toUpperCase() + clause.slice(1));
      return "";
    });
  }
  return { text: out.replace(/\s+([,;.])/g, "$1").replace(/[;,]\s*$/, "").trim(), unsure };
}

/**
 * "Paarthurnax dies if you kill him (Paarthurnax)": a quest's name in brackets after a sentence that already holds the name says which quest
 * it is as "in the quest Paarthurnax"; a bracket with a name the sentence doesn't hold stays (WO-177).
 */
export function quoteQuest(text: string): string {
  return text.replace(/^([\s\S]*?)\s*\(([^()]+)\)\s*$/, (all, before: string, quest: string) => (before.toLowerCase().includes(quest.trim().toLowerCase()) ? `${before} in the quest ${quest.trim()}` : all));
}

/**
 * A sentence the reads assembled with a bracketed aside: "same job (Windhelm's own copy of it)" is said as a clause (WO-177).
 */
export function assembled(text: string): string {
  return text.replace(/\bsame job \(([^()]+?)'s own copy of it\)/gi, "it is the same job, $1's own copy");
}
