"""
The people index (WO-144 Part 2): every named person a design touches, from the records. Reuses places.py's scan()
(locations, cells, placed actors, NPC_ keywords, race and sex) rather than re-reading the load order; adds only RACE
records (places.py has no reason to read those). Writes gamedata/<version>/people_raw.json; build.py turns it into
src/data/lorerim-<version>/people.json:
  python3 scripts/gamedata/people.py [version]

A person is a placed actor (ACHR) whose base NPC_ is named, or carries a Job* keyword (a generic but meaningful role:
an innkeeper, a priest, a stablehand) even unnamed. One placement each: an NPC's first placed cell, its home
(the project's own convention from quest_givers.py -- NPCs with schedules move about; this is where they're found).

For each person:
  name, race, sex
  cell         the cell they're placed in, and its name
  inTown       the first ancestor of that cell's location in CAPITALS or SETTLEMENTS, as a building's is (WO-144
               Part 1 item 3): a parent-chain fact, never a distance
  role         the Job* keyword (JobInnkeeper, JobPriest, JobJarl, JobSteward, JobHousecarl, JobMerchant,
               JobBlacksmith, JobApothecary, JobCourtWizard, JobOrcChief, JobOrcWiseWoman, JobHostler...),
               template-resolved when the NPC's own record carries none
  plugin

Not built this pass (logged under WO-144 Part 2, not guessed at): what a merchant's own vendor container sells,
a trainer's skill and level cap, the marriage candidates list (The Bonds of Matrimony), a follower's join
conditions and what they fight with, jarls/stewards/housecarls grouped by hold (the `role` and a place's own
`hold` get there separately; not joined here). Quest givers are already in quests.json; not duplicated here.
"""
import collections
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
import places as pl  # noqa: E402
from editor_words import EDITOR  # noqa: E402
from read_clean import clean_read  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
# WO-183 Part 1: a role is what a person is to a player. A farmer, a miner, a lumberjack and a hunter are what the AI has them do at work, kept on many NPCs for their
# packages (Neloth carries JobFarmer for his mushrooms), so they are no role and no badge.
JOBS = {"JobInnkeeper", "JobPriest", "JobJarl", "JobSteward", "JobHousecarl", "JobMerchant", "JobBlacksmith",
        "JobApothecary", "JobCourtWizard", "JobOrcChief", "JobOrcWiseWoman", "JobHostler", "JobSpellVendor",
        "JobFletcher", "JobMinstrel", "JobHireling"}
# A developer's cell, never a place a player can go (the audit found DLC2 WarehouseSpiders): a person placed only there has no place to find them.
TEST_CELL = re.compile(r"^(?:Marker Storage Unit|Actor Room|Quick Test Cell|You're not supposed to be here|Do Not Delete.*|DLC\d+ Warehouse.*|Warehouse (?:Carry|Prefabs|Ambushes|Traps|Basement)|Test\w*|SBSoapContainerCell|.*Holding Cell)$", re.I)
# A race whose only sex is female by the lore, though the record's flag is the default.
RACE_SEX = {"Hagraven": "female"}
# A record for the old-age models: the person's own race is not in this record, so it is not said.
RACE_DROP = {"Elder"}
MERGED = []  # (the copy's name, the record it is a copy of): for the report
OPEN_WORLDS = {"Tamriel", "DLC2SolstheimWorld"}  # the open world's worldspaces, as places.py names them
HUMANOID = {"Nord", "Imperial", "Breton", "Redguard", "Dunmer", "Altmer", "Bosmer", "Orsimer", "Khajiit", "Argonian"}


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


# WO-180 Part 1: a race a mod named with an editor id ("0Asy1um_OthrielSnowElfRace" for a Snow Elf) is said in words: the id's last part without "Race",
# split at its capitals ("MudCrab" is a Mud Crab). The one the id's words can't give is ruled here.
RACE_RULED = {"0Asy1um_OthrielSnowElfRace": "Snow Elf"}


