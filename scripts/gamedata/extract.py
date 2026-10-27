"""
Extracts what the build planner needs from the winning records in the Ultra
load order: the 18 skill trees (nodes, in-game positions, links), every perk's
name, description, ranks and conditions, the Destiny tree from the Custom
Skills config, and the trait list with names and descriptions.

Reads only. Writes planner_data.json next to this script.
  python3 extract.py
"""
import os, sys, struct, json, re
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from esp import ROOT, active_profile, plugin_paths, load_order, rec_data, subrecs, header, iter_group, resolve, localized_strings
import textdecode  # noqa: F401  registers the "game" error handler (WO-157 Part 8)

SKILL_AVIF = {
    'AVOneHanded': 'One-Handed', 'AVTwoHanded': 'Two-Handed', 'AVMarksman': 'Marksman', 'AVBlock': 'Block',
    'AVSmithing': 'Smithing', 'AVHeavyArmor': 'Heavy Armor', 'AVLightArmor': 'Evasion', 'AVPickpocket': 'Finesse',
    'AVLockpicking': 'Wayfarer', 'AVSneak': 'Sneak', 'AVAlchemy': 'Alchemy', 'AVSpeechcraft': 'Speech',
    'AVAlteration': 'Alteration', 'AVConjuration': 'Conjuration', 'AVDestruction': 'Destruction',
    'AVMysticism': 'Illusion', 'AVRestoration': 'Restoration', 'AVEnchanting': 'Enchanting',
}
AV_INDEX = {6: 'One-Handed', 7: 'Two-Handed', 8: 'Marksman', 9: 'Block', 10: 'Smithing', 11: 'Heavy Armor', 12: 'Evasion',
            13: 'Finesse', 14: 'Wayfarer', 15: 'Sneak', 16: 'Alchemy', 17: 'Speech', 18: 'Alteration', 19: 'Conjuration',
            20: 'Destruction', 21: 'Illusion', 22: 'Restoration', 23: 'Enchanting'}
CMP = {0: '==', 1: '!=', 2: '>', 3: '>=', 4: '<', 5: '<='}

def text(v):
    return v.rstrip(b'\0').decode('utf-8', 'game')

def ctda(v, masters, name):
    op = v[0]
    comp_raw = v[4:8]
    fn = struct.unpack_from('<H', v, 8)[0]
    p1 = struct.unpack_from('<I', v, 12)[0]
    p2 = struct.unpack_from('<I', v, 16)[0]
    comp = struct.unpack_from('<f', comp_raw)[0] if not (op & 0x04) else None
    c = {'fn': fn, 'cmp': CMP.get(op >> 5, '?'), 'value': comp, 'or': bool(op & 1)}
    if fn == 448: c['kind'] = 'HasPerk'; c['perk'] = resolve(p1, masters, name)
    elif fn == 277: c['kind'] = 'GetBaseActorValue'; c['av'] = AV_INDEX.get(p1, p1)
    elif fn == 14: c['kind'] = 'GetActorValue'; c['av'] = AV_INDEX.get(p1, p1)
    elif fn == 80: c['kind'] = 'GetLevel'
    elif fn == 47: c['kind'] = 'GetItemCount'; c['item'] = resolve(p1, masters, name)
    elif fn == 58: c['kind'] = 'GetStage'; c['quest'] = resolve(p1, masters, name); c['stage'] = p2
    elif fn == 56: c['kind'] = 'GetQuestRunning'; c['quest'] = resolve(p1, masters, name)
    elif fn == 543: c['kind'] = 'GetQuestCompleted'; c['quest'] = resolve(p1, masters, name)
    elif fn == 312: c['kind'] = 'GetPCMiscStat'; c['stat'] = p1
    elif fn == 74: c['kind'] = 'GetGlobalValue'; c['global'] = resolve(p1, masters, name)
    else: c['kind'] = f'fn{fn}'; c['p1'] = p1; c['p2'] = p2
    return c

