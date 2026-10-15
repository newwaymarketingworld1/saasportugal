const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DUR=26.5, SFX=[], hooks=[];
const sfx=(t,type,g=1)=>SFX.push({t:+t.toFixed(3),type,g});
let seed=33; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)); const eo=x=>1-Math.pow(1-x,4);
const WT=WORDS.map(w=>w[1]); WT[0]=0.0;
const logo=(sel,col,part)=>{const el=$(sel);if(part==='sym')el.innerHTML=LOGO.symbol.map(d=>`<path fill="${col}" d="${d}"/>`).join('');else if(part==='wm')el.innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');else el.innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`};
logo('#symC','#FFC400','sym');logo('#wmC','#fff','wm');logo('#tgC','#fff','tg');logo('#chN','#000','sym');

// ================= CAPTIONS: lower-middle, word-synced, quiet typing
const CY=1300;
const G=[
 ['','^1'],
 ['oY','WE\'LL BUILD YOUR|WEBSITE{2} _FIRST._',104],
 ['oY','YOU PAY _NOTHING_|UNTIL YOU _LOVE+IT._{2}',104],
 ['oW','REAL WEBSITES|FOR _REAL_',112],
 ['oW','_ROOFERS,_',150],['oW','_REMODELERS,_',150],['oW','_PAINTERS_',150],
 ['oW','AND _GENERAL_|_CONTRACTORS._',108],
 ['oY','HOMEOWNERS{2} CHECK|YOUR WEBSITE{2}',100],['oY','BEFORE THEY|_CALL._',116],
 ['K2','NO *WEBSITE?*{2}',140],['K2','THEY CALL|THE *NEXT+GUY.*{2}',112],
 ['oY','WE _BUILD_ IT.',140],['oY','YOU _REVIEW_ IT.',130],['oY','_LOVE+IT?_{2}',150],['oY','PAY _ONCE._',150],['oY','NO MONTHLY|_FEES._',120],
 ['K2','TAP THE|*BUTTON.*',120],['K2','AND TALK TO|NEWWAY MARKETING|*WORLD.*',90],['K2','_RIGHT+NOW!_{2}',170],
];
const GROUPS=[];let wi=0;
G.forEach(([cls,txt,fs=100])=>{const el=document.createElement('div');el.className='cap '+cls;el.style.top=CY+'px';el.style.fontSize=fs+'px';const units=[];
  txt.split('|').forEach(line=>{const ln=document.createElement('span');ln.className='ln';
    line.split(' ').forEach(tok=>{let n=1,m;if((m=tok.match(/^\^(\d+)$/))){wi+=+m[1];return}
      if((m=tok.match(/\{(\d+)\}$/))){n=+m[1];tok=tok.replace(/\{\d+\}$/,'')}
      let kind='';if(/^\*.*\*$/.test(tok)){kind='yel';tok=tok.slice(1,-1)}else if(/^_.*_$/.test(tok)){kind='mk';tok=tok.slice(1,-1)}
      const text=tok.replace(/\+/g,' ');const u=document.createElement('span');u.className='cw'+(kind==='yel'?' yel':'');
      u.innerHTML=(kind==='mk'?'<i class="hl"></i>':'')+'<span class="on"></span><i class="crt"></i><span class="off"></span>'+(kind==='mk'?`<span class="bk2">${text}</span>`:'');
      ln.appendChild(u);ln.appendChild(document.createTextNode(' '));units.push({el:u,text,kind,w0:wi,w1:wi+n-1,t:WT[wi]});wi+=n});
    el.appendChild(ln)});
  if(units.length){$('#caps').appendChild(el);GROUPS.push({el,units,t:units[0].t})}});
if(wi!==WT.length)console.error('caption word mismatch',wi,WT.length);
GROUPS.forEach((g,gi)=>{g.end=gi<GROUPS.length-1?GROUPS[gi+1].t:DUR;
  g.units.forEach((u,ui)=>{const next=ui<g.units.length-1?g.units[ui+1].t:Math.min(g.end,(WT[u.w1+1]||DUR));const L=u.text.length;const span=(u.w1>u.w0?(WT[u.w1]-u.t)+.2:0);
    u.dur=clamp(Math.max(span,Math.min(L*.033,(next-u.t)*.8)),.07,1.0);u.tend=u.t+u.dur;
    let k=0;for(let c=0;c<L;c++)if(/[A-Z0-9$]/i.test(u.text[c]))sfx(u.t+u.dur*c/L,'key',k++?.7+.25*rnd():.9);
    if(u.kind==='mk')sfx(u.tend+.02,'swipe',.22)})});
hooks.push(t=>{GROUPS.forEach(g=>{const vis=t>=g.t-.001&&t<g.end;g.el.style.visibility=vis?'visible':'hidden';if(!vis)return;
  const xp=clamp((t-(g.end-.12))/.12);const ip=eo(clamp((t-g.t)/.25));g.el.style.opacity=1-xp;g.el.style.transform=`translateY(${(1-ip)*30-30*xp}px) scale(${.96+.04*ip})`;
  let last=null;g.units.forEach(u=>{if(t>=u.t)last=u});
  g.units.forEach(u=>{const L=u.text.length;const p=clamp((t-u.t)/u.dur);const n=t<u.t?0:Math.max(1,Math.round(p*L));
    u.el.children[u.kind==='mk'?1:0].textContent=u.text.slice(0,n);u.el.querySelector('.off').textContent=u.text.slice(n);
    u.el.querySelector('.crt').style.display=(u===last&&p<1)?'inline-block':'none';
    const sp=clamp((t-u.t)/.2);u.el.style.transform=t<u.t?'none':`translateY(${(1-eo(sp))*12}px)`;
    if(u.kind==='mk'){const q=eo(clamp((t-u.tend)/.2));u.el.querySelector('.hl').style.transform=`scaleX(${q})`;u.el.querySelector('.bk2').style.clipPath=`inset(0 ${(1-q)*100}% 0 0)`}})})});
function fitCaps(){GROUPS.forEach(g=>{const lines=[...g.el.querySelectorAll('.ln')];g.units.forEach(u=>{u.el.querySelector('.off').textContent=u.text});
  const mw=Math.max(...lines.map(l=>l.scrollWidth));if(mw>960)g.el.style.fontSize=(parseFloat(g.el.style.fontSize)*960/mw)+'px'})}

// ================= PILE CARDS (S3)
const PC=[['c/deck.jpg','deckandfence.com','',90,330,-3,5.42],['c/roof.jpg','alphavertical.com','Roofers',70,370,4,6.91],['c/remodel.jpg','remodeling site','Remodelers',110,410,-5,7.51],['c/paint.jpg','alphavertical.com','Painters',80,360,3,8.27],['c/jgc.jpg','jgcgeneralcontractor.com','General contractors',100,400,-2,9.15]];
$('#pile').innerHTML=PC.map((c,i)=>`<div class="card nb pc" id="pc${i}" style="left:${c[3]}px;top:${c[4]}px;transform-origin:50% 50%"><div class="bar"><i></i><i></i><i></i><b>${c[1]}</b></div><div class="im"><img src="${c[0]}"></div>${c[2]?`<div class="stk" style="left:-14px;top:-26px;transform:rotate(-5deg);font-size:34px;z-index:5">${c[2]}</div>`:''}</div>`).join('');
$$('#pile .pc').forEach(e=>{e.style.overflow='visible';e.querySelector('.im').style.borderRadius='0 0 16px 16px'});

// ================= TIMELINE
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
const show=(s,t)=>tl.set(s,{visibility:'visible'},t), hide=(s,t)=>tl.set(s,{visibility:'hidden'},t);
function punch(t,k=1){tl.fromTo('#cam',{scale:1+.022*k},{scale:1,duration:.5,ease:'expo.out',immediateRender:false},t)}
function pop(s,t,d=.5,from=.4,rot=0){tl.fromTo(s,{autoAlpha:0,scale:from},{autoAlpha:1,scale:1,duration:d,ease:'back.out(2.2)'},t)}
function trPush(a,b,t,dir=1,axis='x'){const P=axis==='x'?'xPercent':'yPercent';tl.fromTo(a,{[P]:0},{[P]:-100*dir,duration:.42,ease:'power4.inOut',immediateRender:false},t-.21);
  show(b,t-.21);tl.fromTo(b,{[P]:100*dir},{[P]:0,duration:.42,ease:'power4.inOut',immediateRender:false},t-.21);hide(a,t+.21);sfx(t-.25,'whoosh',.8)}
function trIris(a,b,t,ox='50%',oy='50%'){show(b,t-.25);tl.fromTo(b,{clipPath:`circle(0% at ${ox} ${oy})`},{clipPath:`circle(130% at ${ox} ${oy})`,duration:.55,ease:'power3.inOut',immediateRender:false},t-.25);hide(a,t+.3);tl.set(b,{clipPath:'none'},t+.31);sfx(t-.27,'swish',.8)}
function tapAt(sel,x,y,t){tl.set(sel,{left:x,top:y},t);tl.fromTo(sel,{opacity:.95,scale:.4},{opacity:0,scale:1.4,duration:.45,ease:'power2.out',immediateRender:false},t);sfx(t,'click',.8)}
function app(id,t,mode='push'){tl.set(id,{opacity:0},0);if(mode==='push')tl.fromTo(id,{opacity:1,xPercent:100},{xPercent:0,duration:.42,ease:'power3.out',immediateRender:false},t);else tl.fromTo(id,{opacity:0,scale:1.04},{opacity:1,scale:1,duration:.3,immediateRender:false},t);sfx(t,'tap',.35)}

// ---- S1 HOOK 0 - 1.12 : tape measure reveals CONTRACTORS.
show('#s1',0);
const TAPE={w:300};
hooks.push(t=>{$('#tapeW').style.width=TAPE.w+'px';const edge=150+TAPE.w;$('#hw').style.clipPath=t<0.6?`inset(0 ${Math.max(0,1080-edge)}px 0 0)`:'none'});
tl.to(TAPE,{w:960,duration:.5,ease:'power2.out'},0); sfx(0,'boom',1.0); sfx(0,'swell',.6); sfx(.02,'swipe',.9);
tl.fromTo('#tcase',{x:-30,rotation:-6},{x:0,rotation:0,duration:.4,ease:'back.out(3)'},0);
tl.to(TAPE,{w:0,duration:.16,ease:'power3.in'},.6); sfx(.6,'swish',.7); sfx(.76,'snap',1.0);
tl.to('#tcase',{x:-320,duration:.3,ease:'power3.in'},.7);
tl.set('#s1',{backgroundColor:'#FFC400'},.77); tl.set('#hw',{color:'#000'},.77); tl.set('#s1 .grid',{opacity:0},.77);
tl.fromTo('#hw',{scale:1.18},{scale:1,duration:.4,ease:'expo.out',immediateRender:false},.77); sfx(.77,'impact',1.1); punch(.78,1.8);
tl.to('#hw',{y:-260,opacity:0,duration:.3,ease:'power3.in'},.95);

// ---- S2 1.12 - 5.3 : blueprint -> bricks -> real site; $0 tag
show('#s2',1.1); hide('#s1',1.12);
tl.fromTo('#bp',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.45,ease:'power2.inOut'},1.12); sfx(1.12,'swipe',.6);
tl.fromTo('#dim',{opacity:0,y:10},{opacity:1,y:0,duration:.3},1.35);
$$('#bricks .blk').forEach((b,i)=>{const t=1.5+i*.15;tl.fromTo(b,{y:-700,rotation:(i%2?6:-6)},{y:0,rotation:0,duration:.42,ease:'bounce.out'},t);sfx(t+.28,'impact',.32)});
tl.set('#site',{autoAlpha:0},0);
tl.fromTo('#site',{autoAlpha:1,clipPath:'inset(0 0 100% 0 round 22px)'},{clipPath:'inset(0 0 0% 0 round 22px)',duration:.4,ease:'power3.inOut',immediateRender:false},2.45); sfx(2.45,'swell',.5);
tl.to(['#bricks','#bp'],{opacity:0,duration:.2},2.85);
tl.set('#stFirst',{autoAlpha:0},0); tl.fromTo('#stFirst',{autoAlpha:0,scale:2.2,rotation:-10},{autoAlpha:1,scale:1,rotation:6,duration:.3,ease:'power4.in'},2.55); sfx(2.82,'stamp',.9); punch(2.85,1.2);
tl.to(['#site','#stFirst'],{x:-70,y:-40,scale:.8,duration:.6,ease:'power3.inOut',transformOrigin:'0 0'},3.0);
tl.set('#tag',{autoAlpha:0},0);
tl.fromTo('#tag',{autoAlpha:1,rotation:75,y:-500},{rotation:0,y:0,duration:1.5,ease:'elastic.out(1,0.32)'},3.15); sfx(3.15,'whoosh',.6); sfx(3.5,'impact',.6);
tl.to('#tagIn',{rotationY:180,duration:.55,ease:'power3.inOut'},4.7); sfx(4.72,'chime',.7);
tl.fromTo('#tag',{scale:1},{scale:1.06,duration:.15,yoyo:true,repeat:1,immediateRender:false},4.95);

