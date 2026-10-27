"""
Reads each Wintersun deity's own text from the winning records in the Ultra
load order: the tenets, the follower boon and the devotee boon. They are the
descriptions of the magic effects Wintersun names WSN_<group>_<Deity>_Tenets,
_Boon1 and _Boon2 (_Effect_Ab), the same text the game shows under Active
Effects.

Reads only. Writes gamedata/<version>/deities_raw.json:
  python3 scripts/gamedata/deities.py [version]
"""
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, load_order, localized_strings, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
import textdecode  # noqa: F401  registers the "game" error handler (WO-157 Part 8)

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
PATTERN = re.compile(r"^WSN_([A-Za-z]+)_([A-Za-z]+)_(Tenets|Boon1|Boon2)_Effect_Ab$")
PART = {"Tenets": "tenets", "Boon1": "follower", "Boon2": "devotee"}


def text(raw, strings):
    if strings is not None and len(raw) == 4:
        return strings.get(struct.unpack("<I", raw)[0], "")
    return raw.rstrip(b"\0").decode("utf-8", "game")


def main(version):
    pp, lo = plugin_paths(), load_order()
    winners = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"WSN_" not in buf or b"MGEF" not in buf:
            continue
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = localized_strings(p, n) if loc else None
        for off in iter_group(buf, "MGEF"):
            _, _, fid, d = rec_data(buf, off)
            subs = dict((t, v) for t, v in subrecs(d) if t in ("EDID", "FULL", "DNAM"))
            edid = subs.get("EDID", b"").rstrip(b"\0").decode("latin1")
            m = PATTERN.match(edid)
            if not m:
                continue
            key = resolve(fid, masters, n)
            winners[key] = {
                "edid": edid, "group": m.group(1), "deityKey": m.group(2), "part": PART[m.group(3)],
                "name": text(subs.get("FULL", b""), strings), "text": text(subs.get("DNAM", b""), strings),
                "plugin": n, "id": f"{key[0]}:{key[1]:06X}",
            }
    deities = {}
    for r in winners.values():
        e = deities.setdefault(r["deityKey"], {"key": r["deityKey"], "group": r["group"]})
        e[r["part"]] = {"name": r["name"], "text": r["text"], "source": r["plugin"], "id": r["id"]}
    out = os.path.join(REPO, "gamedata", version, "deities_raw.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"deities": sorted(deities.values(), key=lambda e: e["key"])}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(len(deities), "deities ->", os.path.relpath(out, REPO))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8")
