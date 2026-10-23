/**
 * Where a character gets a mount and a home (WO-142 items 4 and 8), for get_rules: an assistant couldn't say that a stable
 * sells a horse or what a house costs, and a search for "Breezehome" found no quest. The prices and gates are the planner's
 * economy notes (lorerim/systems/economy-and-work.md) as Bob's order gave them; they have not been read from the game files
 * on this machine, and the Creation Club homes aren't in yet, so each entry says where it came from and never claims more.
 */

const FROM = "the planner's economy notes (WO-142), not rechecked against the game files";

export const MOUNTS = [
  { way: "Buy a horse", costGold: 1500, where: "any stable", says: "A horse costs 1,500 gold at any stable (HorseCost, from Economy Overhaul).", source: FROM },
  { way: "Earn one in Running Wild", quest: "Running Wild", says: "Running Wild's horse: catch the white, or palonimo, horse roaming the fields of Whiterun and bring it back to the main gate of Whiterun.", source: "game files (its objectives)" },
  { way: "Tame a wild horse and keep it", by: "Simplest Horses", says: "A wild saddled horse can be tamed and kept.", source: FROM },
  { way: "The paraglider", by: "Paragliding in Skyrim", says: "Paragliding in Skyrim adds a paraglider.", source: FROM },
] as const;

export const HOMES = [
  { name: "Breezehome", town: "Whiterun", costGold: 5000, after: "Dragon Rising", source: FROM },
  { name: "Honeyside", town: "Riften", costGold: 8000, source: FROM },
  { name: "Vlindrel Hall", town: "Markarth", costGold: 8000, source: FROM },
  { name: "Hjerim", town: "Windhelm", costGold: 12000, source: FROM },
  { name: "Proudspire Manor", town: "Solitude", costGold: 25000, source: FROM },
  { name: "Lakeview Manor", town: "Falkreath Hold (a Hearthfire plot)", costGold: 5000, after: "being thane of Falkreath Hold", source: FROM },
  { name: "Heljarchen Hall", town: "the Pale (a Hearthfire plot)", costGold: 5000, after: "being thane of the Pale", source: FROM },
  { name: "Windstad Manor", town: "Hjaalmarch (a Hearthfire plot)", costGold: 5000, after: "being thane of Hjaalmarch", source: FROM },
  { name: "Severin Manor", town: "Raven Rock", costGold: 10000, after: "Served Cold", source: FROM },
] as const;

/** What the lists leave out, said once so an assistant doesn't take them for the whole. */
export const HOMES_NOTE = "The Creation Club homes and their gates aren't in this list yet. Say so when a player asks for one, and don't guess its price.";

/**
 * The Tome Trials (WO-148 item 8): the Bards College's book exams are not quests, so nothing lists them, and a plan treated them as
 * open. Giraud's exam line checks that Tending the Flames (Skyrim.esm:053511) is complete, so all 36 wait on it. The tiers and
 * their Speech needs are the mod page's. WO-145's filler list uses them only after that quest.
 */
export const TOME_TRIALS = {
  what: "The Bards College's book exams, from the Tome Trials mod: 36 books, each an exam Giraud sets after it is read.",
  exams: 36,
  xp: [
    { tier: 1, xp: 50 },
    { tier: 2, xp: 100, needs: "Speech 50" },
    { tier: 3, xp: 200, needs: "Speech 75" },
  ],
  after: "Tending the Flames",
  says: "None of the 36 exams is open until Tending the Flames is complete: Giraud's exam line checks it. Then tier 1 pays 50 XP, tier 2 pays 100 and needs Speech 50, tier 3 pays 200 and needs Speech 75. With Callings, its Historian pays half again.",
  source: "the mod's records (Giraud's exam checks Tending the Flames complete) and the mod page for the tiers, as read in WO-148",
} as const;
