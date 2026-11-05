// NewWay — "A oferta" (voice 4, ~2 min). Exact-aspect device mockups, gliding-pill kinetic captions, yellow band wipes.
window.DUR = 124.4;
const WORDS = window.WORDS;
const hud = $('#hud');
const SITE_AR = 933 / 1905; // every site screenshot is exactly 1905×933 — mockup screens use this ratio, never crop
const BG = mk(cam, 'left:0;top:0;width:1080px;height:1920px;background:#0a0a0a');
const ambBG = ambient(BG, '255,196,0', .16);
mk(BG, 'inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:90px 90px;-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 45%,#000,transparent)');

function S(a, b, bg = 'transparent', opt = {}) {
  const s = scene(a, b, bg);
  s.set = f => { s.u = t => { const ki = E.o3(P(t, a, a + (opt.fi ?? .4))), ko = E.i2(P(t, b - (opt.fo ?? .35), b)); s.e.style.opacity = (opt.hard ? 1 : ki * (1 - ko)).toFixed(3); s.e.style.transform = opt.hard ? 'none' : `scale(${(L(opt.si ?? 1.05, 1, ki) * L(1, opt.so ?? .96, ko)).toFixed(4)})`; f(t) } };
  return s;
}
const rise = (el, t, st, dy = 40, x = {}) => { const k = E.o4(P(t, st, st + .55)); set(el, { x: x.x || 0, y: dy * (1 - k) + (x.y || 0), s: x.s ?? 1, r: x.r || 0, o: P(t, st, st + .18) * (x.o ?? 1), b: (1 - E.o3(P(t, st, st + .3))) * 8 }) };
const pop = (el, t, st, x = {}) => set(el, { x: x.x || 0, y: x.y || 0, s: E.back(P(t, st, st + .42)) * (x.s ?? 1), r: x.r || 0, o: P(t, st, st + .1) * (x.o ?? 1) });
const card = (par, x, y, w, h, extra = '', html = '') => C(par, x, y, w, h, `border-radius:32px;background:#fff;box-shadow:0 40px 90px rgba(0,0,0,.5);overflow:hidden;${extra}`, html);
const txt = (par, x, y, w, size, color, html, extra = '') => C(par, x, y, w, size * 1.3, `display:flex;align-items:center;justify-content:center;text-align:center;font-family:U;font-weight:800;font-size:${size}px;color:${color};letter-spacing:-.035em;line-height:1;${extra}`, html);
const mono = (par, x, y, w, size, color, s) => C(par, x, y, w, size * 1.6, `text-align:center;font-size:${size}px;color:${color}`, s, 'mono');
const pill = (par, x, y, w, h, bg, col, html, extra = '') => C(par, x, y, w, h, `border-radius:${h / 2}px;background:${bg};color:${col};display:flex;align-items:center;justify-content:center;gap:12px;font-family:IS;font-weight:700;font-size:${Math.round(h * .38)}px;${extra}`, html);
const maskLine = (par, y, size, color, s, extra = '') => { const m = mk(par, `left:0;top:${y - size * .65}px;width:1080px;height:${size * 1.3}px;overflow:hidden`); const i = mk(m, `left:0;top:0;width:1080px;height:${size * 1.3}px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:${size}px;color:${color};letter-spacing:-.04em;line-height:1;${extra}`, s); return { m, i, h: size * 1.3 } };
const lineIn = (l, t, st, out = 1e9) => { const k = E.o5(P(t, st, st + .5)), o = E.i3(P(t, out, out + .3)); l.i.style.transform = `translateY(${((1 - k) * l.h - o * l.h).toFixed(1)}px)` };

// ---------- DEVICE MOCKUPS (exact aspect; images are <img> sized to the ratio, never cover/cropped) ----------
function laptop(par, x, y, Wd, imgs) {
  const b = Math.round(Wd * .018), bar = Math.round(Wd * .04), sh = Math.round(Wd * SITE_AR);
  const lidH = bar + sh + 2 * b, baseH = Math.round(Wd * .034);
  const root = C(par, x, y, Wd + 2 * b, lidH + baseH, 'transform-style:preserve-3d', '', 'lap');
  const lid = mk(root, `left:0;top:0;width:${Wd + 2 * b}px;height:${lidH}px;border-radius:${b * 1.6}px ${b * 1.6}px ${b * .5}px ${b * .5}px;background:#0e0e0f;box-shadow:inset 0 0 0 2px #2c2c2e,0 60px 120px rgba(0,0,0,.55)`);
  mk(lid, `left:${(Wd + 2 * b) / 2 - 4}px;top:${b / 2 - 4}px;width:8px;height:8px;border-radius:50%;background:#1f1f22`);
  const scr = mk(lid, `left:${b}px;top:${b}px;width:${Wd}px;height:${bar + sh}px;overflow:hidden;border-radius:${b * .4}px;background:#000`);
  mk(scr, `left:0;top:0;width:${Wd}px;height:${bar}px;background:#ededeb;display:flex;align-items:center;gap:${bar * .22}px;padding-left:${bar * .5}px`, `<i style="display:block;width:${bar * .28}px;height:${bar * .28}px;border-radius:50%;background:#ff5f57"></i><i style="display:block;width:${bar * .28}px;height:${bar * .28}px;border-radius:50%;background:#febc2e"></i><i style="display:block;width:${bar * .28}px;height:${bar * .28}px;border-radius:50%;background:#28c840"></i><div style="position:absolute;left:50%;top:${bar * .2}px;transform:translateX(-50%);width:${Wd * .38}px;height:${bar * .6}px;border-radius:${bar * .3}px;background:#fff;display:flex;align-items:center;justify-content:center;font-family:IS;font-size:${bar * .34}px;color:#888" class="url">seunegocio.pt</div>`);
  const ims = imgs.map((n, i) => { const im = document.createElement('img'); im.src = `img/${n}.jpg`; im.style.cssText = `top:${bar}px;width:${Wd}px;height:${sh}px;opacity:${i ? 0 : 1}`; im.dataset.site = '1'; scr.appendChild(im); return im });
  const ov = mk(scr, `left:0;top:${bar}px;width:${Wd}px;height:${sh}px;z-index:5`); // overlay layer in screen coordinates
  const base = mk(root, `left:${-Wd * .07}px;top:${lidH - 2}px;width:${Wd + 2 * b + Wd * .14}px;height:${baseH}px;border-radius:0 0 ${baseH}px ${baseH}px;background:linear-gradient(180deg,#3b3b3e,#1b1b1d 60%,#0f0f10);box-shadow:0 30px 50px rgba(0,0,0,.5)`, `<div style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:${Wd * .16}px;height:${baseH * .35}px;border-radius:0 0 ${baseH * .3}px ${baseH * .3}px;background:#151517"></div>`);
  return { root, scr, ims, ov, Wd, sh, bar, url: scr.querySelector('.url'), show(t, seq) { /* seq: [[time, index]] crossfades */ let cur = 0, k = 1, prev = 0; for (const [ti, ix] of seq) if (t >= ti) { prev = cur; cur = ix; k = E.io3(P(t, ti, ti + .45)) } ims.forEach((im, i) => im.style.opacity = i === cur ? 1 : i === prev ? (1 - k) : 0); ims[cur].style.zIndex = 2; ims.forEach((im, i) => { if (i !== cur) im.style.zIndex = 1 }) } };
}
function browserCard(par, x, y, Wd, img) { // floating browser window, exact aspect
  const bar = Math.round(Wd * .045), sh = Math.round(Wd * SITE_AR);
  const r = C(par, x, y, Wd, bar + sh, `border-radius:${Wd * .022}px;overflow:hidden;background:#000;box-shadow:0 50px 100px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08)`, '', 'bc');
  mk(r, `left:0;top:0;width:${Wd}px;height:${bar}px;background:#ededeb;display:flex;align-items:center;gap:${bar * .22}px;padding-left:${bar * .45}px`, `<i style="display:block;width:${bar * .28}px;height:${bar * .28}px;border-radius:50%;background:#ff5f57"></i><i style="display:block;width:${bar * .28}px;height:${bar * .28}px;border-radius:50%;background:#febc2e"></i><i style="display:block;width:${bar * .28}px;height:${bar * .28}px;border-radius:50%;background:#28c840"></i>`);
  const im = document.createElement('img'); im.src = `img/${img}.jpg`; im.style.cssText = `top:${bar}px;width:${Wd}px;height:${sh}px`; im.dataset.site = '1'; r.appendChild(im);
  return r;
}
function phone(par, x, y, w) { // native-UI phone (no site screenshots inside)
  const h = Math.round(w * 2.05);
  const p = C(par, x, y, w, h, `border-radius:${w * .16}px;background:#0d0d0d;box-shadow:0 60px 120px rgba(0,0,0,.6),inset 0 0 0 3px #2a2a2a`);
  const s = mk(p, `left:${w * .03}px;top:${w * .03}px;width:${w * .94}px;height:${h - w * .06}px;border-radius:${w * .13}px;overflow:hidden;background:#fff`);
  mk(s, `left:${w * .36}px;top:${w * .03}px;width:${w * .22}px;height:${w * .065}px;border-radius:${w * .04}px;background:#0d0d0d;z-index:9`);
  p.scr = s; p.sw = w * .94; p.sh = h - w * .06; return p;
}

