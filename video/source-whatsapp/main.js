// NewWay — WhatsApp explainer (voice 3, ~2 min). Calm motion, chapter HUD, lo-fi bed. Helpers in lib.js, word timings in words.js.
window.DUR = 127.2;
const WORDS = window.WORDS;
const hud = $('#hud');
// shared dark background with drifting light (scenes are transparent and cross-dissolve on top of it)
const BG = mk(cam, 'left:0;top:0;width:1080px;height:1920px;background:#0b0b0b');
const ambBG = ambient(BG);
mk(BG, 'inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:90px 90px;-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 45%,#000,transparent)');

// scene with a calm built-in transition: fade + gentle scale in, fade + slight scale out
function S(a, b, bg = 'transparent', opt = {}) {
  const s = scene(a, b, bg); const u0 = f => { s._u = f };
  s.set = f => { s.u = t => { const ki = E.o3(P(t, a, a + .45)), ko = E.i2(P(t, b - .4, b)); s.e.style.opacity = (ki * (1 - ko)).toFixed(3); s.e.style.transform = `scale(${(L(opt.si ?? 1.04, 1, ki) * L(1, opt.so ?? .97, ko)).toFixed(4)})`; f(t) } };
  return s;
}
// enter helpers (call every frame)
const rise = (el, t, st, dy = 36, x = {}) => { const k = E.o4(P(t, st, st + .55)); set(el, { x: x.x || 0, y: dy * (1 - k) + (x.y || 0), s: x.s ?? 1, r: x.r || 0, o: P(t, st, st + .2) * (x.o ?? 1) }) };
const pop = (el, t, st, x = {}) => set(el, { x: x.x || 0, y: x.y || 0, s: E.back(P(t, st, st + .42)) * (x.s ?? 1), r: x.r || 0, o: P(t, st, st + .1) * (x.o ?? 1) });
const card = (par, x, y, w, h, extra = '', html = '') => C(par, x, y, w, h, `border-radius:32px;background:#fff;box-shadow:0 40px 90px rgba(0,0,0,.5);overflow:hidden;${extra}`, html);
const txt = (par, x, y, w, size, color, html, extra = '') => C(par, x, y, w, size * 1.4, `display:flex;align-items:center;justify-content:center;text-align:center;font-family:U;font-weight:800;font-size:${size}px;color:${color};letter-spacing:-.03em;line-height:1;${extra}`, html);
const mono = (par, x, y, w, size, color, s) => C(par, x, y, w, size * 1.6, `text-align:center;font-size:${size}px;color:${color}`, s, 'mono');
const pill = (par, x, y, w, h, bg, col, html, extra = '') => C(par, x, y, w, h, `border-radius:${h / 2}px;background:${bg};color:${col};display:flex;align-items:center;justify-content:center;gap:12px;font-family:IS;font-weight:700;font-size:${Math.round(h * .4)}px;${extra}`, html);
const chapterTitle = (n, title, a, b) => { const s = S(a, b); const e = s.e; const num = txt(e, 540, 700, 600, 260, Y, `0${n}`, 'font-weight:900'); const ln = C(e, 540, 870, 120, 8, `background:${Y};border-radius:4px`); const tt = txt(e, 540, 960, 1000, 70, '#fff', title); s.set(t => { rise(num, t, a + .05, 60); ln.style.transform = `translate(-50%,-50%) scaleX(${E.io3(P(t, a + .2, a + .6)).toFixed(3)})`; rise(tt, t, a + .2, 40) }); return s };
const siteImg = (par, img, w, h) => { const b = browser(par, 540, 760, w, h, 'light'); b.style.boxShadow = '0 50px 110px rgba(0,0,0,.6)'; const im = mk(b.body, `inset:0;background:#222 url(img/${img}.jpg) center top/cover`); b.im = im; return b };

