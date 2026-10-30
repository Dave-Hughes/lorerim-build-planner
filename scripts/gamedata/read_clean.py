"""
WO-180 Part 4a: the reads in a player's words. A read is an agent's sentences about a quest, a line or a person, and some of them are the editor's:
a guess ("most likely beneath Stendarr's Beacon", "Probably Black Marsh Maps"), a note about the files ("the records place him in the Silver-Blood Inn",
"amount not in these files", "from the quest's script"), a blank the game fills ("<the item>"), a role the game names ("the riverwood friend").

What a read isn't sure of is not said. The clause, bracket or sentence that holds the guess comes out of the field, and the field goes under Not
sure yet (`unsure`, the field's name), where the page says it in the players' words. What the reads copied from the game (a step's objectives)
keeps the game's own words, hedges and all, and only has its blanks filled.
"""
import re

HEDGE = re.compile(r"\b(?:probably|most likely|likely|possibly|perhaps|presumably)\b", re.I)
# A note about the files the reads were made from: a player has no files.
FILES = re.compile(
    r"\b(?:the|these|those|this) (?:records?|files)\b|\bin (?:the )?records\b|\bquest(?:'s|s)? script\b|\bgame's script\b|\bscript event\b|\bnot checked yet\b|\b(?:UESP)\b",
    re.I,
)
BAD = re.compile(f"(?:{HEDGE.pattern})|(?:{FILES.pattern})", re.I)
# Words around a boundary a clause can be cut at: "; ", ": ", ", ", " and ", " but ", " so ".
BOUNDARY = re.compile(r";\s|:\s|,\s|\s(?:and|but|so)\s")
SENTENCE_END = re.compile(r"[.!?](?=\s+[A-Z\"'(]|$)")
# Keys that are not words for a page, and the keys whose strings are copied from the game.
SKIP = {"unsure", "evidence", "plugin", "fixed", "verdicts", "kind", "edid", "id", "stage", "source", "field", "from", "for"}  # (a day row's "from" and "for" are times)
GAME = {"objectives", "steps", "shared"}
# A key a record can't lose and still be a record: an item with no `what` is dropped whole.
HOLDS = {"what", "name", "quest", "choice", "title", "place", "text"}

# What the records call a job the game fills in, in a player's words (Bob, WO-180 Part 4).
JOBS = {
    "Delivery for the npc": "A delivery",
    "Delivery for the person": "A delivery",
    "Delivery for <recipient>": "A delivery",
    "The item": "A shipment to collect",
    "Hunter Marks Animal Den": "Mark an animal den",
    "Hunter Marks Animal Den 02": "Mark an animal den (second job)",
}
# A step the reads wrote with a role the job picks in it (WO-180 Part 6a); only the strings copied from the game (GAME) are changed this way.
GAME_PLAIN = [
    (re.compile(r"\bthe bounty location\b", re.I), "the place the job names"),
    (re.compile(r"\bthe vampire at the dungeon\b", re.I), "the vampire at the place the job names"),
    (re.compile(r"\bthe target\b(?!['\u2019]s| (?:house|town|location))", re.I), "the person the job names"),
]
# A phrase the reads wrote around a thing the game fills in, said as what it is.
PLAIN = [
    (re.compile(r"\bthe riverwood friend\b", re.I), "your friend from Helgen"),
    (re.compile(r"\bthe faction friend\b", re.I), "your friend from Helgen"),
    (re.compile(r"\b(the )?(enemy )?field co\b\.?", re.I), lambda m: f"{m.group(1) or ''}{m.group(2) or ''}field commander"),
    (re.compile(r"\s*\(\s*\)"), ""),
    (re.compile(r"\bthe the\b", re.I), "the"),
    # WO-183 Part 3: the editor's "(Balagog is placed in its cellar)" is not a player's note; and "(the journal doesn't name it)" is the reader's aside.
    (re.compile(r"\s*\([^()]*\bis placed\b[^()]*\)", re.I), ""),
    (re.compile(r"^the journal doesn't name it\)?$", re.I), ""),
    # A step the reads wrote with the job's role in it (WO-180 Part 6a): the person who gave you the job, not "the quest giver".
    (re.compile(r"^(Return to|Report to|Go back to|Talk to) the quest ?giver\b", re.I), lambda m: f"{m.group(1)} the person who gave you the job"),
    (re.compile(r"^named in the quest's records; role not shown$", re.I), "Has a part in it"),
    (re.compile(r"^also in the quest's records; ", re.I), "Also at "),
    (re.compile(r"^in the quest's records at ", re.I), "At "),
    (re.compile(r",?\s*separate from the recipient(?=[.;,]|$)", re.I), ""),
    # Hunter's Mark: its two jobs send you to the same kind of place, said once (WO-180 Part 5a).
    (re.compile(r"\ban animal den picked (?:from the hold you are in|by the mod)\b", re.I), "an animal den in the hold you are in"),
    (re.compile(r"\bthe actor\b", re.I), "the person"),
    (re.compile(r"\bthe npc\b", re.I), "the person"),
    (re.compile(r"\bSpeechcraft\b"), "Speech"),
    (re.compile(r"\bsomeone the records don't name\b", re.I), "someone"),
    (re.compile(r"\s*\(<BribeCost> gold\)"), ""),
    (re.compile(r"<(\d+(?:\.\d+)?)>"), r"\1"),
    (re.compile(r"<the (item|dungeon|place|hold|fort)(?: (?:he|she|they) names| named)?>", re.I), lambda m: f"the {m.group(1).lower()} the job names"),
    (re.compile(r"<recipient>", re.I), "the person it is for"),
    (re.compile(r"<fort>", re.I), "a fort"),
    (re.compile(r"<the current quest giver>", re.I), "the current quest giver"),
    # "in the records:" at the head of a note is the note's own preface.
    (re.compile(r"\s+in (?:the records|these files)(?=\s*[:;,])", re.I), ""),
]


