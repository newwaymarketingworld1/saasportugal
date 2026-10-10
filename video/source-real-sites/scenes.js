// ---------- builders
fillLogo('#sym3','#wm3','#tg3'); fillLogo('#sym12','#wm12','#tg12');
['#hL','#hR'].forEach(s=>$(s).innerHTML=$('#sub').innerHTML.replace(/id="(mo|tot|loop)"/g,''));
$$('#hL span, #hR span').forEach(e=>{if(e.textContent==='1')e.textContent='36';if(e.textContent==='$299'&&e.style.fontWeight)e.textContent='$10,764'});
// video sequences: [sceneStart, sceneEnd, dir, srcStartSec]
const VS={vimg1:[[11.6,14.3,'v2',2.9],[14.3,16.6,'v2',7.2]],vimg2:[[27.5,31.0,'v1',0.2],[31.0,35.3,'v1',3.9]],vbg2:[[27.5,31.0,'v1',0.2],[31.0,35.3,'v1',3.9]],vimg3:[[35.0,39.2,'v2',12.9]]};
const VMAX={v1:408,v2:502};
hooks.push(t=>{for(const id in VS){const el=document.getElementById(id);let seg=VS[id].find(s=>t>=s[0]&&t<s[1])||(t<VS[id][0][0]?VS[id][0]:null);
  if(!seg)seg=VS[id][VS[id].length-1];const fr=Math.min(VMAX[seg[2]],Math.max(1,Math.round((Math.max(t,seg[0])-seg[0]+seg[3])*30)+1));
  const src=`${seg[2]}/f${String(fr).padStart(4,'0')}.jpg`;if(el.getAttribute('src')!==src)el.setAttribute('src',src)}});

// ================= SCENES
tl.fromTo('#o1',{x:0,y:0},{x:450,y:-350,duration:DUR,ease:'sine.inOut'},0);
tl.fromTo('#o2',{x:0,y:0},{x:-650,y:-600,duration:DUR,ease:'sine.inOut'},0);
const keyRun=(t,n,st=.07)=>{for(let i=0;i<n;i++)sfx(t+i*st,'key',i?.8:1)};

// ---------- S1 WEB GUY 0 - 4.2
show('#s1',0); drift('#s1',0,4.2,1,1.04);
rise('#s1a .h',0.0,.08); rise('#s1a em',0.35,.08); sweep('#s1a em .w',.6,1.1);
tl.fromTo('#chat',{y:500,autoAlpha:0,rotateX:20},{y:0,autoAlpha:1,rotateX:0,duration:.9,ease:'expo.out'},0.85); sfx(.85,'air',.5);
const bub=(s,t,o)=>{tl.fromTo(s,{autoAlpha:0,scale:.7,y:20,transformOrigin:o},{autoAlpha:1,scale:1,y:0,duration:.4,ease:'back.out(2)'},t);sfx(t,'msg',.6)};
tl.set(['#m1','#m2','#m3','#m4','#m5'],{autoAlpha:0},0);
bub('#m1',1.15,'0 100%'); bub('#m2',1.75,'0 100%');
tl.fromTo('#m3',{autoAlpha:0},{autoAlpha:1,duration:.2},2.25); tl.to('#m3 .td',{opacity:.25,duration:.18,yoyo:true,repeat:3,stagger:.08},2.3); tl.set('#m3',{autoAlpha:0},2.85);
bub('#m4',2.85,'0 100%');
bub('#m5',3.45,'100% 100%');
rise('#s1b .h',1.6,.07); rise('#s1b em',2.45,.08); sweep('#s1b em .w',2.7,1);

// ---------- S2 SUBSCRIPTION 4.2 - 6.75
trSoft('#s1','#s2',4.25); drift('#s2',4.25,6.75,1,1.04);
rise('#s2a',4.25,.07); rise('#s2b',5.15,.08); sweep('#s2b .w',5.4,1);
tl.fromTo('#sub',{y:400,autoAlpha:0,rotateX:25},{y:0,autoAlpha:1,rotateX:0,duration:.9,ease:'expo.out'},4.4); sfx(4.4,'air',.5);
tl.fromTo('#loop',{rotate:0},{rotate:720,duration:2.4,ease:'power1.inOut',transformOrigin:'50% 50%'},4.4);
hooks.push(t=>{const p=clamp((t-4.9)/1.7);const m=1+Math.round((p*p)*35);$('#mo').textContent=m;$('#tot').textContent='$'+(m*299).toLocaleString('en-US')});
for(let i=0;i<10;i++)sfx(4.9+i*.17,'tap',.25);

