/**
 * The city a place inside it belongs to (WO-142 item 5): "Blue Palace" and "Bards College" are in Solitude, the Temple of
 * Dibella in Markarth, the College's halls in Winterhold. A story or quest that starts in one is a thing to do in that
 * city, for suggest_quests' where.
 *
 * Hand-kept from the game's own geography for the places quest starts name, until the places index reads each cell's
 * parent location (the PC's data). A name that sits in more than one city (Hall of the Dead, Jarl's Longhouse) is left out
 * rather than guessed; a place not here maps to nothing, never to a wrong city.
 */
const INSIDE: Record<string, string[]> = {
  Solitude: ["Blue Palace", "Castle Dour", "Bards College", "The Winking Skeever", "Winking Skeever", "Radiant Raiment", "Bits and Pieces", "Angeline's Aromatics", "Proudspire Manor", "Temple of the Divines"],
  Markarth: ["Temple of Dibella", "Understone Keep", "Silver-Blood Inn", "Cidhna Mine", "Vlindrel Hall", "Treasury House", "Arnleif and Sons Trading Company", "Endon's House"],
  Winterhold: ["Winterhold College", "College of Winterhold", "Hall of Countenance", "Hall of Attainment", "Hall of the Elements", "The Arcanaeum", "Arcanaeum", "Dormitory", "The Frozen Hearth", "Frozen Hearth", "Birna's Oddments"],
  Whiterun: ["Dragonsreach", "Jorrvaskr", "Jorrvaskr Living Quarters", "The Bannered Mare", "Bannered Mare", "Breezehome", "Arcadia's Cauldron", "Belethor's General Goods", "The Drunken Huntsman", "Drunken Huntsman", "Warmaiden's", "Temple of Kynareth", "Skyforge"],
  Windhelm: ["Palace of the Kings", "Candlehearth Hall", "Aretino Residence", "Hjerim", "The White Phial", "White Phial"],
  Riften: ["Mistveil Keep", "Riften Mistveil Keep", "The Bee and Barb", "Bee and Barb", "Black-Briar Manor", "Haelga's Bunkhouse", "Temple of Mara", "Elgrim's Elixirs", "Honorhall Orphanage", "The Pawned Prawn", "The Ragged Flagon", "The Ratway Warrens", "The Warrens", "Thieves Guild Headquarters"],
  Morthal: ["Highmoon Hall", "Moorside Inn"],
  Falkreath: ["Dead Man's Drink"],
  Dawnstar: ["Windpeak Inn"],
  "Raven Rock": ["The Retching Netch", "Retching Netch"],
  Riverwood: ["Sleeping Giant Inn", "Faendal's House"],
};

const lower = (s: string) => s.toLowerCase();
const PAIRS = Object.entries(INSIDE).flatMap(([city, places]) => places.map((p) => [lower(p), city] as const));

/** The cities the places in these texts sit in: any place named in a text, once each. */
export function citiesOf(texts: readonly (string | null | undefined)[]): string[] {
  const out = new Set<string>();
  for (const t of texts) {
    if (!t) continue;
    const at = lower(t);
    for (const [place, city] of PAIRS) if (at.includes(place)) out.add(city);
  }
  return [...out];
}
