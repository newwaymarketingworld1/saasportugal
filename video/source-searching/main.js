const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DUR=50.5, SFX=[], hooks=[];
const sfx=(t,type,g=1)=>SFX.push({t:+t.toFixed(3),type,g});
let seed=11; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)); const eo=x=>1-Math.pow(1-x,4); const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const WT=WORDS.map(w=>w[1]); WT[0]=0.0;
function fillLogo(sym,wm,tg,col){
  $(sym).innerHTML=LOGO.symbol.map(d=>`<path fill="${col}" d="${d}"/>`).join('');
  if(wm)$(wm).innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');
  if(tg)$(tg).innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`}
fillLogo('#sym7',null,null,'#000'); fillLogo('#symA','#wmA','#tgA','#000'); fillLogo('#symC','#wmC','#tgC','#fff'); fillLogo('#nsym',null,null,'#FFC400');

// ================= CAPTION ENGINE
// token syntax: *w* yellow, _w_ marker, ~w~ strike, + = space inside a unit, {n} consumes n spoken words, ^n hidden words, | line break
const SCN={s1:[0,2.75],s2:[2.75,4.12],s3:[4.12,9.75],s5:[9.75,12.85],s6a:[12.85,16.3],s6b:[16.3,19.55],s7:[19.55,21.3],s8:[21.3,25.65],s9:[25.65,29.9],s10:[29.9,33.9],s11:[33.9,37.9],s12a:[37.9,38.92],s12b:[38.92,40.55],s12c:[40.55,44.18],s13:[44.18,46.28],s14:[46.28,DUR]};
const G=[
 ['s1',1070,100,'RIGHT NOW,|SOMEONE{2} IS LOOKING|UP YOUR *BUSINESS.*'],
 ['s2',930,140,'AND IN|*3+SECONDS...*{2}'],
 ['s3',1150,96,'THEY\'RE{2} GOING TO|CHOOSE YOUR|_COMPETITOR._'],
 ['s3',1150,104,'NOT BECAUSE|THEY\'RE BETTER.'],
 ['s3',1150,100,'BECAUSE THEIR|WEBSITE{2}|_LOOKS+BETTER._{2}'],
 ['s5',1090,92,'WE\'VE MANAGED|OVER *$20M*{3}|IN+ADS.{2}'],
 ['s6a',860,100,'AND THIS IS THE|*SILENT+KILLER*{2}|WE SEE EVERY DAY.'],
 ['s6b',880,116,'CUSTOMERS|DON\'T COMPLAIN.'],
 ['s6b',880,130,'THEY JUST|_DISAPPEAR._'],
 ['s7',800,170,'SO HERE\'S|_OUR+OFFER._{2}',{dark:1,inv:1}],
 ['s8',1010,96,'WE BUILD YOUR|*PROFESSIONAL*|WEBSITE{2} FIRST.'],
 ['s8',1010,104,'YOU PAY|_NOTHING_|UP FRONT.'],
 ['s9',960,110,'YOU REVIEW IT.'],
 ['s9',960,104,'CHANGE WHATEVER|YOU WANT.'],
 ['s9',960,100,'AND ONLY PAY|WHEN YOU|_LOVE+IT._{2}'],
 ['s10',1000,110,'ONE *AFFORDABLE*|PAYMENT.'],
 ['s10',1000,120,'NO MONTHLY|FEES.'],
 ['s10',960,230,'_EVER._'],
 ['s11',1040,108,'BUILT BY|REAL *DESIGNERS.*'],
 ['s11',1040,150,'NOT ~AI.~{2}'],
 ['s11',1040,120,'NOT A|~TEMPLATE.~'],
 ['s12a',620,34,'WE\'RE ^2',{dark:1,lab:1}],
 ['s12b',1150,110,'FOUNDED BY|*PEDRO* & *GUSTAVO*',{shd:1}],
 ['s12c',1000,96,'WITH OVER|*100*{2} WEBSITES{2}|DELIVERED ACROSS|THE *U.S.*{2}'],
 ['s13',600,140,'IF YOU DON\'T|LOVE+IT,{2}',{dark:1}],
 ['s13',600,190,'YOU DON\'T|_PAY._',{dark:1,inv:1}],
 ['s14',630,110,'SEND US|A MESSAGE|_NOW._'],
];
const GROUPS=[]; let wi=0;
G.forEach((g,gi)=>{const [sc,y,fs,txt,o={}]=g;const el=document.createElement('div');el.className='cap'+(o.dark?' dark':'')+(o.shd?' shd':'')+(o.inv?' inv':'');
  el.style.top=y+'px';el.style.fontSize=fs+'px';if(o.lab){el.style.fontWeight=600;el.style.letterSpacing='.42em'}
  const units=[];
  txt.split('|').forEach(line=>{const ln=document.createElement('span');ln.className='ln';
    line.split(' ').forEach(tok=>{let n=1,m;
      if((m=tok.match(/^\^(\d+)$/))){wi+=+m[1];return}
      if((m=tok.match(/\{(\d+)\}$/))){n=+m[1];tok=tok.replace(/\{\d+\}$/,'')}
      let kind='';if(/^\*.*\*$/.test(tok)){kind='yel';tok=tok.slice(1,-1)}else if(/^_.*_$/.test(tok)){kind='mk';tok=tok.slice(1,-1)}else if(/^~.*~$/.test(tok)){kind='sk';tok=tok.slice(1,-1)}
      const text=tok.replace(/\+/g,' ');const u=document.createElement('span');u.className='cw'+(kind==='yel'?' yel':'');
      u.innerHTML=(kind==='mk'?'<i class="hl"></i>':'')+'<span class="on"></span><i class="crt"></i><span class="off"></span>'+(kind==='sk'?'<i class="sk"></i>':'')+(kind==='mk'&&(!o.dark||o.inv)?`<span class="bk2">${text}</span>`:'');
      ln.appendChild(u);ln.appendChild(document.createTextNode(' '));
      units.push({el:u,text,kind,w0:wi,w1:wi+n-1,t:WT[wi]});wi+=n});
    el.appendChild(ln)});
  $('#'+sc+' .caps').appendChild(el);GROUPS.push({el,sc,units,t:units.length?units[0].t:0})});
if(wi!==WT.length)console.error('caption word count mismatch',wi,WT.length);
// timing per unit
GROUPS.forEach((g,gi)=>{const nx=GROUPS.slice(gi+1).find(h=>h.sc===g.sc);g.end=nx?nx.t:SCN[g.sc][1]+.5;
  g.units.forEach((u,ui)=>{const next=ui<g.units.length-1?g.units[ui+1].t:Math.min(g.end,(WT[u.w1+1]||DUR));
    const L=u.text.length;const span=(u.w1>u.w0?(WT[u.w1]-u.t)+.22:0);
    u.dur=clamp(Math.max(span,Math.min(L*.042,(next-u.t)*.85)),.08,1.2);u.tend=u.t+u.dur;
    // typing sfx: one key per letter
    let k=0;for(let c=0;c<L;c++){if(/[A-Z0-9$]/i.test(u.text[c])){sfx(u.t+u.dur*c/L,'key',k++?.75+.25*rnd():1)}}
    if(u.kind==='mk')sfx(u.tend+.02,'swipe',.3);if(u.kind==='sk')sfx(u.tend-.05,'swipe',.6)})});
hooks.push(t=>{GROUPS.forEach(g=>{const vis=t>=g.t-.001&&t<g.end;g.el.style.visibility=vis?'visible':'hidden';if(!vis)return;
  const xp=clamp((t-(g.end-.16))/.16);g.el.style.opacity=1-xp;g.el.style.transform=`translateY(${-28*eo(xp)}px)`;g.el.style.filter=xp>0?`blur(${8*xp}px)`:'none';
  let last=null;g.units.forEach(u=>{if(t>=u.t)last=u});
  g.units.forEach(u=>{const L=u.text.length;const p=clamp((t-u.t)/u.dur);const n=t<u.t?0:Math.max(1,Math.round(p*L));
    u.el.children[u.kind==='mk'?1:0].textContent=u.text.slice(0,n);u.el.querySelector('.off').textContent=u.text.slice(n);
    const crt=u.el.querySelector('.crt');const on=u===last&&(p<1||Math.floor((t-u.tend)/.27)%2===1);crt.style.display=on&&t<g.end-.2?'inline-block':'none';
    const sp=clamp((t-u.t)/.22);const pop=(u.kind?1.14:1.05);u.el.style.transform=t<u.t?'none':`translateY(${(1-eo(sp))*16}px) scale(${1+(pop-1)*(1-eo(sp))})`;
    if(u.kind==='mk'){const q=eo(clamp((t-u.tend)/.24));u.el.querySelector('.hl').style.transform=`scaleX(${q})`;const b=u.el.querySelector('.bk2');if(b)b.style.clipPath=`inset(0 ${(1-q)*100}% 0 0)`}
    if(u.kind==='sk'){u.el.querySelector('.sk').style.transform=`scaleX(${eo(clamp((t-u.tend+.05)/.18))})`}
  })})});
function fitCaps(){GROUPS.forEach(g=>{const lines=[...g.el.querySelectorAll('.ln')];g.units.forEach(u=>{u.el.querySelector('.off').textContent=u.text});
  const mw=Math.max(...lines.map(l=>l.scrollWidth));if(mw>950){g.el.style.fontSize=(parseFloat(g.el.style.fontSize)*950/mw)+'px'}})}

// ================= BUILDERS
const card=(src,name,extra='')=>`<div class="sc" ${extra}><div class="sb"><i></i><i></i><i></i><b>${name}</b></div><div class="si"><img ${src.startsWith('v')?`class="vf" id="${src}"`:`src="${src}"`}><div class="dm"></div></div></div>`;
$('#cheap').innerHTML=`<div style="background:#ddd;padding:12px;text-align:center;font:bold 18px 'Liberation Serif'">*** WELCOME TO OUR WEBSITE!!! ***</div>
<div style="padding:30px 24px 10px;text-align:center"><div style="font:bold 58px/1 'Liberation Serif';text-decoration:underline">YOUR BUSINESS</div><div style="font:italic 26px 'Liberation Serif';margin-top:12px">Best Prices In Town!!!</div></div>
<div style="margin:18px 24px;height:200px;border:3px ridge #999;background:repeating-linear-gradient(45deg,#ccc 0 10px,#eee 10px 20px);display:flex;align-items:center;justify-content:center;font:bold 22px 'Liberation Serif'">[ IMAGE NOT FOUND ]</div>
<div style="padding:0 24px;font:22px/1.35 'Liberation Serif'">Family owned since 1998. Call us today for a FREE estimate. <u>Click here</u> for more info.</div>`;
const LBG=['#fff','#fff','#000','#fff','#f7f7f7','#fff','#fff','#12110f','#fff','#fff','#fff','#f1f0ec'];
const lrow=(id,order)=>{$(id).innerHTML=order.concat(order).map(i=>`<div class="lt" style="background:${LBG[i]}"><img src="lg/l${i}.jpg"></div>`).join('')};
lrow('#rowA',[0,1,2,3,4,5,6,7,8,9,10,11]); lrow('#rowB',[6,10,3,8,1,11,7,2,9,4,0,5]);
{let h='';for(let r=0;r<4;r++)for(let c=0;c<8;c++){const i=r*8+c;h+=`<svg class="person" id="pr${i}" style="left:${122+c*110}px;top:${r*104}px" viewBox="0 0 190 220"><circle cx="95" cy="62" r="52" fill="#fff"/><path d="M8 220c4-60 42-96 87-96s83 36 87 96z" fill="#fff"/></svg>`}$('#crowd').innerHTML=h}
$('#months').innerHTML=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i)=>`<div class="mo" id="mo${i}">${m.toUpperCase()}<i class="st"></i></div>`).join('');
const TG=['alpha','brother','kundara','jgc','poenza','deck'];
$('#tg').innerHTML=TG.map((k,i)=>`<div class="tt" id="tt${i}" style="left:${(i%2)*464}px;top:${Math.floor(i/2)*238}px"><img src="c/t_${k}.jpg"></div>`).join('');
const CF=[['c/alpha.jpg','Alpha Team · Albany, NY'],['c/brother.jpg','Brothers Assis Electrical · PA'],['vC','Alpha Vertical'],['c/deck.jpg','Deck & Fence · NJ'],['c/jgc.jpg','JGC General Contractor · MN'],['vD','Home remodeling'],['c/poenza.jpg','Poenza · Dental clinic'],['c/kundara.jpg','Kundara · Massage studio']];
$('#cft').innerHTML=CF.map((c,i)=>`<div class="cf" id="cf${i}">${card(c[0],c[1].split(' · ')[0])}<div class="nm2">${c[1]}</div></div>`).join('');
const VS={vB:[[21.2,25.7,'v2',3.0]],vC:[[40.5,44.3,'v2',10.4]],vD:[[42.0,44.3,'v1',1.0]]};
const VMAX={v1:408,v2:502};
hooks.push(t=>{for(const id in VS){const el=document.getElementById(id);let seg=VS[id].find(s=>t>=s[0]&&t<s[1]);if(!seg)seg=t<VS[id][0][0]?VS[id][0]:VS[id][VS[id].length-1];
  const fr=Math.min(VMAX[seg[2]],Math.max(1,Math.round((clamp(t,seg[0],seg[1])-seg[0]+seg[3])*30)+1));const src=`${seg[2]}/f${String(fr).padStart(4,'0')}.jpg`;if(el.getAttribute('src')!==src)el.setAttribute('src',src)}});
const LIGHT=[[19.4,21.35],[37.75,38.95],[44.0,46.3]];hooks.push(t=>{$('#vign').style.opacity=LIGHT.some(([a,b])=>t>=a&&t<b)?0:1});

// ================= TIMELINE
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
const show=(s,t)=>tl.set(s,{visibility:'visible'},t), hide=(s,t)=>tl.set(s,{visibility:'hidden'},t);
function punch(t,k=1){tl.fromTo('#cam',{scale:1+.02*k},{scale:1,duration:.55,ease:'expo.out',immediateRender:false},t)}
function fadeUp(s,t,d=.6,y=40){tl.fromTo(s,{autoAlpha:0,y},{autoAlpha:1,y:0,duration:d,ease:'expo.out'},t)}
function pop(s,t,d=.5){tl.fromTo(s,{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,duration:d,ease:'back.out(2)'},t)}
function drift(s,a,b,f=1,to=1.04){const d=$(s+' .drift')?s+' .drift':s;tl.fromTo(d,{scale:f},{scale:to,duration:b-a,ease:'none'},a)}
// ---- clean, professional transitions (no stripes, no flashes)
function trPush(a,b,t,dir=1){tl.fromTo(a,{xPercent:0,filter:'blur(0px)'},{xPercent:-100*dir,filter:'blur(18px)',duration:.4,ease:'power4.in',immediateRender:false},t-.4);hide(a,t);
  show(b,t);tl.fromTo(b,{xPercent:100*dir,filter:'blur(18px)'},{xPercent:0,filter:'blur(0px)',duration:.5,ease:'power4.out',immediateRender:false},t);sfx(t-.42,'air',.9)}
function trPushV(a,b,t){tl.fromTo(a,{yPercent:0,filter:'blur(0px)'},{yPercent:-100,filter:'blur(16px)',duration:.4,ease:'power4.in',immediateRender:false},t-.4);hide(a,t);
  show(b,t);tl.fromTo(b,{yPercent:100,filter:'blur(16px)'},{yPercent:0,filter:'blur(0px)',duration:.5,ease:'power4.out',immediateRender:false},t);sfx(t-.42,'air',.9)}
function trZoom(a,b,t){tl.fromTo(a,{scale:1,filter:'blur(0px)',opacity:1},{scale:1.7,filter:'blur(22px)',opacity:0,duration:.36,ease:'power3.in',immediateRender:false},t-.36);hide(a,t);
  show(b,t);tl.fromTo(b,{scale:.78,filter:'blur(18px)',opacity:0},{scale:1,filter:'blur(0px)',opacity:1,duration:.55,ease:'expo.out',immediateRender:false},t);sfx(t-.38,'zoom',.85)}
function trIris(a,b,t){show(b,t-.3);tl.fromTo(b,{clipPath:'circle(0% at 50% 42%)',scale:1.08},{clipPath:'circle(125% at 50% 42%)',scale:1,duration:.65,ease:'power3.inOut',immediateRender:false},t-.3);
  tl.to(a,{scale:.94,filter:'blur(6px)',duration:.5,ease:'power2.in',immediateRender:false},t-.3);hide(a,t+.36);tl.set(b,{clipPath:'none'},t+.36);sfx(t-.32,'swish',.8)}
function trDip(a,b,t){tl.fromTo('#dip',{opacity:0},{opacity:1,duration:.3,ease:'power2.in',immediateRender:false},t-.3);hide(a,t);show(b,t);tl.to('#dip',{opacity:0,duration:.5,ease:'power2.out',immediateRender:false},t+.02)}
function trFade(a,b,t){show(b,t-.2);tl.fromTo(b,{opacity:0},{opacity:1,duration:.4,ease:'power1.inOut',immediateRender:false},t-.2);hide(a,t+.2)}
function trN(a,b,t,out='fade',col='#FFC400',sym='#000'){
  // clean brand sting: colour dissolve -> NewWay N pops in the centre -> dissolves into the next scene
  tl.set('#nmask',{visibility:'visible'},t-.5);tl.set('#nsym',{x:290,y:820,scale:.55,opacity:0},t-.5);tl.set('#nsym path',{attr:{fill:sym}},t-.5);tl.set('#nmask .nfill',{backgroundColor:col},t-.5);
  tl.fromTo('#nmask .nfill',{opacity:0},{opacity:1,duration:.26,ease:'power2.inOut',immediateRender:false},t-.5);
  tl.fromTo('#nsym',{scale:.55,x:290,y:820,opacity:0},{scale:1,opacity:1,duration:.32,ease:'back.out(1.6)',immediateRender:false},t-.32);
  hide(a,t);show(b,t);
  tl.to('#nsym',{scale:1.18,opacity:0,duration:.32,ease:'power2.in',immediateRender:false},t+.08);
  tl.to('#nmask .nfill',{opacity:0,duration:.38,ease:'power2.inOut',immediateRender:false},t+.14);
  tl.set('#nmask',{visibility:'hidden'},t+.56);
  sfx(t-.5,'riser',.6);sfx(t-.3,'boom',.8);sfx(t-.28,'shimmer',.35)}

gsap.set('#nsym',{opacity:0});
// ================= S1 HOOK 0 - 2.75
show('#s1',0); drift('#s1',0,2.8,1,1.07);
tl.fromTo('#cam',{scale:1.32},{scale:1,duration:.55,ease:'expo.out'},0); tl.fromTo('#s1',{filter:'blur(14px)'},{filter:'blur(0px)',duration:.32,ease:'power2.out'},0); sfx(0,'whoosh',.6); sfx(0,'boom',1.0); sfx(0,'impact',1.1);
tl.fromTo('#glow',{opacity:.2},{opacity:1,duration:1.2},0);
tl.fromTo('#live',{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:.45,ease:'expo.out'},.15);
tl.to('#ldot',{opacity:.25,duration:.35,yoyo:true,repeat:5,ease:'sine.inOut'},.3);
{const Q='roofer near me';hooks.push(t=>{const n=Math.min(Q.length,Math.floor(clamp(t/1.0)*Q.length)+1);$('#qtx').textContent=Q.slice(0,n);$('#qcar').style.opacity=(t<1.05||Math.floor(t/.3)%2)?1:0});
 for(let i=1;i<Q.length;i++)if(Q[i]!==' ')sfx(i/Q.length*1.0,'key',.85)}
tl.fromTo(['#r1','#r2','#r3'],{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.5,stagger:.12,ease:'expo.out'},1.1); [0,1,2].forEach(i=>sfx(1.1+i*.12,'tap',.5));
tl.to('#r2',{boxShadow:'0 0 0 3px #FFC400',duration:.25},2.02); tl.to('#r2f',{backgroundColor:'#FFC400',color:'#000',duration:.2},2.02); sfx(2.02,'pop',.6);

// ================= S2 3 SECONDS 2.75 - 4.12
trZoom('#s1','#s2',2.75); drift('#s2',2.75,4.15,1,1.06);
hooks.push(t=>{const p=clamp((t-2.9)/1.15);$('#tr').setAttribute('stroke-dashoffset',(1633.6*p).toFixed(1));$('#tn').textContent=p<.34?'3':p<.67?'2':'1'});
[2.9,3.28,3.66].forEach(t=>{sfx(t,'tick',1);tl.fromTo('#tn',{scale:1.3},{scale:1,duration:.3,ease:'expo.out',immediateRender:false},t)});

// ================= S3 YOU vs COMPETITOR 4.12 - 9.75
trPush('#s2','#s3',4.12); drift('#s3',4.12,9.8,1,1.03);
tl.fromTo('#cA',{x:-200,autoAlpha:0},{x:0,autoAlpha:1,duration:.6,ease:'expo.out'},4.15);
tl.fromTo('#cB',{x:200,autoAlpha:0},{x:0,autoAlpha:1,duration:.6,ease:'expo.out'},4.25);
tl.set(['#rtA','#rtB','#chosen'],{autoAlpha:0},0);
tl.to('#cur',{opacity:1,duration:.15},4.55); tl.fromTo('#cur',{x:0,y:0},{x:-240,y:-330,duration:.6,ease:'power3.inOut'},4.55);
tl.fromTo('#rip',{scale:.5,opacity:1},{scale:6,opacity:0,duration:.6,ease:'power2.out'},5.12); sfx(5.12,'click',1.1);
tl.to('#cBsc',{boxShadow:'0 0 0 5px #FFC400,0 40px 90px rgba(0,0,0,.7)',duration:.25},5.12);
pop('#chosen',5.2); sfx(5.2,'chime',.5); tl.to('#cAd',{opacity:.55,duration:.4},5.2); tl.to('#cur',{opacity:0,duration:.3},5.6);
pop('#rtA',6.2); pop('#rtB',6.35); sfx(6.2,'pop',.4); sfx(6.35,'pop',.4);
tl.to('#cA',{x:-900,rotation:-6,autoAlpha:0,duration:.5,ease:'power3.in'},7.55); sfx(7.55,'swish',.6);
tl.to('#cB',{y:-380,duration:.7,ease:'expo.inOut'},7.75); tl.to('#cBin',{scale:1,x:-90,duration:.7,ease:'expo.inOut'},7.75);
tl.to(['#lbB','#rtB','#chosen'],{autoAlpha:0,duration:.25},7.7);
tl.fromTo('#shn',{xPercent:-120},{xPercent:120,duration:.9,ease:'power2.inOut'},8.7); sfx(8.7,'shimmer',.5);

// ================= S5 $20M 9.75 - 12.85
trPushV('#s3','#s5',9.75); drift('#s5',9.75,12.9,1,1.04);
fadeUp('#s5l',9.8,.5,14);
tl.fromTo('#s5n',{scale:.6,autoAlpha:0},{scale:1,autoAlpha:1,duration:.6,ease:'expo.out'},10.3);
hooks.push(t=>{$('#mn').textContent=Math.round(eo(clamp((t-10.5)/1.3))*20)});
for(let i=0;i<9;i++)sfx(10.5+i*.14,'tick',.3); sfx(11.8,'impact',.9); punch(11.85,1.1);
tl.fromTo('#rowA',{x:0},{x:-600,duration:3.2,ease:'none'},9.75); tl.fromTo('#rowB',{x:-1200},{x:-600,duration:3.2,ease:'none'},9.75);
tl.fromTo('#s5 .lt',{scale:.5,autoAlpha:0},{scale:1,autoAlpha:1,duration:.5,stagger:{each:.02,from:'center'},ease:'back.out(2)'},11.85); sfx(11.85,'shimmer',.35);

// ================= S6A SILENT KILLER 12.85 - 16.3
trDip('#s5','#s6a',12.85); drift('#s6a',12.85,16.35,1.06,1);
tl.fromTo('#mute',{scale:.7,autoAlpha:0},{scale:1,autoAlpha:1,duration:.8,ease:'expo.out'},13.0);
[0,1].forEach(i=>tl.fromTo('#rg'+(i+1),{scale:.6,opacity:.8},{scale:1.8,opacity:0,duration:1.6,repeat:1,ease:'power2.out'},13.2+i*.8));
[13.0,14.0,15.0].forEach(t=>sfx(t,'heart',.95));

// ================= S6B DISAPPEAR 16.3 - 19.55
trFade('#s6a','#s6b',16.3); drift('#s6b',16.3,19.6,1,1.04);
tl.fromTo('#crowd .person',{opacity:0,y:30},{opacity:.92,y:0,duration:.5,stagger:{each:.012,from:'random'},ease:'expo.out'},16.2);
fadeUp('#inbox',17.1,.5,14); sfx(17.1,'tap',.4);
{const P=$$('#crowd .person');P.forEach((e,i)=>{const c=i%8;tl.to(e,{opacity:0,y:-50,filter:'blur(12px)',duration:.55,ease:'power2.in'},18.32+c*.07+((i>>3)%2)*.03)})}
sfx(18.3,'whoosh',.8); sfx(16.3,'heart',.9); sfx(17.3,'heart',.8);

// ================= S7 OFFER (yellow) 19.55 - 21.3
trN('#s6b','#s7',19.55); drift('#s7',19.55,21.35,1.06,1);
tl.fromTo('#sym7',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.5,ease:'power3.inOut'},19.7);

// ================= S8 BUILD FIRST / $0 21.3 - 25.65
trPushV('#s7','#s8',21.3); drift('#s8',21.3,25.7,1,1.03);
tl.fromTo('#vcB',{y:260,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,ease:'expo.out'},21.32);
tl.fromTo('#wire',{clipPath:'inset(0 0 0 0%)'},{clipPath:'inset(0 0 0 100%)',duration:1.1,ease:'power3.inOut'},21.7); sfx(21.7,'riser',.35);
hooks.push(t=>{$('#bp').textContent=Math.round(clamp((t-21.5)/1.4)*100)});
tl.to('#bld',{autoAlpha:0,duration:.3},23.3); sfx(23.0,'chime',.5);
tl.set('#due',{autoAlpha:0},0); tl.fromTo('#due',{autoAlpha:0,scale:1.6,rotation:-6},{autoAlpha:1,scale:1,rotation:-3,duration:.32,ease:'expo.out'},24.34); sfx(24.36,'stamp',.9); punch(24.38,1.3);

// ================= S9 REVIEW / CHANGE / LOVE 25.65 - 29.9
trPush('#s8','#s9',25.65); drift('#s9',25.65,29.95,1,1.03);
tl.fromTo('#rv',{y:200,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},25.68);
tl.fromTo('#steps',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.5},25.75);
[['#p1',25.87],['#p2',26.62],['#p3',29.19]].forEach(([s,t],i)=>{tl.to(s,{backgroundColor:'#FFC400',color:'#000',duration:.15},t);if(i)tl.to(['#p1','#p2'][i-1],{backgroundColor:'#141414',color:'#777',duration:.15},t);sfx(t,'tap',.6)});
tl.set(['#b1','#b2','#appr','#sel'],{autoAlpha:0},0);
tl.fromTo('#b1',{autoAlpha:0,scale:.6,y:20},{autoAlpha:1,scale:1,y:0,duration:.4,ease:'back.out(2)'},25.95); sfx(25.95,'msg',.6);
tl.fromTo('#sel',{autoAlpha:0,scale:1.1},{autoAlpha:1,scale:1,duration:.35},26.65); sfx(26.65,'tap',.5);
tl.fromTo('#b2',{autoAlpha:0,scale:.6,y:20},{autoAlpha:1,scale:1,y:0,duration:.4,ease:'back.out(2)'},26.95); sfx(26.95,'msg',.6);
tl.to('#rvimg',{scale:1.06,transformOrigin:'50% 20%',duration:.5,ease:'power3.inOut'},27.6); sfx(27.6,'swish',.4);
tl.to(['#b1','#b2','#sel'],{autoAlpha:0,y:-20,duration:.3},28.6);
pop('#appr',29.25); sfx(29.25,'chime',.8);

// ================= S10 ONE PAYMENT / NO MONTHLY / EVER 29.9 - 33.9
trZoom('#s9','#s10',29.9); drift('#s10',29.9,33.95,1,1.03);
tl.set('#tkt',{autoAlpha:0},0); tl.fromTo('#tkt',{autoAlpha:0,y:-80,rotation:-4},{autoAlpha:1,y:0,rotation:0,duration:.5,ease:'back.out(1.6)'},30.05); sfx(30.05,'stamp',.8); punch(30.08,1);
tl.fromTo('#months .mo',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.35,stagger:.03,ease:'expo.out'},31.75); sfx(31.75,'air',.4);
tl.to('#months .st',{scaleX:1,duration:.2,stagger:.025,ease:'power3.out'},32.45); for(let i=0;i<12;i++)sfx(32.45+i*.025,'tick',.25); sfx(32.45,'swipe',.6);
tl.to('#months .mo',{opacity:.35,duration:.3},32.8);
sfx(33.14,'impact',1.1); punch(33.16,1.8);

// ================= S11 REAL DESIGNERS 33.9 - 37.9
trZoom('#s10','#s11',33.9); drift('#s11',33.9,37.95,1,1.03);
TG.forEach((k,i)=>{const t=33.95+i*.08;tl.fromTo('#tt'+i,{autoAlpha:0,scale:.6,rotation:i%2?5:-5},{autoAlpha:1,scale:1,rotation:0,duration:.5,ease:'back.out(1.7)'},t);sfx(t,'snap',.45)});
tl.to('#tg',{y:-20,duration:3.8,ease:'none'},34.0);

// ================= S12A WE'RE NEWWAY (yellow) 37.9 - 38.92
trN('#s11','#s12a',37.9); drift('#s12a',37.9,38.95,1.05,1);
tl.fromTo('#symw',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.4,ease:'power3.inOut'},37.98);
tl.fromTo('#wmA .L',{yPercent:110,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.4,stagger:.035,ease:'expo.out'},38.25); for(let i=0;i<6;i++)sfx(38.25+i*.05,'key',.9);
tl.fromTo('#tgA',{autoAlpha:0},{autoAlpha:1,duration:.3},38.55);

// ================= S12B FOUNDERS 38.92 - 40.55
trPushV('#s12a','#s12b',38.92);
tl.to('#fdiv',{scaleY:1,duration:.5,ease:'power3.inOut'},39.0);
tl.fromTo(['#fp img','#fg img'],{scale:1.18},{scale:1.04,duration:1.7,ease:'power2.out'},38.92);
tl.fromTo('#fp .nmt',{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:.5},39.5); tl.fromTo('#fg .nmt',{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:.5},40.05);

// ================= S12C 100+ WEBSITES 40.55 - 44.18
trZoom('#s12b','#s12c',40.55);
tl.fromTo('#cfw',{autoAlpha:0,y:200},{autoAlpha:1,y:0,duration:.7,ease:'expo.out'},40.6);
const CF0=40.95, CFS=.44;
hooks.push(t=>{const u=Math.max(0,(t-CF0)/CFS);let k=Math.floor(u),f=clamp((u-k)/.55);let idx=Math.min(CF.length-1,k+eio(f));
  CF.forEach((c,i)=>{const d=i-idx,ad=Math.abs(d);const e=document.getElementById('cf'+i);
  e.style.transform=`translateX(${d*600}px) translateZ(${-ad*420}px) rotateY(${clamp(-d*30,-42,42)}deg)`;e.style.opacity=clamp(1-ad*.3,0,1);e.style.zIndex=20-Math.round(ad*2);
  e.querySelector('.nm2').style.opacity=clamp(1-ad*2.2,0,1);e.querySelector('.dm').style.opacity=clamp(ad*.4,0,.55)})});
for(let k=0;k<CF.length-1;k++)sfx(CF0+k*CFS,'swipe',.3);

// ================= S13 IF YOU DON'T LOVE IT (yellow) 44.18 - 46.28
trIris('#s12c','#s13',44.18); drift('#s13',44.18,46.3,1.05,1);
pop('#shield',44.3); sfx(44.3,'pop',.6); sfx(45.74,'impact',1.0); punch(45.76,1.6);

// ================= S14 CTA 46.28 - end
trN('#s13','#s14',46.28,'fade','#000','#FFC400'); drift('#s14',46.28,DUR,1,1.03);
tl.fromTo('#symC',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.6,ease:'power3.inOut'},46.4);
tl.fromTo('#wmC .L',{yPercent:110,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.5,stagger:.04,ease:'expo.out'},46.6);
tl.fromTo('#tgC',{autoAlpha:0},{autoAlpha:1,duration:.6},46.9);
tl.set('#cbtn',{autoAlpha:0},0); fadeUp('#cbtn',47.7,.7,60); sfx(47.7,'tap',.6);
tl.set('#cft2',{autoAlpha:0},0); fadeUp('#cft2',48.2,.6,15);
tl.to('#cur2',{opacity:1,duration:.2},48.4); tl.fromTo('#cur2',{x:0,y:0},{x:-150,y:-170,duration:.6,ease:'power3.inOut'},48.4);
tl.to('#btn',{scale:.94,duration:.08,yoyo:true,repeat:1},49.05); sfx(49.05,'click',1); sfx(49.12,'send',.6);
tl.fromTo('#btn',{scale:1},{scale:1.04,duration:.4,yoyo:true,repeat:1,ease:'sine.inOut',immediateRender:false},49.3);
tl.set({},{},DUR);

const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
window.SFX=SFX; window.DUR=DUR;
window.seek=(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f);return Promise.all($$('img').map(i=>i.complete&&i.naturalWidth?Promise.resolve():i.decode().catch(()=>{})))};
window.ready=document.fonts.ready.then(()=>{fitCaps();return true});
