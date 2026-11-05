// Shared motion helpers: easing, transforms, brand assets, caption engine, camera/grain. Everything is a pure function of t.
const W = 1080, H = 1920, Y = '#FFC400';
const $ = s => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const P = (t, a, b) => clamp((t - a) / (b - a));
const L = (a, b, x) => a + (b - a) * x;
const E = {
  lin: x => x, o2: x => 1 - (1 - x) ** 2, o3: x => 1 - (1 - x) ** 3, o4: x => 1 - (1 - x) ** 4, o5: x => 1 - (1 - x) ** 5,
  i2: x => x * x, i3: x => x ** 3, i4: x => x ** 4,
  io2: x => x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2,
  io3: x => x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2, io5: x => x < .5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2,
  back: x => { const c = 1.70158; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2 },
  back2: x => { const c = 2.4; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2 },
  el: x => x === 0 ? 0 : x === 1 ? 1 : 2 ** (-9 * x) * Math.sin((x * 9 - .75) * 2 * Math.PI / 3) + 1,
};
const T = (t, a, b, v0, v1, e = E.o3) => L(v0, v1, e(P(t, a, b)));
const ring = (t, a, f = 9, d = 6) => t < a ? 0 : Math.exp(-(t - a) * d) * Math.sin((t - a) * f * 2 * Math.PI);
const win = (t, a, b, fi = .12, fo = .12) => P(t, a, a + fi) * (1 - P(t, b - fo, b)); // fade window

