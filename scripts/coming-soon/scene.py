import math, random, sys
from PIL import Image
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'icons')]
import pixels as P
W,H=288,150
def hexc(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))+(255,)
def layer(): return Image.new('RGBA',(W,H),(0,0,0,0))
def noise1d(seed, n, octaves=((40,1),(17,.45),(7,.2),(3,.08))):
    rnd=random.Random(seed); out=[0.0]*n
    for per,amp in octaves:
        pts=[rnd.random() for _ in range(n//per+3)]
        for x in range(n):
            i=x//per; t=(x%per)/per; t=t*t*(3-2*t)
            out[x]+=amp*(pts[i]*(1-t)+pts[i+1]*t)
    return out
BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
def dither(x,y,f): return f*16 > BAYER[y%4][x%4]
# --- sky: banded night gradient with ordered dither
def sky():
    im=layer(); px=im.load()
    bands=[hexc(c) for c in ('#070a0f','#0b1018','#0f1622','#141d2d','#1a2539','#212e45')]
    for y in range(H):
        f=min(1, y/(H*0.78))*(len(bands)-1); i=int(f); fr=f-i
        for x in range(W):
            c=bands[min(i+1,len(bands)-1)] if dither(x,y,fr) else bands[i]
            px[x,y]=c
    return im
def stars(seed=3):
    im=layer(); px=im.load(); rnd=random.Random(seed)
    for _ in range(140):
        x=rnd.randrange(W); y=rnd.randrange(int(H*.62))
        px[x,y]=hexc(rnd.choice(('#f4f7f9','#cddcf6','#ecd28c','#8e9bab','#8e9bab')))
    for _ in range(10):  # bright crosses
        x=rnd.randrange(4,W-4); y=rnd.randrange(4,int(H*.45))
        c=hexc('#f4f7f9'); px[x,y]=c
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)): px[x+dx,y+dy]=hexc('#8e9bab')
    return im
def aurora():
    im=layer(); px=im.load()
    n1=noise1d(11,W+60,((60,1),(23,.5),(9,.2)))
    cols=[hexc(c) for c in ('#5f9e8f','#86b47f','#7fb8a6')]
    for x in range(W):
        top=int(18+ n1[x]*26); length=int(14+n1[x+20]*26)
        for k in range(length):
            y=top+k
            if y>=H: break
            fade=1-k/length
            if dither(x,y,fade*0.55):
                a=int(255*(0.35+0.4*fade)); c=cols[(x//7+k//6)%3]
                px[x,y]=(c[0],c[1],c[2],a)
    return im
def ridge(seed, base, amp, col, snow=None, snowdepth=0, oct=None):
    im=layer(); px=im.load()
    n=noise1d(seed,W,oct) if oct else noise1d(seed,W)
    c=hexc(col)
    for x in range(W):
        top=int(base-n[x]*amp)
        for y in range(max(0,top),H):
            px[x,y]=c
        if snow:
            for y in range(max(0,top), min(H, top+snowdepth)):
                if (y-top) < snowdepth*(0.5+0.5*n[(x+5)%W]) : px[x,y]=hexc(snow)
    return im
def peak(cx, by, hw, hh, col, snow, shade):
    im=layer(); px=im.load()
    for y in range(by-hh, H):
        t=(y-(by-hh))/hh
        half=int(hw*min(1,t)) if t<1 else hw+int((t-1)*hw*0.8)
        for x in range(cx-half, cx+half+1):
            if 0<=x<W and 0<=y<H:
                px[x,y]=hexc(shade if x>cx+ (y%3==0) else col)
                if t<0.42 and (x<cx+2 or (x+y)%3) : px[x,y]=hexc(snow if x<=cx else '#8e9bab')
    return im
def pines(seed, base, col, col2, density=0.55, hmin=6, hmax=14):
    im=layer(); px=im.load(); rnd=random.Random(seed)
    x=0
    while x<W:
        if rnd.random()<density:
            h=rnd.randint(hmin,hmax); by=base+rnd.randint(-2,2)
            for k in range(h):
                w=max(0,int((k/h)*h*0.32))
                for dx in range(-w,w+1):
                    X=x+dx; Y=by-h+k
                    if 0<=X<W and 0<=Y<H: px[X,Y]=hexc(col2 if dx>0 else col)
            for y in range(by, H):
                if 0<=x<W: px[x,y]=hexc(col)
            x+=rnd.randint(2,4)
        else: x+=rnd.randint(1,3)
    # fill below
    for x in range(W):
        for y in range(base+1,H): px[x,y]=hexc(col)
    return im
def rock(col, col2, top):
    im=layer(); px=im.load()
    n=noise1d(51,W,((30,1),(9,.4),(3,.15)))
    for x in range(W):
        t=top - int(n[x]*8) + int(max(0,(x-150))*0.18)
        for y in range(max(0,t),H):
            px[x,y]=hexc(col2 if (y-t)<2 else col)
    return im
def sprite(rows, scale=1):
    g=P.Sprite(rows).g; h=len(g); w=len(g[0])
    im=Image.new('RGBA',(w,h),(0,0,0,0)); px=im.load()
    for y in range(h):
        for x in range(w):
            c=g[y][x]
            if c!='.': px[x,y]=hexc(P.PALETTE[c])
    return im