// ---- S3 5.3 - 10.65 : real sites tossed onto the table (white)
trPush('#s2','#s3',5.3);
PC.forEach((c,i)=>{const t=c[6];tl.fromTo('#pc'+i,{autoAlpha:0,y:1300,rotation:c[5]+(i%2?24:-24),scale:.86},{autoAlpha:1,y:0,rotation:c[5],scale:.86,duration:.5,ease:'expo.out'},t);sfx(t,'whoosh',.4);sfx(t+.22,'impact',.45);punch(t+.22,.7)});
tl.set('#pc0',{autoAlpha:0},0);
tl.fromTo('#stamp',{opacity:0,scale:2.4},{opacity:1,scale:1,duration:.22,ease:'power4.in'},6.4); sfx(6.6,'stamp',1.0); punch(6.62,1.4);
tl.to('#stamp',{opacity:0,duration:.25},7.0);
// collage spread on "general contractors"
[[0,-250,-170,-8,.5],[1,250,-200,7,.5],[2,-240,330,5,.5],[3,260,300,-6,.5],[4,0,40,-1,.66]].forEach(([i,x,y,r,s])=>tl.to('#pc'+i,{x,y,rotation:r,scale:s,duration:.65,ease:'expo.inOut'},9.75));
sfx(9.75,'whoosh',.7); sfx(10.1,'shimmer',.4);