// ---------- yellow band wipe (chapter transitions) ----------
const WIPES = [19.42, 36.84, 83.92];
const band = mk(hud, `left:-760px;top:-400px;width:2600px;height:2720px;background:${Y};transform:translateX(3000px) rotate(-14deg)`);
const band2 = mk(hud, `left:-760px;top:-400px;width:2600px;height:2720px;background:#111;transform:translateX(3000px) rotate(-14deg)`);
mk(band, 'left:1300px;top:1200px;width:300px;height:300px', '');
function wipeU(t) { let x = 3200, x2 = 3200; for (const w of WIPES) if (t > w - .05 && t < w + .75) { x = L(2700, -2700, E.io3(P(t, w, w + .62))); x2 = L(2700, -2700, E.io3(P(t, w + .07, w + .7))) } band2.style.transform = `translateX(${x2.toFixed(1)}px) rotate(-14deg)`; band.style.transform = `translateX(${x.toFixed(1)}px) rotate(-14deg)` }
// band2 sits under band (darker trailing edge)
hud.insertBefore(band2, band);

// ======================= HOOK =======================
{
  const s = S(0, 2.42, 'transparent', { si: 1 }); const e = s.e;
  const a = maskLine(e, 640, 170, '#fff', 'PARA'), b = maskLine(e, 820, 170, '#fff', 'TUDO.');
  const pz = C(e, 540, 1010, 560, 100, `border-radius:50px;background:${Y};display:flex;align-items:center;justify-content:center;gap:16px;font-family:U;font-weight:800;font-size:36px;color:#111`, `<span style="display:flex;gap:7px"><i style="display:block;width:10px;height:34px;background:#111;border-radius:3px"></i><i style="display:block;width:10px;height:34px;background:#111;border-radius:3px"></i></span>PRESTA ATENÇÃO`);
  s.set(t => { lineIn(a, t, .1); lineIn(b, t, .5); pop(pz, t, .96, { r: -3 }); const z = T(t, 0, 2.4, 1, 1.06, E.lin); e.style.transform += ` scale(${z.toFixed(4)})` });
}
{ // melhor oferta · 12 meses · Europa
  const s = S(2.25, 8.75); const e = s.e;
  const ringW = mk(e, 'left:540px;top:760px;width:0;height:0;perspective:1400px');
  const ring = mk(ringW, 'left:0;top:0;width:0;height:0;transform-style:preserve-3d');
  const MON = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const st = MON.map((m, i) => { const g = mk(ring, 'left:-40px;top:-40px;width:80px;height:80px'); const off = mk(g, 'inset:0', starSVG('#2a2a2a', 80)); const on = mk(g, 'inset:0;opacity:0', starSVG(Y, 80)); const lb = mk(g, 'left:-20px;top:84px;width:120px;text-align:center;font-size:15px;color:#666', m, 'mono'); return { g, on, lb } });
  const l1 = maskLine(e, 700, 96, '#fff', 'A MELHOR');
  const l2 = maskLine(e, 810, 110, Y, 'OFERTA');
  const m12 = pill(e, 540, 940, 380, 84, '#fff', '#111', '<span style="font-family:U;font-weight:800;font-size:34px">12 meses</span>');
  const eu = mono(e, 540, 1030, 600, 22, '#bbb', 'aqui na europa');
  s.set(t => {
    ring.style.transform = `rotateX(${T(t, 2.3, 3.4, 70, 58, E.o4).toFixed(2)}deg) rotateZ(${((t - 2.3) * 14).toFixed(2)}deg)`;
    st.forEach((o, i) => { const a = i / 12 * Math.PI * 2; const r = 400 * T(t, 2.3, 3.2, .5, 1, E.o4); o.g.style.transform = `translate(${(Math.cos(a) * r).toFixed(1)}px,${(Math.sin(a) * r).toFixed(1)}px) rotateZ(${(-(t - 2.3) * 14).toFixed(2)}deg) rotateX(-60deg)`; o.g.style.opacity = P(t, 2.35 + i * .03, 2.5 + i * .03); const lit = P(t, 6.78 + i * .06, 6.86 + i * .06); o.on.style.opacity = lit; o.lb.style.color = lit > .5 ? Y : '#555' });
    lineIn(l1, t, 4.3); lineIn(l2, t, 4.72); pop(m12, t, 6.8, { r: -2 }); rise(eu, t, 7.9);
  });
}
// ======================= DIFERENTE =======================
{
  const s = S(8.6, 14.75); const e = s.e;
  const st = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1600px;perspective-origin:540px 760px');
  const plan = (name, price) => card(st, 540, 760, 320, 460, 'background:#161616;border:2px solid #262626;box-shadow:0 30px 60px rgba(0,0,0,.4)', `<div class="mono" style="position:absolute;left:0;right:0;top:40px;text-align:center;font-size:18px;color:#777">${name}</div><div style="position:absolute;left:0;right:0;top:86px;text-align:center;font-family:U;font-weight:700;font-size:54px;color:#555">${price}</div><div class="mono" style="position:absolute;left:0;right:0;top:160px;text-align:center;font-size:15px;color:#555">/ mês + taxas</div>${[0, 1, 2, 3].map(i => `<div style="position:absolute;left:40px;right:40px;top:${230 + i * 46}px;height:12px;border-radius:6px;background:#2a2a2a"></div>`).join('')}`);
  const pls = [plan('básico', '€ ••'), plan('pro', '€ •••'), plan('premium', '€ ••••')];
  const nw = card(st, 540, 760, 440, 580, `background:${Y};box-shadow:0 40px 120px rgba(255,196,0,.3);backface-visibility:hidden`, `<div style="position:absolute;left:0;right:0;top:56px;display:flex;justify-content:center">${sym('#111', 190)}</div><div style="position:absolute;left:0;right:0;top:176px;display:flex;justify-content:center">${wmLetters('#111', 270)}</div><div style="position:absolute;left:40px;right:40px;top:262px;border-top:3px solid #111"></div>${['Site profissional', 'Atendente IA', 'Google Meu Negócio', 'Pagamento único'].map((s, i) => `<div style="position:absolute;left:46px;top:${296 + i * 62}px;display:flex;align-items:center;gap:14px;font-family:IS;font-weight:700;font-size:29px;color:#111">${ICO.check('#111', 32, 8)}${s}</div>`).join('')}`);
  const ex = mono(e, 540, 1150, 900, 24, '#888', 'e não é exagero');
  s.set(t => {
    rise(ex, t, 8.7, 30, { o: 1 - P(t, 9.9, 10.1) });
    const fan = E.o4(P(t, 11.2, 11.9)), dim = E.io3(P(t, 13.4, 14.0));
    pls.forEach((p, i) => { const d = i - 1; set(p, { x: d * (300 * fan) + d * 60 * dim, y: Math.abs(d) * 30 * fan + 40 * dim, r: d * 9 * fan, s: L(.8, .92, fan) * L(1, .85, dim), o: P(t, 11.2 + i * .06, 11.4 + i * .06) * (1 - .55 * dim) }) });
    const fl = E.o4(P(t, 10.5, 11.2));
    set(nw, { ry: L(-180, 0, fl) + 4 * Math.sin(t * 1.3), rx: 3 * Math.sin(t * .9), s: L(.7, 1, fl) * (1 + .03 * dim), y: L(80, -20, fl), o: P(t, 10.5, 10.55) });
    nw.style.zIndex = 5;
  });
}
{ // em pouco mais de um minuto
  const s = S(14.6, 19.85); const e = s.e;
  const big = txt(e, 540, 560, 1000, 230, '#fff', '0:00', 'font-weight:900;font-variant-numeric:tabular-nums');
  const sub = mono(e, 540, 720, 800, 24, Y, 'em pouco mais de um minuto');
  const items = [['site', 'Site profissional'], ['chat', 'Atendente inteligente'], ['pin', 'Google Meu Negócio']].map(([ic, s2], i) => C(e, 540, 900 + i * 128, 820, 108, 'border-radius:30px;background:#151515;border:2px solid #262626;display:flex;align-items:center;gap:24px;padding-left:26px', `<div style="width:64px;height:64px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:28px;color:#111">${i + 1}</div>${ICO[ic]('#fff', 44)}<span style="font-family:IS;font-weight:700;font-size:36px;color:#fff">${s2}</span>`));
  s.set(t => { const sec = Math.min(60, Math.floor(E.io2(P(t, 14.9, 16.4)) * 60)); big.innerHTML = sec >= 60 ? '1:00' : `0:${String(sec).padStart(2, '0')}`; rise(big, t, 14.7, 50); big.style.color = sec >= 60 ? Y : '#fff'; rise(sub, t, 15.0); items.forEach((it, i) => rise(it, t, 17.3 + i * .3, 50, { s: 1 + .03 * ring(t, 17.6 + i * .3, 2, 6) })) });
}
// ======================= HUD =======================
const CHAP = [['Site', 19.6, 37.0], ['Atendente IA', 37.0, 84.1], ['Google', 84.1, 92.0]];
const hb = C(hud, 540, 160, 960, 86);
const segs = CHAP.map(([n], i) => { const g = mk(hb, `left:${i * 324}px;top:0;width:312px;height:86px`); const lb = mk(g, 'left:0;top:0;width:312px;height:40px;display:flex;align-items:center;gap:10px;font-family:IS;font-weight:700;font-size:25px;color:#666', `<span class="n" style="width:32px;height:32px;border-radius:50%;background:#2a2a2a;color:#111;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:15px">${i + 1}</span><span class="t">${n}</span>`); const tr = mk(g, 'left:0;top:56px;width:312px;height:8px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden'); const fi = mk(tr, `left:0;top:0;width:312px;height:8px;background:${Y};transform-origin:0 50%;transform:scaleX(0)`); return { fi, n: lb.querySelector('.n'), t: lb.querySelector('.t') } });
function hudU(t) {
  set(hb, { o: P(t, 19.9, 20.3) * (1 - P(t, 96.9, 97.2)), y: T(t, 19.9, 20.3, -30, 0, E.o4) });
  segs.forEach((g, i) => { const [, a, b] = CHAP[i]; const p = clamp((t - a) / (b - a)); const act = t >= a && t < b; g.fi.style.transform = `scaleX(${p.toFixed(4)})`; g.n.style.background = t >= a ? Y : '#2a2a2a'; g.t.style.color = act ? '#fff' : t >= b ? '#bbb' : '#666'; g.n.style.transform = `scale(${(1 + .3 * ring(t, a, 2.5, 6)).toFixed(3)})` });
}
const chapterCard = (n, l1, l2, a, b) => { const s = S(a, b, 'transparent', { fi: .05, si: 1 }); const e = s.e; const num = txt(e, 540, 640, 700, 300, Y, `0${n}`, 'font-weight:900'); const x1 = maskLine(e, 870, 84, '#fff', l1), x2 = l2 ? maskLine(e, 970, 84, '#fff', l2) : null; s.set(t => { set(num, { s: T(t, a, a + .9, 1.25, 1, E.o4), o: P(t, a, a + .15), b: T(t, a, a + .3, 12, 0) }); lineIn(x1, t, a + .2); if (x2) lineIn(x2, t, a + .32) }); return s };

