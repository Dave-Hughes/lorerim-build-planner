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
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
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
                    "LocTypeHouse", "LocTypePlayerHouse", "LocTypeBanditCamp"}
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
               "Speechcraft": "Speechcraft", "TwoHanded": "Two-Handed"}
BOSS_CHEST_EDID = re.compile(r"ChestBoss")  # "TreasBanditChestBoss", "TreasDraugrChestBoss"...
CRAFTING_FURN = {"CraftingBlackSmithForge": "a forge", "CraftingBlackSmithForgeWR": "a forge",
                 "CraftingBlackSmithForgeSkyforge": "the Skyforge", "CraftingBlacksmithAnvil": "an anvil",
                 "CraftingBlacksmithSharpeningWheel": "a sharpening wheel", "CraftingBlacksmithArmorWorkbench": "an armor workbench",
                 "CraftingEnchantingWorkbench": "an enchanting table", "CraftingEnchantingWorkbenchTabletop": "an enchanting table",
                 "CraftingAlchemyWorkbench": "an alchemy lab", "CraftingAlchemyWorkbenchTabletop": "an alchemy lab"}
SHRINE_ACTI = re.compile(r"(?i)shrineof")
SHRINE_NOISE = re.compile(r"(?i)trigger|approach|exit")  # a scene helper beside the real shrine, not the shrine itself
TRAP_EDID = re.compile(r"(?i)^trap")


def walk(km):
    return next((w for cutoff, w in WALK_BANDS if km < cutoff), "a long day's road")
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


HELPER = re.compile(r"\b(Handler|Controller|Tracker|Dialogue|Misc|Retroactive|Scene|Reserve)\b")  # a quest no player sees as one


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


def txt(v, loc, table):
    if loc and len(v) == 4:
        return (table or {}).get(struct.unpack_from("<I", v)[0], "")
    return v.rstrip(b"\0").decode("utf-8", "replace")