// ---- S4 10.65 - 13.6 : homeowner phone (yellow)
trIris('#s3','#s4',10.65,'50%','40%');
tl.fromTo('#ph',{y:900,rotation:-8},{y:0,rotation:0,duration:.6,ease:'expo.out'},10.6);
tl.set('#stHome',{autoAlpha:0},0); tl.fromTo('#stHome',{autoAlpha:0,scale:2,rotation:-16},{autoAlpha:1,scale:1,rotation:-6,duration:.25,ease:'power4.in'},10.85); sfx(11.05,'stamp',.6);
{const Q='roofer near me';hooks.push(t=>{if(t<10.95){$('#qt').textContent='';return}const n=Math.min(Q.length,Math.floor((t-10.95)/.05)+1);$('#qt').textContent=Q.slice(0,n);$('#qc').style.opacity=Math.floor(t/.3)%2?1:0})}
tl.fromTo(['#r1','#r2','#r3'],{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.4,stagger:.08},11.6);
tapAt('#tap',240,280,12.2); app('#aSite',12.4);
tl.fromTo('#aSite .tt',{y:30,opacity:0},{y:0,opacity:1,duration:.5},12.55);
tapAt('#tap',222,642,13.15); tl.to('#callBtn',{scale:.95,duration:.08,yoyo:true,repeat:1},13.15);
app('#aCall1',13.3,'fade'); sfx(13.35,'notif',.5);
tl.to('#ph',{rotation:2,duration:2.4,ease:'sine.inOut'},11.0);

