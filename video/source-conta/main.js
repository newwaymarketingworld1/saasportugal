// NewWay — "A conta" motion ad (voice 2). Pure function of t; helpers in lib.js.
window.DUR = 36.6;
const PAPER_BG = 'linear-gradient(180deg,#FBFAF6,#F0EEE6)';
const teeth = (n = 34, h = 12) => { let p = [`0 ${h}px`]; for (let i = 0; i <= n; i++) p.push(`${(i / n * 100).toFixed(2)}% ${i % 2 ? 0 : h}px`); p.push('100% 100%', '0 100%'); return `polygon(${p.join(',')})` };
const stampHTML = (txt, sub = '') => `<div style="position:absolute;inset:0;border:8px solid #111;border-radius:18px;background:${Y};display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 22px 50px rgba(0,0,0,.35)"><div style="font-family:U;font-weight:800;font-size:54px;color:#111;letter-spacing:-.02em;line-height:1">${txt}</div>${sub ? `<div class="mono" style="font-size:18px;color:#111;margin-top:8px;letter-spacing:.24em">${sub}</div>` : ''}</div>`;

// ======================= 1. A CONTA (0 – 14.75) =======================
const R = scene(0, 14.75, '#0b0b0b');
{
  const e = R.e; const amb = ambient(e);
  mk(e, 'inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:90px 90px;-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 45%,#000,transparent)');
  const world = mk(e, 'left:0;top:0;width:1080px;height:1920px;transform-origin:540px 950px');
  const PY = 1290;
  const pmask = mk(world, `left:0;top:0;width:1080px;height:${PY}px;overflow:visible`);
  const paper = mk(pmask, `left:200px;width:680px;bottom:0;height:0;background:${PAPER_BG};clip-path:${teeth()};filter:drop-shadow(0 30px 50px rgba(0,0,0,.55))`);
  const pc = mk(paper, 'left:0;top:0;width:680px;height:700px');
  mk(pc, 'left:0;top:34px;width:680px;text-align:center;font-family:U;font-weight:700;font-size:50px;color:#111;letter-spacing:-.02em', 'SUA CONTA');
  mk(pc, 'left:0;top:102px;width:680px;text-align:center;font-size:17px;color:#8a8a85', 'negócio local · europa · todo mês', 'mono');
  mk(pc, 'left:36px;right:36px;top:146px;border-top:3px dashed #cfcdc5');
  mk(pc, 'left:40px;top:164px;font-size:15px;color:#9a9a95', 'item', 'mono'); mk(pc, 'right:40px;top:164px;font-size:15px;color:#9a9a95', 'você paga', 'mono');
  const ROWS = [['Site profissional', 'projeto + manutenção', 'site'], ['Gestão do Google', 'freelancer · mensal', 'pin'], ['Atendente na Europa', 'salário · todo mês', 'person']];
  const rowEls = ROWS.map(([lab, sub, ic], i) => {
    const y = 200 + i * 118;
    const r = mk(pc, `left:0;top:${y}px;width:680px;height:104px`);
    const nb = mk(r, `left:28px;top:30px;width:46px;height:46px;border-radius:50%;background:${Y};transform:scale(0)`);
    mk(r, 'left:28px;top:40px;width:46px;text-align:center;font-size:20px;color:#9a9a95', `0${i + 1}`, 'mono');
    mk(r, `left:88px;top:16px;width:72px;height:72px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center`, ICO[ic](Y, 40));
    mk(r, 'left:178px;top:18px;font-family:IS;font-weight:700;font-size:33px;color:#111;letter-spacing:-.01em', lab);
    mk(r, 'left:178px;top:62px;font-size:15px;color:#8a8a85', sub, 'mono');
    const pill = mk(r, `right:32px;top:30px;height:44px;padding:0 18px;border-radius:22px;background:#111;color:${Y};display:flex;align-items:center;font-family:U;font-weight:700;font-size:19px;transform-origin:100% 50%`, i === 2 ? '€ / mês' : '€ €€€');
    mk(r, 'left:36px;right:36px;top:103px;border-top:2px dotted #d9d7cf');
    return { nb, pill, r };
  });
  mk(pc, 'left:36px;right:36px;top:556px;border-top:3px dashed #cfcdc5');
  mk(pc, 'left:40px;top:586px;font-family:U;font-weight:800;font-size:40px;color:#111', 'TOTAL');
  const tot = mk(pc, 'right:40px;top:578px;height:62px;padding:0 20px;display:flex;align-items:center;font-family:U;font-weight:800;font-size:40px;color:#111;z-index:1', '<i class="hlb" style="position:absolute;inset:0;background:' + Y + ';border-radius:8px;z-index:-1;transform-origin:0 50%"></i>3 CONTAS');
  const totHL = tot.querySelector('.hlb');
  // bracket -> "1 problema"
  const brk = mk(world, 'left:0;top:0;width:1080px;height:1920px', `<svg width="1080" height="1920" style="overflow:visible"><path id="bk" d="" fill="none" stroke="${Y}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
  const bk = brk.querySelector('#bk');
  const one = C(world, 1010, 0, 120, 120, `border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:66px;color:#111;box-shadow:0 0 0 12px rgba(255,196,0,.18)`, '1');
  const oneL = C(world, 1010, 0, 220, 30, `text-align:center;font-size:17px;color:${Y}`, 'problema', 'mono');
  // printer
  const prn = C(world, 540, PY + 34, 820, 92, 'border-radius:26px;background:linear-gradient(180deg,#232323,#121212);box-shadow:0 30px 60px rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.08)', `<div style="position:absolute;left:60px;right:60px;top:10px;height:12px;border-radius:6px;background:#050505"></div><div class="mono" style="position:absolute;left:44px;top:46px;font-size:15px;color:#555">conta · 0001</div>`);
  const led = mk(prn, `right:46px;top:44px;width:16px;height:16px;border-radius:50%;background:${Y};box-shadow:0 0 14px ${Y}`);
  // focus cards
  const stage = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1500px;perspective-origin:540px 560px');
  // card 1: site
  const c1 = browser(stage, 540, 560, 820, 520, 'light'); c1.style.boxShadow = '0 50px 100px rgba(0,0,0,.6)'; c1.style.transformOrigin = '50% 100%';
  mk(c1.body, 'inset:0;background:#222 url(img/deck.jpg) center top/cover');
  const tag1 = C(stage, 290, 270, 300, 60, `border-radius:30px;background:#111;border:2px solid #2a2a2a;color:${Y};display:flex;align-items:center;justify-content:center;font-size:17px`, 'site profissional', 'mono');
  // card 2: google manager
  const c2 = C(stage, 540, 560, 820, 540, 'border-radius:34px;background:#fff;box-shadow:0 50px 100px rgba(0,0,0,.6);transform-origin:50% 100%');
  c2.innerHTML = `<div style="position:absolute;left:44px;top:44px;width:150px;height:150px;border-radius:50%;background:#efeee9;display:flex;align-items:center;justify-content:center">${ICO.person('#111', 92)}</div>
    <div style="position:absolute;left:224px;top:58px;font-family:U;font-weight:700;font-size:40px;color:#111;letter-spacing:-.02em">Gestor de Google</div>
    <div class="mono" style="position:absolute;left:226px;top:118px;font-size:17px;color:#8a8a85">freelancer · mensalidade</div>
    <div style="position:absolute;left:226px;top:152px;display:flex;gap:6px">${[0, 1, 2, 3, 4].map(() => starSVG(Y, 30, '#111')).join('')}</div>
    <div style="position:absolute;left:44px;right:44px;top:232px;border-top:2px solid #eee"></div>
    <div id="tasks" style="position:absolute;left:44px;top:262px;right:44px"></div>`;
  const TK = ['Responder avaliações', 'Atualizar fotos e horários', 'Postar novidades'];
  const tasks = TK.map((s, i) => { const d = mk(c2.querySelector('#tasks'), `left:0;top:${i * 82}px;width:732px;height:66px;border-radius:18px;background:#f6f5f1;display:flex;align-items:center;gap:20px;padding-left:20px`, `<div class="bx" style="width:38px;height:38px;border-radius:10px;border:3px solid #111;display:flex;align-items:center;justify-content:center"><div class="ck" style="transform:scale(0)">${ICO.check('#111', 30, 8)}</div></div><span style="font-family:IS;font-weight:600;font-size:29px;color:#111">${s}</span>`); return d });
  const tag2 = C(stage, 300, 260, 320, 60, `border-radius:30px;background:#111;border:2px solid #2a2a2a;color:${Y};display:flex;align-items:center;justify-content:center;font-size:17px`, 'google meu negócio', 'mono');
  // card 3: employee badge + calendar
  const lan = mk(stage, `left:404px;top:-60px;width:52px;height:300px;background:repeating-linear-gradient(180deg,#1b1b1b 0 22px,#262626 22px 44px);transform-origin:50% 0`);
  const badge = C(stage, 430, 560, 440, 600, 'border-radius:32px;background:#fff;box-shadow:0 50px 100px rgba(0,0,0,.6);overflow:hidden;transform-origin:50% -40px', `
    <div style="position:absolute;left:0;top:0;right:0;height:120px;background:${Y}"></div>
    <div style="position:absolute;left:190px;top:22px;width:60px;height:16px;border-radius:8px;background:#0b0b0b"></div>
    <div style="position:absolute;left:0;right:0;top:56px;text-align:center;font-family:U;font-weight:800;font-size:36px;color:#111;letter-spacing:.01em">ATENDENTE</div>
    <div style="position:absolute;left:120px;top:150px;width:200px;height:220px;border-radius:24px;background:#ecebe6;display:flex;align-items:flex-end;justify-content:center;overflow:hidden">${ICO.person('#b9b8b2', 190)}</div>
    <div style="position:absolute;left:0;right:0;top:394px;text-align:center;font-family:IS;font-weight:700;font-size:32px;color:#111">Contratado(a)</div>
    <div class="mono" style="position:absolute;left:0;right:0;top:442px;text-align:center;font-size:16px;color:#8a8a85">europa · tempo integral</div>
    <div style="position:absolute;left:40px;right:40px;top:500px;height:56px;border-radius:14px;background:repeating-linear-gradient(90deg,#111 0 6px,transparent 6px 11px,#111 11px 13px,transparent 13px 20px);opacity:.8"></div>`);
  const MON = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const cal = C(stage, 812, 640, 320, 360);
  const calPage = (m) => `<div style="position:absolute;left:0;top:0;right:0;height:84px;background:#111;border-radius:22px 22px 0 0"></div><div class="mono" style="position:absolute;left:0;right:0;top:30px;text-align:center;color:${Y};font-size:22px">salário</div>
     <div style="position:absolute;left:0;right:0;top:118px;text-align:center;font-family:U;font-weight:800;font-size:104px;color:#111;letter-spacing:-.03em">${m}</div>
     <div style="position:absolute;left:0;right:0;top:262px;text-align:center;font-family:U;font-weight:700;font-size:34px;color:#111">€ ●●●●</div>`;
  const calUnder = mk(cal, `left:0;top:0;width:320px;height:360px;border-radius:22px;background:#fff;box-shadow:0 40px 90px rgba(0,0,0,.55);overflow:hidden`);
  const calTop = mk(cal, `left:0;top:0;width:320px;height:360px;border-radius:22px;background:#fff;overflow:hidden;transform-origin:50% 0;backface-visibility:hidden`);
  mk(cal, 'left:70px;top:-16px;width:180px;height:34px', '<div style="position:absolute;left:0;top:0;width:22px;height:34px;border-radius:11px;background:#888"></div><div style="position:absolute;right:0;top:0;width:22px;height:34px;border-radius:11px;background:#888"></div>');
  const stamp = C(stage, 640, 760, 400, 150, '', stampHTML('VOCÊ PAGA'));
  const stampSub = mk(stamp, 'left:0;top:0;width:400px;height:150px;display:none', stampHTML('VOCÊ PAGA', 'todo mês'));
  // kinetic "vender mais"
  const vm = mk(e, 'left:0;top:0;width:1080px;height:1920px');
  const chart = mk(vm, 'left:0;top:0;width:1080px;height:1920px', `<svg width="1080" height="1920"><path id="vc" d="M80 1180 L300 1080 L430 1120 L640 900 L760 940 L1000 640" fill="none" stroke="${Y}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" opacity=".28"/><path id="va" d="M940 640 L1000 640 L1000 700" fill="none" stroke="${Y}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" opacity=".28"/></svg>`);
  const vc = chart.querySelector('#vc'), va = chart.querySelector('#va');
  const vmA = mk(vm, 'left:0;top:610px;width:1080px;height:170px;overflow:hidden'); const vmAi = mk(vmA, 'left:0;top:0;width:1080px;height:170px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:150px;color:#fff;letter-spacing:-.04em', 'VENDER');
  const vmB = mk(vm, 'left:0;top:780px;width:1080px;height:220px;overflow:hidden'); const vmBi = mk(vmB, `left:0;top:0;width:1080px;height:220px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:900;font-size:200px;color:${Y};letter-spacing:-.05em`, 'MAIS.');
  const vmL = C(vm, 540, 560, 600, 34, 'text-align:center;font-size:22px;color:#8a8a85', 'o único problema', 'mono');

  const FEED = [[.12, 1.55, 0, 200, 6], [1.95, 2.3, 200, 318, 2], [4.2, 4.55, 318, 436, 2], [6.92, 7.27, 436, 554, 2], [10.4, 10.78, 554, 690, 2], [10.78, 10.9, 690, 712, 1]];
  const feedAt = t => { let v = 0; for (const [a, b, v0, v1, n] of FEED) { if (t >= a) { const p = P(t, a, b); const st = (Math.floor(p * n * 2) + E.io2((p * n * 2) % 1)) / (n * 2); v = L(v0, v1, p >= 1 ? 1 : st) } } return v };
  // card in/out helper
  const cardIO = (el, tin, tout, extra = {}) => { const a = E.o4(P(t_, tin, tin + .45)); const d = E.i3(P(t_, tout, tout + .34)); set(el, Object.assign({ p: 0, rx: (1 - a) * 72, y: (1 - a) * 160 + d * 640, s: L(1, .16, d) * (extra.s || 1), o: P(t_, tin, tin + .12) * (1 - P(t_, tout + .24, tout + .34)) }, extra.o2 || {})) };
  let t_ = 0;
  R.u = t => {
    t_ = t; amb(t);
    const feed = feedAt(t);
    paper.style.height = feed.toFixed(1) + 'px';
    led.style.opacity = (FEED.some(([a, b]) => t >= a && t <= b) ? (Math.floor(t * 16) % 2 ? 1 : .25) : .6);
    set(prn, { y: T(t, 0, .5, 140, 0, E.o4), o: P(t, 0, .2) });
    // mask: hide old paper above y 780 while items print; reveal all at "três contas"
    const mA = T(t, 10.3, 10.9, 820, 0, E.io3), mB = T(t, 10.3, 10.9, 960, 40, E.io3);
    pmask.style.webkitMaskImage = `linear-gradient(180deg,transparent ${mA}px,#000 ${mB}px)`;
    // world camera: pull-up to show the whole bill, then shift left for the bracket, then blur for VENDER MAIS
    const up = E.io3(P(t, 10.32, 11.0)), sh = E.io3(P(t, 12.18, 12.6)), vmk = E.io3(P(t, 13.3, 13.7));
    world.style.transform = `translate(${(-180 * sh).toFixed(1)}px,${(-250 * up + 40 * vmk - 420 * (1 - E.io3(P(t, 1.45, 2.05)))).toFixed(1)}px) scale(${(L(1, 1.16, up) * L(1, .9, vmk)).toFixed(4)})`;
    world.style.filter = vmk > 0 ? `blur(${(9 * vmk).toFixed(2)}px) brightness(${(1 - .55 * vmk).toFixed(3)})` : 'none';
    // row badges (pill pops when the item drops in) + number highlights on "três"
    const PILL = [4.12, 6.82, 10.36];
    rowEls.forEach((r, i) => {
      r.pill.style.transform = `scale(${E.back2(P(t, PILL[i], PILL[i] + .28)).toFixed(3)})`;
      r.pill.style.opacity = P(t, PILL[i], PILL[i] + .05);
      const nt = 10.8 + i * .13; r.nb.style.transform = `scale(${E.back2(P(t, nt, nt + .3)).toFixed(3)})`;
    });
    totHL.style.transform = `scaleX(${E.io3(P(t, 11.12, 11.45)).toFixed(3)})`;
    // bracket: rows centres in paper coords -> world coords
    const top = PY - feed; const ys = [0, 1, 2].map(i => top + 200 + i * 118 + 52);
    const xb = 900, xm = 960, ym = ys[1];
    bk.setAttribute('d', `M${xb - 20} ${ys[0]} L${xb} ${ys[0]} Q${xm} ${ys[0]} ${xm} ${ym - 40} L${xm} ${ym} L${xm + 6} ${ym} M${xb - 20} ${ys[1]} L${xm} ${ys[1]} M${xb - 20} ${ys[2]} L${xb} ${ys[2]} Q${xm} ${ys[2]} ${xm} ${ym + 40} L${xm} ${ym}`);
    bk.style.strokeDashoffset = (1 - E.io3(P(t, 12.26, 12.66))).toFixed(3);
    set(one, { y: ym, s: E.back2(P(t, 12.56, 12.86)) * (1 + .06 * ring(t, 12.9, 2, 5)), o: P(t, 12.56, 12.62) });
    set(oneL, { y: ym + 92, o: P(t, 12.7, 12.9) });
    // ---- focus cards ----
    cardIO(c1, 1.84, 3.92); set(tag1, { y: T(t, 1.95, 2.3, 30, 0, E.o4) + E.i3(P(t, 3.92, 4.2)) * 200, o: win(t, 1.95, 4.1, .12, .15) });
    c1.style.transform += ` translateY(${(6 * Math.sin(t * 1.8)).toFixed(2)}px)`;
    cardIO(c2, 4.16, 6.56); set(tag2, { y: T(t, 4.28, 4.6, 30, 0, E.o4) + E.i3(P(t, 6.56, 6.84)) * 200, o: win(t, 4.28, 6.74, .12, .15) });
    tasks.forEach((d, i) => { const st = 4.72 + i * .34; d.querySelector('.ck').style.transform = `scale(${E.back2(P(t, st, st + .22)).toFixed(3)})`; d.style.background = t > st ? '#fff7d6' : '#f6f5f1' });
    // badge swings in on a lanyard
    const bin = P(t, 6.86, 7.5), bout = E.i3(P(t, 10.18, 10.5));
    const swing = t < 6.86 ? 0 : 16 * Math.exp(-(t - 6.86) * 2.2) * Math.cos((t - 6.86) * 6.5);
    set(badge, { y: (1 - E.o4(bin)) * -1000 + bout * 640, r: swing * (1 - bout), s: L(1, .16, bout), o: P(t, 6.86, 6.9) * (1 - P(t, 10.42, 10.5)) });
    lan.style.transform = `translateY(${((1 - E.o4(bin)) * -1000).toFixed(1)}px) rotate(${(swing * .4).toFixed(2)}deg)`;
    lan.style.opacity = P(t, 6.86, 6.9) * (1 - P(t, 10.18, 10.3));
    // calendar: months flip on "salário todo mês"
    const cin = E.back(P(t, 9.12, 9.42)); const cout = E.i3(P(t, 10.2, 10.52));
    set(cal, { s: L(.5, 1, cin) * L(1, .16, cout), y: cout * 560, x: cout * -270, r: 6 - 6 * cin, o: P(t, 9.12, 9.18) * (1 - P(t, 10.44, 10.52)) });
    const fp = P(t, 9.3, 10.16) * 11; const mi = Math.min(11, Math.floor(fp)); const ff = fp - mi;
    if (cal._mi !== mi) { calUnder.innerHTML = calPage(MON[Math.min(11, mi + 1)]); calTop.innerHTML = calPage(MON[mi]); cal._mi = mi }
    calTop.style.transform = `perspective(900px) rotateX(${(mi >= 11 ? 0 : E.i2(clamp(ff * 1.6)) * 100).toFixed(2)}deg)`;
    calTop.style.opacity = mi >= 11 ? 1 : (ff * 1.6 > .98 ? 0 : 1);
    // stamps: 3.42, 6.32, 8.58
    const ST = [[3.4, 3.92, 640, 790, -9], [6.3, 6.56, 640, 810, 7], [8.56, 10.18, 650, 900, -6]];
    let so = 0, ss = 1, sx = 640, sy = 760, sr = 0, out = 0;
    for (const [a, b, x, y, r] of ST) if (t >= a - .02 && t < b + .4) { so = P(t, a, a + .06) * (1 - P(t, b + .24, b + .34)); ss = T(t, a, a + .16, 2.4, 1, E.o4); sx = x; sy = y; sr = r; out = E.i3(P(t, b, b + .34)) }
    set(stamp, { x: sx - 640 + (out * (540 - sx)), y: sy - 760 + out * (1224 - sy), s: ss * L(1, .16, out), r: sr, o: so, b: T(t, 0, 1, 0, 0) });
    stampSub.style.display = t > 9.5 ? 'block' : 'none';
    // VENDER MAIS
    vm.style.opacity = (1 - P(t, 14.4, 14.6)).toFixed(3);
    const ka = E.o5(P(t, 13.36, 13.76)), kb = E.o5(P(t, 13.92, 14.3));
    vmAi.style.transform = `translateY(${((1 - ka) * 170).toFixed(1)}px)`; vmBi.style.transform = `translateY(${((1 - kb) * 220).toFixed(1)}px) scale(${(1 + .06 * ring(t, 14.1, 3, 7)).toFixed(3)})`;
    set(vmL, { o: P(t, 13.4, 13.6), y: T(t, 13.4, 13.7, 20, 0, E.o4) });
    vc.style.strokeDashoffset = (1 - E.io3(P(t, 13.4, 14.2))).toFixed(3); va.style.strokeDashoffset = (1 - E.o3(P(t, 14.1, 14.3))).toFixed(3);
  };
}

// ======================= 2. A NEW WAY JUNTA TUDO — 3D box (14.36 – 17.1) =======================
const BX = scene(14.36, 17.1, 'transparent');
{
  const e = BX.e;
  const disc = C(e, 540, 880, 100, 100, `border-radius:50%;background:${Y}`);
  const glow = C(e, 540, 900, 1200, 1200, 'border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.45),rgba(255,255,255,0))');
  const shadow = C(e, 560, 1130, 620, 120, 'border-radius:50%;background:radial-gradient(closest-side,rgba(90,50,0,.45),rgba(90,50,0,0))');
  const persp = mk(e, 'left:0;top:0;width:1080px;height:1920px;perspective:1800px;perspective-origin:540px 650px');
  const rig = mk(persp, 'left:540px;top:900px;width:0;height:0;transform-style:preserve-3d');
  const BW = 460, BH = 310, BD = 360;
  const face = (par, w, h, tr, bg, html = '') => mk(par, `left:${-w / 2}px;top:${-h / 2}px;width:${w}px;height:${h}px;background:${bg};transform:${tr}`, html);
  const front = face(rig, BW, BH, `translateZ(${BD / 2}px)`, 'linear-gradient(180deg,#232323,#141414)', `<div style="position:absolute;left:0;right:0;top:58px;display:flex;justify-content:center">${sym(Y, 190)}</div><div style="position:absolute;left:0;right:0;top:162px;display:flex;justify-content:center">${wmLetters(Y, 190)}</div>`);
  face(rig, BW, BH, `rotateY(180deg) translateZ(${BD / 2}px)`, '#2a2a2a');
  face(rig, BD, BH, `rotateY(90deg) translateZ(${BW / 2}px)`, 'linear-gradient(180deg,#151515,#0b0b0b)', `<div class="mono" style="position:absolute;left:30px;bottom:26px;font-size:16px;color:#3a3a3a">frágil · newway</div>`);
  face(rig, BD, BH, `rotateY(-90deg) translateZ(${BW / 2}px)`, '#262626');
  face(rig, BW, BD, `rotateX(-90deg) translateZ(${BH / 2}px)`, '#1e1e1e');
  const hinge = (tr, w, len, bg) => { const h = mk(rig, `left:0;top:0;width:0;height:0;transform-style:preserve-3d;transform:${tr}`); const f = mk(h, `left:${-w / 2}px;top:${-len}px;width:${w}px;height:${len}px;background:${bg};border-radius:3px 3px 0 0`); return h };
  const fF = hinge('', BW, BD / 2, 'linear-gradient(0deg,#1f1f1f,#2b2b2b)');
  const fB = hinge('', BW, BD / 2, 'linear-gradient(0deg,#1a1a1a,#262626)');
  const fL = hinge('', BD, BW / 2 - 4, '#1c1c1c');
  const fR = hinge('', BD, BW / 2 - 4, '#202020');
  const tapeW = mk(rig, `left:0;top:0;width:0;height:0;transform-style:preserve-3d;transform:translate3d(0,${-BH / 2 - 2}px,0) rotateX(90deg)`);
  const tape = mk(tapeW, `left:-55px;top:${-BD / 2 - 2}px;width:110px;height:${BD + 4}px;background:${Y};transform-origin:50% 100%`);
  const tapeF = mk(front, `left:${BW / 2 - 55}px;top:0;width:110px;height:40px;background:${Y};transform-origin:50% 0`);
  const sticker = mk(front, 'left:262px;top:212px;width:180px;height:80px;border-radius:12px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.4);display:flex;flex-direction:column;align-items:center;justify-content:center;transform-origin:50% 50%', `<div style="font-family:U;font-weight:800;font-size:30px;color:#111;line-height:1">1 ENTREGA</div><div class="mono" style="font-size:12px;color:#555;margin-top:6px">tudo incluído</div>`);
  const TOK = [['site', 230, 330], ['pin', 540, 250], ['chat', 850, 330]];
  const toks = TOK.map(([ic, x, y]) => C(e, x, y, 170, 170, 'border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center;box-shadow:0 26px 50px rgba(90,50,0,.35)', ICO[ic](Y, 86)));
  const lbl = C(e, 540, 1330, 700, 40, 'text-align:center;font-size:22px;color:#4d3b00', 'site · google · atendente', 'mono');
  BX.u = t => {
    set(disc, { s: E.o4(P(t, 14.36, 14.72)) * 48 });
    glow.style.opacity = P(t, 14.5, 14.9);
    const inn = P(t, 14.5, 15.15);
    const squash = ring(t, 16.2, 3.2, 7);
    const yIn = (1 - E.back(inn)) * 900;
    const ry = L(-95, -32, E.o4(inn)) + 3 * Math.sin(t * .8);
    const zoom = E.i4(P(t, 16.72, 17.08));
    rig.style.transform = `translate3d(0,${(yIn + 4 * Math.sin(t * 2)).toFixed(1)}px,0) rotateX(-24deg) rotateY(${ry.toFixed(2)}deg) scale3d(${(1 + .05 * squash).toFixed(3)},${(1 - .08 * squash).toFixed(3)},1)`;
    persp.style.transform = `scale(${(1 + zoom * 5).toFixed(3)})`; persp.style.transformOrigin = '540px 820px';
    persp.style.opacity = P(t, 14.5, 14.6);
    set(shadow, { s: L(.4, 1, E.o4(inn)) * (1 + .08 * squash), o: P(t, 14.6, 15.0) * (1 - zoom) });
    // flaps (open -> closed)
    const cs = E.io3(P(t, 15.72, 15.98)), cf = E.io3(P(t, 15.86, 16.14));
    fL.style.transform = `translate3d(${-BW / 2}px,${-BH / 2 + 2}px,0) rotateY(90deg) rotateX(${L(55, -90, cs)}deg)`;
    fR.style.transform = `translate3d(${BW / 2}px,${-BH / 2 + 2}px,0) rotateY(90deg) rotateX(${L(-55, 90, cs)}deg)`;
    fF.style.transform = `translate3d(0,${-BH / 2}px,${BD / 2}px) rotateX(${L(-48, 90, cf)}deg)`;
    fB.style.transform = `translate3d(0,${-BH / 2}px,${-BD / 2}px) rotateX(${L(48, -90, cf)}deg)`;
    const tp = E.o4(P(t, 16.12, 16.32));
    tape.style.opacity = tp > 0 ? 1 : 0; tape.style.transform = `scaleY(${tp.toFixed(3)})`;
    tapeF.style.transform = `scaleY(${E.o4(P(t, 16.06, 16.16)).toFixed(3)})`;
    sticker.style.transform = `rotate(-8deg) scale(${E.back2(P(t, 16.28, 16.52)).toFixed(3)})`; sticker.style.opacity = P(t, 16.28, 16.32);
    // tokens fly into the box
    toks.forEach((k, i) => {
      const [, x0, y0] = TOK[i]; const pop = E.back2(P(t, 14.86 + i * .08, 15.12 + i * .08));
      const st = 15.2 + i * .13; const f = E.io3(P(t, st, st + .5));
      const xe = 540, ye = 770, cx = (x0 + xe) / 2, cy = Math.min(y0, ye) - 260;
      const bx = (1 - f) ** 2 * x0 + 2 * (1 - f) * f * cx + f * f * xe, by = (1 - f) ** 2 * y0 + 2 * (1 - f) * f * cy + f * f * ye;
      set(k, { x: bx - x0, y: by - y0, s: pop * L(1, .3, f), r: f * 200 * (i - 1), o: P(t, 14.86 + i * .08, 14.92 + i * .08) * (1 - P(t, st + .4, st + .5)) });
    });
    set(lbl, { o: P(t, 14.95, 15.2) * (1 - P(t, 15.6, 15.8)), y: T(t, 14.95, 15.3, 20, 0, E.o4) });
  };
}

// ======================= 3. O PACOTE: 3 itens (16.86 – 22.6) light =======================
const IT = scene(16.86, 22.6, '#F2F1EC');
{
  const e = IT.e;
  mk(e, 'inset:0;background-image:radial-gradient(#d8d6cf 1.6px,transparent 1.6px);background-size:36px 36px;opacity:.55');
  const flash = mk(e, 'inset:0;background:#fff');
  const hdr = C(e, 540, 245, 700, 40, 'text-align:center;font-size:22px;color:#77756e', 'o pacote new way', 'mono');
  const card = (y, title, sub) => { const c = C(e, 540, y, 900, 300, 'border-radius:38px;background:#fff;box-shadow:0 30px 70px rgba(0,0,0,.10),0 2px 0 rgba(0,0,0,.03)'); mk(c, 'left:376px;top:74px;font-family:U;font-weight:600;font-size:33px;color:#111;letter-spacing:-.025em;white-space:nowrap', title); const s = mk(c, 'left:378px;top:134px;font-family:IS;font-weight:500;font-size:28px;color:#7a7872', sub); const ck = mk(c, `right:-14px;top:-14px;width:76px;height:76px;box-shadow:0 8px 20px rgba(120,80,0,.3);border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;transform:scale(0)`, ICO.check('#111', 52, 8)); return { c, s, ck } };
  const A = card(470, 'Site profissional', 'feito à medida');
  const B = card(800, 'Google Meu Negócio', '');
  const Cc = card(1130, 'Atendente inteligente', 'IA · responde na hora');
  // A visual: mini browser with a real client site
  const ab = mk(A.c, 'left:36px;top:40px;width:310px;height:220px;border-radius:16px;overflow:hidden;background:#222;box-shadow:0 10px 24px rgba(0,0,0,.18)', `<div style="position:absolute;left:0;top:0;right:0;height:26px;background:#efefec;display:flex;gap:6px;align-items:center;padding-left:12px"><i style="display:block;width:8px;height:8px;border-radius:50%;background:#d3d3cf"></i><i style="display:block;width:8px;height:8px;border-radius:50%;background:#d3d3cf"></i><i style="display:block;width:8px;height:8px;border-radius:50%;background:#d3d3cf"></i></div><div style="position:absolute;left:0;top:26px;right:0;bottom:0;background:url(img/kundara.jpg) center top/cover"></div>`);
  const widget = mk(ab, `right:12px;bottom:12px;width:54px;height:54px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;box-shadow:0 6px 14px rgba(0,0,0,.35);transform:scale(0)`, ICO.chat('#111', 32));
  const wring = mk(ab, 'right:12px;bottom:12px;width:54px;height:54px;border-radius:50%;border:4px solid ' + Y + ';opacity:0');
  // B visual: map + pin + progress
  mk(B.c, 'left:36px;top:40px;width:310px;height:220px;border-radius:16px;overflow:hidden;background:#E9E9E4', `<svg width="310" height="220"><rect x="20" y="30" width="90" height="60" rx="8" fill="#dcdcd5"/><rect x="160" y="120" width="120" height="70" rx="8" fill="#dcdcd5"/><path d="M0 110 L310 95 M130 0 L150 220 M0 190 L310 170" stroke="#fff" stroke-width="16"/></svg>`);
  const bpin = mk(B.c, 'left:160px;top:62px;width:70px;height:92px;transform-origin:50% 100%', `<svg width="70" height="92" viewBox="0 0 70 92"><path d="M35 90 C35 90 4 54 4 34 A31 31 0 1 1 66 34 C66 54 35 90 35 90Z" fill="${Y}" stroke="#111" stroke-width="5"/><circle cx="35" cy="34" r="11" fill="#111"/></svg>`);
  const prog = mk(B.c, 'left:378px;top:146px;width:340px;height:14px;border-radius:7px;background:#eeede8;overflow:hidden', `<div class="f" style="position:absolute;left:0;top:0;bottom:0;width:100%;background:#111;transform-origin:0 50%"></div>`);
  const progF = prog.querySelector('.f');
  const progT = mk(B.c, 'left:378px;top:178px;font-size:18px;color:#7a7872', 'configurando… 0%', 'mono');
  // C visual: assistant
  mk(Cc.c, 'left:36px;top:40px;width:310px;height:220px;border-radius:16px;background:#111;overflow:hidden', `
    <div style="position:absolute;left:20px;top:20px;width:56px;height:56px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 36)}</div>
    <div style="position:absolute;left:90px;top:26px;font-family:IS;font-weight:700;font-size:22px;color:#fff">Assistente</div><div class="mono" style="position:absolute;left:90px;top:56px;font-size:12px;color:#888">online</div>
    <div style="position:absolute;left:20px;top:100px;padding:10px 14px;border-radius:16px 16px 16px 4px;background:#262626;font-family:IS;font-size:17px;color:#fff">Olá! Posso ajudar?</div>
    <div style="position:absolute;right:20px;top:152px;padding:10px 14px;border-radius:16px 16px 4px 16px;background:${Y};font-family:IS;font-weight:600;font-size:17px;color:#111">Quero um orçamento</div>`);
  const spk = C(Cc.c, 86, 50, 40, 40, '', sparkSVG(Y, 40));
  const link = mk(e, 'left:0;top:0;width:1080px;height:1920px', `<svg width="1080" height="1920"><path id="lk" d="M160 1070 C 20 900, 40 640, 390 556" fill="none" stroke="#111" stroke-width="4" stroke-dasharray="10 12"/></svg>`);
  const lk = link.querySelector('#lk'); const LKL = lk.getTotalLength ? 0 : 0;
  const dot = C(e, 0, 0, 34, 34, `border-radius:50%;background:${Y};border:4px solid #111`);
  IT.u = t => {
    flash.style.opacity = 1 - P(t, 16.88, 17.1);
    const ex = E.io5(P(t, 22.18, 22.52));
    e.style.transform = `translateY(${(-ex * 1920).toFixed(1)}px)`;
    set(hdr, { o: P(t, 17.0, 17.3), y: T(t, 17.0, 17.4, 20, 0, E.o4) });
    const cin = (o, st) => { const k = E.o4(P(t, st, st + .5)); set(o.c, { p: 1500, ry: (1 - k) * -40, x: (1 - k) * 700, o: P(t, st, st + .1), y: 3 * Math.sin(t * 1.7 + st) }); };
    cin(A, 16.9); cin(B, 17.94); cin(Cc, 19.66);
    const ckp = (o, st) => { o.ck.style.transform = `scale(${E.back2(P(t, st, st + .3)).toFixed(3)})` };
    ckp(A, 17.36); ckp(B, 18.98); ckp(Cc, 20.62);
    const pr = E.io2(P(t, 18.1, 18.98)); progF.style.transform = `scaleX(${pr.toFixed(3)})`;
    progT.textContent = t < 18.98 ? `configurando… ${Math.round(pr * 100)}%` : 'configurado ✓';
    progT.style.color = t < 18.98 ? '#7a7872' : '#111';
    bpin.style.transform = `translateY(${((1 - E.i3(P(t, 18.2, 18.42))) * -120).toFixed(1)}px) scale(${(1 + .15 * ring(t, 18.42, 2.6, 8)).toFixed(3)},${(1 - .12 * ring(t, 18.42, 2.6, 8)).toFixed(3)})`;
    bpin.style.opacity = P(t, 18.2, 18.24);
    set(spk, { s: Math.max(0, Math.sin(Math.PI * P(t, 20.55, 21.1))) * 1.2, r: t * 120 });
    // integrated: dot travels from C to A's browser, widget appears
    const lp = E.io3(P(t, 21.12, 21.55));
    lk.style.strokeDashoffset = 0; link.style.opacity = P(t, 21.1, 21.2) * (1 - P(t, 21.9, 22.1));
    const len = lk.getTotalLength(); lk.style.strokeDasharray = `10 12`; lk.style.clipPath = 'none';
    const pt = lk.getPointAtLength(len * lp);
    set(dot, { x: pt.x, y: pt.y, o: P(t, 21.12, 21.16) * (1 - P(t, 21.5, 21.56)), s: 1 });
    widget.style.transform = `scale(${E.back2(P(t, 21.52, 21.8)).toFixed(3)})`;
    const wr = P(t, 21.56, 22.1); wring.style.opacity = (1 - wr) * (t > 21.56 ? 1 : 0); wring.style.transform = `scale(${(1 + wr * 1.6).toFixed(3)})`;
    // reveal the dashed link progressively
    link.style.webkitMaskImage = `linear-gradient(0deg,#000 ${(lp * 100).toFixed(1)}%,transparent ${(lp * 100 + 1).toFixed(1)}%)`;
    link.style.webkitMaskSize = '100% 100%';
  };
}

// ======================= 4. FLUXO DO ATENDENTE (22.18 – 27.62) dark, one continuous camera move =======================
const FL = scene(22.18, 27.62, '#0b0b0b');
{
  const e = FL.e; const amb = ambient(e);
  const world = mk(e, 'left:0;top:0;width:1080px;height:3200px');
  // S1: site + chat
  const sb = browser(world, 540, 640, 900, 620, 'dark'); sb.style.boxShadow = '0 50px 100px rgba(0,0,0,.6)';
  mk(sb.body, 'inset:0;background:url(img/alpha.jpg) center/cover');
  mk(sb.body, 'inset:0;background:linear-gradient(90deg,rgba(0,0,0,.15),rgba(0,0,0,.55))');
  const panel = mk(sb.body, 'right:22px;top:22px;width:420px;height:528px;border-radius:26px;background:#fff;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.45)', `
    <div style="position:absolute;left:0;right:0;top:0;height:90px;border-bottom:1px solid #eee"><div style="position:absolute;left:22px;top:18px;width:54px;height:54px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center">${sym('#111', 34)}</div><div style="position:absolute;left:90px;top:20px;font-family:IS;font-weight:700;font-size:24px;color:#111">Assistente IA</div><div class="mono" style="position:absolute;left:90px;top:54px;font-size:13px;color:#888;display:flex;gap:8px;align-items:center"><i style="display:block;width:9px;height:9px;border-radius:50%;background:#2bd46b"></i>online</div></div>`);
  const MSG = [['Olá! Como posso ajudar?', 'l', 22.46], ['Vocês fazem orçamento?', 'r', 23.08], ['Claro! Qual serviço e para quando?', 'l', 23.66]];
  const bubs = MSG.map(([s, side, ti], i) => mk(panel, `${side === 'r' ? 'right:18px' : 'left:18px'};top:${112 + i * 120}px;max-width:300px;padding:16px 20px;border-radius:24px;${side === 'r' ? `background:${Y};color:#111;border-bottom-right-radius:6px;font-weight:600` : 'background:#f0efeb;color:#111;border-bottom-left-radius:6px'};font-family:IS;font-size:23px;line-height:1.25;transform-origin:${side === 'r' ? '100% 100%' : '0 100%'}`, s));
  const typing = mk(panel, 'left:18px;top:232px;padding:18px 22px;border-radius:24px;background:#f0efeb;display:flex;gap:8px', '<i class="d" style="display:block;width:11px;height:11px;border-radius:50%;background:#999"></i><i class="d" style="display:block;width:11px;height:11px;border-radius:50%;background:#999"></i><i class="d" style="display:block;width:11px;height:11px;border-radius:50%;background:#999"></i>');
  const s1l = C(world, 540, 1010, 600, 30, 'text-align:center;font-size:18px;color:#777', 'atende · responde', 'mono');
  // S2/S3 live in w2, shifted down so the funnel never sits behind the captions
  const w2 = mk(world, 'left:0;top:250px;width:1080px;height:3200px');
  // spine
  const spine = mk(w2, 'left:0;top:0;width:1080px;height:3200px', `<svg width="1080" height="3200"><path d="M540 960 L540 1150 M540 1700 L540 2160" stroke="#333" stroke-width="4" stroke-dasharray="10 12"/></svg>`);
  const lead = C(w2, 540, 960, 40, 40, `border-radius:50%;background:${Y};box-shadow:0 0 30px ${Y}`);
  // S2: funnel filter
  const fun = mk(w2, 'left:0;top:0;width:1080px;height:3200px', `<svg width="1080" height="3200"><defs><linearGradient id="fg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${Y}" stop-opacity=".16"/><stop offset="1" stop-color="${Y}" stop-opacity=".02"/></linearGradient></defs>
     <path d="M250 1280 L830 1280 L610 1560 L610 1650 L470 1650 L470 1560Z" fill="url(#fg)" stroke="${Y}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="540" cy="1280" rx="290" ry="26" fill="none" stroke="${Y}" stroke-width="5" opacity=".6"/></svg>`);
  const N = 10, ACC = [2, 5, 8];
  const cls = Array.from({ length: N }, (_, i) => C(w2, 0, 0, 62, 62, 'border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 20px rgba(0,0,0,.4)', ICO.person('#111', 40)));
  const chipsF = [['✓ serviço', 190, 1330], ['✓ prazo', 890, 1420], ['✓ orçamento', 200, 1530]].map(([s, x, y]) => C(w2, x, y, 230, 64, `border-radius:32px;background:#161616;border:2px solid #2c2c2c;color:#fff;display:flex;align-items:center;justify-content:center;font-family:IS;font-weight:600;font-size:25px`, s.replace('✓', `<span style="color:${Y};margin-right:8px">✓</span>`)));
  const s2l = C(w2, 540, 1200, 600, 30, `text-align:center;font-size:18px;color:${Y}`, 'filtra o cliente', 'mono');
  // S3: WhatsApp
  const wa = C(w2, 540, 2460, 880, 600, 'border-radius:40px;background:#121212;border:2px solid #222;overflow:hidden;box-shadow:0 50px 100px rgba(0,0,0,.6)', `
    <div style="position:absolute;left:0;right:0;top:0;height:110px;background:#1a1a1a;display:flex;align-items:center;gap:20px;padding-left:30px">${ICO.wa(60)}<div><div style="font-family:IS;font-weight:700;font-size:30px;color:#fff">WhatsApp</div><div class="mono" style="font-size:14px;color:#888;margin-top:4px">seu negócio</div></div></div>
    <div style="position:absolute;left:0;right:0;top:110px;bottom:0;background-image:radial-gradient(#1c1c1c 1.5px,transparent 1.5px);background-size:26px 26px"></div>`);
  const leadCard = mk(wa, 'left:34px;top:150px;width:600px;padding:26px 30px;border-radius:30px 30px 30px 8px;background:#fff;transform-origin:0 100%', `
    <div style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:20px;background:${Y};font-family:U;font-weight:700;font-size:20px;color:#111">✓ cliente qualificado</div>
    <div style="font-family:IS;font-weight:700;font-size:34px;color:#111;margin-top:18px">Ana · Lisboa</div>
    <div style="font-family:IS;font-weight:500;font-size:26px;color:#555;margin-top:10px;line-height:1.45">Quer: site + Google<br>Prazo: este mês · Orçamento ok</div>`);
  const toast = C(w2, 540, 2090, 640, 96, `border-radius:48px;background:#fff;display:flex;align-items:center;gap:18px;padding-left:22px;box-shadow:0 26px 60px rgba(0,0,0,.5)`, `${ICO.wa(56)}<div><div style="font-family:IS;font-weight:700;font-size:26px;color:#111">Novo cliente pronto</div><div class="mono" style="font-size:13px;color:#777">agora · via assistente</div></div><div style="position:absolute;right:26px;width:40px;height:40px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:20px;color:#111">1</div>`);
  FL.u = t => {
    amb(t);
    const inn = E.io5(P(t, 22.18, 22.52)); const out = E.io5(P(t, 27.26, 27.62));
    const p1 = E.io5(P(t, 24.12, 24.58)), p2 = E.io5(P(t, 25.44, 25.92));
    const wy = 70 - 1010 * p1 - 1030 * p2 - 1920 * out;
    e.style.transform = `translateY(${((1 - inn) * 1920).toFixed(1)}px)`;
    world.style.transform = `translateY(${wy.toFixed(1)}px)`;
    set(sb, { s: T(t, 22.3, 22.8, .94, 1, E.o4) });
    bubs.forEach((b, i) => { const ti = MSG[i][2]; b.style.transform = `scale(${L(.4, 1, E.back(P(t, ti, ti + .3))).toFixed(3)})`; b.style.opacity = P(t, ti, ti + .08) });
    typing.style.opacity = win(t, 23.25, 23.66, .08, .06);
    typing.querySelectorAll('.d').forEach((d, j) => d.style.transform = `translateY(${(-6 * Math.max(0, Math.sin((t * 7 - j * .5) * Math.PI))).toFixed(2)}px)`);
    set(s1l, { o: P(t, 22.6, 22.9) });
    // lead dot along the spine: chat -> funnel (23.9–24.4), funnel exit -> whatsapp (25.4–26.0)
    let ly = 960, lo = 0;
    if (t >= 23.9 && t < 24.4) { ly = L(960, 1150, E.io3(P(t, 23.9, 24.4))); lo = 1 }
    else if (t >= 25.36 && t < 26.12) { ly = L(1700, 2260, E.io3(P(t, 25.36, 26.1))); lo = 1 - P(t, 26.0, 26.12) }
    set(lead, { y: ly - 960, o: lo });
    // clients falling into the funnel
    cls.forEach((c, i) => {
      const st = 24.26 + i * .085; const x0 = 300 + ((i * 197) % 480);
      const acc = ACC.includes(i);
      let x, y, o = P(t, st, st + .06), col = '#fff', s = 1;
      const a = E.i2(P(t, st, st + .32));
      x = x0; y = L(1080, 1270, a);
      if (acc) { const b = E.io3(P(t, st + .32, st + .7)); x = L(x0, 540, b); y = L(1270, 1600, b); const c2 = E.o3(P(t, st + .7, st + 1.0)); x += (ACC.indexOf(i) - 1) * 80 * c2; y += 110 * c2; if (t > st + .45) col = Y }
      else { const b = E.o3(P(t, st + .32, st + .7)); const dir = x0 < 540 ? -1 : 1; x = x0 + dir * 300 * b; y = 1270 - 160 * Math.sin(Math.PI * b * .9) + 60 * b; o *= 1 - .75 * b; s = 1 - .3 * b; if (t > st + .32) col = '#555' }
      set(c, { x, y, o, s });
      c.style.background = col;
    });
    chipsF.forEach((c, i) => { const st = 24.52 + i * .2; set(c, { s: E.back(P(t, st, st + .3)), o: P(t, st, st + .08) }) });
    set(s2l, { o: P(t, 24.3, 24.5) });
    set(wa, { s: T(t, 25.5, 26.0, .92, 1, E.o4), o: P(t, 25.3, 25.7) });
    leadCard.style.transform = `scale(${L(.3, 1, E.back(P(t, 26.08, 26.42))).toFixed(3)})`; leadCard.style.opacity = P(t, 26.08, 26.16);
    set(toast, { y: T(t, 26.68, 27.0, -60, 0, E.o4), s: E.back(P(t, 26.68, 26.98)) * (1 + .04 * ring(t, 27.0, 3, 7)), o: P(t, 26.68, 26.74) });
  };
}

// ======================= 5. QUANTO VOCÊ ECONOMIZA? (27.24 – 30.8) =======================
const SV = scene(27.24, 30.8, '#0b0b0b');
{
  const e = SV.e; const amb = ambient(e);
  const grp = mk(e, 'left:0;top:0;width:1080px;height:1920px;transform-origin:540px 700px');
  const pp = C(grp, 540, 720, 720, 820, `background:${PAPER_BG};clip-path:${teeth(36, 12)};filter:drop-shadow(0 40px 60px rgba(0,0,0,.6))`);
  mk(pp, 'left:0;top:40px;width:720px;text-align:center;font-family:U;font-weight:700;font-size:48px;color:#111;letter-spacing:-.02em', 'SUA CONTA');
  mk(pp, 'left:36px;right:36px;top:120px;border-top:3px dashed #cfcdc5');
  const LBL = ['Site profissional', 'Gestão do Google', 'Atendente na Europa'];
  const strikes = LBL.map((s, i) => { mk(pp, `left:44px;top:${150 + i * 74}px;font-family:IS;font-weight:600;font-size:32px;color:#9a988f`, s); mk(pp, `right:44px;top:${154 + i * 74}px;font-size:18px;color:#b0aea6`, i === 2 ? '€ / mês' : '€ €€€', 'mono'); return mk(pp, `left:36px;right:36px;top:${172 + i * 74}px;height:5px;background:#111;border-radius:3px;transform-origin:0 50%`) });
  const nwRow = mk(pp, `left:28px;right:28px;top:380px;height:96px;border-radius:20px;background:#111;display:flex;align-items:center;gap:18px;padding-left:24px`, `${sym(Y, 64)}<div style="font-family:U;font-weight:700;font-size:30px;color:#fff;letter-spacing:-.01em">New Way</div><div class="mono" style="margin-left:auto;margin-right:24px;font-size:17px;color:${Y}">1 pacote</div>`);
  mk(pp, 'left:36px;right:36px;top:510px;border-top:3px dashed #cfcdc5');
  mk(pp, 'left:0;top:540px;width:720px;text-align:center;font-size:20px;color:#8a8a85', 'você economiza', 'mono');
  const val = mk(pp, 'left:60px;right:60px;top:584px;height:170px;border-radius:24px;overflow:hidden;background:#fff;border:3px solid #111');
  const digits = mk(val, 'left:0;top:0;width:100%;height:170px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:96px;color:#111;letter-spacing:-.03em', '€ 0.000');
  const scratch = mk(val, `inset:0;background:repeating-linear-gradient(135deg,${Y} 0 22px,#f0b800 22px 44px);display:flex;align-items:center;justify-content:center`, `<div style="font-family:U;font-weight:900;font-size:120px;color:#111;line-height:1">?</div>`);
  const q = scratch.firstChild;
  // CTA arrows
  const lab = C(e, 540, 1170, 900, 40, 'text-align:center;font-size:26px;color:#fff', 'clica no botão', 'mono');
  const chev = [0, 1, 2].map(i => C(e, 540, 1250 + i * 52, 90, 50, '', `<svg width="90" height="50" viewBox="0 0 90 50"><path d="M10 10 L45 40 L80 10" fill="none" stroke="${Y}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`));
  const lab2 = C(e, 540, 1440, 900, 40, `text-align:center;font-size:26px;color:${Y}`, 'aí embaixo', 'mono');
  const dash = mk(e, `left:537px;top:1490px;width:6px;height:430px;background:repeating-linear-gradient(180deg,${Y} 0 18px,transparent 18px 34px);transform-origin:50% 0`);
  SV.u = t => {
    amb(t);
    const inn = E.io5(P(t, 27.24, 27.6)); const out = E.io5(P(t, 30.46, 30.78));
    e.style.transform = `translateY(${((1 - inn) * 1920 - out * 600).toFixed(1)}px)`;
    const up = E.io5(P(t, 29.0, 29.45));
    grp.style.transform = `translateY(${(-230 * up).toFixed(1)}px) scale(${(L(1, .82, up) * T(t, 27.4, 29, 1.02, 1, E.lin)).toFixed(4)})`;
    strikes.forEach((s, i) => s.style.transform = `scaleX(${E.io3(P(t, 27.46 + i * .13, 27.7 + i * .13)).toFixed(3)})`);
    nwRow.style.transform = `scale(${E.back(P(t, 27.84, 28.14)).toFixed(3)})`; nwRow.style.opacity = P(t, 27.84, 27.9);
    // digits roll (hidden under the scratch card)
    const n = Math.floor((t * 37) % 10) + '' + Math.floor((t * 53) % 10) + Math.floor((t * 71) % 10) + Math.floor((t * 29) % 10);
    digits.textContent = `€ ${n[0]}.${n.slice(1)}`;
    digits.style.filter = 'blur(10px)';
    q.style.transform = `scale(${(E.back2(P(t, 28.3, 28.6)) * (1 + .08 * Math.sin(t * 6) * P(t, 28.6, 28.8))).toFixed(3)}) rotate(${(-8 + 8 * E.o3(P(t, 28.3, 28.7))).toFixed(2)}deg)`;
    scratch.style.opacity = 1;
    set(lab, { o: P(t, 29.04, 29.24), y: T(t, 29.04, 29.4, 30, 0, E.o4) });
    chev.forEach((c, i) => { const ph = (t * 2.2 - i * .22) % 1; set(c, { o: P(t, 29.5 + i * .08, 29.62 + i * .08) * (.35 + .65 * Math.max(0, Math.sin(ph * Math.PI))) }) });
    set(lab2, { o: P(t, 29.96, 30.1), y: T(t, 29.96, 30.3, 30, 0, E.o4) });
    dash.style.transform = `scaleY(${E.o4(P(t, 30.1, 30.45)).toFixed(3)})`;
  };
}

// ======================= 6. TRÊS SOLUÇÕES, UM PACOTE (30.46 – 32.7) yellow =======================
const TP = scene(30.46, 32.72, Y);
{
  const e = TP.e;
  mk(e, 'inset:0;background:radial-gradient(ellipse 70% 45% at 50% 40%,rgba(255,255,255,.35),rgba(255,255,255,0) 70%)');
  const nm = C(e, 540, 560, 420, 400, 'overflow:hidden');
  const col = mk(nm, 'left:0;top:0;width:420px;height:800px', `<div style="height:400px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:900;font-size:400px;color:#111;line-height:1">3</div><div style="height:400px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:900;font-size:400px;color:#111;line-height:1">1</div>`);
  const lA = mk(e, 'left:0;top:790px;width:1080px;height:100px;overflow:hidden'); const lAi = mk(lA, 'left:0;top:0;width:1080px;height:100px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:80px;color:#111;letter-spacing:-.03em', 'SOLUÇÕES');
  const lBi = mk(lA, 'left:0;top:0;width:1080px;height:100px;display:flex;align-items:center;justify-content:center;font-family:U;font-weight:800;font-size:80px;color:#111;letter-spacing:-.03em', 'PACOTE');
  const IC = [['site', 270], ['pin', 540], ['chat', 810]];
  const ics = IC.map(([ic, x]) => C(e, x, 1110, 190, 190, 'border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center;box-shadow:0 26px 50px rgba(90,50,0,.3)', ICO[ic](Y, 92)));
  const bx = C(e, 540, 1110, 250, 250, 'border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 60px rgba(90,50,0,.35)', ICO.box(Y, 130));
  const rg = C(e, 540, 1110, 250, 250, 'border-radius:50%;border:6px solid #111');
  TP.u = t => {
    const inn = E.io5(P(t, 30.46, 30.76)); const out = E.io5(P(t, 32.36, 32.7));
    e.style.transform = `translateY(${((1 - inn) * 1920 - out * 700).toFixed(1)}px)`;
    e.style.borderRadius = `${(50 * (1 - inn)).toFixed(1)}px ${(50 * (1 - inn)).toFixed(1)}px 0 0`;
    const roll = E.io5(P(t, 31.56, 31.9));
    col.style.transform = `translateY(${(-400 * roll).toFixed(1)}px)`; col.style.filter = roll > 0 && roll < 1 ? `blur(${(Math.sin(Math.PI * roll) * 14).toFixed(1)}px)` : 'none';
    set(nm, { s: E.back(P(t, 30.6, 30.9)) * (1 + .05 * ring(t, 31.9, 3, 7)), o: P(t, 30.6, 30.66) });
    const la = E.o5(P(t, 30.9, 31.3)), lb = E.io5(P(t, 31.6, 31.95));
    lAi.style.transform = `translateY(${((1 - la) * 100 - lb * 100).toFixed(1)}px)`;
    lBi.style.transform = `translateY(${((1 - lb) * 100).toFixed(1)}px)`;
    const m = E.i3(P(t, 31.6, 31.86));
    ics.forEach((c, i) => { const st = 30.66 + i * .12; set(c, { s: E.back2(P(t, st, st + .3)) * L(1, .4, m), x: (540 - IC[i][1]) * m, o: P(t, st, st + .06) * (1 - P(t, 31.8, 31.88)) }) });
    set(bx, { s: E.back2(P(t, 31.84, 32.14)), o: P(t, 31.84, 31.9) });
    const rp = P(t, 31.9, 32.4); set(rg, { s: 1 + rp * .8, o: (1 - rp) * (t > 31.9 ? 1 : 0) });
  };
}

// ======================= 7. UMA EMPRESA CUIDANDO (32.38 – 34.1) =======================
const TM = scene(32.38, 34.1, '#0b0b0b');
{
  const e = TM.e; const amb = ambient(e, '255,196,0', .2);
  const s1 = C(e, 540, 330, 180, 90, '', sym(Y, 180));
  const pol = (x, y, r, img, name, pos) => { const p = C(e, x, y, 440, 560, 'background:#f7f6f2;box-shadow:0 40px 80px rgba(0,0,0,.6);border-radius:6px'); mk(p, `left:24px;top:24px;width:392px;height:420px;background:url(img/${img}) ${pos}/cover;filter:grayscale(1) contrast(1.08) brightness(1.02)`); mk(p, 'left:0;right:0;top:462px;text-align:center;font-family:ISI;font-style:italic;font-size:58px;color:#111', name); mk(p, `left:150px;top:-22px;width:140px;height:46px;background:${Y};opacity:.92;transform:rotate(${r > 0 ? -4 : 5}deg)`); return p };
  const p1 = pol(330, 820, -7, 'pedro.jpg', 'Pedro', '60% 30%');
  const p2 = pol(760, 850, 6, 'gustavo.jpg', 'Gustavo', '50% 25%');
  TM.u = t => {
    amb(t);
    const tin = E.io5(P(t, 32.36, 32.7));
    e.style.transform = `translateY(${((1 - tin) * 1920).toFixed(1)}px)`;
    e.style.borderRadius = `${(50 * (1 - tin)).toFixed(1)}px ${(50 * (1 - tin)).toFixed(1)}px 0 0`;
    const push = T(t, 32.4, 34.1, 1, 1.05, E.lin);
    set(s1, { o: P(t, 32.6, 32.85), y: T(t, 32.6, 32.95, 20, 0, E.o4) });
    const a = E.o4(P(t, 32.44, 32.95)), b = E.o4(P(t, 32.56, 33.07));
    set(p1, { y: (1 - a) * 900, r: L(-22, -7, a) + 1.2 * Math.sin(t * 1.3), s: push, o: P(t, 32.44, 32.5) });
    set(p2, { y: (1 - b) * 900, r: L(20, 6, b) - 1.2 * Math.sin(t * 1.1), s: push, o: P(t, 32.56, 32.62) });
  };
}

// ======================= 8. CTA (33.7 – end) yellow =======================
const CT = scene(33.7, 40, 'transparent');
{
  const e = CT.e;
  const disc = C(e, 540, 900, 100, 100, `border-radius:50%;background:${Y}`);
  const bgl = mk(e, 'inset:0;background:radial-gradient(ellipse 70% 40% at 50% 45%,rgba(255,255,255,.35),rgba(255,255,255,0) 70%);opacity:0');
  const lg = C(e, 540, 440, 470, 260);
  const s1 = C(lg, 235, 62, 250, 124, '', sym('#111', 250));
  const wm = C(lg, 235, 176, 430, 70, '', wmLetters('#111', 430));
  const tl = C(lg, 235, 234, 340, 22, '', tagline('#111', 340));
  const btn = C(e, 540, 870, 860, 190, 'border-radius:95px;background:#111;box-shadow:0 34px 70px rgba(80,50,0,.35)', `
    <div style="position:absolute;left:70px;top:0;height:190px;display:flex;align-items:center;font-family:U;font-weight:700;font-size:52px;color:#fff;letter-spacing:-.015em">Fala com a gente</div>
    <div id="ac" style="position:absolute;right:24px;top:24px;width:142px;height:142px;border-radius:50%;background:${Y};display:flex;align-items:center;justify-content:center"><svg width="58" height="58" viewBox="0 0 56 56"><path d="M8 28 H46 M30 12 L46 28 L30 44" stroke="#111" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`);
  const ac = btn.querySelector('#ac');
  const rip = C(e, 540, 870, 860, 190, 'border-radius:95px;border:5px solid #111');
  const cur = C(e, 0, 0, 64, 83, '', CURSOR(64, '#fff', '#111'));
  const REC = [['site', 'Site', 250], ['pin', 'Google', 540], ['chat', 'IA', 830]];
  const recs = REC.map(([ic, s, x]) => C(e, x, 1100, 250, 80, 'border-radius:40px;border:3px solid #111;display:flex;align-items:center;justify-content:center;gap:12px;font-family:IS;font-weight:700;font-size:30px;color:#111', `${ICO[ic]('#111', 34)}${s}`));
  const one = C(e, 540, 1215, 480, 76, 'border-radius:38px;background:#111;display:flex;align-items:center;justify-content:center;gap:14px;font-family:U;font-weight:700;font-size:26px;color:#fff', `${ICO.box(Y, 34)}1 pacote · 1 empresa`);
  CT.u = t => {
    set(disc, { s: E.o4(P(t, 33.72, 34.12)) * 48 });
    bgl.style.opacity = P(t, 34.0, 34.4);
    set(lg, { y: T(t, 33.86, 34.26, 40, 0, E.o4), o: P(t, 33.86, 34.0) });
    set(s1, { s: T(t, 33.86, 34.24, .7, 1, E.back) });
    const click = ring(t, 34.36, 3, 9);
    set(btn, { s: E.back(P(t, 33.84, 34.16)) * (1 - .05 * Math.sin(Math.PI * P(t, 34.34, 34.5))) + .02 * click, o: P(t, 33.84, 33.92), y: T(t, 33.84, 34.16, 60, 0, E.o4) });
    const rp = P(t, 34.4, 35.0); set(rip, { s: 1 + rp * .22, o: (1 - rp) * (t > 34.4 ? .7 : 0) });
    const nud = t > 34.8 ? Math.max(0, Math.sin((t - 34.8) * Math.PI * 1.6)) ** 2 * 12 : 0;
    ac.style.transform = `translateX(${nud.toFixed(2)}px) scale(${(1 + .06 * ring(t, 34.84, 3, 7)).toFixed(3)})`;
    const k = E.o4(P(t, 33.94, 34.32));
    set(cur, { x: L(1010, 812, k), y: L(1420, 900, k), s: 1 - .18 * Math.sin(Math.PI * P(t, 34.32, 34.48)), o: P(t, 33.94, 34.0) * (1 - P(t, 35.2, 35.5)) });
    recs.forEach((r, i) => { const st = 34.84 + i * .1; set(r, { y: T(t, st, st + .4, 40, 0, E.o4), s: E.back(P(t, st, st + .36)), o: P(t, st, st + .08) }) });
    set(one, { y: T(t, 35.2, 35.6, 40, 0, E.o4), s: E.back(P(t, 35.2, 35.54)), o: P(t, 35.2, 35.28) });
  };
}

// ======================= captions / timing =======================
const WORDS = [["Faz", 0.04], ["essa", 0.40], ["conta", 0.60], ["comigo.", 0.96],
["Um", 1.84], ["site", 2.00], ["profissional,", 2.48], ["você", 3.28], ["paga.", 3.52],
["Alguém", 4.16], ["para", 4.56], ["cuidar", 4.72], ["do", 5.12], ["seu", 5.20], ["Google,", 5.44], ["você", 6.00], ["paga.", 6.32],
["Um", 6.88], ["atendente", 7.12], ["aqui", 7.68], ["na", 7.92], ["Europa,", 8.08], ["você", 8.56], ["paga", 8.80], ["salário", 9.20], ["todo", 9.60], ["mês.", 9.84],
["São", 10.42], ["três", 10.82], ["contas", 11.14], ["para", 11.62], ["resolver", 11.78], ["um", 12.26], ["problema", 12.50], ["só,", 12.90], ["vender", 13.38], ["mais.", 13.94],
["A", 14.42], ["New", 14.58], ["Way", 14.90], ["junta", 15.22], ["tudo", 15.62], ["numa", 15.86], ["entrega:", 16.18],
["site", 16.84], ["profissional,", 17.24], ["Google", 17.92], ["Meu", 18.36], ["Negócio", 18.60], ["configurado", 19.02],
["e", 19.50], ["um", 19.72], ["atendente", 19.98], ["inteligente", 20.55], ["integrado", 21.15], ["no", 21.70], ["site,", 21.88],
["que", 22.28], ["atende,", 22.45], ["responde", 23.12], ["perguntas", 23.68], ["e", 24.16], ["filtra", 24.32], ["o", 24.80], ["cliente", 24.88],
["antes", 25.36], ["de", 25.60], ["levar", 25.76], ["ele", 26.08], ["para", 26.32], ["o", 26.48], ["seu", 26.56], ["WhatsApp.", 26.72],
["Quer", 27.36], ["ver", 27.60], ["quanto", 27.84], ["você", 28.08], ["economiza?", 28.32],
["Clica", 29.04], ["no", 29.52], ["botão", 29.66], ["aí", 29.98], ["embaixo.", 30.12],
["Três", 30.60], ["soluções,", 30.92], ["um", 31.62], ["pacote.", 31.86],
["Uma", 32.50], ["empresa", 32.78], ["cuidando.", 33.14],
["Clica", 33.80], ["no", 34.28], ["botão", 34.36], ["e", 34.68], ["fala", 34.84], ["com", 35.16], ["a", 35.32], ["gente.", 35.40]];
const CH = [[0, 3, [2], 1.76], [4, 6, [], 3.22], [7, 8, [8], 4.1], [9, 11, [], 5.38], [12, 14, [14], 5.96], [15, 16, [16], 6.84],
[17, 21, [21], 8.5], [22, 24, [24], 9.56], [25, 26, [25, 26], 10.36], [27, 29, [28], 11.58], [30, 31, [], 12.22], [32, 34, [33, 34], 13.3],
[37, 41, [38, 39], 15.82], [42, 43, [43], 16.78], [44, 45, [45], 17.88], [46, 49, [49], 19.46], [50, 53, [53], 21.1], [54, 56, [54], 22.22],
[57, 58, [58], 23.08], [59, 60, [60], 24.12], [61, 64, [62], 25.32], [65, 68, [], 26.3], [69, 72, [72], 27.3],
[73, 77, [77], 29.0],
[87, 89, [89], 33.72], [90, 92, [92], 34.64], [93, 97, [94, 95, 96, 97], 36.7]];
const THEME = t => t < 14.42 ? 'd' : t < 16.88 ? 'y' : t < 22.3 ? 'l' : t < 30.5 ? 'd' : t < 32.42 ? 'y' : t < 33.78 ? 'd' : 'y';
const SHAKE = [[3.42, 9], [6.32, 9], [8.58, 9], [12.6, 4], [13.94, 11], [16.2, 10], [26.72, 4], [31.9, 8], [34.36, 6]];
window.seek = makeSeek({ WORDS, CH, THEME, SHAKE });

window.SFX = [
  { t: .02, type: 'swell', g: .35 }, { t: .12, type: 'print', g: .32 },
  { t: 1.82, type: 'whoosh', g: .4 }, { t: 1.95, type: 'prints', g: .25 },
  { t: 3.4, type: 'stamp', g: .62 }, { t: 3.9, type: 'swish', g: .3 },
  { t: 4.14, type: 'whoosh', g: .36 }, { t: 4.2, type: 'prints', g: .22 },
  { t: 4.72, type: 'tick', g: .28 }, { t: 5.06, type: 'tick', g: .28 }, { t: 5.4, type: 'tick', g: .28 },
  { t: 6.3, type: 'stamp', g: .62 }, { t: 6.55, type: 'swish', g: .3 },
  { t: 6.86, type: 'whoosh', g: .36 }, { t: 6.92, type: 'prints', g: .22 }, { t: 7.32, type: 'click', g: .22 },
  { t: 8.56, type: 'stamp', g: .62 }, { t: 9.12, type: 'pop', g: .22 },
  ...[0, 2, 4, 6, 8, 10].map(i => ({ t: 9.3 + i * (.86 / 11), type: 'flip', g: .16 })),
  { t: 10.18, type: 'swish', g: .3 }, { t: 10.4, type: 'prints', g: .3 },
  { t: 10.8, type: 'pop', g: .18 }, { t: 10.93, type: 'pop', g: .16 }, { t: 11.06, type: 'pop', g: .16 },
  { t: 12.26, type: 'swish', g: .22 }, { t: 12.56, type: 'hit', g: .35 },
  { t: 13.3, type: 'whoosh', g: .35 }, { t: 13.36, type: 'hit', g: .42 }, { t: 13.92, type: 'impact', g: .6 },
  { t: 14.32, type: 'swell', g: .38 }, { t: 14.52, type: 'whoosh', g: .42 },
  { t: 14.86, type: 'pop', g: .16 }, { t: 14.94, type: 'pop', g: .14 }, { t: 15.02, type: 'pop', g: .14 },
  { t: 15.2, type: 'swish', g: .24 }, { t: 15.33, type: 'swish', g: .22 }, { t: 15.46, type: 'swish', g: .22 },
  { t: 15.72, type: 'flap', g: .3 }, { t: 15.88, type: 'flap', g: .32 }, { t: 16.1, type: 'tape', g: .42 }, { t: 16.18, type: 'thud', g: .6 }, { t: 16.28, type: 'pop', g: .2 },
  { t: 16.68, type: 'zoom', g: .45 },
  { t: 16.9, type: 'whoosh', g: .32 }, { t: 17.36, type: 'ding', g: .2 },
  { t: 17.94, type: 'whoosh', g: .28 }, { t: 18.42, type: 'drop', g: .3 }, { t: 18.98, type: 'ding', g: .2 },
  { t: 19.66, type: 'whoosh', g: .28 }, { t: 20.58, type: 'shimmer', g: .28 },
  { t: 21.12, type: 'swish', g: .25 }, { t: 21.52, type: 'pop', g: .24 },
  { t: 22.14, type: 'whoosh', g: .45 },
  { t: 22.46, type: 'msg', g: .26 }, { t: 23.08, type: 'msg2', g: .24 }, { t: 23.66, type: 'msg', g: .24 },
  { t: 24.1, type: 'swish', g: .3 },
  ...[0, 3, 6, 9].map(i => ({ t: 24.56 + i * .085, type: 'tick', g: .14 })),
  { t: 24.52, type: 'pop', g: .16 }, { t: 24.72, type: 'pop', g: .14 }, { t: 24.92, type: 'pop', g: .14 },
  { t: 25.42, type: 'swish', g: .3 }, { t: 26.08, type: 'msg', g: .3 }, { t: 26.68, type: 'notif', g: .34 },
  { t: 27.22, type: 'whoosh', g: .42 },
  { t: 27.46, type: 'scribble', g: .2 }, { t: 27.59, type: 'scribble', g: .2 }, { t: 27.72, type: 'scribble', g: .2 },
  { t: 27.84, type: 'pop', g: .2 }, { t: 28.3, type: 'hit', g: .32 },
  { t: 29.0, type: 'swish', g: .28 }, { t: 29.96, type: 'pop', g: .22 },
  { t: 30.44, type: 'swish', g: .42 },
  { t: 30.66, type: 'hit', g: .28 }, { t: 30.78, type: 'hit', g: .28 }, { t: 30.9, type: 'hit', g: .28 },
  { t: 31.54, type: 'zoom', g: .32 }, { t: 31.86, type: 'impact', g: .5 },
  { t: 32.38, type: 'whoosh', g: .38 }, { t: 32.5, type: 'swish', g: .24 }, { t: 32.62, type: 'swish', g: .22 },
  { t: 33.66, type: 'swell', g: .35 },
  { t: 34.34, type: 'click', g: .55 },
  { t: 34.84, type: 'pop', g: .14 }, { t: 35.2, type: 'pop', g: .16 },
  { t: 35.4, type: 'chime', g: .28 },
];

window.ready = document.fonts.ready.then(() => Promise.all(['deck', 'kundara', 'alpha', 'pedro', 'gustavo'].map(n => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = `img/${n}.jpg` })))).then(() => { seek(0, 0); return true });
