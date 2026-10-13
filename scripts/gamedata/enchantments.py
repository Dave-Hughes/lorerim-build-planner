"""
Indexes the enchantments a player can learn, from the winning records in the Ultra load order.

Reads only. Writes gamedata/<version>/enchantments_raw.json:
  python3 scripts/gamedata/enchantments.py [version]

Where a player learns an enchantment:
  item     disenchanting a playable weapon or armour piece (jewellery included) that carries it
           (EITM) and isn't marked MagicDisallowEnchanting. Disenchanting teaches the item's base
           enchantment (ENIT base), so leveled copies ("Fire Damage 01..06") count once.
  power    the Arcane Experimentation and Artificer's Insight powers: their script turns an Iron
           Dagger and a grand soul gem into one of five daggers (CreatedWeapon1..5) to disenchant.
  runestones  Runemaster Magic: a Power Tome made at a forge from runestones (the recipe needs
           Elemental Lore or Corpus Lore) teaches a lesser power that puts a rune enchantment on
           the weapon for a while, paid in runestones. These are temporary and are listed apart.

Left out, each counted: items that are deleted, non-playable or unnamed; items marked
MagicDisallowEnchanting; staff enchantments (ENIT type 12, a staff takes a spell); enchantments
with an effect marked MagicDisallowEnchanting; base enchantments with no name; and duplicates
(same name, same kind of gear): the one on more items is kept, the others' ids go in `sameAs`.
"""
import json
import os
import re
import struct
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, rec_data, resolve, subrecs  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
VERSION = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"

DELETED = 0x20
NON_PLAYABLE_RECORD = 0x04
WEAP_NON_PLAYABLE = 0x80
ENCH_ENCHANTMENT, ENCH_STAFF = 6, 12
HAS_PERK = 448
DISALLOW = "MagicDisallowEnchanting"
GROUPS = ("KYWD", "WEAP", "ARMO", "ENCH", "MGEF", "FLST", "SPEL", "COBJ", "BOOK", "PERK", "MISC")
# The two Enchanting powers whose script makes a dagger to disenchant, by the perk that grants them.
POWER_PERKS = {"Arcane Experimentation": "Enchanting:Arcane Experimentation", "Artificer's Insight": "Enchanting:Artificer's Insight"}
EXAMPLES = 5


def _lower(key):
    return (key[0].lower(), key[1])


def _ws(b, i):
    n = struct.unpack_from("<H", b, i)[0]
    return b[i + 2:i + 2 + n].decode("latin1"), i + 2 + n


def vmad_props(v, masters, name):
    """Script properties as {script: {property: value}}; objects become form keys."""
    _, fmt, count = struct.unpack_from("<hhH", v, 0)
    i, out = 6, {}

    def obj(i):
        fid = struct.unpack_from("<I", v, i + 4 if fmt == 2 else i)[0]
        return _lower(resolve(fid, masters, name)), i + 8

    for _ in range(count):
        script, i = _ws(v, i)
        i += 1
        n = struct.unpack_from("<H", v, i)[0]
        i += 2
        props = out.setdefault(script, {})
        for _ in range(n):
            pname, i = _ws(v, i)
            kind = v[i]
            i += 2
            if kind == 1:
                props[pname], i = obj(i)
            elif kind == 2:
                props[pname], i = _ws(v, i)
            elif kind == 3:
                props[pname] = struct.unpack_from("<i", v, i)[0]
                i += 4
            elif kind == 4:
                props[pname] = struct.unpack_from("<f", v, i)[0]
                i += 4
            elif kind == 5:
                props[pname] = v[i]
                i += 1
            elif kind == 11:
                k = struct.unpack_from("<I", v, i)[0]
                i += 4
                arr = []
                for _ in range(k):
                    o, i = obj(i)
                    arr.append(o)
                props[pname] = arr
            elif kind == 12:
                k = struct.unpack_from("<I", v, i)[0]
                i += 4
                for _ in range(k):
                    _, i = _ws(v, i)
            elif kind in (13, 14):
                k = struct.unpack_from("<I", v, i)[0]
                i += 4 + 4 * k
            elif kind == 15:
                k = struct.unpack_from("<I", v, i)[0]
                i += 4 + k
            else:
                return out
    return out