def quote_spans(s):
    """Spans of "double-quoted" words (a line someone says): a hedge or a file in one is the game's, not the editor's."""
    spans, i = [], None
    for k, ch in enumerate(s):
        if ch in '"“”':
            if i is None:
                i = k
            else:
                spans.append((i, k))
                i = None
    return spans


def inside(pos, spans):
    return any(a <= pos <= b for a, b in spans)


def bracket_around(s, pos):
    """The innermost (...) that holds pos, as (start, end), or None."""
    depth, starts = 0, []
    for k, ch in enumerate(s):
        if ch == "(":
            starts.append(k)
        elif ch == ")" and starts:
            a = starts.pop()
            if a <= pos <= k:
                return a, k + 1
    return None


def tidy(text, original):
    t = re.sub(r"\s+", " ", text).strip()
    # A cut that leaves a sentence ending on its joining word ("around the upper part of Markarth and.") ends before it (WO-183 Part 3).
    t = re.sub(r"\s+(?:and|or|but)\s*(?=[.!?]?$)", "", t)
    t = re.sub(r"\s*\(\s*\)", "", t)
    t = re.sub(r"\s+([,;.:!?])", r"\1", t)
    t = re.sub(r"[,;:]\s*$", "", t).strip()
    t = re.sub(r"(^|[.!?]\s)([a-z])", lambda m: m.group(1) + m.group(2).upper(), t) if re.match(r"[A-Z]", original.strip() or "x") else t
    if t and original.rstrip().endswith((".", "!", "?")) and not t.endswith((".", "!", "?", ")", '"')):
        t += "."
    return t


