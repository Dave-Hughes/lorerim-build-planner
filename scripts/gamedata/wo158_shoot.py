"""
WO-158 Part 1b (Bob, 27 Oct 13:10): the console commands for the picture test, written as `bat <file>` scripts,
now setting the camera itself through the player rather than leaving it to a person's hands. Writes them to
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

**The camera: not from the marker's own rotation.** Bob's note asked for the marker's own position and rotation;
checked first, not assumed -- Riverwood's and Bleak Falls Barrow's own map markers both carry rotation `0,0,0`
exactly (read with `struct.unpack_from("<ffffff", ...)` on their own `DATA`, the full six floats, not only the
position three this file used before Part 1b). A map marker's rotation isn't kept meaningful by the game; it's
a flat compass icon, not an oriented one. Used instead: each place's own real entrance **door** (an `XTEL` `REFR`
whose destination lands inside that place's own `LCTN`, found the same two-hop way `wo158-place-winking-skeever-
outside.txt`'s own door already was), and the real, measured vector from the map marker to that door -- both are
positions the records actually carry, so the approach direction and the facing come from real geometry, not from
a rotation field that two of five checked turned out not to have. Where a place has more than one door (Bleak
Falls Barrow: four; Fort Hraggstad: three), the one nearest the map marker is taken as the one a player walks up
to; the others are side or interior exits, not where "a player first sees them." Riverwood has no single entrance
door at all -- a village, framed from above its middle instead, per the order's own words.

**The bearing.** Yaw (`setangle z`) is computed as `atan2(dx, dy)` in degrees over the horizontal vector from the
camera to its subject, on Skyrim's own convention (0 degrees faces north, +Y; 90 faces east, +X) -- this
convention is well documented for the engine but not independently checked against a live camera this session;
if every shot faces backward, negate the yaw (or add 180) in `yaw_to` below, in one place.

**Height, distance and field of view: the three numbers Bob asked for, here at the top, tune after Dave's first
look at Broken Oar Grotto.** `HEIGHT`/`DISTANCE`/`TILT_DOWN` for the five places; `PEOPLE_DISTANCE`/`PEOPLE_HEIGHT`
for the photo room. `FOV` for both (`fov <n>`, which the console does take as a plain command).

**The photo room has no entrance to measure from, so it's built the other way round:** the player goes to a
fixed, round-number spot in the room first (`player.setpos 0 0 0`, right after `coc`, not trusted to wherever the
cell's own default entry happens to be -- a bat file can't read back "where did I actually land" to use later, so
a chosen, explicit point is the only one this can rely on), each person is brought onto that exact spot in turn
(`moveto player` drops a reference at the target's own position, not at a chosen distance from it -- that's why
the person goes to the mark first and the camera moves away from it second, not the other way round), then the
player steps back to the camera mark (`player.setpos 0 <-PEOPLE_DISTANCE> <PEOPLE_HEIGHT>`) and turns to face
the mark (`setangle z 0`, north, since the camera sits due south of the mark on this layout). QASmoke is large and
open enough in the vanilla records that a few hundred units off centre is never a real risk; not independently
measured this session.

What each file assumes is already true (set once, by hand, from the console, before running any of these --
they're toggles, so a bat file can't safely flip them more than once):
  tm       HUD hidden
  tfc 1    free camera on (the free camera starts from wherever the player's own camera already is, so setting
           the player's position and angle below, before `tfc`, is what actually aims the shot)
  tcl      no collision (so `player.setpos` can place the camera in open air above the entrance)
  tai      AI processing off (every actor stands still, not only the one framed)
These four are the opening lines of `wo158-start.txt`; `wo158-end.txt` runs the same four again, after every shot
is taken, since each is a toggle.

Weather: `fw SClearSkySN` sets `NAT-ENB.esp`'s own clear sky, the plainest this load order's weather mod ships,
reused for every shot rather than one found per hold -- a simplification, logged as a decision, not a hunt for
nine different regional clear weathers this test doesn't need. `sgtm 0` freezes the game clock at the multiplier
(not `sgtm 1`, which is only normal speed and would still let noon drift to afternoon over several shots), so
the light doesn't change while Dave works the camera by hand.
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
LORERIM = os.environ.get("LORERIM_ROOT") or r"C:\LoreRim"

CLEAR_WEATHER = "SClearSkySN"  # NAT-ENB.esp, the winning "clear" weather in this load order; see module docstring

# Bob's own three numbers (Part 1b item 2), in one place to change after Dave's first look at Broken Oar Grotto.
HEIGHT = 300.0       # units above the entrance door the camera sits at
DISTANCE = 700.0     # units back from the entrance door, along the line from the map marker through the door
TILT_DOWN = 35.0     # degrees, pitch (positive pitches the camera down, Skyrim's own `setangle x` convention)
FOV = 70.0           # degrees, `fov <n>`

PEOPLE_DISTANCE = 150.0  # units the camera stands back from the person's own mark in the photo room
PEOPLE_HEIGHT = 65.0     # units up from the floor -- roughly head height on a standing adult race

PLACES = [
    # name, slug, moveto target, note, marker pos (x,y,z) or None, entrance door pos (x,y,z) or None
    ("Broken Oar Grotto", "broken-oar-grotto", "000B77C3", "Skyrim.esm's own map marker, no EditorID of its own",
     (-66962.9, 141812.0, -13643.3), (-67668.4, 140893.4, -13878.0)),
    ("Bleak Falls Barrow", "bleak-falls-barrow", "BleakFallsBarrowMapMarkerREF",
     "of four doors, the one nearest the marker; the other three are side/interior exits",
     (1482.5, -41162.3, 5726.5), (-3043.3, -43338.2, 6080.6)),
    ("Fort Hraggstad", "fort-hraggstad", "FortHraggstadMapMarker",
     "of three gates, the one nearest the marker",
     (-112292.0, 114083.4, -5402.3), (-112958.4, 114528.3, -5338.6)),
    ("Riverwood", "riverwood", "RiverwoodLocationCenterMarker",
     "a village, not a single entrance -- framed from above its own centre marker instead",
     (22242.7, -44616.1, -135.5), None),
]

# The Winking Skeever has no outdoor map marker (it's an interior inn), so there's no marker-to-door vector to
# measure -- its own door's rotation stands in instead (a real door's rotation IS kept meaningful for gameplay,
# unlike a map marker's; see the module docstring). 225 degrees is its own door's winning `DATA` rotation, read
# the same way as every other number here, not typed in.
WINKING_SKEEVER_DOOR = {"pos": (-64572.3, 105586.9, -8255.4), "door_yaw": 225.0, "target": "SolitudeWinkingSkeeverDoorRef"}

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


def yaw_to(from_xy, to_xy):
    """Compass bearing (degrees, Skyrim's own convention: 0 north/+Y, 90 east/+X) from one point to another."""
    dx, dy = to_xy[0] - from_xy[0], to_xy[1] - from_xy[1]
    return math.degrees(math.atan2(dx, dy)) % 360


def entrance_camera(marker, entrance):
    """Camera (x, y, z, yaw): back from the entrance along the marker-to-entrance line, raised, facing the
    entrance -- never the marker's own rotation (see the module docstring)."""
    dx, dy = entrance[0] - marker[0], entrance[1] - marker[1]
    d = math.hypot(dx, dy) or 1.0
    ux, uy = dx / d, dy / d  # unit vector, marker -> entrance (the approach direction)
    cx, cy = entrance[0] + ux * DISTANCE, entrance[1] + uy * DISTANCE
    cz = entrance[2] + HEIGHT
    yaw = yaw_to((cx, cy), (entrance[0], entrance[1]))
    return cx, cy, cz, yaw


def door_camera(door_pos, door_yaw):
    """Camera (x, y, z, yaw): back from a door along its own facing (not a marker-to-door vector -- there's no
    marker to measure from), raised, facing back at the door."""
    rad = math.radians(door_yaw)
    ux, uy = math.sin(rad), math.cos(rad)  # the direction the door's own rotation points, same convention as yaw_to
    cx, cy = door_pos[0] + ux * DISTANCE, door_pos[1] + uy * DISTANCE
    cz = door_pos[2] + HEIGHT
    yaw = yaw_to((cx, cy), (door_pos[0], door_pos[1]))
    return cx, cy, cz, yaw


def start_lines():
    return ["tm", "tfc 1", "tcl", "tai", f"fw {CLEAR_WEATHER}", "set gamehour to 12", "sgtm 0", f"fov {FOV}"]


def end_lines():
    return ["tai", "tcl", "tfc 1", "tm", "sgtm 1"]


def camera_setpos_lines(cx, cy, cz, yaw):
    return [f"player.setpos x {cx:.1f}", f"player.setpos y {cy:.1f}", f"player.setpos z {cz:.1f}",
            f"player.setangle x {TILT_DOWN}", f"player.setangle z {yaw:.1f}"]


def place_lines(target, marker=None, entrance=None):
    lines = [f"fw {CLEAR_WEATHER}", "set gamehour to 12"]
    if marker and entrance:
        lines += camera_setpos_lines(*entrance_camera(marker, entrance))
    elif marker:
        # Riverwood: no single entrance to aim at -- straight to the marker, well above it, tilted further down.
        # `setpos` takes an absolute coordinate, not a relative one, so the marker's own z plus the offset is
        # computed here rather than written as "+N" (which the console doesn't parse as an offset).
        lines += [f"player.moveto {target}", f"player.setpos z {marker[2] + HEIGHT * 2:.1f}", "player.setangle x 60"]
    else:
        lines += [f"player.moveto {target}"]
    return lines


def person_mark_lines():
    """The player back at the person's own mark (0,0,0 in the photo room) -- `moveto player` drops a reference
    on top of the player, so the player has to be standing on the mark, not at the camera spot, when it runs."""
    return ["player.setpos x 0", "player.setpos y 0", "player.setpos z 0"]


def camera_mark_lines():
    """The player back at the camera spot, PEOPLE_DISTANCE south of the mark, at head height, facing north."""
    return ["player.setpos x 0", f"player.setpos y {-PEOPLE_DISTANCE:.1f}", f"player.setpos z {PEOPLE_HEIGHT:.1f}", "player.setangle z 0"]


def person_lines(this_target, others):
    out = list(person_mark_lines())
    for o in others:
        out += [f"prid {o}", "disable"]
    out += [f"prid {this_target}", "enable", "moveto player"]
    out += camera_mark_lines()
    return out


def photoroom_lines():
    return [f"coc {PHOTO_ROOM}", f"fw {CLEAR_WEATHER}", "set gamehour to 12"] + list(person_mark_lines())


def write(path, lines):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\r\n") as f:
        f.write("\n".join(lines) + "\n")


def build(base):
    write(os.path.join(base, "wo158-start.txt"), start_lines())
    write(os.path.join(base, "wo158-end.txt"), end_lines())
    for name, slug, target, note, marker, entrance in PLACES:
        lines = [f"; {name}" + (f" -- {note}" if note else "")] + place_lines(target, marker, entrance)
        write(os.path.join(base, f"wo158-place-{slug}.txt"), lines)
    ws = WINKING_SKEEVER_DOOR
    ws_lines = [f"; The Winking Skeever (outside) -- no outdoor map marker (an interior inn); the door's own "
                f"rotation stands in for a marker-to-door vector", f"fw {CLEAR_WEATHER}", "set gamehour to 12"]
    ws_lines += camera_setpos_lines(*door_camera(ws["pos"], ws["door_yaw"]))
    write(os.path.join(base, "wo158-place-winking-skeever-outside.txt"), ws_lines)
    write(os.path.join(base, "wo158-photoroom-setup.txt"), [f"; {PHOTO_ROOM}, the photo room; run once"] + photoroom_lines())
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
