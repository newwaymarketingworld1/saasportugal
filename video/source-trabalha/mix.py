# Audio for "Site que trabalha": original music bed + subtle SFX + voice, ducked and loudness-normalised.
# Usage: python3 mix.py   (needs voice.mp3, sfx.json written by render.js) -> final.wav
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100; DUR = 31.2; N = int(SR * DUR)
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
GEN = {'whoosh': S_whoosh, 'swish': S_swish, 'swell': S_swell, 'zoom': S_zoom, 'hit': lambda: S_hit(1), 'impact': S_impact, 'boom': S_boom,
       'tick': S_tick, 'pop': S_pop, 'ding': S_ding, 'stamp': S_stamp, 'shine': S_shine, 'shimmer': S_shimmer, 'msg': S_msg, 'msg2': S_msg2,
       'key': S_key, 'toggle': S_toggle, 'drop': S_drop, 'flap': S_flap, 'switch': S_switch, 'flat': S_flat, 'click': S_click, 'chime': S_chime}

# ---------------- reverb (synthetic plate) ----------------
def ir(d=1.4, damp=3.2):
    t = t_(d); n = rng.standard_normal((len(t), 2)) * np.exp(-t * damp)[:, None]
    n[:, 0] = lp(n[:, 0], 6500); n[:, 1] = lp(n[:, 1], 6500); return n / np.sqrt((n ** 2).sum(0))
IR = ir()
def verb(x, wet):  # mono -> stereo
    y = np.stack([fftconvolve(x, IR[:, 0])[:len(x)], fftconvolve(x, IR[:, 1])[:len(x)]], 1)
    return np.stack([x, x], 1) * (1 - wet * .3) + y * wet

# ---------------- MUSIC (120 bpm, A minor) ----------------
BPM = 120; beat = 60 / BPM; bar = 4 * beat; T0 = 6.4  # drop / downbeat anchor
CH = [([57, 60, 64, 67, 71], 45), ([53, 57, 60, 64, 67], 41), ([48, 55, 60, 64, 74], 48), ([55, 59, 62, 64, 67], 43)]  # Am9 Fmaj9 Cadd9 G6
def chord_at(tt):
    k = int(np.floor((tt - T0) / bar)) % 4; return CH[k]
def saw(f, t, det=0.0):
    ph = (f * 2 ** (det / 1200) * t) % 1.0; return 2 * ph - 1
L = np.zeros(N); R = np.zeros(N)
pad = np.zeros((N, 2)); stab = np.zeros(N); bass = np.zeros(N); kick = np.zeros(N); hat = np.zeros(N); clap = np.zeros(N); shk = np.zeros(N); arp = np.zeros(N)

# pad: whole piece, chords per bar (anchored to T0, extended backwards for the intro)
k0 = int(np.floor((0 - T0) / bar)) - 1
for k in range(k0, 20):
    s = T0 + k * bar
    if s > DUR: break
    notes, root = CH[k % 4]
    d = bar + .6; t = t_(d); env = np.minimum(1, t / .5) * np.minimum(1, np.maximum(0, d - t) / .6)
    yl = np.zeros(len(t)); yr = np.zeros(len(t))
    for m in notes[:4]:
        yl += saw(note(m), t, -7) + .5 * np.sin(2 * np.pi * note(m) * t)
        yr += saw(note(m), t, 7) + .5 * np.sin(2 * np.pi * note(m) * t)
    yl = lp(yl, 900) * env; yr = lp(yr, 900) * env
    i = int(s * SR)
    for ch, y in ((0, yl), (1, yr)):
        a = max(0, i); b2 = min(N, i + len(y));
        if b2 > a: pad[a:b2, ch] += y[a - i:b2 - i]
# intro arpeggio (0 – 2.08), plucky, sparse
for j in range(0, 9):
    s = j * beat / 2 + .05
    notes, _ = chord_at(s)
    m = notes[[0, 2, 1, 3, 2, 4, 3, 1, 0][j]] + 12
    t = t_(.5); y = (np.sin(2 * np.pi * note(m) * t) + .3 * saw(note(m), t)) * np.exp(-t * 7) * np.minimum(1, t / .003)
    add(arp, lp(y, 3200), s, .9)
# grooves: list of (start, end) where drums & bass play
GROOVE = [(6.4, 17.4), (18.4, 22.55), (23.4, 30.4)]
K = (lambda t: np.sin(2 * np.pi * np.cumsum(115 * np.exp(-t * 28) + 46) / SR) * np.exp(-t * 7.5) + lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 120) * .25)(t_(.45))
HH = lambda: hp(rng.standard_normal(int(.05 * SR)), 7500) * np.exp(-t_(.05) * 75)
OH = lambda: hp(rng.standard_normal(int(.18 * SR)), 7000) * np.exp(-t_(.18) * 22)
def CLP():
    t = t_(.25); y = np.zeros(len(t))
    for o in (0, .011, .022): tt = np.maximum(0, t - o); y += bp(rng.standard_normal(len(t)), 900, 3500) * np.exp(-tt * 55) * (t >= o)
    return y + bp(rng.standard_normal(len(t)), 900, 3000) * np.exp(-t * 12) * .25