def race_words(full):
    if full in RACE_RULED:
        return RACE_RULED[full]
    if re.search(r" Race$", full):
        full = full[:-5]  # "Arpen Buro Race": the race is Arpen Buro
    if " " in full or not re.search(r"_|[a-z][A-Z]", full):
        return full
    part = re.sub(r"Race$", "", full.rsplit("_", 1)[-1])
    return re.sub(r"(?<=[a-z])(?=[A-Z])", " ", part).strip() or full


def scan_races():
    """RACE records' display names (FULL), keyed by their resolved form id. Not in places.py's own scan: it has no
    reason to read them, and this is the one script that does."""
    pp, lo = plugin_paths(), load_order(cc=True)
    races = {}
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        if b"RACE" not in buf:
            continue
        masters = header(buf)
        for o in iter_group(buf, "RACE"):
            t, flags, fid, d = rec_data(buf, o)
            if t != "RACE":
                continue
            subs = subrecs(d)
            key = form_id(resolve(fid, masters, n))
            full = next((v.rstrip(b"\0").decode("utf-8", "replace") for s, v in subs if s == "FULL" and len(v) != 4), "")
            if full and full not in RACE_DROP:
                races[key] = race_words(full)
    return races


def job_of(base, npcs, kname, depth=0):
    """The one Job* keyword on an NPC's own record, or its template's (depth-limited, as places.py's level_of does)."""
    if depth > 6 or not base or base not in npcs:
        return None
    n = npcs[base]
    job = next((x for x in kname(n.get("keywords") or []) if x in JOBS), None)
    if job:
        return job
    return job_of(n.get("template"), npcs, kname, depth + 1) if n.get("template") else None


def build(version):
    kw, locs, npcs, lvln, books, infos, quests, cells, markers, actors, refcell, placed_npc, eczn, fact, _features, _enable, _forced = pl.scan()
    races = scan_races()
    kname = lambda ks: {kw.get(k, k) for k in ks}  # noqa: E731

    def chain(k):
        out, seen = [], set()
        while k and k in locs and k not in seen:
            seen.add(k)
            out.append(k)
            k = locs[k]["parent"]
        return out

    # WO-180 Part 2: the places index's own decision on what is inside a town. A place with no `inTown` (a dungeon, a mine, a fort, a monastery, a
    # farm out in its fields) is a place of its own, so the people who live there are its, never the town whose location it is parented to
    # (Whiterun listed 133 people: Web Mother, Jon the Mad, the Greybeards, all of Fort Greymoor).
    placed_file = os.path.join(REPO, "gamedata", version, "places_raw.json")
    # (A place the record has twice, as a location and as its interior's, is its own under both ids: Honningbrew Meadery.)
    own_place = {i for p in json.load(open(placed_file, encoding="utf-8"))["places"] if not p.get("inTown") for i in [p["id"], *(a["id"] for a in p.get("alsoRecordedAs", []))]} if os.path.exists(placed_file) else set()

    def in_town(loc_key):
        # Bob, 23 Oct: Borgakh had no town -- she's at Mor Khazgur, a stronghold, which this left out.
        up = chain(loc_key)
        i = next((i for i, x in enumerate(up) if locs[x].get("name") in (pl.CAPITALS | pl.SETTLEMENTS | pl.STRONGHOLDS)), None)
        # (A demo's or cut content's leftover location, "E3 Bleak Falls Barrow", is no place in the index and no part of Falkreath either.)
        # (A dungeon a mod hung from a town's location with no name of its own, Gromm's Pass under Riften, is no part of the town either: WO-183 Part 1.)
        if i is None or any(x in own_place or pl.LEFTOVER.search(locs[x].get("edid") or "")
                            or (not locs[x].get("name") and "LocTypeDungeon" in kname(locs[x].get("keywords") or [])) for x in up[:i]):
            return None
        return locs[up[i]]["name"]

    def sex_of(base, depth=0):
        """The record's sex, following the template when the record uses its traits (Use Traits, template flag 0x1), as the game does."""
        n = npcs[base]
        if depth < 6 and n.get("tflags", 0) & 1 and n.get("template") in npcs:
            return sex_of(n["template"], depth + 1)
        return n.get("sex")

    people = {}
    for a in actors.values():
        if a["deleted"] or a["base"] not in npcs:
            continue
        base = a["base"]
        if base in people:
            continue  # one placement each: the first found, their home
        n = npcs[base]
        job = job_of(base, npcs, kname)
        if not n.get("name") and not job:
            continue  # neither named nor a meaningful generic role
        c = cells.get(a["cell"]) or {}
        cell_name, town = c.get("name"), in_town(c.get("location"))
        # A city is a worldspace of its own: a cell out in Tamriel whose location hangs from it (Gromm's Pass under Riften) is not in the city (WO-183 Part 1).
        if town in pl.BIG_CITIES and c.get("grid") and c.get("worldEdid") in OPEN_WORLDS:
            town = None
        # A developer's cell is no place a player can go.
        if cell_name and TEST_CELL.match(cell_name):
            cell_name, town = None, None
        race = races.get(n.get("race"), None)
        people[base] = {"id": base, "name": n.get("name"), "race": race,
                         "sex": RACE_SEX.get(race) or sex_of(base), "cell": cell_name, "inTown": town,
                         "role": job, "plugin": locs.get(c.get("location"), {}).get("plugin")}
    # One person, one record (WO-183 Part 1): "Alara" is a copy of "High Priestess Alara" that takes her template; both are unique and the same woman.
    for base, n in [(b, npcs[b]) for b in list(people)]:
        t = n.get("template")
        if t in people and t != base and n.get("unique") and npcs[t].get("unique") and n.get("name") and npcs[t].get("name") \
                and (n["name"] in npcs[t]["name"] or npcs[t]["name"] in n["name"]) and n.get("tflags", 0) & 1:
            MERGED.append((people[base]["name"], npcs[t]["name"]))
            people[t].setdefault("alsoIds", []).append(base)  # what was read or found about the copy is the person's
            del people[base]
    # A generic or leveled actor is no person (WO-183 Part 1): not a unique record, and either leveled to the player, a name more than one record shares, a copy
    # of a template, or a creature. A unique record is always a person, whatever else it is. (This is the candidate: build_site keeps the ones a player asks about --
    # a read, a follower, a spouse, a trainer, an essential actor with a name of their own -- since many mods' named people lack the flag.)
    names = collections.Counter(p["name"] for p in people.values() if p["name"])
    for base, p in people.items():
        n = npcs[base]
        if n.get("unique") or not p["name"]:
            continue
        creature = bool(p["race"]) and p["race"] not in HUMANOID
        if n.get("scaled") or names[p["name"]] > 1 or n.get("template") or creature:
            p["generic"] = True
    return people


