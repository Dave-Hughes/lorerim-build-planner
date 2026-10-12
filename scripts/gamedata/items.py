"""
Indexes the game's weapons, armor and ammunition from the winning records in
the Ultra load order, for the planner's gear search and @-mentions.

Reads only. Writes gamedata/<version>/items_raw.json:
  python3 scripts/gamedata/items.py [version]

Records are filtered in steps, each counted in the output:
  playable  not flagged non-playable (and, for armor, worn in a slot we show)
  named     a full name that isn't a debug or deleted record (patterns in
            overrides.json, "items" -> "skipNames")
  untemplated  not a generated copy of another record (CNAM on WEAP, TNAM on
            ARMO): the "Iron Sword of Frost" family
  merged    one entry per kind and name, the latest record in the load order winning

build.py turns items_raw.json into src/data/lorerim-<version>/items.json
(see build_items below).
"""
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, rec_data, resolve, subrecs  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

# Record header flags.
DELETED = 0x20
NON_PLAYABLE_RECORD = 0x04  # ARMO (and WEAP in some plugins)
# WEAP DNAM flags (uint16 at offset 12).
WEAP_NON_PLAYABLE = 0x80
# AMMO DATA flags.
AMMO_NON_PLAYABLE = 0x02
AMMO_NON_BOLT = 0x04

# WEAP DNAM animation types, for weapons without a type keyword.
ANIM_TYPES = {1: "Sword", 2: "Dagger", 3: "War Axe", 4: "Mace", 5: "Greatsword", 6: "Battleaxe", 7: "Bow", 8: "Staff", 9: "Crossbow"}
# Weapon type keywords whose name doesn't read well split up.
WEAPON_KEYWORDS = {"WarAxe": "War Axe", "Greatsword": "Greatsword", "Battleaxe": "Battleaxe", "Warhammer": "Warhammer"}

# Biped slots, as bit -> slot, in the order a piece is filed under when it covers several.
BIPED = [(9, "Shield"), (2, "Body"), (0, "Head"), (1, "Head"), (12, "Head"), (11, "Head"), (3, "Hands"), (7, "Feet"), (6, "Ring"), (5, "Amulet")]
ARMOR_TYPES = {0: "Light", 1: "Heavy", 2: "Clothing"}
ARMOR_KEYWORDS = {"ArmorLight": "Light", "ArmorHeavy": "Heavy", "ArmorClothing": "Clothing", "ArmorJewelry": "Clothing"}

DEFAULT_SKIP = ["^zzz", "DELETED", "Dummy", r"^\["]


def _text(v):
    return v.rstrip(b"\0").decode("utf-8", "replace")


def camel_words(s):
    """'WarAxe' -> 'War Axe'."""
    return re.sub(r"(?<=[a-z])(?=[A-Z])", " ", s)


def weapon_type(keywords, anim):
    """From the type keywords (WeapTypeSword, LoreRim's WeapTypeSpear...), else the animation type."""
    for k in keywords:
        m = re.search(r"WeapType(\w+)$", k)
        if not m:
            continue
        name = WEAPON_KEYWORDS.get(m.group(1), camel_words(m.group(1)))
        # Crossbows carry the bow keyword; the animation says which.
        if name == "Bow" and anim == 9:
            return "Crossbow"
        return name
    return ANIM_TYPES.get(anim)


def armor_slot(biped):
    for bit, slot in BIPED:
        if biped & (1 << bit):
            return slot
    return None


