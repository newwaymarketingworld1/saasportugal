# Audio for "A conta": original music bed + subtle SFX + voice, ducked and loudness-normalised.
# Usage: python3 mix.py   (needs voice.mp3, sfx.json written by render.js) -> final.wav
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100; DUR = 36.6; N = int(SR * DUR)
rng = np.random.default_rng(7)
def t_(d): return np.arange(int(SR * d)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def note(m): return 440 * 2 ** ((m - 69) / 12)
def add(buf, x, t, g=1.0):
    i = int(round(t * SR))
    if i >= len(buf) or i + len(x) <= 0: return
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i] * g

# ---------------- SFX ----------------
def sweep_noise(d, f0, f1, f2):
    n = int(SR * d); x = rng.standard_normal(n); out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        p = i / n; f = f0 + (f1 - f0) * (p / .6) if p < .6 else f1 + (f2 - f1) * ((p - .6) / .4)
        f = max(80, min(16000, f)); out[i:i + seg] = bp(x[max(0, i - 2048):i + seg], f * .6, min(f * 1.6, 20000))[-len(x[i:i + seg]):]
    return out
def S_whoosh():
    d = .55; x = sweep_noise(d, 300, 4200, 600); t = t_(d)
    e = np.where(t < .3, (t / .3) ** 2.5, np.exp(-(t - .3) * 9)); return lp(x, 6000) * e * .9
def S_swish():
    d = .42; x = sweep_noise(d, 500, 6000, 1500); t = t_(d); e = np.where(t < .24, (t / .24) ** 2, np.exp(-(t - .24) * 14)); return x * e * .7
def S_swell():
    d = .45; t = t_(d); x = sweep_noise(d, 300, 7000, 9000); e = (t / d) ** 3
    tone = np.sin(2 * np.pi * np.cumsum(150 + 500 * (t / d) ** 2) / SR) * .1 * e; return x * e * .6 + tone
def S_zoom():
    d = .45; t = t_(d); w = sweep_noise(d, 400, 5000, 9000) * (t / d) ** 2
    f = 200 + 1600 * (t / d) ** 2; s = np.sin(2 * np.pi * np.cumsum(f) / SR) * .12 * (t / d) ** 2
    return (w * .8 + s) * np.where(t > d - .03, (d - t) / .03, 1)
def S_hit(g=1):
    d = .9; t = t_(d); f = 90 * np.exp(-t * 6) + 42; body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5) * .9
    click = lp(rng.standard_normal(len(t)), 3500) * np.exp(-t * 60) * .5; return (body + click) * g
def S_impact():
    d = 1.6; t = t_(d); f = 58 * np.exp(-t * 2.5) + 38; body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.8)
    nz = lp(rng.standard_normal(len(t)), 700) * np.exp(-t * 9) * .5; air = hp(rng.standard_normal(len(t)), 5000) * np.exp(-t * 6) * .06
    return (body + nz + air) * .9
def S_boom():
    d = 2.2; t = t_(d); f = 70 * np.exp(-t * 3) + 34; body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.7)
    nz = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 5) * .6; shim = hp(rng.standard_normal(len(t)), 6000) * np.exp(-t * 3) * .1
    return body + nz + shim
def S_tick(): d = .06; t = t_(d); return bp(rng.standard_normal(len(t)), 2500, 7000) * np.exp(-t * 110) * .5 + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 90) * .2
def S_clock(hi=True):
    d = .07; t = t_(d); f = 2600 if hi else 2100
    return bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 140) * .45 + np.sin(2 * np.pi * f * t) * np.exp(-t * 120) * .25
