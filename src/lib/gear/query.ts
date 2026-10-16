/**
 * The Gear page's list (WO-92): every indexed item, filtered, sorted and paged on the server, so
 * nothing big ships to the browser. Everything is in the URL (gearHref), and the browser's Back
 * button keeps your place. Pure: the files come in from data.ts.
 */
import { GEAR_TYPES } from "@/lib/rules/gear";
import { itemType, searchItems, type GameItem } from "@/lib/items/search";

export type GearKind = "armor" | "weapon" | "ammo";
export type ArmorClass = "" | "Light" | "Heavy" | "Clothing";
export type GearSource = "" | "made" | "none";
export type GearSort = "name" | "armor" | "damage" | "weight";

export interface Recipe {
  station: string;
  materials: { name: string; count: number }[];
  perks: string[];
  otherConditions?: number;
  makes?: number;
}
export type Recipes = Record<string, { make?: Recipe[]; improve?: Recipe[] }>;

export interface GearQuery {
  kind: GearKind;
  /** An armor gear type (Body), a weapon type (Sword) or an ammo type (Arrow); "" for all. */
  type: string;
  /** Armor tab only. */
  armor: ArmorClass;
  source: GearSource;
  q: string;
  sort: GearSort;
  page: number;
}

export const PAGE_SIZE = 50;

/** The tabs: the URL's word, the label. */
export const KINDS: { kind: GearKind; param: string; label: string }[] = [
  { kind: "armor", param: "armor", label: "Armor" },
  { kind: "weapon", param: "weapons", label: "Weapons" },
  { kind: "ammo", param: "ammo", label: "Ammo" },
];

/** Each tab's sorts, in the order the field lists them. */
export const SORTS: Record<GearKind, { sort: GearSort; label: string }[]> = {
  armor: [
    { sort: "name", label: "Name" },
    { sort: "armor", label: "Armor rating" },
    { sort: "weight", label: "Weight" },
  ],
  weapon: [
    { sort: "name", label: "Name" },
    { sort: "damage", label: "Damage" },
    { sort: "weight", label: "Weight" },
  ],
  ammo: [
    { sort: "name", label: "Name" },
    { sort: "damage", label: "Damage" },
  ],
};

export const ARMOR_CLASSES: ArmorClass[] = ["Light", "Heavy", "Clothing"];

/** A URL's search params, read leniently: anything unknown falls back to the default. */
export function parseGearQuery(sp: Record<string, string | string[] | undefined>): GearQuery {
  const one = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v) ?? "";
  };
  const kind = KINDS.find((k) => k.param === one("kind"))?.kind ?? "armor";
  const armor = kind === "armor" && (ARMOR_CLASSES as string[]).includes(one("armor")) ? (one("armor") as ArmorClass) : "";
  const source = one("source") === "made" || one("source") === "none" ? (one("source") as GearSource) : "";
  const sort = SORTS[kind].find((s) => s.sort === one("sort"))?.sort ?? "name";
  const page = Math.max(1, Math.min(1000, Math.floor(Number(one("page"))) || 1));
  return { kind, type: one("type").slice(0, 40), armor, source, q: one("q").slice(0, 100), sort, page };
}

/** The Gear address for a query: only what differs from the defaults, so links stay short. */
export function gearHref(g: Partial<GearQuery> & { kind: GearKind }): string {
  const p = new URLSearchParams();
  if (g.kind !== "armor") p.set("kind", KINDS.find((k) => k.kind === g.kind)!.param);
  if (g.type) p.set("type", g.type);
  if (g.kind === "armor" && g.armor) p.set("armor", g.armor);
  if (g.source) p.set("source", g.source);
  if (g.q?.trim()) p.set("q", g.q.trim());
  if (g.sort && g.sort !== "name") p.set("sort", g.sort);
  if (g.page && g.page > 1) p.set("page", String(g.page));
  const qs = p.toString();
  return qs ? `/gear?${qs}` : "/gear";
}

/** An item's type on this page: its gear type for armor, else its weapon or ammo type. */
export function gearType(i: GameItem): string | null {
  return i.kind === "armor" ? itemType(i) : (i.weaponType ?? null);
}

