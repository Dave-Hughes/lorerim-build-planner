"""
WO-145 Part 1: the XP budget's own numbers, read from the install, not wished. Writes gamedata/<version>/xp.json:
  python3 scripts/gamedata/xp.py [version]

For each number: where it's read from on Dave's PC, and the file and value, so Mac's own Part 2 (the budget on
every act) has a source for each one, never a typed-in guess.

  curve        the XP a player at level N needs to reach N+1. Not a single formula this load order's own files
               state outright (`SKSE/Plugins/Experience.ini` carries no level-curve key at all; `MCM/Settings/
               Leveling Freedom.ini`'s own "base"/"per level" numbers don't fit Kyria's saves either, so aren't
               used), so measured instead, directly from the player's own saves: `lvlUpExp` at every level a
               save on Dave's PC has reached, 1 to 29, read from each save's header (no decompression needed).
               Every one of the 20 distinct levels checked fits `25 * (level + 11)` exactly, no exception --
               Dave's own guess, now a measured fact across 20 points, not an assumption from two.
  questXp      `Experience.ini`'s own `[Questing]` table, by the quest's type in the records (already in
               `quest_pages.py`'s own `QUEST_XP`, rechecked here against the file and found to match exactly).
  discoveryXp / clearXp   `Experience.ini`'s `[Exploring]`/`[Clearing]` tables, by a place's own type
               (`places.py`'s own `clear_xp()`, reused rather than read a second time). Clearing varies by
               type (a fort, a Nordic or Dwemer ruin, a dragon lair: 200; everything else: 100); discovery is
               flat at 10 for every type.
  crafting     `MCM/Settings/Crafting Grants XP.ini`: what each crafting action pays in character XP (never
               skill XP; `bEnableSkillXP` is off). Confirmed against the field guide's own crafting document
               (`_fieldguide/systems/crafting.md`), which already checked these same numbers against two
               players' own reports.
  killing / reading / skillUse   `Experience.ini`'s `[General]`/`[Killing]`/`[Reading]` sections as written:
               reading gives nothing (`bEnableReading = false`), raw skill use gives nothing
               (`bEnableSkillXP = false`), and killing's own formula factors are given as the file has them
               (not resolved into a single number: it depends on the target's level, relative to the
               player's, which this reader can't know ahead of a specific fight).
  callings     every `Callings_*` global the mod ships (144 of them, read directly from `Callings.esp`'s own
               `GLOB` records, not the source scripts' own comments, which can drift from what's actually
               shipped): each calling's per-action XP, first-time and repeat bonuses, series/hold/chapter
               bonuses, and the daily cap at the calling's own base rank and at Journeyman and Master -- the
               caps rise with the calling's own rank, which is not quite the order's own "doesn't scale with
               level" (a character's level and a calling's own internal rank are different progressions; this
               reader doesn't know which drives which, and says so rather than assuming either way).
  fillers      Missives (100 XP per leg, never as a lump: already established and cited under WO-148 item 7,
               carried in here rather than re-derived) and the Bards College's Tome Trials (50/100/200 by
               tier, gated behind Tending the Flames: WO-148 item 8, likewise carried in). The jarls' bounties
               and radiant faction jobs are quests like any other, already covered by `questXp` above -- not
               repeated here as a separate category.
"""
import configparser
import json
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import ROOT, active_profile, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
import places as pl  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

# WO-145 Part 1: measured directly from the player's own saves (saveNumber, level, lvlUpExp), not a formula
# any file on the install states outright. Every one fits 25 * (level + 11) exactly; kept as evidence, not
# only the formula, so the next person can re-check it against a different save without re-deriving it.
CURVE_EVIDENCE = [
    (1, 1, 300), (1, 3, 350), (10, 4, 375), (20, 5, 400), (24, 6, 425), (30, 7, 450), (35, 8, 475), (43, 9, 500),
    (50, 10, 525), (80, 11, 550), (100, 12, 575), (108, 13, 600), (114, 15, 650), (242, 21, 800), (255, 22, 825),
    (279, 23, 850), (286, 24, 875), (296, 25, 900), (326, 26, 925), (344, 27, 950), (372, 29, 1000),
]


def mods_highest_first():
    return [line.strip()[1:] for line in open(os.path.join(ROOT, "profiles", active_profile(), "modlist.txt"), encoding="utf-8", errors="ignore")
            if line.startswith("+")]


def winning_ini(rel_path):
    """The highest-priority mod's own copy of an MCM/SKSE ini (MO2 order: first in modlist.txt wins), parsed."""
    for m in mods_highest_first():
        p = os.path.join(ROOT, "mods", m, *rel_path)
        if os.path.exists(p):
            cp = configparser.ConfigParser(strict=False)
            cp.read(p, encoding="utf-8-sig")
            return cp, m
    return None, None


