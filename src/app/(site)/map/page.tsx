import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPage, type MapInitial } from "@/components/map/map-page";
import { progressTracking, questsOn } from "@/lib/features";
import { mapPlaces, stopsRoute } from "@/lib/map/data";
import { PLACE_GROUPS } from "@/lib/places/groups";
import { mapEntry } from "@/lib/places/map";
import { siteMetadata } from "@/lib/og/metadata";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Map", ...siteMetadata("/map", "Map", "Every place, on the game's own map") };

type Search = Promise<{ place?: string; quest?: string; character?: string; types?: string; quests?: string; stops?: string; route?: string; z?: string; x?: string; y?: string }>;

const num = (s: string | undefined) => (s !== undefined && s !== "" && Number.isFinite(Number(s)) ? Number(s) : null);

/**
 * The Map page (WO-169): LoreRim's own paper map under the header with every place on it, a search, filters, the places of a quest in order, a
 * place's drawer, and, signed in, where a character stands. The address keeps the view: what you see is what a link shares.
 */
export default async function MapRoute({ searchParams }: { searchParams: Search }) {
  if (!questsOn()) notFound();
  const entry = mapEntry();
  if (!entry) notFound();
  const sp = await searchParams;
  const places = mapPlaces();
  const slugs = new Set(places.map((p) => p.slug));
  const initial: MapInitial = {
    place: sp.place && slugs.has(sp.place) ? sp.place : null,
    quest: sp.quest ? sp.quest.slice(0, 120) : null,
    character: sp.character && progressTracking() ? sp.character.slice(0, 20) : null,
    types: (sp.types ?? "").split(",").filter((t) => PLACE_GROUPS.some((g) => g.key === t)),
    onlyQuests: sp.quests === "1",
    stops: sp.stops ? stopsRoute(sp.stops.split(",").map((x) => x.trim()), sp.route || "Her route") : null,
    zoom: num(sp.z),
    x: num(sp.x),
    y: num(sp.y),
  };
  return <MapPage entry={entry} places={places} initial={initial} />;
}
