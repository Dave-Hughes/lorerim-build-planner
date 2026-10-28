import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { MapPage, type MapInitial } from "@/components/map/map-page";
import { playthroughsOn, questsOn } from "@/lib/features";
import { mapPlaces } from "@/lib/map/data";
import { mapEntry } from "@/lib/places/map";
import { siteMetadata } from "@/lib/og/metadata";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Map", ...siteMetadata("/map", "Map", "Every place, on the game's own map") };

type Search = Promise<{ place?: string; quest?: string; character?: string; types?: string; danger?: string; quests?: string; z?: string; x?: string; y?: string }>;

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
  const [lo, hi] = (sp.danger ?? "").split("-").map(Number);
  const initial: MapInitial = {
    place: sp.place && slugs.has(sp.place) ? sp.place : null,
    quest: sp.quest ? sp.quest.slice(0, 120) : null,
    character: sp.character ? sp.character.slice(0, 20) : null,
    types: (sp.types ?? "").split(",").filter((t) => places.some((p) => p.type === t)),
    danger: Number.isFinite(lo) && Number.isFinite(hi) && lo >= 1 && hi <= 50 && lo <= hi ? [lo, hi] : [1, 50],
    onlyQuests: sp.quests === "1",
    zoom: num(sp.z),
    x: num(sp.x),
    y: num(sp.y),
  };
  const signedIn = !!(await auth())?.user?.id && playthroughsOn();
  return <MapPage entry={entry} places={places} initial={initial} signedIn={signedIn} />;
}
