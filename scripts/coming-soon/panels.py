import math, random, sys
from PIL import Image
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, '..', 'icons')]
import scene as S0
import pixels as P
PW,PH=160,100
def hexc(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))+(255,)
BAYER=S0.BAYER
def dither(x,y,f): return f*16 > BAYER[y%4][x%4]
def noise(seed,n,oct=((30,1),(12,.45),(5,.18))): return S0.noise1d(seed,n,oct)
def canvas(): return Image.new('RGBA',(PW,PH),(0,0,0,0))
def grad(im, cols, y0=0, y1=None):
    px=im.load(); y1=y1 or PH
    for y in range(y0,y1):
        f=(y-y0)/max(1,(y1-y0))*(len(cols)-1); i=int(f); fr=f-i
        for x in range(PW):
            px[x,y]=hexc(cols[min(i+1,len(cols)-1)] if dither(x,y,fr) else cols[i])
def ridge(im, seed, base, amp, col, lit=None, oct=None):
    px=im.load(); n=noise(seed,PW+4,oct or ((34,1),(13,.45),(5,.15)))
    top=[int(base-n[x]*amp) for x in range(PW+4)]
    for x in range(PW):
        sl=top[x+2]-top[max(0,x-2)]
        for y in range(max(0,top[x]),PH):
            px[x,y]=hexc(lit if (lit and sl>2 and y-top[x]<4) else col)
def pine(im,x,by,h,dark,light):
    px=im.load()
    for k in range(h):
        w=int((k/h)*h*0.36)+(1 if k%3==2 else 0)
        for dx in range(-w,w+1):
            X=x+dx;Y=by-h+k
            if 0<=X<PW and 0<=Y<PH: px[X,Y]=hexc(light if dx<0 and k%3!=2 else dark)
def forest(im,seed,base,dark,light,dens,hmin,hmax,fill):
    px=im.load(); rnd=random.Random(seed)
    for x in range(PW):
        for y in range(base,PH): px[x,y]=hexc(fill)
    x=-2
    while x<PW+2:
        if rnd.random()<dens: pine(im,x,base+rnd.randint(-1,2),rnd.randint(hmin,hmax),dark,light)
        x+=rnd.randint(2,5)
def ground(im,top,col,edge,seed=3):
    px=im.load(); n=noise(seed,PW)
    for x in range(PW):
        t=top-int(n[x]*4)
        for y in range(max(0,t),PH): px[x,y]=hexc(edge if y-t<1 else col)
def put(im,rows,x,y):
    g=P.Sprite(rows).g; px=im.load()
    for j,r in enumerate(g):
        for i,c in enumerate(r):
            if c!='.' and 0<=x+i<PW and 0<=y+j<PH: px[x+i,y+j]=hexc(P.PALETTE[c])
def put_flipped(im,rows,x,y):
    put(im,[r[::-1] for r in rows],x,y)
def rect(im,x0,y0,x1,y1,c):
    px=im.load()
    for y in range(y0,y1+1):
        for x in range(x0,x1+1):
            if 0<=x<PW and 0<=y<PH: px[x,y]=hexc(c)
def glow(im,cx,cy,r,col,alpha):
    px=im.load()
    for y in range(PH):
        for x in range(PW):
            d=math.hypot(x-cx,(y-cy)*1.2)
            for rr,a in ((r,alpha),(r*0.66,int(alpha*1.4)),(r*0.36,int(alpha*1.9))):
                if d<rr:
                    o=px[x,y]; a2=a/255
                    px[x,y]=(int(o[0]*(1-a2)+col[0]*a2),int(o[1]*(1-a2)+col[1]*a2),int(o[2]*(1-a2)+col[2]*a2),255)
                    break

