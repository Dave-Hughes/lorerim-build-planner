"""
WO-158 Part 1k: every place is two files now -- `wo158-place-<slug>.txt` travels (one `player.moveto`), and
`wo158-frame-<slug>.txt` frames (`setpos`/`setangle`), run by hand after the load. Writes `bat <file>` scripts
to gamedata/5.0.4.8/wo158/ (committed, so Bob/Dave can read exactly what each shot does) and, when
`C:\\LoreRim` exists, also to `C:\\LoreRim\\_fieldguide\\tools\\wo158\\` and directly into
`C:\\LoreRim\\Stock Game\\` (Part 1e):
  python3 scripts/gamedata/wo158_shoot.py

**Why two files (Part 1k).** Three different `setangle z` values (217.5, 37.5, -142.5) gave Dave one identical
view: at the marker, on the ground, facing the marker's own rotation. A `moveto` across worldspaces lands on a
later frame than the bat file that issued it; every `setpos`/`setangle` after it in the same file ran first and
was then overwritten when the teleport finished. `player.setangle z -142.5` typed on its own, with no teleport
pending, turned him (the view only redraws once the console closes -- a second thing found live, written into
the run steps). So the teleport and the framing can't share a file; the person between them is the wait.

**Why Dave ended up indoors.** `player.setpos` only moves the player within whatever cell or worldspace
they're already loaded into -- it never loads a new one. The entrance-camera branch of `place_lines()` went
straight to `camera_setpos_lines()` (three `setpos`, two `setangle`) with no `player.moveto` first, so it just
nudged Dave's character around inside the interior his throwaway character happened to start in, using Tamriel
exterior coordinates that meant nothing there. `player.moveto <marker>` (the same command that already worked,
repeatedly, for bringing people into the photo room) has to run first -- it's worldspace-aware -- landing
exactly on the marker, before the `setpos` lines do their fine offset from a now-correct starting point.

**Why `tfc` is gone.** Four live tests in a row, including after the `tm` fix, the per-shot retoggle fix and
the `sgtm` fix, Dave kept landing on the same thing: a menu he could hear open but not see, nothing responding.
Free camera suppressing a console or menu's own rendering is a documented Skyrim quirk independent of any of
those three -- fixing `tm`, the retoggle and `sgtm` each fixed a real bug, and still left this one standing,
because `tfc` itself was never actually the mechanism the fixes needed. It never had to be: `player.setpos`/
`player.setangle` already move and aim the player directly (confirmed live, repeatedly), and Skyrim's own
first-person view shows exactly what the player's eyes are pointed at with no character model in the way --
the same framing a detached free camera would have given, from the same numbers, without a free camera at all.
`tcl` stays (without it, a player placed in open air above the entrance just falls); `tfc` does not.
**One manual step this removes everything else can't:** before `wo158-start`, switch to first-person view by
hand (there's no console command to force it) and stay there for the whole session -- third person would show
the player's own body hanging in midair at every place shot.

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

**The bearing.** The plain compass bearing (`atan2(dx, dy)`, 0 degrees north, 90 east) *is* the right
direction -- confirmed live, 27 Oct (Part 1j), by a screenshot's own compass needle. What went wrong twice
before it: Part 1i added 180 on a misreading (that faced Dave out to sea), and before that a value above 180
(217.5) seems never to have been applied at all. `yaw_to` now gives the plain bearing in the -180..180 range the
console takes; see its own docstring for what's confirmed and what's still this reader's best explanation.

**Height, distance and field of view: the numbers Bob asked for, here at the top, set from Dave's own hand-framed
shot of Broken Oar Grotto (Part 1l).** `HEIGHT`/`DISTANCE` for the five places (the tilt is derived from them by
`pitch_to`, so the entrance sits mid-frame by construction rather than by a fixed 35 degrees that only suited
one height); `PEOPLE_DISTANCE`/`PEOPLE_HEIGHT` for the photo room. `FOV` for both (`fov <n>`, which the console
does take as a plain command). `HEIGHT` is measured above the higher of the marker's and the door's own ground:
Broken Oar Grotto's door is 235 units downhill from its marker, inside the hill, and "300 above the door" was
the first framed shot's whole problem -- barely above the beach, inside the mouth.

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

What `wo158-start.txt` turns on once, for the whole session (`wo158-end.txt` turns the same two back off,
after the last shot, since each is a toggle):
  tcl      no collision (so `player.setpos` can place the player in open air above the entrance without falling)
  tai      AI processing off (every actor stands still, not only the one framed)
`tm` (the HUD) and `tfc` (free camera) are deliberately not among them -- `tm` is its own file, run by hand
around each shot (see below); `tfc` isn't used at all (see "Why tfc is gone", above).

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

# Bob's own numbers (Part 1b item 2), in one place to change. Part 1l: read off Dave's own hand-framed shot of
# Broken Oar Grotto, from the console (`player.getpos`/`getangle`: x -66239.31, y 142940.16, z -13256.03, pitch
# 17.86, yaw 218.02). That spot is within 120 units of the marker-to-door line, 2,493 units back from the door
# along it, 387 above the marker (622 above the door, which sits downhill inside the hill), facing 218 -- half a
# degree off the computed bearing. The first guess (300 up, 700 back) had put the camera inside the cave mouth.
HEIGHT = 390.0       # units above the higher of the marker's and the door's own ground (a cave's; see FRAMING)
DISTANCE = 2500.0    # units back from the entrance door, along the line from the map marker through the door (a cave's)
# A village (Riverwood) has no door to aim at: the camera sits TOWN_BACK south of its own centre marker and TOWN_UP above
# it, looking north and down at the marker (pitch derived, ~41 degrees). Part 1p: 1,500 straight up, 60 degrees down, put
# the camera inside Riverwood's own tree canopy (seen live, 27 Oct: a screen of leaves). 3,500 up clears any tree in the
# game; coming at it from the south keeps the river on the far side. Still a guess until Dave reads his own framing.
TOWN_BACK = 4000.0
TOWN_UP = 3500.0
FOV = 70.0           # degrees, `fov <n>`

# Part 1n (Dave, 27 Oct: "some locations are huge ... Bleak Falls Barrow is massive and the same camera angle
# won't work"): one cave's numbers can't be a mountain ruin's. The distance and height are set per *kind* of
# place -- the `type` every row of places_raw.json already carries -- calibrated once per kind on the test's
# own five (one of each), and inherited by every other place of that kind. Only Cave is measured so far
# (Broken Oar Grotto, Part 1l); the rest are first guesses, deliberately far and high so the first look errs
# toward "too far" rather than "inside the wall", to be read off Dave's own framing the same way Cave's was.
FRAMING = {
    "Cave":       {"distance": DISTANCE, "height": HEIGHT},   # measured, Part 1l
    "NordicRuin": {"distance": 6000.0, "height": 1500.0},    # guess: Bleak Falls Barrow
    "Fort":       {"distance": 4500.0, "height": 1200.0},    # guess: Fort Hraggstad
    "Inn":        {"distance": 800.0, "height": 250.0},      # Part 1p: a building from its own street -- a street's length, not a cave's
}
# Seen live, 27 Oct: the cave's 2,500 put the Skeever's camera outside Solitude's walls, facing the main gate -- inside a
# walled city there is no 2,500 units of open ground in any direction. 800 back and 250 up is a street's worth. Which
# SIDE of the door the street is on (the door's rotation, or its opposite) is still unconfirmed: one reading from Dave
# standing in the street facing the inn settles the sign and the distance together.


def framing_for(kind):
    return FRAMING.get(kind, FRAMING["Cave"])
# No fixed tilt: the pitch is derived so the door sits in the middle of the frame (14 degrees here; Dave's own
# 17.9 looked a touch below it, at the mouth) -- see pitch_to.

PEOPLE_DISTANCE = 150.0  # units the camera stands back from the person's own mark in the photo room
PEOPLE_HEIGHT = 65.0     # units up from the floor -- roughly head height on a standing adult race

PLACES = [
    # name, slug, moveto target, note, marker pos (x,y,z), entrance door pos (x,y,z) or None, kind (places_raw.json's own `type`)
    ("Broken Oar Grotto", "broken-oar-grotto", "000B77C3", "Skyrim.esm's own map marker, no EditorID of its own",
     (-66962.9, 141812.0, -13643.3), (-67668.4, 140893.4, -13878.0), "Cave"),
    ("Bleak Falls Barrow", "bleak-falls-barrow", "BleakFallsBarrowMapMarkerREF",
     "of four doors, the one nearest the marker; the other three are side/interior exits",
     (1482.5, -41162.3, 5726.5), (-3043.3, -43338.2, 6080.6), "NordicRuin"),
    ("Fort Hraggstad", "fort-hraggstad", "FortHraggstadMapMarker",
     "of three gates, the one nearest the marker",
     (-112292.0, 114083.4, -5402.3), (-112958.4, 114528.3, -5338.6), "Fort"),
    ("Riverwood", "riverwood", "RiverwoodLocationCenterMarker",
     "a village, not a single entrance -- framed from above its own centre marker instead",
     (22242.7, -44616.1, -135.5), None, "Town"),
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
    """The `player.setangle z` value that faces the player from one point toward another: the plain compass
    bearing (0 north/+Y, 90 east/+X), written in the -180..180 range, never 0..360.

    Found live, 27 Oct (Part 1j), from a screenshot's own compass: with `setangle z 37.5` (Part 1i's +180),
    Dave faced NNE, out to sea -- the compass needle sat just left of centre, and Broken Oar Grotto's entrance
    is south-west of the camera. So 37.5 *was* being applied, and it's the wrong way; the plain bearing,
    217.5 (SSW), was the right direction all along. Why the earlier test with 217.5 looked the same: this
    reader's own best explanation, consistent with every observation, is that the console takes `setangle z`
    in the -180..180 range and quietly drops 217.5, leaving the facing wherever `player.moveto` had just put it
    -- the marker's own rotation, 40 degrees for this grotto, also NNE, also the sea. Two different causes,
    one identical view, which is what made it look like "no change". Part 1i's +180 is undone here; the
    bearing is normalised to -180..180 instead (217.5 becomes -142.5)."""
    dx, dy = to_xy[0] - from_xy[0], to_xy[1] - from_xy[1]
    yaw = math.degrees(math.atan2(dx, dy)) % 360
    return yaw - 360 if yaw > 180 else yaw


def entrance_camera(marker, entrance, distance=DISTANCE, height=HEIGHT):
    """Camera (x, y, z, yaw, pitch): back from the entrance along the marker-to-entrance line -- on the approach side,
    where the marker is, not past the entrance in the direction of travel -- raised, facing the entrance.
    Never the marker's own rotation (see the module docstring).

    Found live, 27 Oct (Part 1h): the sign here was backward. `ux, uy` is the direction from the marker toward
    the entrance (the way a player walks in); adding that to the entrance's own position, as this did before,
    moves further in the same direction -- past the entrance, roughly where the dungeon's own interior begins,
    not outside it. Dave ended up on the ground facing away from Broken Oar Grotto, which fits exactly: placed
    near or past the doorway rather than outside it, the ground is wherever that happens to be, and "facing
    the entrance" from the wrong side doesn't look anything like the establishing shot the order asks for.
    Subtracting instead puts the camera back on the approach side, the way into the place, not through it."""
    dx, dy = entrance[0] - marker[0], entrance[1] - marker[1]
    d = math.hypot(dx, dy) or 1.0
    ux, uy = dx / d, dy / d  # unit vector, marker -> entrance (the approach direction)
    cx, cy = entrance[0] - ux * distance, entrance[1] - uy * distance
    # Part 1l: the door can sit downhill, inside the hill (Broken Oar Grotto's is 235 units below its own
    # marker), so "HEIGHT above the door" was barely above the beach. Measure from the higher of the two.
    cz = max(marker[2], entrance[2]) + height
    yaw = yaw_to((cx, cy), (entrance[0], entrance[1]))
    return cx, cy, cz, yaw, pitch_to((cx, cy, cz), entrance)


def pitch_to(camera, target):
    """The `player.setangle x` value (degrees down from level) that puts `target` in the middle of the frame
    from `camera` -- derived from the geometry, so HEIGHT and DISTANCE are the only numbers to tune (Part 1l;
    the fixed 35 degrees before it was a guess that only ever happened to suit one height)."""
    horizontal = math.hypot(target[0] - camera[0], target[1] - camera[1]) or 1.0
    return math.degrees(math.atan2(camera[2] - target[2], horizontal))


def door_camera(door_pos, door_yaw, distance=DISTANCE, height=HEIGHT):
    """Camera (x, y, z, yaw, pitch): back from a door along its own facing (not a marker-to-door vector --
    there's no marker to measure from), raised, facing back and down at the door."""
    rad = math.radians(door_yaw)
    ux, uy = math.sin(rad), math.cos(rad)  # the direction the door's own rotation points, same convention as yaw_to
    cx, cy = door_pos[0] + ux * distance, door_pos[1] + uy * distance
    cz = door_pos[2] + height
    yaw = yaw_to((cx, cy), (door_pos[0], door_pos[1]))
    return cx, cy, cz, yaw, pitch_to((cx, cy, cz), door_pos)


def start_lines():
    # `prid 14` first (Part 1o): `tcl` and `tai` act on whatever the console has selected, and only fall back
    # to the player when nothing is. After any `prid` (every person file; clicking on anything with the console
    # open) they'd act on that instead. 14 is the player's own form id, always. Found live: Dave fell into the
    # sea the moment a frame placed him over it -- collision was on. Each is a toggle, so a restart resets them
    # and running this file twice in one session turns them back off: the console's own echo is the check
    # (`Collision -> Off`, `AI -> Off`), and one more `tcl`/`tai` by hand if it says On.
    return ["prid 14", "tcl", "tai", f"fw {CLEAR_WEATHER}", "set gamehour to 12", f"sgtm {TIME_FROZEN}", f"fov {FOV}"]


def end_lines():
    return ["prid 14", "tai", "tcl", "sgtm 1"]


def hud_toggle_lines():
    """Its own file, run twice by hand around each screenshot (once to hide the HUD, once to show it again) --
    never baked into start/end. `tm` hides the console's own input box along with the HUD (found live, 27 Oct:
    Dave couldn't see what he was typing once `wo158-start` had run), so it has to stay a step Dave takes with
    his eyes on the screen, not something that's already been run by the time he opens the console again."""
    return ["tm"]


def camera_setpos_lines(cx, cy, cz, yaw, pitch):
    return [f"player.setpos x {cx:.1f}", f"player.setpos y {cy:.1f}", f"player.setpos z {cz:.1f}",
            f"player.setangle x {pitch:.1f}", f"player.setangle z {yaw:.1f}"]


def travel_lines(target):
    """`wo158-place-<slug>.txt`: weather, noon, and the teleport -- nothing else. `player.setpos` only moves the
    player within whatever cell/worldspace they're already in; `player.moveto` is the one command that loads a
    new one (Part 1g). But a `moveto` across worldspaces finishes on a later frame than the bat file that ran it
    (Part 1k): anything after it in the same file runs first and is then overwritten when the teleport lands --
    position back on the marker, height back on the ground, facing back to the marker's own rotation. Which is
    exactly the one view Dave got from three different `setangle z` values. So the teleport gets a file to itself,
    and the framing waits for the load to finish, in `wo158-frame-<slug>.txt`."""
    return [f"fw {CLEAR_WEATHER}", "set gamehour to 12", f"player.moveto {target}"]


def frame_lines(marker=None, entrance=None, kind="Cave"):
    """`wo158-frame-<slug>.txt`: the camera's own position and angle, run by hand once the place has loaded.
    No `moveto` in here, ever -- see `travel_lines`. `kind` picks the distance and height (FRAMING, Part 1n)."""
    if marker and entrance:
        f = framing_for(kind)
        return camera_setpos_lines(*entrance_camera(marker, entrance, f["distance"], f["height"]))
    if marker:
        return camera_setpos_lines(*town_camera(marker))
    return []


def town_camera(marker, back=None, up=None):
    """Camera (x, y, z, yaw, pitch) for a village: TOWN_BACK south of its centre marker, TOWN_UP above it, looking
    north and down at the marker. Above the canopy (Part 1p), not in it."""
    back = TOWN_BACK if back is None else back
    up = TOWN_UP if up is None else up
    cx, cy, cz = marker[0], marker[1] - back, marker[2] + up
    return cx, cy, cz, yaw_to((cx, cy), (marker[0], marker[1])), pitch_to((cx, cy, cz), marker)


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
    """`coc` is a cell load like `moveto` (Part 1k), so nothing positional follows it here: each person's own file
    puts the player on the mark itself, first thing, after this has finished loading."""
    return [f"fw {CLEAR_WEATHER}", "set gamehour to 12", f"coc {PHOTO_ROOM}"]


def write(path, lines):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\r\n") as f:
        f.write("\n".join(lines) + "\n")


def build(base):
    write(os.path.join(base, "wo158-start.txt"), start_lines())
    write(os.path.join(base, "wo158-end.txt"), end_lines())
    write(os.path.join(base, "wo158-toggle-hud.txt"), hud_toggle_lines())
    for name, slug, target, note, marker, entrance, kind in PLACES:
        f = framing_for(kind)
        numbers = f"{TOWN_BACK:.0f} south, {TOWN_UP:.0f} up" if kind == "Town" else f"{f['distance']:.0f} back, {f['height']:.0f} up"
        head = f"; {name} ({kind}: {numbers})" + (f" -- {note}" if note else "")
        write(os.path.join(base, f"wo158-place-{slug}.txt"), [head + " (travel; then wait for the load)"] + travel_lines(target))
        write(os.path.join(base, f"wo158-frame-{slug}.txt"), [head + " (frame; run after the place has loaded)"] + frame_lines(marker, entrance, kind))
    ws, f = WINKING_SKEEVER_DOOR, framing_for("Inn")
    ws_head = (f"; The Winking Skeever (outside) (Inn: {f['distance']:.0f} back, {f['height']:.0f} up) -- no outdoor "
               "map marker (an interior inn); the door's own rotation stands in for a marker-to-door vector")
    write(os.path.join(base, "wo158-place-winking-skeever-outside.txt"), [ws_head + " (travel)"] + travel_lines(ws["target"]))
    write(os.path.join(base, "wo158-frame-winking-skeever-outside.txt"),
          [ws_head + " (frame)"] + camera_setpos_lines(*door_camera(ws["pos"], ws["door_yaw"], f["distance"], f["height"])))
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
        # Part 1m: MO2 sweeps anything the game's own root gained while it ran into `overwrite\Root` when the
        # game closes -- it did it to all eighteen of these (Dave found his screenshots had moved the same way).
        # `overwrite\Root` is what MO2 shows the game as its root, so it's the copy that survives a session;
        # Stock Game is kept so the first launch after a regenerate finds them too, before any sweep.
        overwrite_root = os.path.join(LORERIM, "overwrite", "Root")
        if os.path.isdir(overwrite_root):
            wrote.append(overwrite_root)
            build(overwrite_root)
    print("wrote the bat files to:", *wrote)


if __name__ == "__main__":
    main()
