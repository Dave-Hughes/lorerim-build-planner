"""
The start check (story_check.py) for a batch of lines, one line at a time, with a checkpoint so a stopped run
picks up where it left off (WO-115 Part 2). Writes gamedata/<version>/story_checks/<line>.json and .md per line, as
story_check.py does, and gamedata/<version>/story_checks/.checkpoint-<batch>.json while it runs:
  python scripts/gamedata/story_check_all.py --root C:\\LoreRim --batch stories
  python3 scripts/gamedata/story_check_all.py --batch guilds --slice 150     (the PC's Linux shell, three-minute window)

Batches: stories (the backlog's draft list of story lines: the eleven it names and the mod lines with four or more
story quests), and main, guilds, daedric, lands, side, followers (every line in that category, in quests.json order).

--slice N runs each line in story_check.py's three phases (SC_PHASE A, B, C, each cached for the next) and stops
before a phase that wouldn't finish inside N seconds, judged by how long that phase took last; run it again to go
on. Without --slice each line runs whole. A line that fails is listed in the checkpoint and skipped on the next run
(--retry runs failed lines again); --fresh forgets the checkpoint. A line another batch's checkpoint has done counts
as done here (--again runs it anyway).
"""
import argparse
import glob
import json
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
CATEGORIES = ("main", "guilds", "daedric", "lands", "side", "followers")
# The backlog's draft list ("Pick it"): the lines it names, in story order. "Vigilant" is the vigilants line.
NAMED_STORIES = ("main-quest", "companions", "college", "thieves-guild", "dark-brotherhood", "civil-war", "dawnguard", "dragonborn",
                 "vigilants", "wyrmstooth", "undeath")
STORY_MIN = 4  # story quests a mod line needs to join the stories batch
PHASE_GUESS = 90  # seconds a phase is taken to need before one has been timed


def story_quests(line):
    """A line's story quests: the ones with a quest type other than Misc."""
    return [q for q in line["quests"] if q.get("type") not in (None, "", "None", "Misc")]


def batch_lines(batch, version):
    """The line ids in a batch, in order."""
    lines = json.load(open(os.path.join(REPO, "src", "data", f"lorerim-{version}", "quests.json"), encoding="utf-8"))["lines"]
    if batch in CATEGORIES:
        return [l["id"] for l in lines if l.get("category") == batch]
    if batch == "stories":
        ids = {l["id"] for l in lines}
        named = [n for n in NAMED_STORIES if n in ids]
        mods = [l["id"] for l in lines if l["id"] not in named and l.get("category") in CATEGORIES and len(story_quests(l)) >= STORY_MIN]
        return named + mods
    raise SystemExit(f"unknown batch {batch}: stories, {', '.join(CATEGORIES)}")


