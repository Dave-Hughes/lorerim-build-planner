/**
 * How a person's quests are counted in a sentence (WO-177): "She gives 9 quests, and is in 3 more." / "He is in 2 quests." / "Aela gives 1 quest."
 * The subject says its own verbs ("They give", "They are"); a name or he or she takes the singular. The lede used to lower-case the heading's
 * count words and got "She in 2 quests".
 */
const quests = (n: number) => `${n} quest${n === 1 ? "" : "s"}`;

export function questCountSentence(subject: string, gives: number, total: number): string {
  if (total <= 0) return "";
  const many = subject === "They";
  const is = many ? "are" : "is";
  if (gives > 0) {
    const also = total - gives;
    return `${subject} ${many ? "give" : "gives"} ${quests(gives)}${also ? `, and ${is} in ${also} more` : ""}.`;
  }
  return `${subject} ${is} in ${quests(total)}.`;
}