def read_plugin(buf, name, strings):
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return v.rstrip(b"\0").decode("utf-8", "replace")

    def form(v, at=0):
        fid = struct.unpack_from("<I", v, at)[0]
        return _lower(resolve(fid, masters, name)) if fid else None

    recs = []
    for grp in GROUPS:
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            _, flags, fid, d = rec_data(buf, o)
            r = {"g": grp, "key": _lower(resolve(fid, masters, name)), "plugin": name, "flags": flags, "edid": "", "name": ""}
            effects = []
            for s, v in subrecs(d):
                if s == "EDID":
                    r["edid"] = v.rstrip(b"\0").decode("latin1")
                elif s == "FULL":
                    r["name"] = txt(v).strip()
                elif s == "KWDA":
                    r["keywords"] = [form(v, i) for i in range(0, len(v) - 3, 4)]
                elif s == "EITM" and grp in ("WEAP", "ARMO"):
                    r["ench"] = form(v)
                elif s == "DNAM" and grp == "WEAP" and len(v) >= 14:
                    r["weapFlags"] = struct.unpack_from("<H", v, 12)[0]
                elif s == "ENIT" and grp == "ENCH" and len(v) >= 24:
                    r["type"] = struct.unpack_from("<I", v, 20)[0]
                    r["base"] = form(v, 28) if len(v) >= 32 else None
                    r["worn"] = form(v, 32) if len(v) >= 36 else None
                elif s == "EFID" and grp in ("ENCH", "SPEL"):
                    effects.append({"mgef": form(v)})
                elif s == "EFIT" and effects and len(v) >= 12:
                    effects[-1]["mag"], effects[-1]["area"], effects[-1]["dur"] = struct.unpack_from("<fII", v)
                elif s == "DNAM" and grp == "MGEF":
                    r["text"] = txt(v).strip()
                elif s == "LNAM" and grp == "FLST":
                    r.setdefault("entries", []).append(form(v))
                elif s == "VMAD" and grp in ("MGEF",):
                    try:
                        r["scripts"] = vmad_props(v, masters, name)
                    except Exception:  # an unreadable script is skipped, never fatal
                        pass
                elif s == "SPIT" and grp == "SPEL" and len(v) >= 12:
                    r["spellType"] = struct.unpack_from("<I", v, 8)[0]
                elif s == "DATA" and grp == "BOOK" and len(v) >= 8:
                    r["teaches"] = v[0] & 0x04 != 0
                    r["spell"] = form(v, 4)
                elif s == "CNAM" and grp == "COBJ":
                    r["makes"] = form(v)
                elif s == "CTDA" and grp == "COBJ" and len(v) >= 16 and struct.unpack_from("<H", v, 8)[0] == HAS_PERK:
                    r.setdefault("perks", []).append(form(v, 12))
            if effects:
                r["effects"] = effects
            recs.append(r)
    return recs


def unmark(t):
    """Markers lose their brackets, as trait and spell text do: '<10>%' -> '10%', '<single use>' -> 'single use'."""
    return re.sub(r"<([^<>]*)>", r"\1", t)


def _num(x):
    return f"{round(float(x), 2):g}"


def fill(text, e):
    t = text.replace("<mag>", _num(e.get("mag") or 0)).replace("<dur>", str(int(e.get("dur") or 0))).replace("<area>", str(int(e.get("area") or 0)))
    return unmark(t).replace("\r\n", " ").strip()


