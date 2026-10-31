"""
Reads files out of a Skyrim SE archive (BSA version 105), for the base game's string tables,
which ship inside `Skyrim - Interface.bsa` rather than as loose files. Reads only; no LZ4,
so only uncompressed entries (the string tables are stored uncompressed).
"""
import os
import struct
import textdecode  # noqa: F401  registers the "game" error handler (WO-157 Part 8)


def read_bsa(path, want):
    """{lowercase 'folder\\file': bytes} for entries whose path contains any of `want`."""
    with open(path, "rb") as f:
        magic, ver, off, aflags, nfold, _nfile, _folen, filen, _fflags = struct.unpack("<4sIIIIIIII", f.read(36))
        if magic != b"BSA\x00" or ver != 105:
            raise ValueError(f"not a v105 BSA: {path}")
        compressed, embed = bool(aflags & 4), bool(aflags & 0x100)
        f.seek(off)
        folders = [struct.unpack("<QIIQ", f.read(24)) for _ in range(nfold)]
        blocks = []
        for _h, count, _pad, _foff in folders:
            ln = f.read(1)[0]
            name = f.read(ln).rstrip(b"\0").decode("latin1")
            blocks.append((name, [struct.unpack("<QII", f.read(16)) for _ in range(count)]))
        names = f.read(filen).split(b"\0")
        out, i = {}, 0
        for folder, recs in blocks:
            for _h, size, o in recs:
                full = (folder + "\\" + names[i].decode("latin1")).lower()
                i += 1
                if not any(w in full for w in want):
                    continue
                packed = compressed ^ bool(size & 0x40000000)
                size &= 0x3FFFFFFF
                f.seek(o)
                if embed:
                    ln = f.read(1)[0]
                    f.read(ln)
                    size -= ln + 1
                out[full] = None if packed else f.read(size)
        return out


def parse_strings(b, kind):
    """A STRINGS / DLSTRINGS / ILSTRINGS table as {id: text}."""
    n, _size = struct.unpack_from("<II", b, 0)
    table, out = 8 + n * 8, {}
    for i in range(n):
        sid, off = struct.unpack_from("<II", b, 8 + i * 8)
        o = table + off
        if kind == "strings":
            s = b[o:b.index(b"\0", o)]
        else:
            ln = struct.unpack_from("<I", b, o)[0]
            s = b[o + 4:o + 4 + ln].rstrip(b"\0")
        out[sid] = s.decode("utf-8", "game")
    return out


_VANILLA = None


_OWN = {}


def plugin_strings_kinds(plugin_path, plugin):
    """
    WO-183 Part 7: a Creation Club plugin's English string tables, which ship inside its own archive (ccbgssse040-advobgobs.bsa beside ccbgssse040-advobgobs.esl), not loose and not in
    the base game's. {'STRINGS': {...}, 'DLSTRINGS': {...}, 'ILSTRINGS': {...}}, empty tables when the plugin has no archive of that name.
    """
    base = os.path.splitext(os.path.basename(plugin))[0]
    path = os.path.join(os.path.dirname(plugin_path), base + ".bsa")
    # Only the Creation Club's (named cc..., and the Unofficial Creation Club Content Patch, which changes their quests): other mods' own archives would change the winner of many a
    # record the data was checked on (Nightgate Inn, Campsite); six other plugins keep their names in an archive and are not read (WO-183 Part 7).
    if not (base.lower().startswith("cc") or "creation club" in base.lower()):
        return {k: {} for k in ("STRINGS", "DLSTRINGS", "ILSTRINGS")}
    if path not in _OWN:
        out = {k: {} for k in ("STRINGS", "DLSTRINGS", "ILSTRINGS")}
        if os.path.exists(path):
            try:
                for k, v in read_bsa(path, ["strings\\"]).items():
                    if "_english." not in k or v is None:
                        continue
                    kind = k.rsplit(".", 1)[1]
                    out[kind.upper()] = parse_strings(v, kind)
            except ValueError:
                pass  # not a v105 archive: no strings from it
        _OWN[path] = out
    return _OWN[path]


_VANILLA_KINDS = None


def vanilla_strings_kinds(plugin, root):
    """A base-game master's English string tables, each on its own: {'STRINGS': {...}, 'DLSTRINGS': {...}, 'ILSTRINGS': {...}}."""
    global _VANILLA_KINDS
    if _VANILLA_KINDS is None:
        _VANILLA_KINDS = {}
        for k, v in read_bsa(os.path.join(root, "Stock Game", "Data", "Skyrim - Interface.bsa"), ["strings\\"]).items():
            if "_english." not in k or v is None:
                continue
            base, kind = k.split("\\")[-1].rsplit(".", 1)
            _VANILLA_KINDS.setdefault(base.replace("_english", ""), {})[kind.upper()] = parse_strings(v, kind)
    found = _VANILLA_KINDS.get(plugin.lower().rsplit(".", 1)[0], {})
    return {k: found.get(k, {}) for k in ("STRINGS", "DLSTRINGS", "ILSTRINGS")}


def vanilla_strings(plugin, root):
    """English strings for a base-game master (Skyrim, Update, Dawnguard, HearthFires, Dragonborn)."""
    global _VANILLA
    if _VANILLA is None:
        _VANILLA = {}
        for k, v in read_bsa(os.path.join(root, "Stock Game", "Data", "Skyrim - Interface.bsa"), ["strings\\"]).items():
            if "_english." not in k or v is None:
                continue
            base, kind = k.split("\\")[-1].rsplit(".", 1)
            _VANILLA.setdefault(base.replace("_english", ""), {}).update(parse_strings(v, kind))
    return _VANILLA.get(plugin.lower().rsplit(".", 1)[0], {})
