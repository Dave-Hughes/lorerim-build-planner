"""
Crafting and tempering recipes for the indexed gear, from the winning COBJ records in the Ultra
load order, and each item plugin's Nexus mod from the MO2 mod folder it loads from.

Reads only. Needs items_raw.json (items.py) first. Writes gamedata/<version>/recipes_raw.json and
plugins_raw.json:
  python3 scripts/gamedata/recipes.py [version]

Recipes are filtered in steps, each counted in the output:
  read       every winning COBJ record
  at a station  made at a station: not deleted, and not one Requiem turns off by moving it to
             REQ_DisableRecipe or that has no station (BNAM) at all
  kept       its created object (CNAM) is an item in items_raw.json, by any entry's id (so a
             recipe for a record merged into another one's `also` is kept too)
Breakdown recipes (gear back into ingots) create something that isn't gear, so they fall out at
"kept"; they're counted on their own.

Each kept recipe is crafting ("make") or tempering ("improve"): a recipe at the Grindstone or the
Workbench that uses no other gear is tempering. Conditions are kept as the record has them;
build_recipes turns HasPerk into perk ids and counts the rest, leaving out the routine tempering
check (see routine).

Plugins: every plugin that has an item (the plugin that made the record, and the one whose
version won), with the MO2 mod folder it was loaded from and that folder's meta.ini modid. The
base game and DLC (Stock Game/Data) and Creation Club plugins (cc*) never get a modid.
"""
import configparser
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import active_profile, header, iter_group, rec_data, resolve, subrecs  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

DELETED = 0x20
CMP = {0: "==", 1: "!=", 2: ">", 3: ">=", 4: "<", 5: "<="}
# Condition functions by index, the ones COBJ records use (xEdit's names).
FUNCTIONS = {
    14: "GetActorValue", 47: "GetItemCount", 56: "GetQuestRunning", 58: "GetStage", 59: "GetStageDone", 69: "GetIsRace",
    71: "GetInFaction", 72: "GetIsID", 74: "GetGlobalValue", 80: "GetLevel", 130: "GetPCIsSex", 182: "GetEquipped",
    254: "GetIsPlayableRace", 277: "GetBaseActorValue", 448: "HasPerk", 543: "GetQuestCompleted", 560: "HasKeyword",
    629: "GetVMQuestVariable", 630: "GetVMScriptVariable", 659: "EPTemperingItemIsEnchanted",
    660: "EPTemperingItemHasKeyword", 682: "WornHasKeyword",
}
# Records whose full name a recipe's materials can use.
NAMED = ("MISC", "INGR", "ALCH", "WEAP", "ARMO", "AMMO", "SLGM", "BOOK", "SCRL", "LIGH", "KEYM")
GEAR = ("WEAP", "ARMO", "AMMO")
TEMPERING_STATIONS = {"CraftingSmithingSharpeningWheel", "CraftingSmithingArmorTable"}
# Requiem turns a recipe off by moving it to this keyword's station, which no furniture has.
DISABLED_STATIONS = {"REQ_DisableRecipe"}
# The base game and DLC: never a Nexus link, wherever MO2 loads them from (LoreRim keeps cleaned
# copies in a mod folder).
BASE_MASTERS = {"skyrim.esm", "update.esm", "dawnguard.esm", "hearthfires.esm", "dragonborn.esm"}


def _text(v):
    return v.rstrip(b"\0").decode("utf-8", "replace")


def form_id(key):
    """('Skyrim.esm', 0x012EB7) -> 'Skyrim.esm:012EB7', the id items.py gives an item."""
    return f"{key[0]}:{key[1]:06X}"


