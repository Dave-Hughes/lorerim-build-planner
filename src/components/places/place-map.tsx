import { MapView } from "./map-view";
import { placeMap } from "@/lib/places/map";
import Link from "next/link";
import { placeLabel, placeSlug, type Place } from "@/lib/places/data";
import { ShotGallery } from "@/components/screenshots/shot-gallery";
import { SignInButton } from "@/components/site-header";
import { pageShots } from "@/lib/screenshots/view";
import s from "./place-map.module.css";

/**
 * A place's band (WO-167, WO-184 Part 1): under the title and tags, full width, the lead screenshot beside the map cut around the place with its pin
 * large and orange, then the strip of every screenshot, then Getting there. A place inside a town takes the town's pin and says "In <town>"; a place with
 * no position, or on a map that isn't cleared, has no map, and the screenshot spot stands alone.
 */
export async function PlaceMapBand({ place }: { place: Place }) {
  const m = placeMap(place);
  const slug = placeSlug(place);
  const data = await pageShots("place", slug);
  const back = `/places/${slug}`;
  const map = m ? <MapView entry={m.entry} pins={m.around} here={m.here} hereLabel={m.inTown ? `In ${m.inTown}` : undefined} labelled={6} mode="band" /> : null;
  return (
    <section aria-label={m ? "Map" : "Screenshots"} className={s.band}>
      <ShotGallery
        kind="place"
        pageKey={slug}
        name={placeLabel(place)}
        data={data}
        layout="band"
        map={map}
        signInEmpty={<SignInButton redirectTo={back} className="btn btn-sm" label="Sign in to add a screenshot" />}
        signInStrip={<SignInButton redirectTo={back} className={s.signAdd} label="+ Sign in to add a screenshot" />}
      />
      {m && (
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
      )}
    </section>
  );
}
