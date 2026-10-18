"""
Reads compiled Papyrus scripts (.pex, Skyrim's big-endian format) and finds the winning copy of a script
in the LoreRim install. Reads only; no outside decompiler.

  read_pex(bytes) -> Pex: header, string table, debug info, objects with their variables, properties,
                     states and functions, and each function's instructions with their arguments.
  Scripts(root)   -> the winning .pex for a script name: the loose file from the highest-priority MO2
                     mod folder, else the copy in the BSA of the last plugin that loads one (the ini's
                     vanilla archives first).

The format: header (magic FA57C0DE, version, game, time, source, user, machine), a string table,
optional debug info, user flags, then objects. A value is a type byte and its data: null, identifier
or string (a string-table index), integer, float or bool. Opcodes and their argument counts are the
compiler's; calls carry a count of extra arguments after their fixed ones.
"""
import os
import re
import struct
import zlib

MAGIC = 0xFA57C0DE
# opcode: (name, fixed argument count, takes extra arguments after a count)
OPCODES = {
    0: ("nop", 0, False), 1: ("iadd", 3, False), 2: ("fadd", 3, False), 3: ("isub", 3, False), 4: ("fsub", 3, False),
    5: ("imul", 3, False), 6: ("fmul", 3, False), 7: ("idiv", 3, False), 8: ("fdiv", 3, False), 9: ("imod", 3, False),
    10: ("not", 2, False), 11: ("ineg", 2, False), 12: ("fneg", 2, False), 13: ("assign", 2, False), 14: ("cast", 2, False),
    15: ("cmp_eq", 3, False), 16: ("cmp_lt", 3, False), 17: ("cmp_le", 3, False), 18: ("cmp_gt", 3, False), 19: ("cmp_ge", 3, False),
    20: ("jmp", 1, False), 21: ("jmpt", 2, False), 22: ("jmpf", 2, False), 23: ("callmethod", 3, True), 24: ("callparent", 2, True),
    25: ("callstatic", 3, True), 26: ("return", 1, False), 27: ("strcat", 3, False), 28: ("propget", 3, False), 29: ("propset", 3, False),
    30: ("array_create", 2, False), 31: ("array_length", 2, False), 32: ("array_getelement", 3, False), 33: ("array_setelement", 3, False),
    34: ("array_findelement", 4, False), 35: ("array_rfindelement", 4, False),
}
NULL, IDENT, STRING, INT, FLOAT, BOOL = range(6)


class PexError(ValueError):
    pass


class Reader:
    def __init__(self, data):
        self.d, self.o = data, 0

    def take(self, fmt):
        v = struct.unpack_from(">" + fmt, self.d, self.o)
        self.o += struct.calcsize(">" + fmt)
        return v if len(v) > 1 else v[0]

    def wstr(self):
        n = self.take("H")
        s = self.d[self.o:self.o + n].decode("latin1")
        self.o += n
        return s


