import json, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt, sosfiltfilt
SR=44100; DUR=53.0; N=int(SR*DUR)
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
GEN={'heart':S_heart,'snap':S_snap,'air':S_air,'shimmer':S_shimmer,'impact':S_impact,'chime':S_chime,'notif':S_notif,'tap':S_tap,'swish':S_swish,'swell':S_swell,'click':S_click,'msg':S_msg,'send':S_send,'key':S_key,'whoosh':S_whoosh,'zoom':S_zoom,'hit':lambda:S_hit(1),'boom':S_boom,'tick':S_tick,'pop':S_pop,'ding':S_ding,'stamp':S_stamp,'riser':S_riser,'glitch':S_glitch,'swipe':S_swipe,'shine':S_shine}
fx=np.zeros(N); keys=np.zeros(N)
for e in json.load(open('sfx.json')):
    s=GEN[e['type']](); g=e['g']; i=int(e['t']*SR)
    if (e['type']=='key' and i<0) or i>=N: continue
    if e['type']=='key':
        j=min(N,i+len(s)); keys[i:j]+=s[:j-i]; continue
    if e['type']=='hit': g=0.55+0.35*min(g,1.4)
    if i<0: s=s[-i:]; i=0
    j=min(N,i+len(s)); fx[i:j]+=s[:j-i]*g

# ---------------- music
t=np.arange(N)/SR
def note(m): return 440*2**((m-69)/12)
def seg(a,b,fa=.3,fb=.4): return np.clip((t-a)/fa,0,1)*np.clip((b-t)/fb,0,1)
# Part A: suspense drone (D minor), 0 - 23.1, silent hole 18.62-20.0
drone=np.zeros(N)
for m,g in ((38,1),(45,.6),(50,.5),(53,.35),(57,.22)):
    f=note(m); drone+=g*(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*2*f*t+1))*(1+.25*np.sin(2*np.pi*.13*t*(1+m%5)))
drone=lp(drone,700)*0.095
envA=seg(0,23.1,.6,.05)*np.where(t<18.62,1.0,np.clip((t-20.0)/1.2,0,1))
# rising tension 20-23
envA=envA*(1+np.clip((t-20)/3.0,0,1)*0.8)
tick=np.zeros(N)
# Part B: groove (Dm Bb F C), 100 bpm, from 23.08
BPM=100; beat=60/BPM; T0=23.08
chords=[[62,65,69],[58,62,65],[60,65,69],[60,64,67]]; roots=[38,34,41,36]
bar=4*beat; pad=np.zeros(N); bass=np.zeros(N)
nb=int((DUR-T0)/bar)+2
for k in range(nb):
    c=chords[k%4]; s=int((T0+k*bar)*SR); e=min(N,int((T0+(k+1)*bar)*SR)+int(.3*SR))
    if s>=N: break
    tt=np.arange(e-s)/SR; ev=np.minimum(1,tt/0.25)*np.minimum(1,np.maximum(0,(bar+.3-tt))/0.4); y=np.zeros(e-s)
    for m in c+[c[0]-12]:
        for det in (-0.07,0.07):
            f=note(m)*2**(det/12)
            for h in range(1,6): y+=np.sin(2*np.pi*f*h*tt+h)/h*(0.5**(h-1))
    pad[s:e]+=y*ev; fb=note(roots[k%4]); bass[s:e]+=(np.sin(2*np.pi*fb*tt)+0.35*np.sin(2*np.pi*2*fb*tt))*ev
pad=lp(pad,2000)*0.03; bass=lp(bass,240)*0.24
K=(lambda tt:np.sin(2*np.pi*np.cumsum(140*np.exp(-tt*28)+46)/SR)*np.exp(-tt*8))(t_(0.5))
H=hp(rng.standard_normal(int(.06*SR)),7000)*np.exp(-t_(.06)*70)
CL=hp(rng.standard_normal(int(.12*SR)),1200)*np.exp(-t_(.12)*35)
kick=np.zeros(N); hat=np.zeros(N); clap=np.zeros(N); duck=np.ones(N)
def onB(x): return (x>=T0)&(x<50.6)&~((x>=45.33)&(x<47.1))
bt=np.arange(T0,DUR,beat)
for i,k in enumerate(bt):
    ii=int(k*SR)
    if onB(k):
        j=min(N,ii+len(K)); kick[ii:j]+=K[:j-ii]
        d=np.arange(min(N,ii+int(.35*SR))-ii)/SR; duck[ii:ii+len(d)]=np.minimum(duck[ii:ii+len(d)],0.35+0.65*(d/.35)**1.5)
        if i%2==1: j=min(N,ii+len(CL)); clap[ii:j]+=CL[:j-ii]
    for off in (beat/2,):
        hh=k+off; jj=int(hh*SR)
        if onB(hh) and jj<N: j=min(N,jj+len(H)); hat[jj:j]+=H[:j-jj]
brkB=np.where((t>=45.33)&(t<47.1),0.4,1.0)
envB=np.clip((t-T0)/0.05,0,1)*np.clip((DUR-t)/2.4,0,1)
bass=bass*(0.55+0.45*(np.sin(2*np.pi*t*(BPM/60)*2)>0))
music=drone*envA+(pad*brkB+bass*duck*brkB)*duck**0.5*envB+(kick*0.46+hat*0.12+clap*0.10)*envB
# ---------------- voice
v,vsr=sf.read('voice.mp3') if False else (None,None)
v,_=sf.read('voice44.wav'); v=np.pad(v,(0,max(0,N-len(v))))[:N]
v=v/ (np.sqrt(np.mean(v[v!=0]**2))+1e-9)*0.12   # loud-ish rms
# sidechain music under voice
venv=np.sqrt(np.maximum(lp(v**2,8),0))
venv=venv/venv.max(); vd=1-0.45*np.clip(venv*4,0,1)
keys=keys/ (np.abs(keys).max()+1e-9)*np.abs(v).max()*0.24
mix=v + music*vd*0.24 + fx*0.28 + keys
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-12)
print('voice',db(v[v!=0]),'music',db(music*vd*0.24),'music_drop',db((music*vd*0.24)[int(10*SR):int(20*SR)]),'fx',db(fx*0.28),'fxpeak',20*np.log10(np.abs(fx*0.28).max()),'voicepeak',20*np.log10(np.abs(v).max()))
stereo=np.stack([mix,mix],1)
# widen music slightly
stereo[:,0]+=lp(music*vd,6000)*0.02; stereo[:,1]-=lp(music*vd,6000)*0.02
pk=np.abs(stereo).max(); print('peak',pk)
stereo=np.tanh(stereo/pk*1.25)/np.tanh(1.25)*0.89
sf.write('mix.wav',stereo,SR)
# stems for a no-music version
nm=v+fx*0.28+keys; nm=np.stack([nm,nm],1); nm=nm/np.abs(nm).max()*0.89; sf.write('mix_nomusic.wav',nm,SR)
