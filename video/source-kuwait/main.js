// NewWay Kuwait ad — "العكس" (the opposite). One yellow dot carries the story from scene to scene.
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const DUR=33.4,SFX=[],hooks=[];const sfx=(t,type,g=1)=>SFX.push({t:+t.toFixed(3),type,g});
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,e5=x=>1-Math.pow(1-x,5);
const WS=WD.words,T=i=>WS[i].t;
const CX=540,CY=960;

// ---------- logo
const LG={sym:'392 370 290 138',wm:'196 544 688 110',tg:'258 676 558 34'};
const paintLogo=(sel,col,part)=>{const el=$(sel);el.setAttribute('viewBox',LG[part]);
 if(part==='sym')el.innerHTML=LOGO.symbol.map(d=>`<path fill="${col}" d="${d}"/>`).join('');
 else if(part==='wm')el.innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');
 else el.innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`};
paintLogo('#lgSym','#FFC400','sym');paintLogo('#lgWm','#fff','wm');paintLogo('#lgTg','#9a9aa0','tg');
paintLogo('#avN1','#FFC400','sym');paintLogo('#avN2','#FFC400','sym');paintLogo('#enSym','#FFC400','sym');
$('#lgSym').setAttribute('height',143);$('#lgWm').setAttribute('height',125);$('#lgWm').setAttribute('width',780);$('#lgWm').style.left='150px';
$('#lgTg').setAttribute('height',34);$('#lgTg').setAttribute('width',560);$('#lgTg').style.left='260px';$('#lgTg').style.top='420px';
$('#enSym').setAttribute('height',67);

// ---------- illustrations (Kuwait at dusk + gallery photos)
const towers=(id)=>`<svg viewBox="0 0 840 500" preserveAspectRatio="xMinYMid slice" width="100%" height="100%">
<defs><linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a3c"/><stop offset=".45" stop-color="#4a2f5e"/><stop offset=".72" stop-color="#e2774a"/><stop offset=".86" stop-color="#ffc56c"/></linearGradient>
<linearGradient id="sea${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2648"/><stop offset="1" stop-color="#0c1028"/></linearGradient>
<radialGradient id="sp${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#3f5f8a"/><stop offset=".6" stop-color="#1b2448"/><stop offset="1" stop-color="#11152c"/></radialGradient>
<pattern id="mo${id}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.3" fill="#5fa3b8" opacity=".45"/></pattern>
<linearGradient id="ov${id}" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#0b0e22" stop-opacity=".75"/><stop offset=".55" stop-color="#0b0e22" stop-opacity="0"/></linearGradient></defs>
<rect width="840" height="500" fill="url(#sky${id})"/><circle cx="250" cy="352" r="78" fill="#ffd98e" opacity=".92"/>
<path d="M0 340h40v-18h30v26h26v-40h22v40h40v-12h30v12h470v16H0z" fill="#191b38"/>
<path d="M520 362v-30h26v-22h18v22h30v-46h24v46h40v-16h28v16h40v-36h22v36h92v20z" fill="#191b38"/>
<rect y="360" width="840" height="140" fill="url(#sea${id})"/>
<g fill="#ffcf7a" opacity=".55"><rect x="200" y="378" width="100" height="5" rx="2.5"/><rect x="214" y="396" width="72" height="4" rx="2"/><rect x="228" y="414" width="44" height="4" rx="2"/><rect x="238" y="432" width="24" height="3" rx="1.5"/></g>
<g fill="#13162e"><path d="M225 362l3-322h4l3 322z"/><path d="M297 362l2.5-212h3l2.5 212z"/><path d="M168 362l1.6-170h1.8l1.6 170z"/></g>
<circle cx="230" cy="206" r="54" fill="url(#sp${id})"/><circle cx="230" cy="206" r="54" fill="url(#mo${id})"/><rect x="176" y="203" width="108" height="6" fill="#13162e"/>
<circle cx="230" cy="120" r="27" fill="url(#sp${id})"/><circle cx="230" cy="120" r="27" fill="url(#mo${id})"/>
<circle cx="300" cy="252" r="38" fill="url(#sp${id})"/><circle cx="300" cy="252" r="38" fill="url(#mo${id})"/>
<rect width="840" height="500" fill="url(#ov${id})"/></svg>`;
const ph=[
 // dallah (Arabic coffee pot)
 `<svg viewBox="0 0 268 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d9b1"/><stop offset="1" stop-color="#d9a86c"/></linearGradient><linearGradient id="g1b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a1c"/><stop offset=".45" stop-color="#f6cf74"/><stop offset="1" stop-color="#9a6a24"/></linearGradient></defs>
 <rect width="268" height="190" fill="url(#g1)"/><ellipse cx="134" cy="172" rx="70" ry="10" fill="#b98447" opacity=".5"/>
 <path d="M112 170c-14-4-18-30-8-52 6-13 4-24 2-32h56c-2 8-4 19 2 32 10 22 6 48-8 52z" fill="url(#g1b)"/><path d="M106 86c8-30 48-30 56 0z" fill="url(#g1b)"/><path d="M128 56h12l-2-14h-8z" fill="#c8923d"/><circle cx="134" cy="38" r="6" fill="#f2c25c"/>
 <path d="M104 120c-18-4-30-26-52-30 18 8 26 30 50 40z" fill="url(#g1b)"/><path d="M164 96c22 2 24 40 6 56" fill="none" stroke="#a06e28" stroke-width="7" stroke-linecap="round"/>
 <g fill="#fff" opacity=".7"><circle cx="70" cy="40" r="2"/><circle cx="200" cy="60" r="1.6"/></g>
 <rect x="194" y="128" width="30" height="40" rx="5" fill="#fff" opacity=".9"/><rect x="198" y="132" width="22" height="10" rx="3" fill="#6b3f12" opacity=".6"/></svg>`,
 // mashrabiya arch with light
 `<svg viewBox="0 0 268 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><defs><pattern id="ms" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M11 0l11 11-11 11L0 11z" fill="none" stroke="#5b3a1a" stroke-width="3"/><circle cx="11" cy="11" r="3" fill="#5b3a1a"/></pattern>
 <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a8"/><stop offset="1" stop-color="#f29a4a"/></linearGradient></defs>
 <rect width="268" height="190" fill="#2a1b10"/><path d="M74 190V80a60 60 0 0 1 120 0v110z" fill="url(#g2)"/><path d="M74 190V80a60 60 0 0 1 120 0v110z" fill="url(#ms)" opacity=".85"/>
 <path d="M74 190V80a60 60 0 0 1 120 0v110" fill="none" stroke="#c98a3c" stroke-width="6"/><path d="M60 190l40-60h68l40 60z" fill="#ffcf7a" opacity=".22"/></svg>`,
 // dhow at sea
 `<svg viewBox="0 0 268 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4dc"/><stop offset=".62" stop-color="#e8f3f2"/><stop offset=".62" stop-color="#2f7d99"/><stop offset="1" stop-color="#1c5670"/></linearGradient></defs>
 <rect width="268" height="190" fill="url(#g3)"/><circle cx="200" cy="44" r="18" fill="#fff6d8"/>
 <path d="M70 128h120l-18 20H92z" fill="#6b3b1a"/><path d="M128 128V40" stroke="#4a2810" stroke-width="4"/><path d="M130 44c30 20 44 50 46 80H130z" fill="#fbf4e6"/><path d="M126 52c-18 18-34 44-38 72h38z" fill="#f2e6cf"/>
 <g stroke="#fff" stroke-width="2.4" opacity=".55" stroke-linecap="round"><path d="M40 160h40M150 168h60M100 178h30"/></g></svg>`];
const ICON={brush:'<path d="M9 15c-2 0-4 1.5-4 4 2 0 4-.5 5-1.5M14 4l6 6-8 8-6-6z"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'};
const ic=k=>`<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFC400" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;
$('#site').innerHTML=`
 <div class="wf" style="left:30px;right:30px;top:14px;height:60px"></div><div class="wf" style="left:30px;right:30px;top:86px;height:500px"></div>
 <div class="wf" style="left:30px;right:30px;top:668px;height:190px"></div><div class="wf" style="left:30px;right:30px;top:942px;height:150px"></div>
 <div class="nav" id="sNav"><div class="brand"><i></i>مشروعك</div><div class="menu"><span>الرئيسية</span><span>خدماتنا</span><span>معرض</span><span>تواصل</span></div></div>
 <div class="hero" id="sHero">${towers('a')}<div class="htx"><small id="hS">الكويت · ٢٠٢٦</small><h1 id="hH"><span class="hw">مشروعك</span> <span class="hw">يستاهل</span> <span class="hw">موقع</span> <span class="hw">يليق</span> <span class="hw">فيه</span></h1><div class="hbtn" id="hB">اطلب الحين ←</div></div></div>
 <div class="sec" id="sec1" style="top:618px">معرض الصور</div>
 <div class="gal">${ph.map((p,i)=>`<div class="ph" id="g${i}">${p}</div>`).join('')}</div>
 <div class="sec" id="sec2" style="top:892px">خدماتنا</div>
 <div class="srv">${[['brush','تصميم'],['chat','استشارة'],['star','جودة']].map(([k,n],i)=>`<div class="c" id="v${i}"><div class="ic">${ic(k)}</div><b>${n}</b><em></em></div>`).join('')}</div>`;
// swipe cards: mobile version of the same site
const cardHTML=(id,tint)=>`<div class="hero">${towers(id)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,34,0) 35%,rgba(11,14,34,.85))"></div></div>
 <div style="position:absolute;right:36px;top:40px;display:flex;align-items:center;gap:12px;color:#fff;font:700 28px R"><i style="width:40px;height:40px;border-radius:12px;background:${tint};display:block"></i>مشروعك</div>
 <h2 style="top:400px">موقع يليق<br>بمشروعك</h2><div class="cb" style="top:548px;right:auto;left:40px">اطلب الحين</div>
 <div class="row">${ph.map(p=>`<i>${p}</i>`).join('')}</div>
 <div class="ln" style="top:840px;width:380px"></div><div class="ln" style="top:870px;width:280px"></div><div class="ln" style="top:900px;width:330px"></div>`;
$('#cd1').innerHTML=cardHTML('b','#FFC400');$('#cd2').innerHTML=cardHTML('c','#fff');
$('#cd1').appendChild($('#stY'));$('#cd2').appendChild($('#stN'));
$('#stY').style.cssText+=';left:40px;top:70px';$('#stN').style.cssText+=';left:auto;right:40px;top:70px';
// preview in chat bubble = scaled clone of the finished site
$('#b1prev').innerHTML=`<div style="position:absolute;left:0;top:0;width:900px;height:700px;transform:scale(.44);transform-origin:0 0">${$('#site').outerHTML.replace('id="site"','')}</div>`;
$('#b1prev .site').style.top='0';$$('#b1prev .wf').forEach(e=>e.remove());$$('#b1prev [id]').forEach(e=>e.removeAttribute('id'));
// reels for the price
const FIN=[1,4,9],REEL=[];
$('#reels').innerHTML=FIN.map((d,i)=>{const n=[];for(let k=0;k<20+i*5;k++)n.push((k*7+i*3)%10);n.push(d);REEL.push(n.length-1);return `<div class="reel"><div id="rl${i}" class="strip">${n.map((v,j)=>`<b style="top:${j*270}px">${v}</b>`).join('')}</div></div>`}).join('');
// portfolio wall
const SH=['alpha','brother','jgc','deck','poenza','kundara','paint'];
$('#wallWrap').innerHTML=[0,1,2,3].map(c=>`<div class="col" id="col${c}" style="left:${c*470}px">${[...Array(12)].map((_,j)=>`<div class="t"><img src="c/${SH[(j*3+c*2)%SH.length]}.jpg"></div>`).join('')}</div>`).join('');
// rays for "ready"
$('#rays').innerHTML=[...Array(14)].map((_,i)=>`<i style="position:absolute;left:-4px;top:-330px;width:8px;height:60px;border-radius:4px;background:${i%2?'#0b0b0c':'#FFC400'};transform-origin:4px 330px;transform:rotate(${i*360/14}deg)"></i>`).join('');

// ================= TIMELINE
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
const show=(s,t)=>tl.set(s,{visibility:'visible'},t),hide=(s,t)=>tl.set(s,{visibility:'hidden'},t);
const fT=(s,a,b,t,d=.5,ease)=>tl.fromTo(s,a,Object.assign({duration:d,immediateRender:false},ease?{ease}:{},b),t);
function punch(t,k=1){tl.fromTo('#cam',{scale:1+.035*k},{scale:1,duration:.6,ease:'expo.out',immediateRender:false},t)}
function shake(t,a=14,n=6){tl.to('#cam',{keyframes:{x:[...Array(n)].map((_,i)=>(i%2?-1:1)*a*(1-i/n)).concat(0),y:[...Array(n)].map((_,i)=>(i%2?1:-1)*a*.6*(1-i/n)).concat(0)},duration:.32,ease:'none'},t)}
function tap(t,x,y,sel='#tap'){tl.set(sel,{left:x,top:y},t);fT(sel,{opacity:.95,scale:.4},{opacity:0,scale:1.6},t,.45,'power2.out');sfx(t,'tap',.7)}
const circ=(r,x=CX,y=CY)=>`circle(${r}px at ${x}px ${y}px)`;
function wipe(sel,t,x,y,d=.55,open=true,ease='expo.inOut'){fT(sel,{clipPath:circ(open?0:2300,x,y)},{clipPath:circ(open?2300:0,x,y)},t,d,ease)}
const cap={};// caption theme by time
const theme=t=>((t>=3.86&&t<10.3)||(t>=26.5&&t<30.45))?'lt':(t>=15.2&&t<20.95)?'yl':'';

// ---- S1 HOOK 0 - 3.27 -----------------------------------------------------------
show('#s1',0);
tl.set('#pay',{scale:0},0);tl.set('#bw1',{y:-1100},0);tl.set('#qmark',{autoAlpha:0},0);
fT('#pay',{scale:0},{scale:1},0.02,.38,'back.out(2.4)');sfx(0,'boom',.8);sfx(0.02,'pop',.6);
fT('#pay',{width:140,marginLeft:-70},{width:560,marginLeft:-280},.26,.42,'expo.out');fT('#payTx',{opacity:0,x:30},{opacity:1,x:0},.36,.3);sfx(.26,'swish',.4);
tap(T(1)+.02,700,1240);fT('#pay',{scale:1},{scale:.9},T(1)+.02,.08,'power2.out');fT('#pay',{scale:.9},{scale:1},T(1)+.1,.4,'back.out(3)');sfx(T(1)+.08,'cash',.8);
hooks.push(t=>{$('#payW').textContent=t<T(1)+.12?'ادفع الحين':'تم الدفع ✓'});
fT('#bw1',{y:-1100,rotation:-4},{y:0,rotation:0},T(2)-.12,.55,'expo.out');sfx(T(2)-.15,'whoosh',.6);sfx(T(2)+.25,'thud',.6);
hooks.push(t=>{const v=((t*1.1)%1.4)/1.4;$$('#bw1s .sk').forEach(e=>e.style.setProperty('--sh',(-100+v*260)+'%'))});
fT('#blind',{opacity:0},{opacity:1},T(4),.4,'power2.out');sfx(T(4),'glitch',.35);
{const L=25.5;tl.set('#eyeSl',{attr:{'stroke-dasharray':L,'stroke-dashoffset':L}},0);fT('#eyeSl',{attr:{'stroke-dashoffset':L}},{attr:{'stroke-dashoffset':0}},T(4)+.25,.35,'power2.inOut');sfx(T(4)+.25,'swipe',.5)}
fT('#eyeX',{scale:.6},{scale:1},T(4),.5,'back.out(2)');
fT('#bw1',{scale:1},{scale:1.05},T(4),1.6,'sine.inOut');
fT('#qmark',{autoAlpha:0,scale:2.6,rotation:25},{autoAlpha:1,scale:1,rotation:-8},T(7),.42,'expo.out');sfx(T(7),'impact',.9);shake(T(7)+.05,16);
tl.to('#qmark',{rotation:4,duration:.6,ease:'sine.inOut'},T(7)+.45);
fT('#pay',{y:0},{y:30,opacity:.35},T(7),.4);
// out: zoom blur
fT('#s1',{scale:1,filter:'blur(0px)',opacity:1},{scale:1.5,filter:'blur(22px)',opacity:0},3.05,.28,'power3.in');hide('#s1',3.34);sfx(3.0,'zoom',.6);

// ---- S2 THE OPPOSITE 3.27 - 5.1 -------------------------------------------------
show('#s2',3.26);
fT(['#cPay','#arr','#cSee'],{autoAlpha:0,y:120,scale:.8},{autoAlpha:1,y:0,scale:1,stagger:.07},3.27,.45,'expo.out');
fT(['#s2lab','#nums'],{autoAlpha:0},{autoAlpha:1},3.3,.3);
const FL=T(9)-.02; // "العكس"
sfx(FL-.3,'rewind',.9);
wipe('#bgL',FL,CX,900,.6);
tl.to('#cPay',{keyframes:{x:[0,-260,-520],y:[0,-260,0],rotation:[0,-12,0],easeEach:'sine.inOut'},duration:.62,ease:'power2.inOut'},FL);
tl.to('#cSee',{keyframes:{x:[0,260,520],y:[0,240,0],rotation:[0,12,0],easeEach:'sine.inOut'},duration:.62,ease:'power2.inOut'},FL);
fT('#cSee',{backgroundColor:'#1a1a1d',color:'#ffffff',boxShadow:'0 0 0 2px #2a2a2e'},{backgroundColor:'#FFC400',color:'#0b0b0c',boxShadow:'0 30px 60px rgba(160,120,0,.25)'},FL+.2,.35);
fT('#cPay',{backgroundColor:'#1a1a1d',color:'#ffffff',boxShadow:'0 0 0 2px #2a2a2e'},{backgroundColor:'#ffffff',color:'#0b0b0c',boxShadow:'0 0 0 2px #dcdce0'},FL+.2,.35);
fT('#arr path',{stroke:'#8a8a90'},{stroke:'#0b0b0c'},FL+.2,.3);fT(['#nums','#s2lab'],{color:'#8a8a90'},{color:'#0b0b0c'},FL+.2,.3);
fT('#arr',{rotation:0},{rotation:360},FL,.62,'power2.inOut');
hooks.push(t=>{$('#s2lab').textContent=t<FL+.25?'الطريقة المعتادة':'عندنا: العكس'});
// swap the step numbers with the cards
hooks.push(t=>{const sw=t>=FL+.3;$('#cPay span').textContent=sw?'٢':'١';$('#cSee span').textContent=sw?'١':'٢'});
punch(T(10),1.4);sfx(T(10),'impact',.7);fT('#cSee',{scale:1},{scale:1.08},T(10),.18,'power2.out');tl.to('#cSee',{scale:1,duration:.4,ease:'back.out(3)'},T(10)+.18);
fT(['#cSee','#cPay','#arr','#nums','#s2lab'],{y:0,autoAlpha:1},{y:-260,autoAlpha:0,stagger:.04},4.86,.3,'power3.in');hide('#s2',5.25);sfx(4.84,'air',.6);

// ---- S3 WE BUILD IT FIRST 5.1 - 8.89 --------------------------------------------
show('#s3',5.0);
tl.set(['#sNav','#sHero','#sec1','#sec2','.gal .ph','.srv .c','#first'],{autoAlpha:0},0);
fT('#bw2',{autoAlpha:0,y:300,rotationX:28},{autoAlpha:1,y:0,rotationX:0},5.02,.6,'expo.out');sfx(5.0,'whoosh',.55);
fT('#bw2',{rotationY:-7},{rotationY:5},5.1,3.8,'sine.inOut');
fT('#sNav',{autoAlpha:0,y:-30},{autoAlpha:1,y:0},T(12),.3);sfx(T(12),'click',.4);
fT('#sHero',{autoAlpha:1,clipPath:'inset(0 0 0 100% round 26px)'},{autoAlpha:1,clipPath:'inset(0 0 0 0% round 26px)'},T(12)+.08,.5,'expo.inOut');sfx(T(12)+.08,'swish',.5);
fT('#sHero svg',{scale:1.25},{scale:1},T(12)+.08,1.6,'expo.out');
fT('#hH .hw',{autoAlpha:0,y:40},{autoAlpha:1,y:0,stagger:.06},T(13),.4,'expo.out');fT('#hS',{autoAlpha:0},{autoAlpha:1},T(13),.3);
fT('#hB',{autoAlpha:0,scale:.6},{autoAlpha:1,scale:1},T(14)-.05,.4,'back.out(2.2)');sfx(T(14)-.05,'pop',.5);
fT(['#sec1','#sec2'],{autoAlpha:0,x:40},{autoAlpha:1,x:0,stagger:.1},T(14),.35);
fT('#first',{autoAlpha:0,scale:2.4,rotation:-40},{autoAlpha:1,scale:1,rotation:12},T(15),.36,'expo.out');sfx(T(15),'stamp',.9);shake(T(15)+.03,9,4);
tl.to('#first',{rotation:-4,duration:2,ease:'sine.inOut'},T(15)+.4);
// photos drop into the gallery
[0,1,2].forEach(i=>{const t=T(16)+i*.12;fT('#g'+i,{autoAlpha:0,scale:2.2,rotation:[-16,10,-8][i],y:-120,x:[60,0,-60][i]},{autoAlpha:1,scale:1,rotation:0,y:0,x:0},t,.42,'expo.out');sfx(t+.12,'snap',.55)});
[0,1,2].forEach(i=>{const t=T(17)+i*.08;fT('#v'+i,{autoAlpha:0,y:90},{autoAlpha:1,y:0},t,.4,'back.out(1.6)');fT(`#v${i} .ic`,{scale:0,rotation:-90},{scale:1,rotation:0},t+.1,.4,'back.out(2.5)');sfx(t,'pop',.35)});
fT('#first',{autoAlpha:1},{autoAlpha:0,scale:.6},8.7,.2,'power2.in');

// ---- S4 SENT TO YOU 8.89 - 10.4 -------------------------------------------------
show('#s4',8.8);tl.set('#b1',{autoAlpha:0},0);
fT('#bw2',{scale:1,y:0,x:0},{scale:.44,x:20,y:381,rotationY:0},8.82,.5,'expo.inOut');
fT('#bw2',{autoAlpha:1},{autoAlpha:0},9.25,.12,'none');hide('#s3',9.4);sfx(8.82,'swish',.6);
fT('#ph1',{y:1300,rotationX:20},{y:0,rotationX:0},8.84,.55,'expo.out');
fT('#b1',{autoAlpha:0,scale:.9,y:30},{autoAlpha:1,scale:1,y:0},9.3,.35,'back.out(1.8)');sfx(9.3,'msg',.8);
fT('#ph1',{scale:1},{scale:1.04},T(20),.12,'power2.out');tl.to('#ph1',{scale:1,duration:.4,ease:'back.out(3)'},T(20)+.12);sfx(T(20),'notif',.6);
// dive into the preview
fT('#cam',{scale:1},{scale:3.2,transformOrigin:'540px 760px'},10.08,.32,'power3.in');
fT('#s4',{filter:'blur(0px)',opacity:1},{filter:'blur(18px)',opacity:0},10.22,.18,'none');hide('#s4',10.42);sfx(10.02,'zoom',.7);
wipe('#bgL',10.2,540,760,.25,false,'power2.in');
tl.set('#cam',{scale:1,transformOrigin:'540px 900px'},10.41);

// ---- S5 LIKE IT? PAY. NOT? ZERO. 10.41 - 15.0 -----------------------------------
show('#s5',10.4);tl.set(['#paid','#zero','#stY','#stN'],{autoAlpha:0},0);tl.set(['#btnN','#btnY'],{autoAlpha:0},0);
fT('#cd1',{scale:1.6,filter:'blur(18px)',opacity:0},{scale:1,filter:'blur(0px)',opacity:1},10.41,.45,'expo.out');
fT(['#btnN','#btnY'],{autoAlpha:0,scale:0},{autoAlpha:1,scale:1,stagger:.06},10.45,.4,'back.out(2.4)');
const LK=T(22);tap(LK,705,1330);fT('#btnY',{scale:1},{scale:.86},LK,.08);tl.to('#btnY',{scale:1,duration:.35,ease:'back.out(3)'},LK+.08);
fT('#stY',{autoAlpha:0,scale:2.2},{autoAlpha:1,scale:1},LK+.04,.25,'expo.out');sfx(LK+.04,'stamp',.6);
fT('#cd1',{x:0,rotation:0},{x:980,rotation:24,y:-80},LK+.28,.42,'power3.in');sfx(LK+.28,'whoosh',.55);
fT('#cd2',{scale:.9,y:40},{scale:1,y:0},LK+.4,.45,'expo.out');
fT(['#btnN','#btnY'],{autoAlpha:1},{autoAlpha:0,scale:.6},T(23)-.12,.14,'power2.in');
fT('#paid',{autoAlpha:0,scale:.4},{autoAlpha:1,scale:1},T(23),.42,'back.out(2.4)');sfx(T(23),'cash',.9);punch(T(23),.8);
fT('#paid',{autoAlpha:1},{autoAlpha:0,scale:.7,y:40},T(24)-.15,.18,'power2.in');
fT(['#btnN','#btnY'],{autoAlpha:0,scale:.6},{autoAlpha:1,scale:1,stagger:.05},T(24),.32,'back.out(2.4)');
const NO=T(26);tap(NO,375,1330);fT('#btnN',{scale:1},{scale:.86},NO,.08);tl.to('#btnN',{scale:1,duration:.35,ease:'back.out(3)'},NO+.08);
fT('#stN',{autoAlpha:0,scale:2.2},{autoAlpha:1,scale:1},NO+.04,.25,'expo.out');sfx(NO+.04,'stamp',.6);
fT('#cd2',{x:0,rotation:0},{x:-980,rotation:-24,y:-80},NO+.3,.42,'power3.in');sfx(NO+.3,'whoosh',.55);
fT(['#btnN','#btnY'],{autoAlpha:1},{autoAlpha:0,scale:.6},NO+.5,.2,'power2.in');
fT('#zero',{autoAlpha:0,scale:1.8,filter:'blur(20px)'},{autoAlpha:1,scale:1,filter:'blur(0px)'},T(27),.42,'expo.out');sfx(T(27),'hit',.7);
hooks.push(t=>{const a=T(27);$('#zN').textContent=t<a+.6&&t>=a?(9.999*(1-e5(clamp((t-a)/.6)))).toFixed(3):'0.000'});
for(let i=0;i<6;i++)sfx(T(27)+i*.09,'tick',.3);
shake(T(30),18,7);sfx(T(30),'impact',.9);fT('#zero',{scale:1},{scale:1.08},T(30),.12,'power2.out');tl.to('#zero',{scale:1,duration:.5,ease:'back.out(2)'},T(30)+.12);
// dot appears and opens into yellow
gsap.set('#dot',{x:CX,y:1250,scale:0,opacity:0});
fT('#dot',{opacity:1,scale:0},{opacity:1,scale:1},14.62,.25,'back.out(3)');sfx(14.62,'pop',.6);
fT('#zero',{autoAlpha:1},{autoAlpha:0,y:-120},14.72,.22,'power2.in');
wipe('#bgY',14.86,CX,1250,.5);fT('#dot',{scale:1},{scale:3},14.86,.2,'power2.in');tl.set('#dot',{opacity:0},15.06);hide('#s5',15.2);sfx(14.82,'riser',.5);

// ---- S6 PRICE 15.02 - 18.2 ------------------------------------------------------
show('#s6',15.0);tl.set(['#bas','#yr1','#fHost','#fDom','#fr1','#fr2','#plus'],{autoAlpha:0},0);tl.set('#ribbon',{scaleX:0},0);tl.set('#cur',{autoAlpha:0},0);
fT('#tag',{y:-1300,rotation:0},{y:0},15.02,.5,'expo.out');sfx(15.02,'whoosh',.6);
tl.set('#tag',{rotation:-14},15.0);tl.to('#tag',{keyframes:{rotation:[-14,9,-5,2.5,-1,0],easeEach:'sine.inOut'},duration:1.6,ease:'none'},15.2);
const P=T(32);fT('#qm',{autoAlpha:1},{autoAlpha:0,scale:.5},P-.08,.15,'power2.in');
hooks.push(t=>{FIN.forEach((d,i)=>{const L=P+.32+i*.26,n=REEL[i];let y;if(t<P){y=0}else{const p=clamp((t-P)/(L-P));y=-e5(p)*n*270}
 $('#rl'+i).style.transform=`translateY(${y}px)`;$('#rl'+i).style.filter=t>=P&&t<L-.1?`blur(${(3*(1-clamp((t-P)/(L-P)))).toFixed(1)}px)`:'none'})});
tl.set('.reels',{autoAlpha:0},0);tl.set('.reels',{autoAlpha:1},P-.02);
for(let i=0;i<14;i++)sfx(P+i*.055,'tick',.32);[0,1,2].forEach(i=>sfx(P+.32+i*.26,'clunk',.75));
punch(P+.84,1.2);fT('#flash',{opacity:.35},{opacity:0},P+.84,.35,'power2.out');
fT('#cur',{autoAlpha:0,y:30},{autoAlpha:1,y:0},T(33)-.05,.35);
fT('#bas',{autoAlpha:0,scale:2.4,rotation:-50},{autoAlpha:1,scale:1,rotation:-12},T(34),.36,'expo.out');sfx(T(34),'stamp',.95);shake(T(34)+.03,12,5);
tl.to('#bas',{rotation:-4,duration:.8,ease:'sine.inOut'},T(34)+.4);

// ---- S7 FIRST YEAR FREE 18.2 - 21.09 --------------------------------------------
fT('#tag',{y:0,scale:1},{y:-80,scale:.6},17.96,.5,'expo.inOut');fT('#bas',{x:0,y:0,scale:1},{x:-80,y:-405,scale:.55},17.96,.5,'expo.inOut');sfx(17.94,'swish',.5);
fT('#yr1',{autoAlpha:0,y:50,scale:.8},{autoAlpha:1,y:0,scale:1},T(35),.4,'back.out(2)');sfx(T(35),'pop',.5);
fT('#fHost',{autoAlpha:0,y:220,rotation:8},{autoAlpha:1,y:0,rotation:-2},T(37),.5,'expo.out');sfx(T(37),'snap',.6);
hooks.push(t=>{const on=t>=T(37)+.2;[1,2,3,4].forEach(i=>{const b=on&&Math.floor(t*7+i*1.7)%3!==0;$('#l'+i).style.background=b?(i%2?'#2bd46b':'#FFC400'):'#2c2c30'})});
fT('#fDom',{autoAlpha:0,y:220,rotation:-8},{autoAlpha:1,y:0,rotation:2},T(38),.5,'expo.out');sfx(T(38),'snap',.6);
{const D='yourbrand.com.kw',a=T(38)+.08;hooks.push(t=>{const n=t<a?0:Math.min(D.length,Math.floor((t-a)/.026)+1);$('#domT').textContent=D.slice(0,n);$('#domC').style.opacity=Math.floor(t/.28)%2?1:.15});
 for(let i=0;i<D.length;i+=2)sfx(a+i*.026,'key',.3)}
const ON=T(39);
fT('#ribbon',{scaleX:0},{scaleX:1},ON-.04,.38,'expo.out');sfx(ON-.06,'swipe',.7);
hooks.push(t=>{$('#ribbon div').style.transform=`translateX(${((t-ON)*120).toFixed(1)}px)`});
fT('#fr1',{autoAlpha:0,scale:0,rotation:-30},{autoAlpha:1,scale:1,rotation:-6},ON+.08,.35,'back.out(3)');fT('#fr2',{autoAlpha:0,scale:0,rotation:30},{autoAlpha:1,scale:1,rotation:5},ON+.16,.35,'back.out(3)');
sfx(ON+.08,'shimmer',.6);punch(ON+.08,.8);
// collapse yellow into the dot
fT('#s6',{scale:1,rotation:0,opacity:1},{scale:.08,rotation:20,opacity:0},20.78,.32,'power3.in');hide('#s6',21.12);
wipe('#bgY',20.78,CX,CY,.34,false,'power3.in');sfx(20.7,'riser',.6);
fT('#dot',{x:CX,y:CY,scale:6,opacity:1},{scale:.5,opacity:1},20.82,.3,'power3.in');

// ---- S8 LOGO 21.09 - 23.0 -------------------------------------------------------
show('#s8',21.05);tl.set(['#lgSym','#lgTg'],{autoAlpha:0},0);tl.set('#lgWm .L',{opacity:0},0);
fT('#dot',{scale:.5},{scale:1.3,x:CX,y:712},21.1,.2,'power2.out');fT('#dot',{opacity:1},{opacity:0},21.22,.15,'none');
sfx(21.08,'boom',1);fT('#flash',{opacity:.16},{opacity:0},21.1,.25,'power2.out');shake(21.1,10,5);
fT('#lgSym',{autoAlpha:1,clipPath:'inset(0 0 0 100%)',scale:.7},{autoAlpha:1,clipPath:'inset(0 0 0 0%)',scale:1},21.18,.5,'expo.out');
fT('#lgWm .L',{opacity:0,yPercent:120},{opacity:1,yPercent:0,stagger:.045},21.42,.5,'expo.out');sfx(21.42,'shimmer',.4);
fT('#lgTg',{autoAlpha:0,y:16},{autoAlpha:1,y:0},21.9,.4);
fT('#lgSh',{x:0},{x:1700},22.15,.8,'power2.inOut');
fT('#lgBox',{scale:1},{scale:1.06},21.1,1.9,'none');
// logo recedes, wall flies in
fT('#lgBox',{autoAlpha:1,scale:1.06},{autoAlpha:0,scale:.4,y:-200},22.88,.3,'power3.in');hide('#s8',23.25);sfx(22.86,'zoom',.65);

// ---- S9 PORTFOLIO 23.04 - 26.39 -------------------------------------------------
show('#s9',22.9);tl.set(['#hund','#five'],{autoAlpha:0},0);tl.set('#globe',{autoAlpha:0},0);
fT('#wallOuter',{autoAlpha:0,y:900,scale:1.3},{autoAlpha:1,y:0,scale:1},22.95,.8,'expo.out');
hooks.push(t=>{[0,1,2,3].forEach(c=>{const d=c%2?1:-1;const y=-700+d*(t-23)*170+(c%2?-260:0);$('#col'+c).style.transform=`translateY(${y.toFixed(1)}px)`})});
fT('#hund',{autoAlpha:0,scale:1.5,filter:'blur(16px)'},{autoAlpha:1,scale:1,filter:'blur(0px)'},T(45),.4,'expo.out');sfx(T(45),'impact',.7);
fT('#hund',{autoAlpha:1},{autoAlpha:0,y:-100},T(47)-.1,.25,'power2.in');
fT('#wallOuter',{filter:'blur(0px)',opacity:1},{filter:'blur(8px)',opacity:.22},T(47)-.1,.4);
fT('#globe',{autoAlpha:0,scale:.5,rotation:-30},{autoAlpha:1,scale:1,rotation:0},T(47),.6,'expo.out');sfx(T(47),'whoosh',.5);
fT('#five',{autoAlpha:0,y:40},{autoAlpha:1,y:0},T(49)-.04,.35,'back.out(2)');
// globe
const GP=[];{const n=1100;for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*2.39996;GP.push([Math.cos(a)*r,y,Math.sin(a)*r])}}
const PIN=[[29.3,47.9],[39.4,-8.2],[-14,-51],[40.5,-75],[41,-3.7]];const PT=[T(48)-.1,T(48)+.1,T(49),T(50)-.08,T(50)+.14];
PT.forEach(t=>sfx(t,'tick',.55));sfx(PT[4]+.1,'chime',.5);
const gc=$('#globe').getContext('2d');
hooks.push(t=>{if(t<T(47)-.1||t>26.6)return;gc.clearRect(0,0,800,800);const R=330,rot=-1.55-(t-25)*.22,tilt=-.38;
 const P3=(x,y,z)=>{let X=x*Math.cos(rot)+z*Math.sin(rot),Z=-x*Math.sin(rot)+z*Math.cos(rot);let Y=y*Math.cos(tilt)-Z*Math.sin(tilt);Z=y*Math.sin(tilt)+Z*Math.cos(tilt);return [400+X*R,400-Y*R,Z]};
 const g=gc.createRadialGradient(330,300,40,400,400,R+40);g.addColorStop(0,'rgba(255,196,0,.10)');g.addColorStop(1,'rgba(255,196,0,0)');gc.fillStyle=g;gc.beginPath();gc.arc(400,400,R+40,0,7);gc.fill();
 for(const p of GP){const [x,y,z]=P3(...p);if(z<-.05)continue;gc.fillStyle=`rgba(255,255,255,${(.18+.72*z).toFixed(3)})`;gc.beginPath();gc.arc(x,y,1.6+1.6*z,0,7);gc.fill()}
 const ll=(la,lo)=>{la*=Math.PI/180;lo*=Math.PI/180;return [Math.cos(la)*Math.cos(lo),Math.sin(la),Math.cos(la)*Math.sin(lo)]};
 const K=P3(...ll(...PIN[0]));
 PIN.forEach(([la,lo],i)=>{const q=clamp((t-PT[i])/.3);if(q<=0)return;const [x,y,z]=P3(...ll(la,lo));const vis=z>-.15;
  if(i>0){const a=clamp((t-PT[i]-.1)/.5);if(a>0&&vis){gc.strokeStyle='rgba(255,196,0,.8)';gc.lineWidth=3;gc.beginPath();const mx=(x+K[0])/2,my=(y+K[1])/2-120;const N=24;for(let k=0;k<=N*eo(a);k++){const u=k/N;const bx=(1-u)*(1-u)*K[0]+2*(1-u)*u*mx+u*u*x,by=(1-u)*(1-u)*K[1]+2*(1-u)*u*my+u*u*y;k?gc.lineTo(bx,by):gc.moveTo(bx,by)}gc.stroke()}}
  if(!vis)return;const s=eo(q)*(1+.4*Math.sin(clamp((t-PT[i])/.3)*Math.PI));
  gc.fillStyle='rgba(255,196,0,.25)';gc.beginPath();gc.arc(x,y,Math.max(0,26*s+8*Math.sin(t*6+i)),0,7);gc.fill();gc.fillStyle='#FFC400';gc.beginPath();gc.arc(x,y,12*s,0,7);gc.fill()});
});
// to light chat
wipe('#bgL',26.2,CX,760,.5);fT('#s9',{opacity:1,scale:1},{opacity:0,scale:.9},26.25,.3,'power2.in');hide('#s9',26.6);sfx(26.15,'air',.6);

