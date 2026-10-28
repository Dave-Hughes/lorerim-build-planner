/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { mapPlaces } from "@/lib/map/data";
import { placeCounts } from "@/lib/places/data";
import { mapEntry } from "@/lib/places/map";
import c from "./map-strip.module.css";

/**
 * The map strip (WO-170, WO-173): full width, the paper map, larger than the strip, panning slowly across Skyrim with its city and town pins riding on it and pulsing, a dark fade from the left under
 * "Every place, on the game's own map", one line with the counts from the places index (never typed), and Open the map. It is an instance of
 * the map, so it carries the credit and link its author asked for, in the corner, as every map does.
 */
export function MapStrip() {
  const entry = mapEntry();
  if (!entry) return null;
  const places = mapPlaces();
  const [x0, y0, x1, y1] = entry.border;
  // The towns and cities the build counts (WO-178), the same number the Map and Places pages give for the group, not every lived-in place on the map.
  const towns = placeCounts().groups.cities.onMap;
  const danger = places.filter((p) => p.kind === "danger").length;
  // The places in the band of the map the strip looks at as it pans (WO-173: the picture is 1.5 times the strip's width and goes about 400 px
  // across, so a window of it is ever in view), as a share of the picture: the cities, the towns, then places worth a fight, a few apart so the
  // rings don't pile up.
  const rank = (k: string) => (k === "city" ? 0 : k === "town" ? 1 : 2);
  const inBand = places
    .filter((p) => p.kind === "city" || p.kind === "town" || (p.kind === "danger" && p.quests > 0))
    .map((p) => ({ p, left: ((p.px - x0) / (x1 - x0)) * 100, top: ((p.py - y0) / (y1 - y0)) * 100 }))
    .filter((x) => x.top > 36 && x.top < 64 && x.left > 12 && x.left < 86)
    .sort((a, b) => rank(a.p.kind) - rank(b.p.kind) || b.p.quests - a.p.quests);
  const pins: typeof inBand = [];
  // 3% of the picture's width apart (about 65 px at the strip's size), and 11 at most.
  for (const x of inBand) if (pins.length < 11 && pins.every((q) => Math.hypot(q.left - x.left, (q.top - x.top) * 0.707) > 3)) pins.push(x);
  return (
    <section className={c.strip} aria-labelledby="map-strip">
      <div className={c.map} aria-hidden="true">
        <img className={c.picture} src={entry.image.url} alt="" width={entry.image.width} height={entry.image.height} />
        {pins.map(({ p, left, top }, i) => (
          <i key={p.slug} className={`${c.pin} ${p.kind === "city" ? c.city : ""} ${p.kind === "danger" ? c.danger : ""}`} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${-i * 0.7}s` }} />
        ))}
      </div>
      <div className={c.fade} />
      <div className={`page ${c.text}`}>
        <h2 id="map-strip" className={c.h2}>
          Every place,{" "}
          <br />
          on the game&apos;s own map
        </h2>
        <p className={c.p}>
          {places.length} places are pinned on it, from {towns} towns and cities to {danger} that are worth a fight. Search them, filter them by kind, and follow a quest from one place to the next.
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