def in_groove(s): return any(a - 1e-6 <= s < b for a, b in GROOVE)
nb = int((DUR - T0) / beat) + 1
for b_ in range(nb):
    s = T0 + b_ * beat
    if not in_groove(s): continue
    add(kick, K, s)
    add(hat, OH() if b_ % 2 else HH(), s + beat / 2, .7 if b_ % 2 else .5)
    if b_ % 4 in (1, 3): add(clap, CLP(), s)
    for q in (1, 3): add(shk, HH(), s + q * beat / 4, .25)
    notes, root = chord_at(s + .01)
    # bass: offbeat 8ths, root / octave
    for q, oc in ((.5, 0), (.75, 12)) if b_ % 2 else ((.5, 0),):
        t = t_(.22); f = note(root + oc - 12)
        y = (np.sin(2 * np.pi * f * t) + .25 * np.tanh(3 * np.sin(2 * np.pi * f * t))) * np.minimum(1, t / .005) * np.exp(-t * 6)
        add(bass, y, s + q * beat)
    # chord stabs on the "and" of 2 and 4 + a ghost on 1-and
    if b_ % 2 == 1 or b_ % 4 == 0:
        t = t_(.32); y = np.zeros(len(t))
        for m in notes[1:]: y += saw(note(m + 12), t, 5) + saw(note(m + 12), t, -5)
        y = lp(y, 2400) * np.exp(-t * 11) * np.minimum(1, t / .004)
        add(stab, y, s + beat / 2, .55 if b_ % 4 == 0 else .8)
# final chord ring-out at 30.4
t = t_(1.2); y = np.zeros(len(t))
for m in [57, 60, 64, 67, 71]: y += saw(note(m), t, 6) + saw(note(m), t, -6)
add(stab, lp(y, 2000) * np.exp(-t * 2.6) * np.minimum(1, t / .004), 30.4, .8)
add(kick, K, 30.4)

tt = np.arange(N) / SR
# sidechain pump on pad/stab from kick grid
pump = np.ones(N)
for b_ in range(nb):
    s = T0 + b_ * beat
    if in_groove(s):
        i = int(s * SR); j = min(N, i + int(beat * SR)); x = np.arange(j - i) / SR; pump[i:j] = np.minimum(pump[i:j], 1 - .55 * np.exp(-x * 9))
padm = pad * pump[:, None]
mus_m = stab * pump * .30 + bass * .55 + kick * .62 + hat * .16 + clap * .22 + shk * .10 + arp * .32
mus = np.stack([mus_m, mus_m], 1) + padm * .045
# a touch of reverb on the music
mus = mus + np.stack([fftconvolve(mus_m * .3 + arp * .5, IR[:, 0])[:N], fftconvolve(mus_m * .3 + arp * .5, IR[:, 1])[:N]], 1) * .12
# section envelopes: intro filtered, tape-stop at 2.08, silence (clock), riser into the drop at 6.4
gate = np.ones(N)
gate *= np.where(tt < 2.08, np.clip(tt / .4, 0, 1), 1)
# tape stop: time-warp the 2.08–2.5 slice
i0 = int(2.08 * SR); ts = int(.42 * SR)
pos = np.cumsum(np.linspace(1, 0, ts) ** 1.3); pos = i0 + pos
for ch in range(2):
    seg = np.interp(pos, np.arange(N), mus[:, ch]) * np.linspace(1, 0, ts) ** .6
    mus[i0:i0 + ts, ch] = seg
mus[i0 + ts:int(6.4 * SR)] = 0
# breakdowns: keep pad+bass only (already no drums), softer
for a, b2, g in ((17.4, 18.4, .6), (22.55, 23.4, .35)):
    i, j = int(a * SR), int(b2 * SR); mus[i:j] *= g
mus[int(30.4 * SR):] *= np.linspace(1, 0, N - int(30.4 * SR))[:, None] ** 1.5 * 1.0
# clock ticks in the "parado" silence + riser into the drop
clock = np.zeros(N)
for k, s in enumerate(np.arange(2.5, 6.3, .5)): add(clock, S_clock(k % 2 == 0), s, .5)
rise = np.zeros(N); d = 1.0; t = t_(d); add(rise, sweep_noise(d, 300, 6000, 9000) * (t / d) ** 2.5 * .5 + np.sin(2 * np.pi * np.cumsum(120 + 600 * (t / d) ** 2) / SR) * (t / d) ** 3 * .1, 5.4)
mus[:, 0] += clock * .5 + rise; mus[:, 1] += clock * .5 + rise

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
mr = rms(mus[int(6.4 * SR):int(30 * SR)].mean(1))
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
