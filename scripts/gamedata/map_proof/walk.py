import struct, zlib, sys, json, numpy as np
path=sys.argv[1]; out=sys.argv[2]
buf=open(path,'rb').read()
COMP=0x00040000
def subrecs(d):
    o=0; res=[]; big=None
    while o+6<=len(d):
        t=d[o:o+4]; sz=struct.unpack_from('<H',d,o+4)[0]; o+=6
        if t==b'XXXX': big=struct.unpack_from('<I',d,o)[0]; o+=sz; continue
        if big is not None: sz=big; big=None
        res.append((t,d[o:o+sz])); o+=sz
    return res
# header
assert buf[:4]==b'TES4'
hsz=struct.unpack_from('<I',buf,4)[0]
o=24+hsz
worlds={}; cells={}; lands={}; markers={}
world_dnam={}
cur_world=None; cur_cell=None
def walk(o,end,stack):
    global cur_world,cur_cell
    while o<end:
        t=buf[o:o+4]
        if t==b'GRUP':
            gsz,label,gtype=struct.unpack_from('<I4si',buf,o+4)
            lab=struct.unpack_from('<I',label)[0]
            if gtype==1: cur_world=lab
            if gtype in (6,8,9): cur_cell=lab
            walk(o+24,o+gsz,stack+[(gtype,lab)])
            o+=gsz; continue
        sz,flags,fid=struct.unpack_from('<III',buf,o+4)
        data=buf[o+24:o+24+sz]
        rt=t
        if rt in (b'WRLD',b'CELL',b'LAND',b'REFR'):
            if flags&COMP:
                data=zlib.decompress(data[4:])
            subs=subrecs(data)
            if rt==b'WRLD':
                for s,v in subs:
                    if s==b'DNAM' and len(v)>=8: world_dnam[fid]=struct.unpack_from('<ff',v)
                    if s==b'EDID': worlds[fid]=v.rstrip(b'\0').decode('latin1')
            elif rt==b'CELL':
                c={'w':cur_world}
                for s,v in subs:
                    if s==b'XCLC': c['x'],c['y']=struct.unpack_from('<ii',v)
                    if s==b'XCLW': c['water']=struct.unpack_from('<f',v)[0]
                    if s==b'DATA': c['flags']=v[0]
                cells[fid]=c
            elif rt==b'LAND':
                for s,v in subs:
                    if s==b'VHGT':
                        off=struct.unpack_from('<f',v)[0]
                        g=np.frombuffer(v[4:4+33*33],dtype=np.int8).astype(np.int32).reshape(33,33)
                        # row starts accumulate down column 0; each row accumulates across
                        col0=np.cumsum(g[:,0])
                        h=np.cumsum(np.concatenate([col0[:,None],g[:,1:]],axis=1),axis=1)
                        lands[cur_cell]=((h+off)*8).astype(np.float32)
            elif rt==b'REFR':
                if any(s==b'XMRK' for s,_ in subs):
                    pos=next((struct.unpack_from('<fff',v) for s,v in subs if s==b'DATA' and len(v)>=12),None)
                    mt=next((v[0] for s,v in subs if s==b'TNAM' and v),None)
                    markers['%06X'%(fid&0xFFFFFF) if fid>>24==0 else '%08X'%fid]={'w':cur_world,'pos':pos,'type':mt}
        o+=24+sz
walk(o,len(buf),[])
TAM=0x3C
print('worlds',len(worlds),'cells',len(cells),'lands',len(lands),'markers',len(markers))
print('tamriel dnam',world_dnam.get(TAM))
# grid for Tamriel
xs=[c['x'] for k,c in cells.items() if c.get('w')==TAM and 'x' in c]
ys=[c['y'] for k,c in cells.items() if c.get('w')==TAM and 'x' in c]
print('tamriel cells',len(xs),min(xs),max(xs),min(ys),max(ys))
S=8
x0,x1,y0,y1=min(xs),max(xs),min(ys),max(ys)
W=(x1-x0+1)*S; H=(y1-y0+1)*S
grid=np.full((H,W),np.nan,dtype=np.float32); water=np.full((H,W),np.nan,dtype=np.float32)
n=0
for k,c in cells.items():
    if c.get('w')!=TAM or 'x' not in c: continue
    if k in lands:
        h=lands[k][:32:4,:32:4]  # 8x8 samples
        gx=(c['x']-x0)*S; gy=(y1-c['y'])*S
        grid[gy:gy+S,gx:gx+S]=h[::-1,:]
        n+=1
    if 'water' in c:
        gx=(c['x']-x0)*S; gy=(y1-c['y'])*S
        water[gy:gy+S,gx:gx+S]=c['water']
print('cells with land',n)
np.savez_compressed(out+'/tamriel.npz',grid=grid,water=water,bounds=np.array([x0,x1,y0,y1,S]))
json.dump({'markers':markers,'worlds':{('%08X'%k):v for k,v in worlds.items()},'dnam':{('%08X'%k):v for k,v in world_dnam.items()}},open(out+'/markers.json','w'))
