# "A oferta" v2 (PT-BR voice 4, ~2 min): source

Final videos:
- `../newway-oferta-v2.mp4`: 1080×1920, 124 s.
- `../newway-oferta-v2-720p.mp4`: ~15 MB, for WhatsApp.

## Mockup rules (the fix for the earlier versions)
- **Images:** the reference sites come from the Drive folder "IMAGENS DE SITES REFERENCIA", which now holds Portuguese sites: SOS Home, Alfa Vertical, J&J Holdings, KZ Vertical and Fabio Paes. The scrollbar is cropped off, so every image is exactly **1905×933**.
- **Screen size:** every site sits in a laptop or browser mockup whose screen is built from that ratio (`SITE_AR`). The site is an `<img>` sized width × width·ratio. There is no `background-size: cover` and no `object-fit`, so nothing is ever cropped.
- **Phones:** phones never show site screenshots, because there are no mobile captures. They only show native HTML UI (the chat and WhatsApp screens).
- **Automatic check:** `node render.js check` checks every site image's rendered ratio against its natural ratio and that the image fits inside its screen. It must print `ALL MOCKUPS OK`.
- **Capture timing:** frames are captured after two `requestAnimationFrame` calls. This makes sure 3D/perspective layers have painted on the first frame a scene becomes visible.

## Captions v2
- Words are grouped in punchy chunks of 1–3 words (Montserrat 800, uppercase).
- Each word flips up into place, and a yellow highlight pill **glides from word to word** with the voice.
- Key words stay yellow after the pill has moved on.
- On yellow scenes the colours invert (black pill).

## Structure
- Hook: PARA TUDO.
- "A melhor oferta" over a 3D ring of 12 EU stars for the months.
- The NewWay card flips in front of generic plan cards.
- A 1:00 counter.
- A chapter HUD at the top: Site / Atendente IA / Google.
- Yellow band wipes between chapters.
- Laptop mockups:
  - "sob medida" measure marks;
  - a services chip and a 3D "vitrine" carousel;
  - a template crossed out and wiped to a real site;
  - "empresa grande", trust badges and "1º segundo".
- Atendente:
  - a cursor clicks the chat button on the site;
  - the conversation answers the questions;
  - then a phone with "Continuar no WhatsApp", a qualified lead and a "perto de fechar" bar;
  - repeated questions, curious leads and buyers;
  - "24h".
- Google: a search, the business card with a pin, then a click through to the laptop site.
- Recap: 3 tiles, then one package, then **€249** on yellow.
- PAGAMENTO ÚNICO stamp and 1x "pronto". Mensalidade, taxa and surpresa are struck through, then "o site é seu", every weekday lit and €0/mês.
- End card: logo and "Responde aqui".

## Build
1. `node render.js sfx`
2. `python3 mix.py`
3. `node render.js check`
4. `node render.js frames A B`: split 0–3732 into 4 parallel ranges.
5. `python3 blend.py diff 3732`
6. `node render.js heavy i 4`
7. `python3 blend.py merge 3732`
8. Encode with ffmpeg.
