"""
Spike: pulls an item's model and textures out of the LoreRim install, the way the game would find
them, so render.py can draw it.

Reads only. For each item: the winning record's model path (WEAP MODL, ARMO MOD2 the male ground
model), then the .nif and every .dds it names, each from the winning source: loose files in MO2
priority order beat archives, and among archives the one loaded later wins (the ini's vanilla list
first, then each plugin's own archives in load order).

  LORERIM_ROOT=C:/LoreRim python scripts/renders/fetch.py [out dir]

Writes <out>/<item>/ with meshes\\... and textures\\... as in a Data folder, and <out>/items.json.
"""
import json
import os
import re
import struct
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "gamedata"))
from esp import ROOT, header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402

ITEMS = {
    "glass-cuirass": ("ARMO", "Skyrim.esm", 0x013939),
    "dawnbreaker": ("WEAP", "Skyrim.esm", 0x04E4EE),
    "glass-light-bow": ("WEAP", "Skyrim.esm", 0x0139A5),
}


def winning_records():
    """{slug: (plugin, model path)} from the last plugin in the load order that has each record."""
    pp, lo = plugin_paths(), load_order()
    want = {(p.lower(), fid): slug for slug, (_, p, fid) in ITEMS.items()}
    found = {}
    for n in lo:
        path = pp.get(n.lower())
        if not path:
            continue
        buf = open(path, "rb").read()
        for grp in {g for g, _, _ in ITEMS.values()}:
            if grp.encode() not in buf:
                continue
            try:
                masters = header(buf)
                for o in iter_group(buf, grp):
                    _, _, fid, d = rec_data(buf, o)
                    key = resolve(fid, masters, n)
                    slug = want.get((key[0].lower(), key[1]))
                    if not slug:
                        continue
                    model = None
                    for s, v in subrecs(d):
                        if (grp == "WEAP" and s == "MODL") or (grp == "ARMO" and s == "MOD2"):
                            model = v.rstrip(b"\0").decode("latin1")
                    if model:
                        found[slug] = (n, model)
            except Exception as e:  # noqa: BLE001
                print("skip", n, e, file=sys.stderr)
    return found


class Archive:
    """One BSA's file list, read on demand (v103/104 zlib, v105 LZ4 frame)."""

    def __init__(self, path):
        self.path, self.files = path, {}
        with open(path, "rb") as f:
            magic, ver, off, aflags, nfold, _nf, _fl, filen, _ff = struct.unpack("<4sIIIIIIII", f.read(36))
            if magic != b"BSA\x00":
                raise ValueError("not a BSA")
            self.ver, self.compressed, self.embed = ver, bool(aflags & 4), bool(aflags & 0x100)
            f.seek(off)
            rec = 24 if ver == 105 else 16
            folders = [struct.unpack("<QI", f.read(rec)[:12]) for _ in range(nfold)]
            blocks = []
            for _h, count in folders:
                ln = f.read(1)[0]
                name = f.read(ln).rstrip(b"\0").decode("latin1")
                blocks.append((name, [struct.unpack("<QII", f.read(16)) for _ in range(count)]))
            names = f.read(filen).split(b"\0")
            i = 0
            for folder, recs in blocks:
                for _h, size, o in recs:
                    self.files[(folder + "\\" + names[i].decode("latin1")).lower()] = (size, o)
                    i += 1

    def read(self, name):
        size, o = self.files[name]
        packed = self.compressed ^ bool(size & 0x40000000)
        size &= 0x3FFFFFFF
        with open(self.path, "rb") as f:
            f.seek(o)
            if self.embed:
                ln = f.read(1)[0]
                f.read(ln)
                size -= ln + 1
            if not packed:
                return f.read(size)
            raw_size = struct.unpack("<I", f.read(4))[0]
            data = f.read(size - 4)
        if self.ver == 105:
            import lz4.frame
            return lz4.frame.decompress(data)
        out = zlib.decompress(data)
        assert len(out) == raw_size
        return out


class Data:
    """The game's view of Data/: loose files by MO2 priority, then archives, later ones winning."""

    def __init__(self):
        mods = [l.strip()[1:] for l in open(os.path.join(ROOT, "profiles", "Ultra", "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
        self.dirs = [os.path.join(ROOT, "mods", d) for d in mods] + [os.path.join(ROOT, "Stock Game", "Data")]
        found = {}  # archive file name (lower) -> path, highest-priority folder first
        for d in reversed(self.dirs):
            try:
                for f in os.listdir(d):
                    if f.lower().endswith(".bsa"):
                        found[f.lower()] = os.path.join(d, f)
            except OSError:
                pass
        order = []
        ini = open(os.path.join(ROOT, "profiles", "Ultra", "skyrim.ini"), encoding="utf-8", errors="ignore").read()
        for line in re.findall(r"^sResourceArchiveList2?=(.*)$", ini, re.M):
            order += [a.strip().lower() for a in line.split(",") if a.strip()]
        for p in load_order():
            base = os.path.splitext(p)[0].lower()
            order += [base + ".bsa", base + " - textures.bsa"]
        self.archives = []
        for a in order:
            if a in found and found[a] not in [x.path for x in self.archives]:
                try:
                    self.archives.append(Archive(found[a]))
                except Exception as e:  # noqa: BLE001
                    print("archive skipped", a, e, file=sys.stderr)

    def get(self, rel):
        """(bytes, where it came from) for a path under Data/, or (None, None)."""
        rel = rel.replace("/", "\\").lower().lstrip("\\")
        for d in self.dirs:
            p = os.path.join(d, rel.replace("\\", os.sep))
            if os.path.exists(p):
                return open(p, "rb").read(), os.path.relpath(d, ROOT)
        for a in reversed(self.archives):
            if rel in a.files:
                return a.read(rel), os.path.relpath(a.path, ROOT)
        return None, None


def textures_in(nif):
    """Every .dds path a NIF's shader texture sets name."""
    out = []
    for m in re.finditer(rb"[A-Za-z0-9_ \\/.\-']+?\.dds", nif, re.I):
        t = m.group(0).decode("latin1").replace("/", "\\").lower()
        t = t[t.index("textures\\"):] if "textures\\" in t else "textures\\" + t.lstrip("\\")
        if t not in out:
            out.append(t)
    return out


def main(out):
    records = winning_records()
    data = Data()
    report = {}
    for slug, (plugin, model) in records.items():
        nif_rel = "meshes\\" + model.lower().lstrip("\\")
        nif, src = data.get(nif_rel)
        entry = {"record": plugin, "model": nif_rel, "modelFrom": src, "textures": {}}
        if nif is None:
            print(slug, "model not found", nif_rel)
            report[slug] = entry
            continue
        base = os.path.join(out, slug)
        for rel, b in [(nif_rel, nif)] + [(t, None) for t in textures_in(nif)]:
            if b is None:
                b, tsrc = data.get(rel)
                entry["textures"][rel] = tsrc
                if b is None:
                    continue
            p = os.path.join(base, rel.replace("\\", os.sep))
            os.makedirs(os.path.dirname(p), exist_ok=True)
            open(p, "wb").write(b)
        report[slug] = entry
        print(slug, "<-", plugin, nif_rel, "from", src, "|", len(entry["textures"]), "textures,", sum(1 for v in entry["textures"].values() if not v), "missing")
    os.makedirs(out, exist_ok=True)
    json.dump(report, open(os.path.join(out, "items.json"), "w", encoding="utf-8"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "..", "renders-spike", "_work"))