// ---- S5 13.6 - 15.95 : no website vs next guy (black)
trPush('#s4','#s5',13.6,1,'y');
tl.fromTo('#phA',{x:-600,rotation:-10},{x:0,rotation:-3,duration:.55,ease:'expo.out'},13.62);
tl.set(['#lA','#lB','#phB'],{autoAlpha:0},0);
tl.fromTo('#lA',{autoAlpha:0,scale:2,rotation:-15},{autoAlpha:1,scale:1,rotation:-5,duration:.22,ease:'power4.in'},13.85); sfx(14.05,'stamp',.6);
tl.to('#phA',{x:-14,duration:.05,yoyo:true,repeat:5,ease:'none'},14.18); sfx(14.18,'glitch',.6);
tl.to('#phA',{filter:'grayscale(1) brightness(.55)',duration:.4},14.7);
tl.fromTo('#phB',{autoAlpha:1,x:600,rotation:10},{x:0,rotation:3,duration:.55,ease:'expo.out'},14.72); sfx(14.72,'whoosh',.6);
tl.fromTo('#lB',{autoAlpha:0,scale:2,rotation:15},{autoAlpha:1,scale:1,rotation:5,duration:.22,ease:'power4.in'},14.95); sfx(15.15,'stamp',.7);
[0,1].forEach(i=>tl.fromTo('#rg'+(i+1),{scale:.5,opacity:.9},{scale:2.4,opacity:0,duration:.9,repeat:1,ease:'power2.out'},15.1+i*.45)); sfx(15.2,'notif',.6);
tl.set(['#rg1','#rg2'],{opacity:0},0);