def ctda(v, masters, name):
    """One condition as the record has it: function, comparison, value, OR flag, and its first parameter."""
    op = v[0]
    fn = struct.unpack_from("<H", v, 8)[0]
    p1 = struct.unpack_from("<I", v, 12)[0]
    c = {"kind": FUNCTIONS.get(fn, f"fn{fn}"), "cmp": CMP.get(op >> 5, "?"), "or": bool(op & 1)}
    c["value"] = None if op & 0x04 else round(struct.unpack_from("<f", v, 4)[0], 4)  # 0x04: compared with a global
    if fn in (448, 47, 69, 71, 72, 74, 182, 560, 660, 682, 543, 56, 58, 59):
        c["param"] = list(resolve(p1, masters, name))
    elif p1:
        c["param"] = p1
    return c


def read_plugin(buf, name, strings=None):
    """
    COBJ records, keyword EDIDs, perk EDIDs and names, the full names of anything a recipe can use,
    and the crafting furniture's names by keyword, from one plugin's bytes.
    """
    masters = header(buf)
    loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
    strings = strings or {}

    def txt(v):
        if loc and len(v) == 4:
            return strings.get(struct.unpack_from("<I", v)[0], "")
        return _text(v)

    out = {"recipes": [], "keywords": {}, "perks": {}, "names": {}, "furniture": []}
    if b"KYWD" in buf:
        for o in iter_group(buf, "KYWD"):
            _, _, fid, d = rec_data(buf, o)
            for s, v in subrecs(d):
                if s == "EDID":
                    out["keywords"][resolve(fid, masters, name)] = _text(v)
    if b"PERK" in buf:
        for o in iter_group(buf, "PERK"):
            _, _, fid, d = rec_data(buf, o)
            rec = {}
            for s, v in subrecs(d):
                if s == "EDID":
                    rec["edid"] = _text(v)
                elif s == "FULL":
                    rec["name"] = txt(v).strip()
                    break
            out["perks"][resolve(fid, masters, name)] = rec
    for grp in NAMED:
        if grp.encode() not in buf:
            continue
        for o in iter_group(buf, grp):
            _, _, fid, d = rec_data(buf, o)
            edid = full = ""
            for s, v in subrecs(d):
                if s == "EDID":
                    edid = _text(v)
                elif s == "FULL":
                    full = txt(v).strip()
                    break
            out["names"][resolve(fid, masters, name)] = {"group": grp, "edid": edid, "name": full}
    if b"FURN" in buf:
        for o in iter_group(buf, "FURN"):
            _, _, fid, d = rec_data(buf, o)
            full, kws = "", []
            for s, v in subrecs(d):
                if s == "FULL":
                    full = txt(v).strip()
                elif s == "KWDA":
                    kws = [resolve(struct.unpack_from("<I", v, i)[0], masters, name) for i in range(0, len(v) - 3, 4)]
            if full and kws:
                out["furniture"].append((full, kws))
    if b"COBJ" in buf:
        for o in iter_group(buf, "COBJ"):
            _, flags, fid, d = rec_data(buf, o)
            rec = {"plugin": name, "key": list(resolve(fid, masters, name)), "flags": flags, "edid": "", "materials": [], "conditions": []}
            for s, v in subrecs(d):
                if s == "EDID":
                    rec["edid"] = _text(v)
                elif s == "CNTO" and len(v) >= 8:
                    comp, count = struct.unpack_from("<Ii", v)
                    rec["materials"].append([list(resolve(comp, masters, name)), count])
                elif s == "CTDA" and len(v) >= 20:
                    rec["conditions"].append(ctda(v, masters, name))
                elif s == "CNAM" and len(v) >= 4:
                    rec["creates"] = list(resolve(struct.unpack_from("<I", v)[0], masters, name))
                elif s == "BNAM" and len(v) >= 4:
                    rec["station"] = list(resolve(struct.unpack_from("<I", v)[0], masters, name))
                elif s == "NAM1" and len(v) >= 2:
                    rec["count"] = struct.unpack_from("<H", v)[0]
            out["recipes"].append(rec)
    return out