def S_pop():
    d = .16; t = t_(d); f = 520 + 760 * (t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * .45
def S_ding():
    d = 1.4; t = t_(d); return (np.sin(2 * np.pi * 1318.5 * t) + .5 * np.sin(2 * np.pi * 1975.5 * t) + .25 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 3.2) * .22 * np.minimum(1, t / .004)
def S_stamp():
    d = .5; t = t_(d); thud = lp(rng.standard_normal(len(t)), 600) * np.exp(-t * 30); return thud * 1.1 + S_hit(.6)[:len(t)]
def S_shine():
    d = 1.2; t = t_(d); y = np.zeros(len(t))
    for k, f in enumerate([2093, 2637, 3136, 4186]):
        y += np.sin(2 * np.pi * f * t + 3 * np.sin(2 * np.pi * 6 * t)) * np.exp(-np.maximum(0, t - k * .06) * 4) * (t > k * .06)
    return y * .07 + sweep_noise(d, 3000, 9000, 7000) * np.exp(-t * 4) * .12
def S_shimmer():
    d = 1.6; t = t_(d); y = np.zeros(len(t))
    for k, f in enumerate([1568, 2093, 2637, 3136, 3951]):
        st = k * .05; y += np.sin(2 * np.pi * f * t + 2 * np.sin(2 * np.pi * 5 * t)) * np.exp(-np.maximum(0, t - st) * 3) * (t > st)
    sw = sweep_noise(d, 3000, 9000, 6000) * np.exp(-t * 3) * .25; return (y * .06 + sw * .5) * np.minimum(1, t / .02)
def S_msg():
    d = .35; t = t_(d); a = np.sin(2 * np.pi * 880 * t) * np.exp(-t * 18) * (t < .12); b = np.sin(2 * np.pi * 1320 * t) * np.exp(-np.maximum(0, t - .09) * 14) * (t >= .09); return (a + b) * .25
def S_msg2():
    d = .35; t = t_(d); a = np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 18) * (t < .1); b = np.sin(2 * np.pi * 990 * t) * np.exp(-np.maximum(0, t - .08) * 14) * (t >= .08); return (a + b) * .22
def S_key():
    d = .16; n = int(SR * d); t = np.arange(n) / SR; y = np.zeros(n)
    def damped(f, tau, a, st): tt = np.maximum(0, t - st); return a * np.sin(2 * np.pi * f * tt) * np.exp(-tt / tau) * (t >= st)
    def nburst(st, lo, hi, tau, a): tt = np.maximum(0, t - st); return a * bp(rng.standard_normal(n), lo, hi) * np.exp(-tt / tau) * (t >= st)
    j = lambda: 1 + .12 * (rng.random() - .5); bo = .007 + rng.random() * .004
    y += nburst(0, 3000, 9000, .0018, .8) + nburst(bo, 700, 4000, .006, 1.0)
    for f, tau, a in [(1150, .012, .4), (1900, .009, .3), (2900, .006, .2)]: y += damped(f * j(), tau, a, bo)
    return y * (.75 + .35 * rng.random())
def S_toggle():
    d = .25; t = t_(d); y = bp(rng.standard_normal(len(t)), 2000, 8000) * np.exp(-t * 200) * .7
    tt = np.maximum(0, t - .035); y += (lp(rng.standard_normal(len(t)), 1500) * np.exp(-tt * 70) * .8 + np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 35) * .6) * (t >= .035)
    return y
def S_drop():
    d = .45; t = t_(d); f = 1800 * np.exp(-t * 9) + 300; wh = np.sin(2 * np.pi * np.cumsum(f) / SR) * .12 * np.exp(-t * 4) * (t < .24)
    tt = np.maximum(0, t - .2); thud = (np.sin(2 * np.pi * np.cumsum(140 * np.exp(-tt * 20) + 70) / SR) * np.exp(-tt * 18) * .9 + lp(rng.standard_normal(len(t)), 1200) * np.exp(-tt * 40) * .4) * (t >= .2)
    return wh + thud
def S_flap():
    d = .4; t = t_(d); x = bp(rng.standard_normal(len(t)), 300, 3500); am = .55 + .45 * np.sin(2 * np.pi * 26 * t)
    e = np.where(t < .05, t / .05, np.exp(-(t - .05) * 9)); return x * am * e * .7 + S_hit(.35)[:len(t)] * (t > .0)
def S_switch():
    d = .9; t = t_(d); c = bp(rng.standard_normal(len(t)), 1800, 7000) * np.exp(-t * 220) * .8
    hum = (np.sin(2 * np.pi * 120 * t) + .3 * np.sin(2 * np.pi * 240 * t)) * .05 * np.exp(-t * 3) * np.minimum(1, t / .05)
    return c + hum
def S_flat():
    d = 1.0; t = t_(d); e = np.minimum(1, t / .02) * np.minimum(1, (d - t) / .2); return np.sin(2 * np.pi * 988 * t) * e * .22
def S_click():
    d = .08; t = t_(d); return bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 160) * .6 + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 90) * .3
def S_chime():
    d = 1.8; t = t_(d); return (np.sin(2 * np.pi * 1046.5 * t) + .6 * np.sin(2 * np.pi * 1568 * t) + .3 * np.sin(2 * np.pi * 2093 * t)) * np.exp(-t * 2.4) * .2 * np.minimum(1, t / .005)
def S_print():
    d = 1.45; t = t_(d); x = bp(rng.standard_normal(len(t)), 1500, 7000)
    am = .55 + .45 * np.sign(np.sin(2 * np.pi * 38 * t)) * .5 + .25 * np.sin(2 * np.pi * 9 * t)
    mot = np.sin(2 * np.pi * 220 * t + 2 * np.sin(2 * np.pi * 38 * t)) * .15
    e = np.minimum(1, t / .03) * np.minimum(1, (d - t) / .06)
    return (x * am * .5 + mot) * e
