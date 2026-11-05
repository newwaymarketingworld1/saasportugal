// NewWay — "Site que trabalha" motion ad. Everything is a pure function of time t (seek-able, frame exact).
const W = 1080, H = 1920, Y = '#FFC400';
window.DUR = 31.2;
const $ = s => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const P = (t, a, b) => clamp((t - a) / (b - a));
const L = (a, b, x) => a + (b - a) * x;
const E = {
  lin: x => x, o2: x => 1 - (1 - x) ** 2, o3: x => 1 - (1 - x) ** 3, o4: x => 1 - (1 - x) ** 4, o5: x => 1 - (1 - x) ** 5,
  i2: x => x * x, i3: x => x ** 3, i4: x => x ** 4,
  io3: x => x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2, io5: x => x < .5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2,
  back: x => { const c = 1.70158; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2 },
  back2: x => { const c = 2.4; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2 },
  el: x => x === 0 ? 0 : x === 1 ? 1 : 2 ** (-9 * x) * Math.sin((x * 9 - .75) * 2 * Math.PI / 3) + 1,
};
const T = (t, a, b, v0, v1, e = E.o3) => L(v0, v1, e(P(t, a, b)));
// damped spring "kick": 0 before a, rings and settles to 0
const ring = (t, a, f = 9, d = 6) => t < a ? 0 : Math.exp(-(t - a) * d) * Math.sin((t - a) * f * 2 * Math.PI) * 1;