def describe(rec, kw_names, names, perks):
    """A raw COBJ as a recipe entry: the item it makes, station keyword, materials by name, conditions."""
    station = kw_names.get(tuple(rec["station"]), "") if rec.get("station") else ""
    materials = []
    for key, count in rec["materials"]:
        n = names.get(tuple(key), {})
        materials.append({"id": form_id(key), "name": n.get("name") or n.get("edid") or "", "group": n.get("group", ""), "count": count})
    conditions = []
    for c in rec["conditions"]:
        c = dict(c)
        if c["kind"] == "HasPerk" and "param" in c:
            p = perks.get(tuple(c["param"]), {})
            c.update(perk=form_id(c.pop("param")), perkEdid=p.get("edid", ""), perkName=p.get("name", ""))
        elif isinstance(c.get("param"), list):
            key = tuple(c["param"])
            c["param"] = form_id(key)
            label = kw_names.get(key) or names.get(key, {}).get("edid")
            if label:
                c["paramEdid"] = label
        conditions.append(c)
    gear_used = any(m["group"] in GEAR for m in materials)
    out = {"id": form_id(rec["key"]), "edid": rec["edid"], "plugin": rec["plugin"], "item": form_id(rec["creates"]), "station": station}
    out["kind"] = "improve" if station in TEMPERING_STATIONS and not gear_used else "make"
    out["materials"] = materials
    if rec.get("count", 1) not in (0, 1):
        out["makes"] = rec["count"]
    if conditions:
        out["conditions"] = conditions
    return out


def index_recipes(winners, item_ids, kw_names, names, perks):
    """
    The filter steps over the winning COBJ records, with the count after each, then the kept
    recipes by kind and what was left out. Returns (recipes, counts).
    """
    counts = {"read": len(winners)}
    live = [r for r in winners if not r["flags"] & DELETED and r.get("creates")]
    station = [r for r in live if r.get("station") and kw_names.get(tuple(r["station"])) not in DISABLED_STATIONS]
    counts["at a station"] = len(station)
    kept = [r for r in station if form_id(r["creates"]) in item_ids]
    counts["kept"] = len(kept)
    rows = [describe(r, kw_names, names, perks) for r in kept]
    counts["crafting"] = sum(r["kind"] == "make" for r in rows)
    counts["tempering"] = sum(r["kind"] == "improve" for r in rows)
    counts["disabled"] = sum(1 for r in live if r.get("station") and kw_names.get(tuple(r["station"])) in DISABLED_STATIONS)
    counts["no station"] = sum(1 for r in live if not r.get("station"))
    counts["breakdown"] = sum(
        1 for r in station if form_id(r["creates"]) not in item_ids and any(names.get(tuple(k), {}).get("group") in ("WEAP", "ARMO") for k, _ in r["materials"])
    )
    rows.sort(key=lambda r: (r["item"], r["kind"], r["id"]))
    return rows, counts


def condition_counts(rows):
    """How many recipes carry each kind of condition, crafting and tempering apart."""
    out = {}
    for r in rows:
        for kind in sorted({c["kind"] for c in r.get("conditions", [])}):
            k = out.setdefault(kind, {"make": 0, "improve": 0})
            k[r["kind"]] += 1
    return dict(sorted(out.items(), key=lambda kv: -sum(kv[1].values())))


def meta_modid(folder):
    """A mod folder's meta.ini modid, or None for none or 0."""
    p = os.path.join(folder, "meta.ini")
    if not os.path.exists(p):
        return None
    cp = configparser.ConfigParser(interpolation=None, strict=False)
    try:
        cp.read(p, encoding="utf-8")
    except (configparser.Error, UnicodeDecodeError):
        return None
    v = cp.get("General", "modid", fallback="").strip()
    return v if v.isdigit() and int(v) else None


