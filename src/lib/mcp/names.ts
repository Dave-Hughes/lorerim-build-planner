import "server-only";
import { rankCount, type GameData } from "@/lib/rules/data";
import type { GameItem } from "@/lib/items/search";
import { TRAIT_CHOICES } from "@/lib/rules/trait-choices";
import { FactsError } from "./errors";

/**
 * Names, not ids (WO-110): an assistant sends the game's names as the planner shows them, and this
 * turns them into the plan's ids, or refuses with what it could have meant. Shared by every tool.
 */

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

/** Edit distance, for the closest names to a miss. */
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const t = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = t;
    }
  }
  return row[b.length];
}

/** The five names nearest to `want`: those containing it first, then by spelling. */
export function closest(want: string, names: readonly string[], n = 5): string[] {
  const w = norm(want);
  return [...new Set(names)]
    .map((name) => {
      const x = norm(name);
      return { name, score: x === w ? -2 : x.includes(w) || w.includes(x) ? -1 : distance(w, x) };
    })
    .sort((a, b) => a.score - b.score || a.name.length - b.name.length)
    .slice(0, n)
    .map((x) => x.name);
}

/** One of a short list: exact, case-insensitive; a miss names the whole list. */
function oneOf(kind: string, want: string, names: readonly string[]): string {
  const hit = names.find((n) => norm(n) === norm(want));
  if (hit) return hit;
  throw new FactsError(`No ${kind} called ${want}. ${kind[0].toUpperCase()}${kind.slice(1)}s are: ${names.join(", ")}.`);
}

/** One of a long list: exact, case-insensitive; a miss names the closest five. */
function oneOfMany(kind: string, want: string, names: readonly string[]): string {
  const hit = names.find((n) => norm(n) === norm(want));
  if (hit) return hit;
  throw new FactsError(`No ${kind} called ${want}. The closest: ${closest(want, names).join(", ")}.`);
}

export const skill = (d: GameData, name: string) => oneOf("skill", name, d.skills);
export const race = (d: GameData, name: string) => oneOf("race", name, d.races.map((r) => r.name));
export const birthsign = (d: GameData, name: string) => oneOf("birthsign", name, d.birthsigns.map((b) => b.name));
export const deity = (d: GameData, name: string) => oneOf("deity", name, d.deities);
export const mode = (d: GameData, name: string) => oneOf("mode", name, d.gameModes.map((m) => m.name)) as GameData["gameModes"][number]["name"];
export const stone = (d: GameData, name: string) => (norm(name) === "none" ? "none" : oneOf("standing stone", name, d.stones.map((s) => s.name)));
export const trait = (d: GameData, name: string) => oneOfMany("trait", name, d.traits.map((t) => t.name));
export const start = (d: GameData, name: string) => oneOfMany("start", name, d.starts.map((s) => s.name));

/** A trait's choice (WO-122), by the game's option names: Fatal Attraction's Male or Female. A trait that asks none refuses one. */
export function traitChoice(trait: string, choice: string): string {
  const c = TRAIT_CHOICES[trait];
  if (!c) throw new FactsError(`${trait} asks no choice. The traits that do: ${Object.keys(TRAIT_CHOICES).join(", ")}; Master of One takes masterOfOneSkill.`);
  const hit = c.options.find((o) => norm(o) === norm(choice));
  if (hit) return hit;
  throw new FactsError(`${choice} isn't a choice for ${trait}. Its choices are: ${c.options.join(", ")}.`);
}

/** A start's one choice (an inn, a hold): one of its options; a start without a choice refuses one. */
export function startOption(d: GameData, startName: string, option: string): string {
  const s = d.startByName.get(startName);
  if (!s?.options.length) throw new FactsError(`${startName} has no choice to make, so it takes no start option.`);
  const hit = s.options.find((o) => norm(o) === norm(option));
  if (hit) return hit;
  throw new FactsError(`${option} isn't a choice for ${startName}. Its ${s.optionLabel ? `${s.optionLabel.toLowerCase()}s` : "choices"} are: ${s.options.join(", ")}.`);
}

/**
 * A perk: its "Tree:Name" id, or a name alone when one tree has it. "Name (2/3)" is a later rank, and
 * comes back as the same id (the plan repeats an id for each rank). A name two trees have is refused
 * with the ids to pick from.
 */
export function perk(d: GameData, input: string): string {
  const raw = input.trim().replace(/\s*\(\d+\s*\/\s*\d+\)\s*$/, "");
  const byId = d.perks.find((p) => norm(p.id) === norm(raw));
  if (byId) return byId.id;
  const named = d.perks.filter((p) => norm(p.name) === norm(raw));
  if (named.length === 1) return named[0].id;
  if (named.length > 1) throw new FactsError(`More than one tree has a perk called ${raw}. Use one of: ${named.map((p) => p.id).join(", ")}.`);
  throw new FactsError(`No perk called ${raw}. The closest: ${closest(raw, d.perks.map((p) => p.id)).join(", ")}.`);
}

/** A spell by its name, as the Spells page shows it. */
export function spell(d: GameData, name: string): string {
  const hit = d.spells.find((s) => norm(s.name) === norm(name));
  if (hit) return hit.id;
  throw new FactsError(`No spell called ${name}. The closest: ${closest(name, d.spells.map((s) => s.name)).join(", ")}.`);
}

/** An ability (a power or lesser power) by its name. */
export function ability(d: GameData, name: string): string {
  const hit = d.abilities.find((a) => norm(a.name) === norm(name));
  if (hit) return hit.id;
  throw new FactsError(`No ability called ${name}. The closest: ${closest(name, d.abilities.map((a) => a.name)).join(", ")}.`);
}

/** A shout by its name. */
export function shout(d: GameData, name: string): string {
  const hit = d.shouts.find((s) => norm(s.name) === norm(name));
  if (hit) return hit.id;
  throw new FactsError(`No shout called ${name}. The closest: ${closest(name, d.shouts.map((s) => s.name)).join(", ")}.`);
}

/** A piece of gear by its name, as the Gear page shows it. */
export function item(items: readonly GameItem[], name: string): GameItem {
  const hit = items.find((i) => norm(i.name) === norm(name));
  if (hit) return hit;
  throw new FactsError(`No item called ${name}. The closest: ${closest(name, items.map((i) => i.name)).join(", ")}.`);
}

/**
 * The id's display name, back again, for answers in the same plain shape the inputs use: the bare
 * name, or Tree:Name when two trees share it. With `rank`, a perk that has more than one rank says
 * which, in the input's own form (WO-110a): "Great Weapon Mastery (2/2)".
 */
export const perkLabel = (d: GameData, id: string, rank?: number) => {
  const p = d.perkById.get(id);
  if (!p) return id;
  const name = d.perks.filter((x) => x.name === p.name).length > 1 ? p.id : p.name;
  const ranks = rankCount(p);
  return rank && ranks > 1 ? `${name} (${rank}/${ranks})` : name;
};