def read_pex(data):
    """A .pex file as plain data: {source, strings, objects: [{name, parent, variables, properties, states}]}."""
    r = Reader(data)
    try:
        if r.take("I") != MAGIC:
            raise PexError("not a Skyrim .pex (magic)")
        major, minor, game, _time = r.take("BBHQ")
        source, _user, _machine = r.wstr(), r.wstr(), r.wstr()
        strings = [r.wstr() for _ in range(r.take("H"))]

        def s(i):
            return strings[i] if i < len(strings) else f"<string {i}>"

        if r.take("B"):  # debug info: function line numbers
            r.take("Q")
            for _ in range(r.take("H")):
                r.take("HHHB")
                lines = r.take("H")
                r.o += 2 * lines
        for _ in range(r.take("H")):  # user flags
            r.take("HB")

        def value():
            t = r.take("B")
            if t == NULL:
                return (NULL, None)
            if t in (IDENT, STRING):
                return (t, s(r.take("H")))
            if t == INT:
                return (INT, r.take("i"))
            if t == FLOAT:
                return (FLOAT, round(r.take("f"), 4))
            if t == BOOL:
                return (BOOL, bool(r.take("B")))
            raise PexError(f"value type {t} at {r.o}")

        def function(name):
            ret, _doc, _uflags, flags = s(r.take("H")), r.take("H"), r.take("I"), r.take("B")
            params = [(s(r.take("H")), s(r.take("H"))) for _ in range(r.take("H"))]
            local = [(s(r.take("H")), s(r.take("H"))) for _ in range(r.take("H"))]
            code = []
            for _ in range(r.take("H")):
                op = r.take("B")
                if op not in OPCODES:
                    raise PexError(f"opcode {op} at {r.o}")
                opname, n, extra = OPCODES[op]
                args = [value() for _ in range(n)]
                if extra:
                    count = value()
                    if count[0] != INT:
                        raise PexError(f"argument count isn't an integer at {r.o}")
                    args += [value() for _ in range(count[1])]
                code.append((opname, args))
            return {"name": name, "returns": ret, "native": bool(flags & 2), "global": bool(flags & 1), "params": params, "locals": local, "code": code}

        objects = []
        for _ in range(r.take("H")):
            name = s(r.take("H"))
            size = r.take("I")
            start = r.o
            parent, _doc, _uflags, auto_state = s(r.take("H")), r.take("H"), r.take("I"), s(r.take("H"))
            variables = []
            for _ in range(r.take("H")):
                vname, vtype, _vf = s(r.take("H")), s(r.take("H")), r.take("I")
                variables.append({"name": vname, "type": vtype, "value": value()})
            properties = []
            for _ in range(r.take("H")):
                pname, ptype, _pdoc, _pf, flags = s(r.take("H")), s(r.take("H")), r.take("H"), r.take("I"), r.take("B")
                prop = {"name": pname, "type": ptype}
                if flags & 4:
                    prop["autovar"] = s(r.take("H"))
                else:
                    if flags & 1:
                        prop["get"] = function("Get" + pname)
                    if flags & 2:
                        prop["set"] = function("Set" + pname)
                properties.append(prop)
            states = []
            for _ in range(r.take("H")):
                sname = s(r.take("H"))
                funcs = []
                for _ in range(r.take("H")):
                    fname = s(r.take("H"))
                    funcs.append(function(fname))
                states.append({"name": sname, "functions": funcs})
            if size and r.o - start + 4 != size:
                r.o = start + size - 4  # trust the object's own size if the layout drifted
            objects.append({"name": name, "parent": parent, "autoState": auto_state, "variables": variables, "properties": properties, "states": states})
        return {"source": source, "version": (major, minor), "game": game, "strings": strings, "objects": objects}
    except (struct.error, IndexError) as e:
        raise PexError(f"truncated or misread at {r.o}: {e}") from e


def functions(pex):
    """Every function in a script: (state, function)."""
    for obj in pex["objects"]:
        for st in obj["states"]:
            for f in st["functions"]:
                yield st["name"], f


