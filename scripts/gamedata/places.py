"""
The places index (WO-128 Part 1): every location a player can visit that isn't a city, a town or a house, across the
whole load order, with what points at it. Writes gamedata/<version>/places_raw.json and places_report.md; build.py turns
the raw file into src/data/lorerim-<version>/places.json:
  python3 scripts/gamedata/places.py [version]

A place is a location (LCTN) whose LocType keywords say dungeon, cave, mine, fort, ruin, camp, lair, tower, shrine and the
like, or whose world map marker is one of those kinds (the marker's own type: Cave, Nordic Ruin, Giant Camp...). Never
one that is a city, town, settlement, dwelling, house, inn, store, castle or jail, or that sits inside one.

For each place:
  type         the map marker's kind when it has one, else the LocType keywords'
  hold         the hold its parent locations lead up to (LocTypeHold)
  world, pos   (WO-166) the worldspace's editor id and [x, y, z] in game units, from the place's map marker, else the exterior
               cells it owns, else a door out of its interior (place_pos.py has the order and the reasons); `posFrom` says
               which. A place in a town has none of its own (`inTown`); one nothing can place has `noPos`, the reason. The nine
               hold capitals are rows of type City (WO-166), found by the CWCapital keyword, positioned by their own map marker
  nearestTown  the closest city, town or settlement by the map markers' positions in the same worldspace
  actors       the placed actors in its cells (and its child locations'): how many, their levels, and the boss (the actor
               with the Boss location ref type, Skyrim.esm:0130F7), each level as the record holds it: a fixed level, a
               multiple of the player's level within a range, or a leveled list's range
  clearXp      what LoreRim's Experience settings give for clearing that kind of place (SKSE/Plugins/Experience.ini,
               [Clearing], by the marker's kind)
  pointers     dialogue lines that name it (the speaker, where the speaker stands, the words, the record), and books and
               notes that name it, matched on the place's whole name
  quests       quests whose location aliases are it, or whose forced references stand in it: a quest already goes there
  worthGoingFor (WO-144 Part 1e) a word wall and the shout it teaches, a skill book, a boss chest, a crafting station,
               a shrine -- each a placed REFR whose base the game's own naming marks, never a guess at loot a
               leveled list might hold. Not built: a unique, non-leveled item (no record-level marker separates one
               from an ordinary item of the same type)
  danger       (WO-144 Part 1e) a dragon lair (the place's own `type`) and traps (a placed `Trap*` activator). Not
               built: the boss's own spell kit (a spell's school isn't in its EDID reliably enough to name without
               guessing)
"""
import collections
import configparser
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, active_profile, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
import place_pos as pp  # noqa: E402
import quest_scripts as qsc  # noqa: E402
from story_check import all_strings, name_strings  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
DELETED = 0x20
BOSS = "Skyrim.esm:0130F7"  # the Boss location ref type
MANAKIN_RACE = "Skyrim.esm:10760A"  # "ManakinRace" (Bethesda's own spelling): a display mannequin, never an enemy --
# found at Nightingale Hall reading "1 to 1" against a zone minimum of 8 (Bob, 23 Oct, 17:35): the mannequins'
# own fixed level 1, not a real encounter at all.
# A world map marker's kind (REFR TNAM), as the Creation Kit numbers them (UESP: Mod File Format/REFR, map marker type).
MARKER = {1: "City", 2: "Town", 3: "Settlement", 4: "Cave", 5: "Camp", 6: "Fort", 7: "NordicRuin", 8: "DwemerRuin", 9: "Shipwreck",
          10: "Grove", 11: "Landmark", 12: "DragonLair", 13: "Farm", 14: "WoodMill", 15: "Mine", 16: "MilitaryCamp", 17: "MilitaryCamp",
          18: "Doomstone", 19: "WheatMill", 20: "Smelter", 21: "Stable", 22: "ImperialTower", 23: "Clearing", 24: "Pass", 25: "Altar",
          26: "Rock", 27: "Lighthouse", 28: "OrcStronghold", 29: "GiantCamp", 30: "Shack", 31: "NordicTower", 32: "NordicDwelling",
          33: "Docks", 34: "DaedricShrine", 35: "Castle", 36: "Castle", 37: "Castle", 38: "Castle", 39: "Castle", 40: "Castle",
          41: "Castle", 42: "Castle", 43: "Castle", 44: "MiraakTemple", 45: "Town", 46: "StandingStone", 47: "TelvanniTower",
          48: "Grove", 49: "CastleKarstaag"}
NOT_PLACES = {"City", "Town", "Settlement", "Farm", "WoodMill", "WheatMill", "Smelter", "Stable", "Docks", "Castle", "OrcStronghold"}
# The nine hold capitals (WO-144 Part 1): never found by a marker's TNAM type, which this load order's city overhauls
# reassign to other icons (Castle, MiraakTemple, Grove, StandingStone, or none) on every one of the nine. Found instead by
# the one LCTN in the whole load order with this exact name and the CWCapital keyword (Skyrim's Civil War data, which
# names a hold's capital for the siege system and isn't touched by the icon mods).
CAPITALS = {"Whiterun", "Windhelm", "Riften", "Solitude", "Markarth", "Morthal", "Winterhold", "Dawnstar", "Falkreath"}
# Four capitals (Falkreath, Dawnstar, Morthal, Winterhold) have their own named exterior marker in Tamriel. The other
# five are their own worldspace with no exterior marker of their own and no door this reader could find into it; Bob's
# ruling (23 Oct) was to anchor each to a named thing standing right outside its gate instead -- confirmed within a few
# hundred metres of the carriage driver or stablehand placed there (Bjorlam's own position lands beside Whiterun
# Stables). A capital not in here is found by its own name, as before.
CAPITAL_ANCHOR = {"Whiterun": "Whiterun Stables", "Windhelm": "Windhelm Stables", "Riften": "Riften Stables",
                   "Markarth": "Markarth Stables", "Solitude": "Solitude East Gate"}
# Named settlements a design treats like a town (WO-141 Part 1, folded here): never a marker trusted by its TNAM type
# alone (that let "Wintersand Manor", "Flight Platform" and other mislabelled markers stand in as a "town").
SETTLEMENTS = {"Riverwood", "Ivarstead", "Rorikstead", "Shor's Stone", "Darkwater Crossing", "Kynesgrove", "Karthwasten",
               "Dragon Bridge", "Stonehills", "Helgen", "Skaal Village", "Raven Rock", "Thirsk"}
# The four Orc strongholds (WO-141 Part 1, folded here): a type of their own ("OrcStronghold" is in NOT_PLACES because
# most things with that marker type are the stronghold's own town-like interior, not a place), named so only these four
# bypass that. A stronghold's gate guard's dialogue conditions become its `enters` text (item 2's "what gets you in").
STRONGHOLDS = {"Narzulbur", "Largashbur", "Dushnikh Yal", "Mor Khazgur"}
NAMED_PLACES = SETTLEMENTS | STRONGHOLDS  # item 2: these bypass the usual exclusion rules by name alone
# The stronghold gate guard's line (found by searching dialogue for "Blood-Kin"): shared across all four, under
# "Generic dialogue for orc villagers" (Skyrim.esm:03907C), not any one stronghold's own quest.
STRONGHOLD_GATE = "Skyrim.esm:0BBB2D"
# Item 3: named buildings a character goes to on purpose. Temples, inns and guild halls (the two colleges are
# LocTypeGuild too, confirmed on Winterhold College and The Bards College) are found by keyword, system-wide, never
# narrowed to the nine cities -- the order's own examples (every inn, a Thieves Guild hall) want them all. A keep is
# found by CWCAPITALHQ, not LocTypeCastle (which also covers Castle Volkihar and other non-capital castles): confirmed
# against all nine jarls' seats and nothing else. These have no exterior marker of their own (an interior-only
# location), so their town is the first ancestor in CAPITALS or SETTLEMENTS up their own parent chain, never a
# distance -- `inTown`, not `nearestTown`. Kept off the map by their `type` (Mac's "rule 20" on `suggest_places`).
BUILDING_KW = {"LocTypeTemple", "LocTypeInn", "LocTypeGuild"}
KEEP_KW = "CWCapitalHQ"
# Bob's cleaning pass (23 Oct, 15:35): a building keyword alone isn't a building. A location that is also the city
# itself (Whiterun and Solitude both carry "LocTypeInn" on their own city LCTN), a player-built home, a bandit camp
# or a dungeon (Cragwater Cavern, tagged "LocTypeInn" as well as "LocTypeBanditCamp") is never one, so these never
# bypass PLACE_KW/NOT_KW even though BUILDING_KW matches. A few more carry no disqualifying keyword at all (an
# identical shape to a real inn, in the Dormitory's case) and are named by hand instead, logged rather than guessed
# at by a general rule that could just as easily drop a real one.
NOT_BUILDING_KW = {"LocTypeCity", "CWCapital", "LocTypeHoldCapital", "LocTypeHold", "LocTypeMilitaryFort",
                    "LocTypeHouse", "LocTypePlayerHouse", "LocTypeBanditCamp",
                    "LocTypeShowersInInns"}  # Keep It Clean's own shower room, tagged LocTypeInn too; a room in an inn, not the inn
NOT_BUILDINGS = {"Temple Location", "Snow-Shod Farm Cellar", "Mausoleum", "Mustering Hall", "The Hermit",
                  "The Hermit Cellar", "Markarth East Empire Dormitory",
                  "Solitude"}  # The Great City of Solitude.esp:01F045: LocTypeInn, no cell at all, never placed
# WO-144 Part 1e: "what lives there", by the actor's own faction (an NPC_'s SNAM list, template-resolved), matched
# on a word in the faction's EDID -- the game's own naming (BanditFaction, DraugrFaction...), not a guess at it.
# Checked against the generic top-level factions (BanditFaction, DraugrFaction) and location-specific variants
# (dunValtheimKeepBanditFaction) alike, since both carry the same word.
KINDS = ["Bandit", "Draugr", "Forsworn", "Vampire", "Necromancer", "Falmer", "Hagraven", "Spriggan", "Warlock",
         "Skeleton", "Dragon", "Giant", "Troll", "Chaurus", "Spider", "Riekling", "Thalmor", "Imperial", "Stormcloak",
         "Wolf", "Bear", "SaberCat", "Mudcrab", "Dwarven", "DragonPriest", "Reaver", "CultEnthir"]
# Bob's ruling (23 Oct, 15:20): the km is real, but this is a small map, so a player's own measure goes beside it.
# Set from two pairs Bob gave: Riverwood to Whiterun (0.5 km) is "a short walk"; Whiterun to Riften (2.5 km) is "a
# long day's road". Embershard Mine to Riverwood (0.3 km, practically touching) sets the top of "next to it".
WALK_BANDS = [(0.4, "next to it"), (1.0, "a short walk"), (2.0, "half a day")]
# WO-144 Part 1e: "what's worth going for" and "danger to a build", each found by the game's own naming convention
# on the placed activator/container/furniture record -- never a guess at what a leveled list happens to hold.
WORD_WALL_ACTI = re.compile(r"^NorWordWallWord([A-Za-z]+)$")  # the word taught; a trailing "xxx" is an unused duplicate of the same word
SKILL_BOOK_EDID = re.compile(r"^Skill([A-Za-z]+)(\d+)$")  # Skyrim's own convention: "SkillAlchemy5" teaches Alchemy, tier 5
# A skill's own name as a player reads it (Bob, 23 Oct, 18:05): "HeavyArmor" isn't one, never shown bare.
SKILL_NAMES = {"Alchemy": "Alchemy", "Alteration": "Alteration", "Block": "Block", "Conjuration": "Conjuration",
               "Destruction": "Destruction", "Enchanting": "Enchanting", "HeavyArmor": "Heavy Armor", "Illusion": "Illusion",
               "LightArmor": "Light Armor", "Lockpicking": "Lockpicking", "Marksman": "Marksman", "OneHanded": "One-Handed",
               "Pickpocket": "Pickpocket", "Restoration": "Restoration", "Smithing": "Smithing", "Sneak": "Sneak",
               "Speechcraft": "Speech", "TwoHanded": "Two-Handed"}
BOSS_CHEST_EDID = re.compile(r"ChestBoss")  # "TreasBanditChestBoss", "TreasDraugrChestBoss"...
CRAFTING_FURN = {"CraftingBlackSmithForge": "a forge", "CraftingBlackSmithForgeWR": "a forge",
                 "CraftingBlackSmithForgeSkyforge": "the Skyforge", "CraftingBlacksmithAnvil": "an anvil",
                 "CraftingBlacksmithSharpeningWheel": "a sharpening wheel", "CraftingBlacksmithArmorWorkbench": "an armor workbench",
                 "CraftingEnchantingWorkbench": "an enchanting table", "CraftingEnchantingWorkbenchTabletop": "an enchanting table",
                 "CraftingAlchemyWorkbench": "an alchemy lab", "CraftingAlchemyWorkbenchTabletop": "an alchemy lab",
                 # WO-178: the smelter and the tanning rack stand beside the forge (Alvor's, at Riverwood), and each hold's own forge has its own record.
                 "CraftingSmelterMarker1": "a smelter", "EC_SS_SICraftingSmelterMarker": "a smelter", "MyrwatchTnE_CraftingSmelterMarker1_NoSmoke": "a smelter",
                 "CraftingTanningRackMarker": "a tanning rack", "EC_SS_CraftingTanningRackMarker": "a tanning rack",
                 "XJKVigilHallCraftingTanningRackMarker": "a tanning rack",
                 "CraftingRiftenBlackSmithForge": "a forge", "DLC1DawnguardCraftingBlackSmithForge": "a forge", "DLC2CraftingBlackSmithForge": "a forge",
                 "DLC2CraftingBlackSmithSkaalForge": "a forge", "CraftingBlackSmithForgeMorr": "a forge", "CraftingBlacksmithAnvilSky": "an anvil"}
SHRINE_ACTI = re.compile(r"(?i)shrineof")
SHRINE_NOISE = re.compile(r"(?i)trigger|approach|exit")  # a scene helper beside the real shrine, not the shrine itself
TRAP_EDID = re.compile(r"(?i)^trap")


def walk(km):
    return next((w for cutoff, w in WALK_BANDS if km < cutoff), "a long day's road")


# WO-166 (Bob, 27 Oct 21:50): the words call a place by a name that differs only slightly from the record's ("Yngol's Barrow" in a
# line, "Yngol Barrow" in the record). A candidate alias is one of a few ways a name is written differently; it becomes an alias
# only when the game's own text (dialogue, books, quest names) really uses it, and no other place has that name.
ALIAS_STRUCTURES = {"barrow", "cave", "caverns", "cavern", "mine", "hall", "keep", "tower", "fort", "camp", "hideout", "lair", "grotto",
                    "ruins", "tomb", "crypt", "house", "farm", "mill", "inn", "retreat", "redoubt", "sanctuary", "refuge", "rest", "watch"}


