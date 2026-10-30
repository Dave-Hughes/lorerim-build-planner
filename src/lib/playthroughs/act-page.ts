import "server-only";
import { mapPlaceNamed } from "@/lib/map/data";
import { linkNames, type Piece } from "@/lib/pages/link-names";
import { linkable } from "@/lib/pages/names";
import { placeByName, placeHrefOf, placeLabel, placesData, placeType, hasLevels, rangeOf, type Place } from "@/lib/places/data";
import { actTowns, placesNear } from "@/lib/places/suggest";
import { suggestFrom } from "@/lib/mcp/playthroughs";
import type { PlaythroughRecord } from "./queries";
import { byStop, type ActView, type ObjectiveView } from "./view";

/**
 * An act as the Playthrough tab draws it (WO-181 Part 2): the At a glance band, the steps with the names in them linked, each at its stop on
 * the route, the stops as pins with where each is on the paper map, and what is also nearby. Worked out on the server; the page only draws it.
 */

/** A piece of a sentence: plain, or a link to a person (orange), a place (teal) or a quest. */
export interface Bit {
  text: string;
  href?: string;
  kind?: "person" | "place" | "quest";
}

export interface StepData {
  id: number;
  bits: Bit[];
  why: Bit[];
  /** "Follower" or "Quest line", from the objective's link. */
  chip: string | null;
  /** The stop's number: shared by the steps at that stop; none for "On the road". */
  no: number | null;
  suggested: boolean;
  /** Ticked: only read while progress tracking is on (WO-181 Part 3). */
  done: boolean;
  /** The save's word, which can't be ticked away. */
  fromSave: boolean;
}

export interface StopData {
  no: number;
  /** As the act says it. */
  place: string;
  href: string | null;
  slug: string | null;
  /** Where on the paper map, in pixels of its texture; null when the planner has no position for it. */
  px: number | null;
  py: number | null;
  by: "foot" | "carriage";
  steps: number;
}

export interface NearbyData {
  kind: "quest" | "place";
  name: string;
  href: string;
  note: string;
}

export interface ActPageData {
  n: string;
  name: string;
  count: number;
  levels: string;
  where: string;
  whereSub: string;
  withHer: { name: string; href: string | null }[];
  intro: string;
  throughout: string | null;
  /** The places she leaves alone on purpose (rule 20), in one muted line: "Geirmund's Hall (not her fight yet)". */
  passedBy: string | null;
  steps: StepData[];
  stops: StopData[];
  /** Route stops with no position on the map: said under it, never guessed. */
  notOnMap: string[];
  nearby: NearbyData[];
  /** "Open on the map ›": the Map page with these stops shown. */
  mapHref: string | null;
}

const kindOf = (href: string): Bit["kind"] => (href.startsWith("/people/") ? "person" : href.startsWith("/places/") ? "place" : href.startsWith("/quests/") ? "quest" : undefined);

/** A sentence with the people and places it names turned into links, as the quest pages do. */
export function bitsOf(text: string): Bit[] {
  return linkNames(text, linkable()).map((p: Piece) => (p.href ? { text: p.text, href: p.href, kind: kindOf(p.href) } : { text: p.text }));
}

const key = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

function placeOfLink(o: ObjectiveView): Place | null {
  return o.link?.kind === "place" ? (placesData().places.find((x) => x.id === o.link!.id) ?? null) : null;
}

/** The whole text of an objective linked to the thing it names; otherwise the names in it. */
function stepBits(o: ObjectiveView): Bit[] {
  const place = placeOfLink(o);
  const href = place ? placeHrefOf(place) : (o.linkShown?.href ?? null);
  if (href && o.linkShown) return [{ text: o.text, href, kind: kindOf(href) ?? "quest" }];
  return bitsOf(o.text);
}

function chipOf(o: ObjectiveView): string | null {
  return o.link?.kind === "follower" ? "Follower" : o.link?.kind === "line" ? "Quest line" : null;
}

function levelsOf(a: ActView): string {
  return a.levels;
}