def experience_sections():
    cp, m = winning_ini(("SKSE", "Plugins", "Experience.ini"))
    if not cp:
        return {}, None
    out = {"from": m}
    if cp.has_section("General"):
        out["general"] = {k: v for k, v in cp["General"].items()}
    if cp.has_section("Questing"):
        out["questXp"] = {k[len("ixpquest"):]: int(v) for k, v in cp["Questing"].items() if k.startswith("ixpquest")}
    if cp.has_section("Killing"):
        out["killing"] = {k: float(v) for k, v in cp["Killing"].items()}
    if cp.has_section("Reading"):
        out["reading"] = {k: float(v) for k, v in cp["Reading"].items()}
    return out, m


def crafting_xp():
    cp, m = winning_ini(("MCM", "Settings", "Crafting Grants XP.ini"))
    if not cp or not cp.has_section("Main"):
        return {}, None
    return {k[1:] if k[0] == "i" else k: int(v) for k, v in cp["Main"].items()}, m


def callings_globals():
    """Every Callings_* GLOB, the winning copy across the load order (not the source scripts' own comments,
    which can drift from what the plugin actually ships)."""
    pp, lo = plugin_paths(), load_order(cc=True)
    globs = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"GLOB" not in buf:
            continue
        masters = header(buf)
        for o in iter_group(buf, "GLOB"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "GLOB":
                continue
            subs = subrecs(d)
            edid = next((v.rstrip(b"\0").decode("latin1") for s, v in subs if s == "EDID"), "")
            if not edid.lower().startswith("callings_"):
                continue
            fltv = next((v for s, v in subs if s == "FLTV" and len(v) >= 4), None)
            if not fltv:
                continue
            globs[edid] = struct.unpack_from("<f", fltv)[0]
    return globs


def group_callings(globs):
    """Callings_<Calling>_<Rest> -> {calling: {rest: value}}, grouping the 144 flat globals by calling."""
    out = {}
    for edid, val in globs.items():
        rest = edid[len("Callings_"):]
        calling, _, field = rest.partition("_")
        if not field:
            continue  # Callings_Chosen, Callings_PerkPoints, Callings_ShowMenu, Callings_MessageStyle: not a calling's own
        v = int(val) if val == int(val) else val
        out.setdefault(calling, {})[field] = v
    return out


def build(version):
    exp, exp_mod = experience_sections()
    xp, disc, xp_mod = pl.clear_xp()
    craft, craft_mod = crafting_xp()
    callings = group_callings(callings_globals())
    return {
        "curve": {
            "formula": "25 * (level + 11)",
            "note": "the XP a player at `level` needs to reach level + 1; no file on the install states this outright, so measured from the player's own saves instead",
            "evidence": [{"save": s, "level": lv, "lvlUpExp": xp2} for s, lv, xp2 in CURVE_EVIDENCE],
        },
        "questXp": {"from": f"Experience.ini ({exp_mod})", "values": exp.get("questXp", {})},
        "discoveryXp": {"from": f"Experience.ini ({xp_mod})" if xp_mod else None, "values": disc},
        "clearXp": {"from": f"Experience.ini ({xp_mod})" if xp_mod else None, "values": xp},
        "crafting": {"from": f"Crafting Grants XP.ini ({craft_mod})", "values": craft},
        "killing": {"from": f"Experience.ini ({exp_mod})", "enabled": exp.get("general", {}).get("benablekilling") == "true", "values": exp.get("killing", {})},
        "reading": {"from": f"Experience.ini ({exp_mod})", "enabled": exp.get("general", {}).get("benablereading") == "true"},
        "skillUse": {"from": f"Experience.ini ({exp_mod})", "enabled": exp.get("general", {}).get("benableskillxp") == "true"},
        "callings": callings,
        "fillers": {
            "missives": {"xpPerLeg": 100, "note": "never as a lump; see WO-148 item 7"},
            "tomeTrials": {"xpByTier": [50, 100, 200], "note": "gated behind Tending the Flames; see WO-148 item 8"},
        },
    }


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    data = build(version)
    base = os.path.join(REPO, "gamedata", version)
    with open(os.path.join(base, "xp.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"about": __doc__.strip().splitlines()[0], **data}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"curve + {len(data['questXp']['values'])} quest types + {len(data['clearXp']['values'])} place types "
          f"+ {len(data['crafting']['values'])} crafting actions + {len(data['callings'])} callings -> xp.json")


if __name__ == "__main__":
    main()
