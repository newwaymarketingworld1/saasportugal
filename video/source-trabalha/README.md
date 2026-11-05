# Reels "Site que trabalha" (motion, PT-BR voiceover): source

Final video: `../newway-reels-site-que-trabalha.mp4` (1080×1920, 30 fps, 31.2 s, −14 LUFS).

**Script (voice `voice.mp3`):** "O mercado europeu te vende um site parado. Bonito, mas parado. Você precisa de um site que trabalha. Ele aparece no Google pelo seu Meu Negócio. Mostra seus produtos como uma vitrine profissional e atende cada cliente na hora, com um atendente inteligente dentro dele. Quer um site que trabalha? Clica no botão aí embaixo. Enquanto o site dos outros só existe, o seu atrai, convence e conversa. É isso que a New Way entrega. Clica no botão e fala com a gente!"

**Storyboard:**
| Time | Voice | Visual |
|---|---|---|
| 0–2.9 | mercado europeu… site parado | EU star ring → "€" flies onto a price tag hanging on a wireframe site → pause stamp |
| 2.9–4.7 | Bonito, mas parado | site wipes into a pretty version with sparkles, then cobweb, dust and "visitas hoje 0" |
| 4.8–7.1 | site que trabalha | PARADO/TRABALHANDO toggle flips → yellow flood, chart draws, notifications, counter rolls to 248 |
| 7.1–10 | Google… Meu Negócio | search typed, business profile card, stars fill, pin drops, "1º resultado"; zoom into "Site" |
| 10–12.9 | vitrine profissional | site becomes a shop window: striped awning drops, products pop, spotlights flicker on, glass shine, PRO seal |
| 12.9–17.4 | atende… atendente inteligente | phone chat answering in real time, "0,8 s" and "IA · 24/7" badges |
| 17.4–20.6 | Quer um site que trabalha? Clica… | kinetic type (Unbounded) + arrow down to the platform button |
| 20.6–23.2 | os outros só existem | grey site + ECG that flatlines on "existe" |
| 23.2–26.4 | o seu atrai, convence e conversa | yellow: cursors fly in / check + 5 stars / chat bubble, verbs stack with focus dimming |
| 26.4–28.3 | É isso que a New Way entrega | 3D wall of real client sites (Drive) → NEWWAY logo build |
| 28.3–31.2 | Clica no botão e fala com a gente | yellow CTA: logo, "Fala com a gente" button clicked by cursor, recap chips |

**Identity:** black `#000`, white `#FFF` and yellow `#FFC400` (NewWay brand manual, Drive "IDENTIDADE VISUAL NEWWAY"). The logo paths are in `logo.js`.

**Type:** Unbounded (wide display, close to the brand's Azonix wordmark) for headlines. Captions use Instrument Sans plus Instrument Serif Italic for the highlighted word: yellow on dark, a yellow marker on light, and a white marker on yellow. Each word enters on its own timestamp with a rise and a blur.

**Word timings:** from the voice using sherpa-onnx with NeMo Parakeet TDT 0.6b v3 (token timestamps), checked by hand.

**Audio (`mix.py`):** an original 120 bpm house bed in A minor. It starts as a soft intro, then a tape-stop on "parado" leaves only clock ticks, and a riser leads into the drop when the toggle flips on "trabalha". There are drum breakdowns at the kinetic type and at the flatline. The music sits about 15 dB under the voice and ducks when the voice is speaking. There are about 60 subtle synthesized SFX on a bus with a light plate reverb. The mix is loudness-normalised to −14 LUFS, true peak −1 dB.

**Build:**

    npm i                       # fonts come from ./fonts, Playwright is preinstalled
    node render.js sfx          # writes sfx.json
    python3 mix.py              # writes final.wav
    node render.js frames 0 936 # 4 sub-frames per frame (180° shutter) -> sub/
    python3 blend.py diff       # finds fast-motion frames -> heavy.txt
    node render.js heavy 0 1    # those frames again with 16 sub-frames -> sub16/ (args: worker, workers)
    python3 blend.py merge      # averages the sub-frames (motion blur) -> frames/
    ffmpeg -framerate 30 -i frames/f%05d.jpg -i final.wav -c:v libx264 -crf 17 -preset slow \
      -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k -shortest out.mp4

You can split `render.js frames` into ranges and run them in parallel, and you can split `render.js heavy` the same way with `heavy 0 4` through `heavy 3 4`. `node render.js stills 3.3 9.5` writes preview stills.