def report(people):
    rows = list(people.values())
    by_role = collections.Counter(p["role"] or "(none)" for p in rows)
    by_town = collections.Counter(p["inTown"] or "(none)" for p in rows)
    out = ["# The people index (WO-144 Part 2)", "",
           f"**{len(rows)} people.** One placement each -- their first found cell, their home.", "",
           "## By role", "", "| Role | People |", "|---|---|"]
    for r, c in by_role.most_common():
        out.append(f"| {r} | {c} |")
    out += ["", "## By town", "", "| Town | People |", "|---|---|"]
    for t, c in by_town.most_common(15):
        out.append(f"| {t} | {c} |")
    generic = sorted({p["name"] for p in rows if p.get("generic")})
    out += ["", f"## Not people ({len(generic)} names)", "",
            "A generic or leveled actor (not a unique record: leveled to the player, a name more than one record shares, a copy of a template, or a creature) has `generic` set and no person page.", "",
            ", ".join(generic[:300]) + (" ..." if len(generic) > 300 else "")]
    if MERGED:
        out += ["", "## One person, one record", "", "\n".join(f"- {a} is {b}'s copy: one person" for a, b in MERGED)]
    return "\n".join(out) + "\n"


# WO-180 Part 2: a skill as the game shows it ("One-Handed"), never the record's name for it ("OneHanded"); the names are the planner's own (skills.json).
SKILL_SHOWN = {"OneHanded": "One-Handed", "TwoHanded": "Two-Handed", "HeavyArmor": "Heavy Armor", "LightArmor": "Light Armor", "Speechcraft": "Speech", "Lockpick": "Lockpicking"}


