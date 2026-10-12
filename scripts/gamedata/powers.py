"""
Indexes the active abilities a player can have (powers and lesser powers), the perks that
grant one, and the shouts a player can learn, from the winning records in the Ultra load order.

Reads only. Writes gamedata/<version>/powers_raw.json:
  python3 scripts/gamedata/powers.py [version]

What it reads:
  SPEL  type 2 (Power) or 3 (Lesser power), named, not deleted; its first effect's text
  MGEF  that text (DNAM, with <mag> <dur> tokens) and the values that fill them (SPEL EFIT)
  PERK  "Ability" entries (PRKE type 1) whose spell is a power: the perk grants it
  SHOU  a shout with three words (SNAM), each a WOOP with a translation (TNAM). Shouts whose
        words are the generic undead ones ("Dil Qoth Zaam") or whose EDID marks a dragon,
        boss or NPC are skipped: those are enemy shouts. More skips live in overrides.json
        ("powers" -> "skipNames", "skipEdids").

The base game's names are in Skyrim - Interface.bsa (bsa.py), not loose Strings files.
"""
import json
import os
import re
import struct
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bsa import vanilla_strings  # noqa: E402
from esp import ROOT, header, iter_group, localized_strings, rec_data, resolve, subrecs  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
VERSION = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
TYPES = {2: "Power", 3: "Lesser power"}
DELETED = 0x20
ENEMY_EDID = re.compile(r"(?i)^(DLC1)?Dragon(?!rend)|alduin|npc|zzz|null|greybeard|vyrthur|valthume|SMT_|GS_Shout|REQ_Shout_|boss|dummy|test|Draugr")


def _key(k):
    return (k[0].lower(), k[1])


def read_plugin(buf, name, strings):
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return v.rstrip(b"\0").decode("utf-8", "replace")

    recs = []
    for grp in ("SPEL", "MGEF", "PERK", "SHOU", "WOOP"):
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            _, flags, fid, d = rec_data(buf, o)
            r = {"g": grp, "key": _key(resolve(fid, masters, name)), "plugin": name, "flags": flags, "edid": "", "name": ""}
            entry = None
            for s, v in subrecs(d):
                if s == "EDID":
                    r["edid"] = v.rstrip(b"\0").decode("latin1")
                elif s == "FULL":
                    r["name"] = txt(v).strip()
                elif grp == "SPEL" and s == "SPIT" and len(v) >= 12:
                    r["type"] = struct.unpack_from("<I", v, 8)[0]
                elif grp == "SPEL" and s == "EFID":
                    r.setdefault("effects", []).append({"mgef": _key(resolve(struct.unpack_from("<I", v)[0], masters, name))})
                elif grp == "SPEL" and s == "EFIT" and r.get("effects") and len(v) >= 12:
                    e = r["effects"][-1]
                    e["mag"], e["area"], e["dur"] = struct.unpack_from("<fII", v)
                elif grp == "MGEF" and s == "DNAM":
                    r["text"] = txt(v).strip()
                elif grp == "PERK" and s == "PRKE":
                    entry = v[0]
                elif grp == "PERK" and s == "DATA" and entry == 1 and len(v) == 4:
                    r.setdefault("grants", []).append(_key(resolve(struct.unpack_from("<I", v)[0], masters, name)))
                elif grp == "PERK" and s == "PRKF":
                    entry = None
                elif grp == "SHOU" and s == "SNAM" and len(v) >= 8:
                    r.setdefault("words", []).append(_key(resolve(struct.unpack_from("<I", v)[0], masters, name)))
                elif grp == "SHOU" and s == "DESC":
                    r["desc"] = txt(v).strip()
                elif grp == "WOOP" and s == "TNAM":
                    r["translation"] = txt(v).strip()
            recs.append(r)
    return recs


def fill(text, e):
    for tok, val in (("<mag>", e.get("mag")), ("<dur>", e.get("dur")), ("<area>", e.get("area"))):
        if val is not None:
            text = text.replace(tok, f"{val:g}")
    return re.sub(r"<([^<>]*)>", r"\1", text)


def main():
    from esp import load_order, plugin_paths

    t0 = time.time()
    overrides = json.load(open(os.path.join(REPO, "gamedata", VERSION, "overrides.json"), encoding="utf-8")).get("powers", {}) if os.path.exists(os.path.join(REPO, "gamedata", VERSION, "overrides.json")) else {}
    skip_names = [re.compile(p, re.I) for p in overrides.get("skipNames", [])]
    skip_edids = [re.compile(p, re.I) for p in overrides.get("skipEdids", [])]
    pp, lo = plugin_paths(), load_order()
    case = {n.lower(): n for n in lo}
    win = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if not any(t in buf for t in (b"SPEL", b"PERK", b"SHOU", b"WOOP")):
            continue
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = (localized_strings(p, n) or vanilla_strings(n, ROOT)) if loc else {}
        try:
            recs = read_plugin(buf, n, strings)
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        for r in recs:
            k = (r["g"],) + r["key"]
            win.pop(k, None)
            win[k] = r

    def group(g):
        return {(k[1], k[2]): r for k, r in win.items() if k[0] == g}

    spel, mgef, perk, shou, woop = (group(g) for g in ("SPEL", "MGEF", "PERK", "SHOU", "WOOP"))
    fk = lambda key: f"{case.get(key[0], key[0])}:{key[1]:06X}"  # noqa: E731
    skipped = lambda name, edid: any(p.search(name) for p in skip_names) or any(p.search(edid) for p in skip_edids)  # noqa: E731

    powers = []
    for key, s in spel.items():
        if s.get("type") not in TYPES or not s["name"] or s["flags"] & DELETED or skipped(s["name"], s["edid"]):
            continue
        text = ""
        for e in s.get("effects", []):
            t = mgef.get(e["mgef"], {}).get("text", "")
            if t:
                text = fill(t, e)
                break
        powers.append({"id": fk(key), "name": s["name"], "edid": s["edid"], "kind": TYPES[s["type"]], "text": text, "plugin": s["plugin"]})
    ids = {p["id"] for p in powers}

    from_perks = []
    for key, p in perk.items():
        for g in p.get("grants", []):
            if fk(g) in ids and p["name"]:
                from_perks.append({"perk": p["name"], "perkEdid": p["edid"], "power": fk(g)})

    shouts = []
    for key, s in shou.items():
        if not s["name"] or s["flags"] & DELETED or ENEMY_EDID.search(s["edid"]) or skipped(s["name"], s["edid"]):
            continue
        words = [woop.get(w, {}) for w in s.get("words", [])]
        names = [w.get("name") or re.sub(r"^Word", "", w.get("edid", "")) for w in words]
        tr = [w.get("translation", "") for w in words]
        if len(words) != 3 or not all(names) or not all(tr) or len(set(names)) != 3:
            continue
        shouts.append({"id": fk(key), "name": s["name"], "edid": s["edid"], "words": names, "translations": tr, "text": s.get("desc", ""), "plugin": s["plugin"]})

    counts = {"powers": len(powers), "fromPerks": len(from_perks), "shouts": len(shouts)}
    out = os.path.join(REPO, "gamedata", VERSION, "powers_raw.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"counts": counts, "powers": sorted(powers, key=lambda p: p["name"].lower()), "fromPerks": from_perks, "shouts": sorted(shouts, key=lambda s: s["name"].lower())}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(counts, f"{time.time() - t0:.0f}s")
    print("wrote", os.path.relpath(out, REPO))


if __name__ == "__main__":
    main()
