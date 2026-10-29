import { questHref } from "@/lib/quests/slugs";
import "server-only";
import { gearData } from "@/lib/gear/data";
import { itemSlug } from "@/lib/gear/query";
import { placeLabel, placesData, placeType, type Place } from "@/lib/places/data";
import { peopleData, personBySlug, roleWords, type Person } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { questsData } from "@/lib/quests/data";
import type { GameData } from "@/lib/rules/data";
import type { LinkKind, ObjectiveLink } from "./types";
import { holdWords } from "@/lib/places/hold-words";

/**
 * What an objective can link to (WO-111): the planner's quests, quest lines, followers (a line in
 * the Followers category), spells and items. A link stores only { kind, id }; its name and page are
 * looked up here every time, so links stay right when the game data is rebuilt.
 */

export const LINK_TAGS: Record<LinkKind, string> = { quest: "Quest", line: "Quest line", spell: "Spell", item: "Item", follower: "Follower", place: "Place", person: "Person" };

export interface Linkable {
  kind: LinkKind;
  id: string;
  name: string;
  /** "Quest, Dark Brotherhood", "Follower", "Spell, Destruction": the menu's second column. */
  where: string;
  href: string | null;
}

/** "Mine, by Riverwood": a place's second column in the @ menu. */
const placeLinkWhere = (p: Place) => [placeType(p.type), p.nearestTown ? `by ${p.nearestTown.town}` : p.hold ? `${holdWords(p.hold)}` : null].filter(Boolean).join(", ");

let placeIndex: Linkable[] | null = null;
/** Every place in the places index (WO-128), once per server. */
export function placeLinkables(): Linkable[] {
  placeIndex ??= placesData().places.map((p) => ({ kind: "place" as const, id: p.id, name: placeLabel(p), where: placeLinkWhere(p), href: null }));
  return placeIndex;
}

/** "Innkeeper, Windhelm": a person's second column in the @ menu. */
const personLinkWhere = (p: Person) => {
  const role = p.read?.role ? p.read.role.split(";")[0].trim() : roleWords(p.role);
  return [role ? `${role.charAt(0).toUpperCase()}${role.slice(1)}` : "Person", p.inTown].filter(Boolean).join(", ");
};

/** Someone a player asks about (the people pages' own rule): a follower, a spouse, a seller, a trainer, an innkeeper or a quest giver, or one with a read. */
const asked = (p: Person) => !!(p.read || p.follower || p.marriage || p.sells || p.trainer || p.innkeeper || questsOf(p.name).length > 0);

let personIndex: Linkable[] | null = null;
/** Everyone the people pages answer for, once per server (WO-179): "Keerava" is offered the way a place is. A follower is already a follower line, so is left to it. */
export function personLinkables(): Linkable[] {
  if (personIndex) return personIndex;
  const followers = new Set(questLinkables().filter((x) => x.kind === "follower").map((x) => x.name.toLowerCase()));
  personIndex = peopleData()
    .all.filter((p) => p.name.trim() && asked(p) && !followers.has(p.name.toLowerCase()))
    .map((p) => ({ kind: "person" as const, id: p.slug, name: p.name, where: personLinkWhere(p), href: `/people/${p.slug}` }));
  return personIndex;
}

let questIndex: Linkable[] | null = null;

/** Every quest, quest line and follower, once per server. */
export function questLinkables(): Linkable[] {
  if (questIndex) return questIndex;
  const { lines, categories } = questsData();
  const out: Linkable[] = [];
  for (const l of lines) {
    const follower = l.category === "followers";
    out.push({ kind: follower ? "follower" : "line", id: l.id, name: l.name, where: follower ? "Follower" : `Quest line, ${categories[l.category]?.name ?? l.category}`, href: `/quests/${l.id}` });
    for (const q of l.quests) if (q.name) out.push({ kind: "quest", id: q.edid, name: q.name, where: `Quest, ${l.name}`, href: questHref(q.edid) ?? `/quests/${l.id}` });
  }
  questIndex = out;
  return out;
}

/** The line a quest belongs to, by the quest's edid. */
export function lineOfQuest(edid: string) {
  return questsData().lines.find((l) => l.quests.some((q) => q.edid === edid)) ?? null;
}

export function resolveLink(d: GameData, link: ObjectiveLink | null | undefined): (Linkable & { tag: string }) | null {
  if (!link) return null;
  const tag = LINK_TAGS[link.kind];
  if (link.kind === "spell") {
    const s = d.spellById.get(link.id);
    return s ? { ...link, name: s.name, where: `Spell, ${s.school}`, href: null, tag } : null;
  }
  if (link.kind === "item") {
    const i = gearData().items.find((x) => x.id === link.id);
    return i ? { ...link, name: i.name, where: "Item", href: `/gear/${itemSlug(i.id)}`, tag } : null;
  }
  if (link.kind === "place") {
    const p = placesData().places.find((x) => x.id === link.id);
    return p ? { ...link, name: placeLabel(p), where: placeLinkWhere(p), href: null, tag } : null;
  }
  if (link.kind === "person") {
    const p = personBySlug(link.id);
    return p ? { ...link, name: p.name, where: personLinkWhere(p), href: `/people/${p.slug}`, tag } : null;
  }
  const hit = questLinkables().find((x) => x.kind === link.kind && x.id === link.id);
  return hit ? { ...hit, tag } : null;
}
