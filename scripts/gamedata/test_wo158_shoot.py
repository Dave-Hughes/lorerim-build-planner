"""
WO-158: the generated console bat files, checked for shape, not run (the game isn't part of this test suite).
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import math
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wo158_shoot as wo  # noqa: E402

SESSION_TOGGLES = ("tcl", "tai")  # on once at the start, off once at the end -- never inside a shot's own file


def all_travel_lines():
    for name, slug, target, note, marker, entrance, kind in wo.PLACES:
        yield slug, wo.travel_lines(target)
    yield "winking-skeever-outside", wo.travel_lines(wo.WINKING_SKEEVER_DOOR["target"])


def all_frame_lines():
    for name, slug, target, note, marker, entrance, kind in wo.PLACES:
        yield slug, wo.frame_lines(marker, entrance, kind)
    ws, f = wo.WINKING_SKEEVER_DOOR, wo.framing_for("Inn")
    yield "winking-skeever-outside", wo.camera_setpos_lines(*wo.door_camera(ws["pos"], ws["door_yaw"], f["distance"], f["height"]))


def all_shot_lines():
    yield from all_travel_lines()
    yield from all_frame_lines()
    for name, slug, target in wo.PEOPLE:
        others = [t for _, _, t in wo.PEOPLE if t != target]
        yield slug, wo.person_lines(target, others)


class ShapeTest(unittest.TestCase):
    def test_session_toggles_only_live_in_start_and_end(self):
        # tcl and tai flip state each time they run -- they may only appear in the two files meant to bracket
        # the whole session, never inside a per-place or per-person shot.
        for slug, lines in all_shot_lines():
            self.assertFalse(any(line.split()[0] in SESSION_TOGGLES for line in lines), (slug, lines))
        self.assertEqual(set(l.split()[0] for l in wo.start_lines()) & set(SESSION_TOGGLES), set(SESSION_TOGGLES))
        self.assertEqual(set(l.split()[0] for l in wo.end_lines()) & set(SESSION_TOGGLES), set(SESSION_TOGGLES))

    def test_session_toggles_act_on_the_player_not_the_last_prid(self):
        # Part 1o: tcl and tai act on the console's selected reference, falling back to the player only when
        # nothing is selected -- and every person file selects an NPC. Dave fell into the sea with collision on.
        # 14 is the player's own form id; selecting it first makes both toggles land on the player every time.
        for lines in (wo.start_lines(), wo.end_lines()):
            self.assertEqual(lines[0], "prid 14", lines)
            first_toggle = next(i for i, l in enumerate(lines) if l.split()[0] in SESSION_TOGGLES)
            self.assertGreater(first_toggle, 0)

    def test_tm_lives_only_in_its_own_file(self):
        # Found live, 27 Oct: tm hides the console's own input box along with the HUD, so Dave couldn't see
        # what he was typing once wo158-start had run tm for him. It must never be in start, end, or any shot.
        self.assertNotIn("tm", wo.start_lines())
        self.assertNotIn("tm", wo.end_lines())
        self.assertEqual(wo.hud_toggle_lines(), ["tm"])
        for slug, lines in all_shot_lines():
            self.assertNotIn("tm", lines, slug)

    def test_tfc_is_never_used_anywhere(self):
        # Part 1f: free camera suppressed a menu's own rendering independently of tm, the retoggle and sgtm --
        # three real, separate bugs fixed across Parts 1c-1e, and the same symptom still came back a fourth
        # time. Dropped entirely rather than chased further: player.setpos/setangle already move and aim the
        # player directly, and first person shows exactly that with no free camera needed at all.
        for slug, lines in all_shot_lines():
            self.assertFalse(any(l.startswith("tfc") for l in lines), (slug, lines))
        for f in (wo.start_lines(), wo.end_lines(), wo.camera_mark_lines(), wo.person_mark_lines(), wo.photoroom_lines()):
            self.assertFalse(any(l.startswith("tfc") for l in f), f)

    def test_time_is_frozen_without_the_true_zero_that_hangs(self):
        # Found live, 27 Oct (Part 1d): sgtm 0 hung the game outright on this heavily scripted install -- the
        # console wouldn't even close. sgtm 1 is only normal speed and would let noon drift to afternoon over
        # several hand-framed shots. Only a near-zero, never-exactly-zero multiplier is safe here.
        self.assertIn(f"sgtm {wo.TIME_FROZEN}", wo.start_lines())
        self.assertNotEqual(float(wo.TIME_FROZEN), 0.0)
        self.assertNotIn("sgtm 0", wo.start_lines())
        self.assertNotIn("sgtm 1", wo.start_lines())

    def test_a_teleport_never_shares_a_file_with_the_framing(self):
        # Found live, 27 Oct (Part 1k): a moveto across worldspaces (or a coc) finishes on a later frame than the
        # bat file that ran it, and when it lands it overwrites any setpos/setangle that ran after it in the same
        # file -- three different setangle z values gave Dave the same view. So: a travel file is weather, noon
        # and one moveto, nothing positional after it; a frame file is positional and has no moveto or coc at all.
        positional = ("player.setpos", "player.setangle")
        for slug, lines in all_travel_lines():
            self.assertEqual(sum(l.startswith("player.moveto") for l in lines), 1, (slug, lines))
            self.assertEqual(lines[-1].split()[0], "player.moveto", (slug, lines))
            self.assertFalse(any(l.startswith(positional) for l in lines), (slug, lines))
        for slug, lines in all_frame_lines():
            self.assertTrue(lines, slug)
            self.assertTrue(all(l.startswith(positional) for l in lines), (slug, lines))
        self.assertEqual(wo.photoroom_lines()[-1], f"coc {wo.PHOTO_ROOM}")

    def test_every_person_disables_exactly_the_other_four(self):
        all_targets = [t for _, _, t in wo.PEOPLE]
        for name, slug, target in wo.PEOPLE:
            others = [t for t in all_targets if t != target]
            lines = wo.person_lines(target, others)
            disabled = {l[len("prid "):] for i, l in enumerate(lines[:-1]) if l.startswith("prid ") and lines[i + 1] == "disable"}
            self.assertEqual(disabled, set(others))
            self.assertIn(f"prid {target}", lines)
            self.assertIn("enable", lines)
            self.assertIn("moveto player", lines)

    def test_a_person_goes_to_the_mark_before_being_brought_in(self):
        # moveto player drops the NPC wherever the player already stands, so the player must be back on the
        # mark (not left at the previous shot's camera spot) before any prid/enable/moveto runs. The photo
        # room's own setup no longer sets the mark itself (Part 1k: coc is a load, nothing positional after it),
        # so each person's file has to.
        lines = wo.person_lines(wo.PEOPLE[0][2], [t for _, _, t in wo.PEOPLE[1:]])
        self.assertEqual(lines[:3], wo.person_mark_lines())

    def test_every_target_is_unique(self):
        place_targets = [t for _, _, t, _, _, _, _ in wo.PLACES] + [wo.WINKING_SKEEVER_DOOR["target"]]
        people_targets = [t for _, _, t in wo.PEOPLE]
        self.assertEqual(len(place_targets), len(set(place_targets)))
        self.assertEqual(len(people_targets), len(set(people_targets)))

    def test_travel_sets_weather_and_noon(self):
        for slug, lines in all_travel_lines():
            self.assertTrue(any(l.startswith("fw ") for l in lines), slug)
            self.assertTrue(any("gamehour" in l for l in lines), slug)

    def test_yaw_to_is_the_plain_bearing_in_the_minus_180_to_180_range(self):
        # Found live, 27 Oct (Part 1j), from a screenshot's own compass: the plain bearing is the right
        # direction (Part 1i's +180 faced Dave out to sea, NNE, with the grotto behind him to the SSW), and a
        # value above 180 (217.5) was never applied at all -- the console takes -180..180. So: plain bearing,
        # never above 180, never below -180.
        self.assertAlmostEqual(wo.yaw_to((0, 0), (0, 10)), 0.0)     # due north
        self.assertAlmostEqual(wo.yaw_to((0, 0), (10, 0)), 90.0)    # due east
        self.assertAlmostEqual(wo.yaw_to((0, 0), (0, -10)), 180.0)  # due south
        self.assertAlmostEqual(wo.yaw_to((0, 0), (-10, 0)), -90.0)  # due west: -90, never 270
        self.assertAlmostEqual(wo.yaw_to((0, 0), (-10, -10)), -135.0)  # south-west: -135, never 225
        for a in range(0, 360, 15):
            r = math.radians(a)
            v = wo.yaw_to((0, 0), (math.sin(r), math.cos(r)))
            self.assertTrue(-180 <= v <= 180, (a, v))

    def test_entrance_camera_sits_back_from_the_entrance_on_the_markers_own_side(self):
        # Found live, 27 Oct (Part 1h, then 1j): the marker is due south of the entrance (a player walks north
        # to reach it); the camera must land on that same southern, approach side -- at or past the marker,
        # never past the entrance itself -- raised, facing north (plain bearing 0) back at the entrance.
        marker = (0.0, 0.0, 0.0)
        entrance = (0.0, 100.0, 0.0)
        cx, cy, cz, yaw, pitch = wo.entrance_camera(marker, entrance)
        self.assertAlmostEqual(cx, 0.0, places=3)
        self.assertLess(cy, 100.0)  # south of the entrance, i.e. on the approach side, not past it
        self.assertAlmostEqual(cz, wo.HEIGHT, places=3)
        self.assertAlmostEqual(yaw, 0.0)  # facing north, at the entrance
        self.assertGreater(pitch, 0.0)  # looking down at it, never up or level
        self.assertLess(pitch, 90.0)

    def test_height_is_measured_from_the_higher_of_marker_and_door(self):
        # Part 1l: Broken Oar Grotto's door is 235 units downhill from its marker, inside the hill -- HEIGHT
        # above the door put the camera inside the mouth. Above the higher ground point, or it isn't "above".
        cx, cy, cz, yaw, pitch = wo.entrance_camera((0.0, 0.0, 500.0), (0.0, 100.0, 200.0))
        self.assertAlmostEqual(cz, 500.0 + wo.HEIGHT, places=3)
        cx, cy, cz, yaw, pitch = wo.entrance_camera((0.0, 0.0, 200.0), (0.0, 100.0, 500.0))
        self.assertAlmostEqual(cz, 500.0 + wo.HEIGHT, places=3)

    def test_pitch_puts_the_target_mid_frame(self):
        # A camera 1000 up and 1000 back from a target on the ground must look down exactly 45 degrees.
        self.assertAlmostEqual(wo.pitch_to((0.0, 0.0, 1000.0), (0.0, 1000.0, 0.0)), 45.0, places=3)
        self.assertAlmostEqual(wo.pitch_to((0.0, 0.0, 0.0), (0.0, 1000.0, 0.0)), 0.0, places=3)

    def test_broken_oar_grotto_faces_south_west_as_the_screenshots_own_compass_showed(self):
        # The one shot checked live against a real compass (Part 1j): the camera stands NE of the entrance;
        # facing it is SSW, a plain bearing of 217.5, which the console must be handed as -142.5.
        name, slug, target, note, marker, entrance, kind = next(p for p in wo.PLACES if p[1] == "broken-oar-grotto")
        self.assertEqual(kind, "Cave")
        cx, cy, cz, yaw, pitch = wo.entrance_camera(marker, entrance)
        self.assertAlmostEqual(yaw, -142.5, places=1)
        self.assertNotAlmostEqual(yaw, 37.5, places=1)  # Part 1i's value: the sea, not the grotto
        # Part 1l: Dave's own hand-framed spot, read off the console -- the camera lands within 120 units of it.
        self.assertLess(math.hypot(cx - (-66239.31), cy - 142940.16), 120.0)
        self.assertAlmostEqual(cz, -13256.03, delta=5.0)
        self.assertAlmostEqual(pitch, 14.0, delta=0.5)

    def test_framing_is_per_kind_of_place(self):
        # Part 1n (Dave: "Bleak Falls Barrow is massive and the same camera angle won't work"): a cave's numbers
        # can't be a mountain ruin's. Each place frames by its own kind -- a ruin further back and higher than a
        # cave; an unknown kind falls back to the cave's, never to nothing.
        self.assertGreater(wo.framing_for("NordicRuin")["distance"], wo.framing_for("Cave")["distance"])
        self.assertGreater(wo.framing_for("NordicRuin")["height"], wo.framing_for("Cave")["height"])
        self.assertEqual(wo.framing_for("SomethingNew"), wo.framing_for("Cave"))
        self.assertEqual({p[6] for p in wo.PLACES}, {"Cave", "NordicRuin", "Fort", "Town"})  # one of each kind

        def back_from_door(place):
            name, slug, target, note, marker, entrance, kind = place
            f = wo.framing_for(kind)
            cx, cy, cz, yaw, pitch = wo.entrance_camera(marker, entrance, f["distance"], f["height"])
            return math.hypot(cx - entrance[0], cy - entrance[1])

        by_slug = {p[1]: p for p in wo.PLACES}
        d_bog, d_bfb = back_from_door(by_slug["broken-oar-grotto"]), back_from_door(by_slug["bleak-falls-barrow"])
        self.assertAlmostEqual(d_bog, wo.framing_for("Cave")["distance"], places=1)
        self.assertAlmostEqual(d_bfb, wo.framing_for("NordicRuin")["distance"], places=1)
        self.assertGreater(d_bfb, d_bog)  # the barrow is shot from further back than the grotto

    def test_entrance_camera_never_divides_by_zero_when_marker_and_entrance_coincide(self):
        p = (10.0, 20.0, 30.0)
        cx, cy, cz, yaw, pitch = wo.entrance_camera(p, p)
        self.assertTrue(all(isinstance(v, float) for v in (cx, cy, cz, yaw, pitch)))


if __name__ == "__main__":
    unittest.main()