// ---- S10 MESSAGE US 26.39 - 30.45 -----------------------------------------------
show('#s10',26.3);tl.set(['#m1','#m2','#progW'],{autoAlpha:0},0);tl.set(['#ok','#ready'],{autoAlpha:0},0);tl.set('#rays i',{scaleY:0,opacity:0},0);
fT('#ph2',{y:1200,rotationX:22},{y:0,rotationX:0},26.42,.55,'expo.out');sfx(26.4,'whoosh',.5);
{const S='ابي موقع لمشروعي 👋',a=26.5,b=T(54)-.1,ch=[...S];
 hooks.push(t=>{const n=t<a?0:t>=T(54)+.05?0:Math.min(ch.length,Math.floor((t-a)/((b-a)/ch.length))+1);$('#typ').textContent=ch.slice(0,n).join('');$('#car').style.opacity=Math.floor(t/.3)%2?1:.1});
 for(let i=0;i<ch.length;i++)if(ch[i]!==' ')sfx(a+i*(b-a)/ch.length,'key',.35)}
const SN=T(54);tap(SN,352,1248);fT('#snd',{scale:1},{scale:.82},SN,.08);tl.to('#snd',{scale:1,duration:.4,ease:'back.out(3)'},SN+.08);sfx(SN+.02,'send',.8);
fT('#m1',{autoAlpha:0,y:120,scale:.6,transformOrigin:'0% 100%'},{autoAlpha:1,y:0,scale:1},SN+.04,.4,'back.out(1.6)');
fT('#m2',{autoAlpha:0,y:40,scale:.8,transformOrigin:'100% 0%'},{autoAlpha:1,y:0,scale:1},SN+.55,.38,'back.out(1.8)');sfx(SN+.55,'notif',.6);
// progress ring
const PR=T(55)-.05,RD=T(58);
fT('#ph2',{y:0,scale:1},{y:-120,scale:.7,autoAlpha:0},PR,.4,'power3.in');sfx(PR,'swish',.5);
fT('#progW',{autoAlpha:0,scale:.6},{autoAlpha:1,scale:1},PR+.15,.5,'expo.out');
hooks.push(t=>{const p=eio(clamp((t-(PR+.25))/(RD-PR-.25)));$('#pc').setAttribute('stroke-dashoffset',(1571*(1-p)).toFixed(1));
 const a=-Math.PI/2+p*2*Math.PI;$('#pdot').setAttribute('cx',(300+250*Math.cos(a)).toFixed(1));$('#pdot').setAttribute('cy',(300+250*Math.sin(a)).toFixed(1));
 const d=t<PR+.55?1:t<PR+.8?2:3;$('#dayN').textContent='يوم '+d;$('#dayL').textContent=t<RD?'موقعك قيد التصميم':'موقعك جاهز'});
