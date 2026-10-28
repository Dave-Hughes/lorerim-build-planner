"""
What changed in the world (WO-157): the home page's "New in the world" list, from the data's own history. A quest read, a quest's ways and
a line's read each carry the day their file was first committed (git's author date of the commit that added it), so an entry's date is
when the planner got it, never one written by hand. Nothing is listed that the pages don't have.
"""
import glob
import json
import os
import subprocess

# Everything the data has: the page folds it by day (WO-177 Part 5: it stopped at 400, back to 23 Oct).
KEEP = None


def added_on(root, path):
    """The day (YYYY-MM-DD) the file was first committed, or None outside a git checkout."""
    try:
        out = subprocess.run(["git", "log", "--diff-filter=A", "--follow", "--format=%cs", "--", path], cwd=root, capture_output=True, text=True, check=True).stdout.split()
    except (OSError, subprocess.CalledProcessError):
        return None
    return out[-1] if out else None


def _files(folder, pattern):
    return sorted(glob.glob(os.path.join(folder, pattern)))


def build_changes(pages, raw_dir, root):
    """
    The newest changes first: [{"kind": "quest", "edid", "ways": n, "date"}, {"kind": "line", "id", "date"}]. A quest counts when its page has
    a read; its date is its ways file's if it has ways, else its read's. A line counts when its page has a read.
    """
    reads_dir = os.path.join(raw_dir, "quest_reads")
    read_day, ways_day, line_day = {}, {}, {}
    for path in _files(os.path.join(reads_dir, "checked"), "*.json"):
        day = added_on(root, path)
        with open(path, encoding="utf-8") as f:
            for q in json.load(f).get("quests", []):
                if q.get("edid") and day:
                    read_day[q["edid"]] = day
    for path in _files(os.path.join(reads_dir, "ways"), "G*.json"):
        day = added_on(root, path)
        with open(path, encoding="utf-8") as f:
            for q in json.load(f).get("quests", []):
                if q.get("edid") and day:
                    ways_day[q["edid"]] = day
    for path in _files(os.path.join(reads_dir, "lines", "checked"), "L*.json"):
        day = added_on(root, path)
        with open(path, encoding="utf-8") as f:
            for line in json.load(f).get("lines", []):
                if line.get("id") and day:
                    line_day[line["id"]] = day
    out = []
    for line in pages:
        if line.get("read") and line["id"] in line_day:
            out.append({"kind": "line", "id": line["id"], "date": line_day[line["id"]]})
        for q in line["quests"]:
            r = q.get("read")
            if not r:
                continue
            n = len((r.get("ways") or {}).get("ways", []))
            day = ways_day.get(q["edid"]) if n else read_day.get(q["edid"])
            day = day or read_day.get(q["edid"])
            if day:
                out.append({"kind": "quest", "edid": q["edid"], "ways": n, "date": day})
    # Newest first; a line before a quest, a quest with several ways before one with a single path, on the same day.
    out.sort(key=lambda c: (c["date"], c["kind"] == "line", c.get("ways", 0)), reverse=True)
    return out if KEEP is None else out[:KEEP]
