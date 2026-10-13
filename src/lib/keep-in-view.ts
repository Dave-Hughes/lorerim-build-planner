/**
 * After the keys move a listbox's highlight (WO-57), scroll the option into the list's view: a
 * starting list holds up to 50 and scrolls. Returns the index, for use inside a state setter.
 */
export function keepInView(listId: string, index: number): number {
  requestAnimationFrame(() => document.getElementById(`${listId}-${index}`)?.scrollIntoView({ block: "nearest" }));
  return index;
}