// ---------- S3 THE FIX 6.75 - 9.65
trSoft('#s2','#s3',6.8); drift('#s3',6.8,9.65,1,1.04);
tl.set(['#logo3','#s3l'],{autoAlpha:0},0);
rise('#s3a .h',6.85,.08); rise('#s3a em',7.25,.08); sweep('#s3a em .w',7.45,.9); sfx(7.25,'shimmer',.6);
sfx(7.5,'riser',.7);
leak(8.1,.95,.8); sfx(8.1,'impact',1.0); push(8.1,2);
tl.set('#s3a',{autoAlpha:0},8.1);
tl.fromTo('#rays',{opacity:0,rotate:0},{opacity:1,rotate:25,duration:1.6,ease:'none'},8.1);
fadeUp('#s3l',8.15,.5,15);
blurIn('#sym3',8.15,.9,1.4);
tl.fromTo('#wm3 .L',{y:40,autoAlpha:0,filter:'blur(10px)'},{y:0,autoAlpha:1,filter:'blur(0px)',duration:.7,stagger:.05,ease:'expo.out'},8.3);
tl.fromTo('#tg3',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.7},8.65);
show('#logo3',8.15); sweepLogo('#logo3',8.7,1.0);

// ---------- S4 $0 + BUILD FIRST 9.65 - 16.45
trSoft('#s3','#s4',9.7); drift('#s4',9.7,16.45,1,1.03);
fadeUp('#s4l',9.72,.5,15);
blurIn('#s4zero',10.05,.9,1.35); sfx(10.05,'impact',.8); push(10.1,1.5); sweep('#s4zero',10.4,1.2);
rise('#s4u',10.6,.08);
tl.to('#s4A',{autoAlpha:0,filter:'blur(20px)',scale:1.06,duration:.35,ease:'power2.in'},11.45);
tl.set('#s4B',{opacity:1},11.7);
rise('#s4a',11.75,.06); rise('#s4b',12.55,.08); sweep('#s4b .w',12.8,1);
tl.fromTo('#vw1',{y:500,rotateX:30,autoAlpha:0},{y:0,rotateX:8,autoAlpha:1,duration:1.1,ease:'expo.out'},11.75); sfx(11.75,'air',.6);
tl.to('#vw1',{rotateX:0,duration:3,ease:'sine.inOut'},12.9);
tl.to('#vw1 .vcard',{scale:1.04,duration:4.5,ease:'none'},11.9);
tl.fromTo('#vw1 .vshine',{xPercent:-130},{xPercent:130,duration:1.2,ease:'power2.inOut'},12.6);
tl.fromTo('#vw1 .vtag',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},12.3);
rise('#s4c',13.5,.06); rise('#s4d',14.65,.08); sweep('#s4d .w',14.9,1);
tl.fromTo('#appr',{autoAlpha:0,scale:.6,y:20},{autoAlpha:1,scale:1,y:0,duration:.5,ease:'back.out(2.5)'},15.3); sfx(15.3,'chime',.7);

// ---------- S5 NO SUBSCRIPTIONS 16.45 - 19.75
trSoft('#s4','#s5',16.5); drift('#s5',16.5,19.75,1,1.04);
rise('#s5a',16.58,.08); rise('#s5b',17.2,.08); sweep('#s5b .w',17.4,1);
tl.fromTo('#cutwrap',{autoAlpha:0,y:80},{autoAlpha:1,y:0,duration:.6,ease:'expo.out'},16.55);
tl.to('#slash path',{strokeDashoffset:0,duration:.3,ease:'power3.in'},17.25); sfx(17.3,'swipe',.9);
tl.to('#slash',{opacity:0,duration:.3},17.6);
tl.to('#hL',{x:-260,y:120,rotate:-14,opacity:.0,filter:'blur(6px)',duration:1.1,ease:'power3.in'},17.5);
tl.to('#hR',{x:260,y:160,rotate:12,opacity:.0,filter:'blur(6px)',duration:1.1,ease:'power3.in'},17.5); sfx(17.55,'impact',.6); push(17.55,1.2);
tl.fromTo('#s5c',{autoAlpha:0,scale:1.3,filter:'blur(20px)'},{autoAlpha:1,scale:1,filter:'blur(0px)',duration:.6,ease:'expo.out'},18.3); W('#s5c').forEach((w,i)=>sfx(18.32+i*.08,'key',1)); sfx(18.3,'impact',.6);
tl.to('#s5c',{y:-480,duration:.8,ease:'power3.inOut'},18.9);

