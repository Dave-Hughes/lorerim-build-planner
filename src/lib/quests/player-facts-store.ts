import type { PlayerWay } from "./player-types";

/**
 * The approved player facts (WO-146 Part 3) as questsData reads them: a plain in-memory list and a version, kept by
 * player-facts.ts. No database in here, so the quest data can read it without a cycle.
 */
export interface PlayerFact {
  id: number;
  lineId: string;
  quest: string;
  replaces: string | null;
  way: PlayerWay;
  /** "@handle, 23 Oct 2026": what comes after "a player's report, not the game files". */
  source: string;
  /** A second player saying a way already on the page is right (WO-146 Part 1b): it adds its source to that way's. */
  confirms: boolean;
}

let facts: PlayerFact[] = [];
let version = 0;

export const currentPlayerFacts = () => ({ list: facts, version });

export function setPlayerFacts(next: PlayerFact[]): void {
  if (JSON.stringify(next) === JSON.stringify(facts)) return;
  facts = next;
  version += 1;
}
