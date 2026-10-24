import json, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt, sosfiltfilt
SR=44100; DUR=33.4; N=int(SR*DUR)
rng=np.random.default_rng(3)
def t_(d): return np.arange(int(SR*d))/SR
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b,o=2): return sosfilt(butter(o,[a,b],'band',fs=SR,output='sos'),x)
def env(n,a,r,shape=2):
    t=np.arange(n)/SR; e=np.where(t<a,(t/max(a,1e-4)),np.exp(-(t-a)/max(r,1e-4)*shape)); return e
def sweep_noise(d,f0,f1,f2):
    n=int(SR*d); x=rng.standard_normal(n); out=np.zeros(n); seg=512
    for i in range(0,n,seg):
        p=i/n; f=f0+(f1-f0)*(p/0.6) if p<0.6 else f1+(f2-f1)*((p-0.6)/0.4)
        f=max(80,min(16000,f)); out[i:i+seg]=bp(x[max(0,i-2048):i+seg],f*0.6,min(f*1.6,20000))[-len(x[i:i+seg]):]
    return out
def S_whoosh():
    d=.55; x=sweep_noise(d,300,4500,600); t=t_(d); e=np.sin(np.pi*np.clip(t/d,0,1))**2.2
    e=np.where(t<0.3, (t/0.3)**2.5, np.exp(-(t-0.3)*9)); return x*e*0.9
def S_zoom():
    d=.6; t=t_(d); w=S_whoosh()[:len(t)] if len(S_whoosh())>=len(t) else np.pad(S_whoosh(),(0,len(t)))[:len(t)]
    f=200+1400*(t/d)**2; ph=2*np.pi*np.cumsum(f)/SR; s=np.sin(ph)*0.15*np.where(t<.32,(t/.32)**2,np.exp(-(t-.32)*12))
    return w+s
def S_hit(g=1):
    d=.9; t=t_(d); f=90*np.exp(-t*6)+42; ph=2*np.pi*np.cumsum(f)/SR
    body=np.sin(ph)*np.exp(-t*4.5)*0.9
    click=lp(rng.standard_normal(len(t)),3500)*np.exp(-t*60)*0.6
    return (body+click)*g
def S_boom():
    d=2.2; t=t_(d); f=70*np.exp(-t*3)+35; ph=2*np.pi*np.cumsum(f)/SR
    body=np.sin(ph)*np.exp(-t*1.6)
    nz=lp(rng.standard_normal(len(t)),900)*np.exp(-t*5)*0.7
    shim=hp(rng.standard_normal(len(t)),6000)*np.exp(-t*3)*0.12
    return body+nz+shim
def S_tick(): d=.05; t=t_(d); return bp(rng.standard_normal(len(t)),2500,7000)*np.exp(-t*120)*0.35
def S_pop():
    d=.18; t=t_(d); f=500+700*(t/d); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*28)*0.45
def S_ding():
    d=1.4; t=t_(d); return (np.sin(2*np.pi*1318.5*t)+.5*np.sin(2*np.pi*1975.5*t)+.25*np.sin(2*np.pi*2637*t))*np.exp(-t*3.2)*0.22*np.minimum(1,t/.004)
def S_stamp():
    d=.5; t=t_(d); thud=lp(rng.standard_normal(len(t)),600)*np.exp(-t*30); return thud*1.2+S_hit(.6)[:len(t)]
def S_riser():
    d=.75; t=t_(d); x=sweep_noise(d,400,9000,12000); e=(t/d)**2.4
    f=180+900*(t/d)**2; tone=np.sin(2*np.pi*np.cumsum(f)/SR)*0.12
    return (x*0.7+tone)*e
def S_glitch():
    d=.3; t=t_(d); x=rng.standard_normal(len(t)); gate=(np.floor(t*60)%2)
    sq=np.sign(np.sin(2*np.pi*(220+rng.integers(0,600))*t))*0.25
    return (bp(x,800,6000)*0.6+sq)*gate*np.exp(-t*6)*0.7
