import numpy as np, json
from PIL import Image, ImageDraw
d=np.load('tamriel.npz'); g=d['grid'].astype(np.float64); w=d['water']; x0,x1,y0,y1,S=[int(v) for v in d['bounds']]
T=json.load(open('tex.json'))
def col(n):
    n=n.lower()
    for k,c in [('snowrocks',(168,176,188)),('snow',(214,222,232)),('grasssnow',(190,200,196)),('frozenmarshice',(176,196,206)),('frozenmarsh',(112,122,104)),
                ('volcanic',(118,100,80)),('tundrarocks',(132,126,104)),('tundra',(150,140,96)),('fallforestleaves',(186,118,52)),('fallforestgrass',(160,124,62)),('fallforestrocks',(128,112,96)),('fallforest',(176,112,56)),
                ('pineforest',(60,88,64)),('fieldgrass',(108,126,72)),('reachmoss',(100,110,74)),('reachgrass',(118,118,78)),('reach',(132,104,82)),
                ('coastbeach',(146,138,118)),('oceanfloor',(96,100,96)),('rivermud',(92,90,72)),('riverbed',(92,90,72)),('riverbottom',(92,90,72)),
                ('rocks',(116,114,110)),('dirt',(122,104,82))]:
        if k in n: return c
    return (110,110,100)
H,W=g.shape
base=np.zeros((H,W,3))
for key,q in T.items():
    x,y=map(int,key.split(',')); gx=(x-x0)*S; gy=(y1-y)*S; h=S//2
    for quad,(oy,ox) in {'2':(0,0),'3':(0,h),'0':(h,0),'1':(h,h)}.items():
        if quad in q: base[gy+oy:gy+oy+h,gx+ox:gx+ox+h]=col(q[quad])
from scipy import ndimage
miss=(base.sum(-1)==0)
idx=ndimage.distance_transform_edt(miss,return_distances=False,return_indices=True)
base=base[idx[0],idx[1]]
P=json.load(open('placepos.json'))
pins=[(v['name'],v['type'],(v['pos'][0]/4096-x0)*S,(y1+1-v['pos'][1]/4096)*S) for v in P.values() if v['pos'] and v['world']=='Tamriel']
xs=[p[2] for p in pins]; ys=[p[3] for p in pins]; pad=40
cx0,cx1,cy0,cy1=int(max(0,min(xs)-pad)),int(min(W,max(xs)+pad)),int(max(0,min(ys)-pad)),int(min(H,max(ys)+pad))
sl=(slice(cy0,cy1),slice(cx0,cx1))
g=g[sl]; w=w[sl]; base=base[sl]
wl=np.where(np.isnan(w)|(np.abs(w)>1e9),-14000,w); water=g<wl; depth=wl-g
gy_,gx_=np.gradient(g); sh=np.clip(0.5+(-gx_-gy_)/700,0,1); q=np.round(sh*3)/3
img=base*(0.70+0.45*q[...,None])
img[water]=np.where((depth[water]<500)[:,None],[[40,66,98]],[[22,34,58]])
img=np.clip(img,0,255).astype(np.uint8)
im=Image.fromarray(img)
small=im.resize((im.width//2,im.height//2),Image.BOX).quantize(colors=32,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
small.save('skyrim_px2.png')
json.dump({'crop':[cx0,cx1,cy0,cy1],'S':S,'x0':x0,'y1':y1,'scale':0.5},open('crop.json','w'))
big=small.resize((small.width*2,small.height*2),Image.NEAREST)
dr=ImageDraw.Draw(big)
for n,t,x,y in pins:
    x-=cx0;y-=cy0; dr.rectangle([x-2,y-2,x+2,y+2],fill=(240,145,63),outline=(11,15,20))
big.save('skyrim_px2_pins.png'); print(big.size)
