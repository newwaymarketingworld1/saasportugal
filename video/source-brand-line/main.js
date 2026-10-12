const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DUR=35.0, SFX=[], hooks=[];
const sfx=(t,type,g=1,d=0)=>SFX.push({t:+t.toFixed(3),type,g,d});
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)); const eo=x=>1-Math.pow(1-x,4);
const TOP={A:0,B:1940,C:3940,D:5940,E:7940,F:9940};
const C=$('#content'), BG=$('#bg'), LN=$('#lines');
const add=(html,sec)=>{const d=document.createElement('div');d.innerHTML=html.trim();const el=d.firstChild;if(sec!==undefined){el.style.top=(parseFloat(el.style.top||0)+TOP[sec])+'px'}C.appendChild(el);return el};
const addBg=(txt,sec,y,x=0)=>{const d=document.createElement('div');d.className='ol';d.textContent=txt;d.style.top=(TOP[sec]+y)+'px';d.style.left=x+'px';BG.appendChild(d);return d};
const PATHS={};
function path(id,sec,d){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('transform',`translate(0,${TOP[sec]})`);
  const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);p.setAttribute('class','ln');p.id=id;g.appendChild(p);LN.appendChild(g);
  const L=p.getTotalLength();p.style.strokeDasharray=L+' '+(L+10);p.style.strokeDashoffset=L;PATHS[id]={p,L};return p}
