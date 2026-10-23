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
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import header, iter_group, load_order, plugin_paths, rec_data, resolve, subrecs  # noqa: E402
import places as pl  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
JOBS = {"JobInnkeeper", "JobPriest", "JobJarl", "JobSteward", "JobHousecarl", "JobMerchant", "JobBlacksmith",
        "JobApothecary", "JobCourtWizard", "JobOrcChief", "JobOrcWiseWoman", "JobHostler", "JobSpellVendor",
        "JobFletcher", "JobMiner", "JobMinstrel", "JobHireling", "JobHunter", "JobLumberjack", "JobFarmer"}


def form_id(key):
    return f"{key[0]}:{key[1]:06X}"


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
            if full:
                races[key] = full
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
    kw, locs, npcs, lvln, books, infos, quests, cells, markers, actors, refcell, placed_npc = pl.scan()
    races = scan_races()
    kname = lambda ks: {kw.get(k, k) for k in ks}  # noqa: E731

    def chain(k):
        out, seen = [], set()
        while k and k in locs and k not in seen:
            seen.add(k)
            out.append(k)
            k = locs[k]["parent"]
        return out

    def in_town(loc_key):
        # Bob, 23 Oct: Borgakh had no town -- she's at Mor Khazgur, a stronghold, which this left out.
        return next((locs[x]["name"] for x in chain(loc_key) if locs[x].get("name") in (pl.CAPITALS | pl.SETTLEMENTS | pl.STRONGHOLDS)), None)

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
        people[base] = {"id": base, "name": n.get("name"), "race": races.get(n.get("race"), None),
                         "sex": n.get("sex"), "cell": c.get("name"), "inTown": in_town(c.get("location")),
                         "role": job, "plugin": locs.get(c.get("location"), {}).get("plugin")}
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
    return "\n".join(out) + "\n"


def build_site(rows):
    """The planner's people.json from the raw rows: what a page or an assistant shows, without record ids."""
    out = []
    for p in rows:
        r = {k: p[k] for k in ("name", "race", "sex", "cell", "inTown", "role") if p.get(k) is not None}
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
