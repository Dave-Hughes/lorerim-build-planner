import struct, zlib, sys, json, numpy as np
buf=open(sys.argv[1],'rb').read()
COMP=0x00040000
def subrecs(d):
    o=0; res=[]; big=None
    while o+6<=len(d):
        t=d[o:o+4]; sz=struct.unpack_from('<H',d,o+4)[0]; o+=6
        if t==b'XXXX': big=struct.unpack_from('<I',d,o)[0]; o+=sz; continue
        if big is not None: sz=big; big=None
        res.append((t,d[o:o+sz])); o+=sz
    return res
hsz=struct.unpack_from('<I',buf,4)[0]
ltex={}; cells={}; quads={}
cur_world=None; cur_cell=None
def walk(o,end):
    global cur_world,cur_cell
    while o<end:
        t=buf[o:o+4]
        if t==b'GRUP':
            gsz,lab,gtype=struct.unpack_from('<IIi',buf,o+4)
            if gtype==1: cur_world=lab
            if gtype in (6,8,9): cur_cell=lab
            walk(o+24,o+gsz); o+=gsz; continue
        sz,flags,fid=struct.unpack_from('<III',buf,o+4)
        if t in (b'LTEX',b'CELL',b'LAND'):
            data=buf[o+24:o+24+sz]
            if flags&COMP: data=zlib.decompress(data[4:])
            subs=subrecs(data)
            if t==b'LTEX':
                ltex[fid]=next((v.rstrip(b'\0').decode('latin1') for s,v in subs if s==b'EDID'),'')
            elif t==b'CELL':
                for s,v in subs:
                    if s==b'XCLC': cells[fid]=(cur_world,)+struct.unpack_from('<ii',v)
            else:
                q={}
                for s,v in subs:
                    if s==b'BTXT':
                        tid,quad=struct.unpack_from('<IB',v); q[quad]=tid
                quads[cur_cell]=q
        o+=24+sz
walk(24+hsz,len(buf))
out={}
for c,q in quads.items():
    if c in cells and cells[c][0]==0x3C:
        _,x,y=cells[c]
        out['%d,%d'%(x,y)]={str(k):ltex.get(v,'%08X'%v) for k,v in q.items()}
json.dump(out,open('tex.json','w'))
from collections import Counter
cnt=Counter(n for q in out.values() for n in q.values())
print(len(out)); print(cnt.most_common(60))
