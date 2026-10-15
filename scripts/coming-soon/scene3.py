import math, random, sys
from PIL import Image
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'icons')]
from scene import W,H,hexc,layer,noise1d,dither,sky,stars,sprite
from scene2 import moon, forest, ground
import pixels as P

def mountains(seed, base, amp, body, lit, shade, snowlit=None, snowshade=None, cap=0, oct=None, sharp=1.25):
    im=layer(); px=im.load()
    n=noise1d(seed,W+2,oct or ((52,1),(21,.5),(9,.22),(4,.08)))
    top=[int(base-(n[x]**sharp)*amp) for x in range(W+2)]
    peakline=min(top)
    for x in range(W):
        sl=sum(top[min(W+1,x+k)]-top[max(0,x-k)] for k in (1,2,3))
        for y in range(max(0,top[x]),H):
            d=y-top[x]
            c=body
            if sl>3 and d<6: c=lit
            elif sl<-3 and d<9: c=shade
            if snowlit and y < peakline+cap and d < cap*0.6+ (3 if sl>0 else 0):
                c=snowlit if sl>=0 else snowshade
            px[x,y]=hexc(c)
    return im

def glow(cx,cy,radii=(30,20,11), alphas=(26,34,44), col=(240,145,63)):
    im=layer(); px=im.load()
    for y in range(H):
        for x in range(W):
            d=math.hypot((x-cx)*0.85,(y-cy)*1.25)
            a=0
            for r,al in zip(radii,alphas):
                if d<r: a=al
            if a: px[x,y]=(col[0],col[1],col[2],a)
    return im

def aurora(seed=17, shift=0):
    im=layer(); px=im.load()
    n=noise1d(seed,W+120,((80,1),(31,.55),(11,.2)))
    for x in range(W):
        xs=x+shift
        bot=int(30+n[xs]*12+5*math.sin(xs/19))
        h=int(14+n[xs+40]*16)
        for k in range(h):
            y=bot-k
            if not(0<=y<H): continue
            f=1-(k/h)
            ray=0.55+0.45*math.sin(xs*0.9+n[xs]*6)
            a=int((18+70*f)*ray)
            c=(134,180,127) if k<h*0.45 else (95,158,143)
            if k<2: c=(184,224,168)
            px[x,y]=(c[0],c[1],c[2],a)
    return im

def campfire(frame, cx, by):
    im=layer(); px=im.load()
    for i in range(-5,6):
        px[cx+i,by]=hexc('#5c4b2e'); px[cx+i,by-1]=hexc('#8a7347' if abs(i)<4 else '#5c4b2e')
    for i in (-7,-6,6,7): px[cx+i,by]=hexc('#566273'); px[cx+i,by+1]=hexc('#3a4656')
    shapes=[
      ["...o...","..oyo..",".ooyoo.",".oyWyo.","ooyWyoo","oyyWyyo"],
      ["..o....","..oo...",".oyyo..",".oyWyo.","ooyWyoo","oyyWyyo"],
      ["....o..","...oo..","..oyyo.",".oyWyo.","ooyWyoo","oyyWyyo"],
    ][frame%3]
    for r,row in enumerate(shapes):
        for c,ch in enumerate(row):
            if ch!='.':
                px[cx-3+c, by-1-len(shapes)+r]=hexc({'o':'#f0913f','y':'#ecc07a','W':'#f4f7f9'}[ch])
    rnd=random.Random(frame*7+1)
    for _ in range(2):
        px[cx+rnd.randint(-3,3), by-9-rnd.randint(0,8)]=hexc('#ecc07a')
    return im

def compose(frame=0, rows=None, shift=0):
    parts=[sky(), stars(7), aurora(shift=shift), moon(240,22,6),
      mountains(5,100,44,'#26324a','#3a4a63','#1d2638','#c9d2da','#8e9bab',cap=14),
      mountains(13,112,26,'#19212f','#232e42','#141b27',oct=((60,1),(24,.45),(10,.15))),
      forest(21,122,'#0f1916','#1c2b24',0.55,7,14,'#0b120f'),
      forest(33,133,'#0a110e','#15221c',0.72,11,20,'#090d0b'),
      ground(135), glow(182,138,radii=(19,12,6),alphas=(22,30,40))]
    img=Image.new('RGBA',(W,H))
    for p in parts: img=Image.alpha_composite(img,p)
    img=Image.alpha_composite(img,campfire(frame,182,141))
    img.alpha_composite(sprite(rows or P.TAPPS_WRITING_0_ROWS),(148,141-29))
    return img
