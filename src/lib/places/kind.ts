import type { Place } from "./data";

/**
 * Which page a place gets (WO-162): a place people live in, a smaller one for an inn, temple or hall inside a town, or a dangerous place.
 * From the data: a place whose actors aren't hostile is lived in; failing that, a town or settlement with no creature or bandit living
 * there is; a lived-in place that sits inside a town (`inTown`) is the smaller page; anything else is dangerous (a cave, a ruin, a fort,
 * a lair, a town that bandits hold).
 */
export type PlaceKind = "town" | "inside" | "dangerous";

const TOWN_TYPES = new Set(["Town", "Settlement"]);
/** A place people live whatever walks the path to it: the Greybeards' High Hrothgar (a ruling in overrides.json). */
const HOME_TYPES = new Set(["Monastery"]);

export function placeKind(p: Pick<Place, "type" | "inTown" | "actors">): PlaceKind {
  const lived = p.actors?.hostile === false || HOME_TYPES.has(p.type) || (TOWN_TYPES.has(p.type) && !p.actors?.livesHere);
  if (!lived) return "dangerous";
  return p.inTown ? "inside" : "town";
}