# 1. Level 1: dawn on the road, a signpost, Tapps pointing the way
def p1(frame):
    im=canvas(); grad(im,['#1a2539','#2a3450','#4a4058','#7a5060','#c4652a','#f0913f'],0,64)
    rect(im,0,64,PW-1,PH-1,'#0b0f14')
    # sun
    glow(im,118,62,26,(240,145,63),40)
    ridge(im,4,66,22,'#2a2d44','#3a3d58')
    ridge(im,9,76,14,'#1b1f30')
    ground(im,82,'#24301f','#3e5230',5)
    # road
    px=im.load()
    for y in range(83,PH):
        w=int(6+(y-83)*1.6); cx=70+int((y-83)*0.4)
        for x in range(cx-w,cx+w):
            if 0<=x<PW: px[x,y]=hexc('#5c4b2e' if (x+y)%5 else '#8a7347')
    # signpost
    rect(im,108,64,109,86,'#5c4b2e'); rect(im,110,66,124,69,'#b9a173'); rect(im,110,66,124,66,'#e8d3a4'); rect(im,124,67,125,68,'#b9a173')
    rect(im,94,72,107,75,'#b9a173'); rect(im,94,72,107,72,'#e8d3a4'); rect(im,93,73,93,74,'#b9a173')
    for (x,y) in ((112,67),(115,67),(118,67),(121,67),(97,73),(100,73),(103,73)): px[x,y]=hexc('#5c4b2e')
    # Tapps, keen, pointing down the road (he bobs on frame 1)
    put_flipped(im, P.TAPPS_POINT_ROWS, 50, 59 - (frame % 2))
    return im

# 2. Level 3: night forest, eyes in the dark
def p2(frame):
    im=canvas(); grad(im,['#06080b','#0b1018','#111827','#141d2d'],0,PH)
    forest(im,7,70,'#0d1512','#16231d',0.6,14,28,'#0a0f0d')
    forest(im,13,86,'#090d0b','#111a16',0.8,18,34,'#070a09')
    ground(im,90,'#06080b','#1c2532',8)
    px=im.load()
    # the sabre cat: a hulking shape among the trees, two ember eyes, a long tooth
    for y in range(56,90):
        for x in range(96,150):
            dx=(x-122)/26; dy=(y-74)/17
            if dx*dx+dy*dy<1: px[x,y]=hexc('#0c1014')
    for (x,y) in ((110,58),(111,57),(134,58),(133,57),(112,56),(132,56)): px[x,y]=hexc('#0c1014')
    eye='#f0913f' if frame!=2 else '#0c1014'
    for ex in (114,128):
        rect(im,ex,66,ex+2,67,eye); px[ex+1,66]=hexc('#ecc07a') if frame!=2 else hexc('#0c1014')
    rect(im,118,74,118,79,'#c9d2da'); rect(im,124,74,124,79,'#c9d2da')
    # Tapps with a torch-lit edge: the lost pose, the question mark bobbing
    glow(im,52,78,22,(240,145,63),26)
    put(im, getattr(P,f'TAPPS_LOST_{frame%2}_ROWS'), 36, 60)
    return im

