const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DUR=39.5, SFX=[], hooks=[];
const sfx=(t,type,g=1)=>SFX.push({t:+t.toFixed(3),type,g});
let seed=5; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)); const eo=x=>1-Math.pow(1-x,4); const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
function fillLogo(sym,wm,tg,col,symCol){
  $(sym).innerHTML=LOGO.symbol.map(d=>`<path fill="${symCol||col}" d="${d}"/>`).join('');
  if(wm)$(wm).innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');
  if(tg)$(tg).innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`}
fillLogo('#sym4','#wm4','#tg4','#fff','#FFC400'); fillLogo('#sym11','#wm11','#tg11','#000'); fillLogo('#nsym',null,null,'#000');
$('#nline').innerHTML=LOGO.symbol.map(d=>`<path class="nl" fill="#FFC400" fill-opacity="0" stroke="#FFC400" stroke-width="1.4" stroke-linejoin="round" d="${d}"/>`).join('');

// ================= TIMED CAPTION ENGINE (typed, one key per letter)
const SCN={s1:[0,3.3],s2:[3.3,6.6],s3:[6.6,9.9],s4:[9.9,13.4],s5:[13.4,16.7],s6:[16.7,20.0],s7:[20.0,23.3],s8:[23.3,26.6],s9:[26.6,31.2],s10:[31.2,34.4],s11:[34.4,DUR]};
const G=[
 [3.6,'s2',740,124,'EVERY BUSINESS|DESERVES TO BE|*SEEN.*'],
 [7.0,'s3',960,100,'BUT MOST WEBSITES|LOOK _THE+SAME._',{dark:1}],
 [11.35,'s4',1110,74,'A NEW WAY *FORWARD.*'],
 [13.75,'s5',1040,130,'WEBSITES|THAT _CONVERT._'],
 [17.7,'s6',1080,150,'ADS THAT|*SCALE.*'],
 [20.7,'s7',1030,96,'WEBSITES DELIVERED|ACROSS THE *U.S.*'],
 [23.85,'s8',1130,112,'BUILT BY|_REAL+PEOPLE._',{shd:1}],
 [25.3,'s8',1130,100,'NOT ~AI.~|NOT ~TEMPLATES.~',{shd:1}],
 [27.05,'s9',395,58,'WE BUILD IT *FIRST.*',{keep:1}],
 [28.0,'s9',645,58,'YOU REVIEW & CHANGE.',{keep:1}],
 [28.95,'s9',865,56,'PAY ONLY WHEN|YOU _LOVE+IT._',{keep:1}],
 [31.6,'s10',1000,124,'ONE *PAYMENT.*'],
 [32.55,'s10',990,118,'NO MONTHLY|_FEES._'],
 [36.2,'s11',1130,84,'SEND US A|_MESSAGE._',{dark:1,inv:1}],
];
const GROUPS=[];
G.forEach(g=>{const [t0,sc,y,fs,txt,o={}]=g;const el=document.createElement('div');el.className='cap'+(o.dark?' dark':'')+(o.shd?' shd':'')+(o.inv?' inv':'');
  el.style.top=y+'px';el.style.fontSize=fs+'px';const units=[];let t=t0;
  txt.split('|').forEach(line=>{const ln=document.createElement('span');ln.className='ln';
    line.split(' ').forEach(tok=>{let kind='';if(/^\*.*\*$/.test(tok)){kind='yel';tok=tok.slice(1,-1)}else if(/^_.*_$/.test(tok)){kind='mk';tok=tok.slice(1,-1)}else if(/^~.*~$/.test(tok)){kind='sk';tok=tok.slice(1,-1)}
      const text=tok.replace(/\+/g,' ');const u=document.createElement('span');u.className='cw'+(kind==='yel'?' yel':'');
      u.innerHTML=(kind==='mk'?'<i class="hl"></i>':'')+'<span class="on"></span><i class="crt"></i><span class="off"></span>'+(kind==='sk'?'<i class="sk"></i>':'')+(kind==='mk'&&(!o.dark||o.inv)?`<span class="bk2">${text}</span>`:'');
      ln.appendChild(u);ln.appendChild(document.createTextNode(' '));
      const dur=Math.max(.1,text.length*.042);units.push({el:u,text,kind,t,dur,tend:t+dur});t+=dur+.07});
    el.appendChild(ln)});
  $('#'+sc+' .caps').appendChild(el);GROUPS.push({el,sc,units,t:t0,keep:o.keep})});
GROUPS.forEach((g,gi)=>{const nx=GROUPS.slice(gi+1).find(h=>h.sc===g.sc&&!g.keep);g.end=nx?nx.t:SCN[g.sc][1]+.6;
  g.units.forEach(u=>{let k=0;for(let c=0;c<u.text.length;c++)if(/[A-Z0-9$&]/i.test(u.text[c]))sfx(u.t+u.dur*c/u.text.length,'key',k++?.75+.25*rnd():1);
    if(u.kind==='mk')sfx(u.tend+.02,'swipe',.35);if(u.kind==='sk')sfx(u.tend-.05,'swipe',.6)})});
hooks.push(t=>{GROUPS.forEach(g=>{const vis=t>=g.t-.001&&t<g.end;g.el.style.visibility=vis?'visible':'hidden';if(!vis)return;
  const xp=clamp((t-(g.end-.16))/.16);g.el.style.opacity=1-xp;g.el.style.transform=`translateY(${-28*eo(xp)}px)`;g.el.style.filter=xp>0?`blur(${8*xp}px)`:'none';
  let last=null;g.units.forEach(u=>{if(t>=u.t)last=u});
  g.units.forEach(u=>{const L=u.text.length;const p=clamp((t-u.t)/u.dur);const n=t<u.t?0:Math.max(1,Math.round(p*L));
    u.el.children[u.kind==='mk'?1:0].textContent=u.text.slice(0,n);u.el.querySelector('.off').textContent=u.text.slice(n);
    const crt=u.el.querySelector('.crt');const on=u===last&&(p<1||Math.floor((t-u.tend)/.27)%2===1);crt.style.display=on&&t<g.end-.2&&(t<u.tend+1.2)?'inline-block':'none';
    const sp=clamp((t-u.t)/.22);const pop=(u.kind?1.14:1.05);u.el.style.transform=t<u.t?'none':`translateY(${(1-eo(sp))*16}px) scale(${1+(pop-1)*(1-eo(sp))})`;
    if(u.kind==='mk'){const q=eo(clamp((t-u.tend)/.24));u.el.querySelector('.hl').style.transform=`scaleX(${q})`;const b=u.el.querySelector('.bk2');if(b)b.style.clipPath=`inset(0 ${(1-q)*100}% 0 0)`}
    if(u.kind==='sk'){u.el.querySelector('.sk').style.transform=`scaleX(${eo(clamp((t-u.tend+.05)/.18))})`}
  })})});
function fitCaps(){GROUPS.forEach(g=>{const lines=[...g.el.querySelectorAll('.ln')];g.units.forEach(u=>{u.el.querySelector('.off').textContent=u.text});
  const mw=Math.max(...lines.map(l=>l.scrollWidth));if(mw>950){g.el.style.fontSize=(parseFloat(g.el.style.fontSize)*950/mw)+'px'}})}

// ================= BUILDERS
const card=(src,name)=>`<div class="sc"><div class="sb"><i></i><i></i><i></i><b>${name}</b></div><div class="si"><img ${src.startsWith('v')?`class="vf" id="${src}"`:`src="${src}"`}><div class="dm"></div></div></div>`;
const LBG=['#fff','#fff','#000','#fff','#f7f7f7','#fff','#fff','#12110f','#fff','#fff','#fff','#f1f0ec'];
const lrow=(id,order)=>{$(id).innerHTML=order.concat(order).map(i=>`<div class="lt" style="background:${LBG[i]}"><img src="lg/l${i}.jpg"></div>`).join('')};
lrow('#rowA',[0,1,2,3,4,5,6,7,8,9,10,11]); lrow('#rowB',[6,10,3,8,1,11,7,2,9,4,0,5]);
// identical template wireframes 3x3
{let h='';for(let i=0;i<9;i++){const c=i%3,r=Math.floor(i/3);h+=`<div class="tw" id="tw${i}" style="position:absolute;left:${c*310}px;top:${r*215}px;width:280px;height:190px;border-radius:16px;background:#ececec;overflow:hidden">
 <i style="position:absolute;left:18px;top:16px;width:60px;height:10px;border-radius:5px;background:#cfcfcf"></i><i style="position:absolute;right:18px;top:16px;width:90px;height:10px;border-radius:5px;background:#d8d8d8"></i>
 <i style="position:absolute;left:40px;top:58px;width:200px;height:20px;border-radius:6px;background:#cdcdcd"></i><i style="position:absolute;left:70px;top:88px;width:140px;height:12px;border-radius:6px;background:#dadada"></i>
 <i style="position:absolute;left:95px;top:120px;width:90px;height:26px;border-radius:8px;background:#c4c4c4"></i></div>`}
 h+=`<div id="real" style="position:absolute;left:310px;top:215px;width:280px;height:190px;border-radius:16px;overflow:hidden;opacity:0;box-shadow:0 0 0 5px #FFC400,0 30px 60px rgba(0,0,0,.35)"><img src="c/t_alpha.jpg" style="width:100%;height:100%;object-fit:cover"></div>`;$('#same').innerHTML=h}
const CF=[['c/alpha.jpg','Alpha Team · Albany, NY'],['c/brother.jpg','Brothers Assis Electrical · PA'],['vC','Alpha Vertical'],['c/deck.jpg','Deck & Fence · NJ'],['c/jgc.jpg','JGC General Contractor · MN'],['c/poenza.jpg','Poenza · Dental clinic'],['c/kundara.jpg','Kundara · Massage studio']];
$('#cft').innerHTML=CF.map((c,i)=>`<div class="cf" id="cf${i}">${card(c[0],c[1].split(' · ')[0])}<div class="nm2">${c[1]}</div></div>`).join('');
const TG=['alpha','brother','jgc','deck','poenza','kundara'];
$('#tg').innerHTML=TG.map((k,i)=>`<div class="tt" id="tt${i}" style="left:${(i%3)*324}px;top:${Math.floor(i/3)*170}px;width:300px;height:146px"><img src="c/t_${k}.jpg"></div>`).join('');
$('#months').innerHTML=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i)=>`<div class="mo">${m.toUpperCase()}<i class="st"></i></div>`).join('');
const VS={vC:[[13.3,16.8,'v2',3.6]]};const VMAX={v1:408,v2:502};
hooks.push(t=>{for(const id in VS){const el=document.getElementById(id);let seg=VS[id].find(s=>t>=s[0]&&t<s[1]);if(!seg)seg=t<VS[id][0][0]?VS[id][0]:VS[id][VS[id].length-1];
  const fr=Math.min(VMAX[seg[2]],Math.max(1,Math.round((clamp(t,seg[0],seg[1])-seg[0]+seg[3])*30)+1));const src=`${seg[2]}/f${String(fr).padStart(4,'0')}.jpg`;if(el.getAttribute('src')!==src)el.setAttribute('src',src)}});
const LIGHT=[[6.4,10.0],[34.1,DUR]];hooks.push(t=>{$('#vign').style.opacity=LIGHT.some(([a,b])=>t>=a&&t<b)?0:1});

// ================= TIMELINE + clean transitions
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
const show=(s,t)=>tl.set(s,{visibility:'visible'},t), hide=(s,t)=>tl.set(s,{visibility:'hidden'},t);
function punch(t,k=1){tl.fromTo('#cam',{scale:1+.02*k},{scale:1,duration:.55,ease:'expo.out',immediateRender:false},t)}
function fadeUp(s,t,d=.6,y=40){tl.fromTo(s,{autoAlpha:0,y},{autoAlpha:1,y:0,duration:d,ease:'expo.out'},t)}
function pop(s,t,d=.5){tl.fromTo(s,{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,duration:d,ease:'back.out(2)'},t)}
function drift(s,a,b,f=1,to=1.04){const d=$(s+' .drift')?s+' .drift':s;tl.fromTo(d,{scale:f},{scale:to,duration:b-a,ease:'none'},a)}
function trPush(a,b,t,dir=1){tl.fromTo(a,{xPercent:0,filter:'blur(0px)'},{xPercent:-100*dir,filter:'blur(18px)',duration:.4,ease:'power4.in',immediateRender:false},t-.4);hide(a,t);
  show(b,t);tl.fromTo(b,{xPercent:100*dir,filter:'blur(18px)'},{xPercent:0,filter:'blur(0px)',duration:.5,ease:'power4.out',immediateRender:false},t);sfx(t-.42,'air',.9)}
function trPushV(a,b,t){tl.fromTo(a,{yPercent:0,filter:'blur(0px)'},{yPercent:-100,filter:'blur(16px)',duration:.4,ease:'power4.in',immediateRender:false},t-.4);hide(a,t);
  show(b,t);tl.fromTo(b,{yPercent:100,filter:'blur(16px)'},{yPercent:0,filter:'blur(0px)',duration:.5,ease:'power4.out',immediateRender:false},t);sfx(t-.42,'air',.9)}
function trZoom(a,b,t){tl.fromTo(a,{scale:1,filter:'blur(0px)',opacity:1},{scale:1.7,filter:'blur(22px)',opacity:0,duration:.36,ease:'power3.in',immediateRender:false},t-.36);hide(a,t);
  show(b,t);tl.fromTo(b,{scale:.78,filter:'blur(18px)',opacity:0},{scale:1,filter:'blur(0px)',opacity:1,duration:.55,ease:'expo.out',immediateRender:false},t);sfx(t-.38,'zoom',.85)}
function trIris(a,b,t){show(b,t-.3);tl.fromTo(b,{clipPath:'circle(0% at 50% 45%)',scale:1.08},{clipPath:'circle(125% at 50% 45%)',scale:1,duration:.65,ease:'power3.inOut',immediateRender:false},t-.3);
  tl.to(a,{scale:.94,filter:'blur(6px)',duration:.5,ease:'power2.in',immediateRender:false},t-.3);hide(a,t+.36);tl.set(b,{clipPath:'none'},t+.36);sfx(t-.32,'swish',.8)}
function trDip(a,b,t){tl.fromTo('#dip',{opacity:0},{opacity:1,duration:.3,ease:'power2.in',immediateRender:false},t-.3);hide(a,t);show(b,t);tl.to('#dip',{opacity:0,duration:.5,ease:'power2.out',immediateRender:false},t+.02)}
function trN(a,b,t,col='#FFC400',sym='#000'){
  tl.set('#nmask',{visibility:'visible'},t-.5);tl.set('#nsym',{x:290,y:820,scale:.55,opacity:0},t-.5);tl.set('#nsym path',{attr:{fill:sym}},t-.5);tl.set('#nmask .nfill',{backgroundColor:col},t-.5);
  tl.fromTo('#nmask .nfill',{opacity:0},{opacity:1,duration:.26,ease:'power2.inOut',immediateRender:false},t-.5);
  tl.fromTo('#nsym',{scale:.55,opacity:0},{scale:1,opacity:1,duration:.32,ease:'back.out(1.6)',immediateRender:false},t-.32);
  hide(a,t);show(b,t);
  tl.to('#nsym',{scale:1.18,opacity:0,duration:.32,ease:'power2.in',immediateRender:false},t+.08);
  tl.to('#nmask .nfill',{opacity:0,duration:.38,ease:'power2.inOut',immediateRender:false},t+.14);
  tl.set('#nmask',{visibility:'hidden'},t+.56);
  sfx(t-.5,'riser',.6);sfx(t-.3,'boom',.8);sfx(t-.28,'shimmer',.35)}
gsap.set('#nsym',{opacity:0});

// ---------- S1 INTRO 0 - 3.3 : the N drawn in one continuous line
show('#s1',0); drift('#s1',0,3.35,1,1.06);
{const P=$$('#nline .nl');P.forEach((p,i)=>{const L=p.getTotalLength();p.style.strokeDasharray=L;tl.fromTo(p,{strokeDashoffset:L},{strokeDashoffset:0,duration:1.25,ease:'power2.inOut'},.15+i*.18)})}
sfx(0,'boom',.7); sfx(.15,'riser',.5); sfx(.2,'swell',.5);
tl.to('#nline .nl',{attr:{'fill-opacity':1},duration:.35,ease:'power2.out'},1.6); sfx(1.62,'impact',1.1); sfx(1.64,'shimmer',.55); punch(1.62,1.6);
tl.to('#g1',{opacity:1,duration:.6},1.6);
tl.fromTo('#nline',{scale:1},{scale:.92,duration:1.6,ease:'power2.out'},1.7);
fadeUp('#s1l',2.1,.6,14); for(let i=0;i<5;i++)sfx(2.1+i*.05,'key',.7);

// ---------- S2 EVERY BUSINESS DESERVES TO BE SEEN 3.3 - 6.6
trZoom('#s1','#s2',3.3); drift('#s2',3.3,6.65,1,1.05);
tl.fromTo('#beam',{x:0},{x:1700,duration:2.4,ease:'power1.inOut'},4.0);
sfx(5.0,'impact',.7); punch(5.05,1.2);

// ---------- S3 MOST WEBSITES LOOK THE SAME (white) 6.6 - 9.9
trIris('#s2','#s3',6.6); drift('#s3',6.6,9.95,1,1.03);
tl.fromTo('#same .tw',{autoAlpha:0,y:30,scale:.92},{autoAlpha:1,y:0,scale:1,duration:.45,stagger:.05,ease:'expo.out'},6.75); for(let i=0;i<9;i++)sfx(6.75+i*.05,'tick',.35);
tl.to('#same .tw:not(#tw4)',{opacity:.35,duration:.4},8.6);
tl.fromTo('#real',{opacity:0,scale:.8},{opacity:1,scale:1.12,duration:.5,ease:'back.out(2)'},8.7); sfx(8.7,'pop',.7); sfx(8.72,'shimmer',.4);

// ---------- S4 LOGO 9.9 - 13.4
trN('#s3','#s4',9.9); drift('#s4',9.9,13.45,1.04,1);
tl.fromTo('#symw4',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.6,ease:'power3.inOut'},10.1); sfx(10.1,'swipe',.6);
tl.fromTo('#wm4 .L',{yPercent:110,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.55,stagger:.05,ease:'expo.out'},10.45); for(let i=0;i<6;i++)sfx(10.45+i*.05,'key',.9);
tl.fromTo('#tg4',{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.5},10.9); sfx(10.9,'shimmer',.4);

// ---------- S5 WEBSITES THAT CONVERT 13.4 - 16.7
trZoom('#s4','#s5',13.4);
tl.fromTo('#cfw',{autoAlpha:0,y:220},{autoAlpha:1,y:0,duration:.7,ease:'expo.out'},13.45);
const CF0=13.75, CFS=.44;
hooks.push(t=>{const u=Math.max(0,(t-CF0)/CFS);let k=Math.floor(u),f=clamp((u-k)/.55);let idx=Math.min(CF.length-1,k+eio(f));
  CF.forEach((c,i)=>{const d=i-idx,ad=Math.abs(d);const e=document.getElementById('cf'+i);
  e.style.transform=`translateX(${d*600}px) translateZ(${-ad*420}px) rotateY(${clamp(-d*30,-42,42)}deg)`;e.style.opacity=clamp(1-ad*.3,0,1);e.style.zIndex=20-Math.round(ad*2);
  e.querySelector('.nm2').style.opacity=clamp(1-ad*2.2,0,1);e.querySelector('.dm').style.opacity=clamp(ad*.4,0,.55)})});
for(let k=0;k<CF.length-1;k++)sfx(CF0+k*CFS,'swipe',.3);

// ---------- S6 ADS THAT SCALE 16.7 - 20.0
trPush('#s5','#s6',16.7); drift('#s6',16.7,20.05,1,1.04);
fadeUp('#s6l',16.75,.5,14);
tl.fromTo('#s6n',{scale:.6,autoAlpha:0},{scale:1,autoAlpha:1,duration:.6,ease:'expo.out'},16.85);
hooks.push(t=>{$('#mn').textContent=Math.round(eo(clamp((t-16.95)/1.1))*20)});
for(let i=0;i<8;i++)sfx(16.95+i*.13,'tick',.3); sfx(18.05,'impact',.9); punch(18.08,1.2);
tl.fromTo('#rowA',{x:0},{x:-600,duration:3.4,ease:'none'},16.7); tl.fromTo('#rowB',{x:-1200},{x:-600,duration:3.4,ease:'none'},16.7);
tl.fromTo('#s6 .lt',{scale:.5,autoAlpha:0},{scale:1,autoAlpha:1,duration:.5,stagger:{each:.02,from:'center'},ease:'back.out(2)'},16.9); sfx(16.9,'shimmer',.35);

// ---------- S7 100+ WEBSITES 20.0 - 23.3
trPushV('#s6','#s7',20.0); drift('#s7',20.0,23.35,1,1.04);
tl.fromTo('#s7n',{scale:.6,autoAlpha:0},{scale:1,autoAlpha:1,duration:.6,ease:'expo.out'},20.05);
hooks.push(t=>{$('#hn').textContent=Math.round(eo(clamp((t-20.1)/1.0))*100)});
for(let i=0;i<8;i++)sfx(20.1+i*.12,'tick',.3); sfx(21.1,'impact',.8); punch(21.12,1.1);
TG.forEach((k,i)=>{const t=20.3+i*.08;tl.fromTo('#tt'+i,{autoAlpha:0,scale:.6,y:30},{autoAlpha:1,scale:1,y:0,duration:.5,ease:'back.out(1.7)'},t);sfx(t,'snap',.4)});

// ---------- S8 REAL PEOPLE 23.3 - 26.6
trPushV('#s7','#s8',23.3);
tl.to('#fdiv',{scaleY:1,duration:.5,ease:'power3.inOut'},23.4);
tl.fromTo(['#fp img','#fg img'],{scale:1.18},{scale:1.04,duration:3.2,ease:'power2.out'},23.3);
tl.fromTo('#fp .nmt',{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:.5},23.6); tl.fromTo('#fg .nmt',{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:.5},23.8);
sfx(23.6,'tap',.4); sfx(23.8,'tap',.4);

// ---------- S9 HOW IT WORKS 26.6 - 31.2
trPush('#s8','#s9',26.6); drift('#s9',26.6,31.25,1,1.03);
fadeUp('#s9l',26.65,.5,14); for(let i=0;i<6;i++)sfx(26.65+i*.05,'key',.6);
[['#st1',26.85],['#st2',27.8],['#st3',28.75]].forEach(([s,t])=>{tl.fromTo(s,{autoAlpha:0,x:-120},{autoAlpha:1,x:0,duration:.55,ease:'expo.out'},t);sfx(t,'air',.5)});
tl.to('#st3',{boxShadow:'0 0 0 3px #FFC400',duration:.3},30.0); sfx(30.0,'chime',.7);

// ---------- S10 ONE PAYMENT / NO MONTHLY FEES 31.2 - 34.4
trZoom('#s9','#s10',31.2); drift('#s10',31.2,34.45,1,1.03);
tl.set('#tkt',{autoAlpha:0},0); tl.fromTo('#tkt',{autoAlpha:0,y:-80,rotation:-4},{autoAlpha:1,y:0,rotation:0,duration:.5,ease:'back.out(1.6)'},31.35); sfx(31.35,'stamp',.8); punch(31.38,1);
tl.fromTo('#months .mo',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.35,stagger:.03,ease:'expo.out'},32.4); sfx(32.4,'air',.4);
tl.to('#months .st',{scaleX:1,duration:.2,stagger:.025,ease:'power3.out'},33.4); for(let i=0;i<12;i++)sfx(33.4+i*.025,'tick',.25); sfx(33.4,'swipe',.6);
tl.to('#months .mo',{opacity:.35,duration:.3},33.75);

// ---------- S11 OUTRO (yellow) 34.4 - end
trN('#s10','#s11',34.4); drift('#s11',34.4,DUR,1.04,1);
tl.fromTo('#symw11',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.6,ease:'power3.inOut'},34.6); sfx(34.6,'swipe',.6);
tl.fromTo('#wm11 .L',{yPercent:110,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.55,stagger:.05,ease:'expo.out'},34.95); for(let i=0;i<6;i++)sfx(34.95+i*.05,'key',.9);
tl.fromTo('#tg11',{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.5},35.4);
tl.set('#s11f',{autoAlpha:0},0); fadeUp('#s11f',37.6,.6,14); sfx(37.6,'tap',.5); sfx(38.4,'impact',.6);
tl.set({},{},DUR);

const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
window.SFX=SFX; window.DUR=DUR;
window.seek=(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f);return Promise.all($$('img').map(i=>i.complete&&i.naturalWidth?Promise.resolve():i.decode().catch(()=>{})))};
window.ready=document.fonts.ready.then(()=>{fitCaps();return true});