// ======================= HOOK =======================
{ // "Para tudo e presta atenção"
  const s = S(0, 2.5, 'transparent', { si: 1 }); const e = s.e;
  const a = mk(e, 'left:0;top:560px;width:1080px;height:180px;overflow:hidden'); const ai = txt(a, 540, 90, 1080, 160, '#fff', 'PARA');
  const b = mk(e, 'left:0;top:730px;width:1080px;height:180px;overflow:hidden'); const bi = txt(b, 540, 90, 1080, 160, '#fff', 'TUDO.');
  const c = pill(e, 540, 1000, 520, 90, Y, '#111', '<span style="font-family:U;font-weight:800;font-size:34px;letter-spacing:-.01em">PRESTA ATENÇÃO</span>');
  s.set(t => { set(ai, { y: (1 - E.o5(P(t, .1, .5))) * 180 }); set(bi, { y: (1 - E.o5(P(t, .46, .86))) * 180 }); pop(c, t, 1.0, { r: -3 }) });
}
{ // melhor oferta · 12 meses · Europa (12 stars = 12 months)
  const s = S(2.3, 8.45); const e = s.e;
  const ring = C(e, 540, 780, 10, 10); const stars = [];
  for (let i = 0; i < 12; i++) { const st = mk(ring, 'left:-28px;top:-28px;width:56px;height:56px', starSVG('#2c2c2c', 56)); st.lit = mk(st, 'inset:0', starSVG(Y, 56)); stars.push(st) }
  const tag = pill(e, 540, 740, 560, 120, Y, '#111', '<span style="font-family:U;font-weight:800;font-size:42px;letter-spacing:-.02em">A MELHOR OFERTA</span>', 'box-shadow:0 30px 60px rgba(0,0,0,.4)');
  const m12 = txt(e, 540, 870, 600, 56, '#fff', '12 meses');
  const eu = mono(e, 540, 950, 600, 24, Y, 'aqui na europa');
  s.set(t => {
    stars.forEach((st, i) => { const ang = i / 12 * Math.PI * 2 - Math.PI / 2 + (t - 2.3) * .12; const r = 330 * T(t, 2.4, 3.2, .6, 1, E.o4); set(st, { x: Math.cos(ang) * r, y: Math.sin(ang) * r, s: E.back(P(t, 2.4 + i * .04, 2.8 + i * .04)), o: P(t, 2.4 + i * .04, 2.5 + i * .04) }); st.lit.style.opacity = P(t, 6.6 + i * .08, 6.7 + i * .08) });
    pop(tag, t, 4.05, { r: -2 }); rise(m12, t, 6.62); rise(eu, t, 7.62);
  });
}
// ======================= DIFERENTE =======================
{
  const s = S(8.25, 14.2); const e = s.e;
  const plan = (x, name) => { const c = card(e, x, 800, 300, 420, 'background:#1a1a1a;border:2px solid #2a2a2a;box-shadow:none', `<div class="mono" style="position:absolute;left:0;right:0;top:40px;text-align:center;font-size:18px;color:#777">${name}</div><div style="position:absolute;left:0;right:0;top:90px;text-align:center;font-family:U;font-weight:700;font-size:50px;color:#555">€ ••</div><div class="mono" style="position:absolute;left:0;right:0;top:160px;text-align:center;font-size:15px;color:#555">/ mês</div>${[0, 1, 2, 3].map(i => `<div style="position:absolute;left:40px;right:40px;top:${220 + i * 42}px;height:12px;border-radius:6px;background:#2a2a2a"></div>`).join('')}`); return c };
  const p1 = plan(220, 'básico'), p2 = plan(860, 'premium');
  const nw = card(e, 540, 780, 400, 520, `background:${Y};box-shadow:0 40px 100px rgba(255,196,0,.25)`, `<div style="position:absolute;left:0;right:0;top:60px;display:flex;justify-content:center">${sym('#111', 170)}</div><div style="position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center">${wmLetters('#111', 250)}</div><div style="position:absolute;left:40px;right:40px;top:250px;border-top:3px solid #111"></div>${['Site profissional', 'Atendente IA', 'Google Meu Negócio'].map((s, i) => `<div style="position:absolute;left:44px;top:${284 + i * 60}px;display:flex;align-items:center;gap:12px;font-family:IS;font-weight:700;font-size:27px;color:#111">${ICO.check('#111', 30, 8)}${s}</div>`).join('')}`);
  const lbl = mono(e, 540, 1110, 800, 22, '#777', 'diferente de tudo que você já viu');
  s.set(t => {
    pop(nw, t, 9.86, { y: -10 * E.o3(P(t, 10.9, 11.4)) });
    rise(p1, t, 10.86, 60, { r: -6, x: -30 * E.io3(P(t, 13.0, 13.6)), o: 1 - .6 * P(t, 13.0, 13.5) });
    rise(p2, t, 11.2, 60, { r: 6, x: 30 * E.io3(P(t, 13.0, 13.6)), o: 1 - .6 * P(t, 13.0, 13.5) });
    rise(lbl, t, 13.04);
  });
}
{ // em pouco mais de um minuto · o que você vai receber
  const s = S(14.0, 18.5); const e = s.e;
  const watch = C(e, 540, 600, 300, 300, '', `<svg width="300" height="300" viewBox="0 0 300 300"><circle cx="150" cy="150" r="130" fill="none" stroke="#222" stroke-width="18"/><circle id="arc" cx="150" cy="150" r="130" fill="none" stroke="${Y}" stroke-width="18" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 150 150)"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:76px;color:#fff;letter-spacing:-.03em">1:00</div>`);
  const arc = watch.querySelector('#arc');
  const items = [['site', 'Site profissional'], ['chat', 'Atendente inteligente'], ['pin', 'Google Meu Negócio']].map(([ic, s], i) => C(e, 540, 900 + i * 120, 760, 100, 'border-radius:26px;background:#161616;border:2px solid #262626;display:flex;align-items:center;gap:24px;padding-left:24px', `<div style="width:62px;height:62px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:28px;color:#111">${i + 1}</div>${ICO[ic]('#fff', 42)}<span style="font-family:IS;font-weight:700;font-size:34px;color:#fff">${s}</span>`));
  s.set(t => { pop(watch, t, 14.1); arc.style.strokeDashoffset = (1 - E.io2(P(t, 14.3, 16.2))).toFixed(3); items.forEach((it, i) => rise(it, t, 16.1 + i * .35, 40)) });
}
// ======================= HUD: chapter progress =======================
const CHAP = [['Site', 18.4, 35.4], ['Atendente IA', 35.4, 80.0], ['Google', 80.0, 88.0]];
const hb = C(hud, 540, 170, 960, 86);
const segs = CHAP.map(([n], i) => { const g = mk(hb, `left:${i * 324}px;top:0;width:312px;height:86px`); const lb = mk(g, 'left:0;top:0;width:312px;height:40px;display:flex;align-items:center;gap:10px;font-family:IS;font-weight:700;font-size:24px;color:#666', `<span class="n" style="width:30px;height:30px;border-radius:50%;background:#2a2a2a;color:#111;display:flex;align-items:center;justify-content:center;font-family:U;font-size:15px">${i + 1}</span><span class="t">${n}</span>`); const tr = mk(g, 'left:0;top:56px;width:312px;height:8px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden'); const fi = mk(tr, `left:0;top:0;width:312px;height:8px;background:${Y};transform-origin:0 50%;transform:scaleX(0)`); return { lb, fi, n: lb.querySelector('.n'), t: lb.querySelector('.t') } });
function hudU(t) {
  const on = P(t, 17.7, 18.2) * (1 - P(t, 94.2, 94.5));
  set(hb, { o: on, y: T(t, 17.7, 18.2, -30, 0, E.o4) });
  segs.forEach((g, i) => {
    const [, a, b] = CHAP[i]; const p = clamp((t - a) / (b - a)); const act = t >= a && t < b;
    g.fi.style.transform = `scaleX(${p.toFixed(4)})`;
    g.n.style.background = t >= a ? Y : '#2a2a2a'; g.t.style.color = act ? '#fff' : t >= b ? '#bbb' : '#666';
    g.n.style.transform = `scale(${(1 + .25 * ring(t, a, 2.5, 6)).toFixed(3)})`;
  });
}

