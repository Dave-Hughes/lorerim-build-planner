/**
 * A placeholder objective (WO-147 Part 2): "TEST", an empty one, or the editor's own note (a line that starts with a
 * semicolon). Skirmish at Whitewatch's first objective reads "TEST". Hidden from the pages and the door, where the quest data is read.
 */
export const isPlaceholder = (text: string | null | undefined): boolean => {
  const t = (text ?? "").trim();
  return !t || /^(test|todo|dummy|placeholder|debug)\s*[.!]?$/i.test(t) || t.startsWith(";");
};