def clear_xp():
    """The [Clearing] and [Exploring] (discovery) XP for each kind of place, from the Experience.ini the Ultra
    profile's highest mod gives (MO2 order)."""
    mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", "Ultra", "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
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
    mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", "Ultra", "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]

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
                    continue
                if tt == "CELL":
                    cell = key
                    c = cells.setdefault(key, {})
                    c["world"] = world if top == "WRLD" else None
                    for s, v in subs:
                        if s == "FULL":
                            c["name"] = txt(v, loc, strings).strip()
                        elif s == "XLCN" and len(v) >= 4:
                            c["location"] = form_id(resolve(struct.unpack_from("<I", v)[0], masters, n))
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
                    if any(s == "XMRK" for s, _ in subs):
                        mtype = next((v[0] for s, v in subs if s == "TNAM" and v), None)
                        markers[key] = {"cell": cell, "pos": pos, "type": MARKER.get(mtype), "deleted": bool(flags & DELETED),
                                        "name": next((txt(v, loc, strings) for s, v in subs if s == "FULL"), "").strip()}
                    rbase = next((form_id(resolve(struct.unpack_from("<I", v)[0], masters, n)) for s, v in subs if s == "NAME" and len(v) >= 4), None)
                    if rbase and cell and not (flags & DELETED):
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
    marker_of = {k: markers.get(l["marker"]) for k, l in locs.items() if l.get("marker") in markers and not markers[l["marker"]]["deleted"]}
    marker_world = lambda m: (cells.get(m["cell"]) or {}).get("world")  # noqa: E731

    def chain(k):
        out, seen = [], set()
        while k and k in locs and k not in seen:
            seen.add(k)
            out.append(k)
            k = locs[k]["parent"]
        return out

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
    by_marker_name = collections.defaultdict(list)
    for m in markers.values():
        if not m["deleted"] and m["name"]:
            by_marker_name[m["name"]].append(m)
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
        # Its map marker: the one the location names, else the one with its own name (when that's the only one).
        m = marker_of.get(k) or (by_marker_name[l["name"]][0] if len(by_marker_name.get(l["name"], [])) == 1 else None)
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
        bypass = named or building
        if not bypass and (names & NOT_KW or mtype in NOT_PLACES or (inside_town and not (names & PLACE_KW or mtype))):
            continue
        if not bypass and not (names & PLACE_KW or (mtype and mtype not in NOT_PLACES)):
            continue
        if is_keep:
            kind = "Keep"
        elif is_stable:
            kind = "Stables"  # never "Stable": that's still a mislabelled marker's own type, in NOT_PLACES
        elif generic_building:
            kind = next(w for kw2, w in (("LocTypeTemple", "Temple"), ("LocTypeInn", "Inn"), ("LocTypeGuild", "Guild")) if kw2 in names)
        else:
            kind = mtype or next((KIND_WORDS[x] for x in sorted(names) if x in KIND_WORDS), None) or "Landmark"
        in_town = next((locs[x]["name"] for x in up if locs[x].get("name") in (CAPITALS | SETTLEMENTS)), None) if building else None

        def nearest(candidates):
            if not (m and m.get("pos")):
                return None
            best = None
            for tname, tm in candidates:
                if marker_world(tm) != marker_world(m) or tm is m:
                    continue
                dist = sum((a - b) ** 2 for a, b in zip(tm["pos"][:2], m["pos"][:2])) ** 0.5
                if best is None or dist < best[0]:
                    best = (dist, tname)
            if not best:
                return None
            km = round(best[0] * 0.0142875 / 1000, 1)  # 1 unit = 1.43 cm
            return {"town": best[1], "km": km, "walk": walk(km)}

        near, near_city = nearest(towns), nearest(cities)
        # The map's name when it only extends the record's ("Embershard" -> "Embershard Mine"); never another place's (a mod's
        # Morvunskar Crypts that points at Bleak Falls Barrow's marker keeps its own name). A building's own cell's
        # name instead, when it's shorter than the record's ("Mistveil Keep", not "Riften Mistveil Keep").
        cell_shown = min(cell_names_of.get(k, ()), key=len, default=None) if building else None
        shown = (cell_shown if cell_shown and len(cell_shown) < len(l["name"]) else
                 m["name"] if (m or {}).get("name") and l["name"].lower() in m["name"].lower() else l["name"])
        places[k] = {"id": k, "name": shown, **({"recordName": l["name"]} if shown != l["name"] else {}), "edid": l["edid"], "type": kind, "keywords": sorted(x for x in names if x.startswith("LocType")),
                     "hold": hold_of(k), "nearestTown": near, "nearestCity": near_city, "inTown": in_town, "plugin": l["plugin"], "marker": l.get("marker") if m else None}
        if l["name"] in STRONGHOLDS and infos.get(STRONGHOLD_GATE):
            gate = infos[STRONGHOLD_GATE]
            places[k]["enters"] = {"words": " ".join(gate["lines"]), "record": f"INFO {STRONGHOLD_GATE} ({gate['plugin']})"}
    # Actors in each place's cells, and its child locations' (a dungeon's inner levels).
    owner = {}
    for k in locs:
        for x in chain(k):
            if x in places:
                owner[k] = x
                break
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
        pl = owner.get((cells.get(a["cell"]) or {}).get("location"))
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
    FRIENDLY_TYPES = {"Keep", "Stables", "Temple", "Inn", "Guild"}

    def friendly(k):
        return places[k]["type"] in FRIENDLY_TYPES or places[k]["name"] in STRONGHOLDS

    for k, acts in by_place.items():
        places[k]["actors"] = {"count": len(acts), "hostile": False} if friendly(k) else summarize_actors(acts, eczn_by_loc.get(k))
    for k, acts in after_war_by_place.items():
        if friendly(k):
            continue  # a Civil War garrison never enable-parents to a building or a stronghold
        # WO-144 Part 1e-2: "show the later garrison separately" -- the actors enable-parented to a disabled Civil
        # War marker, summarized the same way, never merged into the start-of-game count or its boss.
        places[k].setdefault("actors", {"count": 0})["afterTheWar"] = summarize_actors(acts, eczn_by_loc.get(k))
    for k, p in places.items():
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
        pl_key = owner.get((cells.get(cell_key) or {}).get("location"))
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
    # What points at each place: dialogue and books that name it, on its whole name, case as written.
    named = collections.defaultdict(list)
    for k, p in places.items():
        for nm in {p["name"], p.get("recordName") or p["name"]}:  # the map's name and the record's ("Embershard Mine", "Embershard")
            if len(nm) >= 5:
                named[nm].append(k)
    if named:
        pat = re.compile(r"\b(" + "|".join(re.escape(x) for x in sorted(named, key=len, reverse=True)) + r")\b")

        def where_npc(npc):
            c = cells.get(placed_npc.get(npc)) or {}
            loc = (locs.get(c.get("location")) or {}).get("name")
            return c.get("name") or loc or None

        for iid, inf in infos.items():
            text = " ".join(inf["lines"])
            for nm in set(pat.findall(text)):
                for k in named[nm]:
                    places[k].setdefault("pointers", []).append({
                        "kind": "dialogue", "speaker": (npcs.get(inf["speaker"]) or {}).get("name") if inf["speaker"] else None,
                        "speakerPlace": where_npc(inf["speaker"]) if inf["speaker"] else None,
                        "quest": (quests.get(inf["quest"]) or {}).get("name") if inf["quest"] else None,
                        "words": next((l for l in inf["lines"] if nm in l), text)[:300], "record": f"INFO {iid} ({inf['plugin']})"})
        for bid, b in books.items():
            for nm in set(pat.findall(b["text"] or "")):
                for k in named[nm]:
                    i = b["text"].find(nm)
                    places[k].setdefault("pointers", []).append({"kind": "book", "book": b["name"], "words": re.sub(r"<[^>]+>", "", b["text"][max(0, i - 120):i + 160]).strip(),
                                                                 "record": f"BOOK {bid} ({b['plugin']})"})
    # Quests that already go there: a location alias that is it (or inside it), or a forced reference standing in it.
    for qid, q in quests.items():
        hit = set()
        for a in q.get("aliases", {}).values():
            if a.get("location") and owner.get(a["location"]):
                hit.add(owner[a["location"]])
            if a.get("ref") and refcell.get(a["ref"]):
                pl = owner.get((cells.get(refcell[a["ref"]]) or {}).get("location"))
                if pl:
                    hit.add(pl)
        for k in hit if q.get("named") and not HELPER.search(q["name"]) else ():
            places[k].setdefault("quests", []).append({"quest": q["name"], "id": qid})
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
    return "\n".join(out) + "\n"


RECORD_NAME = re.compile(r"_|^[A-Za-z]+[a-z][A-Z]\w*$")  # an editor id, not a name ("EGD_DialogueGuardsGeneral", "dunGeirmundQST")


def plugin_of(record):
    """The plugin a pointer's record comes from: "INFO Skyrim.esm:01AACA (Unofficial Skyrim Special Edition Patch.esp)" -> the last."""
    return record[record.rfind("(") + 1:-1] if record.endswith(")") and "(" in record else None


def build_site(rows):
    """The planner's places.json from the raw rows: what a page or an assistant shows, without record ids or editor ids."""
    out = []
    for p in rows:
        r = {k: p[k] for k in ("id", "name", "type", "hold", "nearestTown", "nearestCity", "inTown", "clearXp", "discoveryXp", "respawns") if p.get(k) is not None}
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