// ---------- S6 FOUNDERS 19.75 - 23.75
trLeak('#s5','#s6',19.8); sfx(19.8,'impact',.8); drift('#s6',19.8,23.75,1,1.03);
fadeUp('#s6l',19.87,.6,15); keyRun(19.9,4);
tl.set('.pc',{autoAlpha:0},0);
tl.fromTo('#pedro',{autoAlpha:0,x:-200,rotateY:25,filter:'blur(16px)'},{autoAlpha:1,x:0,rotateY:6,filter:'blur(0px)',duration:1,ease:'expo.out'},20.4); sfx(20.4,'air',.6);
tl.fromTo('#gus',{autoAlpha:0,x:200,rotateY:-25,filter:'blur(16px)'},{autoAlpha:1,x:0,rotateY:-6,filter:'blur(0px)',duration:1,ease:'expo.out'},20.95); sfx(20.95,'air',.6);
tl.fromTo('#pedro .pn',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},20.8); keyRun(20.8,3);
tl.fromTo('#gus .pn',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},21.35); keyRun(21.35,3);
tl.fromTo('#pedro img',{scale:1.15},{scale:1.02,duration:3.5,ease:'power1.out'},20.4);
tl.fromTo('#gus img',{scale:1.15},{scale:1.02,duration:3,ease:'power1.out'},20.95);
tl.to(['#pedro','#gus'],{rotateY:0,duration:2,ease:'sine.inOut'},21.6);
tl.fromTo('#s6yn',{autoAlpha:0,scale:.4},{autoAlpha:1,scale:1,duration:.5,ease:'back.out(2.5)'},22.2); sfx(22.2,'impact',.6); sweep('#s6yn',22.4,.9);
rise('#s6y em',22.35,.08); rise('#s6b',22.8,.06);

// ---------- S7 100+ 23.75 - 27.55
trSoft('#s6','#s7',23.8); drift('#s7',23.8,27.55,1,1.03);
fadeUp('#s7l',23.85,.5,15); keyRun(23.9,5);
hooks.push(t=>{const p=clamp((t-24.2)/1.25);$('#s7n').textContent=Math.round(eo(p)*100)});
tl.fromTo('#s7p',{autoAlpha:0,scale:.3},{autoAlpha:1,scale:1,duration:.5,ease:'back.out(2.5)'},25.45); sfx(25.45,'impact',.7); push(25.5,1.2); sweep('#s7p',25.5,.8);
rise('#s7w',25.55,.06);
tl.to('#usmap',{opacity:1,duration:.4},25.6);
tl.fromTo('#usmap .ud',{opacity:0},{opacity:1,duration:.25,stagger:{each:.0006,from:'center'}},25.6);
tl.to('#usmap .arc',{strokeDashoffset:0,duration:.8,stagger:.04,ease:'power2.inOut'},25.8);
tl.fromTo('#usmap .city',{scale:0,transformOrigin:'center'},{scale:1,duration:.45,stagger:.04,ease:'back.out(3)'},25.95); sfx(25.8,'shimmer',.5);
fadeUp('#s7us',26.3,.7,30); sweep('#s7usg',26.6,1); keyRun(26.35,6);

// ---------- S8 UNIQUE + video1 27.55 - 35.15
trLeak('#s7','#s8',27.6); drift('#s8',27.6,35.15,1,1.03);
tl.set(['#n1','#n2','#n3'],{autoAlpha:0},0);
fadeUp('#s8l',27.72,.5,15); keyRun(27.75,5);
rise('#s8a',28.9,.08); sweep('#s8a .w',29.1,1); sfx(28.9,'shimmer',.6);
tl.fromTo('#vw2',{y:500,rotateX:30,autoAlpha:0},{y:0,rotateX:8,autoAlpha:1,duration:1.1,ease:'expo.out'},27.65); sfx(27.65,'air',.6);
tl.to('#vw2',{rotateX:0,duration:2.2,ease:'sine.inOut'},28.7);
tl.fromTo('#vw2 .vtag',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},28.2);
tl.fromTo('#vw2 .vshine',{xPercent:-130},{xPercent:130,duration:1.2,ease:'power2.inOut'},28.6);
tl.to(['#vw2','#s8l','#s8a'],{autoAlpha:0,scale:.92,filter:'blur(16px)',duration:.45,ease:'power2.in'},29.75);
tl.to('#s8bg',{opacity:1,duration:.6},29.8);
[['#n1',30.09],['#n2',31.23],['#n3',32.53]].forEach(([s,t])=>{tl.fromTo(s,{autoAlpha:0,x:-80,filter:'blur(12px)'},{autoAlpha:1,x:0,filter:'blur(0px)',duration:.6,ease:'expo.out'},t);
  tl.fromTo(s+' i',{scale:0,rotate:-90},{scale:1,rotate:0,duration:.45,ease:'back.out(3)'},t+.05); keyRun(t+.02,Math.round($(s).textContent.length/3)); sfx(t,'tap',.5)});
