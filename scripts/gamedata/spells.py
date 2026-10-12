"""
Indexes the spells a player can learn from a spell tome, from the winning records in the
Ultra load order, and the tomes a magic tier perk lets you pick from.

Reads only. Writes gamedata/<version>/spells_raw.json:
  python3 scripts/gamedata/spells.py [version]

What it reads:
  BOOK  tomes: DATA flag 0x04 ("teaches spell") and the spell they teach
  SPEL  the spell: name, base cost, cast type, and its effects (EFID + EFIT magnitude,
        area, duration), in record order; the first effect is the spell's main one
  MGEF  each effect: name, the game's text (DNAM, with <mag> <dur> <area> tokens), its
        magic skill and minimum skill level. A spell's school is its first effect's skill;
        its tier is the highest minimum skill among its effects (0/25/50/75/100)
  QUST  Requiem - Customizable Spells Per Perk: the tier perks hand you a pick of tomes.
        Its quest script holds, per school, five leveled lists (Novice..Master); the
        tomes in each (followed through nested lists) are the pool for that perk.
        How many you pick per perk is a global in the same plugin (see PICK_GLOBALS).

Tomes whose spell no record defines are counted and left out.
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

SKILLS = {18: "Alteration", 19: "Conjuration", 20: "Destruction", 21: "Illusion", 22: "Restoration"}
TIERS = ["Novice", "Apprentice", "Adept", "Expert", "Master"]
PICK_PLUGIN = "requiem - customizable spells per perk.esp"
PICK_GLOBALS = {0x002: "Novice", 0x800: "Apprentice", 0x801: "Adept", 0x802: "Expert", 0x003: "Master"}
CAST = {0: "Constant effect", 1: "Fire and forget", 2: "Concentration", 3: "Scroll"}
DELETED = 0x20


def tier(level):
    return TIERS[min(4, max(0, level // 25))]


def school_and_tier(effects):
    """A spell's school is its first (main) effect's magic skill; its tier is the highest minimum
    skill among all its effects (0 Novice, 25 Apprentice, 50 Adept, 75 Expert, 100 Master)."""
    school = effects[0]["skill"] if effects else None
    top = max([e["minSkill"] for e in effects] or [0])
    return school, tier(top), top


def _lower(key):
    return (key[0].lower(), key[1])


def _ws(b, i):
    n = struct.unpack_from("<H", b, i)[0]
    return b[i + 2:i + 2 + n].decode("latin1"), i + 2 + n


def vmad_object_arrays(v, masters, name):
    """Script properties that are arrays of forms, as {property: [form key, ...]}."""
    _, fmt, count = struct.unpack_from("<hhH", v, 0)
    i, out = 6, {}

    def obj(i):
        fid = struct.unpack_from("<I", v, i + 4 if fmt == 2 else i)[0]
        return resolve(fid, masters, name), i + 8

    for _ in range(count):
        _, i = _ws(v, i)
        i += 1
        props = struct.unpack_from("<H", v, i)[0]
        i += 2
        for _ in range(props):
            pname, i = _ws(v, i)
            kind = v[i]
            i += 2
            if kind == 1:
                _, i = obj(i)
            elif kind == 2:
                _, i = _ws(v, i)
            elif kind in (3, 4):
                i += 4
            elif kind == 5:
                i += 1
            elif kind == 11:
                n = struct.unpack_from("<I", v, i)[0]
                i += 4
                arr = []
                for _ in range(n):
                    o, i = obj(i)
                    arr.append(_lower(o))
                out[pname] = arr
            elif kind == 12:
                n = struct.unpack_from("<I", v, i)[0]
                i += 4
                for _ in range(n):
                    _, i = _ws(v, i)
            elif kind in (13, 14):
                n = struct.unpack_from("<I", v, i)[0]
                i += 4 + 4 * n
            elif kind == 15:
                n = struct.unpack_from("<I", v, i)[0]
                i += 4 + n
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

    recs = []
    for grp in ("BOOK", "SPEL", "MGEF", "LVLI", "GLOB", "QUST"):
        if grp.encode() not in buf:
            continue
        if grp == "QUST" and b"ISL_" not in buf:
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
                elif grp == "BOOK" and s == "DATA" and len(v) >= 8:
                    r["teaches"] = v[0] & 0x04 != 0
                    r["spell"] = _lower(resolve(struct.unpack_from("<I", v, 4)[0], masters, name))
                elif grp == "SPEL" and s == "SPIT" and len(v) >= 36:
                    r["cost"], _, r["type"], _, r["cast"] = struct.unpack_from("<IIIfI", v)
                elif grp == "SPEL" and s == "DESC":
                    r["desc"] = txt(v).strip()
                elif grp == "SPEL" and s == "EFID":
                    effects.append({"mgef": _lower(resolve(struct.unpack_from("<I", v)[0], masters, name))})
                elif grp == "SPEL" and s == "EFIT" and effects and len(v) >= 12:
                    effects[-1]["mag"], effects[-1]["area"], effects[-1]["dur"] = struct.unpack_from("<fII", v)
                elif grp == "MGEF" and s == "DATA" and len(v) >= 44:
                    r["skill"] = struct.unpack_from("<i", v, 12)[0]
                    r["minSkill"] = struct.unpack_from("<I", v, 40)[0]
                elif grp == "MGEF" and s == "DNAM":
                    r["text"] = txt(v).strip()
                elif grp == "LVLI" and s == "LVLO" and len(v) >= 8:
                    r.setdefault("entries", []).append(_lower(resolve(struct.unpack_from("<I", v, 4)[0], masters, name)))
                elif grp == "GLOB" and s == "FLTV":
                    r["value"] = struct.unpack_from("<f", v)[0]
                elif grp == "QUST" and s == "VMAD" and b"ISL_" in v:
                    try:
                        r["arrays"] = vmad_object_arrays(v, masters, name)
                    except Exception:  # an unreadable quest script is skipped, never fatal
                        pass
            if effects:
                r["effects"] = effects
            recs.append(r)
    return recs


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
        if not any(t in buf for t in (b"BOOK", b"SPEL", b"MGEF", b"LVLI", b"GLOB")):
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

    books, spels, mgefs, lvli, globs, qust = (group(g) for g in ("BOOK", "SPEL", "MGEF", "LVLI", "GLOB", "QUST"))
    case = {n.lower(): n for n in lo}  # form keys use the load order's spelling, as items.json does
    fk = lambda key: f"{case.get(key[0], key[0])}:{key[1]:06X}"  # noqa: E731

    tomes = [b for b in books.values() if b.get("teaches") and not b["flags"] & DELETED]
    spells, missing = {}, 0
    for b in tomes:
        s = spels.get(b["spell"])
        if not s or s["flags"] & DELETED:
            missing += 1
            continue
        e = spells.setdefault(b["spell"], {"spell": s, "tomes": []})
        e["tomes"].append({"id": fk(b["key"]), "name": b["name"], "plugin": b["plugin"]})

    # The winning record's place in the load order: build.py keeps the later of two same-named spells.
    rank = {n.lower(): i for i, n in enumerate(lo)}
    rows = []
    for key, v in spells.items():
        s = v["spell"]
        effects = []
        for ef in s.get("effects", []):
            m = mgefs.get(ef["mgef"], {})
            effects.append({"id": fk(ef["mgef"]), "name": m.get("name", ""), "text": m.get("text", ""), "skill": SKILLS.get(m.get("skill")),
                            "minSkill": m.get("minSkill", 0), "mag": ef.get("mag"), "area": ef.get("area"), "dur": ef.get("dur")})
        school, tr, top = school_and_tier(effects)
        rows.append({"id": fk(key), "name": s["name"], "edid": s["edid"], "plugin": s["plugin"], "order": rank.get(s["plugin"].lower()), "school": school, "tier": tr, "minSkill": top,
                     "cost": s.get("cost"), "cast": CAST.get(s.get("cast")), "desc": s.get("desc", ""), "effects": effects, "tomes": v["tomes"]})
    rows.sort(key=lambda r: (r["school"] or "~", TIERS.index(r["tier"]), r["name"].lower()))

    # The tier perks' tome pools.
    def leaves(k, seen):
        if k in seen:
            return []
        seen.add(k)
        if k in lvli:
            out = []
            for c in lvli[k].get("entries", []):
                out += leaves(c, seen)
            return out
        return [k]

    picks = {}
    for q in qust.values():
        for school, keys in (q.get("arrays") or {}).items():
            if school.title() not in SKILLS.values() or len(keys) != 5:
                continue
            for t, k in zip(TIERS, keys):
                ids = sorted({fk(books[x]["spell"]) for x in leaves(k, set()) if x in books and books[x].get("spell") in spells})
                picks[f"{school.title()} {t}"] = {"list": lvli.get(k, {}).get("edid", ""), "spells": ids}
    per_perk = {t: int(globs[(PICK_PLUGIN, fid)]["value"]) for fid, t in PICK_GLOBALS.items() if (PICK_PLUGIN, fid) in globs}

    # Globals that spell text shows as <Global=EDID>, by editor id, so build.py can fill them.
    named = {r["edid"]: r["value"] for r in globs.values() if r.get("edid") and "value" in r}
    wanted = {m for row in rows for e in row["effects"] for m in re.findall(r"<Global=([^<>]+)>", e["text"] or "")}
    glob_values = {k: named[k] for k in sorted(wanted) if k in named}

    counts = {"tomes": len(tomes), "tomesWithoutSpell": missing, "spells": len(rows), "pickPools": len(picks)}
    out = os.path.join(REPO, "gamedata", VERSION, "spells_raw.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"counts": counts, "picksPerPerk": per_perk, "perkPicks": picks, "globals": glob_values, "spells": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(counts, "picks per perk", per_perk, f"{time.time() - t0:.0f}s")
    print("wrote", os.path.relpath(out, REPO))


# ---- Building spells.json (build.py), from the committed raw file ----------------------------

SCHOOL_ORDER = ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration"]
EDITOR_ID = re.compile(r"^[a-z]+[A-Z0-9_]|^[A-Za-z0-9]+_[A-Za-z0-9_]+$")


def _num(x):
    """40.0 -> '40', 0.3499999940395355 -> '0.35'."""
    return f"{round(float(x), 2):g}"


def fill_text(text, effect, glob_values, unmark):
    """The game's text with <mag>, <dur>, <area> and <Global=X> filled. A sentence whose global
    isn't known is left out (spells.py writes their values from the next run). Other <...>
    markers (<20>, <Spirit>) lose their brackets, as trait text does. Returns (text, unknown globals)."""
    unknown = []
    t = text.replace("<mag>", _num(effect.get("mag") or 0)).replace("<dur>", str(int(effect.get("dur") or 0))).replace("<area>", str(int(effect.get("area") or 0)))

    def glob(m):
        k = m.group(1)
        if k in glob_values:
            return _num(glob_values[k])
        unknown.append(k)
        return "\0"

    t = re.sub(r"<Global=([^<>]+)>", glob, t)
    if "\0" in t:
        t = re.sub(r"\s*\([^()]*\0[^()]*\)", "", t)
        t = " ".join(p for p in re.split(r"(?<=[.!?])\s+", t) if "\0" not in p)
    return unmark(t).strip(), unknown


def build_spells(raw, perk_ids, unmark, clean):
    """spells.json: the spells a tome teaches, one per name, school and tier, with the game's text
    filled in, and the tier perks' picks keyed by the perk's id (WO-41). Returns (data, notes)."""
    notes = []
    pooled = {i for p in raw.get("perkPicks", {}).values() for i in p["spells"]}
    glob_values = raw.get("globals", {})
    keep = {}
    for s in raw["spells"]:
        if not s.get("name") or not s.get("school"):
            continue
        k = (s["name"], s["school"], s["tier"])
        old = keep.get(k)
        if old is None:
            keep[k] = s
            continue
        # The later one in the load order; without the order (an older raw file), the one a tier
        # perk hands out, then the one with more tomes.
        if s.get("order") is not None and old.get("order") is not None:
            if s["order"] > old["order"]:
                keep[k] = s
        elif (s["id"] in pooled, len(s["tomes"])) > (old["id"] in pooled, len(old["tomes"])):
            keep[k] = s
        elif (s["id"] in pooled, len(s["tomes"])) == (old["id"] in pooled, len(old["tomes"])):
            notes.append(f"spell {s['name']} ({s['school']} {s['tier']}): two records and no load order, kept {old['id']}")
    rows = []
    for s in keep.values():
        effects = s["effects"]
        main = next((e for e in effects if e.get("text")), None)
        text, unknown = fill_text(clean(main["text"]), main, glob_values, unmark) if main else (clean(s.get("desc", "")), [])
        if unknown:
            notes.append(f"spell {s['name']}: left out a sentence with {', '.join(unknown)} (not in spells_raw.json)")
        also = []
        for e in effects:
            n = (e.get("name") or "").strip()
            if e is main or not e.get("text") or not n or EDITOR_ID.match(n) or n == s["name"] or n in also:
                continue
            also.append(n)
        row = {"id": s["id"], "name": s["name"], "school": s["school"], "tier": s["tier"], "cost": s.get("cost"), "cast": s.get("cast"), "text": text}
        if also:
            row["also"] = also
        row["tomes"] = sorted({t["name"] for t in s["tomes"]})
        rows.append(row)
    rows.sort(key=lambda r: (SCHOOL_ORDER.index(r["school"]) if r["school"] in SCHOOL_ORDER else 9, TIERS.index(r["tier"]), r["name"].lower()))
    ids = {r["id"] for r in rows}
    pools = {}
    for key, p in raw.get("perkPicks", {}).items():
        school, t = key.split(" ", 1)
        pid = f"{school}:{t} {school}"
        if pid not in perk_ids:
            notes.append(f"spell picks {key}: no perk {pid}")
            continue
        pools[pid] = [i for i in p["spells"] if i in ids]
    per = raw.get("picksPerPerk", {})
    return {"spells": rows, "spellPicks": {"perTier": {t: per[t] for t in TIERS if t in per}, "pools": pools}}, notes


if __name__ == "__main__":
    main()