[PR+.55,PR+.8].forEach(t=>{fT('#dayN',{y:-30,opacity:.2},{y:0,opacity:1},t,.2,'power2.out');sfx(t,'tick',.6)});
fT(['#dayN','#dayL'],{autoAlpha:1},{autoAlpha:0,scale:.6},RD-.05,.15,'power2.in');
fT('#ok',{autoAlpha:0,scale:.5},{autoAlpha:1,scale:1},RD,.4,'back.out(2.4)');fT('#okP',{attr:{'stroke-dashoffset':24}},{attr:{'stroke-dashoffset':0}},RD+.02,.35,'power2.out');
fT('#pc',{stroke:'#0b0b0c'},{stroke:'#FFC400'},RD,.25);
fT('#ready',{autoAlpha:0,y:60,scale:.8},{autoAlpha:1,y:0,scale:1},RD,.4,'back.out(2)');sfx(RD,'impact',.8);sfx(RD,'chime',.6);punch(RD,1.2);
tl.to('#rays i',{keyframes:{scaleY:[0,1.4,0],opacity:[1,1,0]},duration:.6,ease:'power2.out'},RD);
fT('#progW',{scale:1},{scale:1.05},RD+.4,1.0,'sine.inOut');
// to end card
wipe('#bgL',30.2,CX,960,.36,false,'power3.in');fT('#s10',{opacity:1,scale:1},{opacity:0,scale:.85},30.2,.32,'power3.in');hide('#s10',30.7);sfx(30.25,'zoom',.6);

