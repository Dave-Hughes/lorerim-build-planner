import math, random, sys
from PIL import Image
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'icons')]
from scene import W,H,hexc,layer,noise1d,dither,sky,stars,sprite
import pixels as P

def mountains(seed, base, amp, cols, snowline, sharp=1.0, oct=None):
    """cols: (lit, mid, shadow, snowlit, snowshadow). Ridge from noise; faces shaded by slope."""
    im=layer(); px=im.load()
    n=noise1d(seed,W+2,oct or ((48,1),(19,.55),(8,.28),(3,.1)))
    top=[int(base-(n[x]**sharp)*amp) for x in range(W+2)]
    for x in range(W):
        slope=top[x+1]-top[x-1] if x>0 else 0
        for y in range(max(0,top[x]),H):
            d=y-top[x]
            lit = slope>0  # rising to the right -> face looks left, toward the moon
            c = cols[0] if lit and d<10 else (cols[2] if not lit and d<14 else cols[1])
            if y < snowline + (n[x]*6) and d < 9+int(n[x]*6):
                c = cols[3] if lit or dither(x,y,.35) else cols[4]
            px[x,y]=hexc(c)
        # ridge highlight
        if 0<=top[x]<H and slope>0: px[x,top[x]]=hexc(cols[3] if top[x]<snowline+4 else cols[0])
    return im

def moon(cx,cy,r):
    im=layer(); px=im.load()
    for y in range(cy-r*3,cy+r*3):
        for x in range(cx-r*3,cx+r*3):
            if not(0<=x<W and 0<=y<H): continue
            d=math.hypot(x-cx,y-cy)
            if d<=r:
                c='#f4f7f9' if (x-cx)+(y-cy) < -r*0.3 else '#cddcf6'
                if d>r-1.2: c='#c9d2da'
                px[x,y]=hexc(c)
            elif d<r*2.6 and dither(x,y,(1-(d-r)/(r*1.6))*0.45):
                px[x,y]=(205,220,246,70)
    # a few craters
    for (dx,dy) in ((2,-1),(-1,2),(1,3)): 
        if 0<=cx+dx<W: px[cx+dx,cy+dy]=hexc('#c9d2da')
    return im

def aurora():
    im=layer(); px=im.load()
    n=noise1d(17,W+80,((70,1),(26,.6),(9,.25)))
    for x in range(W):
        mid=int(26+n[x]*20)
        h=int(10+n[x+30]*22)
        for k in range(-h, int(h*0.4)):
            y=mid+k
            if not(0<=y<H): continue
            f=1-abs(k)/h
            if dither(x,y,f*0.62):
                c=hexc('#86b47f') if k>-h*0.3 else hexc('#5f9e8f')
                if f>0.8 and (x//3)%2: c=hexc('#b8e0a8')
                px[x,y]=(c[0],c[1],c[2],int(110+120*f))
    return im

def pine(px, x, by, h, dark, light):
    for k in range(h):
        w=int((k/h)*h*0.36)+ (1 if k%3==2 else 0)
        for dx in range(-w,w+1):
            X=x+dx; Y=by-h+k
            if 0<=X<W and 0<=Y<H: px[X,Y]=hexc(light if dx<0 and k%3!=2 else dark)
    for y in range(by, min(H,by+2)):
        if 0<=x<W: px[x,y]=hexc('#1a130c')

def forest(seed, base, dark, light, density, hmin, hmax, fill):
    im=layer(); px=im.load(); rnd=random.Random(seed)
    for x in range(W):
        for y in range(base,H): px[x,y]=hexc(fill)
    x=-3
    while x<W+3:
        if rnd.random()<density: pine(px,x,base+rnd.randint(-1,2),rnd.randint(hmin,hmax),dark,light)
        x+=rnd.randint(2,5)
    return im

def ground(top):
    im=layer(); px=im.load()
    n=noise1d(51,W,((36,1),(11,.4),(3,.15)))
    for x in range(W):
        t=top-int(n[x]*6)+int(max(0,140-x)*0.05)
        for y in range(max(0,t),H):
            c='#0c1117'
            if y-t<1: c='#3a4656'
            elif y-t<3 and dither(x,y,.5): c='#1c2532'
            px[x,y]=hexc(c)
    return im

def campfire(frame, cx, by):
    im=layer(); px=im.load()
    # glow
    for y in range(by-34,by+6):
        for x in range(cx-40,cx+41):
            if not(0<=x<W and 0<=y<H): continue
            d=math.hypot((x-cx)*0.8,(y-by+3)*1.2)
            if d<36 and dither(x,y,(1-d/36)*(0.55 if frame%2==0 else 0.5)):
                px[x,y]=(240,145,63,60)
    # logs
    for i in range(-5,6):
        px[cx+i,by]=hexc('#5c4b2e'); px[cx+i,by-1]=hexc('#8a7347' if abs(i)<4 else '#5c4b2e')
    px[cx-6,by]=hexc('#06080b'); px[cx+6,by]=hexc('#06080b')
    # stones
    for i in (-7,-4,4,7): px[cx+i,by+1]=hexc('#566273'); px[cx+i+1,by+1]=hexc('#3a4656')
    # flames: three frames
    shapes=[
      ["...o...","..ooo..",".ooyoo.",".oyWyo.","ooyWyoo","oyyWyyo"],
      ["..o....","..oo...",".ooyo..",".oyyoo.","ooyWyoo","oyyWyyo"],
      ["....o..","...oo..","..oyoo.",".ooyyo.","ooyWyoo","oyyWyyo"],
    ][frame%3]
    for r,row in enumerate(shapes):
        for c,ch in enumerate(row):
            if ch!='.':
                col={'o':'#f0913f','y':'#ecc07a','W':'#f4f7f9'}[ch]
                px[cx-3+c, by-2-len(shapes)+r+1]=hexc(col)
    # sparks
    rnd=random.Random(frame)
    for _ in range(3):
        sx=cx+rnd.randint(-4,4); sy=by-9-rnd.randint(0,10); px[sx,sy]=hexc('#ecc07a')
    return im

def build(frame=0, tapps_rows=None, out='hero'):
    parts=[sky(), stars(7), aurora(), moon(236,24,6),
      mountains(5,92,58,('#3a4a63','#2a364b','#222c3e','#c9d2da','#8e9bab'),62,1.3),
      mountains(13,104,40,('#253046','#1c2536','#171f2d','#8e9bab','#566273'),78,1.2),
      forest(21,120,'#0f1916','#1c2b24',0.55,7,15,'#0b120f'),
      forest(33,132,'#0a110e','#15221c',0.7,12,22,'#090d0b'),
      ground(134)]
    img=Image.new('RGBA',(W,H))
    for p in parts: img=Image.alpha_composite(img,p)
    img=Image.alpha_composite(img,campfire(frame,182,141))
    t=sprite(tapps_rows or P.TAPPS_WRITING_0_ROWS)
    img.alpha_composite(t,(150,141-29))
    img.save(out+'.png'); img.resize((W*4,H*4),Image.NEAREST).save(out+'4.png')
    return parts