def main():
    pp = plugin_paths(); lo = load_order()
    perks, avifs, spells, flsts, quests, items_, names, mgefs = {}, {}, {}, {}, {}, {}, {}, {}
    for n in lo:
        p = pp.get(n.lower())
        if not p: continue
        b = open(p, 'rb').read()
        if not any(t in b for t in (b'PERK', b'AVIF', b'SPEL', b'FLST', b'QUST', b'INGR', b'MISC', b'ALCH', b'MGEF')): continue
        masters = header(b)
        loc = bool(struct.unpack_from('<I', b, 8)[0] & 0x80)
        strings = localized_strings(p, n) if loc else {}
        def txt(v):
            if loc and len(v) == 4:
                return strings.get(struct.unpack_from('<I', v)[0], '')
            return text(v)
        for grp, store in (('PERK', perks), ('AVIF', avifs), ('SPEL', spells), ('FLST', flsts), ('QUST', quests), ('INGR', items_), ('MISC', items_), ('ALCH', items_), ('MGEF', mgefs)):
            if grp.encode() not in b: continue
            try:
                for o in iter_group(b, grp):
                    t, fl, fid, d = rec_data(b, o)
                    key = resolve(fid, masters, n)
                    sr = subrecs(d)
                    rec = {'plugin': n, 'key': key, 'edid': '', 'full': '', 'desc': ''}
                    conds, items, sections, cur = [], [], [], None
                    for s, v in sr:
                        if s == 'EDID': rec['edid'] = text(v)
                        elif s == 'FULL': rec['full'] = txt(v)
                        elif s == 'DESC': rec['desc'] = txt(v)
                        elif grp == 'PERK' and s == 'DATA' and len(v) >= 5:
                            rec['trait'], rec['level'], rec['numRanks'], rec['playable'], rec['hidden'] = v[0], v[1], v[2], v[3], v[4]
                        elif grp == 'PERK' and s == 'NNAM': rec['next'] = resolve(struct.unpack_from('<I', v)[0], masters, n)
                        elif grp == 'PERK' and s == 'CTDA' and cur is None: conds.append(ctda(v, masters, n))
                        elif grp == 'PERK' and s == 'PRKE': cur = 'entry'  # conditions after this belong to effects, not the perk
                        elif grp == 'AVIF' and s == 'PNAM':
                            cur = {'perk': resolve(struct.unpack_from('<I', v)[0], masters, n), 'links': []}; sections.append(cur)
                        elif grp == 'AVIF' and cur is not None and isinstance(cur, dict):
                            if s == 'XNAM': cur['x'] = struct.unpack_from('<i', v)[0]
                            elif s == 'YNAM': cur['y'] = struct.unpack_from('<i', v)[0]
                            elif s == 'HNAM': cur['hx'] = struct.unpack_from('<f', v)[0]
                            elif s == 'VNAM': cur['vy'] = struct.unpack_from('<f', v)[0]
                            elif s == 'CNAM': cur['links'].append(struct.unpack_from('<I', v)[0])
                            elif s == 'INAM': cur['index'] = struct.unpack_from('<I', v)[0]
                        elif grp == 'FLST' and s == 'LNAM': items.append(resolve(struct.unpack_from('<I', v)[0], masters, n))
                        # Spell effects (birthsigns, standing stones): the effect, then its magnitude and duration.
                        elif grp == 'SPEL' and s == 'EFID': items.append({'effect': resolve(struct.unpack_from('<I', v)[0], masters, n)})
                        elif grp == 'SPEL' and s == 'EFIT' and items and len(v) >= 12:
                            items[-1]['mag'], items[-1]['area'], items[-1]['dur'] = struct.unpack_from('<fII', v)
                        # A magic effect's description, with <mag> and <dur> where the spell's numbers go.
                        elif grp == 'MGEF' and s == 'DNAM': rec['desc'] = txt(v)
                    if grp == 'PERK': rec['conditions'] = conds
                    if grp == 'AVIF': rec['sections'] = sections
                    if grp == 'FLST': rec['items'] = items
                    if grp == 'SPEL': rec['effects'] = items
                    store[key] = rec  # later plugins win
            except Exception as e:
                print('skip', n, grp, e, file=sys.stderr)
    for k, r in perks.items(): names[k] = r['full'] or r['edid']

    def annotate(c):
        if 'perk' in c: return dict(c, perk=list(c['perk']), perkName=names.get(c['perk'], '?'))
        if 'item' in c:
            it = items_.get(c['item'], {})
            return dict(c, item=list(c['item']), itemName=it.get('full') or it.get('edid', '?'))
        if 'quest' in c:
            q = quests.get(c['quest'], {})
            return dict(c, quest=list(c['quest']), questName=q.get('full') or q.get('edid', '?'))
        if 'global' in c: return dict(c, **{'global': list(c['global'])})
        return c

    # Skill trees
    trees = {}
    for avif in avifs.values():
        if avif['edid'] not in SKILL_AVIF: continue
        tree = SKILL_AVIF[avif['edid']]
        byidx = {s.get('index'): s for s in avif['sections']}
        nodes = []
        for s in avif['sections']:
            if s['perk'][1] == 0: continue
            pk = perks.get(s['perk'])
            nodes.append({
                'key': list(s['perk']), 'edid': pk['edid'] if pk else '', 'name': names.get(s['perk'], str(s['perk'])),
                'x': s.get('x'), 'y': s.get('y'), 'hx': s.get('hx'), 'vy': s.get('vy'), 'index': s.get('index'),
                'linksTo': [list(byidx[c]['perk']) for c in s['links'] if c in byidx and byidx[c]['perk'][1] != 0],
            })
        roots = [list(byidx[c]['perk']) for s in avif['sections'] if s['perk'][1] == 0 for c in s['links'] if c in byidx]
        trees[tree] = {'full': avif['full'], 'plugin': avif['plugin'], 'roots': roots, 'nodes': nodes}

    def perk_out(k):
        r = perks[k]
        ranks = []
        seen = set()
        while k and k in perks and k not in seen:
            seen.add(k); rr = perks[k]
            ranks.append({'key': list(k), 'edid': rr['edid'], 'name': rr['full'], 'desc': rr['desc'], 'plugin': rr['plugin'],
                          'conditions': [annotate(c) for c in rr['conditions']]})
            k = rr.get('next')
        return ranks

    skill_perks = {}
    for tree, t in trees.items():
        for nd in t['nodes']:
            skill_perks[nd['edid'] or str(nd['key'])] = {'tree': tree, 'ranks': perk_out(tuple(nd['key']))}

    # Destiny from the Custom Skills config
    cfg = ROOT + '/mods/Subclasses of Skyrim/NetScriptFramework/Plugins/CustomSkill.destiny.config.txt'
    nodes = {}
    for line in open(cfg, encoding='utf-8', errors='ignore'):
        m = re.match(r'Node(\d+)\.(\w+)\s*=\s*(.*)', line.strip())
        if not m: continue
        i, k, v = int(m.group(1)), m.group(2), m.group(3).strip().strip('"')
        nodes.setdefault(i, {})[k] = v
    destiny = []
    for i, nd in sorted(nodes.items()):
        if nd.get('Enable', 'true').lower() != 'true': continue
        if 'PerkId' not in nd:
            destiny.append({'node': i, 'root': True, 'links': [int(x) for x in nd.get('Links', '').split(',') if x.strip()]}); continue
        key = (nd['PerkFile'], int(nd['PerkId'], 16))
        pk = perks.get(key, {})
        destiny.append({'node': i, 'key': list(key), 'edid': pk.get('edid', ''), 'name': pk.get('full', ''), 'desc': pk.get('desc', ''),
                        'x': float(nd.get('X', 0)), 'y': float(nd.get('Y', 0)), 'gridX': int(nd.get('GridX', 0)), 'gridY': int(nd.get('GridY', 0)),
                        'links': [int(x) for x in nd.get('Links', '').split(',') if x.strip()],
                        'conditions': [annotate(c) for c in pk.get('conditions', [])]})

    # Traits: the ability form list plus FLM additions
    traits = []
    ab = next((f for f in flsts.values() if f['edid'] == 'Traits_AbilityList'), None)
    items = list(ab['items']) if ab else []
    by_edid = {s['edid']: k for k, s in spells.items()}
    for mod in sorted(os.listdir(ROOT + '/mods')):
        for f in os.listdir(ROOT + '/mods/' + mod) if os.path.isdir(ROOT + '/mods/' + mod) else []:
            if f.endswith('_FLM.ini'):
                for line in open(ROOT + '/mods/' + mod + '/' + f, encoding='utf-8', errors='ignore'):
                    m = re.match(r'\s*FormList\s*=\s*Traits_AbilityList\|(.+)', line)
                    if m:
                        for e in m.group(1).split(','):
                            e = e.strip().lstrip('*')
                            if e in by_edid and by_edid[e] not in items: items.append(by_edid[e])
    for k in items:
        s = spells.get(k)
        if not s: continue
        traits.append({'key': list(k), 'edid': s['edid'], 'name': s['full'], 'desc': s['desc'], 'plugin': s['plugin']})

    # Birthsigns and standing stones: their spells, with each effect's description from its
    # magic effect, for build.py to write the game's own words. Candidates by the sign's name
    # ("The Warrior") or by EDID; build.py picks one per sign and says which.
    SIGNS = ['Warrior', 'Thief', 'Mage', 'Apprentice', 'Atronach', 'Lady', 'Lord', 'Lover', 'Ritual', 'Serpent', 'Shadow', 'Steed', 'Tower']
    def spell_out(k, s):
        effs = []
        for e in s.get('effects', []):
            m = mgefs.get(e['effect'], {})
            effs.append({'edid': m.get('edid', ''), 'name': m.get('full', ''), 'desc': m.get('desc', ''), 'mag': e.get('mag'), 'dur': e.get('dur')})
        return {'key': list(k), 'edid': s['edid'], 'name': s['full'], 'desc': s['desc'], 'plugin': s['plugin'], 'effects': effs}
    signs = {}
    for k, s in spells.items():
        for sign in SIGNS:
            named = s['full'] in (f'The {sign}', f'{sign}', f'The {sign} Stone')
            by_id = re.search(rf'(?i)(birthsign|doom|stone).*{sign}|{sign}.*(birthsign|doom|stone)', s['edid'] or '')
            if named or by_id:
                signs.setdefault(sign, []).append(spell_out(k, s))

    enabled = {}
    for l in open(ROOT + '/profiles/' + active_profile() + '/modlist.txt', encoding='utf-8', errors='ignore'):
        if l.startswith('+'): enabled[l.strip()[1:]] = True
    out = {'trees': trees, 'perks': skill_perks, 'destiny': destiny, 'traits': traits, 'signs': signs,
           'avifNames': {SKILL_AVIF[a['edid']]: a['full'] for a in avifs.values() if a['edid'] in SKILL_AVIF}}
    json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'planner_data.json'), 'w'), indent=1)
    print('trees', len(trees), 'perks', len(skill_perks), 'destiny nodes', len(destiny), 'traits', len(traits), 'signs', len(signs))
    for t, v in trees.items(): print(f"  {t:12} {v['full']:14} {len(v['nodes'])} nodes  ({v['plugin']})")

main()
