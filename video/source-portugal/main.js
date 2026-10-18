const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const DUR=55.0,SFX=[],hooks=[];const sfx=(t,type,g=1)=>SFX.push({t:+t.toFixed(3),type,g});
let seed=17;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const WT=WORDS.map(w=>w[1]);
const logo=(sel,col,part)=>{const el=$(sel);if(part==='sym')el.innerHTML=LOGO.symbol.map(d=>`<path fill="${col}" d="${d}"/>`).join('');else if(part==='wm')el.innerHTML=LOGO.wordmark.map(d=>`<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('');else el.innerHTML=`<path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/>`};
logo('#symA','#000','sym');logo('#wmA','#000','wm');logo('#tgA','#000','tg');logo('#symC','#FFC400','sym');logo('#wmC','#fff','wm');logo('#tgC','#fff','tg');logo('#gN','#FFC400','sym');logo('#bN','#000','sym');logo('#nsym','#000','sym');

// ================= CAPTIONS: small phrase + big keyword
const G=[['Quanto custa não ter','um site'],['e uma','identidade visual'],['hoje em dia em','Portugal?'],['','Façamos as contas.'],['Imagine que perde só','2 clientes'],['por','semana'],['porque não o encontram','no Google'],['ou porque a sua imagem não transmite','confiança.'],
 ['Ao fim de um ano,',''],['são mais de','100 clientes.'],['Agora multiplique isso',''],['pelo valor de','cada serviço.'],['É muito','dinheiro'],['a fugir para a','concorrência.'],['Somos a','NewWay.'],['E há','3 anos'],['que ajudamos negócios em Portugal','a crescer,'],['com centenas de sites','já entregues.'],
 ['Criamos a sua','identidade visual'],['e um site','profissional,'],['feito','à medida'],['e sem','cara de IA,'],['a um preço','acessível.'],['Também pomos o seu negócio no','Google Meu Negócio,'],['para que apareça a quem procura','o seu serviço.'],
 ['Com isto,',''],['ganha mais','clientes,'],['','vende mais'],['e aumenta a','faturação.'],['O site deixa de ser uma','despesa'],['e passa a ser o melhor','investimento'],['do seu negócio.',''],['Clique no','botão'],['e fale','connosco.']];
const GR=[];let wi=0;
G.forEach(([sm,kw])=>{const g={sm:[]};sm.split(' ').filter(Boolean).forEach(w=>{g.sm.push({w,t:WT[wi]});wi++});if(kw){g.kw=kw;g.kt=WT[wi];wi+=kw.split(' ').length}g.t=g.sm.length?g.sm[0].t:g.kt;GR.push(g)});
if(wi!==WT.length)console.error('mismatch',wi,WT.length);
GR.forEach((g,i)=>{g.end=i<GR.length-1?GR[i+1].t:DUR;if(g.kw)sfx(g.kt,'pop',.16)});
hooks.push(t=>{const g=GR.find(g=>t>=g.t&&t<g.end);const c=$('#cap');if(!g){c.innerHTML='';return}
  const x=clamp((t-(g.end-.1))/.1);c.style.opacity=(1-x).toFixed(3);
  let h='<span class="sm">'+g.sm.map(u=>{const q=clamp((t-u.t+.02)/.12);return `<span style="opacity:${t<u.t-.02?0:eo(q)};transform:translateY(${(1-eo(q))*8}px)">${u.w}</span>`}).join(' ')+'</span>';
  if(g.kw&&t>=g.kt-.02){const q=clamp((t-g.kt+.02)/.32);const sc=1+.45*Math.pow(1-q,3)*Math.cos(q*5);const ul=eo(clamp((t-g.kt-.18)/.25));
    h+=`<span class="kw" style="transform:scale(${sc.toFixed(3)});opacity:${Math.min(1,q*4)}"><u style="--ul:${ul.toFixed(3)}">${g.kw}</u></span>`}
  c.innerHTML=h;c.style.top=(g.sm.length?1360:1390)+'px';c.className=(t>=22.95&&t<24.2)?'oy':''});
function fitCaps(){} // keyword width handled below
hooks.push(t=>{const k=$('#cap .kw');if(k){k.style.fontSize='100px';const w=k.scrollWidth;if(w>990)k.style.fontSize=(100*990/w)+'px'}});

// ================= BUILDERS
$('#cheap').innerHTML=`<div style="background:#ddd;padding:12px;text-align:center;font:bold 18px 'Liberation Serif'">*** BEM-VINDO AO NOSSO SITE!!! ***</div>
<div style="padding:30px 24px 10px;text-align:center"><div style="font:bold 58px/1 'Liberation Serif';text-decoration:underline">O SEU NEGÓCIO</div><div style="font:italic 26px 'Liberation Serif';margin-top:12px">Os melhores preços!!!</div></div>
<div style="margin:18px 24px;height:170px;border:3px ridge #999;background:repeating-linear-gradient(45deg,#ccc 0 10px,#eee 10px 20px);display:flex;align-items:center;justify-content:center;font:bold 22px 'Liberation Serif'">[ IMAGEM NÃO ENCONTRADA ]</div>`;
$('#coins').innerHTML=[...Array(14)].map((_,i)=>`<div class="coin" id="cn${i}">€</div>`).join('');
const WALL=['alpha','brother','jgc','deck','poenza','kundara'];
$('#wall').innerHTML=WALL.map((k,i)=>`<div class="win wc" id="wc${i}" style="left:90px;top:120px;transform-origin:50% 50%"><div class="bar"><i></i><i></i><i></i></div><div class="scr"><img src="c/${k}.jpg"></div></div>`).join('');

// ================= TIMELINE
gsap.defaults({ease:'power3.out'});
const tl=gsap.timeline({paused:true});
const show=(s,t)=>tl.set(s,{visibility:'visible'},t),hide=(s,t)=>tl.set(s,{visibility:'hidden'},t);
function punch(t,k=1){tl.fromTo('#cam',{scale:1+.02*k},{scale:1,duration:.55,ease:'expo.out',immediateRender:false},t)}
function pop(s,t,d=.5,from=.4){tl.fromTo(s,{autoAlpha:0,scale:from},{autoAlpha:1,scale:1,duration:d,ease:'back.out(2)'},t)}
function trPush(a,b,t,dir=1){tl.fromTo(a,{xPercent:0,filter:'blur(0px)'},{xPercent:-100*dir,filter:'blur(16px)',duration:.4,ease:'power4.in',immediateRender:false},t-.4);hide(a,t);
  show(b,t);tl.fromTo(b,{xPercent:100*dir,filter:'blur(16px)'},{xPercent:0,filter:'blur(0px)',duration:.5,ease:'power4.out',immediateRender:false},t);sfx(t-.42,'air',.8)}
function trZoom(a,b,t){tl.fromTo(a,{scale:1,filter:'blur(0px)',opacity:1},{scale:1.6,filter:'blur(20px)',opacity:0,duration:.34,ease:'power3.in',immediateRender:false},t-.34);hide(a,t);
  show(b,t);tl.fromTo(b,{scale:.8,filter:'blur(16px)',opacity:0},{scale:1,filter:'blur(0px)',opacity:1,duration:.5,ease:'expo.out',immediateRender:false},t);sfx(t-.36,'zoom',.75)}
function trFade(a,b,t){show(b,t-.2);tl.fromTo(b,{opacity:0},{opacity:1,duration:.4,immediateRender:false},t-.2);hide(a,t+.2)}
function trN(a,b,t,col='#FFC400',sym='#000'){tl.set('#nmask',{visibility:'visible'},t-.5);tl.set('#nsym',{x:290,y:820,scale:.55,opacity:0},t-.5);tl.set('#nsym path',{attr:{fill:sym}},t-.5);tl.set('#nmask .nfill',{backgroundColor:col},t-.5);
  tl.fromTo('#nmask .nfill',{opacity:0},{opacity:1,duration:.26,ease:'power2.inOut',immediateRender:false},t-.5);
  tl.fromTo('#nsym',{scale:.55,opacity:0},{scale:1,opacity:1,duration:.32,ease:'back.out(1.6)',immediateRender:false},t-.32);
  hide(a,t);show(b,t);tl.to('#nsym',{scale:1.18,opacity:0,duration:.32,ease:'power2.in',immediateRender:false},t+.08);
  tl.to('#nmask .nfill',{opacity:0,duration:.38,ease:'power2.inOut',immediateRender:false},t+.14);tl.set('#nmask',{visibility:'hidden'},t+.56);sfx(t-.5,'riser',.5);sfx(t-.3,'boom',.7)}
gsap.set('#nsym',{opacity:0});
const D=(sel,txt,t)=>tl.call(()=>{},[],t)&&hooks.push(()=>{}); // noop
const DISP=[];const disp=(t,e,r,l)=>DISP.push([t,e,r,l]);
hooks.push(t=>{let c=['','',''];DISP.forEach(([a,e,r,l])=>{if(t>=a)c=[e,typeof r==='function'?r(t):r,l]});$('#dexp').textContent=c[0];$('#dres').textContent=c[1];$('#dlab').textContent=c[2]});
function key(sel,t){tl.to(sel,{scale:.9,backgroundColor:'#3a3a3a',duration:.06,yoyo:true,repeat:1},t);sfx(t,'click',.45)}

// ---- S1 HOOK 0 - 4.75
show('#s1',0);
tl.fromTo('#tag',{scale:1.3,rotation:-6},{scale:1,rotation:-3,duration:.55,ease:'expo.out'},0); tl.fromTo('#cam',{scale:1.15},{scale:1,duration:.6,ease:'expo.out'},0); sfx(0,'boom',.9); sfx(0,'impact',1);
hooks.push(t=>{const n=$('#tagN');if(t<1.0){let s='';let k=Math.floor(t*30);for(let i=0;i<4;i++){s+=String((k*7+i*3+((k*i)%5))%10)}n.textContent='€ '+s}else n.textContent='€ ????'});
for(let i=0;i<9;i++)sfx(.05+i*.1,'tick',.3);
tl.to('#tag',{y:-200,scale:.62,rotation:-6,duration:.55,ease:'power3.inOut'},1.0);
tl.set(['#w404','#logoQ','#pPT'],{autoAlpha:0},0);
tl.fromTo('#w404',{autoAlpha:0,y:200,rotationX:20},{autoAlpha:1,y:-60,rotationX:0,duration:.6,ease:'expo.out'},1.15); sfx(1.15,'whoosh',.6); sfx(1.5,'glitch',.35);
pop('#logoQ',2.62,.5,.3); sfx(2.62,'pop',.5);
tl.to('#logoQ',{rotation:8,duration:.12,yoyo:true,repeat:3},3.0);
pop('#pPT',4.05,.45,.4); sfx(4.05,'tap',.5);
tl.set('#pPT',{top:1170},0);
// ---- S2 CALC 4.75 - 9.15
trZoom('#s1','#s2',4.85);
tl.fromTo('#calc',{y:200,rotationX:15},{y:0,rotationX:0,duration:.6,ease:'expo.out'},4.85);
disp(4.85,'','0','');
key('#k2',7.6); disp(7.6,'','2','clientes perdidos / semana'); tl.fromTo('#dres',{scale:1.2},{scale:1,duration:.3,immediateRender:false,transformOrigin:'100% 100%'},7.6);
// ---- S3a search 9.15 - 11.2
trPush('#s2','#s3a',9.2);
{const Q='serviço perto de mim';hooks.push(t=>{if(t<9.3){$('#qt').textContent='';return}$('#qt').textContent=Q.slice(0,Math.min(Q.length,Math.floor((t-9.3)/.035)+1));$('#qc').style.opacity=Math.floor(t/.3)%2?1:0})}
tl.fromTo(['#r1','#r2','#r3'],{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.35,stagger:.08},9.95);
tl.fromTo('#r0',{autoAlpha:0,scale:.9},{autoAlpha:1,scale:1,duration:.4},10.4); sfx(10.4,'glitch',.4);
tl.fromTo('#ph',{rotationY:-14},{rotationY:6,duration:2.1,ease:'sine.inOut'},9.2);
// ---- S3b trust 11.2 - 13.6
trPush('#s3a','#s3b',11.22);
hooks.push(t=>{const p=eio(clamp((t-12.0)/1.1));const v=90-78*p;$('#gfill').setAttribute('stroke-dashoffset',(754*(1-v/100)).toFixed(1));$('#needle').style.transform=`rotate(${-90+180*v/100}deg)`});
sfx(12.0,'riser',.3); sfx(13.1,'impact',.6);
// ---- S4 calc again 13.6 - 16.8
trPush('#s3b','#s2',13.7);
disp(13.7,'2 × 52 semanas','=','clientes perdidos / ano'); key('#kx',13.9); key('#keq',14.75);
disp(14.75,'2 × 52 semanas',t=>String(Math.round(eo(clamp((t-14.75)/.7))*104)),'clientes perdidos / ano'); for(let i=0;i<6;i++)sfx(14.8+i*.1,'tick',.3); sfx(15.5,'impact',.8); punch(15.5,1.2);
// ---- S5 value 17.0 - 20.0
disp(17.0,'104 × valor do serviço','104','clientes perdidos / ano'); key('#kx',17.1);
disp(18.2,'104 × €500 (exemplo)',t=>'€'+Math.round(eo(clamp((t-18.2)/1.1))*52000).toLocaleString('pt-PT'),'perdidos por ano'); key('#keq',18.2); for(let i=0;i<9;i++)sfx(18.25+i*.11,'tick',.3); sfx(19.3,'impact',.9); punch(19.3,1.3);
tl.to('#calc',{rotation:-2,scale:1.02,duration:3,ease:'sine.inOut'},16.5);
// ---- S5b money to competition 20.0 - 22.8
trZoom('#s2','#s5b',20.05);
$$('#coins .coin').forEach((e,i)=>{const t=20.3+i*.12;tl.fromTo(e,{left:270,top:690,scale:.4,opacity:0},{left:810,top:690+Math.sin(i)*40,scale:1,opacity:1,duration:.55,ease:'power2.inOut',immediateRender:false},t);tl.to(e,{opacity:0,scale:.6,duration:.12},t+.55);tl.set(e,{opacity:0},0);if(i%2===0)sfx(t,'tap',.25)});
hooks.push(t=>{const p=clamp((t-20.4)/1.9);$('#compN').textContent='+€'+Math.round(p*52000).toLocaleString('pt-PT');$('#youN').textContent='€0'});
tl.fromTo('#comp',{scale:1},{scale:1.05,duration:.2,yoyo:true,repeat:3},21.0);
// ---- S6 NEWWAY 23.0 - 24.1
trN('#s5b','#s6',23.0);
tl.fromTo('#symA',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.45,ease:'power3.inOut'},23.05);
tl.fromTo('#wmA .L',{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.45,stagger:.04,ease:'expo.out'},23.3);
tl.fromTo('#tgA',{opacity:0},{opacity:1,duration:.3},23.65);
// ---- S7 3 years + portfolio 24.1 - 29.6
trPush('#s6','#s7',24.15);
tl.fromTo('#yrs',{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,duration:.5,ease:'back.out(1.8)'},24.4); sfx(24.5,'impact',.8);
tl.to('#yrs',{autoAlpha:0,y:-120,scale:.9,duration:.35,ease:'power3.in'},27.1);
WALL.forEach((k,i)=>{const c=i-2.5;tl.fromTo('#wc'+i,{autoAlpha:0,y:500,rotationY:0,scale:.6},{autoAlpha:1,y:(i%2?220:-60),x:c*190,rotationY:-c*8,scale:.62,duration:.6,ease:'expo.out'},27.3+i*.08);sfx(27.3+i*.08,'snap',.3)});
tl.to('#wall',{scale:1.06,duration:2,ease:'none'},27.5);
// ---- S8 identity + site 29.6 - 36.8
trPush('#s7','#s8',29.65);
tl.set(['#wSite','#p1','#p2','#p3'],{autoAlpha:0},0);
tl.fromTo('#mlab',{autoAlpha:0},{autoAlpha:1,duration:.4},29.8);
tl.fromTo('#mp1',{autoAlpha:0,y:120},{autoAlpha:1,y:0,duration:.6,ease:'expo.out'},29.75);
tl.fromTo('#mp2',{autoAlpha:0},{autoAlpha:1,x:-190,y:230,rotation:-7,scale:.72,duration:.6,ease:'expo.out'},30.25); sfx(30.25,'swish',.4);
tl.fromTo('#mp3',{autoAlpha:0},{autoAlpha:1,x:190,y:270,rotation:6,scale:.72,duration:.6,ease:'expo.out'},30.55); sfx(30.55,'swish',.4);
tl.to(['#mp1','#mp2','#mp3','#mlab'],{autoAlpha:0,y:'-=140',duration:.35,ease:'power3.in'},31.35);
tl.fromTo('#wSite',{autoAlpha:0,y:220,rotationX:18},{autoAlpha:1,y:0,rotationX:0,duration:.6,ease:'expo.out'},31.55); sfx(31.55,'whoosh',.5);
tl.fromTo('#sh8',{xPercent:-130},{xPercent:130,duration:.9},32.2); sfx(32.2,'shimmer',.35);
pop('#p1',33.4,.45,.4); sfx(33.4,'pop',.4); pop('#p2',34.4,.45,.4); sfx(34.4,'pop',.4); tl.to('#iaS',{scaleX:1,duration:.25},34.8); sfx(34.8,'swipe',.5);
pop('#p3',35.9,.45,.4); sfx(35.9,'chime',.5);
// ---- S9 google business 36.8 - 41.9
trPush('#s8','#s9',36.9);
tl.fromTo('#ph2',{y:300,rotationY:-20},{y:0,rotationY:0,duration:.7,ease:'expo.out'},36.9);
tl.fromTo('#pin',{y:-300,opacity:0},{y:0,opacity:1,duration:.5,ease:'bounce.out'},37.6); sfx(37.95,'impact',.45);
tl.fromTo('#gbp',{yPercent:110},{yPercent:0,duration:.55,ease:'expo.out'},38.3); sfx(38.3,'swish',.4);
tl.set('#p1st',{autoAlpha:0},0); pop('#p1st',39.6,.45,.4); sfx(39.6,'chime',.5);
tl.to('#pin',{y:-24,duration:.25,yoyo:true,repeat:3,ease:'sine.inOut'},40.0);
tl.to('#ph2',{rotationY:-8,duration:2.5,ease:'sine.inOut'},39.0);
// ---- S10 growth 41.9 - 46.4
trZoom('#s9','#s10',42.0);
tl.fromTo(['#m1','#m2','#m3'],{autoAlpha:0,y:40},{autoAlpha:1,y:0,duration:.45,stagger:.12},42.1);
[[1,42.9],[2,44.1],[3,45.4]].forEach(([i,t])=>{hooks.push(tt=>{$('#mv'+i).textContent='+'+Math.round(eo(clamp((tt-t)/.8))*[0,38,45,52][i])+'%'});tl.fromTo('#m'+i,{boxShadow:'0 0 0 1.5px #262626'},{boxShadow:'0 0 0 3px #FFC400',duration:.3},t);sfx(t,'pop',.4)});
{const L=$('#gline').getTotalLength();$('#gline').style.strokeDasharray=L;tl.fromTo('#gline',{strokeDashoffset:L},{strokeDashoffset:0,duration:3.4,ease:'power1.inOut'},42.4);tl.fromTo('#garea',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:3.4,ease:'power1.inOut'},42.4)}
tl.set('#gdot',{opacity:0},0); pop('#gdot',45.8,.4,.2); sfx(45.8,'impact',.6);
// ---- S11 expense -> investment 46.4 - 51.3
trPush('#s10','#s11',46.55);
tl.fromTo('#flip',{y:100,scale:.9,autoAlpha:0},{y:0,scale:1,autoAlpha:1,duration:.55,ease:'expo.out'},46.6);
tl.to('#flipIn',{rotationY:180,duration:.7,ease:'power3.inOut'},48.6); sfx(48.6,'whoosh',.5); sfx(49.2,'impact',.9); punch(49.3,1.5);
tl.to('#flip',{scale:1.06,duration:1.6,ease:'sine.inOut'},49.4);
// ---- S12 CTA 51.3 - end
trN('#s11','#s12',51.45,'#000','#FFC400');
tl.fromTo('#symC',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.5,ease:'power3.inOut'},51.5);
tl.fromTo('#wmC .L',{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.5,stagger:.04,ease:'expo.out'},51.65);
tl.fromTo('#tgC',{opacity:0},{opacity:1,duration:.4},52.0);
tl.set(['#bub','#cbtn'],{autoAlpha:0},0);
tl.fromTo('#cbtn',{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.45,ease:'back.out(1.8)'},51.7);
tl.to('#btn',{scale:.92,duration:.08,yoyo:true,repeat:1},52.05); tl.fromTo('#tap2',{opacity:.95,scale:.4},{opacity:0,scale:1.4,duration:.45,immediateRender:false},52.05); sfx(52.05,'click',.8);
tl.fromTo('#bub',{autoAlpha:0,y:30,scale:.9},{autoAlpha:1,y:0,scale:1,duration:.45,ease:'back.out(2)'},52.5); sfx(52.5,'msg',.6);
tl.fromTo('#btn',{scale:1},{scale:1.05,duration:.4,yoyo:true,repeat:3,ease:'sine.inOut',immediateRender:false},53.2);
tl.set({},{},DUR);

const g=$('#grain').getContext('2d'),gi=g.createImageData(540,960);
function grain(f){let s=(f*9301+49297)%233280||1;const d=gi.data;for(let i=0;i<d.length;i+=4){s=(s*16807)%2147483647;const v=s&255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(gi,0,0)}
hooks.push(t=>{$('#vign').style.opacity=(t>=22.5&&t<24.4)?0:1});
window.SFX=SFX;window.DUR=DUR;
window.seek=async(t,f)=>{tl.seek(Math.max(t,.0005),false);hooks.forEach(h=>h(t));grain(f||0);await Promise.all($$('img').map(i=>i.decode().catch(()=>{})));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))};
window.ready=document.fonts.ready.then(()=>true);
