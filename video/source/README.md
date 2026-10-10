# Reels ad — source

Vídeo 1080×1920 @30fps animado em HTML/GSAP, renderizado quadro a quadro com Playwright.

1. `npm install` (gsap, fontes Inter Tight / Instrument Serif, playwright)
2. `node render.js full` → quadros em `frames/` + `sfx.json` (marcações de efeitos sonoros)
3. `python3 mix.py` → `mix.wav` (narração + efeitos + trilha sintetizada, com ducking)
4. `ffmpeg -framerate 30 -i frames/f%05d.jpg -i mix.wav -c:v libx264 -crf 19 -maxrate 7M -bufsize 14M -pix_fmt yuv420p -c:a aac -b:a 256k -af loudnorm=I=-14:TP=-1 -shortest out.mp4`

Prévia de um instante: `node render.js stills 12.5 30`. Os tempos de cada cena seguem `phrases.json` (transcrição da narração).
