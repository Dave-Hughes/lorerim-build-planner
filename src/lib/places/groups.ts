/**
 * The kinds of place a player would pick (WO-167 review): about ten groups over the records' thirty-eight location types, so Places and the
 * Map page don't open on a wall of chips. Each group has the same label, key and count wherever it is shown.
 */
export interface PlaceGroup {
  key: string;
  label: string;
  /** What "All ..." says in a list. */
  all: string;
  types: string[];
}

export const PLACE_GROUPS: PlaceGroup[] = [
  { key: "cities", label: "Cities and towns", all: "cities and towns", types: ["City", "Town", "Settlement"] },
  { key: "inns", label: "Inns and shops", all: "inns and shops", types: ["Inn", "Store", "Stables"] },
  { key: "homes", label: "Homes", all: "homes", types: ["House", "PlayerHouse", "Shack", "NordicDwelling", "Building", "Farm", "Mill"] },
  { key: "temples", label: "Temples and guilds", all: "temples and guilds", types: ["Temple", "Guild", "Monastery"] },
  { key: "forts", label: "Forts and keeps", all: "forts and keeps", types: ["Fort", "Keep", "Castle", "ImperialTower", "NordicTower", "Barracks", "Jail", "OrcStronghold"] },
  { key: "caves", label: "Caves and mines", all: "caves and mines", types: ["Cave", "Mine"] },
  { key: "ruins", label: "Ruins", all: "ruins", types: ["NordicRuin", "DwemerRuin"] },
  { key: "camps", label: "Camps and lairs", all: "camps and lairs", types: ["Camp", "GiantCamp", "DragonLair"] },
  { key: "shrines", label: "Shrines and stones", all: "shrines and stones", types: ["Altar", "DaedricShrine", "Doomstone", "Grove"] },
  { key: "landmarks", label: "Landmarks", all: "landmarks", types: ["Landmark", "Shipwreck", "Pass", "Clearing", "Lighthouse", "Realm"] },
];

const byType = new Map(PLACE_GROUPS.flatMap((g) => g.types.map((t) => [t, g.key] as const)));

/** A type's group; any type not named above is a landmark. */
export const groupOf = (type: string): string => byType.get(type) ?? "landmarks";
export const groupByKey = (key: string | undefined) => PLACE_GROUPS.find((g) => g.key === key) ?? null;
/** A group from either its key or one of the old raw types (`?type=Cave` links still work). */
export const groupFrom = (v: string | undefined) => groupByKey(v) ?? (v ? groupByKey(groupOf(v)) : null);