// ======================= CH1: SITE =======================
chapterCard(1, 'SITE', 'PROFISSIONAL', 19.72, 21.25);
{
  const s = S(21.05, 28.45); const e = s.e;
  const st = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1800px;perspective-origin:540px 700px');
  const lp = laptop(st, 540, 760, 860, ['sos', 'jj']);
  const meas = mk(e, 'left:0;top:0;width:1080px;height:1920px', `<svg width="1080" height="1920" fill="none" stroke="${Y}" stroke-width="4"><path id="m1" d="M90 470 L990 470" pathLength="1" stroke-dasharray="1 1"/><path d="M90 455 V485 M990 455 V485"/><path id="m2" d="M1030 500 L1030 1000" pathLength="1" stroke-dasharray="1 1"/><path d="M1015 500 H1045 M1015 1000 H1045"/></svg>`);
  const m1 = meas.querySelector('#m1'), m2 = meas.querySelector('#m2');
  const ml = pill(e, 540, 470, 260, 56, Y, '#111', '<span class="mono" style="font-size:18px;letter-spacing:.18em">sob medida</span>');
  const SV = [['site', 'Serviços'], ['box', 'Produtos'], ['star', 'Portfólio']];
  const chips = SV.map(([ic, n], i) => pill(e, 210 + i * 330, 1130, 300, 92, '#fff', '#111', `${ic === 'star' ? starSVG(Y, 34, '#111') : ICO[ic]('#111', 36)}${n}`, 'box-shadow:0 26px 60px rgba(0,0,0,.5);font-size:32px'));
  // showcase carousel (vitrine) — browser cards with exact aspect
  const car = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1600px;perspective-origin:540px 760px');
  const CS = ['sos', 'alfa', 'jj', 'kz', 'fabio'];
  const cards = CS.map(n => browserCard(car, 540, 760, 620, n));
  const vit = pill(e, 540, 1180, 480, 76, '#111', Y, '<span class="mono" style="font-size:21px;letter-spacing:.2em">vitrine de alto padrão</span>', 'border:2px solid #2a2a2a');
  s.set(t => {
    const toCar = E.io3(P(t, 26.45, 27.0));
    set(lp.root, { ry: T(t, 21.1, 22.2, -28, -6, E.o4) + 3 * Math.sin(t * .8), rx: 8, y: T(t, 21.1, 22.0, 120, 0, E.o4) - toCar * 200, s: T(t, 21.1, 22.0, .8, 1, E.o4) * L(1, .7, toCar), o: P(t, 21.1, 21.3) * (1 - toCar) });
    lp.show(t, [[0, 0], [23.4, 1]]);
    m1.style.strokeDashoffset = (1 - E.io3(P(t, 22.3, 22.9))).toFixed(3); m2.style.strokeDashoffset = (1 - E.io3(P(t, 22.45, 23.05))).toFixed(3);
    meas.style.opacity = 1 - P(t, 23.4, 23.7); pop(ml, t, 22.3, { o: 1 - P(t, 23.4, 23.7) });
    chips.forEach((c, i) => rise(c, t, 24.55 + i * .2, 70, { o: 1 - toCar, r: (i - 1) * 3 }));
    // carousel: cards orbit horizontally in 3D
    cards.forEach((c, i) => { const ph = (i - 2) - (t - 27.0) * .55; const x = ph * 270, z = -Math.abs(ph) * 380; set(c, { x, z, ry: -clamp(ph, -1.2, 1.2) * 32, o: toCar * clamp((1.4 - Math.abs(ph)) * 2.5) }); c.style.zIndex = 10 - Math.round(Math.abs(ph) * 2) });
    rise(vit, t, 26.9, 30);
  });
}
{ // nada de site genérico → empresa grande + confiança
  const s = S(28.3, 36.9); const e = s.e;
  const st = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1800px;perspective-origin:540px 700px');
  const lp = laptop(st, 540, 760, 860, ['kz', 'alfa']);
  const gen = mk(lp.ov, `inset:0;background:#e6e6e3`, `<div style="position:absolute;left:30px;top:22px;width:120px;height:34px;border:3px dashed #aaa;border-radius:8px;display:flex;align-items:center;justify-content:center" class="mono"><span style="font-size:12px;color:#999">your logo</span></div><div style="position:absolute;left:30px;top:100px;font-family:serif;font-size:50px;color:#9a9a96">Lorem ipsum</div><div style="position:absolute;left:30px;top:166px;font-family:serif;font-size:24px;color:#aaa">dolor sit amet, consectetur</div><div style="position:absolute;left:30px;top:226px;width:160px;height:48px;border-radius:6px;background:#bdbdb9"></div><div style="position:absolute;left:470px;top:70px;width:340px;height:280px;background:#d4d4d0;display:flex;align-items:center;justify-content:center" class="mono"><span style="font-size:14px;color:#999">image 800×600</span></div><div class="mono" style="position:absolute;right:16px;bottom:12px;font-size:13px;color:#aaa">template #47</div>`);
  const x = C(e, 540, 740, 330, 330, `border-radius:50%;background:${Y};box-shadow:0 30px 70px rgba(0,0,0,.5)`, `<svg width="330" height="330" viewBox="0 0 300 300"><path id="x1" d="M80 80 L220 220" stroke="#111" stroke-width="30" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><path id="x2" d="M220 80 L80 220" stroke="#111" stroke-width="30" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
  const lab = pill(e, 540, 1110, 460, 76, '#1b1b1b', '#999', '<span class="mono" style="font-size:21px;letter-spacing:.2em;text-decoration:line-through">modelo pronto</span>');
  const big = maskLine(e, 380, 72, '#fff', 'EMPRESA&nbsp;<span style="color:' + Y + '">GRANDE</span>');
  const trust = [[`<div style="display:flex;gap:4px">${[0, 1, 2, 3, 4].map(() => starSVG(Y, 30, '#111')).join('')}</div><span>4,9</span>`, 260, 1130, 34.4], [`<svg width="34" height="34" viewBox="0 0 34 34"><path d="M17 3 L29 8 V17 C29 24 23 29 17 31 C11 29 5 24 5 17 V8Z" fill="${Y}" stroke="#111" stroke-width="3"/><path d="M11 17 L15 21 L23 12" stroke="#111" stroke-width="3.4" fill="none" stroke-linecap="round"/></svg>confiança`, 820, 1130, 34.7]].map(([h, xx, yy, st2]) => ({ el: pill(e, xx, yy, 340, 88, '#fff', '#111', h, 'box-shadow:0 20px 50px rgba(0,0,0,.4);font-size:31px'), st: st2 }));
  const sec = C(e, 540, 1250, 400, 92, `border-radius:46px;background:${Y};display:flex;align-items:center;justify-content:center;gap:14px;font-family:U;font-weight:800;font-size:38px;color:#111`, `<svg width="40" height="44" viewBox="0 0 44 50"><circle cx="22" cy="28" r="18" stroke="#111" stroke-width="5" fill="none"/><path d="M22 28 L22 18" stroke="#111" stroke-width="5" stroke-linecap="round"/><rect x="16" y="2" width="12" height="6" rx="2" fill="#111"/></svg>1º segundo`);
  s.set(t => {
    set(lp.root, { ry: 6 * Math.sin(t * .6), rx: 8, y: T(t, 28.35, 29, 80, 0, E.o4) + T(t, 31.5, 32.2, 0, 40, E.io3), s: T(t, 28.35, 29, .9, 1, E.o4) });
    lp.show(t, [[0, 0], [34.0, 1]]);
    const real = E.io3(P(t, 31.55, 32.25)); gen.style.clipPath = `inset(0 0 0 ${(real * 100).toFixed(2)}%)`;
    gen.style.filter = `grayscale(1) brightness(${(1 - .2 * P(t, 29.3, 29.7)).toFixed(3)})`;
    const xo = 1 - P(t, 31.3, 31.55);
    set(x, { s: E.back(P(t, 29.25, 29.6)) * L(1, .5, P(t, 31.3, 31.55)), o: P(t, 29.25, 29.32) * xo, r: -8 });
    x.querySelector('#x1').style.strokeDashoffset = (1 - E.o3(P(t, 29.4, 29.65))).toFixed(3); x.querySelector('#x2').style.strokeDashoffset = (1 - E.o3(P(t, 29.6, 29.85))).toFixed(3);
    rise(lab, t, 30.6, 30, { o: 1 - P(t, 31.3, 31.5) });
    lineIn(big, t, 32.9);
    trust.forEach(({ el, st: s2 }) => pop(el, t, s2));
    pop(sec, t, 35.62, { s: 1 + .05 * ring(t, 35.9, 3, 7) });
  });
}
// ======================= CH2: ATENDENTE =======================
chapterCard(2, 'ATENDENTE', 'INTELIGENTE', 37.14, 40.15);
{ // laptop with chat widget; cursor clicks; chat opens
  const s = S(39.95, 49.55); const e = s.e;
  const st = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1800px;perspective-origin:540px 700px');
  const lp = laptop(st, 540, 760, 860, ['fabio']);
  const W0 = lp.Wd, H0 = lp.sh;
  const dimL = mk(lp.ov, 'inset:0;background:rgba(0,0,0,.35);opacity:0');
  const btn = mk(lp.ov, `right:16px;bottom:16px;width:58px;height:58px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(0,0,0,.45)`, ICO.chat('#111', 32));
  const rg = mk(lp.ov, `right:16px;bottom:16px;width:58px;height:58px;border-radius:50%;border:3px solid ${Y}`);
  const pnl = mk(lp.ov, 'right:16px;bottom:86px;width:290px;height:300px;border-radius:18px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.45);overflow:hidden;transform-origin:100% 100%', `
    <div style="position:absolute;left:0;right:0;top:0;height:64px;background:#111;display:flex;align-items:center;gap:12px;padding-left:14px"><div style="width:40px;height:40px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 26)}</div><div><div style="font-family:IS;font-weight:700;font-size:17px;color:#fff">Assistente IA</div><div class="mono" style="font-size:10px;color:#9a9a9a;margin-top:2px">online · 24h</div></div></div>
    <div style="position:absolute;left:12px;top:78px;max-width:220px;padding:10px 14px;border-radius:16px 16px 16px 4px;background:#f0efeb;font-family:IS;font-size:15px;color:#111">Olá! Como posso ajudar?</div>
    <div style="position:absolute;left:12px;right:12px;bottom:12px;height:44px;border-radius:22px;background:#f2f2ef;display:flex;align-items:center;padding-left:14px"><span class="tq is" style="font-size:14px;color:#111;white-space:pre"></span><i class="cr" style="display:block;width:2px;height:18px;background:#111;margin-left:2px"></i></div>`);
  const tq = pnl.querySelector('.tq'), cr = pnl.querySelector('.cr');
  const cur = C(e, 0, 0, 46, 60, '', CURSOR(46, '#fff', '#111'));
  const tag = pill(e, 540, 1180, 600, 84, '#151515', '#fff', `${sparkSVG(Y, 30)}trabalhando para você`, 'border:2px solid #2a2a2a;font-size:32px');
  const QT = 'Quanto custa?';
  s.set(t => {
    const push = E.io3(P(t, 44.5, 45.5)), zin = E.i3(P(t, 49.0, 49.55));
    set(lp.root, { ry: L(-14, 0, push) + 2 * Math.sin(t * .7), rx: L(8, 0, push), y: T(t, 40.0, 40.7, 90, 0, E.o4) + L(0, 60, push) + zin * 260, s: T(t, 40.0, 40.7, .9, 1, E.o4) * L(1, 1.04, push) * L(1, 2.6, zin), o: P(t, 40.0, 40.2) });
    btn.style.transform = `scale(${(E.back(P(t, 41.0, 41.4)) * (1 - .15 * Math.sin(Math.PI * P(t, 47.2, 47.38)))).toFixed(3)})`;
    const rp = ((t - 41.4) % 1.2) / 1.2; rg.style.opacity = t > 41.4 && t < 47.2 ? (1 - rp) * .8 : 0; rg.style.transform = `scale(${(1 + rp * .9).toFixed(3)})`;
    const op = E.back(P(t, 47.3, 47.75)); pnl.style.transform = `scale(${op.toFixed(3)})`; pnl.style.opacity = P(t, 47.3, 47.36);
    dimL.style.opacity = .9 * P(t, 47.3, 47.6);
    tq.textContent = QT.slice(0, Math.floor(P(t, 48.3, 49.0) * QT.length)); cr.style.opacity = Math.floor(t * 3) % 2 ? 0 : 1;
    rise(tag, t, 42.6, 40, { o: 1 - P(t, 44.4, 44.7) });
    // cursor: enters on "seu cliente entra no site", clicks the button on "aperta um botão"
    const k = E.io3(P(t, 45.6, 47.1));
    const lap = lp.root.getBoundingClientRect(); const br = btn.getBoundingClientRect();
    const tx = br.left + br.width / 2 - 10, ty = br.top + br.height / 2 - 6;
    set(cur, { x: L(980, tx, k), y: L(1350, ty, k), s: 1 - .2 * Math.sin(Math.PI * P(t, 47.18, 47.36)), o: P(t, 45.6, 45.7) * (1 - P(t, 47.9, 48.1)) });
  });
}
{ // the conversation: questions orbit, answers in real time
  const s = S(49.4, 59.75, 'transparent', { si: 1.2 }); const e = s.e;
  const ch = C(e, 540, 700, 740, 900, 'border-radius:44px;background:#fff;box-shadow:0 60px 120px rgba(0,0,0,.6);overflow:hidden', `
    <div style="position:absolute;left:0;right:0;top:0;height:126px;background:#111;display:flex;align-items:center;gap:20px;padding-left:30px"><div style="width:76px;height:76px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 48)}</div><div><div style="font-family:IS;font-weight:700;font-size:32px;color:#fff">Assistente IA</div><div class="mono" style="font-size:15px;color:#9a9a9a;margin-top:6px">responde na hora · dados da sua empresa</div></div></div>`);
  const area = mk(ch, 'left:0;top:126px;width:740px;height:774px');
  const MS = [['Quanto custa?', 'r', 49.7], ['Como funciona?', 'r', 50.7], ['Qual o horário?', 'r', 51.7], ['Onde fica?', 'r', 52.78], ['Qual o prazo?', 'r', 53.58]];
  const qb = MS.map(([q, , ti], i) => ({ el: mk(area, `right:30px;top:${30 + i * 92}px;padding:16px 26px;border-radius:30px 30px 8px 30px;background:${Y};font-family:IS;font-weight:700;font-size:30px;color:#111;transform-origin:100% 100%`, q), ti }));
  const typing = mk(area, 'left:30px;top:500px;padding:22px 28px;border-radius:30px 30px 30px 8px;background:#f0efeb;display:flex;gap:10px', '<i class="d" style="display:block;width:14px;height:14px;border-radius:50%;background:#999"></i><i class="d" style="display:block;width:14px;height:14px;border-radius:50%;background:#999"></i><i class="d" style="display:block;width:14px;height:14px;border-radius:50%;background:#999"></i>');
  const ans = mk(area, 'left:30px;top:500px;width:580px;padding:24px 28px;border-radius:30px 30px 30px 8px;background:#f0efeb;font-family:IS;font-size:27px;line-height:1.4;color:#111;transform-origin:0 0', `<b>Respondo tudo agora:</b><br>• Valor: a partir do orçamento<br>• Horário: seg–sáb, 9h–19h<br>• Local: centro da cidade<br>• Prazo: início esta semana`);
  const AL = [...Array(4)].map((_, i) => i);
  const badges = [['0,8 s', 'resposta', 190, 1250, 55.8], ['dados da', 'sua empresa', 540, 1250, 56.6], ['como um', 'atendente real', 890, 1250, 58.1]].map(([a, b, x, y, st]) => ({ el: C(e, x, y, 320, 108, `border-radius:28px;background:#111;border:2px solid #2a2a2a;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 26px 60px rgba(0,0,0,.5)`, `<div style="font-family:U;font-weight:800;font-size:32px;color:${Y}">${a}</div><div class="mono" style="font-size:15px;color:#bbb;margin-top:4px">${b}</div>`), st }));
  s.set(t => {
    set(ch, { y: T(t, 49.4, 50.0, 80, 0, E.o4) + 5 * Math.sin(t * 1.2) });
    qb.forEach(({ el, ti }) => { el.style.transform = `scale(${L(.4, 1, E.back(P(t, ti, ti + .32))).toFixed(3)})`; el.style.opacity = P(t, ti, ti + .08) });
    typing.style.opacity = P(t, 54.4, 54.5) * (1 - P(t, 55.0, 55.1)); typing.querySelectorAll('.d').forEach((d, j) => d.style.transform = `translateY(${(-7 * Math.max(0, Math.sin((t * 7 - j * .5) * Math.PI))).toFixed(2)}px)`);
    ans.style.transform = `scale(${L(.5, 1, E.back(P(t, 55.05, 55.45))).toFixed(3)})`; ans.style.opacity = P(t, 55.05, 55.12);
    badges.forEach(({ el, st }, i) => pop(el, t, st, { r: i % 2 ? 3 : -3 }));
  });
}
{ // pronto -> WhatsApp (phone with native UI)
  const s = S(59.6, 72.2); const e = s.e;
  const ph = phone(e, 540, 740, 470); const sc = ph.scr, SW = ph.sw, SH = ph.sh;
  const chat = mk(sc, 'inset:0;background:#fff', `<div style="position:absolute;left:0;right:0;top:0;height:150px;background:#111;display:flex;align-items:flex-end;gap:14px;padding:0 0 22px 24px"><div style="width:58px;height:58px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 36)}</div><div><div style="font-family:IS;font-weight:700;font-size:24px;color:#fff">Assistente IA</div><div class="mono" style="font-size:11px;color:#999;margin-top:4px">online</div></div></div>
     <div style="position:absolute;right:20px;top:190px;max-width:300px;padding:14px 20px;border-radius:24px 24px 6px 24px;background:${Y};font-family:IS;font-weight:600;font-size:22px;color:#111">Perfeito, quero fechar!</div>
     <div style="position:absolute;left:20px;top:280px;max-width:330px;padding:14px 20px;border-radius:24px 24px 24px 6px;background:#f0efeb;font-family:IS;font-size:22px;line-height:1.3;color:#111">Ótimo! Vou te passar para o WhatsApp da empresa.</div>`);
  const wb = mk(chat, 'left:20px;top:420px;width:380px;height:76px;border-radius:38px;background:#111;display:flex;align-items:center;justify-content:center;gap:12px;font-family:IS;font-weight:700;font-size:23px;color:#fff;transform-origin:0 50%', `${ICO.wa(42)}Continuar no WhatsApp`);
  const tap = mk(chat, 'left:20px;top:420px;width:380px;height:76px;border-radius:38px;background:rgba(255,255,255,.45)');
  const wa = mk(sc, 'inset:0;background:#0f0f0f', `<div style="position:absolute;left:0;right:0;top:0;height:150px;background:#1a1a1a;display:flex;align-items:flex-end;gap:14px;padding:0 0 22px 24px">${ICO.wa(54)}<div><div style="font-family:IS;font-weight:700;font-size:24px;color:#fff">Sua empresa</div><div class="mono" style="font-size:11px;color:#888;margin-top:4px">whatsapp</div></div></div><div style="position:absolute;left:0;right:0;top:150px;bottom:0;background-image:radial-gradient(#1c1c1c 1.5px,transparent 1.5px);background-size:24px 24px"></div>`);
  const lead = mk(wa, `left:18px;top:180px;width:${SW - 36}px;padding:20px 22px;border-radius:24px 24px 24px 6px;background:#fff;transform-origin:0 0`, `<div style="display:inline-flex;padding:6px 14px;border-radius:16px;background:${Y};font-family:U;font-weight:700;font-size:15px;color:#111">✓ cliente qualificado</div><div style="font-family:IS;font-weight:700;font-size:25px;color:#111;margin-top:12px">Olá! Já vi valores e prazo. Quero fechar.</div><div class="mono" style="font-size:12px;color:#888;margin-top:10px">via assistente do site</div>`);
  const CK = [['dúvidas respondidas', 68.15], ['mais qualificado', 69.3]];
  const cks = CK.map(([s2], i) => C(e, 540, 1110 + i * 0, 760, 84, 'border-radius:42px;background:#151515;border:2px solid #262626;display:flex;align-items:center;gap:18px;padding-left:24px;font-family:IS;font-weight:700;font-size:32px;color:#fff', `<div style="width:50px;height:50px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${ICO.check('#111', 34, 8)}</div>${s2}`));
  const close = C(e, 540, 1240, 760, 104, 'border-radius:30px;background:#151515;border:2px solid #262626', `<div style="position:absolute;left:28px;top:14px;font-family:IS;font-weight:700;font-size:28px;color:#fff">perto de fechar</div><div class="pc" style="position:absolute;right:28px;top:14px;font-family:U;font-weight:800;font-size:28px;color:${Y}">0%</div><div style="position:absolute;left:28px;right:28px;top:64px;height:16px;border-radius:8px;background:#2a2a2a;overflow:hidden"><div class="f" style="position:absolute;inset:0;background:${Y};transform-origin:0 50%;transform:scaleX(0)"></div></div>`);
  s.set(t => {
    const side = E.io3(P(t, 66.6, 67.3));
    set(ph, { y: T(t, 59.65, 60.3, 100, 0, E.o4) - side * 140, s: T(t, 59.65, 60.3, .9, 1, E.o4) * L(1, .78, side), r: T(t, 59.65, 60.4, 6, 0, E.o4) });
    wb.style.transform = `scale(${E.back(P(t, 61.1, 61.5)).toFixed(3)})`; wb.style.opacity = P(t, 61.1, 61.16);
    const tp = P(t, 62.6, 63.1); tap.style.opacity = t > 62.6 ? 1 - tp : 0;
    wa.style.transform = `translateX(${((1 - E.io3(P(t, 63.3, 63.9))) * (SW + 10)).toFixed(1)}px)`;
    lead.style.transform = `scale(${L(.4, 1, E.back(P(t, 64.1, 64.5))).toFixed(3)})`; lead.style.opacity = P(t, 64.1, 64.18);
    cks.forEach((c, i) => rise(c, t, CK[i][1], 40, { y: -(1 - i) * 0 + (i ? 0 : -120) - 20, o: 1 }));
    set(cks[0], { y: -60 + 40 * (1 - E.o4(P(t, 68.15, 68.7))), o: P(t, 68.15, 68.3) }); set(cks[1], { y: 40 + 40 * (1 - E.o4(P(t, 69.3, 69.85))), o: P(t, 69.3, 69.45) });
    rise(close, t, 70.3, 40, { y: 90 }); const p = E.io3(P(t, 70.6, 71.6)) * .92; close.querySelector('.f').style.transform = `scaleX(${p.toFixed(3)})`; close.querySelector('.pc').textContent = Math.round(p * 100) + '%';
  });
}
{ // a mesma pergunta o dia inteiro
  const s = S(72.05, 75.65); const e = s.e;
  const qs = Array.from({ length: 10 }, (_, i) => pill(e, 540 + ((i * 173) % 420) - 210, 360 + i * 86, 330, 76, '#fff', '#111', 'Quanto custa?', 'box-shadow:0 18px 40px rgba(0,0,0,.45);font-size:28px'));
  const clk = mono(e, 540, 1290, 800, 22, '#888', '08:00 · 11:00 · 14:00 · 17:00 · 21:00');
  s.set(t => { const cut = E.io3(P(t, 74.6, 75.0)); qs.forEach((q, i) => pop(q, t, 72.4 + i * .2, { r: (i % 2 ? 3 : -3), x: cut * (i % 2 ? 900 : -900), o: 1 })); rise(clk, t, 72.8, 30, { o: 1 - cut }) });
}
{ // curioso
  const s = S(75.5, 77.6); const e = s.e;
  const hg = C(e, 540, 680, 230, 310, '', `<svg width="230" height="310" viewBox="0 0 220 300" fill="none" stroke="#fff" stroke-width="12" stroke-linejoin="round"><path d="M40 20 H180 M40 280 H180 M55 20 C55 110 165 110 165 150 C165 190 55 190 55 280 M165 20 C165 110 55 110 55 150 C55 190 165 190 165 280"/><path d="M80 250 Q110 215 140 250Z" fill="${Y}" stroke="none"/></svg>`);
  const cur = pill(e, 540, 1030, 580, 100, '#151515', '#888', `${ICO.person('#888', 42)}<span style="text-decoration:line-through">tempo com curiosos</span>`, 'border:2px solid #2a2a2a;font-size:34px');
  s.set(t => { set(hg, { r: E.io3(P(t, 75.8, 76.4)) * 180, s: E.back(P(t, 75.55, 75.95)), o: P(t, 75.55, 75.65) }); pop(cur, t, 76.6) });
}
{ // só com quem quer comprar
  const s = S(77.45, 81.05); const e = s.e;
  const av = Array.from({ length: 12 }, (_, i) => C(e, 270 + (i % 4) * 180, 500 + Math.floor(i / 4) * 200, 140, 140, 'border-radius:50%;background:#1d1d1d;display:flex;align-items:center;justify-content:center', ICO.person('#555', 76)));
  const BUY = [5, 10];
  const tag = pill(e, 540, 1170, 560, 92, Y, '#111', '<span style="font-family:U;font-weight:800;font-size:36px">quer comprar</span>');
  s.set(t => { av.forEach((a, i) => { pop(a, t, 77.6 + i * .04); const buy = BUY.includes(i); const k = P(t, 79.5, 79.9); a.style.background = buy && k > 0 ? Y : '#1d1d1d'; a.style.opacity = (parseFloat(a.style.opacity) * (buy ? 1 : 1 - .75 * k)).toFixed(3); a.style.transform += buy ? ` scale(${(1 + .15 * k).toFixed(3)})` : ''; if (buy) a.innerHTML = ICO.person(k > 0 ? '#111' : '#555', 76) }); pop(tag, t, 80.1) });
}
{ // o próprio site faz o atendimento
  const s = S(80.9, 84.2); const e = s.e;
  const st = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1800px;perspective-origin:540px 700px');
  const lp = laptop(st, 540, 760, 860, ['jj']);
  const w = mk(lp.ov, `right:16px;bottom:16px;width:58px;height:58px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(0,0,0,.45)`, ICO.chat('#111', 32));
  const bb = mk(lp.ov, 'right:84px;bottom:30px;padding:10px 16px;border-radius:16px 16px 4px 16px;background:#fff;font-family:IS;font-weight:600;font-size:15px;color:#111;box-shadow:0 8px 22px rgba(0,0,0,.35)', 'Respondido ✓');
  const badge = pill(e, 540, 1160, 640, 100, '#fff', '#111', `${sparkSVG(Y, 36)}<span style="font-family:U;font-weight:800;font-size:33px">atendimento 24h</span>`, 'box-shadow:0 26px 60px rgba(0,0,0,.5)');
  s.set(t => { set(lp.root, { ry: T(t, 80.95, 82, 20, 4, E.o4), rx: 8, y: T(t, 80.95, 81.6, 80, 0, E.o4) }); bb.style.opacity = P(t, 81.8, 81.9); bb.style.transform = `scale(${E.back(P(t, 81.8, 82.1)).toFixed(3)})`; pop(badge, t, 82.4) });
}
// ======================= CH3: GOOGLE =======================
chapterCard(3, 'GOOGLE', 'MEU NEGÓCIO', 84.22, 85.7);
{
  const s = S(85.5, 92.05); const e = s.e;
  const bar = C(e, 540, 400, 900, 120, 'border-radius:60px;background:#fff;box-shadow:0 22px 60px rgba(0,0,0,.4);display:flex;align-items:center;padding-left:40px;gap:22px', `<svg width="42" height="42" viewBox="0 0 44 44"><circle cx="18" cy="18" r="13" stroke="#111" stroke-width="5" fill="none"/><path d="M28 28 L40 40" stroke="#111" stroke-width="5.5" stroke-linecap="round"/></svg><span class="q is" style="font-size:38px;font-weight:500;color:#111;white-space:pre"></span><i class="c" style="display:block;width:3px;height:44px;background:${Y};margin-left:-16px"></i>`);
  const q = bar.querySelector('.q'), cr = bar.querySelector('.c'); const QT = 'remodelações perto de mim';
  const cd = card(e, 540, 840, 900, 560, '', `<div style="position:absolute;left:0;top:0;width:900px;height:250px;background:#E9E9E4"><svg width="900" height="250"><rect x="80" y="60" width="200" height="70" rx="10" fill="#dcdcd5"/><rect x="560" y="140" width="220" height="80" rx="10" fill="#dcdcd5"/><path d="M0 160 L900 140 M380 0 L420 250 M0 60 L900 40" stroke="#fff" stroke-width="18"/></svg></div>
     <div style="position:absolute;left:46px;top:280px;font-family:U;font-weight:600;font-size:42px;color:#111">Sua Empresa</div>
     <div style="position:absolute;left:46px;top:346px;display:flex;align-items:center;gap:8px"><span class="is" style="font-size:28px;font-weight:700;color:#111;margin-right:6px">4,9</span>${[0, 1, 2, 3, 4].map(() => starSVG(Y, 30, '#111')).join('')}</div>
     <div class="is" style="position:absolute;left:46px;top:400px;font-size:26px;color:#3b3b38;font-weight:500"><b style="color:#111">Aberto agora</b> · perto de você</div>
     <div style="position:absolute;left:46px;top:462px;display:flex;gap:16px"><div style="width:160px;height:66px;border-radius:33px;background:#f1f1ee;font-family:IS;font-weight:700;font-size:25px;display:flex;align-items:center;justify-content:center">Ligar</div><div style="width:160px;height:66px;border-radius:33px;background:#f1f1ee;font-family:IS;font-weight:700;font-size:25px;display:flex;align-items:center;justify-content:center">Rotas</div><div style="width:160px;height:66px;border-radius:33px;background:${Y};font-family:IS;font-weight:700;font-size:25px;display:flex;align-items:center;justify-content:center">Site</div></div>`);
  const pin = C(e, 560, 620, 70, 92, '', `<svg width="70" height="92" viewBox="0 0 70 92"><path d="M35 90 C35 90 4 54 4 34 A31 31 0 1 1 66 34 C66 54 35 90 35 90Z" fill="${Y}" stroke="#111" stroke-width="5"/><circle cx="35" cy="34" r="11" fill="#111"/></svg>`);
  const cur = C(e, 0, 0, 56, 73, '', CURSOR(56, '#fff', '#111'));
  const st = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1800px;perspective-origin:540px 700px');
  const lp = laptop(st, 540, 800, 860, ['sos']);
  s.set(t => {
    rise(bar, t, 85.6, 40); q.textContent = QT.slice(0, Math.floor(P(t, 87.3, 88.5) * QT.length)); cr.style.opacity = Math.floor(t * 3) % 2 ? 0 : 1;
    rise(cd, t, 88.6, 90, { o: 1 - P(t, 91.0, 91.2) });
    set(pin, { y: (1 - E.i3(P(t, 89.1, 89.35))) * -200, o: P(t, 89.1, 89.14) * (1 - P(t, 91.0, 91.2)), s: 1 + .12 * ring(t, 89.35, 2.6, 8) });
    const k = E.o4(P(t, 89.9, 90.45)); set(cur, { x: L(1000, 455, k), y: L(1400, 1140, k), s: 1 - .15 * Math.sin(Math.PI * P(t, 90.5, 90.66)), o: P(t, 89.9, 89.96) * (1 - P(t, 90.9, 91.0)) });
    const lk = E.o4(P(t, 90.75, 91.4)); set(lp.root, { s: L(.3, 1, lk), y: L(300, 0, lk), rx: 8, ry: L(-30, -4, lk), o: P(t, 90.75, 90.85) });
  });
}
// ======================= RECAP + PRICE =======================
{
  const s = S(91.9, 97.35); const e = s.e;
  const T3 = [['site', 'Site profissional', 92.06], ['chat', 'Atendente IA no site', 93.4], ['pin', 'Google Meu Negócio', 95.7]];
  const tiles = T3.map(([ic, n], i) => C(e, 540, 470 + i * 190, 880, 160, 'border-radius:36px;background:#fff;box-shadow:0 30px 70px rgba(0,0,0,.45);display:flex;align-items:center;gap:28px;padding-left:34px', `<div style="width:96px;height:96px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center">${ICO[ic](Y, 54)}</div><span style="font-family:U;font-weight:700;font-size:38px;color:#111;letter-spacing:-.02em">${n}</span><div style="position:absolute;right:34px;width:64px;height:64px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${ICO.check('#111', 42, 8)}</div>`));
  const box = C(e, 540, 660, 300, 300, 'border-radius:50%;background:#111;border:4px solid ' + Y + ';display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 18px rgba(255,196,0,.12)', ICO.box(Y, 160));
  const lb = maskLine(e, 900, 70, '#fff', 'UM PACOTE SÓ');
  s.set(t => { const m = E.io3(P(t, 97.0, 97.3)); tiles.forEach((tl, i) => { const st = T3[i][2]; const k = E.o4(P(t, st, st + .5)); set(tl, { x: (1 - k) * 300 * (i % 2 ? -1 : 1), y: m * (660 - (470 + i * 190)), s: L(1, .3, m), o: P(t, st, st + .15) * (1 - P(t, 97.15, 97.3)), r: (1 - k) * 4 }) }); set(box, { s: E.back(P(t, 97.2, 97.5)), o: P(t, 97.2, 97.26) }); lineIn(lb, t, 97.3) });
}
{
  const s = S(97.3, 101.15, Y, { si: 1.12 }); const e = s.e;
  mk(e, 'inset:0;background:radial-gradient(ellipse 70% 45% at 50% 40%,rgba(255,255,255,.4),rgba(255,255,255,0) 70%)');
  const pk = txt(e, 540, 420, 1000, 70, '#111', 'TUDO NUM PACOTE SÓ');
  const ap = mono(e, 540, 590, 600, 30, '#4d3b00', 'a partir de');
  const pr = txt(e, 540, 790, 1080, 270, '#111', '€249', 'font-weight:900');
  const sub = pill(e, 540, 1040, 520, 88, '#111', Y, '<span class="mono" style="font-size:22px;letter-spacing:.2em">tudo incluído</span>');
  s.set(t => { rise(pk, t, 97.4); rise(ap, t, 98.6); const n = Math.round(249 * E.o3(P(t, 99.2, 100.1))); pr.innerHTML = `<span style="font-size:.5em;margin-right:14px;vertical-align:.55em">€</span>${n}`; set(pr, { s: T(t, 99.2, 99.6, .7, 1, E.back) * (1 + .04 * ring(t, 100.15, 3, 7)), o: P(t, 99.2, 99.3) }); pop(sub, t, 100.3) });
}
// ======================= PAGAMENTO ÚNICO =======================
{
  const s = S(101.0, 110.05); const e = s.e;
  const spot = C(e, 540, 760, 1100, 1100, 'border-radius:50%;background:radial-gradient(closest-side,rgba(255,196,0,.22),rgba(255,196,0,0))');
  const at = C(e, 540, 470, 150, 150, `border-radius:50%;border:8px solid ${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:900;font-size:90px;color:${Y}`, '!');
  const dif = maskLine(e, 640, 70, '#fff', 'DIFERENTE DE TUDO');
  const stamp = C(e, 540, 820, 800, 200, `border:10px solid #111;border-radius:28px;background:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:900;font-size:80px;color:#111;letter-spacing:-.035em;box-shadow:0 30px 70px rgba(0,0,0,.5)`, 'PAGAMENTO ÚNICO');
  const pay = card(e, 540, 1110, 680, 190, 'background:#151515;border:2px solid #262626;box-shadow:none', `<div style="position:absolute;left:36px;top:46px;width:120px;height:80px;border-radius:12px;background:linear-gradient(135deg,#333,#1c1c1c);border:2px solid #444"><div style="position:absolute;left:14px;top:22px;width:30px;height:22px;border-radius:4px;background:${Y}"></div></div><div style="position:absolute;left:190px;top:40px;font-family:U;font-weight:800;font-size:46px;color:#fff">1x</div><div class="mono" style="position:absolute;left:192px;top:104px;font-size:18px;color:#888">pagas uma vez</div><div class="ok" style="position:absolute;right:36px;top:44px;height:100px;padding:0 28px;border-radius:50px;background:${Y};display:flex;align-items:center;gap:10px;font-family:IS;font-weight:800;font-size:31px;color:#111;transform:scale(0)">${ICO.check('#111', 34, 8)}pronto</div>`);
  s.set(t => { spot.style.opacity = P(t, 101.2, 101.8); pop(at, t, 101.3); lineIn(dif, t, 104.9, 106.1); set(stamp, { s: T(t, 106.3, 106.5, 2.4, 1, E.o4), r: -4, o: P(t, 106.3, 106.38), b: T(t, 106.3, 106.44, 12, 0) }); rise(pay, t, 107.95, 50); pay.querySelector('.ok').style.transform = `scale(${E.back(P(t, 109.45, 109.8)).toFixed(3)})` });
}
{
  const s = S(109.9, 115.4); const e = s.e;
  const R3 = [['Mensalidade', 110.75], ['Taxa de manutenção', 112.45], ['Surpresa no fim do mês', 114.4]];
  const rows = R3.map(([n], i) => C(e, 540, 560 + i * 175, 880, 140, 'border-radius:34px;background:#151515;border:2px solid #262626', `<div style="position:absolute;left:34px;top:0;height:140px;display:flex;align-items:center;font-family:U;font-weight:700;font-size:38px;color:#fff;letter-spacing:-.02em">${n}</div><div class="st" style="position:absolute;left:28px;right:150px;top:68px;height:6px;border-radius:3px;background:${Y};transform-origin:0 50%;transform:scaleX(0)"></div><div class="x" style="position:absolute;right:30px;top:30px;width:80px;height:80px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;transform:scale(0)"><svg width="36" height="36"><path d="M6 6 L30 30 M30 6 L6 30" stroke="#111" stroke-width="7" stroke-linecap="round"/></svg></div>`));
  const nt = maskLine(e, 1130, 64, Y, 'NÃO TEM.');
  s.set(t => { rows.forEach((r, i) => { const st = R3[i][1]; rise(r, t, st - .55, 50); r.querySelector('.st').style.transform = `scaleX(${E.io3(P(t, st, st + .4)).toFixed(3)})`; r.querySelector('.x').style.transform = `scale(${E.back(P(t, st + .1, st + .45)).toFixed(3)})` }); lineIn(nt, t, 110.25) });
}
{
  const s = S(115.25, 121.1); const e = s.e;
  const key = C(e, 540, 450, 200, 200, `border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center`, `<svg width="110" height="110" viewBox="0 0 64 64" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"><circle cx="20" cy="32" r="12"/><path d="M32 32 H58 M50 32 V42 M42 32 V40"/></svg>`);
  const own = maskLine(e, 630, 70, '#fff', 'O SITE É SEU');
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => C(e, 180 + i * 120, 830, 100, 100, 'border-radius:24px;background:#1b1b1b;border:2px solid #2a2a2a;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:36px;color:#666', d));
  const z = txt(e, 540, 1080, 900, 140, Y, '€0<span style="font-size:.4em;color:#fff;margin-left:10px">/mês</span>', 'font-weight:900');
  s.set(t => { pop(key, t, 115.45); lineIn(own, t, 115.6); days.forEach((d, i) => { pop(d, t, 116.6 + i * .06); const lit = t > 118.2 + i * .07; d.style.background = lit ? Y : '#1b1b1b'; d.style.color = lit ? '#111' : '#666'; d.style.borderColor = lit ? Y : '#2a2a2a' }); pop(z, t, 119.6, { s: 1 + .05 * ring(t, 120.7, 3, 7) }) });
}
{ // end card
  const s = S(120.95, 140, Y, { si: 1.08 }); const e = s.e;
  mk(e, 'inset:0;background:radial-gradient(ellipse 70% 45% at 50% 40%,rgba(255,255,255,.35),rgba(255,255,255,0) 70%)');
  const lg = C(e, 540, 600, 520, 290); C(lg, 260, 70, 280, 139, '', sym('#111', 280)); C(lg, 260, 196, 480, 78, '', wmLetters('#111', 480)); C(lg, 260, 262, 380, 25, '', tagline('#111', 380));
  const msg = pill(e, 540, 1010, 820, 120, '#111', '#fff', `${ICO.wa(56)}<span style="font-family:U;font-weight:700;font-size:36px">Responde aqui 👇</span>`.replace(' 👇', ''), 'box-shadow:0 30px 70px rgba(80,50,0,.3)');
  const ar = C(e, 540, 1220, 90, 120, '', `<svg width="90" height="120" viewBox="0 0 90 120"><path d="M45 8 V100 M14 70 L45 104 L76 70" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  s.set(t => { rise(lg, t, 121.1, 50); pop(msg, t, 121.6); set(ar, { y: Math.abs(Math.sin((t - 121.8) * Math.PI * 1.3)) * 22, o: P(t, 121.9, 122.2) }) });
}

// ======================= CAPTIONS v2: punchy 1–3 word groups, a highlight pill that glides word to word =======================
const KEY = new Set(['oferta', '12', 'meses', 'europa', 'exagero', 'diferente', 'minuto', 'profissional', 'medida', 'vitrine', 'genérico', 'confiança', 'segundo', 'muda', 'inteligente', 'botão', 'quiser', 'hora', 'verdade', 'whatsapp', 'qualificado', 'fechar', 'curioso', 'comprar', 'google', 'configurado', '249', 'euros', 'único', 'pronto', 'mensalidade', 'manutenção', 'surpresa', 'seu', 'nada', 'grande', 'tudo']);
const NOCAP = [[0, 2.4], [19.6, 21.15], [84.2, 85.6], [97.3, 99.1]]; // kinetic type already says it
const GR = []; { let st = 0; for (let i = 0; i < WORDS.length; i++) { const w = WORDS[i][0], n = WORDS[i + 1]; const brk = /[.,?!:]$/.test(w) || !n || (i - st >= 2) || (n && n[1] - WORDS[i][1] > .55); if (brk) { const nt = n ? n[1] : WORDS[i][1] + 1.2; GR.push([st, i, Math.min(nt - .02, WORDS[i][1] + 1.3)]); st = i + 1 } } }
const capIn = $('#capIn'); let gIdx = -1, gEls = [], gPill = null, gRects = [];
const CTHEME = t => (t >= 97.3 && t < 101.15) || t >= 121.0 ? 'y' : 'd';
function caps2(t) {
  let gi = -1; for (let i = 0; i < GR.length; i++) { const [a, , end] = GR[i]; if (t >= WORDS[a][1] - .08 && t < end) gi = i }
  if (NOCAP.some(([a, b]) => t >= a && t < b)) gi = -1;
  if (gi !== gIdx) {
    gIdx = gi; capIn.innerHTML = ''; gEls = []; gRects = [];
    if (gi >= 0) { gPill = document.createElement('div'); gPill.className = 'pill'; capIn.appendChild(gPill); const [a, b] = GR[gi]; for (let i = a; i <= b; i++) { const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = WORDS[i][0].replace(/[.,!:]$/, ''); capIn.appendChild(sp); gEls.push({ sp, i }) } gRects = gEls.map(({ sp }) => ({ x: sp.offsetLeft, y: sp.offsetTop, w: sp.offsetWidth, h: sp.offsetHeight })) }
  }
  if (gi < 0) return;
  const th = CTHEME(t), end = GR[gi][2];
  const ex = E.i2(P(t, end - .14, end));
  let ai = 0; gEls.forEach(({ i }, k) => { if (t >= WORDS[i][1] - .04) ai = k });
  const r1 = gRects[ai], r0 = gRects[Math.max(0, ai - 1)]; const ts = WORDS[gEls[ai].i][1] - .04; const p = ai === 0 ? 1 : E.o4(P(t, ts, ts + .16));
  const w0 = WORDS[gEls[0].i][1] - .06; const firstIn = E.back(P(t, w0, w0 + .26)); const pillO = E.o3(P(t, w0, w0 + .2));
  gPill.style.left = L(r0.x, r1.x, p).toFixed(1) + 'px'; gPill.style.top = L(r0.y, r1.y, p).toFixed(1) + 'px'; gPill.style.width = L(r0.w, r1.w, p).toFixed(1) + 'px'; gPill.style.height = L(r0.h, r1.h, p).toFixed(1) + 'px';
  gPill.style.background = th === 'd' ? Y : '#111';
  gPill.style.transform = `scale(${(firstIn * (1 - .2 * ex)).toFixed(3)}) rotate(${(-1.5 + 1.5 * p).toFixed(2)}deg)`; gPill.style.opacity = (pillO * (1 - ex)).toFixed(3);
  gEls.forEach(({ sp, i }, k) => {
    const st = WORDS[i][1] - .06; const kk = P(t, st, st + .2); const ko = E.o2(P(t, st, st + .12));
    const on = k === ai; const key = KEY.has(WORDS[i][0].toLowerCase().replace(/[.,?!:]/g, ''));
    sp.style.color = on ? (th === 'd' ? '#111' : Y) : (th === 'd' ? (key && k < ai ? Y : '#fff') : '#111');
    sp.style.opacity = (ko * (1 - ex)).toFixed(3);
    sp.style.transform = `translateY(${((1 - E.o4(kk)) * 34 - ex * 30).toFixed(1)}px) rotateX(${((1 - E.o4(kk)) * -50).toFixed(1)}deg) scale(${(on ? 1 + .06 * (1 - E.o3(P(t, st, st + .25))) : 1).toFixed(3)})`;
    sp.style.filter = kk < 1 || ex > 0 ? `blur(${((1 - E.o3(kk)) * 4 + ex * 8).toFixed(2)}px)` : 'none';
    sp.style.textShadow = th === 'd' && !on ? '0 6px 30px rgba(0,0,0,.6)' : 'none';
  });
}

const THEME = t => 'd';
const SHAKE = [[0.5, 6], [10.5, 4], [100.15, 5], [106.3, 9], [120.7, 4]];
const seek0 = makeSeek({ WORDS: [], CH: [], THEME, SHAKE });
window.seek = (t, f) => { ambBG(t); hudU(t); wipeU(t); seek0(t, f); caps2(t); vig.style.background = VIG[CTHEME(t) === 'y' && t > 97.5 ? 'y' : 'd'] };

// ---------- mockup integrity check (run by render.js "check") ----------
window.checkMockups = () => { scenes.forEach(sc => sc.e.style.display = 'block'); const r = [...document.querySelectorAll('img[data-site]')].map(im => ({ src: im.src.split('/').pop(), natural: (im.naturalWidth / im.naturalHeight).toFixed(4), box: (im.offsetWidth / im.offsetHeight).toFixed(4), ok: Math.abs(im.naturalWidth / im.naturalHeight - im.offsetWidth / im.offsetHeight) / (im.naturalWidth / im.naturalHeight) < .004 && im.parentElement.offsetWidth >= im.offsetWidth && im.parentElement.offsetHeight >= im.offsetTop + im.offsetHeight - 1 && getComputedStyle(im).objectFit !== 'cover', frame: im.parentElement.offsetWidth + 'x' + im.parentElement.offsetHeight, img: im.offsetWidth + 'x' + im.offsetHeight + '@' + im.offsetTop })); seek(0, 0); return r };

window.SFX = [
  { t: .1, type: 'hit', g: .35 }, { t: .5, type: 'hit', g: .35 }, { t: .96, type: 'pop', g: .22 },
  { t: 2.25, type: 'whoosh', g: .3 }, { t: 4.3, type: 'swish', g: .22 }, { t: 6.78, type: 'shimmer', g: .24 },
  { t: 8.6, type: 'whoosh', g: .28 }, { t: 10.5, type: 'swish', g: .3 }, { t: 11.2, type: 'pop', g: .16 },
  { t: 14.6, type: 'whoosh', g: .28 }, ...[0, 1, 2].map(i => ({ t: 17.3 + i * .3, type: 'pop', g: .15 })),
  { t: 19.42, type: 'whoosh', g: .42 }, { t: 21.1, type: 'swell', g: .25 }, { t: 22.3, type: 'tick', g: .2 }, { t: 24.55, type: 'pop', g: .14 }, { t: 24.75, type: 'pop', g: .14 }, { t: 24.95, type: 'pop', g: .14 }, { t: 26.45, type: 'whoosh', g: .3 },
  { t: 29.25, type: 'stamp', g: .34 }, { t: 31.5, type: 'swish', g: .26 }, { t: 34.4, type: 'pop', g: .18 }, { t: 35.62, type: 'ding', g: .2 },
  { t: 36.84, type: 'whoosh', g: .42 }, { t: 37.2, type: 'impact', g: .35 },
  { t: 41.0, type: 'pop', g: .18 }, { t: 44.5, type: 'swell', g: .22 }, { t: 47.18, type: 'click', g: .32 }, { t: 47.3, type: 'pop', g: .18 }, ...Array.from({ length: 6 }, (_, i) => ({ t: 48.3 + i * .12, type: 'key', g: .1 })),
  { t: 49.0, type: 'zoom', g: .3 }, ...[49.7, 50.7, 51.7, 52.78, 53.58].map(t => ({ t, type: 'msg2', g: .15 })), { t: 55.05, type: 'msg', g: .2 }, { t: 55.8, type: 'pop', g: .15 }, { t: 56.6, type: 'pop', g: .14 }, { t: 58.1, type: 'pop', g: .14 },
  { t: 59.6, type: 'whoosh', g: .3 }, { t: 61.1, type: 'pop', g: .16 }, { t: 62.6, type: 'click', g: .28 }, { t: 63.3, type: 'swish', g: .24 }, { t: 64.1, type: 'notif', g: .24 },
  { t: 68.15, type: 'tick', g: .2 }, { t: 69.3, type: 'tick', g: .2 }, { t: 70.6, type: 'swell', g: .16 },
  ...Array.from({ length: 10 }, (_, i) => ({ t: 72.4 + i * .2, type: 'msg2', g: .08 })), { t: 74.6, type: 'whoosh', g: .32 },
  { t: 75.55, type: 'swish', g: .22 }, { t: 79.5, type: 'shimmer', g: .2 }, { t: 82.4, type: 'pop', g: .16 },
  { t: 83.92, type: 'whoosh', g: .42 }, { t: 84.3, type: 'impact', g: .3 },
  ...Array.from({ length: 8 }, (_, i) => ({ t: 87.3 + i * .15, type: 'key', g: .1 })), { t: 89.1, type: 'drop', g: .25 }, { t: 90.5, type: 'click', g: .26 }, { t: 90.75, type: 'whoosh', g: .25 },
  { t: 92.06, type: 'swish', g: .2 }, { t: 93.4, type: 'swish', g: .2 }, { t: 95.7, type: 'swish', g: .2 }, { t: 97.2, type: 'pop', g: .22 },
  { t: 97.3, type: 'swell', g: .3 }, { t: 100.15, type: 'ding', g: .26 },
  { t: 101.3, type: 'pop', g: .18 }, { t: 106.3, type: 'stamp', g: .5 }, { t: 109.45, type: 'ding', g: .16 },
  { t: 110.75, type: 'scribble', g: .16 }, { t: 112.45, type: 'scribble', g: .16 }, { t: 114.4, type: 'scribble', g: .16 },
  { t: 115.45, type: 'pop', g: .2 }, { t: 119.6, type: 'pop', g: .2 }, { t: 120.95, type: 'swell', g: .26 }, { t: 121.6, type: 'chime', g: .24 },
];
window.ready = document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r })))).then(() => { seek(0, 0); return true });
