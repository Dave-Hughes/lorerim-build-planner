"""
WO-158 Parts 1c to 1e: real bugs Part 1b's design had, found the only way they could be -- by actually running
it. Writes `bat <file>` scripts to gamedata/5.0.4.8/wo158/ (committed, so Bob/Dave can read exactly what each
shot does) and, when `C:\\LoreRim` exists, also to `C:\\LoreRim\\_fieldguide\\tools\\wo158\\` **and directly into
`C:\\LoreRim\\Stock Game\\`** (Part 1e: `bat` on this install only reaches files sitting in the game's own
actual root, not a subfolder of it -- Dave had to move them there by hand the first time, and every fix pushed
after that kept landing in `_fieldguide` alone, so he kept testing the original, broken copy without either of
us realising it):
  python3 scripts/gamedata/wo158_shoot.py

**What Dave found, live:**
1. `wo158-start.txt` ran `tm` as part of its opening toggles -- `tm` hides the console's own input box along
   with the HUD, so once it had run Dave couldn't see what he was typing to check it was right. `tm` is now its
   own file (`wo158-toggle-hud.txt`), run by hand, with his eyes on the screen, right before and right after
   each screenshot -- never baked into a file that runs ahead of something he needs to watch happen.
2. Running a place's file "blindly" (Dave's own word) moved his character but the camera stayed exactly where
   it was. The reason: once `tfc` is on, `player.setpos`/`player.moveto` still move the player's own position
   (confirmed -- bringing an NPC to that position with `moveto player` afterwards still worked), but the free
   camera, already detached, simply doesn't follow a position change on the thing it detached from. Every place
   and person file now toggles `tfc` off immediately before its own `player.setpos`/`setangle` lines and back on
   immediately after (`with_camera_reattached`, below) -- which is exactly the mechanism Bob's own note asked
   for ("the free camera starts from where the player's camera is"), just missing the retoggle around each
   individual shot, not only once at the very start.

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

What `wo158-start.txt` turns on once, for the whole session (`wo158-end.txt` turns the same three back off,
after the last shot, since each is a toggle):
  tfc 1    free camera on -- left on between shots; each place/person file toggles it off and back on around
           its own repositioning (see `with_camera_reattached`), never left to a single on/off at the ends
  tcl      no collision (so `player.setpos` can place the camera in open air above the entrance)
  tai      AI processing off (every actor stands still, not only the one framed)
`tm` (the HUD) is deliberately not among them -- see "What Dave found, live", item 1, above.

Weather: `fw SClearSkySN` sets `NAT-ENB.esp`'s own clear sky, the plainest this load order's weather mod ships,
reused for every shot rather than one found per hold -- a simplification, logged as a decision, not a hunt for
nine different regional clear weathers this test doesn't need.

**Time: `sgtm 0.0001`, never `sgtm 0`.** Found live, 27 Oct (Part 1d): `sgtm 0` hung the game outright -- Esc
and the console's own key both did nothing, a real engine freeze, not a UI quirk, needing the game killed from
outside it. A true zero multiplier is a well-known way to do this on a heavily scripted install: LoreRim's own
hundreds of Papyrus scripts can carry a wait on some game-time condition, and a multiplier of exactly zero means
that condition never arrives, so whatever is waiting waits forever. `sgtm 0.0001` is as close to frozen as this
order needs (noon drifts by a fraction of a real second over several minutes of hand-framing, nothing a
screenshot would ever show) without the hard zero that hangs.
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
LORERIM = os.environ.get("LORERIM_ROOT") or r"C:\LoreRim"

CLEAR_WEATHER = "SClearSkySN"  # NAT-ENB.esp, the winning "clear" weather in this load order; see module docstring
TIME_FROZEN = "0.0001"  # never "0" -- a true zero can hang a heavily scripted install; see module docstring

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
    return ["tfc 1", "tcl", "tai", f"fw {CLEAR_WEATHER}", "set gamehour to 12", f"sgtm {TIME_FROZEN}", f"fov {FOV}"]


def end_lines():
    return ["tai", "tcl", "tfc 1", "sgtm 1"]


def hud_toggle_lines():
    """Its own file, run twice by hand around each screenshot (once to hide the HUD, once to show it again) --
    never baked into start/end. `tm` hides the console's own input box along with the HUD (found live, 27 Oct:
    Dave couldn't see what he was typing once `wo158-start` had run), so it has to stay a step Dave takes with
    his eyes on the screen, not something that's already been run by the time he opens the console again."""
    return ["tm"]