def person_facts(dump):
    """
    What a person is to a player, from the WO-156 dump's record fields (not their AI packages): `essential`, `follower`, `marriage`,
    `sells` (has a vendor list), `innkeeper` (in the innkeepers' faction) and `trainer` ({skill, cap}). Keyed by record id; a person with none of them has no entry.
    """
    out = {}
    for pid, d in (dump or {}).items():
        f = {}
        if d.get("essential"):
            f["essential"] = True
        if d.get("follower"):
            f["follower"] = True
        if d.get("marriageable"):
            f["marriage"] = True
        if d.get("vendor"):
            f["sells"] = True
        # WO-183 Part 1: the innkeepers' faction also holds the inn's bard and its server (Mikael, Saadia): only the keeper rents rooms.
        eds = {x.get("edid") for x in d.get("factions", [])}
        if "JobInnkeeperFaction" in eds and not (eds & {"JobBardFaction", "JobInnServer"}):
            f["innkeeper"] = True
        t = d.get("trainer")
        if t and t.get("skill"):
            f["trainer"] = {"skill": SKILL_SHOWN.get(t["skill"], t["skill"]), **({"cap": t["levelCap"]} if t.get("levelCap") else {})}
        if f:
            out[pid] = f
    return out


# A reader's own aside about what it could read ("the extracts don't say which city", "the records I can read don't show what unlocks it").
# It is not something a player should be told; what it points at is in the read's `unsure` list with its reason.
# WO-180 Part 2: and the words an editor writes (package, alias, script, property, faction, keyword, stage, placed): "her sandbox package sits above her
# sleep package" is the game's building, not her day. The Mac's Not sure yet filter has the same list (player-words.ts).
META = re.compile(r"\bextracts?\b|\brecords I can read\b|\bthese records\b|\bin the records\b|\bthe records (?:don't|do not|give no|say no|show no)\b|" + EDITOR, re.I)


def tidy_read(text):
    """
    A read's sentence without the reader's asides: a clause (between semicolons or full stops, or inside a bracket) that talks about the
    extracts or the records the reader could see is dropped. A sentence that is nothing else is dropped whole.
    """
    if not text:
        return text

    def inner(m):
        parts = [x for x in re.split(r";\s*", m.group(1)) if not META.search(x)]
        return f" ({'; '.join(parts)})" if parts else ""

    t = re.sub(r"\s*\(([^()]*)\)", lambda m: inner(m) if META.search(m.group(1)) else m.group(0), text)
    kept = []
    for sentence in re.split(r"(?<=[.!?])\s+", t):
        clauses = [c for c in re.split(r";\s*", sentence) if not META.search(c)]
        if clauses:
            kept.append("; ".join(clauses))
    out = " ".join(kept).strip()
    if out and out != text.strip() and out[-1] not in ".!?)\"'":
        out += "."
    return out


def tidy_why(text):
    """A reason for a doubt, in words that fit the page: the extracts are the game's files, and "I" is "we"."""
    t = re.sub(r"\bthe extracts?\b", "the game files", text)
    t = re.sub(r"\bextracts?\b", "game files", t)
    t = re.sub(r"\brecords I can read\b", "records", t)
    return re.sub(r"\bI (can't|cannot|couldn't)\b", r"we \1", t)


def tidy_person_read(read):
    """The reader's asides out of every sentence a player will read."""
    for k in ("firstMeet", "role", "sells", "trains", "joins", "marries", "fightsWith", "canDie"):
        if k in read:
            read[k] = tidy_read(read[k])
    read["changes"] = [c for c in (tidy_read(c) for c in read.get("changes", [])) if c]
    read["day"] = [{**d, "where": tidy_read(d.get("where", "")), "doing": tidy_read(d.get("doing", ""))} for d in read.get("day", [])]
    read["quests"] = [{**q, "how": tidy_read(q.get("how", ""))} for q in read.get("quests", [])]
    read["unsure"] = [{**u, "why": tidy_why(u.get("why", ""))} for u in read.get("unsure", [])]
    # WO-180 Part 4a: a guess or a note about the files comes out of the field and the field goes under Not sure yet.
    return clean_read(read)


