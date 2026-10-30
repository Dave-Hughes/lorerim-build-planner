"""
Rewards that are a choice (WO-183 Part 6): the Black Books. Each book's Apocrypha reward is three abilities and "You may only accept one ability from this book at a time".
The quest's stages never name them ("I uncovered the hidden knowledge"); the choice is a set of three message prompts the reward book shows, and the book's activator
carries the quest it belongs to. This reads, from the records:

  - the prompts of every reward set (MESG `DLC2ApocryphaBookReward_<set><1..3>_Prompt`, `HYORApocryphaBookReward_G<1..3>_Prompt`), the winning copy in load order, so a
    LoreRim patch that rewords an ability (Secret of Strength, Seeker of Might) is said as the game says it;
  - which set each book's activator (`DLC2ApocryphaBook0N`, `HYORApocryphaBook08`) shows, from its script (`DLC2ApocryphaBookReward<set>Script`) and the quest in its properties.

Writes gamedata/<version>/choice_rewards_raw.json: {"quests": {questEdid: {"pick": 1, "of": [{"name", "says"}]}}, "sets": {...}}.
Run: python scripts/gamedata/choice_rewards.py [version]
"""
import json
import os
import re
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import places as P  # noqa: E402
from esp import iter_group, load_order, plugin_paths, rec_data, subrecs  # noqa: E402

PROMPT = re.compile(r"(?:DLC2|HYOR)ApocryphaBookReward_([A-Z])([1-3])_Prompt$")
BOOK = re.compile(r"(?:DLC2|HYOR)ApocryphaBook(\d\d)$")
BOOK_QUEST = re.compile(r"(?:DLC2|HYOR)BlackBook\d\dQuest$")
SET_SCRIPT = re.compile(rb"ApocryphaBookReward([A-Z])Script")


def split_prompt(text):
    """'Scholar's Insight: Reading Skill Books gives you an extra Skill Point.\\n\\nYou may only accept one...' -> ('Scholar's Insight', 'Reading Skill Books gives ...')."""
    first = text.split("\n")[0].replace("%%", "%").strip()
    name, _, says = first.partition(": ")
    return name.strip(), says.strip()


def scan():
    pp, lo = plugin_paths(), load_order(cc=True)
    prompts = {}  # (set, n) -> text, the last plugin's
    quests = {}  # (plugin lower, local id) -> edid, for the black books' quests
    books = {}  # edid of the book's activator -> (set letter, [quest ids it names])
    for n in lo:
        p = pp.get(n.lower())
        if not p:
            continue
        buf = open(p, "rb").read()
        loc = bool(struct.unpack_from("<I", buf, 8)[0] & 0x80)
        strings = P.name_strings(p, n, loc, P.ROOT) or {}
        tables = (P.all_strings(p, n, loc, P.ROOT) or {}) if loc else {}
        if b"MESG" in buf:
            for o in iter_group(buf, "MESG"):
                t, fl, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for k, v in subs if k == "EDID"), "")
                m = PROMPT.match(edid)
                if not m:
                    continue
                for k, v in subs:
                    if k != "DESC":
                        continue
                    if len(v) == 4 and loc:
                        sid = struct.unpack("<I", v)[0]
                        text = strings.get(sid) or tables.get("DLSTRINGS", {}).get(sid) or tables.get("STRINGS", {}).get(sid)
                    else:
                        text = v.rstrip(b"\0").decode("utf-8", "replace")
                    if text:
                        prompts[(m.group(1), int(m.group(2)))] = text
        if b"QUST" in buf:
            for o in iter_group(buf, "QUST"):
                t, fl, fid, d = rec_data(buf, o)
                edid = next((v.rstrip(b"\0").decode("latin1") for k, v in subrecs(d) if k == "EDID"), "")
                if BOOK_QUEST.match(edid):
                    quests[fid & 0xFFFFFF] = edid
        if b"ACTI" in buf:
            for o in iter_group(buf, "ACTI"):
                t, fl, fid, d = rec_data(buf, o)
                subs = subrecs(d)
                edid = next((v.rstrip(b"\0").decode("latin1") for k, v in subs if k == "EDID"), "")
                if not BOOK.match(edid):
                    continue
                vm = next((v for k, v in subs if k == "VMAD"), b"")
                m = SET_SCRIPT.search(vm)
                letter = m.group(1).decode() if m else ("G" if b"HYORBookRewardScript" in vm or b"hyorbookrewardscript" in vm.lower() else None)
                ids = sorted({struct.unpack_from("<I", vm, i)[0] & 0xFFFFFF for i in range(len(vm) - 3)})
                books[edid] = (letter, ids)
    return prompts, quests, books


def build():
    prompts, quests, books = scan()
    sets = {}
    for (letter, n), text in sorted(prompts.items()):
        name, says = split_prompt(text)
        sets.setdefault(letter, []).append({"name": name, "says": says})
    out = {}
    for edid, (letter, ids) in books.items():
        if letter not in sets:
            continue
        for q in ids:
            if q in quests:
                out[quests[q]] = {"pick": 1, "of": sets[letter], "set": letter}
    return {"quests": dict(sorted(out.items())), "sets": sets}


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else "5.0.4.8"
    data = build()
    path = os.path.join(P.REPO, "gamedata", version, "choice_rewards_raw.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{len(data['quests'])} quests with a choice of rewards, {len(data['sets'])} sets -> {path}")
    for q, v in data["quests"].items():
        print(" ", q, v["set"], [x["name"] for x in v["of"]])


if __name__ == "__main__":
    main()
