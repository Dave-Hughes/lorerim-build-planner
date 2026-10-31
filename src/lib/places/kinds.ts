/** The plural of each kind of enemy a place has (`actors.kinds`): the records' kinds are singular words, and some take no s (WO-184 Part 10: "Thalmors"). */
const PLURAL: Record<string, string> = {
  Bandit: "Bandits",
  Bear: "Bears",
  Chaurus: "Chaurus",
  Dragon: "Dragons",
  DragonPriest: "Dragon Priests",
  Draugr: "Draugr",
  Falmer: "Falmer",
  Forsworn: "Forsworn",
  Giant: "Giants",
  Hagraven: "Hagravens",
  Imperial: "Imperials",
  Necromancer: "Necromancers",
  Riekling: "Rieklings",
  Skeleton: "Skeletons",
  Spider: "Spiders",
  Spriggan: "Spriggans",
  Thalmor: "Thalmor",
  Troll: "Trolls",
  Vampire: "Vampires",
  Warlock: "Warlocks",
  Wolf: "Wolves",
};

/** "Thalmor", "Wolves", "Dragon Priests". A kind the list doesn't know takes an s after its spaced-out words. */
export const kindPlural = (kind: string): string => PLURAL[kind] ?? `${kind.replace(/([a-z])([A-Z])/g, "$1 $2")}s`;
