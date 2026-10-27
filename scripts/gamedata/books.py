"""Which book grants each perk that can't be taken from the menu (GetLevel < 0)?
Scans winning BOOK records for VMAD property references to the perk. Reads only; prints JSON."""
import os, sys, struct, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from esp import ROOT, plugin_paths, load_order, rec_data, subrecs, header, iter_group, resolve
import textdecode  # noqa: F401  registers the "game" error handler (WO-157 Part 8)

data = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'planner_data.json'), encoding='utf-8'))
want = {}
for edid, p in data['perks'].items():
    for r in p['ranks']:
        if any(c['kind'] == 'GetLevel' and c['cmp'] == '<' for c in r['conditions']):
            want[tuple(r['key'])] = (p['tree'], r['name'])
print('book perks', len(want), file=sys.stderr)

pp = plugin_paths(); lo = load_order()
books = {}
for n in lo:
    p = pp.get(n.lower())
    if not p: continue
    b = open(p, 'rb').read()
    if b'BOOK' not in b: continue
    masters = header(b)
    loc = bool(struct.unpack_from('<I', b, 8)[0] & 0x80)
    try:
        for o in iter_group(b, 'BOOK'):
            t, fl, fid, d = rec_data(b, o)
            key = resolve(fid, masters, n)
            rec = {'plugin': n, 'edid': '', 'full': '', 'refs': set()}
            for s, v in subrecs(d):
                if s == 'EDID': rec['edid'] = v.rstrip(b'\0').decode('latin1')
                elif s == 'FULL' and not loc: rec['full'] = v.rstrip(b'\0').decode('utf-8', 'game')
                elif s == 'VMAD':
                    for i in range(0, len(v) - 3):
                        fidv = struct.unpack_from('<I', v, i)[0]
                        if fidv == 0: continue
                        rk = resolve(fidv, masters, n)
                        if rk in want: rec['refs'].add(rk)
            books[key] = rec
    except Exception as e:
        print('skip', n, e, file=sys.stderr)
out = {}
for key, rec in books.items():
    for rk in rec['refs']:
        out.setdefault(f"{want[rk][0]}:{want[rk][1]}", []).append({'book': rec['full'] or rec['edid'], 'edid': rec['edid'], 'plugin': rec['plugin'], 'key': list(key)})
print(json.dumps(out, indent=1))
missing = [f"{t}:{nm}" for (t, nm) in want.values() if f"{t}:{nm}" not in out]
print('no book found for', missing, file=sys.stderr)