function mk(par, css = '', html = '', cls = '') { const e = document.createElement('div'); e.style.cssText = 'position:absolute;' + css; if (cls) e.className = cls; e.innerHTML = html; par.appendChild(e); return e }
// centered box at x,y
function C(par, x, y, w, h, css = '', html = '', cls = '') { const e = mk(par, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;` + css, html, cls); e._c = 1; set(e, {}); return e }
function set(e, o) {
  let tr = e._c ? 'translate(-50%,-50%) ' : '';
  if (o.x || o.y) tr += `translate(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px) `;
  if (o.p) tr += `perspective(${o.p}px) `;
  if (o.rx) tr += `rotateX(${o.rx.toFixed(3)}deg) `;
  if (o.ry) tr += `rotateY(${o.ry.toFixed(3)}deg) `;
  if (o.r) tr += `rotate(${o.r.toFixed(3)}deg) `;
  const s = o.s ?? 1; tr += `scale(${((o.sx ?? 1) * s).toFixed(4)},${((o.sy ?? 1) * s).toFixed(4)})`;
  e.style.transform = tr;
  if (o.o !== undefined) { const v = clamp(o.o); e.style.opacity = v.toFixed(3); e.style.visibility = v <= .002 ? 'hidden' : 'visible' }
  if (o.b !== undefined) e.style.filter = o.b > .08 ? `blur(${o.b.toFixed(2)}px)` : 'none';
}
const vis = (e, on) => { e.style.display = on ? 'block' : 'none' };

// ---------- brand assets ----------
const SYM_VB = '396 370 282 140', WM_VB = '200 545 680 110', TAG_VB = '262 676 550 34';
const sym = (col, w, extra = '') => `<svg viewBox="${SYM_VB}" width="${w}" height="${w * 140 / 282}" style="display:block;${extra}">${LOGO.symbol.map(d => `<path fill="${col}" d="${d}"/>`).join('')}</svg>`;
const wmLetters = (col, w) => `<svg viewBox="${WM_VB}" width="${w}" height="${w * 110 / 680}" style="display:block;overflow:visible">${LOGO.wordmark.map(d => `<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('')}</svg>`;
const tagline = (col, w) => `<svg viewBox="${TAG_VB}" width="${w}" height="${w * 34 / 550}" style="display:block"><path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/></svg>`;
const STAR = '50,4 61,38 97,38 68,59 79,93 50,72 21,93 32,59 3,38 39,38';
const starSVG = (fill, sz, stroke = 'none') => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" style="display:block"><polygon points="${STAR}" fill="${fill}" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/></svg>`;
const SPARK = 'M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z';
const sparkSVG = (fill, sz) => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" style="display:block"><path d="${SPARK}" fill="${fill}"/></svg>`;
const CURSOR = (sz, fill = '#fff', st = '#000') => `<svg viewBox="-4 -4 40 52" width="${sz}" height="${sz * 52 / 40}" style="display:block;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))"><path d="M0 0 L0 34 L9 26 L15 40 L21 37 L15 24 L27 24 Z" fill="${fill}" stroke="${st}" stroke-width="2.6" stroke-linejoin="round"/></svg>`;

function browser(par, x, y, w, h, th = 'light') {
  const r = C(par, x, y, w, h, `border-radius:${Math.round(w * .028)}px;overflow:hidden;`, '', 'br');
  const dark = th === 'dark' || th === 'grey';
  const barBg = th === 'dark' ? '#121212' : th === 'grey' ? '#2c2c2c' : '#efefec';
  const dot = th === 'dark' ? '#3a3a3a' : th === 'grey' ? '#474747' : '#d3d3cf';
  const url = th === 'dark' ? '#222' : th === 'grey' ? '#383838' : '#e2e2de';
  r.innerHTML = `<div class="bar" style="background:${barBg}"><i style="background:${dot}"></i><i style="background:${dot}"></i><i style="background:${dot}"></i><b style="background:${url}"></b></div><div class="body"></div>`;
  r.style.background = th === 'grey' ? '#353535' : '#fff';
  r.body = r.querySelector('.body');
  return r;
}

// ---------- stage ----------
const cam = $('#cam');
const scenes = [];
function scene(a, b, bg) { const e = mk(cam, `left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;background:${bg};`, '', 'sc'); const s = { e, a, b, u: () => { } }; scenes.push(s); return s }

// ======================= SCENE A: "site parado" -> "site que trabalha" (0 – 7.5) =======================
const A = scene(0, 7.5, '#0b0b0b');
{
  const e = A.e;
  const spot = mk(e, 'left:0;top:0;width:1080px;height:1920px;background:radial-gradient(ellipse 60% 38% at 50% 38%,rgba(255,255,255,.10),rgba(255,255,255,0) 70%)');
  const flood = C(e, 615, 1170, 100, 100, `border-radius:50%;background:${Y}`);
  // floor line
  const floor = mk(e, 'left:0;top:1260px;width:1080px;height:660px;background:linear-gradient(#0b0b0b,#070707)');
  // EU ring
  const ringC = C(e, 540, 760, 10, 10);
  const stars = [];
  for (let i = 0; i < 12; i++) { const s = mk(ringC, '', starSVG(Y, 46), 'star'); stars.push(s) }
  const euro = C(e, 540, 760, 220, 200, `display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:150px;color:#fff;line-height:1`, '€');
  // browser
  const br = browser(e, 540, 760, 800, 560, 'light');
  br.style.boxShadow = '0 40px 120px rgba(0,0,0,.55)';
  const b = br.body;
  const plain = mk(b, 'inset:0;background:#fafaf8', `
    <div class="ln" style="left:34px;top:24px;width:70px;height:22px;background:#dcdcd8"></div>
    <div class="ln" style="left:520px;top:30px;width:56px;height:10px;background:#e2e2de"></div><div class="ln" style="left:590px;top:30px;width:56px;height:10px;background:#e2e2de"></div><div class="ln" style="left:660px;top:30px;width:90px;height:22px;top:24px;background:#d0d0cc"></div>
    <div class="ln" style="left:40px;top:118px;width:330px;height:34px;background:#d9d9d5"></div><div class="ln" style="left:40px;top:164px;width:250px;height:34px;background:#d9d9d5"></div>
    <div class="ln" style="left:40px;top:226px;width:300px;height:13px;background:#e6e6e2"></div><div class="ln" style="left:40px;top:250px;width:250px;height:13px;background:#e6e6e2"></div>
    <div class="ln" style="left:40px;top:300px;width:160px;height:48px;border-radius:24px;background:#d0d0cc"></div>
    <div class="ln" style="left:420px;top:96px;width:340px;height:290px;border-radius:16px;background:#ececE8"></div>
    <div class="ln" style="left:40px;top:420px;width:220px;height:66px;background:#efefeb"></div><div class="ln" style="left:290px;top:420px;width:220px;height:66px;background:#efefeb"></div><div class="ln" style="left:540px;top:420px;width:220px;height:66px;background:#efefeb"></div>`);
  const pretty = mk(b, 'inset:0;background:#fff', `
    <div class="a" style="left:34px;top:20px">${sym('#111', 62)}</div>
    <div class="a is" style="left:500px;top:24px;font-size:17px;font-weight:600;color:#333;word-spacing:22px">Início Sobre Contato</div>
    <div class="a is" style="left:40px;top:104px;font-size:44px;font-weight:700;color:#111;line-height:1.05;letter-spacing:-.02em">Bem-vindo ao<br>nosso site.</div>
    <div class="ln" style="left:40px;top:226px;width:300px;height:12px;background:#e9e9e5"></div><div class="ln" style="left:40px;top:250px;width:240px;height:12px;background:#e9e9e5"></div>
    <div class="a is" style="left:40px;top:296px;width:170px;height:52px;border-radius:26px;background:${Y};font-size:19px;font-weight:700;color:#111;display:flex;align-items:center;justify-content:center">Saiba mais</div>
    <div class="a" style="left:420px;top:96px;width:340px;height:290px;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#ffe07a,#FFC400 55%,#f2a900)">
      <div class="a" style="left:206px;top:46px;width:74px;height:74px;border-radius:50%;background:#111"></div>
      <svg class="a" style="left:0;top:150px" width="340" height="140" viewBox="0 0 340 140"><path d="M0 140 L0 92 L70 40 L130 88 L190 30 L260 92 L340 60 L340 140Z" fill="#111"/><path d="M0 140 L0 116 L90 80 L170 118 L250 84 L340 108 L340 140Z" fill="#2a2a2a"/></svg>
    </div>
    <div class="ln" style="left:40px;top:420px;width:220px;height:66px;background:#f3f3f0"></div><div class="ln" style="left:290px;top:420px;width:220px;height:66px;background:#f3f3f0"></div><div class="ln" style="left:540px;top:420px;width:220px;height:66px;background:#f3f3f0"></div>`);
  // live chart drawn over hero image (working state)
  const chart = mk(b, 'left:420px;top:96px;width:340px;height:290px', `<svg width="340" height="290" viewBox="0 0 340 290"><path id="chartP" d="M18 250 L70 228 L118 236 L168 180 L214 190 L262 120 L320 52" fill="none" stroke="#111" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/><circle id="chartD" cx="320" cy="52" r="13" fill="#fff" stroke="#111" stroke-width="7"/></svg>`);
  // cobweb
  let web = '';
  const angs = [0, 18, 36, 54, 72, 90].map(a => a * Math.PI / 180);
  angs.forEach(a => web += `<path d="M0 0 L${(Math.cos(a) * 230).toFixed(1)} ${(Math.sin(a) * 230).toFixed(1)}" pathLength="1"/>`);
  [42, 80, 120, 160, 200].forEach(rr => { let d = ''; angs.forEach((a, i) => { const x = Math.cos(a) * rr, y = Math.sin(a) * rr; if (i === 0) d += `M${x.toFixed(1)} ${y.toFixed(1)}`; else { const am = (a + angs[i - 1]) / 2, r2 = rr * .86; d += ` Q${(Math.cos(am) * r2).toFixed(1)} ${(Math.sin(am) * r2).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}` } }); web += `<path d="${d}" pathLength="1"/>` });
  const cob = mk(b, 'left:0;top:0;width:240px;height:240px', `<svg width="240" height="240" viewBox="0 0 240 240" fill="none" stroke="#8f8f8b" stroke-width="1.8" stroke-linecap="round">${web}</svg>`);
  const cobPaths = [...cob.querySelectorAll('path')];
  const counter = mk(b, 'right:24px;top:62px;height:46px;padding:0 20px;border-radius:23px;background:#111;display:flex;align-items:center;gap:12px', `<span class="mono" style="color:#9a9a96;font-size:15px;letter-spacing:.16em">visitas hoje</span><span id="cnt" style="font-family:U;font-weight:700;color:#fff;font-size:22px;min-width:52px;text-align:right">0</span>`);
  const cnt = counter.querySelector('#cnt');
  // dust
  const dust = []; for (let i = 0; i < 16; i++) { dust.push(mk(b, `left:${(37 * i * 13) % 760 + 20}px;top:0;width:${3 + i % 3}px;height:${3 + i % 3}px;border-radius:50%;background:rgba(120,120,115,.7)`)) }
  // price tag
  const tag = mk(e, 'left:858px;top:486px;width:130px;height:150px;transform-origin:65px 0', `
    <svg width="130" height="70" viewBox="0 0 130 70" style="position:absolute;left:0;top:-58px"><path d="M65 64 C60 30 30 18 8 4" stroke="#eee" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
    <div style="position:absolute;left:0;top:0;width:130px;height:150px;background:${Y};clip-path:polygon(50% 0,100% 24%,100% 100%,0 100%,0 24%);border-radius:6px"></div>
    <div style="position:absolute;left:58px;top:20px;width:14px;height:14px;border-radius:50%;background:#0b0b0b"></div>
    <div style="position:absolute;left:0;top:44px;width:130px;text-align:center;font-family:U;font-weight:800;font-size:58px;color:#111;line-height:1">€</div>
    <div class="mono" style="position:absolute;left:0;top:112px;width:130px;text-align:center;font-size:13px;color:#111;letter-spacing:.18em">à venda</div>`);
  // pause stamp
  const pause = C(e, 540, 786, 210, 210, 'border-radius:50%;background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;gap:26px', '<i style="display:block;width:30px;height:92px;border-radius:8px;background:#111"></i><i style="display:block;width:30px;height:92px;border-radius:8px;background:#111"></i>');
  // sparkles (bonito)
  const SP = [[196, 520, 70, 0], [884, 640, 54, .12], [270, 1040, 46, .22], [860, 1010, 80, .07], [610, 452, 40, .3], [150, 820, 34, .38]];
  const sparks = SP.map(([x, y, s]) => C(e, x, y, s, s, '', sparkSVG(Y, s)));
  // toggle
  const tg = C(e, 540, 1170, 300, 150);
  const track = mk(tg, 'left:0;top:0;width:300px;height:150px;border-radius:75px;background:#262626;box-shadow:inset 0 6px 18px rgba(0,0,0,.5)');
  const knob = mk(tg, 'left:12px;top:12px;width:126px;height:126px;border-radius:50%;background:#fff;box-shadow:0 10px 26px rgba(0,0,0,.35)');
  const lOff = C(e, 400, 1300, 260, 40, 'text-align:center;font-size:22px;color:#8a8a86', 'parado', 'mono');
  const lOn = C(e, 690, 1300, 300, 40, 'text-align:center;font-size:22px;color:#5a5a57', 'trabalhando', 'mono');
  // toasts (working)
  const TO = [['+1 cliente', 850, 560], ['Novo pedido', 890, 652], ['Nova mensagem', 842, 744]];
  const toasts = TO.map(([s, x, y]) => C(e, x, y, 300, 70, 'border-radius:35px;background:#111;display:flex;align-items:center;gap:14px;padding-left:26px;box-shadow:0 18px 40px rgba(0,0,0,.25)', `<i style="display:block;width:14px;height:14px;border-radius:50%;background:${Y}"></i><span class="is" style="color:#fff;font-weight:600;font-size:27px">${s}</span>`));

  A.u = t => {
    // stars ring
    const rr = T(t, 0, .6, 120, 190, E.o4) + T(t, 1.0, 1.45, 0, 620, E.i3);
    stars.forEach((s, i) => {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2 + t * .35;
      const st = .03 + i * .032;
      const sc = E.back2(P(t, st, st + .32)) * T(t, 1.05, 1.4, 1, .3, E.i2);
      set(s, { x: Math.cos(a) * rr, y: Math.sin(a) * rr, s: sc, r: t * 40 + i * 20, o: P(t, st, st + .08) * (1 - P(t, 1.15, 1.42)) });
    });
    // euro: center -> tag
    const eu = E.io3(P(t, 1.02, 1.36));
    set(euro, { x: L(0, 925 - 540, eu), y: L(0, 595 - 760, eu), s: T(t, .5, .8, .4, 1, E.back) * L(1, .36, eu), o: P(t, .52, .62) * (1 - P(t, 1.3, 1.36)), b: T(t, .5, .66, 10, 0) });
    // browser motion
    let by = 0, bs = 1, brr = 0;
    by += T(t, 1.05, 1.55, 70, 0, E.o4);
    bs *= T(t, 1.05, 1.55, .55, 1, E.back);
    bs *= 1 + .035 * ring(t, 2.08, 3, 9) + .025 * ring(t, 6.4, 3.5, 7);
    brr += T(t, 3.7, 4.5, 0, -2.4, E.io3) * (1 - P(t, 4.8, 5.3));
    by += T(t, 3.7, 4.5, 0, 14, E.io3) * (1 - E.io3(P(t, 4.8, 5.3)));
    by += T(t, 4.8, 5.32, 0, -170, E.io3);
    bs *= T(t, 4.8, 5.32, 1, .8, E.io3);
    by += T(t, 7.08, 7.5, 0, -260, E.io5);
    set(br, { y: by + 5 * Math.sin(t * 1.7), s: bs, r: brr + .3 * Math.sin(t * 1.1), o: P(t, 1.05, 1.25) });
    br.style.boxShadow = t > 6.4 ? '0 40px 90px rgba(80,50,0,.35)' : '0 40px 120px rgba(0,0,0,.55)';
    // pretty wipe (bonito)
    const pw = E.io3(P(t, 2.96, 3.38));
    pretty.style.clipPath = `inset(0 ${(100 - pw * 100).toFixed(2)}% 0 0)`;
    pretty.style.filter = `grayscale(${(T(t, 4.0, 4.6, 0, .85) * (1 - P(t, 6.4, 6.6))).toFixed(3)}) brightness(${(1 - .12 * T(t, 4.0, 4.6, 0, 1) * (1 - P(t, 6.4, 6.6))).toFixed(3)})`;
    // cobweb draws on "mas parado"
    const cw = P(t, 3.72, 4.5) * (1 - P(t, 6.4, 6.62));
    cobPaths.forEach((p, i) => { const k = clamp(cw * 1.6 - i * .05); p.style.strokeDasharray = '1 1'; p.style.strokeDashoffset = (1 - E.o2(k)).toFixed(3) });
    cob.style.opacity = (1 - P(t, 6.42, 6.62)).toFixed(3);
    // counter
    set(counter, { y: T(t, 3.78, 4.1, -20, 0, E.back), o: P(t, 3.78, 3.95) });
    counter.style.transform += ` scale(${(1 + .08 * ring(t, 6.4, 4, 8)).toFixed(3)})`;
    const n = t < 6.42 ? 0 : Math.round(248 * E.o3(P(t, 6.42, 7.1)));
    cnt.textContent = n;
    counter.style.background = t > 6.42 ? Y : '#111';
    cnt.style.color = t > 6.42 ? '#111' : '#fff';
    counter.firstChild.style.color = t > 6.42 ? '#3a3000' : '#9a9a96';
    dust.forEach((d, i) => { const st = 3.8 + (i % 6) * .11; const k = P(t, st, st + 2.4); set(d, { y: 60 + ((i * 53) % 260) + k * 170, o: Math.sin(Math.PI * k) * .9 * (1 - P(t, 6.4, 6.5)) }) });
    // price tag swing
    const sw = t < 1.28 ? 0 : 24 * Math.exp(-(t - 1.28) * 2.2) * Math.cos((t - 1.28) * 7.5) - 2;
    tag.style.transform = `rotate(${(sw - 8 * (1 - E.o3(P(t, 1.28, 1.5)))).toFixed(2)}deg) scale(${E.back(P(t, 1.28, 1.52)).toFixed(3)})`;
    tag.style.opacity = (P(t, 1.28, 1.36) * (1 - P(t, 4.75, 5.0))).toFixed(3);
    // pause stamp
    set(pause, { s: T(t, 2.06, 2.24, 1.9, 1, E.o4) * T(t, 2.7, 2.94, 1, .7, E.i2), o: P(t, 2.06, 2.14) * (1 - P(t, 2.72, 2.94)), b: T(t, 2.06, 2.18, 12, 0) });
    // sparkles
    sparks.forEach((s, i) => { const st = 2.98 + SP[i][3]; const k = P(t, st, st + .7); set(s, { s: Math.sin(Math.PI * k) ** .7 * 1.1, r: k * 160, o: k > 0 && k < 1 ? 1 : 0 }) });
    // toggle
    const tgIn = E.back(P(t, 4.86, 5.32));
    set(tg, { y: (1 - E.o4(P(t, 4.86, 5.3))) * 160 + T(t, 7.08, 7.5, 0, -260, E.io5), s: L(.6, 1, tgIn) * (1 + .06 * ring(t, 6.4, 3.5, 7)), o: P(t, 4.86, 5.0) });
    const kx = 12 + T(t, 6.12, 6.36, 0, -8, E.o2) + T(t, 6.38, 6.6, 0, 158, E.back2);
    knob.style.left = kx.toFixed(2) + 'px';
    knob.style.width = (126 + 26 * Math.sin(Math.PI * P(t, 6.38, 6.56))).toFixed(1) + 'px';
    track.style.background = t < 6.4 ? '#262626' : t < 6.56 ? Y : '#111';
    track.style.boxShadow = t < 6.4 ? 'inset 0 6px 18px rgba(0,0,0,.5)' : 'none';
    const lo = P(t, 4.96, 5.2) * (1 - P(t, 7.08, 7.2));
    set(lOff, { y: (1 - E.o4(P(t, 4.86, 5.3))) * 160 + T(t, 7.08, 7.5, 0, -260, E.io5), o: lo * (t > 6.4 ? .5 : 1) });
    set(lOn, { y: (1 - E.o4(P(t, 4.86, 5.3))) * 160 + T(t, 7.08, 7.5, 0, -260, E.io5), o: lo });
    lOff.style.color = t > 6.45 ? '#6b5300' : '#cfcfca';
    lOn.style.color = t > 6.45 ? '#111' : '#5a5a57';
    // flood
    const fr = E.o4(P(t, 6.42, 6.95)) * 4600;
    set(flood, { s: fr / 100, o: t > 6.41 ? 1 : 0 });
    spot.style.opacity = 1 - P(t, 6.5, 6.8);
    floor.style.opacity = 1 - P(t, 6.42, 6.6);
    // chart + toasts
    const cp = E.io3(P(t, 6.5, 7.05));
    chart.style.opacity = t > 6.48 ? 1 : 0;
    const pth = chart.querySelector('#chartP'); pth.style.strokeDashoffset = (1 - cp).toFixed(3);
    const dd = chart.querySelector('#chartD'); dd.style.opacity = P(t, 6.95, 7.05);
    toasts.forEach((o, i) => { const st = 6.5 + i * .14; set(o, { x: T(t, st, st + .35, 60, 0, E.o4), y: T(t, 7.08, 7.5, 0, -260, E.io5), s: E.back(P(t, st, st + .32)), o: P(t, st, st + .1) }) });
  };
}

// ======================= SCENE B: Google / Meu Negócio (7.08 – 10.06) =======================
const B = scene(7.08, 10.06, '#F3F3F1');
{
  const e = B.e;
  e.style.borderRadius = '0';
  const grid = mk(e, 'inset:0;background-image:radial-gradient(#d9d9d4 1.6px,transparent 1.6px);background-size:36px 36px;opacity:.55');
  const bar = C(e, 540, 760, 900, 124, 'border-radius:62px;background:#fff;box-shadow:0 22px 60px rgba(0,0,0,.10),0 2px 0 rgba(0,0,0,.03);display:flex;align-items:center;padding-left:40px;gap:24px', `
    <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="18" cy="18" r="13" stroke="#111" stroke-width="5" fill="none"/><path d="M28 28 L40 40" stroke="#111" stroke-width="5.5" stroke-linecap="round"/></svg>
    <span id="q" class="is" style="font-size:40px;font-weight:500;color:#111;letter-spacing:-.01em;white-space:pre"></span><i id="caret" style="display:block;width:3px;height:46px;background:${Y};margin-left:-20px"></i>
    <div style="position:absolute;right:16px;top:16px;width:92px;height:92px;border-radius:46px;background:#111;display:flex;align-items:center;justify-content:center"><svg width="36" height="36" viewBox="0 0 36 36"><path d="M6 18 H30 M20 8 L30 18 L20 28" stroke="${Y}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`);
  const q = bar.querySelector('#q'), caret = bar.querySelector('#caret');
  const QTXT = 'empresa perto de mim';
  // business card
  const card = C(e, 540, 950, 900, 620, 'border-radius:40px;background:#fff;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.13)');
  let roads = '';
  [[0, 96, 900, 80], [0, 220, 900, 240], [180, 0, 230, 290], [520, 0, 470, 290], [760, 0, 800, 290], [0, 30, 900, 170]].forEach(([a, b2, c, d], i) => roads += `<path d="M${a} ${b2} L${c} ${d}" stroke="#fff" stroke-width="${i === 5 ? 10 : 18}" stroke-linecap="round"/>`);
  const map = mk(card, 'left:0;top:0;width:900px;height:290px;background:#E9E9E4', `<svg width="900" height="290" viewBox="0 0 900 290">
     <rect x="250" y="120" width="210" height="80" rx="10" fill="#dcdcd5"/><rect x="40" y="130" width="110" height="60" rx="10" fill="#dfdfd9"/><rect x="600" y="110" width="130" height="90" rx="10" fill="#d4d4cc"/><rect x="820" y="120" width="60" height="70" rx="8" fill="#dfdfd9"/><rect x="230" y="10" width="250" height="60" rx="10" fill="#dfdfd9"/><rect x="570" y="10" width="160" height="60" rx="10" fill="#dcdcd5"/>
     ${roads}
     <circle cx="120" cy="60" r="9" fill="#bdbdb6"/><circle cx="700" cy="250" r="9" fill="#bdbdb6"/><circle cx="380" cy="252" r="9" fill="#bdbdb6"/></svg>`);
  const pin = C(card, 470, 150, 70, 92, 'transform-origin:50% 100%', `<svg width="70" height="92" viewBox="0 0 70 92"><path d="M35 90 C35 90 4 54 4 34 A31 31 0 1 1 66 34 C66 54 35 90 35 90Z" fill="${Y}" stroke="#111" stroke-width="5"/><circle cx="35" cy="34" r="11" fill="#111"/></svg>`);
  const ripple = C(card, 470, 192, 60, 24, `border-radius:50%;border:4px solid #111`);
  const info = mk(card, 'left:50px;top:318px;width:800px;height:300px', `
    <div style="font-family:U;font-weight:600;font-size:42px;color:#111;letter-spacing:-.01em">Seu Negócio</div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:18px"><span class="is" style="font-size:28px;font-weight:700;color:#111;margin-right:6px">4,9</span><span id="stars" style="display:flex;gap:6px"></span><span class="is" style="font-size:25px;color:#7a7a76;margin-left:10px">(128 avaliações)</span></div>
    <div class="is" style="font-size:26px;color:#3b3b38;margin-top:14px;font-weight:500"><b style="color:#111">Aberto agora</b> · a 350 m de você</div>
    <div id="chips" style="display:flex;gap:16px;margin-top:30px"></div>`);
  const stW = info.querySelector('#stars'); const stEls = [];
  for (let i = 0; i < 5; i++) { const s = document.createElement('div'); s.style.cssText = 'position:relative;width:30px;height:30px'; s.innerHTML = `<div style="position:absolute;inset:0">${starSVG('#e3e3de', 30)}</div><div class="f" style="position:absolute;inset:0">${starSVG(Y, 30, '#111')}</div>`; stW.appendChild(s); stEls.push(s.querySelector('.f')) }
  const chW = info.querySelector('#chips'); const chips = [];
  [['Ligar', '#f1f1ee', '#111'], ['Rotas', '#f1f1ee', '#111'], ['Site', Y, '#111']].forEach(([s, bg, c]) => { const d = document.createElement('div'); d.style.cssText = `width:170px;height:68px;border-radius:34px;background:${bg};color:${c};font-family:IS;font-weight:700;font-size:26px;display:flex;align-items:center;justify-content:center;gap:10px`; d.innerHTML = s; chW.appendChild(d); chips.push(d) });
  const badge = C(e, 868, 668, 250, 74, `border-radius:37px;background:#111;color:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:700;font-size:25px;letter-spacing:.02em`, '1º resultado');
  const ZX = 90 + 50 + 2 * 186 + 85, ZY = 950 - 310 + 318 + 196; // "Site" chip centre (approx)
  e.style.transformOrigin = `${ZX}px ${ZY}px`;
  B.u = t => {
    // enter: panel slides up over yellow
    const ein = E.io5(P(t, 7.08, 7.42));
    const zoom = E.i4(P(t, 9.66, 10.04));
    e.style.transform = `translateY(${((1 - ein) * 1920).toFixed(1)}px) scale(${(1 + zoom * 7).toFixed(3)})`;
    e.style.borderRadius = `${(48 * (1 - ein)).toFixed(1)}px ${(48 * (1 - ein)).toFixed(1)}px 0 0`;
    // typing
    const k = Math.floor(P(t, 7.38, 7.98) * QTXT.length + .001);
    q.textContent = QTXT.slice(0, k);
    caret.style.opacity = (t < 8.0 ? 1 : (Math.floor(t * 3) % 2 ? 0 : 1)) * (1 - P(t, 8.0, 8.1));
    const up = E.io5(P(t, 8.0, 8.42));
    set(bar, { y: L(0, -390, up) + T(t, 7.2, 7.5, 80, 0, E.o4), s: L(1, .94, up) });
    // card
    set(card, { y: T(t, 8.04, 8.5, 240, 0, E.o5) + 4 * Math.sin(t * 1.8), s: T(t, 8.04, 8.5, .92, 1, E.o4), o: P(t, 8.04, 8.16) });
    // stars fill
    stEls.forEach((s, i) => { const st = 8.5 + i * .07; set(s, { s: E.back2(P(t, st, st + .22)), o: P(t, st, st + .05) }) });
    // pin drop on "Negócio"
    const pd = P(t, 9.06, 9.3);
    set(pin, { y: (1 - E.i3(pd)) * -230, sy: 1 + .22 * ring(t, 9.3, 2.6, 8), sx: 1 - .12 * ring(t, 9.3, 2.6, 8), o: P(t, 9.06, 9.1) });
    const rp = P(t, 9.3, 9.95);
    set(ripple, { s: 1 + rp * 3.4, o: (1 - rp) * (t > 9.3 ? .9 : 0) });
    set(badge, { s: E.back2(P(t, 9.3, 9.55)), r: -6 + 6 * (1 - E.o3(P(t, 9.3, 9.6))), o: P(t, 9.3, 9.36), y: L(0, 0, 0) });
    chips[2].style.boxShadow = t > 9.5 ? `0 0 0 ${(6 * Math.sin(Math.PI * P(t, 9.5, 9.7))).toFixed(1)}px rgba(255,196,0,.4)` : 'none';
  };
}

// ======================= SCENE C: Vitrine profissional (9.92 – 13.2) =======================
const Cc = scene(9.92, 13.2, '#0c0c0c');
{
  const e = Cc.e;
  const wall = mk(e, 'inset:0;background:linear-gradient(180deg,#121212 0%,#0b0b0b 66%,#060606 66.2%,#0a0a0a 100%)');
  const wallLines = mk(e, 'inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 2px,transparent 2px 90px);height:1270px');
  const glow = C(e, 540, 860, 1100, 1000, 'border-radius:50%;background:radial-gradient(closest-side,rgba(255,196,0,.16),rgba(255,196,0,0))');
  const win = C(e, 540, 860, 860, 660, 'border-radius:26px;overflow:hidden;background:#F6F4EF;box-shadow:0 0 0 14px #1b1b1b,0 50px 120px rgba(0,0,0,.6);-webkit-box-reflect:below 40px linear-gradient(transparent 62%,rgba(255,255,255,.13))');
  const wbar = mk(win, 'left:0;top:0;right:0;height:48px;background:#1b1b1b;display:flex;align-items:center;gap:10px;padding-left:24px', `<i style="display:block;width:13px;height:13px;border-radius:50%;background:#3b3b3b"></i><i style="display:block;width:13px;height:13px;border-radius:50%;background:#3b3b3b"></i><i style="display:block;width:13px;height:13px;border-radius:50%;background:#3b3b3b"></i><div class="mono" style="position:absolute;left:50%;transform:translateX(-50%);top:12px;font-size:15px;color:#777;letter-spacing:.12em">sualoja.pt</div>`);
  const wb = mk(win, 'left:0;top:48px;width:860px;height:612px;overflow:hidden');
  // spotlights
  const cones = [150, 430, 710].map(x => mk(wb, `left:${x - 160}px;top:0;width:320px;height:612px;background:linear-gradient(180deg,rgba(255,236,170,.55),rgba(255,236,170,0) 85%);clip-path:polygon(42% 0,58% 0,100% 100%,0 100%);mix-blend-mode:multiply;opacity:0`));
  const lamps = [150, 430, 710].map(x => mk(wb, `left:${x - 34}px;top:0;width:68px;height:12px;border-radius:0 0 12px 12px;background:#222`));
  // products
  const ICON = [
    `<rect x="40" y="34" width="40" height="76" rx="12" fill="#111"/><rect x="50" y="18" width="20" height="20" rx="4" fill="#111"/><rect x="40" y="62" width="40" height="22" fill="${Y}"/>`,
    `<path d="M14 92 L14 70 C30 70 44 58 52 44 L66 50 C72 62 86 70 106 74 L106 92Z" fill="#111"/><rect x="14" y="88" width="92" height="10" rx="5" fill="${Y}"/>`,
    `<path d="M30 60 L60 20 L90 60Z" fill="${Y}"/><rect x="57" y="60" width="6" height="40" fill="#111"/><rect x="38" y="98" width="44" height="8" rx="4" fill="#111"/>`,
    `<rect x="24" y="44" width="72" height="62" rx="10" fill="#111"/><path d="M42 46 C42 22 78 22 78 46" stroke="#111" stroke-width="7" fill="none"/><rect x="24" y="66" width="72" height="8" fill="${Y}"/>`,
    `<rect x="48" y="14" width="24" height="92" rx="8" fill="#111"/><circle cx="60" cy="60" r="27" fill="#111"/><circle cx="60" cy="60" r="19" fill="${Y}"/><path d="M60 48 L60 61 L68 66" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    `<path d="M28 74 C28 36 92 36 92 74" stroke="#111" stroke-width="9" fill="none"/><rect x="20" y="66" width="22" height="38" rx="9" fill="${Y}" stroke="#111" stroke-width="5"/><rect x="78" y="66" width="22" height="38" rx="9" fill="${Y}" stroke="#111" stroke-width="5"/>`];
  const PR = ['€ 24', '€ 89', '€ 59', '€ 45', '€ 129', '€ 79'];
  const cards = [];
  for (let i = 0; i < 6; i++) {
    const cx = 150 + (i % 3) * 280, cy = 170 + Math.floor(i / 3) * 270;
    const c = C(wb, cx, cy, 236, 244, 'border-radius:20px;background:#fff;box-shadow:0 14px 30px rgba(0,0,0,.10)', `
      <div style="position:absolute;left:10px;top:10px;width:216px;height:148px;border-radius:14px;background:#F2F0EA;display:flex;align-items:center;justify-content:center"><svg width="120" height="120" viewBox="0 0 120 120">${ICON[i]}</svg></div>
      <div class="ln" style="left:18px;top:172px;width:120px;height:12px;background:#e6e4de"></div>
      <div class="is" style="position:absolute;left:18px;top:194px;font-size:28px;font-weight:700;color:#111">${PR[i]}</div>
      <div style="position:absolute;right:14px;bottom:14px;width:44px;height:44px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center"><svg width="20" height="20"><path d="M10 2 V18 M2 10 H18" stroke="#111" stroke-width="3.4" stroke-linecap="round"/></svg></div>`);
    cards.push(c);
  }
  const shine = mk(wb, 'left:0;top:-300px;width:170px;height:1300px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0));transform-origin:50% 50%');
  // awning
  const awn = mk(e, 'left:70px;top:470px;width:940px;height:170px;transform-origin:50% 0');
  const stripes = mk(awn, `left:0;top:0;width:940px;height:120px;background:repeating-linear-gradient(90deg,${Y} 0 58.75px,#111 58.75px 117.5px);box-shadow:0 22px 40px rgba(0,0,0,.45)`);
  mk(awn, 'left:0;top:0;width:940px;height:120px;background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(0,0,0,0) 40%,rgba(0,0,0,.28))');
  for (let i = 0; i < 16; i++) mk(awn, `left:${i * 58.75}px;top:92px;width:58.75px;height:58.75px;border-radius:50%;background:${i % 2 ? '#111' : Y};clip-path:inset(50% 0 0 0)`);
  mk(awn, 'left:-10px;top:-14px;width:960px;height:20px;border-radius:10px;background:#1c1c1c');
  const seal = C(e, 930, 600, 168, 168, `border-radius:50%;background:${Y};box-shadow:0 18px 40px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center`, `<div style="position:absolute;inset:10px;border-radius:50%;border:3px dashed #111"></div><div style="font-family:U;font-weight:800;font-size:44px;color:#111;letter-spacing:-.01em">PRO</div>`);
  Cc.u = t => {
    const inn = E.o4(P(t, 9.94, 10.4));
    const out = E.i3(P(t, 12.84, 13.1));
    e.style.opacity = P(t, 9.94, 10.06);
    e.style.transform = `translateX(${(-out * 1250).toFixed(1)}px) scale(${(L(1.35, 1, inn) * T(t, 10.3, 13, 1, 1.05, E.lin)).toFixed(4)})`;
    // awning drop
    const ad = P(t, 10.1, 10.62);
    awn.style.transform = `scaleY(${E.el(ad).toFixed(3)})`;
    awn.style.opacity = P(t, 10.1, 10.14);
    // products
    cards.forEach((c, i) => { const st = 10.66 + i * .075; set(c, { y: T(t, st, st + .4, 50, 0, E.o4), s: E.back(P(t, st, st + .4)) * .3 + .7 * E.o3(P(t, st, st + .3)), o: P(t, st, st + .1) }) });
    // lights on: flicker
    const fl = (st) => { if (t < st) return 0; const d = t - st; if (d < .05) return .8; if (d < .09) return .15; if (d < .14) return 1; if (d < .17) return .4; return 1 };
    cones.forEach((c, i) => c.style.opacity = fl(11.56 + i * .08));
    lamps.forEach((l, i) => l.style.background = fl(11.56 + i * .08) > .5 ? '#fff3c4' : '#222');
    glow.style.opacity = .25 + .75 * fl(11.6);
    // shine
    const sh = E.io3(P(t, 12.18, 12.66));
    shine.style.transform = `translateX(${L(-260, 1000, sh).toFixed(1)}px) rotate(18deg)`;
    shine.style.opacity = sh > 0 && sh < 1 ? 1 : 0;
    set(seal, { s: T(t, 12.24, 12.42, 2.2, 1, E.o4), r: -14 + 3 * ring(t, 12.4, 3, 6), o: P(t, 12.24, 12.3), b: T(t, 12.24, 12.34, 10, 0) });
  };
}

// ======================= SCENE D: Atendente inteligente (12.86 – 17.7) =======================
const D = scene(12.86, 17.7, '#F4F4F1');
{
  const e = D.e;
  mk(e, 'inset:0;background-image:radial-gradient(#d6d6d0 1.6px,transparent 1.6px);background-size:36px 36px;opacity:.5');
  const halo = C(e, 540, 800, 900, 900, 'border-radius:50%;background:radial-gradient(closest-side,rgba(255,196,0,.28),rgba(255,196,0,0))');
  const ph = C(e, 540, 800, 460, 930, 'border-radius:74px;background:#0d0d0d;box-shadow:0 60px 120px rgba(0,0,0,.25),inset 0 0 0 3px #2a2a2a');
  const scr = mk(ph, 'left:14px;top:14px;width:432px;height:902px;border-radius:60px;overflow:hidden;background:#fff');
  mk(scr, 'left:0;top:0;width:432px;height:300px', `
    <div class="is" style="position:absolute;left:44px;top:22px;font-size:20px;font-weight:700;color:#111">9:41</div>
    <div style="position:absolute;left:166px;top:14px;width:100px;height:30px;border-radius:15px;background:#0d0d0d"></div>
    <div style="position:absolute;left:30px;top:76px">${sym('#111', 70)}</div>
    <div style="position:absolute;right:30px;top:84px;width:34px;height:4px;background:#111;box-shadow:0 10px 0 #111,0 20px 0 #111"></div>
    <div class="ln" style="left:30px;top:150px;width:300px;height:26px;background:#ececE8"></div><div class="ln" style="left:30px;top:188px;width:220px;height:26px;background:#ececE8"></div>`);
  const dim = mk(scr, 'inset:0;background:rgba(0,0,0,.28)');
  const sheet = mk(scr, 'left:0;top:150px;width:432px;height:752px;border-radius:34px 34px 0 0;background:#fff;box-shadow:0 -20px 50px rgba(0,0,0,.18);overflow:hidden');
  const head = mk(sheet, 'left:0;top:0;width:432px;height:110px;border-bottom:1px solid #eee', `
    <div id="av" style="position:absolute;left:26px;top:24px;width:62px;height:62px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 40)}</div>
    <div class="is" style="position:absolute;left:104px;top:26px;font-size:25px;font-weight:700;color:#111">Assistente</div>
    <div class="is" style="position:absolute;left:104px;top:60px;font-size:19px;color:#7a7a76;display:flex;align-items:center;gap:8px"><i style="display:block;width:10px;height:10px;border-radius:50%;background:#2bd46b"></i>online agora</div>`);
  const av = head.querySelector('#av');
  const avGlow = mk(head, `left:20px;top:18px;width:74px;height:74px;border-radius:50%;box-shadow:0 0 0 0 rgba(255,196,0,.6)`);
  const msgs = mk(sheet, 'left:0;top:110px;width:432px;height:540px;overflow:hidden');
  mk(sheet, 'left:18px;bottom:22px;width:396px;height:66px;border-radius:33px;background:#f2f2ef', `<div class="is" style="position:absolute;left:24px;top:20px;font-size:21px;color:#9a9a96">Escreva uma mensagem…</div><div style="position:absolute;right:8px;top:8px;width:50px;height:50px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 L19 3 L13 19 L11 12Z" fill="#111"/></svg></div>`);
  // messages: [text, side, t_in, t_out]
  const MS = [['Oi! Vocês têm horário hoje?', 'r', 13.30], ['…', 'l', 13.78, 14.66], ['Temos sim! Às 15h ou às 17h. Qual prefere?', 'l', 14.68], ['17h, por favor!', 'r', 15.42], ['Agendado ✓ Te esperamos às 17h.', 'l', 16.14]];
  const bubs = MS.map(([s, side, ti, to]) => {
    const isT = s === '…';
    const bb = mk(msgs, `${side === 'r' ? 'right:22px' : 'left:22px'};top:0;max-width:300px;padding:${isT ? '20px 26px' : '16px 22px'};border-radius:26px;${side === 'r' ? 'background:#efefec;color:#111;border-bottom-right-radius:8px' : 'background:#111;color:#fff;border-bottom-left-radius:8px'};font-family:IS;font-weight:500;font-size:24px;line-height:1.28;transform-origin:${side === 'r' ? '100% 100%' : '0 100%'}`,
      isT ? `<div style="display:flex;gap:8px"><i class="d" style="display:block;width:12px;height:12px;border-radius:50%;background:#fff"></i><i class="d" style="display:block;width:12px;height:12px;border-radius:50%;background:#fff"></i><i class="d" style="display:block;width:12px;height:12px;border-radius:50%;background:#fff"></i></div>` : s);
    return { bb, ti, to, isT, h: 0 };
  });
  // outside badges
  const bdg1 = C(e, 846, 450, 300, 92, 'border-radius:24px;background:#111;display:flex;align-items:center;gap:16px;padding-left:22px;box-shadow:0 24px 50px rgba(0,0,0,.25)', `
    <svg width="44" height="50" viewBox="0 0 44 50"><circle cx="22" cy="28" r="18" stroke="${Y}" stroke-width="4.5" fill="none"/><path d="M22 28 L22 18" stroke="${Y}" stroke-width="4.5" stroke-linecap="round"/><rect x="16" y="2" width="12" height="6" rx="2" fill="${Y}"/></svg>
    <div><div class="mono" style="font-size:14px;color:#9a9a96;letter-spacing:.16em">resposta em</div><div style="font-family:U;font-weight:700;font-size:34px;color:#fff;line-height:1.1">0,8 s</div></div>`);
  const bdg2 = C(e, 196, 640, 270, 92, `border-radius:46px;background:${Y};display:flex;align-items:center;justify-content:center;gap:14px;box-shadow:0 24px 50px rgba(120,80,0,.25)`, `${sparkSVG('#111', 40)}<div style="font-family:U;font-weight:700;font-size:30px;color:#111">IA · 24/7</div>`);
  const orbit = C(e, 540, 800, 760, 760, 'border-radius:50%;border:2px dashed rgba(17,17,17,.18)');
  D.measured = false;
  D.u = t => {
    if (!D.measured) { bubs.forEach(b => b.h = b.bb.offsetHeight); D.measured = true }
    const inn = E.o4(P(t, 12.88, 13.18));
    const push = T(t, 13.2, 17.3, 1, 1.08, E.io3);
    const outS = E.i3(P(t, 17.3, 17.6));
    e.style.transform = `translateX(${((1 - inn) * 1250).toFixed(1)}px)`;
    set(ph, { s: push * L(1, .2, outS), y: T(t, 12.9, 13.3, 40, 0, E.o4), r: T(t, 12.88, 13.4, 6, 0, E.o4) });
    set(halo, { s: push * (1 + .04 * Math.sin(t * 3)), o: 1 - outS });
    set(orbit, { s: push * T(t, 16.0, 16.6, .85, 1, E.o4), r: t * 12, o: P(t, 16.0, 16.4) * (1 - outS) });
    const sh = E.o4(P(t, 13.0, 13.34));
    sheet.style.transform = `translateY(${((1 - sh) * 760).toFixed(1)}px)`;
    dim.style.opacity = sh;
    // stack bubbles bottom-up
    let yb = 520; const G = 14;
    for (let i = bubs.length - 1; i >= 0; i--) {
      const b = bubs[i]; const a = E.o4(P(t, b.ti, b.ti + .3)); const z = b.to ? 1 - E.o3(P(t, b.to, b.to + .12)) : 1;
      const w = a * z;
      if (w <= 0) { b.bb.style.opacity = 0; continue }
      b.bb.style.top = (yb - b.h).toFixed(1) + 'px';
      b.bb.style.opacity = Math.min(1, w * 1.4).toFixed(3);
      b.bb.style.transform = `scale(${(L(.5, 1, E.back(P(t, b.ti, b.ti + .32))) * (b.to ? z : 1)).toFixed(3)})`;
      if (b.isT) b.bb.querySelectorAll('.d').forEach((d, j) => d.style.transform = `translateY(${(-6 * Math.max(0, Math.sin((t * 7 - j * .5) * Math.PI))).toFixed(2)}px)`);
      yb -= (b.h + G) * w;
    }
    set(bdg1, { s: E.back2(P(t, 14.72, 15.0)) * push * (1 - outS), r: 5 - 5 * ring(t, 14.9, 2, 5), o: P(t, 14.72, 14.78), y: T(t, 14.72, 15.1, 30, 0, E.o4) });
    set(bdg2, { s: E.back2(P(t, 16.06, 16.34)) * push * (1 - outS), r: -5, o: P(t, 16.06, 16.12), y: T(t, 16.06, 16.4, 30, 0, E.o4) });
    const g = P(t, 16.06, 16.9);
    avGlow.style.boxShadow = `0 0 0 ${(g * 26).toFixed(1)}px rgba(255,196,0,${((1 - g) * .6).toFixed(3)})`;
    av.style.transform = `scale(${(1 + .12 * ring(t, 16.06, 3, 6)).toFixed(3)})`;
  };
}

// ======================= SCENE E: kinetic type "Quer um site que trabalha?" (17.36 – 20.95) =======================
const Ek = scene(17.36, 20.95, 'transparent');
{
  const e = Ek.e;
  const iris = C(e, 540, 800, 100, 100, 'border-radius:50%;background:#0b0b0b');
  const grp = mk(e, 'left:0;top:0;width:1080px;height:1920px');
  const LINES = [['QUER UM', 17.52, '#fff'], ['SITE QUE', 18.0, '#fff'], ['TRABALHA?', 18.48, Y]];
  const lines = LINES.map(([s, ti, col], i) => {
    const m = mk(grp, `left:0;top:${560 + i * 150}px;width:1080px;height:150px;overflow:hidden`);
    const inn = mk(m, `left:0;top:0;width:1080px;height:150px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:${i === 2 ? 122 : 116}px;letter-spacing:-.03em;color:${col};line-height:1`, s);
    return { m, inn, ti };
  });
  const grpB = mk(e, 'left:0;top:0;width:1080px;height:1920px');
  const lab = C(grpB, 540, 1090, 900, 50, 'text-align:center;font-size:30px;color:#fff', 'clica no botão', 'mono');
  const arrow = C(grpB, 540, 1290, 140, 260, '', `<svg width="140" height="260" viewBox="0 0 140 260" fill="none" stroke="${Y}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"><path id="ash" d="M70 14 L70 236" pathLength="1"/><path id="ahd" d="M18 184 L70 236 L122 184" pathLength="1"/></svg>`);
  const ash = arrow.querySelector('#ash'), ahd = arrow.querySelector('#ahd');
  const lab2 = C(grpB, 540, 1482, 900, 50, `text-align:center;font-size:30px;color:${Y}`, 'aí embaixo', 'mono');
  const dash = mk(grpB, `left:537px;top:1528px;width:6px;height:400px;background:repeating-linear-gradient(180deg,${Y} 0 18px,transparent 18px 34px);transform-origin:50% 0`);
  Ek.u = t => {
    set(iris, { s: E.o4(P(t, 17.36, 17.66)) * 46 });
    lines.forEach((l, i) => {
      const k = E.o5(P(t, l.ti, l.ti + .42));
      l.inn.style.transform = `translateY(${((1 - k) * 150).toFixed(1)}px)`;
      l.inn.style.letterSpacing = `${L(.04, -.03, k).toFixed(3)}em`;
    });
    // TRABALHA? punch
    lines[2].inn.style.transform += ` scale(${(1 + .07 * ring(t, 18.62, 3, 7)).toFixed(3)})`;
    const up = E.io5(P(t, 18.96, 19.42));
    const ex = E.i3(P(t, 20.6, 20.9));
    grp.style.transformOrigin = '540px 785px';
    grp.style.transform = `translateY(${(-300 * up - 520 * ex).toFixed(1)}px) scale(${L(1, .8, up).toFixed(3)})`;
    grp.style.opacity = 1 - ex;
    grpB.style.transform = `translateY(${(-300 * up - 520 * ex).toFixed(1)}px)`;
    grpB.style.opacity = 1 - ex;
    set(lab, { y: T(t, 19.0, 19.4, 40, 0, E.o4), o: P(t, 19.0, 19.2) });
    const ad = P(t, 19.44, 19.74);
    ash.style.strokeDasharray = '1 1'; ash.style.strokeDashoffset = (1 - E.o3(ad)).toFixed(3);
    ahd.style.strokeDasharray = '1 1'; ahd.style.strokeDashoffset = (1 - E.o3(P(t, 19.62, 19.86))).toFixed(3);
    const bounce = t > 19.86 ? Math.abs(Math.sin((t - 19.86) * Math.PI * 2.4)) * 26 * (t > 20.1 ? 1 : .4) : 0;
    set(arrow, { y: bounce });
    set(lab2, { y: T(t, 19.86, 20.2, 40, 0, E.o4), o: P(t, 19.86, 20.0) });
    dash.style.transform = `scaleY(${E.o4(P(t, 20.1, 20.5)).toFixed(3)})`;
  };
}

// ======================= SCENE F: os outros só existem (20.62 – 23.6) =======================
const F = scene(20.62, 23.6, '#121212');
{
  const e = F.e;
  const lbl = C(e, 540, 330, 600, 50, 'text-align:center;font-size:28px;color:#77776f', '— os outros —', 'mono');
  const gb = browser(e, 540, 700, 720, 480, 'grey');
  gb.body.innerHTML = `<div class="ln" style="left:30px;top:22px;width:64px;height:20px;background:#444"></div>
   <div class="ln" style="left:36px;top:96px;width:290px;height:30px;background:#474747"></div><div class="ln" style="left:36px;top:138px;width:220px;height:30px;background:#474747"></div>
   <div class="ln" style="left:36px;top:196px;width:250px;height:12px;background:#424242"></div><div class="ln" style="left:36px;top:218px;width:200px;height:12px;background:#424242"></div>
   <div class="ln" style="left:36px;top:262px;width:140px;height:44px;border-radius:22px;background:#4b4b4b"></div>
   <div class="ln" style="left:380px;top:84px;width:300px;height:250px;border-radius:14px;background:#404040"></div>`;
  let web = ''; const angs = [0, 22, 45, 68, 90].map(a => a * Math.PI / 180);
  angs.forEach(a => web += `<path d="M720 0 L${(720 - Math.cos(a) * 190).toFixed(1)} ${(Math.sin(a) * 190).toFixed(1)}"/>`);
  [40, 80, 120, 160].forEach(rr => { let d = ''; angs.forEach((a, i) => { const x = 720 - Math.cos(a) * rr, y = Math.sin(a) * rr; d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) }); web += `<path d="${d}"/>` });
  mk(gb.body, 'left:0;top:0;width:720px;height:434px', `<svg width="720" height="434" fill="none" stroke="#6a6a66" stroke-width="1.6">${web}</svg>`);
  const ecg = mk(e, 'left:0;top:1000px;width:1080px;height:240px', `<svg width="1080" height="240" viewBox="0 0 1080 240"><path id="ecg" fill="none" stroke="#cfcfca" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><circle id="eh" r="9" fill="#fff"/></svg>`);
  const ep = ecg.querySelector('#ecg'), eh = ecg.querySelector('#eh');
  const beat = ph => { // PQRST, ph in [0,1)
    if (ph < .08) return -8 * Math.sin(ph / .08 * Math.PI);
    if (ph < .14) return 0; if (ph < .17) return 14 * (ph - .14) / .03; if (ph < .21) return 14 - 104 * (ph - .17) / .04;
    if (ph < .25) return -90 + 120 * (ph - .21) / .04; if (ph < .28) return 30 - 30 * (ph - .25) / .03;
    if (ph < .44) return -16 * Math.sin((ph - .3) / .14 * Math.PI) * (ph > .3); return 0;
  };
  F.u = t => {
    e.style.opacity = P(t, 20.62, 20.82);
    const up = E.io5(P(t, 23.18, 23.52));
    e.style.transform = `translateY(${(-up * 420).toFixed(1)}px) scale(${L(1, .94, up).toFixed(3)})`;
    set(lbl, { y: T(t, 20.66, 21.0, 30, 0, E.o4), o: P(t, 20.66, 20.86) });
    set(gb, { y: T(t, 20.66, 21.1, 90, 0, E.o4), o: P(t, 20.66, 20.86) * (1 - .45 * P(t, 22.58, 23.0)), s: T(t, 20.66, 21.2, .94, 1, E.o4) });
    gb.style.filter = `brightness(${(1 - .35 * P(t, 22.58, 23.0)).toFixed(3)})`;
    // ECG sweep
    const sp = 640, t0 = 20.74, flat = 22.58;
    const xs = ((t - t0) * sp) % 1080;
    let d = '';
    for (let x = 0; x <= 1080; x += 4) {
      const back = ((xs - x) + 1080) % 1080; const tx = t - back / sp;
      let yv = 0; if (tx >= t0 && tx < flat) yv = beat(((tx - t0) % .78) / .78);
      if (tx < t0) yv = 0;
      d += (x ? 'L' : 'M') + x + ' ' + (120 + yv).toFixed(1);
    }
    ep.setAttribute('d', d);
    eh.setAttribute('cx', xs.toFixed(1)); eh.setAttribute('cy', 120);
    ep.style.opacity = P(t, 20.74, 20.9);
    ep.style.stroke = t > flat ? '#fff' : '#bdbdb7';
    eh.style.opacity = P(t, 20.74, 20.9);
    // fade the part ahead of the head
    ep.style.webkitMaskImage = 'none';
  };
}

// ======================= SCENE G: o seu atrai, convence e conversa (23.16 – 26.85) =======================
const G = scene(23.16, 26.85, Y);
{
  const e = G.e;
  mk(e, 'inset:0;background:radial-gradient(ellipse 70% 45% at 50% 35%,rgba(255,255,255,.35),rgba(255,255,255,0) 70%)');
  const lbl = C(e, 540, 300, 600, 50, 'text-align:center;font-size:28px;color:#4d3b00', '— o seu —', 'mono');
  const ob = browser(e, 540, 620, 680, 450, 'dark');
  ob.style.boxShadow = '0 40px 90px rgba(90,60,0,.35)';
  ob.body.innerHTML = `<div class="a" style="left:28px;top:20px">${sym('#111', 56)}</div>
    <div class="a is" style="left:420px;top:24px;font-size:16px;font-weight:600;color:#333;word-spacing:18px">Início Loja Contato</div>
    <div class="a" style="left:32px;top:92px;font-family:U;font-weight:700;font-size:33px;color:#111;line-height:1.12;letter-spacing:-.02em">Seu negócio,<br>trabalhando.</div>
    <div class="ln" style="left:32px;top:200px;width:240px;height:11px;background:#ececE8"></div><div class="ln" style="left:32px;top:222px;width:190px;height:11px;background:#ececE8"></div>
    <div class="a is" style="left:32px;top:262px;width:170px;height:50px;border-radius:25px;background:${Y};font-size:18px;font-weight:700;color:#111;display:flex;align-items:center;justify-content:center">Fale conosco</div>
    <div class="a" style="left:360px;top:84px;width:290px;height:300px;border-radius:16px;background:#111;overflow:hidden"><svg width="290" height="300" viewBox="0 0 290 300"><path d="M20 250 L70 222 L110 232 L150 170 L190 182 L230 110 L272 60" fill="none" stroke="${Y}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="272" cy="60" r="12" fill="${Y}"/></svg></div>`;
  const VB = [['ATRAI', 23.86], ['CONVENCE', 24.66], ['CONVERSA', 25.62]];
  const verbs = VB.map(([s, ti], i) => {
    const m = mk(e, `left:0;top:${1000 + i * 150}px;width:1080px;height:150px;overflow:hidden`);
    const inn = mk(m, `left:0;top:0;width:1080px;height:150px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:112px;letter-spacing:-.035em;color:#111;line-height:1`, s);
    return { m, inn, ti };
  });
  // reactions
  const CUR = [[-120, 380, 360, 560, 23.88], [1200, 300, 690, 520, 23.95], [-100, 980, 420, 700, 24.0], [1180, 900, 640, 690, 24.06], [540, -120, 520, 480, 24.12]];
  const curs = CUR.map(() => C(e, 0, 0, 56, 73, '', CURSOR(56, '#111', '#fff')));
  const pulse = C(e, 540, 620, 680, 450, 'border-radius:24px;border:5px solid #111');
  const check = C(e, 860, 420, 130, 130, 'border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(90,60,0,.35)', `<svg width="70" height="70" viewBox="0 0 70 70"><path d="M14 36 L29 51 L57 20" stroke="${Y}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  const rstars = C(e, 540, 905, 380, 60, 'display:flex;justify-content:center;gap:12px', [0, 1, 2, 3, 4].map(() => `<div class="rs">${starSVG('#111', 54)}</div>`).join(''));
  const rs = [...rstars.querySelectorAll('.rs')];
  const chat = C(e, 236, 790, 230, 110, 'border-radius:34px 34px 34px 10px;background:#fff;box-shadow:0 20px 40px rgba(90,60,0,.3);display:flex;align-items:center;justify-content:center;gap:12px', '<i class="d" style="display:block;width:16px;height:16px;border-radius:50%;background:#111"></i><i class="d" style="display:block;width:16px;height:16px;border-radius:50%;background:#111"></i><i class="d" style="display:block;width:16px;height:16px;border-radius:50%;background:#111"></i>');
  const cds = [...chat.querySelectorAll('.d')];
  G.u = t => {
    const inn = E.io5(P(t, 23.16, 23.5));
    const out = E.io5(P(t, 26.4, 26.78));
    e.style.transform = `translateY(${((1 - inn) * 1920 - out * 500).toFixed(1)}px)`;
    e.style.borderRadius = `${(50 * (1 - inn)).toFixed(1)}px ${(50 * (1 - inn)).toFixed(1)}px 0 0`;
    set(lbl, { y: T(t, 23.3, 23.6, 30, 0, E.o4), o: P(t, 23.3, 23.5) });
    const hit = .035 * ring(t, 23.92, 3, 7) + .03 * ring(t, 24.7, 3, 7) + .03 * ring(t, 25.66, 3, 7);
    set(ob, { y: T(t, 23.3, 23.7, 70, 0, E.o4) + 5 * Math.sin(t * 1.9), s: T(t, 23.3, 23.7, .92, 1, E.o4) + hit });
    verbs.forEach((v, i) => {
      const k = E.o5(P(t, v.ti, v.ti + .4));
      const next = verbs[i + 1]; const dimv = next ? E.o3(P(t, next.ti, next.ti + .3)) : 0;
      v.inn.style.transform = `translateY(${((1 - k) * 150).toFixed(1)}px)`;
      v.inn.style.opacity = (1 - .72 * dimv).toFixed(3);
    });
    curs.forEach((c, i) => { const [x0, y0, x1, y1, st] = CUR[i]; const k = E.o4(P(t, st, st + .42)); set(c, { x: L(x0, x1, k), y: L(y0, y1, k), o: P(t, st, st + .06) * (1 - P(t, 24.6, 24.8)), s: 1 - .2 * Math.sin(Math.PI * P(t, st + .42, st + .56)) }) });
    const pp = P(t, 24.3, 24.9);
    set(pulse, { s: 1 + pp * .22, o: (1 - pp) * (t > 24.3 ? .8 : 0) });
    set(check, { s: E.back2(P(t, 24.68, 24.96)), r: -10 + 10 * E.o3(P(t, 24.68, 25.0)), o: P(t, 24.68, 24.74) });
    rs.forEach((s, i) => { const st = 24.74 + i * .06; s.style.transform = `scale(${E.back2(P(t, st, st + .26)).toFixed(3)})`; s.style.opacity = P(t, st, st + .05) });
    set(chat, { s: E.back2(P(t, 25.62, 25.9)), o: P(t, 25.62, 25.68), y: T(t, 25.62, 25.95, 30, 0, E.o4) });
    cds.forEach((d, j) => d.style.transform = `translateY(${(-7 * Math.max(0, Math.sin((t * 6 - j * .45) * Math.PI))).toFixed(2)}px)`);
  };
}

// ======================= SCENE H: portfolio wall + logo (26.38 – 28.7) =======================
const Hs = scene(26.38, 28.7, '#0a0a0a');
{
  const e = Hs.e;
  const IM = ['deck', 'jgc', 'kundara', 'alpha', 'poenza', 'brother', 'paint', 'remodel', 'roof'];
  const wall = mk(e, 'left:540px;top:900px;width:0;height:0');
  const inner = mk(wall, 'left:0;top:0;width:0;height:0;transform:perspective(1900px) rotateX(26deg) rotateZ(-15deg) scale(1.22)');
  const cols = [0, 1, 2].map(c => {
    const col = mk(inner, `left:${(c - 1) * 640 - 300}px;top:-1500px;width:600px;height:3200px`);
    for (let i = 0; i < 9; i++) { const nm = IM[(i * 2 + c * 3) % IM.length]; mk(col, `left:0;top:${i * 345}px;width:600px;height:291px;border-radius:18px;overflow:hidden;background:#222 url(img/${nm}.jpg) center/cover;box-shadow:0 30px 60px rgba(0,0,0,.5)`) }
    return col;
  });
  const shade = mk(e, 'inset:0;background:#0a0a0a');
  const lg = C(e, 540, 760, 680, 360);
  const s1 = C(lg, 340, 90, 400, 199, '', sym('#fff', 400));
  const wmw = C(lg, 340, 262, 640, 104, '', wmLetters('#fff', 640));
  const letters = [...wmw.querySelectorAll('.L')];
  const tl = C(lg, 340, 348, 520, 32, '', tagline('#fff', 520));
  const uline = C(e, 540, 1000, 300, 8, `background:${Y};border-radius:4px;transform-origin:0 50%`);
  Hs.u = t => {
    const inn = E.io5(P(t, 26.38, 26.74));
    e.style.transform = `translateY(${((1 - inn) * 1920).toFixed(1)}px)`;
    cols.forEach((c, i) => c.style.transform = `translateY(${((i % 2 ? -1 : 1) * (t - 26.4) * 260 + (i % 2 ? 0 : -300)).toFixed(1)}px)`);
    shade.style.opacity = (.12 + .68 * E.o3(P(t, 27.12, 27.4))).toFixed(3);
    wall.style.filter = `blur(${(5 * P(t, 27.12, 27.4)).toFixed(2)}px)`;
    set(s1, { s: T(t, 27.18, 27.5, 1.6, 1, E.o5), o: P(t, 27.18, 27.26), b: T(t, 27.18, 27.36, 18, 0) });
    letters.forEach((l, i) => { const st = 27.32 + i * .045; const k = E.o4(P(t, st, st + .34)); l.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; l.style.opacity = P(t, st, st + .12) });
    set(tl, { o: P(t, 27.62, 27.9), y: T(t, 27.62, 27.95, 14, 0, E.o4) });
    uline.style.transform = `translate(-50%,-50%) scaleX(${E.io3(P(t, 27.86, 28.2)).toFixed(3)})`;
    uline.style.transformOrigin = '0 50%';
    uline.style.left = '390px'; uline.style.transform = `translate(0,-50%) scaleX(${E.io3(P(t, 27.86, 28.2)).toFixed(3)})`;
    lg.style.transform = `translate(-50%,-50%) scale(${(T(t, 27.2, 28.6, 1, 1.04, E.lin) * L(1, .9, E.i3(P(t, 28.24, 28.6)))).toFixed(4)})`;
  };
}

// ======================= SCENE I: CTA (28.22 – end) =======================
const I = scene(28.22, 40, 'transparent');
{
  const e = I.e;
  const disc = C(e, 540, 800, 100, 100, `border-radius:50%;background:${Y}`);
  const bgl = mk(e, 'inset:0;background:radial-gradient(ellipse 70% 40% at 50% 45%,rgba(255,255,255,.35),rgba(255,255,255,0) 70%);opacity:0');
  const lg = C(e, 540, 470, 460, 250);
  const s1 = C(lg, 230, 62, 240, 119, '', sym('#111', 240));
  const wm = C(lg, 230, 172, 420, 68, '', wmLetters('#111', 420));
  const tl = C(lg, 230, 228, 330, 21, '', tagline('#111', 330));
  const btn = C(e, 540, 900, 840, 180, 'border-radius:90px;background:#111;box-shadow:0 34px 70px rgba(80,50,0,.35)', `
    <div style="position:absolute;left:66px;top:0;height:180px;display:flex;align-items:center;font-family:U;font-weight:700;font-size:50px;color:#fff;letter-spacing:-.015em">Fala com a gente</div>
    <div id="ac" style="position:absolute;right:22px;top:22px;width:136px;height:136px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center"><svg width="56" height="56" viewBox="0 0 56 56"><path d="M8 28 H46 M30 12 L46 28 L30 44" stroke="#111" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`);
  const ac = btn.querySelector('#ac');
  const rip = C(e, 540, 900, 840, 180, 'border-radius:90px;border:5px solid #111');
  const cur = C(e, 0, 0, 64, 83, '', CURSOR(64, '#fff', '#111'));
  const REC = [['Google', 250], ['Vitrine', 540], ['IA 24/7', 830]];
  const recs = REC.map(([s, x]) => C(e, x, 1120, 250, 76, 'border-radius:38px;border:3px solid #111;display:flex;align-items:center;justify-content:center;gap:12px;font-family:IS;font-weight:700;font-size:30px;color:#111', `<svg width="26" height="26" viewBox="0 0 26 26"><path d="M5 13.5 L11 19 L21 7" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>${s}`));
  I.u = t => {
    set(disc, { s: E.o4(P(t, 28.24, 28.64)) * 46 });
    bgl.style.opacity = P(t, 28.5, 28.9);
    set(lg, { y: T(t, 28.42, 28.82, 40, 0, E.o4), o: P(t, 28.42, 28.56) });
    set(s1, { s: T(t, 28.42, 28.8, .7, 1, E.back) });
    const click = ring(t, 28.86, 3, 9);
    set(btn, { s: E.back(P(t, 28.36, 28.7)) * (1 - .05 * Math.sin(Math.PI * P(t, 28.84, 29.0))) + .02 * click, o: P(t, 28.36, 28.44), y: T(t, 28.36, 28.7, 60, 0, E.o4) });
    const rp = P(t, 28.9, 29.5);
    set(rip, { s: 1 + rp * .22, o: (1 - rp) * (t > 28.9 ? .7 : 0) });
    // arrow nudge loop after click
    const nud = t > 29.3 ? Math.max(0, Math.sin((t - 29.3) * Math.PI * 1.6)) ** 2 * 12 : 0;
    ac.style.transform = `translateX(${nud.toFixed(2)}px) scale(${(1 + .06 * ring(t, 29.34, 3, 7)).toFixed(3)})`;
    // cursor path
    const k = E.o4(P(t, 28.44, 28.84));
    const cx = L(1000, 806, k), cy = L(1460, 930, k);
    recs.forEach((r, i) => { const st = 29.36 + i * .1; set(r, { y: T(t, st, st + .4, 40, 0, E.o4), s: E.back(P(t, st, st + .36)), o: P(t, st, st + .08) }) });
    set(cur, { x: cx, y: cy, s: 1 - .18 * Math.sin(Math.PI * P(t, 28.84, 29.0)), o: P(t, 28.44, 28.5) * (1 - P(t, 29.8, 30.1)) });
  };
}

// ======================= CAPTIONS =======================
const WORDS = [["O", 0.00], ["mercado", 0.16], ["europeu", 0.56], ["te", 0.96], ["vende", 1.12], ["um", 1.52], ["site", 1.68], ["parado.", 2.08],
["Bonito,", 2.96], ["mas", 3.68], ["parado.", 4.00],
["Você", 4.80], ["precisa", 5.12], ["de", 5.52], ["um", 5.68], ["site", 5.76], ["que", 6.16], ["trabalha.", 6.40],
["Ele", 7.22], ["aparece", 7.46], ["no", 7.94], ["Google", 8.02], ["pelo", 8.42], ["seu", 8.66], ["Meu", 8.90], ["Negócio.", 9.14],
["Mostra", 9.98], ["seus", 10.46], ["produtos", 10.70], ["como", 11.18], ["uma", 11.42], ["vitrine", 11.58], ["profissional", 12.22],
["e", 12.94], ["atende", 13.18], ["cada", 13.74], ["cliente", 13.98], ["na", 14.46], ["hora,", 14.70], ["com", 15.18], ["um", 15.34], ["atendente", 15.50], ["inteligente", 16.06], ["dentro", 16.78], ["dele.", 17.02],
["Quer", 17.54], ["um", 17.94], ["site", 18.02], ["que", 18.34], ["trabalha?", 18.50], ["Clica", 18.98], ["no", 19.46], ["botão", 19.54], ["aí", 19.86], ["embaixo.", 20.10],
["Enquanto", 20.76], ["o", 21.24], ["site", 21.40], ["dos", 21.72], ["outros", 21.96], ["só", 22.36], ["existe,", 22.60],
["o", 23.32], ["seu", 23.48], ["atrai,", 23.88], ["convence", 24.68], ["e", 25.40], ["conversa.", 25.64],
["É", 26.52], ["isso", 26.68], ["que", 26.92], ["a", 27.08], ["New", 27.24], ["Way", 27.56], ["entrega.", 27.88],
["Clica", 28.36], ["no", 28.78], ["botão", 28.86], ["e", 29.18], ["fala", 29.34], ["com", 29.66], ["a", 29.82], ["gente!", 29.90]];
// [from, to, emphasised word idx[], end]
const CH = [[0, 2, [2], 1.02], [3, 7, [7], 2.86], [8, 10, [10], 4.66], [11, 13, [], 5.62], [14, 17, [17], 7.12],
[18, 21, [21], 8.38], [22, 25, [24, 25], 9.9], [26, 28, [28], 11.14], [29, 32, [31, 32], 12.86],
[33, 36, [34], 14.4], [37, 38, [37, 38], 15.12], [39, 41, [41], 16.0], [42, 44, [42], 17.36],
[55, 59, [59], 22.3], [60, 61, [61], 23.2],
[68, 74, [72, 73], 28.2], [75, 77, [77], 29.14], [78, 82, [79, 80, 81, 82], 31.3]];
const capEl = $('#cap');
let capIdx = -1, capSpans = [];
function themeAt(t) { if (t < 6.42) return 'd'; if (t < 7.32) return 'y'; if (t < 9.98) return 'l'; if (t < 12.95) return 'd'; if (t < 17.42) return 'l'; if (t < 23.3) return 'd'; if (t < 26.5) return 'y'; if (t < 28.36) return 'd'; return 'y' }
function captions(t) {
  let ci = -1;
  for (let i = 0; i < CH.length; i++) { const [a, , , end] = CH[i]; if (t >= WORDS[a][1] - .1 && t < end) ci = i }
  if (ci !== capIdx) {
    capIdx = ci; capEl.innerHTML = ''; capSpans = [];
    if (ci >= 0) { const [a, b, em] = CH[ci]; for (let i = a; i <= b; i++) { const s = document.createElement('span'); const isE = em.includes(i); if (isE) s.className = 'em'; s.textContent = WORDS[i][0]; if (isE) { const h = document.createElement('i'); h.className = 'hl'; s.appendChild(h) } capEl.appendChild(s); capSpans.push({ s, i, isE }) } }
  }
  if (ci < 0) return;
  const th = themeAt(t); const end = CH[ci][3];
  const ex = P(t, end - .16, end);
  capSpans.forEach(({ s, i, isE }) => {
    const st = WORDS[i][1] - .05; const k = P(t, st, st + .26);
    const col = th === 'd' ? (isE ? Y : '#fff') : '#111';
    s.style.color = col;
    s.style.textShadow = th === 'd' ? '0 6px 30px rgba(0,0,0,.55)' : 'none';
    const pop = isE ? 1 + .14 * (1 - E.o3(P(t, st, st + .3))) * (k > 0 ? 1 : 0) : 1;
    s.style.transform = `translateY(${((1 - E.o4(k)) * 26 - ex * 16).toFixed(2)}px) scale(${pop.toFixed(3)})`;
    s.style.opacity = (E.o2(k) * (1 - ex)).toFixed(3);
    s.style.filter = (k < 1 || ex > 0) ? `blur(${((1 - E.o3(k)) * 10 + ex * 8).toFixed(2)}px)` : 'none';
    const hl = s.querySelector('.hl');
    if (hl) { hl.style.background = th === 'l' ? Y : th === 'y' ? '#fff' : 'transparent'; hl.style.transform = `scaleX(${E.io3(P(t, st + .1, st + .38)).toFixed(3)})` }
  });
}

// ======================= camera, grain =======================
const SHAKE = [[2.08, 7], [6.4, 12], [9.3, 4], [18.5, 9], [23.9, 5], [24.7, 5], [25.66, 5], [27.2, 12], [28.86, 6]];
const gctx = $('#grain').getContext('2d');
{ const id = gctx.createImageData(740, 1160); let s = 1234567; for (let i = 0; i < id.data.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; const v = s % 256; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255 } gctx.putImageData(id, 0, 0) }
const grain = $('#grain'), vig = $('#vig');
const VIG_D = 'radial-gradient(ellipse 75% 60% at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.34) 100%)';
const VIG_Y = 'radial-gradient(ellipse 80% 65% at 50% 45%,rgba(0,0,0,0) 60%,rgba(150,80,0,.16) 100%)';
const VIG_L = 'radial-gradient(ellipse 80% 65% at 50% 45%,rgba(0,0,0,0) 62%,rgba(0,0,0,.06) 100%)';
function seek(t, f) {
  for (const s of scenes) { const on = t >= s.a && t < s.b; vis(s.e, on); if (on) s.u(t) }
  let sx = 0, sy = 0, rot = 0;
  for (const [ti, amp] of SHAKE) { if (t < ti || t > ti + .6) continue; const d = t - ti, k = Math.exp(-d * 9) * amp; sx += Math.sin(d * 71 + ti) * k; sy += Math.cos(d * 59 + ti * 2) * k; rot += Math.sin(d * 43) * k * .025 }
  // gentle global breathing
  const br = 1 + .006 * Math.sin(t * .9);
  cam.style.transform = `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${br.toFixed(4)})`;
  captions(t);
  const th = themeAt(t);
  vig.style.background = th === 'd' ? VIG_D : th === 'y' ? VIG_Y : VIG_L;
  grain.style.opacity = th === 'd' ? .11 : th === 'y' ? .08 : .06;
  const fi = f ?? Math.round(t * 30);
  const r1 = (fi * 7919) % 200, r2 = (fi * 104729) % 200;
  grain.style.transform = `translate(${-r1}px,${-r2}px)`;
}
window.seek = seek;

// ======================= SFX cue list (mixed in mix.py) =======================
window.SFX = [
  { t: .02, type: 'swell', g: .45 }, { t: .1, type: 'shimmer', g: .32 },
  { t: 1.03, type: 'whoosh', g: .5 }, { t: 1.3, type: 'tick', g: .5 },
  { t: 2.07, type: 'stamp', g: .55 },
  { t: 2.96, type: 'shine', g: .55 },
  { t: 3.78, type: 'pop', g: .22 },
  { t: 4.84, type: 'swish', g: .38 },
  { t: 6.38, type: 'toggle', g: .7 }, { t: 6.41, type: 'impact', g: .55 },
  { t: 6.5, type: 'pop', g: .16 }, { t: 6.78, type: 'pop', g: .14 },
  { t: 7.08, type: 'whoosh', g: .45 },
  ...Array.from({ length: 10 }, (_, i) => ({ t: 7.38 + i * .062 + (i % 3) * .008, type: 'key', g: .2 })),
  { t: 8.03, type: 'swish', g: .3 },
  { t: 9.1, type: 'drop', g: .45 }, { t: 9.3, type: 'ding', g: .22 },
  { t: 9.62, type: 'zoom', g: .5 },
  { t: 10.1, type: 'flap', g: .45 },
  { t: 10.66, type: 'pop', g: .16 }, { t: 10.82, type: 'pop', g: .14 }, { t: 10.98, type: 'pop', g: .14 },
  { t: 11.56, type: 'switch', g: .4 },
  { t: 12.18, type: 'shine', g: .4 }, { t: 12.24, type: 'stamp', g: .3 },
  { t: 12.8, type: 'whoosh', g: .5 },
  { t: 13.3, type: 'msg', g: .32 }, { t: 14.68, type: 'msg2', g: .3 }, { t: 15.42, type: 'msg', g: .22 }, { t: 16.06, type: 'shimmer', g: .3 }, { t: 16.14, type: 'msg2', g: .2 },
  { t: 17.34, type: 'swell', g: .38 },
  { t: 17.52, type: 'hit', g: .28 }, { t: 18.0, type: 'hit', g: .28 }, { t: 18.48, type: 'impact', g: .5 },
  { t: 18.96, type: 'swish', g: .3 }, { t: 19.44, type: 'whoosh', g: .28 }, { t: 20.1, type: 'pop', g: .28 },
  { t: 20.6, type: 'whoosh', g: .35 },
  { t: 22.58, type: 'flat', g: .2 },
  { t: 23.14, type: 'swish', g: .45 },
  { t: 23.86, type: 'hit', g: .42 }, { t: 24.66, type: 'hit', g: .42 }, { t: 25.62, type: 'hit', g: .42 }, { t: 25.66, type: 'msg', g: .2 },
  { t: 26.36, type: 'whoosh', g: .45 },
  { t: 27.18, type: 'boom', g: .6 }, { t: 27.86, type: 'shine', g: .3 },
  { t: 28.2, type: 'swell', g: .35 },
  { t: 28.85, type: 'click', g: .55 },
  { t: 29.9, type: 'chime', g: .28 },
];

window.ready = document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => i.onload = i.onerror = r)))).then(() => {
  // preload background images
  const urls = ['deck', 'jgc', 'kundara', 'alpha', 'poenza', 'brother', 'paint', 'remodel', 'roof'].map(n => `img/${n}.jpg`);
  return Promise.all(urls.map(u => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = u })));
}).then(() => { seek(0, 0); return true });