def S_prints():
    d = .36; t = t_(d); x = bp(rng.standard_normal(len(t)), 1500, 7000); am = .6 + .4 * np.sign(np.sin(2 * np.pi * 38 * t))
    e = np.minimum(1, t / .02) * np.minimum(1, (d - t) / .05); return (x * am * .5 + np.sin(2 * np.pi * 240 * t) * .12) * e
def S_flip():
    d = .1; t = t_(d); return bp(rng.standard_normal(len(t)), 1200, 8000) * np.exp(-t * 60) * .7 * np.minimum(1, t / .006)
def S_thud():
    d = .7; t = t_(d); body = np.sin(2 * np.pi * np.cumsum(110 * np.exp(-t * 14) + 48) / SR) * np.exp(-t * 9)
    box = bp(rng.standard_normal(len(t)), 200, 1400) * np.exp(-t * 26) * .7
    return body + box
def S_tape():
    d = .32; t = t_(d); x = bp(rng.standard_normal(len(t)), 900, 9000); cr = (rng.random(len(t)) < .03) * rng.standard_normal(len(t)) * 2
    am = (t / d) ** .5 * np.minimum(1, (d - t) / .03); return (x * .6 + hp(cr, 2000) * .5) * am
def S_scribble():
    d = .22; t = t_(d); x = bp(rng.standard_normal(len(t)), 2000, 6000) * (.6 + .4 * np.sin(2 * np.pi * 30 * t)); return x * np.sin(np.pi * t / d) * .6
def S_notif():
    d = .7; t = t_(d); a = np.sin(2 * np.pi * 1318.5 * t) * np.exp(-t * 14) * (t < .2); b = np.sin(2 * np.pi * 1760 * t) * np.exp(-np.maximum(0, t - .12) * 9) * (t >= .12); return (a + b) * .22
GEN = {'whoosh': S_whoosh, 'swish': S_swish, 'swell': S_swell, 'zoom': S_zoom, 'hit': lambda: S_hit(1), 'impact': S_impact, 'boom': S_boom,
       'tick': S_tick, 'pop': S_pop, 'ding': S_ding, 'stamp': S_stamp, 'shine': S_shine, 'shimmer': S_shimmer, 'msg': S_msg, 'msg2': S_msg2,
       'key': S_key, 'toggle': S_toggle, 'drop': S_drop, 'flap': S_flap, 'switch': S_switch, 'flat': S_flat, 'click': S_click, 'chime': S_chime, 'print': S_print, 'prints': S_prints, 'flip': S_flip, 'thud': S_thud, 'tape': S_tape, 'scribble': S_scribble, 'notif': S_notif}

# ---------------- reverb (synthetic plate) ----------------
def ir(d=1.4, damp=3.2):
    t = t_(d); n = rng.standard_normal((len(t), 2)) * np.exp(-t * damp)[:, None]
    n[:, 0] = lp(n[:, 0], 6500); n[:, 1] = lp(n[:, 1], 6500); return n / np.sqrt((n ** 2).sum(0))
IR = ir()
def verb(x, wet):  # mono -> stereo
    y = np.stack([fftconvolve(x, IR[:, 0])[:len(x)], fftconvolve(x, IR[:, 1])[:len(x)]], 1)
    return np.stack([x, x], 1) * (1 - wet * .3) + y * wet

