import { describe, expect, it } from "vitest";
import { linkNames } from "@/lib/pages/link-names";
import { linkable, peopleNames } from "@/lib/pages/names";
import { placeHref, placesData } from "@/lib/places/data";
import { lineView } from "./line-view";
import { questsData } from "./data";
import { pageOf } from "./reads";
import { storyOfLine } from "./stories-data";

/**
 * WO-160 Part 5: every person and place a line page names, in any of its text, is linked when it has a page. The page's words are the quests'
 * first steps and notes, At a glance, the pitch, what the line gives and closes; each goes through the same linker the page uses, and any name
 * the index has (every person, every place) that is written whole in them and not linked is a failure.
 */
const LINES = ["main-quest", "dragonborn", "dawnguard", "companions"];

/** Names that are also plain words or generic roles: a person called "Guard" is not what a sentence about a guard means. */
const COMMON = new Set(["Guard", "Bandit", "Prisoner", "Warrior", "Soldier", "Priest", "Mage", "Thief", "Farmer", "Child", "Citizen", "Traveler", "Hunter", "Miner", "Skeleton", "Dragon", "Draugr", "Giant", "Vampire", "Orc", "Elder", "Blade", "Dunmer", "Skeever", "Nord", "Imperial", "Breton", "Redguard", "Khajiit", "Argonian", "Altmer", "Bosmer", "Orsimer"]);

function unlinked(text: string, broad: string[]): string[] {
  const pieces = linkNames(text, linkable());
  const linked = new Set(pieces.filter((p) => p.href).map((p) => p.text));
  const plain = pieces.filter((p) => !p.href).map((p) => p.text).join("\u0000");
  return broad.filter((n) => !linked.has(n) && new RegExp(`(?<![\\p{L}\\p{N}])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])(?!\\s+\\p{Lu})`, "u").test(plain));
}

describe("names on the main quest, Dragonborn, Dawnguard and the Companions", () => {
  // Every place with a page, and every person a quest line may name (peopleNames: whole names, anyone in a quest, a read, a follower or a trader).
  const broad = [...new Set([...placesData().places.filter((p) => placeHref(p.name)).map((p) => p.name), ...peopleNames().map((n) => n.text)])].filter((n) => n.length > 3 && !COMMON.has(n));
  for (const id of LINES) {
    it(`${id}: every name with a page is a link`, () => {
      const line = questsData().byId.get(id)!;
      const v = lineView(line);
      const texts = [
        storyOfLine(id)?.pitch ?? line.read?.about ?? "",
        ...v.chapters.flatMap((c) => c.quests.flatMap((q) => [q.task ?? "", q.note ?? ""])),
        ...v.jobs.flatMap((j) => [j.task ?? "", j.note ?? ""]),
        v.glance.start.sub ?? "",
        ...v.glance.start.more,
        v.glance.where ?? "",
        ...(line.read?.gives ?? []),
        ...(line.read?.closes ?? []),
        ...line.quests.flatMap((q) => pageOf(q).closes),
      ].filter(Boolean);
      const missed = new Map<string, string>();
      for (const t of texts) for (const n of unlinked(t, broad)) missed.set(n, t.slice(0, 80));
      expect([...missed].map(([n, t]) => `${n}: ${t}`)).toEqual([]);
    });
  }
});