/** The id made URL-safe: lower case, every run of other characters one "-". */
export function itemSlug(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** The type chips for a tab: armor in GEAR_TYPES order, weapons and ammo by count; only types with items. */
export function typeCounts(items: GameItem[], kind: GearKind): { name: string; n: number }[] {
  const n = new Map<string, number>();
  for (const i of items) {
    if (i.kind !== kind) continue;
    const t = gearType(i);
    if (t) n.set(t, (n.get(t) ?? 0) + 1);
  }
  const list = [...n].map(([name, count]) => ({ name, n: count }));
  if (kind === "armor") {
    const at = (t: string) => {
      const x = (GEAR_TYPES as readonly string[]).indexOf(t);
      return x < 0 ? GEAR_TYPES.length : x;
    };
    return list.sort((a, b) => at(a.name) - at(b.name) || a.name.localeCompare(b.name));
  }
  return list.sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
}

export interface GearRow {
  id: string;
  slug: string;
  name: string;
  kind: GearKind;
  type: string | null;
  text?: string;
  armor?: number;
  damage?: number;
  weight?: number;
  /** The plugin the record comes from. */
  plugin: string;
  /** The station it's made at, when it can be made. */
  station: string | null;
}

/** The plugin part of an id: "Skyrim.esm:012EB7" -> "Skyrim.esm". */
export const pluginOf = (id: string) => id.slice(0, id.lastIndexOf(":"));

export function toRow(i: GameItem, recipes: Recipes): GearRow {
  return {
    id: i.id,
    slug: itemSlug(i.id),
    name: i.name,
    kind: i.kind,
    type: gearType(i),
    text: i.text,
    armor: i.armor,
    damage: i.damage,
    weight: i.weight,
    plugin: pluginOf(i.id),
    station: recipes[i.id]?.make?.[0]?.station ?? null,
  };
}

const byName = (a: GameItem, b: GameItem) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id);

/** One page of the list, with the counts the page shows. */
export function queryGear(items: GameItem[], recipes: Recipes, g: GearQuery) {
  const counts = { armor: 0, weapon: 0, ammo: 0 } as Record<GearKind, number>;
  for (const i of items) counts[i.kind]++;
  const types = typeCounts(items, g.kind);
  const type = types.some((t) => t.name === g.type) ? g.type : "";
  const keep = (i: GameItem) =>
    i.kind === g.kind &&
    (!type || gearType(i) === type) &&
    (!g.armor || i.armorType === g.armor) &&
    (!g.source || (g.source === "made") === !!recipes[i.id]?.make?.length);
  let list = g.q.trim() ? searchItems(items, g.q, Infinity, keep, true) : items.filter(keep);
  const num = (i: GameItem, k: "armor" | "damage" | "weight") => i[k] ?? 0;
  if (g.sort === "name") list = [...list].sort(byName);
  else if (g.sort === "weight") list = [...list].sort((a, b) => num(a, "weight") - num(b, "weight") || byName(a, b));
  else {
    const k = g.sort;
    list = [...list].sort((a, b) => num(b, k) - num(a, k) || byName(a, b));
  }
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(g.page, pages);
  const rows = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((i) => toRow(i, recipes));
  return { rows, total, page, pages, counts, types, type };
}

/** Items by slug, and old ids (an item's `also`) by slug pointing at the item they belong to. */
export function slugIndex(items: GameItem[]): { bySlug: Map<string, GameItem>; old: Map<string, GameItem> } {
  const bySlug = new Map<string, GameItem>();
  const old = new Map<string, GameItem>();
  for (const i of items) bySlug.set(itemSlug(i.id), i);
  for (const i of items) for (const a of i.also ?? []) if (!bySlug.has(itemSlug(a))) old.set(itemSlug(a), i);
  return { bySlug, old };
}

/** The words for where the back link goes: "Light armor for the body", "Swords"... or "Gear". */
export function backLabel(g: GearQuery): string {
  if (g.kind === "armor") {
    const what = g.armor === "Clothing" ? "Clothing" : g.armor ? `${g.armor} armor` : g.type ? "Armor" : "";
    if (!what) return "Gear";
    return g.type ? `${what} for the ${g.type.toLowerCase()}` : what;
  }
  const tab = KINDS.find((k) => k.kind === g.kind)!.label;
  return g.type ? `${tab}: ${g.type}` : tab;
}
