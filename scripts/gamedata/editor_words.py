"""WO-180 Part 2: words an editor writes and a player does not, taken out of the reads' sentences where the reads are loaded.

The reads (people, quests) were written by readers of the game's files, and some of their sentences say how the game is built ("her sandbox package
sits above her sleep package", "he's in the follower and marriage factions", "tied to the quest's aliases"). A player has no use for them. The same
words are the site's own list for the reasons under Not sure yet (src/lib/pages/player-words.ts, EDITOR_TERMS); the ones a sentence can lose a clause
over without losing its meaning are here. ("form", "cell", "condition" and "here" are not: they are ordinary words in a sentence about a person.)
"""
import re

EDITOR = r"\b(?:packages?|alias(?:es)?|scripts?|propert(?:y|ies)|factions?|keywords?|stages?|plugins?|placed|placement|I went with)\b"
EDITOR_RE = re.compile(EDITOR, re.I)


def without_editor_words(text):
    """The sentence with every bracket, clause (between semicolons) and sentence that has an editor's word in it taken out; "" when nothing is left."""
    if not text:
        return text
    t = re.sub(r"\s*\(([^()]*)\)", lambda m: "" if EDITOR_RE.search(m.group(1)) else m.group(0), text)
    kept = []
    for sentence in re.split(r"(?<=[.!?])\s+", t):
        clauses = [c for c in re.split(r";\s*", sentence) if c.strip() and not EDITOR_RE.search(c)]
        if clauses:
            kept.append("; ".join(clauses))
    out = " ".join(kept).strip()
    if out and out != text.strip() and out[-1] not in ".!?)\"'":
        out = out.rstrip(",;:") + ("" if re.search(r"[.!?]$", text.strip()) is None else ".")
    return out