def read_plugin(buf, name, strings=None):
    """
    Keywords (form key -> EDID) and item records from one plugin's bytes. Keyword ids in the
    records stay form keys, named later against every plugin's keywords.
    """
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    keywords, items = {}, []
    if b"KYWD" in buf:
        for o in iter_group(buf, "KYWD"):
            _, _, fid, d = rec_data(buf, o)
            for s, v in subrecs(d):
                if s == "EDID":
                    keywords[resolve(fid, masters, name)] = _text(v)
    for grp in ("WEAP", "ARMO", "AMMO"):
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            _, flags, fid, d = rec_data(buf, o)
            key = resolve(fid, masters, name)
            rec = {"plugin": name, "key": list(key), "group": grp, "flags": flags, "edid": "", "name": "", "text": "", "keywords": [], "template": False}
            for s, v in subrecs(d):
                if s == "EDID":
                    rec["edid"] = _text(v)
                elif s == "FULL":
                    rec["name"] = txt(v).strip()
                elif s == "DESC":
                    rec["text"] = txt(v).strip()
                elif s == "KWDA":
                    rec["keywords"] = [list(resolve(struct.unpack_from("<I", v, i)[0], masters, name)) for i in range(0, len(v) - 3, 4)]
                elif (grp == "WEAP" and s == "CNAM") or (grp == "ARMO" and s == "TNAM"):
                    rec["template"] = struct.unpack_from("<I", v)[0] != 0
                elif grp == "WEAP" and s == "DATA" and len(v) >= 10:
                    rec["value"], rec["weight"], rec["damage"] = struct.unpack_from("<IfH", v)
                elif grp == "WEAP" and s == "DNAM" and len(v) >= 14:
                    rec["anim"] = v[0]
                    rec["weapFlags"] = struct.unpack_from("<H", v, 12)[0]
                elif grp == "ARMO" and s == "BOD2" and len(v) >= 8:
                    rec["biped"], rec["bodyType"] = struct.unpack_from("<II", v)
                elif grp == "ARMO" and s == "BODT" and len(v) >= 4:
                    rec["biped"] = struct.unpack_from("<I", v)[0]
                    if len(v) >= 12:
                        rec["bodyType"] = struct.unpack_from("<I", v, 8)[0]
                elif grp == "ARMO" and s == "DATA" and len(v) >= 8:
                    rec["value"], rec["weight"] = struct.unpack_from("<if", v)
                elif grp == "ARMO" and s == "DNAM" and len(v) >= 4:
                    rec["armor"] = struct.unpack_from("<i", v)[0] / 100
                elif grp == "AMMO" and s == "DATA" and len(v) >= 12:
                    _, rec["ammoFlags"], rec["damage"] = struct.unpack_from("<IIf", v)
                    if len(v) >= 16:
                        rec["value"] = struct.unpack_from("<I", v, 12)[0]
                    if len(v) >= 20:
                        rec["weight"] = struct.unpack_from("<f", v, 16)[0]
            items.append(rec)
    return keywords, items


def playable(rec):
    if rec["flags"] & DELETED:
        return False
    if rec["group"] == "WEAP":
        return not (rec["flags"] & NON_PLAYABLE_RECORD) and not (rec.get("weapFlags", 0) & WEAP_NON_PLAYABLE)
    if rec["group"] == "ARMO":
        return not (rec["flags"] & NON_PLAYABLE_RECORD) and armor_slot(rec.get("biped", 0)) is not None
    return not (rec.get("ammoFlags", 0) & AMMO_NON_PLAYABLE)


def named(rec, skip):
    return bool(rec["name"]) and not any(re.search(p, rec["name"], re.IGNORECASE) for p in skip)


def describe(rec, kw_names):
    """A raw record as an index entry: kind, type and the numbers the planner shows."""
    kws = [kw_names.get(tuple(k), "") for k in rec["keywords"]]
    # The id is the plugin that made the record and its form ID there: "Skyrim.esm:012EB7".
    out = {"id": f"{rec['key'][0]}:{rec['key'][1]:06X}", "name": rec["name"], "edid": rec["edid"], "plugin": rec["plugin"]}
    if rec["group"] == "WEAP":
        out.update(kind="weapon", weaponType=weapon_type(kws, rec.get("anim")), damage=rec.get("damage"))
    elif rec["group"] == "ARMO":
        armor_type = next((ARMOR_KEYWORDS[k] for k in kws if k in ARMOR_KEYWORDS), None) or ARMOR_TYPES.get(rec.get("bodyType"))
        out.update(kind="armor", slot=armor_slot(rec.get("biped", 0)), armorType=armor_type, armor=rec.get("armor"))
    else:
        out.update(kind="ammo", ammoType="Arrow" if rec.get("ammoFlags", 0) & AMMO_NON_BOLT else "Bolt", damage=round(rec.get("damage", 0), 2))
    for k in ("weight", "value"):
        if rec.get(k) is not None:
            out[k] = round(rec[k], 2)
    if rec["text"]:
        out["text"] = rec["text"]
    return out


