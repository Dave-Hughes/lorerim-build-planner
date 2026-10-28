import { MapView } from "./map-view";
import { placeMap } from "@/lib/places/map";
import Link from "next/link";
import { placeSlug, type Place } from "@/lib/places/data";
import s from "./place-map.module.css";

/**
 * A place's map band (WO-167): under the title and tags, full width, the map cut around the place with its pin large and orange, the places
 * around it, then Getting there. A place inside a town takes the town's pin and says "In <town>"; a place with no position, or on a map that
 * isn't cleared, gets nothing at all, not an empty box.
 */
export function PlaceMapBand({ place }: { place: Place }) {
  const m = placeMap(place);
  if (!m) return null;
  return (
    <section aria-label="Map" className={s.band}>
      <MapView entry={m.entry} pins={m.around} here={m.here} hereLabel={m.inTown ? `In ${m.inTown}` : undefined} labelled={6} mode="band" />
      <div className={`page ${s.there}`}>
        {m.gettingThere && (
          <>
            <h2 className={s.h2}>Getting there</h2>
            <p className={s.p}>{m.gettingThere}</p>
          </>
        )}
        {/* The whole map, opened on this place (WO-169). */}
        <Link href={`/map?place=${placeSlug(place)}`} className={s.onMap}>
          Open on the map ›
        </Link>
      </div>
    </section>
  );
}