def S_swipe(): d=.25; t=t_(d); return hp(rng.standard_normal(len(t)),2500)*np.sin(np.pi*t/d)**2*0.35
def S_shine():
    d=1.2; t=t_(d); y=np.zeros(len(t))
    for k,f in enumerate([2093,2637,3136,4186]):
        y+=np.sin(2*np.pi*f*t+3*np.sin(2*np.pi*6*t))*np.exp(-np.maximum(0,t-k*.06)*4)*(t>k*.06)
    return y*0.07

def S_swish():
    d=.42; x=sweep_noise(d,500,6000,1500); t=t_(d); e=np.where(t<0.24,(t/0.24)**2,np.exp(-(t-0.24)*14)); return x*e*0.7
def S_swell():
    d=.45; t=t_(d); x=sweep_noise(d,300,7000,9000); e=(t/d)**3; tone=np.sin(2*np.pi*np.cumsum(150+500*(t/d)**2)/SR)*0.1*e; return x*e*0.6+tone
def S_click():
    d=.06; t=t_(d); return (bp(rng.standard_normal(len(t)),1500,5000)*np.exp(-t*160)*0.5+np.sin(2*np.pi*900*t)*np.exp(-t*90)*0.3)
def S_msg():
    d=.35; t=t_(d); a=np.sin(2*np.pi*880*t)*np.exp(-t*18)*(t<.12); b=np.sin(2*np.pi*1320*t)*np.exp(-np.maximum(0,t-.09)*14)*(t>=.09); return (a+b)*0.25
def S_send():
    d=.3; t=t_(d); f=600+1400*(t/d); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*12)*0.25+S_swish()[:len(t)]*0.4
def S_key():
    # classic mechanical keyboard keystroke: switch click + bottom-out clack + upstroke
    d=.2; n=int(SR*d); t=np.arange(n)/SR; y=np.zeros(n)
    def damped(f,tau,a,st):
        tt=np.maximum(0,t-st); return a*np.sin(2*np.pi*f*tt)*np.exp(-tt/tau)*(t>=st)
    def nburst(st,lo,hi,tau,a):
        tt=np.maximum(0,t-st); return a*bp(rng.standard_normal(n),lo,hi)*np.exp(-tt/tau)*(t>=st)
    j=lambda: 1+0.12*(rng.random()-.5)
    # switch click
    y+=nburst(0,3000,9000,.0018,1.0)+damped(3800*j(),.004,.35,0)
    # bottom-out clack (plastic resonances + body)
    bo=.007+rng.random()*.004
    y+=nburst(bo,700,4000,.006,1.1)
    for f,tau,a in [(1150,.012,.45),(1900,.009,.35),(2900,.006,.25)]: y+=damped(f*j(),tau,a,bo)
    y+=damped(210*j(),.02,.55,bo)
    # upstroke
    up=.075+rng.random()*.04
    y+=nburst(up,1200,6000,.004,.45)+damped(2300*j(),.006,.18,up)
    if rng.random()<0.12:  # occasional spacebar thock
        y+=damped(140,.035,.6,bo)+nburst(bo,300,1500,.015,.5)
    return y*(0.8+0.35*rng.random())

def S_air():
    d=.6; x=sweep_noise(d,250,2600,500); t=t_(d); e=np.where(t<.32,(t/.32)**2.2,np.exp(-(t-.32)*9)); return lp(x,4000)*e*0.55
def S_shimmer():
    d=1.6; t=t_(d); y=np.zeros(len(t))
    for k,f in enumerate([1568,2093,2637,3136,3951]):
        st=k*.05; y+=np.sin(2*np.pi*f*t+2*np.sin(2*np.pi*5*t))*np.exp(-np.maximum(0,t-st)*3)*(t>st)
    sw=sweep_noise(d,3000,9000,6000)*np.exp(-t*3)*0.25
    return (y*0.06+sw*0.5)*np.minimum(1,t/.02)
def S_impact():
    d=1.8; t=t_(d); f=58*np.exp(-t*2.5)+38; body=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*2.6)
    nz=lp(rng.standard_normal(len(t)),700)*np.exp(-t*9)*0.5; return (body+nz)*0.9
def S_chime():
    d=1.6; t=t_(d); return (np.sin(2*np.pi*1046.5*t)+.6*np.sin(2*np.pi*1568*t)+.3*np.sin(2*np.pi*2093*t))*np.exp(-t*2.6)*0.2*np.minimum(1,t/.005)