tl.to(['#n1','#n2'],{opacity:.45,duration:.4},33.6);

// ---------- S9 REAL DESIGNERS + video2 35.15 - 39.15
trSoft('#s8','#s9',35.2); drift('#s9',35.2,39.15,1,1.03);
rise('#s9a',35.25,.08); rise('#s9b',36.41,.06); rise('#s9c',37.3,.08); sweep('#s9c .w',37.55,1);
tl.fromTo('#vw3',{y:500,rotateY:-25,autoAlpha:0},{y:0,rotateY:-6,autoAlpha:1,duration:1.1,ease:'expo.out'},35.3); sfx(35.3,'air',.6);
tl.to('#vw3',{rotateY:6,duration:3,ease:'sine.inOut'},36.3);
tl.fromTo('#vw3 .vtag',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},36.0);
tl.fromTo('#vw3 .vshine',{xPercent:-130},{xPercent:130,duration:1.2,ease:'power2.inOut'},37.0);

// ---------- S10 PROCESS 39.15 - 45.15
trLeak('#s9','#s10',39.2); drift('#s10',39.2,45.15,1,1.02);
fadeUp('#s10l',39.22,.6,20); keyRun(39.25,3);
const pT=[40.09,41.01,42.03,43.35];
tl.set('#track',{x:0},0);
pT.forEach((t,i)=>{if(i>0){tl.to('#track',{x:-1000*i,duration:.75,ease:'power4.inOut'},t-.45);sfx(t-.45,'air',.55)}
  tl.fromTo(`#p${i+1} .n`,{autoAlpha:0,x:60},{autoAlpha:1,x:0,duration:.8,ease:'expo.out'},t-.15);
  tl.fromTo(`#p${i+1} .t`,{autoAlpha:0,y:60,filter:'blur(12px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:.8,ease:'expo.out'},t-.05);
  tl.fromTo(`#p${i+1} .s`,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},t+.25);
  tl.to('#tline',{scaleX:(i+1)/4.4,duration:.7,ease:'power2.inOut'},t-.45); keyRun(t,4)});
sweep('#paygold',44.0,1); sfx(44.1,'chime',.7);

// ---------- S11 ZERO RISK 45.15 - 46.5
trLeak('#s10','#s11',45.25); drift('#s11',45.25,46.5,1.06,1);
blurIn('#s11a',45.27,.7,1.3); sfx(45.27,'impact',1.0); push(45.3,2); sweep('#s11g',45.5,.9);

// ---------- S12 CTA 46.5 - end
trSoft('#s11','#s12',46.55); drift('#s12',46.55,DUR,1,1.03);
blurIn('#sym12',46.55,1,1.3);
tl.fromTo('#wm12 .L',{y:30,autoAlpha:0,filter:'blur(8px)'},{y:0,autoAlpha:1,filter:'blur(0px)',duration:.7,stagger:.05,ease:'expo.out'},46.7);
tl.fromTo('#tg12',{autoAlpha:0},{autoAlpha:1,duration:.8},47.0);
sweepLogo('#logo12',47.4,1.2);
rise('#s12a',46.6,.07); rise('#s12b',47.35,.09); sweep('#s12b .w',47.6,1.1); sfx(47.35,'shimmer',.8);
fadeUp('#s12btn',47.9,.8,60); sfx(47.9,'tap',.6);
tl.fromTo('#btn',{boxShadow:'0 0 0 0 rgba(255,196,0,.5), 0 30px 80px rgba(255,196,0,.3), inset 0 2px 0 rgba(255,255,255,.5)'},{boxShadow:'0 0 0 30px rgba(255,196,0,0), 0 30px 80px rgba(255,196,0,.3), inset 0 2px 0 rgba(255,255,255,.5)',duration:1.1,repeat:2,ease:'power1.out'},48.4);
fadeUp('#s12f',48.5,.7,20);
tl.set({},{},DUR);