def alias_variants(name):
    """The other ways a name might be written: a leading "The" dropped (never added: "the Dawnstar" turns up in any speech and says
    nothing), a possessive dropped ("Yngol's Barrow") or added to a first word that names a person ("Yngol Barrow"), a hyphen for
    a space. Candidates only; each is checked against the text."""
    n = name.replace("’", "'")
    out = {n[4:]} if n.startswith("The ") else set()
    words = n.split()
    if "'s" in n:
        out.add(re.sub(r"'s\b", "", n))
    elif len(words) >= 2 and words[1].lower() in ALIAS_STRUCTURES and words[0][:1].isupper() and words[0].lower() not in ("the", "old", "new"):
        out.add(f"{words[0]}'s " + " ".join(words[1:]))
    if "-" in n:
        out.add(n.replace("-", " "))
    # Two words or more: "Hermit", "Midden" and "Rooftop" are English, and a one-word alias would link every "hermit" in the game.
    return {v for v in out if len(v.split()) >= 2 and v.lower() != n.lower()}


def _read(version, name):
    path = os.path.join(REPO, "gamedata", version, name)
    return json.load(open(path, encoding="utf-8")) if os.path.exists(path) else None


def home_cells(version):
    """[(person, the name of their home cell)] from people_raw.json (each person's first placed cell, their home); [] when it isn't built."""
    raw = _read(version, "people_raw.json")
    return [(p["name"], p["cell"]) for p in (raw or {}).get("people", []) if p.get("name") and p.get("cell")]


def book_cells(version):
    """The cell names book_places.json says a book is read or found in (each part of "Thalmor Embassy, Barracks, Thalmor Embassy"); [] when not built."""
    out, raw = [], _read(version, "book_places.json")

    def walk_json(o):
        if isinstance(o, dict):
            if isinstance(o.get("where"), str):
                out.extend(x.strip() for x in o["where"].split(",") if x.strip())
            for v in o.values():
                walk_json(v)
        elif isinstance(o, list):
            for v in o:
                walk_json(v)

    walk_json(raw or {})
    return out


# WO-166 Part 1. The nine cities are rows of type City: the one location in the load order with the capital's own name and the
# CWCapital keyword (as CAPITALS says), positioned by its own map marker, found by the marker's editor id ("WhiterunMapMarkerREF",
# "SolitudeMapmarkerRef"...: the game's own naming, which the city-overhaul mods don't touch, unlike the marker's icon type).
TOWNISH = {"City", "Town", "Settlement"}  # a place of these kinds never "covers" what is inside it: Esbern's Vault is Riften's, and its own place
# Every location a quest, a person's home or a book names that no place covers is a place (Bob, 27 Oct 21:50), whatever it is, with a `kind`
# from its keywords; never a hold (a region) or a capital (a City already). Fort Dawnguard and Thalmor Embassy carry no LocType at all.
# This supersedes WO-144's "houses, shops and jails are rooms, not destinations": a quest starts in them and a person lives in them.
# A name's own word, for a place the records give no kind to (a location with no LocType): a judgment call under WO-138 Part 5,
# kept to the four words that can't mean anything else. Anything else stays a Landmark.
NAME_KIND = {"fort": "Fort", "mine": "Mine", "cave": "Cave", "cavern": "Cave"}
# ...and for a building the records give no keyword to ("Ulrik's House" carries none): its name's word, used last.
HOUSE_WORDS = {"house": "House", "manor": "House", "lodge": "House", "barracks": "Barracks", "jail": "Jail", "inn": "Inn", "temple": "Temple"}
# What a house or a shop or a jail is: a stop, never a fight. Their people are the player's side.
NOT_A_FIGHT = {"House", "PlayerHouse", "Store", "Jail", "Barracks", "Building", "Castle", "Farm", "Mill"}
# A leftover Bethesda's demo builds and cut content left in the records: never a place a player can go to.
LEFTOVER = re.compile(r"(?i)unused|^E3Demo")
LEFTOVER_NAME = re.compile(r"(?i)^name tbd$")  # Dawnguard's own placeholder, a cave with no cells
TEMPLATE_NAMES = {"dungeon", "cave", "camp", "fort", "mine", "ruins", "ruin", "tower", "lair", "den", "hideout", "barrow", "temple"}  # WO-178 Part 3: a place can't be called just this
SAME_SPOT = 4096.0  # two places of one name this close (one exterior cell) are one place
# Named by hand, as the four Orc strongholds are: the one place WO-166 adds whose people are the player's side. Its actors summary read
# "Bandit, Troll, boss Isran, level 150" (the Dawnguard's own faction templates), which is no fight. Logged under the order.
FRIENDLY_NAMES = {"Fort Dawnguard", "Castle Volkihar"}
# WO-178: Riverwood's quests read "Season Unending" (the peace council, which never goes there) and left out "Before the Storm" (which does). The two
# records that bring the player to Riverwood, MQ102A (Hadvar's way: Alvor, Sigrid) and MQ102B (Ralof's way: Gerdur, Hod, Frodnar, with Riverwood as
# an alias location), are the two halves of Before the Storm (MQ102): each holds the parent in a script property and the parent holds both. Their
# records carry the name of MQ302, the peace council. A part goes under its quest's name.
# WO-178: the Missives mod's jobs ("Deliver a Letter Distant", "Deliver a Potion Far": 134 of them, one set for each town) were listed under every town
# they deliver to. They are radiant jobs, a class of their own in overrides.json (questClasses.missives).
RADIANT_PLUGINS = ("Missives",)
QUEST_PARTS = {"Skyrim.esm:02BF9C": "Skyrim.esm:04E50D", "Skyrim.esm:02610A": "Skyrim.esm:04E50D"}
OTHER_PLANES = {"Soul Cairn"}  # WO-178: a place on no map of Tamriel; the door-search position it was given belongs to the castle its portal opens in
OTHER_PLANE = []  # (name, the world and position the door search gave it): what the last build() took off the map, for the report
# WO-178: Castle Volkihar is the vampires' castle, Harkon's court and a lived-in place when you side with him, not a fort to clear (its record
# has no location keyword, so it read as a Fort, with "skeletons from level 1, up to 150" from the dungeon beneath it). Named by hand.
CASTLE_NAMES = {"Castle Volkihar"}
GENERIC_NAMES = {"sewers", "basement", "warehouses", "cellar", "catacombs"}  # a room, not a name: "Sewers" is Ben Erai's, in Gray Fox Cowl
DROPPED = []  # (name, edid, id, reason, kept-as): what the last build() took out, for the report
OFF_MAP = []  # (name, plugin, why): named by a quest, allowed by its keywords, and found on no map; for the report
MAPS = set()  # the worldspaces that are maps (place_pos.map_worlds), as the last build() found them; for the report
LOST_MARKER = []  # (place, the marker's name it claimed, the place that kept it): for the report
FARMS_OUT = []  # (id, name, the town its record sits under, found from): WO-171, the farms put on the map; for the report
OUTSIDE_WALLS = []  # (id, name, the city its record sits under, found from): WO-180 Part 4a, buildings whose door opens on Tamriel, not on the city; for the report
BIG_CITIES = {"Whiterun", "Windhelm", "Riften", "Solitude", "Markarth"}  # cities with a worldspace of their own: what is inside it is inside the walls
# Bob's rulings (WO-180 Part 4): these stand outside Whiterun's walls. The door search finds more that open on Tamriel (listed in the report as candidates, not moved:
# a city mod can open a house in the walls onto Tamriel), so a building moves only when it is named here and its door says so too.
OUTSIDE_RULED = {"Honningbrew Meadery", "Whiterun Stables"}
OUTSIDE_CANDIDATES = []  # (id, name, the city its record sits under): found by the door search, not ruled; for the report
FARMS_IN = []  # (name, town): WO-171, farms that stay in their village (no exterior cells of their own); for the report
DOOR_NAMED = []  # (the record's name, the name on the door, kind): WO-171; for the report
DOOR_SKIPPED = []  # (the record's name, the name on the door, why not): WO-171
INTERIOR_DROPPED = []  # (the record's name, the name without "Interior"): WO-171, Bob's second review
FARM_TYPED = []  # (name, the kind it was, Farm or Mill): WO-171, Bob's second review
STRAY_ACTORS = []  # (name, hold, count, the range it read, why it was dropped): WO-176, low actors that are not the place's fight
STRAY_CEILING = 3  # a placed creature of level 1 to 3 (a critter, a lone skeleton) in a place its own zone makes for higher levels, or whose war garrison comes later
TOWN_STRAY_CEILING = 6  # a town's residents, farm animals and guards, up to level 6 (Karthwasten's miners); a town with a real fight (Helgen, 30) keeps its levels
# WO-171: a farm or a mill is out in the fields, not in the town its record is parented to. A house, a shop and an inn are called by the name
# on their door, which is their cell's name; a dungeon's cells are its inner levels and are not.
FARM_KW = {"LocTypeFarm", "LocTypeLumberMill"}
DOOR_KINDS = {"House", "Store", "Inn", "PlayerHouse", "Building"}
FARM_WORDS = {"farm", "farmhouse", "stead", "mill", "sawmill", "plantation"}
# The LocType keywords that make a place, and those that rule one out (where people live, trade or rule).
PLACE_KW = {"LocTypeDungeon", "LocTypeCave", "LocTypeMine", "LocTypeMilitaryFort", "LocTypeAnimalDen", "LocTypeBanditCamp",
            "LocTypeDraugrCrypt", "LocTypeDwarvenAutomatons", "LocTypeFalmerHive", "LocTypeForswornCamp", "LocTypeGiantCamp",
            "LocTypeDragonLair", "LocTypeDragonPriestLair", "LocTypeHagravenNest", "LocTypeVampireLair", "LocTypeWarlockLair",
            "LocTypeSprigganGrove", "LocTypeShipwreck", "LocTypeClearable", "LocTypeMilitaryCamp", "LocTypeNordicRuin",
            "LocTypeDwemerRuin", "LocTypeShrine", "LocTypeTower", "LocTypeLandmark", "LocTypeMilitaryCampImperial",
            "LocTypeMilitaryCampStormcloak", "LocTypeAyleidRuin", "LocTypeHoldLocation"}
NOT_KW = {"LocTypeCity", "LocTypeTown", "LocTypeSettlement", "LocTypeDwelling", "LocTypePlayerHouse", "LocTypeHouse", "LocTypeInn",
          "LocTypeStore", "LocTypeCastle", "LocTypeJail", "LocTypeHold", "LocTypeHoldCapital", "LocTypeHoldMajor", "LocTypeHoldMinor",
          "LocTypeHabitation", "LocTypeTemple", "LocTypeGuild", "LocTypeBarracks", "LocTypeOrcStronghold", "LocTypeFarm",
          "LocTypeLumberMill", "LocTypeShip"}
TOWN_KW = {"LocTypeCity", "LocTypeTown", "LocTypeSettlement"}
KIND_WORDS = {"LocTypeCave": "Cave", "LocTypeMine": "Mine", "LocTypeMilitaryFort": "Fort", "LocTypeDraugrCrypt": "NordicRuin",
              "LocTypeDwarvenAutomatons": "DwemerRuin", "LocTypeBanditCamp": "Camp", "LocTypeForswornCamp": "Camp",
              "LocTypeGiantCamp": "GiantCamp", "LocTypeDragonLair": "DragonLair", "LocTypeShipwreck": "Shipwreck",
              "LocTypeFalmerHive": "Cave", "LocTypeAnimalDen": "Cave", "LocTypeHagravenNest": "Camp", "LocTypeVampireLair": "Cave",
              "LocTypeWarlockLair": "Cave", "LocTypeSprigganGrove": "Grove", "LocTypeDragonPriestLair": "NordicRuin"}


HELPER = re.compile(r"\b(Handler|Controller|Tracker|Dialogue|Misc|Retroactive|Scene|Reserve|Fix alias)\b")  # a quest no player sees as one (WO-178: "Fix alias CrimeSceneInvestigator if MS11 started...", a patch repair, was under Windhelm)


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def txt(v, loc, table):
    if loc and len(v) == 4:
        return (table or {}).get(struct.unpack_from("<I", v)[0], "")
    return v.rstrip(b"\0").decode("utf-8", "replace")


def clear_xp():
    """The [Clearing] and [Exploring] (discovery) XP for each kind of place, from the Experience.ini the active
    profile's highest mod gives (MO2 order)."""
    mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", active_profile(), "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
    for m in mods:  # modlist.txt lists the highest priority first
        p = os.path.join(ROOT, "mods", m, "SKSE", "Plugins", "Experience.ini")
        if os.path.exists(p):
            cp = configparser.ConfigParser(strict=False)
            cp.read(p, encoding="utf-8-sig")
            clear = {k[len("ixpclear"):].lower(): int(v) for k, v in cp["Clearing"].items()} if cp.has_section("Clearing") else {}
            disc = {k[len("ixpdisc"):].lower(): int(v) for k, v in cp["Exploring"].items()} if cp.has_section("Exploring") else {}
            return clear, disc, m
    return {}, {}, None


