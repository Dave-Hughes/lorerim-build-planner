import "server-only";
import { personHref } from "@/lib/people/data";
import { placeByName, placeHref } from "@/lib/places/data";
import { townsIn } from "@/lib/places/suggest";
import { homeName } from "./data";
import { pageOf } from "./reads";
import { questHref } from "./slugs";
import type { QuestLine } from "./types";

/**
 * A quest category as table rows (WO-163, the board QuestCategoryTable): one row per quest or line with who starts it, where, its level,
 * its length, where it is from, and its quest XP. Plain data for the client table, which sorts and filters it.
 */
export interface TableRow {
  id: string;
  href: string;
  name: string;
  /** A line of several quests, or a single quest (its own icon). */
  kind: "line" | "quest";
  who: string | null;
  whoHref: string | null;
  where: string | null;
  whereHref: string | null;
  /** The hold the place is in, for the Hold filter. */
  hold: string | null;
  /** 0 for none. */
  level: number;
  length: number;
  from: { kind: "base" | "cc" | "mod"; name: string; href?: string };
  /** Quest XP; 0 pays none. */
  xp: number;
  /** The category, for the table across them all. */
  category: string;
}

/** The nine capitals' holds, for a row whose place is a city (the places index has no city yet, WO-166). */
const HOLD_OF_CITY: Record<string, string> = { Whiterun: "Whiterun", Falkreath: "Falkreath", Solitude: "Haafingar", Windhelm: "Eastmarch", Riften: "The Rift", Markarth: "The Reach", Winterhold: "Winterhold", Dawnstar: "The Pale", Morthal: "Hjaalmarch" };

/** The first place a line of words names, and the hold it is in. */
function whereOf(text: string | null | undefined): { where: string | null; hold: string | null } {
  if (!text) return { where: null, hold: null };
  const first = text.split(/[,;(]/)[0].trim();
  if (/^(anywhere|everywhere|elsewhere|somewhere)\b/i.test(first)) return { where: null, hold: null };
  const town = townsIn(first)[0] ?? townsIn(text)[0] ?? null;
  // A phrase ("on arrival in a major hold", "Any hold") is not a place: a place is written as a name.
  const named = /^[A-Z]/.test(first) && !/^(Any|All|Every|Each|Various|Several|Multiple)\b/.test(first) && first.length <= 48;
  const name = town ?? (named ? first : null);
  if (!name) return { where: null, hold: null };
  return { where: name, hold: HOLD_OF_CITY[name] ?? placeByName(name)?.hold ?? placeByName(first)?.hold ?? null };
}

/** A giver that is a role, not a person: the table says Not known yet rather than "A courier". */
const NOT_NAMED = /^(not named|no one|someone|nobody|(?:a|an|the)\s+(?:courier|messenger|stranger|prisoner|guard|bandit|necromancer|soldier|villager|traveler|note|letter))\b/i;

export function tableRow(line: QuestLine): TableRow {
  const solo = line.quests.length === 1 && line.category !== "work" && !!questHref(line.quests[0].edid);
  const quest = solo ? line.quests[0] : (line.quests.find((q) => q.edid === line.opening) ?? line.quests[0]);
  const page = quest ? pageOf(quest) : null;
  const who = [solo ? page?.starts.find((s) => s.who)?.who : (line.read?.getIn?.who ?? line.giver?.name ?? page?.starts.find((s) => s.who)?.who)].find((x) => x && !NOT_NAMED.test(x)) ?? null;
  const whereText = line.where ?? (solo ? page?.starts.find((s) => s.where)?.where : (line.read?.getIn?.where ?? page?.starts.find((s) => s.where)?.where)) ?? quest?.start?.towns?.[0] ?? null;
  const { where, hold } = whereOf(whereText);
  const mod = solo ? (quest.mod ?? line.sources[0]) : line.sources[0];
  const from: TableRow["from"] = !mod || mod.base ? { kind: "base", name: "Base game" } : /^Creation Club/i.test(mod.name) ? { kind: "cc", name: "Creation Club" } : { kind: "mod", name: mod.name, ...(mod.modid ? { href: `https://www.nexusmods.com/skyrimspecialedition/mods/${mod.modid}` } : {}) };
  return {
    id: line.id,
    href: solo ? questHref(quest.edid)! : `/quests/${line.id}`,
    name: solo ? quest.name || line.name : line.name,
    kind: solo ? "quest" : "line",
    who,
    whoHref: who ? personHref(who.split(/\s+(?:or|and)\s+/)[0]) : null,
    where,
    whereHref: where ? placeHref(where) : null,
    hold,
    level: line.minLevel ?? 0,
    length: line.quests.length,
    from,
    xp: solo ? quest.xp : line.xpTotal,
    category: homeName(line.category),
  };
}

export const tableRows = (lines: QuestLine[]) => lines.map(tableRow);
