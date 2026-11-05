# Audio for the WhatsApp explainer: original music bed + subtle SFX + voice, ducked and loudness-normalised.
# Usage: python3 mix.py   (needs voice.mp3, sfx.json written by render.js) -> final.wav
import json, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100; DUR = 127.2; N = int(SR * DUR)
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

# ---------------- MUSIC: calm lo-fi bed, 84 bpm ----------------
BPM = 84; beat = 60 / BPM; bar = 4 * beat
def saw(f, t, det=0.0): ph = (f * 2 ** (det / 1200) * t) % 1.0; return 2 * ph - 1
PROG = [([53, 57, 60, 64, 67], 41), ([52, 55, 59, 62], 40), ([50, 53, 57, 60, 64], 38), ([48, 52, 55, 59, 62], 36)]  # Fmaj9 Em7 Dm9 Cmaj9
mono = {k: np.zeros(N) for k in ('kick', 'snr', 'hat', 'bass', 'keys')}
keysS = np.zeros((N, 2))
def rhodes(m, d):
    t = t_(d); f = note(m)
    y = np.sin(2 * np.pi * f * t + .8 * np.sin(2 * np.pi * f * t) * np.exp(-t * 3)) + .25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 2)
    return y * np.exp(-t * 1.1) * np.minimum(1, t / .006) * (1 + .12 * np.sin(2 * np.pi * 4.5 * t))
K = (lambda t: np.sin(2 * np.pi * np.cumsum(95 * np.exp(-t * 26) + 44) / SR) * np.exp(-t * 8))(t_(.4))
def SN():
    t = t_(.3); return lp(bp(rng.standard_normal(len(t)), 700, 5000) * np.exp(-t * 22), 4500) * .8 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .3
HH = lambda: lp(hp(rng.standard_normal(int(.06 * SR)), 6000) * np.exp(-t_(.06) * 60), 9000)
DRUMS = [(8.3, 94.3), (97.0, 125.6)]
dr = lambda s: any(a <= s < b for a, b in DRUMS)
nb = int(DUR / beat) + 1
for b_ in range(nb):
    s = .05 + b_ * beat
    if s > 125.6: break
    notes, root = PROG[(b_ // 4) % 4]
    if b_ % 4 == 0:
        for j, m in enumerate(notes):
            y = rhodes(m, bar + .8); i = int((s + j * .018) * SR); jj = min(N, i + len(y))
            pan = (j / max(1, len(notes) - 1)) * .6 + .2
            keysS[i:jj, 0] += y[:jj - i] * (1 - pan); keysS[i:jj, 1] += y[:jj - i] * pan
    if b_ % 4 == 2 and dr(s):  # little answer phrase
        for j, m in enumerate([notes[2] + 12, notes[3] + 12]): add(mono['keys'], rhodes(m, .8) * .5, s + beat * .5 + j * beat * .5)
    if dr(s):
        if b_ % 4 in (0, 2) or (b_ % 8 == 7): add(mono['kick'], K, s + (beat * .5 if b_ % 8 == 7 else 0))
        if b_ % 2 == 1: add(mono['snr'], SN(), s + .012)
        for q in range(2): add(mono['hat'], HH(), s + q * beat / 2 + (.02 if q else 0), .55 if q else .35)
        t = t_(beat * 1.6); f = note(root - 12)
        if b_ % 4 in (0, 2): add(mono['bass'], np.sin(2 * np.pi * f * t) * np.minimum(1, t / .01) * np.exp(-t * 1.6), s)
# final chord
for j, m in enumerate([53, 57, 60, 64, 67, 72]): add(mono['keys'], rhodes(m, 2.5) * .8, 125.62 + j * .02)
crackle = (rng.random(N) < .0006) * rng.standard_normal(N) * .5
crackle = hp(crackle, 1500) + lp(rng.standard_normal(N), 900) * .015
mus_m = lp(mono['keys'], 5000) * .5 + mono['bass'] * .5 + mono['kick'] * .5 + mono['snr'] * .22 + mono['hat'] * .12 + crackle * .25
mus = np.stack([mus_m, mus_m], 1) + lp(keysS[:, 0], 5000)[:, None] * np.array([[.55, 0]]) + lp(keysS[:, 1], 5000)[:, None] * np.array([[0, .55]])
mus = mus + np.stack([fftconvolve(mus_m * .4, IR[:, 0])[:N], fftconvolve(mus_m * .4, IR[:, 1])[:N]], 1) * .14
mus[:int(1.0 * SR)] *= np.linspace(0, 1, int(1.0 * SR))[:, None]
fo = int(126.0 * SR); mus[fo:] *= (np.linspace(1, 0, N - fo) ** 1.5)[:, None]

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
mr = rms(mus[int(20 * SR):int(90 * SR)].mean(1))
mus = mus / mr * vr * 10 ** (-17 / 20) * duck[:, None]

# ---------------- SFX bus ----------------
fx = np.zeros(N)
for e in json.load(open('sfx.json')):
    s = GEN[e['type']](); add(fx, s / (np.abs(s).max() + 1e-9), e['t'], e['g'])
fxs = verb(fx, .22)
fxs = fxs / (np.abs(fxs).max() + 1e-9) * np.abs(v).max() * .3  # SFX peaks ~ -7.5 dB under the voice peak
fxs *= (1 - .25 * np.clip(venv * 6, 0, 1))[:, None]  # small duck so SFX never fight the words

out = np.stack([v, v], 1) + mus + fxs
db = lambda x: 20 * np.log10(rms(x))
print('voice', round(db(v), 1), 'music', round(db(mus.mean(1)), 1), 'sfx', round(db(fxs.mean(1)), 1))
out = out / np.abs(out).max() * .9
sf.write('mix_raw.wav', out, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9', '-ar', str(SR), 'final.wav'], check=True)
print('ok')
