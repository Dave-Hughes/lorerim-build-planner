"""
The game's text, decoded (WO-157 Part 8). Skyrim's records and string tables are UTF-8 where a mod wrote them so, and Windows-1252 where
Word or an old editor did ("we’ve", "“Greater”", "naïve", "Ghûra"). Decoding everything as UTF-8 with "replace" turned the second kind
into U+FFFD. Importing this module registers the "game" error handler, so `bytes.decode("utf-8", "game")` reads a byte that isn't valid
UTF-8 as cp1252 instead; text that is valid UTF-8 is untouched.

`repair_lost` and `tidy_excerpt` stand in for the raw files already written with U+FFFD in them and with excerpts cut mid-word, until the
PC runs the extraction again with the handler: they are applied to the quoted text on a page, never to a name.
"""
import codecs
import re


def _game(err):
    if not isinstance(err, UnicodeDecodeError):
        raise err
    return err.object[err.start:err.end].decode("cp1252", "replace"), err.end


codecs.register_error("game", _game)

# What a lost byte most likely was, from the letters around it. Only quoted prose: the same shape in a name ("Gh�ra") is a letter, not a dash.
_FIXES = [
    (re.compile(r"na\ufffdve"), "na\u00efve"),
    (re.compile(r"(?<=[A-Za-z])\ufffd(?=(?:s|ve|t|ll|re|d|m)\b)"), "\u2019"),
    (re.compile(r"(?<= )\ufffd(?= )"), "\u2013"),
    (re.compile(r"(?<=[a-z])\ufffd(?=[a-z])"), "\u2014"),
    (re.compile(r"(?:(?<=\s)|^)\ufffd(?=\w)"), "\u201c"),
    (re.compile(r"(?<=[\w.,?!])\ufffd(?=[\s,.;:?!]|$)"), "\u201d"),
]


def repair_lost(text):
    for pat, to in _FIXES:
        text = pat.sub(to, text)
    return text


def tidy_excerpt(text, *, window=False):
    """
    A quote that ends on a whole sentence, or on a word with "…". `window` is an excerpt cut out of the middle of a longer text (a book): it
    also drops the broken sentence it starts in, or starts at a word with "…".
    """
    text = text.strip()
    if window and text and not re.match(r"[A-Z\"“\[]", text):
        m = re.search(r"[.?!][\"”]?\s+(?=[A-Z\"“])", text[:140])
        if m:
            text = text[m.end():]
        else:
            sp = text.find(" ")
            text = "…" + text[sp:] if sp >= 0 else text
    if re.search(r"[.?!\"”\]\)]$", text):
        return text
    ends = [m.end() for m in re.finditer(r"[.?!][\"”]?(?=\s)", text)]
    if ends and ends[-1] >= len(text) * 0.5:
        return text[: ends[-1]]
    cut = text.rfind(" ")
    return (text[:cut] if cut > 0 else text).rstrip(",;:- ") + "…"