def cut_once(s):
    """s with the first bad span taken out (the smallest bracket, clause or sentence that holds it), or s unchanged when there is none."""
    spans = quote_spans(s)
    for m in BAD.finditer(s):
        if inside(m.start(), spans):
            continue
        br = bracket_around(s, m.start())
        if br:
            return s[: br[0]].rstrip() + s[br[1]:]
        # The sentence that holds it.
        ends = [e.end() for e in SENTENCE_END.finditer(s)]
        a = max([0] + [e for e in ends if e <= m.start()])
        b = min([len(s)] + [e for e in ends if e > m.start()])
        sentence = s[a:b]
        pos = m.start() - a
        left = [x for x in BOUNDARY.finditer(sentence) if x.start() < pos and not inside(a + x.start(), spans)]
        cut_from = left[-1].start() if left else 0
        # To the next semicolon (a clause of its own), else to the sentence's end.
        semi = re.compile(r";\s").search(sentence, m.end())
        cut_to = semi.start() if semi else len(sentence)
        end_punct = sentence.rstrip()[-1] if sentence.rstrip()[-1:] in (".", "!", "?") else ""
        kept = sentence[:cut_from] + sentence[cut_to:]
        if not left:
            kept = kept.lstrip("; ")
        if not semi and end_punct and kept.strip() and not kept.rstrip().endswith(end_punct):
            kept = kept.rstrip() + end_punct
        return s[:a] + kept + s[b:]
    return s


def clean_string(s, hedges=True):
    """(the string in a player's words or None when nothing of it is left, whether a guess or a note about the files was taken out)."""
    out, hit = s, False
    for job, plain in JOBS.items():
        if s == job or s.startswith(job + " ("):
            return plain + s[len(job):], False
    for pat, rep in PLAIN:
        out = pat.sub(rep, out)
    if not hedges:  # a string copied from the game
        for pat, rep in GAME_PLAIN:
            out = pat.sub(rep, out)
    if hedges:
        for _ in range(8):
            nxt = cut_once(out)
            if nxt == out:
                break
            out, hit = nxt, True
    out = tidy(out, s) if out != s else out
    # A split that left a closing bracket with no opening one ("nearest city Solitude)") loses it.
    if out.count(")") > out.count("(") and "(" not in out:
        out = out.replace(")", "").strip()
    if re.sub(r"[^A-Za-z0-9]", "", out) == "" or (hit and len(re.sub(r"[^A-Za-z0-9]", "", out)) < 4):
        return None, hit
    return out, hit


DROP = object()


def clean_value(o, flags, top, game=False):
    """o with every string cleaned; DROP when a record loses the string it can't do without."""
    if isinstance(o, str):
        text, hit = clean_string(o, hedges=not game)
        if hit:
            flags.add(top)
        return DROP if text is None else text
    if isinstance(o, list):
        out = [clean_value(x, flags, top, game) for x in o]
        return [x for x in out if x is not DROP]
    if isinstance(o, dict):
        out = {}
        for k, v in o.items():
            if k in SKIP:
                out[k] = v
                continue
            # "Nightgate Inn in where her coffin ends up": a `where` is a place the page puts "in" in front of, not a sentence.
            if k == "where" and isinstance(v, str) and "doing" not in o and re.match(r"where\b", v, re.I):
                flags.add(top)
                continue
            # "Castle Volkihar (nearest city Solitude)" split into a place and a hold of "nearest city Solitude)": a hold is a hold, not a direction (WO-183 Part 3).
            if k == "hold" and isinstance(v, str) and (re.match(r"(?:nearest|none|not given)\b", v, re.I) or BAD.search(v)):
                flags.add(top)
                continue
            c = clean_value(v, flags, top, game or k in GAME)
            if c is DROP:
                if k in HOLDS:
                    return DROP
                # A line the page reads whole keeps its key, empty: a start's `how`, a day's `doing` and `where`.
                if k in ("how", "doing") or (k == "where" and "doing" in o):
                    out[k] = ""
                continue
            out[k] = c
        # A record that kept nothing but its marks is not a record.
        if o and not any(k not in SKIP for k in out) and any(k not in SKIP for k in o):
            return DROP
        return out
    return o


def clean_read(read):
    """A read with its fields in a player's words; the fields that lost a guess or a note join `unsure` (a field name, no reason)."""
    flags = set()
    out = {}
    for k, v in read.items():
        if k in SKIP:
            out[k] = v
            continue
        c = clean_value(v, flags, k, game=k in GAME)
        if c is not DROP:
            out[k] = c
    if flags:
        have = {u.get("field") for u in out.get("unsure", [])}
        out["unsure"] = [*out.get("unsure", []), *({"field": f} for f in sorted(flags) if f not in have)]
    return out