# What a read says about a person (WO-159): the checker's corrected object, field by field.
READ_FIELDS = ("firstMeet", "day", "changes", "role", "sells", "trains", "joins", "marries", "fightsWith", "quests", "canDie", "unsure")


def load_reads(folder):
    """
    The people reads (WO-155, brought in by WO-159): every file in `people_reads/checked/`, the checker's corrected objects under `people`
    and each field's verdict under `checks`. Keyed by record id: the fields a player reads, with `verdicts` (agree, fix or unsure, no
    notes: those name records). A later batch lands with a rebuild, no code change.
    """
    out = {}
    if not os.path.isdir(folder):
        return out
    for name in sorted(os.listdir(folder)):
        if not name.endswith(".json"):
            continue
        with open(os.path.join(folder, name), encoding="utf-8") as f:
            batch = json.load(f)
        checks = {c["id"]: c.get("verdicts", {}) for c in batch.get("checks", [])}
        for p in batch.get("people", []):
            read = {k: p[k] for k in READ_FIELDS if k in p}
            read["verdicts"] = {k: v.get("verdict") for k, v in checks.get(p["id"], {}).items()}
            out[p["id"]] = tidy_person_read(read)
    return out


def apply_rulings(read, ruling):
    """
    A player's found-in-game fact replaces the read's field (Dave watched Jaree-Ra for a day: overrides.json `people`). The fields it
    replaces are `fromPlayers`, their verdict is "players", the doubts about them go, and `reports` counts the approved report.
    """
    fields = [k for k in READ_FIELDS if k in ruling]
    for k in fields:
        read[k] = ruling[k]
        read.setdefault("verdicts", {})[k] = "players"
    if "unsure" not in ruling:
        read["unsure"] = [u for u in read.get("unsure", []) if u.get("field") not in fields]
    read["fromPlayers"] = fields
    read["reports"] = ruling.get("reports", 1)
    return read


def build_site(rows, facts=None, reads=None, rulings=None):
    """
    The planner's people.json from the raw rows: what a page or an assistant shows, without record ids. `facts` is person_facts' answer:
    what each person is (follower, spouse, trainer, merchant, essential), joined by record id. `reads` is load_reads' answer, joined the
    same way, and `rulings` the overrides' `people` by name (WO-159).
    """
    out = []
    counts = collections.Counter(p.get("name") for p in rows)
    for p in rows:
        r = {k: p[k] for k in ("name", "race", "sex", "cell", "inTown", "role", "generic") if p.get(k) is not None}
        for i in [p.get("id"), *p.get("alsoIds", [])]:
            for k, v in ((facts or {}).get(i) or {}).items():
                r.setdefault(k, v)
        # Someone a player asks about is a person, unique flag or not: they have a read, follow you, marry you, train you, or are essential with a name of their own.
        if r.get("generic") and (any(i in (reads or {}) for i in [p.get("id"), *p.get("alsoIds", [])]) or r.get("follower") or r.get("marriage") or r.get("trainer") or (r.get("essential") and counts[p.get("name")] == 1)):
            del r["generic"]
        # A job the records don't carry (Alvor is Riverwood's smith: WO-162 Part 5) comes from the overrides' `jobs`.
        jobs = ((rulings or {}).get(p.get("name")) or {}).get("jobs")
        if jobs and not r.get("role"):
            r["role"] = jobs
        read = next((reads[i] for i in [p.get("id"), *p.get("alsoIds", [])] if i in (reads or {})), None)
        if read:
            read = json.loads(json.dumps(read))
            ruling = (rulings or {}).get(p.get("name"))
            r["read"] = apply_rulings(read, ruling) if ruling else read
        out.append(r)
    return out


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    people = build(version)
    base = os.path.join(REPO, "gamedata", version)
    rows = sorted(people.values(), key=lambda p: (p.get("inTown") or "~", p["name"] or p["id"]))
    with open(os.path.join(base, "people_raw.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"about": __doc__.strip().splitlines()[0], "people": rows}, f, indent=1, ensure_ascii=False)
        f.write("\n")
    with open(os.path.join(base, "people_report.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write(report(people))
    print(f"{len(rows)} people -> people_raw.json")


if __name__ == "__main__":
    main()
