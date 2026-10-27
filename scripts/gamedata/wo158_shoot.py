"""
WO-158: the console commands for the picture test, written as `bat <file>` scripts. Writes them to
gamedata/5.0.4.8/wo158/ (committed, so Bob/Dave can read exactly what each shot does) and, when `C:\\LoreRim`
exists, also to `C:\\LoreRim\\_fieldguide\\tools\\wo158\\` for Dave to actually run:
  python3 scripts/gamedata/wo158_shoot.py

Every reference below is the game's own EditorID where one exists (so the command still works if the plugin's
load-order index ever shifts) and a load-order-safe `00` + local id only for Skyrim.esm's own records (Skyrim.esm
is always the first master, so `00` is never wrong) -- found by resolving each name against the winning records
in `places_raw.json`'s own markers and `people_raw.json`'s own placements, the same way every other PC order reads
the install, not typed in from memory. The two it can't place by EditorID (no unique one in the records):
  Broken Oar Grotto's own map marker (`Skyrim.esm:0B77C3`, blank EDID)  -> `000B77C3`, safe only because it's
  Skyrim.esm's own record.

What each file assumes is already true (set once, by hand, from the console, before running any of these --
they're toggles, so a bat file can't safely flip them more than once):
  tm       HUD hidden
  tfc 1    free camera on
  tai      AI processing off (every actor stands still, not only the one framed)
These three are the opening lines of `wo158-start.txt`; its own last line undoes nothing (the toggles come back
with the same three commands run again, in `wo158-end.txt`, after every shot is taken).

Weather: `fw 0053C2` sets `NAT-ENB.esp:SClearSkySN` ("SClearSkySN"), the plainest clear sky this load order's own
weather mod ships, reused for every shot rather than one found per hold -- a simplification, logged as a decision,
not a hunt for nine different regional clear weathers this test doesn't need. `sgtm 1` keeps time from advancing
once set, so the light doesn't drift mid-shot.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
LORERIM = os.environ.get("LORERIM_ROOT") or r"C:\LoreRim"

CLEAR_WEATHER = "SClearSkySN"  # NAT-ENB.esp, the winning "clear" weather in this load order; see module docstring

PLACES = [
    # name, slug, moveto target, note
    ("Broken Oar Grotto", "broken-oar-grotto", "000B77C3", "Skyrim.esm's own map marker, no EditorID of its own"),
    ("Bleak Falls Barrow", "bleak-falls-barrow", "BleakFallsBarrowMapMarkerREF", None),
    ("Fort Hraggstad", "fort-hraggstad", "FortHraggstadMapMarker", None),
    ("Riverwood", "riverwood", "RiverwoodLocationCenterMarker", None),
    ("The Winking Skeever (outside)", "winking-skeever-outside", "SolitudeWinkingSkeeverDoorRef",
     "Solitude's own street door; walk in by hand afterwards for the inside comparison shot"),
]

PEOPLE = [
    # name, slug, their placed ACHR's own EditorID
    ("Lucan Valerius", "lucan-valerius", "LucanValeriusREF"),
    ("Jaree-Ra", "jaree-ra", "JareeRaREF"),
    ("Mjoll the Lioness", "mjoll-the-lioness", "MjollRef"),
    ("Captain Aldis", "captain-aldis", "CaptainAldisREF"),
    ("Delphine", "delphine", "DelphineREF"),
]

PHOTO_ROOM = "QASmoke"  # Skyrim.esm's own empty testing cell: flat, evenly lit, nothing in frame -- this
# reader's own pick (the order asks for one "picked and named in the log"), a standard, well-known vanilla
# cell for exactly this purpose, not one of this mod's own rooms (which all have their own decoration and light).


def start_lines():
    return ["tm", "tfc 1", "tai", f"fw {CLEAR_WEATHER}", "set gamehour to 12", "sgtm 1"]


def end_lines():
    return ["tai", "tfc 1", "tm"]


def place_lines(target):
    return [f"fw {CLEAR_WEATHER}", "set gamehour to 12", f"player.moveto {target}"]


def person_lines(this_target, others):
    out = []
    for o in others:
        out += [f"prid {o}", "disable"]
    out += [f"prid {this_target}", "enable", "moveto player"]
    return out


def write(path, lines):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\r\n") as f:
        f.write("\n".join(lines) + "\n")


def photoroom_lines():
    return [f"coc {PHOTO_ROOM}", f"fw {CLEAR_WEATHER}", "set gamehour to 12"]


def build(base):
    write(os.path.join(base, "wo158-start.txt"), start_lines())
    write(os.path.join(base, "wo158-end.txt"), end_lines())
    for name, slug, target, note in PLACES:
        lines = [f"; {name}" + (f" -- {note}" if note else "")] + place_lines(target)
        write(os.path.join(base, f"wo158-place-{slug}.txt"), lines)
    write(os.path.join(base, "wo158-photoroom-setup.txt"), [f"; {PHOTO_ROOM}, the photo room"] + photoroom_lines())
    all_targets = [t for _, _, t in PEOPLE]
    for name, slug, target in PEOPLE:
        others = [t for t in all_targets if t != target]
        write(os.path.join(base, f"wo158-person-{slug}.txt"), [f"; {name}"] + person_lines(target, others))


def main():
    build(os.path.join(REPO, "gamedata", "5.0.4.8", "wo158"))
    if os.path.isdir(LORERIM):
        build(os.path.join(LORERIM, "_fieldguide", "tools", "wo158"))
        print("wrote the bat files to gamedata/5.0.4.8/wo158/ and", os.path.join(LORERIM, "_fieldguide", "tools", "wo158"))
    else:
        print("wrote the bat files to gamedata/5.0.4.8/wo158/ (LoreRim root not found here, so not copied there too)")


if __name__ == "__main__":
    main()
