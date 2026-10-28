/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { mapPlaces } from "@/lib/map/data";
import { mapEntry } from "@/lib/places/map";
import c from "./map-strip.module.css";

/**
 * The map strip (WO-170): full width, the paper map drifting slowly behind, a few city and town pins pulsing, a dark fade from the left under
 * "Every place, on the game's own map", one line with the counts from the places index (never typed), and Open the map. It is an instance of
 * the map, so it carries the credit and link its author asked for, in the corner, as every map does.
 */
export function MapStrip() {
  const entry = mapEntry();
  if (!entry) return null;
  const places = mapPlaces();
  const [x0, y0, x1, y1] = entry.border;
  const towns = places.filter((p) => p.kind === "city" || p.kind === "town").length;
  const danger = places.filter((p) => p.kind === "danger").length;
  // A few capitals and towns in the middle band of the map, where the strip looks: as a share of the picture.
  const pins = places
    .filter((p) => p.kind === "city" || p.kind === "town")
    .map((p) => ({ p, left: ((p.px - x0) / (x1 - x0)) * 100, top: ((p.py - y0) / (y1 - y0)) * 100 }))
    .filter((x) => x.top > 30 && x.top < 72 && x.left > 22 && x.left < 96)
    .sort((a, b) => (a.p.kind === "city" ? 0 : 1) - (b.p.kind === "city" ? 0 : 1) || a.left - b.left)
    .slice(0, 7);
  return (
    <section className={c.strip} aria-labelledby="map-strip">
      <div className={c.map} aria-hidden="true">
        <img className={c.picture} src={entry.image.url} alt="" width={entry.image.width} height={entry.image.height} />
        {pins.map(({ p, left, top }, i) => (
          <i key={p.slug} className={`${c.pin} ${p.kind === "city" ? c.city : ""}`} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${-i * 0.7}s` }} />
        ))}
      </div>
      <div className={c.fade} />
      <div className={`page ${c.text}`}>
        <h2 id="map-strip" className={c.h2}>
          Every place, on the game&apos;s own map
        </h2>
        <p className={c.p}>
          {places.length} places are pinned on it, from {towns} towns and cities to {danger} that are worth a fight. Search them, filter them by danger, and follow a quest from one to the next.
        </p>
        <Link href="/map" className="btn btn-primary btn-lg">
          Open the map
        </Link>
      </div>
      {/* The credit its author asked for, on every instance of the map. */}
      <a className={c.credit} href={entry.credit.url} target="_blank" rel="noreferrer">
        Map: {entry.credit.text} <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
