"""Trilha sonora original do 'Alinhavo' — 100% sintetizada (sem samples nem músicas protegidas).

Sincronizada com o roteiro de 60 s (24 fps). Gera public/audio.wav (48 kHz, estéreo).
"""
import os
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl = gain * np.sqrt((1 - pan) / 2)
    gr = gain * np.sqrt((1 + pan) / 2)
    L[i : i + len(sig)] += sig * gl
    R[i : i + len(sig)] += sig * gr


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def lp_fast(x, cutoff, passes=2):
    # passa-baixa de 1 polo (2 passadas) via scipy
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = x
    for _ in range(passes):
        y = lfilter([1 - a], [1, -a], y)
    return y


def hp_fast(x, cutoff):
    return x - lp_fast(x, cutoff, passes=1)


def env(n, a, d):
    e = np.ones(n)
    na = max(1, int(a * SR))
    nd = max(1, int(d * SR))
    e[:na] = np.linspace(0, 1, na)
    if nd < n:
        e[-nd:] *= np.linspace(1, 0, nd)
    return e


def segment_env(times, values, total=N):
    x = np.arange(total) / SR
    return np.interp(x, times, values)


# ---------------- elementos ----------------
def glass_click(level=1.0):
    t = t_(0.18)
    s = (np.sin(2 * np.pi * 3100 * t) + 0.6 * np.sin(2 * np.pi * 4870 * t) + 0.4 * np.sin(2 * np.pi * 7300 * t))
    s *= np.exp(-t * 55)
    n = hp_fast(rng.standard_normal(len(t)), 2500) * np.exp(-t * 300)
    return (0.5 * s + 0.6 * n) * level


def thread_creak(dur=0.7):
    t = t_(dur)
    f = 90 + 40 * np.sin(2 * np.pi * 3 * t)
    phase = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(phase)) * 0.3 + 0.2 * rng.standard_normal(len(t))
    s = lp_fast(s, 1800)
    return s * env(len(t), 0.02, 0.25) * 0.6


def music_box_note(freq, dur=1.6, detune=0.0):
    t = t_(dur)
    f = freq * (1 + detune)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9) + 0.15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 18)
    return s * np.exp(-t * 3.2) * env(len(t), 0.002, 0.05)


def tick():
    t = t_(0.05)
    s = hp_fast(rng.standard_normal(len(t)), 1800) * np.exp(-t * 180)
    s += 0.4 * np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 120)
    return s * 0.35


def snip():
    t = t_(0.12)
    s = hp_fast(rng.standard_normal(len(t)), 3000) * (np.exp(-t * 60))
    s += 0.5 * np.sin(2 * np.pi * 5200 * t) * np.exp(-t * 90)
    return s * 0.8


def grind(dur):
    t = t_(dur)
    s = rng.standard_normal(len(t))
    s = lp_fast(s, 900) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 7 * t)))
    return s * env(len(t), 0.05, 0.2) * 1.8


def crack_snap():
    t = t_(0.9)
    s = hp_fast(rng.standard_normal(len(t)), 1200) * np.exp(-t * 35)
    for k in range(9):
        at = 0.02 + rng.random() * 0.5
        i = int(at * SR)
        tt = t_(0.03)
        s[i : i + len(tt)] += hp_fast(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 200) * (0.8 - k * 0.07)
    return s * 1.1


def felt_step():
    t = t_(0.18)
    s = lp_fast(rng.standard_normal(len(t)), 300) * np.exp(-t * 30)
    return s * 2.2


def door_creak(dur=0.9):
    t = t_(dur)
    f = 300 + 180 * np.sin(2 * np.pi * 1.1 * t) + 60 * rng.standard_normal(len(t)).cumsum() / SR
    phase = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sin(phase) * np.sin(phase * 3.01) * 0.6 + 0.15 * rng.standard_normal(len(t)))
    s = lp_fast(s, 2500)
    return s * env(len(t), 0.1, 0.3) * 0.35


def breath(dur=1.6, level=0.5):
    t = t_(dur)
    s = lp_fast(hp_fast(rng.standard_normal(len(t)), 400), 2200)
    e = np.sin(np.pi * t / dur) ** 2
    return s * e * level