// ---- S6 15.95 - 20.95 : build / review / love it + receipt (yellow)
trIris('#s5','#s6',15.95,'50%','30%');
[['#t1',16.15],['#t2',17.05],['#t3',18.13]].forEach(([s,t])=>{tl.fromTo(s,{autoAlpha:0,scale:2,rotation:-12},{autoAlpha:1,scale:1,rotation:0,duration:.22,ease:'power4.in'},t);sfx(t+.2,'stamp',.8);punch(t+.22,1)});
tl.to('#t3',{backgroundColor:'#000',duration:.1},18.4); tl.to('#t3 svg',{fill:'#FFC400',duration:.1},18.4); tl.to('#t3 b',{color:'#FFC400',duration:.1},18.4); sfx(18.4,'shimmer',.5);
tl.fromTo('#printer',{autoAlpha:0,y:40},{autoAlpha:1,y:0,duration:.35},18.55);
tl.fromTo('#rc',{y:-620},{y:0,duration:1.5,ease:'power1.out'},18.77); for(let i=0;i<12;i++)sfx(18.8+i*.11,'tick',.28);
tl.fromTo('#rOnce',{scale:1},{scale:1.06,duration:.15,yoyo:true,repeat:1},19.05);
tl.to('#rMoH',{scaleX:1,duration:.3,ease:'power3.inOut'},20.3); sfx(20.3,'swipe',.5);

// ---- S7 20.95 - end : CTA (black)
trPush('#s6','#s7',20.95);
tl.fromTo('#symC',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.5,ease:'power3.inOut'},21.0);
tl.fromTo('#wmC .L',{yPercent:120,opacity:0},{yPercent:0,opacity:1,duration:.5,stagger:.04,ease:'expo.out'},21.15);
tl.fromTo('#tgC',{opacity:0},{opacity:1,duration:.4},21.5);
pop('#cbtn',21.05,.45,.6); sfx(21.05,'pop',.5);
tl.fromTo('#hand',{x:200,y:200,opacity:0},{x:-80,y:-110,opacity:1,duration:.4,ease:'power3.out'},21.05);
tl.to('#btn',{x:8,y:8,boxShadow:'4px 4px 0 #fff',duration:.07,yoyo:true,repeat:1},21.46); tapAt('#tap2',540,1030,21.46);
tl.to('#hand',{x:60,y:60,opacity:0,duration:.4},21.7);
tl.set('#bubble',{autoAlpha:0},0); tl.fromTo('#bubble',{autoAlpha:0,y:30,scale:.9},{autoAlpha:1,y:0,scale:1,duration:.45,ease:'back.out(2)'},21.9); sfx(21.9,'msg',.7);
tl.fromTo('#btn',{scale:1},{scale:1.07,duration:.3,yoyo:true,repeat:5,ease:'sine.inOut',immediateRender:false},23.78); sfx(23.8,'impact',1.0); punch(23.8,1.6);
tl.set({},{},DUR);

const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
window.SFX=SFX; window.DUR=DUR;
window.seek=(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f);return Promise.all($$('img').map(i=>i.complete&&i.naturalWidth?Promise.resolve():i.decode().catch(()=>{})))};
window.ready=document.fonts.ready.then(()=>{fitCaps();const h=$('#hw');h.style.display='inline-block';h.style.left='0';h.style.right='auto';const w=h.scrollWidth;h.style.fontSize=(168*1010/w)+'px';h.style.display='block';h.style.left='0';h.style.right='0';return true});
