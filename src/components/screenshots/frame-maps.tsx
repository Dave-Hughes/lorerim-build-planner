import type { ReactNode } from "react";
import { MapView } from "@/components/places/map-view";
import { placeByName, placeLabel, placeSlug, type Place } from "@/lib/places/data";
import { holdWords } from "@/lib/places/hold-words";
import { placeMap } from "@/lib/places/map";

/**
 * The map in a page's frame (WO-184 Part 8): the paper map cut around the place with its neighbours and labels, as the band was, with the way there. A place with no position, or on a map
 * that isn't cleared, has none (no Map button, never a guessed pin).
 */
export function placeFrameMap(place: Place): { node: ReactNode; there: string | null } | null {
  const m = placeMap(place);
  if (!m) return null;
  return {
    there: m.gettingThere,
    node: <MapView entry={m.entry} pins={m.around} here={m.here} hereLabel={m.inTown ? `In ${m.inTown}` : undefined} labelled={6} mode="band" framed title={placeLabel(place)} sub={place.hold ? holdWords(place.hold) : undefined} mapHref={`/map?place=${placeSlug(place)}`} />,
  };
}

/** A person's map: where they are found, when the planner knows it: the town they are placed in. */
export function personFrameMap(person: { name: string; inTown?: string | null }): ReactNode | null {
  const town = person.inTown ? placeByName(person.inTown) : null;
  if (!town) return null;
  const m = placeMap(town);
  if (!m) return null;
  return <MapView entry={m.entry} pins={m.around} here={m.here} labelled={6} mode="band" framed title={`${person.name}, in ${placeLabel(town)}`} sub={town.hold ? holdWords(town.hold) : undefined} mapHref={`/map?place=${placeSlug(town)}`} />;
}
