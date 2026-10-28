import struct, zlib, sys, json, base64
lo=json.load(open('lo.json'))
targets=json.loads(zlib.decompress(base64.b64decode(open('targets.b64').read())))
owners=set(t[0].split(':')[0].lower() for t in targets)|set((t[1] or 'x:').split(':')[0].lower() for t in targets)
owners|={'skyrim.esm','update.esm','dawnguard.esm','dragonborn.esm'}
plugs=[(p,w) for p,w in lo if p.lower() in owners]
print('plugins read',len(plugs))
COMP=0x00040000
def subrecs(d):
    o=0; res=[]; big=None
    while o+6<=len(d):
        t=d[o:o+4]; sz=struct.unpack_from('<H',d,o+4)[0]; o+=6
        if t==b'XXXX': big=struct.unpack_from('<I',d,o)[0]; o+=sz; continue
        if big is not None: sz=big; big=None
        res.append((t,d[o:o+sz])); o+=sz
    return res
def owner(fid,masters,me):
    i=fid>>24
    return ('%s:%06X'%(masters[i] if i<len(masters) else me, fid&0xFFFFFF))
lctn={}; refs={}; worlds={}
for name,path in plugs:
    buf=open(path,'rb').read()
    hsz=struct.unpack_from('<I',buf,4)[0]
    masters=[v.rstrip(b'\0').decode('latin1') for s,v in subrecs(buf[24:24+hsz]) if s==b'MAST']
    cur_world=None
    def walk(o,end):
        global cur_world
        while o<end:
            t=buf[o:o+4]
            if t==b'GRUP':
                gsz,lab,gtype=struct.unpack_from('<IIi',buf,o+4)
                if gtype==1: cur_world=owner(lab,masters,name)
                elif gtype==0 and buf[o+8:o+12] in (b'CELL',): cur_world=None
                walk(o+24,o+gsz); o+=gsz; continue
            sz,flags,fid=struct.unpack_from('<III',buf,o+4)
            if t in (b'LCTN',b'REFR',b'WRLD'):
                data=buf[o+24:o+24+sz]
                if flags&COMP:
                    try: data=zlib.decompress(data[4:])
                    except Exception: o+=24+sz; continue
                key=owner(fid,masters,name)
                subs=subrecs(data)
                if t==b'LCTN':
                    for s,v in subs:
                        if s==b'MNAM' and len(v)>=4: lctn[key]=owner(struct.unpack_from('<I',v)[0],masters,name)
                elif t==b'WRLD':
                    worlds[key]=next((v.rstrip(b'\0').decode('latin1') for s,v in subs if s==b'EDID'),'')
                else:
                    pos=next((struct.unpack_from('<fff',v) for s,v in subs if s==b'DATA' and len(v)>=12),None)
                    if pos: refs[key]=(cur_world,pos)
            o+=24+sz
    walk(24+hsz,len(buf))
    print(name,len(refs),len(lctn))
res={}
from collections import Counter
c=Counter()
for pid,mk,nm,ty,town in targets:
    r=None; how=None
    if mk and mk in refs: r=refs[mk]; how='marker'
    elif pid in lctn and lctn[pid] in refs: r=refs[lctn[pid]]; how='location marker'
    elif town: how='in town'
    else: how='none'
    c[how]+=1
    res[pid]={'how':how,'world':(worlds.get(r[0],r[0]) if r else None),'pos':(r[1] if r else None),'name':nm,'type':ty,'town':town}
print(c)
print(Counter(v['world'] for v in res.values() if v['pos']).most_common(20))
json.dump(res,open('placepos.json','w'))