// ---- S11 END 30.5 - 33.4 --------------------------------------------------------
show('#s11',30.5);tl.set(['#e1','#e2','#ctaB','#endS','#endArr','#enSym'],{autoAlpha:0},0);
fT('#enSym',{autoAlpha:1,clipPath:'inset(0 0 0 100%)'},{autoAlpha:1,clipPath:'inset(0 0 0 0%)'},30.55,.45,'expo.out');sfx(30.55,'boom',.8);
fT('#e1',{autoAlpha:0,y:80,filter:'blur(14px)'},{autoAlpha:1,y:0,filter:'blur(0px)'},30.65,.5,'expo.out');sfx(30.65,'swish',.45);
fT('#e2',{autoAlpha:0,y:80,filter:'blur(14px)'},{autoAlpha:1,y:0,filter:'blur(0px)'},30.95,.5,'expo.out');sfx(30.95,'swish',.45);
fT('#ctaB',{autoAlpha:0,scale:.3},{autoAlpha:1,scale:1},31.35,.5,'back.out(2.2)');sfx(31.35,'pop',.7);
fT('#endS',{autoAlpha:0},{autoAlpha:1},31.6,.4);
fT('#endArr',{autoAlpha:0,y:-30},{autoAlpha:1,y:0},31.7,.3);tl.to('#endArr',{y:22,duration:.35,yoyo:true,repeat:3,ease:'sine.inOut'},32.0);
tap(32.05,620,1155,'#tapE');fT('#ctaB',{scale:1},{scale:.92},32.05,.08);tl.to('#ctaB',{scale:1,duration:.4,ease:'back.out(3)'},32.13);sfx(32.06,'click',.7);
tl.to('#ctaB',{boxShadow:'0 0 0 28px rgba(255,196,0,0)',duration:.9,ease:'power2.out'},32.2);tl.set('#ctaB',{boxShadow:'0 0 0 0px rgba(255,196,0,.45)'},32.19);
tl.set({},{},DUR);

