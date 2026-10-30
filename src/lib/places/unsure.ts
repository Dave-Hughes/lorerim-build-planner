import { afterWar, hasLevels, isGarrison, rangeOf, type Place } from "./data";
import { placeKind } from "./kind";
import type { Unsure } from "@/lib/pages/unsure";

/**
 * What a place's page is not sure of (WO-154, WO-180 Part 5b): what is in the boss chest, and how dangerous a dangerous place is when its levels
 * are not known. One place for it, so the page and Help fill the gaps (WO-184) say the same lines.
 */
export function placeUnsure(place: Place): Unsure[] {
  const a = place.actors;
  const war = a?.hostile === false ? null : afterWar(a);
  const garrison = isGarrison(a) && !!war;
  const levels = garrison ? war!.range : hasLevels(a) && a.hostile !== false ? rangeOf(a!) : null;
  const realm = !place.pos && !place.inTown && !!place.gettingThere;
  const dangerUnsure = !levels && a?.hostile !== false && !realm && placeKind(place) === "dangerous";
  return [...(place.worthGoingFor?.bossChest ? [{ field: "what's in the boss chest" }] : []), ...(dangerUnsure ? [{ field: "how dangerous it is" }] : [])];
}