def respawn_days():
    """LoreRim/Requiem's reset days (WO-144 Part 1e): an ordinary cell and one that's been cleared. "MCM/Settings/
    Requiem.ini" is a shipped preset SkyUI's MCM loads as the active value when present; "MCM/Config/Requiem/
    settings.ini" is the mod's own declared default, read only for a key the preset doesn't set -- LoreRim's preset
    sets the ordinary days but not the cleared ones, so the cleared figure is the mod's own default, not a guess."""
    mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", active_profile(), "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]

    def find(rel, key):
        for m in mods:
            p = os.path.join(ROOT, "mods", m, *rel)
            if os.path.exists(p):
                cp = configparser.ConfigParser(strict=False)
                cp.read(p, encoding="utf-8-sig")
                sec = next((s for s in cp.sections() if cp.has_option(s, key)), None)
                if sec:
                    return int(cp[sec][key])
        return None

    cell = find(("MCM", "Settings", "Requiem.ini"), "iHoursToRespawnCell")
    cleared = (find(("MCM", "Settings", "Requiem.ini"), "iHoursToRespawnCellCleared") or
               find(("MCM", "Config", "Requiem", "settings.ini"), "iHoursToRespawnCellCleared"))
    return (cell // 24 if cell else None), (cleared // 24 if cleared else None)


def npc_level(v):
    """An NPC_ ACBS's level: (fixed level, scaling (multiple, min, max) or None, template flags)."""
    flags, = struct.unpack_from("<I", v, 0)
    lvl, cmin, cmax = struct.unpack_from("<hHH", v, 8)
    tflags = struct.unpack_from("<H", v, 18)[0] if len(v) >= 20 else 0
    return (None, (round(lvl / 1000, 2), cmin, cmax), tflags) if flags & 0x80 else (lvl, None, tflags)


def scan():
    pp, lo = plugin_paths(), load_order(cc=True)
    kw, locs, npcs, lvln, books, infos, quests, eczn, fact = {}, {}, {}, {}, {}, {}, {}, {}, {}
    # WO-144 Part 1e: word walls (by the word they teach, resolved to its shout below), skill books, boss chests,
    # crafting stations, shrines and traps -- each a placed REFR's base, matched by the records' own naming.
    woop_by_word, shou_by_woop = {}, collections.defaultdict(list)
    wordwall_acti, crafting, shrines, boss_chests, traps = {}, {}, {}, set(), set()
    for n in lo:  # pass 1: keywords, locations, actors, leveled lists, books, dialogue, quests (each the winning copy)
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        tables = (all_strings(p, n, loc, ROOT) or {}) if loc else {}
        res = lambda v: form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))  # noqa: E731
        for grp in ("KYWD", "LCTN", "NPC_", "LVLN", "BOOK", "ECZN", "FACT", "ACTI", "FURN", "CONT", "WOOP", "SHOU"):
            if grp.encode() not in buf:
                continue
            for o in iter_group(buf, grp):
                t, flags, fid, d = rec_data(buf, o)
                if t != grp:
                    continue
                key = form_id(resolve(fid, masters, n))
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
                full = next((txt(v, loc, strings) for s, v in subs if s == "FULL"), "").strip()
                if grp == "KYWD":
                    kw[key] = edid
                elif grp == "FACT":
                    fact[key] = edid
                elif grp == "WOOP":
                    if edid.startswith("Word") and len(edid) > 4:
                        woop_by_word[edid[4:]] = key
                elif grp == "SHOU":
                    if full:
                        for s, v in subs:
                            if s == "SNAM" and len(v) >= 4:
                                shou_by_woop[res(v)].append(full)
                elif grp == "ACTI":
                    m = WORD_WALL_ACTI.match(edid)
                    if m:
                        word = m.group(1)
                        wordwall_acti[key] = word[:-3] if word.endswith("xxx") and len(word) > 3 else word
                    elif SHRINE_ACTI.search(edid) and full and not SHRINE_NOISE.search(edid):
                        shrines[key] = full
                    elif TRAP_EDID.match(edid):
                        traps.add(key)
                elif grp == "FURN":
                    if edid in CRAFTING_FURN:
                        crafting[key] = CRAFTING_FURN[edid]
                elif grp == "CONT":
                    if BOSS_CHEST_EDID.search(edid):
                        boss_chests.add(key)
                elif grp == "LCTN":
                    kwda = next((v for s, v in subs if s == "KWDA"), b"")
                    locs[key] = {"edid": edid, "name": full, "plugin": n, "deleted": bool(flags & DELETED),
                                 "keywords": [form_id(resolve(struct.unpack_from("<I", kwda, i)[0], masters, n)) for i in range(0, len(kwda) - 3, 4)],
                                 "parent": next((res(v) for s, v in subs if s == "PNAM" and len(v) >= 4), None),
                                 "marker": next((res(v) for s, v in subs if s == "MNAM" and len(v) >= 4), None)}
                elif grp == "NPC_":
                    acbs = next((v for s, v in subs if s == "ACBS" and len(v) >= 14), None)
                    fixed, scaled, tflags = npc_level(acbs) if acbs else (None, None, 0)
                    kwda = next((v for s, v in subs if s == "KWDA"), b"")
                    acbs_flags = struct.unpack_from("<I", acbs, 0)[0] if acbs else 0
                    npcs[key] = {"name": full or None, "edid": edid, "level": fixed, "scaled": scaled, "useStats": bool(tflags & 2),
                                 "template": next((res(v) for s, v in subs if s == "TPLT" and len(v) >= 4 and struct.unpack_from("<I", v)[0]), None),
                                 "keywords": [form_id(resolve(struct.unpack_from("<I", kwda, i)[0], masters, n)) for i in range(0, len(kwda) - 3, 4)],
                                 "race": next((res(v) for s, v in subs if s == "RNAM" and len(v) >= 4), None),
                                 "sex": "female" if acbs_flags & 1 else "male",
                                 "factions": [form_id(resolve(struct.unpack_from("<I", v, i)[0], masters, n)) for s, v in subs if s == "SNAM"
                                              for i in range(0, len(v) - 7, 8)]}
                elif grp == "LVLN":
                    lvln[key] = {"edid": edid, "entries": [(struct.unpack_from("<H", v, 0)[0], form_id(resolve(struct.unpack_from("<I", v, 4)[0], masters, n)))
                                                           for s, v in subs if s == "LVLO" and len(v) >= 8]}
                elif grp == "BOOK":
                    desc = next((txt(v, loc, tables.get("DLSTRINGS") if loc else None) for s, v in subs if s == "DESC"), "")
                    books[key] = {"name": full or edid, "text": desc, "plugin": n, "edid": edid}
                elif grp == "ECZN":
                    # DATA (12 bytes), decoded by hand on Fort Hraggstad (Bob, 23 Oct): Owner (FormID, 4), Location
                    # (FormID, 4), Rank (int8), MinLevel (int8), Flags (uint8), MaxLevel (int8); max 0 means no cap.
                    data = next((v for s, v in subs if s == "DATA" and len(v) >= 12), None)
                    if data:
                        loc_fid = struct.unpack_from("<I", data, 4)[0]
                        eczn[key] = {"location": form_id(resolve(loc_fid, masters, n)) if loc_fid else None,
                                     "minLevel": data[9], "maxLevel": data[11], "flags": data[10]}
        if b"DIAL" in buf:
            topic = None
            for o in iter_group(buf, "DIAL"):
                t, flags, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                if t == "DIAL":
                    topic = next((res(v) for s, v in subs if s == "QNAM" and len(v) >= 4), None)
                    continue
                if t != "INFO":
                    continue
                lines = [txt(v, loc, tables.get("ILSTRINGS") if loc else None) for s, v in subs if s == "NAM1"]
                if not any(lines):
                    continue
                spk = None
                for s, v in subs:
                    if s == "CTDA" and len(v) >= 24 and struct.unpack_from("<H", v, 8)[0] == 72 and v[0] >> 5 == 0:
                        spk = form_id(resolve(struct.unpack_from("<I", v, 12)[0], masters, n))
                        break
                infos[form_id(resolve(fid, masters, n))] = {"lines": [l for l in lines if l], "speaker": spk, "quest": topic, "plugin": n}
        if b"QUST" in buf:
            got = qsc.read_plugin(buf, n, strings)
            for k, q in got["quests"].items():
                q["name"] = got["names"].get(k, {}).get("name") or got["names"].get(k, {}).get("edid") or k
                q["named"] = bool(got["names"].get(k, {}).get("name"))  # a scene holder or helper has no name a player sees
                quests[k] = q
    # Word wall -> the shout it teaches: the activator's own word (its EDID suffix) matched to the WOOP of the same
    # word, then the SHOU whose own word list (SNAM) names that WOOP -- a real record relationship each step, never
    # a guess at which shout a wall teaches. Resolved once pass 1 (every plugin) is in, so a word wall and its word's
    # WOOP/SHOU can sit in different plugins without an ordering problem.
    wordwall_shout = {}
    for k, word in wordwall_acti.items():
        wk = woop_by_word.get(word)
        shouts = shou_by_woop.get(wk) if wk else None
        if shouts:
            wordwall_shout[k] = shouts[0]
    # Pass 2: cells (name, location, worldspace), map markers, placed actors, where quests' forced references stand,
    # and where a word wall, a skill book, a boss chest, a crafting station, a shrine or a trap is placed.
    forced = {a["ref"] for q in quests.values() for a in q.get("aliases", {}).values() if a.get("ref")}
    cells, markers, actors, refcell, placed_npc, enable_info = {}, {}, {}, {}, {}, {}
    world_edid = {}
    persistent_at = {}  # WO-178: (world, grid x, grid y) of every place a persistent ref stands, until the cells are all known
    cell_features = collections.defaultdict(lambda: {"wordWall": None, "skillBooks": set(), "bossChest": False,
                                                       "crafting": set(), "shrines": set(), "traps": False})
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = name_strings(p, n, loc, ROOT) or {}
        for top in ("CELL", "WRLD"):
            if top.encode() not in buf:
                continue
            cell = world = None
            for o in iter_group(buf, top):
                t = buf[o:o + 4]
                if t not in (b"CELL", b"WRLD", b"REFR", b"ACHR"):
                    continue
                # Every REFR is parsed now (2 million of them, ~3.5s total -- timed, not assumed): a word wall,
                # skill book, boss chest, crafting station, shrine or trap needs its own base read the same as a
                # marker or a forced quest reference does, and there's no cheap way to tell which before parsing.
                tt, flags, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                key = form_id(resolve(fid, masters, n))
                if tt == "WRLD":
                    world = key
                    # WO-166: the worldspace's own editor id ("Tamriel", "DLC2SolstheimWorld"), the name a position is filed under.
                    edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
                    if edid:
                        world_edid[key] = edid
                    continue
                if tt == "CELL":
                    cell = key
                    c = cells.setdefault(key, {})
                    c["persistent"] = bool(flags & 0x400)  # WO-178: the world's persistent cell, whose refs stand anywhere in it
                    c["world"] = world if top == "WRLD" else None
                    c["worldEdid"] = world_edid.get(world) if top == "WRLD" else None
                    for s, v in subs:
                        if s == "FULL":
                            c["name"] = txt(v, loc, strings).strip()
                        elif s == "XLCN" and len(v) >= 4:
                            c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))
                        elif s == "XCLC" and len(v) >= 8 and top == "WRLD":
                            c["grid"] = struct.unpack_from("<ii", v)  # an exterior cell's own grid square (x, y); 4,096 units a side
                    continue
                pos = next((list(struct.unpack_from("<fff", v)) for s, v in subs if s == "DATA" and len(v) >= 12), None)
                # WO-144 Part 1e-2 (Bob, 23 Oct, 17:20): a ref's own "initially disabled" flag (0x800), edid and
                # enable parent (XESP) when it has one -- every REFR and ACHR carries this, not only actors, since
                # a Civil War garrison's actors aren't disabled themselves; they're enable-parented to a marker ref
                # that is (confirmed on Fort Hraggstad's Imperial Soldiers, enable-parented to
                # "CWGarrisonEnableMarkerImperialFortHraggstad"). An unrelated disabled enable-parent exists too
                # (Embershard Mine's wolves are parented to a leftover "E3demoMarker", also disabled, not a war
                # garrison): CWGarrisonEnableMarker's own naming -- the same convention across 100+ garrisons, both
                # sides, every fort and camp -- is the signal used below, never "disabled" alone.
                enable_info[key] = {"disabled": bool(flags & 0x800),
                                     "edid": next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), ""),
                                     "parent": next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs
                                                      if s == "XESP" and len(v) >= 4), None)}
                if tt == "REFR":
                    if key in forced:
                        refcell[key] = cell
                    # WO-166: a door's teleport link (XTEL: the door on the other side, then where you land and the flags), kept
                    # on its cell so a place's interior can be followed out to the world: cells[cell]["doors"][door] = {...}.
                    tel = next((v for s, v in subs if s == "XTEL" and len(v) >= 4), None)
                    if tel and pos is not None and cell in cells and not flags & DELETED:
                        cells[cell].setdefault("doors", {})[key] = {"pos": pos, "dest": form_id(resolve(struct.unpack_from("<I", tel)[0], masters, n))}
                    if any(s == "XMRK" for s, _ in subs):
                        mtype = next((v[0] for s, v in subs if s == "TNAM" and v), None)
                        markers[key] = {"cell": cell, "pos": pos, "type": MARKER.get(mtype), "deleted": bool(flags & DELETED),
                                        "name": next((txt(v, loc, strings) for s, v in subs if s == "FULL"), "").strip()}
                    rbase = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "NAME" and len(v) >= 4), None)
                    if rbase and cell and not (flags & DELETED):
                        # WO-178: a world's persistent cell holds refs that stand all over it (Alvor's forge at Riverwood); such a ref belongs to the
                        # exterior cell it stands in, found by its position once every cell is known (below).
                        pc = cells.get(cell) or {}
                        if pc.get("persistent") and pc.get("worldEdid") and pos is not None:
                            persistent_at[(pc["worldEdid"], int(pos[0] // 4096), int(pos[1] // 4096))] = None
                            f = cell_features[(pc["worldEdid"], int(pos[0] // 4096), int(pos[1] // 4096))]
                        else:
                            f = cell_features[cell]
                        if rbase in wordwall_shout:
                            f["wordWall"] = wordwall_shout[rbase]
                        elif rbase in boss_chests:
                            f["bossChest"] = True
                        elif rbase in crafting:
                            f["crafting"].add(crafting[rbase])
                        elif rbase in shrines:
                            f["shrines"].add(shrines[rbase])
                        elif rbase in traps:
                            f["traps"] = True
                        elif rbase in books:
                            m = SKILL_BOOK_EDID.match(books[rbase].get("edid", ""))
                            if m:
                                f["skillBooks"].add((m.group(1), books[rbase]["name"]))
                    continue
                base = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "NAME" and len(v) >= 4), None)
                lrt = next((v for s, v in subs if s == "XLRT"), b"")
                actors[key] = {"cell": cell, "base": base, "deleted": bool(flags & DELETED),
                               "boss": BOSS in {form_id(resolve(struct.unpack_from("<I", lrt, i)[0], masters, n)) for i in range(0, len(lrt) - 3, 4)}}
                if base and not flags & DELETED:
                    placed_npc.setdefault(base, cell)
    # WO-178: a persistent ref's features go to the exterior cell it stands in (the cell of that grid square in that world). Not its traps: a persistent
    # "trap" ref in a city or a pond is a scene or a puzzle piece, not a hazard to warn of (Windhelm, Solitude and Clearpine Pond would have gained one).
    by_grid = {(c["worldEdid"], c["grid"][0], c["grid"][1]): ck for ck, c in cells.items() if c.get("grid") and c.get("worldEdid") and not c.get("persistent")}
    for gk in persistent_at:
        got, ck = cell_features.pop(gk), by_grid.get(gk)
        if ck:
            into = cell_features[ck]
            into["wordWall"] = into["wordWall"] or got["wordWall"]
            into["bossChest"] = into["bossChest"] or got["bossChest"]
            for k in ("skillBooks", "crafting", "shrines"):
                into[k] |= got[k]
    return kw, locs, npcs, lvln, books, infos, quests, cells, markers, actors, refcell, placed_npc, eczn, fact, cell_features, enable_info, forced


def level_entries(base, npcs, lvln, gate=0, depth=0, seen=None, cache=None):
    """Every leaf level reachable from base, each with the player level a leveled list's own entry needs before it
    can be picked at all (the max `LVLO` level stored on the path to it -- Bob, 23 Oct, 17:10: that field is the
    real gate the game checks, not the output level; using it as a gate, not a guess at the output, is what makes
    `atLevel` possible). [(gate, low, high, words), ...], not deduplicated (the caller dedupes once, at the place)."""
    cache = {} if cache is None else cache
    key = (base, gate)
    if key in cache:
        return cache[key]
    seen = seen if seen is not None else set()
    if depth > 12 or not base or base in seen:
        return []
    seen = seen | {base}
    if base in npcs:
        n = npcs[base]
        # A template's stats (its level) when the actor uses them (ACBS template flags, "use stats").
        if n["template"] and (n.get("useStats") or (n["level"] in (None, 0) and not n["scaled"])):
            got = level_entries(n["template"], npcs, lvln, gate, depth + 1, seen, cache)
            if got:
                cache[key] = got
                return got
        if n["scaled"]:
            mult, lo, hi = n["scaled"]
            words = (f"matches your level, {lo} to {hi}" if hi else f"matches your level, from {lo}") if mult == 1 else (
                f"your level x{mult:g}" + (f" ({lo}-{hi})" if hi else f" (from {lo})"))
            r = [(gate, lo or 1, hi or 81, words)]
            cache[key] = r
            return r
        if n["level"]:
            r = [(gate, n["level"], n["level"], f"level {n['level']}")]
            cache[key] = r
            return r
        return []
    if base in lvln:
        out = []
        for lvl, tgt in lvln[base]["entries"]:
            out += level_entries(tgt, npcs, lvln, max(gate, lvl), depth + 1, seen, cache)
        cache[key] = out
        return out
    return []


def resolve_npc(base, npcs, lvln, depth=0, seen=None):
    """The one representative NPC_ a leveled-list token stands for (its first entry, recursively) -- a kind's
    tiers are almost always the same creature at a different level, so one path is enough to tell what lives there."""
    seen = seen if seen is not None else set()
    if depth > 12 or not base or base in seen:
        return None
    if base in npcs:
        return base
    if base in lvln and lvln[base]["entries"]:
        return resolve_npc(lvln[base]["entries"][0][1], npcs, lvln, depth + 1, seen | {base})
    return None


def kind_of(base, npcs, lvln, fact, depth=0):
    """What an actor is, from its own faction list (template-resolved, same depth limit as level_of): a faction
    whose EDID *ends with* "<Kind>Faction", generic or location-specific ("dunValtheimKeepBanditFaction") alike.
    The *end* matters: a Wolf carries "SprigganPredatorFaction" (what it's prey to, not what it is) alongside its
    own "WolfFaction" -- a plain substring check would have called it a Spriggan. A template can itself be a
    leveled list (resolved the same way level_entries resolves one), not only another NPC_ directly."""
    if depth > 6 or not base or base not in npcs:
        return None
    n = npcs[base]
    for f in n.get("factions") or []:
        edid = fact.get(f, "")
        for word in KINDS:
            if edid.endswith(word + "Faction"):
                return word
    if n.get("template"):
        tpl = resolve_npc(n["template"], npcs, lvln)
        if tpl and tpl != base:
            return kind_of(tpl, npcs, lvln, fact, depth + 1)
    return None


def level_of(base, npcs, lvln, depth=0, cache=None, seen=None):
    """(low, high) levels a placed actor can have, ever (no level gate), and its words: "level 12",
    "matches your level, 5 to 30", "leveled 4-40". A convenience wrapper on level_entries for a single actor
    (the boss's own display) and the old tests; a place's own floor/ceiling/atLevel use level_entries directly."""
    entries = level_entries(base, npcs, lvln, 0, depth, seen, cache)
    if not entries:
        return None
    lo, hi = min(e[1] for e in entries), max(e[2] for e in entries)
    if lo == hi:
        return (lo, hi, entries[0][3])
    if all(e[3].startswith(("matches your level", "your level x")) for e in entries):
        return (lo, hi, f"matches your level, {lo} to {hi}")
    return (lo, hi, f"leveled {lo}-{hi}")


def build(version):
    # `forced_refs` (quest alias references) is scan()'s own, not used here: it can't tell an always-present named
    # actor who merely has a quest built around them (Septimus Signus, Halted Stream Camp's chief) from one truly
    # absent at the start (Molag Bal at Stendarr's Beacon, a Thalmor commander at Lost Prospect Mine) -- tried and
    # reverted (it dropped the first kind along with the second); logging the gap rather than guessing which is
    # which. Nothing static distinguishes them: no enable parent, no disabled flag, no quest-alias signal that
    # means only "absent at the start". A later, deeper read of the quest's own stages could.
    kw, locs, npcs, lvln, books, infos, quests, cells, markers, actors, refcell, placed_npc, eczn, fact, cell_features, enable_info, _forced_refs = scan()
    xp, disc_xp, xp_from = clear_xp()
    cell_days, cleared_days = respawn_days()
    kname = lambda ks: {kw.get(k, k) for k in ks}  # noqa: E731
    del DROPPED[:], OFF_MAP[:], LOST_MARKER[:], FARMS_OUT[:], OUTSIDE_WALLS[:], OUTSIDE_CANDIDATES[:], FARMS_IN[:], DOOR_NAMED[:], DOOR_SKIPPED[:], INTERIOR_DROPPED[:], FARM_TYPED[:], STRAY_ACTORS[:], OTHER_PLANE[:]
    marker_of = {k: markers.get(l["marker"]) for k, l in locs.items() if l.get("marker") in markers and not markers[l["marker"]]["deleted"]}
    marker_world = lambda m: pp.canon((cells.get(m["cell"]) or {}).get("worldEdid"))  # noqa: E731  (the five city worlds are Tamriel's own coordinates)

    def chain(k):
        out, seen = [], set()
        while k and k in locs and k not in seen:
            seen.add(k)
            out.append(k)
            k = locs[k]["parent"]
        return out

    # WO-166: the maps, the doors, and the cells under each location (its own and its child locations': a dungeon's inner levels).
    maps, doors = pp.map_worlds(cells, markers), pp.door_index(cells)
    MAPS.clear()
    MAPS.update(maps)
    cells_of_loc = collections.defaultdict(list)
    for ck, c in cells.items():
        if c.get("location"):
            cells_of_loc[c["location"]].append(ck)
    cells_under = collections.defaultdict(list)
    for loc_key, cks in cells_of_loc.items():
        for anc in chain(loc_key):
            cells_under[anc].extend(cks)
    # Each capital's own map marker, by editor id: exactly one, or none (never a guess).
    city_marker = {}
    for mk_key, mk in markers.items():
        edid = (enable_info.get(mk_key) or {}).get("edid", "").lower()
        for cap in CAPITALS:
            if edid in (cap.lower() + "mapmarker", cap.lower() + "mapmarkerref") and not mk["deleted"] and mk.get("pos"):
                city_marker.setdefault(cap, []).append(mk_key)
    city_marker = {cap: ks[0] for cap, ks in city_marker.items() if len(ks) == 1}

    def hold_of(k):
        return next((locs[x]["name"] for x in chain(k)[1:] if "LocTypeHold" in kname(locs[x]["keywords"]) and locs[x]["name"]), None)

    # Towns are the named markers in CAPITALS and SETTLEMENTS themselves, never any marker trusted by its TNAM type (WO-144
    # Part 1): a marker's "City"/"Town" icon is unreliable in this load order (see CAPITALS), and some non-towns carry it.
    # A capital with an anchor (CAPITAL_ANCHOR) is looked up by the anchor's name but kept under the capital's own name.
    by_marker_exact = collections.defaultdict(list)
    for mk in markers.values():
        if not mk["deleted"] and mk.get("pos") and mk.get("name"):
            by_marker_exact[mk["name"]].append(mk)

    def one_marker(name):
        ms = by_marker_exact.get(CAPITAL_ANCHOR.get(name, name)) or []
        return ms[0] if len(ms) == 1 else None  # never a guess when the name is missing or ambiguous

    towns = [(nm, one_marker(nm)) for nm in (CAPITALS | SETTLEMENTS)]
    towns = [(nm, mk) for nm, mk in towns if mk]
    cities = [(nm, mk) for nm, mk in towns if nm in CAPITALS]
    by_marker_name = collections.defaultdict(list)  # a marker's own name -> the keys of the markers that carry it
    for mk_key, m in markers.items():
        if not m["deleted"] and m["name"]:
            by_marker_name[m["name"]].append(mk_key)
    # A building's own cell name, as a player reads it ("Mistveil Keep", not "Riften Mistveil Keep"): the shortest of
    # its cells' names, since a keep or inn's main hall is always named plainer than its own sub-rooms (Bob, 23 Oct).
    cell_names_of = collections.defaultdict(set)
    for c in cells.values():
        if c.get("location") and c.get("name"):
            cell_names_of[c["location"]].add(c["name"])
    places = {}
    for k, l in locs.items():
        if l["deleted"] or not l["name"]:
            continue
        names = kname(l["keywords"])
        # Its map marker: the one the location names, else the one with its own name (when that's the only one). A capital's
        # is its own "<Name>MapMarker" (WO-166), whatever icon the city overhauls gave it.
        is_capital = l["name"] in CAPITALS and "CWCapital" in names
        mk_key = (city_marker.get(l["name"]) if is_capital else
                  l.get("marker") if marker_of.get(k) else
                  by_marker_name[l["name"]][0] if len(by_marker_name.get(l["name"], [])) == 1 else None)
        m = markers.get(mk_key) if mk_key else None
        mtype = (m or {}).get("type")
        up = chain(k)[1:]
        inside_town = any((TOWN_KW | {"LocTypeDwelling", "LocTypeHouse", "LocTypePlayerHouse", "LocTypeCastle"}) & kname(locs[x]["keywords"]) for x in up[:1])
        # A dungeon near a town is often parented to it (Shroud Hearth Barrow to Ivarstead): only a location with no place
        # keyword or marker of its own is ruled out by its parent.
        named = l["name"] in NAMED_PLACES
        is_keep = KEEP_KW in names
        is_stable = "LocTypeStables" in names  # a strong keyword of its own: skip the generic disqualifiers entirely
        generic_building = (bool(names & BUILDING_KW) and not (names & NOT_BUILDING_KW) and not (names & PLACE_KW)
                             and l["name"] not in NOT_BUILDINGS)  # item 3: temples, inns, guild halls, keeps, stables
        building = is_keep or is_stable or generic_building
        bypass = named or building or is_capital
        if not bypass and (names & NOT_KW or mtype in NOT_PLACES or (inside_town and not (names & PLACE_KW or mtype))):
            continue
        if not bypass and not (names & PLACE_KW or (mtype and mtype not in NOT_PLACES)):
            continue
        if is_capital:
            kind = "City"
        elif is_keep:
            kind = "Keep"
        elif is_stable:
            kind = "Stables"  # never "Stable": that's still a mislabelled marker's own type, in NOT_PLACES
        elif generic_building:
            kind = next(w for kw2, w in (("LocTypeTemple", "Temple"), ("LocTypeInn", "Inn"), ("LocTypeGuild", "Guild")) if kw2 in names)
        else:
            kind = mtype or next((KIND_WORDS[x] for x in sorted(names) if x in KIND_WORDS), None) or "Landmark"
        in_town = next((locs[x]["name"] for x in up if locs[x].get("name") in (CAPITALS | SETTLEMENTS)), None) if building else None

        # The map's name when it only extends the record's ("Embershard" -> "Embershard Mine"); never another place's (a mod's
        # Morvunskar Crypts that points at Bleak Falls Barrow's marker keeps its own name). A building's own cell's
        # name instead, when it's shorter than the record's ("Mistveil Keep", not "Riften Mistveil Keep").
        cell_shown = min(cell_names_of.get(k, ()), key=len, default=None) if building else None
        shown = (cell_shown if cell_shown and len(cell_shown) < len(l["name"]) else
                 m["name"] if (m or {}).get("name") and l["name"].lower() in m["name"].lower() else l["name"])
        places[k] = {"id": k, "name": shown, **({"recordName": l["name"]} if shown != l["name"] else {}), "edid": l["edid"], "type": kind, "keywords": sorted(x for x in names if x.startswith("LocType")),
                     "hold": hold_of(k), "nearestTown": None, "nearestCity": None, "inTown": in_town, "plugin": l["plugin"], "marker": mk_key if m else None}
        if l["name"] in STRONGHOLDS and infos.get(STRONGHOLD_GATE):
            gate = infos[STRONGHOLD_GATE]
            places[k]["enters"] = {"words": " ".join(gate["lines"]), "record": f"INFO {STRONGHOLD_GATE} ({gate['plugin']})"}
    # ---- WO-166 Part 1: where each place is, the cities, the places quests name, and the places listed twice ----
    # A marker two places claim goes to the one it is named for: Morvunskar Crypts' own record points at Bleak Falls Barrow's marker,
    # which put it "next to Riverwood". The other looks for a position of its own below.
    def fit(place_name, marker_name):
        """How well a marker's name fits a place's: 0 the same name, 1 the marker's name holds the place's, 2 the reverse, 3 they share a
        distinctive word ("The Shadow Stone" and "The Shadow Doomstone"; the Thief Doomstone's record borrows that marker and shares none),
        4 nothing in common."""
        a, b = place_name.lower(), (marker_name or "").lower()
        if a == b:
            return 0
        if a in b:
            return 1
        if b and b in a:
            return 2
        sig = lambda s: {w for w in re.findall(r"[a-z']+", s) if w not in ("the", "of", "and", "a", "stone", "stones", "doomstone")}  # noqa: E731
        return 3 if sig(a) & sig(b) else 4

    def resolve_claims():
        """A marker several places name goes to the one it is named for. Those that fit it worse lose it; so do all of a tie between
        different names (the two Doomstones on one marker: nothing says whose it is). Returns the places that lost one."""
        claims, lost = collections.defaultdict(list), []
        for k, p in places.items():
            if p["marker"]:
                claims[p["marker"]].append(k)
        for mk_key, ks in claims.items():
            if len(ks) < 2:
                continue
            fits = {k: fit((locs.get(k) or {}).get("name") or places[k]["name"], markers[mk_key]["name"]) for k in ks}
            best = min(fits.values())
            winners = [k for k in ks if fits[k] == best]
            tied = len(winners) > 1 and len({places[k]["name"].lower() for k in winners}) > 1
            for k in ks:
                if fits[k] > best or tied:
                    places[k]["marker"] = None
                    LOST_MARKER.append((places[k]["name"], markers[mk_key]["name"], "nobody: the names tie" if tied else ", ".join(sorted(places[x]["name"] for x in winners))))
                    lost.append(k)
        return lost

    resolve_claims()

    def why_not(k):
        cks = cells_under.get(k, [])
        if not cks:
            return "no cells: a location nothing is placed in"
        if not any(cells[c].get("doors") for c in cks):
            return "interior cells with no door at all"
        return f"interior cells whose doors lead nowhere onto a map (looked {pp.MAX_HOPS} rooms deep)"

    def farm_out(k, p):
        """WO-171: a farm or mill whose location owns exterior cells of its own stands in a field, outside the town its record is parented to
        (Battle-Born, Pelagia and Chillfurrow under Whiterun; 0.14 to 0.27 km from it). Its position is its door out (the farmhouse, exact), else
        the middle of its field's cells. A farm with no exterior cells of its own is in the village (Rorikstead's, Falkreath's, Kynesgrove's:
        20 to 100 m from the town's marker) and stays `inTown`. The location is its own, or the one it is the house of."""
        if k not in locs:
            return None
        parent = locs[k]["parent"]
        farm = (k if FARM_KW & kname(locs[k]["keywords"]) else
                parent if parent in locs and FARM_KW & kname(locs[parent]["keywords"]) and p["type"] in ("House", "Building") else None)
        if farm is None or locs[farm]["name"] == p["inTown"]:
            return None  # Anga's Mill is a mill and a settlement at once: its houses are in it
        field = [c for c in cells_of_loc.get(farm, ()) if cells[c].get("grid")]
        if not field:
            FARMS_IN.append((p["name"], p["inTown"]))
            return None
        for got in (pp.at_doors(cells_under.get(k, []), cells, doors, maps), pp.at_cells(field, cells)):
            if got and got["world"] in maps:
                return got
        return None

    def outside_walls(k, p):
        """WO-180 Part 4a: a city's record is the parent of buildings that stand outside it (Honningbrew Meadery and Whiterun Stables, next to Whiterun
        and under its location). A city is a worldspace of its own, and what is in the city has doors that open onto it; a building whose way out opens
        on Tamriel itself is outside the walls, a place of its own with its door as its position, and its city stays its nearest town."""
        if p["inTown"] not in BIG_CITIES or k not in locs:
            return None
        got = pp.at_doors(cells_under.get(k, []), cells, doors, maps)
        if got and got["world"] in maps and got.get("rawWorld") not in pp.CITY_WORLDS:
            if p["name"] in OUTSIDE_RULED:
                return got
            OUTSIDE_CANDIDATES.append((k, p["name"], p["inTown"]))
        return None

    def place_it(k, p):
        """Its position, by place_pos.py's order of trust; a place in a town has none of its own, but a farm in a field has."""
        if p.get("inTown"):
            got = farm_out(k, p)
            if got:
                FARMS_OUT.append((k, p["name"], p["inTown"], got["posFrom"]))
            else:
                got = outside_walls(k, p)
                if got:
                    OUTSIDE_WALLS.append((k, p["name"], p["inTown"], got["posFrom"]))
            if not got:
                return
            p["world"], p["pos"], p["posFrom"], p["inTown"] = got["world"], got["pos"], got["posFrom"], None
            return
        got = pp.locate(markers.get(p["marker"]) if p["marker"] else None, cells_under.get(k, []), cells, doors, maps)
        if got:
            p["world"], p["pos"], p["posFrom"] = got["world"], got["pos"], got["posFrom"]
        else:
            p["noPos"] = why_not(k)

    for k, p in places.items():
        place_it(k, p)
    # WO-166 (Bob, 27 Oct 21:50): every location a named quest, a person's home or a book names is a place, whatever it is -- a fort, an
    # inn, a house, a shop, a jail -- with a `kind` that tells them apart. A quest names a location by an alias or by the cell a forced
    # reference stands in; a person's home is their first placed cell (people_raw.json), a book's place a cell it is found or read in
    # (book_places.json): each cell's name, taken only when exactly one location owns an interior cell of that name. A town or city
    # never covers what is inside it. What is inside a town has `inTown` and no position; the rest needs a position on a map.
    # A cell that belongs to no location ("Green-Tip Cabin") is a place by itself: its key is the cell's own.
    interior_by_name, loose_by_name = collections.defaultdict(set), collections.defaultdict(set)
    for ck, c in cells.items():
        if c.get("name") and not c.get("grid"):
            if c.get("location") in locs:
                interior_by_name[c["name"].lower()].add(c["location"])
            elif not c.get("location"):
                loose_by_name[c["name"].lower()].add(ck)

    def named_place_of(cell_name):
        """The one location, else the one location-less cell, an interior cell of this name belongs to; None when none or several do."""
        n = (cell_name or "").lower()
        owners = interior_by_name.get(n) or loose_by_name.get(n)
        return next(iter(owners)) if owners and len(owners) == 1 else None

    named_by = collections.defaultdict(lambda: {"quests": set(), "homes": set(), "books": set()})
    for q in quests.values():
        if not q.get("named") or HELPER.search(q["name"]):
            continue
        for a in q.get("aliases", {}).values():
            rc = refcell.get(a.get("ref")) if a.get("ref") else None
            rcell = cells.get(rc) or {}
            for qloc in (a.get("location"), rcell.get("location") or (rc if rcell.get("name") and not rcell.get("grid") else None)):
                if qloc:
                    named_by[qloc]["quests"].add(q["name"])
    for person, cell_name in home_cells(version):
        if named_place_of(cell_name):
            named_by[named_place_of(cell_name)]["homes"].add(person)
    for cell_name in book_cells(version):
        if named_place_of(cell_name):
            named_by[named_place_of(cell_name)]["books"].add(cell_name)
    TOWN_KINDS = {"LocTypeCity": "City", "LocTypeTown": "Town", "LocTypeSettlement": "Settlement"}
    # A building's kind by its keywords, the first that matches: an inn tagged LocTypeHouse as well is still an inn.
    BUILDING_KINDS = (("LocTypeInn", "Inn"), ("LocTypeTemple", "Temple"), ("LocTypeGuild", "Guild"), ("LocTypeStables", "Stables"),
                      ("LocTypeJail", "Jail"), ("LocTypeBarracks", "Barracks"), ("LocTypeStore", "Store"),
                      ("LocTypePlayerHouse", "PlayerHouse"), ("LocTypeHouse", "House"), ("LocTypeCastle", "Castle"), ("LocTypeDwelling", "Building"))
    off_map = []  # (name, plugin, why): named by a quest, a home or a book, and found on no map
    added = set()  # the places this step adds
    for qloc in sorted(named_by, key=lambda x: (len(chain(x)), x)):  # shallowest first: a mansion covers its wings
        l = locs.get(qloc)
        if l is None and qloc in cells:  # a cell of no location: a record of its own, with no keywords, parents or hold
            l = {"name": cells[qloc].get("name"), "edid": "", "plugin": qloc.split(":")[0], "keywords": [], "deleted": False, "parent": None, "marker": None}
            cells_under[qloc] = [qloc]
        if not l or l["deleted"] or not l["name"] or qloc in places or LEFTOVER.search(l["edid"]) or LEFTOVER_NAME.match(l["name"]) or l["name"] in CAPITALS:
            continue
        src = named_by[qloc]
        covered_by = [x for x in chain(qloc) if x in places and places[x]["type"] not in TOWNISH]
        # A place of the index already covers it -- except one this step just added, which covers only a room (named by one quest):
        # Fort Dawnguard, named by three, is a destination in its own right although Dayspring Canyon, which it sits in, came first.
        if covered_by and not (all(x in added for x in covered_by) and len(src["quests"]) >= 2):
            continue
        names = kname(l["keywords"])
        if "LocTypeHold" in names or "CWCapital" in names:
            continue
        mk_key = (l.get("marker") if marker_of.get(qloc) else
                  by_marker_name[l["name"]][0] if len(by_marker_name.get(l["name"], [])) == 1 else None)
        mk = markers.get(mk_key) if mk_key else None
        # Inside a town: an ancestor that is a capital, a settlement or a town of the index -- never a hold (Whiterun Hold is named "Whiterun"
        # too, and every farm in it sits under it).
        town = next((locs[x]["name"] for x in chain(qloc)[1:] if locs[x].get("name") and "LocTypeHold" not in kname(locs[x]["keywords"]) and
                     (locs[x]["name"] in (CAPITALS | SETTLEMENTS) or (x in places and places[x]["type"] in TOWNISH))), None)
        if not town:
            got = pp.locate(mk, cells_under.get(qloc, []), cells, doors, maps)
            if not got or got["world"] not in maps:
                off_map.append((l["name"], l["plugin"], "no position" if not got else f"only inside {got['world']}, which is no map"))
                continue
        words = {w.lower() for w in re.findall(r"[A-Za-z']+", l["name"])}
        # Its keywords first (a Store in a fort is a Store), then its name's word, then nothing: a Landmark. Bob's WO-144 cleaning pass holds for
        # an Inn, a Temple or a Guild: not one on his named list, nor one tagged a city, a fort or a bandit camp. His LocTypeHouse and
        # LocTypePlayerHouse rule does not: it kept Nightgate Inn (tagged LocTypeHouse as well as LocTypeInn) out of the inns, and it is an inn.
        # A location tagged a house as well as an inn is an inn only if its name says so ("Nightgate Inn", not "Home of Thane Alarik").
        house_tagged = bool(names & {"LocTypeHouse", "LocTypePlayerHouse"})
        bld_ok = l["name"] not in NOT_BUILDINGS and not (names & (NOT_BUILDING_KW - {"LocTypeHouse", "LocTypePlayerHouse"}))
        kind = ((mk or {}).get("type") if (mk or {}).get("type") not in NOT_PLACES else None) or \
            next((KIND_WORDS[x] for x in sorted(names) if x in KIND_WORDS), None) or \
            next((TOWN_KINDS[x] for x in sorted(names) if x in TOWN_KINDS), None) or \
            next((v for x, v in BUILDING_KINDS if x in names and (v not in ("Inn", "Temple", "Guild") or (bld_ok and (not house_tagged or v.lower() in words)))), None) or \
            next((v for w, v in NAME_KIND.items() if w in words), None) or \
            next((v for w, v in HOUSE_WORDS.items() if w in words), None) or "Landmark"
        places[qloc] = {"id": qloc, "name": l["name"], "edid": l["edid"], "type": kind, "keywords": sorted(x for x in names if x.startswith("LocType")),
                        "hold": hold_of(qloc), "nearestTown": None, "nearestCity": None, "inTown": town, "plugin": l["plugin"],
                        "marker": mk_key if mk else None,
                        "namedBy": sorted(k for k in ("quests", "homes", "books") if src[k])}
        if src["quests"]:
            places[qloc]["namedByQuest"] = sorted(src["quests"])[:3]
        if src["homes"]:
            places[qloc]["homeOf"] = sorted(src["homes"])[:3]
        place_it(qloc, places[qloc])
        added.add(qloc)
    # The places just added name markers too (four farms' houses on one farm's marker): the same rule, and what lost a marker is placed again.
    for k in resolve_claims():
        for f in ("world", "pos", "posFrom", "noPos"):
            places[k].pop(f, None)
        place_it(k, places[k])
    # A bare "Sewers" or "Warehouses" is a room of the place above it: named for it ("Ben Erai Sewers"), not left as a place anyone could mean.
    for k, p in places.items():
        parent = chain(k)[1] if len(chain(k)) > 1 else None
        if p["name"].lower() in GENERIC_NAMES and parent and locs[parent].get("name") and "LocTypeHold" not in kname(locs[parent]["keywords"]) \
                and locs[parent]["name"].lower() != p["name"].lower():
            p["name"] = f"{locs[parent]['name']} {p['name']}"
    # The same place listed twice (Bob counted 34 surplus rows of 52). Out first: a leftover of a demo or cut content. Then
    # entries of one name that are one place: one inside the other (a sub-location), on one map marker, or on one spot (one
    # exterior cell). Names shared by places that are NOT one (eight Imperial camps, three Halls of the Dead) are left alone: they
    # are in different towns or at different spots.
    absorbed = {}
    for k in [k for k, p in places.items() if LEFTOVER.search(p["edid"]) or LEFTOVER_NAME.match(p["name"])]:
        DROPPED.append((places[k]["name"], places[k]["edid"], k, "a demo or cut-content leftover (its editor id or name says so)", None))
        del places[k]
    # WO-178 Part 3: a location named only by the common word for what it is ("Dungeon") and not on the map is a template a quest or radiant system fills
    # in, not a place a player can name: no page of its own, and every sentence with the word in it was "pointing" at it.
    for k in [k for k, p in places.items() if p["name"].lower() in TEMPLATE_NAMES and not p.get("marker")]:
        DROPPED.append((places[k]["name"], places[k]["edid"], k, "a template location: a bare common noun for a kind of place, and no marker of its own on the map", None))
        del places[k]
    by_name = collections.defaultdict(list)
    for k, p in places.items():
        by_name[p["name"].lower()].append(k)

    def same_place(a, b):
        pa, pb = places[a], places[b]
        if a in chain(b)[1:] or b in chain(a)[1:]:
            return "inside it"
        if pa["marker"] and pa["marker"] == pb["marker"]:
            return "the same map marker"
        if pa.get("inTown") and pa["inTown"] == pb.get("inTown"):
            return "the same name in the same town"  # Angeline's Aromatics twice in Solitude: one shop, recorded by a mod as well
        if pa.get("pos") and pb.get("pos") and pa["world"] == pb["world"] and \
                sum((x - y) ** 2 for x, y in zip(pa["pos"][:2], pb["pos"][:2])) ** 0.5 <= SAME_SPOT:
            return "the same spot"
        return None

    for ks in by_name.values():
        if len(ks) < 2:
            continue
        group = {k: k for k in ks}  # union-find over the pairs that are one place

        def root(x):
            while group[x] != x:
                x = group[x]
            return x

        for i, a in enumerate(ks):
            for b in ks[i + 1:]:
                if same_place(a, b):
                    group[root(a)] = root(b)
        comps = collections.defaultdict(list)
        for k in ks:
            comps[root(k)].append(k)
        for comp in comps.values():
            if len(comp) < 2:
                continue
            # The one kept: the one the others are inside of, else one with a map marker, else the base game's, else the earliest record.
            keep = min(comp, key=lambda x: (not any(x in chain(o)[1:] for o in comp if o != x), places[x]["marker"] is None,
                                            not x.startswith("Skyrim.esm"), x))
            for k in comp:
                if k != keep:
                    DROPPED.append((places[k]["name"], places[k]["edid"], k, "the same place as the entry kept: " + (same_place(k, keep) or "linked through another entry of its name"), places[keep]["edid"]))
                    places[keep].setdefault("alsoRecordedAs", []).append({"id": k, "edid": places[k]["edid"], "plugin": places[k]["plugin"]})
                    absorbed[k] = keep
                    del places[k]
    # WO-171 (Bob, 28 Oct, second review): "Interior" is the editor's word for a farm's inside, not a name: "Sarethi Farm Interior" is Sarethi
    # Farm. Dropped where that leaves a name no other place has; the record's stays as `recordName`.
    for k, p in places.items():
        bare = re.sub(r"\s+Interior$", "", p["name"])
        if bare != p["name"] and bare and not any(q["name"].lower() == bare.lower() for q in places.values()):
            INTERIOR_DROPPED.append((p["name"], bare))
            p.setdefault("recordName", p["name"])
            p["name"] = bare
    # WO-171 (Bob, 28 Oct): the name on the door. A house, shop or inn whose location has one interior cell name, and that name is not the
    # record's, is called by the cell's: "Lucan's Dry Goods" is the Riverwood Trader, "Sven's House" is Sven and Hilde's House. The record's
    # name stays as an alias (below). Not when one name holds the other (a town's name dropped from the front: "Skaal Village Edla's House" and the
    # cell "Edla's House" is only shorter), not a room's bare name, and not when it would make two places one name.
    norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower().replace("&", "and"))  # noqa: E731
    door = {}
    for k, p in places.items():
        if p["type"] not in DOOR_KINDS or k not in locs:
            continue
        cell_names = {cells[c]["name"] for c in cells_of_loc.get(k, ()) if cells[c].get("name") and not cells[c].get("grid")}
        if len(cell_names) != 1:
            continue
        cn = next(iter(cell_names))
        a, b = norm(cn), norm(p["name"])
        if a == b:
            continue
        farm_word = lambda s: bool(FARM_WORDS & set(re.findall(r"[a-z]+", s.lower())))  # noqa: E731
        if a in b or b in a:
            DOOR_SKIPPED.append((p["name"], cn, "one name holds the other"))
        elif cn.lower() in GENERIC_NAMES:
            DOOR_SKIPPED.append((p["name"], cn, "a room's bare name"))
        elif farm_word(p["name"]) and not farm_word(cn):
            DOOR_SKIPPED.append((p["name"], cn, "a farm stays a farm: the door is its house"))
        else:
            door[k] = cn
    taken = collections.Counter(norm(p["name"]) for p in places.values())
    asked = collections.Counter(norm(n) for n in door.values())
    door_renamed = set()
    for k, cn in sorted(door.items(), key=lambda kv: places[kv[0]]["name"]):
        holds = [q["name"] for x, q in places.items() if x != k and norm(cn) in norm(q["name"])]
        if taken[norm(cn)] or asked[norm(cn)] > 1 or holds:
            DOOR_SKIPPED.append((places[k]["name"], cn, "another place has that name" if taken[norm(cn)] else
                                 f"another place's name holds it ({holds[0]})" if holds else "several places would take it"))
            continue
        DOOR_NAMED.append((places[k]["name"], cn, places[k]["type"]))
        places[k].setdefault("recordName", places[k]["name"])
        places[k]["name"] = cn
        door_renamed.add(k)
    # WO-171 (Bob, 28 Oct, second review): a farm is a Farm and a mill a Mill, not "a house in Whiterun hold". By its keywords (LocTypeFarm,
    # LocTypeLumberMill) for any kind of building, and by its name's word for a House or a Building that has no such keyword; never a settlement
    # (Anga's Mill is a village) and never a room of one (a cellar, a common house).
    for k, p in places.items():
        if p["type"] not in ("House", "Building"):  # a Landmark with the keyword (Goldenhills Plantation, hired guards) is a fight: left as it is
            continue
        words = set(re.findall(r"[a-z]+", p["name"].lower()))
        kw = set(p.get("keywords", ()))
        if "LocTypeLumberMill" in kw:
            kind = "Mill"
        elif "LocTypeFarm" in kw:
            kind = "Farm"
        elif not (words & {"cellar", "common", "interior"}):
            kind = "Mill" if words & {"mill", "sawmill"} else "Farm" if words & {"farm", "farmhouse"} else None
        else:
            kind = None
        if kind:
            FARM_TYPED.append((p["name"], p["type"], kind))
            p["type"] = kind
    for p in places.values():
        if p["name"] in CASTLE_NAMES:
            p["type"] = "Castle"  # WO-178: see CASTLE_NAMES
    # WO-178: the Soul Cairn is another plane. Its door out is Castle Volkihar's, so the door search put it in the Sea of Ghosts on the map.
    for p in places.values():
        if p["name"] in OTHER_PLANES and p.get("pos"):
            OTHER_PLANE.append((p["name"], p["world"], p["pos"]))
            for f in ("world", "pos", "posFrom", "hops", "exits"):
                p.pop(f, None)
            p["noPos"] = "another plane: the door out of it opens in Castle Volkihar, which has the position"
    # Nearest city and town, from the position now found (the marker's own for a place that has one, as before): a place found by
    # its cells or a door has one too. A city is the thing it would be measured to, so it has none.
    for k, p in places.items():
        if p["type"] == "City":
            continue
        mk = markers.get(p["marker"]) if p["marker"] else None
        ref = pp.at_marker(mk, cells) if p.get("inTown") else ({"world": p["world"], "pos": p["pos"]} if p.get("pos") else None)
        if not ref:
            continue
        for field, candidates in (("nearestTown", towns), ("nearestCity", cities)):
            best = None
            for tname, tm in candidates:
                if marker_world(tm) != ref["world"] or tm is mk:
                    continue
                dist = sum((a - b) ** 2 for a, b in zip(tm["pos"][:2], ref["pos"][:2])) ** 0.5
                if best is None or dist < best[0]:
                    best = (dist, tname)
            if best:
                km = round(best[0] * 0.0142875 / 1000, 1)  # 1 unit = 1.43 cm
                p[field] = {"town": best[1], "km": km, "walk": walk(km)}
    OFF_MAP[:] = off_map
    # Actors in each place's cells, and its child locations' (a dungeon's inner levels).
    owner = {}
    for k in locs:
        for x in chain(k):
            x = absorbed.get(x, x)
            if x in places:
                owner[k] = x
                break

    def place_of_cell(ck):
        """The place a cell belongs to: its location's, else itself when it is a place of its own (a cell of no location, WO-166)."""
        return owner.get((cells.get(ck) or {}).get("location")) or (ck if ck in places and ck not in locs else None)

    def cw_garrison(key, seen=None):
        # WO-144 Part 1e-2/1e-4: the Civil War's own later garrison, shown separately (`afterTheWar`): a marker
        # named "CWGarrisonEnableMarker..." anywhere up the enable-parent chain (Fort Hraggstad's Imperial
        # Soldiers), or the actor's own faction naming it a combatant of either side (`CWImperialFaction`,
        # `CWSonsFaction`, `CWFortFaction`, `CWJobFort...` -- the same 67-faction Civil War naming this load order
        # carries; Fort Hraggstad's own "lives here: Imperial" at the start turned out to be 20-odd unnamed
        # `CWImperialFaction` soldiers with no `CWGarrisonEnableMarker` parent at all, caught by faction, not the
        # marker chain, which alone wasn't the whole war garrison).
        #
        # Tried and reverted: excluding *any* disabled ref, Civil War or not (Molag Bal at Stendarr's Beacon and
        # Embershard Mine's wolves, both disabled, both confirmed wrong by UESP and by Bob's own read). That's too
        # broad -- it also dropped Wolfskull Cave's Ritual Master, confirmed *right* back in Part 1d-2 ("matches
        # your level, 10 to 20"): he's enable-parented to "MS06caveStatemarker", a quest-state marker that starts
        # disabled and is enabled almost as soon as a player reaches the cave, not "later in the game" the way
        # the war's reinforcement is. A dungeon boss tied to its own quest this way is extremely common; telling
        # that shape apart from a genuinely absent-until-much-later quest actor (Molag Bal) needs the enabling
        # quest's own stages or scripts, which this reader doesn't parse. So: Civil War only, by this real,
        # verified naming convention; Stendarr's Beacon and Embershard Mine's wolves are logged as an open gap,
        # not guessed at with a rule already shown to break a confirmed-right case.
        seen = seen if seen is not None else set()
        if not key or key in seen:
            return False
        info = enable_info.get(key)
        if not info:
            return False
        if info["edid"].startswith("CWGarrisonEnableMarker"):
            return True
        return cw_garrison(info["parent"], seen | {key}) if info["parent"] else False

    def cw_faction(base):
        n = npcs.get(base) or {}
        return any(re.match(r"^CW(Imperial|Sons)Faction|^CWJobFort|^CWFortFaction$", fact.get(f, "")) for f in n.get("factions") or [])

    by_place, after_war_by_place = collections.defaultdict(list), collections.defaultdict(list)
    for akey, a in actors.items():
        if a["deleted"] or (npcs.get(a["base"]) or {}).get("race") == MANAKIN_RACE:
            continue  # a display mannequin (ManakinRace) is never an enemy
        pl = place_of_cell(a["cell"])
        if pl:
            (after_war_by_place if cw_garrison(akey) or cw_faction(a["base"]) else by_place)[pl].append(a)
    # The encounter zone owning a place, by its location (ECZN's own Location field, not a guess -- Bob decoded the
    # DATA layout by hand on Fort Hraggstad, 23 Oct). Clamps the resolved actor range: a floor it can't fall below,
    # a ceiling when the zone sets one (max 0 means none).
    eczn_by_loc = {z["location"]: z for z in eczn.values() if z.get("location")}

    def clamp(lo, hi, zone):
        # Bob, 23 Oct, 16:15: a zone's max 0 means no cap; never let a floor the zone raises push past a ceiling it sets.
        if zone and zone["minLevel"] and zone["minLevel"] <= hi:
            lo = max(lo, zone["minLevel"])
        if zone and zone["maxLevel"]:
            hi = min(hi, zone["maxLevel"])
            lo = min(lo, hi)
        return lo, hi

    level_cache = {}

    def summarize_actors(acts, zone):
        entries = []
        for a in acts:
            entries += level_entries(a["base"], npcs, lvln, cache=level_cache)
        # Deduplicated (gate, low, high, words): Fort Hraggstad's 93 actors share a handful of distinct tiers, not 93.
        entries = sorted({e for e in entries})
        # A place can carry more than one boss-flagged actor (a side encounter as well as the main one): prefer a
        # named, unique actor, then the highest ceiling, over "the first one found" (Wolfskull Cave has both its
        # named Ritual Master and a generic templated bandit both marked boss; the generic one isn't the boss).
        bosses = [(a, level_of(a["base"], npcs, lvln, cache=level_cache)) for a in acts if a["boss"]]
        bosses = [(a, bl) for a, bl in bosses if bl]
        if bosses:
            boss, bl = max(bosses, key=lambda ab: (bool((npcs.get(ab[0]["base"]) or {}).get("name")), ab[1][1]))
        else:
            # Bob, 23 Oct, 17:35: no XLRT boss ref here -- "the highest-level hostile placed at the start", named
            # or not (Faldar's Tooth's real strongest tier is an anonymous leveled bandit, never singled out by
            # name at all; requiring a name picked "Pit Wolf", level 2, a named but minor pet, over them). Hostile
            # still means `kind_of` resolves one (Fort Snowhawk's own "Exmoor Pony, level 4" -- a named horse, no
            # hostile faction at all -- is never a candidate either way).
            candidates = [(a, level_of(a["base"], npcs, lvln, cache=level_cache)) for a in acts
                          if kind_of(resolve_npc(a["base"], npcs, lvln), npcs, lvln, fact)]
            candidates = [(a, bl) for a, bl in candidates if bl]
            # Level first, named only as the tie-break (many of a fort's Imperial Soldiers share the same ceiling
            # as its named one; a name never beats a genuinely higher level, the reverse of the boss-flagged path).
            boss, bl = max(candidates, key=lambda ab: (ab[1][1], bool((npcs.get(ab[0]["base"]) or {}).get("name")))) if candidates else (None, None)
        kinds = collections.Counter(k2 for k2 in (kind_of(resolve_npc(a["base"], npcs, lvln), npcs, lvln, fact) for a in acts) if k2)
        actors_out = {"count": len(acts)}
        if kinds:
            actors_out["livesHere"] = kinds.most_common(1)[0][0]
            others = [w for w, _ in kinds.most_common()[1:]]
            if others:
                actors_out["alsoHere"] = others
        if entries:
            lo, hi = clamp(min(e[1] for e in entries), max(e[2] for e in entries), zone)
            actors_out["floor"], actors_out["ceiling"] = lo, hi
            # atLevel: everything gated at or below a player's level, cumulative -- they meet more of the list the
            # higher they are, never less (Bob, 23 Oct, 17:10). Bob, 16:50: say it the player's way -- "from", the
            # level a band starts at, and "meets", never the raw gate number; bands with the same "meets" collapse
            # into one, in words, so a player (or Mac) never has to read a list of tiers to get the picture.
            gates = sorted({max(g, 1) for g, _, _, _ in entries})  # level 0 isn't a player level; merge it into 1
            bands = []
            for g in gates:
                seen_so_far = [e for e in entries if e[0] <= g]
                meets = list(clamp(min(e[1] for e in seen_so_far), max(e[2] for e in seen_so_far), zone))
                if bands and bands[-1]["meets"] == meets:
                    continue  # no change from the band before it -- one row, not one per tier
                bands.append({"from": g, "meets": meets})
            for i, b in enumerate(bands):
                if i + 1 < len(bands):
                    b["words"] = f"at {b['from']} to {bands[i + 1]['from'] - 1} you meet {b['meets'][0]} to {b['meets'][1]}"
                else:
                    b["words"] = f"from {b['from']}, {b['meets'][0]} to {b['meets'][1]}"
            actors_out["atLevel"] = bands
        if zone and zone["minLevel"]:
            actors_out["zoneMin"] = zone["minLevel"]
        if boss:
            # Bob, 23 Oct, 17:45 (Embershard Mine's "leveled 3-24" against its own 6-10 zone): a *ranged* boss (a
            # leveled list, not a unique) is clamped the same as the rank and file. A fixed, named boss (Zulakaroth,
            # level 40, in a zone capped at 20) is the zone's own exception -- never clamped, that's the point of
            # naming a unique boss at all.
            boss_level = bl
            if bl and bl[0] != bl[1] and zone:
                # Bob, 23 Oct, 16:50: Halted Stream Camp's chief (19 to 24 in the records, unnamed -- not a
                # Zulakaroth-style unique) clamps to the zone's own ceiling (6 to 10) and collapses to one number;
                # say "level 10", the zone's own cap, never "leveled from 10" (that reads as an open floor, which it
                # isn't -- the zone record (its own location's ECZN) is what's shown, logged under the order).
                blo, bhi = clamp(bl[0], bl[1], zone)
                scaled = bl[2].startswith(("matches your level", "your level x"))
                words = (f"matches your level, {blo} to {bhi}" if scaled else
                          f"leveled {blo}-{bhi}" if blo != bhi else f"level {blo}")
                boss_level = (blo, bhi, words)
            actors_out["boss"] = {**({"name": npcs[boss["base"]]["name"]} if (npcs.get(boss["base"]) or {}).get("name") else {}),
                                  "level": boss_level[2] if boss_level else None}
        return actors_out

    # WO-144 Part 1e-3 (Bob, 23 Oct, 17:35): "a stronghold's, a town's or a guild hall's residents aren't hostile" --
    # generalized to every building a place can be (an inn's innkeeper, a temple's priest, a keep's jarl were all
    # coming back as the "boss", the highest-level named person on site, for want of any friendly/hostile
    # distinction at all). None of these is a combat encounter, whatever levels its people happen to be.
    FRIENDLY_TYPES = {"Keep", "Stables", "Temple", "Inn", "Guild", "City"} | NOT_A_FIGHT

    def friendly(k):
        return places[k]["type"] in FRIENDLY_TYPES or places[k]["name"] in STRONGHOLDS or places[k]["name"] in FRIENDLY_NAMES

    for k, acts in by_place.items():
        places[k]["actors"] = {"count": len(acts), "hostile": False} if friendly(k) else summarize_actors(acts, eczn_by_loc.get(k))
    for k, acts in after_war_by_place.items():
        if friendly(k):
            continue  # a Civil War garrison never enable-parents to a building or a stronghold
        # WO-144 Part 1e-2: "show the later garrison separately" -- the actors enable-parented to a disabled Civil
        # War marker, summarized the same way, never merged into the start-of-game count or its boss.
        places[k].setdefault("actors", {"count": 0})["afterTheWar"] = summarize_actors(acts, eczn_by_loc.get(k))
    # WO-176 (Bob, 28 Oct): one or two level-1 or 2 actors are not a place's fight when its own zone says it is for higher levels ("Moss Mother
    # Cavern: enemies from level 1, up to 2", zone minimum 8) or the war puts its real garrison there later (a Sons of Skyrim camp: "level 1 to 2",
    # sixteen soldiers of 4 to 27 after the war). The records place a stray critter or a guard; the real fight is a leveled list or a quest's spawn
    # they don't show. Its levels are dropped (the door says "levels not checked yet", the page "Not known yet"); what lives there stays.
    # WO-176 Part 2 (Bob, 28 Oct, 14:50): the rule is about what kind of actor it is, not how many. Darkwater Pass (a Falmer cave, "1 to 2, 3 in all"),
    # Northwind Mine ("1 to 2", boss "Skeleton, level 1") and Headwaters of Harstrad all have a handful of placed level 1 to 3 creatures in a zone
    # that says the place is for level 12 to 25. A town's own residents, farm animals and guards are not a fight at all (Ivarstead "up to 3").
    for k, p in places.items():
        a = p.get("actors") or {}
        if a.get("hostile") is False or "floor" not in a or p["type"] in NOT_A_FIGHT:
            continue
        if p["type"] in ("Town", "Settlement"):
            why = "a town's residents, animals and guards are not a fight" if a["ceiling"] <= TOWN_STRAY_CEILING else None
        elif a["ceiling"] <= STRAY_CEILING:
            why = (f"its zone's minimum is {a['zoneMin']}" if a.get("zoneMin", 0) >= a["ceiling"] + 4 else  # Septimus Signus, level 1 in a zone of 2, is himself (Bob, 23 Oct)
                   "the war puts its garrison there later" if a.get("afterTheWar") else None)
        else:
            why = None
        if why:
            STRAY_ACTORS.append((p["name"], p.get("hold") or "", a["count"], f"{a['floor']} to {a['ceiling']}", why))
            for f in ("floor", "ceiling", "atLevel", "boss", "afterTheWar") if p["type"] in ("Town", "Settlement") else ("floor", "ceiling", "atLevel", "boss"):
                a.pop(f, None)
    for k, p in places.items():
        if p["type"] == "City" or p["type"] in NOT_A_FIGHT:
            continue  # a city, a house or a shop isn't cleared and doesn't respawn
        zone = eczn_by_loc.get(k)
        if zone and zone["flags"] & 0x01:  # "never resets" (Bob's own flag note, 23 Oct, 16:15)
            p["respawns"] = "never"
        elif cleared_days:
            p["respawns"] = (f"after {cleared_days} days once cleared, {cell_days} ordinarily"
                              if cell_days else f"after {cleared_days} days once cleared")
        x = xp.get(p["type"].lower())
        if x is not None:
            p["clearXp"] = x
        d = disc_xp.get(p["type"].lower())
        if d is not None:
            p["discoveryXp"] = d
    # "What's worth going for" and "danger to a build" (WO-144 Part 1e), rolled up from cell_features by the same
    # owner chain the actors use (a word wall or a trap in a dungeon's inner cell still belongs to the dungeon).
    # Not built: a unique, non-leveled item, and the boss's own spell kit -- neither has a record-level marker to
    # read off (no keyword separates a unique sword from an ordinary one; a spell's own school isn't in its EDID
    # reliably enough to name without guessing), so flagging the gap rather than guessing at either. A dragon lair
    # is already the place's own `type` (its map marker), not a separate read.
    goodies_by_place = collections.defaultdict(lambda: {"wordWalls": set(), "skillBooks": set(), "bossChest": False, "crafting": set(), "shrines": set()})
    traps_by_place = set()
    for cell_key, feat in cell_features.items():
        pl_key = place_of_cell(cell_key)
        if not pl_key:
            continue
        g = goodies_by_place[pl_key]
        if feat["wordWall"]:
            g["wordWalls"].add(feat["wordWall"])
        g["skillBooks"] |= feat["skillBooks"]
        g["bossChest"] = g["bossChest"] or feat["bossChest"]
        g["crafting"] |= feat["crafting"]
        g["shrines"] |= feat["shrines"]
        if feat["traps"]:
            traps_by_place.add(pl_key)
    for k, p in places.items():
        g = goodies_by_place.get(k)
        goodies = {}
        if g:
            if g["wordWalls"]:
                goodies["wordWall"] = sorted(g["wordWalls"])
            if g["skillBooks"]:
                goodies["skillBooks"] = sorted(f"{SKILL_NAMES.get(skill, skill)}: {title}" for skill, title in g["skillBooks"])
            if g["bossChest"]:
                goodies["bossChest"] = True
            if g["crafting"]:
                goodies["crafting"] = sorted(g["crafting"])
            if g["shrines"]:
                goodies["shrines"] = sorted(g["shrines"])
        if goodies:
            p["worthGoingFor"] = goodies
        danger = {}
        if p["type"] == "DragonLair":
            danger["dragonLair"] = True
        if k in traps_by_place:
            danger["traps"] = True
        if danger:
            p["danger"] = danger
    # Alias names: the candidates of alias_variants that the game's text really uses, and that no other place has as its name or its alias.
    corpus = ("\n".join(l for inf in infos.values() for l in inf["lines"]) + "\n" + "\n".join((b.get("text") or "") for b in books.values())
              + "\n" + "\n".join(q["name"] for q in quests.values())).replace("’", "'").lower()
    all_names = {p["name"].lower() for p in places.values()} | {p["recordName"].lower() for p in places.values() if p.get("recordName")}
    claimed = collections.defaultdict(set)  # alias (lower case) -> the places that would carry it
    for k, p in places.items():
        for v in alias_variants(p["name"]):
            lv = v.lower()
            if len(v) >= 5 and lv not in all_names and lv in corpus and re.search(r"(?<![a-z])" + re.escape(lv) + r"(?![a-z])", corpus):
                claimed[lv].add(k)
    for k, p in places.items():
        mine = sorted(v for v in alias_variants(p["name"]) if claimed.get(v.lower()) == {k})
        if mine:
            p["aliases"] = mine
    # WO-171: the name the record gave a place the door calls something else stays as an alias ("Lucan's Dry Goods" for the Riverwood Trader),
    # two words or more and not another place's name or alias (a one-word record name, "Blacksmith", would link every blacksmith in the game).
    others = collections.Counter(n for q in places.values() for n in ({q["name"].lower()} | {a.lower() for a in q.get("aliases", [])}))
    for k in door_renamed:
        p = places[k]
        rec = p["recordName"]
        if len(rec.split()) >= 2 and others[rec.lower()] == 0:
            p["aliases"] = sorted(set(p.get("aliases", [])) | {rec})
    # What points at each place: dialogue and books that name it, on its whole name, case as written.
    named = collections.defaultdict(list)
    for k, p in places.items():
        if p["type"] == "City":
            continue  # WO-166: every line that says "Whiterun" is not about Whiterun's page (778 of them); a city keeps its quests, not its mentions
        for nm in {p["name"], p.get("recordName") or p["name"], *p.get("aliases", [])}:  # the map's name, the record's ("Embershard Mine", "Embershard"), what the words call it
            if len(nm) >= 5:
                named[nm].append(k)
    if named:
        pat = re.compile(r"\b(" + "|".join(re.escape(x) for x in sorted(named, key=len, reverse=True)) + r")\b")

        def where_npc(npc):
            c = cells.get(placed_npc.get(npc)) or {}
            loc = (locs.get(c.get("location")) or {}).get("name")
            return c.get("name") or loc or None

        for iid, inf in infos.items():
            # WO-180 Part 1: a line with a name the game fills in ("<Alias=Rival>") is not fit to quote, and the game's own markup is never in the
            # words. (A line with no speaker stays: the planner's assistant reads a town's gossip from it. The pages quote only a line someone says.)
            lines = [game_text(l) for l in inf["lines"]]
            text = " ".join(lines)
            for nm in set(pat.findall(text)):
                for k in named[nm]:
                    said = next((l for l in lines if nm in l), text)[:300].strip()
                    if HOLE in said:
                        continue
                    places[k].setdefault("pointers", []).append({
                        "kind": "dialogue", "speaker": (npcs.get(inf["speaker"]) or {}).get("name") if inf["speaker"] else None,
                        "speakerPlace": where_npc(inf["speaker"]) if inf["speaker"] else None,
                        "quest": (quests.get(QUEST_PARTS.get(inf["quest"], inf["quest"])) or {}).get("name") if inf["quest"] else None,  # WO-180 Part 4a: a part goes under its quest, as in the quest list
                        "words": said, "record": f"INFO {iid} ({inf['plugin']})"})
        for bid, b in books.items():
            text = game_text(b["text"] or "")
            for nm in set(pat.findall(text)):
                for k in named[nm]:
                    # The first mention with no hole in what is cut around it.
                    for m in re.finditer(re.escape(nm), text):
                        said = text[max(0, m.start() - 120):m.start() + 160].strip()
                        if HOLE not in said:
                            places[k].setdefault("pointers", []).append({"kind": "book", "book": b["name"], "words": said, "record": f"BOOK {bid} ({b['plugin']})"})
                            break
    # Quests that already go there: a location alias that is it (or inside it), or a forced reference standing in it.
    for qid, q in quests.items():
        hit = set()
        for a in q.get("aliases", {}).values():
            if a.get("location") and owner.get(a["location"]):
                hit.add(owner[a["location"]])
            if a.get("ref") and refcell.get(a["ref"]):
                pl = place_of_cell(refcell[a["ref"]])
                if pl:
                    hit.add(pl)
        whole = quests.get(QUEST_PARTS.get(qid), q)  # WO-178: a part of a quest goes under the quest's name
        if qid.startswith(RADIANT_PLUGINS):
            continue  # WO-178: a courier's job from a notice board is not a quest that brings you to a place (overrides.json: questClasses.missives)
        for k in hit if q.get("named") and not HELPER.search(q["name"]) else ():
            if not any(x["id"] == QUEST_PARTS.get(qid, qid) for x in places[k].get("quests", ())):
                places[k].setdefault("quests", []).append({"quest": whole["name"], "id": QUEST_PARTS.get(qid, qid)})
    # Item 4: the roads, every capital and settlement to every other in the same worldspace, by their own markers
    # (never a place's: a settlement's road is to the next settlement, not shortened by a dungeon passed on the way).
    roads = []
    for i, (a, am) in enumerate(towns):
        for b, bm in towns[i + 1:]:
            if marker_world(am) != marker_world(bm):
                continue
            dist = sum((x - y) ** 2 for x, y in zip(am["pos"][:2], bm["pos"][:2])) ** 0.5
            km = round(dist * 0.0142875 / 1000, 1)
            roads.append({"towns": sorted((a, b)), "km": km, "walk": walk(km)})
    return places, xp_from, cities, roads


def report(places, xp_from, cities=()):
    rows = list(places.values())
    by_type = collections.Counter(p["type"] for p in rows)
    by_hold = collections.Counter(p.get("hold") or "(none)" for p in rows)
    pointed = sum(1 for p in rows if p.get("pointers"))
    quested = sum(1 for p in rows if p.get("quests"))
    neither = sum(1 for p in rows if not p.get("pointers") and not p.get("quests"))
    found_cities = {nm for nm, _ in cities}
    missing = sorted(CAPITALS - found_cities)
    out = ["# The places index (WO-128 Part 1, WO-144 Part 1)", "",
           "Written by `scripts/gamedata/places.py` from the winning records across the load order (with the Creation Club plugins). "
           f"Clear and discovery XP from `{xp_from}`'s Experience.ini." if xp_from else "Clear/discovery XP: no Experience.ini found.", "",
           f"**{len(rows)} places.** {pointed} have a pointer (a line or a book that names them), {quested} have a quest that goes there, "
           f"and {neither} have neither.", "",
           "## The nine capitals", "",
           f"Found by name and the CWCapital keyword: {', '.join(sorted(found_cities)) or '(none)'}.",
           (f"**Not checked (no exterior marker in Tamriel, no door into their worldspace this reader found): {', '.join(missing)}.** "
            "`nearestCity`/`nearestTown` never names them; see WO-144's decision log." if missing else "All nine found with an exterior position."),
           "", "## By type", "", "| Type | Places | With a pointer | With a quest |", "|---|---|---|---|"]
    for t, n in by_type.most_common():
        out.append(f"| {t} | {n} | {sum(1 for p in rows if p['type'] == t and p.get('pointers'))} | {sum(1 for p in rows if p['type'] == t and p.get('quests'))} |")
    out += ["", "## By hold", "", "| Hold | Places | With a pointer | With a quest |", "|---|---|---|---|"]
    for h, n in by_hold.most_common():
        out.append(f"| {h} | {n} | {sum(1 for p in rows if (p.get('hold') or '(none)') == h and p.get('pointers'))} | {sum(1 for p in rows if (p.get('hold') or '(none)') == h and p.get('quests'))} |")
    # WO-166 Part 1: where each place is.
    placed = [p for p in rows if p.get("pos")]
    in_town = [p for p in rows if p.get("inTown") and not p.get("pos")]
    nopos = [p for p in rows if p.get("noPos")]
    out += ["", "## Positions (WO-166)", "",
            f"**{len(placed)} of {len(rows)} places have a position**; {len(in_town)} are in a town and have none of their own (`inTown`); "
            f"{len(nopos)} could not be placed. A position is `world` and `pos` [x, y, z] in game units, found from the place's own map marker, "
            "else the exterior cells it owns (the middle of their grid squares: no height, z is null), else a door out of its interior "
            f"(up to {pp.MAX_HOPS} rooms deep). The five big cities' own worldspaces share Tamriel's coordinates (checked door to door) and are filed as Tamriel.",
            "", "| Found from | Places |", "|---|---|"]
    for how, n in collections.Counter(p["posFrom"] for p in placed).most_common():
        out.append(f"| {how} | {n} |")
    out += ["", "| World | Places | On a map |", "|---|---|---|"]
    for w, n in collections.Counter(p["world"] for p in placed).most_common():
        out.append(f"| {w} | {n} | {'yes' if w in MAPS else 'no (a pocket world: coordinates mean nothing on a map)'} |")
    out += ["", "| Kind | Places | Positioned | In a town | Not placed |", "|---|---|---|---|---|"]
    for kind, n in collections.Counter(p["type"] for p in rows).most_common():
        out.append(f"| {kind} | {n} | {sum(1 for p in placed if p['type'] == kind)} | {sum(1 for p in in_town if p['type'] == kind)} | {sum(1 for p in nopos if p['type'] == kind)} |")
    if nopos:
        out += ["", "### Not placed, and why", "", "| Why | Places | Types |", "|---|---|---|"]
        for why, n in collections.Counter(p["noPos"] for p in nopos).most_common():
            out.append(f"| {why} | {n} | {', '.join(sorted({p['type'] for p in nopos if p['noPos'] == why}))} |")
        out += ["", "| Place | Type | Plugin | Why |", "|---|---|---|---|"]
        for p in sorted(nopos, key=lambda p: (p["plugin"], p["name"])):
            out.append(f"| {p['name']} | {p['type']} | {p['plugin']} | {p['noPos']} |")
    added = [p for p in rows if p.get("namedBy")]
    from_cell = [p for p in added if not p["edid"]]
    out += ["", f"### Added because a quest, a person's home or a book names them ({len(added)})", "",
            "Every location a named quest points at (a location alias, or the cell a forced reference stands in), a person's home (their first placed cell, "
            "people_raw.json) or a book is read or found in (book_places.json) that no place of the index covers, whatever it is, with a `kind` from its keywords "
            "(then its name's word): not a hold, a capital, a demo leftover or a name no map and no town holds. A town or city never covers what is inside it. "
            "A room inside another added place is part of it unless two quests name it. What is inside a town has `inTown` and no position; the rest needs one on a map. "
            f"{len(from_cell)} are cells of no location at all (Green-Tip Cabin), a place of their own keyed by the cell.", "",
            "| Named by | Places |", "|---|---|"]
    for src, n in collections.Counter(" + ".join(p["namedBy"]) for p in added).most_common():
        out.append(f"| {src} | {n} |")
    out += ["", "| Kind | Added | In a town | On a map |", "|---|---|---|---|"]
    for kind, n in collections.Counter(p["type"] for p in added).most_common():
        out.append(f"| {kind} | {n} | {sum(1 for p in added if p['type'] == kind and p.get('inTown'))} | {sum(1 for p in added if p['type'] == kind and p.get('pos'))} |")
    out += ["", "| Plugin | Added |", "|---|---|"]
    for plug, n in collections.Counter(p["plugin"] for p in added).most_common(25):
        out.append(f"| {plug} | {n} |")
    out += ["", "The places that are not a house, shop, barracks, jail or building (those are only counted above):", "",
            "| Place | Kind | Where | Plugin | Named by |", "|---|---|---|---|---|"]
    for p in sorted((p for p in added if p["type"] not in NOT_A_FIGHT), key=lambda p: (p["plugin"], p["name"])):
        out.append(f"| {p['name']} | {p['type']} | {p.get('inTown') or p.get('world') or '(none)'} | {p['plugin']} | "
                   f"{', '.join(p.get('namedByQuest') or p.get('homeOf') or p['namedBy'])} |")
    if OFF_MAP:
        out += ["", f"### Named by a quest, a home or a book, and found on no map and in no town ({len(OFF_MAP)})", "",
                "Not places: their interiors reach no map by any door (holding cells, storage and test cells, Apocrypha, Sovngarde, Meridia's realm, Vigilant's rooms). "
                "The quest data still names them.", "", "| Location | Plugin | Why |", "|---|---|---|"]
        for nm, plug, why in sorted(OFF_MAP):
            out.append(f"| {nm} | {plug} | {why} |")
    if LOST_MARKER:
        out += ["", f"### A map marker two places claimed ({len(LOST_MARKER)})", "",
                "A record that names another place's map marker as its own (Morvunskar Crypts and Bleak Falls Barrow's) does not get its position: the marker goes to the "
                "place it is named for, and the other is placed from its own cells or doors.", "", "| Place | Claimed the marker of | Kept by |", "|---|---|---|"]
        for nm, mk, kept in sorted(LOST_MARKER):
            out.append(f"| {nm} | {mk} | {kept} |")
    farms = [(places[k], town, how) for k, _nm, town, how in FARMS_OUT if k in places]
    if farms or FARMS_IN:
        out += ["", f"### Farms and mills in their fields, not inside a town ({len(farms)}) (WO-171)", "",
                "A farm or mill whose location owns exterior cells of its own stands in a field. Its record is parented to the town's location, which read as `inTown` "
                "and left it without a pin. Its position is its door out (the farmhouse), else the middle of its field's cells; its town stays as `nearestTown`.", "",
                "| Farm | Record's town | Found from | Nearest town | Position |", "|---|---|---|---|---|"]
        for p, town, how in sorted(farms, key=lambda f: f[0]["name"]):
            nt = p.get("nearestTown") or {}
            out.append(f"| {p['name']} | {town} | {how} | {nt.get('town', '(none)')} {nt.get('km', '')} km | {p['pos'][0]:.0f}, {p['pos'][1]:.0f} |")
        if FARMS_IN:
            out += ["", f"Farms that stay in their village, with no exterior cells of their own ({len(FARMS_IN)}; each is 20 to 100 m from its town's marker): "
                    + ", ".join(f"{nm} ({town})" for nm, town in sorted(FARMS_IN)) + "."]
    if OUTSIDE_WALLS or OUTSIDE_CANDIDATES:
        out += ["", f"### Buildings outside the city's walls ({len(OUTSIDE_WALLS)}) (WO-180 Part 4a)", "",
                "A location the record parents to a city, whose door opens onto Tamriel itself and not onto the city's own worldspace, stands outside the walls. It is a place "
                "of its own, put where its door is; the city stays its nearest town, and its people are not the city's.", "",
                "| Place | Record's city | Found from |", "|---|---|---|"]
        out += [f"| {nm} | {town} | {how} |" for _k, nm, town, how in sorted(OUTSIDE_WALLS, key=lambda o: o[1])]
    if OUTSIDE_CANDIDATES:
        out += ["", f"Buildings whose door opens on Tamriel too, left inside their city until Bob rules ({len(OUTSIDE_CANDIDATES)}): "
                + ", ".join(sorted({f"{nm} ({town})" for _k, nm, town in OUTSIDE_CANDIDATES})) + "."]
    if DOOR_NAMED or DOOR_SKIPPED:
        out += ["", f"### Called by the name on the door ({len(DOOR_NAMED)}) (WO-171)", "",
                "A house, shop or inn whose location has one interior cell name, and that name is not the record's, takes the cell's (what the game shows on the door); "
                "the record's name is kept as an alias where it is two words or more and no other place's.", "",
                "| Record's name | The door's | Kind |", "|---|---|---|"]
        for rec, door_name, kind in sorted(DOOR_NAMED):
            out.append(f"| {rec} | {door_name} | {kind} |")
        skipped = [s for s in DOOR_SKIPPED if not s[2].startswith("one name holds")]
        if skipped:
            out += ["", "Left as the record has them:", "", "| Record's name | The door's | Why |", "|---|---|---|"]
            for rec, door_name, why in sorted(skipped):
                out.append(f"| {rec} | {door_name} | {why} |")
        out += ["", f"{len(DOOR_SKIPPED) - len(skipped)} more differ only in that one name holds the other (a town's name dropped from the front, a leading \"The\"): left as they are."]
    if STRAY_ACTORS:
        out += ["", f"### Low actors that are not the place's fight ({len(STRAY_ACTORS)}) (WO-176)", "",
                f"A place whose records show only actors of level {STRAY_CEILING} or less (any number), and whose own zone has a higher minimum or whose war garrison comes later; "
                f"or a town whose people, animals and guards reach no higher than level {TOWN_STRAY_CEILING}: its levels are not given (not checked yet), not read as \"1 to 2\".",
                "", "| Place | Hold | Actors | Read as | Why dropped |", "|---|---|---|---|---|"]
        out += [f"| {nm} | {hold} | {n} | {rng} | {why} |" for nm, hold, n, rng, why in sorted(STRAY_ACTORS)]
    if OTHER_PLANE:
        out += ["", f"### Taken off Tamriel's map: another plane ({len(OTHER_PLANE)}) (WO-178)", "",
                "The door search gave these a position in Tamriel (where the door out of the plane opens); they are not there.", "",
                "| Place | World | The position the door search gave it |", "|---|---|---|"]
        out += [f"| {nm} | {w} | {pos[0]:.0f}, {pos[1]:.0f} |" for nm, w, pos in sorted(OTHER_PLANE)]
    if INTERIOR_DROPPED:
        out += ["", f"### \"Interior\" dropped from a name ({len(INTERIOR_DROPPED)}) (WO-171, second review)", "", "| Record's name | Called |", "|---|---|"]
        out += [f"| {rec} | {bare} |" for rec, bare in sorted(INTERIOR_DROPPED)]
    if FARM_TYPED:
        out += ["", f"### Farms and mills typed Farm and Mill, not House ({len(FARM_TYPED)}) (WO-171, second review)", "",
                "By the LocTypeFarm or LocTypeLumberMill keyword, else the name's word (farm, farmhouse; mill, sawmill) on a house or building.", "",
                "| Place | Was | Now |", "|---|---|---|"]
        out += [f"| {nm} | {was} | {now} |" for nm, was, now in sorted(FARM_TYPED)]
    aliased = [p for p in rows if p.get("aliases")]
    if aliased:
        out += ["", f"### Names the words use that the record doesn't ({len(aliased)})", "",
                "A different way of writing a place's name (a possessive, a hyphen, a leading \"The\" dropped) that the game's own dialogue, books or quest names really use "
                "and no other place has. Two words or more. `aliases` on the place; the linker finds it by these too.", "", "| Place | Also written |", "|---|---|"]
        for p in sorted(aliased, key=lambda p: p["name"]):
            out.append(f"| {p['name']} | {', '.join(p['aliases'])} |")
    if DROPPED:
        out += ["", f"### Listed twice or left over, now out ({len(DROPPED)})", "", "| Name | Editor id | Why | Kept as |", "|---|---|---|---|"]
        for nm, edid, _k, why, kept in sorted(DROPPED):
            out.append(f"| {nm} | {edid} | {why} | {kept or '(nothing)'} |")
    same = collections.defaultdict(list)
    for p in rows:
        same[p["name"].lower()].append(p)
    kept_same = {n: v for n, v in same.items() if len(v) > 1}
    if kept_same:
        out += ["", f"### One name, different places, all kept ({len(kept_same)} names)", "",
                "Never in the same town or at the same spot: eight Imperial camps, one in each hold; a Hall of the Dead in each of three cities.", "",
                "| Name | Places | Where |", "|---|---|---|"]
        for n, v in sorted(kept_same.items()):
            out.append(f"| {v[0]['name']} | {len(v)} | {'; '.join(sorted(str(p.get('inTown') or p.get('hold') or p.get('world') or '?') for p in v))} |")
    return "\n".join(out) + "\n"


PLAYER_TAG = re.compile(r"(?i)<\s*Alias\s*=\s*Player\s*>")
FILL_TAG = re.compile(r"(?i)<\s*(?:Alias|Global|Token)\b[^<>]*>")  # a name or number the game puts in when it speaks the line: the planner can't
HOLE = "\x00"  # where such a tag was; a quote that has one in it is left out


def game_text(text):
    """WO-180 Part 1: the game's words without the game's markup. "<Alias=Player>" is "you"; any other name the game fills in leaves a HOLE (the
    quote is dropped, never kept with a gap: "Jarl of , to ,"); the book markup (<font ...>, <img ...>, [pagebreak]) goes, whole, before a quote is cut."""
    t = PLAYER_TAG.sub("you", text)
    t = FILL_TAG.sub(HOLE, t)
    t = re.sub(r"<[^<>]*>", "", t)
    t = re.sub(r"(?i)\[\s*pagebreak\s*\]", " ", t)
    return re.sub(r"[ \t]{2,}", " ", t)


RECORD_NAME = re.compile(r"_|^[A-Za-z]+[a-z][A-Z]\w*$")  # an editor id, not a name ("EGD_DialogueGuardsGeneral", "dunGeirmundQST")


def plugin_of(record):
    """The plugin a pointer's record comes from: "INFO Skyrim.esm:01AACA (Unofficial Skyrim Special Edition Patch.esp)" -> the last."""
    return record[record.rfind("(") + 1:-1] if record.endswith(")") and "(" in record else None


def build_site(rows):
    """The planner's places.json from the raw rows: what a page or an assistant shows, without record ids or editor ids."""
    out = []
    for p in rows:
        # world and pos (WO-166): where it is, for the map and for "next to"; z is null for a place found by its cells (no height known).
        # `aliases` (WO-166): the other names the game's own words use for it ("Yngol's Barrow" for "Yngol Barrow"), for the linker.
        r = {k: p[k] for k in ("id", "name", "type", "hold", "nearestTown", "nearestCity", "inTown", "world", "pos", "aliases", "clearXp", "discoveryXp", "respawns") if p.get(k) is not None}
        if p.get("actors"):
            r["actors"] = p["actors"]
        if p.get("worthGoingFor"):
            r["worthGoingFor"] = p["worthGoingFor"]
        if p.get("danger"):
            r["danger"] = p["danger"]
        if p.get("pointers"):
            r["pointers"] = [{k: v for k, v in {"kind": x["kind"], "speaker": x.get("speaker"), "speakerPlace": x.get("speakerPlace"),
                                                "book": x.get("book"), "words": x["words"],
                                                "quest": x.get("quest") if x.get("quest") and not RECORD_NAME.search(x["quest"]) else None,
                                                "from": plugin_of(x["record"])}.items() if v}
                             for x in p["pointers"]]
        if p.get("quests"):
            r["quests"] = sorted({q["quest"] for q in p["quests"]})
        if p.get("enters"):
            r["enters"] = {"words": p["enters"]["words"], "from": plugin_of(p["enters"]["record"])}
        out.append(r)
    return out


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    places, xp_from, cities, roads = build(version)
    base = os.path.join(REPO, "gamedata", version)
    rows = sorted(places.values(), key=lambda p: (p.get("hold") or "~", p["name"]))
    roads = sorted(roads, key=lambda r: r["towns"])
    with open(os.path.join(base, "places_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"about": __doc__.strip().splitlines()[0], "places": rows, "roads": roads}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(base, "places_report.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(report(places, xp_from, cities))
    print(f"{len(rows)} places, {sum(1 for p in rows if p.get('pointers'))} with a pointer, {sum(1 for p in rows if p.get('quests'))} with a quest -> places_raw.json")
    print(f"{len(roads)} roads -> places_raw.json")


if __name__ == "__main__":
    main()