# ---------------- MUSIC ----------------
# Part A (0–13.94): tense, minor, "counting" groove (clock-like 16th ticks, staccato bass, muted kick).
# 13.94–14.42: hit + air. Part B (14.42–27.3): bright major groove (the New Way solution).
# Part C (27.3–30.5): suspense breakdown ("quanto você economiza?"). Part B again 30.56–35.9, final chord.
BPM = 112; beat = 60 / BPM; bar = 4 * beat
def saw(f, t, det=0.0): ph = (f * 2 ** (det / 1200) * t) % 1.0; return 2 * ph - 1
CHA = [([57, 60, 64, 67], 45), ([57, 60, 64, 67], 45), ([53, 57, 60, 64], 41), ([52, 56, 59, 62], 40)]  # Am7 Am7 Fmaj7 E7
CHB = [([53, 57, 60, 64, 67], 41), ([48, 52, 55, 59, 62], 48), ([55, 59, 62, 64, 69], 43), ([57, 60, 64, 67, 71], 45)]  # Fmaj9 Cmaj9 G6/9 Am9
A0, B0, B1 = 0.0, 14.42, 30.56
mono = {k: np.zeros(N) for k in ('kick', 'hat', 'clap', 'shk', 'bass', 'stab', 'arp', 'tick')}
pad = np.zeros((N, 2))
K = (lambda t: np.sin(2 * np.pi * np.cumsum(115 * np.exp(-t * 28) + 46) / SR) * np.exp(-t * 7.5) + lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 120) * .25)(t_(.45))
HH = lambda: hp(rng.standard_normal(int(.05 * SR)), 7500) * np.exp(-t_(.05) * 75)
OH = lambda: hp(rng.standard_normal(int(.18 * SR)), 7000) * np.exp(-t_(.18) * 22)
def CLP():
    t = t_(.25); y = np.zeros(len(t))
    for o in (0, .011, .022): tt = np.maximum(0, t - o); y += bp(rng.standard_normal(len(t)), 900, 3500) * np.exp(-tt * 55) * (t >= o)
    return y + bp(rng.standard_normal(len(t)), 900, 3000) * np.exp(-t * 12) * .25
def padbar(s, notes, d, cut):
    t = t_(d); env = np.minimum(1, t / .4) * np.minimum(1, np.maximum(0, d - t) / .5)
    for ch, det in ((0, -7), (1, 7)):
        y = np.zeros(len(t))
        for m in notes[:4]: y += saw(note(m), t, det) + .5 * np.sin(2 * np.pi * note(m) * t)
        y = lp(y, cut) * env; i = int(s * SR); j = min(N, i + len(y))
        if j > i: pad[i:j, ch] += y[:j - i]
