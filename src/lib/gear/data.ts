import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { currentVersion } from "@/lib/rules/server";
import type { GameItem } from "@/lib/items/search";
import { slugIndex, type Recipes } from "./query";

/**
 * The Gear page's files for the current LoreRim version (WO-92), read once per server: the item
 * index, the recipes and the plugins' Nexus pages (WO-91). Built by scripts/gamedata/build.py.
 */
interface GearData {
  version: string;
  items: GameItem[];
  recipes: Recipes;
  /** Plugin file name -> its Nexus mod id; only plugins with a page. */
  nexus: Map<string, string>;
  bySlug: Map<string, GameItem>;
  old: Map<string, GameItem>;
}

let cached: GearData | null = null;

function read<T>(dir: string, file: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path.join(dir, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export function gearData(): GearData {
  if (cached) return cached;
  const version = currentVersion().id;
  const dir = path.join(process.cwd(), "src", "data", `lorerim-${version}`);
  const items = read<GameItem[]>(dir, "items.json", []);
  const plugins = read<Record<string, { nexus: string }>>(dir, "plugins.json", {});
  const nexus = new Map<string, string>();
  for (const [p, v] of Object.entries(plugins)) nexus.set(p.toLowerCase(), v.nexus);
  cached = { version, items, recipes: read<Recipes>(dir, "recipes.json", {}), nexus, ...slugIndex(items) };
  return cached;
}

/** A plugin's Nexus page, or null (the base game, DLC, Creation Club and LoreRim's own patches have none). */
export function nexusUrl(plugin: string): string | null {
  const id = gearData().nexus.get(plugin.toLowerCase());
  return id ? `https://www.nexusmods.com/skyrimspecialedition/mods/${id}` : null;
}
