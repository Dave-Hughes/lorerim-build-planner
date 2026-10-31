/**
 * Whether a name that has no page of its own is someone: Captain Hargar, Warlord Gathrik, Krilqolaasdaan, Halvar the Drunk. The records give a kind of actor and a unique one the same
 * kind of entry, so the name is all there is to go on (WO-184 Part 10: "Its boss is Kagouti.", "Pirate.", "Frost Troll."). A name is someone when it has a word that is neither
 * a creature, a rank, a trade nor a kind of fighter, and has no such word in it besides a title in front ("Captain", "Lord") or after ("the Drunk", "Warchief", "of Order").
 */
const TITLES = new Set([
  "captain", "sir", "lord", "king", "duke", "count", "warlord", "archpriest", "inquisitor", "sorcerer", "keeper", "general", "master", "abbot", "pope", "mad", "queen", "lady",
  "arch-selective", "guardian", "warchief", "jailor", "first", "high", "witch-lord", "emperor", "jarl", "thane", "dame", "chef", "mistress", "warden",
]);
const FILLER = new Set(["the", "of", "from", "in", "and", "a", "an", "to", "at", "on", "for", "with"]);
const KINDS = new Set([
  // creatures
  "troll", "wolf", "spider", "skeleton", "ghost", "giant", "chaurus", "werewolf", "werebear", "hagraven", "atronach", "kagouti", "riekling", "spriggan", "horker", "mudcrab", "bear", "sabre",
  "draugr", "dragon", "daedroth", "centurion", "sentinel", "spider", "frostbite", "frosthide", "snow", "frost", "ogrim", "hunger", "wisp", "wispmother", "vampire", "lich", "shade",
  "worm", "slaughterfish", "falmer", "goblin", "ogre", "lurker", "scamp", "imp", "wraith", "spectre", "specter", "phantom", "mammoth", "deer", "elk", "fox", "skeever", "wolfhound", "snowy",
  // ranks and trades
  "soldier", "guard", "marauder", "prisoner", "mate", "spellsword", "necromancer", "interrogator", "hand", "mercenary", "warrior", "chief", "warden", "cultist", "mage", "battlemage", "archer",
  "hunter", "officer", "conjurer", "priest", "oracle", "watchman", "caller", "gravekeeper", "boss", "pirate", "bandit", "reaver", "orc", "captain", "hired", "mounted", "warlock", "witch",
  "assassin", "thief", "knight", "paladin", "vigilant", "beggar", "praetorian", "vessel", "manifestation", "sage", "spiker", "alpha", "armored", "ancient", "mythic", "dawn", "undead", "festering",
  "mended", "flesh", "voracious", "malevolent", "northwatch", "silver", "blood", "silver-blood", "imperfect", "awakened", "enthralled", "exiled", "sea", "titanclaw", "dwarven", "dark", "brotherhood",
  "imperial", "stormcloak", "thalmor", "redoran", "legion", "forsworn", "dawnguard", "black", "boethiah", "glenmoril", "volkihar", "empire", "east", "order", "high", "rock", "warehouse", "traps",
  "reset", "test", "guy", "butcher", "dres", "gallant", "man", "woman", "lost", "wasteland", "sky", "orchestrator", "winter", "beast", "mountain", "eater", "leeches", "mercenaries",
]);

const words = (name: string) => name.trim().replace(/^the\s+/i, "").split(/\s+/).filter(Boolean).map((w) => w.toLowerCase().replace(/[^a-z'-]/g, ""));

export function looksLikeSomeone(name: string): boolean {
  const w = words(name).filter((x) => x && !FILLER.has(x));
  if (!w.length) return false;
  // "Halvar the Drunk", "Sild the Warlock", "Elsi the Spiker": a name, then who they are.
  const personal = w.filter((x) => !KINDS.has(x) && !TITLES.has(x));
  if (!personal.length) return false;
  // A kind of fighter or creature in the name that is not a title leaves it a kind ("Ghost Captain", "Frostbite Spider"), unless it comes after the name ("Sild the Warlock").
  const at = w.findIndex((x) => !KINDS.has(x) && !TITLES.has(x));
  const before = w.slice(0, at);
  if (before.some((x) => KINDS.has(x) && !TITLES.has(x))) return false;
  const after = w.slice(at + 1);
  return !after.some((x) => KINDS.has(x) && !TITLES.has(x)) || /\b(?:the|of)\b/i.test(name);
}
