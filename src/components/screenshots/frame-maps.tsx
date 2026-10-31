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

/**
 * A person's map: where the planner can place them (WO-184 Part 9), the town they are in or else the place of the cell they are placed in (Arch-Paladin Laracin's is Meridia's Sanctum, which
 * has a pin). Not a guess: with no place the map can show, there is no Map button.
 */
export function personFrameMap(person: { name: string; inTown?: string | null; cell?: string | null; cells?: string[] }): ReactNode | null {
  for (const name of [person.inTown, person.cell, ...(person.cells ?? [])]) {
    const place = name ? placeByName(name) : null;
    const m = place ? placeMap(place) : null;
    if (!place || !m) continue;
    return <MapView entry={m.entry} pins={m.around} here={m.here} labelled={6} mode="band" framed title={`${person.name}, in ${placeLabel(place)}`} sub={place.hold ? holdWords(place.hold) : undefined} mapHref={`/map?place=${placeSlug(place)}`} />;
  }
  return null;
}
