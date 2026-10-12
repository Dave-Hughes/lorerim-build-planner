import os,struct,zlib,sys
ROOT=os.path.expanduser('~/mnt/LoreRim')
def plugin_paths():
    mods=[l.strip()[1:] for l in open(ROOT+'/profiles/Ultra/modlist.txt',encoding='utf-8',errors='ignore') if l.startswith('+')]
    m={}
    for d in reversed(mods): # lowest priority first, overwritten by higher
        p=ROOT+'/mods/'+d
        try:
            for f in os.listdir(p):
                if f.lower().endswith(('.esp','.esm','.esl')): m[f.lower()]=p+'/'+f
        except: pass
    sd=ROOT+'/Stock Game/Data'
    for f in os.listdir(sd):
        if f.lower().endswith(('.esp','.esm','.esl')) and f.lower() not in m: m[f.lower()]=sd+'/'+f
    return m
def load_order():
    lo=['Skyrim.esm','Update.esm','Dawnguard.esm','HearthFires.esm','Dragonborn.esm']
    for l in open(ROOT+'/profiles/Ultra/plugins.txt',encoding='utf-8',errors='ignore'):
        if l.startswith('*'): lo.append(l.strip()[1:])
    return lo
def subrecs(data):
    i=0;out=[];big=None
    while i<len(data):
        t=data[i:i+4];sz=struct.unpack_from('<H',data,i+4)[0];i+=6
        if t==b'XXXX': big=struct.unpack_from('<I',data,i)[0];i+=4;continue
        if big is not None: sz=big;big=None
        out.append((t.decode('latin1'),data[i:i+sz]));i+=sz
    return out
def rec_data(buf,off):
    t,sz,fl,fid=struct.unpack_from('<4sIII',buf,off)
    d=buf[off+24:off+24+sz]
    if fl&0x40000: d=zlib.decompress(d[4:])
    return t.decode('latin1'),fl,fid,d
def header(buf):
    t,fl,fid,d=rec_data(buf,0)
    return [s[1].rstrip(b'\0').decode('latin1') for s in subrecs(d) if s[0]=='MAST']
def iter_group(buf,want):
    off=struct.unpack_from('<I',buf,4)[0]+24
    while off<len(buf):
        t,sz,label=struct.unpack_from('<4sI4s',buf,off)
        if t==b'GRUP' and label==want.encode():
            end=off+sz;o=off+24
            while o<end:
                tt,s2=struct.unpack_from('<4sI',buf,o)
                if tt==b'GRUP': o+=24;continue  # descend
                yield o; o+=24+s2
            return
        off+=sz if t==b'GRUP' else 24+sz
def resolve(fid,masters,name):
    idx=fid>>24
    return (masters[idx] if idx<len(masters) else name, fid&0xFFFFFF)

def localized_strings(plugin_path, name):
    """Loose Strings files for a localized plugin, if any."""
    base = os.path.splitext(name)[0]
    out = {}
    for d in [os.path.dirname(plugin_path) + '/Strings', ROOT + '/Stock Game/Data/Strings']:
        for kind in ('STRINGS', 'DLSTRINGS', 'ILSTRINGS'):
            p = f'{d}/{base}_english.{kind}'
            if not os.path.exists(p): continue
            b = open(p, 'rb').read()
            n, size = struct.unpack_from('<II', b, 0)
            table = 8 + n * 8
            for i in range(n):
                sid, off = struct.unpack_from('<II', b, 8 + i * 8)
                o = table + off
                if kind == 'STRINGS':
                    e = b.index(b'\0', o); s = b[o:e]
                else:
                    ln = struct.unpack_from('<I', b, o)[0]; s = b[o + 4:o + 4 + ln].rstrip(b'\0')
                out[sid] = s.decode('utf-8', 'replace')
    return out