function logoSVG(svg,col,part){const el=$(svg);if(part==='sym')el.innerHTML=LOGO.symbol.map(d=>`<path fill="${col}" d="${d}"/>`).join('');
  else if(part==='wm')el.innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');
  else el.innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`}
// kinetic type: letters rise out of a mask
function splitL(el){const html=el.innerHTML;const tmp=document.createElement('div');tmp.innerHTML=html;const out=[];
  const walk=(n,cls)=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){[...c.textContent].forEach(ch=>{out.push(ch===' '?' ':`<span class="mk"><span class="${cls||''}">${ch}</span></span>`)})}else{walk(c,c.className)}})};
  walk(tmp,'');el.innerHTML=out.join('')}

// ================= BUILD WORLD
// ---- A: the N
const NC="M-80,1300 C80,1300 200,1150 278,1012 C320,900 350,800 400,768 C440,742 500,735 535,770 C560,800 600,900 625,975 C640,1010 680,1015 700,985 C730,920 770,820 808,735";
path('A1','A',NC);
path('A2','A',"M808,735 C860,620 980,600 1040,700 C1100,800 1100,900 1160,1020");
add(`<svg id="aSym" viewBox="392 370 290 138" style="position:absolute;left:220px;top:720px;width:640px;overflow:visible;opacity:0"></svg>`);
add(`<svg id="aWm" viewBox="196 544 688 110" style="position:absolute;left:160px;top:1110px;width:760px;overflow:visible"></svg>`);
add(`<svg id="aTg" viewBox="258 676 558 34" style="position:absolute;left:240px;top:1262px;width:600px;overflow:visible"></svg>`);
logoSVG('#aSym','#FFC400','sym');logoSVG('#aWm','#fff','wm');logoSVG('#aTg','#fff','tg');
add(`<div class="ctr lab" id="aLab" style="top:1380px">Websites · Ads · Growth</div>`,'A');
addBg('NEWWAY','A',300,-60);

// ---- B: websites
addBg('WEBSITES','B',1240,-40);
add(`<div class="ctr big" id="bT" style="top:300px;font-size:150px">Websites</div>`,'B');
add(`<div class="card" id="bCard" style="left:90px;top:560px"><div class="bar"><i></i><i></i><i></i></div><div class="scr" id="bScr">
  <div class="wb" id="w1" style="left:40px;top:24px;width:130px;height:22px"></div><div class="wb" id="w2" style="left:560px;top:28px;width:300px;height:14px"></div>
  <div class="wb" id="w3" style="left:200px;top:120px;width:500px;height:52px"></div><div class="wb" id="w4" style="left:260px;top:186px;width:380px;height:52px"></div>
  <div class="wb" id="w5" style="left:250px;top:262px;width:400px;height:16px;background:#1c1c1c"></div>
  <div class="wb" id="wbtn" style="left:330px;top:310px;width:240px;height:60px;background:#FFC400;border-radius:14px"></div>
  <div class="flip" id="f0" style="opacity:0"><img src="c/alpha.jpg"></div>
  <div class="flip" id="f1" style="opacity:0"><img src="c/brother.jpg"></div>
  <div class="flip" id="f2" style="opacity:0"><img src="c/jgc.jpg"></div>
  <div class="flip" id="f3" style="opacity:0"><img src="c/poenza.jpg"></div>
 </div></div>`,'B');
add(`<svg id="bCur" style="position:absolute;left:700px;top:1150px;width:70px;height:70px" viewBox="0 0 24 24"><path d="M3 2l7 19 2.6-7.4L20 11z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>`,'B');
add(`<div class="badge" id="bg1" style="left:40px;top:480px"><i></i>Mobile-first</div>`,'B');
add(`<div class="badge" id="bg2" style="left:690px;top:1000px"><i></i>Built to convert</div>`,'B');
add(`<div class="badge" id="bg3" style="left:70px;top:1010px"><i></i>Fast</div>`,'B');
add(`<div class="ctr sub" id="bS" style="top:1130px;font-size:40px">that turn visitors into customers.</div>`,'B');
path('B1','B',"M1160,-80 C1060,200 990,380 990,582 L990,1019 Q990,1041 968,1041 L112,1041 Q90,1041 90,1019 L90,582 Q90,560 112,560 L968,560 Q990,560 990,582");
path('B2','B',"M90,1019 C90,1220 40,1320 -140,1440");

// ---- C: ads
addBg('GROWTH','C',1500,-80);
add(`<div class="ctr big" id="cN" style="top:190px;font-size:210px"><span class="y">$</span><span id="cNum">0</span>M<span class="y">+</span></div>`,'C');
add(`<div class="ctr sub" id="cS" style="top:410px;font-size:36px">in ad spend managed</div>`,'C');
path('C1','C',"M-140,1120 L60,1100 L240,980 L380,1040 L560,800 L700,860 L860,600 L1000,500");
path('C2','C',"M1000,500 C1080,450 1130,560 1160,720");
const CPTS=[[60,1100],[240,980],[380,1040],[560,800],[700,860],[860,600],[1000,500]];
CPTS.forEach(([x,y],i)=>add(`<div class="dot" id="cd${i}" style="left:${x}px;top:${y}px"></div>`,'C'));
add(`<div class="chip" id="cc1" style="left:150px;top:880px">Clicks ↑</div>`,'C');
add(`<div class="chip" id="cc2" style="left:470px;top:690px">Leads ↑</div>`,'C');
add(`<div class="chip" id="cc3" style="left:730px;top:490px">Sales ↑</div>`,'C');
const LBG=['#fff','#fff','#000','#fff','#f7f7f7','#fff','#fff','#12110f','#fff','#fff','#fff','#f1f0ec'];
for(let i=0;i<12;i++)add(`<div class="lg" id="lg${i}" style="left:540px;top:1330px;background:${LBG[i]}"><img src="lg/l${i}.jpg"></div>`,'C');
add(`<div class="ctr lab" id="cL" style="top:1500px">Brands we've grown</div>`,'C');

// ---- D: 100+ websites
addBg('PORTFOLIO','D',1480,-120);
add(`<div class="ctr big" id="dN" style="top:170px;font-size:230px"><span id="dNum">0</span><span class="y">+</span></div>`,'D');
add(`<div class="ctr sub" id="dS" style="top:410px;font-size:36px">websites delivered across the U.S.</div>`,'D');
path('D1','D',"M1160,-80 C1060,200 960,380 960,560 L120,560 Q60,560 60,620 L60,710 Q60,770 120,770 L960,770 Q1020,770 1020,830 L1020,920 Q1020,980 960,980 L120,980 Q60,980 60,1040 L60,1130 Q60,1190 120,1190 L960,1190 Q1020,1190 1020,1250 L1020,1340 Q1020,1400 960,1400 L120,1400");
path('D2','D',"M120,1400 C40,1400 -20,1520 -160,1620");
const TH=['c/t_alpha.jpg','c/t_brother.jpg','c/t_jgc.jpg','c/t_deck.jpg','c/t_poenza.jpg','c/t_kundara.jpg','v2/f0120.jpg','v1/f0040.jpg'];
TH.forEach((s,i)=>{const r=Math.floor(i/2),c=i%2;add(`<div class="th" id="th${i}" style="left:${c?590:130}px;top:${578+r*210}px;width:360px;height:174px"><img src="${s}"></div>`,'D')});

// ---- E: real people
addBg('HUMAN','E',1560,-40);
add(`<div class="ctr sub" id="eT1" style="top:190px;font-size:52px;color:#9a9a9a;font-weight:800;text-transform:uppercase;letter-spacing:.06em">Built by</div>`,'E');
add(`<div class="ctr big" id="eT2" style="top:260px;font-size:132px">Real <span class="y">people.</span></div>`,'E');
add(`<div class="ph" id="ph1" style="left:132px;top:562px;width:396px;height:396px"><img src="pedro.jpg" style="object-position:47% 30%"></div>`,'E');
add(`<div class="ph" id="ph2" style="left:552px;top:812px;width:396px;height:396px"><img src="gustavo.jpg" style="object-position:44% 26%"></div>`,'E');
add(`<div class="nm" id="nm1" style="left:590px;top:580px">Pedro<span>CO-FOUNDER</span></div>`,'E');
add(`<div class="nm" id="nm2" style="left:90px;top:1060px">Gustavo<span>CO-FOUNDER</span></div>`,'E');
add(`<div class="ctr big" id="eX1" style="top:1303px;font-size:96px">Not AI.</div>`,'E');
add(`<div class="ctr big" id="eX2" style="top:1423px;font-size:96px">Not templates.</div>`,'E');
path('E1','E',"M-140,-80 C0,200 330,300 330,545 A215,215 0 1,1 330,975 A215,215 0 1,1 330,545 C470,545 640,660 750,795 A215,215 0 1,1 750,1225 A215,215 0 1,1 750,795 C900,795 1010,880 1010,1010 L1010,1300 Q1010,1355 955,1355 L125,1355 Q70,1355 70,1415 Q70,1475 125,1475 L1160,1475");

// ---- F: process
addBg('PROCESS','F',1520,-60);
add(`<div class="ctr lab" id="fL" style="top:190px">How it works</div>`,'F');
add(`<div class="ctr big" id="fT" style="top:240px;font-size:96px">One clear <span class="y">path.</span></div>`,'F');
path('F1','F',"M1160,-80 C1000,200 800,320 800,520 C800,700 280,660 280,860 C280,1060 800,1000 800,1200 C800,1400 600,1500 540,2100");
const ICON={b:'<path d="M14 6l4 4-9 9H5v-4z M12 8l4 4" fill="none" stroke="#000" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>',
 r:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="#000" stroke-width="2.4" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="#000"/>',
 h:'<path d="M12 21s-7.5-4.6-9.5-9.4C1.2 8.5 3.3 5 6.7 5c2 0 3.4 1.1 5.3 3 1.9-1.9 3.3-3 5.3-3 3.4 0 5.5 3.5 4.2 6.6C19.5 16.4 12 21 12 21z" fill="#FFC400" stroke="#000" stroke-width="2"/>'};
[[800,520,'b'],[280,860,'r'],[800,1200,'h']].forEach(([x,y,k],i)=>add(`<div class="node" id="nd${i}" style="left:${x}px;top:${y}px"><svg width="64" height="64" viewBox="0 0 24 24">${ICON[k]}</svg></div>`,'F'));
add(`<div class="step" id="sp0" style="left:70px;top:430px"><em>01</em><b>We build it first</b><span>Nothing to pay up front.</span></div>`,'F');
add(`<div class="step" id="sp1" style="left:440px;top:770px;text-align:left"><em>02</em><b>You review &amp; change</b><span>As many edits as you need.</span></div>`,'F');
add(`<div class="step" id="sp2" style="left:70px;top:1110px"><em>03</em><b>Pay when you love it</b><span>One payment. No monthly fees.</span></div>`,'F');

// ---- LOCKUP (screen space)
$('#lockN').innerHTML=`<path id="LN" class="ln" d="${NC.replace('M-80,1300 C80,1300 200,1150 278,1012','M278,1012').replace(/(\d+),(\d+)/g,(m,a,b)=>a+','+(+b-120))}"/>`;
logoSVG('#lsym','#FFC400','sym');logoSVG('#lwm','#fff','wm');logoSVG('#ltg','#fff','tg');
$('#lfw').innerHTML='A new way <span class="y">forward.</span>';
['#bT','#eT2','#eX1','#eX2','#fT','#lfw','#dS','#cS','#bS'].forEach(s=>splitL($(s)));

// ================= CAMERA
const CAM={y:960,s:1,r:0};
hooks.push(t=>{$('#world').style.transform=`translate(540px,960px) rotate(${CAM.r}deg) scale(${CAM.s}) translate(-540px,${-CAM.y}px)`;BG.style.transform=`translateY(${(CAM.y-960)*0.14}px)`});
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
function pan(y,t,d=.95){tl.to(CAM,{y,duration:d,ease:'power3.inOut'},t);tl.to(CAM,{s:.9,duration:d/2,ease:'power2.out',yoyo:true,repeat:1},t);sfx(t+.05,'whoosh',.9);sfx(t+d*.55,'air',.5)}
function draw(id,t,d,ease='power1.inOut',g=.5){const P=PATHS[id];tl.to(P.p,{strokeDashoffset:0,duration:d,ease},t);sfx(t,'draw',g,d)}
function rise(sel,t,st=.025,d=.6){tl.fromTo($$(sel+' .mk>span'),{yPercent:115},{yPercent:0,duration:d,stagger:st,ease:'expo.out'},t);sfx(t,'swish',.35)}
function sink(sel,t,st=.012){tl.to($$(sel+' .mk>span'),{yPercent:-115,duration:.4,stagger:st,ease:'power3.in'},t)}
function pop(sel,t,d=.5,from=.4){tl.fromTo(sel,{autoAlpha:0,scale:from},{autoAlpha:1,scale:1,duration:d,ease:'back.out(2.2)'},t)}
function fade(sel,t,d=.5,y=24){tl.fromTo(sel,{autoAlpha:0,y},{autoAlpha:1,y:0,duration:d,ease:'expo.out'},t)}

// background outline words drift sideways
$$('#bg .ol').forEach((e,i)=>tl.fromTo(e,{x:0},{x:i%2?260:-260,duration:DUR,ease:'none'},0));
// ================= TIMELINE
// ---- A 0 - 3.6
draw('A1',0,1.6,'power2.inOut',.6); sfx(0,'boom',.8); tl.to('#A1',{strokeWidth:58,duration:.35,ease:'power2.inOut'},1.45);
tl.to('#aSym',{opacity:1,duration:.3,ease:'power2.out'},1.6); tl.to('#A1',{opacity:0,duration:.3},1.75);
tl.fromTo('#aSym',{scale:1.08,transformOrigin:'50% 50%'},{scale:1,duration:.6,ease:'expo.out'},1.6); sfx(1.62,'impact',1.0); sfx(1.64,'shimmer',.5);
tl.fromTo('#aWm .L',{yPercent:120,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.6,stagger:.05,ease:'expo.out'},2.0); sfx(2.0,'swish',.45);
tl.fromTo('#aTg',{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.5},2.45);
fade('#aLab',2.75,.5,14); sfx(2.75,'tap',.4);
draw('A2',3.2,.6,'power2.in',.4);
// ---- pan to B
pan(2900,3.55);
// ---- B 4.5 - 9.0
draw('B1',3.95,1.5,'power1.inOut',.55);
rise('#bT',4.5,.03);
tl.fromTo('#bCard',{autoAlpha:0,scale:.96},{autoAlpha:1,scale:1,duration:.5},4.6);
['#w1','#w2','#w3','#w4','#w5'].forEach((s,i)=>{tl.fromTo(s,{scaleX:0,transformOrigin:'0 50%'},{scaleX:1,duration:.4,ease:'expo.out'},5.0+i*.09);sfx(5.0+i*.09,'tap',.35)});
pop('#wbtn',5.5,.45,.3); sfx(5.5,'pop',.5);
rise('#bS',5.3,.012,.5);
tl.fromTo('#bCur',{x:0,y:0,autoAlpha:0},{x:-235,y:-235,autoAlpha:1,duration:.55,ease:'power3.inOut'},5.6);
tl.to('#wbtn',{scale:.9,duration:.08,yoyo:true,repeat:1},6.15); sfx(6.15,'click',1);
tl.to('#bCur',{autoAlpha:0,duration:.25},6.4);
tl.fromTo('#f0',{opacity:1,clipPath:'circle(0% at 50% 76%)'},{clipPath:'circle(140% at 50% 76%)',duration:.6,ease:'power3.inOut'},6.2); sfx(6.2,'swell',.6);
[['#f0','#f1',7.0],['#f1','#f2',7.6],['#f2','#f3',8.2]].forEach(([a,b,t])=>{tl.to(a,{rotationX:90,transformOrigin:'50% 50%',duration:.22,ease:'power2.in'},t);tl.fromTo(b,{opacity:1,rotationX:-90},{rotationX:0,duration:.28,ease:'power2.out',immediateRender:false},t+.22);tl.set(b,{opacity:0},0);tl.set(b,{opacity:1},t+.22);sfx(t+.2,'snap',.6)});
[['#bg1',5.75],['#bg3',5.95],['#bg2',6.15]].forEach(([s,t])=>{pop(s,t,.5,.3);sfx(t,'pop',.4)});
['#bg1','#bg2','#bg3'].forEach((s,i)=>tl.to(s,{y:i%2?-14:14,duration:1.2,yoyo:true,repeat:2,ease:'sine.inOut'},6.4+i*.15));
draw('B2',8.55,.55,'power2.in',.4);
// ---- pan to C
pan(4900,8.85);
// ---- C 9.8 - 14.0
draw('C1',9.35,1.7,'power1.inOut',.6);
CPTS.forEach((p,i)=>{const t=9.45+i*.24;pop('#cd'+i,t,.4,.2);sfx(t,'pop',.35)});
tl.fromTo('#cN',{autoAlpha:0,yPercent:40,scale:.9},{autoAlpha:1,yPercent:0,scale:1,duration:.7,ease:'expo.out'},9.8);
hooks.push(t=>{$('#cNum').textContent=Math.round(eo(clamp((t-9.9)/1.1))*20)});
for(let i=0;i<8;i++)sfx(9.9+i*.13,'tick',.28); sfx(11.0,'impact',.9);
tl.fromTo('#cN',{scale:1},{scale:1.06,duration:.12,yoyo:true,repeat:1},11.0);
rise('#cS',10.3,.012,.5);
[['#cc1',10.4],['#cc2',10.9],['#cc3',11.35]].forEach(([s,t])=>{pop(s,t,.45,.3);sfx(t,'tap',.4)});
// logos orbit
tl.fromTo('#C .lg, .lg',{autoAlpha:0},{autoAlpha:1,duration:.4,stagger:.04},11.6); sfx(11.6,'shimmer',.4);
hooks.push(t=>{const a0=(t-11.6)*0.9;for(let i=0;i<12;i++){const a=a0+i*Math.PI*2/12;const x=Math.cos(a)*400,y=Math.sin(a)*110,z=(Math.sin(a)+1)/2;const e=$('#lg'+i);
  e.style.transform=`translate(${x}px,${y}px) scale(${.62+.5*z})`;e.style.zIndex=Math.round(z*100);e.style.filter=`brightness(${.55+.45*z})`}});
fade('#cL',12.2,.5,14);
draw('C2',13.55,.5,'power2.in',.4);
// ---- pan to D
pan(6900,13.85);
// ---- D 14.8 - 18.3
draw('D1',14.3,2.2,'none',.6);
tl.fromTo('#dN',{autoAlpha:0,yPercent:40,scale:.9},{autoAlpha:1,yPercent:0,scale:1,duration:.7,ease:'expo.out'},14.8);
hooks.push(t=>{$('#dNum').textContent=Math.round(eo(clamp((t-14.9)/1.1))*100)});
for(let i=0;i<8;i++)sfx(14.9+i*.13,'tick',.28); sfx(16.0,'impact',.85);
rise('#dS',15.2,.012,.5);
TH.forEach((s,i)=>{const r=Math.floor(i/2);const t=14.95+r*.5+(i%2)*.12;tl.fromTo('#th'+i,{autoAlpha:0,rotationX:-80,transformOrigin:'50% 0%'},{autoAlpha:1,rotationX:0,duration:.5,ease:'back.out(1.4)'},t);sfx(t,'snap',.45)});
tl.to('#D .th, .th',{y:'-=10',duration:1.2,yoyo:true,repeat:1,ease:'sine.inOut',stagger:.05},16.6);
draw('D2',17.95,.5,'power2.in',.4);
// ---- pan to E
pan(8900,18.25);
// ---- E 19.2 - 23.2
draw('E1',18.7,4.1,'none',.65);
rise('#eT2',19.25,.03,.7); fade('#eT1',19.2,.5,14);
tl.fromTo('#ph1',{autoAlpha:0,scale:.6},{autoAlpha:1,scale:1,duration:.7,ease:'expo.out'},19.6); sfx(19.6,'swell',.5);
tl.fromTo('#ph2',{autoAlpha:0,scale:.6},{autoAlpha:1,scale:1,duration:.7,ease:'expo.out'},20.35); sfx(20.35,'swell',.5);
fade('#nm1',20.0,.5,20); fade('#nm2',20.75,.5,20); sfx(20.0,'tap',.4); sfx(20.75,'tap',.4);
rise('#eX1',20.9,.03,.55); rise('#eX2',21.25,.025,.55);
// line strikes through "Not AI." (~21.9) then "Not templates." (~22.6)
tl.to('#eX1',{opacity:.35,duration:.3},22.1); tl.to('#eX2',{opacity:.35,duration:.3},22.75); sfx(21.85,'swipe',.7); sfx(22.45,'swipe',.7);
// ---- pan to F
pan(10900,23.0);
// ---- F 24.0 - 27.2
draw('F1',23.5,3.5,'none',.6);
fade('#fL',23.95,.5,14); rise('#fT',24.05,.03,.6);
[[0,24.35],[1,25.45],[2,26.45]].forEach(([i,t])=>{pop('#nd'+i,t,.55,.2);sfx(t,'impact',.55);sfx(t+.02,'pop',.5);
  tl.fromTo('#sp'+i,{autoAlpha:0,x:i===1?60:-60},{autoAlpha:1,x:0,duration:.6,ease:'expo.out'},t+.12)});
sfx(26.6,'chime',.6);
// ---- ZOOM OUT: the whole journey
tl.to(CAM,{y:5950,s:.158,r:-7,duration:1.9,ease:'expo.inOut'},27.4); sfx(27.3,'riser',.8); sfx(28.9,'boom',.7);
tl.to(CAM,{r:-9,s:.152,duration:1.2,ease:'none'},29.3);
// ---- LOCKUP
tl.set('#lock',{visibility:'visible'},29.9); tl.to('#lock',{opacity:1,duration:.45,ease:'power2.inOut'},29.9);
{const p=$('#LN');const L=p.getTotalLength();p.style.strokeDasharray=L+' '+(L+10);p.style.strokeDashoffset=L;tl.to(p,{strokeDashoffset:0,duration:1.0,ease:'power2.inOut'},30.3);sfx(30.3,'draw',.6,1.0)}
tl.to('#lsym',{opacity:1,duration:.3},31.25); tl.to('#LN',{opacity:0,duration:.3},31.35); sfx(31.27,'impact',1.0); sfx(31.3,'shimmer',.55);
tl.fromTo('#lwm .L',{yPercent:120,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:.6,stagger:.05,ease:'expo.out'},31.55); sfx(31.55,'swish',.45);
tl.fromTo('#ltg',{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.5},31.95);
rise('#lfw',32.4,.03,.7);
fade('#lsv',33.1,.6,14); sfx(33.1,'tap',.4);
tl.set({},{},DUR);

const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
window.SFX=SFX; window.DUR=DUR;
window.seek=(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f);return Promise.all($$('img').map(i=>i.complete&&i.naturalWidth?Promise.resolve():i.decode().catch(()=>{})))};
window.ready=document.fonts.ready.then(()=>true);