def S_notif():
    d=.6; t=t_(d); a=np.sin(2*np.pi*1318.5*t)*np.exp(-t*14)*(t<.2); b=np.sin(2*np.pi*1760*t)*np.exp(-np.maximum(0,t-.12)*9)*(t>=.12); return (a+b)*0.22
def S_tap():
    d=.12; t=t_(d); return np.sin(2*np.pi*np.cumsum(420+300*np.exp(-t*40))/SR)*np.exp(-t*35)*0.35
def S_snap():
    d=.12; t=t_(d); n=hp(rng.standard_normal(len(t)),3000)*np.exp(-t*90)*0.7
    thump=np.sin(2*np.pi*np.cumsum(180*np.exp(-t*30)+60)/SR)*np.exp(-t*40)*0.6
    return n+thump
def S_heart():
    d=.7; t=t_(d); y=np.zeros(len(t))
    for st,a in ((0,1.0),(.2,.7)):
        tt=np.maximum(0,t-st); y+=np.sin(2*np.pi*np.cumsum(55*np.exp(-tt*8)+38)/SR)*np.exp(-tt*14)*(t>=st)*a
    return lp(y,300)*1.3

# ---------------- extra sound effects for this ad
from scipy.signal import lfilter
def S_rewind():
    # tape rewind: chattering, rising squeal
    d=.5; t=t_(d); n=len(t)
    f=900+5200*(t/d)**1.4; ph=2*np.pi*np.cumsum(f)/SR
    sq=np.sign(np.sin(ph))*0.12+np.sin(ph*2.01)*0.08
    chat=0.5+0.5*np.sign(np.sin(2*np.pi*np.cumsum(28+70*(t/d))/SR))
    nz=bp(rng.standard_normal(n),1800,9000)*0.5
    e=np.minimum(1,t/.05)*np.minimum(1,(d-t)/.06)
    return lp((sq+nz)*chat*e,11000)*0.8
def S_cash():
    # "cha-ching": drawer clack + two bright bell hits
    d=1.3; t=t_(d); y=np.zeros(len(t))
    y+=bp(rng.standard_normal(len(t)),1500,7000)*np.exp(-t*50)*0.5
    for st,a in ((0.07,.8),(0.19,1.0)):
        tt=np.maximum(0,t-st); on=t>=st
        for f,dec,g in ((2093,5,1),(3322,7,.6),(4699,9,.45),(6272,12,.25),(2637,6,.5)):
            y+=np.sin(2*np.pi*f*tt)*np.exp(-tt*dec)*g*a*on*.18
    return y
def S_thud():
    d=.5; t=t_(d); return np.sin(2*np.pi*np.cumsum(110*np.exp(-t*18)+45)/SR)*np.exp(-t*9)*0.9+lp(rng.standard_normal(len(t)),500)*np.exp(-t*40)*0.4
def S_clunk():
    d=.35; t=t_(d); body=np.sin(2*np.pi*np.cumsum(160*np.exp(-t*25)+70)/SR)*np.exp(-t*16)
    clk=bp(rng.standard_normal(len(t)),2000,8000)*np.exp(-t*140)
    ring=np.sin(2*np.pi*1250*t)*np.exp(-t*30)*0.15
    return body*0.8+clk*0.7+ring
GEN={'heart':S_heart,'snap':S_snap,'air':S_air,'shimmer':S_shimmer,'impact':S_impact,'chime':S_chime,'notif':S_notif,'tap':S_tap,'swish':S_swish,'swell':S_swell,'click':S_click,'msg':S_msg,'send':S_send,'key':S_key,'whoosh':S_whoosh,'zoom':S_zoom,'hit':lambda:S_hit(1),'boom':S_boom,'tick':S_tick,'pop':S_pop,'ding':S_ding,'stamp':S_stamp,'riser':S_riser,'glitch':S_glitch,'swipe':S_swipe,'shine':S_shine,
     'rewind':S_rewind,'cash':S_cash,'thud':S_thud,'clunk':S_clunk}