// ======================= CHAPTER 1: SITE =======================
chapterTitle(1, 'SITE PROFISSIONAL', 18.35, 20.0);
{
  const s = S(19.8, 27.4); const e = s.e;
  const b = siteImg(e, 'deck', 880, 600);
  const im2 = mk(b.body, 'inset:0;background:#222 url(img/kundara.jpg) center top/cover;opacity:0');
  // tailor measure marks ("sob medida")
  const meas = mk(e, 'left:0;top:0;width:1080px;height:1920px', `<svg width="1080" height="1920" fill="none" stroke="${Y}" stroke-width="4"><path id="m1" d="M100 420 L980 420" pathLength="1" stroke-dasharray="1 1"/><path d="M100 405 V435 M980 405 V435"/><path id="m2" d="M1010 460 L1010 1060" pathLength="1" stroke-dasharray="1 1"/><path d="M995 460 H1025 M995 1060 H1025"/></svg>`);
  const m1 = meas.querySelector('#m1'), m2 = meas.querySelector('#m2');
  const ml = pill(e, 540, 420, 260, 54, Y, '#111', '<span class="mono" style="font-size:18px;letter-spacing:.18em">sob medida</span>');
  const PR = [['site', 'Produto'], ['box', 'Serviço'], ['pin', 'Produto'], ['chat', 'Serviço']];
  const prods = PR.map(([ic, n], i) => card(e, 270 + (i % 2) * 540 - (i % 2 ? 60 : -60), 1060, 205, 230, 'border-radius:24px', `<div style="position:absolute;left:12px;top:12px;width:181px;height:130px;border-radius:16px;background:#f2f0ea;display:flex;align-items:center;justify-content:center">${ICO[ic]('#111', 70)}</div><div class="ln" style="left:18px;top:156px;width:120px;height:12px;background:#e6e4de"></div><div style="position:absolute;left:18px;top:178px;font-family:IS;font-weight:700;font-size:26px;color:#111">${n}</div><div style="position:absolute;right:14px;bottom:14px;width:40px;height:40px;border-radius:50%;background:${Y}"></div>`));
  const shine = mk(b.body, 'left:0;top:-300px;width:170px;height:1300px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.6),rgba(255,255,255,0))');
  const vit = pill(e, 540, 1232, 420, 70, '#111', Y, '<span class="mono" style="font-size:20px;letter-spacing:.2em">vitrine de alto padrão</span>', 'border:2px solid #2a2a2a');
  s.set(t => {
    rise(b, t, 19.85, 50, { s: T(t, 23.0, 24.0, 1, .9, E.io3), y: T(t, 23.0, 24.0, 0, -80, E.io3) });
    b.style.transform += ` translateY(${(5 * Math.sin(t * 1.4)).toFixed(2)}px)`;
    m1.style.strokeDashoffset = (1 - E.io3(P(t, 21.2, 21.9))).toFixed(3); m2.style.strokeDashoffset = (1 - E.io3(P(t, 21.4, 22.1))).toFixed(3);
    meas.style.opacity = 1 - P(t, 22.9, 23.2); pop(ml, t, 21.4, { o: 1 - P(t, 22.9, 23.2) });
    im2.style.opacity = P(t, 22.3, 22.7);
    // product cards rise in front (vitrine)
    prods.forEach((p, i) => { const x = [210, 425, 655, 870][i]; rise(p, t, 23.3 + i * .14, 60, { x: x - parseFloat(p.style.left), y: 0 }) });
    const sh = E.io3(P(t, 25.9, 26.5)); shine.style.transform = `translateX(${L(-260, 1100, sh).toFixed(1)}px) rotate(18deg)`; shine.style.opacity = sh > 0 && sh < 1 ? 1 : 0;
    rise(vit, t, 25.4);
  });
}
{ // nada de site genérico -> cara de empresa grande, confiança no 1º segundo
  const s = S(27.2, 35.45); const e = s.e;
  const b = browser(e, 540, 740, 880, 600, 'light'); b.style.boxShadow = '0 50px 110px rgba(0,0,0,.6)';
  const gen = mk(b.body, 'inset:0;background:#e9e9e6', `<div style="position:absolute;left:40px;top:30px;width:140px;height:40px;border:3px dashed #aaa;border-radius:8px;display:flex;align-items:center;justify-content:center" class="mono"><span style="font-size:13px;color:#999">your logo</span></div>
     <div style="position:absolute;left:40px;top:130px;font-family:serif;font-size:56px;color:#9a9a96">Lorem ipsum</div><div style="position:absolute;left:40px;top:205px;font-family:serif;font-size:28px;color:#aaa">dolor sit amet, consectetur</div>
     <div style="position:absolute;left:40px;top:280px;width:180px;height:56px;border-radius:6px;background:#bdbdb9"></div><div style="position:absolute;left:470px;top:110px;width:370px;height:300px;background:#d6d6d2;display:flex;align-items:center;justify-content:center" class="mono"><span style="font-size:16px;color:#999">image 800×600</span></div>
     <div class="mono" style="position:absolute;right:20px;bottom:16px;font-size:14px;color:#aaa">template #47</div>`);
  const real = mk(b.body, 'inset:0;background:#222 url(img/poenza.jpg) center top/cover;clip-path:inset(0 100% 0 0)');
  const x = C(e, 540, 740, 300, 300, '', `<svg width="300" height="300" viewBox="0 0 300 300"><path id="x1" d="M40 40 L260 260" stroke="#111" stroke-width="34" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><path id="x2" d="M260 40 L40 260" stroke="#111" stroke-width="34" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
  const xbg = C(e, 540, 740, 360, 360, `border-radius:50%;background:${Y};box-shadow:0 30px 70px rgba(0,0,0,.5)`);
  e.appendChild(x);
  const lab = pill(e, 540, 1110, 420, 70, '#1b1b1b', '#999', '<span class="mono" style="font-size:20px;letter-spacing:.2em;text-decoration:line-through">modelo pronto</span>');
  const trust = [[`<div style="display:flex;gap:4px">${[0, 1, 2, 3, 4].map(() => starSVG(Y, 30, '#111')).join('')}</div><span>4,9</span>`, 250, 1110, 33.3], [`<svg width="34" height="34" viewBox="0 0 34 34"><path d="M17 3 L29 8 V17 C29 24 23 29 17 31 C11 29 5 24 5 17 V8Z" fill="${Y}" stroke="#111" stroke-width="3"/><path d="M11 17 L15 21 L23 12" stroke="#111" stroke-width="3.4" fill="none" stroke-linecap="round"/></svg>confiança`, 820, 1110, 33.6]].map(([h, xx, yy, st]) => ({ el: pill(e, xx, yy, 330, 84, '#fff', '#111', h, 'box-shadow:0 20px 50px rgba(0,0,0,.4);font-size:30px'), st }));
  const sec = C(e, 540, 1240, 380, 90, `border-radius:45px;background:${Y};display:flex;align-items:center;justify-content:center;gap:14px;font-family:U;font-weight:800;font-size:38px;color:#111`, `<svg width="40" height="44" viewBox="0 0 44 50"><circle cx="22" cy="28" r="18" stroke="#111" stroke-width="5" fill="none"/><path d="M22 28 L22 18" stroke="#111" stroke-width="5" stroke-linecap="round"/><rect x="16" y="2" width="12" height="6" rx="2" fill="#111"/></svg>1º segundo`);
  s.set(t => {
    rise(b, t, 27.25, 40); b.style.transform += ` translateY(${(5 * Math.sin(t * 1.4)).toFixed(2)}px)`;
    const xo = 1 - P(t, 30.2, 30.45);
    set(xbg, { s: E.back(P(t, 28.35, 28.7)) * L(1, .6, P(t, 30.2, 30.45)), o: P(t, 28.35, 28.42) * xo });
    set(x, { s: L(1, .6, P(t, 30.2, 30.45)), o: xo });
    x.querySelector('#x1').style.strokeDashoffset = (1 - E.o3(P(t, 28.5, 28.75))).toFixed(3); x.querySelector('#x2').style.strokeDashoffset = (1 - E.o3(P(t, 28.7, 28.95))).toFixed(3);
    gen.style.filter = `grayscale(1) brightness(${(1 - .25 * P(t, 28.4, 28.8)).toFixed(3)})`;
    rise(lab, t, 29.5, 30, { o: 1 - P(t, 30.2, 30.4) });
    real.style.clipPath = `inset(0 ${(100 - 100 * E.io3(P(t, 30.4, 31.1))).toFixed(2)}% 0 0)`;
    trust.forEach(({ el, st }) => pop(el, t, st));
    pop(sec, t, 34.3);
  });
}
// ======================= CHAPTER 2: ATENDENTE =======================
chapterTitle(2, 'ATENDENTE INTELIGENTE', 35.3, 38.0);
{ // site with chat widget
  const s = S(37.85, 42.3); const e = s.e;
  const b = siteImg(e, 'alpha', 880, 600);
  mk(b.body, 'inset:0;background:linear-gradient(90deg,rgba(0,0,0,.1),rgba(0,0,0,.45))');
  const panel = mk(b.body, 'right:22px;bottom:110px;width:400px;height:400px;border-radius:26px;background:#fff;box-shadow:0 20px 50px rgba(0,0,0,.45);transform-origin:100% 100%;overflow:hidden', `
     <div style="position:absolute;left:0;right:0;top:0;height:92px;border-bottom:1px solid #eee"><div style="position:absolute;left:22px;top:18px;width:56px;height:56px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 34)}</div><div style="position:absolute;left:92px;top:20px;font-family:IS;font-weight:700;font-size:24px;color:#111">Assistente IA</div><div class="mono" style="position:absolute;left:92px;top:56px;font-size:13px;color:#888;display:flex;gap:8px;align-items:center"><i style="display:block;width:9px;height:9px;border-radius:50%;background:#2bd46b"></i>online · 24h</div></div>
     <div style="position:absolute;left:18px;top:116px;padding:16px 20px;border-radius:22px 22px 22px 6px;background:#f0efeb;font-family:IS;font-size:23px;color:#111;max-width:300px">Olá! Como posso ajudar?</div>`);
  const btn = mk(b.body, `right:22px;bottom:22px;width:76px;height:76px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,.4)`, ICO.chat('#111', 42));
  const rg = mk(b.body, `right:22px;bottom:22px;width:76px;height:76px;border-radius:50%;border:4px solid ${Y}`);
  const tag = pill(e, 540, 1150, 560, 80, '#161616', '#fff', `${sparkSVG(Y, 30)}trabalhando para você`, 'border:2px solid #2a2a2a');
  s.set(t => {
    rise(b, t, 37.9, 40);
    btn.style.transform = `scale(${E.back(P(t, 38.5, 38.9)).toFixed(3)})`;
    const rp = ((t - 38.9) % 1.2) / 1.2; rg.style.opacity = t > 38.9 ? (1 - rp) * .8 : 0; rg.style.transform = `scale(${(1 + rp * .9).toFixed(3)})`;
    panel.style.transform = `scale(${E.back(P(t, 39.6, 40.1)).toFixed(3)})`; panel.style.opacity = P(t, 39.6, 39.7);
    pop(tag, t, 40.9);
  });
}
{ // phone flow: client enters, taps, asks anything, answers, goes to WhatsApp
  const s = S(42.1, 61.4); const e = s.e;
  const ph = C(e, 540, 790, 460, 930, 'border-radius:74px;background:#0d0d0d;box-shadow:0 60px 120px rgba(0,0,0,.6),inset 0 0 0 3px #2a2a2a');
  const scr = mk(ph, 'left:14px;top:14px;width:432px;height:902px;border-radius:60px;overflow:hidden;background:#fff');
  const site = mk(scr, 'inset:0;background:#222 url(img/kundara.jpg) 30% top/cover');
  mk(scr, 'left:166px;top:14px;width:100px;height:30px;border-radius:15px;background:#0d0d0d');
  const cbtn = mk(scr, `right:26px;bottom:34px;width:84px;height:84px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,.4)`, ICO.chat('#111', 46));
  const tap = mk(scr, 'right:26px;bottom:34px;width:84px;height:84px;border-radius:50%;background:rgba(255,255,255,.6)');
  const sheet = mk(scr, 'left:0;top:110px;width:432px;height:792px;border-radius:34px 34px 0 0;background:#fff;box-shadow:0 -20px 50px rgba(0,0,0,.25);overflow:hidden', `
    <div style="position:absolute;left:0;right:0;top:0;height:100px;border-bottom:1px solid #eee"><div style="position:absolute;left:24px;top:22px;width:56px;height:56px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 34)}</div><div style="position:absolute;left:94px;top:24px;font-family:IS;font-weight:700;font-size:24px;color:#111">Assistente IA</div><div class="mono" style="position:absolute;left:94px;top:58px;font-size:13px;color:#888">responde na hora</div></div>`);
  const msgs = mk(sheet, 'left:0;top:100px;width:432px;height:690px');
  const MS = [['Qual o horário?', 'r', 51.0], ['Abrimos de segunda a sábado, das 9h às 19h.', 'l', 52.3], ['E onde fica?', 'r', 53.2], ['Rua das Flores, 120 — ao lado da praça. Quer que eu marque uma visita?', 'l', 54.3], ['Quero sim!', 'r', 56.6], ['Perfeito! Vou te passar para o nosso WhatsApp 👇', 'l', 57.8]];
  const bubs = MS.map(([tx, side, ti]) => ({ el: mk(msgs, `${side === 'r' ? 'right:18px' : 'left:18px'};top:0;max-width:310px;padding:15px 20px;border-radius:24px;${side === 'r' ? `background:${Y};color:#111;border-bottom-right-radius:6px;font-weight:600` : 'background:#f0efeb;color:#111;border-bottom-left-radius:6px'};font-family:IS;font-size:22px;line-height:1.28;transform-origin:${side === 'r' ? '100% 100%' : '0 100%'}`, tx.replace('👇', '')), ti, h: 0 }));
  const waBtn = mk(msgs, 'left:18px;top:0;width:330px;height:72px;border-radius:36px;background:#111;display:flex;align-items:center;justify-content:center;gap:12px;font-family:IS;font-weight:700;font-size:23px;color:#fff;transform-origin:0 100%', `${ICO.wa(40)}Continuar no WhatsApp`);
  const wtap = mk(msgs, 'left:18px;top:0;width:330px;height:72px;border-radius:36px;background:rgba(255,255,255,.35)');
  // whatsapp screen
  const wa = mk(scr, 'inset:0;background:#0f0f0f', `<div style="position:absolute;left:0;right:0;top:0;height:150px;background:#1a1a1a;display:flex;align-items:flex-end;gap:16px;padding:0 0 22px 26px">${ICO.wa(56)}<div><div style="font-family:IS;font-weight:700;font-size:26px;color:#fff">Seu negócio</div><div class="mono" style="font-size:12px;color:#888;margin-top:4px">whatsapp · online</div></div></div><div style="position:absolute;left:0;right:0;top:150px;bottom:0;background-image:radial-gradient(#1c1c1c 1.5px,transparent 1.5px);background-size:24px 24px"></div>`);
  const waMsg = mk(wa, 'left:22px;top:190px;width:380px;padding:20px 22px;border-radius:24px 24px 24px 6px;background:#fff;transform-origin:0 100%', `<div style="display:inline-flex;padding:6px 14px;border-radius:16px;background:${Y};font-family:U;font-weight:700;font-size:15px;color:#111">✓ dúvidas respondidas</div><div style="font-family:IS;font-weight:700;font-size:26px;color:#111;margin-top:12px">Olá! Quero marcar uma visita.</div><div class="mono" style="font-size:13px;color:#888;margin-top:10px">via assistente do site</div>`);
  const QS = [['Quanto custa?', 220, 330, 47.14], ['Como funciona?', 860, 420, 47.94], ['Qual o horário?', 210, 560, 48.82], ['Onde fica?', 880, 700, 49.46], ['Qual o prazo?', 230, 860, 50.58]];
  const qs = QS.map(([q, x, y]) => pill(e, x, y, 300, 82, '#fff', '#111', q, 'box-shadow:0 20px 50px rgba(0,0,0,.45);font-size:28px'));
  const fast = pill(e, 860, 980, 300, 80, Y, '#111', '<span style="font-family:U;font-weight:800;font-size:26px">na hora ⚡</span>'.replace('⚡', ''), 'box-shadow:0 20px 50px rgba(0,0,0,.4)');
  const info = pill(e, 220, 1120, 330, 80, '#161616', '#fff', `${ICO.site(Y, 34)}dados da empresa`, 'border:2px solid #2a2a2a;font-size:26px');
  const real = pill(e, 860, 1210, 330, 80, '#161616', '#fff', `${ICO.person(Y, 34)}como gente`, 'border:2px solid #2a2a2a;font-size:26px');
  s.set(t => {
    if (!s.m) { bubs.forEach(b => b.h = b.el.offsetHeight); s.m = 1 }
    const qOn = 1 - P(t, 51.3, 51.7);
    set(ph, { y: T(t, 42.15, 42.7, 80, 0, E.o4), s: T(t, 42.15, 42.7, .94, 1, E.o4) * T(t, 46.9, 47.4, 1, .9, E.io3) / T(t, 51.3, 51.8, 1, .9, E.io3) });
    site.style.transform = `scale(${T(t, 43.2, 44.0, 1.15, 1, E.o3).toFixed(3)})`; site.style.opacity = P(t, 43.15, 43.5);
    cbtn.style.transform = `scale(${(E.back(P(t, 44.0, 44.4)) * (1 - .12 * Math.sin(Math.PI * P(t, 44.75, 44.95)))).toFixed(3)})`;
    const tp = P(t, 44.78, 45.2); tap.style.opacity = t > 44.78 ? (1 - tp) * .9 : 0; tap.style.transform = `scale(${(1 + tp * 1.2).toFixed(3)})`;
    sheet.style.transform = `translateY(${((1 - E.o4(P(t, 45.0, 45.4))) * 800).toFixed(1)}px)`;
    qs.forEach((q, i) => { const st = QS[i][3]; pop(q, t, st, { r: (i % 2 ? 4 : -4), o: qOn, y: 6 * Math.sin(t * 1.6 + i) }) });
    // chat stack bottom-up
    let yb = 670; const G = 12;
    const btnA = E.o4(P(t, 58.4, 58.7));
    waBtn.style.top = (yb - 72).toFixed(1) + 'px'; waBtn.style.opacity = btnA; waBtn.style.transform = `scale(${L(.5, 1, E.back(P(t, 58.4, 58.75))).toFixed(3)})`;
    wtap.style.top = waBtn.style.top; const wt = P(t, 59.4, 59.8); wtap.style.opacity = t > 59.4 ? (1 - wt) : 0;
    yb -= (72 + G) * btnA;
    for (let i = bubs.length - 1; i >= 0; i--) { const b = bubs[i]; const a = E.o4(P(t, b.ti, b.ti + .3)); if (a <= 0) { b.el.style.opacity = 0; continue } b.el.style.top = (yb - b.h).toFixed(1) + 'px'; b.el.style.opacity = Math.min(1, a * 1.4); b.el.style.transform = `scale(${L(.5, 1, E.back(P(t, b.ti, b.ti + .32))).toFixed(3)})`; yb -= (b.h + G) * a }
    pop(fast, t, 52.36, { r: 4 }); pop(info, t, 53.4, { r: -3 }); pop(real, t, 55.3, { r: 3 });
    const wf = E.io3(P(t, 59.95, 60.5)); wa.style.transform = `translateX(${((1 - wf) * 432).toFixed(1)}px)`;
    waMsg.style.transform = `scale(${L(.4, 1, E.back(P(t, 60.6, 60.95))).toFixed(3)})`; waMsg.style.opacity = P(t, 60.6, 60.68);
    [fast, info, real].forEach(p => p.style.opacity = (parseFloat(p.style.opacity || 0) * (1 - P(t, 59.6, 59.9))).toFixed(3));
  });
}
{ // já chega qualificado
  const s = S(61.2, 68.7); const e = s.e;
  const w = card(e, 540, 640, 860, 520, 'background:#121212;border:2px solid #222', `<div style="position:absolute;left:0;right:0;top:0;height:110px;background:#1a1a1a;display:flex;align-items:center;gap:20px;padding-left:30px">${ICO.wa(60)}<div><div style="font-family:IS;font-weight:700;font-size:30px;color:#fff">WhatsApp</div><div class="mono" style="font-size:14px;color:#888;margin-top:4px">novo cliente</div></div></div>
     <div style="position:absolute;left:34px;top:150px;width:620px;padding:24px 28px;border-radius:28px 28px 28px 8px;background:#fff"><div style="font-family:IS;font-weight:700;font-size:32px;color:#111">Ana · Lisboa</div><div style="font-family:IS;font-weight:500;font-size:25px;color:#555;margin-top:10px;line-height:1.45">Já sabe preço, horário e prazo.<br>Quer fechar esta semana.</div></div>`);
  const CK = [['dúvidas respondidas', 64.3], ['mais qualificado', 65.74]];
  const cks = CK.map(([s2], i) => C(e, 540, 1000 + i * 100, 760, 84, 'border-radius:42px;background:#161616;border:2px solid #262626;display:flex;align-items:center;gap:18px;padding-left:24px;font-family:IS;font-weight:700;font-size:32px;color:#fff', `<div style="width:50px;height:50px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${ICO.check('#111', 34, 8)}</div>${s2}`));
  const close = C(e, 540, 1215, 760, 110, 'border-radius:30px;background:#161616;border:2px solid #262626', `<div style="position:absolute;left:28px;top:16px;font-family:IS;font-weight:700;font-size:28px;color:#fff">perto de fechar</div><div class="pc" style="position:absolute;right:28px;top:16px;font-family:U;font-weight:800;font-size:28px;color:${Y}">0%</div><div style="position:absolute;left:28px;right:28px;top:68px;height:16px;border-radius:8px;background:#2a2a2a;overflow:hidden"><div class="f" style="position:absolute;inset:0;background:${Y};transform-origin:0 50%;transform:scaleX(0)"></div></div>`);
  s.set(t => { rise(w, t, 61.25, 50); CK.forEach(([, st], i) => rise(cks[i], t, st, 30)); rise(close, t, 67.4, 30); const p = E.io3(P(t, 67.6, 68.3)) * .9; close.querySelector('.f').style.transform = `scaleX(${p.toFixed(3)})`; close.querySelector('.pc').textContent = Math.round(p * 100) + '%' });
}
{ // para de responder a mesma pergunta
  const s = S(68.55, 72.0); const e = s.e;
  const qs = Array.from({ length: 9 }, (_, i) => pill(e, 540 + ((i * 137) % 300) - 150, 380 + i * 90, 330, 76, '#fff', '#111', 'Quanto custa?', 'box-shadow:0 18px 40px rgba(0,0,0,.45);font-size:28px'));
  const no = C(e, 540, 760, 820, 140, `border-radius:70px;background:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:46px;color:#111;box-shadow:0 30px 70px rgba(0,0,0,.5)`, 'chega de repetir');
  s.set(t => { qs.forEach((q, i) => pop(q, t, 68.85 + i * .14, { r: (i % 2 ? 3 : -3), o: 1 - .75 * P(t, 70.9, 71.2) })); pop(no, t, 71.0, { r: -3 }) });
}
{ // perder tempo com o curioso
  const s = S(71.85, 74.05); const e = s.e;
  const hg = C(e, 540, 640, 220, 300, '', `<svg width="220" height="300" viewBox="0 0 220 300" fill="none" stroke="#fff" stroke-width="12" stroke-linejoin="round"><path d="M40 20 H180 M40 280 H180 M55 20 C55 110 165 110 165 150 C165 190 55 190 55 280 M165 20 C165 110 55 110 55 150 C55 190 165 190 165 280"/><path d="M80 250 Q110 215 140 250Z" fill="${Y}" stroke="none"/></svg>`);
  const cur = pill(e, 540, 1000, 560, 96, '#161616', '#777', `${ICO.person('#777', 40)}<span style="text-decoration:line-through">só curiosos</span>`, 'border:2px solid #2a2a2a;font-size:34px');
  s.set(t => { set(hg, { r: E.io3(P(t, 72.3, 72.9)) * 180, s: E.back(P(t, 71.9, 72.3)), o: P(t, 71.9, 72.0) }); pop(cur, t, 73.2) });
}
{ // só com quem quer comprar
  const s = S(73.9, 77.2); const e = s.e;
  const av = Array.from({ length: 12 }, (_, i) => C(e, 270 + (i % 4) * 180, 520 + Math.floor(i / 4) * 200, 140, 140, 'border-radius:50%;background:#1e1e1e;display:flex;align-items:center;justify-content:center', ICO.person('#555', 76)));
  const BUY = [5, 10];
  const tag = pill(e, 540, 1180, 560, 90, Y, '#111', '<span style="font-family:U;font-weight:800;font-size:34px">quer comprar</span>');
  s.set(t => {
    av.forEach((a, i) => { pop(a, t, 74.0 + i * .04); const buy = BUY.includes(i); const k = P(t, 75.6, 76.0); a.style.background = buy && k > 0 ? Y : '#1e1e1e'; a.style.opacity = (parseFloat(a.style.opacity) * (buy ? 1 : 1 - .7 * k)).toFixed(3); if (buy) a.innerHTML = ICO.person(k > 0 ? '#111' : '#555', 76) });
    pop(tag, t, 76.3);
  });
}
{ // o próprio site faz o atendimento por você
  const s = S(77.05, 80.0); const e = s.e;
  const b = siteImg(e, 'jgc', 880, 600);
  const badge = pill(e, 540, 1130, 640, 96, '#fff', '#111', `${sparkSVG(Y, 36)}<span style="font-family:U;font-weight:800;font-size:32px">atendimento 24h</span>`, 'box-shadow:0 26px 60px rgba(0,0,0,.5)');
  const bub = C(e, 820, 620, 280, 120, 'border-radius:30px 30px 6px 30px;background:#fff;box-shadow:0 20px 50px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;gap:12px', '<i class="d" style="display:block;width:16px;height:16px;border-radius:50%;background:#111"></i><i class="d" style="display:block;width:16px;height:16px;border-radius:50%;background:#111"></i><i class="d" style="display:block;width:16px;height:16px;border-radius:50%;background:#111"></i>');
  s.set(t => { rise(b, t, 77.1, 40); pop(bub, t, 77.9); bub.querySelectorAll('.d').forEach((d, j) => d.style.transform = `translateY(${(-7 * Math.max(0, Math.sin((t * 6 - j * .45) * Math.PI))).toFixed(2)}px)`); pop(badge, t, 78.8) });
}
// ======================= CHAPTER 3: GOOGLE =======================
chapterTitle(3, 'GOOGLE MEU NEGÓCIO', 79.9, 81.3);
{
  const s = S(81.15, 88.0); const e = s.e;
  const bar = C(e, 540, 420, 900, 120, 'border-radius:60px;background:#fff;box-shadow:0 22px 60px rgba(0,0,0,.4);display:flex;align-items:center;padding-left:40px;gap:22px', `<svg width="42" height="42" viewBox="0 0 44 44"><circle cx="18" cy="18" r="13" stroke="#111" stroke-width="5" fill="none"/><path d="M28 28 L40 40" stroke="#111" stroke-width="5.5" stroke-linecap="round"/></svg><span class="q is" style="font-size:38px;font-weight:500;color:#111;white-space:pre"></span><i class="c" style="display:block;width:3px;height:44px;background:${Y};margin-left:-16px"></i>`);
  const q = bar.querySelector('.q'), cr = bar.querySelector('.c'); const QT = 'serviço perto de mim';
  const cd = card(e, 540, 860, 900, 560, '', `<div style="position:absolute;left:0;top:0;width:900px;height:250px;background:#E9E9E4"><svg width="900" height="250"><rect x="80" y="60" width="200" height="70" rx="10" fill="#dcdcd5"/><rect x="560" y="140" width="220" height="80" rx="10" fill="#dcdcd5"/><path d="M0 160 L900 140 M380 0 L420 250 M0 60 L900 40" stroke="#fff" stroke-width="18"/></svg></div>
     <div style="position:absolute;left:46px;top:280px;font-family:U;font-weight:600;font-size:42px;color:#111">Sua Empresa</div>
     <div style="position:absolute;left:46px;top:346px;display:flex;align-items:center;gap:8px"><span class="is" style="font-size:28px;font-weight:700;color:#111;margin-right:6px">4,9</span>${[0, 1, 2, 3, 4].map(() => starSVG(Y, 30, '#111')).join('')}</div>
     <div class="is" style="position:absolute;left:46px;top:400px;font-size:26px;color:#3b3b38;font-weight:500"><b style="color:#111">Aberto agora</b> · perto de você</div>
     <div style="position:absolute;left:46px;top:462px;display:flex;gap:16px"><div style="width:160px;height:66px;border-radius:33px;background:#f1f1ee;font-family:IS;font-weight:700;font-size:25px;display:flex;align-items:center;justify-content:center">Ligar</div><div style="width:160px;height:66px;border-radius:33px;background:#f1f1ee;font-family:IS;font-weight:700;font-size:25px;display:flex;align-items:center;justify-content:center">Rotas</div><div class="st" style="width:160px;height:66px;border-radius:33px;background:${Y};font-family:IS;font-weight:700;font-size:25px;display:flex;align-items:center;justify-content:center">Site</div></div>`);
  const pin = C(e, 560, 640, 70, 92, '', `<svg width="70" height="92" viewBox="0 0 70 92"><path d="M35 90 C35 90 4 54 4 34 A31 31 0 1 1 66 34 C66 54 35 90 35 90Z" fill="${Y}" stroke="#111" stroke-width="5"/><circle cx="35" cy="34" r="11" fill="#111"/></svg>`);
  const cur = C(e, 0, 0, 60, 78, '', CURSOR(60, '#fff', '#111'));
  const mini = browser(e, 540, 860, 760, 500, 'light'); mk(mini.body, 'inset:0;background:#222 url(img/deck.jpg) center top/cover'); mini.style.boxShadow = '0 50px 110px rgba(0,0,0,.6)';
  s.set(t => {
    rise(bar, t, 81.2, 40); q.textContent = QT.slice(0, Math.floor(P(t, 83.3, 84.2) * QT.length)); cr.style.opacity = Math.floor(t * 3) % 2 ? 0 : 1;
    rise(cd, t, 84.8, 80);
    set(pin, { y: (1 - E.i3(P(t, 85.3, 85.55))) * -200, o: P(t, 85.3, 85.34), s: 1 + .12 * ring(t, 85.55, 2.6, 8) });
    const k = E.o4(P(t, 86.0, 86.5)); set(cur, { x: L(1000, 452, k), y: L(1400, 1160, k), s: 1 - .15 * Math.sin(Math.PI * P(t, 86.55, 86.7)), o: P(t, 86.0, 86.06) * (1 - P(t, 86.9, 87.0)) });
    const mk_ = E.back(P(t, 86.8, 87.25)); set(mini, { s: L(.2, 1, mk_), y: L(300, 0, E.o4(P(t, 86.8, 87.25))), o: P(t, 86.8, 86.86) });
  });
}
// ======================= RECAP + PRICE =======================
{
  const s = S(87.85, 94.45); const e = s.e;
  const T3 = [['site', 'Site profissional', 88.04], ['chat', 'Atendente IA + WhatsApp', 89.34], ['pin', 'Google Meu Negócio', 91.8]];
  const tiles = T3.map(([ic, n], i) => C(e, 540, 470 + i * 190, 860, 160, 'border-radius:36px;background:#fff;box-shadow:0 30px 70px rgba(0,0,0,.45);display:flex;align-items:center;gap:28px;padding-left:34px', `<div style="width:96px;height:96px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center">${ICO[ic](Y, 54)}</div><span style="font-family:U;font-weight:700;font-size:38px;color:#111;letter-spacing:-.02em">${n}</span><div style="position:absolute;right:34px;width:64px;height:64px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${ICO.check('#111', 42, 8)}</div>`));
  const box = C(e, 540, 660, 300, 300, 'border-radius:50%;background:#111;border:4px solid ' + Y + ';display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 18px rgba(255,196,0,.12)', ICO.box(Y, 160));
  const lb = txt(e, 540, 900, 900, 64, '#fff', 'tudo num pacote só');
  s.set(t => {
    const m = E.io3(P(t, 93.0, 93.4));
    tiles.forEach((tl, i) => { const st = T3[i][2]; const k = E.o4(P(t, st, st + .5)); set(tl, { y: (1 - k) * 50 + m * (660 - (470 + i * 190)), s: L(1, .3, m), o: P(t, st, st + .15) * (1 - P(t, 93.25, 93.4)) }) });
    pop(box, t, 93.3); rise(lb, t, 93.5);
  });
}
{
  const s = S(94.3, 97.15, Y, { si: 1.1 }); const e = s.e;
  mk(e, 'inset:0;background:radial-gradient(ellipse 70% 45% at 50% 40%,rgba(255,255,255,.4),rgba(255,255,255,0) 70%)');
  const ap = mono(e, 540, 560, 600, 30, '#4d3b00', 'a partir de');
  const pr = txt(e, 540, 760, 1080, 260, '#111', '€249', 'font-weight:900');
  const sub = pill(e, 540, 1000, 500, 84, '#111', Y, '<span class="mono" style="font-size:22px;letter-spacing:.2em">tudo incluído</span>');
  s.set(t => { rise(ap, t, 94.4); const n = Math.round(249 * E.o3(P(t, 95.0, 95.9))); pr.innerHTML = `<span style="font-size:.55em;margin-right:14px;vertical-align:.5em">€</span>${n}`; set(pr, { s: T(t, 95.0, 95.4, .8, 1, E.back) * (1 + .04 * ring(t, 95.95, 3, 7)), o: P(t, 95.0, 95.1) }); pop(sub, t, 96.1) });
}
// ======================= PAGAMENTO ÚNICO =======================
{
  const s = S(96.95, 105.75); const e = s.e;
  const at = C(e, 540, 520, 150, 150, `border-radius:50%;border:8px solid ${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:900;font-size:90px;color:${Y}`, '!');
  const stamp = C(e, 540, 760, 760, 190, `border:9px solid #111;border-radius:26px;background:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:900;font-size:76px;color:#111;letter-spacing:-.03em;box-shadow:0 30px 70px rgba(0,0,0,.5)`, 'PAGAMENTO ÚNICO');
  const pay = card(e, 540, 1070, 640, 200, 'background:#161616;border:2px solid #262626;box-shadow:none', `<div style="position:absolute;left:36px;top:40px;width:120px;height:80px;border-radius:12px;background:linear-gradient(135deg,#333,#1c1c1c);border:2px solid #444"><div style="position:absolute;left:14px;top:22px;width:30px;height:22px;border-radius:4px;background:${Y}"></div></div><div style="position:absolute;left:190px;top:36px;font-family:U;font-weight:800;font-size:44px;color:#fff">1x</div><div class="mono" style="position:absolute;left:192px;top:100px;font-size:18px;color:#888">pagas uma vez</div><div class="ok" style="position:absolute;right:36px;top:46px;height:100px;padding:0 26px;border-radius:50px;background:${Y};display:flex;align-items:center;gap:10px;font-family:IS;font-weight:800;font-size:30px;color:#111">${ICO.check('#111', 34, 8)}pronto</div>`);
  s.set(t => { pop(at, t, 97.25); set(stamp, { s: T(t, 101.9, 102.1, 2.2, 1, E.o4), r: -4, o: P(t, 101.9, 101.98), b: T(t, 101.9, 102.04, 10, 0) }); rise(pay, t, 103.4, 50); pay.querySelector('.ok').style.transform = `scale(${E.back(P(t, 105.15, 105.5)).toFixed(3)})` });
}
{
  const s = S(105.6, 111.0); const e = s.e;
  const R3 = [['Mensalidade', 106.3], ['Taxa de manutenção', 108.2], ['Surpresa no fim do mês', 110.3]];
  const rows = R3.map(([n], i) => C(e, 540, 560 + i * 170, 860, 136, 'border-radius:34px;background:#161616;border:2px solid #262626', `<div style="position:absolute;left:34px;top:0;height:136px;display:flex;align-items:center;font-family:U;font-weight:700;font-size:38px;color:#fff;letter-spacing:-.02em">${n}</div><div class="st" style="position:absolute;left:28px;right:150px;top:66px;height:6px;border-radius:3px;background:${Y};transform-origin:0 50%;transform:scaleX(0)"></div><div class="x" style="position:absolute;right:30px;top:28px;width:80px;height:80px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;transform:scale(0)"><svg width="36" height="36"><path d="M6 6 L30 30 M30 6 L6 30" stroke="#111" stroke-width="7" stroke-linecap="round"/></svg></div>`));
  const zero = txt(e, 540, 1110, 800, 50, '#fff', 'não tem');
  s.set(t => { rows.forEach((r, i) => { const st = R3[i][1]; rise(r, t, st - .45, 40); r.querySelector('.st').style.transform = `scaleX(${E.io3(P(t, st, st + .4)).toFixed(3)})`; r.querySelector('.x').style.transform = `scale(${E.back(P(t, st + .1, st + .45)).toFixed(3)})` }); set(zero, { o: 0 }) });
}
{
  const s = S(110.85, 116.45); const e = s.e;
  const key = C(e, 540, 470, 200, 200, `border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center`, `<svg width="110" height="110" viewBox="0 0 64 64" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"><circle cx="20" cy="32" r="12"/><path d="M32 32 H58 M50 32 V42 M42 32 V40"/></svg>`);
  const own = txt(e, 540, 640, 900, 64, '#fff', 'o site é seu');
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => C(e, 180 + i * 120, 840, 100, 100, 'border-radius:24px;background:#1b1b1b;border:2px solid #2a2a2a;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:36px;color:#666', d));
  const z = txt(e, 540, 1080, 900, 130, Y, '€0<span style="font-size:.4em;color:#fff;margin-left:10px">/mês</span>', 'font-weight:900');
  s.set(t => { pop(key, t, 111.1); rise(own, t, 111.4); days.forEach((d, i) => { pop(d, t, 112.4 + i * .06); const lit = t > 113.85 + i * .07; d.style.background = lit ? Y : '#1b1b1b'; d.style.color = lit ? '#111' : '#666'; d.style.borderColor = lit ? Y : '#2a2a2a' }); pop(z, t, 114.9) });
}
// ======================= PROVA: 3 anos, centenas de sites =======================
{
  const s = S(116.3, 121.95); const e = s.e;
  const IM = ['deck', 'jgc', 'kundara', 'alpha', 'poenza', 'brother', 'paint', 'remodel', 'roof'];
  const wall = mk(e, 'left:540px;top:1000px;width:0;height:0'); const inner = mk(wall, 'left:0;top:0;width:0;height:0;transform:perspective(1900px) rotateX(26deg) rotateZ(-15deg) scale(1.15)');
  const cols = [0, 1, 2].map(c => { const col = mk(inner, `left:${(c - 1) * 640 - 300}px;top:-1500px;width:600px;height:3200px`); for (let i = 0; i < 9; i++) mk(col, `left:0;top:${i * 345}px;width:600px;height:291px;border-radius:18px;background:#222 url(img/${IM[(i * 2 + c * 3) % 9]}.jpg) center/cover;box-shadow:0 30px 60px rgba(0,0,0,.5)`); return col });
  const shade = mk(e, 'inset:0;background:linear-gradient(180deg,rgba(11,11,11,.96) 0%,rgba(11,11,11,.85) 38%,rgba(11,11,11,.35) 65%,rgba(11,11,11,.7) 100%)');
  const big = txt(e, 540, 470, 1000, 180, Y, '+3 anos', 'font-weight:900');
  const eu = mono(e, 540, 620, 700, 26, '#fff', 'aqui na europa');
  const cen = pill(e, 540, 760, 640, 96, '#fff', '#111', '<span style="font-family:U;font-weight:800;font-size:32px">centenas de sites entregues</span>', 'box-shadow:0 26px 60px rgba(0,0,0,.5)');
  s.set(t => { cols.forEach((c, i) => c.style.transform = `translateY(${((i % 2 ? -1 : 1) * (t - 116) * 60 + (i % 2 ? 0 : -300)).toFixed(1)}px)`); wall.style.opacity = P(t, 118.8, 119.4) * .9 + .1; rise(big, t, 116.6, 50); rise(eu, t, 118.3); pop(cen, t, 119.0) });
}
// ======================= CTA =======================
{
  const s = S(121.8, 140, Y, { si: 1.06 }); const e = s.e;
  mk(e, 'inset:0;background:radial-gradient(ellipse 70% 45% at 50% 40%,rgba(255,255,255,.35),rgba(255,255,255,0) 70%)');
  const lg = C(e, 540, 360, 470, 260); C(lg, 235, 62, 250, 124, '', sym('#111', 250)); C(lg, 235, 176, 430, 70, '', wmLetters('#111', 430)); C(lg, 235, 234, 340, 22, '', tagline('#111', 340));
  const g = txt(e, 540, 680, 1000, 150, '#111', 'Gostou?', 'font-weight:900');
  const inp = C(e, 540, 1050, 900, 120, 'border-radius:60px;background:#fff;box-shadow:0 30px 70px rgba(80,50,0,.3);display:flex;align-items:center;padding-left:40px', `<span class="q is" style="font-size:36px;font-weight:500;color:#111;white-space:pre"></span><i class="c" style="display:block;width:3px;height:44px;background:#111;margin-left:4px"></i><div class="snd" style="position:absolute;right:12px;top:12px;width:96px;height:96px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center"><svg width="40" height="40" viewBox="0 0 22 22"><path d="M3 11 L19 3 L13 19 L11 12Z" fill="${Y}"/></svg></div>`);
  const q = inp.querySelector('.q'), cr = inp.querySelector('.c'), snd = inp.querySelector('.snd'); const QT = 'Quero começar o meu!';
  const ar = C(e, 540, 1260, 90, 120, '', `<svg width="90" height="120" viewBox="0 0 90 120"><path d="M45 8 V100 M14 70 L45 104 L76 70" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  s.set(t => { rise(lg, t, 121.9, 40); set(g, { s: E.back(P(t, 122.0, 122.4)), r: -2, o: P(t, 122.0, 122.1) }); rise(inp, t, 122.8, 50); q.textContent = QT.slice(0, Math.floor(P(t, 123.3, 124.6) * QT.length)); cr.style.opacity = Math.floor(t * 3) % 2 ? 0 : 1; snd.style.transform = `scale(${(1 + .1 * ring(t, 124.9, 2, 4) + .05 * Math.max(0, Math.sin(t * 4)) * P(t, 125, 126)).toFixed(3)})`; set(ar, { y: Math.abs(Math.sin((t - 123) * Math.PI * 1.3)) * 22, o: P(t, 123.4, 123.7) }) });
}

// ======================= captions (auto-chunked) =======================
const EMPH = new Set(['oferta', 'europa', 'exagero', 'diferente', 'minuto', 'receber', 'profissional', 'medida', 'vitrine', 'genérico', 'confiança', 'muda', 'inteligente', 'botão', 'quiser', 'hora', 'verdade', 'whatsapp', 'qualificado', 'fechar', 'curioso', 'comprar', 'google', 'configurado', '249', 'único', 'pronto', 'mensalidade', 'manutenção', 'surpresa', 'seu', 'três', 'centenas', 'gostou', 'começa', 'atenção', 'custa', 'funciona', 'horário', 'fica', 'prazo', 'respondidas', 'pergunta', 'tudo', 'grande', 'você.']);
const CH = []; { let st = 0; for (let i = 0; i < WORDS.length; i++) { const w = WORDS[i][0]; const n = WORDS[i + 1]; const end = /[.,?!:]$/.test(w) || !n || (i - st >= 3) || (n && n[1] - WORDS[i][1] > .7); if (end) { const em = []; for (let k = st; k <= i; k++) { const c = WORDS[k][0].toLowerCase().replace(/[.,?!:]/g, ''); if (EMPH.has(c) && !em.length) em.push(k) } const nt = n ? n[1] : WORDS[i][1] + 1.2; CH.push([st, i, em, Math.min(nt - .04, WORDS[i][1] + 1.6)]); st = i + 1 } } }
const THEME = t => (t >= 94.42 && t < 97.0) || t >= 121.95 ? 'y' : 'd';
const SHAKE = [[101.95, 8], [95.95, 4]];
const seek0 = makeSeek({ WORDS, CH, THEME, SHAKE });
window.seek = (t, f) => { ambBG(t); hudU(t); seek0(t, f) };

// ======================= SFX (sparse & soft) =======================
window.SFX = [
  { t: .1, type: 'hit', g: .3 }, { t: .46, type: 'hit', g: .3 }, { t: 1.0, type: 'pop', g: .2 },
  { t: 2.3, type: 'swell', g: .25 }, { t: 4.05, type: 'pop', g: .2 }, { t: 6.6, type: 'shimmer', g: .22 },
  { t: 9.86, type: 'pop', g: .2 }, { t: 14.1, type: 'whoosh', g: .25 },
  ...[0, 1, 2].map(i => ({ t: 16.1 + i * .35, type: 'pop', g: .14 })),
  { t: 18.3, type: 'whoosh', g: .3 }, { t: 21.4, type: 'tick', g: .2 }, { t: 25.9, type: 'shine', g: .25 },
  { t: 28.35, type: 'stamp', g: .3 }, { t: 30.4, type: 'swish', g: .22 }, { t: 34.3, type: 'ding', g: .18 },
  { t: 35.25, type: 'whoosh', g: .3 }, { t: 39.6, type: 'pop', g: .18 },
  { t: 44.75, type: 'click', g: .3 }, ...[47.14, 47.94, 48.82, 49.46, 50.58].map(t => ({ t, type: 'pop', g: .13 })),
  { t: 51.0, type: 'msg2', g: .16 }, { t: 52.3, type: 'msg', g: .18 }, { t: 53.2, type: 'msg2', g: .14 }, { t: 54.3, type: 'msg', g: .16 }, { t: 56.6, type: 'msg2', g: .14 }, { t: 57.8, type: 'msg', g: .16 },
  { t: 59.4, type: 'click', g: .28 }, { t: 59.95, type: 'swish', g: .22 }, { t: 60.6, type: 'notif', g: .22 },
  { t: 64.3, type: 'tick', g: .2 }, { t: 65.74, type: 'tick', g: .2 },
  { t: 71.0, type: 'stamp', g: .26 }, { t: 75.6, type: 'shimmer', g: .2 }, { t: 78.8, type: 'pop', g: .16 },
  { t: 79.85, type: 'whoosh', g: .3 }, ...Array.from({ length: 7 }, (_, i) => ({ t: 83.3 + i * .13, type: 'key', g: .12 })),
  { t: 85.3, type: 'drop', g: .25 }, { t: 86.55, type: 'click', g: .25 },
  { t: 93.0, type: 'swish', g: .22 }, { t: 93.3, type: 'pop', g: .2 }, { t: 94.3, type: 'swell', g: .3 }, { t: 95.95, type: 'ding', g: .25 },
  { t: 101.9, type: 'stamp', g: .45 }, { t: 105.15, type: 'ding', g: .16 },
  { t: 106.3, type: 'scribble', g: .16 }, { t: 108.2, type: 'scribble', g: .16 }, { t: 110.3, type: 'scribble', g: .16 },
  { t: 114.9, type: 'pop', g: .2 }, { t: 116.3, type: 'whoosh', g: .28 }, { t: 119.0, type: 'pop', g: .18 },
  { t: 121.8, type: 'swell', g: .28 }, { t: 124.9, type: 'msg2', g: .2 },
];
window.ready = document.fonts.ready.then(() => Promise.all(['deck', 'kundara', 'alpha', 'poenza', 'jgc', 'brother', 'paint', 'remodel', 'roof'].map(n => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = `img/${n}.jpg` })))).then(() => { seek(0, 0); return true });
