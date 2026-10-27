"""Convert the winning trait thumbnail (DDS) for each trait in planner_data.json to WebP.

Writes traitpics/<slug>.webp and traitpics/index.json (name -> file, source mod).
Only writes under _fieldguide.
"""
import os, json, re, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from esp import active_profile  # noqa: E402

ROOT = os.path.expanduser('~/mnt/LoreRim')
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'traitpics')
SIZE = (640, 440)

def enabled_mods():
    mods = [l.strip()[1:] for l in open(ROOT + '/profiles/' + active_profile() + '/modlist.txt', encoding='utf-8', errors='ignore') if l.startswith('+')]
    return mods  # first = highest priority

def pics():
    found = {}
    for m in reversed(enabled_mods()):  # lowest priority first, later (higher) overwrite
        d = os.path.join(ROOT, 'mods', m, 'Interface', 'TraitPics')
        if not os.path.isdir(d): continue
        for f in os.listdir(d):
            if f.lower().endswith('.dds'):
                found[f[:-4].lower()] = (os.path.join(d, f), m)
    return found

def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def main():
    data = json.load(open(os.path.join(HERE, 'planner_data.json'), encoding='utf-8'))
    found = pics()
    os.makedirs(OUT, exist_ok=True)
    index = {}
    missing = []
    for t in data['traits']:
        key = t['edid'].lower()
        hit = found.get(key)
        if not hit:
            missing.append((t['name'], t['edid'])); continue
        path, mod = hit
        im = Image.open(path).convert('RGB')
        im = im.resize(SIZE, Image.LANCZOS)
        fn = slug(t['name']) + '.webp'
        im.save(os.path.join(OUT, fn), 'WEBP', quality=78, method=6)
        index[t['name']] = {'file': fn, 'edid': t['edid'], 'mod': mod, 'size': list(im.size)}
    json.dump(index, open(os.path.join(OUT, 'index.json'), 'w'), indent=1)
    print('converted', len(index), 'missing', missing)
    sizes = sorted(os.path.getsize(os.path.join(OUT, v['file'])) for v in index.values())
    print('bytes min/median/max', sizes[0], sizes[len(sizes)//2], sizes[-1], 'total', sum(sizes))

main()
