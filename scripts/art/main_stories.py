# The three Main stories scenes (Bob, 27 Oct 2026; Dave approved the MainStoriesHard board). 320x80 pixel layers, shown at 4x.
# Run from the repo root: python3 scripts/art/main_stories.py
import numpy as np, math, random
from PIL import Image
W,H=320,80
rng=np.random.default_rng(7)
def blank(): return np.zeros((H,W,4),np.uint8)
def save(a,n): Image.fromarray(a,'RGBA').save(n)
def ridge(base,amp,rough,seed,smooth=6):
    r=np.random.default_rng(seed); y=np.cumsum(r.normal(0,rough,W+40)); y=np.convolve(y,np.ones(smooth)/smooth,'same')[20:W+20]
    y=(y-y.min())/(np.ptp(y)+1e-9)
    return (base-amp*y).astype(int)
def fill_below(a,top,col,dither=None):
    for x in range(W):
        t=max(0,min(H,top[x])); a[t:,x]=col
def sky_grad(top,bot):
    a=blank()
    for y in range(H):
        t=y/(H-1); c=[int(top[i]*(1-t)+bot[i]*t) for i in range(3)]
        # banded (pixel) gradient
        a[y,:]=c+[255]
    q=(a[...,:3]//6)*6; a[...,:3]=q; return a
def stars(a,n,col,seed):
    r=np.random.default_rng(seed)
    for _ in range(n):
        x,y=r.integers(0,W),r.integers(0,H//2); a[y,x]=col
def peak(top,cx,w,h,base):
    for x in range(W):
        d=abs(x-cx)/w
        if d<1: top[x]=min(top[x],int(base-h*(1-d)**1.15))
    return top
def sprite(a,rows,x0,y0,col):
    for j,row in enumerate(rows):
        for i,ch in enumerate(row):
            if ch=='#' and 0<=y0+j<H and 0<=x0+i<W: a[y0+j,x0+i]=col
DRAGON_OLD=[
"..............................##.....",
"......###....................####....",
".......#####...............#######...",
"........#######.........##########...",
".........#########...###########.....",
"..........###########.#########......",
"...........######################....",
"..##.....############################",
"...######################.....####...",
"......############..###.......##.....",
"........######.......##..............",
"..........##.........#...............",
]
DRAGON=[
"....................................................#.........",
"...................................................##.........",
"##...............................................####.........",
".###............................................#####.........",
"..####.........................................######.........",
"...#####......................................#######.........",
"....######...................................########.........",
".....#######...............................#########..........",
"......########............................##########..........",
".......#########.........................##########...........",
"........##########......................##########............",
".........###########....#####..........##########.............",
"..........############.#######........##########..............",
"...........######################...###########...............",
"............##################################......###.......",
".............#####################################..#####......",
"..............########################################.###....",
"................######################################...##....",
"...................####....#######.....################.......",
"..................####.....######.........######...###........",
".................###.......####...........####.....##.........",
"................##.........##.............###.................",
"...............#...........#..............##..................",
]
BAT=["#.#","###",".#."]
# ---------- 1: Become the Dragonborn
s=sky_grad((10,14,30),(70,40,40)); stars(s,60,(220,228,240,255),1)
# fire glow on horizon
for y in range(50,80):
    for x in range(W):
        k=max(0,1-abs(x-200)/140)*(y-50)/30
        s[y,x,:3]=np.clip(s[y,x,:3]+np.array([120,50,10])*k*0.8,0,255)
save(s,'public/quests/stories/main-quest/sky.png')
far=blank(); t=ridge(62,26,2.2,3,4); t=peak(t,214,64,58,66); fill_below(far,t,[78,86,110,255])
# snow cap on the big peak
for x in range(W):
    for y in range(t[x],min(H,t[x]+5)):
        if abs(x-210)<40 and y<40: far[y,x]=[214,222,232,255]
save(far,'public/quests/stories/main-quest/far.png')
near=blank(); t=ridge(78,18,2.4,5,3); fill_below(near,t,[22,28,40,255]); save(near,'public/quests/stories/main-quest/near.png')
fx=blank(); sprite(fx,DRAGON,96,4,[6,6,10,255]); save(fx,'public/quests/stories/main-quest/dragon.png')
# ---------- 2: Dawnguard
s=sky_grad((40,6,12),(120,20,24)); stars(s,25,(240,180,170,255),2)
# eclipse sun
cx,cy,r=176,26,15
for y in range(H):
    for x in range(W):
        d=math.hypot(x-cx,y-cy)
        if d<r+3 and d>=r: s[y,x,:3]=[255,190,120]
        if d<r: s[y,x,:3]=[14,4,6]
save(s,'public/quests/stories/dawnguard/sky.png')
far=blank(); t=np.full(W,70); 
# castle on a rock, left
for x in range(222,306):
    t[x]=min(t[x],int(60-8*math.sin((x-222)/84*math.pi)))
fill_below(far,t,[30,10,16,255])
def rect(a,x0,y0,w,h,col): a[max(0,y0):y0+h,max(0,x0):x0+w]=col
C=[24,6,10,255]
for (x,w,h) in [(240,6,26),(250,10,20),(262,5,30),(270,12,18),(284,6,24)]:
    rect(far,x,60-h,w,h,C); rect(far,x+w//2,60-h-4,1,4,C)
# windows
for (x,y) in [(252,46),(272,48),(264,38),(286,44)]: far[y,x]=[255,170,90,255]
save(far,'public/quests/stories/dawnguard/far.png')
near=blank(); t=ridge(78,6,0.8,9); fill_below(near,t,[14,4,8,255])
# sea glints
for x in range(0,W,7):
    y=72+(x*13)%5; near[y,x]=[150,40,40,255]
save(near,'public/quests/stories/dawnguard/near.png')
fx=blank()
r=np.random.default_rng(4)
for _ in range(9): sprite(fx,BAT,int(r.integers(130,316)),int(r.integers(6,40)),[10,2,4,255])
save(fx,'public/quests/stories/dawnguard/bats.png')
# ---------- 3: Dragonborn (Solstheim / Apocrypha)
s=sky_grad((20,26,22),(70,84,60)); 
for _ in range(220):
    x,y=rng.integers(0,W),rng.integers(0,H); s[y,x,:3]=np.clip(s[y,x,:3]+18,0,255)  # ash
save(s,'public/quests/stories/dragonborn/sky.png')
far=blank(); t=ridge(74,8,1.0,21,4); t=peak(t,282,52,44,74)
for x in range(W):
    if abs(x-282)<5: t[x]=max(t[x],34)
fill_below(far,t,[54,50,46,255])
for y in range(32,37):
    for x in range(277,288):
        if far[y,x,3]: far[y,x]=[235,96,40,255] if (x+y)%2 else [255,160,70,255]
# smoke plume
r=np.random.default_rng(3)
for k in range(260):
    y=int(r.integers(0,32)); spread=(32-y)*0.45+2
    x=int(282- (32-y)*0.9 + r.normal(0,spread))
    if 0<=x<W: far[y,x]=[86,86,80,int(120+r.integers(0,100))]
save(far,'public/quests/stories/dragonborn/far.png')
near=blank(); t=ridge(77,9,1.4,11,3); fill_below(near,t,[18,22,18,255])
# standing stone: tapering monolith with a carved ring
for y in range(36,72):
    hw=3+ (y-36)//9
    near[y,186-hw:186+hw]=[14,16,14,255]
for (yy,xx) in [(44,185),(44,186),(45,184),(45,187),(46,185),(46,186)]: near[yy,xx]=[120,200,120,255]
# Miraak's temple: stepped ziggurat
for i,(w,y0) in enumerate([(34,66),(26,58),(18,50),(10,42)]):
    near[y0:y0+8,228-w//2:228+w//2]=[14,16,14,255]
near[36:42,226:230]=[14,16,14,255]
save(near,'public/quests/stories/dragonborn/near.png')
fx=blank()
for (x0,ph,top) in [(150,0,30),(250,1.7,34),(306,3.1,24)]:
    for y in range(H-1,top,-1):
        th=max(1,int((y-top)/7))
        x=int(x0+10*math.sin(y/8+ph)*(1-(y-top)/(H-top))+ (y-top)*0)
        fx[y,max(0,x):min(W,x+th)]=[36,64,42,255]
        if y%4==0 and th>2: fx[y,min(W-1,x+th-1)]=[150,210,130,255]
    fx[top:top+2,x0+int(10*math.sin(top/8+ph))-1:x0+int(10*math.sin(top/8+ph))+2]=[150,210,130,255]
save(fx,'public/quests/stories/dragonborn/tentacles.png')
print('ok')
