/**
 * @-mentions of game things in the guide. A chip stores only { kind, id }; its name,
 * icon and text are looked up in the build's own LoreRim version every time it is
 * drawn, so chips stay right when the game data is rebuilt.
 */
import { itemById, loadedItems, searchItems, type GameItem } from "@/lib/items/items";
import { perkText, type GameData } from "@/lib/rules/data";

export const MENTION_KINDS = ["perk", "destiny", "skill", "trait", "birthsign", "stone", "race", "item"] as const;
export type MentionKind = (typeof MENTION_KINDS)[number];

export type MentionIcon = { type: "skill" | "sign" | "race"; name: string } | { type: "trait"; image: string | null } | { type: "none" };

export interface MentionInfo {
  kind: MentionKind;
  id: string;
  name: string;
  /** "Perk, Block", "Destiny perk", "Trait", ... */
  kindLabel: string;
  icon: MentionIcon;
  /** The game's own words, when it has any. */
  text: string;
}

const plain = (s: string) => s.replace(/<([^<>]*)>/g, "$1");

/** What a chip whose thing no longer exists shows: the name it was given (items), else the name part of its id. */
export function mentionFallbackLabel(id: string, label?: string | null): string {
  if (label) return label;
  return id.includes(":") ? id.split(":").slice(1).join(":") : id;
}

/** An item from the index as a mention: the chip shows its name; the card its type, stats and the game's text. */
export function itemMention(i: GameItem): MentionInfo {
  return { kind: "item", id: i.id, name: i.name, kindLabel: i.stats, icon: { type: "none" }, text: i.text ?? "" };
}

export function resolveMention(d: GameData, kind: string, id: string): MentionInfo | null {
  switch (kind) {
    case "perk":
    case "destiny": {
      const p = d.perkById.get(id);
      if (!p || (kind === "destiny") !== (p.tree === "Destiny")) return null;
      const t = perkText(p, 0);
      return {
        kind,
        id,
        name: p.name,
        kindLabel: kind === "destiny" ? "Destiny perk" : `Perk, ${p.tree}`,
        icon: { type: "skill", name: p.tree },
        text: [t.text, t.effect].filter(Boolean).join(" "),
      };
    }
    case "skill":
      return d.skills.includes(id) ? { kind, id, name: id, kindLabel: "Skill", icon: { type: "skill", name: id }, text: "" } : null;
    case "trait": {
      const t = d.traitByName.get(id);
      return t ? { kind, id, name: t.name, kindLabel: "Trait", icon: { type: "trait", image: t.image }, text: plain(t.text) } : null;
    }
    case "birthsign": {
      const s = d.signByName.get(id);
      return s ? { kind, id, name: `The ${s.name}`, kindLabel: "Birthsign", icon: { type: "sign", name: s.name }, text: s.text } : null;
    }
    case "stone": {
      const s = d.stoneByName.get(id);
      return s ? { kind, id, name: `The ${s.name} Stone`, kindLabel: "Standing stone", icon: { type: "sign", name: s.name }, text: s.text } : null;
    }
    case "race": {
      const r = d.raceByName.get(id);
      return r
        ? { kind, id, name: r.name, kindLabel: "Race", icon: { type: "race", name: r.name }, text: `+15 ${r.primary}. +10 ${r.secondary.join(", ")}.` }
        : null;
    }
    case "item": {
      // Only once the version's items are fetched (see useItems).
      const i = itemById(d.version.id, id);
      return i ? itemMention(i) : null;
    }
    default:
      return null;
  }
}

/** Everything that can be mentioned in a version, built once per version. */
const indexes = new WeakMap<GameData, MentionInfo[]>();
function index(d: GameData): MentionInfo[] {
  const hit = indexes.get(d);
  if (hit) return hit;
  const all = [
    ...d.skills.map((s) => resolveMention(d, "skill", s)),
    ...d.perks.map((p) => resolveMention(d, p.tree === "Destiny" ? "destiny" : "perk", p.id)),
    ...d.traits.map((t) => resolveMention(d, "trait", t.name)),
    ...d.birthsigns.map((b) => resolveMention(d, "birthsign", b.name)),
    ...d.stones.map((s) => resolveMention(d, "stone", s.name)),
    ...d.races.map((r) => resolveMention(d, "race", r.name)),
  ].filter((x): x is MentionInfo => !!x);
  indexes.set(d, all);
  return all;
}

/**
 * The @ search: names that start with the query first, then names that contain it; game things
 * before items of the same rank, and items only once they are fetched. At most `limit`.
 */
export function searchMentions(d: GameData, query: string, limit = 8): MentionInfo[] {
  const q = query.trim().toLowerCase();
  const all = index(d);
  if (!q) return all.filter((m) => m.kind === "skill").slice(0, limit);
  const name = (m: MentionInfo) => m.name.toLowerCase().replace(/^the /, "");
  const starts = all.filter((m) => name(m).startsWith(q) || m.name.toLowerCase().startsWith(q));
  const contains = all.filter((m) => !starts.includes(m) && m.name.toLowerCase().includes(q));
  const items = searchItems(loadedItems(d.version.id) ?? [], q, limit);
  const itemStarts = items.filter((i) => i.name.toLowerCase().startsWith(q));
  const itemRest = items.filter((i) => !itemStarts.includes(i));
  return [...starts, ...itemStarts.map(itemMention), ...contains, ...itemRest.map(itemMention)].slice(0, limit);
}
