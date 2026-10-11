const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DUR=53.0, SFX=[], hooks=[];
const sfx=(t,type,g=1)=>SFX.push({t:+t.toFixed(3),type,g});
let seed=7; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)); const eo=x=>1-Math.pow(1-x,4); const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const WT=WORDS.map(w=>w[1]); WT[0]=0.0;

// ================= LOGO
function fillLogo(sym,wm,tg,col){
  $(sym).innerHTML=LOGO.symbol.map(d=>`<path fill="${col}" d="${d}"/>`).join('');
  if(wm)$(wm).innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');
  if(tg)$(tg).innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`}
fillLogo('#sym7','#wm7','#tg7','#000'); fillLogo('#sym15','#wm15','#tg15','#fff'); fillLogo('#nsym',null,null,'#FFC400');

// ================= CAPTION ENGINE
// token syntax: *w* yellow, _w_ marker, ~w~ strike, + = space inside a unit, {n} consumes n spoken words, ^n hidden words, | line break
const SCN={s1:[0,4.55],s2:[4.55,10.85],s3:[10.85,13.42],s4:[13.42,18.62],s5:[18.62,20.02],s6:[20.02,23.08],s7:[23.08,24.05],s8:[24.05,26.25],s9:[26.25,32.22],s10:[32.22,34.2],s11:[34.2,39.66],s12:[39.66,43.75],s13:[43.75,45.33],s14:[45.33,47.1],s15:[47.1,DUR]};
const G=[
 ['s1',760,100,'THE MOST|*EXPENSIVE*|CUSTOMER'],
 ['s1',760,96,'IS THE ONE YOU|NEVER KNEW|YOU _LOST._'],
 ['s2',1090,92,'WE\'VE MANAGED|OVER *$20M*{3}|IN ADS.'],
 ['s2',1090,84,'AND WE\'VE WATCHED|IT HAPPEN|*THOUSANDS*|OF TIMES.'],
 ['s3',1150,104,'THE AD _WORKS._'],
 ['s3',1150,104,'THE CUSTOMER|*CLICKS.*'],
 ['s4',1080,100,'AND THEY LEAVE|IN *3+SECONDS.*{2}'],
 ['s4',1040,88,'BECAUSE THE|WEBSITE{2} DOESN\'T|MAKE THEM|_TRUST_ YOU.'],
 ['s5',780,150,'NOBODY|TELLS *YOU.*'],
 ['s6',1040,96,'IT JUST SHOWS UP|AS A|_SLOW+MONTH._{2}',{dark:1}],
 ['s7',600,34,'AT ^2',{dark:1,lab:1}],
 ['s8',1000,100,'WE FIX THE PART|YOU _CAN\'T+SEE._{2}'],
 ['s9',1010,92,'YOU GET A|*PROFESSIONAL*|WEBSITE{2}'],
 ['s9',1010,92,'BUILT FOR|YOUR BUSINESS'],
 ['s9',1010,92,'AT A PRICE THAT|ACTUALLY|_MAKES+SENSE._{2}'],
 ['s10',1000,104,'AND YOU PAY|_NOTHING_|UP FRONT.',{dark:1}],
 ['s11',1060,104,'WE BUILD IT|*FIRST.*'],
 ['s11',1060,104,'YOU _REVIEW_ IT.'],
 ['s11',1060,100,'CHANGE WHATEVER|YOU WANT.'],
 ['s11',1060,100,'AND ONLY WHEN|YOU _LOVE+IT._{2}'],
 ['s12',1000,120,'YOU PAY'],
 ['s12',1000,150,'*ONE+TIME.*{2}'],
 ['s12',1000,116,'NO MONTHLY|FEES.'],
 ['s12',960,230,'_EVER._'],
 ['s13',1120,112,'BUILT BY|_REAL+PEOPLE._{2}',{shd:1}],
 ['s14',640,200,'NEVER|BY ~AI.~{2}',{dark:1}],
 ['s15',650,100,'SEND US|A MESSAGE'],
 ['s15',650,92,'AND STOP LOSING|CUSTOMERS|IN _SILENCE._'],
];
const GROUPS=[]; let wi=0;
G.forEach((g,gi)=>{const [sc,y,fs,txt,o={}]=g;const el=document.createElement('div');el.className='cap'+(o.dark?' dark':'')+(o.shd?' shd':'');
  el.style.top=y+'px';el.style.fontSize=fs+'px';if(o.lab){el.style.fontWeight=600;el.style.letterSpacing='.42em'}
  const units=[];
  txt.split('|').forEach(line=>{const ln=document.createElement('span');ln.className='ln';
    line.split(' ').forEach(tok=>{let n=1,m;
      if((m=tok.match(/^\^(\d+)$/))){wi+=+m[1];return}
      if((m=tok.match(/\{(\d+)\}$/))){n=+m[1];tok=tok.replace(/\{\d+\}$/,'')}
      let kind='';if(/^\*.*\*$/.test(tok)){kind='yel';tok=tok.slice(1,-1)}else if(/^_.*_$/.test(tok)){kind='mk';tok=tok.slice(1,-1)}else if(/^~.*~$/.test(tok)){kind='sk';tok=tok.slice(1,-1)}
      const text=tok.replace(/\+/g,' ');const u=document.createElement('span');u.className='cw'+(kind==='yel'?' yel':'');
      u.innerHTML=(kind==='mk'?'<i class="hl"></i>':'')+'<span class="on"></span><i class="crt"></i><span class="off"></span>'+(kind==='sk'?'<i class="sk"></i>':'')+(kind==='mk'&&!o.dark?`<span class="bk2">${text}</span>`:'');
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
// crowd 8x4
{let h='';for(let r=0;r<4;r++)for(let c=0;c<8;c++){const i=r*8+c;h+=`<svg class="person" id="pr${i}" style="left:${122+c*110}px;top:${r*104}px" viewBox="0 0 190 220"><circle cx="95" cy="62" r="52" fill="#fff"/><path d="M8 220c4-60 42-96 87-96s83 36 87 96z" fill="#fff"/></svg>`}$('#crowd').innerHTML=h}
// logos
const LBG=['#fff','#fff','#000','#fff','#f7f7f7','#fff','#fff','#12110f','#fff','#fff','#fff','#f1f0ec'];
const lrow=(id,order)=>{$(id).innerHTML=order.concat(order).map(i=>`<div class="lt" style="background:${LBG[i]}"><img src="lg/l${i}.jpg"></div>`).join('')};
lrow('#rowA',[0,1,2,3,4,5,6,7,8,9,10,11]); lrow('#rowB',[6,10,3,8,1,11,7,2,9,4,0,5]);
// dots field 22x16
{let h='';for(let r=0;r<16;r++)for(let c=0;c<22;c++)h+=`<i id="dt${r*22+c}" style="left:${88+c*42}px;top:${40+r*42}px"></i>`;$('#dots').innerHTML=h}
// cheap sites
const CHEAP=`<div style="background:#ddd;padding:12px;text-align:center;font:bold 18px 'Liberation Serif'">*** WELCOME TO OUR WEBSITE!!! ***</div>
<div style="padding:30px 24px 10px;text-align:center"><div style="font:bold 58px/1 'Liberation Serif';text-decoration:underline">JOE'S PLUMBING</div><div style="font:italic 26px 'Liberation Serif';margin-top:12px">Best Prices In Town!!!</div></div>
<div style="margin:18px 24px;height:200px;border:3px ridge #999;background:repeating-linear-gradient(45deg,#ccc 0 10px,#eee 10px 20px);display:flex;align-items:center;justify-content:center;font:bold 22px 'Liberation Serif'">[ IMAGE NOT FOUND ]</div>
<div style="padding:0 24px;font:22px/1.35 'Liberation Serif'">We are a family owned business since 1998. Call us today for a FREE estimate. <u>Click here</u> for more info. <u>Contact</u> | <u>About</u></div>`;
$('#cheap').innerHTML=CHEAP; $('#cheap2').innerHTML=CHEAP;
// scan tags
$('#tags').innerHTML=['Design','Speed','Trust','Mobile'].map((k,i)=>`<span class="chip tg" id="tg${i}" style="background:#141414;color:#fff;box-shadow:0 0 0 1.5px #2a2a2a;font-size:20px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFC400" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>${k}</span>`).join('');
// carousel
const CF=[['c/alpha.jpg','Alpha Team · Albany, NY'],['c/brother.jpg','Brothers Assis Electrical · PA'],['vC','Alpha Vertical'],['c/deck.jpg','Deck & Fence · NJ'],['c/jgc.jpg','JGC General Contractor · MN'],['vD','Home remodeling'],['c/poenza.jpg','Poenza · Dental clinic'],['c/kundara.jpg','Kundara · Massage studio']];
$('#cft').innerHTML=CF.map((c,i)=>`<div class="cf" id="cf${i}">${card(c[0],c[1].split(' · ')[0])}<div class="nm2">${c[1]}</div></div>`).join('');
// months
$('#months').innerHTML=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i)=>`<div class="mo" id="mo${i}">${m.toUpperCase()}<i class="st"></i></div>`).join('');
// slices
$('#slices').innerHTML=[0,1,2,3,4,5].map(i=>`<i style="top:${i*16.66}%"></i>`).join('');
// video sequences
const VS={vC:[[26.2,32.3,'v2',8.6]],vD:[[29.5,32.3,'v1',0.8]],vB:[[34.1,36.9,'v2',3.0],[36.9,39.7,'v2',12.8]]};
const VMAX={v1:408,v2:502};
hooks.push(t=>{for(const id in VS){const el=document.getElementById(id);let seg=VS[id].find(s=>t>=s[0]&&t<s[1]);if(!seg)seg=t<VS[id][0][0]?VS[id][0]:VS[id][VS[id].length-1];
  const fr=Math.min(VMAX[seg[2]],Math.max(1,Math.round((clamp(t,seg[0],seg[1])-seg[0]+seg[3])*30)+1));const src=`${seg[2]}/f${String(fr).padStart(4,'0')}.jpg`;if(el.getAttribute('src')!==src)el.setAttribute('src',src)}});

// ================= TIMELINE HELPERS
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
const show=(s,t)=>tl.set(s,{visibility:'visible'},t), hide=(s,t)=>tl.set(s,{visibility:'hidden'},t);
function punch(t,k=1){tl.fromTo('#cam',{scale:1+.022*k},{scale:1,duration:.5,ease:'expo.out',immediateRender:false},t)}
function fadeUp(s,t,d=.6,y=40){tl.fromTo(s,{autoAlpha:0,y},{autoAlpha:1,y:0,duration:d,ease:'expo.out'},t)}
function pop(s,t,d=.5){tl.fromTo(s,{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,duration:d,ease:'back.out(2)'},t)}
function drift(s,a,b,f=1,to=1.04){const d=$(s+' .drift')?s+' .drift':s;tl.fromTo(d,{scale:f},{scale:to,duration:b-a,ease:'none'},a)}
function flash(t,a=.7){tl.fromTo('#flash',{opacity:a},{opacity:0,duration:.4,ease:'power2.out',immediateRender:false},t)}
// transitions
function trWhip(a,b,t,dir=1){tl.fromTo(a,{xPercent:0,filter:'blur(0px)'},{xPercent:-100*dir,filter:'blur(26px)',duration:.38,ease:'power4.in',immediateRender:false},t-.38);hide(a,t);
  show(b,t);tl.fromTo(b,{xPercent:100*dir,filter:'blur(26px)'},{xPercent:0,filter:'blur(0px)',duration:.45,ease:'power4.out',immediateRender:false},t);sfx(t-.4,'air',1)}
function trVert(a,b,t,dir=1){tl.fromTo(a,{yPercent:0,filter:'blur(0px)'},{yPercent:-100*dir,filter:'blur(20px)',duration:.38,ease:'power4.in',immediateRender:false},t-.38);hide(a,t);
  show(b,t);tl.fromTo(b,{yPercent:100*dir,filter:'blur(20px)'},{yPercent:0,filter:'blur(0px)',duration:.45,ease:'power4.out',immediateRender:false},t);sfx(t-.4,'air',1)}
function trWipe(a,b,t,k=.8){const L=$$('#wipe i');tl.fromTo(L,{yPercent:-110},{yPercent:0,duration:.3*k,stagger:.05*k,ease:'power3.in',immediateRender:false},t-.45*k);
  hide(a,t);show(b,t);tl.to(L,{yPercent:110,duration:.36,stagger:.05,ease:'power3.out',immediateRender:false},t+.02);tl.set(L,{yPercent:-110},t+.75);sfx(t-.45*k,'air',1)}
function trZoom(a,b,t){tl.fromTo(a,{scale:1,filter:'blur(0px)',opacity:1},{scale:1.9,filter:'blur(22px)',opacity:0,duration:.34,ease:'power3.in',immediateRender:false},t-.34);hide(a,t);
  show(b,t);tl.fromTo(b,{scale:.7,filter:'blur(20px)',opacity:0},{scale:1,filter:'blur(0px)',opacity:1,duration:.5,ease:'expo.out',immediateRender:false},t);sfx(t-.36,'zoom',.9)}
function trSlice(a,b,t){const L=$$('#slices i');tl.fromTo(L,{xPercent:i=>i%2?110:-110},{xPercent:0,duration:.26,stagger:.03,ease:'power3.in',immediateRender:false},t-.42);
  hide(a,t);show(b,t);tl.to(L,{xPercent:i=>i%2?-110:110,duration:.32,stagger:.03,ease:'power3.out',immediateRender:false},t+.02);tl.set(L,{xPercent:110},t+.6);sfx(t-.42,'swish',.9)}
function trCut(a,b,t,k=1.2){hide(a,t);show(b,t);if(k)punch(t,k)}
// NewWay "N" transition: the brand symbol flies at camera and fills the frame
let NO=null;
function trN(a,b,t,out='fade',col='#FFC400'){tl.set('#nmask',{visibility:'visible'},t-.55);tl.set('#nsym path',{attr:{fill:col}},t-.56);tl.set('#nmask .nfill',{backgroundColor:col},t-.56);
  tl.fromTo('#nsym',{scale:.25,x:290,y:820,rotation:0,opacity:0},{scale:1,opacity:1,duration:.22,ease:'expo.out',immediateRender:false},t-.55);
  tl.to('#nsym',{scale:60,duration:.33,ease:'power4.in',immediateRender:false},t-.33);
  tl.fromTo('#nmask .nfill',{opacity:0},{opacity:1,duration:.06,immediateRender:false},t-.06);
  hide(a,t);show(b,t);
  if(out==='fade')tl.to('#nmask .nfill',{opacity:0,duration:.4,ease:'power2.out',immediateRender:false},t+.05);
  else tl.to('#nmask .nfill',{yPercent:-100,duration:.45,ease:'power4.inOut',immediateRender:false},t+.05);
  tl.set('#nsym',{opacity:0},t+.0);tl.set('#nmask',{visibility:'hidden'},t+.55);tl.set('#nmask .nfill',{opacity:0,yPercent:0},t+.56);
  sfx(t-.6,'riser',.8);sfx(t-.05,'boom',.9)}

// ================= S1 HOOK 0 - 4.55
show('#s1',0); drift('#s1',0,4.6,1,1.06);
tl.fromTo('#crowd .person',{opacity:.0,y:30},{opacity:.92,y:0,duration:.5,stagger:{each:.012,from:'random'},ease:'expo.out'},0);
tl.set('#crowd .person',{opacity:.92},0);
gsap.set('#slices i',{xPercent:110});
const LIGHT=[[20.0,24.1],[32.2,34.22],[45.3,47.1]];hooks.push(t=>{$('#vign').style.opacity=LIGHT.some(([a,b])=>t>=a&&t<b)?0:1});
const TARGET='#pr13';
tl.to('#crowd .person:not(#pr13)',{opacity:.28,duration:.6},2.3);
tl.to(TARGET,{scale:1.35,duration:.5,ease:'back.out(2)'},2.38); tl.set(TARGET+' *',{attr:{fill:'#FFC400'}},2.38); sfx(2.38,'pop',.6);
tl.to(TARGET,{opacity:0,y:-60,filter:'blur(14px)',duration:.7,ease:'power2.in'},3.82); sfx(3.85,'impact',1.0); punch(3.86,1.4);
[0,1.0,2.0,3.0].forEach(t=>sfx(t,'heart',t?.9:1.1)); sfx(0,'boom',.7);

// ================= S2 $20M 4.55 - 10.85
trSlice('#s1','#s2',4.55); drift('#s2',4.55,10.9,1,1.04);
fadeUp('#s2l',4.6,.5,14);
tl.fromTo('#s2n',{scale:.6,autoAlpha:0},{scale:1,autoAlpha:1,duration:.6,ease:'expo.out'},5.0);
hooks.push(t=>{$('#mn').textContent=Math.round(eo(clamp((t-5.2)/1.4))*20)});
for(let i=0;i<9;i++)sfx(5.2+i*.15,'tick',.3); sfx(6.5,'impact',.85); punch(6.55,1.1);
tl.fromTo('#rowA',{x:0},{x:-600,duration:3.7,ease:'none'},4.6); tl.fromTo('#rowB',{x:-1200},{x:-600,duration:3.7,ease:'none'},4.6);
tl.fromTo('#s2 .lt',{scale:.5,autoAlpha:0},{scale:1,autoAlpha:1,duration:.5,stagger:{each:.02,from:'center'},ease:'back.out(2)'},6.7); sfx(6.7,'shimmer',.4);
tl.to('#s2top',{yPercent:-12,autoAlpha:0,filter:'blur(12px)',duration:.4,ease:'power3.in'},7.9);
show('#dots',8.2);
tl.fromTo('#dots i',{scale:0},{scale:1,duration:.4,stagger:{each:.0015,from:'center'},ease:'back.out(2)'},8.2);
{const ids=[...Array(352).keys()].sort(()=>rnd()-.5);ids.forEach((d,k)=>{const t=9.0+k/352*1.6;tl.to('#dt'+d,{opacity:.1,scale:.5,duration:.12},t)});for(let i=0;i<14;i++)sfx(9.0+i*.115,'tick',.22)}

// ================= S3 AD WORKS 10.85 - 13.42
trZoom('#s2','#s3',10.85); drift('#s3',10.85,13.45,1,1.03);
tl.fromTo('#ad',{y:240,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,ease:'expo.out'},10.9);
tl.fromTo('#adok .mt',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.4,stagger:.12,ease:'back.out(2)'},11.4); [0,1,2].forEach(i=>sfx(11.4+i*.12,'pop',.4));
tl.to('#cur',{opacity:1,duration:.15},12.15);tl.fromTo('#cur',{x:0,y:0},{x:-30,y:-530,duration:.65,ease:'power3.inOut'},12.15);
tl.to('#ctab',{scale:.92,duration:.07,yoyo:true,repeat:1},12.92); sfx(12.92,'click',1.1);
tl.fromTo('#rip',{scale:.5,opacity:1},{scale:6,opacity:0,duration:.6,ease:'power2.out'},12.92);
tl.to('#ctab',{backgroundColor:'#FFC400',duration:.1},12.92);

// ================= S4 LEAVE 3s / TRUST 13.42 - 18.62
trZoom('#s3','#s4',13.42); drift('#s4',13.42,18.65,1,1.03);
tl.fromTo('#bw4',{y:200,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},13.45);
tl.fromTo('#spin',{rotation:0},{rotation:720,duration:.6,ease:'none'},13.45);
tl.set('#cheap',{opacity:1},14.05); sfx(14.05,'glitch',.5);
tl.set('#cd',{opacity:1},14.75);
hooks.push(t=>{const p=clamp((t-14.75)/1.0);$('#cdr').setAttribute('stroke-dashoffset',(1068*p).toFixed(1));$('#cdn').textContent=t<15.08?'3':t<15.41?'2':'1'});
[14.75,15.08,15.41].forEach(t=>{sfx(t,'tick',.8);tl.fromTo('#cdn',{scale:1.25},{scale:1,duration:.25,ease:'expo.out',immediateRender:false},t)});
tl.to('#bw4',{scaleY:.02,scaleX:.6,autoAlpha:0,duration:.32,ease:'power4.in'},15.6); sfx(15.6,'swish',.7);
tl.fromTo('#left',{opacity:0,y:30},{opacity:1,y:0,duration:.35,ease:'expo.out'},15.85); sfx(15.85,'notif',.5);
tl.to('#left',{opacity:0,y:-30,duration:.3},16.6);
tl.to('#gauge',{opacity:1,duration:.4},16.75);
hooks.push(t=>{const p=eio(clamp((t-17.2)/1.0));const v=90-78*p;$('#gv').textContent=Math.round(v);$('#gfill').setAttribute('stroke-dashoffset',(880*(1-v/100)).toFixed(1));$('#needle').style.transform=`rotate(${-90+180*v/100}deg)`});
sfx(17.2,'riser',.35); sfx(18.15,'impact',.7);

// ================= S5 NOBODY TELLS YOU 18.62 - 20.02 (silence)
trCut('#s4','#s5',18.62,0); drift('#s5',18.62,20.05,1.04,1);
fadeUp('#nonot',18.9,.8,10);

// ================= S6 SLOW MONTH (white) 20.02 - 23.08
trWipe('#s5','#s6',20.02); drift('#s6',20.02,23.1,1,1.03);
tl.fromTo('#chart',{y:120,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},20.05);
{const L=$('#cline').getTotalLength();$('#cline').style.strokeDasharray=L;tl.fromTo('#cline',{strokeDashoffset:L},{strokeDashoffset:0,duration:1.8,ease:'power1.inOut'},20.3);
 tl.fromTo('#carea',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1.8,ease:'power1.inOut'},20.3)}
tl.set(['#cdot','#tmchip'],{autoAlpha:0},0); pop('#cdot',22.1); pop('#tmchip',22.2); sfx(22.15,'impact',.6); sfx(20.3,'riser',.25);

// ================= S7 AT NEWWAY (yellow) 23.08 - 24.05
trN('#s6','#s7',23.08); drift('#s7',23.08,24.1,1.06,1);
tl.fromTo('#symw',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.45,ease:'power3.inOut'},23.2);
tl.fromTo('#wm7 .L',{yPercent:110,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.45,stagger:.04,ease:'expo.out'},23.42); for(let i=0;i<6;i++)sfx(23.42+i*.06,'key',.9);
tl.fromTo('#tg7',{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.4},23.75);

// ================= S8 FIX WHAT YOU CAN'T SEE 24.05 - 26.25
trSlice('#s7','#s8',24.05); drift('#s8',24.05,26.3,1,1.03);
tl.fromTo('#scan',{y:200,autoAlpha:0},{y:0,autoAlpha:1,duration:.6,ease:'expo.out'},24.08);
hooks.push(t=>{const p=eio(clamp((t-24.6)/1.3));$('#pro').style.clipPath=`inset(0 0 ${100-p*100}% 0)`;$('#sline').style.top=(p*437-2)+'px';$('#sline').style.opacity=p>0&&p<1?1:0;
  $('#scurl').textContent=p>.6?'alphateam · NewWay build':'yourbusiness.com'});
sfx(24.6,'riser',.45);
tl.fromTo('#tags .tg',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.35,stagger:.28,ease:'back.out(2)'},24.8); [0,1,2,3].forEach(i=>sfx(24.8+i*.28,'tap',.45));
sfx(25.95,'shimmer',.4);

// ================= S9 CAROUSEL 26.25 - 32.22
trWhip('#s8','#s9',26.25);
tl.fromTo('#cfw',{autoAlpha:0,y:220},{autoAlpha:1,y:0,duration:.7,ease:'expo.out'},26.3);
const CF0=26.8, CFS=.72;
hooks.push(t=>{const u=Math.max(0,(t-CF0)/CFS);let k=Math.floor(u),f=clamp((u-k)/.55);let idx=Math.min(CF.length-1,k+eio(f));
  CF.forEach((c,i)=>{const d=i-idx,ad=Math.abs(d);const e=document.getElementById('cf'+i);
  e.style.transform=`translateX(${d*600}px) translateZ(${-ad*420}px) rotateY(${clamp(-d*30,-42,42)}deg)`;e.style.opacity=clamp(1-ad*.3,0,1);e.style.zIndex=20-Math.round(ad*2);
  e.querySelector('.nm2').style.opacity=clamp(1-ad*2.2,0,1);e.querySelector('.dm').style.opacity=clamp(ad*.4,0,.55)})});
for(let k=0;k<CF.length-1;k++)sfx(CF0+k*CFS,'swipe',.3);

// ================= S10 $0 UP FRONT (white) 32.22 - 34.2
trVert('#s9','#s10',32.22); drift('#s10',32.22,34.25,1,1.03);
tl.fromTo('#rcpt',{y:160,autoAlpha:0,rotation:-2},{y:0,autoAlpha:1,rotation:0,duration:.7,ease:'expo.out'},32.25);
tl.fromTo('#rcpt .rr',{autoAlpha:0,x:-30},{autoAlpha:1,x:0,duration:.35,stagger:.1},32.45); [0,1,2].forEach(i=>sfx(32.45+i*.1,'tick',.4));
tl.fromTo('#due',{scale:2.2,autoAlpha:0},{scale:1,autoAlpha:1,duration:.32,ease:'expo.out'},33.02); sfx(33.02,'stamp',.9); punch(33.05,1.4);

// ================= S11 BUILD / REVIEW / CHANGE 34.2 - 39.66
trWhip('#s10','#s11',34.2); drift('#s11',34.2,39.7,1,1.03);
tl.fromTo('#vcB',{y:300,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,ease:'expo.out'},34.25);
tl.fromTo('#wire',{clipPath:'inset(0 0 0 0%)'},{clipPath:'inset(0 0 0 100%)',duration:.8,ease:'power3.inOut'},34.75); sfx(34.75,'swipe',.6);
tl.fromTo('#steps',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.5},34.35);
[['#p1',34.4],['#p2',35.83],['#p3',36.78]].forEach(([s,t],i)=>{tl.to(s,{backgroundColor:'#FFC400',color:'#000',duration:.15},t);if(i)tl.to(['#p1','#p2'][i-1],{backgroundColor:'#141414',color:'#fff',duration:.15},t);sfx(t,'tap',.6)});
tl.set(['#b1','#b2','#appr'],{autoAlpha:0},0);
tl.fromTo('#b1',{autoAlpha:0,scale:.6,y:20},{autoAlpha:1,scale:1,y:0,duration:.4,ease:'back.out(2)'},36.0); sfx(36.0,'msg',.6);
tl.fromTo('#b2',{autoAlpha:0,scale:.6,y:20},{autoAlpha:1,scale:1,y:0,duration:.4,ease:'back.out(2)'},37.2); sfx(37.2,'msg',.6);
tl.to(['#b1','#b2'],{autoAlpha:0,y:-20,duration:.3},38.9);
pop('#appr',39.38); sfx(39.38,'chime',.8);

// ================= S12 ONE TIME / NO MONTHLY / EVER 39.66 - 43.75
trZoom('#s11','#s12',39.66); drift('#s12',39.66,43.8,1,1.03);
tl.set('#tkt',{autoAlpha:0},0); tl.fromTo('#tkt',{autoAlpha:0,y:-80,rotation:-4},{autoAlpha:1,y:0,rotation:0,duration:.5,ease:'back.out(1.6)'},40.67); sfx(40.67,'stamp',.8); punch(40.7,1);
tl.fromTo('#months .mo',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.35,stagger:.03,ease:'expo.out'},41.68); sfx(41.68,'air',.4);
tl.to('#months .st',{scaleX:1,duration:.2,stagger:.025,ease:'power3.out'},42.4); for(let i=0;i<12;i++)sfx(42.4+i*.025,'tick',.25); sfx(42.4,'swipe',.6);
tl.to('#months .mo',{opacity:.35,duration:.3},42.75);
sfx(43.06,'impact',1.1); punch(43.08,1.8); flash(43.06,.25);

// ================= S13 REAL PEOPLE 43.75 - 45.33
trSlice('#s12','#s13',43.75);
tl.to('#fdiv',{scaleY:1,duration:.5,ease:'power3.inOut'},43.8);
tl.fromTo('#fp',{yPercent:100},{yPercent:0,duration:.6,ease:'expo.out',immediateRender:false},43.75); tl.fromTo('#fg',{yPercent:-100},{yPercent:0,duration:.6,ease:'expo.out',immediateRender:false},43.9);
tl.set(['#fp','#fg'],{yPercent:100},0);
tl.fromTo(['#fp img','#fg img'],{scale:1.18},{scale:1.04,duration:1.6,ease:'power2.out'},43.75);
fadeUp(['#fp .nmt','#fg .nmt'],44.1,.5,-16); sfx(43.78,'air',.6);

// ================= S14 NEVER BY AI (yellow) 45.33 - 46.98
trCut('#s13','#s14',45.33,1.4); flash(45.33,.35); drift('#s14',45.33,47.0,1.06,1);
pop('#spk',45.4); sfx(45.4,'shimmer',.4); tl.to('#spk',{autoAlpha:.15,duration:.3},46.5); sfx(45.36,'impact',.9);

// ================= S15 CTA 46.98 - end
trN('#s14','#s15',47.1,'up','#000'); drift('#s15',47.1,DUR,1,1.03);
tl.fromTo('#sym15',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.6,ease:'power3.inOut'},47.1);
tl.fromTo('#wm15 .L',{yPercent:110,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.5,stagger:.04,ease:'expo.out'},47.3);
tl.fromTo('#tg15',{autoAlpha:0},{autoAlpha:1,duration:.6},47.6);
tl.set('#s15btn',{autoAlpha:0},0); fadeUp('#s15btn',50.0,.7,60); sfx(50.0,'tap',.6); sfx(50.6,'impact',.7);
tl.fromTo('#btn',{scale:1},{scale:1.05,duration:.45,yoyo:true,repeat:5,ease:'sine.inOut',immediateRender:false},50.8);
tl.set('#s15f',{autoAlpha:0},0); fadeUp('#s15f',50.7,.6,15);
tl.set({},{},DUR);

const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
window.SFX=SFX; window.DUR=DUR;
window.seek=(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f);return Promise.all($$('img').map(i=>i.complete&&i.naturalWidth?Promise.resolve():i.decode().catch(()=>{})))};
window.ready=document.fonts.ready.then(()=>{fitCaps();return true});