// ================= CAPTIONS: one minimal line, word-by-word, keyword marked
const KW=new Set([3,7,9,15,16,17,20,22,23,30,32,34,39,45,49,50,54,58,60]);
const GRP=[[0,3],[4,7],[8,10],[11,15],[16,17],[18,20],[21,23],[24,26],[27,30],[31,31],[32,34],[35,39],[44,46],[47,50],[51,54],[55,60]];
const PH=WD.phrases;
GRP.forEach((g,i)=>{g.t=T(g[0])-.06;const pe=PH[WS[g[1]].p][1]+.45;g.end=i<GRP.length-1?Math.min(pe,T(GRP[i+1][0])-.08):30.3});
const capEl=$('#cap');
hooks.push(t=>{const g=GRP.find(g=>t>=g.t&&t<g.end);capEl.className=theme(t);if(!g){capEl.innerHTML='';return}
 const out=clamp((t-(g.end-.14))/.14);capEl.style.opacity=(1-out).toFixed(3);capEl.style.transform=`translateY(${(-out*14).toFixed(1)}px)`;
 let h='';for(let i=g[0];i<=g[1];i++){const w=WS[i];const q=clamp((t-w.t+.05)/.3);if(t<w.t-.05){h+=`<span class="w" style="opacity:0">${w.w}</span>`;continue}
  const k=KW.has(i);const m=eo(clamp((t-w.t-.05)/.25));
  h+=`<span class="w${k?' k':''}" style="opacity:${eo(q).toFixed(3)};transform:translateY(${((1-e5(q))*26).toFixed(1)}px) scale(${(k?1+.18*(1-e5(q)):1).toFixed(3)});filter:blur(${((1-eo(q))*7).toFixed(1)}px);--m:${m.toFixed(3)}"><span class="in">${w.w}</span></span>`}
 capEl.innerHTML=h});
// keyword marker needs its own stacking context
const st=document.createElement('style');st.textContent='#cap .k{isolation:isolate}';document.head.appendChild(st);

// ================= FINISH
const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
hooks.push(t=>{$('#grid').style.transform=`translate(${(-t*14)%90}px,${(-t*22)%90}px)`});
window.SFX=SFX;window.DUR=DUR;
window.seek=async(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f||0);await Promise.all($$('img').map(i=>i.decode().catch(()=>{})));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))};
window.ready=document.fonts.ready.then(()=>true);
