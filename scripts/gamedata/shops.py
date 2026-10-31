"""
Shops, from the vendor factions' own data (WO-180 Part 7a). A seller's shop was guessed from the cell they sleep in and the words of their read, which put a home for a shop
(Falion's House), missed stalls (Fralia, Jala, Carlotta) and said the wrong kind (Audmund's Axes "general goods"). The records say it:

  - a vendor faction (FACT with VEND) is a shop. Its members are the sellers; its VENC is the vendor chest, a placed reference, and the cell that reference stands in is where the
    shop is: an interior cell with a name is a building (Warmaiden's, Belethor's General Goods), a reference in the open is a stall in the city's market, and a chest in a home or a
    keep is a seller working from a home or a keep, not a shop of its own;
  - VEND is the list of what the vendor buys and sells (a form list of keywords: VendorItemsBlacksmith, VendorItemsJeweler, GM_VendorItemsSilversmith), which is the kind;
  - VENV is the hours the shop is open (start, end, radius).

Writes gamedata/<version>/shops_raw.json: {"vendors": {faction key: {edid, name, list, keywords, hours: [start, end], cell: {name, edid, interior, world}}}}. people.person_facts joins the sellers.
Run: python scripts/gamedata/shops.py [version]
"""
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import places as P  # noqa: E402
from esp import header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402

# The word players use for what a vendor list takes, by the list's name without its mod prefix. Every list a seller in the load order has is here or says its own name.
LIST_KIND = {
    "vendoritemsmisc": "general goods", "vendoritemsmisclucan": "general goods", "vendoritemsinnkeeper": "food", "vendoritemsinnkeeperorgnar": "food",
    "vendoritemsblacksmith": "blacksmith", "vendoritemsapothecary": "apothecary", "vendoritemsapothecarywr": "apothecary", "vendoritemsspells": "spells",
    "vendoritemsspellswhboth": "spells", "vendoritemsfarengar": "spells", "vendoritemscollegeurag": "books and spells", "vendoritemshunter": "hunting goods",
    "vendoritemshunterwilhelm": "hunting goods", "vendoritemsjeweler": "jewelry", "vendoritemstailor": "clothing", "vendoritemsfoodwithingrediants": "food",
    "vendoritemsfletcher": "fletcher", "vendoritemslumberjack": "firewood", "vendoritemsbakery": "baked goods", "vendoritemslightarmourer": "armor",
    "vendoritemssilversmith": "silversmith", "vendoritemsfisherman": "fish", "vendoritemsdb": "alchemist",
    # (WO-180 Part 8) Sofie's flowers, which the Hearthfire urchins share; and the Drunken Huntsman, a fletcher who also takes armor, food, gems, tools and weapons
    "byohurchinsofievendorlist": "flowers", "vendoritemsdrunkenhuntsman": "fletcher",
}
# A list with its own name (BYOHUrchin_SofieVendorList) that no table knows: by the keywords it takes.
KEYWORD_KIND = [
    # (WO-180 Part 8: the kind is what the list is about, not the first keyword it has: a list that takes arrows is a fletcher's, one that takes hides and parts a hunter's)
    (re.compile(r"VendorItemArrow|WeapTypeBow|Arrow"), "fletcher"), (re.compile(r"VendorItemAnimal(?:Hide|Part)"), "hunting goods"),
    (re.compile(r"WeapType|VendorItemWeapon"), "weapons"), (re.compile(r"VendorItemPotion|VendorItemIngredient"), "apothecary"), (re.compile(r"SpellTome|VendorItemBook"), "books and spells"),
    (re.compile(r"VendorItemFood"), "food"), (re.compile(r"VendorItemJewelry|VendorItemGem"), "jewelry"), (re.compile(r"VendorItemClothing"), "clothing"),
]
# Lists that buy nothing a player would call a shop's stock.
NO_STOCK = {"reqvendoritemsnosale", "reqlistvendoritemsmiscblackmarket", "dlc2dremoravendorexclusion"}


def list_key(edid):
    return re.sub(r"^(?:rvt_fl_|tvr_|req_list_|req_|gm_|andr_)", "", (edid or "").lower().replace("_", ""))


def kind_of(list_edid, keywords):
    """What a vendor list takes, in a word players use; None for a list that sells nothing."""
    k = (list_edid or "").lower().replace("_", "")
    if k in NO_STOCK:
        return None
    bare = list_key(list_edid)
    for cand in (k, bare, re.sub(r"^[a-z]{2,6}(?=vendoritems)", "", bare)):
        if cand in LIST_KIND:
            return LIST_KIND[cand]
    for rx, kind in KEYWORD_KIND:
        if any(rx.search(w) for w in keywords):
            return kind
    words = re.sub(r"(?i)vendoritems?|vendor|list|flst", " ", re.sub(r"([a-z])([A-Z])", r"\1 \2", (list_edid or "").replace("_", " "))).split()
    return " ".join(words).lower() or None


