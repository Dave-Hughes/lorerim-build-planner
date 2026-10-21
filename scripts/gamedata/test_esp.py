"""
esp.load_order on an install laid out like LoreRim's (WO-121b): the Creation Club plugins come from Stock Game's
Skyrim.ccc, not plugins.txt, and the start check takes them, with their archives' scripts, after the base masters.
  python3 -m unittest discover -s scripts/gamedata -p 'test_*.py'
"""
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import esp  # noqa: E402
from pex import archive_order  # noqa: E402


def touch(path, data=b""):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


class LoadOrderTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        r = self.tmp.name
        touch(os.path.join(r, "profiles", "Ultra", "modlist.txt"), b"+Official Master Files - Cleaned Plugins\n+A Mod\n")
        touch(os.path.join(r, "profiles", "Ultra", "plugins.txt"), b"*AMod.esp\n*cckrtsse001_altar.esl\n")
        touch(os.path.join(r, "Stock Game", "Skyrim.ccc"), b"ccBGSSSE001-Fish.esm\nccKRTSSE001_Altar.esl\nccMissing.esl\n")
        touch(os.path.join(r, "Stock Game", "Data", "Skyrim.esm"))
        for f in ("ccBGSSSE001-Fish.esm", "cckrtsse001_altar.esl", "cckrtsse001_altar.bsa"):
            touch(os.path.join(r, "mods", "Official Master Files - Cleaned Plugins", f))
        touch(os.path.join(r, "mods", "A Mod", "AMod.esp"))
        self.was, esp.ROOT = esp.ROOT, r

    def tearDown(self):
        esp.ROOT = self.was
        self.tmp.cleanup()

    def test_creation_club_after_the_base_masters(self):
        self.assertEqual(esp.creation_club(), ["ccBGSSSE001-Fish.esm", "cckrtsse001_altar.esl"])
        base = ["Skyrim.esm", "Update.esm", "Dawnguard.esm", "HearthFires.esm", "Dragonborn.esm"]
        self.assertEqual(esp.load_order(), base + ["AMod.esp", "cckrtsse001_altar.esl"])
        self.assertEqual(esp.load_order(cc=True), base + ["ccBGSSSE001-Fish.esm", "cckrtsse001_altar.esl", "AMod.esp"])

    def test_the_archives_come_with_them(self):
        dirs = [os.path.join(esp.ROOT, "mods", d) for d in ("Official Master Files - Cleaned Plugins", "A Mod")]
        names = lambda lo: [os.path.basename(a) for a in archive_order(esp.ROOT, lo, dirs)]  # noqa: E731
        self.assertEqual(names(esp.load_order(cc=True)), ["cckrtsse001_altar.bsa"])
        self.assertEqual(names(["Skyrim.esm", "AMod.esp"]), [])


if __name__ == "__main__":
    unittest.main()
