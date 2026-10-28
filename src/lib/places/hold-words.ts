/**
 * A hold as a sentence says it (WO-180): the nine holds of Skyrim are "Whiterun hold" (Winterhold is its own word and stays "Winterhold"), and a land
 * that is not a hold (Solstheim, Morrowind, the Alik'r Desert) is not called one.
 */
const HOLDS = new Set(["Whiterun", "Eastmarch", "The Rift", "The Reach", "Haafingar", "Hjaalmarch", "The Pale", "Falkreath"]);

export const holdWords = (hold: string): string => (HOLDS.has(hold) ? `${hold} hold` : hold);