def whoosh(dur=0.6):
    t = t_(dur)
    s = lp_fast(rng.standard_normal(len(t)), 900)
    return s * np.sin(np.pi * t / dur) ** 3 * 1.4


def needle_stab():
    t = t_(0.25)
    s = hp_fast(rng.standard_normal(len(t)), 2000) * np.exp(-t * 40) * 0.7
    s += np.sin(2 * np.pi * 180 * t) * np.exp(-t * 30)
    return s


def match_strike():
    t = t_(1.4)
    scratch = hp_fast(rng.standard_normal(len(t)), 1500) * np.exp(-t * 18)
    flare = lp_fast(rng.standard_normal(len(t)), 700) * np.exp(-((t - 0.15) ** 2) / 0.02) * 1.5
    crackle = np.zeros(len(t))
    for _ in range(30):
        i = int(rng.random() * len(t))
        crackle[i : i + 60] += rng.standard_normal(min(60, len(t) - i)) * 0.5 * np.exp(-i / SR * 2)
    return scratch * 0.7 + flare + crackle


def drone(start, end, base=55.0, level=0.18):
    t = np.arange(int((end - start) * SR)) / SR
    s = (np.sin(2 * np.pi * base * t) + 0.6 * np.sin(2 * np.pi * base * 1.498 * t + 1) + 0.3 * np.sin(2 * np.pi * (base * 2.003) * t))
    s *= 1 + 0.25 * np.sin(2 * np.pi * 0.17 * t)
    return s * level


# ---------------- montagem (tempos do roteiro) ----------------
# CENA 1 (0–3 s): silêncio curto, clique de vidro, rangido do fio
add(breath(0.6, 0.15), 0.0)
add(glass_click(1.2), 1.17, pan=-0.1)
add(thread_creak(0.8), 1.2)
add(glass_click(1.0), 1.83, pan=0.1)

# CENA 2–5 (3–31 s): chuva abafada contínua
rain_len = 28.5
rain = lp_fast(rng.standard_normal(int(rain_len * SR)), 1400) * 0.22
rain *= env(len(rain), 1.5, 2.0)
add(rain, 3.0, pan=-0.2)
add(lp_fast(rng.standard_normal(int(rain_len * SR)), 900) * 0.18 * env(int(rain_len * SR), 1.5, 2.0), 3.0, pan=0.2)

# relógio lento (3–16 s)
for k in range(13):
    add(tick(), 3.4 + k * 1.0, gain=0.9, pan=0.5)

# caixinha de música original (Lá menor) 3.2–16.9 s
melody = [
    (0.0, 'A5'), (0.5, 'C6'), (1.0, 'E6'), (1.5, 'D6'), (2.25, 'C6'), (2.75, 'B5'), (3.25, 'A5'),
    (4.25, 'E5'), (4.75, 'A5'), (5.25, 'B5'), (5.75, 'C6'), (6.5, 'B5'), (7.0, 'G#5'), (7.75, 'A5'),
    (8.75, 'A5'), (9.25, 'C6'), (9.75, 'E6'), (10.25, 'F6'), (11.0, 'E6'), (11.5, 'D6'), (12.25, 'C6'), (13.0, 'B5'),
]
NOTE = {'E5': 659.25, 'G#5': 830.61, 'A5': 880.0, 'B5': 987.77, 'C6': 1046.5, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91}
for off, n in melody:
    add(music_box_note(NOTE[n]), 3.2 + off, gain=0.22, pan=0.25)

# CENA 3 (10–16 s): tesoura e cabeça de porcelana girando
add(snip(), 12.5, pan=-0.3)
add(grind(1.8), 13.75, gain=0.5, pan=-0.4)

# CENA 4 (16–23 s): estalo da rachadura — a melodia some
add(crack_snap(), 17.17)

# CENA 5 (23–31 s): passos de feltro e portas
step_times = [23.0 + i * 0.42 for i in range(5)] + [25.5 + i * 0.42 for i in range(5)] + [28.0 + i * 0.42 for i in range(7)]
for st in step_times:
    add(felt_step(), st, gain=0.8, pan=0.0)
for dc, pn in ((24.9, -0.6), (27.4, 0.6), (29.9, -0.5)):
    add(door_creak(1.0), dc, pan=pn)