def main():
    from esp import load_order, localized_strings, plugin_paths

    t0 = time.time()
    pp, lo = plugin_paths(), load_order()
    win = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if not any(g.encode() in buf for g in GROUPS):
            continue
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        try:
            recs = read_plugin(buf, n, localized_strings(p, n) if loc else {})
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        for r in recs:
            k = (r["g"],) + r["key"]
            win.pop(k, None)
            win[k] = r

    def group(g):
        return {(k[1], k[2]): r for k, r in win.items() if k[0] == g}

    kywd, weap, armo, ench, mgef, flst, spel, cobj, book, perk, misc = (group(g) for g in GROUPS)
    kw = {k: r["edid"] for k, r in kywd.items()}
    case = {n.lower(): n for n in lo}  # form keys use the load order's spelling, as items.json does
    fk = lambda key: f"{case.get(key[0], key[0])}:{key[1]:06X}"  # noqa: E731
    rank = {n.lower(): i for i, n in enumerate(lo)}
    counts = {}

    def bump(k, n=1):
        counts[k] = counts.get(k, 0) + n

    def disallowed_effect(e):
        return any(kw.get(x) == DISALLOW for f in e.get("effects", []) for x in mgef.get(f["mgef"], {}).get("keywords", []))

    # The daggers the two Enchanting powers make, by the power's name.
    made_by = {}
    for s in spel.values():
        if s["name"] not in POWER_PERKS:
            continue
        for ef in s.get("effects", []):
            for props in mgef.get(ef["mgef"], {}).get("scripts", {}).values():
                for p, v in props.items():
                    if p.startswith("CreatedWeapon") and isinstance(v, tuple):
                        made_by[v] = s["name"]

    # Items that teach an enchantment when disenchanted, grouped by the base enchantment.
    found = {}
    for g, recs in (("weapon", weap), ("armor", armo)):
        for key, r in recs.items():
            if not r.get("ench"):
                continue
            bump("itemsWithEnchantment")
            if r["flags"] & DELETED or r["flags"] & NON_PLAYABLE_RECORD or r.get("weapFlags", 0) & WEAP_NON_PLAYABLE:
                bump("droppedNotPlayable")
                continue
            if not r["name"]:
                bump("droppedUnnamed")
                continue
            if any(kw.get(x) == DISALLOW for x in r.get("keywords", [])):
                bump("droppedCantDisenchant")
                continue
            e = ench.get(r["ench"])
            if not e:
                bump("droppedEnchantmentMissing")
                continue
            base = e.get("base") if e.get("base") in ench else None
            bk = base or r["ench"]
            row = found.setdefault(bk, {"on": set(), "items": [], "powers": set()})
            row["on"].add(g)
            if key in made_by:
                row["powers"].add(made_by[key])
            else:
                row["items"].append(r["name"])

    rows, dropped = [], []
    for bk, f in found.items():
        e = ench[bk]
        if e.get("type") == ENCH_STAFF:
            bump("droppedStaff")
            continue
        if e.get("type") != ENCH_ENCHANTMENT:
            bump("droppedOtherType")
            dropped.append(f"{e['edid']}: ENIT type {e.get('type')}")
            continue
        if not e["name"]:
            bump("droppedUnnamedEnchantment")
            dropped.append(f"{e['edid']} ({fk(bk)}): no name, on {', '.join(sorted(set(f['items']))[:3])}")
            continue
        if disallowed_effect(e):
            bump("droppedEffectDisallowed")
            dropped.append(f"{e['name']} ({e['edid']}): an effect is marked {DISALLOW}")
            continue
        effects = []
        for ef in e.get("effects", []):
            m = mgef.get(ef["mgef"], {})
            effects.append({"id": fk(ef["mgef"]), "name": m.get("name", ""), "text": m.get("text", ""), "mag": ef.get("mag"), "area": ef.get("area"), "dur": ef.get("dur")})
        texts, seen = [], set()
        for ef in effects:
            if not ef["text"]:
                continue
            head = " ".join(re.sub(r"<[^>]*>|\d+", "", ef["text"]).lower().split()[:4])
            if head in seen:
                continue
            seen.add(head)
            texts.append(fill(ef["text"], ef))
        worn = [kw.get(x, fk(x)) for x in flst.get(e.get("worn"), {}).get("entries", []) if x] if e.get("worn") else []
        on = "weapon" if f["on"] == {"weapon"} else "armor" if f["on"] == {"armor"} else "both"
        sources = []
        if f["items"]:
            names = sorted(set(f["items"]), key=str.lower)
            sources.append({"kind": "item", "count": len(f["items"]), "examples": names[:EXAMPLES]})
        for pw in sorted(f["powers"]):
            sources.append({"kind": "power", "power": pw, "perk": POWER_PERKS[pw]})
        rows.append({"id": fk(bk), "name": e["name"], "edid": e["edid"], "plugin": e["plugin"], "order": rank.get(e["plugin"].lower()), "on": on,
                     "text": " ".join(texts), "effects": effects, "wornRestrictions": worn, "sources": sources})

    # Same name, same kind of gear: keep the one on more items (then the later plugin).
    keep = {}
    for r in rows:
        k = (r["name"], r["on"])
        weight = lambda x: (sum(s.get("count", 0) for s in x["sources"]) + 1000 * any(s["kind"] == "power" for s in x["sources"]), x["order"] or -1)  # noqa: E731
        old = keep.get(k)
        if old is None:
            keep[k] = r
            continue
        win_, lose = (r, old) if weight(r) > weight(old) else (old, r)
        dropped.append(f"{lose['name']} ({lose['edid']}, {lose['plugin']}): same name as {win_['edid']}")
        bump("droppedDuplicate")
        keep[k] = dict(win_, sameAs=sorted({*win_.get("sameAs", []), lose["id"], *lose.get("sameAs", [])}))
    rows = sorted(keep.values(), key=lambda r: (r["on"], r["name"].lower()))

    # Runestone enchantments (Runemaster Magic): forge recipes for Power Tomes, gated by perks.
    perk_name = {k: r["name"] for k, r in perk.items()}
    runes = {}
    rune_ench = {}
    for k, e in ench.items():
        m = re.match(r"Rune: (.+)$", e["name"])
        if m and "weapench" in e["edid"].lower():
            rune_ench[m.group(1)] = k
    for c in cobj.values():
        b = book.get(c.get("makes"))
        if not b or not b.get("teaches") or c["flags"] & DELETED:
            continue
        s = spel.get(b.get("spell"))
        if not s:
            continue
        cost = None
        text = ""
        for ef in s.get("effects", []):
            m = mgef.get(ef["mgef"], {})
            for props in m.get("scripts", {}).values():
                if "ItemToRemove" in props:
                    stone = misc.get(props["ItemToRemove"], {})
                    cost = {"runestone": stone.get("edid", ""), "count": props.get("RemoveCount", 1)}
            if m.get("text") and not text:
                text = fill(m["text"], ef)
        if not cost:
            continue
        perks = {f"Enchanting:{perk_name[p]}" for p in c.get("perks", []) if p in perk_name}
        row = runes.setdefault(fk(s["key"]), {"power": fk(s["key"]), "name": s["name"], "tome": b["name"], "perks": set(), "cost": cost, "text": text,
                                              "enchantment": fk(rune_ench[s["name"]]) if s["name"] in rune_ench else None})
        row["perks"] |= perks  # a tome with several recipes needs whichever perk each recipe asks for
    runes = sorted((dict(r, perks=sorted(r["perks"])) for r in runes.values()), key=lambda r: r["name"].lower())

    counts.update({"enchantments": len(rows), "weapon": sum(r["on"] == "weapon" for r in rows), "armor": sum(r["on"] == "armor" for r in rows),
                   "fromPowers": sum(any(s["kind"] == "power" for s in r["sources"]) for r in rows), "runestone": len(runes)})
    out = os.path.join(REPO, "gamedata", VERSION, "enchantments_raw.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"counts": counts, "dropped": sorted(dropped), "enchantments": rows, "runestone": runes}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(json.dumps(counts), f"{time.time() - t0:.0f}s")
    print("wrote", os.path.relpath(out, REPO))


# The planner's gear slots for each worn-restriction keyword (WO-54).
SLOT_OF = {
    "ArmorCuirass": "Body", "ClothingBody": "Body",
    "ArmorHelmet": "Head", "ClothingHead": "Head", "ClothingCirclet": "Head",
    "ArmorGauntlets": "Hands", "ClothingHands": "Hands",
    "ArmorBoots": "Feet", "ClothingFeet": "Feet",
    "ArmorShield": "Shield",
    "ClothingRing": "Ring",
    "ClothingNecklace": "Amulet",
}
ARMOR_SLOTS = ["Head", "Body", "Hands", "Feet", "Shield", "Ring", "Amulet"]


def learned_line(sources):
    """'Disenchant: Ring of Eminent Health, Necklace of Eminent Health and 100 more', or 'The Arcane
    Experimentation power'. Both, when it's learned both ways."""
    parts = []
    for src in sources:
        if src["kind"] == "item":
            shown = src.get("examples", [])[:2]
            more = src.get("count", len(shown)) - len(shown)
            parts.append("Disenchant: " + ", ".join(shown) + (f" and {more} more" if more > 0 else ""))
        elif src["kind"] == "power":
            parts.append(f"The {src['power']} power")
    return "; ".join(parts)


def build_enchantments(raw):
    """
    enchantments_raw.json -> the planner's enchantments.json rows: { id, name, on, text, slots,
    learned, powers?, sameAs? }. `slots` are the planner's gear slots for an armour enchantment
    (every armour slot when it has no restriction; none for a weapon). `powers` lists the perks
    whose power teaches it, when that's the only way to learn it. The runestone powers stay out:
    they are temporary runes, already abilities in powers.json.
    """
    rows = []
    for e in raw["enchantments"]:
        row = {"id": e["id"], "name": e["name"], "on": e["on"], "text": e.get("text", "")}
        if e["on"] == "armor":
            slots = {SLOT_OF[k] for k in e.get("wornRestrictions", []) if k in SLOT_OF}
            row["slots"] = [x for x in ARMOR_SLOTS if x in slots] if slots else list(ARMOR_SLOTS)
        else:
            row["slots"] = []
        row["learned"] = learned_line(e.get("sources", []))
        if e.get("sources") and all(src["kind"] == "power" for src in e["sources"]):
            row["powers"] = sorted({src["perk"] for src in e["sources"]})
        if e.get("sameAs"):
            row["sameAs"] = e["sameAs"]
        rows.append(row)
    rows.sort(key=lambda r: (r["on"], r["name"].lower()))
    return rows


if __name__ == "__main__":
    main()