def plugin_folders(root):
    """Every enabled MO2 mod folder holding each plugin, highest priority (the one loaded) first."""
    mods = [l.strip()[1:] for l in open(os.path.join(root, "profiles", active_profile(), "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
    out = {}
    for d in mods:  # modlist.txt lists the highest priority first
        try:
            files = os.listdir(os.path.join(root, "mods", d))
        except OSError:
            continue
        for f in files:
            if f.lower().endswith((".esp", ".esm", ".esl")):
                out.setdefault(f.lower(), []).append(d)
    return out


def plugin_source(plugin, folders, root):
    """
    { folder, modid, modidFrom? } for one plugin: the MO2 mod folder it loads from (None for Stock
    Game/Data) and that folder's Nexus id. LoreRim loads many plugins from its own output folders
    (LoreRim - xEdit64 Output, MCM and INI Settings), which have no modid; then the modid is the
    next folder down that ships the same plugin and has one, named in modidFrom.
    """
    if not folders:
        return {"folder": None, "modid": None}
    if plugin.lower().startswith("cc") or plugin.lower() in BASE_MASTERS:
        return {"folder": folders[0], "modid": None}
    out = {"folder": folders[0], "modid": None}
    for d in folders:
        modid = meta_modid(os.path.join(root, "mods", d))
        if modid:
            out["modid"] = modid
            if d != folders[0]:
                out["modidFrom"] = d
            break
    return out


def routine(conds):
    """
    A tempering recipe's conditions without the routine "not enchanted, OR has <perk>" pair
    (EPTemperingItemIsEnchanted != 1 with its OR flag, and the condition after it): the vanilla
    tempering check, which only asks for the perk when the item is enchanted.
    """
    out, skip = [], False
    for c in conds:
        if skip:
            skip = False
            continue
        if c["kind"] == "EPTemperingItemIsEnchanted":
            skip = c["or"]
            continue
        out.append(c)
    return out


def build_recipes(raw, items, stations, perk_ids):
    """
    recipes_raw.json -> recipes.json: { "<item id>": { make?: Recipe[], improve?: Recipe[] } }, keyed by
    the item's primary id (a recipe for an id in an item's `also` goes under that item), where
    Recipe = { station, materials: [{ name, count }], perks: string[], otherConditions?, makes? }.
    `items` are build_items' rows, `stations` overrides.json's map from keyword to name, and
    `perk_ids` a map from perk EDID to the planner's perk id. Returns (recipes, notes).
    """
    primary = {}
    for it in items:
        primary[it["id"]] = it["id"]
        for a in it.get("also", []):
            primary.setdefault(a, it["id"])
    out, notes, unnamed, other_kinds = {}, [], {}, {}
    for r in raw["recipes"]:
        item = primary.get(r["item"])
        if not item:
            continue
        station = stations.get(r["station"])
        if not station:
            unnamed[r["station"] or "(none)"] = unnamed.get(r["station"] or "(none)", 0) + 1
            continue
        conds = r.get("conditions", [])
        if r["kind"] == "improve":
            conds = routine(conds)
        perks, other = [], 0
        for c in conds:
            pid = perk_ids.get(c.get("perkEdid", "")) if c["kind"] == "HasPerk" and c.get("value") == 1 and c["cmp"] == "==" else None
            if pid:
                if pid not in perks:
                    perks.append(pid)
            else:
                other += 1
                kind = c["kind"] if c["kind"] != "HasPerk" else f"HasPerk {c.get('perkEdid') or c.get('perk')}"
                other_kinds[kind] = other_kinds.get(kind, 0) + 1
        rec = {"station": station, "materials": [{"name": m["name"], "count": m["count"]} for m in r["materials"]], "perks": perks}
        if other:
            rec["otherConditions"] = other
        if r.get("makes"):
            rec["makes"] = r["makes"]
        out.setdefault(item, {}).setdefault(r["kind"], []).append(rec)
    for kw, n in sorted(unnamed.items()):
        names = raw.get("stationNames", {}).get(kw)
        notes.append(f"recipes: station {kw} isn't in overrides.json stations; {n} recipes left out" + (f" (furniture: {', '.join(names)})" if names else ""))
    if other_kinds:
        notes.append("recipes: other conditions " + ", ".join(f"{k} {n}" for k, n in sorted(other_kinds.items(), key=lambda kv: -kv[1])))
    return dict(sorted(out.items())), notes


def main():
    from esp import ROOT, load_order, localized_strings, plugin_paths

    items_raw = json.load(open(os.path.join(REPO, "gamedata", VERSION, "items_raw.json"), encoding="utf-8"))
    item_ids = {e["id"] for e in items_raw["items"]}
    pp, lo = plugin_paths(), load_order()
    kw_names, perks, names, furniture, winners = {}, {}, {}, {}, {}
    wanted = (b"COBJ", b"KYWD", b"PERK", b"FURN") + tuple(g.encode() for g in NAMED)
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if not any(t in buf for t in wanted):
            continue
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        try:
            got = read_plugin(buf, n, localized_strings(p, n) if loc else None)
        except Exception as e:  # a plugin the reader can't follow is listed, never fatal
            print("skip", n, e, file=sys.stderr)
            continue
        kw_names.update(got["keywords"])
        perks.update(got["perks"])
        names.update(got["names"])
        for full, kws in got["furniture"]:
            for k in kws:
                furniture.setdefault(k, set()).add(full)
        for r in got["recipes"]:
            winners.pop(tuple(r["key"]), None)  # keep load order: the winner goes to the end
            winners[tuple(r["key"])] = r
    rows, counts = index_recipes(list(winners.values()), item_ids, kw_names, names, perks)
    kinds = condition_counts(rows)
    used = sorted({r["station"] for r in rows})
    station_names = {kw_names[k]: sorted(v) for k, v in furniture.items() if kw_names.get(k) in used}
    out = os.path.join(REPO, "gamedata", VERSION, "recipes_raw.json")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        json.dump({"counts": counts, "conditions": kinds, "stationNames": station_names, "recipes": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    steps = ("read", "at a station", "kept")
    print(" -> ".join(f"{k} {counts[k]}" for k in steps))
    print(", ".join(f"{k} {v}" for k, v in counts.items() if k not in steps))
    print("stations:", ", ".join(f"{s} {sum(r['station'] == s for r in rows)}" for s in used))
    print("conditions (recipes with each, crafting/tempering):")
    for k, v in kinds.items():
        print(f"  {k} {v['make']}/{v['improve']}")
    print("wrote", os.path.relpath(out, REPO))

    # One entry per plugin, as the load order spells it, else its file (records name a master as their
    # own header does, and Creation Club plugins aren't in plugins.txt).
    spelling = {os.path.basename(v).lower(): os.path.basename(v) for v in pp.values()}
    spelling.update({n.lower(): n for n in lo})
    plugins = sorted({spelling.get(p.lower(), p) for e in items_raw["items"] for p in (e["id"].rsplit(":", 1)[0], e["plugin"])}, key=str.lower)
    folders = plugin_folders(ROOT)
    sources = {pl: plugin_source(pl, folders.get(pl.lower()), ROOT) for pl in plugins}
    out = os.path.join(REPO, "gamedata", VERSION, "plugins_raw.json")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        json.dump({"plugins": sources}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    linked = sum(1 for s in sources.values() if s["modid"])
    below = sum(1 for s in sources.values() if s.get("modidFrom"))
    base = sum(1 for p, s in sources.items() if s["folder"] is None or p.lower() in BASE_MASTERS or p.lower().startswith("cc"))
    print(f"plugins with items {len(sources)} -> base game, DLC and Creation Club {base}, with a modid {linked} ({below} from a folder below the one loaded), no modid {len(sources) - linked - base}")
    print("wrote", os.path.relpath(out, REPO))


VERSION = "5.0.4.8"
if __name__ == "__main__":
    if len(sys.argv) > 1:
        VERSION = sys.argv[1]
    main()