def load_checkpoint(path):
    try:
        return json.load(open(path, encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def save_checkpoint(path, cp):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(cp, f, indent=1)
        f.write("\n")
    os.replace(tmp, path)


def run_step(line_id, version, env, phase=None):
    """One story_check.py run (a whole line, or one phase of it): (ok, seconds, last lines of its output)."""
    e = dict(env)
    if phase:
        e["SC_PHASE"] = phase
    else:
        e.pop("SC_PHASE", None)
    t = time.time()
    p = subprocess.run([sys.executable, "-u", os.path.join(HERE, "story_check.py"), line_id, version], env=e, cwd=REPO,
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = [l for l in (p.stdout + p.stderr).splitlines() if not l.startswith("skip ")]
    return p.returncode == 0, round(time.time() - t, 1), out[-6:]


def clear_cache(base, line_id):
    for f in glob.glob(os.path.join(base, "story_checks", f".{line_id}.cache.pkl*")):
        os.remove(f)


def main():
    ap = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    ap.add_argument("--batch", required=True, help="stories, " + ", ".join(CATEGORIES))
    ap.add_argument("--root", help="the LoreRim install (sets LORERIM_ROOT)")
    ap.add_argument("--version", default="5.0.4.8")
    ap.add_argument("--slice", type=float, help="stop before a phase that wouldn't finish inside this many seconds")
    ap.add_argument("--retry", action="store_true", help="run the lines that failed last time again")
    ap.add_argument("--fresh", action="store_true", help="forget the checkpoint and start the batch again")
    ap.add_argument("--again", action="store_true", help="also run lines another batch has already checked")
    ap.add_argument("--list", action="store_true", help="print the batch's lines and stop")
    args = ap.parse_args()

    lines = batch_lines(args.batch, args.version)
    if args.list:
        print("\n".join(lines))
        print(f"{len(lines)} lines in {args.batch}")
        return 0
    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    if args.root:
        env["LORERIM_ROOT"] = args.root
    base = os.path.join(REPO, "gamedata", args.version)
    os.makedirs(os.path.join(base, "story_checks"), exist_ok=True)
    cp_path = os.path.join(base, "story_checks", f".checkpoint-{args.batch}.json")
    cp = {} if args.fresh else load_checkpoint(cp_path)
    if cp.get("lines") and cp["lines"] != lines:
        print("the batch's lines changed since the checkpoint; going on with the new list", flush=True)
    cp.update({"batch": args.batch, "version": args.version, "lines": lines})
    cp.setdefault("done", {})
    cp.setdefault("failed", {})
    cp.setdefault("phase", {})  # line -> the last phase finished, with --slice
    cp.setdefault("timing", {})  # phase -> seconds it took last
    if args.retry:
        cp["failed"] = {}
    if not args.again:
        # A line another batch has already checked (the stories batch holds lines from every category) counts as done.
        for other in glob.glob(os.path.join(base, "story_checks", ".checkpoint-*.json")):
            if os.path.normpath(other) != os.path.normpath(cp_path):
                for line_id, said in load_checkpoint(other).get("done", {}).items():
                    if line_id in lines and line_id not in cp["done"]:
                        cp["done"][line_id] = f"checked in the {os.path.basename(other)[12:-5]} batch: {said}"
    save_checkpoint(cp_path, cp)

    start = time.time()
    todo = [l for l in lines if l not in cp["done"] and l not in cp["failed"]]
    print(f"{args.batch}: {len(lines)} lines, {len(cp['done'])} done, {len(cp['failed'])} failed, {len(todo)} to run", flush=True)
    for line_id in todo:
        if args.slice:
            phases = ["A", "B", "C"]
            finished = cp["phase"].get(line_id)
            for ph in phases[phases.index(finished) + 1:] if finished in phases else phases:
                need = cp["timing"].get(ph, PHASE_GUESS)
                if time.time() - start + need > args.slice:
                    save_checkpoint(cp_path, cp)
                    print(f"stopped before {line_id} phase {ph} (it needs about {need:.0f}s); run again to go on", flush=True)
                    return 3
                ok, secs, tail = run_step(line_id, args.version, env, ph)
                cp["timing"][ph] = secs
                if not ok:
                    cp["failed"][line_id] = {"phase": ph, "output": tail}
                    cp["phase"].pop(line_id, None)
                    clear_cache(base, line_id)
                    print(f"{line_id}: phase {ph} failed after {secs}s: {tail[-1] if tail else ''}", flush=True)
                    break
                cp["phase"][line_id] = ph
                save_checkpoint(cp_path, cp)
                if ph == "C":
                    cp["done"][line_id] = tail[-1] if tail else "done"
                    cp["phase"].pop(line_id, None)
                    clear_cache(base, line_id)
                    print(tail[-1] if tail else f"{line_id}: done", flush=True)
        else:
            ok, secs, tail = run_step(line_id, args.version, env)
            if ok:
                cp["done"][line_id] = tail[-1] if tail else "done"
                print(f"{tail[-1] if tail else line_id + ': done'} ({secs}s)", flush=True)
            else:
                cp["failed"][line_id] = {"output": tail}
                print(f"{line_id}: failed after {secs}s: {tail[-1] if tail else ''}", flush=True)
            cp["phase"].pop(line_id, None)  # a whole run supersedes phases left from a sliced one
            clear_cache(base, line_id)
        save_checkpoint(cp_path, cp)
    print(f"{args.batch}: {len(cp['done'])} of {len(lines)} done" + (f"; failed: {', '.join(cp['failed'])}" if cp["failed"] else ""), flush=True)
    return 0 if not cp["failed"] else 1


if __name__ == "__main__":
    sys.exit(main())
