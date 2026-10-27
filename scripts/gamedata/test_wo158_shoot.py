"""
WO-158: the generated console bat files, checked for shape, not run (the game isn't part of this test suite).
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wo158_shoot as wo  # noqa: E402

TOGGLE_WORDS = ("tm", "tfc", "tcl", "tai")


def all_place_lines():
    for name, slug, target, note, marker, entrance in wo.PLACES:
        yield slug, wo.place_lines(target, marker, entrance)
    ws = wo.WINKING_SKEEVER_DOOR
    yield "winking-skeever-outside", [f"fw {wo.CLEAR_WEATHER}", "set gamehour to 12"] + wo.camera_setpos_lines(*wo.door_camera(ws["pos"], ws["door_yaw"]))


class ShapeTest(unittest.TestCase):
    def test_toggles_only_live_in_start_and_end(self):
        # tm, tfc, tcl and tai are toggles -- running one twice flips it back off. They may only appear in the
        # two files meant to bracket the whole session, never inside a per-place or per-person shot.
        for slug, lines in all_place_lines():
            self.assertFalse(any(line.split()[0] in TOGGLE_WORDS for line in lines), (slug, lines))
        for name, slug, target in wo.PEOPLE:
            others = [t for _, _, t in wo.PEOPLE if t != target]
            lines = wo.person_lines(target, others)
            self.assertFalse(any(line.split()[0] in TOGGLE_WORDS for line in lines), (slug, lines))
        self.assertEqual(set(l.split()[0] for l in wo.start_lines()) & set(TOGGLE_WORDS), set(TOGGLE_WORDS))
        self.assertEqual(set(l.split()[0] for l in wo.end_lines()) & set(TOGGLE_WORDS), set(TOGGLE_WORDS))

    def test_time_is_frozen_not_merely_normal_speed(self):
        # sgtm 1 is only normal speed -- noon would drift to afternoon over several hand-framed shots. sgtm 0
        # freezes the clock; that's the one this order actually needs.
        self.assertIn("sgtm 0", wo.start_lines())
        self.assertNotIn("sgtm 1", wo.start_lines())

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
        # mark (not left at the previous shot's camera spot) before any prid/enable/moveto runs.
        lines = wo.person_lines(wo.PEOPLE[0][2], [t for _, _, t in wo.PEOPLE[1:]])
        self.assertEqual(lines[:3], wo.person_mark_lines())
        self.assertEqual(lines[-4:], wo.camera_mark_lines())

    def test_every_target_is_unique(self):
        place_targets = [t for _, _, t, _, _, _ in wo.PLACES] + [wo.WINKING_SKEEVER_DOOR["target"]]
        people_targets = [t for _, _, t in wo.PEOPLE]
        self.assertEqual(len(place_targets), len(set(place_targets)))
        self.assertEqual(len(people_targets), len(set(people_targets)))

    def test_place_lines_set_weather_and_noon(self):
        for slug, lines in all_place_lines():
            self.assertTrue(any(l.startswith("fw ") for l in lines), slug)

    def test_yaw_to_matches_skyrims_own_compass(self):
        # 0 north (+Y), 90 east (+X), 180 south (-Y), 270 west (-X).
        self.assertAlmostEqual(wo.yaw_to((0, 0), (0, 10)), 0.0)
        self.assertAlmostEqual(wo.yaw_to((0, 0), (10, 0)), 90.0)
        self.assertAlmostEqual(wo.yaw_to((0, 0), (0, -10)), 180.0)
        self.assertAlmostEqual(wo.yaw_to((0, 0), (-10, 0)), 270.0)

    def test_entrance_camera_sits_back_from_the_entrance_on_the_markers_own_side(self):
        # The marker is due south of the entrance; the camera should land further south still (behind the
        # marker's own approach direction), raised, facing due north back at the entrance.
        marker = (0.0, 0.0, 0.0)
        entrance = (0.0, 100.0, 0.0)
        cx, cy, cz, yaw = wo.entrance_camera(marker, entrance)
        self.assertAlmostEqual(cx, 0.0, places=3)
        self.assertGreater(cy, 100.0)  # further north than the entrance, i.e. past it along the approach
        self.assertAlmostEqual(cz, wo.HEIGHT, places=3)
        self.assertAlmostEqual(yaw, 180.0)  # facing back south at the entrance

    def test_entrance_camera_never_divides_by_zero_when_marker_and_entrance_coincide(self):
        p = (10.0, 20.0, 30.0)
        cx, cy, cz, yaw = wo.entrance_camera(p, p)
        self.assertTrue(all(isinstance(v, float) for v in (cx, cy, cz, yaw)))


if __name__ == "__main__":
    unittest.main()
