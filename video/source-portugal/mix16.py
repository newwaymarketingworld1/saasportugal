import json, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt, sosfiltfilt
SR=44100; DUR=55.0; N=int(SR*DUR)
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


import soundfile as sf
v0,_=sf.read('voice44.wav'); DUR=55.0; N=int(SR*DUR); v0=np.pad(v0,(0,max(0,N-len(v0))))[:N]; v=np.stack([v0,v0],1); t=np.arange(N)/SR
def note(m): return 440*2**((m-69)/12)
BPM=100; beat=60/BPM; bar=4*beat
chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,65]]; roots=[48,45,41,43]
pad=np.zeros(N); pl=np.zeros(N); bs=np.zeros(N)
k=0
while k*bar<DUR:
    s0=int(k*bar*SR); e0=min(N,int((k+1)*bar*SR)+int(.4*SR)); tt=np.arange(e0-s0)/SR
    ev=np.minimum(1,tt/0.4)*np.minimum(1,np.maximum(0,(bar+.4-tt))/0.5); c=chords[k%4]; y=np.zeros(e0-s0)
    for m in c:
        for det in (-0.05,0.05): y+=np.sin(2*np.pi*note(m)*2**(det/12)*tt)+.25*np.sin(2*np.pi*note(m)*2*tt)
    pad[s0:e0]+=y*ev; fb=note(roots[k%4]-12); bs[s0:e0]+=np.sin(2*np.pi*fb*tt)*ev
    for j in range(8):
        ps=s0+int(j*beat/2*SR); pe=min(N,ps+int(.35*SR))
        if ps>=N: break
        m=c[[0,2,1,3,2,1,3,2][j]]+12; tp=np.arange(pe-ps)/SR
        pl[ps:pe]+=np.sin(2*np.pi*note(m)*tp)*np.exp(-tp*9)
    k+=1
K=(lambda tt:np.sin(2*np.pi*np.cumsum(120*np.exp(-tt*25)+50)/SR)*np.exp(-tt*10))(t_(0.35))
H=hp(rng.standard_normal(int(.04*SR)),8000)*np.exp(-t_(.04)*90)
kick=np.zeros(N); hat=np.zeros(N)
for i,kk in enumerate(np.arange(0,DUR,beat)):
    ii=int(kk*SR); j=min(N,ii+len(K)); kick[ii:j]+=K[:j-ii]
    jj=int((kk+beat/2)*SR)
    if jj<N: j=min(N,jj+len(H)); hat[jj:j]+=H[:j-jj]
music=lp(pad,1500)*0.02+lp(pl,3500)*0.05+lp(bs,200)*0.10+kick*0.22+hat*0.05
music*=np.clip(t/1.0,0,1)*np.clip((DUR-t)/1.0,0,1)
vm=v.mean(1) if v.ndim>1 else v
env=np.sqrt(np.maximum(lp(vm**2,6),0)); env=env/env.max(); duck=1-0.55*np.clip(env*5,0,1)
vp=np.abs(v).max()
music=music/np.abs(music).max()*vp*0.15*duck
fx=np.zeros(N)
for e in json.load(open('sfx.json')):
    s=GEN[e['type']](); i=int(e['t']*SR)
    if i>=N: continue
    j=min(N,i+len(s)); fx[i:j]+=s[:j-i]*e['g']
fx=fx/(np.abs(fx).max()+1e-9)*vp*0.3
out=v+np.stack([music+fx,music+fx],1)
out=out/np.abs(out).max()*0.95
db=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-12)
print('voice',db(vm),'music',db(music))
sf.write('final.wav',out,SR)
