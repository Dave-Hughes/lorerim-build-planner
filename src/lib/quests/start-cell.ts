import { capFirst } from "@/lib/pages/player-words";
import { placeOnly, vaguePlace } from "@/lib/pages/where";
import type { QuestPage } from "./reads";

/**
 * The How it starts cell of a quest's At a glance (WO-165, WO-180 Part 7b): who starts it as the headline, and under it the place, or else how in a few words. A phrase that stands alone
 * starts with a capital ("The Riverwood Trader, Riverwood", "A Dawnguard member who gives out jobs"), whatever the read wrote.
 */
export function startCell(page: Pick<QuestPage, "starts" | "canDo">): { who: string | undefined; sub: string | undefined; value: string } {
  const first = page.starts[0];
  const who = first?.who ? capFirst(first.who) : undefined;
  const place = first && !vaguePlace(first.where) ? placeOnly(first.where) : undefined;
  const sub = place ? capFirst(place) : first?.how && first.how.length <= 110 ? capFirst(first.how) : undefined;
  return { who, sub, value: who ?? page.canDo?.label ?? "Not known yet" };
}