# 3. Level 10: reading other players' guides by candlelight
def p3(frame):
    im=canvas(); rect(im,0,0,PW-1,PH-1,'#141b23')
    px=im.load()
    for y in range(PH):  # plank wall
        for x in range(PW):
            if x%16==0 or (x%16==8 and y%30<1): px[x,y]=hexc('#0e1319')
            elif (x+ (y//30)*5)%16<2: px[x,y]=hexc('#18202a')
    # window with moon
    rect(im,18,14,44,40,'#5c4b2e'); rect(im,20,16,42,38,'#0b1018'); rect(im,31,16,31,38,'#5c4b2e'); rect(im,20,27,42,27,'#5c4b2e')
    rect(im,36,20,39,23,'#cddcf6'); px[36,20]=hexc('#f4f7f9')
    # shelf with books
    rect(im,108,22,150,23,'#5c4b2e')
    cols=['#86391b','#4f6fae','#8a7347','#566273','#9c4a3e','#3e5230','#b9a173']
    x=110
    for i,c in enumerate(cols):
        h=7+(i*3)%5; rect(im,x,22-h,x+3,21,c); rect(im,x,22-h,x,21,'#06080b'); x+=5
    # desk
    rect(im,40,80,150,83,'#8a7347'); rect(im,40,80,150,80,'#b9a173'); rect(im,40,84,150,PH-1,'#5c4b2e')
    # candle
    glow(im,122,66,40,(240,145,63),22+(frame%2)*4)
    rect(im,120,70,123,79,'#e8d3a4'); rect(im,120,70,120,79,'#f4f7f9')
    fl=[(121,66),(122,66),(121,67),(122,67),(121,68),(122,68),(121,65)] if frame%2==0 else [(121,66),(122,66),(122,65),(121,67),(122,67),(121,68),(122,68)]
    for (x,y) in fl: px[x,y]=hexc('#f0913f')
    px[121,67]=hexc('#ecc07a'); px[122,68]=hexc('#ecc07a')
    # other players' guides: an open book, an unrolled scroll, and two stacks
    rect(im,86,74,112,79,'#e8d3a4'); rect(im,99,74,99,79,'#b9a173')
    for yy in (75,77):
        rect(im,88,yy,96,yy,'#8a7347'); rect(im,102,yy,110,yy,'#8a7347')
    rect(im,58,77,82,79,'#e8d3a4'); rect(im,58,76,59,79,'#b9a173'); rect(im,81,76,82,79,'#b9a173')
    for xx in range(61,80,3): px[xx,78]=hexc('#5c4b2e')
    stacks=((132,['#86391b','#4f6fae','#8a7347','#3e5230']),(140,['#566273','#9c4a3e','#b9a173']))
    for sx,cs in stacks:
        y=79
        for i,c in enumerate(cs):
            w=7-(i%2); rect(im,sx-(i%2),y-2,sx-(i%2)+w,y,c); rect(im,sx-(i%2),y-2,sx-(i%2)+w,y-2,'#06080b'); y-=3
    put(im, getattr(P,f'TAPPS_WRITING_{min(frame,3)}_ROWS'), 52, 51)
    return im

# 4. Level 50: a notice board full of guides, Tapps cheering beside it
def p4(frame):
    im=canvas(); rect(im,0,0,PW-1,PH-1,'#2a1d14')
    px=im.load()
    for y in range(PH):
        for x in range(PW):
            if y%12==0: px[x,y]=hexc('#1f150e')
    # a lamp's warm light
    glow(im,98,44,58,(240,145,63),18+(frame%2)*4)
    # the board: a dark frame, cork, pages pinned all over it
    rect(im,56,12,152,80,'#3a2a1a'); rect(im,59,15,149,77,'#8a6a44')
    for y in range(15,78):
        for x in range(59,150):
            if (x*7+y*13)%11==0: px[x,y]=hexc('#7a5c3a')
    rnd=random.Random(5)
    icons=['#f0913f','#4f6fae','#86b47f','#d07a6a','#cddcf6','#b9a173','#9c4a3e','#ecd28c']
    pages=[(63,19),(77,21),(91,18),(105,20),(119,19),(133,21),(65,45),(80,47),(108,46),(123,44),(136,47),(70,60),(117,61)]
    for i,(x,y) in enumerate(pages):
        w,h=11,13
        rect(im,x+1,y+1,x+w+1,y+h+1,'#3a2a1a')              # shadow
        rect(im,x,y,x+w,y+h,'#e8d3a4' if i%3 else '#f4f7f9')
        rect(im,x+2,y+2,x+4,y+4,icons[i%len(icons)])          # a little icon
        for ly in (y+7,y+9,y+11): rect(im,x+2,ly,x+w-2-rnd.randint(0,3),ly,'#8a7347')
        px[x+w//2,y]=hexc('#d07a6a' if i%2 else '#f0913f')  # the pin
    # the newest one, bigger, with the planner's star: Tapps's own
    x,y=92,40; rect(im,x+1,y+1,x+16,y+21,'#3a2a1a'); rect(im,x,y,x+15,y+20,'#f4f7f9')
    for (dx,dy) in ((7,3),(7,4),(6,5),(7,5),(8,5),(5,6),(6,6),(7,6),(8,6),(9,6),(6,7),(7,7),(8,7),(7,8),(7,9)):
        px[x+dx,y+dy]=hexc('#f0913f')
    for ly in (y+12,y+14,y+16,y+18): rect(im,x+2,ly,x+13-(ly%3),ly,'#8a7347')
    px[x+7,y]=hexc('#86391b')
    if frame%2: px[x+3,y+2]=hexc('#ffe3a3'); px[x+12,y+9]=hexc('#ffe3a3')   # a glint
    # the floor and a bench
    rect(im,0,88,PW-1,PH-1,'#1f150e'); rect(im,0,88,PW-1,88,'#3a2a1a')
    put(im, getattr(P,f'TAPPS_CHEERS_{[0,1,0,2][frame%4]}_ROWS'), 20, 59)
    return im
