"""
The quest reads (WO-153, WO-154): an agent read each quest's records and a second checked it, one batch file at a time in
gamedata/<version>/quest_reads/checked/*.json, each {"checks": [{edid, verdicts}], "quests": [the corrected objects]} as
BRIEF.md and CHECK.md lay it out. A quest with a read gets it on its page and from the door; one without keeps the older
rule-made fields, marked source "rules". Nothing from a read is reworded here.
"""
import glob
import json
import os

# What a page and the door use, in BRIEF.md's words. `evidence` (record ids) and `plugin` stay in the batch files, not the data.
FIELDS = ("canDo", "canDoWhy", "needs", "starts", "firstStep", "takesYou", "choices", "steps", "rewards", "type", "opens", "closes", "people", "unsure")
CAN_DO = ("talk", "by itself", "radiant", "cut", "background")


def load_reads(folder):
    """
    Every checked quest read under folder, by editor id: {edid: {fields, "fixed": [the fields the checker fixed], "plugin"}}.
    A missing folder is no reads. A quest read twice (a later batch file) is the later one; a quest with no name or edid is skipped.
    """
    out = {}
    for path in sorted(glob.glob(os.path.join(folder, "*.json"))):
        with open(path, encoding="utf-8") as f:
            batch = json.load(f)
        fixed = {c["edid"]: [k for k, v in (c.get("verdicts") or {}).items() if isinstance(v, dict) and v.get("verdict") == "fix"] for c in batch.get("checks", []) if c.get("edid")}
        for q in batch.get("quests", []):
            edid = q.get("edid")
            if not edid or not q.get("name"):
                continue
            read = {k: q[k] for k in FIELDS if k in q}
            if read.get("canDo") not in CAN_DO:
                read.pop("canDo", None)
            out[edid] = {**read, "fixed": fixed.get(edid, []), **({"plugin": q["plugin"]} if q.get("plugin") else {})}
    return out


def attach_reads(lines, reads):
    """
    Each quest in the lines gets its read as `read` and `source: "reads"`, else `source: "rules"` (the older fields stand in). Returns
    (quests with a read, quests without), and the edids of reads that match no quest on the pages (Missives, cut ones).
    """
    have = without = 0
    seen = set()
    for line in lines:
        for q in line["quests"]:
            r = reads.get(q["edid"])
            if r:
                q["read"] = r
                q["source"] = "reads"
                have += 1
                seen.add(q["edid"])
            else:
                q["source"] = "rules"
                without += 1
    return have, without, sorted(set(reads) - seen)
