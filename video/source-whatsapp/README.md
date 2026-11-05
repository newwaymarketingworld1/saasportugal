# WhatsApp explainer "A oferta" (PT-BR voice 3, ~2 min): source

Final videos:
- `../newway-whatsapp-oferta.mp4`: 1080×1920, 127 s.
- `../newway-whatsapp-oferta-720p.mp4`: 720×1280, ~15 MB, ready to send on WhatsApp.

This video is sent when a lead arrives on WhatsApp, so the motion is calm: soft cross-dissolves and fewer, quieter SFX, over a lo-fi music bed. A chapter bar at the top (1 Site · 2 Atendente IA · 3 Google) fills up as the voice explains each part, which keeps the viewer watching to the end.

**Scenes:**
- PARA TUDO / presta atenção.
- "A melhor oferta" inside a ring of 12 EU stars that light up on "12 meses".
- The NewWay card shown against generic plan cards.
- A 1:00 timer and the 3-item list.
- Chapter 1: real client sites, "sob medida" measure marks, product cards ("vitrine"), a generic template crossed out and wiped into a real site, and trust badges with "1º segundo".
- Chapter 2: the site's chat widget, then a phone where the client taps the button and questions float in ("Quanto custa?", "Onde fica?"). Answers come in from the company data, then "Continuar no WhatsApp", then a qualified lead with a "perto de fechar" bar. Repeated questions are cut off, curious visitors are filtered out, only buyers remain, and the site answers 24h.
- Chapter 3: a search, the business card with a pin dropping, and a click through to the site.
- Recap: the 3 tiles become one package, then **€249** on yellow.
- PAGAMENTO ÚNICO stamp and a 1x payment marked "pronto". Mensalidade, taxa de manutenção and surpresa are each struck through.
- The site is yours: a key, every weekday lit up and €0/mês.
- +3 anos na Europa over a wall of real client sites.
- CTA: "Gostou?" with a reply bar typing "Quero começar o meu!".

**Build:**
1. `node render.js sfx`
2. `python3 mix.py`
3. `node render.js frames A B`: one sample per frame. Split into 4 parallel ranges up to 3816.
4. `python3 blend.py diff`: frames with fast motion go to heavy.txt.
5. `node render.js heavy i 4`: renders those frames with 10 samples.
6. `python3 blend.py merge`
7. Encode with ffmpeg. The 720p version uses 2-pass at 850 kbps.