# Part A
nA = int(13.94 / beat)
for b_ in range(nA):
    s = A0 + b_ * beat; notes, root = CHA[(b_ // 4) % 4]
    if b_ % 4 == 0: padbar(s, notes, bar + .4, 700)
    for q in range(4): add(mono['tick'], S_clock(q % 2 == 0), s + q * beat / 4, .5 if q == 0 else .3)
    if b_ >= 4:  # kick enters after the first bar ("Um site profissional")
        if b_ % 2 == 0: add(mono['kick'], K, s, .7)
        t = t_(.16); f = note(root - 12)
        for q in (0, .5, .75) if b_ % 2 else (.5,):
            add(mono['bass'], (np.sin(2 * np.pi * f * t) + .3 * np.tanh(3 * np.sin(2 * np.pi * f * t))) * np.minimum(1, t / .004) * np.exp(-t * 14), s + q * beat)
    if b_ >= 8 and b_ % 4 == 2: add(mono['clap'], CLP(), s, .5)
# pluck motif in A: rising "counting" figure on each "você paga" bar
for b_ in range(0, nA, 2):
    s = A0 + b_ * beat; notes, _ = CHA[(b_ // 4) % 4]
    for j, m in enumerate([notes[0] + 12, notes[2] + 12, notes[1] + 24]):
        t = t_(.3); y = (np.sin(2 * np.pi * note(m) * t) + .25 * saw(note(m), t)) * np.exp(-t * 12) * np.minimum(1, t / .003)
        add(mono['arp'], lp(y, 3500), s + beat / 2 + j * beat / 4, .55)
# Part B (two runs)
def partB(start, end):
    nb = int((end - start) / beat)
    for b_ in range(nb):
        s = start + b_ * beat; notes, root = CHB[(b_ // 4) % 4]
        if b_ % 4 == 0: padbar(s, notes, bar + .5, 1300)
        add(mono['kick'], K, s)
        add(mono['hat'], OH() if b_ % 2 else HH(), s + beat / 2, .7 if b_ % 2 else .5)
        if b_ % 4 in (1, 3): add(mono['clap'], CLP(), s)
        for q in (1, 3): add(mono['shk'], HH(), s + q * beat / 4, .25)
        for q, oc in ((.5, 0), (.75, 12)) if b_ % 2 else ((.5, 0),):
            t = t_(.22); f = note(root + oc - 12)
            add(mono['bass'], (np.sin(2 * np.pi * f * t) + .25 * np.tanh(3 * np.sin(2 * np.pi * f * t))) * np.minimum(1, t / .005) * np.exp(-t * 6), s + q * beat)
        if b_ % 2 == 1 or b_ % 4 == 0:
            t = t_(.32); y = np.zeros(len(t))
            for m in notes[1:]: y += saw(note(m + 12), t, 5) + saw(note(m + 12), t, -5)
            add(mono['stab'], lp(y, 2600) * np.exp(-t * 11) * np.minimum(1, t / .004), s + beat / 2, .55 if b_ % 4 == 0 else .8)
partB(B0, 27.3); partB(B1, 35.9)
# Part C: suspense (pad filtered + ticking + soft pulse)
for k in range(int((30.56 - 27.3) / bar) + 1):
    padbar(27.3 + k * bar, CHB[3][0], bar + .4, 600)
for q in range(int((30.5 - 27.3) / (beat / 2))):
    s = 27.3 + q * beat / 2; add(mono['tick'], S_clock(q % 2 == 0), s, .45)
    if q % 2 == 0: t = t_(.3); add(mono['bass'], np.sin(2 * np.pi * note(33) * t) * np.exp(-t * 8) * np.minimum(1, t / .005), s, .7)
# final chord
t = t_(1.4); y = np.zeros(len(t))
for m in [53, 57, 60, 64, 67]: y += saw(note(m), t, 6) + saw(note(m), t, -6)
add(mono['stab'], lp(y, 2000) * np.exp(-t * 2.4) * np.minimum(1, t / .004), 35.9, .9); add(mono['kick'], K, 35.9)
tt = np.arange(N) / SR
pump = np.ones(N)
for st, en in ((B0, 27.3), (B1, 35.9)):
    for s in np.arange(st, en, beat):
        i = int(s * SR); j = min(N, i + int(beat * SR)); x = np.arange(j - i) / SR; pump[i:j] = np.minimum(pump[i:j], 1 - .5 * np.exp(-x * 9))
m_ = mono
mus_m = m_['stab'] * pump * .30 + m_['bass'] * .55 + m_['kick'] * .6 + m_['hat'] * .16 + m_['clap'] * .22 + m_['shk'] * .10 + m_['arp'] * .26 + m_['tick'] * .22
mus = np.stack([mus_m, mus_m], 1) + pad * pump[:, None] * .045
wet = mus_m * .3 + m_['arp'] * .5
mus = mus + np.stack([fftconvolve(wet, IR[:, 0])[:N], fftconvolve(wet, IR[:, 1])[:N]], 1) * .12
# riser into the "New Way" drop + short air gap after "mais."
rise = np.zeros(N); d = 1.6; t = t_(d); add(rise, sweep_noise(d, 300, 6000, 9000) * (t / d) ** 2.5 * .45, 12.34)
g = np.ones(N); i, j = int(13.94 * SR), int(14.42 * SR); g[i:j] = np.linspace(.35, .1, j - i)
mus *= g[:, None]; mus[:, 0] += rise * g; mus[:, 1] += rise * g
mus[:int(.5 * SR)] *= np.linspace(0, 1, int(.5 * SR))[:, None]
fo = int(35.9 * SR); mus[fo:] *= (np.linspace(1, 0, N - fo) ** 1.5)[:, None]

# ---------------- voice ----------------
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'voice.mp3', '-ac', '1', '-ar', str(SR), 'voice44.wav'], check=True)
v, _ = sf.read('voice44.wav'); v = np.pad(v, (0, max(0, N - len(v))))[:N]
# gentle voice polish: HPF 80 Hz + light presence lift
v = hp(v, 80) + bp(v, 2500, 6000) * .12
venv = np.sqrt(np.maximum(lp(v ** 2, 8), 0)); venv /= venv.max()
duck = 1 - .5 * np.clip(venv * 6, 0, 1)
duck = lp(duck, 4)  # smooth
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12)
vr = rms(v[np.abs(v) > .01])
# music level: ~17 dB under voice before ducking
mr = rms(mus[int(14.5 * SR):int(27 * SR)].mean(1))
mus = mus / mr * vr * 10 ** (-14.5 / 20) * duck[:, None]

# ---------------- SFX bus ----------------
fx = np.zeros(N)
for e in json.load(open('sfx.json')):
    s = GEN[e['type']](); add(fx, s / (np.abs(s).max() + 1e-9), e['t'], e['g'])
fxs = verb(fx, .22)
fxs = fxs / (np.abs(fxs).max() + 1e-9) * np.abs(v).max() * .42  # SFX peaks ~ -7.5 dB under the voice peak
fxs *= (1 - .25 * np.clip(venv * 6, 0, 1))[:, None]  # small duck so SFX never fight the words

out = np.stack([v, v], 1) + mus + fxs
db = lambda x: 20 * np.log10(rms(x))
print('voice', round(db(v), 1), 'music', round(db(mus.mean(1)), 1), 'sfx', round(db(fxs.mean(1)), 1))
out = out / np.abs(out).max() * .9
sf.write('mix_raw.wav', out, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9', '-ar', str(SR), 'final.wav'], check=True)
print('ok')