class Archive:
    """One BSA's file list, read on demand: v104 (zlib) and v105 (LZ4 frame) entries."""

    def __init__(self, path):
        self.path, self.files = path, {}
        with open(path, "rb") as f:
            magic, ver, off, aflags, nfold, _nf, _fl, filen, _ff = struct.unpack("<4sIIIIIIII", f.read(36))
            if magic != b"BSA\x00":
                raise ValueError("not a BSA")
            self.ver, self.compressed, self.embed = ver, bool(aflags & 4), bool(aflags & 0x100)
            f.seek(off)
            rec = 24 if ver == 105 else 16
            folders = [struct.unpack("<QI", f.read(rec)[:12]) for _ in range(nfold)]
            blocks = []
            for _h, count in folders:
                ln = f.read(1)[0]
                name = f.read(ln).rstrip(b"\0").decode("latin1")
                blocks.append((name, [struct.unpack("<QII", f.read(16)) for _ in range(count)]))
            names = f.read(filen).split(b"\0")
            i = 0
            for folder, recs in blocks:
                for _h, size, o in recs:
                    self.files[(folder + "\\" + names[i].decode("latin1")).lower()] = (size, o)
                    i += 1

    def read(self, name):
        size, o = self.files[name]
        packed = self.compressed ^ bool(size & 0x40000000)
        size &= 0x3FFFFFFF
        with open(self.path, "rb") as f:
            f.seek(o)
            if self.embed:
                ln = f.read(1)[0]
                f.read(ln)
                size -= ln + 1
            if not packed:
                return f.read(size)
            f.read(4)  # unpacked size
            data = f.read(size - 4)
        if self.ver == 105:
            import lz4.frame
            return lz4.frame.decompress(data)
        return zlib.decompress(data)


class Scripts:
    """
    The winning copy of each script: loose files by MO2 priority (highest first, then Stock Game), else the
    BSA loaded last that has it. `where(name)` says which; `get(name)` returns the parsed script or None.
    """

    def __init__(self, root, load_order, profile="Ultra", archives=None, loose_dirs=None):
        self.root = root
        if loose_dirs is None:
            mods = [l.strip()[1:] for l in open(os.path.join(root, "profiles", profile, "modlist.txt"), encoding="utf-8", errors="ignore") if l.startswith("+")]
            loose_dirs = [os.path.join(root, "mods", d) for d in mods] + [os.path.join(root, "Stock Game", "Data")]
        self.loose = {}
        for d in reversed(loose_dirs):  # lowest priority first, so higher ones overwrite
            sd = os.path.join(d, "scripts")
            try:
                for f in os.listdir(sd):
                    if f.lower().endswith(".pex"):
                        self.loose[f.lower()[:-4]] = os.path.join(sd, f)
            except OSError:
                pass
        if archives is None:
            found = {}
            for d in reversed(loose_dirs):
                try:
                    for f in os.listdir(d):
                        if f.lower().endswith(".bsa"):
                            found[f.lower()] = os.path.join(d, f)
                except OSError:
                    pass
            order = []
            ini = os.path.join(root, "profiles", profile, "skyrim.ini")
            if os.path.exists(ini):
                for line in re.findall(r"^sResourceArchiveList2?=(.*)$", open(ini, encoding="utf-8", errors="ignore").read(), re.M):
                    order += [a.strip().lower() for a in line.split(",") if a.strip()]
            for p in load_order:
                base = os.path.splitext(p)[0].lower()
                order += [base + ".bsa", base + " - textures.bsa"]
            archives = [found[a] for a in dict.fromkeys(order) if a in found]
        self.archives = []
        for a in archives:
            try:
                self.archives.append(Archive(a))
            except (ValueError, OSError, struct.error):
                pass
        self.cache = {}

    def where(self, name):
        """('loose', path) or ('bsa', archive path), the winner, or (None, None)."""
        key = name.lower()
        if key in self.loose:
            return "loose", self.loose[key]
        entry = "scripts\\" + key + ".pex"
        for a in reversed(self.archives):
            if entry in a.files:
                return "bsa", a.path
        return None, None

    def data(self, name):
        kind, path = self.where(name)
        if kind == "loose":
            return open(path, "rb").read()
        if kind == "bsa":
            a = next(a for a in self.archives if a.path == path)
            return a.read("scripts\\" + name.lower() + ".pex")
        return None

    def get(self, name):
        """The parsed script, None when there's no copy, or a PexError message string when it can't be read."""
        key = name.lower()
        if key not in self.cache:
            raw = self.data(name)
            if raw is None:
                self.cache[key] = None
            else:
                try:
                    self.cache[key] = read_pex(raw)
                except PexError as e:
                    self.cache[key] = f"unreadable: {e}"
        return self.cache[key]