function mk(par, css = '', html = '', cls = '') { const e = document.createElement('div'); e.style.cssText = 'position:absolute;' + css; if (cls) e.className = cls; e.innerHTML = html; par.appendChild(e); return e }
function C(par, x, y, w, h, css = '', html = '', cls = '') { const e = mk(par, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;` + css, html, cls); e._c = 1; set(e, {}); return e }
function set(e, o) {
  let tr = e._c ? 'translate(-50%,-50%) ' : '';
  if (o.x || o.y || o.z) tr += `translate3d(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px,${(o.z || 0).toFixed(2)}px) `;
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

// ---------- brand ----------
const SYM_VB = '396 370 282 140', WM_VB = '200 545 680 110', TAG_VB = '262 676 550 34';
const sym = (col, w, extra = '') => `<svg viewBox="${SYM_VB}" width="${w}" height="${w * 140 / 282}" style="display:block;${extra}">${LOGO.symbol.map(d => `<path fill="${col}" d="${d}"/>`).join('')}</svg>`;
const wmLetters = (col, w) => `<svg viewBox="${WM_VB}" width="${w}" height="${w * 110 / 680}" style="display:block;overflow:visible">${LOGO.wordmark.map(d => `<path class="L" fill="${col}" fill-rule="evenodd" d="${d}"/>`).join('')}</svg>`;
const tagline = (col, w) => `<svg viewBox="${TAG_VB}" width="${w}" height="${w * 34 / 550}" style="display:block"><path fill="${col}" fill-rule="evenodd" d="${LOGO.tagline.join('')}"/></svg>`;
const STAR = '50,4 61,38 97,38 68,59 79,93 50,72 21,93 32,59 3,38 39,38';
const starSVG = (fill, sz, stroke = 'none') => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" style="display:block"><polygon points="${STAR}" fill="${fill}" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/></svg>`;
const SPARK = 'M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z';
const sparkSVG = (fill, sz) => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" style="display:block"><path d="${SPARK}" fill="${fill}"/></svg>`;
const CURSOR = (sz, fill = '#fff', st = '#000') => `<svg viewBox="-4 -4 40 52" width="${sz}" height="${sz * 52 / 40}" style="display:block;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))"><path d="M0 0 L0 34 L9 26 L15 40 L21 37 L15 24 L27 24 Z" fill="${fill}" stroke="${st}" stroke-width="2.6" stroke-linejoin="round"/></svg>`;
// line icons (64 grid)
const ICO = {
  site: (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="11" width="52" height="42" rx="7"/><path d="M6 23 H58"/><circle cx="14" cy="17" r="1.2" fill="${c}"/><circle cx="20" cy="17" r="1.2" fill="${c}"/><path d="M15 33 H33 M15 42 H27"/><rect x="40" y="31" width="10" height="13" rx="2"/></svg>`,
  pin: (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 58 C32 58 12 38 12 25 A20 20 0 1 1 52 25 C52 38 32 58 32 58Z"/><circle cx="32" cy="25" r="7"/></svg>`,
  chat: (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14 H54 V44 H30 L18 54 V44 H10Z"/><circle cx="22" cy="29" r="1.6" fill="${c}"/><circle cx="32" cy="29" r="1.6" fill="${c}"/><circle cx="42" cy="29" r="1.6" fill="${c}"/></svg>`,
  person: (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="11"/><path d="M12 56 C12 42 22 36 32 36 C42 36 52 42 52 56"/></svg>`,
  box: (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 6 L56 18 V46 L32 58 L8 46 V18Z"/><path d="M8 18 L32 30 L56 18 M32 30 V58"/></svg>`,
  check: (c, s, w = 6) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="M14 33 L27 46 L51 19"/></svg>`,
  wa: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#25D366"/><path d="M24 18 C21 18 18 21 19 26 C21 36 28 43 38 45 C43 46 46 43 46 40 L40 35 L36 38 C31 36 28 33 26 28 L29 24Z" fill="#fff"/></svg>`,
};

function browser(par, x, y, w, h, th = 'light') {
  const r = C(par, x, y, w, h, `border-radius:${Math.round(w * .03)}px;overflow:hidden;`, '', 'br');
  const barBg = th === 'dark' ? '#141414' : '#efefec', dot = th === 'dark' ? '#3a3a3a' : '#d3d3cf', url = th === 'dark' ? '#242424' : '#e2e2de';
  r.innerHTML = `<div class="bar" style="background:${barBg}"><i style="background:${dot}"></i><i style="background:${dot}"></i><i style="background:${dot}"></i><b style="background:${url}"></b></div><div class="body"></div>`;
  r.body = r.querySelector('.body'); return r;
}
// slowly drifting ambient light blobs for dark scenes
function ambient(par, col = '255,196,0', a = .14) {
  const b1 = C(par, 300, 500, 1100, 1100, `border-radius:50%;background:radial-gradient(closest-side,rgba(${col},${a}),rgba(${col},0))`);
  const b2 = C(par, 800, 1300, 1000, 1000, `border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.06),rgba(255,255,255,0))`);
  return t => { set(b1, { x: 120 * Math.sin(t * .37), y: 90 * Math.cos(t * .29) }); set(b2, { x: -110 * Math.cos(t * .31), y: 100 * Math.sin(t * .23) }) };
}

// ---------- stage / scenes ----------
const cam = $('#cam');
const scenes = [];
function scene(a, b, bg) { const e = mk(cam, `left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;background:${bg};`, '', 'sc'); const s = { e, a, b, u: () => { } }; scenes.push(s); return s }

// ---------- captions ----------
// WORDS: [[text,t]], CH: [[from,to,[emph idx],end]], THEME(t)-> 'd'|'l'|'y'
const capEl = $('#cap');
let capIdx = -1, capSpans = [];
function captions(t, WORDS, CH, THEME) {
  let ci = -1;
  for (let i = 0; i < CH.length; i++) { const [a, , , end] = CH[i]; if (t >= WORDS[a][1] - .1 && t < end) ci = i }
  if (ci !== capIdx) {
    capIdx = ci; capEl.innerHTML = ''; capSpans = [];
    if (ci >= 0) { const [a, b, em] = CH[ci]; for (let i = a; i <= b; i++) { const s = document.createElement('span'); const isE = em.includes(i); if (isE) s.className = 'em'; s.textContent = WORDS[i][0]; if (isE) { const h = document.createElement('i'); h.className = 'hl'; s.appendChild(h) } capEl.appendChild(s); capSpans.push({ s, i, isE }) } }
  }
  if (ci < 0) return;
  const th = THEME(t); const end = CH[ci][3];
  const ex = P(t, end - .16, end);
  capSpans.forEach(({ s, i, isE }) => {
    const st = WORDS[i][1] - .05; const k = P(t, st, st + .26);
    s.style.color = th === 'd' ? (isE ? Y : '#fff') : '#111';
    s.style.textShadow = th === 'd' ? '0 6px 30px rgba(0,0,0,.6)' : 'none';
    const pop = isE ? 1 + .14 * (1 - E.o3(P(t, st, st + .3))) * (k > 0 ? 1 : 0) : 1;
    s.style.transform = `translateY(${((1 - E.o4(k)) * 26 - ex * 16).toFixed(2)}px) scale(${pop.toFixed(3)})`;
    s.style.opacity = (E.o2(k) * (1 - ex)).toFixed(3);
    s.style.filter = (k < 1 || ex > 0) ? `blur(${((1 - E.o3(k)) * 10 + ex * 8).toFixed(2)}px)` : 'none';
    const hl = s.querySelector('.hl');
    if (hl) { hl.style.background = th === 'l' ? Y : th === 'y' ? '#fff' : Y; hl.style.height = th === 'd' ? '5px' : '30px'; hl.style.bottom = th === 'd' ? '2px' : '6px'; hl.style.transform = `scaleX(${E.io3(P(t, st + .1, st + .4)).toFixed(3)})` }
  });
}

// ---------- camera shake, grain, vignette ----------
const gctx = $('#grain').getContext('2d');
{ const id = gctx.createImageData(740, 1160); let s = 1234567; for (let i = 0; i < id.data.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; const v = s % 256; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255 } gctx.putImageData(id, 0, 0) }
const grain = $('#grain'), vig = $('#vig');
const VIG = {
  d: 'radial-gradient(ellipse 75% 60% at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.36) 100%)',
  y: 'radial-gradient(ellipse 80% 65% at 50% 45%,rgba(0,0,0,0) 60%,rgba(150,80,0,.16) 100%)',
  l: 'radial-gradient(ellipse 80% 65% at 50% 45%,rgba(0,0,0,0) 62%,rgba(0,0,0,.06) 100%)'
};
function makeSeek({ WORDS, CH, THEME, SHAKE }) {
  return function seek(t, f) {
    for (const s of scenes) { const on = t >= s.a && t < s.b; vis(s.e, on); if (on) s.u(t) }
    let sx = 0, sy = 0, rot = 0;
    for (const [ti, amp] of SHAKE) { if (t < ti || t > ti + .6) continue; const d = t - ti, k = Math.exp(-d * 9) * amp; sx += Math.sin(d * 71 + ti) * k; sy += Math.cos(d * 59 + ti * 2) * k; rot += Math.sin(d * 43) * k * .025 }
    const br = 1 + .006 * Math.sin(t * .9);
    cam.style.transform = `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${br.toFixed(4)})`;
    captions(t, WORDS, CH, THEME);
    const th = THEME(t);
    vig.style.background = VIG[th];
    grain.style.opacity = th === 'd' ? .11 : th === 'y' ? .08 : .06;
    const fi = f ?? Math.round(t * 30);
    grain.style.transform = `translate(${-((fi * 7919) % 200)}px,${-((fi * 104729) % 200)}px)`;
  };
}