# ---------------- music: Khaleeji-flavoured beat on the Hijaz scale
def note(m): return 440*2**((m-69)/12)
BPM=100; beat=60/BPM; T0=4.17          # grid locked to the drop on "تماماً"
def ks(m,d,bright=.6,decay=.996):
    """Karplus-Strong pluck (oud-ish)."""
    f=note(m); Np=int(round(SR/f)); n=int(SR*d)
    x=np.zeros(n); burst=lp(rng.standard_normal(Np),2000+6000*bright); x[:Np]=burst
    a=np.zeros(Np+2); a[0]=1; a[Np]=-decay/2; a[Np+1]=-decay/2
    y=lfilter([1],a,x); y=hp(y,90)
    return y*np.minimum(1,np.arange(n)/(SR*.002))*np.exp(-np.arange(n)/SR*1.2)
music=np.zeros(N); t=np.arange(N)/SR
def add(buf,sig,at,g=1):
    i=int(at*SR)
    if i>=N or i+len(sig)<=0: return
    s=sig; 
    if i<0: s=s[-i:]; i=0
    j=min(N,i+len(s)); buf[i:j]+=s[:j-i]*g
# sections: (start,end,level of drums)
def drums_on(x): return (x>=T0 and x<14.55) or (x>=15.0 and x<20.75) or (x>=21.09 and x<30.3)
K=lambda: (lambda tt: np.sin(2*np.pi*np.cumsum(140*np.exp(-tt*30)+48)/SR)*np.exp(-tt*7)*1.0+lp(rng.standard_normal(len(tt)),3000)*np.exp(-tt*120)*0.4)(t_(0.5))
B808=lambda m,d: (lambda tt: np.tanh(2.2*np.sin(2*np.pi*np.cumsum(note(m)*(1+.5*np.exp(-tt*25)))/SR))*np.exp(-tt*1.6)*np.minimum(1,tt/.004))(t_(d))
CLAP=lambda: (lambda tt: bp(rng.standard_normal(len(tt)),900,5000)*(np.exp(-tt*30)+.6*np.exp(-np.maximum(0,tt-.012)*40)*(tt>.012)+.5*np.exp(-np.maximum(0,tt-.024)*35)*(tt>.024))*0.8)(t_(.3))
HAT=lambda o=False: (lambda tt: hp(rng.standard_normal(len(tt)),7500)*np.exp(-tt*(18 if o else 90))*0.35)(t_(.25 if o else .06))
DOUM=lambda: (lambda tt: np.sin(2*np.pi*np.cumsum(95*np.exp(-tt*10)+70)/SR)*np.exp(-tt*9)*0.9)(t_(.4))
TAK=lambda: (lambda tt: (bp(rng.standard_normal(len(tt)),2500,8000)*np.exp(-tt*70)*0.7+np.sin(2*np.pi*620*tt)*np.exp(-tt*45)*0.35))(t_(.12))
kick=np.zeros(N); snare=np.zeros(N); hats=np.zeros(N); perc=np.zeros(N); bass=np.zeros(N); oud=np.zeros(N); pad=np.zeros(N)
# hijaz on D: D Eb F# G A Bb C D
H=[62,63,66,67,69,70,72,74]
MOTIF=[(0,7,1),(1,6,.5),(1.5,5,.5),(2,4,1),(3,3,.5),(3.5,2,.5),(4,1,1.5),(5.5,2,.5),(6,4,1),(7,3,.5),(7.5,2,.25),(7.75,1,.25)]  # (beat, degree, len)
MOTIF2=[(0,4,.5),(.5,5,.5),(1,6,1),(2,7,.75),(2.75,6,.25),(3,5,.5),(3.5,4,.5),(4,3,1),(5,2,.5),(5.5,1,.5),(6,0,1.5),(7.5,1,.5)]
first=int(np.floor((0-T0)/beat))
for k in range(first, int((DUR-T0)/beat)+2):
    x=T0+k*beat; bi=k%8; bar2=(k//8)%2
    if x<-.1 or x>DUR: continue
    if drums_on(x):
        if bi in (0,3,6) or (bi==5 and bar2): add(kick,K(),x)
        if bi in (2,6): add(snare,CLAP(),x)
        for h in range(2):
            xx=x+h*beat/2
            if drums_on(xx): add(hats,HAT(bi==7 and h==1),xx,1 if h==0 else .7)
        if bi==7 and bar2:
            for r in range(4): add(hats,HAT(),x+beat/2+r*beat/8,.5)
        # maqsum-ish darbuka: D T . T D . T .
        pat={0:'D',1:'T',3:'T',4:'D',6:'T'}
        for e8 in range(2):
            pos=(bi%4)*2+e8
            if pos in pat:
                add(perc,DOUM() if pat[pos]=='D' else TAK(),x+e8*beat/2,.8 if pat[pos]=='D' else .55)
        if bi in (0,4): 
            root=[50,50,51,48][(k//8)%4]
            add(bass,B808(root,beat*3.6),x,.9)
    # melodic pluck runs through (also in the intro)
    if bi==0:
        M=MOTIF if (k//8)%2==0 else MOTIF2
        for (b,dg,ln) in M:
            xx=x+b*beat
            if xx>=30.3: continue
            add(oud,ks(H[dg],ln*beat+.6,bright=.55),xx,0.5)
            if dg in (0,4,7): add(oud,ks(H[dg]-12,ln*beat+.6,bright=.3),xx,0.25)
# drone pad (D + A), always
for m,g in ((38,1),(45,.7),(50,.5),(57,.3)):
    pad+=np.sin(2*np.pi*note(m)*t+0.3*np.sin(2*np.pi*.2*t))*g
pad=hp(lp(pad,700),60)*0.06
oud=lp(oud,6500)
# intro: pluck filtered (darker) and no drums
intro=np.clip((t-0)/0.3,0,1)
music=kick*0.55+snare*0.30+hats*0.16+perc*0.32+bass*0.26+oud*0.55+pad
# tape stop before the flip (3.35 -> 3.68) then silence until the drop
def tapestop(x,a,b):
    i,j=int(a*SR),int(b*SR); seg=x[i:j].copy(); L=len(seg); u=np.arange(L)/L
    pos=np.cumsum(1-u)  # rate falls 1 -> 0
    x[i:j]=np.interp(pos,np.arange(L),seg)*(1-u)**.5
    return x
music=tapestop(music,3.36,3.70); music[int(3.70*SR):int(4.15*SR)]=0
music[int(14.55*SR):int(15.0*SR)]*=np.linspace(1,.25,int(15.0*SR)-int(14.55*SR))
music=tapestop(music,20.78,21.06); music[int(21.06*SR):int(21.09*SR)]=0
# end: let the last bar ring, then fade
fade=np.ones(N); a=int(30.3*SR); fade[a:]=np.linspace(1,0,N-a)**1.5; music*=fade
music[int(30.3*SR):]+=(lp(pad,500)*1.6)[int(30.3*SR):]*np.linspace(1,0,N-int(30.3*SR))
add(music,S_boom()*0.8,30.55)

# ---------------- mix
import soundfile as sf
v0,_=sf.read('voice44.wav'); v0=np.pad(v0,(0,max(0,N-len(v0))))[:N]
v0=hp(v0,70); v0=v0/np.abs(v0).max()*0.9
envv=np.sqrt(np.maximum(lp(v0**2,8),0)); envv/=envv.max()
duck=1-0.62*np.clip(envv*6,0,1)
music=hp(music,38,4); music=music/np.abs(music).max()
fx=np.zeros(N)
for e in json.load(open('sfx.json')):
    s=GEN[e['type']](); i=int(e['t']*SR)
    if i>=N: continue
    if i<0: s=s[-i:]; i=0
    j=min(N,i+len(s)); fx[i:j]+=s[:j-i]*e['g']
fx=fx/(np.abs(fx).max()+1e-9)
mus=music*0.30*duck
fxs=fx*0.42
# slight stereo: music wide via short delay, fx centre
L=v0+mus+fxs; R=v0+np.roll(mus,int(.011*SR))+fxs
out=np.stack([L,R],1)
out=np.tanh(out*1.25)/np.tanh(1.25)
out=out/np.abs(out).max()*0.97
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-12)
print('voice',round(db(v0),1),'music',round(db(mus),1),'fx',round(db(fxs),1))
sf.write('final.wav',out,SR)