# grave crescendo 16–31 s e corte seco em 31 s
dr = drone(16.0, 31.0, base=46.25, level=1.0)
dr *= np.linspace(0.02, 0.28, len(dr)) * env(len(dr), 0.5, 0.05)
add(dr, 16.0)

# CENA 6 (31–39 s): silêncio, respiração, clique duplo
add(breath(2.2, 0.45), 31.6)
add(breath(2.0, 0.5), 34.6)
add(glass_click(1.3), 35.58, pan=-0.15)
add(glass_click(1.3), 37.25, pan=0.15)
hum = drone(35.6, 39.0, base=38.0, level=0.12)
hum *= env(len(hum), 1.5, 0.05)
add(hum, 35.6)

# CENA 7 (39–44 s): vela apaga + flashes
add(whoosh(0.7), 39.0)
add(whoosh(0.35), 40.4, gain=1.1, pan=-0.6)
add(needle_stab(), 41.17, gain=0.9)
add(thread_creak(0.5), 41.9, pan=0.5)
add(whoosh(0.3), 42.7, gain=1.0, pan=0.6)
add(breath(1.4, 0.9), 42.6, pan=0.1)
add(glass_click(0.9), 43.35)

# CENA 8 (44–52 s): fósforo + caixinha desafinada
add(match_strike(), 44.75)
flame = lp_fast(rng.standard_normal(int(7 * SR)), 250) * 0.12 * env(int(7 * SR), 0.3, 1.0)
add(flame, 45.0)
detuned = [(0.0, 'A5'), (0.7, 'C6'), (1.4, 'E6'), (2.1, 'D6'), (3.1, 'C6'), (3.8, 'B5'), (4.6, 'A5')]
for i, (off, n) in enumerate(detuned):
    add(music_box_note(NOTE[n], 2.0, detune=-0.03 - 0.012 * i), 46.0 + off, gain=0.2, pan=-0.2)

# CENA 9 (52–58 s): agulha se aproximando, sussurro "Sua vez."
rise = drone(52.0, 57.9, base=58.0, level=1.0)
rise *= np.linspace(0.0, 0.22, len(rise)) * env(len(rise), 0.3, 0.04)
add(rise, 52.0)
for k in range(6):
    add(needle_stab() * 0.25, 52.4 + k * 0.6, pan=0.0)

whisper_path = os.path.join(os.path.dirname(__file__), 'sua_vez.wav')
if not os.path.exists(whisper_path):
    subprocess.run(
        ['espeak-ng', '-v', 'pt-br+whisper', '-s', '95', '-p', '30', '-a', '160', '-w', whisper_path, 'Sua vez.'],
        check=True,
    )
with wave.open(whisper_path) as w:
    sr_w = w.getframerate()
    data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
idx = np.arange(0, len(data), sr_w / SR)
data = np.interp(idx, np.arange(len(data)), data)
data = data / (np.abs(data).max() + 1e-9)
# sussurro: mais ar, menos tom, com eco curto
air = hp_fast(data * (0.7 + 0.3 * rng.standard_normal(len(data))), 500)
wh = 0.6 * air + 0.4 * data
echo = np.zeros(len(wh) + int(0.18 * SR))
echo[: len(wh)] += wh
echo[int(0.18 * SR) :] += wh * 0.35
add(echo, 55.7, gain=0.9, pan=-0.05)
add(echo * 0.5, 55.72, gain=0.6, pan=0.4)

# CENA 10 (58–60 s): silêncio e clique que emenda no início
add(glass_click(0.8), 59.82)

# tom de sala geral bem baixo (exceto nos silêncios intencionais)
room = lp_fast(rng.standard_normal(N), 180) * 0.05
room *= segment_env([0, 3, 31, 31.05, 39, 39.1, 58, 58.05, 60], [0.3, 1, 1, 0.15, 0.15, 1, 1, 0, 0])
L += room
R += room

# ---------------- master ----------------
mix = np.stack([L, R], axis=1)
peak = np.abs(mix).max()
mix = mix / peak * 0.89
# compressão leve (soft clip) para levar a ~-14 LUFS aproximado
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
mix *= 0.92

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', out, f'{DUR}s')
