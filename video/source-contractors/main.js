const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DUR=26.5, SFX=[], hooks=[];
const sfx=(t,type,g=1)=>SFX.push({t:+t.toFixed(3),type,g});
let seed=21; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)); const eo=x=>1-Math.pow(1-x,4);
const WT=WORDS.map(w=>w[1]); WT[0]=0.0;
const logo=(sel,col,part)=>{const el=$(sel);if(part==='sym')el.innerHTML=LOGO.symbol.map(d=>`<path fill="${col}" d="${d}"/>`).join('');else if(part==='wm')el.innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');else el.innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`};
logo('#lsym','#FFC400','sym');logo('#lwm','#fff','wm');logo('#ltg','#fff','tg');logo('#chN','#000','sym');

// ================= CAPTIONS (word-synced, typed, top of frame)
const G=[
 [190,150,'*CONTRACTORS.*'],
 [170,96,'WE\'LL BUILD YOUR|WEBSITE{2} *FIRST.*'],
 [170,96,'YOU PAY *NOTHING*|UNTIL YOU _LOVE+IT._{2}'],
 [170,100,'REAL WEBSITES|FOR REAL'],
 [200,150,'*ROOFERS,*'],
 [200,150,'*REMODELERS,*'],
 [200,150,'*PAINTERS*'],
 [170,96,'AND *GENERAL*|*CONTRACTORS.*'],
 [170,96,'HOMEOWNERS{2} CHECK|YOUR WEBSITE{2}'],
 [170,110,'BEFORE THEY|_CALL._'],
 [190,140,'NO _WEBSITE?_{2}'],
 [170,104,'THEY CALL|THE *NEXT+GUY.*{2}'],
 [190,140,'WE *BUILD* IT.'],
 [190,130,'YOU *REVIEW* IT.'],
 [190,150,'_LOVE+IT?_{2}'],
 [190,150,'PAY *ONCE.*'],
 [170,110,'NO MONTHLY|_FEES._'],
 [170,104,'TAP THE|*BUTTON*'],
 [150,84,'AND TALK TO|NEWWAY{1} MARKETING|*WORLD.*'],
 [190,170,'_RIGHT+NOW!_{2}'],
];
const GROUPS=[];let wi=0;
G.forEach(([y,fs,txt,o={}])=>{const el=document.createElement('div');el.className='cap';el.style.top=y+'px';el.style.fontSize=fs+'px';const units=[];
  txt.split('|').forEach(line=>{const ln=document.createElement('span');ln.className='ln';
    line.split(' ').forEach(tok=>{let n=1,m;if((m=tok.match(/\{(\d+)\}$/))){n=+m[1];tok=tok.replace(/\{\d+\}$/,'')}
      let kind='';if(/^\*.*\*$/.test(tok)){kind='yel';tok=tok.slice(1,-1)}else if(/^_.*_$/.test(tok)){kind='mk';tok=tok.slice(1,-1)}
      const text=tok.replace(/\+/g,' ');const u=document.createElement('span');u.className='cw'+(kind==='yel'?' yel':'');
      u.innerHTML=(kind==='mk'?'<i class="hl"></i>':'')+'<span class="on"></span><i class="crt"></i><span class="off"></span>'+(kind==='mk'?`<span class="bk2">${text}</span>`:'');
      ln.appendChild(u);ln.appendChild(document.createTextNode(' '));units.push({el:u,text,kind,w0:wi,w1:wi+n-1,t:WT[wi]});wi+=n});
    el.appendChild(ln)});$('#caps').appendChild(el);GROUPS.push({el,units,t:units[0].t})});
if(wi!==WT.length)console.error('caption word mismatch',wi,WT.length);
GROUPS.forEach((g,gi)=>{g.end=gi<GROUPS.length-1?GROUPS[gi+1].t:DUR;
  g.units.forEach((u,ui)=>{const next=ui<g.units.length-1?g.units[ui+1].t:Math.min(g.end,(WT[u.w1+1]||DUR));const L=u.text.length;const span=(u.w1>u.w0?(WT[u.w1]-u.t)+.2:0);
    u.dur=clamp(Math.max(span,Math.min(L*.035,(next-u.t)*.8)),.07,1.0);if(u.w0===0)u.dur=.3;u.tend=u.t+u.dur;
    let k=0;for(let c=0;c<L;c++)if(/[A-Z0-9$]/i.test(u.text[c]))sfx(u.t+u.dur*c/L,'key',k++?.7+.25*rnd():.9);
    if(u.kind==='mk')sfx(u.tend+.02,'swipe',.25)})});
hooks.push(t=>{GROUPS.forEach(g=>{const vis=t>=g.t-.001&&t<g.end;g.el.style.visibility=vis?'visible':'hidden';if(!vis)return;
  const xp=clamp((t-(g.end-.14))/.14);g.el.style.opacity=1-xp;g.el.style.transform=`translateY(${-24*eo(xp)}px) scale(${1-.04*xp})`;g.el.style.filter=xp>0?`blur(${8*xp}px)`:'none';
  let last=null;g.units.forEach(u=>{if(t>=u.t)last=u});
  g.units.forEach(u=>{const L=u.text.length;const p=clamp((t-u.t)/u.dur);const n=t<u.t?0:Math.max(1,Math.round(p*L));
    u.el.children[u.kind==='mk'?1:0].textContent=u.text.slice(0,n);u.el.querySelector('.off').textContent=u.text.slice(n);
    const crt=u.el.querySelector('.crt');crt.style.display=(u===last&&(p<1||Math.floor((t-u.tend)/.27)%2===1)&&t<g.end-.2)?'inline-block':'none';
    const sp=clamp((t-u.t)/.22);const pop=(u.kind?1.12:1.04);u.el.style.transform=t<u.t?'none':`translateY(${(1-eo(sp))*14}px) scale(${1+(pop-1)*(1-eo(sp))})`;
    if(u.kind==='mk'){const q=eo(clamp((t-u.tend)/.22));u.el.querySelector('.hl').style.transform=`scaleX(${q})`;u.el.querySelector('.bk2').style.clipPath=`inset(0 ${(1-q)*100}% 0 0)`}})})});
function fitCaps(){GROUPS.forEach(g=>{const lines=[...g.el.querySelectorAll('.ln')];g.units.forEach(u=>{u.el.querySelector('.off').textContent=u.text});
  const mw=Math.max(...lines.map(l=>l.scrollWidth));if(mw>960)g.el.style.fontSize=(parseFloat(g.el.style.fontSize)*960/mw)+'px'})}

// ================= VIDEO FRAMES inside the browser window
const VS={vRoof:[[0,DUR,'v2',10.6]],vRem:[[7.3,8.4,'v1',1.2]],vPaint:[[8.1,9.3,'v2',3.6]]};const VMAX={v1:408,v2:502};
hooks.push(t=>{for(const id in VS){const el=document.getElementById(id);let seg=VS[id].find(s=>t>=s[0]&&t<s[1]);if(!seg)seg=t<VS[id][0][0]?VS[id][0]:VS[id][VS[id].length-1];
  const fr=Math.min(VMAX[seg[2]],Math.max(1,Math.round((clamp(t,seg[0],seg[1])-seg[0]+seg[3])*30)+1));const src=`${seg[2]}/f${String(fr).padStart(4,'0')}.jpg`;if(el.getAttribute('src')!==src)el.setAttribute('src',src)}});
VS.vRoof=[[6.7,7.7,'v2',10.6]];
// burst particles
$('#burst').innerHTML=[...Array(14)].map((_,i)=>`<i class="bp" style="position:absolute;left:-9px;top:-9px;width:18px;height:18px;border-radius:50%;background:${i%3?'#FFC400':'#fff'}"></i>`).join('');

// ================= TIMELINE
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
const BW=$('#bw');const bw=(txt,t)=>{tl.call(()=>{},[],t);hooks.push(tt=>{});BWT.push([t,txt])};const BWT=[];
hooks.push(t=>{let s='';BWT.forEach(([a,x])=>{if(t>=a)s=x});if(BW.textContent!==s)BW.textContent=s});
function pop(s,t,d=.5,from=.5){tl.fromTo(s,{autoAlpha:0,scale:from},{autoAlpha:1,scale:1,duration:d,ease:'back.out(1.9)'},t)}
function out(s,t,d=.3){tl.to(s,{autoAlpha:0,scale:.9,duration:d,ease:'power2.in'},t)}
function punch(t,k=1){tl.fromTo('#cam',{scale:1+.02*k},{scale:1,duration:.55,ease:'expo.out',immediateRender:false},t)}
function page(id,t,dir=1){tl.fromTo(id,{opacity:1,yPercent:100*dir,filter:'blur(8px)'},{yPercent:0,filter:'blur(0px)',duration:.45,ease:'expo.out',immediateRender:false},t);tl.set(id,{opacity:0},0);tl.set(id,{opacity:1},t);sfx(t,'swish',.45)}
function app(id,t,mode='push'){tl.set(id,{opacity:0},0);if(mode==='push'){tl.fromTo(id,{opacity:1,xPercent:100},{xPercent:0,duration:.42,ease:'power3.out',immediateRender:false},t)}else{tl.fromTo(id,{opacity:0,scale:1.04},{opacity:1,scale:1,duration:.3,immediateRender:false},t)}sfx(t,'tap',.35)}
function tapAt(x,y,t,sel='#tap'){tl.set(sel,{left:x,top:y},t);tl.fromTo(sel,{opacity:.95,scale:.4},{opacity:0,scale:1.4,duration:.45,ease:'power2.out',immediateRender:false},t);sfx(t,'click',.8)}
const BG=['#glow'];

// ---- initial states
gsap.set(['#tags','#win','#pBuilt','#gDue','#pLove','#cm1','#cm2','#heart','#gPay','#gMo','#ph','#cbtn'],{autoAlpha:0});
gsap.set('#ph',{x:600,rotationY:-35});

// ---- S1 HOOK 0 - 1.12 : contractor sites fan in 3D
tl.fromTo('#fC',{scale:1.45,rotationX:12,opacity:1},{scale:1,rotationX:0,duration:.55,ease:'expo.out'},0);tl.fromTo('#cam',{scale:1.12},{scale:1,duration:.6,ease:'expo.out'},0);
tl.fromTo('#fL',{x:0,y:200,rotationY:0,scale:.7,opacity:0},{x:-330,y:-40,rotationY:28,scale:.78,opacity:.85,duration:.7,ease:'expo.out'},.08);
tl.fromTo('#fR',{x:0,y:200,rotationY:0,scale:.7,opacity:0},{x:330,y:-40,rotationY:-28,scale:.78,opacity:.85,duration:.7,ease:'expo.out'},.14);
tl.fromTo('#fsh',{xPercent:-130},{xPercent:130,duration:.9,ease:'power2.inOut'},.35);
sfx(0,'boom',1.0); sfx(0,'impact',1.1); sfx(.1,'whoosh',.6); sfx(.4,'shimmer',.4);
tl.fromTo('#glow',{opacity:.3},{opacity:1,duration:1},0);
// collapse into the main window
tl.to(['#fL','#fR'],{x:0,y:0,rotationY:0,scale:.9,opacity:0,duration:.4,ease:'power3.in'},.85);
tl.set('#fan',{autoAlpha:0},1.12); tl.set('#win',{autoAlpha:1},1.12); sfx(.85,'swish',.6);

// ---- S2 1.12 - 5.3 : built first, $0 until you love it
bw('BUILT FIRST',1.12);
tl.fromTo('#pgWire .wb',{scaleX:0,transformOrigin:'0 50%'},{scaleX:1,duration:.35,stagger:.07,ease:'expo.out'},1.15);[0,1,2,3,4,5].forEach(i=>sfx(1.15+i*.07,'tap',.3));
tl.fromTo('#pgA',{opacity:1,clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.55,ease:'power3.inOut',immediateRender:false},2.45);tl.set('#pgA',{opacity:0},0);tl.set('#pgA',{opacity:1},2.45);sfx(2.45,'swell',.5);
tl.set('#url',{textContent:'alphateam.com'},2.7);
pop('#pBuilt',2.55,.5,.4); sfx(2.55,'pop',.5);
tl.to('#win',{y:-60,scale:.94,rotationY:-8,duration:.8,ease:'power3.inOut'},3.0);
tl.fromTo('#gDue',{autoAlpha:0,x:220,rotationY:-30},{autoAlpha:1,x:0,rotationY:0,duration:.6,ease:'expo.out'},3.45); sfx(3.45,'whoosh',.5); sfx(3.6,'impact',.6);
pop('#pLove',4.75,.5,.4); sfx(4.75,'chime',.6);
function fadeTags(){tl.fromTo('#tags',{autoAlpha:0,y:40},{autoAlpha:1,y:0,duration:.5,ease:'expo.out'},6.75);
  [[0,6.91],[1,7.51],[2,8.27],[3,9.15]].forEach(([i,t])=>{tl.to('#tg'+i,{backgroundColor:'#FFC400',color:'#000',boxShadow:'0 0 0 1.5px #FFC400',scale:1.08,duration:.2},t);tl.to('#tg'+i,{scale:1,duration:.3},t+.2);sfx(t,'pop',.4)});
  tl.to('#tags',{autoAlpha:0,y:30,duration:.3},10.5)}
// ---- S3 5.3 - 10.65 : trades
out(['#pBuilt','#gDue','#pLove'],5.25,.3);
tl.to('#win',{y:0,scale:1,rotationY:0,duration:.6,ease:'power3.inOut'},5.3);
bw('',5.3);
page('#pgJ',5.42); tl.set('#url',{textContent:'jgcgeneralcontractor.com'},5.42);
[['#pgRoof',6.91,'ROOFERS','alphavertical.com',8],['#pgRem',7.51,'REMODELERS','yourremodeling.com',-8],['#pgPaint',8.27,'PAINTERS','alphavertical.com',8],['#pgJ2',9.15,'CONTRACTORS','jgcgeneralcontractor.com',0]].forEach(([id,t,w,u,r])=>{page(id,t);bw(w,t);tl.set('#url',{textContent:u},t);
  tl.to('#win',{rotationY:r,rotationX:r?-3:0,duration:.5,ease:'power3.out'},t);punch(t,.8);tl.fromTo('#bw',{scale:1.15,opacity:0},{scale:1,opacity:1,duration:.5,ease:'expo.out',immediateRender:false},t)});
fadeTags();
// fan of contractor sites behind
[['#g1',-330,-140,22],['#g2',330,-140,-22],['#g3',0,-300,0]].forEach(([s,x,y,r],i)=>{tl.fromTo(s,{opacity:0,x:0,y:0,scale:.9,rotationY:0},{opacity:.9,x,y,scale:.62,rotationY:r,duration:.7,ease:'expo.out'},9.6+i*.07);tl.set(s,{zIndex:-1},0)});
tl.set('#fan2',{zIndex:0},0); sfx(9.6,'whoosh',.6); sfx(9.65,'impact',.7);
tl.to('#win',{y:40,duration:.7,ease:'expo.out'},9.6);
// ---- S4 10.65 - 13.6 : homeowner checks your site, then calls
tl.to(['#win','#g1','#g2','#g3'],{x:'-=900',rotationY:30,opacity:0,duration:.5,ease:'power3.in'},10.55); sfx(10.5,'whoosh',.8);
bw('HOMEOWNERS',10.75);
tl.set('#ph',{autoAlpha:1},10.6); tl.to('#ph',{x:0,rotationY:0,duration:.75,ease:'expo.out'},10.7);
{const Q='roofer near me';hooks.push(t=>{if(t<10.9){$('#qt').textContent='';return}const n=Math.min(Q.length,Math.floor((t-10.9)/.05)+1);$('#qt').textContent=Q.slice(0,n);$('#qc').style.opacity=Math.floor(t/.3)%2?1:0})}
tl.fromTo(['#r1','#r2','#r3'],{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.4,stagger:.08},11.6);
tapAt(240,280,12.2); tl.to('#r1',{backgroundColor:'#f4f8ff',duration:.15},12.2);
app('#aSite',12.4);
tl.fromTo('#aSite .tt',{y:30,opacity:0},{y:0,opacity:1,duration:.5},12.55);
tapAt(222,642,13.15); tl.to('#callBtn',{scale:.95,duration:.08,yoyo:true,repeat:1},13.15);
app('#aCall1',13.3,'fade'); sfx(13.35,'notif',.5);
tl.to('#ph',{rotationY:-10,rotationX:4,duration:2.6,ease:'sine.inOut'},11.0);
// ---- S5 13.6 - 15.95 : no website -> they call the next guy
bw('NO WEBSITE?',13.72);
tl.to('#aCall1',{opacity:0,duration:.2},13.68); tl.to(['#aSite'],{opacity:0,duration:.2},13.68);
tl.set('#r1w',{textContent:'No website',className:'nows'},13.6); 
tapAt(310,330,13.95); app('#aErr',14.12); sfx(14.15,'glitch',.6); punch(14.15,1.2);
tl.to('#ph',{x:-20,duration:.05,yoyo:true,repeat:5,ease:'none'},14.15);
bw('NEXT GUY',14.75);
tl.to('#aErr',{xPercent:100,duration:.35,ease:'power3.in'},14.7); sfx(14.7,'swish',.4);
tapAt(380,500,14.98); tl.to('#r2',{backgroundColor:'#f4f8ff',duration:.15},14.98);
app('#aCall2',15.12,'fade'); sfx(15.15,'notif',.5);
tl.to('#ph',{rotationY:8,rotationX:0,duration:1,ease:'sine.inOut'},14.7);
// ---- S6 15.95 - 20.95 : build, review, love it, pay once, no monthly fees
tl.to('#ph',{x:950,rotationY:-35,duration:.5,ease:'power3.in'},15.85);tl.set('#ph',{autoAlpha:0},16.36);tl.set('#ph',{autoAlpha:1},21.1); sfx(15.85,'whoosh',.8);
bw('',15.9);
tl.set('#win',{x:0,y:0,rotationY:0,rotationX:0,scale:1},15.9); tl.set(['#pgA','#pgJ','#pgRoof','#pgRem','#pgPaint','#pgJ2'],{opacity:0},15.9);
tl.set('#url',{textContent:'brothersassis.com'},15.9);
tl.fromTo('#win',{autoAlpha:1,x:-900,rotationY:30,opacity:1},{x:0,rotationY:0,duration:.55,ease:'expo.out',immediateRender:false},16.0);
tl.fromTo('#pgWire .wb',{scaleX:0},{scaleX:1,duration:.3,stagger:.05,ease:'expo.out',immediateRender:false},16.15);
tl.fromTo('#pgB',{opacity:1,clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:.5,ease:'power3.inOut',immediateRender:false},16.62);tl.set('#pgB',{opacity:0},0);tl.set('#pgB',{opacity:1},16.62);sfx(16.62,'swell',.5);
pop('#cm1',17.2,.45,.4); sfx(17.2,'msg',.6); pop('#cm2',17.55,.45,.4); sfx(17.55,'msg',.6);
out(['#cm1','#cm2'],18.0,.25);
pop('#heart',18.1,.55,.2); sfx(18.12,'impact',.8); sfx(18.15,'shimmer',.5); punch(18.12,1.4);
$$('#burst .bp').forEach((e,i)=>{const a=i/14*Math.PI*2;tl.fromTo(e,{x:0,y:0,opacity:1,scale:1},{x:Math.cos(a)*260,y:Math.sin(a)*260,opacity:0,scale:.3,duration:.7,ease:'expo.out',immediateRender:false},18.15)});
tl.set('.bp',{opacity:0},0);
tl.to('#heart',{scale:.35,y:-330,x:200,duration:.5,ease:'power3.inOut'},18.6);
tl.to('#win',{y:-90,scale:.92,duration:.6,ease:'power3.inOut'},18.6);
tl.fromTo('#gPay',{autoAlpha:0,y:120},{autoAlpha:1,y:0,duration:.55,ease:'expo.out'},18.8); sfx(18.8,'chime',.6);
tl.fromTo('#gMo',{autoAlpha:0,y:120},{autoAlpha:1,y:0,duration:.55,ease:'expo.out'},19.6); sfx(19.6,'tap',.5);
tl.to('#moS',{scaleX:1,duration:.3,ease:'power3.inOut'},20.15); sfx(20.15,'swipe',.6);
// ---- S7 20.95 - end : tap the button, talk to NewWay, right now
tl.to(['#win','#heart','#gPay','#gMo'],{y:'+=-260',opacity:0,duration:.32,ease:'power3.in'},20.8); sfx(20.85,'whoosh',.7);
bw('NEWWAY',21.0);
tl.set('#ph',{x:0,y:1100,rotationY:0,rotationX:0,scale:.82,transformOrigin:'50% 0%'},21.1);
tl.set(['#aSearch','#aSite','#aCall1','#aErr','#aCall2'],{opacity:0},20.9); tl.set('#aChat',{opacity:1},20.9);tl.set('#aChat',{opacity:0},0);
tl.to('#ph',{y:-60,duration:.55,ease:'expo.out'},21.12);
tl.fromTo('#cbtn',{autoAlpha:0,y:80},{autoAlpha:1,y:-110,duration:.45,ease:'expo.out'},21.15);
tapAt(540,1430,21.46,'#tap2'); tl.to('#btn',{scale:.92,duration:.08,yoyo:true,repeat:1},21.46);
tl.set(['#m1','#m2','#m3'],{autoAlpha:0},0);
pop('#m1',21.7,.4,.6); sfx(21.7,'msg',.6); pop('#m2',22.3,.4,.6); sfx(22.3,'send',.5); pop('#m3',22.9,.4,.6); sfx(22.9,'msg',.6);
tl.fromTo('#btn',{scale:1},{scale:1.06,duration:.35,yoyo:true,repeat:3,ease:'sine.inOut',immediateRender:false},23.8); sfx(23.8,'impact',1.0); punch(23.8,1.6);
// lockup
tl.to('#ph',{y:-200,opacity:0,duration:.5,ease:'power3.in'},24.75); tl.to('#bw',{opacity:0,duration:.4},24.75);
tl.set('#lock',{visibility:'visible'},24.95); tl.to('#lock',{opacity:1,duration:.3},24.95);
tl.fromTo('#lsym',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.5,ease:'power3.inOut'},25.0); sfx(25.0,'shimmer',.5);
tl.fromTo('#lwm .L',{yPercent:120,opacity:0},{yPercent:0,opacity:1,duration:.5,stagger:.04,ease:'expo.out'},25.2); sfx(25.2,'swish',.4);
tl.fromTo('#ltg',{opacity:0},{opacity:1,duration:.4},25.55);
tl.set({},{},DUR);

const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
window.SFX=SFX; window.DUR=DUR;
window.seek=(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f);return Promise.all($$('img').map(i=>i.complete&&i.naturalWidth?Promise.resolve():i.decode().catch(()=>{})))};
window.ready=document.fonts.ready.then(()=>{fitCaps();return true});