def with_camera_reattached(lines):
    """Wraps a block that repositions the player so the detached free camera actually goes there. Found live,
    27 Oct: once `tfc` is on, `player.setpos`/`player.moveto` still move the player's own position (confirmed --
    an NPC `moveto player`-ed afterwards lands correctly) but the free camera, already detached, doesn't follow;
    Dave watched his own character vanish from where it had been while the camera stayed put. Toggling `tfc`
    off first reattaches the camera to the player for the move, then back on detaches it again starting from
    the new spot -- which is the mechanism Bob's own note actually asked for ("the free camera starts from
    where the player's camera is"), just missing the retoggle around each shot, not only once at the start."""
    return ["tfc 1"] + lines + ["tfc 1"]


def camera_setpos_lines(cx, cy, cz, yaw):
    return [f"player.setpos x {cx:.1f}", f"player.setpos y {cy:.1f}", f"player.setpos z {cz:.1f}",
            f"player.setangle x {TILT_DOWN}", f"player.setangle z {yaw:.1f}"]


def place_lines(target, marker=None, entrance=None):
    lines = [f"fw {CLEAR_WEATHER}", "set gamehour to 12"]
    if marker and entrance:
        lines += with_camera_reattached(camera_setpos_lines(*entrance_camera(marker, entrance)))
    elif marker:
        # Riverwood: no single entrance to aim at -- straight to the marker, well above it, tilted further down.
        # `setpos` takes an absolute coordinate, not a relative one, so the marker's own z plus the offset is
        # computed here rather than written as "+N" (which the console doesn't parse as an offset).
        lines += with_camera_reattached(
            [f"player.moveto {target}", f"player.setpos z {marker[2] + HEIGHT * 2:.1f}", "player.setangle x 60"])
    else:
        lines += with_camera_reattached([f"player.moveto {target}"])
    return lines


def person_mark_lines():
    """The player back at the person's own mark (0,0,0 in the photo room) -- `moveto player` drops a reference
    on top of the player, so the player has to be standing on the mark, not at the camera spot, when it runs."""
    return ["player.setpos x 0", "player.setpos y 0", "player.setpos z 0"]


def camera_mark_lines():
    """The player back at the camera spot, PEOPLE_DISTANCE south of the mark, at head height, facing north.
    Wrapped in `with_camera_reattached` for the same reason every place's own move is -- this is the step the
    screenshot actually sees, not the step that only needs the player's own position to be right."""
    return with_camera_reattached(
        ["player.setpos x 0", f"player.setpos y {-PEOPLE_DISTANCE:.1f}", f"player.setpos z {PEOPLE_HEIGHT:.1f}", "player.setangle z 0"])


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
    write(os.path.join(base, "wo158-toggle-hud.txt"), hud_toggle_lines())
    for name, slug, target, note, marker, entrance in PLACES:
        lines = [f"; {name}" + (f" -- {note}" if note else "")] + place_lines(target, marker, entrance)
        write(os.path.join(base, f"wo158-place-{slug}.txt"), lines)
    ws = WINKING_SKEEVER_DOOR
    ws_lines = [f"; The Winking Skeever (outside) -- no outdoor map marker (an interior inn); the door's own "
                f"rotation stands in for a marker-to-door vector", f"fw {CLEAR_WEATHER}", "set gamehour to 12"]
    ws_lines += with_camera_reattached(camera_setpos_lines(*door_camera(ws["pos"], ws["door_yaw"])))
    write(os.path.join(base, "wo158-place-winking-skeever-outside.txt"), ws_lines)
    write(os.path.join(base, "wo158-photoroom-setup.txt"), [f"; {PHOTO_ROOM}, the photo room; run once"] + photoroom_lines())
    all_targets = [t for _, _, t in PEOPLE]
    for name, slug, target in PEOPLE:
        others = [t for t in all_targets if t != target]
        write(os.path.join(base, f"wo158-person-{slug}.txt"), [f"; {name}"] + person_lines(target, others))


def main():
    wrote = [os.path.join(REPO, "gamedata", "5.0.4.8", "wo158")]
    build(wrote[0])
    if os.path.isdir(LORERIM):
        wrote.append(os.path.join(LORERIM, "_fieldguide", "tools", "wo158"))
        build(wrote[-1])
        # `bat` on this install only reaches files in the game's own actual root (found live, 27 Oct: Dave had
        # to move them there by hand before `bat` could see them at all) -- written flat, directly in that
        # folder, not a subfolder of it, matching where Dave's own copy had to go to work.
        stock_game = os.path.join(LORERIM, "Stock Game")
        if os.path.isdir(stock_game):
            wrote.append(stock_game)
            build(stock_game)
    print("wrote the bat files to:", *wrote)


if __name__ == "__main__":
    main()