export function actPage(run: PlaythroughRecord, act: ActView, owner: boolean, opts: { nearby?: boolean } = {}): ActPageData {
  const shown = act.objectives.filter((o) => owner || o.worked.shown !== "suggested");
  const route = act.route ?? [];
  // The stops: the act's route, or with none the places its objectives link, in order (as far as the planner knows them).
  const own = route.map((r) => {
    const hit = mapPlaceNamed(r.place);
    const base = placeByName(r.place);
    return { place: r.place, by: r.by === "carriage" ? ("carriage" as const) : ("foot" as const), hit, href: base ? placeHrefOf(base) : null };
  });
  const derived: typeof own = [];
  if (!route.length) {
    const seen = new Set<string>();
    for (const o of shown) {
      const p = placeOfLink(o);
      if (!p) continue;
      const hit = mapPlaceNamed(placeLabel(p));
      const k = hit?.slug ?? p.id;
      if (seen.has(k)) continue;
      seen.add(k);
      derived.push({ place: placeLabel(p), by: "foot", hit, href: placeHrefOf(p) });
    }
  }
  const all = route.length ? own : derived;
  // A step's stop: its route stop, or with no route the place its objective links.
  const stopNo = (o: ObjectiveView): number | null => {
    if (route.length) {
      const at = o.stop ? route.findIndex((r) => key(r.place) === key(o.stop!)) : -1;
      return at >= 0 ? at + 1 : null;
    }
    const p = placeOfLink(o);
    if (!p) return null;
    const at = derived.findIndex((d) => d.href === placeHrefOf(p));
    return at >= 0 ? at + 1 : null;
  };
  const ordered = route.length ? byStop(route, shown).flatMap((g) => g.objectives) : shown;
  const steps: StepData[] = ordered.map((o) => ({
    id: o.id,
    bits: stepBits(o),
    why: o.why ? bitsOf(o.why) : [],
    chip: chipOf(o),
    no: stopNo(o),
    suggested: o.worked.shown === "suggested",
    done: o.worked.done,
    fromSave: o.worked.shown === "save",
  }));
  const stops: StopData[] = all.map((s, i) => ({
    no: i + 1,
    place: s.place,
    href: s.href,
    slug: s.hit?.slug ?? null,
    px: s.hit?.px ?? null,
    py: s.hit?.py ?? null,
    by: s.by,
    steps: steps.filter((x) => x.no === i + 1).length,
  }));
  const placed = stops.filter((s) => s.slug);
  const notOnMap = stops.filter((s) => !s.slug).map((s) => s.place);

  // Where it takes her: the first stop, "to" the last when they differ; the stops between in the small line.
  const names = all.map((s) => s.place);
  const first = names[0] ?? act.place;
  const last = names.length > 1 ? names[names.length - 1] : null;
  const between = names.slice(1, -1);
  const where = last && key(last) !== key(first) ? `${first} to ${last}` : first;
  const whereSub = between.length ? `By ${between.length === 1 ? between[0] : `${between.slice(0, -1).join(", ")} and ${between[between.length - 1]}`}` : "";

  const withHer: ActPageData["withHer"] = [];
  for (const o of shown) {
    if (o.link?.kind !== "follower" || !o.linkShown) continue;
    if (!withHer.some((w) => w.name === o.linkShown!.name)) withHer.push({ name: o.linkShown.name, href: o.linkShown.href });
  }

  return {
    n: act.n,
    name: act.name,
    count: shown.filter((o) => o.accepted || owner).length,
    levels: levelsOf(act),
    where,
    whereSub,
    withHer,
    intro: act.goal,
    throughout: act.standingRule ?? null,
    passedBy: act.passedBy?.length ? act.passedBy.map((b) => (b.why ? `${b.place} (${b.why})` : b.place)).join("; ") : null,
    steps,
    stops,
    notOnMap,
    nearby: opts.nearby === false ? [] : nearby(run, act),
    mapHref: placed.length ? `/map?stops=${placed.map((s) => s.slug).join(",")}&route=${encodeURIComponent(`${run.name}, Act ${act.n}`)}` : null,
  };
}

/**
 * Also nearby, "Quests and places on her route": up to six quests that start at a stop and places within a short walk of one; nothing already in
 * the act, nothing the character won't do, nothing above the act's top level (suggest_quests' own checks), nothing she passes by on purpose.
 */
export function nearby(run: PlaythroughRecord, act: ActView): NearbyData[] {
  try {
    const top = act.levelTo ?? act.levelFrom + 10;
    const stops = (act.route ?? []).map((r) => r.place);
    const where = stops.length ? stops : [act.place].filter(Boolean);
    const inAct = new Set(act.objectives.map((o) => key(o.text)));
    const inActLinks = new Set(act.objectives.flatMap((o) => [o.link?.id, o.detect?.quest].filter((x): x is string => !!x)));
    const told = { never: run.never ?? undefined, level: top };
    const out: NearbyData[] = [];
    const seen = new Set<string>();
    for (const w of where.slice(0, 6)) {
      const r = suggestFrom("", { level: top, where: w }, told);
      for (const s of r.suggestions) {
        const href = s.link.replace(/^https?:\/\/[^/]*/, "");
        if (seen.has(href) || inAct.has(key(s.name)) || inAct.has(key(s.firstQuest)) || inActLinks.has(s.line.toLowerCase().replace(/\s+/g, "-"))) continue;
        seen.add(href);
        const start = String(s.start ?? "").split(/(?<=[.!?])\s/)[0];
        out.push({ kind: "quest", name: s.name, href, note: `Starts at ${w}${start ? `. ${start}` : ""}`.slice(0, 160) });
        if (out.length >= 6) return out;
      }
    }
    // Places a short walk from a stop, that fit the act's levels and that the act doesn't already use.
    const towns = actTowns([act], 0, where);
    const used = {
      linked: act.objectives.flatMap((o) => (o.link?.kind === "place" ? [{ place: placeOfLink(o)?.name ?? "", act: act.name, type: "", town: null }] : [])),
      passedBy: (act.passedBy ?? []).map((b) => ({ place: b.place, act: act.name, why: b.why })),
    };
    const near = towns.length ? placesNear(towns, act.levelFrom, act.levelTo, used, 24) : [];
    for (const p of near) {
      if (out.length >= 6) break;
      if (p.alreadyInThePlaythrough || (p.when && p.when !== "fits now")) continue;
      const place = placeByName(p.place);
      if (!place || (place.nearestTown && place.nearestTown.km > 2)) continue;
      const href = placeHrefOf(place);
      if (seen.has(href) || inAct.has(key(place.name))) continue;
      seen.add(href);
      const levels = hasLevels(place.actors) ? `Level ${rangeOf(place.actors)[0]} to ${rangeOf(place.actors)[1]}` : null;
      out.push({ kind: "place", name: placeLabel(place), href, note: [placeType(place.type), levels, place.nearestTown ? `near ${place.nearestTown.town}` : null].filter(Boolean).join(", ") });
    }
    return out.slice(0, 6);
  } catch {
    return [];
  }
}