def index_items(winners, kw_names, skip):
    """
    The filter steps over the winning records (in load order), with the count after each.
    Returns (entries, counts).
    """
    counts = {"records": len(winners)}
    rows = [r for r in winners if playable(r)]
    counts["playable"] = len(rows)
    rows = [r for r in rows if named(r, skip)]
    counts["named"] = len(rows)
    rows = [r for r in rows if not r["template"]]
    counts["untemplated"] = len(rows)
    merged = {}
    for r in rows:  # later in the load order wins
        merged[(r["group"], r["name"].lower())] = r
    counts["merged"] = len(merged)
    entries = sorted((describe(r, kw_names) for r in merged.values()), key=lambda e: (e["kind"], e["name"].lower()))
    return entries, counts


def skip_patterns():
    path = os.path.join(REPO, "gamedata", VERSION, "overrides.json")
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f).get("items", {}).get("skipNames", DEFAULT_SKIP)
    except FileNotFoundError:
        return DEFAULT_SKIP


def main():
    from esp import load_order, localized_strings, plugin_paths

    pp, lo = plugin_paths(), load_order()
    kw_names, winners = {}, {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if not any(t in buf for t in (b"WEAP", b"ARMO", b"AMMO", b"KYWD")):
            continue
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        try:
            kws, items = read_plugin(buf, n, localized_strings(p, n) if loc else None)
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        kw_names.update(kws)
        for r in items:
            winners.pop(tuple(r["key"]), None)  # keep load order: the winner goes to the end
            winners[tuple(r["key"])] = r
    entries, counts = index_items(list(winners.values()), kw_names, skip_patterns())
    out = os.path.join(REPO, "gamedata", VERSION, "items_raw.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"counts": counts, "items": entries}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(" -> ".join(f"{k} {v}" for k, v in counts.items()))
    print("wrote", os.path.relpath(out, REPO))


def stats_line(e):
    """'Heavy armor · 25 armor · 30 weight', 'Sword · 7 damage · 10 weight', 'Arrow · 12 damage'."""
    def num(x):
        return f"{x:g}"
    parts = []
    if e["kind"] == "armor":
        parts.append(f"{e['armorType']} armor" if e.get("armorType") in ("Light", "Heavy") else (e.get("armorType") or "Armor"))
        if e.get("armor"):
            parts.append(f"{num(e['armor'])} armor")
    elif e["kind"] == "weapon":
        parts.append(e.get("weaponType") or "Weapon")
        if e.get("damage"):
            parts.append(f"{num(e['damage'])} damage")
    else:
        parts.append(e["ammoType"])
        if e.get("damage"):
            parts.append(f"{num(e['damage'])} damage")
    if e.get("weight"):
        parts.append(f"{num(e['weight'])} weight")
    return " · ".join(parts)


def build_items(raw):
    """items_raw.json -> the planner's items.json rows: { id, name, kind, slot, armorType, weaponType, stats, text }."""
    rows = []
    for e in raw["items"]:
        row = {"id": e["id"], "name": e["name"], "kind": e["kind"]}
        if e["kind"] == "armor":
            row["slot"] = e.get("slot")
            row["armorType"] = e.get("armorType")
        elif e["kind"] == "weapon":
            row["weaponType"] = e.get("weaponType")
        else:
            row["weaponType"] = e.get("ammoType")
        row["stats"] = stats_line(e)
        if e.get("text"):
            row["text"] = e["text"]
        rows.append(row)
    return rows


VERSION = "5.0.4.8"
if __name__ == "__main__":
    if len(sys.argv) > 1:
        VERSION = sys.argv[1]
    main()