def hours_of(start, end):
    """The hours a shop is open, 'all day' for a whole day: VENV counts from 0 to 24 (25 for a vendor with no hours)."""
    if end == start or end - start >= 23:  # a smith open "0 to 23", or a vendor whose hours are one number, is open all day
        return None
    say = lambda h: "midnight" if h % 24 == 0 else "noon" if h == 12 else f"{h % 12 or 12} {'am' if h % 24 < 12 else 'pm'}"  # noqa: E731
    return f"{say(start)} to {say(end)}"


def scan():
    pp, lo = P.plugin_paths(), P.load_order(cc=True)
    fk = P.form_id
    facts, flst, kywd = {}, {}, {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = P.name_strings(p, n, loc, P.ROOT) or {}
        res = lambda v: fk(resolve(struct.unpack_from("<I", v)[0], masters, n))  # noqa: E731
        for grp in ("FACT", "FLST", "KYWD"):
            if grp.encode() not in buf:
                continue
            for o in iter_group(buf, grp):
                t, fl, fid, d = rec_data(buf, o)
                if t != grp:
                    continue
                key = fk(resolve(fid, masters, n))
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for k, v in subs if k == "EDID"), "")
                if grp == "FACT":
                    vend = next((v for k, v in subs if k == "VEND" and len(v) >= 4), None)
                    venc = next((v for k, v in subs if k == "VENC" and len(v) >= 4), None)
                    venv = next((v for k, v in subs if k == "VENV" and len(v) >= 12), None)
                    full = next((v for k, v in subs if k == "FULL"), None)
                    name = strings.get(struct.unpack("<I", full)[0]) if full and len(full) == 4 and loc else (full.rstrip(b"\0").decode("utf-8", "replace") if full else None)
                    facts[key] = {"edid": edid, "name": name, "vend": res(vend) if vend else None, "venc": res(venc) if venc else None,
                                  "hours": list(struct.unpack_from("<HH", venv, 0)) if venv else None}
                elif grp == "FLST":
                    flst[key] = (edid, [res(v) for k, v in subs if k == "LNAM"])
                else:
                    kywd[key] = edid
    wanted = {f["venc"] for f in facts.values() if f["vend"] and f["venc"]}
    where = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        masters = header(buf)
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = P.name_strings(p, n, loc, P.ROOT) or {}
        for top in ("CELL", "WRLD"):
            if top.encode() not in buf:
                continue
            cur, world = None, None
            for o in iter_group(buf, top):
                tt = buf[o:o + 4]
                if tt == b"REFR":
                    if cur:
                        key = fk(resolve(struct.unpack_from("<I", buf, o + 12)[0], masters, n))
                        if key in wanted:
                            # (WO-180 Part 8: who owns the chest, for the keeper of the shop)
                            owner = next((v for k, v in subrecs(rec_data(buf, o)[3]) if k == "XOWN" and len(v) >= 4), None)
                            where[key] = {**cur, **({"chestOwner": fk(resolve(struct.unpack("<I", owner[:4])[0], masters, n))} if owner else {})}
                    continue
                if tt not in (b"CELL", b"WRLD"):
                    continue
                t, fl, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for k, v in subs if k == "EDID"), "")
                if t == "WRLD":
                    world = edid
                    continue
                full = next((v for k, v in subs if k == "FULL"), None)
                name = strings.get(struct.unpack("<I", full)[0]) if full and len(full) == 4 and loc else (full.rstrip(b"\0").decode("utf-8", "replace") if full else None)
                data = next((v for k, v in subs if k == "DATA"), b"\0\0")
                own = next((v for k, v in subs if k == "XOWN" and len(v) >= 4), None)
                cur = {"name": name, "edid": edid, "interior": bool(data[0] & 1), "world": world if top == "WRLD" else None,
                       **({"owner": fk(resolve(struct.unpack("<I", own[:4])[0], masters, n))} if own else {})}
    return facts, flst, kywd, where


def build():
    facts, flst, kywd, where = scan()
    out = {}
    for key, f in facts.items():
        if not f["vend"]:
            continue
        lst = flst.get(f["vend"])
        words = [kywd.get(m, m) for m in (lst[1] if lst else [])]
        cell = where.get(f["venc"])
        entry = {"edid": f["edid"], "list": lst[0] if lst else None, "kind": kind_of(lst[0] if lst else None, words)}
        if f["name"]:
            entry["name"] = f["name"]
        if f["hours"]:
            h = hours_of(*f["hours"])
            if h:
                entry["hours"] = h
        if cell:
            entry["cell"] = {k: v for k, v in cell.items() if v not in (None, "", False)} | ({"interior": True} if cell["interior"] else {})
        out[key] = entry
    return {"vendors": dict(sorted(out.items()))}


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    data = build()
    path = os.path.join(P.REPO, "gamedata", version, "shops_raw.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    v = data["vendors"]
    print(f"{len(v)} vendor factions, {sum(1 for x in v.values() if x.get('cell'))} with a chest placed, {sum(1 for x in v.values() if x.get('kind'))} with a kind -> {path}")


if __name__ == "__main__":
    main()
